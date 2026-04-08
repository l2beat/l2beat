import type { ViteDevServer } from 'vite'
import type { ServerRenderFunction } from '../ssr/types'

const SERVER_ENTRY_PATH = '/src/ssr/ServerEntry.tsx'

export function createDevRender(
  vite: Pick<ViteDevServer, 'ssrLoadModule'>,
): ServerRenderFunction {
  return async (data, url) => {
    const mod = (await vite.ssrLoadModule(SERVER_ENTRY_PATH)) as {
      render: ServerRenderFunction
    }

    return mod.render(data, url)
  }
}
