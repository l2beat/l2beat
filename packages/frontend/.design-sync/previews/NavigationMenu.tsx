import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@l2beat/frontend'

export function Links() {
  return (
    <div className="py-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/scaling/summary"
              className={navigationMenuTriggerStyle()}
            >
              Scaling
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/bridges/summary"
              className={navigationMenuTriggerStyle()}
            >
              Bridges
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/data-availability/summary"
              className={navigationMenuTriggerStyle()}
            >
              Data availability
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
