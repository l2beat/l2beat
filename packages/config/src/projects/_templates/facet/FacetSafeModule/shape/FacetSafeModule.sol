// SPDX-License-Identifier: Unknown
pragma solidity 0.8.26;

contract FacetSafeModule {
    address public constant facetProxyAddress = 0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25;

    function sendFacetTransaction(
        bytes calldata to,
        uint256 value,
        uint256 gasLimit,
        bytes calldata data
    ) external {
        require(
            GnosisSafe(msg.sender).execTransactionFromModule(
                facetProxyAddress,
                0,
                abi.encodeWithSelector(
                    FacetSafeProxy.sendFacetTransaction.selector, 
                    to, 
                    value,
                    gasLimit,
                    data
                ),
                Enum.Operation.DelegateCall
            ),
            "execTransactionFromModule failed"
        );
    }
}