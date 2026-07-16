export function getYouTubeVideoId(url: string): string | undefined {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }
  if (parsed.hostname === 'youtu.be') {
    return parsed.pathname.slice(1) || undefined
  }
  if (parsed.hostname.endsWith('youtube.com') && parsed.pathname === '/watch') {
    return parsed.searchParams.get('v') ?? undefined
  }
  return undefined
}

// hqdefault exists for every video, maxresdefault only for some
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: 'hqdefault' | 'maxresdefault',
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}
