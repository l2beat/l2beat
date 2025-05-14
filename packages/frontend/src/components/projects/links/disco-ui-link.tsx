import type { ProjectId } from '@l2beat/shared-pure'
import Link from 'next/link'
import { navigationMenuTriggerStyle } from '~/components/core/navigation-menu'
import { DiscoUiIcon } from '~/icons/disco-ui'
import { cn } from '~/utils/cn'

export function DiscoUiLink({ projectId }: { projectId: ProjectId }) {
  return (
    <Link
      href={`https://disco.l2beat.com/ui/p/${projectId}`}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        navigationMenuTriggerStyle(),
        'ring-inset ring-brand focus:ring-2',
        'flex h-8 flex-row items-center gap-1.5 px-2.5',
        'bg-gradient-to-r from-[#854220] to-[#DE7B16]',
      )}
    >
      <DiscoUiIcon className="h-[14px] w-[67px]" />
    </Link>
  )
}
