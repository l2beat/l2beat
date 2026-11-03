import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'playwright/test'

/**
 * Ratchet for the Radix poppers (tooltips, popovers) a table page mounts
 * while it loads, before anyone points at anything. The ceiling only moves
 * down.
 *
 * Tables put a tooltip in most cells, and hardly any is ever opened. Each
 * Radix tooltip hydrates a tree of its own: the 150–360 on these pages were
 * over a third of the components in the hydration commit, and a fifth to a
 * third of its time. So a tooltip mounts Radix only when first used
 * (components/core/tooltip/radixOnFirstUse.tsx), and this counts the
 * `Popper`s mounted, which is the same on every machine. The hydration
 * commit's size and time are logged, not asserted (see ../README.md).
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')

type Measurement = { poppers: number }
type Ceilings = Record<string, Measurement>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

declare global {
  interface Window {
    __mounts: {
      poppers: number
      hydrationComponents: number
      hydrationMs: number
    }
  }
}

for (const path of Object.keys(ceilings)) {
  test(`${path} mounts no more Radix poppers than its ceiling`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
    })
    await context.addInitScript(countMountsFromReactDevToolsHook)
    const page = await context.newPage()
    const response = await page.goto(path, { waitUntil: 'networkidle' })
    // An error page mounts few poppers and would pass any ceiling
    expect(response?.ok(), `status of ${path}`).toBe(true)
    const { poppers, hydrationComponents, hydrationMs } = await page.evaluate(
      () => window.__mounts,
    )
    await context.close()

    measured[path] = { poppers }
    console.log(
      path,
      JSON.stringify({ poppers, hydrationComponents, hydrationMs }),
    )

    if (process.env.UPDATE_CEILINGS) return
    const ceiling = ceilings[path]
    expect(ceiling).toBeDefined()
    expect(poppers, `Radix poppers on ${path}`).toBeLessThanOrEqual(
      ceiling!.poppers,
    )
  })
}

test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [path, result] of Object.entries(measured)) {
    next[path] = {
      poppers: Math.min(
        ceilings[path]?.poppers ?? Number.POSITIVE_INFINITY,
        result.poppers,
      ),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

/**
 * React reports every commit to the DevTools hook, also in production. This
 * stands in for DevTools and walks the fibers each commit mounted. Radix
 * names its functions at runtime, so `Popper` survives minification.
 */
function countMountsFromReactDevToolsHook() {
  const mounts = { poppers: 0, hydrationComponents: 0, hydrationMs: 0 }
  window.__mounts = mounts
  // Function, forwardRef, memo and simple memo components
  const COMPONENT_TAGS = new Set([0, 11, 14, 15])
  type Fiber = {
    tag: number
    type: { name?: string } | null
    alternate: Fiber | null
    child: Fiber | null
    sibling: Fiber | null
  }
  let commits = 0
  let firstTaskStart = Number.NaN
  // Mounted fibers have no alternate; an updated parent may hold new ones
  const countMounted = (first: Fiber | null) => {
    let components = 0
    for (let fiber = first; fiber; fiber = fiber.sibling) {
      if (!fiber.alternate) {
        if (COMPONENT_TAGS.has(fiber.tag)) components++
        if (fiber.type?.name === 'Popper') mounts.poppers++
      }
      if (!fiber.alternate || fiber.child !== fiber.alternate.child) {
        components += countMounted(fiber.child)
      }
    }
    return components
  }
  // React's scheduler starts the hydration in a MessageChannel task
  const port = Object.getOwnPropertyDescriptor(
    MessagePort.prototype,
    'onmessage',
  )
  Object.defineProperty(MessagePort.prototype, 'onmessage', {
    configurable: true,
    get() {
      return port?.get?.call(this)
    },
    set(handler: ((event: MessageEvent) => void) | null) {
      port?.set?.call(
        this,
        handler &&
          function (this: MessagePort, event: MessageEvent) {
            if (commits === 0) firstTaskStart = performance.now()
            handler.call(this, event)
          },
      )
    },
  })
  Object.assign(window, {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: {
      supportsFiber: true,
      isDisabled: false,
      renderers: new Map(),
      inject: () => 1,
      checkDCE: () => {},
      onCommitFiberRoot: (_: unknown, root: { current: Fiber }) => {
        const components = countMounted(root.current.child)
        if (commits++ > 0) return
        mounts.hydrationComponents = components
        mounts.hydrationMs = Math.round(performance.now() - firstTaskStart)
      },
      onCommitFiberUnmount: () => {},
      onPostCommitFiberRoot: () => {},
      onScheduleFiberRoot: () => {},
    },
  })
}
