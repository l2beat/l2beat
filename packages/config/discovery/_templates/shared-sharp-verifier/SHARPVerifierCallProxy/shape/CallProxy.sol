// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

library Addresses {
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function performEthTransfer(address recipient, uint256 amount) internal {
        (bool success, ) = recipient.call{value: amount}(""); // NOLINT: low-level-calls.
        require(success, "ETH_TRANSFER_FAILED");
    }

    /*
      Safe wrapper around ERC20/ERC721 calls.
      This is required because many deployed ERC20 contracts don't return a value.
      See https://github.com/ethereum/solidity/issues/4116.
    */
    function safeTokenContractCall(address tokenAddress, bytes memory callData) internal {
        require(isContract(tokenAddress), "BAD_TOKEN_ADDRESS");
        // NOLINTNEXTLINE: low-level-calls.
        (bool success, bytes memory returndata) = tokenAddress.call(callData);
        require(success, string(returndata));

        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "TOKEN_OPERATION_FAILED");
        }
    }

    /*
      Validates that the passed contract address is of a real contract,
      and that its id hash (as infered fromn identify()) matched the expected one.
    */
    function validateContractId(address contractAddress, bytes32 expectedIdHash) internal {
        require(isContract(contractAddress), "ADDRESS_NOT_CONTRACT");
        (bool success, bytes memory returndata) = contractAddress.call( // NOLINT: low-level-calls.
            abi.encodeWithSignature("identify()")
        );
        require(success, "FAILED_TO_IDENTIFY_CONTRACT");
        string memory realContractId = abi.decode(returndata, (string));
        require(
            keccak256(abi.encodePacked(realContractId)) == expectedIdHash,
            "UNEXPECTED_CONTRACT_IDENTIFIER"
        );
    }

    /*
      Similar to safeTokenContractCall, but always ignores the return value.

      Assumes some other method is used to detect the failures
      (e.g. balance is checked before and after the call).
    */
    function uncheckedTokenContractCall(address tokenAddress, bytes memory callData) internal {
        // NOLINTNEXTLINE: low-level-calls.
        (bool success, bytes memory returndata) = tokenAddress.call(callData);
        require(success, string(returndata));
    }
}

contract StorageSlots {
    // Storage slot with the address of the current implementation.
    // The address of the slot is keccak256("StarkWare2019.implemntation-slot").
    // We need to keep this variable stored outside of the commonly used space,
    // so that it's not overrun by the logical implementation (the proxied contract).
    bytes32 internal constant IMPLEMENTATION_SLOT =
        0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24;

    // Storage slot with the address of the call-proxy current implementation.
    // The address of the slot is keccak256("'StarkWare2020.CallProxy.Implemntation.Slot'").
    // We need to keep this variable stored outside of the commonly used space.
    // so that it's not overrun by the logical implementation (the proxied contract).
    bytes32 internal constant CALL_PROXY_IMPL_SLOT =
        0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be;

    // This storage slot stores the finalization flag.
    // Once the value stored in this slot is set to non-zero
    // the proxy blocks implementation upgrades.
    // The current implementation is then referred to as Finalized.
    // Web3.solidityKeccak(['string'], ["StarkWare2019.finalization-flag-slot"]).
    bytes32 internal constant FINALIZED_STATE_SLOT =
        0x7d433c6f837e8f93009937c466c82efbb5ba621fae36886d0cac433c5d0aa7d2;

    // Storage slot to hold the upgrade delay (time-lock).
    // The intention of this slot is to allow modification using an EIC.
    // Web3.solidityKeccak(['string'], ['StarkWare.Upgradibility.Delay.Slot']).
    bytes32 public constant UPGRADE_DELAY_SLOT =
        0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f;
}

abstract contract BlockDirectCall {
    bytes32 immutable UNIQUE_SAFEGUARD_SLOT; // NOLINT naming-convention.

    constructor() internal {
        // The slot is pseudo-random to allow hierarchy of contracts with guarded functions.
        bytes32 slot = keccak256(abi.encode(this, block.timestamp, gasleft()));
        UNIQUE_SAFEGUARD_SLOT = slot;
        assembly {
            sstore(slot, 42)
        }
    }

    modifier notCalledDirectly() {
        {
            // Prevent too many local variables in stack.
            uint256 safeGuardValue;
            bytes32 slot = UNIQUE_SAFEGUARD_SLOT;
            assembly {
                safeGuardValue := sload(slot)
            }
            require(safeGuardValue == 0, "DIRECT_CALL_DISALLOWED");
        }
        _;
    }
}

contract CallProxy is BlockDirectCall, StorageSlots {
    using Addresses for address;

    string public constant CALL_PROXY_VERSION = "3.1.0";

    // Proxy client - initialize & isFrozen.
    // NOLINTNEXTLINE: external-function.
    function isFrozen() public pure returns (bool) {
        return false;
    }

    /*
      This function is called by the Proxy upon activating an implementation.
      The data passed in to this function contains the implementation address,
      and if applicable, an address of an EIC (ExternalInitializerContract) and its data.

      The expected data format is as following:

      Case I (no EIC):
        data.length == 64.
        [0 :32] implementation address
        [32:64] Zero address.

      Case II (EIC):
        data length >= 64
        [0 :32] implementation address
        [32:64] EIC address
        [64:  ] EIC init data.
    */
    function initialize(bytes calldata data) external notCalledDirectly {
        require(data.length >= 64, "INCORRECT_DATA_SIZE");
        (address impl, address eic) = abi.decode(data, (address, address));
        require(impl.isContract(), "ADDRESS_NOT_CONTRACT");
        setCallProxyImplementation(impl);
        if (eic != address(0x0)) {
            callExternalInitializer(eic, data[64:]);
        } else {
            require(data.length == 64, "INVALID_INIT_DATA");
        }
    }

    function callExternalInitializer(address externalInitializerAddr, bytes calldata eicData)
        private
    {
        require(externalInitializerAddr.isContract(), "EIC_NOT_A_CONTRACT");

        // NOLINTNEXTLINE: low-level-calls, controlled-delegatecall.
        (bool success, bytes memory returndata) = externalInitializerAddr.delegatecall(
            abi.encodeWithSelector(this.initialize.selector, eicData)
        );
        require(success, string(returndata));
        require(returndata.length == 0, string(returndata));
    }

    /*
      Returns the call proxy implementation address.
    */
    function callProxyImplementation() public view returns (address _implementation) {
        bytes32 slot = CALL_PROXY_IMPL_SLOT;
        assembly {
            _implementation := sload(slot)
        }
    }

    /*
      Sets the call proxy implementation address.
    */
    function setCallProxyImplementation(address newImplementation) private {
        bytes32 slot = CALL_PROXY_IMPL_SLOT;
        assembly {
            sstore(slot, newImplementation)
        }
    }

    /*
      An explicit isValid entry point, used to make isValid a part of the ABI and visible
      on Etherscan (and alike).
    */
    function isValid(bytes32 fact) external view returns (bool) {
        return IFactRegistry(callProxyImplementation()).isValid(fact);
    }

    /*
      This entry point serves only transactions with empty calldata. (i.e. pure value transfer tx).
      We don't expect to receive such, thus block them.
    */
    receive() external payable {
        revert("CONTRACT_NOT_EXPECTED_TO_RECEIVE");
    }

    /*
      Contract's default function. Pass execution to the implementation contract (using call).
      It returns back to the external caller whatever the implementation called code returns.
    */
    fallback() external payable {
        // NOLINT locked-ether.
        address _implementation = callProxyImplementation();
        require(_implementation != address(0x0), "MISSING_IMPLEMENTATION");
        uint256 value = msg.value;
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 for now, as we don't know the out size yet.
            let result := call(gas(), _implementation, value, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}