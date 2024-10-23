import { Callout } from '~/components/callout'
import { OutLink } from '~/components/out-link'
import { BulletIcon } from '~/icons/bullet'
import { cn } from '~/utils/cn'

export interface PermissionedEntityEntryProps {
  name: string
  href: string
  className?: string
}

export function PermissionedEntityEntry({
  name,
  href,
  className,
}: PermissionedEntityEntryProps) {
  return (
    <Callout
      className={cn('px-4', className)}
      icon={<BulletIcon className="size-5" />}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2 !leading-[1.15]">
            <OutLink key={href} href={href}>
              {name}
            </OutLink>
          </div>
        </>
      }
    />
  )
}
