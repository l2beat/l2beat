export const CHAIN_PROJECT_PATH = '/projects/:slug'

export function getChainProjectPath(slug: string) {
  return `/projects/${slug}`
}
