// Copied verbatim from l2beat/analyze fixtures/StorageWriters.sol (the storage-writers analyzer's golden fixture).
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

library SetLib {
    struct Data {
        uint256 v;
    }

    function bump(Data storage d) internal {
        d.v += 1;
    }
}

contract Owned {
    address public owner; // slot 0
    uint256 internal opCount; // slot 1

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        opCount += 1;
        _;
    }

    modifier tracked() {
        _track();
        _;
    }

    function _track() internal {
        opCount += 1;
    }
}

contract StorageWriters is Owned {
    using SetLib for SetLib.Data;

    uint256 public total; // slot 2, written via internal chain + modifier path
    SetLib.Data internal libData; // slot 3, written via library storage param
    SetLib.Data internal paramData; // slot 4, written via internal fn storage param
    SetLib.Data internal ptrData; // slot 5, written through a local storage pointer
    uint256 public asmLiteral; // slot 6, written via sstore(6, ...)
    uint256 public asmSlotRef; // slot 7, written via sstore(asmSlotRef.slot, ...)
    uint256 public asmViaLet; // slot 8, written via let s := .slot; sstore(s, ...)
    mapping(address => uint256) public balances; // slot 9, written via keccak'd slot in assembly
    uint256 public neverWritten; // slot 10, no writers
    uint256 public ctorOnly; // slot 11, constructor write only

    constructor() {
        ctorOnly = 1;
    }

    function addTotal(uint256 amount) external onlyOwner {
        _add(amount);
    }

    function _add(uint256 amount) internal {
        total += amount;
    }

    function bumpLib() public {
        libData.bump();
    }

    function bumpParam() external {
        _inc(paramData);
    }

    function _inc(SetLib.Data storage d) internal {
        d.v += 1;
    }

    function pointerWrite(uint256 value) external {
        SetLib.Data storage d = ptrData;
        d.v = value;
    }

    function asmLiteralWrite(uint256 value) external {
        assembly {
            sstore(6, value)
        }
    }

    function asmSlotRefWrite(uint256 value) external {
        assembly {
            sstore(asmSlotRef.slot, value)
        }
    }

    function asmLetWrite(uint256 value) external {
        assembly {
            let s := asmViaLet.slot
            sstore(s, value)
        }
    }

    function asmMappingWrite(address key, uint256 value) external {
        assembly {
            mstore(0x00, key)
            mstore(0x20, balances.slot)
            let h := keccak256(0x00, 0x40)
            sstore(h, value)
        }
    }

    function doDelegate(address target, bytes calldata data) external {
        (bool ok, ) = target.delegatecall(data);
        require(ok, "delegatecall failed");
    }

    function trackedWrite() external tracked {
        // writes opCount only through the modifier's internal call
    }
}
