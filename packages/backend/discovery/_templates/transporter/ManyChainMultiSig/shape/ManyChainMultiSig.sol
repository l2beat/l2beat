// Compiled with solc version: v0.8.19+commit.7dd6d404

library MerkleProof {
    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    /**
     * @dev Calldata version of {verify}
     *
     * _Available since v4.7._
     */
    function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProofCalldata(proof, leaf) == root;
    }

    /**
     * @dev Returns the rebuilt hash obtained by traversing a Merkle tree up
     * from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
     * hash matches the root of the tree. When processing the proof, the pairs
     * of leafs & pre-images are assumed to be sorted.
     *
     * _Available since v4.4._
     */
    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Calldata version of {processProof}
     *
     * _Available since v4.7._
     */
    function processProofCalldata(bytes32[] calldata proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Returns true if the `leaves` can be simultaneously proven to be a part of a merkle tree defined by
     * `root`, according to `proof` and `proofFlags` as described in {processMultiProof}.
     *
     * CAUTION: Not all merkle trees admit multiproofs. See {processMultiProof} for details.
     *
     * _Available since v4.7._
     */
    function multiProofVerify(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProof(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Calldata version of {multiProofVerify}
     *
     * CAUTION: Not all merkle trees admit multiproofs. See {processMultiProof} for details.
     *
     * _Available since v4.7._
     */
    function multiProofVerifyCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProofCalldata(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Returns the root of a tree reconstructed from `leaves` and sibling nodes in `proof`. The reconstruction
     * proceeds by incrementally reconstructing all inner nodes by combining a leaf/inner node with either another
     * leaf/inner node or a proof sibling node, depending on whether each `proofFlags` item is true or false
     * respectively.
     *
     * CAUTION: Not all merkle trees admit multiproofs. To use multiproofs, it is sufficient to ensure that: 1) the tree
     * is complete (but not necessarily perfect), 2) the leaves to be proven are in the opposite order they are in the
     * tree (i.e., as seen from right to left starting at the deepest layer and continuing at the next layer).
     *
     * _Available since v4.7._
     */
    function processMultiProof(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        require(leavesLen + proofLen - 1 == totalHashes, "MerkleProof: invalid multiproof");

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            require(proofPos == proofLen, "MerkleProof: invalid multiproof");
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    /**
     * @dev Calldata version of {processMultiProof}.
     *
     * CAUTION: Not all merkle trees admit multiproofs. See {processMultiProof} for details.
     *
     * _Available since v4.7._
     */
    function processMultiProofCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        require(leavesLen + proofLen - 1 == totalHashes, "MerkleProof: invalid multiproof");

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            require(proofPos == proofLen, "MerkleProof: invalid multiproof");
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    function _efficientHash(bytes32 a, bytes32 b) private pure returns (bytes32 value) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }
}

library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
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
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
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
            require(denominator > prod1, "Math: mulDiv overflow");

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

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
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

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
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
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
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
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
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
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
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
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
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
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

library SignedMath {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}

library Strings {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = Math.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toString(int256 value) internal pure returns (string memory) {
        return string(abi.encodePacked(value < 0 ? "-" : "", toString(SignedMath.abs(value))));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, Math.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}

library ECDSA {
    enum RecoverError {
        NoError,
        InvalidSignature,
        InvalidSignatureLength,
        InvalidSignatureS,
        InvalidSignatureV // Deprecated in v4.8
    }

    function _throwError(RecoverError error) private pure {
        if (error == RecoverError.NoError) {
            return; // no error: do nothing
        } else if (error == RecoverError.InvalidSignature) {
            revert("ECDSA: invalid signature");
        } else if (error == RecoverError.InvalidSignatureLength) {
            revert("ECDSA: invalid signature length");
        } else if (error == RecoverError.InvalidSignatureS) {
            revert("ECDSA: invalid signature 's' value");
        }
    }

    /**
     * @dev Returns the address that signed a hashed message (`hash`) with
     * `signature` or error string. This address can then be used for verification purposes.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     *
     * Documentation for signature generation:
     * - with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
     * - with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]
     *
     * _Available since v4.3._
     */
    function tryRecover(bytes32 hash, bytes memory signature) internal pure returns (address, RecoverError) {
        if (signature.length == 65) {
            bytes32 r;
            bytes32 s;
            uint8 v;
            // ecrecover takes the signature parameters, and the only way to get them
            // currently is to use assembly.
            /// @solidity memory-safe-assembly
            assembly {
                r := mload(add(signature, 0x20))
                s := mload(add(signature, 0x40))
                v := byte(0, mload(add(signature, 0x60)))
            }
            return tryRecover(hash, v, r, s);
        } else {
            return (address(0), RecoverError.InvalidSignatureLength);
        }
    }

    /**
     * @dev Returns the address that signed a hashed message (`hash`) with
     * `signature`. This address can then be used for verification purposes.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     */
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        (address recovered, RecoverError error) = tryRecover(hash, signature);
        _throwError(error);
        return recovered;
    }

    /**
     * @dev Overload of {ECDSA-tryRecover} that receives the `r` and `vs` short-signature fields separately.
     *
     * See https://eips.ethereum.org/EIPS/eip-2098[EIP-2098 short signatures]
     *
     * _Available since v4.3._
     */
    function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address, RecoverError) {
        bytes32 s = vs & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        uint8 v = uint8((uint256(vs) >> 255) + 27);
        return tryRecover(hash, v, r, s);
    }

    /**
     * @dev Overload of {ECDSA-recover} that receives the `r and `vs` short-signature fields separately.
     *
     * _Available since v4.2._
     */
    function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address) {
        (address recovered, RecoverError error) = tryRecover(hash, r, vs);
        _throwError(error);
        return recovered;
    }

    /**
     * @dev Overload of {ECDSA-tryRecover} that receives the `v`,
     * `r` and `s` signature fields separately.
     *
     * _Available since v4.3._
     */
    function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address, RecoverError) {
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return (address(0), RecoverError.InvalidSignatureS);
        }

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        if (signer == address(0)) {
            return (address(0), RecoverError.InvalidSignature);
        }

        return (signer, RecoverError.NoError);
    }

    /**
     * @dev Overload of {ECDSA-recover} that receives the `v`,
     * `r` and `s` signature fields separately.
     */
    function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
        (address recovered, RecoverError error) = tryRecover(hash, v, r, s);
        _throwError(error);
        return recovered;
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from a `hash`. This
     * produces hash corresponding to the one signed with the
     * https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`]
     * JSON-RPC method as part of EIP-191.
     *
     * See {recover}.
     */
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32 message) {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, "\x19Ethereum Signed Message:\n32")
            mstore(0x1c, hash)
            message := keccak256(0x00, 0x3c)
        }
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from `s`. This
     * produces hash corresponding to the one signed with the
     * https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`]
     * JSON-RPC method as part of EIP-191.
     *
     * See {recover}.
     */
    function toEthSignedMessageHash(bytes memory s) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(s.length), s));
    }

    /**
     * @dev Returns an Ethereum Signed Typed Data, created from a
     * `domainSeparator` and a `structHash`. This produces hash corresponding
     * to the one signed with the
     * https://eips.ethereum.org/EIPS/eip-712[`eth_signTypedData`]
     * JSON-RPC method as part of EIP-712.
     *
     * See {recover}.
     */
    function toTypedDataHash(bytes32 domainSeparator, bytes32 structHash) internal pure returns (bytes32 data) {
        /// @solidity memory-safe-assembly
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, "\x19\x01")
            mstore(add(ptr, 0x02), domainSeparator)
            mstore(add(ptr, 0x22), structHash)
            data := keccak256(ptr, 0x42)
        }
    }

    /**
     * @dev Returns an Ethereum Signed Data with intended validator, created from a
     * `validator` and `data` according to the version 0 of EIP-191.
     *
     * See {recover}.
     */
    function toDataWithIntendedValidatorHash(address validator, bytes memory data) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x00", validator, data));
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract Ownable2Step is Ownable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
    }
}

contract ManyChainMultiSig is Ownable2Step {
    receive() external payable {}

    uint8 public constant NUM_GROUPS = 32;
    uint8 public constant MAX_NUM_SIGNERS = 200;

    struct Signer {
        address addr;
        uint8 index; // index of signer in s_config.signers
        uint8 group; // 0 <= group < NUM_GROUPS. Each signer can only be in one group.
    }

    // s_signers is used to easily validate the existence of the signer by its address. We still
    // have signers stored in s_config in order to easily deactivate them when a new config is set.
    mapping(address => Signer) s_signers;

    // Signing groups are arranged in a tree. Each group is an interior node and has its own quorum.
    // Signers are the leaves of the tree. A signer/leaf node is successful iff it furnishes a valid
    // signature. A group/interior node is successful iff a quorum of its children are successful.
    // setRoot succeeds only if the root group is successful.
    // Here is an example:
    //
    //                    ┌──────┐
    //                 ┌─►│2-of-3│◄───────┐
    //                 │  └──────┘        │
    //                 │        ▲         │
    //                 │        │         │
    //              ┌──┴───┐ ┌──┴───┐ ┌───┴────┐
    //          ┌──►│1-of-2│ │2-of-2│ │signer A│
    //          │   └──────┘ └──────┘ └────────┘
    //          │       ▲      ▲  ▲
    //          │       │      │  │     ┌──────┐
    //          │       │      │  └─────┤1-of-2│◄─┐
    //          │       │      │        └──────┘  │
    //  ┌───────┴┐ ┌────┴───┐ ┌┴───────┐ ▲        │
    //  │signer B│ │signer C│ │signer D│ │        │
    //  └────────┘ └────────┘ └────────┘ │        │
    //                                   │        │
    //                            ┌──────┴─┐ ┌────┴───┐
    //                            │signer E│ │signer F│
    //                            └────────┘ └────────┘
    //
    // - If signers [A, B] sign, they can set a root.
    // - If signers [B, D, E] sign, they can set a root.
    // - If signers [B, D, E, F] sign, they can set a root. (Either E's or F's signature was
    //   superfluous.)
    // - If signers [B, C, D] sign, they cannot set a root, because the 2-of-2 group on the second
    //   level isn't successful and therefore the root group isn't successful either.
    //
    // To map this tree to a Config, we:
    // - create an entry in signers for each signer (sorted by address in ascending order)
    // - assign the root group to index 0 and have it be its own parent
    // - assign an index to each non-root group, such that each group's parent has a lower index
    //   than the group itself
    // For example, we could transform the above tree structure into:
    // groupQuorums = [2, 1, 2, 1] + [0, 0, ...] (rightpad with 0s to NUM_GROUPS)
    // groupParents = [0, 0, 0, 2] + [0, 0, ...] (rightpad with 0s to NUM_GROUPS)
    // and assuming that address(A) < address(C) < address(E) < address(F) < address(D) < address(B)
    // signers = [
    //    {addr: address(A), index: 0, group: 0}, {addr: address(C), index: 1, group: 1},
    //    {addr: address(E), index: 2, group: 3}, {addr: address(F), index: 3, group: 3},
    //    {addr: address(D), index: 4, group: 2}, {addr: address(B), index: 5, group: 1},
    //  ]
    struct Config {
        Signer[] signers;
        // groupQuorums[i] stores the quorum for the i-th signer group. Any group with
        // groupQuorums[i] = 0 is considered disabled. The i-th group is successful if
        // it is enabled and at least groupQuorums[i] of its children are successful.
        uint8[NUM_GROUPS] groupQuorums;
        // groupParents[i] stores the parent group of the i-th signer group. We ensure that the
        // groups form a tree structure (where the root/0-th signer group points to itself as
        // parent) by enforcing
        // - (i != 0) implies (groupParents[i] < i)
        // - groupParents[0] == 0
        uint8[NUM_GROUPS] groupParents;
    }

    Config s_config;

    // Remember signedHashes that this contract has seen. Each signedHash can only be set once.
    mapping(bytes32 => bool) s_seenSignedHashes;

    // MerkleRoots are a bit tricky since they reveal almost no information about the contents of
    // the tree they authenticate. To mitigate this, we enforce that this contract can only execute
    // ops from a single root at any given point in time. We further associate an expiry
    // with each root to ensure that messages are executed in a timely manner. setRoot and various
    // execute calls are expected to happen in quick succession. We put the expiring root and
    // opCount in same struct in order to reduce gas costs of reading and writing.
    struct ExpiringRootAndOpCount {
        bytes32 root;
        // We prefer using block.timestamp instead of block.number, as a single
        // root may target many chains. We assume that block.timestamp can
        // be manipulated by block producers but only within relatively tight
        // bounds (a few minutes at most).
        uint32 validUntil;
        // each ManyChainMultiSig instance has it own independent opCount.
        uint40 opCount;
    }

    ExpiringRootAndOpCount s_expiringRootAndOpCount;

    /// @notice Each root also authenticates metadata about itself (stored as one of the leaves)
    /// which must be revealed when the root is set.
    ///
    /// @dev We need to be careful that abi.encode(MANY_CHAIN_MULTI_SIG_DOMAIN_SEPARATOR_METADATA, RootMetadata)
    /// is greater than 64 bytes to prevent collisions with internal nodes in the Merkle tree. See
    /// openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol:15 for details.
    struct RootMetadata {
        // chainId and multiSig uniquely identify a ManyChainMultiSig contract instance that the
        // root is destined for.
        // uint256 since it is unclear if we can represent chainId as uint64. There is a proposal (
        // https://ethereum-magicians.org/t/eip-2294-explicit-bound-to-chain-id/11090) to
        // bound chainid to 64 bits, but it is still unresolved.
        uint256 chainId;
        address multiSig;
        // opCount before adding this root
        uint40 preOpCount;
        // opCount after executing all ops in this root
        uint40 postOpCount;
        // override whatever root was already stored in this contract even if some of its
        // ops weren't executed.
        // Important: it is strongly recommended that offchain code set this to false by default.
        // Be careful setting this to true as it may break assumptions about what transactions from
        // the previous root have already been executed.
        bool overridePreviousRoot;
    }

    RootMetadata s_rootMetadata;

    /// @notice An ECDSA signature.
    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @notice setRoot Sets a new expiring root.
    ///
    /// @param root is the new expiring root.
    /// @param validUntil is the time by which root is valid
    /// @param metadata is the authenticated metadata about the root, which is stored as one of
    /// the leaves.
    /// @param metadataProof is the MerkleProof of inclusion of the metadata in the Merkle tree.
    /// @param signatures the ECDSA signatures on (root, validUntil).
    ///
    /// @dev the message (root, validUntil) should be signed by a sufficient set of signers.
    /// This signature authenticates also the metadata.
    ///
    /// @dev this method can be executed by anyone who has the root and valid signatures.
    /// as we validate the correctness of signatures, this imposes no risk.
    function setRoot(
        bytes32 root,
        uint32 validUntil,
        RootMetadata calldata metadata,
        bytes32[] calldata metadataProof,
        Signature[] calldata signatures
    ) external {
        bytes32 signedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encode(root, validUntil)));

        // Each (root, validUntil) tuple can only bet set once. For example, this prevents a
        // scenario where there are two signed roots with overridePreviousRoot = true and
        // an adversary keeps alternatively calling setRoot(root1), setRoot(root2),
        // setRoot(root1), ...
        if (s_seenSignedHashes[signedHash]) {
            revert SignedHashAlreadySeen();
        }

        // verify ECDSA signatures on (root, validUntil) and ensure that the root group is successful
        {
            // verify sigs and count number of signers in each group
            Signer memory signer;
            address prevAddress = address(0x0);
            uint8[NUM_GROUPS] memory groupVoteCounts; // number of votes per group
            for (uint256 i = 0; i < signatures.length; i++) {
                Signature calldata sig = signatures[i];
                address signerAddress = ECDSA.recover(signedHash, sig.v, sig.r, sig.s);
                // the off-chain system is required to sort the signatures by the
                // signer address in an increasing order
                if (prevAddress >= signerAddress) {
                    revert SignersAddressesMustBeStrictlyIncreasing();
                }
                prevAddress = signerAddress;

                signer = s_signers[signerAddress];
                if (signer.addr != signerAddress) {
                    revert InvalidSigner();
                }
                uint8 group = signer.group;
                while (true) {
                    groupVoteCounts[group]++;
                    if (groupVoteCounts[group] != s_config.groupQuorums[group]) {
                        // bail out unless we just hit the quorum. we only hit each quorum once,
                        // so we never move on to the parent of a group more than once.
                        break;
                    }
                    if (group == 0) {
                        // reached root
                        break;
                    }

                    group = s_config.groupParents[group];
                }
            }
            // the group at the root of the tree (with index 0) determines whether the vote passed,
            // we cannot proceed if it isn't configured with a valid (non-zero) quorum
            if (s_config.groupQuorums[0] == 0) {
                revert MissingConfig();
            }
            // did the root group reach its quorum?
            if (groupVoteCounts[0] < s_config.groupQuorums[0]) {
                revert InsufficientSigners();
            }
        }

        if (validUntil < block.timestamp) {
            revert ValidUntilHasAlreadyPassed();
        }

        {
            // verify metadataProof
            bytes32 hashedLeaf =
                keccak256(abi.encode(MANY_CHAIN_MULTI_SIG_DOMAIN_SEPARATOR_METADATA, metadata));
            if (!MerkleProof.verify(metadataProof, root, hashedLeaf)) {
                revert ProofCannotBeVerified();
            }
        }

        if (block.chainid != metadata.chainId) {
            revert WrongChainId();
        }

        if (address(this) != metadata.multiSig) {
            revert WrongMultiSig();
        }

        uint40 opCount = s_expiringRootAndOpCount.opCount;

        // don't allow a new root to be set if there are still outstanding ops that have not been
        // executed, unless overridePreviousRoot is set
        if (opCount != s_rootMetadata.postOpCount && !metadata.overridePreviousRoot) {
            revert PendingOps();
        }

        // the signers are responsible for tracking opCount offchain and ensuring that
        // preOpCount equals to opCount
        if (opCount != metadata.preOpCount) {
            revert WrongPreOpCount();
        }

        if (metadata.preOpCount > metadata.postOpCount) {
            revert WrongPostOpCount();
        }

        // done with validation, persist in contract state
        s_seenSignedHashes[signedHash] = true;
        s_expiringRootAndOpCount = ExpiringRootAndOpCount({
            root: root,
            validUntil: validUntil,
            opCount: metadata.preOpCount
        });
        s_rootMetadata = metadata;
        emit NewRoot(root, validUntil, metadata);
    }

    /// @notice an op to be executed by the ManyChainMultiSig contract
    ///
    /// @dev We need to be careful that abi.encode(LEAF_OP_DOMAIN_SEPARATOR, RootMetadata)
    /// is greater than 64 bytes to prevent collisions with internal nodes in the Merkle tree. See
    /// openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol:15 for details.
    struct Op {
        uint256 chainId;
        address multiSig;
        uint40 nonce;
        address to;
        uint256 value;
        bytes data;
    }

    /// @notice Execute the received op after verifying the proof of its inclusion in the
    /// current Merkle tree. The op should be the next op according to the order
    /// enforced by the merkle tree whose root is stored in s_expiringRootAndOpCount, i.e., the
    /// nonce of the op should be equal to s_expiringRootAndOpCount.opCount.
    ///
    /// @param op is Op to be executed
    /// @param proof is the MerkleProof for the op's inclusion in the MerkleTree which its
    /// root is the s_expiringRootAndOpCount.root.
    ///
    /// @dev ANYONE can call this function! That's intentional. Callers can only execute verified,
    /// ordered ops in the Merkle tree.
    ///
    /// @dev we perform a raw call to each target. Raw calls to targets that don't have associated
    /// contract code will always succeed regardless of data.
    ///
    /// @dev the gas limit of the call can be freely determined by the caller of this function.
    /// We expect callees to revert if they run out of gas.
    function execute(Op calldata op, bytes32[] calldata proof) external {
        ExpiringRootAndOpCount memory currentExpiringRootAndOpCount = s_expiringRootAndOpCount;

        if (s_rootMetadata.postOpCount <= currentExpiringRootAndOpCount.opCount) {
            revert PostOpCountReached();
        }

        if (op.chainId != block.chainid) {
            revert WrongChainId();
        }

        if (op.multiSig != address(this)) {
            revert WrongMultiSig();
        }

        if (block.timestamp > currentExpiringRootAndOpCount.validUntil) {
            revert RootExpired();
        }

        if (op.nonce != currentExpiringRootAndOpCount.opCount) {
            revert WrongNonce();
        }

        // verify that the op exists in the merkle tree
        bytes32 hashedLeaf = keccak256(abi.encode(MANY_CHAIN_MULTI_SIG_DOMAIN_SEPARATOR_OP, op));
        if (!MerkleProof.verify(proof, currentExpiringRootAndOpCount.root, hashedLeaf)) {
            revert ProofCannotBeVerified();
        }

        // increase the counter *before* execution to prevent reentrancy issues
        s_expiringRootAndOpCount.opCount = currentExpiringRootAndOpCount.opCount + 1;

        _execute(op.to, op.value, op.data);
        emit OpExecuted(op.nonce, op.to, op.data, op.value);
    }

    /// @notice sets a new s_config. If clearRoot is true, then it also invalidates
    /// s_expiringRootAndOpCount.root.
    ///
    /// @param signerAddresses holds the addresses of the active signers. The addresses must be in
    /// ascending order.
    /// @param signerGroups maps each signer to its group
    /// @param groupQuorums holds the required number of valid signatures in each group.
    /// A group i is called successful group if at least groupQuorum[i] distinct signers provide a
    /// valid signature.
    /// @param groupParents holds each group's parent. The groups must be arranged in a tree s.t.
    /// group 0 is the root of the tree and the i-th group's parent has index j less than i.
    /// Iff setRoot is called with a set of signatures that causes the root group to be successful,
    /// setRoot allows a root to be set.
    /// @param clearRoot, if set to true, invalidates the current root. This option is needed to
    /// invalidate the current root, so to prevent further ops from being executed. This
    /// might be used when the current root was signed under a loser group configuration or when
    /// some previous signers aren't trusted any more.
    function setConfig(
        address[] calldata signerAddresses,
        uint8[] calldata signerGroups,
        uint8[NUM_GROUPS] calldata groupQuorums,
        uint8[NUM_GROUPS] calldata groupParents,
        bool clearRoot
    ) external onlyOwner {
        if (signerAddresses.length == 0 || signerAddresses.length > MAX_NUM_SIGNERS) {
            revert OutOfBoundsNumOfSigners();
        }

        if (signerAddresses.length != signerGroups.length) {
            revert SignerGroupsLengthMismatch();
        }

        {
            // validate group structure
            // counts the number of children of each group
            uint8[NUM_GROUPS] memory groupChildrenCounts;
            // first, we count the signers as children
            for (uint256 i = 0; i < signerGroups.length; i++) {
                if (signerGroups[i] >= NUM_GROUPS) {
                    revert OutOfBoundsGroup();
                }
                groupChildrenCounts[signerGroups[i]]++;
            }
            // second, we iterate backwards so as to check each group and propagate counts from
            // child group to parent groups up the tree to the root
            for (uint256 j = 0; j < NUM_GROUPS; j++) {
                uint256 i = NUM_GROUPS - 1 - j;
                // ensure we have a well-formed group tree. the root should have itself as parent
                if ((i != 0 && groupParents[i] >= i) || (i == 0 && groupParents[i] != 0)) {
                    revert GroupTreeNotWellFormed();
                }
                bool disabled = groupQuorums[i] == 0;
                if (disabled) {
                    // a disabled group shouldn't have any children
                    if (0 < groupChildrenCounts[i]) {
                        revert SignerInDisabledGroup();
                    }
                } else {
                    // ensure that the group quorum can be met
                    if (groupChildrenCounts[i] < groupQuorums[i]) {
                        revert OutOfBoundsGroupQuorum();
                    }
                    groupChildrenCounts[groupParents[i]]++;
                    // the above line clobbers groupChildrenCounts[0] in last iteration, don't use it after the loop ends
                }
            }
        }

        Signer[] memory oldSigners = s_config.signers;
        // remove any old signer addresses
        for (uint256 i = 0; i < oldSigners.length; i++) {
            address oldSignerAddress = oldSigners[i].addr;
            delete s_signers[oldSignerAddress];
            s_config.signers.pop();
        }

        // we cannot just write s_config = Config({...}) because solc doesn't support that
        assert(s_config.signers.length == 0);
        s_config.groupQuorums = groupQuorums;
        s_config.groupParents = groupParents;

        // add new signers' addresses, we require that the signers' list be a strictly monotone
        // increasing sequence
        address prevSigner = address(0x0);
        for (uint256 i = 0; i < signerAddresses.length; i++) {
            if (prevSigner >= signerAddresses[i]) {
                revert SignersAddressesMustBeStrictlyIncreasing();
            }
            Signer memory signer =
                Signer({addr: signerAddresses[i], index: uint8(i), group: signerGroups[i]});
            s_signers[signerAddresses[i]] = signer;
            s_config.signers.push(signer);
            prevSigner = signerAddresses[i];
        }

        if (clearRoot) {
            // clearRoot is equivalent to overriding with a completely empty root
            uint40 opCount = s_expiringRootAndOpCount.opCount;
            s_expiringRootAndOpCount =
                ExpiringRootAndOpCount({root: 0, validUntil: 0, opCount: opCount});
            s_rootMetadata = RootMetadata({
                chainId: block.chainid,
                multiSig: address(this),
                preOpCount: opCount,
                postOpCount: opCount,
                overridePreviousRoot: true
            });
        }
        emit ConfigSet(s_config, clearRoot);
    }

    /// @notice Execute an op's call. Performs a raw call that always succeeds if the
    /// target isn't a contract.
    function _execute(address target, uint256 value, bytes calldata data) internal virtual {
        (bool success, bytes memory ret) = target.call{value: value}(data);
        if (!success) {
            revert CallReverted(ret);
        }
    }

    /*
     * Getters
     */

    function getConfig() public view returns (Config memory) {
        return s_config;
    }

    function getOpCount() public view returns (uint40) {
        return s_expiringRootAndOpCount.opCount;
    }

    function getRoot() public view returns (bytes32 root, uint32 validUntil) {
        ExpiringRootAndOpCount memory currentRootAndOpCount = s_expiringRootAndOpCount;
        return (currentRootAndOpCount.root, currentRootAndOpCount.validUntil);
    }

    function getRootMetadata() public view returns (RootMetadata memory) {
        return s_rootMetadata;
    }

    /*
     * Events and Errors
     */

    /// @notice Emitted when a new root is set.
    event NewRoot(bytes32 indexed root, uint32 validUntil, RootMetadata metadata);

    /// @notice Emitted when a new config is set.
    event ConfigSet(Config config, bool isRootCleared);

    /// @notice Emitted when an op gets successfully executed.
    event OpExecuted(uint40 indexed nonce, address to, bytes data, uint256 value);

    /// @notice Thrown when number of signers is 0 or greater than MAX_NUM_SIGNERS.
    error OutOfBoundsNumOfSigners();

    /// @notice Thrown when signerAddresses and signerGroups have different lengths.
    error SignerGroupsLengthMismatch();

    /// @notice Thrown when number of some signer's group is greater than (NUM_GROUPS-1).
    error OutOfBoundsGroup();

    /// @notice Thrown when the group tree isn't well-formed.
    error GroupTreeNotWellFormed();

    /// @notice Thrown when the quorum of some group is larger than the number of signers in it.
    error OutOfBoundsGroupQuorum();

    /// @notice Thrown when a disabled group contains a signer.
    error SignerInDisabledGroup();

    /// @notice Thrown when the signers' addresses are not a strictly increasing monotone sequence.
    /// Prevents signers from including more than one signature.
    error SignersAddressesMustBeStrictlyIncreasing();

    /// @notice Thrown when the signature corresponds to invalid signer.
    error InvalidSigner();

    /// @notice Thrown when there is no sufficient set of valid signatures provided to make the
    /// root group successful.
    error InsufficientSigners();

    /// @notice Thrown when attempt to set metadata or execute op for another chain.
    error WrongChainId();

    /// @notice Thrown when the multiSig address in metadata or op is
    /// incompatible with the address of this contract.
    error WrongMultiSig();

    /// @notice Thrown when the preOpCount <= postOpCount invariant is violated.
    error WrongPostOpCount();

    /// @notice Thrown when attempting to set a new root while there are still pending ops
    /// from the previous root without explicitly overriding it.
    error PendingOps();

    /// @notice Thrown when preOpCount in metadata is incompatible with the current opCount.
    error WrongPreOpCount();

    /// @notice Thrown when the provided merkle proof cannot be verified.
    error ProofCannotBeVerified();

    /// @notice Thrown when attempt to execute an op after
    /// s_expiringRootAndOpCount.validUntil has passed.
    error RootExpired();

    /// @notice Thrown when attempt to bypass the enforced ops' order in the merkle tree or
    /// re-execute an op.
    error WrongNonce();

    /// @notice Thrown when attempting to execute an op even though opCount equals
    /// metadata.postOpCount.
    error PostOpCountReached();

    /// @notice Thrown when the underlying call in _execute() reverts.
    error CallReverted(bytes error);

    /// @notice Thrown when attempt to set past validUntil for the root.
    error ValidUntilHasAlreadyPassed();

    /// @notice Thrown when setRoot() is called before setting a config.
    error MissingConfig();

    /// @notice Thrown when attempt to set the same (root, validUntil) in setRoot().
    error SignedHashAlreadySeen();
}