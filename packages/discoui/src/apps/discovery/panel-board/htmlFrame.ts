import type { Theme } from '../../../theme'

// The page runs in a sandbox that loads no resources from the network and
// cannot reach DiscoUI: it can only ask to select a contract and say how tall
// it is. A script can still navigate the frame away, but the page comes from
// the researcher's own agent or project, which reach the network anyway.
// What it shows comes from the agent, which may have copied names out of
// discovered data.
const CSP =
  "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:"

// DiscoUI's colors, so a chart can match the panel around it. The frame
// cannot read the CSS variables in index.css, so these repeat them.
const FRAME_COLORS: Record<Theme, Record<string, string>> = {
  dark: {
    text: '#f0d8bd',
    muted: '#a98763',
    line: '#594c43',
    surface: '#3c332d',
    background: '#282422',
    blue: '#8b8be8',
    orange: '#fe8019',
    red: '#fb4a35',
    green: '#9dde6c',
    teal: '#83a599',
    yellow: '#fabd30',
    amber: '#ffc107',
    cyan: '#1c92a8',
    pink: '#e27991',
    purple: '#a73db5',
    brown: '#7f3d0c',
  },
  light: {
    text: '#412e18',
    muted: '#856441',
    line: '#baafa2',
    surface: '#ded6cc',
    background: '#f5eee5',
    blue: '#5e5ab2',
    orange: '#973f00',
    red: '#d01601',
    green: '#417501',
    teal: '#446359',
    yellow: '#876201',
    amber: '#997204',
    cyan: '#037386',
    pink: '#a13f5a',
    purple: '#a439b1',
    brown: '#7f3d0c',
  },
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
function frameStyle(variables: string, theme: Theme): string {
  return [
    `:root{${variables}color-scheme:${theme}}`,
    'body{margin:0;display:flow-root;font:12px/1.5 system-ui,sans-serif;color:var(--text);background:transparent}',
    ':where(h1,h2,h3,h4){margin:0 0 8px;font-size:13px;font-weight:700}',
    ':where(p){margin:0 0 8px}',
    ':where(svg,img,canvas){max-width:100%}',
    'a,button{color:inherit}',
  ].join('')
}

// The doctype keeps the page out of quirks mode, where the body does not
// measure its content.
export function frameDocument(html: string, theme: Theme): string {
  const variables = Object.entries(FRAME_COLORS[theme])
    .map(([name, value]) => `--${name}:${value};`)
    .join('')
  return [
    '<!doctype html><html><head><meta charset="utf-8">',
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    `<style>${frameStyle(variables, theme)}</style>`,
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
