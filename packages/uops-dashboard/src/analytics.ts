declare global {
  interface Window {
    op?: (...args: unknown[]) => void
  }
}

export function initAnalytics() {
  const clientId = import.meta.env.VITE_OPENPANEL_CLIENT_ID
  if (!clientId) {
    return
  }

  window.op = createCallQueue()
  window.op('init', {
    clientId,
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
    apiUrl: 'https://opapi.l2beat.com',
  })

  const script = document.createElement('script')
  script.src = 'https://analytics.l2beat.com/op1.js'
  script.async = true
  document.head.appendChild(script)
}

// op1.js replays `window.op.q` once loaded, so calls made before that are not lost.
function createCallQueue() {
  const q: unknown[][] = []
  const op = (...args: unknown[]) => {
    q.push(args)
  }
  return Object.assign(op, { q })
}
