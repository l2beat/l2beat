import type * as AST from '@mradomski/fast-solidity-parser'
import { expect } from 'earl'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import {
  type DeclarationType,
  ParsedFilesManager,
  type TopLevelDeclaration,
} from './ParsedFilesManager'

describe(generateInterfaceSourceFromContract.name, () => {
  it('generates abstract contract from contract', () => {
    const source = String.raw`contract E {
            uint256 public variableToSkip;
            using ThisShouldBe for Skipped;
            modifier modifierToSkip() { _; }

            struct MyStructDifferent {
                mapping(uint256 => uint256) elementInside;
            }
            struct MyStruct {
                uint256 elementInside;
                MyStructDifferent[] array;
            }

            event MyEvent(uint256 a);
            event MyEvent2(uint256 a, uint256 b);
            error MyError(uint256 a);
            enum MyEnum { A, B }

            function B(uint256 element, MyStruct memory arg2) returns (uint256) {
                element += arg.elementInside;
                return element;
            }

            function X() returns (uint256) {
                return 1234;
            }
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function variableToSkip() external view returns (uint256);

    struct MyStructDifferent {
        mapping(uint256 => uint256) elementInside;
    }
    struct MyStruct {
        uint256 elementInside;
        MyStructDifferent[] array;
    }

    event MyEvent(uint256 a);
    event MyEvent2(uint256 a, uint256 b);

    error MyError(uint256 a);

    enum MyEnum {
        A,
        B
    }

    function B(uint256 element, MyStruct memory arg2) external returns (uint256);
    function X() external returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('generates abstract contract from abstract contract', () => {
    const source = String.raw`contract E {
            function B(uint256 element) returns (uint256) { return element + 1; }
            function X() returns (uint256) { return 1234; }
            function XYZ(address receiver) payable public returns (uint256);
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function B(uint256 element) external returns (uint256);
    function X() external returns (uint256);
    function XYZ(address receiver) external payable returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('generates corrects overrides', () => {
    const source = String.raw`contract E {
            function A(uint256 element) override returns (uint256) { return element + 1; }
            function X() override(C1) returns (uint256) { return 1234; }
            function XYZ(address receiver) override(C1, C2) payable public returns (uint256);
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function A(uint256 element) external override returns (uint256);
    function X() external override(C1) returns (uint256);
    function XYZ(address receiver) external payable override(C1, C2) returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('preserves address payable parameters', () => {
    const source = String.raw`contract E {
            function foo(address payable to) external {}
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function foo(address payable to) external;
}`
    expect(result).toEqual(expected)
  })

  it('emits simple public variable', () => {
    const source = String.raw`contract E {
            uint256 public totalSupply;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function totalSupply() external view returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('emits mapping public variable', () => {
    const source = String.raw`contract E {
            mapping(address => uint256) public balanceOf;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function balanceOf(address) external view returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('emits nested mapping public variable', () => {
    const source = String.raw`contract E {
            mapping(address => mapping(address => uint256)) public allowance;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function allowance(address, address) external view returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('emits array public variable', () => {
    const source = String.raw`contract E {
            address[] public owners;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function owners(uint256) external view returns (address);
}`
    expect(result).toEqual(expected)
  })

  it('skips private and internal variables', () => {
    const source = String.raw`contract E {
            uint256 private secret;
            uint256 internal data;
            function x() returns (uint256) { return 1; }
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function x() external returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('emits bytes and string public variables', () => {
    const source = String.raw`contract E {
            bytes public data;
            string public name;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function data() external view returns (bytes memory);
    function name() external view returns (string memory);
}`
    expect(result).toEqual(expected)
  })

  it('emits struct public variable', () => {
    const source = String.raw`contract E {
            struct Info { uint256 value; }
            Info public info;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    struct Info {
        uint256 value;
    }

    function info() external view returns (Info memory);
}`
    expect(result).toEqual(expected)
  })

  it('emits mapping to bytes public variable', () => {
    const source = String.raw`contract E {
            mapping(uint256 => bytes) public items;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function items(uint256) external view returns (bytes memory);
}`
    expect(result).toEqual(expected)
  })

  it('emits typedef public variable', () => {
    const source = String.raw`contract E {
            type Position is uint256;
            Position public currentPos;
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    type Position is uint256;

    function currentPos() external view returns (Position);
}`
    expect(result).toEqual(expected)
  })

  it('emits getter for public constant variable', () => {
    const source = String.raw`contract E {
            bytes public constant VERSION = "1.0.0";
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function VERSION() external view returns (bytes memory);
}`
    expect(result).toEqual(expected)
  })

  it('emits getter for public immutable variable', () => {
    const source = String.raw`contract E {
            address public immutable owner;

            constructor() {
                owner = address(0);
            }
        }`
    const { declaration, typeMap } = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(declaration, typeMap)

    const expected = String.raw`// NOTE(l2beat): This is an interface, generated from the contract source code.
interface E {
    function owner() external view returns (address);
}`
    expect(result).toEqual(expected)
  })

  it('throws for enum', () => {
    const source = 'enum E { A, B }'
    const { declaration, typeMap } = fromSource(source, 'E')

    expect(() =>
      generateInterfaceSourceFromContract(declaration, typeMap),
    ).toThrow('Only contracts')
  })

  it('throws for interface', () => {
    const source = 'interface E { function B(); }'
    const { declaration, typeMap } = fromSource(source, 'E')

    expect(() =>
      generateInterfaceSourceFromContract(declaration, typeMap),
    ).toThrow('Only contracts')
  })

  it('throws for library', () => {
    const source = 'library E { function B() public {} }'
    const { declaration, typeMap } = fromSource(source, 'E')

    expect(() =>
      generateInterfaceSourceFromContract(declaration, typeMap),
    ).toThrow('Only contracts')
  })

  it('throws for struct', () => {
    const source = 'struct E { uint256 a; }'
    const { declaration, typeMap } = fromSource(source, 'E')

    expect(() =>
      generateInterfaceSourceFromContract(declaration, typeMap),
    ).toThrow('Only contracts')
  })

  it('throws for function', () => {
    const source = 'function E() public {}'
    const { declaration, typeMap } = fromSource(source, 'E')

    expect(() =>
      generateInterfaceSourceFromContract(declaration, typeMap),
    ).toThrow('Only contracts')
  })

  it('throws for typedef', () => {
    const source = 'type E is uint256;'
    const { declaration, typeMap } = fromSource(source, 'E')

    expect(() =>
      generateInterfaceSourceFromContract(declaration, typeMap),
    ).toThrow('Only contracts')
  })
})

function fromSource(
  source: string,
  entryName: string,
): { declaration: TopLevelDeclaration; typeMap: Map<string, DeclarationType> } {
  const parsedFilesManager = ParsedFilesManager.parseFiles(
    [
      {
        path: 'contract.sol',
        content: source,
      },
    ],
    [],
  )

  const declaration = parsedFilesManager.findDeclaration(entryName).declaration
  const typeMap = new Map<string, DeclarationType>()

  // Build type map from all declarations in the file
  const file = parsedFilesManager.findFileDeclaring(entryName)
  for (const decl of file.topLevelDeclarations) {
    typeMap.set(decl.name, decl.type)
    if (
      decl.type === 'contract' ||
      decl.type === 'abstract' ||
      decl.type === 'interface' ||
      decl.type === 'library'
    ) {
      const ast = decl.ast as AST.ContractDefinition
      for (const sub of ast.subNodes) {
        const node = sub as AST.ASTNode
        if (node.type === 'StructDefinition') {
          typeMap.set(`${decl.name}.${node.name}`, 'struct')
          if (!typeMap.has(node.name)) typeMap.set(node.name, 'struct')
        } else if (node.type === 'EnumDefinition') {
          typeMap.set(`${decl.name}.${node.name}`, 'enum')
          if (!typeMap.has(node.name)) typeMap.set(node.name, 'enum')
        } else if (node.type === 'TypeDefinition') {
          typeMap.set(`${decl.name}.${node.name}`, 'typedef')
          if (!typeMap.has(node.name)) typeMap.set(node.name, 'typedef')
        }
      }
    }
  }

  return { declaration, typeMap }
}
