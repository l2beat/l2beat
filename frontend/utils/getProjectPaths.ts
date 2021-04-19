import { getProjects } from './getProjects'

export function getProjectsPaths(extraPaths: string[] = []) {
  const projects = getProjects()

  return {
    paths: [...projects, ...extraPaths].map((project) => {
      return {
        params: {
          project,
        },
      }
    }),
    fallback: false,
  }
}
