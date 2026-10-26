import { EtherscanLink } from '~/components/EtherscanLink'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import type { VerifiersSectionProps } from './VerifiersSection'

type Deployment =
  VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number]['knownDeployments'][number]

export function KnownDeployments({
  deployments,
}: {
  deployments: Deployment[]
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
            <span className="text-secondary">· {group.chain}</span>
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

/**
 * Deployments on the same chain used by the same projects share one "Used in"
 * line, so a verifier deployed many times for one project doesn't repeat it.
 */
export function groupDeployments(deployments: Deployment[]) {
  const groups = new Map<
    string,
    Pick<Deployment, 'chain' | 'projectsUsedIn'> & {
      key: string
      deployments: Deployment[]
    }
  >()
  for (const deployment of deployments) {
    const usedInKey = deployment.projectsUsedIn
      .map((project) => project.id)
      .sort()
      .join(',')
    const key = `${deployment.chain}|${usedInKey}`
    const group = groups.get(key)
    if (group) {
      group.deployments.push(deployment)
    } else {
      groups.set(key, {
        key,
        chain: deployment.chain,
        projectsUsedIn: deployment.projectsUsedIn,
        deployments: [deployment],
      })
    }
  }
  return [...groups.values()]
}
