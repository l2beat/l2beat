import { expect } from 'earl'
import { flattenStartingFrom } from './flatten'
import type { FileContent } from './ParsedFilesManager'

describe('flatten', () => {
  it('handles multiple files, imports, remappings, renames etc.', () => {
    const ROOT_CONTRACT_SOURCE =
      'contract R1 is C3, C2, C4 { function r1(L1.S1 arg) public {} }'
    const CONTRACT2_SOURCE = 'contract C2 { function r3() public {} }'
    const CONTRACT3_SOURCE = 'contract C3 { function r4() public {} }'
    const CONTRACT4_SOURCE = 'contract C4 { function r4(L1.S1 arg) public {} }'
    const LIBRARY_SOURCE = [
      'type T1 is uint256;',
      '',
      'library L1 { struct S1 { T1 x; } }',
    ].join('\n')

    const remappings = [
      'remappedPath1=path1',
      'Root.sol:remappedPath2=path2',
      'remappedPath2=path3',
    ]
    const files: FileContent[] = [
      {
        path: 'Root.sol',
        content: `
                import { C2 } from "remappedPath2";
                import { C4 } from "path4";
                import "../../../remappedPath1";

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
        content: 'contract C5 { function r5() public {} }',
      },
    ]

    const flattened = flattenStartingFrom('R1', files, remappings)

    expect(flattened).toEqual(
      [
        CONTRACT3_SOURCE,
        CONTRACT2_SOURCE,
        LIBRARY_SOURCE,
        CONTRACT4_SOURCE,
        ROOT_CONTRACT_SOURCE,
      ].join('\n\n'),
    )
  })

  it('regenerates dynamically-referenced contracts as interfaces (minimized)', () => {
    const file: FileContent = {
      path: 'Root.sol',
      content: String.raw`
contract DC1 is DC2 { function df() public {} }
contract DC2 { }

contract C2 { }
contract C3 is C2 { }
contract C4 { }

contract R1 is C2, C3, C4 {
    function f(address x) public {
        DC1(x).df();
    }
}
`,
    }

    const flattened = flattenStartingFrom('R1', [file], [])
    expect(flattened).toEqual(
      String.raw`contract C2 { }

contract C3 is C2 { }

contract C4 { }

// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface DC2 {}

// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface DC1 is DC2 {
    function df() external;
}

contract R1 is C2, C3, C4 {
    function f(address x) public {
        DC1(x).df();
    }
}`,
    )
  })

  it('regenerates dynamically-referenced contracts as interfaces (full)', () => {
    const file: FileContent = {
      path: 'Root.sol',
      content: String.raw`
contract DC1 is DC2 { function df() public {} }

contract DC2 {
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
    }

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })
    expect(flattened).toEqual(
      String.raw`contract C2 { }

contract C3 is C2 { }

contract C4 { }

// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface DC2 {
    struct S1 {
        uint256 x;
    }

    function f1() external;
}

// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface DC1 is DC2 {
    function df() external;
}

contract R1 is C2, C3, C4 {
    function f(address x) public {
        DC1(x).df();
    }
}`,
    )
  })

  it('inheritance namespacing', () => {
    const rootFile: FileContent = {
      path: 'Root.sol',
      content: String.raw`
import './DependencyFile.sol' as Namespace;

contract R1 is Namespace.C2 {
    function f(address x) public {
        DC1(x).df();
    }
}
`,
    }

    const c2File: FileContent = {
      path: 'DependencyFile.sol',
      content: String.raw`contract C2 { }`,
    }

    const flattened = flattenStartingFrom('R1', [rootFile, c2File], [])
    expect(flattened).toEqual(
      String.raw`contract C2 { }

contract R1 is Namespace.C2 {
    function f(address x) public {
        DC1(x).df();
    }
}`,
    )
  })

  it('../ in unit name', () => {
    const rootFile: FileContent = {
      path: 'a/b/c/Root.sol',
      content: String.raw`
import { StringClass } from '@stdlib/String.sol';

contract R1 is StringClass {
    function f(address x) public { DC1(x).df(); }
}
`,
    }

    const c2File: FileContent = {
      path: '../somewhere/String.sol',
      content: String.raw`contract StringClass { }`,
    }

    const flattened = flattenStartingFrom(
      'R1',
      [rootFile, c2File],
      ['@stdlib=../somewhere/'],
    )
    expect(flattened).toEqual(
      String.raw`contract StringClass { }

contract R1 is StringClass {
    function f(address x) public { DC1(x).df(); }
}`,
    )
  })

  it('top level errors, events and constants', () => {
    const rootFile: FileContent = {
      path: 'Root.sol',
      content: String.raw`
import "./Globals.sol";
contract R1 {
  function doSomething() public {
    emit EventHappened(GLOBAL_VALUE, msg.sender);
    revert CustomError(msg.sender);
  }
}
`,
    }

    const c2File: FileContent = {
      path: 'Globals.sol',
      content: `
          uint256 constant GLOBAL_VALUE = 42;
          event EventHappened(uint256 value, address account);
          error CustomError(address account);
          `,
    }

    const flattened = flattenStartingFrom('R1', [rootFile, c2File], [], {
      includeAll: true,
    })

    expect(flattened).toEqual(
      String.raw`event EventHappened(uint256 value, address account);

uint256 constant GLOBAL_VALUE = 42;

error CustomError(address account);

contract R1 {
  function doSomething() public {
    emit EventHappened(GLOBAL_VALUE, msg.sender);
    revert CustomError(msg.sender);
  }
}`,
    )
  })

  describe('leading comments preservation', () => {
    it('does NOT include leading comments without includeAll (default)', () => {
      const file: FileContent = {
        path: 'Root.sol',
        content: String.raw`/// @title Base contract
/// @notice This is the base
contract Base { }

/// @title Main contract
/// @notice This is the main contract
contract Main is Base {
    function f() public {}
}
`,
      }

      const flattened = flattenStartingFrom('Main', [file], [])

      // Should NOT include comments in default mode
      expect(flattened).not.toInclude('/// @title')
      expect(flattened).not.toInclude('/// @notice')
      expect(flattened).toEqual(
        String.raw`contract Base { }

contract Main is Base {
    function f() public {}
}`,
      )
    })

    it('includes leading NatSpec comments with includeAll', () => {
      const file: FileContent = {
        path: 'Root.sol',
        content: String.raw`/// @title Base contract
/// @notice This is the base
contract Base { }

/// @title Main contract
/// @notice This is the main contract
contract Main is Base {
    function f() public {}
}
`,
      }

      const flattened = flattenStartingFrom('Main', [file], [], {
        includeAll: true,
      })

      // Should include NatSpec comments
      expect(flattened).toInclude('/// @title Base contract')
      expect(flattened).toInclude('/// @title Main contract')
    })

    it('includes leading block comments with includeAll', () => {
      const file: FileContent = {
        path: 'Root.sol',
        content: String.raw`/**
 * @title MyContract
 * @dev Implementation of something
 */
contract MyContract {
    function f() public {}
}
`,
      }

      const flattened = flattenStartingFrom('MyContract', [file], [], {
        includeAll: true,
      })

      // Should include block comment
      expect(flattened).toInclude('/**')
      expect(flattened).toInclude('@title MyContract')
      expect(flattened).toInclude('*/')
    })

    it('preserves comments across multiple files with includeAll', () => {
      const baseFile: FileContent = {
        path: 'Base.sol',
        content: String.raw`/// @title IBase interface
/// @notice Base functionality
interface IBase {
    function baseFunc() external;
}
`,
      }

      const mainFile: FileContent = {
        path: 'Main.sol',
        content: String.raw`import "./Base.sol";

/// @title Main contract implementation
/// @dev Implements IBase
contract Main is IBase {
    function baseFunc() external {}
}
`,
      }

      const flattened = flattenStartingFrom('Main', [mainFile, baseFile], [], {
        includeAll: true,
      })

      // Should include comments from both files
      expect(flattened).toInclude('/// @title IBase interface')
      expect(flattened).toInclude('/// @title Main contract implementation')
    })

    it('Aztec-style: preserves multi-line NatSpec with custom tags', () => {
      const file: FileContent = {
        path: 'Rollup.sol',
        content: String.raw`/// @title Rollup
/// @author Aztec Labs
/// @notice This is the rollup contract.
/// @custom:security-contact security@aztec.network
contract Rollup {
    function process() public {}
}
`,
      }

      const flattened = flattenStartingFrom('Rollup', [file], [], {
        includeAll: true,
      })

      expect(flattened).toInclude('/// @title Rollup')
      expect(flattened).toInclude('/// @author Aztec Labs')
      expect(flattened).toInclude('/// @notice This is the rollup contract.')
      expect(flattened).toInclude(
        '/// @custom:security-contact security@aztec.network',
      )
    })
  })

  describe('produces compilable output', () => {
    it('includes interface referenced as a type inside a library function', () => {
      const rootFile: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./IFoo.sol";

library Lib {
    function bar(address a, bytes4 b) internal view returns (bool) {
        (bool ok,) = a.staticcall(abi.encodeCall(IFoo.foo, (b)));
        return ok;
    }
}

contract R1 {
    function f(address a, bytes4 b) public view returns (bool) {
        return Lib.bar(a, b);
    }
}
`,
      }
      const ifoo: FileContent = {
        path: 'IFoo.sol',
        content: String.raw`interface IFoo {
    function foo(bytes4 x) external view returns (bool);
}`,
      }

      const flattened = flattenStartingFrom('R1', [rootFile, ifoo], [])
      expect(flattened).toInclude('interface IFoo')
      expect(flattened).toInclude('function foo(bytes4')
    })

    it('includes interface referenced via type-cast in a contract function', () => {
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./IFoo.sol";

contract R1 {
    function f(address a) public view returns (uint256) {
        return IFoo(a).value();
    }
}
`,
      }
      const ifoo: FileContent = {
        path: 'IFoo.sol',
        content: String.raw`interface IFoo {
    function value() external view returns (uint256);
}`,
      }

      const flattened = flattenStartingFrom('R1', [root, ifoo], [])
      expect(flattened).toInclude('interface IFoo')
    })

    it('includes file-level constants referenced in a function body', () => {
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Constants.sol";

contract R1 {
    function f(uint256 x) public pure returns (uint256) {
        return x * MY_CONST;
    }
}
`,
      }
      const constantsFile: FileContent = {
        path: 'Constants.sol',
        content: String.raw`uint256 constant MY_CONST = 10000;`,
      }

      const flattened = flattenStartingFrom('R1', [root, constantsFile], [])
      expect(flattened).toInclude('MY_CONST = 10000')
    })

    it('includes custom errors referenced via revert', () => {
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Errors.sol";

contract R1 {
    function f(uint256 x) public pure {
        if (x == 0) revert MyError();
    }
}
`,
      }
      const errorsFile: FileContent = {
        path: 'Errors.sol',
        content: String.raw`error MyError();`,
      }

      const flattened = flattenStartingFrom('R1', [root, errorsFile], [])
      expect(flattened).toInclude('error MyError()')
    })

    it('includes interface defining a nested struct used as a parameter type', () => {
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./IFoo.sol";

contract R1 {
    function consume(IFoo.Data memory d) public pure returns (uint256) {
        return d.x;
    }
}
`,
      }
      const ifoo: FileContent = {
        path: 'IFoo.sol',
        content: String.raw`interface IFoo {
    struct Data {
        uint64 x;
        bytes32 y;
    }
}`,
      }

      const flattened = flattenStartingFrom('R1', [root, ifoo], [])
      expect(flattened).toInclude('interface IFoo')
      expect(flattened).toInclude('struct Data')
    })

    it('produces topologically valid order with diamond inheritance', () => {
      const file: FileContent = {
        path: 'Root.sol',
        content: String.raw`
abstract contract A { function _a() internal view {} }
abstract contract B1 is A { }
abstract contract B2 is A { }
abstract contract B3 is A { }
abstract contract B4 is A { }

contract Root is B1, B2, B3, B4 {
    function f() public {}
}
`,
      }

      const flattened = flattenStartingFrom('Root', [file], [])
      const idx = (needle: string) => flattened.indexOf(needle)

      expect(idx('contract A')).toBeGreaterThanOrEqual(0)
      expect(idx('contract A')).toBeLessThan(idx('contract B1'))
      expect(idx('contract A')).toBeLessThan(idx('contract B2'))
      expect(idx('contract A')).toBeLessThan(idx('contract B3'))
      expect(idx('contract A')).toBeLessThan(idx('contract B4'))
    })

    it('tracks identifiers referenced inside modifier arguments', () => {
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Lib.sol";

contract R1 {
    modifier checked(bytes32 k) { _; }

    function f() external checked(Lib.KEY) {}
}
`,
      }
      const lib: FileContent = {
        path: 'Lib.sol',
        content: String.raw`library Lib {
    bytes32 internal constant KEY = bytes32("key");
}`,
      }

      const flattened = flattenStartingFrom('R1', [root, lib], [])
      expect(flattened).toInclude('library Lib')
      expect(flattened).toInclude('KEY')
    })

    it('preserves file-level `using for global` directives', () => {
      // Solidity 0.8.13+ allows `using L for T global;` at file level to
      // attach L's functions to every T. Dropping the directive loses
      // `_.method()` calls, which then fail to compile.
      const types: FileContent = {
        path: 'Types.sol',
        content: String.raw`
type Timestamp is uint64;

library LibTimestamp {
    function raw(Timestamp t) internal pure returns (uint64) {
        return Timestamp.unwrap(t);
    }
}

using LibTimestamp for Timestamp global;
`,
      }
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Types.sol";

contract R1 {
    function f(Timestamp t) external pure returns (uint64) {
        return t.raw();
    }
}
`,
      }

      const flattened = flattenStartingFrom('R1', [root, types], [])
      expect(flattened).toInclude('library LibTimestamp')
      expect(flattened).toInclude('using LibTimestamp for Timestamp global')
    })

    it('keeps instantiated contract even when reached via a dynamic call chain', () => {
      // A library called dynamically from the root instantiates a contract
      // via `new`. The intermediate library is dynamic, but the bytecode
      // of the instantiated contract is still needed.
      const burn: FileContent = {
        path: 'Burn.sol',
        content: String.raw`
library Burn {
    function eth(uint256 _amount) internal {
        new Burner{ value: _amount }();
    }
}

contract Burner {
    constructor() payable {
        selfdestruct(payable(address(this)));
    }
}
`,
      }
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Burn.sol";
contract R1 {
    function f(uint256 v) external {
        Burn.eth(v);
    }
}
`,
      }

      const flattened = flattenStartingFrom('R1', [root, burn], [])
      expect(flattened).toInclude('contract Burner')
      expect(flattened).not.toInclude('interface Burner')
    })

    it('does not convert a contract to interface when it is instantiated with new', () => {
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Impl.sol";

contract R1 {
    function deploy() external returns (Impl) {
        return new Impl();
    }
}
`,
      }
      const impl: FileContent = {
        path: 'Impl.sol',
        content: String.raw`contract Impl {
    uint256 public x;
    constructor() { x = 42; }
}`,
      }

      const flattened = flattenStartingFrom('R1', [root, impl], [])
      // Impl must remain a concrete contract so that `new Impl()` works.
      expect(flattened).toInclude('contract Impl')
      expect(flattened).not.toInclude('interface Impl')
    })

    it('skips internal functions when converting a contract to an interface', () => {
      // Internal functions can have storage params/returns, which are
      // invalid in external functions. If the generated interface exposes
      // them as external, compilation fails.
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Impl.sol";

contract R1 {
    function f(address a) external view returns (uint256) {
        return Impl(a).publicGet();
    }
}
`,
      }
      const impl: FileContent = {
        path: 'Impl.sol',
        content: String.raw`contract Impl {
    uint256[] data;

    function publicGet() external view returns (uint256) { return data.length; }

    function _internal(uint256[] storage d) internal view returns (uint256) {
        return d.length;
    }

    function _private() private pure returns (uint256) { return 1; }
}`,
      }

      const flattened = flattenStartingFrom('R1', [root, impl], [])
      expect(flattened).toInclude('interface Impl')
      expect(flattened).toInclude('publicGet')
      expect(flattened).not.toInclude('_internal')
      expect(flattened).not.toInclude('_private')
    })

    it('keeps override clause when a re-declared function is inherited from a surviving interface base', () => {
      // When a contract redeclares a function from a base interface, the
      // generated interface must keep `override` (or Solidity errors with
      // "Overriding function is missing override specifier"). The base
      // must stay in the interface's `is` clause for the override to be
      // meaningful.
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
interface IBase {
    function f() external view returns (uint256);
}

abstract contract Derived is IBase {
    function f() external view virtual override returns (uint256);
}

contract R1 {
    function call(address a) external view returns (uint256) {
        return Derived(a).f();
    }
}
`,
      }

      const flattened = flattenStartingFrom('R1', [root], [])
      expect(flattened).toInclude('interface Derived is IBase')
      expect(flattened).toInclude('function f() external view override')
    })

    it('drops override bases that are stripped from the interface `is` clause', () => {
      // When a contract is converted to an interface, a base that gets
      // stripped (because it cannot survive as an interface) must also be
      // removed from any `override(...)` clause that references it. Here,
      // `NonInterfaceBase` stays a concrete contract (R1 inherits from it)
      // and so cannot appear in `override(...)`.
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
contract NonInterfaceBase {
    function f() external view virtual returns (uint256) { return 1; }
}

abstract contract Impl is NonInterfaceBase {
    function f() external view virtual override(NonInterfaceBase) returns (uint256);
}

contract R1 is NonInterfaceBase {
    function call(address a) external view returns (uint256) {
        return Impl(a).f();
    }
}
`,
      }

      const flattened = flattenStartingFrom('R1', [root], [])
      expect(flattened).toInclude('interface Impl')
      expect(flattened).not.toInclude('override(NonInterfaceBase)')
    })

    it('generates getters for public state variables when converting to interface', () => {
      // In Solidity, `T public x` generates a view getter. When the original
      // caller has a variable typed as the concrete contract, it can rely on
      // that getter. Converting to an interface must preserve the getter
      // signature or compilation will fail (non-view function called in view
      // context, or missing function).
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
import "./Impl.sol";

contract R1 {
    Impl impl;

    function read(address a) external view returns (address) {
        return impl.owners(a);
    }
}
`,
      }
      const impl: FileContent = {
        path: 'Impl.sol',
        content: String.raw`contract Impl {
    mapping(address => address) public owners;
    uint256 public total;
}`,
      }

      const flattened = flattenStartingFrom('R1', [root, impl], [])
      expect(flattened).toInclude('interface Impl')
      expect(flattened).toInclude(
        'function owners(address) external view returns (address)',
      )
      expect(flattened).toInclude(
        'function total() external view returns (uint256)',
      )
    })

    it('drops non-interface base contracts when generating a virtual interface', () => {
      // If an abstract contract inherits from a concrete contract and the
      // concrete contract must stay as a contract in the output (because it
      // is also inherited by the root), then the generated interface cannot
      // inherit from it: "interfaces can only inherit from other interfaces".
      const root: FileContent = {
        path: 'Root.sol',
        content: String.raw`
contract Constants {
    bytes4 internal constant MAGIC = 0xaabbccdd;
}

abstract contract IValidator is Constants {
    function validate(bytes calldata sig) external view virtual returns (bytes4);
}

contract R1 is Constants {
    function f(address a, bytes calldata sig) external view returns (bytes4) {
        return IValidator(a).validate(sig);
    }
}
`,
      }

      const flattened = flattenStartingFrom('R1', [root], [])
      expect(flattened).toInclude('interface IValidator')
      expect(flattened).not.toInclude('interface IValidator is Constants')
      // Constants must remain a concrete contract (R1 inherits from it).
      expect(flattened).toInclude('contract Constants')
    })
  })
})
