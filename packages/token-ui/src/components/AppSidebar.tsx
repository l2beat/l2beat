import { CirclePlusIcon, PanelsTopLeftIcon } from 'lucide-react'
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
import { SidebarSearch } from './SidebarSearch'

// Menu items.
const items = [
  {
    title: 'Tokens',
    items: [
      {
        title: 'Summary',
        url: '/',
        icon: PanelsTopLeftIcon,
      },
      {
        title: 'Add',
        url: '/tokens/new',
        icon: CirclePlusIcon,
      },
    ],
  },
  {
    title: 'Chains',
    items: [
      {
        title: 'Summary',
        url: '/chains',
        icon: PanelsTopLeftIcon,
      },
      {
        title: 'Add',
        url: '/chains/new',
        icon: CirclePlusIcon,
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel className="font-bold text-black text-xs">
          Token UI
        </SidebarGroupLabel>
        <SidebarSearch />
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
