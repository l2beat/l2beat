export function getYouTubeVideoId(url: string): string | undefined {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1]
}

// hqdefault exists for every video, maxresdefault only for some
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: 'hqdefault' | 'maxresdefault' = 'hqdefault',
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}
