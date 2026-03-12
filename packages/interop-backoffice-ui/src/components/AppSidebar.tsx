import {
  AlertTriangleIcon,
  ArrowRightLeftIcon,
  BookCheck,
  CircleDollarSignIcon,
  CpuIcon,
  HatGlasses,
  InboxIcon,
  Layers,
  MessageSquareIcon,
  PanelsTopLeftIcon,
  PieChartIcon,
  RefreshCw,
  View,
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
        url: '/summary/aggregates',
        icon: Layers,
      },

      {
        title: 'Events',
        url: '/summary/events',
        icon: InboxIcon,
      },
      {
        title: 'Messages',
        url: '/summary/messages',
        icon: MessageSquareIcon,
      },
      {
        title: 'Transfers',
        url: '/summary/transfers',
        icon: ArrowRightLeftIcon,
      },
      {
        title: 'Missing tokens',
        url: '/summary/missing-tokens',
        icon: View,
      },
      {
        title: 'Known apps',
        url: '/summary/known-apps',
        icon: BookCheck,
      },
    ],
  },
  {
    title: 'Indexing',
    items: [
      {
        title: 'Resyncable plugins',
        url: '/plugin-statuses',
        icon: RefreshCw,
      },
      {
        title: 'Processor statuses',
        url: '/processor-statuses',
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
        url: '/summary/anomalies',
        icon: AlertTriangleIcon,
      },
      {
        title: 'Suspicious transfers',
        url: '/summary/anomalies/suspicious-transfers',
        icon: HatGlasses,
      },
      {
        title: 'Coverage pies',
        url: '/summary/coverage-pies',
        icon: PieChartIcon,
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
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
