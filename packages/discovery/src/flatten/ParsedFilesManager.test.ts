import { expect } from 'earl'

import { type FileContent, ParsedFilesManager } from './ParsedFilesManager'

describe(ParsedFilesManager.name, () => {
  const EMPTY_REMAPPINGS: string[] = []
  describe(ParsedFilesManager.prototype.findDeclaration.name, () => {
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

      expect(manager.findDeclaration('Library1').declaration).toHaveSubset({
        name: 'Library1',
        type: 'library',
        dynamicReferences: [],
        inheritsFrom: [],
      })
      expect(manager.findDeclaration('Interface1').declaration).toHaveSubset({
        name: 'Interface1',
        type: 'interface',
        dynamicReferences: [],
        inheritsFrom: [],
      })
      expect(manager.findDeclaration('Abstract1').declaration).toHaveSubset({
        name: 'Abstract1',
        type: 'abstract',
        dynamicReferences: [],
        inheritsFrom: [],
      })
      expect(manager.findDeclaration('Contract1').declaration).toHaveSubset({
        name: 'Contract1',
        type: 'contract',
        dynamicReferences: [],
        inheritsFrom: [],
      })
    })

    it('throws if contract is not found', () => {
      const files: FileContent[] = []
      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)

      expect(() => manager.findDeclaration('NonExistent')).toThrow(
        'Failed to find file declaring NonExistent',
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

      expect(manager.findDeclaration('Contract1')).toEqual({
        declaration: expect.subset({
          name: 'Contract1',
          type: 'contract',
          dynamicReferences: [],
          inheritsFrom: [],
        }),
        file: expect.subset({
          path: 'path1',
        }),
      })
    })
  })

  describe(ParsedFilesManager.prototype.tryFindDeclaration.name, () => {
    it('returns undefined if contract is not found', () => {
      const files = [
        {
          path: 'Root.sol',
          content: 'contract R1 { function r1() public {} }',
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)
      const root = manager.findDeclaration('R1')

      expect(manager.tryFindDeclaration('NonExistent', root.file)).toEqual(
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
      const root = manager.findDeclaration('R1')

      expect(
        manager.tryFindDeclaration('Alias1', root.file)?.declaration.name,
      ).toEqual('S1')
      expect(manager.tryFindDeclaration('S2', root.file)).toEqual(undefined)
      expect(
        manager.tryFindDeclaration('A1', root.file)?.declaration.name,
      ).toEqual('A1')
      expect(
        manager.tryFindDeclaration('A2', root.file)?.declaration.name,
      ).toEqual('A2')
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
      const root = manager.findDeclaration('R1')

      expect(
        manager.tryFindDeclaration('Alias1', root.file)?.declaration.name,
      ).toEqual('S1')
      expect(manager.tryFindDeclaration('S2', root.file)).toEqual(undefined)
      expect(
        manager.tryFindDeclaration('A1', root.file)?.declaration.name,
      ).toEqual('A1')
      expect(
        manager.tryFindDeclaration('A2', root.file)?.declaration.name,
      ).toEqual('A2')
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

      expect(manager.findDeclaration('C1').file).toHaveSubset({
        path: 'lib/openzeppelin-contracts-upgradeable/long/access/OwnableUpgradeable.sol',
      })
      expect(manager.findDeclaration('C2').file).toHaveSubset({
        path: 'lib/openzeppelin-contracts/contracts/access/NonRenounceable.sol',
      })
      expect(manager.findDeclaration('C3').file).toHaveSubset({
        path: 'lib/optimism/contracts/OptimismPortal.sol',
      })
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
      const root = manager.findDeclaration('R1')

      expect(root.declaration.dynamicReferences.sort()).toEqual(
        ['L1', 'L2'].sort(),
      )
    })

    it('finds non obvious top-level declaration usage', () => {
      const files = [
        {
          path: 'ImportedAsAll.sol',
          content: `
          type T1 is uint256;
          function f1() public {}
          struct S1 { bytes data; }
          library L1 { struct S1 { bytes data; } }
          library L2 { function f1() public {} }
          `,
        },
        {
          path: 'Importing.sol',
          content: `
          import "./ImportedAsAll.sol";
          contract R1 { function r1() public {
              L1.S1 memory s;
              L2.f1();
              f1();
              T1 t;
              S1 memory s1;
          } }
          `,
        },
      ]

      const manager = ParsedFilesManager.parseFiles(files, EMPTY_REMAPPINGS)
      const root = manager.findDeclaration('R1')

      expect(root.declaration.dynamicReferences.sort()).toEqual(
        ['L1', 'L2', 'S1', 'T1', 'f1'].sort(),
      )
    })
  })
})
