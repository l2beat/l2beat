import {
  bridges,
  daLayers,
  getDaProjectKey,
  layer2s,
  layer3s,
} from '../../src/'
import { PROJECTS_OUTPUT_PATH, loadVerifiedJson } from './output'

describe('checkVerifiedContracts:projects', () => {
  function verifyProjects(
    projectNames: string[],
    verified: Record<string, boolean>,
  ) {
    for (const project of projectNames) {
      if (verified[project] === undefined) {
        throw new Error(
          `Not all projects have been checked for verification.\nGo to packages/config and run pnpm check-verified-contracts\nThe missing project is ${project}`,
        )
      }
    }
  }

  it('all current L2BEAT projects are included in verified.json', async () => {
    const projects = [...bridges, ...layer2s, ...layer3s]
    const verifiedJson = await loadVerifiedJson(PROJECTS_OUTPUT_PATH)

    verifyProjects(
      projects.map((p) => p.id.toString()),
      verifiedJson,
    )
  })

  it('all current DABEAT projects are included in verified.json', async () => {
    const verifiedJson = await loadVerifiedJson(PROJECTS_OUTPUT_PATH)
    const keys = []
    for (const daLayer of daLayers) {
      for (const bridge of daLayer.bridges) {
        keys.push(getDaProjectKey(daLayer, bridge))
      }
    }

    verifyProjects(keys, verifiedJson)
  })
})
