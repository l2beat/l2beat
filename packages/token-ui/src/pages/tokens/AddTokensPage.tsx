import { Card, CardContent } from '~/components/core/Card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { AppLayout } from '~/layouts/AppLayout'
import { NewAbstractTokenForm } from './forms/NewAbstractTokenForm'
import { NewDeployedTokenForm } from './forms/NewDeployedTokenForm'

export function AddTokensPage() {
  return (
    <AppLayout>
      <Tabs defaultValue="abstract-token" className="mx-auto max-w-2xl">
        <TabsList>
          <TabsTrigger value="abstract-token">Abstract Token</TabsTrigger>
          <TabsTrigger value="deployed-token">Deployed Token</TabsTrigger>
        </TabsList>
        <TabsContent
          value="abstract-token"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <Card>
            <CardContent>
              <NewAbstractTokenForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent
          value="deployed-token"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <Card>
            <CardContent>
              <NewDeployedTokenForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
