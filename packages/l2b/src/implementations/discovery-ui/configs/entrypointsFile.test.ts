import { ConfigReader, ConfigWriter } from '@l2beat/discovery'
import { formatJson } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'
import {
  ensureProjectEntrypointsImport,
  ensureProjectSharedModule,
  LOCAL_ENTRYPOINTS_IMPORT,
  validateEntrypointsFileContent,
} from './entrypointsFile'

describe(validateEntrypointsFileContent.name, () => {
  it('accepts a valid entrypoints file', () => {
    const result = validateEntrypointsFileContent(
      JSON.stringify({
        entrypoints: {
          'eth:0x0000000000000000000000000000000000000001': {
            type: 'Contract',
            project: 'shared-module',
          },
        },
      }),
    )

    expect(result.success).toEqual(true)
  })

  it('rejects invalid entrypoint entries', () => {
    const result = validateEntrypointsFileContent(
      JSON.stringify({
        entrypoints: {
          'eth:0x0000000000000000000000000000000000000001': {
            type: 'Invalid',
          },
        },
      }),
    )

    expect(result.success).toEqual(false)
  })
})

describe(ensureProjectSharedModule.name, () => {
  it('adds a shared module to the consumer project config', () => {
    const root = join(tmpdir(), `shared-module-${randomUUID()}`)
    for (const project of ['celo', 'shared-sp1']) {
      const projectPath = join(root, project)
      mkdirSync(projectPath, { recursive: true })
      writeFileSync(
        join(projectPath, 'config.jsonc'),
        formatJson({
          name: project,
          import: ['../globalConfig.jsonc'],
          initialAddresses: ['eth:0x0000000000000000000000000000000000000001'],
          ...(project === 'celo' ? {} : {}),
        }),
      )
    }

    const configReader = new ConfigReader(root)
    const configWriter = new ConfigWriter(configReader, root)

    expect(
      ensureProjectSharedModule(configReader, configWriter, 'celo', 'shared-sp1'),
    ).toEqual(true)
    expect(
      ensureProjectSharedModule(configReader, configWriter, 'celo', 'shared-sp1'),
    ).toEqual(false)

    const config = JSON.parse(
      readFileSync(join(root, 'celo', 'config.jsonc'), 'utf-8'),
    ) as { sharedModules: string[] }
    expect(config.sharedModules).toEqual(['shared-sp1'])
  })
})

describe(ensureProjectEntrypointsImport.name, () => {
  it('adds a local entrypoints import when missing', () => {
    const root = join(tmpdir(), `entrypoints-file-${randomUUID()}`)
    const project = 'sample'
    const projectPath = join(root, project)
    mkdirSync(projectPath, { recursive: true })
    writeFileSync(
      join(projectPath, 'config.jsonc'),
      formatJson({
        name: project,
        import: ['../globalConfig.jsonc'],
        initialAddresses: ['eth:0x0000000000000000000000000000000000000001'],
      }),
    )

    const configReader = new ConfigReader(root)
    const configWriter = new ConfigWriter(configReader, root)

    expect(
      ensureProjectEntrypointsImport(configReader, configWriter, project),
    ).toEqual(true)
    expect(
      ensureProjectEntrypointsImport(configReader, configWriter, project),
    ).toEqual(false)

    const config = JSON.parse(
      readFileSync(join(projectPath, 'config.jsonc'), 'utf-8'),
    ) as { import: string[] }
    expect(config.import).toEqual([
      '../globalConfig.jsonc',
      LOCAL_ENTRYPOINTS_IMPORT,
    ])
  })
})
