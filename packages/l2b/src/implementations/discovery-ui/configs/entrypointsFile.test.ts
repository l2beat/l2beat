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
  parseEntrypointColor,
  readEntrypointsModuleColor,
  removeProjectSharedModule,
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

  it('accepts an optional module color', () => {
    const result = validateEntrypointsFileContent(
      JSON.stringify({
        color: 3,
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

  it('rejects invalid module colors', () => {
    const result = validateEntrypointsFileContent(
      JSON.stringify({
        color: 99,
        entrypoints: {},
      }),
    )

    expect(result.success).toEqual(false)
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

describe(parseEntrypointColor.name, () => {
  it('accepts palette indices 0 through 10', () => {
    expect(parseEntrypointColor(0)).toEqual(0)
    expect(parseEntrypointColor(10)).toEqual(10)
  })

  it('rejects non-integers and out-of-range values', () => {
    expect(parseEntrypointColor(1.5)).toEqual(undefined)
    expect(parseEntrypointColor(11)).toEqual(undefined)
    expect(parseEntrypointColor('3')).toEqual(undefined)
  })
})

describe(readEntrypointsModuleColor.name, () => {
  it('reads color from a module entrypoints.json file', () => {
    const root = join(tmpdir(), `entrypoints-color-${randomUUID()}`)
    const module = 'shared-sp1'
    const projectPath = join(root, module)
    mkdirSync(projectPath, { recursive: true })
    writeFileSync(
      join(projectPath, 'config.jsonc'),
      formatJson({
        name: module,
        import: ['../globalConfig.jsonc'],
        initialAddresses: ['eth:0x0000000000000000000000000000000000000001'],
      }),
    )
    writeFileSync(
      join(projectPath, 'entrypoints.json'),
      formatJson({
        color: 5,
        entrypoints: {},
      }),
    )

    const configReader = new ConfigReader(root)
    expect(readEntrypointsModuleColor(configReader, module)).toEqual(5)
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

describe(removeProjectSharedModule.name, () => {
  it('removes a shared module from the consumer project config', () => {
    const root = join(tmpdir(), `remove-shared-module-${randomUUID()}`)
    const projectPath = join(root, 'celo')
    mkdirSync(projectPath, { recursive: true })
    writeFileSync(
      join(projectPath, 'config.jsonc'),
      formatJson({
        name: 'celo',
        import: ['../globalConfig.jsonc'],
        initialAddresses: ['eth:0x0000000000000000000000000000000000000001'],
        sharedModules: ['taiko', 'shared-sp1'],
      }),
    )

    const configReader = new ConfigReader(root)
    const configWriter = new ConfigWriter(configReader, root)

    expect(
      removeProjectSharedModule(configReader, configWriter, 'celo', 'taiko'),
    ).toEqual(true)
    // Removing again is a no-op.
    expect(
      removeProjectSharedModule(configReader, configWriter, 'celo', 'taiko'),
    ).toEqual(false)

    const config = JSON.parse(
      readFileSync(join(projectPath, 'config.jsonc'), 'utf-8'),
    ) as { sharedModules: string[] }
    expect(config.sharedModules).toEqual(['shared-sp1'])
  })

  it('drops the sharedModules key when the last module is removed', () => {
    const root = join(tmpdir(), `remove-shared-module-${randomUUID()}`)
    const projectPath = join(root, 'celo')
    mkdirSync(projectPath, { recursive: true })
    writeFileSync(
      join(projectPath, 'config.jsonc'),
      formatJson({
        name: 'celo',
        import: ['../globalConfig.jsonc'],
        initialAddresses: ['eth:0x0000000000000000000000000000000000000001'],
        sharedModules: ['taiko'],
      }),
    )

    const configReader = new ConfigReader(root)
    const configWriter = new ConfigWriter(configReader, root)

    expect(
      removeProjectSharedModule(configReader, configWriter, 'celo', 'taiko'),
    ).toEqual(true)

    const config = JSON.parse(
      readFileSync(join(projectPath, 'config.jsonc'), 'utf-8'),
    ) as { sharedModules?: string[] }
    expect(config.sharedModules).toEqual(undefined)
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
