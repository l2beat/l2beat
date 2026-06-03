import {
  ChevronRightIcon,
  ClipboardCheckIcon,
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

type NavigationGroup = {
  title: string
  matcher: string
  items: Item[]
}

type Item =
  | {
      type: 'collapsible'
      title: string
      icon: typeof LayersIcon
      items: { title: string; url: string }[]
    }
  | {
      type: 'single'
      title: string
      icon: typeof LayersIcon
      url: string
    }

const navGroups: NavigationGroup[] = [
  {
    title: 'General',
    matcher: '/',
    items: [
      {
        type: 'single',
        title: 'Home',
        icon: PanelsTopLeftIcon,
        url: '/',
      },
    ],
  },
  {
    title: 'Interop',
    matcher: '/interop',
    items: [
      {
        type: 'collapsible',
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
        type: 'collapsible',
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
        type: 'collapsible',
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
            title: 'Chains summary',
            url: '/interop/insights/chains-summary',
          },
          {
            title: 'Memory',
            url: '/interop/insights/memory',
          },
        ],
      },
    ],
  },
  {
    title: 'Website',
    matcher: '/website',
    items: [
      {
        type: 'single',
        title: 'Daily checks',
        icon: ClipboardCheckIcon,
        url: '/website/daily-checks',
      },
      {
        type: 'single',
        title: 'Interop aggregates',
        icon: ClipboardCheckIcon,
        url: '/website/interop-aggregates',
      },
      {
        type: 'collapsible',
        title: 'Status',
        icon: LayersIcon,
        items: [
          {
            title: 'Tracked txs',
            url: '/website/status/tracked-txs',
          },
          {
            title: 'DA tracking',
            url: '/website/status/da-tracking',
          },
        ],
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
        {navGroups.map((group) => {
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  if (item.type === 'single') {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  const isActive = isNavGroupActive(
                    pathname,
                    item.items,
                    group.matcher,
                  )
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild className="group">
                          <div>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon />
                              {item.title}
                            </SidebarMenuButton>
                            <SidebarMenuAction className="group-data-[state=open]:rotate-90">
                              <ChevronRightIcon />
                            </SidebarMenuAction>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
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
          )
        })}
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
