import type { Breadcrumb } from '~/ssr/head/structured-data/getBreadcrumbList'

/** One source for the visible header crumbs and the page's BreadcrumbList. */
export function getTvsBreakdownBreadcrumbs(project: {
  name: string
  slug: string
}): { project: Breadcrumb; pageName: string } {
  return {
    project: { name: project.name, path: `/layer2s/projects/${project.slug}` },
    pageName: 'TVS Breakdown',
  }
}
