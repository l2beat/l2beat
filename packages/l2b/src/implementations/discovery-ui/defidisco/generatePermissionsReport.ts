import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { resolveOwnersFromDiscovered } from './functions'
import type { ApiFunctionsResponse } from './types'

export interface ReportEntry {
  contractName: string
  functionName: string
  impact: string
  owners: string[]
}

export function generatePermissionsReport(
  paths: DiscoveryPaths,
  project: string,
): string {
  console.log(`Generating permissions report for project: ${project}`)

  const functionsPath = getFunctionsPath(paths, project)
  const discoveredPath = getDiscoveredPath(paths, project)
  const outputPath = getPermissionsReportPath(paths, project)

  // Load functions data (contract-grouped structure)
  let functions: Record<string, any> = {}
  if (fs.existsSync(functionsPath)) {
    try {
      const fileContent = fs.readFileSync(functionsPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiFunctionsResponse
      functions = data.contracts
      const totalFunctions = Object.values(functions).reduce(
        (sum: number, contract: any) => sum + contract.functions.length,
        0,
      )
      console.log(
        `Loaded ${totalFunctions} functions from ${Object.keys(functions).length} contracts`,
      )
    } catch (error) {
      console.error('Error parsing functions file:', error)
      throw new Error('Failed to parse functions file')
    }
  } else {
    console.log('No functions file found')
    throw new Error('No functions file found')
  }

  // Load discovered data for contract names
  let discoveredData: any = {}
  if (fs.existsSync(discoveredPath)) {
    try {
      const fileContent = fs.readFileSync(discoveredPath, 'utf8')
      discoveredData = JSON.parse(fileContent)
      console.log('Loaded discovered data')
    } catch (error) {
      console.error('Error parsing discovered.json:', error)
      throw new Error('Failed to parse discovered.json')
    }
  } else {
    console.log('No discovered.json found')
    throw new Error('No discovered.json file found')
  }

  // Create report entries from contract-grouped structure
  const reportEntries: ReportEntry[] = []
  let permissionedFunctionCount = 0

  for (const [contractAddress, contractFunctions] of Object.entries(
    functions,
  )) {
    const contractName = getContractName(discoveredData, contractAddress)

    for (const func of (contractFunctions as any).functions) {
      if (func.isPermissioned) {
        permissionedFunctionCount++
        const impact =
          func.description || func.reason || 'No description provided'

        // Resolve owners if owner definitions exist
        let owners: string[] = []
        if (func.ownerDefinitions && func.ownerDefinitions.length > 0) {
          try {
            const resolved = resolveOwnersFromDiscovered(
              paths,
              project,
              contractAddress,
              func.ownerDefinitions,
            )
            owners = resolved
              .filter((owner) => owner.isResolved)
              .map((owner) => owner.address)

            // If no owners could be resolved, show the definition format
            if (owners.length === 0) {
              owners = func.ownerDefinitions.map((def: any) => {
                return def.path
              })
            }
          } catch (error) {
            console.warn(
              `Failed to resolve owners for ${func.functionName}:`,
              error,
            )
            owners = ['Resolution failed']
          }
        } else {
          owners = ['No owners defined']
        }

        reportEntries.push({
          contractName,
          functionName: func.functionName,
          impact,
          owners,
        })
      }
    }
  }

  console.log(`Found ${permissionedFunctionCount} permissioned functions`)

  // Generate markdown table
  const markdown = generateMarkdownTable(reportEntries)

  // Write to file
  fs.writeFileSync(outputPath, markdown, 'utf8')
  console.log(`Permissions report written to: ${outputPath}`)

  return `Permissions report generated successfully!\nOutput: ${outputPath}\nFound ${reportEntries.length} permissioned functions`
}

function getContractName(discoveredData: any, contractAddress: string): string {
  if (!discoveredData.entries || !Array.isArray(discoveredData.entries)) {
    return contractAddress
  }

  const contract = discoveredData.entries.find(
    (entry: any) =>
      entry.type === 'Contract' && entry.address === contractAddress,
  )

  if (contract && contract.name) {
    return contract.name
  }

  // Fallback to just the address if no name found
  return contractAddress
}

function generateMarkdownTable(entries: ReportEntry[]): string {
  if (entries.length === 0) {
    return `# Permissions Report

No permissioned functions found.
`
  }

  const header = `# Permissions Report

| Contract | Function | Impact | Owner |
|----------|----------|--------|-------|
`

  const rows = entries
    .map((entry) => {
      const contractName = entry.contractName.replace(/\|/g, '\\|')
      const functionName = entry.functionName.replace(/\|/g, '\\|')
      const impact = entry.impact.replace(/\|/g, '\\|')
      const owners = entry.owners.join(', ').replace(/\|/g, '\\|')

      return `| ${contractName} | ${functionName} | ${impact} | ${owners} |`
    })
    .join('\n')

  const footer = `

*Report generated on ${new Date().toISOString()}*
`

  return header + rows + footer
}

function getFunctionsPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'functions.json')
}

function getDiscoveredPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'discovered.json')
}

function getPermissionsReportPath(
  paths: DiscoveryPaths,
  project: string,
): string {
  return path.join(paths.discovery, project, 'permissions.md')
}
