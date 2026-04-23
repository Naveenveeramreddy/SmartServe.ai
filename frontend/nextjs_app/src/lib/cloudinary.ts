/**
 * Generates an optimized Cloudinary URL for a remote image using the Fetch API.
 * This delivers the image via Cloudinary's CDN with automatic format (WebP/AVIF)
 * and quality optimization.
 * 
 * @param src The original image source URL (e.g., Unsplash)
 * @param width Optional width for resizing
 * @returns Optimized Cloudinary URL
 */
export const getOptimizedUrl = (src: string, width?: number): string => {
  if (!src || src.startsWith('data:') || src.includes('res.cloudinary.com')) {
    return src;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  
  // Optimization parameters:
  // f_auto: automatic format selection (WebP, AVIF, etc.)
  // q_auto: automatic quality level selection
  const params = ['f_auto', 'q_auto'];
  
  if (width) {
    params.push(`w_${width}`);
    params.push('c_limit'); // Limit to width without upscaling
  }

  // Use the 'fetch' delivery type to optimize existing remote URLs
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${params.join(',')}/${encodeURIComponent(src)}`;
};
