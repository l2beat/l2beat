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
} from '~/components/core/Sidebar'
import { cn } from '~/utils/cn'

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
        isUpcoming: true,
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
      <SidebarHeader>
        <SidebarGroupLabel className="font-bold text-black text-xs">
          Interop Back Office
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        {items.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      item.isUpcoming && 'pointer-events-none opacity-20',
                    )}
                  >
                    <SidebarMenuButton asChild disabled={item.isUpcoming}>
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
