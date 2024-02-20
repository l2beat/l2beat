import { expect } from 'earl'

import { FileContent, ParsedFilesManager } from './ParsedFilesManager'

describe(ParsedFilesManager.name, () => {
  const EMPTY_REMAPPINGS: string[] = []
  describe(ParsedFilesManager.prototype.findContractDeclaration.name, () => {
    it('is able to find contract all declared in one file', () => {
      const files = [
        {
          path: 'path',
          content: `
                library Library1 { function f() public {} }
                interface Interface1 { function f() public {} }
                abstract contract Abstract1 { function f() public {} }
                contract Contract1 { function f() public {} }
                `,
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)

      expect(manager.findContractDeclaration('Library1').contract).toHaveSubset(
        {
          name: 'Library1',
          type: 'library',
          referencedContracts: [],
          inheritsFrom: [],
        },
      )
      expect(
        manager.findContractDeclaration('Interface1').contract,
      ).toHaveSubset({
        name: 'Interface1',
        type: 'interface',
        referencedContracts: [],
        inheritsFrom: [],
      })
      expect(
        manager.findContractDeclaration('Abstract1').contract,
      ).toHaveSubset({
        name: 'Abstract1',
        type: 'abstract',
        referencedContracts: [],
        inheritsFrom: [],
      })
      expect(
        manager.findContractDeclaration('Contract1').contract,
      ).toHaveSubset({
        name: 'Contract1',
        type: 'contract',
        referencedContracts: [],
        inheritsFrom: [],
      })
    })

    it('throws if contract is not found', () => {
      const files: FileContent[] = []
      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)

      expect(() => manager.findContractDeclaration('NonExistent')).toThrow(
        'Failed to find file declaring contract NonExistent',
      )
    })

    it('finds contract across multiple files', () => {
      const files: FileContent[] = [
        {
          path: 'path3',
          content: 'contract Contract3 {}',
        },
        {
          path: 'path2',
          content: 'contract Contract2 {}',
        },
        {
          path: 'path1',
          content: 'contract Contract1 { function f() public {} }',
        },
      ]
      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)

      expect(manager.findContractDeclaration('Contract1')).toEqual({
        contract: expect.subset({
          name: 'Contract1',
          type: 'contract',
          referencedContracts: [],
          inheritsFrom: [],
        }),
        file: expect.subset({
          path: 'path1',
        }),
      })
    })
  })

  describe(ParsedFilesManager.prototype.tryFindContract.name, () => {
    it('returns undefined if contract is not found', () => {
      const files = [
        {
          path: 'Root.sol',
          content: 'contract R1 { function r1() public {} }',
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)
      const root = manager.findContractDeclaration('R1')

      expect(manager.tryFindContract('NonExistent', root.file)).toEqual(
        undefined,
      )
    })

    it('resolves imports', () => {
      const files = [
        {
          path: 'ImportedAsAll.sol',
          content: `
          contract A1 { function f1() public {} }
          contract A2 { function f2() public {} }
          `,
        },
        {
          path: 'ImportedSelective.sol',
          content: `
          contract S1 { function s1() public {} }
          contract S2 { function s2() public {} }
          `,
        },
        {
          path: 'Importing.sol',
          content: `
          import "./ImportedAsAll.sol";
          import { S1 as Alias1 } from "./ImportedSelective.sol";
          contract R1 { function r1() public {} }
          `,
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)
      const root = manager.findContractDeclaration('R1')

      expect(
        manager.tryFindContract('Alias1', root.file)?.contract.name,
      ).toEqual('S1')
      expect(manager.tryFindContract('S2', root.file)).toEqual(undefined)
      expect(manager.tryFindContract('A1', root.file)?.contract.name).toEqual(
        'A1',
      )
      expect(manager.tryFindContract('A2', root.file)?.contract.name).toEqual(
        'A2',
      )
    })

    it('normalizes imports', () => {
      const files = [
        {
          path: 'src//ImportedAsAll.sol',
          content: `
          contract A1 { function f1() public {} }
          contract A2 { function f2() public {} }
          `,
        },
        {
          path: 'src/ImportedSelective.sol',
          content: `
          contract S1 { function s1() public {} }
          contract S2 { function s2() public {} }
          `,
        },
        {
          path: 'Importing.sol',
          content: `
          import "./src/////ImportedAsAll.sol";
          import { S1 as Alias1 } from ".////src//ImportedSelective.sol";
          contract R1 { function r1() public {} }
          `,
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)
      const root = manager.findContractDeclaration('R1')

      expect(
        manager.tryFindContract('Alias1', root.file)?.contract.name,
      ).toEqual('S1')
      expect(manager.tryFindContract('S2', root.file)).toEqual(undefined)
      expect(manager.tryFindContract('A1', root.file)?.contract.name).toEqual(
        'A1',
      )
      expect(manager.tryFindContract('A2', root.file)?.contract.name).toEqual(
        'A2',
      )
    })
  })

  describe(ParsedFilesManager.parseFiles.name, () => {
    it('throws on invalid solidity', () => {
      const files = [
        {
          path: 'path',
          content: 'invalid solidity',
        },
      ]
      expect(() =>
        ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS),
      ).toThrow()
    })

    it('realizes the longest matching remappings on file paths', () => {
      const remappings: string[] = [
        '@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/',
        '@openzeppelin/contracts-upgradeable/contracts/=lib/openzeppelin-contracts-upgradeable/long',
        '@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/',
        'openzeppelin-contracts/=lib/openzeppelin-contracts/',
        'optimism/=lib/optimism/',
      ]
      const files = [
        {
          path: '@openzeppelin/contracts-upgradeable/contracts/access/OwnableUpgradeable.sol',
          content: 'contract C1 { function f1() public {} }',
        },
        {
          path: '@openzeppelin/contracts/access/NonRenounceable.sol',
          content: 'contract C2 { function f2() public {} }',
        },
        {
          path: 'optimism/contracts/OptimismPortal.sol',
          content: 'contract C3 {}',
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, remappings)

      expect(manager.findContractDeclaration('C1').file).toHaveSubset({
        path: 'lib/openzeppelin-contracts-upgradeable/long/access/OwnableUpgradeable.sol',
      })
      expect(manager.findContractDeclaration('C2').file).toHaveSubset({
        path: 'lib/openzeppelin-contracts/contracts/access/NonRenounceable.sol',
      })
      expect(manager.findContractDeclaration('C3').file).toHaveSubset({
        path: 'lib/optimism/contracts/OptimismPortal.sol',
      })
    })

    it('throws when function is declared in top level scope', () => {
      const files = [
        {
          path: 'ImportedAsAll.sol',
          content: 'function f2() public {}',
        },
      ]

      expect(() =>
        ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS),
      ).toThrow()
    })

    it('finds non obvious library usage', () => {
      const files = [
        {
          path: 'ImportedAsAll.sol',
          content: `
          library L1 { struct S1 { bytes data; } }
          library L2 { function f1() public {} }
          `,
        },
        {
          path: 'Importing.sol',
          content: `
          import "./ImportedAsAll.sol";
          contract R1 { function r1() public { L1.S1 memory s; L2.f1(); } }
          `,
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)
      const root = manager.findContractDeclaration('R1')

      expect(root.contract.referencedContracts.sort()).toEqual(
        ['L1', 'L2'].sort(),
      )
    })
  })
})
