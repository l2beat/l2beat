import type { LivePoster } from '../model'

/**
 * Every poster's icon cut to a circle at the size a tile shows it, by poster
 * index. Cut once, not clipped again for every tile on every frame.
 */
export function roundIcons(
  posters: LivePoster[],
  images: Map<string, HTMLImageElement>,
  size: number,
): (HTMLCanvasElement | undefined)[] {
  if (size <= 0) return []
  // as prepareCanvas: past 2 the eye cannot tell
  const density = Math.min(window.devicePixelRatio || 1, 2)
  const pixels = Math.round(size * density)
  return posters.map((poster) => {
    const image = poster.iconUrl ? images.get(poster.iconUrl) : undefined
    return image && cutRound(image, pixels)
  })
}

// icons load one by one, and each load asks for all of them again
const cut = new WeakMap<HTMLImageElement, HTMLCanvasElement>()

function cutRound(image: HTMLImageElement, pixels: number) {
  const cached = cut.get(image)
  if (cached?.width === pixels) return cached
  const canvas = document.createElement('canvas')
  canvas.width = pixels
  canvas.height = pixels
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  ctx.imageSmoothingQuality = 'high'
  ctx.beginPath()
  ctx.arc(pixels / 2, pixels / 2, pixels / 2, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(image, 0, 0, pixels, pixels)
  cut.set(image, canvas)
  return canvas
}
