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
  }).timeout(5_000)
})
