import { expect } from 'earl'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import {
  ParsedFilesManager,
  type TopLevelDeclaration,
} from './ParsedFilesManager'

describe(generateInterfaceSourceFromContract.name, () => {
  it('generates interface from contract', () => {
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

    const expected = String.raw`// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface E {
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

  it('generates interface from abstract contract', () => {
    const source = String.raw`contract E {
            function B(uint256 element) returns (uint256) { return element + 1; }
            function X() returns (uint256) { return 1234; }
            function XYZ(address receiver) payable public returns (uint256);
        }`
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
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
    const entry = fromSource(source, 'E')

    const result = generateInterfaceSourceFromContract(entry)

    const expected = String.raw`// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface E {
    function A(uint256 element) external override returns (uint256);
    function X() external override(C1) returns (uint256);
    function XYZ(address receiver) external payable override(C1, C2) returns (uint256);
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
