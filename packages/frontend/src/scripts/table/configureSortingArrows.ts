import { makeQuery } from '../query'
import { setQueryParams } from '../utils/setQueryParams'

type State = 'asc' | 'desc' | null

interface SortingArrowsElement {
  node: HTMLElement
  order: string[]
  name: string
  state: State
  setState: (state: State) => void
  toggleState: () => State
}

const tabState: Record<string, UrlState['queryParams']> = {}

export function configureSortingArrows() {
  const { $$ } = makeQuery(document.body)
  const tables = $$('[data-role="table"]')
  const urlState = getUrlState()

  tables.forEach((table) => {
    const { $$ } = makeQuery(table)
    const sortingArrowsElements = $$('[data-role="sorting-arrows"]')
    const defaultOrder = $$('tr[data-slug]').map((row) => {
      const slug = row.getAttribute('data-slug')
      if (!slug) {
        throw new Error('No slug found')
      }

      return slug
    })
    sortingArrowsElements.forEach((sortingArrowsElement) => {
      const sortingArrows = getSortingArrowsElement(sortingArrowsElement)
      configureSortingArrowsElement(
        table,
        sortingArrows,
        defaultOrder,
        urlState,
      )
    })
  })

  return
}

function configureSortingArrowsElement(
  table: HTMLElement,
  sortingArrows: SortingArrowsElement,
  defaultOrder: string[],
  urlState: UrlState,
) {
  const { $$ } = makeQuery(table)
  const otherSortingArrows = $$(
    '[data-role="sorting-arrows"]:not([data-name="' +
      sortingArrows.name +
      '"])',
  ).map((element) => getSortingArrowsElement(element))
  const { queryParams, hash } = urlState
  const parentElement = table.parentElement
  const isInsideTabs = parentElement?.classList.contains('TabsContent')
  if (sortingArrows.name === queryParams?.name && parentElement?.id === hash) {
    orderRows(table, sortingArrows.order, queryParams.state, defaultOrder)
    sortingArrows.setState(queryParams.state)
    tabState[parentElement.id] = queryParams
  }

  sortingArrows.node.addEventListener('click', () => {
    const currentState = sortingArrows.toggleState()
    orderRows(table, sortingArrows.order, currentState, defaultOrder)
    otherSortingArrows.forEach((sortingArrow) => sortingArrow.setState(null))
    if (isInsideTabs && parentElement) {
      tabState[parentElement.id] = {
        name: sortingArrows.name,
        state: currentState,
      }
    }
  })
}

function getSortingArrowsElement(element: HTMLElement): SortingArrowsElement {
  const name = element.getAttribute('data-name')
  const order = element.getAttribute('data-order')
  const state = element.getAttribute('data-state')

  if (!name || !order) {
    throw new Error('No name or order found')
  }
  const setState = (state: State) => {
    if (!state) {
      element.removeAttribute('data-state')
      return
    }
    element.setAttribute('data-state', state)
  }

  const getNextState = (currentState: State): State => {
    if (currentState === 'desc') {
      return null
    }

    if (currentState === 'asc') {
      return 'desc'
    }

    return 'asc'
  }

  const toggleState = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const name = element.getAttribute('data-name')
    const currentState = element.getAttribute('data-state') as State
    if (!name) {
      throw new Error('No name found')
    }
    const nextState = getNextState(currentState)

    if (nextState) {
      searchParams.set('sort-by', name)
      searchParams.set('sort-order', nextState)
    } else {
      searchParams.delete('sort-by')
      searchParams.delete('sort-order')
    }

    setQueryParams(searchParams)
    setState(nextState)
    return nextState
  }

  return {
    node: element,
    name,
    order: order.split(','),
    state: state as State,
    setState,
    toggleState,
  }
}

function orderRows(
  table: HTMLElement,
  order: string[],
  state: State,
  defaultOrder: string[],
) {
  const { $, $$ } = makeQuery(table)

  const rows = $$('tbody tr[data-slug]')
  const sortedOrder =
    state === 'asc'
      ? order
      : state === 'desc'
      ? [...order].reverse()
      : defaultOrder

  const sortedRows = sortedOrder
    .map((slug) => {
      const row = rows.find((r) => r.getAttribute('data-slug') === slug)
      if (!row) {
        return undefined
      }
      return row
    })
    .filter(Boolean) as HTMLElement[]

  const tableBody = $('tbody')
  tableBody.replaceChildren(...sortedRows)
}

interface UrlState {
  queryParams?: {
    name: string
    state: State
  }
  hash: string
}

function getUrlState(): UrlState {
  const searchParams = new URLSearchParams(window.location.search)
  const sortBy = searchParams.get('sort-by')
  const sortOrder = searchParams.get('sort-order')
  const queryParams =
    sortBy && sortOrder
      ? { name: sortBy, state: sortOrder as State }
      : undefined
  return {
    queryParams,
    hash: window.location.hash.slice(1),
  }
}

export function setSortingQueryParamsByTabId(tabId: string) {
  const searchParams = new URLSearchParams(window.location.search)
  const queryParams = tabState[tabId]
  if (!queryParams || queryParams.state === null) {
    searchParams.delete('sort-by')
    searchParams.delete('sort-order')
  } else {
    searchParams.set('sort-by', queryParams.name)
    searchParams.set('sort-order', queryParams.state)
  }

  setQueryParams(searchParams)
}
