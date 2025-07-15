import { assert } from '@l2beat/shared-pure'
import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'
import { createHash } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import type { LeftRightPair, ValidatedLeftRightPair } from '../powerdiff'
import type { Configuration } from './types'

interface Result {
  filePathsList: LeftRightPair[]
  path1: string
  path2: string
}

export function splitIntoSubfiles(
  config: Configuration,
  filePathsList: LeftRightPair[],
): Result {
  const newFilePathList: LeftRightPair[] = []
  for (const fullPaths of filePathsList) {
    if (fullPaths.left === undefined || fullPaths.right === undefined) {
      newFilePathList.push(fullPaths)
    } else {
      const truncPaths = removeCommonPath(fullPaths)
      const result = splitPair(fullPaths, truncPaths)

      if (result !== undefined) {
        newFilePathList.push(result)
      }
    }
  }

  return {
    filePathsList: newFilePathList,
    path1: config.path1,
    path2: config.path2,
  }
}

function splitPair(
  fullPaths: LeftRightPair,
  truncPaths: ValidatedLeftRightPair,
): LeftRightPair | undefined {
  const { left, right } = fullPaths
  if (
    left !== undefined &&
    right !== undefined &&
    isFile(left) &&
    isFile(right) &&
    left.endsWith('.sol') &&
    right.endsWith('.sol')
  ) {
    return {
      left: splitSolidityFiles(fullPaths.left, truncPaths.left),
      right: splitSolidityFiles(fullPaths.right, truncPaths.right),
    }
  }

  return undefined
}

function splitSolidityFiles(atPath: string, outputPrefix: string): string {
  const hash = getSmallHash(atPath)
  const outputPath = path.join(
    '/tmp',
    hash,
    path.join(path.dirname(outputPrefix), path.basename(outputPrefix, '.sol')),
  )
  console.log(atPath, outputPath)

  fs.mkdirSync(outputPath, { recursive: true })
  splitFileIntoDirectory(atPath, outputPath)
  return outputPath
}

function splitFileIntoDirectory(atPath: string, outputDirectory: string): void {
  const content = fs.readFileSync(atPath, 'utf8')
  const AST = parse(content, { range: true })

  for (const child of AST.children) {
    assert(child.range !== undefined)
    const childContent = content.substring(child.range[0], child.range[1] + 1)
    const childName = getASTTopLevelChildName(child)
    if (childName !== undefined) {
      const outputPath = path.join(outputDirectory, `${childName}.sol`)
      fs.writeFileSync(outputPath, childContent)
    }
  }
}

function getASTTopLevelChildName(child: ASTNode): string | undefined {
  switch (child.type) {
    case 'UsingForDeclaration':
      assert(child.libraryName !== null)
      return child.libraryName
    case 'ContractDefinition':
      return child.name
    case 'FunctionDefinition':
      assert(child.name !== null)
      return child.name
    case 'VariableDeclaration':
      assert(child.name !== null)
      return child.name
    case 'StructDefinition':
      return child.name
    case 'EnumDefinition':
      return child.name
    case 'UserDefinedTypeName':
      return child.namePath
    case 'CustomErrorDefinition':
      return child.name
    case 'EventDefinition':
      return child.name
    case 'PragmaDirective':
    case 'ImportDirective':
      return undefined
    default: {
      assert(false)
    }
  }
}

function removeCommonPath(
  paths: ValidatedLeftRightPair,
): ValidatedLeftRightPair {
  const findCommonPath = (array: string[]): string => {
    const firstPath = array[0]
    const parts = firstPath.split('/')
    let commonPrefix = ''

    for (let i = 0; i < parts.length; i++) {
      const currentPrefix = parts.slice(0, i + 1).join('/')
      if (array.every((path) => path.startsWith(currentPrefix + '/'))) {
        commonPrefix = currentPrefix
      } else {
        break
      }
    }

    return commonPrefix
  }

  const commonPath = findCommonPath([paths.left, paths.right])
  const commonPathLength = commonPath.length + (commonPath ? 1 : 0) // Add 1 for the trailing slash if common path exists

  return {
    left: paths.left.substring(commonPathLength),
    right: paths.right.substring(commonPathLength),
  }
}

function getSmallHash(path: string): string {
  const hasher = createHash('sha256')
  hasher.update(path)
  return `0x${hasher.digest('hex').slice(0, 8)}`
}

function isFile(path: string): boolean {
  try {
    const stats = fs.statSync(path)
    return stats.isFile()
  } catch (error) {
    console.error(`Error checking if path is a file: ${path}`, error)
    return false
  }
}
