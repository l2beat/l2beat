'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/core/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/dialog'
import { StepController } from '~/components/pizza-flow'
import { FullGreenPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-green-pizza'
import { FullRedPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-red-pizza'
import { FullYellowPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-yellow-pizza'
import { env } from '~/env'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import { ChevronIcon } from '~/icons/chevron'
import { L2BeatzzaLogo } from '~/icons/l2beatzza-logo'
import { cn } from '~/utils/cn'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../core/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupItem,
  SidebarGroupLink,
  SidebarGroupSmallLink,
  SidebarGroupSub,
  SidebarGroupSubButton,
  SidebarHeader,
  SidebarSeparator,
} from '../../core/sidebar'
import { DarkThemeToggle } from '../../dark-theme-toggle'
import { Logo } from '../../logo'
import { SocialLinks } from '../../social-links'
import { MobileNavTriggerClose } from '../mobile/mobile-nav-trigger'
import type { NavGroup, NavLink } from '../types'

interface Props {
  groups: NavGroup[]
  logoLink: string
  sideLinks: NavLink[]
  topNavbar: boolean
}

export function NavSidebar({ groups, logoLink, sideLinks, topNavbar }: Props) {
  const pathname = usePathname()
  return (
    <Sidebar
      topNavbar={topNavbar}
      className={cn(
        env.NEXT_PUBLIC_L2BEATZZA && '[&>div]:gap-0 [&>div]:space-y-6',
      )}
    >
      <SidebarHeader
        className={cn(env.NEXT_PUBLIC_L2BEATZZA && 'pr-0 pt-[13px] lg:px-0')}
      >
        <Header logoLink={logoLink} />
      </SidebarHeader>
      <SidebarContent className="!mt-2">
        {groups.map((group) => {
          return (
            <SidebarGroup key={group.title}>
              {group.type === 'multiple' && (
                <SidebarGroupItem>
                  <NavCollapsibleItem group={group} />
                </SidebarGroupItem>
              )}
              {group.type === 'single' && (
                <SidebarGroupItem key={group.title}>
                  <SidebarGroupLink
                    href={group.href}
                    isActive={getIsActive(group.href, pathname)}
                  >
                    {group.icon}
                    <span>{group.title}</span>
                  </SidebarGroupLink>
                </SidebarGroupItem>
              )}
            </SidebarGroup>
          )
        })}
        <SidebarGroup className="mt-8 gap-1.5">
          {sideLinks.map((link) => (
            <SidebarGroupItem key={link.title}>
              <SidebarGroupSmallLink
                href={link.href}
                isActive={getIsActive(link.href, pathname)}
              >
                {link.title}
                {link.accessory}
              </SidebarGroupSmallLink>
            </SidebarGroupItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {env.NEXT_PUBLIC_L2BEATZZA && (
          <>
            <DarkThemeToggle className="max-lg:hidden" />
            <div className="relative h-[160px] w-[200px]">
              <Image
                src={'/images/l2beatzza.png'}
                alt={'L2BEATZZA image'}
                width={600}
                height={480}
                className="rounded-lg border border-divider"
              />
              <Dialog>
                <DialogTrigger>
                  <Button
                    className="flex w-full items-center justify-center gap-1 rounded-[4px] bg-pink-900 px-6 py-3 text-xs text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90"
                    asChild
                  >
                    <button className="absolute inset-x-3 bottom-3 h-8 rounded bg-primary-invert text-xs font-bold text-primary">
                      Make Your Pizza
                    </button>
                  </Button>
                  <div className="size-0">
                    <FullRedPizzaSymbol />
                    <FullYellowPizzaSymbol />
                    <FullGreenPizzaSymbol />
                  </div>
                </DialogTrigger>

                <DialogContent
                  className="flex items-center justify-center bg-surface-primary pt-16 md:left-1/2 md:top-1/2 md:h-[560px] md:max-w-[800px] md:-translate-x-1/2 md:-translate-y-1/2"
                  fullScreenMobile
                >
                  <DialogTitle className="hidden">Pizza time</DialogTitle>
                  <StepController />
                  <DialogClose className="absolute right-5 top-5 flex size-[20px] items-center justify-center rounded-sm dark:bg-pink-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-primary-invert"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
        <div className="flex gap-2 lg:justify-between">
          <SocialLinks variant="gray" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function NavCollapsibleItem({
  group,
}: { group: Extract<NavGroup, { type: 'multiple' }> }) {
  const pathname = usePathname()
  const allGroupLinks = useMemo(
    () => [...group.links, ...(group.secondaryLinks ?? [])],
    [group.links, group.secondaryLinks],
  )
  const isActive = allGroupLinks.some((link) =>
    getIsActive(link.href, pathname),
  )
  const breakpoint = useBreakpoint()

  const [open, setOpen] = useState(isActive)

  useEffect(() => {
    const isActive = allGroupLinks.some((link) =>
      getIsActive(link.href, pathname),
    )
    setOpen(isActive)
  }, [allGroupLinks, pathname])

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
      {breakpoint === 'mobile' || breakpoint === 'tablet' ? (
        <CollapsibleTrigger
          className="group flex items-center gap-1.5 p-1.5"
          data-active={isActive}
        >
          <div className="flex items-center gap-2" data-active={isActive}>
            <div>{group.icon}</div>
            <span
              className={cn(
                'text-base font-medium tracking-tight text-primary transition-colors duration-300 ',
                isActive && 'text-brand',
              )}
            >
              {group.title}
            </span>
          </div>
          <ChevronIcon
            className={cn(
              'size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
              isActive && 'fill-brand',
            )}
          />
        </CollapsibleTrigger>
      ) : (
        <div className="group flex items-center p-1.5" data-active={isActive}>
          <Link
            href={group.links[0]!.href}
            className="flex items-center gap-2"
            data-active={isActive}
          >
            <div>{group.icon}</div>
            <span
              className={cn(
                'text-base font-medium tracking-tight text-primary transition-colors duration-300 ',
                isActive && 'text-brand',
              )}
            >
              {group.title}
            </span>
          </Link>
          <CollapsibleTrigger className="group size-6">
            <ChevronIcon
              className={cn(
                'm-auto size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
                isActive && 'fill-brand',
              )}
            />
          </CollapsibleTrigger>
        </div>
      )}
      <CollapsibleContent>
        <SidebarGroupSub>
          {group.links.map((item) => (
            <SidebarGroupSubButton
              href={item.href}
              key={item.title}
              isActive={getIsActive(item.href, pathname)}
            >
              <span>{item.title}</span>
            </SidebarGroupSubButton>
          ))}
          {group.secondaryLinks && group.secondaryLinks.length > 0 && (
            <>
              <SidebarSeparator />
              {group.secondaryLinks.map((item) => (
                <SidebarGroupSubButton
                  href={item.href}
                  key={item.title}
                  isActive={getIsActive(item.href, pathname)}
                >
                  <span>{item.title}</span>
                </SidebarGroupSubButton>
              ))}
            </>
          )}
        </SidebarGroupSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function getIsActive(href: string, pathname: string) {
  return pathname === href
}

function Header({ logoLink }: { logoLink: string }) {
  if (env.NEXT_PUBLIC_L2BEATZZA) {
    return (
      <div className="relative flex flex-row items-center lg:justify-center">
        <Link href={logoLink}>
          <L2BeatzzaLogo className="h-[70px]" />
        </Link>
        <div className="absolute right-3 top-2 flex flex-row items-center gap-4  lg:hidden">
          <DarkThemeToggle />
          <div className="size-6">
            <MobileNavTriggerClose />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[38px] flex-row items-center justify-between">
      <Link href={logoLink}>
        <Logo className="block h-8 w-auto" />
      </Link>
      <div className="flex flex-row items-center gap-4">
        <DarkThemeToggle />
        <div className="size-6 lg:hidden">
          <MobileNavTriggerClose />
        </div>
      </div>
    </div>
  )
}
