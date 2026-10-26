import { EtherscanLink } from '~/components/EtherscanLink'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { cn } from '~/utils/cn'

export interface KnownDeployment {
  projectsUsedIn: UsedInProjectWithIcon[]
  url?: string
  address: string
  chainId: string
  /** Display name; the address alone does not say which chain it is on. */
  chain: string
  chainIcon: string
}

interface DeploymentGroup
  extends Pick<
    KnownDeployment,
    'chainId' | 'chain' | 'chainIcon' | 'projectsUsedIn'
  > {
  key: string
  deployments: KnownDeployment[]
}

export function KnownDeployments({
  deployments,
}: {
  deployments: KnownDeployment[]
}) {
  return (
    <div className="space-y-3 px-3 md:px-4">
      <div className="flex items-center gap-1.5 font-bold text-label-value-16">
        Known deployments
        <span className="rounded bg-surface-secondary px-1.5 py-0.5 font-medium text-label-value-12 text-secondary tabular-nums">
          {deployments.length}
        </span>
      </div>
      {groupDeployments(deployments).map((group) => (
        <div key={group.key} className="space-y-2">
          <div className="flex flex-wrap items-center gap-1 font-medium text-label-value-14">
            <span className="text-secondary">Used in</span>
            <ProjectsUsedIn
              noL2ClassName="text-secondary"
              usedIn={group.projectsUsedIn}
            />
            {group.projectsUsedIn.length === 1 && (
              <span>{group.projectsUsedIn[0]?.name}</span>
            )}
            {!isOnEthereum(group) && (
              <span className="inline-flex items-center gap-1 text-secondary">
                ·
                <DeploymentChainIcon deployment={group} />
                {group.chain}
              </span>
            )}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] justify-items-start gap-x-4 gap-y-2">
            {group.deployments.map((deployment) => (
              <EtherscanLink
                key={deployment.address}
                address={deployment.address}
                href={deployment.url}
                className="whitespace-nowrap text-label-value-14"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Nearly every verifier lives on Ethereum, so only the exceptions get a mark.
export function DeploymentChainIcon({
  deployment,
  className,
}: {
  deployment: Pick<KnownDeployment, 'chainId' | 'chain' | 'chainIcon'>
  className?: string
}) {
  if (isOnEthereum(deployment)) return null
  return (
    <img
      src={deployment.chainIcon}
      alt={deployment.chain}
      title={deployment.chain}
      className={cn('size-3.5 shrink-0 rounded-full', className)}
    />
  )
}

function isOnEthereum(deployment: Pick<KnownDeployment, 'chainId'>) {
  return deployment.chainId === 'ethereum'
}

/**
 * Deployments on the same chain used by the same projects share one "Used in"
 * line, so a verifier deployed many times for one project doesn't repeat it.
 */
export function groupDeployments(deployments: KnownDeployment[]) {
  const groups = new Map<string, DeploymentGroup>()
  for (const deployment of deployments) {
    const { chainId, chain, chainIcon, projectsUsedIn } = deployment
    const key = [chain, ...projectsUsedIn.map((p) => p.id).sort()].join(',')
    const group = groups.get(key) ?? {
      key,
      chainId,
      chain,
      chainIcon,
      projectsUsedIn,
      deployments: [],
    }
    group.deployments.push(deployment)
    groups.set(key, group)
  }
  return [...groups.values()]
}
