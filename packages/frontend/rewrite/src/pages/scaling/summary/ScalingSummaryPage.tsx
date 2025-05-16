import { useEffect } from 'react'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingSummaryPage as NextSummaryPage } from '~/app/(side-nav)/scaling/summary/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { env } from '~/env'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingSummaryEntry>
}
export function ScalingSummaryPage(props: Props) {
  return (
    <AppLayout {...props}>
      <DevAutoReloader />
      <SideNavLayout>
        <NextSummaryPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}

export function DevAutoReloader() {
  useEffect(() => {
    if (env.NODE_ENV === 'production') return

    const ws = new WebSocket(`ws://localhost:9999`)
    ws.addEventListener('open', () => {
      console.log('[WS] Connected.')
    })

    ws.addEventListener('close', () => {
      console.log('[WS] Disconnected. Waiting to reconnect...')

      const interval = setInterval(() => {
        const testSocket = new WebSocket(`ws://localhost:9999`)
        let isHandled = false

        const cleanup = () => {
          if (!isHandled) {
            isHandled = true
            testSocket.close()
          }
        }

        testSocket.addEventListener('open', () => {
          clearInterval(interval)
          cleanup()
          window.location.reload()
        })

        testSocket.addEventListener('error', () => {
          cleanup()
        })

        setTimeout(cleanup, 5000)
      }, 250)
    })

    return () => {
      ws.close()
    }
  }, [])

  return null
}
