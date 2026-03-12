import { Link, useLocation } from 'react-router-dom'
import { Button } from '~/components/core/Button'

const items = [
  {
    label: 'Overview',
    to: '/',
    activePrefixes: ['/'],
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
    label: 'Transfers',
    to: '/summary/transfers',
    activePrefixes: ['/summary/transfers', '/interop/transfers'],
  },
]

function isItemActive(pathname: string, item: (typeof items)[number]): boolean {
  if (item.to === '/') {
    return pathname === '/'
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
