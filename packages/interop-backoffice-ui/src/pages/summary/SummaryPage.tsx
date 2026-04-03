import { Link } from 'react-router-dom'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
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
            <div className="space-y-1">
              <CardTitle>Interop Overview</CardTitle>
              <CardDescription>
                The events migration is now available in the new UI.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/events">Open events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
