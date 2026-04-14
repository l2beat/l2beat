import { expect } from 'earl'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import {
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
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    uint256 public variableToSkip;

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

    function B(uint256 element, MyStruct memory arg2) public virtual returns (uint256);
    function X() public virtual returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('generates abstract contract from abstract contract', () => {
    const source = String.raw`contract E {
            function B(uint256 element) returns (uint256) { return element + 1; }
            function X() returns (uint256) { return 1234; }
            function XYZ(address receiver) payable public returns (uint256);
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    function B(uint256 element) public virtual returns (uint256);
    function X() public virtual returns (uint256);
    function XYZ(address receiver) public payable virtual returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('generates corrects overrides', () => {
    const source = String.raw`contract E {
            function A(uint256 element) override returns (uint256) { return element + 1; }
            function X() override(C1) returns (uint256) { return 1234; }
            function XYZ(address receiver) override(C1, C2) payable public returns (uint256);
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    function A(uint256 element) public virtual override returns (uint256);
    function X() public virtual override(C1) returns (uint256);
    function XYZ(address receiver) public payable virtual override(C1, C2) returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('preserves address payable parameters', () => {
    const source = String.raw`contract E {
            function foo(address payable to) external {}
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    function foo(address payable to) external virtual;
}`
    expect(result).toEqual(expected)
  })

  it('emits simple public variable', () => {
    const source = String.raw`contract E {
            uint256 public totalSupply;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    uint256 public totalSupply;
}`
    expect(result).toEqual(expected)
  })

  it('emits mapping public variable', () => {
    const source = String.raw`contract E {
            mapping(address => uint256) public balanceOf;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    mapping(address => uint256) public balanceOf;
}`
    expect(result).toEqual(expected)
  })

  it('emits nested mapping public variable', () => {
    const source = String.raw`contract E {
            mapping(address => mapping(address => uint256)) public allowance;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    mapping(address => mapping(address => uint256)) public allowance;
}`
    expect(result).toEqual(expected)
  })

  it('emits array public variable', () => {
    const source = String.raw`contract E {
            address[] public owners;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    address[] public owners;
}`
    expect(result).toEqual(expected)
  })

  it('skips private and internal variables', () => {
    const source = String.raw`contract E {
            uint256 private secret;
            uint256 internal data;
            function x() returns (uint256) { return 1; }
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    function x() public virtual returns (uint256);
}`
    expect(result).toEqual(expected)
  })

  it('emits bytes and string public variables', () => {
    const source = String.raw`contract E {
            bytes public data;
            string public name;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    bytes public data;
    string public name;
}`
    expect(result).toEqual(expected)
  })

  it('emits struct public variable', () => {
    const source = String.raw`contract E {
            struct Info { uint256 value; }
            Info public info;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    struct Info {
        uint256 value;
    }

    Info public info;
}`
    expect(result).toEqual(expected)
  })

  it('emits mapping to bytes public variable', () => {
    const source = String.raw`contract E {
            mapping(uint256 => bytes) public items;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    mapping(uint256 => bytes) public items;
}`
    expect(result).toEqual(expected)
  })

  it('emits typedef public variable', () => {
    const source = String.raw`contract E {
            type Position is uint256;
            Position public currentPos;
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    type Position is uint256;

    Position public currentPos;
}`
    expect(result).toEqual(expected)
  })

  it('emits getter for public constant variable', () => {
    const source = String.raw`contract E {
            bytes public constant VERSION = "1.0.0";
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    function VERSION() external view virtual returns (bytes memory);
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
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is an abstract contract, generated from the contract source code.
abstract contract E {
    function owner() external view virtual returns (address);
}`
    expect(result).toEqual(expected)
  })

  it('throws for enum', () => {
    const source = 'enum E { A, B }'
    const entry = fromSource(source, 'E')

    expect(() => generateInterfaceSourceFromContract(entry)).toThrow(
      'Only contracts',
    )
  })

  it('throws for interface', () => {
    const source = 'interface E { function B(); }'
    const entry = fromSource(source, 'E')

    expect(() => generateInterfaceSourceFromContract(entry)).toThrow(
      'Only contracts',
    )
  })

  it('throws for library', () => {
    const source = 'library E { function B() public {} }'
    const entry = fromSource(source, 'E')

    expect(() => generateInterfaceSourceFromContract(entry)).toThrow(
      'Only contracts',
    )
  })

  it('throws for struct', () => {
    const source = 'struct E { uint256 a; }'
    const entry = fromSource(source, 'E')

    expect(() => generateInterfaceSourceFromContract(entry)).toThrow(
      'Only contracts',
    )
  })

  it('throws for function', () => {
    const source = 'function E() public {}'
    const entry = fromSource(source, 'E')

    expect(() => generateInterfaceSourceFromContract(entry)).toThrow(
      'Only contracts',
    )
  })

  it('throws for typedef', () => {
    const source = 'type E is uint256;'
    const entry = fromSource(source, 'E')

    expect(() => generateInterfaceSourceFromContract(entry)).toThrow(
      'Only contracts',
    )
  })
})

function fromSource(source: string, entryName: string): TopLevelDeclaration {
  const parsedFilesManager = ParsedFilesManager.parseFiles(
    [
      {
        path: 'contract.sol',
        content: source,
      },
    ],
    [],
  )

  return parsedFilesManager.findDeclaration(entryName).declaration
}
