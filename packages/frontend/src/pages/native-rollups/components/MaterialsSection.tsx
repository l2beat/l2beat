import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { YouTubeIcon } from '~/icons/products/Youtube'
import {
  getMaterialIcon,
  getYouTubeThumbnail,
  MATERIALS,
  type MaterialItem,
} from '../consts'
import { SectionHeading } from './WhyNativeSection'

export function MaterialsSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="Learn more"
        title="Materials, articles & talks"
        description="Everything you need to go deeper — the spec, the founding research, the proof-of-concept, and recorded talks."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MATERIALS.map((material) => (
          <MaterialCard key={material.label} material={material} />
        ))}
      </div>
    </section>
  )
}

function MaterialCard({ material }: { material: MaterialItem }) {
  const Icon = getMaterialIcon(material.kind)
  return (
    <a
      href={material.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block overflow-hidden rounded-xl"
    >
      <PrimaryCard className="flex h-full flex-col rounded-xl border border-divider p-0 transition-colors duration-300 group-hover:border-purple-100/50 md:p-0 dark:group-hover:border-pink-200/50">
        {/* Shine sweep on hover */}
        <span className="-translate-x-full pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

        {material.videoId && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-surface-secondary">
            <img
              src={getYouTubeThumbnail(material.videoId)}
              alt={material.label}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
            {/* Play button */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <YouTubeIcon className="size-6 fill-current" />
              </span>
            </span>
          </div>
        )}

        <div className="flex grow flex-col p-4 md:p-6">
          <div className="flex items-start justify-between gap-3">
            {!material.videoId && (
              <span className="flex size-10 items-center justify-center rounded-lg bg-surface-secondary text-purple-100 transition-colors duration-300 group-hover:bg-linear-to-br group-hover:from-purple-100 group-hover:to-pink-100 group-hover:text-white dark:text-pink-200">
                <Icon className="size-5 fill-current" />
              </span>
            )}
            <CustomLinkIcon className="mt-1 ml-auto fill-secondary transition-colors group-hover:fill-primary" />
          </div>
          <h3 className="mt-4 font-bold text-label-value-16 md:text-label-value-18">
            {material.label}
          </h3>
          <p className="mt-1.5 grow text-paragraph-15 text-secondary">
            {material.description}
          </p>
          <span className="mt-4 font-medium text-2xs text-secondary uppercase tracking-[0.14px]">
            {material.source}
          </span>
        </div>
      </PrimaryCard>
    </a>
  )
}
