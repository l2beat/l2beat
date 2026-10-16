import type { UsedInProject } from './UsedInProject'

/** An implementation shared by a project that also shares the proxy is listed under the proxy only. */
export function splitUsedInProjects(projects: UsedInProject[]) {
  const proxies = projects.filter((p) => p.type === 'proxy')
  const proxyIds = new Set(proxies.map((p) => p.id))
  return {
    proxies,
    implementations: projects.filter(
      (p) => p.type === 'implementation' && !proxyIds.has(p.id),
    ),
    permissions: projects.filter((p) => p.type === 'permission'),
  }
}
