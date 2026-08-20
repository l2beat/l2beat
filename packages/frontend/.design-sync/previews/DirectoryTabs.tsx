import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '@l2beat/frontend'

export function Default() {
  return (
    <div className="w-full bg-background text-primary">
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">Rollups</DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums">
            Validiums &amp; Optimiums
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">Others</DirectoryTabsTrigger>
        </DirectoryTabsList>
        <DirectoryTabsContent value="rollups">
          <div className="font-bold">42 rollups</div>
          <p className="pt-1 text-secondary text-sm">
            Projects that post both state roots and transaction data to
            Ethereum. The active tab reads from the <code>?tab=</code> query
            param.
          </p>
        </DirectoryTabsContent>
      </DirectoryTabs>
    </div>
  )
}
