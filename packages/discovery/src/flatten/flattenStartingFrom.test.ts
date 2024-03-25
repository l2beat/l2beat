import { expect, mockFn, mockObject } from 'earl'

import { flattenStartingFrom } from './flattenStartingFrom'
import {
  DeclarationFilePair,
  ParsedFile,
  ParsedFilesManager,
  TopLevelDeclaration,
} from './ParsedFilesManager'

describe(flattenStartingFrom.name, () => {
  const DUMMY_AST_NODE = {}
  const LIBRARY_SOURCE =
    'library Contract2\r\n{\r\n function lf() public {}\r\n }'
  const BASE_SOURCE =
    'contract Contract3\r\n{\r\n function bcf() public {}\r\n }'
  const ROOT_SOURCE =
    'contract Contract1 is Contract3\r\n {\r\n function cf() public {\r\n Contract2.lf(); this.bcf();\r\n }\r\n }'
  const ROOT_FILE_SOURCE = `${LIBRARY_SOURCE}${BASE_SOURCE}${ROOT_SOURCE}`

  const LIBRARY_SOURCE_UNIX =
    'library Contract2\n{\n function lf() public {}\n }'
  const BASE_SOURCE_UNIX =
    'contract Contract3\n{\n function bcf() public {}\n }'
  const ROOT_SOURCE_UNIX =
    'contract Contract1 is Contract3\n {\n function cf() public {\n Contract2.lf(); this.bcf();\n }\n }'

  const LIBRARY_CONTRACT: TopLevelDeclaration = {
    name: 'Contract2',
    type: 'library',
    ast: DUMMY_AST_NODE as any,
    byteRange: {
      start: 0,
      end: LIBRARY_SOURCE.length - 1,
    },
    inheritsFrom: [],
    referencedDeclaration: [],
  }

  const BASE_CONTRACT: TopLevelDeclaration = {
    name: 'Contract3',
    type: 'contract',
    ast: DUMMY_AST_NODE as any,
    byteRange: {
      start: LIBRARY_SOURCE.length,
      end: LIBRARY_SOURCE.length + BASE_SOURCE.length - 1,
    },
    inheritsFrom: [],
    referencedDeclaration: [LIBRARY_CONTRACT.name],
  }

  const ROOT_CONTRACT: TopLevelDeclaration = {
    name: 'Contract1',
    type: 'contract',
    ast: DUMMY_AST_NODE as any,
    byteRange: {
      start: LIBRARY_SOURCE.length + BASE_SOURCE.length,
      end: LIBRARY_SOURCE.length + BASE_SOURCE.length + ROOT_SOURCE.length - 1,
    },
    inheritsFrom: [BASE_CONTRACT.name],
    referencedDeclaration: [LIBRARY_CONTRACT.name],
  }

  const ROOT_PARSED_FILE: Omit<ParsedFile, 'rootASTNode'> = {
    path: 'path',
    content: ROOT_FILE_SOURCE,
    topLevelDeclarations: [ROOT_CONTRACT, LIBRARY_CONTRACT],
    importDirectives: [],
  }

  it('flattens the source code', () => {
    const rootContractName = 'Contract1'
    const parsedFileManager = mockObject<ParsedFilesManager>({
      findDeclaration: mockFn((contractName): DeclarationFilePair => {
        expect(contractName).toEqual(rootContractName)

        return {
          declaration: ROOT_CONTRACT,
          file: ROOT_PARSED_FILE,
        } as DeclarationFilePair
      }),
      tryFindDeclaration: mockFn(
        (contractName, file): DeclarationFilePair | undefined => {
          expect(file).toEqual(ROOT_PARSED_FILE)

          if (contractName === LIBRARY_CONTRACT.name) {
            return {
              declaration: LIBRARY_CONTRACT,
              file: ROOT_PARSED_FILE,
            } as DeclarationFilePair
          } else if (contractName === BASE_CONTRACT.name) {
            return {
              declaration: BASE_CONTRACT,
              file: ROOT_PARSED_FILE,
            } as DeclarationFilePair
          }
        },
      ),
    })

    const result = flattenStartingFrom(rootContractName, parsedFileManager)

    expect(result).toEqual(
      [LIBRARY_SOURCE_UNIX, BASE_SOURCE_UNIX, ROOT_SOURCE_UNIX].join('\n\n'),
    )
  })

  it('throws if fails to find a contract', () => {
    const rootContractName = 'Contract1'
    const parsedFileManager = mockObject<ParsedFilesManager>({
      findDeclaration: mockFn((contractName): DeclarationFilePair => {
        expect(contractName).toEqual(rootContractName)

        return {
          declaration: ROOT_CONTRACT,
          file: ROOT_PARSED_FILE,
        } as DeclarationFilePair
      }),
      tryFindDeclaration: mockFn((): DeclarationFilePair | undefined => {
        return undefined
      }),
    })

    expect(() =>
      flattenStartingFrom(rootContractName, parsedFileManager),
    ).toThrow('Failed to find contract Contract3')
  })
})
