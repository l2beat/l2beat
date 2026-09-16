import { type DiscoveryOutput, getDiscoveryPaths } from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { execFileSync, spawnSync } from 'child_process'
import { expect } from 'earl'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

describe('model-permissions all', () => {
  it('stops after a history failure before modelling or writing the next project', () => {
    const root = mkdtempSync(join(tmpdir(), 'model-permissions-cli-'))
    try {
      const discoveryRoot = join(root, 'discovery')
      mkdirSync(join(discoveryRoot, '_clingo'), { recursive: true })
      copyFileSync(
        join(getDiscoveryPaths().discovery, '_clingo', 'modelPermissions.lp'),
        join(discoveryRoot, '_clingo', 'modelPermissions.lp'),
      )
      writeFileSync(join(root, '.discovery.json'), '{}')
      const address = ChainSpecificAddress.from('eth', '0x111')
      for (const name of ['a', 'b']) {
        const dir = join(discoveryRoot, name)
        mkdirSync(dir)
        writeFileSync(
          join(dir, 'config.jsonc'),
          JSON.stringify({ name, initialAddresses: [address] }),
        )
        const discovery: DiscoveryOutput = {
          name,
          timestamp: 2,
          configHash: Hash256.ZERO,
          entries: [{ type: 'Contract', address }],
          abis: {},
          usedTemplates: {},
          usedBlockNumbers: {},
          modelledAgainst: {},
        }
        writeFileSync(join(dir, 'discovered.json'), JSON.stringify(discovery))
      }
      const git = (...args: string[]) =>
        execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' })
      git('init', '--initial-branch=main')
      git('add', '.')
      git(
        '-c',
        'user.name=Test',
        '-c',
        'user.email=test@example.com',
        '-c',
        'commit.gpgsign=false',
        '-c',
        'core.hooksPath=/dev/null',
        'commit',
        '-m',
        'Baseline',
      )

      const firstPath = join(discoveryRoot, 'a', 'discovered.json')
      const first: DiscoveryOutput = JSON.parse(readFileSync(firstPath, 'utf8'))
      first.timestamp = 1
      writeFileSync(firstPath, JSON.stringify(first))
      const nextPath = join(discoveryRoot, 'b', 'discovered.json')
      const nextBefore = readFileSync(nextPath, 'utf8')

      const result = spawnSync(
        process.execPath,
        [
          '--import',
          require.resolve('tsx'),
          join(__dirname, '../cli.ts'),
          'model-permissions',
          'all',
        ],
        { cwd: root, encoding: 'utf8' },
      )

      expect(result.status).toEqual(1)
      expect(result.stderr).toInclude('higher than current discovery timestamp')
      expect(result.stdout).not.toInclude('Modelling: b')
      expect(readFileSync(nextPath, 'utf8')).toEqual(nextBefore)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }).timeout(15_000)

  it('records the module version actually used, warns when it is uncommitted, and permits updating just one consumer', () => {
    const root = mkdtempSync(join(tmpdir(), 'model-permissions-order-'))
    try {
      const discoveryRoot = join(root, 'discovery')
      mkdirSync(join(discoveryRoot, '_clingo'), { recursive: true })
      copyFileSync(
        join(getDiscoveryPaths().discovery, '_clingo', 'modelPermissions.lp'),
        join(discoveryRoot, '_clingo', 'modelPermissions.lp'),
      )
      writeFileSync(join(root, '.discovery.json'), '{}')
      const admin = ChainSpecificAddress.from('eth', '0x333')
      for (const [i, name] of ['a', 'b', 'z'].entries()) {
        const address = ChainSpecificAddress.from('eth', `0x${i + 1}11`)
        const entries: DiscoveryOutput['entries'] =
          name === 'z'
            ? [{ type: 'Contract', address: admin }]
            : [
                { type: 'Contract', address, values: { $admin: admin } },
                { type: 'Reference', address: admin, targetProject: 'z' },
              ]
        const dir = join(discoveryRoot, name)
        mkdirSync(dir)
        writeFileSync(
          join(dir, 'config.jsonc'),
          JSON.stringify({
            name,
            initialAddresses: [entries[0]!.address],
          }),
        )
        const discovery: DiscoveryOutput = {
          name,
          entries,
          timestamp: 2,
          configHash: Hash256.ZERO,
          permissionsConfigHash: Hash256.ZERO,
          modelledAgainst: {},
          abis: {},
          usedTemplates: {},
          usedBlockNumbers: {},
        }
        writeFileSync(join(dir, 'discovered.json'), JSON.stringify(discovery))
      }
      const git = (...args: string[]) =>
        execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' })
      git('init', '--initial-branch=main')
      git('add', '.')
      git(
        '-c',
        'user.name=Test',
        '-c',
        'user.email=test@example.com',
        '-c',
        'commit.gpgsign=false',
        '-c',
        'core.hooksPath=/dev/null',
        'commit',
        '-m',
        'Baseline',
      )
      const run = (project: string) => {
        const result = spawnSync(
          process.execPath,
          [
            '--import',
            require.resolve('tsx'),
            join(__dirname, '../cli.ts'),
            'model-permissions',
            project,
          ],
          { cwd: root, encoding: 'utf8' },
        )
        if (result.status !== 0) {
          throw new Error(
            `model-permissions ${project} exited with ${result.status}\n${result.stderr}`,
          )
        }
        return result.stdout
      }
      const read = (name: string): DiscoveryOutput =>
        JSON.parse(
          readFileSync(join(discoveryRoot, name, 'discovered.json'), 'utf8'),
        )
      const staleWarning = 'A mismatch has been detected'

      expect(run('all')).not.toInclude(staleWarning)
      const module = read('z')
      expect(module.permissionsConfigHash).not.toEqual(Hash256.ZERO)
      expect('modelledAgainst' in module).toEqual(false)
      expect(read('a').modelledAgainst).toEqual({
        z: module.permissionsConfigHash!,
      })
      expect(read('b').modelledAgainst).toEqual({
        z: module.permissionsConfigHash!,
      })

      const untouchedPath = join(discoveryRoot, 'b', 'discovered.json')
      const untouched = readFileSync(untouchedPath, 'utf8')
      writeFileSync(
        join(discoveryRoot, 'z', 'model.lp'),
        'provenanceVersion(2).',
      )
      const consumerFirst = run('a')
      expect(consumerFirst).toInclude(staleWarning)
      expect(consumerFirst).toInclude('l2b model-permissions z')
      expect(read('a').modelledAgainst.z).not.toEqual(
        module.permissionsConfigHash!,
      )
      expect(run('z')).not.toInclude(staleWarning)
      expect(read('z').permissionsConfigHash).not.toEqual(
        module.permissionsConfigHash,
      )
      expect(read('a').modelledAgainst).toEqual({
        z: read('z').permissionsConfigHash!,
      })
      expect(readFileSync(untouchedPath, 'utf8')).toEqual(untouched)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }).timeout(30_000)
})
