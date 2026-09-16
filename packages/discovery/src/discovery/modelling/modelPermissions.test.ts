import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { TemplateService } from '../analysis/TemplateService'
import { ConfigReader } from '../config/ConfigReader'
import { getDiscoveryPaths } from '../config/getDiscoveryPaths'
import { attachPermissions } from '../output/attachPermissions'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { combinePermissionsIntoDiscovery } from './combinePermissionsIntoDiscovery'
import {
  addReferencedDiscoveries,
  clusterEntries,
  DiscoveryRegistry,
  findStaleReferences,
  generateClingoForDiscoveries,
  generatePermissionConfigHash,
  hashPermissionsConfigInOwnCluster,
  loadDiscoveriesForModelling,
  modelPermissions,
} from './modelPermissions'

describe('cluster permission modelling', () => {
  it('models a fresh handover through transitive disk references and joins one coherent result', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cluster-permissions-'))
    try {
      const diamond = ChainSpecificAddress.from('eth', '0x111')
      const admin = ChainSpecificAddress.from('eth', '0x222')
      const timelock = ChainSpecificAddress.from('eth', '0x333')
      const council = ChainSpecificAddress.from('eth', '0x444')
      const unrelated = ChainSpecificAddress.from('base', '0x555')
      const unrelatedOwner = ChainSpecificAddress.from('base', '0x666')
      const act = (field: string) => ({
        fields: { [field]: { permissions: [{ type: 'act', delay: 60 }] } },
      })
      const outputs = [
        output('consumer', [{ type: 'Contract', address: diamond }]),
        output('shared', [
          { type: 'Contract', address: admin, values: { owner: timelock } },
          { type: 'Reference', address: timelock, targetProject: 'governance' },
          {
            type: 'Contract',
            address: unrelated,
            values: { $admin: unrelatedOwner },
          },
          { type: 'EOA', address: unrelatedOwner },
        ]),
        output('governance', [
          { type: 'Contract', address: timelock, values: { owner: council } },
          { type: 'Contract', address: council },
        ]),
      ]
      for (const discovery of outputs) {
        const dir = join(root, discovery.name)
        mkdirSync(dir)
        writeFileSync(join(dir, 'discovered.json'), JSON.stringify(discovery))
        writeFileSync(
          join(dir, 'config.jsonc'),
          JSON.stringify({
            name: discovery.name,
            initialAddresses: [discovery.entries[0]?.address],
            overrides:
              discovery.name === 'shared'
                ? { [admin]: act('owner') }
                : discovery.name === 'governance'
                  ? { [timelock]: act('owner') }
                  : {},
          }),
        )
      }

      // The committed consumer has no reference yet. Only the fresh crawl
      // knows that upgrade authority moved to the module's ProxyAdmin.
      const fresh = output('consumer', [
        { type: 'Contract', address: diamond, values: { $admin: admin } },
        { type: 'Reference', address: admin, targetProject: 'shared' },
      ])
      const reader = new ConfigReader(root)
      const registry = new DiscoveryRegistry()
      registry.set('consumer', fresh)
      addReferencedDiscoveries(registry, 'consumer', reader)
      const paths = getDiscoveryPaths()
      const model = await modelPermissions(
        'consumer',
        registry,
        reader,
        new TemplateService(root),
        paths,
        { debug: false },
      )
      combinePermissionsIntoDiscovery(fresh, model, clusterEntries(registry))

      // The committed module hashes are random here, so they are behind the
      // clingo their configs produce. Provenance must still name the version
      // that was fed to this run: the one each module gets when remodelled.
      expect(findStaleReferences(registry, model.modelledAgainst)).toEqual([
        'governance',
        'shared',
      ])
      const templateService = new TemplateService(root)
      for (const name of ['governance', 'shared']) {
        const own = await modelPermissions(
          name,
          loadDiscoveriesForModelling(name, reader),
          reader,
          templateService,
          paths,
          { debug: false },
        )
        expect(fresh.modelledAgainst[name]).toEqual(own.permissionsConfigHash)
        registry.get(name).discoveryOutput.permissionsConfigHash =
          own.permissionsConfigHash
      }
      expect(Object.keys(fresh.modelledAgainst)).toEqual([
        'governance',
        'shared',
      ])
      expect(findStaleReferences(registry, model.modelledAgainst)).toEqual([])

      const upgrades = fresh.permissions?.[council]?.receivedPermissions ?? []
      expect(upgrades.length).toEqual(1)
      expect(upgrades[0]?.permission).toEqual('upgrade')
      expect(upgrades[0]?.from).toEqual(diamond)
      expect(upgrades[0]?.via?.map((step) => step.address)).toEqual([
        admin,
        timelock,
      ])
      expect(fresh.permissions?.[unrelatedOwner]).toEqual(undefined)
      expect(
        fresh.entries.every((entry) => entry.receivedPermissions === undefined),
      ).toEqual(true)

      const governance = registry.get('governance').discoveryOutput
      // A different, stale model on the referenced file must not contribute.
      governance.permissions = {
        [council]: {
          receivedPermissions: [{ permission: 'upgrade', from: unrelated }],
        },
      }
      attachPermissions([
        fresh,
        registry.get('shared').discoveryOutput,
        governance,
      ])
      expect(
        governance.entries.find((entry) => entry.address === council)
          ?.receivedPermissions,
      ).toEqual(upgrades)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('records a module hash that does not depend on the consumer cluster', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cluster-provenance-'))
    try {
      const diamond = ChainSpecificAddress.from('eth', '0x111')
      const admin = ChainSpecificAddress.from('eth', '0x222')
      const owner = ChainSpecificAddress.from('eth', '0x333')
      // The module's owner lives in a sibling module the module itself never
      // reached, so only the consumer's cluster can resolve that permission.
      const outputs = [
        output('consumer', [
          { type: 'Contract', address: diamond, values: { $admin: admin } },
          { type: 'Reference', address: admin, targetProject: 'module' },
          { type: 'Reference', address: owner, targetProject: 'sibling' },
        ]),
        output('module', [
          { type: 'Contract', address: admin, values: { owner } },
        ]),
        output('sibling', [{ type: 'Contract', address: owner }]),
      ]
      for (const discovery of outputs) {
        const dir = join(root, discovery.name)
        mkdirSync(dir)
        writeFileSync(join(dir, 'discovered.json'), JSON.stringify(discovery))
        writeFileSync(
          join(dir, 'config.jsonc'),
          JSON.stringify({
            name: discovery.name,
            initialAddresses: [discovery.entries[0]?.address],
            overrides:
              discovery.name === 'module'
                ? {
                    [admin]: {
                      fields: {
                        owner: { permissions: [{ type: 'act', delay: 60 }] },
                      },
                    },
                  }
                : {},
          }),
        )
      }
      const reader = new ConfigReader(root)
      const templateService = new TemplateService(root)
      const paths = getDiscoveryPaths()
      const registry = loadDiscoveriesForModelling('consumer', reader)

      const inConsumerCluster = generateClingoForDiscoveries(
        registry,
        reader,
        templateService,
      )
      const ownHash = hashPermissionsConfigInOwnCluster(
        'module',
        reader,
        templateService,
      )
      expect(
        generatePermissionConfigHash(inConsumerCluster.module!),
      ).not.toEqual(ownHash)

      const model = await modelPermissions(
        'consumer',
        registry,
        reader,
        templateService,
        paths,
        { debug: false },
      )
      const standalone = await modelPermissions(
        'module',
        loadDiscoveriesForModelling('module', reader),
        reader,
        templateService,
        paths,
        { debug: false },
      )
      expect(model.modelledAgainst.module).toEqual(ownHash)
      expect(model.modelledAgainst.module).toEqual(
        standalone.permissionsConfigHash,
      )
      expect(findStaleReferences(registry, model.modelledAgainst)).toEqual([
        'module',
        'sibling',
      ])
      registry.get('module').discoveryOutput.permissionsConfigHash =
        standalone.permissionsConfigHash
      registry.get('sibling').discoveryOutput.permissionsConfigHash =
        model.modelledAgainst.sibling
      expect(findStaleReferences(registry, model.modelledAgainst)).toEqual([])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

function output(name: string, entries: EntryParameters[]): DiscoveryOutput {
  return {
    name,
    entries,
    timestamp: 0,
    abis: {},
    configHash: Hash256.ZERO,
    permissionsConfigHash: Hash256.random(),
    usedTemplates: {},
    modelledAgainst: {},
    usedBlockNumbers: {},
  }
}
