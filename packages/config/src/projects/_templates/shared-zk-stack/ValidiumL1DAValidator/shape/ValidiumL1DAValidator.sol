// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

struct L1DAValidatorOutput {
    /// @dev The hash of the uncompressed state diff.
    bytes32 stateDiffHash;
    /// @dev The hashes of the blobs on L1. The array is dynamic to account for forward compatibility.
    /// The length of it must be equal to `maxBlobsSupported`.
    bytes32[] blobsLinearHashes;
    /// @dev The commitments to the blobs on L1. The array is dynamic to account for forward compatibility.
    /// Its length must be equal to the length of blobsLinearHashes.
    /// @dev If the system supports more blobs than returned, the rest of the array should be filled with zeros.
    bytes32[] blobsOpeningCommitments;
}

interface IL1DAValidator {
    /// @notice The function that checks the data availability for the given batch input.
    /// @param _chainId The chain id of the chain that is being committed.
    /// @param _batchNumber The batch number for which the data availability is being checked.
    /// @param _l2DAValidatorOutputHash The hash of that was returned by the l2DAValidator.
    /// @param _operatorDAInput The DA input by the operator provided on L1.
    /// @param _maxBlobsSupported The maximal number of blobs supported by the chain.
    /// We provide this value for future compatibility.
    /// This is needed because the corresponding `blobsLinearHashes`/`blobsOpeningCommitments`
    /// in the `L1DAValidatorOutput` struct will have to have this length as it is required
    /// to be static by the circuits.
    function checkDA(
        uint256 _chainId,
        uint256 _batchNumber,
        bytes32 _l2DAValidatorOutputHash,
        bytes calldata _operatorDAInput,
        uint256 _maxBlobsSupported
    ) external returns (L1DAValidatorOutput memory output);
}

contract ValidiumL1DAValidator is IL1DAValidator {
    function checkDA(
        uint256, // _chainId
        uint256, // _batchNumber
        bytes32, // _l2DAValidatorOutputHash
        bytes calldata _operatorDAInput,
        uint256 maxBlobsSupported
    ) external override returns (L1DAValidatorOutput memory output) {
        // For Validiums, we expect the operator to just provide the data for us.
        // We don't need to do any checks with regard to the l2DAValidatorOutputHash.
        if (_operatorDAInput.length != 32) {
            revert ValL1DAWrongInputLength(_operatorDAInput.length, 32);
        }
        bytes32 stateDiffHash = abi.decode(_operatorDAInput, (bytes32));

        // The rest of the fields that relate to blobs are empty.
        output.stateDiffHash = stateDiffHash;

        output.blobsLinearHashes = new bytes32[](maxBlobsSupported);
        output.blobsOpeningCommitments = new bytes32[](maxBlobsSupported);
    }
}