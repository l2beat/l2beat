import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import {
  getIconPreviewEntries,
  ICON_PREVIEW_CATEGORIES,
} from './utils/getIconPreviewEntries'

export function IconPreviewPage(props: AppLayoutProps) {
  const entries = getIconPreviewEntries()

  return (
    <AppLayout {...props}>
      <SideNavLayout maxWidth="wide">
        <MainPageHeader>Icon Preview</MainPageHeader>
        {entries.length === 0 ? (
          <PrimaryCard className="mt-6">
            <p className="font-bold text-lg text-primary">
              Icon preview is available only under the Vite development server.
            </p>
            <p className="mt-2 max-w-2xl text-secondary">
              Start the frontend in local development and open{' '}
              <code>/dev/icons</code> to inspect the icon registry.
            </p>
          </PrimaryCard>
        ) : (
          <div className="mt-6 space-y-6">
            {ICON_PREVIEW_CATEGORIES.map((category) => {
              const categoryEntries = entries.filter(
                (entry) => entry.category === category,
              )

              if (categoryEntries.length === 0) {
                return null
              }

              return (
                <section key={category}>
                  <div className="mb-3 flex items-center justify-between px-4 md:px-1">
                    <h2 className="font-bold text-primary text-xl">
                      {category}
                    </h2>
                    <span className="font-medium text-2xs text-secondary uppercase tracking-[0.08em]">
                      {categoryEntries.length} icons
                    </span>
                  </div>
                  <div className="grid gap-px overflow-hidden rounded-xl border border-divider bg-divider sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {categoryEntries.map((entry) => {
                      const Icon = entry.Component

                      return (
                        <article
                          key={`${entry.sourcePath}:${entry.exportName}`}
                          className="group flex min-h-[280px] flex-col bg-surface-primary p-4 transition-colors hover:bg-surface-secondary"
                        >
                          <div className="flex min-h-44 items-center justify-center rounded-lg border border-divider bg-surface-secondary p-6 transition-colors group-hover:bg-surface-tertiary">
                            <div className="flex items-center justify-center text-primary [&>svg]:size-12">
                              <Icon aria-hidden />
                            </div>
                          </div>
                          <div className="mt-4 flex grow flex-col justify-between gap-3">
                            <div>
                              <p className="font-semibold text-base text-primary leading-tight">
                                {entry.exportName}
                              </p>
                              <p className="mt-1 font-mono text-2xs text-secondary leading-relaxed">
                                {entry.sourcePath}
                              </p>
                            </div>
                            <p className="font-medium text-3xs text-secondary uppercase tracking-[0.08em]">
                              {category}
                            </p>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </SideNavLayout>
    </AppLayout>
  )
}
