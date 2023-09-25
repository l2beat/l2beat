import { isEmpty } from 'lodash'

import { makeQuery } from './query'

const states = new Map<string, string[]>()

export function configureProjectFilters() {
  const { $ } = makeQuery(document.body)
  const projectFilters = $.maybe('#project-filters')
  const allProjectSlugs = projectFilters?.dataset.allSlugs
    ?.split(',')
    .filter((i) => i.length > 0)

  if (!projectFilters || !allProjectSlugs) {
    return
  }

  const configureCheckbox = (filter: HTMLInputElement, stateId: string) => {
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
      rerenderState()
    })
  }

  const configureSelect = (select: HTMLSelectElement, stateId: string) => {
    select.addEventListener('change', () => {
      const selectedValue = select.value
      if (selectedValue) {
        const slugs = select.value.split(',')
        states.set(stateId, slugs)
      } else {
        states.delete(stateId)
      }
      rerenderState()
    })
  }

  const checkboxes = projectFilters.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"]',
  )
  const selects = projectFilters.querySelectorAll<HTMLSelectElement>('.Select')

  const rerenderProjectFilters = (slugs: string[]) => {
    const selectOptions = Array.from(selects).flatMap((select) =>
      Array.from(select.querySelectorAll('option')),
    )

    checkboxes.forEach((checkbox) => {
      const checkboxSlugs = checkbox.dataset.slugs?.split(',')
      const slugsUnion = checkboxSlugs?.filter((i) => slugs.includes(i))

      if (isEmpty(slugsUnion)) {
        checkbox.disabled = true
      } else {
        checkbox.disabled = false
      }
    })

    selectOptions.forEach((option) => {
      const optionSlugs = option.value.split(',')
      const slugsUnion = optionSlugs.filter((i) => slugs.includes(i))

      if (isEmpty(slugsUnion)) {
        option.disabled = true
      } else {
        option.disabled = false
      }
    })
  }

  const rerenderState = () => {
    const stateObj = Object.fromEntries(states)
    const slugsToShow = Object.values(stateObj).reduce<string[]>(
      (acc, curr) => {
        return acc.filter((i) => curr.includes(i))
      },
      [...allProjectSlugs],
    )
    console.log(slugsToShow)
    rerenderProjectFilters(slugsToShow)
    manageRowVisibility(slugsToShow)
    rerenderIndexes()
  }

  checkboxes.forEach((checkbox) => configureCheckbox(checkbox, checkbox.id))
  selects.forEach((select) => configureSelect(select, select.id))
}

export function manageRowVisibility(slugs: string[]) {
  const { $$ } = makeQuery(document.body)
  const rows = $$('[data-role="row"]')
  rows.forEach((row) => {
    const slug = row.dataset.slug
    if (!slug) {
      throw new Error('No slug found')
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
