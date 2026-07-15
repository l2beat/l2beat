import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { YouTubeIcon } from '~/icons/products/Youtube'
import {
  getMaterialIcon,
  getYouTubeThumbnail,
  MATERIALS,
  type MaterialItem,
} from '../consts'
import { SectionHeading } from './SectionHeading'

export function MaterialsSection() {
  const articles = MATERIALS.filter((m) => !m.videoId)
  const talks = MATERIALS.filter((m) => m.videoId)

  return (
    <section id="materials" className="mt-8 mb-4 md:mt-12 md:mb-8">
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
  const Icon = getMaterialIcon(material.kind)
  return (
    <a
      href={material.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-brand md:rounded-xl"
    >
      <PrimaryCard className="flex h-full flex-col overflow-hidden border-divider p-0 transition-colors group-hover:border-purple-100/50 md:rounded-xl md:border md:p-0 dark:group-hover:border-pink-200/50">
        {material.videoId && (
          <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary md:rounded-t-xl">
            <img
              src={getYouTubeThumbnail(material.videoId)}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-black/55 text-white">
                <YouTubeIcon className="size-5 fill-current" />
              </span>
            </span>
          </div>
        )}

        <div className="flex grow flex-col p-4 md:p-3.5">
          <div className="flex items-start justify-between gap-3">
            {!material.videoId && (
              <span className="flex size-8 items-center justify-center rounded-lg bg-surface-secondary text-purple-100 dark:text-pink-200">
                <Icon className="size-4 fill-current" />
              </span>
            )}
            <CustomLinkIcon className="mt-0.5 ml-auto fill-secondary transition-colors group-hover:fill-primary" />
          </div>
          <h4 className="mt-2.5 font-bold text-label-value-15 md:text-label-value-16">
            {material.label}
          </h4>
          <p className="mt-1 grow text-2xs text-secondary leading-relaxed md:text-paragraph-14">
            {material.description}
          </p>
          <span className="mt-2.5 font-medium text-3xs text-secondary">
            {material.source}
          </span>
        </div>
      </PrimaryCard>
    </a>
  )
}
