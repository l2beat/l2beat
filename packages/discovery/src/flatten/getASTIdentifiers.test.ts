import { parse } from '@mradomski/fast-solidity-parser'
import { expect } from 'earl'

import { getASTIdentifiers } from './getASTIdentifiers.js'

const soliditySource = `pragma solidity ^0.8.0;

import "Library.sol";

library DefinedLibrary1 {
    struct Buffer {
        bytes data;
    }

    using DefinedLibrary1 for Buffer;

    function push(Buffer storage buf, bytes memory data) internal {
        UsedLibrary1.push(buf, data);
    }
}

contract Contract1 {
    event Log(EventLibrary.EventType emitIndex);
    error Error1(ErrorLibrary.ErrorType errorCode);

    struct Struct1 {
        Lib.Buffer buffers;
    }

    function contract1Func(ParamLib1.Param param1, ParamLib2.Param param2) public returns (ReturnLib.ReturnType) {
        if (heightArg > Library1.getHeight()) {
            return heightArg;
        } else {
            return Library2.getSomeMagicValue();
        }
    }
}`

describe(getASTIdentifiers.name, () => {
  it('gets unique identifiers', () => {
    const ast = parse(soliditySource)
    const idents = ast.children.flatMap((c) => getASTIdentifiers(c))
    const result = new Set(idents)
    expect([...result].sort()).toEqual(
      [
        'DefinedLibrary1',
        'Buffer',
        'bytes',
        'data',
        'buf',
        'UsedLibrary1',
        'Contract1',
        'EventLibrary.EventType',
        'emitIndex',
        'ErrorLibrary.ErrorType',
        'errorCode',
        'Lib.Buffer',
        'buffers',
        'ParamLib1.Param',
        'param1',
        'ParamLib2.Param',
        'param2',
        'ReturnLib.ReturnType',
        'heightArg',
        'Library1',
        'Library2',
      ].sort(),
    )
  })
})
