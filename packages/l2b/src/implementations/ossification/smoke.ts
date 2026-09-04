import { ProjectService } from '@l2beat/config'
import { measureOssification } from '@l2beat/shared'
import { formatSeconds } from '@l2beat/shared-pure'

/** Score and perimeter inspection from the built config package: what the
 *  site would show, minus the TVS exposure (database only). */
export async function runSmoke(ids: string[], perimeter: boolean) {
  const ps = new ProjectService()
  const projects = await ps.getProjects({
    ...(ids.length > 0 ? { ids: ids.map((id) => id as never) } : {}),
    select: ['ossificationInfo'],
  })
  for (const id of ids) {
    if (!projects.some((project) => project.id === id)) {
      console.log(`${id}: no data`)
    }
  }
  for (const project of projects) {
    const result = measureOssification(project.ossificationInfo)
    console.log(
      [
        project.id.padEnd(14),
        `ossification ${String(result.score).padStart(3)}`,
        `lastChange(clock) ${formatSeconds(result.projectAgeSeconds).padEnd(18)}`,
        `lastEvent ${
          result.lastCriticalChangeAgeSeconds !== null
            ? formatSeconds(result.lastCriticalChangeAgeSeconds).padEnd(18)
            : 'never'.padEnd(18)
        }`,
        `rate ${result.criticalChangesPerYear.toFixed(1)}/yr`,
        `events(3y) ${result.clusteredEventCount}`,
        `contracts ${result.contracts.length}`,
      ].join('  '),
    )
    if (perimeter) {
      console.log(
        '  perimeter:',
        result.contracts.map((contract) => contract.name).join(', '),
      )
    }
  }
}
