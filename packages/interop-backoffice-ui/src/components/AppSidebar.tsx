import {
  AlertTriangleIcon,
  ArrowRightLeftIcon,
  BookCheckIcon,
  CircleDollarSignIcon,
  CpuIcon,
  HatGlassesIcon,
  InboxIcon,
  LayersIcon,
  MessageSquareIcon,
  PanelsTopLeftIcon,
  PieChartIcon,
  RefreshCwIcon,
  ViewIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '~/components/core/Sidebar'

const items = [
  {
    title: 'Data',
    items: [
      {
        title: 'Overview',
        url: '/',
        icon: PanelsTopLeftIcon,
      },
      {
        title: 'Aggregates',
        url: '/aggregates',
        icon: LayersIcon,
      },

      {
        title: 'Events',
        url: '/events',
        icon: InboxIcon,
      },
      {
        title: 'Messages',
        url: '/messages',
        icon: MessageSquareIcon,
      },
      {
        title: 'Transfers',
        url: '/transfers',
        icon: ArrowRightLeftIcon,
      },
      {
        title: 'Missing tokens',
        url: '/missing-tokens',
        icon: ViewIcon,
      },
      {
        title: 'Known apps',
        url: '/known-apps',
        icon: BookCheckIcon,
      },
    ],
  },
  {
    title: 'Indexing',
    items: [
      {
        title: 'Plugin statuses',
        url: '/indexing/plugin-statuses',
        icon: RefreshCwIcon,
      },
      {
        title: 'Processor statuses',
        url: '/indexing/processor-statuses',
        icon: CpuIcon,
      },
      {
        title: 'Financial actions',
        url: '/financials/actions',
        icon: CircleDollarSignIcon,
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        title: 'Anomalies',
        url: '/insights/anomalies',
        icon: AlertTriangleIcon,
      },
      {
        title: 'Suspicious transfers',
        url: '/insights/anomalies/suspicious-transfers',
        icon: HatGlassesIcon,
      },
      {
        title: 'Coverage pies',
        url: '/insights/coverage-pies',
        icon: PieChartIcon,
      },
      {
        title: 'Memory',
        url: '/insights/memory',
        icon: CpuIcon,
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="gap-3">
        <div className="flex min-h-8 items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-semibold text-sidebar-foreground text-sm">
              Interop Back Office
            </p>
          </div>
          <SidebarTrigger className="size-8 shrink-0" />
        </div>
        <SidebarSeparator className="mx-0" />
      </SidebarHeader>
      <SidebarContent>
        {items.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
