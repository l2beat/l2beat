import type { CompiledReview, IndexData } from '../types'

export async function getIndex(): Promise<IndexData> {
  const res = await fetch('/data/index.json')
  if (!res.ok) {
    throw new Error(`Failed to load index: ${res.status}`)
  }
  return res.json()
}

export async function getReview(slug: string): Promise<CompiledReview> {
  const res = await fetch(`/data/${slug}/compiled-review.json`)
  if (!res.ok) {
    throw new Error(`Failed to load review for ${slug}: ${res.status}`)
  }
  return res.json()
}

export async function getAllReviews(): Promise<CompiledReview[]> {
  const index = await getIndex()
  const reviews = await Promise.all(
    index.protocols.map((p) => getReview(p.slug)),
  )
  return reviews
}
