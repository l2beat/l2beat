import { CircleUser, Coins, Menu, Network, SendToBack } from 'lucide-react'
import Link from 'next/link'

import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
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
import { deleteSession, getSession } from '~/server/auth/cookie'
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
    name: 'Links',
    href: '/links' as const,
    icon: SendToBack,
  },
]

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect('/auth')
  }

  // biome-ignore lint/suspicious/useAwait: server action must be async
  async function logout() {
    'use server'
    deleteSession()
    redirect('/auth')
  }

  console.log(session)

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
      <div className="flex min-h-full flex-col">
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
              <DropdownMenuLabel>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-full">
                    {session.picture && (
                      <AvatarImage src={session.picture} alt={session.name} />
                    )}
                    <AvatarFallback className="rounded-full">
                      {session.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.name}
                    </span>
                    <span className="truncate text-xs">{session.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
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
          <main className="flex w-full flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
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
