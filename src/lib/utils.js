const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  url &&
  key &&
  !url.includes('placeholder') &&
  url.startsWith('http')
);

export const formatInr = (value) =>
  Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const generateOrderNumber = (prefix = 'PAV') => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${stamp}-${rand}`;
};

export const normalizeProduct = (product) => {
  if (!product) return product;
  const variants = product.variants || product.product_variants || [];
  return {
    ...product,
    variants,
    has_variants: Boolean(product.has_variants) || variants.length > 0,
    images: Array.isArray(product.images) ? product.images : [],
    price: Number(product.price),
    compare_price: product.compare_price != null ? Number(product.compare_price) : null,
    stock: Number(product.stock || 0),
  };
};
