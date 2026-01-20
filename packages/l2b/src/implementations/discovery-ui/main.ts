import {
  ConfigReader,
  ConfigWriter,
  getDiscoveryPaths,
  TemplateService,
  get$Implementations,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import express from 'express'
import type { Server } from 'http'
import path, { join } from 'path'
import { attachConfigRouter } from './configs/router'
import { DiffoveryController } from './diffovery/DiffoveryController'
import { attachDiffoveryRouter } from './diffovery/router'
import { executeTerminalCommand } from './executeTerminalCommand'
import { getCode, getCodePaths } from './getCode'
import { getPreview } from './getPreview'
import { getProject } from './getProject'
import { getProjects } from './getProjects'
import { searchCode } from './searchCode'
import {
  getFunctions,
  updateFunction,
} from './defidisco/functions'
import {
  getContractTags,
  updateContractTag,
} from './defidisco/contractTags'
import {
  getFundsData,
  fetchAllFundsForProject,
  fetchFundsForSingleContract,
} from './defidisco/fundsData'
import {
  getCallGraphData,
  generateCallGraph,
} from './defidisco/callGraph'
import { generatePermissionsReport } from './defidisco/generatePermissionsReport'
import { filterDefiProjects } from './defidisco/defiProjectFilter'
import { detectPermissionsWithAI, combineSourceFiles } from './defidisco/aiPermissionDetection'
import { calculateV2Score } from './defidisco/v2Scoring'
import {
  attachTemplateRouter,
  listTemplateFilesSchema,
} from './templates/router'


const safeStringSchema = z
  .string()
  .check(
    (v) => v.length > 0 && /^[a-zA-Z0-9_-]+$/.test(v),
    'Input cannot be empty and must be alphanumeric and can contain underscores or hyphens.',
  )

const ethereumAddressSchema = z.string().transform(ChainSpecificAddress)

export const projectParamsSchema = z.object({
  project: safeStringSchema,
})

const projectAddressParamsSchema = z.object({
  project: safeStringSchema,
  address: ethereumAddressSchema,
})

const projectSearchTermParamsSchema = z.object({
  project: safeStringSchema,
  searchTerm: z.string(),
  address: ethereumAddressSchema.optional(),
})

const discoverQuerySchema = z.object({
  project: safeStringSchema,
  devMode: z.enum(['true', 'false']).transform((val) => val === 'true'),
})

const matchFlatQuerySchema = z.object({
  project: safeStringSchema,
  address: ethereumAddressSchema,
  against: z.enum(['templates', 'projects']),
})

const findMintersSchema = z.object({
  address: ethereumAddressSchema,
})

export function runDiscoveryUi({ readonly }: { readonly: boolean }) {
  const app = express()
  const port = process.env.PORT ?? 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')

  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const configWriter = new ConfigWriter(configReader, paths.discovery)
  const templateService = new TemplateService(paths.discovery)
  const diffoveryController = new DiffoveryController()

  app.use(express.json())

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.get('/api/projects', (_req, res) => {
    const allProjects = getProjects(configReader, readonly)
    const defiProjects = filterDefiProjects(allProjects, 'name')
    res.json(defiProjects)
  })

  app.get('/api/projects/:project', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    const response = getProject(configReader, templateService, project)
    res.json(response)
  })

  app.get('/api/projects/:project/preview', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    const response = getPreview(configReader, project)
    res.json(response)
  })

  app.get('/api/projects/:project/code/:address', (req, res) => {
    const paramsValidation = projectAddressParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project, address } = paramsValidation.data

    const checkFlatCode = readonly === false
    const response = getCode(
      paths,
      configReader,
      project,
      address,
      checkFlatCode,
    )
    res.json(response)
  })

  app.get('/api/template-files', (req, res) => {
    const query = listTemplateFilesSchema.safeParse(req.query)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    const template = templateService.readTemplateFile(query.data.templateId)

    if (!template) {
      res.status(404).json({ error: 'Template not found' })
      return
    }

    const shapes = templateService.readShapeFile(query.data.templateId)
    const criteria = templateService.readCriteriaFile(query.data.templateId)

    res.json({
      template,
      shapes,
      criteria,
    })
  })

  app.get('/api/config/sync-status/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)
    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }
    const { project } = query.data

    templateService.reload()

    const discovery = configReader.readDiscovery(project)
    const config = configReader.readConfig(project)

    res.json({
      reasons: templateService.discoveryNeedsRefresh(discovery, config),
    })
  })

  app.get('/api/config/sync-status', (_, res) => {
    templateService.reload()
    const allProjects = configReader.readAllDiscoveredProjects()

    const reasons = allProjects.flatMap((project) => {
      const discovery = configReader.readDiscovery(project)
      const config = configReader.readConfig(project)

      const reasons = templateService.discoveryNeedsRefresh(discovery, config)

      if (reasons.length === 0) {
        return []
      }

      return {
        project,
        reasons,
      }
    })

    res.json({
      reasons,
    })
  })

  app.get('/api/config-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    const configText = configReader.readRawConfigAsText(query.data.project)

    res.json({
      config: configText,
    })
  })

  app.get('/api/projects/:project/functions', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const response = getFunctions(paths, project)
      res.json(response)
    } catch (error) {
      console.error('Error loading functions:', error)
      res.status(500).json({ error: 'Failed to load functions' })
    }
  })

  app.put('/api/projects/:project/functions', (req, res) => {
    if (readonly) {
      res.status(403).json({ error: 'Server is in readonly mode' })
      return
    }

    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      updateFunction(paths, project, req.body)
      res.json({ success: true })
    } catch (error) {
      console.error('Error updating functions:', error)
      res.status(500).json({ error: 'Failed to update functions' })
    }
  })

  // AI permission detection endpoint
  app.post('/api/projects/:project/ai-detect-permissions/:address', async (req, res) => {
    if (readonly) {
      res.status(403).json({ error: 'Server is in readonly mode' })
      return
    }

    const paramsValidation = projectAddressParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project, address } = paramsValidation.data

    try {
      // Get AI provider and API key from environment
      const aiProvider = (process.env.AI_PROVIDER as 'openai' | 'claude') || 'openai'
      const aiApiKey = process.env.AI_API_KEY

      if (!aiApiKey) {
        res.status(500).json({ error: 'AI_API_KEY not configured in environment' })
        return
      }

      // Get contract source code
      const codeResponse = getCode(paths, configReader, project, address, false)

      if (!codeResponse.sources || codeResponse.sources.length === 0) {
        res.status(400).json({ error: 'No source code found for this contract' })
        return
      }

      // Build mapping of source file to contract address
      const discovery = configReader.readDiscovery(project)
      const entry = discovery.entries.find((e) => e.address === address)

      const sourceToAddress: Record<string, string> = {}

      if (entry && entry.type === 'Contract') {
        // Get implementation addresses if this is a proxy
        const implementationAddresses = get$Implementations(entry.values)

        // Map source files to addresses
        // File naming patterns:
        // - Files ending with .p.sol are proxy contracts → map to proxy address
        // - Files NOT ending with .p.sol are implementations → map to implementation addresses
        // - For multiple implementations (diamonds), they may be numbered .0.sol, .1.sol, etc.

        console.log(`Mapping source files for ${address}:`)
        console.log(`  Implementation addresses: ${implementationAddresses.join(', ')}`)

        for (const source of codeResponse.sources) {
          if (source.name.endsWith('.p.sol')) {
            // Proxy file
            sourceToAddress[source.name] = address
            console.log(`  ${source.name} → ${address} (proxy)`)
          } else {
            // Implementation file - check if it's numbered (e.g., ".0.sol", ".1.sol") for diamonds
            const match = source.name.match(/\.(\d+)\.sol$/)
            if (match) {
              const index = parseInt(match[1]!, 10)
              if (implementationAddresses[index]) {
                sourceToAddress[source.name] = implementationAddresses[index]!
                console.log(`  ${source.name} → ${implementationAddresses[index]} (impl #${index})`)
              } else {
                sourceToAddress[source.name] = address  // fallback to proxy
                console.log(`  ${source.name} → ${address} (fallback to proxy)`)
              }
            } else {
              // Regular implementation file without numbering
              if (implementationAddresses.length > 0) {
                sourceToAddress[source.name] = implementationAddresses[0]!
                console.log(`  ${source.name} → ${implementationAddresses[0]} (impl)`)
              } else {
                // Single contract (no proxy pattern)
                sourceToAddress[source.name] = address
                console.log(`  ${source.name} → ${address} (single contract)`)
              }
            }
          }
        }
      } else {
        // Non-proxy contract - map all sources to the contract address
        for (const source of codeResponse.sources) {
          sourceToAddress[source.name] = address
        }
      }

      // Combine source files
      const sourcesMap: Record<string, string> = {}
      for (const source of codeResponse.sources) {
        sourcesMap[source.name] = source.code
      }
      const combinedSource = combineSourceFiles(sourcesMap)

      // Call AI API
      console.log(`Detecting permissions for ${address} using ${aiProvider}...`)
      const aiResult = await detectPermissionsWithAI(combinedSource, aiApiKey, aiProvider)
      console.log(`AI detected ${aiResult.functions.length} functions for ${address}`)

      // Build a set of valid write function names from the target contract's ABI
      // Use the same logic as PermissionsDisplay to identify write functions
      const validFunctionNames = new Set<string>()

      if (entry && entry.type === 'Contract') {
        // Get the project response to access ABIs
        const projectResponse = getProject(configReader, templateService, project)

        // Find the contract in the project response
        for (const chain of projectResponse.entries) {
          const allContracts = [...chain.initialContracts, ...chain.discoveredContracts]
          const targetContract = allContracts.find(c => c.address === address)

          if (targetContract && 'abis' in targetContract) {
            const readMarkers = [' view ', ' pure ']

            for (const abi of targetContract.abis) {
              for (const abiEntry of abi.entries) {
                const value = abiEntry.value

                // Skip errors and events
                if (value.startsWith('error') || value.startsWith('event')) {
                  continue
                }

                // Skip view/pure functions (read-only)
                if (readMarkers.some((marker) => value.includes(marker))) {
                  continue
                }

                // Extract function name from write functions
                const match = value.match(/^function\s+(\w+)\s*\(/)
                if (match) {
                  validFunctionNames.add(match[1]!)
                }
              }
            }
          }
        }
      }

      console.log(`Valid write function names for ${address}: ${validFunctionNames.size}`)

      // Save each detected function to the correct contract address based on source file
      let savedCount = 0
      let skippedCount = 0

      for (const func of aiResult.functions) {
        // Validate that the function actually exists in some contract's ABI
        if (!validFunctionNames.has(func.functionName)) {
          console.log(`⚠️  Skipping function ${func.functionName} - not found in any contract ABI`)
          skippedCount++
          continue
        }

        const targetAddress = func.sourceFile ? sourceToAddress[func.sourceFile] || address : address

        console.log(`✓ Saving function ${func.functionName} from ${func.sourceFile || 'unknown'} to ${targetAddress}`)

        updateFunction(paths, project, {
          contractAddress: targetAddress,
          functionName: func.functionName,
          isPermissioned: func.isPermissioned,
          ownerDefinitions: func.ownerDefinitions,
        })

        savedCount++
      }

      console.log(`Saved ${savedCount} functions, skipped ${skippedCount} invalid functions`)

      res.json({
        success: true,
        detectedFunctions: savedCount,
        skippedFunctions: skippedCount,
        functions: aiResult.functions
      })
    } catch (error) {
      console.error('Error detecting permissions with AI:', error)
      res.status(500).json({
        error: 'Failed to detect permissions with AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })

  // Contract tags endpoints
  app.get('/api/projects/:project/contract-tags', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const response = getContractTags(paths, project)
      res.json(response)
    } catch (error) {
      console.error('Error loading contract tags:', error)
      res.status(500).json({ error: 'Failed to load contract tags' })
    }
  })

  app.put('/api/projects/:project/contract-tags', (req, res) => {
    if (readonly) {
      res.status(403).json({ error: 'Server is in readonly mode' })
      return
    }

    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      updateContractTag(paths, project, req.body)
      res.json({ success: true })
    } catch (error) {
      console.error('Error updating contract tags:', error)
      res.status(500).json({ error: 'Failed to update contract tags' })
    }
  })

  // V2 Scoring endpoint
  app.get('/api/projects/:project/v2-score', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const score = calculateV2Score(paths, configReader, templateService, project)
      res.json(score)
    } catch (error) {
      console.error('Error calculating V2 score:', error)
      res.status(500).json({ error: 'Failed to calculate V2 score' })
    }
  })

  // Funds data endpoints
  app.get('/api/projects/:project/funds-data', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const response = getFundsData(paths, project)
      res.json(response)
    } catch (error) {
      console.error('Error loading funds data:', error)
      res.status(500).json({ error: 'Failed to load funds data' })
    }
  })

  app.post('/api/projects/:project/funds-data/fetch', async (req, res) => {
    if (readonly) {
      res.status(403).json({ error: 'Server is in readonly mode' })
      return
    }

    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data
    const { contractAddress, forceRefresh } = req.body as { contractAddress?: string; forceRefresh?: boolean }

    // Set up Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    const sendProgress = (message: string) => {
      res.write(`data: ${message.replace(/\n/g, '\\n')}\n\n`)
    }

    try {
      if (contractAddress) {
        // Fetch for single contract
        await fetchFundsForSingleContract(paths, project, contractAddress, sendProgress, forceRefresh ?? false)
      } else {
        // Fetch for all tagged contracts
        await fetchAllFundsForProject(paths, project, sendProgress, forceRefresh ?? false)
      }
      sendProgress('DONE')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      sendProgress(`Error: ${errorMessage}`)
    }

    res.end()
  })

  // Call graph endpoints
  app.get('/api/projects/:project/call-graph', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const response = getCallGraphData(paths, project)
      res.json(response)
    } catch (error) {
      console.error('Error loading call graph data:', error)
      res.status(500).json({ error: 'Failed to load call graph data' })
    }
  })

  app.use(express.static(STATIC_ROOT))

  attachDiffoveryRouter(app, diffoveryController)

  if (!readonly) {
    attachTemplateRouter(app, templateService)
    attachConfigRouter(app, configReader, configWriter, templateService)

    app.get('/api/projects/:project/codeSearch', (req, res) => {
      const paramsValidation = projectSearchTermParamsSchema.safeParse({
        project: req.params.project,
        searchTerm: req.query.searchTerm,
        address: req.query.address,
      })

      if (!paramsValidation.success) {
        res.status(400).json({ errors: paramsValidation.message })
        return
      }
      const { project, searchTerm, address } = paramsValidation.data

      const response = searchCode(
        paths,
        configReader,
        project,
        searchTerm,
        address,
      )
      res.json(response)
    })

    app.get('/api/terminal/discover', (req, res) => {
      const queryValidation = discoverQuerySchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project, devMode } = queryValidation.data

      executeTerminalCommand(
        `l2b discover ${project} ${devMode ? '--dev' : ''}`,
        res,
      )
    })

    app.get('/api/terminal/match-flat', (req, res) => {
      const queryValidation = matchFlatQuerySchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project, address, against } = queryValidation.data

      const { codePaths } = getCodePaths(paths, configReader, project, address)
      const implementationPath =
        codePaths.length > 1 ? codePaths[1].path : codePaths[0].path
      const againstPath =
        against === 'templates' ? './projects/_templates/' : './projects/'

      executeTerminalCommand(
        `cd ${path.dirname(
          paths.discovery,
        )} && l2b match-flat file "${implementationPath}" "${againstPath}"`,
        res,
      )
    })

    app.get('/api/terminal/download-all-shapes', (_req, res) => {
      executeTerminalCommand(
        `cd ${path.dirname(paths.discovery)}/../ && l2b download-all-shapes`,
        res,
      )
    })

    app.get('/api/terminal/find-minters', (req, res) => {
      const queryValidation = findMintersSchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { address } = queryValidation.data

      executeTerminalCommand(
        `cd ${path.dirname(paths.discovery)}/../../backend && l2b minters ${address}`,
        res,
      )
    })

    app.get('/api/terminal/generate-permissions-report', (req, res) => {
      const queryValidation = projectParamsSchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project } = queryValidation.data

      // Set up Server-Sent Events headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      })

      try {
        const result = generatePermissionsReport(paths, project)
        res.write(`data: ${result.replace(/\n/g, '\\n')}\n\n`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        res.write(`data: Error generating permissions report: ${errorMessage}\\n\n\n`)
      }

      res.end()
    })

    app.get('/api/terminal/generate-call-graph', async (req, res) => {
      const queryValidation = discoverQuerySchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project, devMode } = queryValidation.data

      // Set up Server-Sent Events headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      })

      const sendProgress = (message: string) => {
        res.write(`data: ${message.replace(/\n/g, '\\n')}\n\n`)
      }

      try {
        await generateCallGraph(paths, configReader, project, sendProgress, devMode)
        sendProgress('DONE')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        sendProgress(`Error: ${errorMessage}`)
      }

      res.end()
    })
  }

  app.get('*', (_req, res) => {
    res.sendFile(join(STATIC_ROOT, 'index.html'))
  })

  const server = app.listen(port, () => {
    console.log(`Discovery UI live on http://localhost:${port}/ui`)
  })

  attachGracefulShutdown(server)
}

function shutdown(server: Server) {
  server.close(() => {
    process.exit(0)
  })

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    )
    process.exit(1)
  }, 10000)
}

function attachGracefulShutdown(server: Server) {
  process.on('SIGTERM', () => shutdown(server))
  process.on('SIGINT', () => shutdown(server))
}
