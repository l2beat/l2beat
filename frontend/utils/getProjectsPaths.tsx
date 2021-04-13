import { l2Data } from '../data'

export function getProjectsPaths() {
  const projects = Object.keys(l2Data.l2s).map((slug) => slug.toLowerCase())

  return {
    paths: projects.map((project) => {
      return {
        params: {
          project,
        },
      }
    }),
    fallback: false,
  }
}
