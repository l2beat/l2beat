import { CircleUser, Coins, Menu, Network, SendToBack } from 'lucide-react'
import Link from 'next/link'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { NavMenuItem } from './_components/nav-menu-item'
import { Search } from './_components/search'
import { ThemeToggle } from './_components/theme-toggle'

const menu = [
  {
    name: 'Networks',
    href: '/networks' as const,
    icon: Network,
  },
  {
    name: 'Tokens',
    href: '/tokens' as const,
    icon: Coins,
  },
  {
    name: '3rd Party Bridges',
    href: '/bridges' as const,
    icon: SendToBack,
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  if (cookies().get('auth_session')?.value !== 'authenticated') {
    redirect('/auth')
  }

  // biome-ignore lint/suspicious/useAwait: server action must be async
  async function logout() {
    'use server'
    cookies().set('auth_session', 'unauthenticated', { expires: new Date(0) })
    redirect('/auth')
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">L2BEAT</span>
            </Link>
            <ThemeToggle className="ml-auto" />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menu.map(({ name, href, icon: Icon }) => (
                <NavMenuItem
                  key={name}
                  href={href}
                  name={name}
                  icon={<Icon className="size-4" />}
                  activeBehavior={{ type: 'prefix', prefix: href }}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="mt-6 grid gap-2 text-lg font-medium">
                {menu.map(({ name, href, icon: Icon }) => (
                  <NavMenuItem
                    key={name}
                    href={href}
                    name={name}
                    icon={<Icon className="size-4" />}
                    activeBehavior={{ type: 'prefix', prefix: href }}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <Search />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="size-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/*<DropdownMenuItem>Settings</DropdownMenuItem>*/}
              <DropdownMenuSeparator />
              <form action={logout}>
                <DropdownMenuItem asChild>
                  <button className="w-full">Logout</button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col">
          <main className="flex w-full flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
          <footer className="border-t p-4 text-center text-sm text-muted-foreground lg:p-6">
            &copy; {new Date().getFullYear()} L2BEAT. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  )
}
