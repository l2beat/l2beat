import { Link, useLocation } from 'react-router-dom'
import { Button } from '~/components/core/Button'

const items = [
  {
    label: 'Overview',
    to: '/',
  },
  {
    label: 'Events',
    to: '/summary/events',
  },
  {
    label: 'Messages',
    to: '/summary/messages',
  },
  {
    label: 'Transfers',
    to: '/summary/transfers',
  },
]

export function SummarySubnav() {
  const location = useLocation()

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Button
          key={item.to}
          asChild
          variant={location.pathname === item.to ? 'secondary' : 'outline'}
          size="sm"
        >
          <Link to={item.to}>{item.label}</Link>
        </Button>
      ))}
    </div>
  )
}
