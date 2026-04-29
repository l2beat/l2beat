import {
  ChevronRightIcon,
  GlobeIcon,
  LayersIcon,
  PanelsTopLeftIcon,
  PieChartIcon,
  RefreshCwIcon,
} from 'lucide-react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from '~/components/core/Sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './core/Collapsible'

const interopItems = [
  {
    title: 'Data',
    icon: LayersIcon,
    items: [
      {
        title: 'Overview',
        url: '/interop',
      },
      {
        title: 'Aggregates',
        url: '/interop/aggregates',
      },
      {
        title: 'Events',
        url: '/interop/events',
      },
      {
        title: 'Messages',
        url: '/interop/messages',
      },
      {
        title: 'Transfers',
        url: '/interop/transfers',
      },
      {
        title: 'Missing tokens',
        url: '/interop/missing-tokens',
      },
      {
        title: 'Known apps',
        url: '/interop/known-apps',
      },
    ],
  },
  {
    title: 'Indexing',
    icon: RefreshCwIcon,
    items: [
      {
        title: 'Plugin statuses',
        url: '/interop/indexing/plugin-statuses',
      },
      {
        title: 'Processor statuses',
        url: '/interop/indexing/processor-statuses',
      },
      {
        title: 'Financial actions',
        url: '/interop/financials/actions',
      },
    ],
  },
  {
    title: 'Insights',
    icon: PieChartIcon,
    items: [
      {
        title: 'Anomalies',
        url: '/interop/insights/anomalies',
      },
      {
        title: 'Suspicious transfers',
        url: '/interop/insights/anomalies/suspicious-transfers',
      },
      {
        title: 'Coverage pies',
        url: '/interop/insights/coverage-pies',
      },
      {
        title: 'Memory',
        url: '/interop/insights/memory',
      },
    ],
  },
]

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="gap-3">
        <div className="flex min-h-8 items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-semibold text-sidebar-foreground text-sm">
              L2BEAT Back Office
            </p>
          </div>
          <SidebarTrigger className="size-8 shrink-0" />
        </div>
        <SidebarSeparator className="mx-0" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/">
                    <PanelsTopLeftIcon />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Interop</SidebarGroupLabel>
          <SidebarMenu>
            {interopItems.map((group) => {
              const isActive = isNavGroupActive(
                pathname,
                group.items,
                '/interop',
              )
              return (
                <Collapsible key={group.title} asChild defaultOpen={isActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild className="group">
                      <div>
                        <SidebarMenuButton tooltip={group.title}>
                          <group.icon />
                          {group.title}
                        </SidebarMenuButton>
                        <SidebarMenuAction className="group-data-[state=open]:rotate-90">
                          <ChevronRightIcon />
                        </SidebarMenuAction>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Website</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Coming soon">
                  <span className="cursor-not-allowed opacity-50">
                    <GlobeIcon />
                    <span>Coming soon</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function isNavGroupActive(
  pathname: string,
  items: { url: string }[],
  match: string,
): boolean {
  return items.some((item) => {
    if (matchPath({ path: item.url, end: true }, pathname)) {
      return true
    }
    if (match === item.url) {
      return false
    }
    return matchPath({ path: `${item.url}/*`, end: false }, pathname) != null
  })
}
