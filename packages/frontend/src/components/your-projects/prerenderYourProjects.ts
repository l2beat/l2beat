/**
 * Draws the nav's "Pinned" and "Recently viewed" lists from localStorage,
 * using the row templates NavYourProjects renders on the server. It runs as
 * an inline script, through `toString()`, so it must not reference anything
 * outside its own body.
 */
export function prerenderYourProjects(
  root: HTMLElement,
  storageKey: string,
  recentRows: number,
) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return
    const stored = JSON.parse(raw)
    const toProjects = (
      value: unknown,
    ): { href: string; name: string; iconUrl: string }[] =>
      (Array.isArray(value) ? value : []).filter(
        (item) =>
          typeof item?.href === 'string' &&
          typeof item.name === 'string' &&
          typeof item.iconUrl === 'string',
      )
    const pinned = toProjects(stored?.pinned)
    const pinnedHrefs = pinned.map((project) => project.href)
    const lists: Record<string, typeof pinned> = {
      pinned,
      recent: toProjects(stored?.recent)
        .filter((project) => !pinnedHrefs.includes(project.href))
        .slice(0, recentRows),
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
      if (pinned.length > 0) group.querySelector('p')?.remove()
      root.append(group)
    }
  } catch {
    // React draws the lists once it hydrates; they just won't be there early.
  }
}
