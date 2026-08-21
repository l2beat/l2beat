import { Tabs, TabsContent, TabsList, TabsTrigger } from '@l2beat/frontend'

export function Default() {
  return (
    <Tabs
      name="scaling-summary"
      defaultValue="rollups"
      className="w-full max-w-xl"
    >
      <TabsList>
        <TabsTrigger value="rollups">Rollups</TabsTrigger>
        <TabsTrigger value="validiums">Validiums &amp; Optimiums</TabsTrigger>
        <TabsTrigger value="others">Others</TabsTrigger>
      </TabsList>
      <TabsContent value="rollups" className="pt-3 text-primary">
        Projects that post both state roots and data to Ethereum.
      </TabsContent>
    </Tabs>
  )
}

export function Highlighted() {
  return (
    <Tabs
      name="project-tabs"
      variant="highlighted"
      defaultValue="risks"
      className="w-full max-w-xl"
    >
      <TabsList>
        <TabsTrigger value="risks">Risk analysis</TabsTrigger>
        <TabsTrigger value="tvs">Value secured</TabsTrigger>
        <TabsTrigger value="costs">Onchain costs</TabsTrigger>
      </TabsList>
      <TabsContent value="risks" className="pt-3 text-primary">
        Five risk dimensions, scored against the project&apos;s current
        configuration.
      </TabsContent>
    </Tabs>
  )
}

export function Disabled() {
  return (
    <Tabs
      name="disabled-example"
      defaultValue="live"
      className="w-full max-w-xl"
    >
      <TabsList>
        <TabsTrigger value="live">Live</TabsTrigger>
        <TabsTrigger value="upcoming" disabled>
          Upcoming
        </TabsTrigger>
      </TabsList>
      <TabsContent value="live" className="pt-3 text-primary">
        Upcoming is disabled until the project ships to mainnet.
      </TabsContent>
    </Tabs>
  )
}
