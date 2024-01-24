import { z } from 'zod'

import { makeQuery } from '../query'
import { setQueryParams } from '../utils/setQueryParams'

type State = 'asc' | 'desc' | null

interface UrlState {
  queryParams?: {
    name: string
    state: State
  }
  hash: string
}
interface SortingArrowsElement {
  node: HTMLElement
  name: string
  getState: () => State
  setState: (state: State) => void
  getOrderKey: () => string | null
  setOrderKey: (orderKey: string | null) => void
  toggleState: (tabId?: string) => State
  reorderTable: (state?: NonNullable<State>) => void
}

const SortingRule = z.enum(['numeric', 'alphabetical'])
type SortingRule = z.infer<typeof SortingRule>

const tabState: Record<string, UrlState['queryParams']> = {}

export function configureSorting() {
  const { $$ } = makeQuery(document.body)
  const urlState = getUrlState()

  const sortingArrowsElements = $$('[data-role="sorting-arrows"]')

  sortingArrowsElements.forEach((sortingArrows) =>
    configureSortingArrows(sortingArrows, urlState),
  )
}

function configureSortingArrows(
  sortingArrows: HTMLElement,
  urlState: UrlState,
) {
  const table = sortingArrows.closest<HTMLElement>('[data-role="table"]')

  if (!table) {
    return
  }
  const { $$ } = makeQuery(table)
  const sortingArrowsElement = getSortingArrowsElement(sortingArrows, table)
  const otherSortingArrows = $$(
    `[data-role="sorting-arrows"]:not([data-name="${sortingArrowsElement.name}"])`,
  ).map((v) => getSortingArrowsElement(v, table))

  const { queryParams, hash } = urlState
  const parentElement = table.parentElement
  const isInsideTabs = parentElement?.classList.contains('TabsContent')

  if (
    sortingArrowsElement.name === queryParams?.name &&
    parentElement?.id === hash
  ) {
    sortingArrowsElement.setState(queryParams.state)
    sortingArrowsElement.reorderTable()
    tabState[parentElement.id] = queryParams
    otherSortingArrows.forEach((sortingArrows) => sortingArrows.setState(null))
  }

  sortingArrowsElement.node.addEventListener('click', () => {
    const currentState = sortingArrowsElement.toggleState(parentElement?.id)
    otherSortingArrows.forEach((sortingArrows) => sortingArrows.setState(null))
    if (isInsideTabs && parentElement) {
      tabState[parentElement.id] = {
        name: sortingArrowsElement.name,
        state: currentState,
      }
    }
  })
}

function getSortingArrowsElement(
  element: HTMLElement,
  table: HTMLElement,
): SortingArrowsElement {
  const { $, $$ } = makeQuery(table)
  const name = element.getAttribute('data-name')
  if (!name) {
    throw new Error('No name or order found')
  }

  const ruleAttribute = element.getAttribute('data-rule')
  const rule = SortingRule.parse(ruleAttribute)

  const headerColumns = $$('thead tr:last-of-type th')
  const soringArrowsHeader = element.closest('th')
  if (!soringArrowsHeader) {
    throw new Error('No header found')
  }

  const headerIndex = headerColumns.indexOf(soringArrowsHeader)
  const getState = () => element.getAttribute('data-state') as State

  const setState = (state: State) => {
    if (!state) {
      element.removeAttribute('data-state')
      return
    }
    element.setAttribute('data-state', state)
  }

  const setSortingQueryParams = (state: State, tabId: string | undefined) => {
    const searchParams = new URLSearchParams(window.location.search)

    if (state) {
      searchParams.set('sort-by', name)
      searchParams.set('sort-order', state)
    } else {
      searchParams.delete('sort-by')
      searchParams.delete('sort-order')
    }

    setQueryParams(searchParams, tabId)
  }

  const getOrderKey = () => element.getAttribute('data-order-key')

  const setOrderKey = (orderKey: string | null) => {
    if (!orderKey) {
      element.removeAttribute('data-order-key')
      return
    }
    element.setAttribute('data-order-key', orderKey)
  }

  const getNextState = (currentState: State) => {
    if (currentState === 'desc') {
      return 'asc'
    }
    return 'desc'
  }

  const toggleState = (tabId?: string) => {
    const currentState = getState()
    const nextState = getNextState(currentState)
    setState(nextState)
    setSortingQueryParams(nextState, tabId)
    reorderTable(nextState)
    return nextState
  }

  const reorderTable = (state?: NonNullable<State>) => {
    const currentState = state ?? getState()
    if (!currentState) {
      return
    }
    const rows = $$('tbody tr')
    const rowWithCellToOrder = rows.map((row) => {
      const cellToOrder = row.children.item(headerIndex)
      const orderKey = getOrderKey()
      const orderValue = orderKey
        ? cellToOrder?.getAttribute(`data-order-value-${orderKey}`)
        : cellToOrder?.getAttribute('data-order-value')

      return {
        row,
        orderValue,
      }
    })

    const sortedRows = rowWithCellToOrder.sort((a, b) => {
      if (!a.orderValue) {
        return 1
      }

      if (!b.orderValue) {
        return -1
      }

      if (rule === 'numeric') {
        const orderValueA = isNaN(Number(a.orderValue))
          ? parseFloat(a.orderValue)
          : Number(a.orderValue)
        const orderValueB = isNaN(Number(b.orderValue))
          ? parseFloat(b.orderValue)
          : Number(b.orderValue)
        return currentState === 'desc'
          ? orderValueB - orderValueA
          : orderValueA - orderValueB
      }

      return currentState === 'desc'
        ? b.orderValue.localeCompare(a.orderValue)
        : a.orderValue.localeCompare(b.orderValue)
    })

    const sortedRowsElements = sortedRows.map((row) => row.row)
    const tableBody = $('tbody')
    tableBody.replaceChildren(...sortedRowsElements)
  }
  return {
    node: element,
    name,
    getState,
    setState,
    getOrderKey,
    setOrderKey,
    toggleState,
    reorderTable,
  }
}

export function setSortingArrowsOrderKey(name: string, orderKey: string) {
  const { $$ } = makeQuery(document.body)
  const tables = $$('[data-role="table"]')
  tables.forEach((table) => {
    const { $ } = makeQuery(table)
    const sortingArrowsElement = $(
      '[data-role="sorting-arrows"][data-name="' + name + '"]',
    )
    const sortingArrows = getSortingArrowsElement(sortingArrowsElement, table)
    sortingArrows.setOrderKey(orderKey)

    sortingArrows.reorderTable()
  })
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
