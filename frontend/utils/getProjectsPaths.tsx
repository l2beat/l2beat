import { l2Data } from '../data'

export const getProjectsNames = () => Object.keys(l2Data.l2s).map((slug) => slug.toLowerCase())
export function getProjectsPaths() {
  const projects = getProjectsNames()

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
