export const UrlState = makeUrlState()

function makeUrlState() {
  try {
    // URLSearchParams is only supported in modern browsers
    return makeRealUrlState()
  } catch {
    return {
      onInit() {},
      get() {},
      set() {},
    }
  }
}

function makeRealUrlState() {
  let search = new URLSearchParams(location.search)
  const listeners: (() => void)[] = []
  window.addEventListener('popstate', () => {
    search = new URLSearchParams(location.search)
    listeners.forEach((fn) => fn())
  })

  return {
    onInit(fn: () => void) {
      fn()
      listeners.push(fn)
    },
    get(key: string): string | undefined {
      return search.get(key) ?? undefined
    },
    set(key: string, value: string | undefined) {
      if (value === undefined) {
        search.delete(key)
      } else {
        search.set(key, value)
      }

      let query = search.toString()
      if (query !== '') {
        query = '?' + query
      }
      const url = location.origin + location.pathname + query
      history.replaceState(null, '', url)
    },
  }
}
