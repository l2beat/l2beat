import type { ProjectZkCatalogInfo, ZkCatalogTag } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { EtherscanLink } from '~/components/EtherscanLink'
import { Markdown } from '~/components/markdown/Markdown'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { VerifiersTable } from './table/VerifiersTable'

export interface VerifiersSectionProps extends ProjectSectionProps {
  proofSystemVerifiers: {
    proofSystem: ZkCatalogTag
    verifierHashes: {
      hash: string
      description?: string
      knownDeployments: {
        projectsUsedIn: UsedInProjectWithIcon[]
        url?: string
        address: string
      }[]
      projectsUsedIn: UsedInProjectWithIcon[]
      verificationSteps?: string
      verificationStatus: ProjectZkCatalogInfo['verifierHashes'][number]['verificationStatus']
      attesters:
        | (ZkCatalogAttester & {
            icon: string
            iconDark?: string
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
        List of different onchain verifiers for this proving system. Unique ID
        distinguishes differents deployments of the same verifier from different
        verifiers (e.g. different versions).
      </p>
      {proofSystemVerifiers.map(({ proofSystem, verifierHashes }) => (
        <VerifiersTable
          key={proofSystem.id + proofSystem.type}
          entries={verifierHashes.map((verifierHash) => ({
            ...verifierHash,
            proofSystem,
          }))}
        />
      ))}
    </ProjectSection>
  )
}

export function VerifierRowDetails({
  verifierHash,
}: {
  verifierHash: VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number]
}) {
  return (
    <div className="p-4 pt-0">
      <HorizontalSeparator className="mb-4" />
      {verifierHash.knownDeployments.length > 0 && (
        <>
          <div className="space-y-3">
            <p className="text-paragraph-14 text-secondary">
              {verifierHash.description ??
                'Verifier ID as recorded by the verifier smart contract.'}
            </p>
            <div className="font-bold text-label-value-16">
              Known deployments
            </div>
            <div className="space-y-3">
              {verifierHash.knownDeployments.map((deployment, index) => (
                <div key={deployment.url} className="space-y-2">
                  <h3 className="font-bold text-label-value-14">{`Deployment #${index + 1}`}</h3>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-label-value-14 text-secondary">
                      Address:
                    </span>
                    <EtherscanLink
                      address={deployment.address}
                      href={deployment.url}
                      className="text-label-value-14"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-label-value-14 text-secondary">
                      Used in:
                    </span>
                    <ProjectsUsedIn
                      noL2ClassName="text-label-value-14 font-medium text-secondary"
                      usedIn={deployment.projectsUsedIn}
                    />
                  </div>
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
          <Markdown className="min-w-0 text-paragraph-15 md:text-paragraph-16">
            {verifierHash.verificationSteps}
          </Markdown>
        </div>
      )}
    </div>
  )
}
