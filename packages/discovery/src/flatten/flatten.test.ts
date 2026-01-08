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
        LIBRARY_SOURCE,
        CONTRACT4_SOURCE,
        CONTRACT2_SOURCE,
        CONTRACT3_SOURCE,
        ROOT_CONTRACT_SOURCE,
      ].join('\n\n'),
    )
  })

  it('picks correct contracts to be regenerated as interfaces, for minimized output', () => {
    const file: FileContent = {
      path: 'Root.sol',
      content: String.raw`
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
    }

    const flattened = flattenStartingFrom('R1', [file], [])
    expect(flattened).toEqual(
      String.raw`contract C4 { }

contract C3 is C2 { }

contract C2 { }

contract R1 is C2, C3, C4 {
    function f(address x) public {
        DC1(x).df();
    }
}`,
    )
  })

  it('picks correct contracts to be regenerated as interfaces, for full output', () => {
    const file: FileContent = {
      path: 'Root.sol',
      content: String.raw`
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
    }

    const flattened = flattenStartingFrom('R1', [file], [], {
      includeAll: true,
    })
    expect(flattened).toEqual(
      String.raw`// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface DC2 is C2 {
    struct S1 {
        uint256 x;
    }

    function f1() external;
}

// NOTE(l2beat): This is a virtual interface, generated from the contract source code.
interface DC1 is DC2 {
    function df() external;
}

contract C4 { }

contract C3 is C2 { }

contract C2 { }

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
      String.raw`error CustomError(address account);

uint256 constant GLOBAL_VALUE = 42;

event EventHappened(uint256 value, address account);

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
})
