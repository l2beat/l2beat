import type { ReactNode } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DocumentIcon } from '~/icons/Document'
import { CustomLinkIcon } from '~/icons/Outlink'
import { GithubIcon } from '~/icons/products/Github'
import { YouTubeIcon } from '~/icons/products/Youtube'
import type { SvgIconProps } from '~/icons/SvgIcon'
import { MATERIALS, type MaterialItem, type MaterialKind } from '../materials'
import { SectionHeading } from './SectionHeading'

const MATERIAL_ICONS: Record<MaterialKind, (props: SvgIconProps) => ReactNode> =
  {
    eip: DocumentIcon,
    article: DocumentIcon,
    book: DocumentIcon,
    code: GithubIcon,
    video: YouTubeIcon,
  }

export function MaterialsSection() {
  const articles = MATERIALS.filter((material) => material.kind !== 'video')
  const talks = MATERIALS.filter((material) => material.kind === 'video')

  return (
    <section id="materials" className="mt-8 md:mt-12">
      <SectionHeading
        title="Materials, articles & talks"
        description="Explore native proof verification, the technical book, the original EXECUTE research, and implementation work."
      />

      <GroupLabel>Articles &amp; specs</GroupLabel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((material) => (
          <MaterialCard key={material.label} material={material} />
        ))}
      </div>

      <GroupLabel className="mt-6">Talks</GroupLabel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {talks.map((material) => (
          <MaterialCard key={material.label} material={material} />
        ))}
      </div>
    </section>
  )
}

function GroupLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={`mb-3 font-bold text-heading-16 max-md:px-4 ${className ?? ''}`}
    >
      {children}
    </h3>
  )
}

function MaterialCard({ material }: { material: MaterialItem }) {
  const Icon = MATERIAL_ICONS[material.kind]
  return (
    <a
      href={material.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-brand md:rounded-xl"
    >
      <PrimaryCard className="flex h-full flex-col overflow-hidden p-0 transition-colors group-hover:bg-white/70 md:rounded-xl md:p-0 dark:group-hover:bg-surface-primary-hover">
        {material.kind === 'video' && (
          <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary md:rounded-t-xl">
            <img
              src={`https://img.youtube.com/vi/${material.videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-black/55 text-white">
                <YouTubeIcon className="size-5 fill-current" />
              </span>
            </span>
          </div>
        )}

        <div className="flex grow flex-col p-4 md:p-3.5">
          <div className="flex items-center gap-1.5">
            <Icon className="size-4 shrink-0 fill-purple-100 dark:fill-pink-200" />
            <span className="truncate font-medium text-3xs text-secondary">
              {material.source}
            </span>
            <CustomLinkIcon className="ml-auto shrink-0 fill-secondary transition-colors group-hover:fill-primary" />
          </div>
          <h4 className="mt-2.5 font-bold text-label-value-15 md:text-label-value-16">
            {material.label}
          </h4>
          <p className="mt-1 grow text-2xs text-secondary leading-relaxed md:text-paragraph-14">
            {material.description}
          </p>
        </div>
      </PrimaryCard>
    </a>
  )
}
