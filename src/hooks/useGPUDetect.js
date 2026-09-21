import { useState, useEffect } from 'react';

/**
 * Detects WebGL/GPU capability and returns whether the device
 * can handle 3D rendering without lag.
 *
 * Returns:
 *   canRender3D  — true if WebGL is usable for a scene
 *   gpuTier      — 'high' | 'mid' | 'low' | 'none'
 *   isMobile     — true if mobile/tablet or narrow viewport
 */
export function useGPUDetect() {
  const [result, setResult] = useState({
    canRender3D: false,
    gpuTier: 'low',
    isMobile: false,
    checked: false,
  });

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setResult({ canRender3D: false, gpuTier: 'low', isMobile, checked: true });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
        || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })
        || canvas.getContext('webgl2')
        || canvas.getContext('webgl');

      if (!gl) {
        setResult({ canRender3D: false, gpuTier: 'none', isMobile, checked: true });
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '')
        : 'unknown';

      const lowEndGPUs = [
        'Mali-4', 'Mali-T6', 'Mali-T7', 'Adreno 3', 'Adreno 4',
        'PowerVR SGX', 'Intel HD Graphics 4', 'Intel HD Graphics 5',
        'SwiftShader', 'llvmpipe', 'Software', 'Microsoft Basic',
      ];

      const isLowEnd = lowEndGPUs.some((gpu) =>
        renderer.toLowerCase().includes(gpu.toLowerCase())
      );

      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
      const hasWebGL2 = !!canvas.getContext('webgl2');
      const cores = navigator.hardwareConcurrency || 4;
      const memory = navigator.deviceMemory || (isMobile ? 4 : 8);

      let gpuTier = 'mid';
      if (isLowEnd || maxTextureSize < 4096 || memory <= 2) {
        gpuTier = 'low';
      } else if (
        hasWebGL2 &&
        maxTextureSize >= 8192 &&
        cores >= 6 &&
        memory >= 4 &&
        !isMobile
      ) {
        gpuTier = 'high';
      } else if (isMobile && (isLowEnd || cores <= 4 || memory <= 3)) {
        gpuTier = 'low';
      }

      // Mobile mid gets a lightweight scene; low/none fall back to 2D
      const canRender3D =
        gpuTier === 'high' || gpuTier === 'mid';

      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();

      setResult({ canRender3D, gpuTier, isMobile, checked: true });
    } catch {
      setResult({ canRender3D: false, gpuTier: 'none', isMobile, checked: true });
    }
  }, []);

  return result;
}
