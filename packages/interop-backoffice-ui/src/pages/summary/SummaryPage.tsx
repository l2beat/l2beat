import { Card, CardHeader, CardTitle } from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'

export function SummaryPage() {
  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Interop Overview</CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>
    </AppLayout>
  )
}
