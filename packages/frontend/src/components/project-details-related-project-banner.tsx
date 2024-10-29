import Image from 'next/image'
import Link from 'next/link'

export type ProjectDetailsRelatedProjectBannerProps = {
  text: string
  project: {
    name: string
    type: 'scaling' | 'bridges'
    slug: string
  }
}

export function ProjectDetailsRelatedProjectBanner({
  text,
  project,
}: ProjectDetailsRelatedProjectBannerProps) {
  const href = `/${project.type}/projects/${project.slug}` as const

  return (
    <div className="flex w-full items-center rounded-lg bg-gray-200 px-4 py-2 text-xs font-medium dark:bg-zinc-800">
      <div>
        {text}{' '}
        <span className="inline-block">
          <Image
            className="mr-1 inline-block size-5"
            src={`/icons/${project.slug}.png`}
            width={20}
            height={20}
            alt={`${project.name} logo`}
          />
          <Link
            href={href}
            className="inline-block text-xs font-medium text-blue-700 underline hover:text-blue-550 dark:text-blue-500 dark:hover:text-blue-550"
          >
            {project.name}
          </Link>
        </span>
      </div>
    </div>
  )
}
