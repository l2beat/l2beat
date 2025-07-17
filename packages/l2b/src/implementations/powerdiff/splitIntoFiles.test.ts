import { expect } from 'earl'
import * as fs from 'fs'
import mockFs from 'mock-fs'
import * as path from 'path'
import type { LeftRightPair } from '../powerdiff'
import { splitIntoSubfiles } from './splitIntoFiles'
import type { Configuration } from './types'

describe('splitIntoSubfiles', () => {
  const testDir = path.join(__dirname, 'fixtures', 'splitIntoSubfiles')
  const leftDir = path.join(testDir, 'left')
  const rightDir = path.join(testDir, 'right')
  let config: Configuration
  let originalConsole: {
    log: typeof console.log
    error: typeof console.error
  } = {
    log: console.log,
    error: console.error,
  }

  before(() => {
    originalConsole = { log: console.log, error: console.error }

    // Set up test directories
    fs.mkdirSync(leftDir, { recursive: true })
    fs.mkdirSync(rightDir, { recursive: true })
    mockFs({
      [leftDir]: {},
      [rightDir]: {},
      '/tmp': {},
    })

    config = {
      path1: leftDir,
      path2: rightDir,
      displayMode: 'inline',
      difftasticPath: 'difft',
      context: 3,
    }

    console.error = () => {}
    console.log = () => {}
  })

  after(() => {
    mockFs.restore()
    console.log = originalConsole.log
    console.error = originalConsole.error
  })

  it('should split Solidity files into subfiles', () => {
    const leftContent = `
      contract Test1 {
        function foo() public {}
      }
      contract Test2 {
        uint256 public value;
      }
    `
    const rightContent = `
      contract Test3 {
        function foo() public {
          // Modified
        }
      }
      contract Test4 {
        uint256 public value;
        function getValue() public view returns (uint256) {
          return value;
        }
      }
    `

    fs.writeFileSync(path.join(leftDir, 'test.sol'), leftContent)
    fs.writeFileSync(path.join(rightDir, 'test.sol'), rightContent)

    const filePathsList: LeftRightPair[] = [
      {
        left: path.join(leftDir, 'test.sol'),
        right: path.join(rightDir, 'test.sol'),
      },
    ]

    const result = splitIntoSubfiles(config, filePathsList)

    expect(result.filePathsList).toHaveLength(1)
    expect(result.filePathsList[0].left ?? '').toInclude('/tmp/0x')
    expect(result.filePathsList[0].right ?? '').toInclude('/tmp/0x')

    // Check if subfiles were created
    const leftSubfiles = fs.readdirSync(result.filePathsList[0].left ?? '')
    const rightSubfiles = fs.readdirSync(result.filePathsList[0].right ?? '')

    expect(leftSubfiles).toEqualUnsorted(['Test1.sol', 'Test2.sol'])
    expect(rightSubfiles).toEqualUnsorted(['Test3.sol', 'Test4.sol'])

    // Check content of subfiles
    const leftTest1Content = fs.readFileSync(
      path.join(result.filePathsList[0].left ?? '', 'Test1.sol'),
      'utf8',
    )
    const rightTest1Content = fs.readFileSync(
      path.join(result.filePathsList[0].right ?? '', 'Test3.sol'),
      'utf8',
    )

    expect(leftTest1Content).toInclude('function foo() public {}')
    expect(rightTest1Content).toInclude('function foo() public {')
    expect(rightTest1Content).toInclude('// Modified')
  })

  it('should handle non-Solidity files', () => {
    fs.writeFileSync(path.join(leftDir, 'readme.md'), '# Test')
    fs.writeFileSync(path.join(rightDir, 'readme.md'), '# Test\n\nUpdated')

    const filePathsList: LeftRightPair[] = [
      {
        left: path.join(leftDir, 'readme.md'),
        right: path.join(rightDir, 'readme.md'),
      },
    ]

    const result = splitIntoSubfiles(config, filePathsList)

    expect(result.filePathsList).toHaveLength(0)
  })

  it('should handle missing files gracefully', () => {
    const filePathsList: LeftRightPair[] = [
      {
        left: path.join(leftDir, 'non-existent.sol'),
        right: path.join(rightDir, 'non-existent.sol'),
      },
    ]

    const result = splitIntoSubfiles(config, filePathsList)

    expect(result.filePathsList).toHaveLength(0)
  })

  it('should handle complex Solidity structures', () => {
    const complexContent = `
      pragma solidity ^0.8.0;

      import "./SomeContract.sol";

      contract ComplexContract {
        struct MyStruct {
          uint256 id;
          string name;
        }

        enum Status { Active, Inactive }

        event StatusChanged(Status newStatus);

        function doSomething() public {
          // Function body
        }

        modifier onlyOwner() {
          // Modifier body
          _;
        }

        error CustomError(string message);
      }

      contract SimpleContract {
        struct MyStruct {
          uint256 id;
          uint256 hash;
        }
      }
    `

    fs.writeFileSync(path.join(leftDir, 'complex.sol'), complexContent)
    fs.writeFileSync(path.join(rightDir, 'complex.sol'), complexContent)

    const filePathsList: LeftRightPair[] = [
      {
        left: path.join(leftDir, 'complex.sol'),
        right: path.join(rightDir, 'complex.sol'),
      },
    ]

    const result = splitIntoSubfiles(config, filePathsList)

    expect(result.filePathsList).toHaveLength(1)

    const subfiles = fs.readdirSync(result.filePathsList[0].left ?? '')
    expect(subfiles).toEqualUnsorted([
      'ComplexContract.sol',
      'SimpleContract.sol',
    ])
  })
})
