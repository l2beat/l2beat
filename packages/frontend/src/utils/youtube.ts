import type { ImageParams } from '~/utils/project/getImageParams'

export function getYouTubeVideoId(url: string): string | undefined {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1]
}

// hqdefault exists for every video and has a fixed size
export function getYouTubeThumbnail(videoId: string): ImageParams {
  return {
    src: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    width: 480,
    height: 360,
  }
}
