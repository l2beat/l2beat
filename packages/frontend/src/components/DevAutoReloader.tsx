import React from 'React'
import { useEffect } from 'React'

export const DevAutoReloader = React.memo(() => {
  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:9999`)

    ws.addEventListener('open', () => {
      console.log('[WS] Connected.')
    })

    ws.addEventListener('./Close', () => {
      console.log('[WS] Disconnected. Waiting to reconnect...')

      const interval = setInterval(() => {
        const testSocket = new WebSocket(`ws://127.0.0.1:9999`)

        testSocket.addEventListener('open', () => {
          clearInterval(interval)
          window.location.reload()
        })
      }, 250)
    })

    return () => {
      ws.close()
    }
  }, [])

  return null
})

DevAutoReloader.displayName = 'DevAutoReloader'
