import {
  ArrowRightLeftIcon,
  BookCheck,
  InboxIcon,
  MessageSquareIcon,
  PanelsTopLeftIcon,
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
        title: 'Sync status',
        url: '/plugin-statuses',
        icon: RefreshCw,
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel className="font-bold text-black text-xs">
          Interop Backoffice
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
