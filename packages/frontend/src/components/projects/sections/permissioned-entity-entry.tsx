import { Callout } from '~/components/callout'
import { CopyButton } from '~/components/copy-button'
import { CustomLink } from '~/components/link/custom-link'
import { BulletIcon } from '~/icons/bullet'
import { cn } from '~/utils/cn'

export interface PermissionedEntityEntryProps {
  entity: {
    name: string
    href: string
    key?: string
  }
  className?: string
}

export function PermissionedEntityEntry({
  entity,
  className,
}: PermissionedEntityEntryProps) {
  return (
    <Callout
      className={cn('px-4', className)}
      icon={<BulletIcon className="size-5" />}
      body={
        <>
          <div className="flex flex-col flex-wrap gap-x-2 !leading-[1.15]">
            <CustomLink key={entity.href} href={entity.href}>
              {entity.name}
            </CustomLink>
            {entity.key && (
              <div className="mt-1 flex items-center justify-center gap-1 text-gray-850 dark:text-gray-400">
                <strong className="text-primary">Key:</strong>{' '}
                {formatKey(entity.key)}{' '}
                <CopyButton toCopy={entity.key} iconClassName="size-3.5" />
              </div>
            )}
          </div>
        </>
      }
    />
  )
}

function formatKey(key: string) {
  return `${key.slice(0, 6)}...${key.slice(key.length - 4)}`
}
