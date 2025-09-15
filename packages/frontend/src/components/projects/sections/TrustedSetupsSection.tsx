import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import React from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Markdown } from '~/components/markdown/Markdown'
import { TechStackTag } from '~/pages/zk-catalog/v2/components/TechStackTag'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface TrustedSetupSectionProps extends ProjectSectionProps {
  trustedSetups: {
    name: TrustedSetup['name']
    risk: TrustedSetup['risk']
    description: TrustedSetup['longDescription']
    proofSystems: ZkCatalogTag[]
  }[]
}

export function TrustedSetupSection({
  trustedSetups,
  as = 'section',
  ...sectionProps
}: TrustedSetupSectionProps) {
  return (
    <ProjectSection {...sectionProps} as={as}>
      <div className="flex flex-col">
        {trustedSetups.map((trustedSetup, index) => {
          return (
            <React.Fragment key={trustedSetup.name}>
              <div className="space-y-3">
                <h3 className="font-bold text-heading-16">
                  {trustedSetup.name}
                </h3>
                <div className="flex items-center gap-2">
                  {trustedSetup.risk === 'N/A' ? (
                    <span className="text-2xl leading-none">🤩</span>
                  ) : (
                    <TrustedSetupRiskDot risk={trustedSetup.risk} size="lg" />
                  )}
                  <div className="flex gap-1">
                    {trustedSetup.proofSystems.map((proofSystem) => (
                      <TechStackTag
                        key={proofSystem.type + proofSystem.name}
                        tag={proofSystem}
                        withoutTooltip
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-secondary text-subtitle-12 uppercase">
                    Detailed description
                  </h3>
                  <Markdown className="word-break-word text-paragraph-15 md:text-paragraph-16">
                    {trustedSetup.description}
                  </Markdown>
                </div>
              </div>
              {index !== trustedSetups.length - 1 && (
                <HorizontalSeparator className="my-4" />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </ProjectSection>
  )
}
