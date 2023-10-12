import intersection from 'lodash/intersection'

import { clearRichSelect, getRichSelectValue } from './configureRichSelect'
import { rerenderTable } from './configureTables'
import { makeQuery } from './query'

const states = new Map<string, string[]>()

export function configureProjectFilters() {
  const { $, $$ } = makeQuery(document.body)
  const projectFilters = $.maybe('#project-filters')
  if (!projectFilters) {
    return
  }

  const resetButtons = $$('.ProjectFilters-ResetButton')

  const setFilteredSlugs = (slugs: string[] | null) => {
    if (!slugs) {
      delete projectFilters.dataset.filteredSlugs
    } else {
      projectFilters.dataset.filteredSlugs = slugs.join(',')
    }
  }

  const configureCheckbox = (checkbox: HTMLInputElement, stateId: string) => {
    const slugsWhenChecked = checkbox.dataset.slugsWhenChecked?.split(',')
    const slugsWhenUnchecked = checkbox.dataset.slugsWhenUnchecked?.split(',')

    if (!slugsWhenChecked && !slugsWhenUnchecked) {
      throw new Error(`No slugs for ${stateId}`)
    }

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        if (slugsWhenChecked) {
          states.set(stateId, slugsWhenChecked)
        }
        if (slugsWhenUnchecked) {
          states.delete(stateId)
        }
      } else {
        if (slugsWhenChecked) {
          states.delete(stateId)
        }
        if (slugsWhenUnchecked) {
          states.set(stateId, slugsWhenUnchecked)
        }
      }
      rerenderState()
    })
  }

  const configureRichSelect = (richSelect: HTMLElement, stateId: string) => {
    richSelect.addEventListener('change', () => {
      const selectedValue = getRichSelectValue(richSelect)
      if (selectedValue) {
        const slugs = selectedValue.split(',')
        states.set(stateId, slugs)
      } else {
        states.delete(stateId)
      }
      rerenderState()
      projectFilters.dispatchEvent(new Event('change'))
    })
  }

  const checkboxes = projectFilters.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"]',
  )
  const selects = projectFilters.querySelectorAll<HTMLElement>('.RichSelect')

  const rerenderState = () => {
    const stateValues = Array.from(states.values())
    if (stateValues.length === 0) {
      setFilteredSlugs(null)
      rerenderTables()
      return
    }
    const slugsToShow = intersection(...stateValues)

    rerenderTables(slugsToShow)
    setFilteredSlugs(slugsToShow)
  }

  const onResetButtonClick = () => {
    states.clear()
    rerenderState()
    projectFilters.dispatchEvent(new Event('change'))
    checkboxes.forEach((checkbox) => (checkbox.checked = false))
    selects.forEach((select) => clearRichSelect(select))
  }

  resetButtons.forEach((button) =>
    button.addEventListener('click', onResetButtonClick),
  )

  checkboxes.forEach((checkbox) => configureCheckbox(checkbox, checkbox.id))
  selects.forEach((select) => configureRichSelect(select, select.id))
}

function rerenderTables(slugsToShow?: string[]) {
  const tablesToRerender =
    document.querySelectorAll<HTMLElement>(`[data-role="table"]`)

  tablesToRerender.forEach((table) => rerenderTable(table, slugsToShow))
}

export function getFilteredSlugs(projectFilters: HTMLElement) {
  if (projectFilters.dataset.filteredSlugs === '') {
    return []
  }
  return projectFilters.dataset.filteredSlugs?.split(',')
}
