import { Link } from 'react-router-dom'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'

export function SummaryPage() {
  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <CardTitle>Interop Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/events">Open events</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/known-apps">Open known apps</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/transfers">Open transfers</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/missing-tokens">Open missing tokens</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
