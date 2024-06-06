// NOTE(piotradamczyk): This is a workaround for the lack of
// AsyncLocalStorage in the browser (I'm looking at you, Storybook).
// The implementation is nowhere near safe, nowhere near async,
// but it's good enough for Storybook (and nothing else).
export class AsyncLocalStorage {
  #store = undefined

  run(context, fn) {
    this.#store = context
    return fn()
  }

  getStore() {
    return this.#store
  }
}
