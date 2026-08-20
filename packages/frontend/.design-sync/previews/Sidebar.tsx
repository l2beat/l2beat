import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupItem,
  SidebarGroupLink,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
} from '@l2beat/frontend'

export function Navigation() {
  return (
    <SidebarProvider className="min-h-0">
      <Sidebar>
        <SidebarHeader>
          <div className="px-5 font-bold text-primary">L2BEAT</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupItem>
              <SidebarGroupLink href="/scaling/summary" isActive>
                <span>Scaling</span>
              </SidebarGroupLink>
            </SidebarGroupItem>
            <SidebarGroupItem>
              <SidebarGroupLink href="/bridges/summary">
                <span>Bridges</span>
              </SidebarGroupLink>
            </SidebarGroupItem>
            <SidebarGroupItem>
              <SidebarGroupLink href="/data-availability/summary">
                <span>Data availability</span>
              </SidebarGroupLink>
            </SidebarGroupItem>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupItem>
              <SidebarGroupLink href="/governance">
                <span>Governance</span>
              </SidebarGroupLink>
            </SidebarGroupItem>
            <SidebarGroupItem>
              <SidebarGroupLink href="/donate">
                <span>Donate</span>
              </SidebarGroupLink>
            </SidebarGroupItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
