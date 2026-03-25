import type { ProjectZkCatalogInfo } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { FilledArrowIcon } from '~/icons/FilledArrow'
import { InfoIcon } from '~/icons/Info'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TechStackCell } from '../../../components/TechStackCell'
import { TrustedSetupCell } from '../../../components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '../../../components/VerifiedCountWithDetails'

interface Props {
  project: ProjectZkCatalogEntry
}

export function ProjectZkCatalogSummary({ project }: Props) {
  return (
    <section
      id="summary"
      data-role="nav-section"
      className="w-full scroll-mt-[100vh] border-divider px-4 max-md:border-b md:rounded-lg md:bg-surface-primary md:p-6"
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
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
    </section>
  )
}

export function TrustedSetupsByProofSystemSection({
  trustedSetupsByProofSystem,
  variant = 'zkCatalog',
}: {
  trustedSetupsByProofSystem: TrustedSetupsByProofSystem
  variant?: 'zkCatalog' | 'scaling'
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <h2 className="font-semibold text-subtitle-12 uppercase">
        Trusted Setups
      </h2>
      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {Object.entries(trustedSetupsByProofSystem).map(
          ([
            key,
            { trustedSetups, projectsUsedIn, verifiers, onchainVerifiers },
          ]) => {
            const proofSystem = trustedSetups[0]?.proofSystem
            if (trustedSetups.length === 0 || !proofSystem) return null

            return (
              <div key={key} className="flex flex-col gap-3">
                <TrustedSetupCell
                  trustedSetups={trustedSetups}
                  dotSize="lg"
                  displayType={
                    variant === 'scaling' ? 'typeAndName' : undefined
                  }
                />
                <MobileTrustedSetupsDetails
                  variant={variant}
                  onchainVerifiers={onchainVerifiers}
                  projectsUsedIn={projectsUsedIn}
                  verifiers={verifiers}
                />
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
              ([
                key,
                { trustedSetups, projectsUsedIn, verifiers, onchainVerifiers },
              ]) => {
                const proofSystem = trustedSetups[0]?.proofSystem
                if (trustedSetups.length === 0 || !proofSystem) return null

                return (
                  <tr
                    key={key}
                    className={
                      variant === 'scaling' ? 'align-top' : 'h-8 align-middle'
                    }
                  >
                    <td
                      className={
                        variant === 'scaling' ? 'align-top' : undefined
                      }
                    >
                      <TrustedSetupCell
                        trustedSetups={trustedSetups}
                        dotSize="lg"
                        displayType={
                          variant === 'scaling' ? 'typeAndName' : undefined
                        }
                      />
                    </td>
                    <DesktopTrustedSetupsCells
                      variant={variant}
                      onchainVerifiers={onchainVerifiers}
                      projectsUsedIn={projectsUsedIn}
                      verifiers={verifiers}
                    />
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

function MobileTrustedSetupsDetails({
  variant,
  onchainVerifiers,
  projectsUsedIn,
  verifiers,
}: {
  variant: 'zkCatalog' | 'scaling'
  onchainVerifiers: TrustedSetupsByProofSystem[string]['onchainVerifiers']
  projectsUsedIn: TrustedSetupsByProofSystem[string]['projectsUsedIn']
  verifiers: TrustedSetupsByProofSystem[string]['verifiers']
}) {
  if (variant === 'scaling') {
    return (
      <>
        <MergedOnchainVerifierBlock
          onchainVerifiers={onchainVerifiers}
          verifiers={verifiers}
        />
        <UsedInBlock projectsUsedIn={projectsUsedIn} />
      </>
    )
  }

  return (
    <div className="grid grid-cols-[200px_1fr] gap-1">
      <OnchainVerifierBlock onchainVerifiers={onchainVerifiers} mobile />
      <UsedInBlock projectsUsedIn={projectsUsedIn} mobile />
      <VerifierStatusBlock verifiers={verifiers} mobile />
    </div>
  )
}

function DesktopTrustedSetupsCells({
  variant,
  onchainVerifiers,
  projectsUsedIn,
  verifiers,
}: {
  variant: 'zkCatalog' | 'scaling'
  onchainVerifiers: TrustedSetupsByProofSystem[string]['onchainVerifiers']
  projectsUsedIn: TrustedSetupsByProofSystem[string]['projectsUsedIn']
  verifiers: TrustedSetupsByProofSystem[string]['verifiers']
}) {
  if (variant === 'scaling') {
    return (
      <>
        <td className="min-w-0 align-top">
          <MergedOnchainVerifierBlock
            onchainVerifiers={onchainVerifiers}
            verifiers={verifiers}
          />
        </td>
        <td className="align-top">
          <UsedInBlock projectsUsedIn={projectsUsedIn} stacked />
        </td>
      </>
    )
  }

  return (
    <>
      <td>
        <OnchainVerifierBlock onchainVerifiers={onchainVerifiers} />
      </td>
      <td>
        <UsedInBlock projectsUsedIn={projectsUsedIn} />
      </td>
      <td>
        <VerifierStatusBlock verifiers={verifiers} />
      </td>
    </>
  )
}

function OnchainVerifierBlock({
  onchainVerifiers,
  mobile = false,
}: {
  onchainVerifiers: TrustedSetupsByProofSystem[string]['onchainVerifiers']
  mobile?: boolean
}) {
  if (!onchainVerifiers?.length) return null

  return (
    <div
      className={mobile ? 'flex flex-col gap-1.5' : 'flex items-center gap-2'}
    >
      <p className="font-medium text-label-value-12 text-secondary">
        Onchain verifier
      </p>
      <OnchainVerifiers onchainVerifiers={onchainVerifiers} />
    </div>
  )
}

function UsedInBlock({
  projectsUsedIn,
  mobile = false,
  stacked = false,
}: {
  projectsUsedIn: TrustedSetupsByProofSystem[string]['projectsUsedIn']
  mobile?: boolean
  stacked?: boolean
}) {
  if (!projectsUsedIn.length) return null

  return (
    <div
      className={
        mobile || stacked ? 'flex flex-col gap-2' : 'flex items-center gap-1.5'
      }
    >
      <p className="font-medium text-label-value-12 text-secondary">Used in</p>
      <ProjectsUsedIn
        noL2ClassName="text-label-value-12 font-medium text-secondary"
        usedIn={projectsUsedIn}
      />
    </div>
  )
}

function VerifierStatusBlock({
  verifiers,
  mobile = false,
}: {
  verifiers: TrustedSetupsByProofSystem[string]['verifiers']
  mobile?: boolean
}) {
  return (
    <div
      className={mobile ? 'flex flex-col gap-1.5' : 'flex items-center gap-2'}
    >
      <p className="font-medium text-label-value-12 text-secondary">
        Verifiers
      </p>
      <VerifiedCountWithDetails data={verifiers} horizontal />
    </div>
  )
}

function verifierTotalCount(
  verifiers: TrustedSetupsByProofSystem[string]['verifiers'],
) {
  return (
    (verifiers.successful?.count ?? 0) +
    (verifiers.unsuccessful?.count ?? 0) +
    (verifiers.notVerified?.count ?? 0)
  )
}

function MergedOnchainVerifierBlock({
  onchainVerifiers,
  verifiers,
}: {
  onchainVerifiers: TrustedSetupsByProofSystem[string]['onchainVerifiers']
  verifiers: TrustedSetupsByProofSystem[string]['verifiers']
}) {
  const hasOnchain = !!onchainVerifiers?.length
  const totalVerifiers = verifierTotalCount(verifiers)

  if (!hasOnchain && totalVerifiers === 0) {
    return null
  }

  const title = hasOnchain ? 'Onchain verifier' : 'Verifiers'

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <p className="font-medium text-label-value-12 text-secondary">
          {title}
        </p>
        <Tooltip>
          <TooltipTrigger type="button" className="text-secondary">
            <InfoIcon className="size-3.5" variant="gray" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {hasOnchain
              ? 'Onchain verifier contract links and attestation status for reported verifier hashes.'
              : 'Attestation status for reported verifier hashes.'}
          </TooltipContent>
        </Tooltip>
      </div>
      {hasOnchain && onchainVerifiers ? (
        <div className="flex min-w-0 flex-col gap-1.5">
          {onchainVerifiers.map((verifier) => (
            <div
              key={verifier.href}
              className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-label-value-14"
            >
              <CustomLink href={verifier.href}>{verifier.name}</CustomLink>
              <VerifiedCountWithDetails
                data={verifier.verifiers}
                horizontal
                hideCount
              />
            </div>
          ))}
        </div>
      ) : (
        totalVerifiers > 0 && (
          <VerifiedCountWithDetails data={verifiers} horizontal hideCount />
        )
      )}
    </div>
  )
}

function OnchainVerifiers({
  onchainVerifiers,
}: {
  onchainVerifiers: NonNullable<
    TrustedSetupsByProofSystem[string]['onchainVerifiers']
  >
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label-value-14">
      {onchainVerifiers.map((verifier, index) => (
        <span key={verifier.href}>
          <CustomLink href={verifier.href}>{verifier.name}</CustomLink>
          {index < onchainVerifiers.length - 1 && (
            <span className="text-secondary">,</span>
          )}
        </span>
      ))}
    </div>
  )
}

function TechStackSection({
  techStack,
}: {
  techStack: ProjectZkCatalogInfo['techStack']
}) {
  const { finalWrap, zkVM, snark } = techStack

  const leftSideEmpty = !(zkVM?.length || snark?.length)
  const rightSideEmpty = !finalWrap?.length

  return (
    <div className="mt-3 flex flex-col gap-2">
      <h2 className="font-semibold text-subtitle-12 uppercase">Tech Stack</h2>
      <div className="flex gap-2 rounded-sm border-divider max-md:flex-col md:items-end md:border md:p-4">
        {!leftSideEmpty && (
          <div className="flex flex-col">
            <span className="font-medium text-label-value-12 text-secondary">
              zkVM
            </span>
            <TechStackCell
              tags={[...(techStack.zkVM ?? []), ...(techStack.snark ?? [])]}
              className="flex-wrap md:min-w-fit"
            />
          </div>
        )}
        {!leftSideEmpty && !rightSideEmpty && (
          <FilledArrowIcon className="mb-2.5 fill-secondary max-md:hidden" />
        )}
        {!rightSideEmpty && (
          <div className="flex flex-col">
            <span className="font-medium text-label-value-12 text-secondary">
              Final wrap
            </span>
            <TechStackCell
              tags={techStack.finalWrap ?? []}
              className="flex-wrap"
            />
          </div>
        )}
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
