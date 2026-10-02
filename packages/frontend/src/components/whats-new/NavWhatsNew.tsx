import { useLocalStorage } from '~/hooks/useLocalStorage'
import { SidebarGroup } from '../core/Sidebar'
import { useWhatsNewItem } from './WhatsNewItemContext'

/** The latest announcement at the bottom of the nav, on every page. */
export function NavWhatsNew({ onNavigate }: { onNavigate: () => void }) {
  const item = useWhatsNewItem()
  // Opening the item counts as seeing it, which also retires the floating
  // what's new widget for it.
  const [, setSeen] = useLocalStorage(
    item ? `whats-new-${item.id}` : 'whats-new-none',
    false,
  )
  if (!item) {
    return null
  }
  return (
    // Pushed to the end of the nav, just above its footer; at least 20px
    // under the lists above when the nav is full.
    <SidebarGroup className="mt-auto pt-5">
      <span className="pl-1.5 font-medium text-2xs text-secondary uppercase tracking-wider">
        What&apos;s new
      </span>
      <a
        href={item.href}
        onClick={() => {
          setSeen(true)
          onNavigate()
        }}
        className="group mt-1 flex flex-col gap-2 px-1.5"
      >
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
          className="aspect-video w-full rounded-md object-cover object-top-left"
        />
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-sm underline-offset-2 group-hover:underline">
            {item.title}
          </span>
          {item.description && (
            <span className="line-clamp-2 text-secondary text-xs leading-normal">
              {item.description}
            </span>
          )}
        </span>
      </a>
    </SidebarGroup>
  )
}
