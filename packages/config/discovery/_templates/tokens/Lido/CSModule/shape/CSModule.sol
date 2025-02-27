// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library Math {
    /**
     * @dev Muldiv operation overflow.
     */
    error MathOverflowedMulDiv();

    enum Rounding {
        Floor, // Toward negative infinity
        Ceil, // Toward positive infinity
        Trunc, // Toward zero
        Expand // Away from zero
    }

    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds towards infinity instead
     * of rounding towards zero.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        if (b == 0) {
            // Guarantee the same behavior as in a regular Solidity division.
            return a / b;
        }

        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or
     * denominator == 0.
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv) with further edits by
     * Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0 = x * y; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            if (denominator <= prod1) {
                revert MathOverflowedMulDiv();
            }

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator.
            // Always >= 1. See https://cs.stackexchange.com/q/138556/92363.

            uint256 twos = denominator & (0 - denominator);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also
            // works in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (unsignedRoundsUp(rounding) && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded
     * towards zero.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (unsignedRoundsUp(rounding) && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (unsignedRoundsUp(rounding) && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (unsignedRoundsUp(rounding) && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (unsignedRoundsUp(rounding) && 1 << (result << 3) < value ? 1 : 0);
        }
    }

    /**
     * @dev Returns whether a provided rounding mode is considered rounding up for unsigned integers.
     */
    function unsignedRoundsUp(Rounding rounding) internal pure returns (bool) {
        return uint8(rounding) % 2 == 1;
    }
}

library SigningKeys {
    using SigningKeys for bytes32;

    bytes32 internal constant SIGNING_KEYS_POSITION =
        keccak256("lido.CommunityStakingModule.signingKeysPosition");

    uint64 internal constant PUBKEY_LENGTH = 48;
    uint64 internal constant SIGNATURE_LENGTH = 96;

    error InvalidKeysCount();
    error InvalidLength();
    error EmptyKey();

    /// @dev store operator keys to storage
    /// @param nodeOperatorId operator id
    /// @param startIndex start index
    /// @param keysCount keys count to load
    /// @param pubkeys keys buffer to read from
    /// @param signatures signatures buffer to read from
    /// @return new total keys count
    function saveKeysSigs(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount,
        bytes calldata pubkeys,
        bytes calldata signatures
    ) internal returns (uint256) {
        if (keysCount == 0 || startIndex + keysCount > type(uint32).max) {
            revert InvalidKeysCount();
        }
        unchecked {
            if (
                pubkeys.length != keysCount * PUBKEY_LENGTH ||
                signatures.length != keysCount * SIGNATURE_LENGTH
            ) {
                revert InvalidLength();
            }
        }

        uint256 curOffset;
        bool isEmpty;
        bytes memory tmpKey = new bytes(48);

        for (uint256 i; i < keysCount; ) {
            curOffset = SIGNING_KEYS_POSITION.getKeyOffset(
                nodeOperatorId,
                startIndex
            );
            assembly {
                let _ofs := add(pubkeys.offset, mul(i, 48)) // PUBKEY_LENGTH = 48
                let _part1 := calldataload(_ofs) // bytes 0..31
                let _part2 := calldataload(add(_ofs, 0x10)) // bytes 16..47
                isEmpty := iszero(or(_part1, _part2))
                mstore(add(tmpKey, 0x30), _part2) // store 2nd part first
                mstore(add(tmpKey, 0x20), _part1) // store 1st part with overwrite bytes 16-31
            }

            if (isEmpty) {
                revert EmptyKey();
            }

            assembly {
                // store key
                sstore(curOffset, mload(add(tmpKey, 0x20))) // store bytes 0..31
                sstore(add(curOffset, 1), shl(128, mload(add(tmpKey, 0x30)))) // store bytes 32..47
                // store signature
                let _ofs := add(signatures.offset, mul(i, 96)) // SIGNATURE_LENGTH = 96
                sstore(add(curOffset, 2), calldataload(_ofs))
                sstore(add(curOffset, 3), calldataload(add(_ofs, 0x20)))
                sstore(add(curOffset, 4), calldataload(add(_ofs, 0x40)))
                i := add(i, 1)
                startIndex := add(startIndex, 1)
            }
            emit IStakingModule.SigningKeyAdded(nodeOperatorId, tmpKey);
        }
        return startIndex;
    }

    /// @dev remove operator keys from storage
    /// @param nodeOperatorId operator id
    /// @param startIndex start index
    /// @param keysCount keys count to load
    /// @param totalKeysCount current total keys count for operator
    /// @return new total keys count
    function removeKeysSigs(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount,
        uint256 totalKeysCount
    ) internal returns (uint256) {
        if (
            keysCount == 0 ||
            startIndex + keysCount > totalKeysCount ||
            totalKeysCount > type(uint32).max
        ) {
            revert InvalidKeysCount();
        }

        uint256 curOffset;
        uint256 lastOffset;
        uint256 j;
        bytes memory tmpKey = new bytes(48);
        // removing from the last index
        unchecked {
            for (uint256 i = startIndex + keysCount; i > startIndex; ) {
                curOffset = SIGNING_KEYS_POSITION.getKeyOffset(
                    nodeOperatorId,
                    i - 1
                );
                assembly {
                    // read key
                    mstore(
                        add(tmpKey, 0x30),
                        shr(128, sload(add(curOffset, 1)))
                    ) // bytes 16..47
                    mstore(add(tmpKey, 0x20), sload(curOffset)) // bytes 0..31
                }
                if (i < totalKeysCount) {
                    lastOffset = SIGNING_KEYS_POSITION.getKeyOffset(
                        nodeOperatorId,
                        totalKeysCount - 1
                    );
                    // move last key to deleted key index
                    for (j = 0; j < 5; ) {
                        // load 160 bytes (5 slots) containing key and signature
                        assembly {
                            sstore(add(curOffset, j), sload(add(lastOffset, j)))
                            j := add(j, 1)
                        }
                    }
                    curOffset = lastOffset;
                }
                // clear storage
                for (j = 0; j < 5; ) {
                    assembly {
                        sstore(add(curOffset, j), 0)
                        j := add(j, 1)
                    }
                }
                assembly {
                    totalKeysCount := sub(totalKeysCount, 1)
                    i := sub(i, 1)
                }
                emit IStakingModule.SigningKeyRemoved(nodeOperatorId, tmpKey);
            }
        }
        return totalKeysCount;
    }

    /// @dev Load operator's keys and signatures from the storage to the given in-memory arrays.
    /// @dev The function doesn't check for `pubkeys` and `signatures` out of boundaries access.
    /// @param nodeOperatorId operator id
    /// @param startIndex start index
    /// @param keysCount keys count to load
    /// @param pubkeys preallocated kes buffer to read in
    /// @param signatures preallocated signatures buffer to read in
    /// @param bufOffset start offset in `pubkeys`/`signatures` buffer to place values (in number of keys)
    function loadKeysSigs(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount,
        bytes memory pubkeys,
        bytes memory signatures,
        uint256 bufOffset
    ) internal view {
        uint256 curOffset;
        for (uint256 i; i < keysCount; ) {
            curOffset = SIGNING_KEYS_POSITION.getKeyOffset(
                nodeOperatorId,
                startIndex + i
            );
            assembly {
                // read key
                let _ofs := add(add(pubkeys, 0x20), mul(add(bufOffset, i), 48)) // PUBKEY_LENGTH = 48
                mstore(add(_ofs, 0x10), shr(128, sload(add(curOffset, 1)))) // bytes 16..47
                mstore(_ofs, sload(curOffset)) // bytes 0..31
                // store signature
                _ofs := add(add(signatures, 0x20), mul(add(bufOffset, i), 96)) // SIGNATURE_LENGTH = 96
                mstore(_ofs, sload(add(curOffset, 2)))
                mstore(add(_ofs, 0x20), sload(add(curOffset, 3)))
                mstore(add(_ofs, 0x40), sload(add(curOffset, 4)))
                i := add(i, 1)
            }
        }
    }

    function loadKeys(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) internal view returns (bytes memory pubkeys) {
        uint256 curOffset;

        pubkeys = new bytes(keysCount * PUBKEY_LENGTH);
        for (uint256 i; i < keysCount; ) {
            curOffset = SIGNING_KEYS_POSITION.getKeyOffset(
                nodeOperatorId,
                startIndex + i
            );
            assembly {
                // read key
                let offset := add(add(pubkeys, 0x20), mul(i, 48)) // PUBKEY_LENGTH = 48
                mstore(add(offset, 0x10), shr(128, sload(add(curOffset, 1)))) // bytes 16..47
                mstore(offset, sload(curOffset)) // bytes 0..31
                i := add(i, 1)
            }
        }
    }

    function initKeysSigsBuf(
        uint256 count
    ) internal pure returns (bytes memory, bytes memory) {
        return (
            new bytes(count * PUBKEY_LENGTH),
            new bytes(count * SIGNATURE_LENGTH)
        );
    }

    function getKeyOffset(
        bytes32 position,
        uint256 nodeOperatorId,
        uint256 keyIndex
    ) internal pure returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(position, nodeOperatorId, keyIndex))
            );
    }
}

library ValidatorCountsReport {
    error InvalidReportData();

    function safeCountOperators(
        bytes calldata ids,
        bytes calldata counts
    ) internal pure returns (uint256) {
        if (
            counts.length / 16 != ids.length / 8 ||
            ids.length % 8 != 0 ||
            counts.length % 16 != 0
        ) {
            revert InvalidReportData();
        }

        return ids.length / 8;
    }

    function next(
        bytes calldata ids,
        bytes calldata counts,
        uint256 offset
    ) internal pure returns (uint256 nodeOperatorId, uint256 keysCount) {
        // prettier-ignore
        assembly ("memory-safe") {
            nodeOperatorId := shr(192, calldataload(add(ids.offset, mul(offset, 8))))
            keysCount := shr(128, calldataload(add(counts.offset, mul(offset, 16))))
        }
    }
}

library NOAddresses {
    /// @notice Propose a new manager address for the Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param proposedAddress Proposed manager address
    function proposeNodeOperatorManagerAddressChange(
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId,
        address proposedAddress
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        if (no.managerAddress == address(0))
            revert ICSModule.NodeOperatorDoesNotExist();
        if (no.managerAddress != msg.sender)
            revert INOAddresses.SenderIsNotManagerAddress();
        if (no.managerAddress == proposedAddress)
            revert INOAddresses.SameAddress();
        if (no.proposedManagerAddress == proposedAddress)
            revert INOAddresses.AlreadyProposed();

        address oldProposedAddress = no.proposedManagerAddress;
        no.proposedManagerAddress = proposedAddress;

        emit INOAddresses.NodeOperatorManagerAddressChangeProposed(
            nodeOperatorId,
            oldProposedAddress,
            proposedAddress
        );
    }

    /// @notice Confirm a new manager address for the Node Operator.
    ///         Should be called from the currently proposed address
    /// @param nodeOperatorId ID of the Node Operator
    function confirmNodeOperatorManagerAddressChange(
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        if (no.managerAddress == address(0))
            revert ICSModule.NodeOperatorDoesNotExist();
        if (no.proposedManagerAddress != msg.sender)
            revert INOAddresses.SenderIsNotProposedAddress();

        address oldAddress = no.managerAddress;
        no.managerAddress = msg.sender;
        delete no.proposedManagerAddress;

        emit INOAddresses.NodeOperatorManagerAddressChanged(
            nodeOperatorId,
            oldAddress,
            msg.sender
        );
    }

    /// @notice Propose a new reward address for the Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param proposedAddress Proposed reward address
    function proposeNodeOperatorRewardAddressChange(
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId,
        address proposedAddress
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        if (no.rewardAddress == address(0))
            revert ICSModule.NodeOperatorDoesNotExist();
        if (no.rewardAddress != msg.sender)
            revert INOAddresses.SenderIsNotRewardAddress();
        if (no.rewardAddress == proposedAddress)
            revert INOAddresses.SameAddress();
        if (no.proposedRewardAddress == proposedAddress)
            revert INOAddresses.AlreadyProposed();

        address oldProposedAddress = no.proposedRewardAddress;
        no.proposedRewardAddress = proposedAddress;

        emit INOAddresses.NodeOperatorRewardAddressChangeProposed(
            nodeOperatorId,
            oldProposedAddress,
            proposedAddress
        );
    }

    /// @notice Confirm a new reward address for the Node Operator.
    ///         Should be called from the currently proposed address
    /// @param nodeOperatorId ID of the Node Operator
    function confirmNodeOperatorRewardAddressChange(
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        if (no.rewardAddress == address(0))
            revert ICSModule.NodeOperatorDoesNotExist();
        if (no.proposedRewardAddress != msg.sender)
            revert INOAddresses.SenderIsNotProposedAddress();

        address oldAddress = no.rewardAddress;
        no.rewardAddress = msg.sender;
        delete no.proposedRewardAddress;

        emit INOAddresses.NodeOperatorRewardAddressChanged(
            nodeOperatorId,
            oldAddress,
            msg.sender
        );
    }

    /// @notice Reset the manager address to the reward address.
    ///         Should be called from the reward address
    /// @param nodeOperatorId ID of the Node Operator
    function resetNodeOperatorManagerAddress(
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        if (no.rewardAddress == address(0))
            revert ICSModule.NodeOperatorDoesNotExist();
        if (no.extendedManagerPermissions)
            revert INOAddresses.MethodCallIsNotAllowed();
        if (no.rewardAddress != msg.sender)
            revert INOAddresses.SenderIsNotRewardAddress();
        if (no.managerAddress == no.rewardAddress)
            revert INOAddresses.SameAddress();
        address previousManagerAddress = no.managerAddress;

        no.managerAddress = no.rewardAddress;
        // @dev Gas golfing
        if (no.proposedManagerAddress != address(0))
            delete no.proposedManagerAddress;

        emit INOAddresses.NodeOperatorManagerAddressChanged(
            nodeOperatorId,
            previousManagerAddress,
            no.rewardAddress
        );
    }

    /// @notice Change rewardAddress if extendedManagerPermissions is enabled for the Node Operator.
    ///         Should be called from the current manager address
    /// @param nodeOperatorId ID of the Node Operator
    /// @param newAddress New reward address
    function changeNodeOperatorRewardAddress(
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId,
        address newAddress
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        if (no.managerAddress == address(0))
            revert ICSModule.NodeOperatorDoesNotExist();
        if (!no.extendedManagerPermissions)
            revert INOAddresses.MethodCallIsNotAllowed();
        if (no.managerAddress != msg.sender)
            revert INOAddresses.SenderIsNotManagerAddress();

        address oldAddress = no.rewardAddress;
        no.rewardAddress = newAddress;
        // @dev Gas golfing
        if (no.proposedRewardAddress != address(0))
            delete no.proposedRewardAddress;

        emit INOAddresses.NodeOperatorRewardAddressChanged(
            nodeOperatorId,
            oldAddress,
            newAddress
        );
    }
}

struct NodeOperatorManagementProperties {
    address managerAddress;
    address rewardAddress;
    bool extendedManagerPermissions;
}

type Batch is uint256;

type TransientUintUintMap is uint256;

library TransientUintUintMapLib {
    function create() internal returns (TransientUintUintMap self) {
        // keccak256(abi.encode(uint256(keccak256("TransientUintUintMap")) - 1)) & ~bytes32(uint256(0xff))
        uint256 anchor = 0x6e38e7eaa4307e6ee6c66720337876ca65012869fbef035f57219354c1728400;

        // `anchor` slot in the transient storage tracks the "address" of the last created object.
        // The next address is being computed as keccak256(`anchor` . `prev`).
        assembly ("memory-safe") {
            let prev := tload(anchor)
            mstore(0x00, anchor)
            mstore(0x20, prev)
            self := keccak256(0x00, 0x40)
            tstore(anchor, self)
        }
    }

    function add(
        TransientUintUintMap self,
        uint256 key,
        uint256 value
    ) internal {
        uint256 slot = _slot(self, key);
        assembly ("memory-safe") {
            let v := tload(slot)
            // NOTE: Here's no overflow check.
            v := add(v, value)
            tstore(slot, v)
        }
    }

    function get(
        TransientUintUintMap self,
        uint256 key
    ) internal view returns (uint256 v) {
        uint256 slot = _slot(self, key);
        assembly ("memory-safe") {
            v := tload(slot)
        }
    }

    function _slot(
        TransientUintUintMap self,
        uint256 key
    ) internal pure returns (uint256 slot) {
        // Compute an address in the transient storage in the same manner it works for storage mappings.
        // `slot` = keccak256(`self` . `key`)
        assembly ("memory-safe") {
            mstore(0x00, self)
            mstore(0x20, key)
            slot := keccak256(0x00, 0x40)
        }
    }
}

function createBatch(
    uint256 nodeOperatorId,
    uint256 keysCount
) pure returns (Batch item) {
    // NOTE: No need to safe cast due to internal logic.
    nodeOperatorId = uint64(nodeOperatorId);
    keysCount = uint64(keysCount);

    assembly {
        item := shl(128, keysCount) // `keysCount` in [64:127]
        item := or(item, shl(192, nodeOperatorId)) // `nodeOperatorId` in [0:63]
    }
}

library QueueLib {
    struct Queue {
        // Pointer to the item to be dequeued.
        uint128 head;
        // Tracks the total number of batches ever enqueued.
        uint128 tail;
        // Mapping saves a little in costs and allows easily fallback to a zeroed batch on out-of-bounds access.
        mapping(uint128 => Batch) queue;
    }

    //////
    /// External methods
    //////
    function normalize(
        Queue storage self,
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 nodeOperatorId
    ) external {
        NodeOperator storage no = nodeOperators[nodeOperatorId];
        uint32 depositable = no.depositableValidatorsCount;
        uint32 enqueued = no.enqueuedCount;

        if (enqueued < depositable) {
            uint32 count;
            unchecked {
                count = depositable - enqueued;
            }
            no.enqueuedCount = depositable;
            self.enqueue(nodeOperatorId, count);
        }
    }

    function clean(
        Queue storage self,
        mapping(uint256 => NodeOperator) storage nodeOperators,
        uint256 maxItems
    ) external returns (uint256 removed, uint256 lastRemovedAtDepth) {
        if (maxItems == 0) revert IQueueLib.QueueLookupNoLimit();

        Batch prev;
        uint128 indexOfPrev;

        uint128 head = self.head;
        uint128 curr = head;

        TransientUintUintMap queueLookup = TransientUintUintMapLib.create();

        for (uint256 i; i < maxItems; ++i) {
            Batch item = self.queue[curr];
            if (item.isNil()) {
                break;
            }

            NodeOperator storage no = nodeOperators[item.noId()];
            if (queueLookup.get(item.noId()) >= no.depositableValidatorsCount) {
                // NOTE: Since we reached that point there's no way for a Node Operator to have a depositable batch
                // later in the queue, and hence we don't update _queueLookup for the Node Operator.
                if (curr == head) {
                    self.dequeue();
                    head = self.head;
                } else {
                    // There's no `prev` item while we call `dequeue`, and removing an item will keep the `prev` intact
                    // other than changing its `next` field.
                    prev = prev.setNext(item);
                    self.queue[indexOfPrev] = prev;
                }

                // We assume that the invariant `enqueuedCount` >= `keys` is kept.
                // NOTE: No need to safe cast due to internal logic.
                no.enqueuedCount -= uint32(item.keys());

                unchecked {
                    lastRemovedAtDepth = i + 1;
                    ++removed;
                }
            } else {
                queueLookup.add(item.noId(), item.keys());
                indexOfPrev = curr;
                prev = item;
            }

            curr = item.next();
        }
    }

    /////
    /// Internal methods
    /////
    function enqueue(
        Queue storage self,
        uint256 nodeOperatorId,
        uint256 keysCount
    ) internal returns (Batch item) {
        uint128 tail = self.tail;
        item = createBatch(nodeOperatorId, keysCount);

        assembly {
            item := or(
                and(
                    item,
                    0xffffffffffffffffffffffffffffffff00000000000000000000000000000000
                ),
                add(tail, 1)
            ) // item.next = self.tail + 1;
        }

        self.queue[tail] = item;
        unchecked {
            ++self.tail;
        }
        emit IQueueLib.BatchEnqueued(nodeOperatorId, keysCount);
    }

    function dequeue(Queue storage self) internal returns (Batch item) {
        item = peek(self);

        if (item.isNil()) {
            revert IQueueLib.QueueIsEmpty();
        }

        self.head = item.next();
    }

    function peek(Queue storage self) internal view returns (Batch) {
        return self.queue[self.head];
    }

    function at(
        Queue storage self,
        uint128 index
    ) internal view returns (Batch) {
        return self.queue[index];
    }
}

library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}

library SafeERC20 {
    using Address for address;

    /**
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return success && (returndata.length == 0 || abi.decode(returndata, (bool))) && address(token).code.length > 0;
    }
}

library AssetRecovererLib {
    using SafeERC20 for IERC20;

    /**
     * @dev Allows the sender to recover Ether held by the contract.
     * Emits an EtherRecovered event upon success.
     */
    function recoverEther() external {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount }("");
        if (!success) revert IAssetRecovererLib.FailedToSendEther();
        emit IAssetRecovererLib.EtherRecovered(msg.sender, amount);
    }

    /**
     * @dev Allows the sender to recover ERC20 tokens held by the contract.
     * @param token The address of the ERC20 token to recover.
     * @param amount The amount of the ERC20 token to recover.
     * Emits an ERC20Recovered event upon success.
     */
    function recoverERC20(address token, uint256 amount) external {
        IERC20(token).safeTransfer(msg.sender, amount);
        emit IAssetRecovererLib.ERC20Recovered(token, msg.sender, amount);
    }

    /**
     * @dev Allows the sender to recover stETH shares held by the contract.
     * The use of a separate method for stETH is to avoid rounding problems when converting shares to stETH.
     * @param lido The address of the Lido contract.
     * @param shares The amount of stETH shares to recover.
     * Emits an StETHRecovered event upon success.
     */
    function recoverStETHShares(address lido, uint256 shares) external {
        ILido(lido).transferShares(msg.sender, shares);
        emit IAssetRecovererLib.StETHSharesRecovered(msg.sender, shares);
    }

    /**
     * @dev Allows the sender to recover ERC721 tokens held by the contract.
     * @param token The address of the ERC721 token to recover.
     * @param tokenId The token ID of the ERC721 token to recover.
     * Emits an ERC721Recovered event upon success.
     */
    function recoverERC721(address token, uint256 tokenId) external {
        IERC721(token).safeTransferFrom(address(this), msg.sender, tokenId);
        emit IAssetRecovererLib.ERC721Recovered(token, tokenId, msg.sender);
    }

    /**
     * @dev Allows the sender to recover ERC1155 tokens held by the contract.
     * @param token The address of the ERC1155 token to recover.
     * @param tokenId The token ID of the ERC1155 token to recover.
     * Emits an ERC1155Recovered event upon success.
     */
    function recoverERC1155(address token, uint256 tokenId) external {
        uint256 amount = IERC1155(token).balanceOf(address(this), tokenId);
        IERC1155(token).safeTransferFrom({
            from: address(this),
            to: msg.sender,
            id: tokenId,
            value: amount,
            data: ""
        });
        emit IAssetRecovererLib.ERC1155Recovered(
            token,
            tokenId,
            msg.sender,
            amount
        );
    }
}

abstract contract AssetRecoverer {
    /// @dev Allows sender to recover Ether held by the contract
    /// Emits an EtherRecovered event upon success
    function recoverEther() external {
        _onlyRecoverer();
        AssetRecovererLib.recoverEther();
    }

    /// @dev Allows sender to recover ERC20 tokens held by the contract
    /// @param token The address of the ERC20 token to recover
    /// Emits an ERC20Recovered event upon success
    /// Optionally, the inheriting contract can override this function to add additional restrictions
    function recoverERC20(address token, uint256 amount) external virtual {
        _onlyRecoverer();
        AssetRecovererLib.recoverERC20(token, amount);
    }

    /// @dev Allows sender to recover ERC721 tokens held by the contract
    /// @param token The address of the ERC721 token to recover
    /// @param tokenId The token ID of the ERC721 token to recover
    /// Emits an ERC721Recovered event upon success
    function recoverERC721(address token, uint256 tokenId) external {
        _onlyRecoverer();
        AssetRecovererLib.recoverERC721(token, tokenId);
    }

    /// @dev Allows sender to recover ERC1155 tokens held by the contract.
    /// @param token The address of the ERC1155 token to recover.
    /// @param tokenId The token ID of the ERC1155 token to recover.
    /// Emits an ERC1155Recovered event upon success.
    function recoverERC1155(address token, uint256 tokenId) external {
        _onlyRecoverer();
        AssetRecovererLib.recoverERC1155(token, tokenId);
    }

    /// @dev Guardian to restrict access to the recover methods.
    ///      Should be implemented by the inheriting contract
    function _onlyRecoverer() internal view virtual;
}

library UnstructuredStorage {
    function setStorageAddress(bytes32 position, address data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function setStorageUint256(bytes32 position, uint256 data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function getStorageAddress(
        bytes32 position
    ) internal view returns (address data) {
        assembly {
            data := sload(position)
        }
    }

    function getStorageUint256(
        bytes32 position
    ) internal view returns (uint256 data) {
        assembly {
            data := sload(position)
        }
    }
}

contract PausableUntil {
    using UnstructuredStorage for bytes32;

    /// Contract resume/pause control storage slot
    bytes32 internal constant RESUME_SINCE_TIMESTAMP_POSITION =
        keccak256("lido.PausableUntil.resumeSinceTimestamp");
    /// Special value for the infinite pause
    uint256 public constant PAUSE_INFINITELY = type(uint256).max;

    /// @notice Emitted when paused by the `pauseFor` or `pauseUntil` call
    event Paused(uint256 duration);
    /// @notice Emitted when resumed by the `resume` call
    event Resumed();

    error ZeroPauseDuration();
    error PausedExpected();
    error ResumedExpected();
    error PauseUntilMustBeInFuture();

    /// @notice Reverts when resumed
    modifier whenPaused() {
        _checkPaused();
        _;
    }

    /// @notice Reverts when paused
    modifier whenResumed() {
        _checkResumed();
        _;
    }

    /// @notice Returns one of:
    ///  - PAUSE_INFINITELY if paused infinitely returns
    ///  - first second when get contract get resumed if paused for specific duration
    ///  - some timestamp in past if not paused
    function getResumeSinceTimestamp() external view returns (uint256) {
        return RESUME_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    /// @notice Returns whether the contract is paused
    function isPaused() public view returns (bool) {
        return
            block.timestamp <
            RESUME_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    function _resume() internal {
        _checkPaused();
        RESUME_SINCE_TIMESTAMP_POSITION.setStorageUint256(block.timestamp);
        emit Resumed();
    }

    function _pauseFor(uint256 duration) internal {
        _checkResumed();
        if (duration == 0) revert ZeroPauseDuration();

        uint256 resumeSince;
        if (duration == PAUSE_INFINITELY) {
            resumeSince = PAUSE_INFINITELY;
        } else {
            resumeSince = block.timestamp + duration;
        }
        _setPausedState(resumeSince);
    }

    function _pauseUntil(uint256 pauseUntilInclusive) internal {
        _checkResumed();
        if (pauseUntilInclusive < block.timestamp)
            revert PauseUntilMustBeInFuture();

        uint256 resumeSince;
        if (pauseUntilInclusive != PAUSE_INFINITELY) {
            resumeSince = pauseUntilInclusive + 1;
        } else {
            resumeSince = PAUSE_INFINITELY;
        }
        _setPausedState(resumeSince);
    }

    function _setPausedState(uint256 resumeSince) internal {
        RESUME_SINCE_TIMESTAMP_POSITION.setStorageUint256(resumeSince);
        if (resumeSince == PAUSE_INFINITELY) {
            emit Paused(PAUSE_INFINITELY);
        } else {
            emit Paused(resumeSince - block.timestamp);
        }
    }

    function _checkPaused() internal view {
        if (!isPaused()) {
            revert PausedExpected();
        }
    }

    function _checkResumed() internal view {
        if (isPaused()) {
            revert ResumedExpected();
        }
    }
}

interface IAccessControlEnumerable is IAccessControl {
    /**
     * @dev Returns one of the accounts that have `role`. `index` must be a
     * value between 0 and {getRoleMemberCount}, non-inclusive.
     *
     * Role bearers are not sorted in any particular way, and their ordering may
     * change at any point.
     *
     * WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
     * you perform all queries on the same block. See the following
     * https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
     * for more information.
     */
    function getRoleMember(bytes32 role, uint256 index) external view returns (address);

    /**
     * @dev Returns the number of accounts that have `role`. Can be used
     * together with {getRoleMember} to enumerate all bearers of a role.
     */
    function getRoleMemberCount(bytes32 role) external view returns (uint256);
}

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

interface IAccessControl {
    /**
     * @dev The `account` is missing a role.
     */
    error AccessControlUnauthorizedAccount(address account, bytes32 neededRole);

    /**
     * @dev The caller of a function is not the expected one.
     *
     * NOTE: Don't confuse with {AccessControlUnauthorizedAccount}.
     */
    error AccessControlBadConfirmation();

    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     */
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {AccessControl-_setupRole}.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool);

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `callerConfirmation`.
     */
    function renounceRole(bytes32 role, address callerConfirmation) external;
}

interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

abstract contract ERC165Upgradeable is Initializable, IERC165 {
    function __ERC165_init() internal onlyInitializing {
    }

    function __ERC165_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControl, ERC165Upgradeable {
    struct RoleData {
        mapping(address account => bool) hasRole;
        bytes32 adminRole;
    }

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;


    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControl
    struct AccessControlStorage {
        mapping(bytes32 role => RoleData) _roles;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControl")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant AccessControlStorageLocation = 0x02dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800;

    function _getAccessControlStorage() private pure returns (AccessControlStorage storage $) {
        assembly {
            $.slot := AccessControlStorageLocation
        }
    }

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with an {AccessControlUnauthorizedAccount} error including the required role.
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function __AccessControl_init() internal onlyInitializing {
    }

    function __AccessControl_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        return $._roles[role].hasRole[account];
    }

    /**
     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
     * is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    /**
     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
     * is missing `role`.
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert AccessControlUnauthorizedAccount(account, role);
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        return $._roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleGranted} event.
     */
    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleRevoked} event.
     */
    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `callerConfirmation`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(bytes32 role, address callerConfirmation) public virtual {
        if (callerConfirmation != _msgSender()) {
            revert AccessControlBadConfirmation();
        }

        _revokeRole(role, callerConfirmation);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        AccessControlStorage storage $ = _getAccessControlStorage();
        bytes32 previousAdminRole = getRoleAdmin(role);
        $._roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual returns (bool) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        if (!hasRole(role, account)) {
            $._roles[role].hasRole[account] = true;
            emit RoleGranted(role, account, _msgSender());
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Attempts to revoke `role` to `account` and returns a boolean indicating if `role` was revoked.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual returns (bool) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        if (hasRole(role, account)) {
            $._roles[role].hasRole[account] = false;
            emit RoleRevoked(role, account, _msgSender());
            return true;
        } else {
            return false;
        }
    }
}

library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position is the index of the value in the `values` array plus 1.
        // Position 0 is used to mean a value is not in the set.
        mapping(bytes32 value => uint256) _positions;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._positions[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We cache the value's position to prevent multiple reads from the same storage slot
        uint256 position = set._positions[value];

        if (position != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 valueIndex = position - 1;
            uint256 lastIndex = set._values.length - 1;

            if (valueIndex != lastIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the lastValue to the index where the value to delete is
                set._values[valueIndex] = lastValue;
                // Update the tracked position of the lastValue (that was just moved)
                set._positions[lastValue] = position;
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the tracked position for the deleted slot
            delete set._positions[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._positions[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        bytes32[] memory store = _values(set._inner);
        bytes32[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}

abstract contract AccessControlEnumerableUpgradeable is Initializable, IAccessControlEnumerable, AccessControlUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControlEnumerable
    struct AccessControlEnumerableStorage {
        mapping(bytes32 role => EnumerableSet.AddressSet) _roleMembers;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControlEnumerable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant AccessControlEnumerableStorageLocation = 0xc1f6fe24621ce81ec5827caf0253cadb74709b061630e6b55e82371705932000;

    function _getAccessControlEnumerableStorage() private pure returns (AccessControlEnumerableStorage storage $) {
        assembly {
            $.slot := AccessControlEnumerableStorageLocation
        }
    }

    function __AccessControlEnumerable_init() internal onlyInitializing {
    }

    function __AccessControlEnumerable_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControlEnumerable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns one of the accounts that have `role`. `index` must be a
     * value between 0 and {getRoleMemberCount}, non-inclusive.
     *
     * Role bearers are not sorted in any particular way, and their ordering may
     * change at any point.
     *
     * WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
     * you perform all queries on the same block. See the following
     * https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
     * for more information.
     */
    function getRoleMember(bytes32 role, uint256 index) public view virtual returns (address) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        return $._roleMembers[role].at(index);
    }

    /**
     * @dev Returns the number of accounts that have `role`. Can be used
     * together with {getRoleMember} to enumerate all bearers of a role.
     */
    function getRoleMemberCount(bytes32 role) public view virtual returns (uint256) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        return $._roleMembers[role].length();
    }

    /**
     * @dev Overload {AccessControl-_grantRole} to track enumerable memberships
     */
    function _grantRole(bytes32 role, address account) internal virtual override returns (bool) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        bool granted = super._grantRole(role, account);
        if (granted) {
            $._roleMembers[role].add(account);
        }
        return granted;
    }

    /**
     * @dev Overload {AccessControl-_revokeRole} to track enumerable memberships
     */
    function _revokeRole(bytes32 role, address account) internal virtual override returns (bool) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        bool revoked = super._revokeRole(role, account);
        if (revoked) {
            $._roleMembers[role].remove(account);
        }
        return revoked;
    }
}

abstract contract Initializable {
    /**
     * @dev Storage of the initializable contract.
     *
     * It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
     * when using with upgradeable contracts.
     *
     * @custom:storage-location erc7201:openzeppelin.storage.Initializable
     */
    struct InitializableStorage {
        /**
         * @dev Indicates that the contract has been initialized.
         */
        uint64 _initialized;
        /**
         * @dev Indicates that the contract is in the process of being initialized.
         */
        bool _initializing;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;

    /**
     * @dev The contract is already initialized.
     */
    error InvalidInitialization();

    /**
     * @dev The contract is not initializing.
     */
    error NotInitializing();

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint64 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
     * number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
     * production.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        // Cache values to avoid duplicated sloads
        bool isTopLevelCall = !$._initializing;
        uint64 initialized = $._initialized;

        // Allowed calls:
        // - initialSetup: the contract is not in the initializing state and no previous version was
        //                 initialized
        // - construction: the contract is initialized at version 1 (no reininitialization) and the
        //                 current contract is just being deployed
        bool initialSetup = initialized == 0 && isTopLevelCall;
        bool construction = initialized == 1 && address(this).code.length == 0;

        if (!initialSetup && !construction) {
            revert InvalidInitialization();
        }
        $._initialized = 1;
        if (isTopLevelCall) {
            $._initializing = true;
        }
        _;
        if (isTopLevelCall) {
            $._initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint64 version) {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing || $._initialized >= version) {
            revert InvalidInitialization();
        }
        $._initialized = version;
        $._initializing = true;
        _;
        $._initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        _checkInitializing();
        _;
    }

    /**
     * @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
     */
    function _checkInitializing() internal view virtual {
        if (!_isInitializing()) {
            revert NotInitializing();
        }
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing) {
            revert InvalidInitialization();
        }
        if ($._initialized != type(uint64).max) {
            $._initialized = type(uint64).max;
            emit Initialized(type(uint64).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint64) {
        return _getInitializableStorage()._initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _getInitializableStorage()._initializing;
    }

    /**
     * @dev Returns a pointer to the storage namespace.
     */
    // solhint-disable-next-line var-name-mixedcase
    function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
        assembly {
            $.slot := INITIALIZABLE_STORAGE
        }
    }
}

interface IStakingModule {
    /// @notice Returns the type of the staking module
    function getType() external view returns (bytes32);

    /// @notice Returns all-validators summary in the staking module
    /// @return totalExitedValidators total number of validators in the EXITED state
    ///     on the Consensus Layer. This value can't decrease in normal conditions
    /// @return totalDepositedValidators total number of validators deposited via the
    ///     official Deposit Contract. This value is a cumulative counter: even when the validator
    ///     goes into EXITED state this counter is not decreasing
    /// @return depositableValidatorsCount number of validators in the set available for deposit
    function getStakingModuleSummary()
        external
        view
        returns (
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            uint256 depositableValidatorsCount
        );

    /// @notice Returns all-validators summary belonging to the node operator with the given id
    /// @param _nodeOperatorId id of the operator to return report for
    /// @return targetLimitMode shows whether the current target limit applied to the node operator (1 = soft mode, 2 = forced mode)
    /// @return targetValidatorsCount relative target active validators limit for operator
    /// @return stuckValidatorsCount number of validators with an expired request to exit time
    /// @return refundedValidatorsCount number of validators that can't be withdrawn, but deposit
    ///     costs were compensated to the Lido by the node operator
    /// @return stuckPenaltyEndTimestamp time when the penalty for stuck validators stops applying
    ///     to node operator rewards
    /// @return totalExitedValidators total number of validators in the EXITED state
    ///     on the Consensus Layer. This value can't decrease in normal conditions
    /// @return totalDepositedValidators total number of validators deposited via the official
    ///     Deposit Contract. This value is a cumulative counter: even when the validator goes into
    ///     EXITED state this counter is not decreasing
    /// @return depositableValidatorsCount number of validators in the set available for deposit
    function getNodeOperatorSummary(
        uint256 _nodeOperatorId
    )
        external
        view
        returns (
            uint256 targetLimitMode,
            uint256 targetValidatorsCount,
            uint256 stuckValidatorsCount,
            uint256 refundedValidatorsCount,
            uint256 stuckPenaltyEndTimestamp,
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            uint256 depositableValidatorsCount
        );

    /// @notice Returns a counter that MUST change its value whenever the deposit data set changes.
    ///     Below is the typical list of actions that requires an update of the nonce:
    ///     1. a node operator's deposit data is added
    ///     2. a node operator's deposit data is removed
    ///     3. a node operator's ready-to-deposit data size is changed
    ///     4. a node operator was activated/deactivated
    ///     5. a node operator's deposit data is used for the deposit
    ///     Note: Depending on the StakingModule implementation above list might be extended
    /// @dev In some scenarios, it's allowed to update nonce without actual change of the deposit
    ///      data subset, but it MUST NOT lead to the DOS of the staking module via continuous
    ///      update of the nonce by the malicious actor
    function getNonce() external view returns (uint256);

    /// @notice Returns total number of node operators
    function getNodeOperatorsCount() external view returns (uint256);

    /// @notice Returns number of active node operators
    function getActiveNodeOperatorsCount() external view returns (uint256);

    /// @notice Returns if the node operator with given id is active
    /// @param _nodeOperatorId Id of the node operator
    function getNodeOperatorIsActive(
        uint256 _nodeOperatorId
    ) external view returns (bool);

    /// @notice Returns up to `_limit` node operator ids starting from the `_offset`. The order of
    ///     the returned ids is not defined and might change between calls.
    /// @dev This view must not revert in case of invalid data passed. When `_offset` exceeds the
    ///     total node operators count or when `_limit` is equal to 0 MUST be returned empty array.
    function getNodeOperatorIds(
        uint256 _offset,
        uint256 _limit
    ) external view returns (uint256[] memory nodeOperatorIds);

    /// @notice Called by StakingRouter to signal that stETH rewards were minted for this module.
    /// @param _totalShares Amount of stETH shares that were minted to reward all node operators.
    /// @dev IMPORTANT: this method SHOULD revert with empty error data ONLY because of "out of gas".
    ///      Details about error data: https://docs.soliditylang.org/en/v0.8.9/control-structures.html#error-handling-assert-require-revert-and-exceptions
    function onRewardsMinted(uint256 _totalShares) external;

    /// @notice Called by StakingRouter to decrease the number of vetted keys for node operator with given id
    /// @param _nodeOperatorIds bytes packed array of the node operators id
    /// @param _vettedSigningKeysCounts bytes packed array of the new number of vetted keys for the node operators
    function decreaseVettedSigningKeysCount(
        bytes calldata _nodeOperatorIds,
        bytes calldata _vettedSigningKeysCounts
    ) external;

    /// @notice Updates the number of the validators of the given node operator that were requested
    ///         to exit but failed to do so in the max allowed time
    /// @param _nodeOperatorIds bytes packed array of the node operators id
    /// @param _stuckValidatorsCounts bytes packed array of the new number of STUCK validators for the node operators
    function updateStuckValidatorsCount(
        bytes calldata _nodeOperatorIds,
        bytes calldata _stuckValidatorsCounts
    ) external;

    /// @notice Updates the number of the validators in the EXITED state for node operator with given id
    /// @param _nodeOperatorIds bytes packed array of the node operators id
    /// @param _exitedValidatorsCounts bytes packed array of the new number of EXITED validators for the node operators
    function updateExitedValidatorsCount(
        bytes calldata _nodeOperatorIds,
        bytes calldata _exitedValidatorsCounts
    ) external;

    /// @notice Updates the number of the refunded validators for node operator with the given id
    /// @param _nodeOperatorId Id of the node operator
    /// @param _refundedValidatorsCount New number of refunded validators of the node operator
    function updateRefundedValidatorsCount(
        uint256 _nodeOperatorId,
        uint256 _refundedValidatorsCount
    ) external;

    /// @notice Updates the limit of the validators that can be used for deposit
    /// @param _nodeOperatorId Id of the node operator
    /// @param _targetLimitMode target limit mode
    /// @param _targetLimit Target limit of the node operator
    function updateTargetValidatorsLimits(
        uint256 _nodeOperatorId,
        uint256 _targetLimitMode,
        uint256 _targetLimit
    ) external;

    /// @notice Unsafely updates the number of validators in the EXITED/STUCK states for node operator with given id
    ///      'unsafely' means that this method can both increase and decrease exited and stuck counters
    /// @param _nodeOperatorId Id of the node operator
    /// @param _exitedValidatorsCount New number of EXITED validators for the node operator
    /// @param _stuckValidatorsCount New number of STUCK validator for the node operator
    function unsafeUpdateValidatorsCount(
        uint256 _nodeOperatorId,
        uint256 _exitedValidatorsCount,
        uint256 _stuckValidatorsCount
    ) external;

    /// @notice Obtains deposit data to be used by StakingRouter to deposit to the Ethereum Deposit
    ///     contract
    /// @dev The method MUST revert when the staking module has not enough deposit data items
    /// @param _depositsCount Number of deposits to be done
    /// @param _depositCalldata Staking module defined data encoded as bytes.
    ///        IMPORTANT: _depositCalldata MUST NOT modify the deposit data set of the staking module
    /// @return publicKeys Batch of the concatenated public validators keys
    /// @return signatures Batch of the concatenated deposit signatures for returned public keys
    function obtainDepositData(
        uint256 _depositsCount,
        bytes calldata _depositCalldata
    ) external returns (bytes memory publicKeys, bytes memory signatures);

    /// @notice Called by StakingRouter after it finishes updating exited and stuck validators
    /// counts for this module's node operators.
    ///
    /// Guaranteed to be called after an oracle report is applied, regardless of whether any node
    /// operator in this module has actually received any updated counts as a result of the report
    /// but given that the total number of exited validators returned from getStakingModuleSummary
    /// is the same as StakingRouter expects based on the total count received from the oracle.
    ///
    /// @dev IMPORTANT: this method SHOULD revert with empty error data ONLY because of "out of gas".
    ///      Details about error data: https://docs.soliditylang.org/en/v0.8.9/control-structures.html#error-handling-assert-require-revert-and-exceptions
    function onExitedAndStuckValidatorsCountsUpdated() external;

    /// @notice Called by StakingRouter when withdrawal credentials are changed.
    /// @dev This method MUST discard all StakingModule's unused deposit data cause they become
    ///      invalid after the withdrawal credentials are changed
    ///
    /// @dev IMPORTANT: this method SHOULD revert with empty error data ONLY because of "out of gas".
    ///      Details about error data: https://docs.soliditylang.org/en/v0.8.9/control-structures.html#error-handling-assert-require-revert-and-exceptions
    function onWithdrawalCredentialsChanged() external;

    /// @dev Event to be emitted on StakingModule's nonce change
    event NonceChanged(uint256 nonce);

    /// @dev Event to be emitted when a signing key is added to the StakingModule
    event SigningKeyAdded(uint256 indexed nodeOperatorId, bytes pubkey);

    /// @dev Event to be emitted when a signing key is removed from the StakingModule
    event SigningKeyRemoved(uint256 indexed nodeOperatorId, bytes pubkey);
}

interface IQueueLib {
    event BatchEnqueued(uint256 indexed nodeOperatorId, uint256 count);

    error QueueIsEmpty();
    error QueueLookupNoLimit();
}

interface INOAddresses {
    event NodeOperatorManagerAddressChangeProposed(
        uint256 indexed nodeOperatorId,
        address indexed oldProposedAddress,
        address indexed newProposedAddress
    );
    event NodeOperatorRewardAddressChangeProposed(
        uint256 indexed nodeOperatorId,
        address indexed oldProposedAddress,
        address indexed newProposedAddress
    );
    // args order as in https://github.com/OpenZeppelin/openzeppelin-contracts/blob/11dc5e3809ebe07d5405fe524385cbe4f890a08b/contracts/access/Ownable.sol#L33
    event NodeOperatorManagerAddressChanged(
        uint256 indexed nodeOperatorId,
        address indexed oldAddress,
        address indexed newAddress
    );
    event NodeOperatorRewardAddressChanged(
        uint256 indexed nodeOperatorId,
        address indexed oldAddress,
        address indexed newAddress
    );

    error AlreadyProposed();
    error SameAddress();
    error SenderIsNotManagerAddress();
    error SenderIsNotRewardAddress();
    error SenderIsNotProposedAddress();
    error MethodCallIsNotAllowed();
}

interface IAssetRecovererLib {
    event EtherRecovered(address indexed recipient, uint256 amount);
    event ERC20Recovered(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );
    event StETHSharesRecovered(address indexed recipient, uint256 shares);
    event ERC721Recovered(
        address indexed token,
        uint256 tokenId,
        address indexed recipient
    );
    event ERC1155Recovered(
        address indexed token,
        uint256 tokenId,
        address indexed recipient,
        uint256 amount
    );

    error FailedToSendEther();
    error NotAllowedToRecover();
}

struct NodeOperator {
    // All the counters below are used together e.g. in the _updateDepositableValidatorsCount
    /* 1 */ uint32 totalAddedKeys; // @dev increased and decreased when removed
    /* 1 */ uint32 totalWithdrawnKeys; // @dev only increased
    /* 1 */ uint32 totalDepositedKeys; // @dev only increased
    /* 1 */ uint32 totalVettedKeys; // @dev both increased and decreased
    /* 1 */ uint32 stuckValidatorsCount; // @dev both increased and decreased
    /* 1 */ uint32 depositableValidatorsCount; // @dev any value
    /* 1 */ uint32 targetLimit;
    /* 1 */ uint8 targetLimitMode;
    /* 2 */ uint32 totalExitedKeys; // @dev only increased except for the unsafe updates
    /* 2 */ uint32 enqueuedCount; // Tracks how many places are occupied by the node operator's keys in the queue.
    /* 2 */ address managerAddress;
    /* 3 */ address proposedManagerAddress;
    /* 4 */ address rewardAddress;
    /* 5 */ address proposedRewardAddress;
    /* 5 */ bool extendedManagerPermissions;
}

interface ICSModule is
    IStakingModule,
    IQueueLib,
    INOAddresses,
    IAssetRecovererLib
{
    error NodeOperatorDoesNotExist();
    error ZeroRewardAddress();

    /// @notice Gets node operator non-withdrawn keys
    /// @param nodeOperatorId ID of the node operator
    /// @return Non-withdrawn keys count
    function getNodeOperatorNonWithdrawnKeys(
        uint256 nodeOperatorId
    ) external view returns (uint256);

    /// @notice Returns the node operator by id
    /// @param nodeOperatorId Node Operator id
    function getNodeOperator(
        uint256 nodeOperatorId
    ) external view returns (NodeOperator memory);

    /// @notice Gets node operator signing keys
    /// @param nodeOperatorId ID of the node operator
    /// @param startIndex Index of the first key
    /// @param keysCount Count of keys to get
    /// @return Signing keys
    function getSigningKeys(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) external view returns (bytes memory);

    /// @notice Gets node operator signing keys with signatures
    /// @param nodeOperatorId ID of the node operator
    /// @param startIndex Index of the first key
    /// @param keysCount Count of keys to get
    /// @return keys Signing keys
    /// @return signatures Signatures of (deposit_message, domain) tuples
    function getSigningKeysWithSignatures(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) external view returns (bytes memory keys, bytes memory signatures);

    /// @notice Report node operator's key as slashed and apply initial slashing penalty.
    /// @param nodeOperatorId Operator ID in the module.
    /// @param keyIndex Index of the slashed key in the node operator's keys.
    function submitInitialSlashing(
        uint256 nodeOperatorId,
        uint256 keyIndex
    ) external;

    /// @notice Report node operator's key as withdrawn and settle withdrawn amount.
    /// @param nodeOperatorId Operator ID in the module.
    /// @param keyIndex Index of the withdrawn key in the node operator's keys.
    /// @param amount Amount of withdrawn ETH in wei.
    /// @param isSlashed Validator is slashed or not
    function submitWithdrawal(
        uint256 nodeOperatorId,
        uint256 keyIndex,
        uint256 amount,
        bool isSlashed
    ) external;

    function depositWstETH(
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        ICSAccounting.PermitInput calldata permit
    ) external;

    function depositStETH(
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        ICSAccounting.PermitInput calldata permit
    ) external;

    function depositETH(uint256 nodeOperatorId) external payable;
}

contract CSModule is
    ICSModule,
    Initializable,
    AccessControlEnumerableUpgradeable,
    PausableUntil,
    AssetRecoverer
{
    using QueueLib for QueueLib.Queue;

    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 public constant RESUME_ROLE = keccak256("RESUME_ROLE");
    bytes32 public constant MODULE_MANAGER_ROLE =
        keccak256("MODULE_MANAGER_ROLE");
    bytes32 public constant STAKING_ROUTER_ROLE =
        keccak256("STAKING_ROUTER_ROLE");
    bytes32 public constant REPORT_EL_REWARDS_STEALING_PENALTY_ROLE =
        keccak256("REPORT_EL_REWARDS_STEALING_PENALTY_ROLE");
    bytes32 public constant SETTLE_EL_REWARDS_STEALING_PENALTY_ROLE =
        keccak256("SETTLE_EL_REWARDS_STEALING_PENALTY_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant RECOVERER_ROLE = keccak256("RECOVERER_ROLE");

    uint256 private constant DEPOSIT_SIZE = 32 ether;
    // @dev see IStakingModule.sol
    uint8 private constant FORCED_TARGET_LIMIT_MODE_ID = 2;

    uint256 public immutable INITIAL_SLASHING_PENALTY;
    uint256 public immutable EL_REWARDS_STEALING_FINE;
    uint256
        public immutable MAX_SIGNING_KEYS_PER_OPERATOR_BEFORE_PUBLIC_RELEASE;
    uint256 public immutable MAX_KEY_REMOVAL_CHARGE;
    bytes32 private immutable MODULE_TYPE;
    ILidoLocator public immutable LIDO_LOCATOR;
    IStETH public immutable STETH;

    ////////////////////////
    // State variables below
    ////////////////////////
    uint256 public keyRemovalCharge;

    QueueLib.Queue public depositQueue;

    ICSAccounting public accounting;

    ICSEarlyAdoption public earlyAdoption;
    bool public publicRelease;

    uint256 private _nonce;
    mapping(uint256 => NodeOperator) private _nodeOperators;
    // @dev see _keyPointer function for details of noKeyIndexPacked structure
    mapping(uint256 noKeyIndexPacked => bool) private _isValidatorWithdrawn;
    mapping(uint256 noKeyIndexPacked => bool) private _isValidatorSlashed;

    uint64 private _totalDepositedValidators;
    uint64 private _totalExitedValidators;
    uint64 private _depositableValidatorsCount;
    uint64 private _nodeOperatorsCount;

    event NodeOperatorAdded(
        uint256 indexed nodeOperatorId,
        address indexed managerAddress,
        address indexed rewardAddress
    );
    event ReferrerSet(uint256 indexed nodeOperatorId, address indexed referrer);
    event DepositableSigningKeysCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 depositableKeysCount
    );
    event VettedSigningKeysCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 vettedKeysCount
    );
    event VettedSigningKeysCountDecreased(uint256 indexed nodeOperatorId);
    event DepositedSigningKeysCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 depositedKeysCount
    );
    event ExitedSigningKeysCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 exitedKeysCount
    );
    event StuckSigningKeysCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 stuckKeysCount
    );
    event TotalSigningKeysCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 totalKeysCount
    );
    event TargetValidatorsCountChanged(
        uint256 indexed nodeOperatorId,
        uint256 targetLimitMode,
        uint256 targetValidatorsCount
    );
    event WithdrawalSubmitted(
        uint256 indexed nodeOperatorId,
        uint256 keyIndex,
        uint256 amount,
        bytes pubkey
    );
    event InitialSlashingSubmitted(
        uint256 indexed nodeOperatorId,
        uint256 keyIndex,
        bytes pubkey
    );

    event PublicRelease();
    event KeyRemovalChargeSet(uint256 amount);

    event KeyRemovalChargeApplied(uint256 indexed nodeOperatorId);
    event ELRewardsStealingPenaltyReported(
        uint256 indexed nodeOperatorId,
        bytes32 proposedBlockHash,
        uint256 stolenAmount
    );
    event ELRewardsStealingPenaltyCancelled(
        uint256 indexed nodeOperatorId,
        uint256 amount
    );
    event ELRewardsStealingPenaltyCompensated(
        uint256 indexed nodeOperatorId,
        uint256 amount
    );
    event ELRewardsStealingPenaltySettled(uint256 indexed nodeOperatorId);

    error SenderIsNotEligible();
    error InvalidVetKeysPointer();
    error StuckKeysHigherThanNonExited();
    error ExitedKeysHigherThanTotalDeposited();
    error ExitedKeysDecrease();

    error InvalidInput();
    error NotEnoughKeys();

    error SigningKeysInvalidOffset();

    error AlreadySubmitted();

    error AlreadyActivated();
    error InvalidAmount();
    error NotAllowedToJoinYet();
    error MaxSigningKeysCountExceeded();

    error NotSupported();
    error ZeroLocatorAddress();
    error ZeroAccountingAddress();
    error ZeroAdminAddress();

    constructor(
        bytes32 moduleType,
        uint256 minSlashingPenaltyQuotient,
        uint256 elRewardsStealingFine,
        uint256 maxKeysPerOperatorEA,
        uint256 maxKeyRemovalCharge,
        address lidoLocator
    ) {
        if (lidoLocator == address(0)) revert ZeroLocatorAddress();

        MODULE_TYPE = moduleType;
        INITIAL_SLASHING_PENALTY = DEPOSIT_SIZE / minSlashingPenaltyQuotient;
        EL_REWARDS_STEALING_FINE = elRewardsStealingFine;
        MAX_SIGNING_KEYS_PER_OPERATOR_BEFORE_PUBLIC_RELEASE = maxKeysPerOperatorEA;
        MAX_KEY_REMOVAL_CHARGE = maxKeyRemovalCharge;
        LIDO_LOCATOR = ILidoLocator(lidoLocator);
        STETH = IStETH(LIDO_LOCATOR.lido());

        _disableInitializers();
    }

    function initialize(
        address _accounting,
        address _earlyAdoption,
        uint256 _keyRemovalCharge,
        address admin
    ) external initializer {
        if (_accounting == address(0)) revert ZeroAccountingAddress();
        if (admin == address(0)) revert ZeroAdminAddress();

        __AccessControlEnumerable_init();

        accounting = ICSAccounting(_accounting);
        // it is possible to deploy module without EA contract
        earlyAdoption = ICSEarlyAdoption(_earlyAdoption);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(STAKING_ROUTER_ROLE, address(LIDO_LOCATOR.stakingRouter()));

        _setKeyRemovalCharge(_keyRemovalCharge);
        // CSM is on pause initially and should be resumed during the vote
        _pauseFor(PausableUntil.PAUSE_INFINITELY);
    }

    /// @notice Resume creation of the Node Operators and keys upload
    function resume() external onlyRole(RESUME_ROLE) {
        _resume();
    }

    /// @notice Pause creation of the Node Operators and keys upload for `duration` seconds.
    ///         Existing NO management and reward claims are still available.
    ///         To pause reward claims use pause method on CSAccounting
    /// @param duration Duration of the pause in seconds
    function pauseFor(uint256 duration) external onlyRole(PAUSE_ROLE) {
        _pauseFor(duration);
    }

    /// @notice Activate public release mode
    ///         Enable permissionless creation of the Node Operators
    ///         Remove the keys limit for the Node Operators
    function activatePublicRelease() external onlyRole(MODULE_MANAGER_ROLE) {
        if (publicRelease) revert AlreadyActivated();
        publicRelease = true;
        emit PublicRelease();
    }

    /// @notice Set the key removal charge amount.
    ///         A charge is taken from the bond for each removed key
    /// @param amount Amount of stETH in wei to be charged for removing a single key
    function setKeyRemovalCharge(
        uint256 amount
    ) external onlyRole(MODULE_MANAGER_ROLE) {
        _setKeyRemovalCharge(amount);
    }

    /// @notice Add a new Node Operator using ETH as a bond.
    ///         At least one deposit data and corresponding bond should be provided
    /// @param keysCount Signing keys count
    /// @param publicKeys Public keys to submit
    /// @param signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                   https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    /// @param managementProperties Optional. Management properties to be used for the Node Operator.
    ///                             managerAddress: Used as `managerAddress` for the Node Operator. If not passed `msg.sender` will be used.
    ///                             rewardAddress: Used as `rewardAddress` for the Node Operator. If not passed `msg.sender` will be used.
    ///                             extendedManagerPermissions: Flag indicating that managerAddress will be able to change rewardAddress.
    ///                                                         If set to true `resetNodeOperatorManagerAddress` method will be disabled
    /// @param eaProof Optional. Merkle proof of the sender being eligible for the Early Adoption
    /// @param referrer Optional. Referrer address. Should be passed when Node Operator is created using partners integration

    function addNodeOperatorETH(
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures,
        NodeOperatorManagementProperties calldata managementProperties,
        bytes32[] calldata eaProof,
        address referrer
    ) external payable whenResumed {
        (uint256 nodeOperatorId, uint256 curveId) = _createNodeOperator(
            managementProperties,
            referrer,
            eaProof
        );

        if (
            msg.value < accounting.getBondAmountByKeysCount(keysCount, curveId)
        ) {
            revert InvalidAmount();
        }

        accounting.depositETH{ value: msg.value }(msg.sender, nodeOperatorId);

        _addKeysAndUpdateDepositableValidatorsCount(
            nodeOperatorId,
            keysCount,
            publicKeys,
            signatures
        );
    }

    /// @notice Add a new Node Operator using stETH as a bond.
    ///         At least one deposit data and corresponding bond should be provided
    /// @notice Due to the stETH rounding issue make sure to make approval or sign permit with extra 10 wei to avoid revert
    /// @param keysCount Signing keys count
    /// @param publicKeys Public keys to submit
    /// @param signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                   https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    /// @param managementProperties Optional. Management properties to be used for the Node Operator.
    ///                             managerAddress: Used as `managerAddress` for the Node Operator. If not passed `msg.sender` will be used.
    ///                             rewardAddress: Used as `rewardAddress` for the Node Operator. If not passed `msg.sender` will be used.
    ///                             extendedManagerPermissions: Flag indicating that managerAddress will be able to change rewardAddress.
    ///                                                         If set to true `resetNodeOperatorManagerAddress` method will be disabled
    /// @param permit Optional. Permit to use stETH as bond
    /// @param eaProof Optional. Merkle proof of the sender being eligible for the Early Adoption
    /// @param referrer Optional. Referrer address. Should be passed when Node Operator is created using partners integration
    function addNodeOperatorStETH(
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures,
        NodeOperatorManagementProperties calldata managementProperties,
        ICSAccounting.PermitInput calldata permit,
        bytes32[] calldata eaProof,
        address referrer
    ) external whenResumed {
        (uint256 nodeOperatorId, uint256 curveId) = _createNodeOperator(
            managementProperties,
            referrer,
            eaProof
        );

        uint256 amount = accounting.getBondAmountByKeysCount(
            keysCount,
            curveId
        );
        accounting.depositStETH(msg.sender, nodeOperatorId, amount, permit);

        _addKeysAndUpdateDepositableValidatorsCount(
            nodeOperatorId,
            keysCount,
            publicKeys,
            signatures
        );
    }

    /// @notice Add a new Node Operator using wstETH as a bond.
    ///         At least one deposit data and corresponding bond should be provided
    /// @notice Due to the stETH rounding issue make sure to make approval or sign permit with extra 10 wei to avoid revert
    /// @param keysCount Signing keys count
    /// @param publicKeys Public keys to submit
    /// @param signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                   https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    /// @param managementProperties Optional. Management properties to be used for the Node Operator.
    ///                             managerAddress: Used as `managerAddress` for the Node Operator. If not passed `msg.sender` will be used.
    ///                             rewardAddress: Used as `rewardAddress` for the Node Operator. If not passed `msg.sender` will be used.
    ///                             extendedManagerPermissions: Flag indicating that managerAddress will be able to change rewardAddress.
    ///                                                         If set to true `resetNodeOperatorManagerAddress` method will be disabled
    /// @param permit Optional. Permit to use wstETH as bond
    /// @param eaProof Optional. Merkle proof of the sender being eligible for the Early Adoption
    /// @param referrer Optional. Referrer address. Should be passed when Node Operator is created using partners integration
    function addNodeOperatorWstETH(
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures,
        NodeOperatorManagementProperties calldata managementProperties,
        ICSAccounting.PermitInput calldata permit,
        bytes32[] calldata eaProof,
        address referrer
    ) external whenResumed {
        (uint256 nodeOperatorId, uint256 curveId) = _createNodeOperator(
            managementProperties,
            referrer,
            eaProof
        );

        uint256 amount = accounting.getBondAmountByKeysCountWstETH(
            keysCount,
            curveId
        );
        accounting.depositWstETH(msg.sender, nodeOperatorId, amount, permit);

        _addKeysAndUpdateDepositableValidatorsCount(
            nodeOperatorId,
            keysCount,
            publicKeys,
            signatures
        );
    }

    /// @notice Add new keys to the existing Node Operator using ETH as a bond
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keysCount Signing keys count
    /// @param publicKeys Public keys to submit
    /// @param signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                   https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    function addValidatorKeysETH(
        uint256 nodeOperatorId,
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures
    ) external payable whenResumed {
        _onlyNodeOperatorManager(nodeOperatorId);

        if (
            msg.value <
            accounting.getRequiredBondForNextKeys(nodeOperatorId, keysCount)
        ) {
            revert InvalidAmount();
        }

        accounting.depositETH{ value: msg.value }(msg.sender, nodeOperatorId);

        _addKeysAndUpdateDepositableValidatorsCount(
            nodeOperatorId,
            keysCount,
            publicKeys,
            signatures
        );
    }

    /// @notice Add new keys to the existing Node Operator using stETH as a bond
    /// @notice Due to the stETH rounding issue make sure to make approval or sign permit with extra 10 wei to avoid revert
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keysCount Signing keys count
    /// @param publicKeys Public keys to submit
    /// @param signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                   https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    /// @param permit Optional. Permit to use stETH as bond
    function addValidatorKeysStETH(
        uint256 nodeOperatorId,
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures,
        ICSAccounting.PermitInput calldata permit
    ) external whenResumed {
        _onlyNodeOperatorManager(nodeOperatorId);

        uint256 amount = accounting.getRequiredBondForNextKeys(
            nodeOperatorId,
            keysCount
        );

        accounting.depositStETH(msg.sender, nodeOperatorId, amount, permit);

        _addKeysAndUpdateDepositableValidatorsCount(
            nodeOperatorId,
            keysCount,
            publicKeys,
            signatures
        );
    }

    /// @notice Add new keys to the existing Node Operator using wstETH as a bond
    /// @notice Due to the stETH rounding issue make sure to make approval or sign permit with extra 10 wei to avoid revert
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keysCount Signing keys count
    /// @param publicKeys Public keys to submit
    /// @param signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                   https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    /// @param permit Optional. Permit to use wstETH as bond
    function addValidatorKeysWstETH(
        uint256 nodeOperatorId,
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures,
        ICSAccounting.PermitInput calldata permit
    ) external whenResumed {
        _onlyNodeOperatorManager(nodeOperatorId);

        uint256 amount = accounting.getRequiredBondForNextKeysWstETH(
            nodeOperatorId,
            keysCount
        );

        accounting.depositWstETH(msg.sender, nodeOperatorId, amount, permit);

        _addKeysAndUpdateDepositableValidatorsCount(
            nodeOperatorId,
            keysCount,
            publicKeys,
            signatures
        );
    }

    /// @notice Stake user's ETH with Lido and make a deposit in stETH to the bond of the existing Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    function depositETH(uint256 nodeOperatorId) external payable {
        _onlyExistingNodeOperator(nodeOperatorId);
        accounting.depositETH{ value: msg.value }(msg.sender, nodeOperatorId);

        // Due to new bond nonce update might be required and normalize queue might be required
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Deposit user's stETH to the bond of the existing Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param stETHAmount Amount of stETH to deposit
    /// @param permit Optional. Permit to use stETH as bond
    function depositStETH(
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        ICSAccounting.PermitInput calldata permit
    ) external {
        _onlyExistingNodeOperator(nodeOperatorId);
        accounting.depositStETH(
            msg.sender,
            nodeOperatorId,
            stETHAmount,
            permit
        );

        // Due to new bond nonce update might be required and normalize queue might be required
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Unwrap the user's wstETH and make a deposit in stETH to the bond of the existing Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param wstETHAmount Amount of wstETH to deposit
    /// @param permit Optional. Permit to use wstETH as bond
    function depositWstETH(
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        ICSAccounting.PermitInput calldata permit
    ) external {
        _onlyExistingNodeOperator(nodeOperatorId);
        accounting.depositWstETH(
            msg.sender,
            nodeOperatorId,
            wstETHAmount,
            permit
        );

        // Due to new bond nonce update might be required and normalize queue might be required
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Claim full reward (fees + bond rewards) in stETH for the given Node Operator
    /// @notice If `stETHAmount` exceeds the current claimable amount, the claimable amount will be used instead
    /// @notice If `rewardsProof` is not provided, only excess bond (bond rewards) will be available for claim
    /// @param nodeOperatorId ID of the Node Operator
    /// @param stETHAmount Amount of stETH to claim
    /// @param cumulativeFeeShares Optional. Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Optional. Merkle proof of the rewards
    function claimRewardsStETH(
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external {
        _onlyNodeOperatorManagerOrRewardAddresses(nodeOperatorId);

        accounting.claimRewardsStETH({
            nodeOperatorId: nodeOperatorId,
            stETHAmount: stETHAmount,
            rewardAddress: _nodeOperators[nodeOperatorId].rewardAddress,
            cumulativeFeeShares: cumulativeFeeShares,
            rewardsProof: rewardsProof
        });

        // Due to possible missing bond compensation nonce update might be required and normalize queue might be required
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Claim full reward (fees + bond rewards) in wstETH for the given Node Operator
    /// @notice If `wstETHAmount` exceeds the current claimable amount, the claimable amount will be used instead
    /// @notice If `rewardsProof` is not provided, only excess bond (bond rewards) will be available for claim
    /// @param nodeOperatorId ID of the Node Operator
    /// @param wstETHAmount Amount of wstETH to claim
    /// @param cumulativeFeeShares Optional. Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Optional. Merkle proof of the rewards
    function claimRewardsWstETH(
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external {
        _onlyNodeOperatorManagerOrRewardAddresses(nodeOperatorId);

        accounting.claimRewardsWstETH({
            nodeOperatorId: nodeOperatorId,
            wstETHAmount: wstETHAmount,
            rewardAddress: _nodeOperators[nodeOperatorId].rewardAddress,
            cumulativeFeeShares: cumulativeFeeShares,
            rewardsProof: rewardsProof
        });

        // Due to possible missing bond compensation nonce update might be required and normalize queue might be required
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Request full reward (fees + bond rewards) in Withdrawal NFT (unstETH) for the given Node Operator
    /// @notice Amounts less than `MIN_STETH_WITHDRAWAL_AMOUNT` (see LidoWithdrawalQueue contract) are not allowed
    /// @notice Amounts above `MAX_STETH_WITHDRAWAL_AMOUNT` should be requested in several transactions
    /// @notice If `ethAmount` exceeds the current claimable amount, the claimable amount will be used instead
    /// @notice If `rewardsProof` is not provided, only excess bond (bond rewards) will be available for claim
    /// @dev Reverts if amount isn't between `MIN_STETH_WITHDRAWAL_AMOUNT` and `MAX_STETH_WITHDRAWAL_AMOUNT`
    /// @param nodeOperatorId ID of the Node Operator
    /// @param stEthAmount Amount of ETH to request
    /// @param cumulativeFeeShares Optional. Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Optional. Merkle proof of the rewards
    function claimRewardsUnstETH(
        uint256 nodeOperatorId,
        uint256 stEthAmount,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external {
        _onlyNodeOperatorManagerOrRewardAddresses(nodeOperatorId);

        accounting.claimRewardsUnstETH({
            nodeOperatorId: nodeOperatorId,
            stEthAmount: stEthAmount,
            rewardAddress: _nodeOperators[nodeOperatorId].rewardAddress,
            cumulativeFeeShares: cumulativeFeeShares,
            rewardsProof: rewardsProof
        });

        // Due to possible missing bond compensation nonce update might be required and normalize queue might be required
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Propose a new manager address for the Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param proposedAddress Proposed manager address
    function proposeNodeOperatorManagerAddressChange(
        uint256 nodeOperatorId,
        address proposedAddress
    ) external {
        NOAddresses.proposeNodeOperatorManagerAddressChange(
            _nodeOperators,
            nodeOperatorId,
            proposedAddress
        );
    }

    /// @notice Confirm a new manager address for the Node Operator.
    ///         Should be called from the currently proposed address
    /// @param nodeOperatorId ID of the Node Operator
    function confirmNodeOperatorManagerAddressChange(
        uint256 nodeOperatorId
    ) external {
        NOAddresses.confirmNodeOperatorManagerAddressChange(
            _nodeOperators,
            nodeOperatorId
        );
    }

    /// @notice Propose a new reward address for the Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param proposedAddress Proposed reward address
    function proposeNodeOperatorRewardAddressChange(
        uint256 nodeOperatorId,
        address proposedAddress
    ) external {
        NOAddresses.proposeNodeOperatorRewardAddressChange(
            _nodeOperators,
            nodeOperatorId,
            proposedAddress
        );
    }

    /// @notice Confirm a new reward address for the Node Operator.
    ///         Should be called from the currently proposed address
    /// @param nodeOperatorId ID of the Node Operator
    function confirmNodeOperatorRewardAddressChange(
        uint256 nodeOperatorId
    ) external {
        NOAddresses.confirmNodeOperatorRewardAddressChange(
            _nodeOperators,
            nodeOperatorId
        );
    }

    /// @notice Reset the manager address to the reward address.
    ///         Should be called from the reward address
    /// @param nodeOperatorId ID of the Node Operator
    function resetNodeOperatorManagerAddress(uint256 nodeOperatorId) external {
        NOAddresses.resetNodeOperatorManagerAddress(
            _nodeOperators,
            nodeOperatorId
        );
    }

    /// @notice Change rewardAddress if extendedManagerPermissions is enabled for the Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @param newAddress Proposed reward address
    function changeNodeOperatorRewardAddress(
        uint256 nodeOperatorId,
        address newAddress
    ) external {
        if (newAddress == address(0)) {
            revert ZeroRewardAddress();
        }

        NOAddresses.changeNodeOperatorRewardAddress(
            _nodeOperators,
            nodeOperatorId,
            newAddress
        );
    }

    /// @notice Called when rewards are minted for the module
    /// @dev Called by StakingRouter
    /// @dev Passes through the minted stETH shares to the fee distributor
    function onRewardsMinted(
        uint256 totalShares
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        STETH.transferShares(address(accounting.feeDistributor()), totalShares);
    }

    /// @notice Update stuck validators count for Node Operators
    /// @dev Called by StakingRouter
    /// @dev If the stuck keys count is above zero for the Node Operator,
    ///      the depositable validators count is set to 0 for this Node Operator
    /// @param nodeOperatorIds bytes packed array of Node Operator IDs
    /// @param stuckValidatorsCounts bytes packed array of stuck validators counts
    function updateStuckValidatorsCount(
        bytes calldata nodeOperatorIds,
        bytes calldata stuckValidatorsCounts
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        uint256 operatorsInReport = ValidatorCountsReport.safeCountOperators(
            nodeOperatorIds,
            stuckValidatorsCounts
        );

        for (uint256 i = 0; i < operatorsInReport; ++i) {
            (
                uint256 nodeOperatorId,
                uint256 stuckValidatorsCount
            ) = ValidatorCountsReport.next(
                    nodeOperatorIds,
                    stuckValidatorsCounts,
                    i
                );
            _updateStuckValidatorsCount(nodeOperatorId, stuckValidatorsCount);
        }
        _incrementModuleNonce();
    }

    /// @notice Update exited validators count for Node Operators
    /// @dev Called by StakingRouter
    /// @param nodeOperatorIds bytes packed array of Node Operator IDs
    /// @param exitedValidatorsCounts bytes packed array of exited validators counts
    function updateExitedValidatorsCount(
        bytes calldata nodeOperatorIds,
        bytes calldata exitedValidatorsCounts
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        uint256 operatorsInReport = ValidatorCountsReport.safeCountOperators(
            nodeOperatorIds,
            exitedValidatorsCounts
        );

        for (uint256 i = 0; i < operatorsInReport; ++i) {
            (
                uint256 nodeOperatorId,
                uint256 exitedValidatorsCount
            ) = ValidatorCountsReport.next(
                    nodeOperatorIds,
                    exitedValidatorsCounts,
                    i
                );
            _updateExitedValidatorsCount({
                nodeOperatorId: nodeOperatorId,
                exitedValidatorsCount: exitedValidatorsCount,
                allowDecrease: false
            });
        }
        _incrementModuleNonce();
    }

    /// @notice Update refunded validators count for the Node Operator.
    ///         Non supported in CSM
    /// @dev Called by StakingRouter
    /// @dev Always reverts
    /// @dev `refundedValidatorsCount` is not used in the module
    function updateRefundedValidatorsCount(
        uint256 /* nodeOperatorId */,
        uint256 /* refundedValidatorsCount */
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        revert NotSupported();
    }

    /// @notice Update target validators limits for Node Operator
    /// @dev Called by StakingRouter
    /// @param nodeOperatorId ID of the Node Operator
    /// @param targetLimitMode Target limit mode for the Node Operator (see https://hackmd.io/@lido/BJXRTxMRp)
    ///                        0 - disabled
    ///                        1 - soft mode
    ///                        2 - forced mode
    /// @param targetLimit Target limit of validators
    function updateTargetValidatorsLimits(
        uint256 nodeOperatorId,
        uint256 targetLimitMode,
        uint256 targetLimit
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        if (targetLimitMode > FORCED_TARGET_LIMIT_MODE_ID) {
            revert InvalidInput();
        }
        if (targetLimit > type(uint32).max) {
            revert InvalidInput();
        }
        _onlyExistingNodeOperator(nodeOperatorId);
        NodeOperator storage no = _nodeOperators[nodeOperatorId];

        if (targetLimitMode == 0) {
            targetLimit = 0;
        }

        if (
            no.targetLimitMode == targetLimitMode &&
            no.targetLimit == targetLimit
        ) return;

        if (no.targetLimitMode != targetLimitMode) {
            // @dev No need to safe cast due to conditions above
            no.targetLimitMode = uint8(targetLimitMode);
        }

        if (no.targetLimit != targetLimit) {
            // @dev No need to safe cast due to conditions above
            no.targetLimit = uint32(targetLimit);
        }

        emit TargetValidatorsCountChanged(
            nodeOperatorId,
            targetLimitMode,
            targetLimit
        );

        // Nonce will be updated below even if depositable count was not changed
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: false
        });
        _incrementModuleNonce();
    }

    /// @notice Called when exited and stuck validators counts updated.
    ///         This method is not used in CSM, hence it is empty
    /// @dev Called by StakingRouter
    // @dev for some reason foundry coverage consider this function as not fully covered. Check tests to see it is covered indeed
    function onExitedAndStuckValidatorsCountsUpdated()
        external
        onlyRole(STAKING_ROUTER_ROLE)
    {
        // solhint-disable-previous-line no-empty-blocks
        // Nothing to do, rewards are distributed by a performance oracle.
    }

    /// @notice Unsafe update of validators count for Node Operator by the DAO
    /// @dev Called by StakingRouter
    /// @param nodeOperatorId ID of the Node Operator
    /// @param exitedValidatorsKeysCount Exited validators counts
    /// @param stuckValidatorsKeysCount Stuck validators counts
    function unsafeUpdateValidatorsCount(
        uint256 nodeOperatorId,
        uint256 exitedValidatorsKeysCount,
        uint256 stuckValidatorsKeysCount
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        _updateExitedValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            exitedValidatorsCount: exitedValidatorsKeysCount,
            allowDecrease: true
        });
        _updateStuckValidatorsCount(nodeOperatorId, stuckValidatorsKeysCount);
        _incrementModuleNonce();
    }

    /// @notice Called to decrease the number of vetted keys for Node Operators with given ids
    /// @dev Called by StakingRouter
    /// @param nodeOperatorIds Bytes packed array of the Node Operator ids
    /// @param vettedSigningKeysCounts Bytes packed array of the new numbers of vetted keys for the Node Operators
    function decreaseVettedSigningKeysCount(
        bytes calldata nodeOperatorIds,
        bytes calldata vettedSigningKeysCounts
    ) external onlyRole(STAKING_ROUTER_ROLE) {
        uint256 operatorsInReport = ValidatorCountsReport.safeCountOperators(
            nodeOperatorIds,
            vettedSigningKeysCounts
        );

        for (uint256 i = 0; i < operatorsInReport; ++i) {
            (
                uint256 nodeOperatorId,
                uint256 vettedSigningKeysCount
            ) = ValidatorCountsReport.next(
                    nodeOperatorIds,
                    vettedSigningKeysCounts,
                    i
                );

            _onlyExistingNodeOperator(nodeOperatorId);

            NodeOperator storage no = _nodeOperators[nodeOperatorId];

            if (vettedSigningKeysCount >= no.totalVettedKeys) {
                revert InvalidVetKeysPointer();
            }

            if (vettedSigningKeysCount < no.totalDepositedKeys) {
                revert InvalidVetKeysPointer();
            }

            // @dev No need to safe cast due to conditions above
            no.totalVettedKeys = uint32(vettedSigningKeysCount);
            emit VettedSigningKeysCountChanged(
                nodeOperatorId,
                vettedSigningKeysCount
            );

            // @dev separate event for intentional decrease from Staking Router
            emit VettedSigningKeysCountDecreased(nodeOperatorId);

            // Nonce will be updated below once
            _updateDepositableValidatorsCount({
                nodeOperatorId: nodeOperatorId,
                incrementNonceIfUpdated: false
            });
        }

        _incrementModuleNonce();
    }

    /// @notice Remove keys for the Node Operator and confiscate removal charge for each deleted key
    /// @param nodeOperatorId ID of the Node Operator
    /// @param startIndex Index of the first key
    /// @param keysCount Keys count to delete
    function removeKeys(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) external {
        _onlyNodeOperatorManager(nodeOperatorId);
        NodeOperator storage no = _nodeOperators[nodeOperatorId];

        if (startIndex < no.totalDepositedKeys) {
            revert SigningKeysInvalidOffset();
        }

        // solhint-disable-next-line func-named-parameters
        uint256 newTotalSigningKeys = SigningKeys.removeKeysSigs(
            nodeOperatorId,
            startIndex,
            keysCount,
            no.totalAddedKeys
        );

        // The Node Operator is charged for the every removed key. It's motivated by the fact that the DAO should cleanup
        // the queue from the empty batches related to the Node Operator. It's possible to have multiple batches with only one
        // key in it, so it means the DAO should be able to cover removal costs for as much batches as keys removed in this case.
        uint256 amountToCharge = keyRemovalCharge * keysCount;
        if (amountToCharge != 0) {
            accounting.chargeFee(nodeOperatorId, amountToCharge);
            emit KeyRemovalChargeApplied(nodeOperatorId);
        }

        // @dev No need to safe cast due to checks in the func above
        no.totalAddedKeys = uint32(newTotalSigningKeys);
        emit TotalSigningKeysCountChanged(nodeOperatorId, newTotalSigningKeys);

        // @dev No need to safe cast due to checks in the func above
        no.totalVettedKeys = uint32(newTotalSigningKeys);
        emit VettedSigningKeysCountChanged(nodeOperatorId, newTotalSigningKeys);

        // Nonce is updated below due to keys state change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: false
        });
        _incrementModuleNonce();
    }

    // @notice CSM will go live before EIP-7002
    // @notice to be implemented in CSM v2
    // /// @notice Node Operator should be able to voluntary eject own validators
    // /// @notice Validator private key might be lost
    // function voluntaryEjectValidator(
    //     uint256 nodeOperatorId,
    //     uint256 startIndex,
    //     uint256 keysCount
    // ) external onlyExistingNodeOperator(nodeOperatorId) {
    //     onlyNodeOperatorManager(nodeOperatorId);
    //     // Mark validators for priority ejection
    //     // Confiscate ejection fee from the bond
    // }

    /// @notice Perform queue normalization for the given Node Operator
    /// @notice Normalization stands for adding vetted but not enqueued keys to the queue
    /// @param nodeOperatorId ID of the Node Operator
    function normalizeQueue(uint256 nodeOperatorId) external {
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
        // Direct call of `normalize` if depositable is not changed
        depositQueue.normalize(_nodeOperators, nodeOperatorId);
    }

    /// @notice Report EL rewards stealing for the given Node Operator
    /// @notice The amount equal to the stolen funds plus EL stealing fine will be locked
    /// @param nodeOperatorId ID of the Node Operator
    /// @param blockHash Execution layer block hash of the proposed block with EL rewards stealing
    /// @param amount Amount of stolen EL rewards in ETH
    function reportELRewardsStealingPenalty(
        uint256 nodeOperatorId,
        bytes32 blockHash,
        uint256 amount
    ) external onlyRole(REPORT_EL_REWARDS_STEALING_PENALTY_ROLE) {
        _onlyExistingNodeOperator(nodeOperatorId);
        if (amount == 0) revert InvalidAmount();
        accounting.lockBondETH(
            nodeOperatorId,
            amount + EL_REWARDS_STEALING_FINE
        );
        emit ELRewardsStealingPenaltyReported(
            nodeOperatorId,
            blockHash,
            amount
        );

        // Nonce should be updated if depositableValidators change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Cancel previously reported and not settled EL rewards stealing penalty for the given Node Operator
    /// @notice The funds will be unlocked
    /// @param nodeOperatorId ID of the Node Operator
    /// @param amount Amount of penalty to cancel
    function cancelELRewardsStealingPenalty(
        uint256 nodeOperatorId,
        uint256 amount
    ) external onlyRole(REPORT_EL_REWARDS_STEALING_PENALTY_ROLE) {
        _onlyExistingNodeOperator(nodeOperatorId);
        accounting.releaseLockedBondETH(nodeOperatorId, amount);

        emit ELRewardsStealingPenaltyCancelled(nodeOperatorId, amount);

        // Nonce should be updated if depositableValidators change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Settle locked bond for the given Node Operators
    /// @dev SETTLE_EL_REWARDS_STEALING_PENALTY_ROLE role is expected to be assigned to Easy Track
    /// @param nodeOperatorIds IDs of the Node Operators
    function settleELRewardsStealingPenalty(
        uint256[] calldata nodeOperatorIds
    ) external onlyRole(SETTLE_EL_REWARDS_STEALING_PENALTY_ROLE) {
        ICSAccounting _accounting = accounting;
        for (uint256 i; i < nodeOperatorIds.length; ++i) {
            uint256 nodeOperatorId = nodeOperatorIds[i];
            _onlyExistingNodeOperator(nodeOperatorId);
            uint256 lockedBondBefore = _accounting.getActualLockedBond(
                nodeOperatorId
            );

            _accounting.settleLockedBondETH(nodeOperatorId);

            // settled amount might be zero either if the lock expired, or the bond is zero
            // so we need to check actual locked bond before to determine if the penalty was settled
            if (lockedBondBefore > 0) {
                // Bond curve should be reset to default in case of confirmed MEV stealing. See https://hackmd.io/@lido/SygBLW5ja
                _accounting.resetBondCurve(nodeOperatorId);
                // Nonce should be updated if depositableValidators change
                _updateDepositableValidatorsCount({
                    nodeOperatorId: nodeOperatorId,
                    incrementNonceIfUpdated: true
                });
                emit ELRewardsStealingPenaltySettled(nodeOperatorId);
            }
        }
    }

    /// @notice Compensate EL rewards stealing penalty for the given Node Operator to prevent further validator exits
    /// @dev Can only be called by the Node Operator manager
    /// @param nodeOperatorId ID of the Node Operator
    function compensateELRewardsStealingPenalty(
        uint256 nodeOperatorId
    ) external payable {
        _onlyNodeOperatorManager(nodeOperatorId);
        accounting.compensateLockedBondETH{ value: msg.value }(nodeOperatorId);
        // Nonce should be updated if depositableValidators change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
        emit ELRewardsStealingPenaltyCompensated(nodeOperatorId, msg.value);
    }

    /// @notice Report Node Operator's key as withdrawn and settle withdrawn amount
    /// @notice Called by the Verifier contract.
    ///         See `CSVerifier.processWithdrawalProof` to use this method permissionless
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keyIndex Index of the withdrawn key in the Node Operator's keys storage
    /// @param amount Amount of withdrawn ETH in wei
    /// @param isSlashed Validator is slashed or not
    function submitWithdrawal(
        uint256 nodeOperatorId,
        uint256 keyIndex,
        uint256 amount,
        bool isSlashed
    ) external onlyRole(VERIFIER_ROLE) {
        _onlyExistingNodeOperator(nodeOperatorId);
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        if (keyIndex >= no.totalDepositedKeys) {
            revert SigningKeysInvalidOffset();
        }

        uint256 pointer = _keyPointer(nodeOperatorId, keyIndex);
        if (_isValidatorWithdrawn[pointer]) {
            revert AlreadySubmitted();
        }

        _isValidatorWithdrawn[pointer] = true;
        unchecked {
            ++no.totalWithdrawnKeys;
        }

        bytes memory pubkey = SigningKeys.loadKeys(nodeOperatorId, keyIndex, 1);
        emit WithdrawalSubmitted(nodeOperatorId, keyIndex, amount, pubkey);

        if (isSlashed) {
            if (_isValidatorSlashed[pointer]) {
                // Account already burned value
                unchecked {
                    amount += INITIAL_SLASHING_PENALTY;
                }
            } else {
                _isValidatorSlashed[pointer] = true;
            }
            // Bond curve should be reset to default in case of slashing. See https://hackmd.io/@lido/SygBLW5ja
            accounting.resetBondCurve(nodeOperatorId);
        }

        if (DEPOSIT_SIZE > amount) {
            unchecked {
                accounting.penalize(nodeOperatorId, DEPOSIT_SIZE - amount);
            }
        }

        // Nonce should be updated if depositableValidators change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Report Node Operator's key as slashed and apply the initial slashing penalty
    /// @notice Called by the Verifier contract.
    ///         See `CSVerifier.processSlashingProof` to use this method permissionless
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keyIndex Index of the slashed key in the Node Operator's keys storage
    function submitInitialSlashing(
        uint256 nodeOperatorId,
        uint256 keyIndex
    ) external onlyRole(VERIFIER_ROLE) {
        _onlyExistingNodeOperator(nodeOperatorId);
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        if (keyIndex >= no.totalDepositedKeys) {
            revert SigningKeysInvalidOffset();
        }

        uint256 pointer = _keyPointer(nodeOperatorId, keyIndex);

        if (_isValidatorSlashed[pointer]) {
            revert AlreadySubmitted();
        }

        _isValidatorSlashed[pointer] = true;

        bytes memory pubkey = SigningKeys.loadKeys(nodeOperatorId, keyIndex, 1);
        emit InitialSlashingSubmitted(nodeOperatorId, keyIndex, pubkey);

        accounting.penalize(nodeOperatorId, INITIAL_SLASHING_PENALTY);

        // Nonce should be updated if depositableValidators change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: true
        });
    }

    /// @notice Called by the Staking Router when withdrawal credentials changed by DAO
    /// @dev Called by StakingRouter
    /// @dev Resets the key removal charge
    /// @dev Changing the WC means that the current deposit data in the queue is not valid anymore and can't be deposited
    ///      So, the key removal charge should be reset to 0 to allow Node Operators to remove the keys without any charge.
    ///      After keys removal the DAO should set the new key removal charge.
    function onWithdrawalCredentialsChanged()
        external
        onlyRole(STAKING_ROUTER_ROLE)
    {
        _setKeyRemovalCharge(0);
    }

    /// @notice Get the next `depositsCount` of depositable keys with signatures from the queue
    /// @dev Called by StakingRouter
    /// @dev Second param `depositCalldata` is not used
    /// @param depositsCount Count of deposits to get
    /// @param /* depositCalldata */ (unused) Deposit calldata
    /// @return publicKeys Public keys
    /// @return signatures Signatures
    function obtainDepositData(
        uint256 depositsCount,
        bytes calldata /* depositCalldata */
    )
        external
        onlyRole(STAKING_ROUTER_ROLE)
        returns (bytes memory publicKeys, bytes memory signatures)
    {
        (publicKeys, signatures) = SigningKeys.initKeysSigsBuf(depositsCount);
        if (depositsCount == 0) return (publicKeys, signatures);

        uint256 depositsLeft = depositsCount;
        uint256 loadedKeysCount = 0;

        for (
            Batch item = depositQueue.peek();
            !item.isNil();
            item = depositQueue.peek()
        ) {
            // NOTE: see the `enqueuedCount` note below.
            unchecked {
                uint256 noId = item.noId();
                uint256 keysInBatch = item.keys();
                NodeOperator storage no = _nodeOperators[noId];

                uint256 keysCount = Math.min(
                    Math.min(no.depositableValidatorsCount, keysInBatch),
                    depositsLeft
                );
                // `depositsLeft` is non-zero at this point all the time, so the check `depositsLeft > keysCount`
                // covers the case when no depositable keys on the Node Operator have been left.
                if (depositsLeft > keysCount || keysCount == keysInBatch) {
                    // NOTE: `enqueuedCount` >= keysInBatch invariant should be checked.
                    // @dev No need to safe cast due to internal logic
                    no.enqueuedCount -= uint32(keysInBatch);
                    // We've consumed all the keys in the batch, so we dequeue it.
                    depositQueue.dequeue();
                } else {
                    // This branch covers the case when we stop in the middle of the batch.
                    // We release the amount of keys consumed only, the rest will be kept.
                    // @dev No need to safe cast due to internal logic
                    no.enqueuedCount -= uint32(keysCount);
                    // NOTE: `keysInBatch` can't be less than `keysCount` at this point.
                    // We update the batch with the remaining keys.
                    item = item.setKeys(keysInBatch - keysCount);
                    // Store the updated batch back to the queue.
                    depositQueue.queue[depositQueue.head] = item;
                }

                if (keysCount == 0) {
                    continue;
                }

                // solhint-disable-next-line func-named-parameters
                SigningKeys.loadKeysSigs(
                    noId,
                    no.totalDepositedKeys,
                    keysCount,
                    publicKeys,
                    signatures,
                    loadedKeysCount
                );

                // It's impossible in practice to reach the limit of these variables.
                loadedKeysCount += keysCount;
                // @dev No need to safe cast due to internal logic
                no.totalDepositedKeys += uint32(keysCount);

                emit DepositedSigningKeysCountChanged(
                    noId,
                    no.totalDepositedKeys
                );

                // No need for `_updateDepositableValidatorsCount` call since we update the number directly.
                // `keysCount` is min of `depositableValidatorsCount` and `depositsLeft`.
                // @dev No need to safe cast due to internal logic
                uint32 newCount = no.depositableValidatorsCount -
                    uint32(keysCount);
                no.depositableValidatorsCount = newCount;
                emit DepositableSigningKeysCountChanged(noId, newCount);
                depositsLeft -= keysCount;
                if (depositsLeft == 0) {
                    break;
                }
            }
        }
        if (loadedKeysCount != depositsCount) {
            revert NotEnoughKeys();
        }

        unchecked {
            // @dev depositsCount can not overflow in practice due to memory and gas limits
            _depositableValidatorsCount -= uint64(depositsCount);
            _totalDepositedValidators += uint64(depositsCount);
        }

        _incrementModuleNonce();
    }

    /// @notice Clean the deposit queue from batches with no depositable keys
    /// @dev Use **eth_call** to check how many items will be removed
    /// @param maxItems How many queue items to review
    /// @return removed Count of batches to be removed by visiting `maxItems` batches
    /// @return lastRemovedAtDepth The value to use as `maxItems` to remove `removed` batches if the static call of the method was used
    function cleanDepositQueue(
        uint256 maxItems
    ) external returns (uint256 removed, uint256 lastRemovedAtDepth) {
        (removed, lastRemovedAtDepth) = depositQueue.clean(
            _nodeOperators,
            maxItems
        );
    }

    /// @notice Get the deposit queue item by an index
    /// @param index Index of a queue item
    /// @return Deposit queue item
    function depositQueueItem(uint128 index) external view returns (Batch) {
        return depositQueue.at(index);
    }

    /// @notice Check if the given Node Operator's key is reported as slashed
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keyIndex Index of the key to check
    /// @return Validator reported as slashed flag
    function isValidatorSlashed(
        uint256 nodeOperatorId,
        uint256 keyIndex
    ) external view returns (bool) {
        return _isValidatorSlashed[_keyPointer(nodeOperatorId, keyIndex)];
    }

    /// @notice Check if the given Node Operator's key is reported as withdrawn
    /// @param nodeOperatorId ID of the Node Operator
    /// @param keyIndex index of the key to check
    /// @return Validator reported as withdrawn flag
    function isValidatorWithdrawn(
        uint256 nodeOperatorId,
        uint256 keyIndex
    ) external view returns (bool) {
        return _isValidatorWithdrawn[_keyPointer(nodeOperatorId, keyIndex)];
    }

    /// @notice Get the module type
    /// @return Module type
    function getType() external view returns (bytes32) {
        return MODULE_TYPE;
    }

    /// @notice Get staking module summary
    function getStakingModuleSummary()
        external
        view
        returns (
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            uint256 depositableValidatorsCount
        )
    {
        totalExitedValidators = _totalExitedValidators;
        totalDepositedValidators = _totalDepositedValidators;
        depositableValidatorsCount = _depositableValidatorsCount;
    }

    /// @notice Get Node Operator info
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Node Operator info
    function getNodeOperator(
        uint256 nodeOperatorId
    ) external view returns (NodeOperator memory) {
        return _nodeOperators[nodeOperatorId];
    }

    /// @notice Get Node Operator non-withdrawn keys
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Non-withdrawn keys count
    function getNodeOperatorNonWithdrawnKeys(
        uint256 nodeOperatorId
    ) external view returns (uint256) {
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        unchecked {
            return no.totalAddedKeys - no.totalWithdrawnKeys;
        }
    }

    /// @notice Get Node Operator summary
    /// @notice depositableValidatorsCount depends on:
    ///      - totalVettedKeys
    ///      - totalDepositedKeys
    ///      - totalExitedKeys
    ///      - targetLimitMode
    ///      - targetValidatorsCount
    ///      - totalUnbondedKeys
    ///      - totalStuckKeys
    /// @param nodeOperatorId ID of the Node Operator
    /// @return targetLimitMode Target limit mode
    /// @return targetValidatorsCount Target validators count
    /// @return stuckValidatorsCount Stuck validators count
    /// @return refundedValidatorsCount Refunded validators count
    /// @return stuckPenaltyEndTimestamp Stuck penalty end timestamp (unused)
    /// @return totalExitedValidators Total exited validators
    /// @return totalDepositedValidators Total deposited validators
    /// @return depositableValidatorsCount Depositable validators count
    function getNodeOperatorSummary(
        uint256 nodeOperatorId
    )
        external
        view
        returns (
            uint256 targetLimitMode,
            uint256 targetValidatorsCount,
            uint256 stuckValidatorsCount,
            uint256 refundedValidatorsCount,
            uint256 stuckPenaltyEndTimestamp,
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            uint256 depositableValidatorsCount
        )
    {
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        uint256 totalUnbondedKeys = accounting.getUnbondedKeysCountToEject(
            nodeOperatorId
        );
        uint256 totalNonDepositedKeys = no.totalAddedKeys -
            no.totalDepositedKeys;
        // Force mode enabled and unbonded deposited keys
        if (
            totalUnbondedKeys > totalNonDepositedKeys &&
            no.targetLimitMode == FORCED_TARGET_LIMIT_MODE_ID
        ) {
            targetLimitMode = FORCED_TARGET_LIMIT_MODE_ID;
            unchecked {
                targetValidatorsCount = Math.min(
                    no.targetLimit,
                    no.totalAddedKeys -
                        no.totalWithdrawnKeys -
                        totalUnbondedKeys
                );
            }
            // No force mode enabled but unbonded deposited keys
        } else if (totalUnbondedKeys > totalNonDepositedKeys) {
            targetLimitMode = FORCED_TARGET_LIMIT_MODE_ID;
            unchecked {
                targetValidatorsCount =
                    no.totalAddedKeys -
                    no.totalWithdrawnKeys -
                    totalUnbondedKeys;
            }
        } else {
            targetLimitMode = no.targetLimitMode;
            targetValidatorsCount = no.targetLimit;
        }
        stuckValidatorsCount = no.stuckValidatorsCount;
        // @dev unused in CSM
        refundedValidatorsCount = 0;
        // @dev unused in CSM
        stuckPenaltyEndTimestamp = 0;
        totalExitedValidators = no.totalExitedKeys;
        totalDepositedValidators = no.totalDepositedKeys;
        depositableValidatorsCount = no.depositableValidatorsCount;
    }

    /// @notice Get Node Operator signing keys
    /// @param nodeOperatorId ID of the Node Operator
    /// @param startIndex Index of the first key
    /// @param keysCount Count of keys to get
    /// @return Signing keys
    function getSigningKeys(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) external view returns (bytes memory) {
        _onlyValidIndexRange(nodeOperatorId, startIndex, keysCount);

        return SigningKeys.loadKeys(nodeOperatorId, startIndex, keysCount);
    }

    /// @notice Get Node Operator signing keys with signatures
    /// @param nodeOperatorId ID of the Node Operator
    /// @param startIndex Index of the first key
    /// @param keysCount Count of keys to get
    /// @return keys Signing keys
    /// @return signatures Signatures of `(deposit_message_root, domain)` tuples
    ///                    https://github.com/ethereum/consensus-specs/blob/v1.4.0/specs/phase0/beacon-chain.md#signingdata
    function getSigningKeysWithSignatures(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) external view returns (bytes memory keys, bytes memory signatures) {
        _onlyValidIndexRange(nodeOperatorId, startIndex, keysCount);

        (keys, signatures) = SigningKeys.initKeysSigsBuf(keysCount);
        // solhint-disable-next-line func-named-parameters
        SigningKeys.loadKeysSigs(
            nodeOperatorId,
            startIndex,
            keysCount,
            keys,
            signatures,
            0
        );
    }

    /// @notice Get nonce of the module
    function getNonce() external view returns (uint256) {
        return _nonce;
    }

    /// @notice Get total number of Node Operators
    function getNodeOperatorsCount() external view returns (uint256) {
        return _nodeOperatorsCount;
    }

    /// @notice Get total number of active Node Operators
    function getActiveNodeOperatorsCount() external view returns (uint256) {
        return _nodeOperatorsCount;
    }

    /// @notice Get Node Operator active status
    /// @param nodeOperatorId ID of the Node Operator
    /// @return active Operator is active flag
    function getNodeOperatorIsActive(
        uint256 nodeOperatorId
    ) external view returns (bool) {
        return nodeOperatorId < _nodeOperatorsCount;
    }

    /// @notice Get IDs of Node Operators
    /// @param offset Offset of the first Node Operator ID to get
    /// @param limit Count of Node Operator IDs to get
    /// @return nodeOperatorIds IDs of the Node Operators
    function getNodeOperatorIds(
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory nodeOperatorIds) {
        uint256 nodeOperatorsCount = _nodeOperatorsCount;
        if (offset >= nodeOperatorsCount || limit == 0) return new uint256[](0);
        uint256 idsCount = limit < nodeOperatorsCount - offset
            ? limit
            : nodeOperatorsCount - offset;
        nodeOperatorIds = new uint256[](idsCount);
        for (uint256 i = 0; i < nodeOperatorIds.length; ++i) {
            nodeOperatorIds[i] = offset + i;
        }
    }

    function _incrementModuleNonce() internal {
        unchecked {
            ++_nonce;
        }
        emit NonceChanged(_nonce);
    }

    function _createNodeOperator(
        NodeOperatorManagementProperties calldata managementProperties,
        address referrer,
        bytes32[] calldata proof
    ) internal returns (uint256 noId, uint256 curveId) {
        if (!publicRelease) {
            if (proof.length == 0 || address(earlyAdoption) == address(0)) {
                revert NotAllowedToJoinYet();
            }
        }

        noId = _nodeOperatorsCount;
        NodeOperator storage no = _nodeOperators[noId];

        no.managerAddress = managementProperties.managerAddress == address(0)
            ? msg.sender
            : managementProperties.managerAddress;
        no.rewardAddress = managementProperties.rewardAddress == address(0)
            ? msg.sender
            : managementProperties.rewardAddress;
        if (managementProperties.extendedManagerPermissions)
            no.extendedManagerPermissions = managementProperties
                .extendedManagerPermissions;

        unchecked {
            ++_nodeOperatorsCount;
        }

        emit NodeOperatorAdded(noId, no.managerAddress, no.rewardAddress);

        if (referrer != address(0)) emit ReferrerSet(noId, referrer);

        // @dev It's possible to join with proof even after public release to get beneficial bond curve
        if (proof.length != 0 && address(earlyAdoption) != address(0)) {
            earlyAdoption.consume(msg.sender, proof);
            curveId = earlyAdoption.CURVE_ID();
            accounting.setBondCurve(noId, curveId);
        } else {
            curveId = accounting.DEFAULT_BOND_CURVE_ID();
        }
    }

    function _addKeysAndUpdateDepositableValidatorsCount(
        uint256 nodeOperatorId,
        uint256 keysCount,
        bytes calldata publicKeys,
        bytes calldata signatures
    ) internal {
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        uint256 startIndex = no.totalAddedKeys;
        unchecked {
            // startIndex + keysCount can't overflow because of deposit check in the parent methods
            if (
                !publicRelease &&
                startIndex + keysCount >
                MAX_SIGNING_KEYS_PER_OPERATOR_BEFORE_PUBLIC_RELEASE
            ) {
                revert MaxSigningKeysCountExceeded();
            }
        }

        // solhint-disable-next-line func-named-parameters
        SigningKeys.saveKeysSigs(
            nodeOperatorId,
            startIndex,
            keysCount,
            publicKeys,
            signatures
        );
        unchecked {
            // Optimistic vetting takes place.
            if (no.totalAddedKeys == no.totalVettedKeys) {
                // @dev No need to safe cast due to internal logic
                no.totalVettedKeys += uint32(keysCount);
                emit VettedSigningKeysCountChanged(
                    nodeOperatorId,
                    no.totalVettedKeys
                );
            }

            // @dev No need to safe cast due to internal logic
            no.totalAddedKeys += uint32(keysCount);
        }
        emit TotalSigningKeysCountChanged(nodeOperatorId, no.totalAddedKeys);

        // Nonce is updated below since in case of stuck keys depositable keys might not change
        _updateDepositableValidatorsCount({
            nodeOperatorId: nodeOperatorId,
            incrementNonceIfUpdated: false
        });
        _incrementModuleNonce();
    }

    function _setKeyRemovalCharge(uint256 amount) internal {
        if (amount > MAX_KEY_REMOVAL_CHARGE) revert InvalidInput();
        keyRemovalCharge = amount;
        emit KeyRemovalChargeSet(amount);
    }

    /// @dev Update exited validators count for a single Node Operator
    /// @dev Allows decrease the count for unsafe updates
    function _updateExitedValidatorsCount(
        uint256 nodeOperatorId,
        uint256 exitedValidatorsCount,
        bool allowDecrease
    ) internal {
        _onlyExistingNodeOperator(nodeOperatorId);
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        if (exitedValidatorsCount == no.totalExitedKeys) return;
        if (exitedValidatorsCount > no.totalDepositedKeys)
            revert ExitedKeysHigherThanTotalDeposited();
        if (!allowDecrease && exitedValidatorsCount < no.totalExitedKeys)
            revert ExitedKeysDecrease();
        unchecked {
            // @dev No need to safe cast due to conditions above
            _totalExitedValidators =
                (_totalExitedValidators - no.totalExitedKeys) +
                uint64(exitedValidatorsCount);
        }
        // @dev No need to safe cast due to conditions above
        no.totalExitedKeys = uint32(exitedValidatorsCount);

        emit ExitedSigningKeysCountChanged(
            nodeOperatorId,
            exitedValidatorsCount
        );
    }

    function _updateStuckValidatorsCount(
        uint256 nodeOperatorId,
        uint256 stuckValidatorsCount
    ) internal {
        _onlyExistingNodeOperator(nodeOperatorId);
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        if (stuckValidatorsCount == no.stuckValidatorsCount) return;
        unchecked {
            if (
                stuckValidatorsCount >
                no.totalDepositedKeys - no.totalExitedKeys
            ) revert StuckKeysHigherThanNonExited();
        }

        // @dev No need to safe cast due to conditions above
        no.stuckValidatorsCount = uint32(stuckValidatorsCount);
        emit StuckSigningKeysCountChanged(nodeOperatorId, stuckValidatorsCount);

        if (stuckValidatorsCount > 0 && no.depositableValidatorsCount > 0) {
            // INFO: The only consequence of stuck keys from the on-chain perspective is suspending deposits to the
            // Node Operator. To do that, we set the depositableValidatorsCount to 0 for this Node Operator. Hence
            // we can omit the call to the _updateDepositableValidatorsCount function here to save gas.
            unchecked {
                _depositableValidatorsCount -= no.depositableValidatorsCount;
            }
            no.depositableValidatorsCount = 0;
            emit DepositableSigningKeysCountChanged(nodeOperatorId, 0);
        } else {
            // Nonce will be updated on the top level once per call
            _updateDepositableValidatorsCount({
                nodeOperatorId: nodeOperatorId,
                incrementNonceIfUpdated: false
            });
        }
    }

    function _updateDepositableValidatorsCount(
        uint256 nodeOperatorId,
        bool incrementNonceIfUpdated
    ) internal {
        NodeOperator storage no = _nodeOperators[nodeOperatorId];

        uint256 newCount = no.totalVettedKeys - no.totalDepositedKeys;
        uint256 unbondedKeys = accounting.getUnbondedKeysCount(nodeOperatorId);

        {
            uint256 nonDeposited = no.totalAddedKeys - no.totalDepositedKeys;
            if (unbondedKeys >= nonDeposited) {
                newCount = 0;
            } else if (unbondedKeys > no.totalAddedKeys - no.totalVettedKeys) {
                newCount = nonDeposited - unbondedKeys;
            }
        }

        if (no.stuckValidatorsCount > 0 && newCount > 0) {
            newCount = 0;
        }

        if (no.targetLimitMode > 0 && newCount > 0) {
            unchecked {
                uint256 nonWithdrawnValidators = no.totalDepositedKeys -
                    no.totalWithdrawnKeys;
                newCount = Math.min(
                    no.targetLimit > nonWithdrawnValidators
                        ? no.targetLimit - nonWithdrawnValidators
                        : 0,
                    newCount
                );
            }
        }

        if (no.depositableValidatorsCount != newCount) {
            // Updating the global counter.
            // @dev No need to safe cast due to internal logic
            unchecked {
                _depositableValidatorsCount =
                    _depositableValidatorsCount -
                    no.depositableValidatorsCount +
                    uint64(newCount);
            }
            // @dev No need to safe cast due to internal logic
            no.depositableValidatorsCount = uint32(newCount);
            emit DepositableSigningKeysCountChanged(nodeOperatorId, newCount);
            if (incrementNonceIfUpdated) {
                _incrementModuleNonce();
            }
            depositQueue.normalize(_nodeOperators, nodeOperatorId);
        }
    }

    function _onlyNodeOperatorManager(uint256 nodeOperatorId) internal view {
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        if (no.managerAddress == address(0)) revert NodeOperatorDoesNotExist();
        if (no.managerAddress != msg.sender) revert SenderIsNotEligible();
    }

    function _onlyNodeOperatorManagerOrRewardAddresses(
        uint256 nodeOperatorId
    ) internal view {
        NodeOperator storage no = _nodeOperators[nodeOperatorId];
        if (no.managerAddress == address(0)) revert NodeOperatorDoesNotExist();
        if (no.managerAddress != msg.sender && no.rewardAddress != msg.sender)
            revert SenderIsNotEligible();
    }

    function _onlyExistingNodeOperator(uint256 nodeOperatorId) internal view {
        if (nodeOperatorId < _nodeOperatorsCount) return;
        revert NodeOperatorDoesNotExist();
    }

    function _onlyValidIndexRange(
        uint256 nodeOperatorId,
        uint256 startIndex,
        uint256 keysCount
    ) internal view {
        if (
            startIndex + keysCount >
            _nodeOperators[nodeOperatorId].totalAddedKeys
        ) {
            revert SigningKeysInvalidOffset();
        }
    }

    function _onlyRecoverer() internal view override {
        _checkRole(RECOVERER_ROLE);
    }

    /// @dev Both nodeOperatorId and keyIndex are limited to uint64 by the contract
    function _keyPointer(
        uint256 nodeOperatorId,
        uint256 keyIndex
    ) internal pure returns (uint256) {
        return (nodeOperatorId << 128) | keyIndex;
    }
}