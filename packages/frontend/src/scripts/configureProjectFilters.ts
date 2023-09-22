import { makeQuery } from './query'

const states = new Map<string, string[]>()

export function configureProjectFilters() {
  const { $ } = makeQuery(document.body)
  const projectFilters = $.maybe('#project-filters')
  const allProjectSlugs = projectFilters?.dataset.slugs
    ?.split(',')
    .filter((i) => i.length > 0)

  if (!projectFilters || !allProjectSlugs) {
    return
  }

  const checkboxes = projectFilters.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"]',
  )
  const selects = projectFilters.querySelectorAll<HTMLSelectElement>('.Select')

  checkboxes.forEach((checkbox) =>
    configureCheckbox(checkbox, checkbox.id, allProjectSlugs),
  )
  selects.forEach((select) =>
    configureSelect(select, select.id, allProjectSlugs),
  )
}

function configureCheckbox(
  filter: HTMLInputElement,
  stateId: string,
  allProjectSlugs: Readonly<string[]>,
) {
  const slugs = filter.dataset.slugs?.split(',').filter((i) => i.length > 0)

  if (!slugs) {
    throw new Error(`No slugs for ${stateId}`)
  }

  filter.addEventListener('change', () => {
    if (filter.checked) {
      states.set(stateId, slugs)
    } else {
      states.delete(stateId)
    }
    rerenderState(allProjectSlugs)
  })
}

function configureSelect(
  select: HTMLSelectElement,
  stateId: string,
  allProjectSlugs: Readonly<string[]>,
) {
  select.addEventListener('change', () => {
    const selectedValue = select.value
    if (selectedValue) {
      const slugs = select.value.split(',')
      states.set(stateId, slugs)
    } else {
      states.delete(stateId)
    }
    rerenderState(allProjectSlugs)
  })
}

function rerenderState(allProjectSlugs: Readonly<string[]>) {
  const stateObj = Object.fromEntries(states)
  const slugsUnion = Object.values(stateObj).reduce<string[]>(
    (acc, curr) => {
      return acc.filter((i) => curr.includes(i))
    },
    [...allProjectSlugs],
  )

  manageRowVisibility(slugsUnion)
  rerenderIndexes()
}

export function manageRowVisibility(slugs: string[]) {
  const { $$ } = makeQuery(document.body)
  const rows = $$('[data-role="row"]')
  rows.forEach((row) => {
    const slug = row.dataset.slug
    if (!slug) {
      throw new Error('no slug')
    }

    if (slugs.includes(slug)) {
      row.classList.remove('hidden')
    } else {
      row.classList.add('hidden')
    }
  })
}

function rerenderIndexes() {
  const tablesToRerenderIndexes =
    document.querySelectorAll(`[data-role="table"]`)

  tablesToRerenderIndexes.forEach((table) => {
    const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(
      (r) => !r.classList.contains('hidden'),
    )

    visibleRows.forEach((r, index) => {
      const indexCell = r.querySelector('[data-role="index-cell"]')
      if (!indexCell) {
        console.error('Programming error: no index cell found', r)
        return
      }
      indexCell.innerHTML = `${index + 1}`
    })
    console.debug('triggered renderNumbers() |', {
      visibleRowsLength: visibleRows.length,
    })
  })
}
