import { useEffect, useState } from 'react'

/** Keyed by URL; an icon is left out until it has loaded */
export function useImages(urls: (string | undefined)[]) {
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(
    () => new Map(),
  )
  const key = urls.filter(Boolean).join('|')
  useEffect(() => {
    let cancelled = false
    for (const url of key.split('|').filter(Boolean)) {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        if (cancelled) return
        setImages((current) => new Map(current).set(url, image))
      }
      image.src = url
    }
    return () => {
      cancelled = true
    }
  }, [key])
  return images
}
