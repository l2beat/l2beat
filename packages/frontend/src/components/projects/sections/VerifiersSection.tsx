import type { ProjectZkCatalogInfo, ZkCatalogTag } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { EtherscanLink } from '~/components/EtherscanLink'
import { Markdown } from '~/components/markdown/Markdown'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { ChevronIcon } from '~/icons/Chevron'
import { TechStackTag } from '~/pages/zk-catalog/v2/components/TechStackTag'
import { CountWithAttesters } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import { formatAddress } from '~/utils/formatAddress'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface VerifiersSectionProps extends ProjectSectionProps {
  proofSystemVerifiers: {
    proofSystem: ZkCatalogTag
    verifierHashes: {
      hash: string
      knownDeployments: string[]
      projectsUsedIn: UsedInProjectWithIcon[]
      verificationSteps?: string
      verificationStatus: ProjectZkCatalogInfo['verifierHashes'][number]['verificationStatus']
      attesters:
        | (ZkCatalogAttester & {
            icon: string
          })[]
        | undefined
    }[]
  }[]
}

export function VerifiersSection({
  proofSystemVerifiers,
  as = 'section',
  ...sectionProps
}: VerifiersSectionProps) {
  return (
    <ProjectSection {...sectionProps} as={as} className="space-y-6">
      <p className="text-paragraph-15 md:text-paragraph-16">
        A short description what to expect in this section.
      </p>
      {proofSystemVerifiers.map(({ proofSystem, verifierHashes }) => (
        <div key={proofSystem.id + proofSystem.type} className="space-y-3">
          <div className="flex items-center gap-2">
            <TechStackTag tag={proofSystem} />
            <span className="font-bold text-label-value-18">
              verifier hashes
            </span>
          </div>
          <p className="font-medium text-label-value-16 text-secondary">
            Verifier ID as recorded by the verifier smart contract.
          </p>
          <div className="space-y-2">
            {verifierHashes.map((verifierHash) => (
              <VerifierCollapsibleWithDetails
                key={verifierHash.hash}
                verifierHash={verifierHash}
              />
            ))}
          </div>
        </div>
      ))}
    </ProjectSection>
  )
}

function VerifierCollapsibleWithDetails({
  verifierHash,
}: {
  verifierHash: VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number]
}) {
  return (
    <Collapsible
      key={verifierHash.hash}
      className="group rounded-lg border border-divider"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-3 font-bold">
        <div className="grid w-full grid-cols-[120px_1fr_1fr_140px] gap-4">
          <span className="text-left">{formatAddress(verifierHash.hash)}</span>
          <div className="flex items-center gap-1.5 text-center max-md:hidden">
            <p className="font-medium text-label-value-12 text-secondary">
              Verification
            </p>
            <CountWithAttesters
              count={undefined}
              attesters={verifierHash.attesters}
              type={verifierHash.verificationStatus}
            />
          </div>
          <div className="flex items-center gap-1.5 text-center max-md:hidden">
            <p className="font-medium text-label-value-12 text-secondary">
              Used in
            </p>
            <ProjectsUsedIn
              noL2ClassName="text-label-value-12 font-medium text-secondary"
              usedIn={verifierHash.projectsUsedIn}
            />
          </div>
          <div className="flex items-center gap-1.5 max-md:hidden">
            <div className="font-medium text-label-value-12 text-secondary">
              Known deployments
            </div>
            <div className="font-bold text-label-value-16">
              {verifierHash.knownDeployments.length}
            </div>
          </div>
        </div>
        <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 transition-transform duration-300" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-6">
        <HorizontalSeparator className="mb-4" />
        {verifierHash.knownDeployments.length > 0 && (
          <>
            <div className="space-y-3">
              <div className="font-bold text-label-value-16">
                Known deployments
              </div>
              <div className="space-y-2">
                {verifierHash.knownDeployments.map((deployment, index) => (
                  <div key={deployment} className="space-y-2">
                    <h3 className="font-bold text-label-value-14">{`Deployment #${index + 1}`}</h3>
                    <EtherscanLink href={deployment} address={deployment} />
                  </div>
                ))}
              </div>
            </div>
            {verifierHash.verificationSteps && (
              <HorizontalSeparator className="my-4" />
            )}
          </>
        )}
        {verifierHash.verificationSteps && (
          <div className="space-y-3">
            <div className="font-bold text-label-value-16">
              Verification steps
            </div>
            <Markdown className="text-paragraph-15 md:text-paragraph-16">
              {verifierHash.verificationSteps}
            </Markdown>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
