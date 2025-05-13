import type { TemplateService } from '@l2beat/discovery'

export function listDirectories(templateService: TemplateService) {
  const directories = templateService.listAllTemplates()

  const paths = Object.keys(directories).map((path) => path)

  const pathMap = new Map<string, string[]>()

  for (const path of paths) {
    const elements = path.split('/')
    if (elements.length === 1) {
      pathMap.set(path, [])
    } else {
      const commonPath = elements.slice(0, -1).join('/')

      if (pathMap.has(commonPath)) {
        pathMap.get(commonPath)?.push(elements[elements.length - 1])
      } else {
        pathMap.set(commonPath, [elements[elements.length - 1]])
      }
    }
  }

  return Object.fromEntries(pathMap.entries())
}
