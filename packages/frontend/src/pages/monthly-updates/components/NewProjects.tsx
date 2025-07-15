import { StageBadge } from '~/components/badge/StageBadge'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumber } from '~/utils/number-format/formatNumber'

interface Props {
  newProjects: EcosystemMonthlyUpdateEntry['newProjects']
}

export function NewProjects({ newProjects }: Props) {
  return (
    <div className="mt-6 rounded-lg border border-divider px-6 pt-5 pb-1">
      <h2 className="font-bold text-xl leading-none">
        New projects joined the ecosystem
      </h2>
      <div>
        {newProjects.map((p) => (
          <NewProject key={p.id} project={p} />
        ))}
      </div>
    </div>
  )
}

function NewProject({
  project,
}: {
  project: EcosystemMonthlyUpdateEntry['newProjects'][number]
}) {
  return (
    <div
      key={project.id}
      className="border-divider border-t py-4 first:border-t-0"
    >
      {/* Desktop */}
      <div className="max-md:hidden">
        <div className="grid grid-cols-5 items-center text-sm">
          <a
            className="flex w-fit items-center gap-2 rounded-[4px] p-1 hover:bg-primary/10"
            href={`/scaling/projects/${project.slug}`}
          >
            <img src={`/icons/${project.id}.png`} className="size-5" />
            <span className="font-bold text-sm">{project.name}</span>
          </a>
          <span className="font-medium">{project.category}</span>
          <StageBadge
            stage={project.stage.stage}
            isAppchain={project.isAppchain}
          />
          <div className="flex items-baseline gap-0.5 font-medium text-[13px] text-secondary">
            TVS:
            <span className="font-bold text-primary text-sm">
              {project.tvs ? formatCurrency(project.tvs, 'usd') : '-'}
            </span>
          </div>
          <div className="flex items-baseline gap-0.5 font-medium text-[13px] text-secondary">
            UOPS:
            <span className="font-bold text-primary text-sm">
              {project.uops ? formatNumber(project.uops) : '-'}
            </span>
          </div>
        </div>
        <div className="mt-5 flex h-full items-start gap-4">
          {project.badges.length > 0 && (
            <BadgesSection badges={project.badges} hideTitle />
          )}
          <div className="text-sm">{project.description}</div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center gap-2">
          <img src={`/icons/${project.id}.png`} className="size-5" />
          <span className="font-bold text-sm">{project.name}</span>
        </div>
        {project.badges.length > 0 && (
          <div className="mt-3">
            <BadgesSection badges={project.badges} hideTitle />
          </div>
        )}
        <div className="mt-3 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-[13px] text-secondary">
              Type:
            </span>
            <span className="font-bold text-sm">{project.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-[13px] text-secondary">
              Stage:
            </span>
            <StageBadge
              stage={project.stage.stage}
              isAppchain={project.isAppchain}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-[13px] text-secondary">TVS:</span>
            <span className="font-bold text-sm">
              {project.tvs ? formatCurrency(project.tvs, 'usd') : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-[13px] text-secondary">
              UOPS:
            </span>
            <span className="font-bold text-sm">
              {project.uops ? formatNumber(project.uops) : '-'}
            </span>
          </div>
          <div className="font-normal text-xs">{project.description}</div>
        </div>
      </div>
    </div>
  )
}
