import Image from 'next/image'
import Link from 'next/link'
import { cn } from '~/utils/cn'

export type ProjectDetailsRelatedProjectBannerProps = {
  text: string
  project: {
    name: string
    type: 'scaling' | 'bridges' | 'data-availability'
    slug: string
  }
  className?: string
}

export function ProjectDetailsRelatedProjectBanner({
  text,
  project,
  className,
}: ProjectDetailsRelatedProjectBannerProps) {
  const href = `/${project.type}/projects/${project.slug}` as const

  return (
    <div
      className={cn(
        'flex w-full items-center rounded-lg bg-surface-secondary px-4 py-2 text-xs font-medium',
        className,
      )}
    >
      <div>
        {text}{' '}
        <span className="inline-block">
          <Image
            className="mr-1 inline-block size-5"
            src={`/icons/${project.slug.split('/')[0]}.png`}
            width={20}
            height={20}
            alt={`${project.name} logo`}
          />
          <Link
            href={href}
            className="inline-block text-xs font-medium text-link underline hover:text-blue-550 dark:hover:text-blue-550"
          >
            {project.name}
          </Link>
        </span>
      </div>
    </div>
  )
}
