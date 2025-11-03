import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '~/components/core/Card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { AppLayout } from '~/layouts/AppLayout'
import { AddAbstractToken } from './AddAbstractToken'
import { AddDeployedToken } from './AddDeployedToken'

export function AddTokensPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'deployed'

  return (
    <AppLayout>
      <Tabs
        defaultValue={tab}
        className="mx-auto w-full max-w-3xl"
        onValueChange={(value) => {
          setSearchParams({ tab: value })
        }}
      >
        <TabsList>
          <TabsTrigger value="deployed">Deployed Token</TabsTrigger>
          <TabsTrigger value="abstract">Abstract Token</TabsTrigger>
        </TabsList>
        <TabsContent
          value="deployed"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <Card>
            <CardContent>
              <AddDeployedToken />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent
          value="abstract"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <Card>
            <CardContent>
              <AddAbstractToken />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
