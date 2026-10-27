import colors from '../../../colors.json'

// The page runs in a sandbox with no network and no access to DiscoUI: it
// can only ask to select a contract and say how tall it is. What it shows
// comes from the agent, which may have copied names out of discovered data.
const CSP =
  "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:"

// DiscoUI's colors, so a chart can match the panel around it.
const THEME = {
  text: colors.coffee['200'],
  muted: colors.coffee['400'],
  line: colors.coffee['600'],
  surface: colors.coffee['700'],
  background: colors.coffee['800'],
  ...colors.aux,
}

const BRIDGE = `
window.discoui = {
  select: function (address) {
    parent.postMessage({ discoui: 'select', address: String(address) }, '*')
  },
}
addEventListener('DOMContentLoaded', function () {
  var report = function () {
    var height = Math.ceil(document.body.getBoundingClientRect().height)
    parent.postMessage({ discoui: 'height', height: height }, '*')
  }
  new ResizeObserver(report).observe(document.body)
  report()
})
`

// The body is a flow root, so the margins of what it holds count in the
// height it reports; :where keeps the defaults below any style the page sets.
function frameStyle(variables: string): string {
  return [
    `:root{${variables}color-scheme:dark}`,
    'body{margin:0;display:flow-root;font:12px/1.5 system-ui,sans-serif;color:var(--text);background:transparent}',
    ':where(h1,h2,h3,h4){margin:0 0 8px;font-size:13px;font-weight:700}',
    ':where(p){margin:0 0 8px}',
    ':where(svg,img,canvas){max-width:100%}',
    'a,button{color:inherit}',
  ].join('')
}

// The doctype keeps the page out of quirks mode, where the body does not
// measure its content.
export function frameDocument(html: string): string {
  const variables = Object.entries(THEME)
    .map(([name, value]) => `--${name}:${value};`)
    .join('')
  return [
    '<!doctype html><html><head><meta charset="utf-8">',
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    `<style>${frameStyle(variables)}</style>`,
    `<script>${BRIDGE}</script>`,
    '</head><body>',
    html,
    '</body></html>',
  ].join('')
}

export type FrameMessage =
  | { type: 'select'; address: string }
  | { type: 'height'; height: number }

export function readFrameMessage(data: unknown): FrameMessage | undefined {
  if (typeof data !== 'object' || data === null) return undefined
  const message = data as Record<string, unknown>
  if (message.discoui === 'select' && typeof message.address === 'string') {
    return { type: 'select', address: message.address }
  }
  if (
    message.discoui === 'height' &&
    typeof message.height === 'number' &&
    Number.isFinite(message.height)
  ) {
    return { type: 'height', height: message.height }
  }
  return undefined
}
