import { Card, CardContent } from '~/components/core/Card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { AppLayout } from '~/layouts/AppLayout'
import { NewAbstractTokenForm } from './forms/NewAbstractTokenForm'

export function AddTokensPage() {
  return (
    <AppLayout>
      <Tabs defaultValue="abstract-token" className="mx-auto max-w-2xl">
        <TabsList>
          <TabsTrigger value="abstract-token">Abstract Token</TabsTrigger>
          <TabsTrigger value="deployed-token">Deployed Token</TabsTrigger>
        </TabsList>
        <TabsContent value="abstract-token">
          <Card>
            <CardContent>
              <NewAbstractTokenForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deployed-token">
          <Card>
            <CardContent>Deployed Token</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
