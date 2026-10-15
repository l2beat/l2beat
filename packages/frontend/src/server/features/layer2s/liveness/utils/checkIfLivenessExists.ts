import {
  TrackedTxsConfigSubtype,
  TrackedTxsConfigSubtypeValues,
  type UnixTime,
} from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { createProjectDataCheck } from '~/server/features/utils/createProjectDataCheck'
import { ps } from '~/server/projects'

export async function checkIfLivenessExists(
  projectId: string,
  subtype: TrackedTxsConfigSubtype,
  fromInclusive: UnixTime | undefined,
): Promise<boolean> {
  return await check(toKey({ projectId, subtype }), fromInclusive)
}

const check = createProjectDataCheck({
  name: 'checkIfLivenessExists',
  getCandidates: async () => {
    const projects = await ps.getProjects({ where: ['trackedTxsConfig'] })
    return projects.flatMap((p) =>
      TrackedTxsConfigSubtypeValues.map((subtype) =>
        toKey({ projectId: p.id, subtype }),
      ),
    )
  },
  getKeysWithData: async (keys, fromInclusive) => {
    const entries = await getDb().aggregatedLiveness.getProjectSubtypesWithData(
      keys.map(fromKey),
      fromInclusive,
    )
    return entries.map(toKey)
  },
})

interface ProjectSubtype {
  projectId: string
  subtype: TrackedTxsConfigSubtype
}

function toKey({ projectId, subtype }: ProjectSubtype): string {
  return `${projectId}:${subtype}`
}

function fromKey(key: string): ProjectSubtype {
  const separator = key.lastIndexOf(':')
  return {
    projectId: key.slice(0, separator),
    subtype: TrackedTxsConfigSubtype.parse(key.slice(separator + 1)),
  }
}
