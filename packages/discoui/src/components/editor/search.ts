import {
  closeSearchPanel,
  findNext,
  findPrevious,
  getSearchQuery,
  replaceAll,
  replaceNext,
  SearchQuery,
  search,
  selectMatches,
  setSearchQuery,
} from '@codemirror/search'
import type { EditorState, SelectionRange } from '@codemirror/state'
import {
  EditorView,
  type Panel,
  runScopeHandlers,
  type ViewUpdate,
} from '@codemirror/view'
import {
  counterText,
  findMatches,
  firstMatchFrom,
  type Matches,
} from './searchMatches'

export const centeredSearch = search({
  top: true,
  createPanel: (view) => new FindWidget(view),
  scrollToMatch,
})

// Like Monaco, a match off screen lands in the middle of the view, not on
// its edge, and a match on screen does not move the view.
function scrollToMatch(range: SelectionRange, view: EditorView) {
  return EditorView.scrollIntoView(range, {
    y: isOnScreen(view, range) ? 'nearest' : 'center',
  })
}

function isOnScreen(view: EditorView, range: SelectionRange): boolean {
  const start = view.coordsAtPos(range.from)
  const end = view.coordsAtPos(range.to)
  if (start === null || end === null) {
    return false
  }
  const screen = view.scrollDOM.getBoundingClientRect()
  const widget = view.dom.querySelector('.cm-find')
  const top = Math.max(screen.top, widget?.getBoundingClientRect().bottom ?? 0)
  return start.top >= top && end.bottom <= screen.bottom
}

class FindWidget implements Panel {
  readonly dom: HTMLElement
  readonly top = true
  private query: SearchQuery
  private matches: Matches
  private readonly searchField = textField('Find', true)
  private readonly replaceField = textField('Replace', false)
  private readonly caseToggle = toggle('Aa', 'Match Case (Alt+C)')
  private readonly wordToggle = toggle('ab', 'Match Whole Word (Alt+W)')
  private readonly regexpToggle = toggle('.*', 'Use Regular Expression (Alt+R)')
  private readonly counter = element('div', 'cm-find-counter')
  private readonly expandButton = iconButton(CHEVRON, 'Toggle Replace')
  private readonly replaceRow: HTMLElement

  constructor(private readonly view: EditorView) {
    this.query = getSearchQuery(view.state)
    this.matches = findMatches(view.state, this.query)
    this.replaceRow = this.createReplaceRow()
    this.dom = this.createDom()
    this.showQuery(this.query)
    this.showReadOnly(view.state.readOnly)
    this.showCounter(view.state)
  }

  mount() {
    this.searchField.select()
  }

  update(update: ViewUpdate) {
    const query = getSearchQuery(update.state)
    const queryChanged = query !== getSearchQuery(update.startState)
    if (queryChanged && !query.eq(this.query)) {
      this.query = query
      this.showQuery(query)
    }
    if (queryChanged || update.docChanged) {
      this.matches = findMatches(update.state, query)
    }
    if (queryChanged || update.docChanged || update.selectionSet) {
      this.showCounter(update.state)
    }
    if (update.state.readOnly !== update.startState.readOnly) {
      this.showReadOnly(update.state.readOnly)
    }
  }

  private createDom(): HTMLElement {
    const searchBox = element('div', 'cm-find-box', [
      this.searchField,
      this.caseToggle,
      this.wordToggle,
      this.regexpToggle,
    ])
    const view = this.view
    const searchRow = element('div', 'cm-find-row', [
      searchBox,
      this.counter,
      iconButton(ARROW_UP, 'Previous Match (Shift+Enter)', () =>
        findPrevious(view),
      ),
      iconButton(ARROW_DOWN, 'Next Match (Enter)', () => findNext(view)),
      iconButton(CLOSE, 'Close (Escape)', () => closeSearchPanel(view)),
    ])
    this.expandButton.classList.add('cm-find-expand')
    this.expandButton.addEventListener('click', () => this.toggleReplace())
    const dom = element('div', 'cm-find', [
      this.expandButton,
      element('div', 'cm-find-rows', [searchRow, this.replaceRow]),
    ])
    dom.addEventListener('keydown', (event) => this.keydown(event))
    this.searchField.addEventListener('input', () => this.commit(true))
    this.replaceField.addEventListener('input', () => this.commit(false))
    for (const button of [
      this.caseToggle,
      this.wordToggle,
      this.regexpToggle,
    ]) {
      button.addEventListener('click', () => this.flip(button))
    }
    return dom
  }

  private createReplaceRow(): HTMLElement {
    const view = this.view
    const row = element('div', 'cm-find-row', [
      element('div', 'cm-find-box', [this.replaceField]),
      textButton('Replace', 'Replace (Enter)', () => replaceNext(view)),
      textButton('All', 'Replace All (Mod+Enter)', () => replaceAll(view)),
    ])
    row.hidden = true
    return row
  }

  private keydown(event: KeyboardEvent) {
    if (runScopeHandlers(this.view, event, 'search-panel')) {
      event.preventDefault()
      return
    }
    const toggled = this.toggleForKey(event)
    if (toggled !== undefined) {
      event.preventDefault()
      this.flip(toggled)
      return
    }
    if (event.key !== 'Enter') {
      return
    }
    event.preventDefault()
    if (event.target === this.replaceField) {
      ;(event.metaKey || event.ctrlKey ? replaceAll : replaceNext)(this.view)
    } else if (event.altKey) {
      selectMatches(this.view)
      this.view.focus()
    } else {
      ;(event.shiftKey ? findPrevious : findNext)(this.view)
    }
  }

  // By key code, since Alt turns the letter into another character on macOS.
  private toggleForKey(event: KeyboardEvent): HTMLButtonElement | undefined {
    if (!event.altKey) {
      return undefined
    }
    if (event.code === 'KeyC') {
      return this.caseToggle
    }
    if (event.code === 'KeyW') {
      return this.wordToggle
    }
    if (event.code === 'KeyR') {
      return this.regexpToggle
    }
    return undefined
  }

  private flip(button: HTMLButtonElement) {
    setPressed(button, !isPressed(button))
    this.commit(true)
  }

  private toggleReplace() {
    this.replaceRow.hidden = !this.replaceRow.hidden
    this.expandButton.setAttribute(
      'aria-expanded',
      `${!this.replaceRow.hidden}`,
    )
    ;(this.replaceRow.hidden ? this.searchField : this.replaceField).focus()
  }

  private commit(moveToMatch: boolean) {
    const query = new SearchQuery({
      search: this.searchField.value,
      caseSensitive: isPressed(this.caseToggle),
      wholeWord: isPressed(this.wordToggle),
      regexp: isPressed(this.regexpToggle),
      replace: this.replaceField.value,
    })
    if (query.eq(this.query)) {
      return
    }
    this.query = query
    const match = moveToMatch
      ? firstMatchFrom(
          this.view.state,
          query,
          this.view.state.selection.main.from,
        )
      : undefined
    if (match === undefined) {
      this.view.dispatch({ effects: setSearchQuery.of(query) })
      return
    }
    this.view.dispatch({
      selection: match,
      effects: [setSearchQuery.of(query), scrollToMatch(match, this.view)],
      userEvent: 'select.search',
    })
  }

  private showQuery(query: SearchQuery) {
    this.searchField.value = query.search
    this.replaceField.value = query.replace
    setPressed(this.caseToggle, query.caseSensitive)
    setPressed(this.wordToggle, query.wholeWord)
    setPressed(this.regexpToggle, query.regexp)
  }

  private showReadOnly(readOnly: boolean) {
    this.expandButton.hidden = readOnly
    if (readOnly) {
      this.replaceRow.hidden = true
    }
  }

  private showCounter(state: EditorState) {
    const text = counterText(this.query, this.matches, state.selection.main)
    this.counter.textContent = text
    const missing = this.query.search !== '' && this.matches.froms.length === 0
    this.dom.classList.toggle('cm-find-missing', missing)
  }
}

const CHEVRON = 'M6 3.5 10.5 8 6 12.5'
const ARROW_UP = 'M8 13V3.5M3.5 8 8 3.5 12.5 8'
const ARROW_DOWN = 'M8 3v9.5M3.5 8 8 12.5 12.5 8'
const CLOSE = 'M4 4l8 8M12 4l-8 8'

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  children: Node[] = [],
): HTMLElementTagNameMap[K] {
  const result = document.createElement(tag)
  result.className = className
  result.append(...children)
  return result
}

function textField(label: string, isMain: boolean): HTMLInputElement {
  const field = element('input', 'cm-find-field')
  field.placeholder = label
  field.ariaLabel = label
  field.spellcheck = false
  if (isMain) {
    field.setAttribute('main-field', 'true')
  }
  return field
}

function toggle(label: string, title: string): HTMLButtonElement {
  const button = keepFocus(element('button', 'cm-find-toggle'))
  button.type = 'button'
  button.title = title
  button.textContent = label
  setPressed(button, false)
  return button
}

function iconButton(
  path: string,
  title: string,
  onClick?: () => void,
): HTMLButtonElement {
  const button = keepFocus(element('button', 'cm-find-button', [icon(path)]))
  button.type = 'button'
  button.title = title
  button.ariaLabel = title
  if (onClick !== undefined) {
    button.addEventListener('click', onClick)
  }
  return button
}

function textButton(
  label: string,
  title: string,
  onClick: () => void,
): HTMLButtonElement {
  const button = keepFocus(element('button', 'cm-find-text-button'))
  button.type = 'button'
  button.title = title
  button.textContent = label
  button.addEventListener('click', onClick)
  return button
}

function keepFocus(button: HTMLButtonElement): HTMLButtonElement {
  button.addEventListener('mousedown', (event) => event.preventDefault())
  return button
}

function icon(path: string): SVGSVGElement {
  const namespace = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(namespace, 'svg')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('width', '16')
  svg.setAttribute('height', '16')
  svg.setAttribute('aria-hidden', 'true')
  const line = document.createElementNS(namespace, 'path')
  line.setAttribute('d', path)
  line.setAttribute('fill', 'none')
  line.setAttribute('stroke', 'currentColor')
  line.setAttribute('stroke-width', '1.2')
  line.setAttribute('stroke-linecap', 'round')
  line.setAttribute('stroke-linejoin', 'round')
  svg.append(line)
  return svg
}

function isPressed(button: HTMLButtonElement): boolean {
  return button.ariaPressed === 'true'
}

function setPressed(button: HTMLButtonElement, pressed: boolean) {
  button.ariaPressed = `${pressed}`
}
