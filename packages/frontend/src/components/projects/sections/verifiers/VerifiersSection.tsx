import type { ProjectZkCatalogInfo, ZkCatalogTag } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { EtherscanLink } from '~/components/EtherscanLink'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { TechStackTag } from '~/pages/zk-catalog/v2/components/TechStackTag'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { VerifiersTable } from './table/VerifiersTable'

export interface VerifiersSectionProps extends ProjectSectionProps {
  proofSystemVerifiers: {
    proofSystem: ZkCatalogTag
    verifierHashes: {
      name: string
      sourceLink?: string
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
        <div key={proofSystem.id + proofSystem.type}>
          <TechStackTag
            className="mb-2 w-fit"
            tag={proofSystem}
            displayType="typeAndName"
          />
          <p className="text-paragraph-14 text-secondary">
            {proofSystem.description ??
              'Verifier ID as recorded by the verifier smart contract.'}
          </p>
          <VerifiersTable
            entries={verifierHashes.map((verifierHash) => ({
              ...verifierHash,
              proofSystem,
            }))}
          />
        </div>
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
    <div className="min-w-0 pb-4">
      <HorizontalSeparator className="mb-4" />
      <div className="space-y-3 px-3 md:px-4">
        {verifierHash.description && (
          <div className="space-y-2">
            <div className="font-bold text-label-value-16">Description</div>
            <p className="text-paragraph-14 text-secondary md:text-paragraph-15">
              {verifierHash.description}
            </p>
          </div>
        )}
        <div className="flex min-w-0 items-start gap-1">
          <span className="shrink-0 font-medium text-label-value-14 text-secondary">
            Verifier ID:
          </span>
          <code className="min-w-0 break-all text-label-value-14">
            {verifierHash.hash}
          </code>
        </div>
        {verifierHash.sourceLink && (
          <div className="flex min-w-0 items-start gap-1">
            <span className="shrink-0 font-medium text-label-value-14 text-secondary">
              Source:
            </span>
            <CustomLink
              href={verifierHash.sourceLink}
              className="min-w-0 break-all text-label-value-14"
            >
              {verifierHash.sourceLink}
            </CustomLink>
          </div>
        )}
      </div>
      {(verifierHash.knownDeployments.length > 0 ||
        verifierHash.verificationSteps) && (
        <HorizontalSeparator className="my-4" />
      )}
      {verifierHash.knownDeployments.length > 0 && (
        <div className="space-y-3 px-3 md:px-4">
          <div className="font-bold text-label-value-16">Known deployments</div>
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
      )}
      {verifierHash.knownDeployments.length > 0 &&
        verifierHash.verificationSteps && (
          <HorizontalSeparator className="my-4" />
        )}
      {verifierHash.verificationSteps && (
        <div className="space-y-3 px-3 md:px-4">
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
