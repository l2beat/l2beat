import React, { useEffect } from 'react'

export const DevAutoReloader = React.memo(() => {
  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:9999')

    ws.addEventListener('open', () => {
      console.log('[WS] Connected.')
    })

    ws.addEventListener('close', () => {
      console.log('[WS] Disconnected. Waiting to reconnect...')

      let testSocket: WebSocket | null = null
      const interval = setInterval(() => {
        // Clean up previous socket if it exists
        if (testSocket) {
          testSocket.close()
        }

        testSocket = new WebSocket('ws://127.0.0.1:9999')

        testSocket.addEventListener('open', () => {
          clearInterval(interval)
          if (testSocket) {
            testSocket.close()
          }
          window.location.reload()
        })
      }, 250)

      return () => {
        clearInterval(interval)
        if (testSocket) {
          testSocket.close()
        }
      }
    })

    return () => {
      ws.close()
    }
  }, [])

  return null
})

DevAutoReloader.displayName = 'DevAutoReloader'
