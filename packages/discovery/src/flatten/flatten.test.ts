import { expect } from 'earl'

import { flattenStartingFrom } from './flattenStartingFrom'
import { FileContent, ParsedFilesManager } from './ParsedFilesManager'

describe('flatten', () => {
  it('handles multiple files, imports, remappings, renames etc.', () => {
    const ROOT_CONTRACT_SOURCE =
      'contract R1 is C3, C2, C4 { function r1(L1.S1 arg) public {} }'
    const CONTRACT2_SOURCE = 'contract C2 { function r3() public {} }'
    const CONTRACT3_SOURCE = 'contract C3 { function r4() public {} }'
    const CONTRACT4_SOURCE = 'contract C4 { function r4(L1.S1 arg) public {} }'
    const LIBRARY_SOURCE = 'library L1 { struct S1 { uint256 x; } }'

    const remappings = ['remappedPath1=path1', 'remappedPath2=path2']
    const files: FileContent[] = [
      {
        path: 'Root.sol',
        content: `
                import { C2 } from "remappedPath2";
                import { C4 } from "path4";
                import "remappedPath1";

                ${ROOT_CONTRACT_SOURCE}
                `,
      },
      {
        path: 'path1',
        content: `
                import "path3";
                import "path2";
                contract C1 { function r2() public { L2.l2(); } }
                `,
      },
      {
        path: 'path2',
        content: `
                ${CONTRACT2_SOURCE}
                library L2 { function l2() public {} }
                `,
      },
      {
        path: 'path3',
        content: `
                ${CONTRACT3_SOURCE}
                ${LIBRARY_SOURCE}
                contract C33 { function r5() public {} }
                `,
      },
      {
        path: 'path4',
        content: `
        ${CONTRACT4_SOURCE}
        ${LIBRARY_SOURCE}
        `,
      },
      {
        path: 'path5',
        content: `contract C5 { function r5() public {} }`,
      },
    ]

    const manager = ParsedFilesManager.parseFiles(files, remappings)
    const flattened = flattenStartingFrom('R1', manager)

    expect(flattened).toEqual(
      [
        LIBRARY_SOURCE,
        CONTRACT4_SOURCE,
        CONTRACT2_SOURCE,
        CONTRACT3_SOURCE,
        ROOT_CONTRACT_SOURCE,
      ].join('\n\n'),
    )
  })
})
