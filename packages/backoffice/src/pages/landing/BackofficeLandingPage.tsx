import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'

export function BackofficeLandingPage() {
  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>L2BEAT Back Office</CardTitle>
            <CardDescription>
              Internal tools and dashboards for all L2BEAT teams.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Interop</CardTitle>
              <CardDescription>
                Interoperability monitoring, transfers, messages, events, and
                insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/interop"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Go to Interop →
              </Link>
            </CardContent>
          </Card>

          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Website</CardTitle>
              <CardDescription>
                Website management tools and dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-muted-foreground text-sm">
                Coming soon…
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
