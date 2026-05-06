// Minimal subset of Vite's Plugin / HtmlTagDescriptor types.
// We type-define them locally to avoid pulling Vite as a dependency.
// They are structurally compatible with the real Vite types
// so consumers can pass the returned plugin into vite's `plugins: []`.

interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean>
  children?: string
  injectTo?: 'head'
}

interface VitePlugin {
  name: string
  transformIndexHtml: {
    order: 'pre'
    handler: () => HtmlTagDescriptor[] | undefined
  }
}

export function openPanelPlugin(clientId: string | undefined): VitePlugin {
  return {
    name: 'l2beat:openpanel-inject',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        if (!clientId) return
        return [
          {
            tag: 'script',
            injectTo: 'head',
            children: `
              window.op = window.op || function () { var n = []; return new Proxy(function () { arguments.length && n.push([].slice.call(arguments)) }, { get: function (t, r) { return "q" === r ? n : function () { n.push([r].concat([].slice.call(arguments))) } }, has: function (t, r) { return "q" === r } }) }();
              window.op('init', {
                clientId: ${JSON.stringify(clientId)},
                trackScreenViews: true,
                trackOutgoingLinks: true,
                trackAttributes: true,
                apiUrl: 'https://opapi.l2beat.com',
              });
            `,
          },
          {
            tag: 'script',
            injectTo: 'head',
            attrs: {
              src: 'https://analytics.l2beat.com/op1.js',
              defer: true,
              async: true,
            },
          },
        ]
      },
    },
  }
}
