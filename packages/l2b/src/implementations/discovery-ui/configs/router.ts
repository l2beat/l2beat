import type {
  ConfigReader,
  ConfigWriter,
  DiscoveryPaths,
} from '@l2beat/discovery'
import { ChainSpecificAddress, formatJson } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import path from 'path'
import { projectParamsSchema } from '../main'

const updateConfigFileSchema = z.object({
  content: z.string(),
})

const createConfigFileSchema = z.object({
  type: z.enum(['project', 'token']),
  project: z.string().check((v) => v.length > 0),
  initialAddresses: z
    .array(z.string())
    .check((v) => v.length > 0)
    .check((v) => v.every(ChainSpecificAddress)),
  maxDepth: z.number().optional(),
  maxAddresses: z.number().optional(),
  overwrite: z.boolean().optional(),
})

export function attachConfigRouter(
  app: Express,
  configReader: ConfigReader,
  configWriter: ConfigWriter,
  paths: DiscoveryPaths,
) {
  app.put('/api/config-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)
    const data = updateConfigFileSchema.safeParse(req.body)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    if (!data.success) {
      res.status(400).json({ errors: data.message })
      return
    }

    configWriter.writeConfigFile(query.data.project, data.data.content)

    res.json({ success: true })
  })

  app.post('/api/config-files', (req, res) => {
    const body = createConfigFileSchema.safeParse(req.body)

    if (!body.success) {
      res.status(400).json({ success: false, error: body.message })
      return
    }

    if (configExists(configReader, body.data.project) && !body.data.overwrite) {
      res
        .status(400)
        .json({ success: false, error: 'Config file already exists' })
      return
    }

    const { getProjectPath, createEmptyConfig } =
      body.data.type === 'project' ? ProjectConfigTemplate : TokenConfigTemplate

    const projectPath = getProjectPath(paths, body.data.project)

    const contents = createEmptyConfig({
      name: body.data.project,
      initialAddresses: body.data.initialAddresses.map(ChainSpecificAddress),
      maxDepth: body.data.maxDepth,
      maxAddresses: body.data.maxAddresses,
    })

    configWriter.createConfigFile(projectPath, formatJson(contents))

    res.json({ success: true })
  })
}

function configExists(configReader: ConfigReader, project: string) {
  try {
    configReader.getProjectPath(project)
    return true
  } catch {
    return false
  }
}

type IncomingConfigSkeleton = {
  name: string
  initialAddresses: ChainSpecificAddress[]
  maxDepth?: number
  maxAddresses?: number
}

type ConfigTemplate = {
  getProjectPath(paths: DiscoveryPaths, name: string): string
  createEmptyConfig(
    incomingValues: IncomingConfigSkeleton,
  ): Record<string, unknown>
}

const ProjectConfigTemplate: ConfigTemplate = {
  getProjectPath: (paths, name) => path.join(paths.discovery, name),
  createEmptyConfig: (incomingValues) => {
    const { name, initialAddresses, maxAddresses, maxDepth } = incomingValues

    const config = {
      $schema: '../../../../discovery/schemas/config.v2.schema.json',
      name,
      import: ['../globalConfig.jsonc'],
      ...(maxDepth ? { maxDepth } : {}),
      ...(maxAddresses ? { maxAddresses } : {}),
      initialAddresses,
    }

    return config
  },
}

const TokenConfigTemplate: ConfigTemplate = {
  getProjectPath: (paths, name) => path.join(paths.discovery, '(tokens)', name),
  createEmptyConfig: (incomingValues) => {
    const { name, initialAddresses, maxDepth, maxAddresses } = incomingValues

    const overrides: Record<string, unknown> = {}

    for (const address of initialAddresses) {
      overrides[address.toString()] = {
        fields: {
          $tokenData: {
            handler: {
              type: 'ERC20Data',
            },
          },
        },
      }
    }

    const projectConfig = ProjectConfigTemplate.createEmptyConfig({
      name,
      initialAddresses,
      maxDepth,
      maxAddresses,
    })

    return {
      ...projectConfig,
      import: ['../../globalConfig.jsonc'],
      overrides,
    }
  },
}
