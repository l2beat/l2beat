import type { TemplateService } from '@l2beat/discovery'

export function listDirectories(templateService: TemplateService) {
  const directories = templateService.listAllTemplates()

  const paths = Object.keys(directories).map((path) => path)

  return paths
}
