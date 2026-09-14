// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A minimal EIP-1967 proxy: the admin may point it at new code; everything else is forwarded.
contract Proxy {
    bytes32 internal constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 internal constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    constructor(address implementation, address admin) {
        assembly {
            sstore(IMPLEMENTATION_SLOT, implementation)
            sstore(ADMIN_SLOT, admin)
        }
    }

    function upgradeTo(address implementation) external {
        assembly {
            if iszero(eq(caller(), sload(ADMIN_SLOT))) {
                revert(0, 0)
            }
            sstore(IMPLEMENTATION_SLOT, implementation)
        }
    }

    fallback() external payable {
        assembly {
            let impl := sload(IMPLEMENTATION_SLOT)
            calldatacopy(0, 0, calldatasize())
            let ok := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch ok
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
