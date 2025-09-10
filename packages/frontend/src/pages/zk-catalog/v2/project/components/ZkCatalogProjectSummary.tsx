import React from 'react'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/getTrustedSetupsWithVerifiersAndAttesters'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
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
      <TrustedSetupsByProofSystem
        trustedSetupsByProofSystem={project.header.trustedSetupsByProofSystem}
      />
      {project.header.description && (
        <AboutSection description={project.header.description} />
      )}
    </section>
  )
}

function TrustedSetupsByProofSystem({
  trustedSetupsByProofSystem,
}: {
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-base">
      <h2 className="font-semibold text-subtitle-12 uppercase max-md:hidden">
        Trusted Setups
      </h2>
      <div className="grid grid-cols-3 gap-y-4 rounded-sm border border-divider p-4">
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
                <VerifiedCountWithDetails data={verifiers} />
              </React.Fragment>
            )
          },
        )}
      </div>
    </div>
  )
}
