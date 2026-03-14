import { Link, useLocation } from 'react-router-dom'
import { Button } from '~/components/core/Button'

const items = [
  {
    label: 'Overview',
    to: '/',
    activePrefixes: ['/'],
  },
  {
    label: 'Aggregates',
    to: '/summary/aggregates',
    activePrefixes: ['/summary/aggregates', '/interop/aggregates'],
  },
  {
    label: 'Anomalies',
    to: '/summary/anomalies',
    activePrefixes: ['/summary/anomalies', '/interop/anomalies'],
    excludedPrefixes: [
      '/summary/anomalies/suspicious-transfers',
      '/interop/anomalies/suspicious-transfers',
    ],
  },
  {
    label: 'Suspicious transfers',
    to: '/summary/anomalies/suspicious-transfers',
    activePrefixes: [
      '/summary/anomalies/suspicious-transfers',
      '/interop/anomalies/suspicious-transfers',
    ],
  },
  {
    label: 'Coverage pies',
    to: '/summary/coverage-pies',
    activePrefixes: ['/summary/coverage-pies', '/interop/coverage-pies'],
  },
  {
    label: 'Events',
    to: '/summary/events',
    activePrefixes: ['/summary/events', '/interop/events'],
  },
  {
    label: 'Messages',
    to: '/summary/messages',
    activePrefixes: ['/summary/messages', '/interop/messages'],
  },
  {
    label: 'Known apps',
    to: '/summary/known-apps',
    activePrefixes: ['/summary/known-apps'],
  },
  {
    label: 'Transfers',
    to: '/summary/transfers',
    activePrefixes: ['/summary/transfers', '/interop/transfers'],
  },
  {
    label: 'Missing tokens',
    to: '/summary/missing-tokens',
    activePrefixes: ['/summary/missing-tokens'],
  },
]

function isItemActive(pathname: string, item: (typeof items)[number]): boolean {
  if (item.to === '/') {
    return pathname === '/'
  }

  if (item.excludedPrefixes) {
    const isExcluded = item.excludedPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
    if (isExcluded) {
      return false
    }
  }

  return item.activePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function SummarySubnav() {
  const location = useLocation()

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Button
          key={item.to}
          asChild
          variant={
            isItemActive(location.pathname, item) ? 'secondary' : 'outline'
          }
          size="sm"
        >
          <Link to={item.to}>{item.label}</Link>
        </Button>
      ))}
    </div>
  )
}
