import { manifest } from '~/utils/Manifest'

export type WithProjectIcon<T extends { slug: string }> = T & {
  iconUrl: string
}

export function withProjectIcon<
  T extends {
    slug: string
  },
>(project: T): T & { iconUrl: string } {
  return {
    ...project,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
  }
}
