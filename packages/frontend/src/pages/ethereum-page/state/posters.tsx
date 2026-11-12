import { createContext, type ReactNode, use, useMemo } from 'react'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { UNKNOWN_POSTER_ID } from '../live/simulatedHead'

export interface PosterInfo {
  id: string
  name: string
  color: string
  iconUrl: string | undefined
  href: string | undefined
}

/** Blobs no tracked project claims, drawn in a neutral grey so they read as "other" */
const UNKNOWN: PosterInfo = {
  id: UNKNOWN_POSTER_ID,
  name: 'Unattributed',
  color: 'var(--secondary)',
  iconUrl: undefined,
  href: undefined,
}

const PostersContext = createContext<Map<string, PosterInfo>>(new Map())

export function PostersProvider({
  posters,
  children,
}: {
  posters: BlobPoster[]
  children: ReactNode
}) {
  const map = useMemo(
    () =>
      new Map<string, PosterInfo>([
        ...posters.map((p) => [p.id, p] as const),
        [UNKNOWN_POSTER_ID, UNKNOWN],
      ]),
    [posters],
  )
  return <PostersContext value={map}>{children}</PostersContext>
}

export function usePosters() {
  return use(PostersContext)
}

export function posterOf(map: Map<string, PosterInfo>, id: string) {
  return map.get(id) ?? UNKNOWN
}
