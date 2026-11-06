/**
 * Draws the nav's "Pinned" and "Recently viewed" lists from localStorage,
 * using the row templates NavPinnedProjects renders on the server. It runs as
 * an inline script, through `toString()`, so it must not reference anything
 * outside its own body.
 */
export function prerenderPinnedProjects(
  root: HTMLElement,
  storageKey: string,
  recentRows: number,
) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return
    const stored = JSON.parse(raw)
    type Project = {
      href: string
      name: string
      iconUrl: string
      otherHrefs?: unknown
    }
    const toProjects = (value: unknown): Project[] =>
      (Array.isArray(value) ? value : []).filter(
        (item) =>
          typeof item?.href === 'string' &&
          typeof item.name === 'string' &&
          typeof item.iconUrl === 'string',
      )
    // Mirrors isSameProject and unpinnedRecent in pinnedProjectsStore.
    const hrefsOf = (project: Project) => [
      project.href,
      ...(Array.isArray(project.otherHrefs) ? project.otherHrefs : []),
    ]
    const isSame = (a: Project, b: Project) =>
      hrefsOf(a).includes(b.href) || hrefsOf(b).includes(a.href)
    const pinned = toProjects(stored?.pinned)
    const recent: Project[] = []
    for (const project of toProjects(stored?.recent)) {
      if (![...pinned, ...recent].some((p) => isSame(p, project))) {
        recent.push(project)
      }
    }
    const lists: Record<string, Project[]> = {
      pinned,
      recent: recent.slice(0, recentRows),
    }

    for (const template of root.querySelectorAll('template')) {
      const projects = lists[template.dataset.list ?? '']
      const group = template.content.firstElementChild?.cloneNode(true) as
        | Element
        | undefined
      const list = group?.querySelector('ul')
      const placeholder = list?.firstElementChild
      if (!projects?.length || !group || !list || !placeholder) continue

      placeholder.remove()
      for (const project of projects) {
        const row = placeholder.cloneNode(true) as Element
        const link = row.querySelector('a')
        link?.setAttribute('href', project.href)
        link?.setAttribute(
          'data-active',
          String(project.href === window.location.pathname),
        )
        row.querySelector('img')?.setAttribute('src', project.iconUrl)
        const name = row.querySelector('span')
        if (name) name.textContent = project.name
        // The template's label is "Pin " or "Unpin ", for an empty name.
        const button = row.querySelector('button')
        button?.setAttribute(
          'aria-label',
          `${button.getAttribute('aria-label') ?? ''}${project.name}`,
        )
        list.append(row)
      }
      // The pinning hint stays gone after a first pin, even once all are unpinned.
      if (pinned.length > 0 || stored?.hasPinned === true) {
        group.querySelector('p')?.remove()
      }
      root.append(group)
    }
  } catch {
    // React draws the lists once it hydrates; they just won't be there early.
  }
}
