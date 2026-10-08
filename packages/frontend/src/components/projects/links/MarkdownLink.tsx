import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '~/components/core/NavigationMenu'
import { MarkdownIcon } from '~/icons/Markdown'
import { cn } from '~/utils/cn'

/** The page as markdown, the same document agents get from the `.md` URL. */
export function MarkdownLink({ href }: { href: string }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        href={href}
        className={cn(
          navigationMenuTriggerStyle(),
          'ring-brand ring-inset focus-visible:ring-2',
          'flex flex-row items-center gap-1.5',
        )}
      >
        <MarkdownIcon className="size-4" />
        Markdown
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
