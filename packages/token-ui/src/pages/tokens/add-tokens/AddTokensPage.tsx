import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { useQueryState } from '~/hooks/useQueryState'
import { AppLayout } from '~/layouts/AppLayout'
import { AddAbstractToken } from './AddAbstractToken'
import { AddDeployedToken } from './AddDeployedToken'

export function AddTokensPage() {
  const [tab, setTab] = useQueryState('tab', 'deployed')
  return (
    <AppLayout>
      <Tabs
        className="mx-auto w-full max-w-3xl"
        value={tab}
        onValueChange={setTab}
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
          <AddDeployedToken />
        </TabsContent>
        <TabsContent
          value="abstract"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <AddAbstractToken />
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
