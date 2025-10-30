import type { ProjectZkCatalogInfo } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TechStackCell } from '../../../components/TechStackCell'
import { TrustedSetupCellTooltip } from '../../../components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '../../../components/VerifiedCountWithDetails'

interface Props {
  project: ProjectZkCatalogEntry
}

export function ProjectZkCatalogSummary({ project }: Props) {
  return (
    <section
      id="summary"
      data-role="nav-section"
      className="w-full border-divider px-4 max-md:border-b md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="md:hidden">
        <TvsStat {...project.header.tvs} />
        <HorizontalSeparator className="my-4" />
      </div>
      <TrustedSetupsByProofSystemSection
        trustedSetupsByProofSystem={project.header.trustedSetupsByProofSystem}
      />
      <HorizontalSeparator className="my-4 md:hidden" />
      <TechStackSection techStack={project.header.techStack} />
      <div className="flex gap-6 md:mt-4">
        <div className="max-md:hidden">
          <TvsStat {...project.header.tvs} />
        </div>
        {project.header.description && (
          <AboutSection
            description={project.header.description}
            className="max-md:hidden"
          />
        )}
      </div>
      <HorizontalSeparator className="-mx-4 mt-4 w-[calc(100%+2rem)] md:hidden" />
      <div className="md:hidden ">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
    </section>
  )
}

export function TrustedSetupsByProofSystemSection({
  trustedSetupsByProofSystem,
}: {
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <h2 className="font-semibold text-subtitle-12 uppercase">
        Trusted Setups
      </h2>
      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {Object.entries(trustedSetupsByProofSystem).map(
          ([key, { trustedSetups, projectsUsedIn, verifiers }]) => {
            const proofSystem = trustedSetups[0]?.proofSystem
            if (trustedSetups.length === 0 || !proofSystem) return null

            return (
              <div key={key} className="flex flex-col gap-3">
                <TrustedSetupCellTooltip
                  trustedSetups={trustedSetups}
                  dotSize="lg"
                />
                <div className="grid grid-cols-[200px_1fr] gap-1">
                  {projectsUsedIn && (
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-label-value-12 text-secondary">
                        Used in
                      </p>
                      <ProjectsUsedIn
                        noL2ClassName="text-label-value-12 font-medium text-secondary"
                        usedIn={projectsUsedIn}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-medium text-label-value-12 text-secondary">
                      Verifiers
                    </p>
                    <VerifiedCountWithDetails data={verifiers} horizontal />
                  </div>
                </div>
              </div>
            )
          },
        )}
      </div>
      {/* Desktop */}
      <div className="rounded-sm border border-divider px-4 max-md:hidden">
        <table className="w-full border-separate border-spacing-y-4">
          <tbody>
            {Object.entries(trustedSetupsByProofSystem).map(
              ([key, { trustedSetups, projectsUsedIn, verifiers }]) => {
                const proofSystem = trustedSetups[0]?.proofSystem
                if (trustedSetups.length === 0 || !proofSystem) return null

                return (
                  <tr key={key} className="h-8 align-middle">
                    <td>
                      <TrustedSetupCellTooltip
                        trustedSetups={trustedSetups}
                        dotSize="lg"
                      />
                    </td>
                    <td>
                      {projectsUsedIn && (
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-label-value-12 text-secondary">
                            Used in
                          </p>
                          <ProjectsUsedIn
                            noL2ClassName="text-label-value-12 font-medium text-secondary"
                            usedIn={projectsUsedIn}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-label-value-12 text-secondary">
                          Verifiers
                        </p>
                        <VerifiedCountWithDetails data={verifiers} horizontal />
                      </div>
                    </td>
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TechStackSection({
  techStack,
}: {
  techStack: ProjectZkCatalogInfo['techStack']
}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <h2 className="font-semibold text-subtitle-12 uppercase">Tech Stack</h2>
      <div className="rounded-sm border-divider md:border md:p-4">
        <TechStackCell
          techStack={techStack}
          className="flex flex-row flex-wrap py-0 max-md:flex-col md:gap-6"
          labelClassName="text-2xs mb-1.5"
          tagWrapperClassName="flex-wrap"
        />
      </div>
    </div>
  )
}

function TvsStat({ value, change }: { value: number; change: number }) {
  return (
    <ProjectSummaryStat
      title={
        <div className="font-semibold text-subtitle-12">
          <span className="md:hidden">Total Value Secured</span>
          <span className="max-md:hidden">TVS</span>
        </div>
      }
      className="w-full md:gap-2"
      value={
        value ? (
          <span className="mb-0.5 flex items-center gap-2">
            <ValueWithPercentageChange
              className="!text-base !font-medium !leading-[100%] text-nowrap"
              changeClassName="text-label-value-14 font-bold"
              change={change}
            >
              {formatCurrency(value, 'usd')}
            </ValueWithPercentageChange>
          </span>
        ) : (
          <NoDataBadge />
        )
      }
    />
  )
}
