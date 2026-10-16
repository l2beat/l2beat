import { useDevice } from '~/hooks/useDevice'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useTracking } from '~/hooks/useTracking'
import { SidebarGroup, SidebarGroupLabel } from '../core/Sidebar'
import { useWhatsNewItem } from './WhatsNewItemContext'

/** The latest announcement at the bottom of the nav, on every page. */
export function NavWhatsNew({ onNavigate }: { onNavigate: () => void }) {
  const item = useWhatsNewItem()
  const { track } = useTracking()
  const { isDesktop } = useDevice()
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
      <SidebarGroupLabel>What&apos;s new</SidebarGroupLabel>
      <a
        href={item.href}
        onClick={() => {
          // The same event as the floating widget, which it replaces from lg.
          track('whatsNewClicked', {
            device: isDesktop ? 'desktop' : 'mobile',
            action: 'open',
          })
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
            <span className="line-clamp-3 text-secondary text-xs leading-normal">
              {item.description}
            </span>
          )}
        </span>
      </a>
    </SidebarGroup>
  )
}
