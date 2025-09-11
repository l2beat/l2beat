import type { ProjectZkCatalogInfo } from '@l2beat/config'
import React from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TechStackCell } from '../../components/TechStackCell'
import { TrustedSetupCellTooltip } from '../../components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '../../components/VerifiedCountWithDetails'

interface Props {
  project: ProjectZkCatalogEntry
}

export function ProjectZkCatalogSummary({ project }: Props) {
  return (
    <section
      id="summary"
      data-role="project-section"
      className="w-full border-divider px-4 max-md:border-b md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
      <TrustedSetupsByProofSystemSection
        trustedSetupsByProofSystem={project.header.trustedSetupsByProofSystem}
      />
      <TechStackSection techStack={project.header.techStack} />
      <div className="mt-4 flex gap-6">
        <TvsStat {...project.header.tvs} />
        {project.header.description && (
          <AboutSection description={project.header.description} />
        )}
      </div>
    </section>
  )
}

function TrustedSetupsByProofSystemSection({
  trustedSetupsByProofSystem,
}: {
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-subtitle-12 uppercase max-md:hidden">
        Trusted Setups
      </h2>
      <div className="grid grid-cols-3 gap-x-1 gap-y-4 rounded-sm border border-divider p-4">
        {Object.entries(trustedSetupsByProofSystem).map(
          ([key, { trustedSetups, projectsUsedIn, verifiers }]) => {
            const proofSystem = trustedSetups[0]?.proofSystem
            if (trustedSetups.length === 0 || !proofSystem) return null

            return (
              <React.Fragment key={key}>
                <TrustedSetupCellTooltip trustedSetups={trustedSetups} />
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
                <div className="flex items-center gap-2">
                  <p className="font-medium text-label-value-12 text-secondary">
                    Verifiers
                  </p>
                  <VerifiedCountWithDetails data={verifiers} horizontal />
                </div>
              </React.Fragment>
            )
          },
        )}
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
      <h2 className="font-semibold text-subtitle-12 uppercase max-md:hidden">
        Tech Stack
      </h2>
      <div className="rounded-sm border border-divider p-4">
        <TechStackCell
          techStack={techStack}
          className="flex flex-row flex-wrap gap-6"
        />
      </div>
    </div>
  )
}

function TvsStat({ value, change }: { value: number; change: number }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-secondary text-subtitle-12">TVS</span>
      {value ? (
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
      )}
    </div>
  )
}
