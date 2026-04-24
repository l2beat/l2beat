import { expect } from 'earl'
import { flattenStartingFrom } from './flatten'
import type { FileContent } from './ParsedFilesManager'

function dedent(s: string): string {
  const lines = s.split('\n')
  if (lines.length > 0 && lines[0]?.trim() === '') lines.shift()
  while (lines.length > 0 && lines[lines.length - 1]?.trim() === '') lines.pop()
  const indent = Math.min(
    ...lines
      .filter((l) => l.trim().length > 0)
      .map((l) => l.match(/^ */)![0].length),
  )
  return lines.map((l) => l.slice(indent)).join('\n')
}

function sol(path: string, content: string): FileContent {
  return { path, content: dedent(content) }
}

describe('flatten', () => {
  it('handles multiple files, imports, remappings, renames etc.', () => {
    const remappings = [
      'remappedPath1=path1',
      'Root.sol:remappedPath2=path2',
      'remappedPath2=path3',
    ]
    const files = [
      sol(
        'Root.sol',
        `
        import { C2 } from "remappedPath2";
        import { C4 } from "path4";
        import "../../../remappedPath1";

        contract R1 is C3, C2, C4 { function r1(L1.S1 arg) public {} }
      `,
      ),
      sol(
        'path1',
        `
        import "path3";
        import "path2";
        contract C1 { function r2() public { L2.l2(); } }
      `,
      ),
      sol(
        'path2',
        `
        contract C2 { function r3() public {} }
        library L2 { function l2() public {} }
      `,
      ),
      sol(
        'path3',
        `
        contract C3 { function r4() public {} }
        type T1 is uint256;

        library L1 { struct S1 { T1 x; } }
        contract C33 { function r5() public {} }
      `,
      ),
      sol(
        'path4',
        `
        contract C4 { function r4(L1.S1 arg) public {} }
        type T1 is uint256;

        library L1 { struct S1 { T1 x; } }
      `,
      ),
      sol('path5', 'contract C5 { function r5() public {} }'),
    ]

    const flattened = flattenStartingFrom('R1', files, remappings)

    expect(flattened).toEqual(
      dedent(`
      contract C3 { function r4() public {} }

      contract C2 { function r3() public {} }

      type T1 is uint256;

      library L1 { struct S1 { T1 x; } }

      contract C4 { function r4(L1.S1 arg) public {} }

      contract R1 is C3, C2, C4 { function r1(L1.S1 arg) public {} }
    `),
    )
  })

  it('resolves aliased imports back to original names', () => {
    const files = [
      sol(
        'Root.sol',
        `
        import { Foo as Bar } from "Types.sol";
        contract Root is Bar {
            function f(Bar.S memory x) public {}
        }
      `,
      ),
      sol('Types.sol', 'contract Foo { struct S { uint256 x; } }'),
    ]

    const flattened = flattenStartingFrom('Root', files, [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      contract Foo { struct S { uint256 x; } }

      contract Root is Foo {
          function f(Foo.S memory x) public {}
      }
    `),
    )
  })

  it('resolves aliased imports inside generated interfaces', () => {
    const files = [
      sol(
        'Root.sol',
        `
        import { Dynamic as DynamicAlias } from "Dynamic.sol";
        import { Base as BaseRootAlias } from "Base.sol";
        contract Root {
            function f(BaseRootAlias.S memory value) public pure returns (uint256) {
                BaseRootAlias.S memory copy = value;
                return DynamicAlias.Structure({ x: 1 }).x;
            }
        }
      `,
      ),
      sol(
        'Dynamic.sol',
        `
        import { Base as BaseAlias } from "Base.sol";
        abstract contract Dynamic is BaseAlias {
            struct Structure {
                uint256 x;
            }

            event Pinged(BaseAlias.S value);

            function ping() public virtual;
        }
      `,
      ),
      sol('Base.sol', 'contract Base { struct S { uint256 x; } }'),
    ]

    const flattened = flattenStartingFrom('Root', files, [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      contract Base { struct S { uint256 x; } }

      abstract contract Dynamic is Base {
          struct Structure {
              uint256 x;
          }

          event Pinged(Base.S value);

          function ping() public virtual;
      }

      contract Root {
          function f(Base.S memory value) public pure returns (uint256) {
              Base.S memory copy = value;
              return Dynamic.Structure({ x: 1 }).x;
          }
      }
    `),
    )
  })

  it('picks correct contracts to be regenerated as interfaces, for minimized output', () => {
    const file = sol(
      'Root.sol',
      `
      contract DC1 is DC2 { function df() public {} }
      contract DC2 is C2 { }

      contract C2 { }
      contract C3 is C2 { }
      contract C4 { }

      contract R1 is C2, C3, C4 {
          function f(address x) public {
              DC1(x).df();
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [])
    expect(flattened).toEqual(
      dedent(`
      contract C2 { }

      contract C3 is C2 { }

      contract C4 { }

      contract R1 is C2, C3, C4 {
          function f(address x) public {
              DC1(x).df();
          }
      }
    `),
    )
  })

  it('picks correct contracts to be regenerated as interfaces, for full output', () => {
    const file = sol(
      'Root.sol',
      `
      contract DC1 is DC2 { function df() public {} }

      contract DC2 is C2 {
          struct S1 { uint256 x; }
          function f1() public {
              S1 memory s;
              s.somethingmagic();
              s.thiswillberemoved();
          }
      }

      contract C2 { }
      contract C3 is C2 { }
      contract C4 { }

      contract R1 is C2, C3, C4 {
          function f(address x) public {
              DC1(x).df();
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })
    expect(flattened).toEqual(
      dedent(`
      contract C2 { }

      contract C3 is C2 { }

      contract C4 { }

      contract DC2 is C2 {
          struct S1 { uint256 x; }
          function f1() public {
              S1 memory s;
              s.somethingmagic();
              s.thiswillberemoved();
          }
      }

      contract DC1 is DC2 { function df() public {} }

      contract R1 is C2, C3, C4 {
          function f(address x) public {
              DC1(x).df();
          }
      }
    `),
    )
  })

  it('contract used both dynamically and via inheritance is not purely dynamic', () => {
    // R1 visits Base first because it is the first inherited contract.
    // Base then pushes its dynamic reference to DC1 on top of the stack,
    // so Shared is first reached through the dynamic path DC1 -> Shared.
    // R1 also inherits Static, which reaches Shared via inheritance later.
    // With first-write-wins logic, Shared stays marked as purely dynamic
    // even though it is also used through inheritance.
    const file = sol(
      'Root.sol',
      `
      contract Shared { function s() public {} }

      contract DC1 is Shared { function df() public {} }

      contract Base {
          function f(address x) public {
              DC1(x).df();
          }
      }

      contract Static is Shared { }

      contract R1 is Base, Static { }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      contract Shared { function s() public {} }

      contract DC1 is Shared { function df() public {} }

      contract Base {
          function f(address x) public {
              DC1(x).df();
          }
      }

      contract Static is Shared { }

      contract R1 is Base, Static { }
    `),
    )
  })

  it('dynamic abstract contract extending a non-dynamic base is not turned into an interface', () => {
    const file = sol(
      'Root.sol',
      `
      abstract contract Shared { }

      abstract contract Dynamic is Shared {
          function df() public virtual;
      }

      contract R1 is Shared {
          function f(address x) public {
              Dynamic(x).df();
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      abstract contract Shared { }

      abstract contract Dynamic is Shared {
          function df() public virtual;
      }

      contract R1 is Shared {
          function f(address x) public {
              Dynamic(x).df();
          }
      }
    `),
    )
  })

  it('dynamic contract extending a non-dynamic base is not turned into an interface', () => {
    const file = sol(
      'Root.sol',
      `
      abstract contract Shared { }

      contract Dynamic is Shared {
          function df() public virtual;
      }

      contract R1 is Shared {
          function f(address x) public {
              Dynamic(x).df();
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      abstract contract Shared { }

      contract Dynamic is Shared {
          function df() public virtual;
      }

      contract R1 is Shared {
          function f(address x) public {
              Dynamic(x).df();
          }
      }
    `),
    )
  })

  it('ordering of using doesnt matter', () => {
    const file = sol(
      'Root.sol',
      `
      import { VMStatus } from "Lib.sol";

      library VMStatuses {
          VMStatus internal constant VALID = VMStatus.wrap(0);
      }

      contract R1 {
          constructor() {
              VMStatuses.VALID.raw(0);
          }
      }
    `,
    )
    const libFile = sol(
      'Lib.sol',
      `
      using LibVMStatus for VMStatus global;

      type VMStatus is uint8;

      library LibVMStatus {
          function raw(VMStatus _vmstatus) internal pure returns (uint8 vmstatus_) {
              assembly {
                  vmstatus_ := _vmstatus
              }
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file, libFile], [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      library LibVMStatus {
          function raw(VMStatus _vmstatus) internal pure returns (uint8 vmstatus_) {
              assembly {
                  vmstatus_ := _vmstatus
              }
          }
      }

      using LibVMStatus for VMStatus global;

      type VMStatus is uint8;

      library VMStatuses {
          VMStatus internal constant VALID = VMStatus.wrap(0);
      }

      contract R1 {
          constructor() {
              VMStatuses.VALID.raw(0);
          }
      }
    `),
    )
  })

  it('includes global using declarations for user-defined value types', () => {
    const file = sol(
      'Root.sol',
      `
      type Position is uint128;

      using LibPosition for Position global;

      contract Root {
          function f() public pure returns (Position) {
              Position position = Position.wrap(0);
              return position.update();
          }
      }

      library LibPosition {
          function update(Position self) internal pure returns (Position) {
              return self;
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('Root', [file], [])

    expect(flattened).toEqual(
      dedent(`
      library LibPosition {
          function update(Position self) internal pure returns (Position) {
              return self;
          }
      }

      using LibPosition for Position global;

      type Position is uint128;

      contract Root {
          function f() public pure returns (Position) {
              Position position = Position.wrap(0);
              return position.update();
          }
      }
    `),
    )
  })

  it('inheritance namespacing', () => {
    const rootFile = sol(
      'Root.sol',
      `
      import './DependencyFile.sol' as Namespace;

      contract R1 is Namespace.C2 {
          function f(address x) public {
              DC1(x).df();
          }
      }
    `,
    )

    const c2File = sol('DependencyFile.sol', 'contract C2 { }')

    const flattened = flattenStartingFrom('R1', [rootFile, c2File], [])
    expect(flattened).toEqual(
      dedent(`
      contract C2 { }

      contract R1 is Namespace.C2 {
          function f(address x) public {
              DC1(x).df();
          }
      }
    `),
    )
  })

  it('../ in unit name', () => {
    const rootFile = sol(
      'a/b/c/Root.sol',
      `
      import { StringClass } from '@stdlib/String.sol';

      contract R1 is StringClass {
          function f(address x) public { DC1(x).df(); }
      }
    `,
    )

    const c2File = sol('../somewhere/String.sol', 'contract StringClass { }')

    const flattened = flattenStartingFrom(
      'R1',
      [rootFile, c2File],
      ['@stdlib=../somewhere/'],
    )
    expect(flattened).toEqual(
      dedent(`
      contract StringClass { }

      contract R1 is StringClass {
          function f(address x) public { DC1(x).df(); }
      }
    `),
    )
  })

  it('top level errors, events and constants', () => {
    const rootFile = sol(
      'Root.sol',
      `
      import "./Globals.sol";
      contract R1 {
        function doSomething() public {
          emit EventHappened(GLOBAL_VALUE, msg.sender);
          revert CustomError(msg.sender);
        }
      }
    `,
    )

    const globalsFile = sol(
      'Globals.sol',
      `
      uint256 constant GLOBAL_VALUE = 42;
      event EventHappened(uint256 value, address account);
      error CustomError(address account);
    `,
    )

    const flattened = flattenStartingFrom('R1', [rootFile, globalsFile], [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      event EventHappened(uint256 value, address account);

      uint256 constant GLOBAL_VALUE = 42;

      error CustomError(address account);

      contract R1 {
        function doSomething() public {
          emit EventHappened(GLOBAL_VALUE, msg.sender);
          revert CustomError(msg.sender);
        }
      }
    `),
    )
  })

  it('file-level constant referencing a renamed type', () => {
    // Two libraries share the name `Lib`. The file-level constant in
    // Globals.sol references `Lib`, so renameIdentifiers runs on the
    // FileLevelConstant node when flattening.
    const files = [
      sol(
        'Root.sol',
        `
        import { Lib } from "OtherLib.sol";
        import { VALUE } from "Globals.sol";

        contract R1 {
            function f() public pure returns (uint256) {
                return Lib.value() + VALUE;
            }
        }
      `,
      ),
      sol(
        'Globals.sol',
        `
        import { Lib } from "MainLib.sol";
        uint256 constant VALUE = Lib.value() + 1;
      `,
      ),
      sol(
        'MainLib.sol',
        'library Lib { function value() internal pure returns (uint256) { return 1; } }',
      ),
      sol(
        'OtherLib.sol',
        'library Lib { function value() internal pure returns (uint256) { return 2; } }',
      ),
    ]

    const flattened = flattenStartingFrom('R1', files, [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      library Lib { function value() internal pure returns (uint256) { return 2; } }

      library Lib_1 { function value() internal pure returns (uint256) { return 1; } }

      uint256 constant VALUE = Lib_1.value() + 1;

      contract R1 {
          function f() public pure returns (uint256) {
              return Lib.value() + VALUE;
          }
      }
    `),
    )
  })

  it('regression - dynamic contract referencing its own nested struct becomes an interface', () => {
    const files = [
      sol(
        'Root.sol',
        `
      import * as Imported from "./Imported.sol";
      import { Imported } from "./Imported.sol";

      contract Namespace {
          struct NewingStruct {
              uint256 x;
          }
      }

      contract ToBeInterface {
          struct UsageStruct {
              uint256 x;
              address owner;
          }

          function f() public view returns (uint256) {
              UsageStruct[] memory x = new UsageStruct[](1, msg.sender);
              Namespace.NewingStruct[] memory y = new Namespace.NewingStruct[](1);
              Imported.NewingStruct[] memory z = new Imported.NewingStruct[](msg.sender);
              return s.x;
          }
      }

      contract Root {
          function z(address a) {
              ToBeInterface(a).f();
          }
      }
      `,
      ),
      sol(
        'Imported.sol',
        `
        struct NewingStruct {
              address owner;
        }
      `,
      ),
    ]

    const flattened = flattenStartingFrom('Root', files, [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      dedent(`
      // NOTE(l2beat): This is an interface, generated from the contract source code.
      interface Namespace {
          struct NewingStruct {
              uint256 x;
          }
      }

      // NOTE(l2beat): This is an interface, generated from the contract source code.
      interface ToBeInterface {
          struct UsageStruct {
              uint256 x;
              address owner;
          }

          function f() external view returns (uint256);
      }

      contract Root {
          function z(address a) {
              ToBeInterface(a).f();
          }
      }
    `),
    )
  })

  it('contracts which are called with new are not turned into interfaces', () => {
    const file = sol(
      'Root.sol',
      `
      contract Newing {
          constructor() payable { }
      }

      contract NewingValues {
          constructor() payable { }
      }

      contract R1 {
          function f(address x) public {
              new Newing();
              new NewingValues{ value: 123 }();
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })
    expect(flattened).toEqual(
      dedent(`
      contract Newing {
          constructor() payable { }
      }

      contract NewingValues {
          constructor() payable { }
      }

      contract R1 {
          function f(address x) public {
              new Newing();
              new NewingValues{ value: 123 }();
          }
      }
    `),
    )
  })

  // TODO(radomski): This should be smart enough to understand that the body
  // is gone and we no longer reference UsesNewing
  it('regression - drops used things when turned into an interface', () => {
    const file = sol(
      'Root.sol',
      `
      contract Newing {
          constructor() payable { }
      }

      library UsesNewing {
          function use() internal {
              new Newing{ value: 123 }();
          }
      }

      abstract contract DynamicContract {
          struct Structure {
              uint256 field;
          }

          function usingLibrary() {
              UsesNewing.use();
          }
      }

      contract R1 {
          function f(address x) public {
              return DynamicContract.Structure({ field: 1337 });
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })
    expect(flattened).toEqual(
      dedent(`
      contract Newing {
          constructor() payable { }
      }

      library UsesNewing {
          function use() internal {
              new Newing{ value: 123 }();
          }
      }

      // NOTE(l2beat): This is an interface, generated from the contract source code.
      interface DynamicContract {
          struct Structure {
              uint256 field;
          }

          function usingLibrary() external;
      }

      contract R1 {
          function f(address x) public {
              return DynamicContract.Structure({ field: 1337 });
          }
      }
    `),
    )
  })

  // TODO(radomski): This should be smart enough to understand that the body
  // is gone and we no longer reference UsesNewing
  it('regression - new a base type', () => {
    const file = sol(
      'Root.sol',
      `
      contract R1 {
          function f(address x) public {
              new bytes(12);
          }
      }
    `,
    )

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })
    expect(flattened).toEqual(
      dedent(`
      contract R1 {
          function f(address x) public {
              new bytes(12);
          }
      }
    `),
    )
  })

  it('regression - signature contract with public variable stays a public variable', () => {
    const files = [
      sol(
        'Whitelist.sol',
        `
        abstract contract WhitelistConsumer {
            address public whitelist;

            modifier onlyWhitelisted() {
                if (whitelist != address(0)) {
                    require(Whitelist(whitelist).isAllowed(msg.sender), "NOT_WHITELISTED");
                }
                _;
            }
        }

        contract Whitelist {
            mapping(address => bool) public isAllowed;

            function setWhitelist(address[] memory user, bool[] memory val) external {
                require(user.length == val.length, "INVALID_INPUT");

                for (uint256 i = 0; i < user.length; i++) {
                    isAllowed[user[i]] = val[i];
                }
            }
        }
      `,
      ),
      sol(
        'Root.sol',
        `
        import { WhitelistConsumer } from 'Whitelist.sol';

        contract R is WhitelistConsumer { }
      `,
      ),
    ]

    const flattened = flattenStartingFrom('R', files, [], { includeAll: true })
    expect(flattened).toEqual(
      dedent(`
      // NOTE(l2beat): This is an interface, generated from the contract source code.
      interface Whitelist {
          function isAllowed(address) external view returns (bool);
          function setWhitelist(address[] memory user, bool[] memory val) external;
      }

      abstract contract WhitelistConsumer {
          address public whitelist;

          modifier onlyWhitelisted() {
              if (whitelist != address(0)) {
                  require(Whitelist(whitelist).isAllowed(msg.sender), "NOT_WHITELISTED");
              }
              _;
          }
      }

      contract R is WhitelistConsumer { }
    `),
    )
  })

  it('regression - function name clash', () => {
    const file = sol(
      'root.sol',
      `
      interface Iface {
      \tfunction foo(address payable to) external;
      }

      contract ContractUsingIface is Iface {
      \tfunction foo(address payable to) external { }
      }

      contract R {
      \tContractUsingIface variable;
      }
    `,
    )

    const flattened = flattenStartingFrom('R', [file], [], { includeAll: true })
    expect(flattened).toEqual(
      dedent(`
      interface Iface {
      \tfunction foo(address payable to) external;
      }

      // NOTE(l2beat): This is an interface, generated from the contract source code.
      interface ContractUsingIface is Iface {
          function foo(address payable to) external;
      }

      contract R {
      \tContractUsingIface variable;
      }
    `),
    )
  })

  describe('name clash disambiguation', () => {
    it('resolves name clash from import alias reversal', () => {
      const files = [
        sol(
          'Root.sol',
          `
          import { Name as NameDifferent } from "abc.sol";
          import { Name } from "cba.sol";
          contract R1 is Name { function r1(NameDifferent x) public {} }
        `,
        ),
        sol('abc.sol', 'contract Name { function abc() public {} }'),
        sol('cba.sol', 'contract Name { function cba() public {} }'),
      ]

      const flattened = flattenStartingFrom('R1', files, [], {
        includeAll: true,
      })

      expect(flattened).toEqual(
        dedent(`
        contract Name { function cba() public {} }

        // NOTE(l2beat): This is an interface, generated from the contract source code.
        interface Name_1 {
            function abc() external;
        }

        contract R1 is Name { function r1(Name_1 x) public {} }
      `),
      )
    })

    it('resolves diamond name clash with same-named bases from different files', () => {
      const files = [
        sol(
          'Root.sol',
          `
          import { A } from "A.sol";
          import { B } from "B.sol";
          contract Root is A, B { }
        `,
        ),
        sol(
          'A.sol',
          `
          import { Base } from "Base1.sol";
          contract A is Base { }
        `,
        ),
        sol(
          'B.sol',
          `
          import { Base } from "Base2.sol";
          contract B is Base { }
        `,
        ),
        sol('Base1.sol', 'contract Base { function base1() public {} }'),
        sol('Base2.sol', 'contract Base { function base2() public {} }'),
      ]

      const flattened = flattenStartingFrom('Root', files, [], {
        includeAll: true,
      })

      expect(flattened).toEqual(
        dedent(`
        contract Base { function base1() public {} }

        contract A is Base { }

        contract Base_1 { function base2() public {} }

        contract B is Base_1 { }

        contract Root is A, B { }
      `),
      )
    })
  })

  describe('leading comments preservation', () => {
    it('does NOT include leading comments without includeAll (default)', () => {
      const file = sol(
        'Root.sol',
        `
        /// @title Base contract
        /// @notice This is the base
        contract Base { }

        /// @title Main contract
        /// @notice This is the main contract
        contract Main is Base {
            function f() public {}
        }
      `,
      )

      const flattened = flattenStartingFrom('Main', [file], [])

      expect(flattened).toEqual(
        dedent(`
        contract Base { }

        contract Main is Base {
            function f() public {}
        }
      `),
      )
    })

    it('includes leading NatSpec comments with includeAll', () => {
      const file = sol(
        'Root.sol',
        `
        /// @title Base contract
        /// @notice This is the base
        contract Base { }

        /// @title Main contract
        /// @notice This is the main contract
        contract Main is Base {
            function f() public {}
        }
      `,
      )

      const flattened = flattenStartingFrom('Main', [file], [], {
        includeAll: true,
      })

      expect(flattened).toEqual(
        dedent(`
        /// @title Base contract
        /// @notice This is the base
        contract Base { }

        /// @title Main contract
        /// @notice This is the main contract
        contract Main is Base {
            function f() public {}
        }
      `),
      )
    })

    it('includes leading block comments with includeAll', () => {
      const file = sol(
        'Root.sol',
        `
        /**
         * @title MyContract
         * @dev Implementation of something
         */
        contract MyContract {
            function f() public {}
        }
      `,
      )

      const flattened = flattenStartingFrom('MyContract', [file], [], {
        includeAll: true,
      })

      expect(flattened).toEqual(
        dedent(`
        /**
         * @title MyContract
         * @dev Implementation of something
         */
        contract MyContract {
            function f() public {}
        }
      `),
      )
    })

    it('preserves comments across multiple files with includeAll', () => {
      const files = [
        sol(
          'Main.sol',
          `
          import "./Base.sol";

          /// @title Main contract implementation
          /// @dev Implements IBase
          contract Main is IBase {
              function baseFunc() external {}
          }
        `,
        ),
        sol(
          'Base.sol',
          `
          /// @title IBase interface
          /// @notice Base functionality
          interface IBase {
              function baseFunc() external;
          }
        `,
        ),
      ]

      const flattened = flattenStartingFrom('Main', files, [], {
        includeAll: true,
      })

      expect(flattened).toEqual(
        dedent(`
        /// @title IBase interface
        /// @notice Base functionality
        interface IBase {
            function baseFunc() external;
        }

        /// @title Main contract implementation
        /// @dev Implements IBase
        contract Main is IBase {
            function baseFunc() external {}
        }
      `),
      )
    })

    it('Aztec-style: preserves multi-line NatSpec with custom tags', () => {
      const file = sol(
        'Rollup.sol',
        `
        /// @title Rollup
        /// @author Aztec Labs
        /// @notice This is the rollup contract.
        /// @custom:security-contact security@aztec.network
        contract Rollup {
            function process() public {}
        }
      `,
      )

      const flattened = flattenStartingFrom('Rollup', [file], [], {
        includeAll: true,
      })

      expect(flattened).toEqual(
        dedent(`
        /// @title Rollup
        /// @author Aztec Labs
        /// @notice This is the rollup contract.
        /// @custom:security-contact security@aztec.network
        contract Rollup {
            function process() public {}
        }
      `),
      )
    })
  })
})
