import { supabase } from './supabase';
import { generateOrderNumber } from './utils';

export async function insertOrderWithItems(orderPayload, lineItems) {
  let { data: order, error } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (error && (error.message?.includes('channel') || error.message?.includes('payment_method'))) {
    const fallback = { ...orderPayload };
    delete fallback.channel;
    if (!['cod'].includes(fallback.payment_method)) fallback.payment_method = 'cod';
    const retry = await supabase.from('orders').insert(fallback).select().single();
    order = retry.data;
    error = retry.error;
  }

  if (error) throw error;

  if (lineItems?.length) {
    const rows = lineItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      variant_id: item.variant_id || null,
      product_name: item.product_name,
      variant_name: item.variant_name || null,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      image_url: item.image_url || null,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(rows);
    if (itemsError) console.warn('order_items insert failed', itemsError);
  }

  await decrementStock(lineItems);
  return order;
}

export async function decrementStock(lineItems = []) {
  for (const item of lineItems) {
    try {
      if (item.variant_id) {
        const { data } = await supabase
          .from('product_variants')
          .select('stock')
          .eq('id', item.variant_id)
          .single();
        if (data) {
          await supabase
            .from('product_variants')
            .update({ stock: Math.max(0, Number(data.stock) - item.quantity) })
            .eq('id', item.variant_id);
        }
      } else if (item.product_id) {
        const { data } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();
        if (data) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, Number(data.stock) - item.quantity) })
            .eq('id', item.product_id);
        }
      }
    } catch (err) {
      console.warn('stock update skipped', err);
    }
  }
}

export async function recordCouponUse(code) {
  if (!code) return;
  try {
    const { error } = await supabase.rpc('record_coupon_use', { p_code: code });
    if (error) {
      const { data } = await supabase.from('coupons').select('id, uses_count').eq('code', code).single();
      if (data) {
        await supabase.from('coupons').update({ uses_count: (data.uses_count || 0) + 1 }).eq('id', data.id);
      }
    }
  } catch {
    /* coupon tracking is best-effort */
  }
}

export { generateOrderNumber };
