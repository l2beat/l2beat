import { expect } from 'earl'
import type { ServerRenderFunction } from '../ssr/types'
import { createDevRender } from './createDevRender'

describe(createDevRender.name, () => {
  it('loads the current SSR entry on every render', async () => {
    const loadCalls: string[] = []
    const renderCalls: Array<{
      stylesheetUrl: string
      url: string
      version: number
    }> = []
    let version = 0

    const render = createDevRender({
      ssrLoadModule: async (path) => {
        loadCalls.push(path)
        version += 1

        return {
          render: ((_, url, options) => {
            renderCalls.push({
              version,
              url,
              stylesheetUrl: options.stylesheetUrl,
            })

            return {
              html: `<div>${version}</div>`,
              head: `<title>${url}</title>`,
            }
          }) satisfies ServerRenderFunction,
        }
      },
    })

    const first = await render(
      { ssr: {} as never, head: {} as never },
      '/first',
      { stylesheetUrl: '/styles-a.css' },
    )
    const second = await render(
      { ssr: {} as never, head: {} as never },
      '/second',
      { stylesheetUrl: '/styles-b.css' },
    )

    expect(loadCalls).toEqual([
      '/src/ssr/ServerEntry.tsx',
      '/src/ssr/ServerEntry.tsx',
    ])
    expect(renderCalls).toEqual([
      {
        version: 1,
        url: '/first',
        stylesheetUrl: '/styles-a.css',
      },
      {
        version: 2,
        url: '/second',
        stylesheetUrl: '/styles-b.css',
      },
    ])
    expect(first).toEqual({
      html: '<div>1</div>',
      head: '<title>/first</title>',
    })
    expect(second).toEqual({
      html: '<div>2</div>',
      head: '<title>/second</title>',
    })
  })
})
