library CanonicalMachine {
    /// @notice Base-2 logarithm of number of bytes.
    type Log2Size is uint64;

    /// @notice Machine word size (8 bytes).
    Log2Size constant WORD_LOG2_SIZE = Log2Size.wrap(3);

    /// @notice Machine address space size (2^64 bytes).
    Log2Size constant MACHINE_LOG2_SIZE = Log2Size.wrap(64);

    /// @notice Keccak-256 output size (32 bytes).
    Log2Size constant KECCAK_LOG2_SIZE = Log2Size.wrap(5);

    /// @notice Maximum input size (~2 megabytes).
    /// @dev The offset and size fields use up the extra 64 bytes.
    uint256 constant INPUT_MAX_SIZE = (1 << 21) - 64;

    /// @notice Maximum voucher metadata memory range (2 megabytes).
    Log2Size constant VOUCHER_METADATA_LOG2_SIZE = Log2Size.wrap(21);

    /// @notice Maximum notice metadata memory range (2 megabytes).
    Log2Size constant NOTICE_METADATA_LOG2_SIZE = Log2Size.wrap(21);

    /// @notice Maximum epoch voucher memory range (128 megabytes).
    Log2Size constant EPOCH_VOUCHER_LOG2_SIZE = Log2Size.wrap(37);

    /// @notice Maximum epoch notice memory range (128 megabytes).
    Log2Size constant EPOCH_NOTICE_LOG2_SIZE = Log2Size.wrap(37);

    /// @notice Unwrap `s` into its underlying uint64 value.
    /// @param s Base-2 logarithm of some number of bytes
    function uint64OfSize(Log2Size s) internal pure returns (uint64) {
        return Log2Size.unwrap(s);
    }

    /// @notice Return the position of an intra memory range on a memory range
    ///         with contents with the same size.
    /// @param index Index of intra memory range
    /// @param log2Size Base-2 logarithm of intra memory range size
    function getIntraMemoryRangePosition(
        uint64 index,
        Log2Size log2Size
    ) internal pure returns (uint64) {
        return index << Log2Size.unwrap(log2Size);
    }
}

library CartesiMathV2 {
    // mapping values are packed as bytes3 each
    // see test/TestCartesiMath.ts for decimal values
    bytes constant log2tableTimes1M =
        hex"0000000F4240182F421E8480236E082771822AD63A2DC6C0305E8532B04834C96736B3C23876D73A187A3B9D4A3D09003E5EA63FA0C540D17741F28843057D440BA745062945F60246DC1047B917488DC7495ABA4A207C4ADF8A4B98544C4B404CF8AA4DA0E64E44434EE3054F7D6D5013B750A61A5134C851BFF05247BD52CC58534DE753CC8D54486954C19C55384255AC75561E50568DE956FB575766B057D00758376F589CFA5900BA5962BC59C3135A21CA5A7EF15ADA945B34BF5B8D805BE4DF5C3AEA5C8FA95CE3265D356C5D86835DD6735E25455E73005EBFAD5F0B525F55F75F9FA25FE85A60302460770860BD0A61023061467F6189FD61CCAE620E98624FBF62902762CFD5630ECD634D12638AA963C7966403DC643F7F647A8264B4E864EEB56527EC6560906598A365D029660724663D9766738566A8F066DDDA6712476746386779AF67ACAF67DF3A6811526842FA68743268A4FC68D55C6905536934E169640A6992CF69C13169EF326A1CD46A4A186A76FF6AA38C6ACFC0";

    /// @notice Approximates log2 * 1M
    /// @param _num number to take log2 * 1M of
    /// @return approximate log2 times 1M
    function log2ApproxTimes1M(uint256 _num) public pure returns (uint256) {
        require(_num > 0, "Number cannot be zero");
        uint256 leading = 0;

        if (_num == 1) return 0;

        while (_num > 128) {
            _num = _num >> 1;
            leading += 1;
        }
        return (leading * uint256(1000000)) + (getLog2TableTimes1M(_num));
    }

    /// @notice navigates log2tableTimes1M
    /// @param _num number to take log2 of
    /// @return result after table look-up
    function getLog2TableTimes1M(uint256 _num) public pure returns (uint256) {
        bytes3 result = 0;
        for (uint8 i = 0; i < 3; i++) {
            bytes3 tempResult = log2tableTimes1M[(_num - 1) * 3 + i];
            result = result | (tempResult >> (i * 8));
        }

        return uint256(uint24(result));
    }

    /// @notice get floor of log2 of number
    /// @param _num number to take floor(log2) of
    /// @return floor(log2) of _num
    function getLog2Floor(uint256 _num) public pure returns (uint8) {
        require(_num != 0, "log of zero is undefined");

        return uint8(255 - clz(_num));
    }

    /// @notice checks if a number is Power of 2
    /// @param _num number to check
    /// @return true if number is power of 2, false if not
    function isPowerOf2(uint256 _num) public pure returns (bool) {
        if (_num == 0) return false;

        return _num & (_num - 1) == 0;
    }

    /// @notice count trailing zeros
    /// @param _num number you want the ctz of
    /// @dev this a binary search implementation
    function ctz(uint256 _num) public pure returns (uint256) {
        if (_num == 0) return 256;

        uint256 n = 0;
        if (_num & 0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF == 0) {
            n = n + 128;
            _num = _num >> 128;
        }
        if (_num & 0x000000000000000000000000000000000000000000000000FFFFFFFFFFFFFFFF == 0) {
            n = n + 64;
            _num = _num >> 64;
        }
        if (_num & 0x00000000000000000000000000000000000000000000000000000000FFFFFFFF == 0) {
            n = n + 32;
            _num = _num >> 32;
        }
        if (_num & 0x000000000000000000000000000000000000000000000000000000000000FFFF == 0) {
            n = n + 16;
            _num = _num >> 16;
        }
        if (_num & 0x00000000000000000000000000000000000000000000000000000000000000FF == 0) {
            n = n + 8;
            _num = _num >> 8;
        }
        if (_num & 0x000000000000000000000000000000000000000000000000000000000000000F == 0) {
            n = n + 4;
            _num = _num >> 4;
        }
        if (_num & 0x0000000000000000000000000000000000000000000000000000000000000003 == 0) {
            n = n + 2;
            _num = _num >> 2;
        }
        if (_num & 0x0000000000000000000000000000000000000000000000000000000000000001 == 0) {
            n = n + 1;
        }

        return n;
    }

    /// @notice count leading zeros
    /// @param _num number you want the clz of
    /// @dev this a binary search implementation
    function clz(uint256 _num) public pure returns (uint256) {
        if (_num == 0) return 256;

        uint256 n = 0;
        if (_num & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000000000000000000000000000 == 0) {
            n = n + 128;
            _num = _num << 128;
        }
        if (_num & 0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000 == 0) {
            n = n + 64;
            _num = _num << 64;
        }
        if (_num & 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000 == 0) {
            n = n + 32;
            _num = _num << 32;
        }
        if (_num & 0xFFFF000000000000000000000000000000000000000000000000000000000000 == 0) {
            n = n + 16;
            _num = _num << 16;
        }
        if (_num & 0xFF00000000000000000000000000000000000000000000000000000000000000 == 0) {
            n = n + 8;
            _num = _num << 8;
        }
        if (_num & 0xF000000000000000000000000000000000000000000000000000000000000000 == 0) {
            n = n + 4;
            _num = _num << 4;
        }
        if (_num & 0xC000000000000000000000000000000000000000000000000000000000000000 == 0) {
            n = n + 2;
            _num = _num << 2;
        }
        if (_num & 0x8000000000000000000000000000000000000000000000000000000000000000 == 0) {
            n = n + 1;
        }

        return n;
    }
}

library MerkleV2 {
    using CartesiMathV2 for uint256;

    uint128 constant L_WORD_SIZE = 3; // word = 8 bytes, log = 3
    // number of hashes in EMPTY_TREE_HASHES
    uint128 constant EMPTY_TREE_SIZE = 1952; // 61*32=1952. 32 bytes per 61 indexes (64 words)

    // merkle root hashes of trees of zero concatenated
    // 32 bytes for each root, first one is keccak(0), second one is
    // keccak(keccack(0), keccak(0)) and so on

    bytes constant EMPTY_TREE_HASHES =
        hex"011b4d03dd8c01f1049143cf9c4c817e4b167f1d1b83e5c6f0f10d89ba1e7bce4d9470a821fbe90117ec357e30bad9305732fb19ddf54a07dd3e29f440619254ae39ce8537aca75e2eff3e38c98011dfe934e700a0967732fc07b430dd656a233fc9a15f5b4869c872f81087bb6104b7d63e6f9ab47f2c43f3535eae7172aa7f17d2dd614cddaa4d879276b11e0672c9560033d3e8453a1d045339d34ba601b9c37b8b13ca95166fb7af16988a70fcc90f38bf9126fd833da710a47fb37a55e68e7a427fa943d9966b389f4f257173676090c6e95f43e2cb6d65f8758111e30930b0b9deb73e155c59740bacf14a6ff04b64bb8e201a506409c3fe381ca4ea90cd5deac729d0fdaccc441d09d7325f41586ba13c801b7eccae0f95d8f3933efed8b96e5b7f6f459e9cb6a2f41bf276c7b85c10cd4662c04cbbb365434726c0a0c9695393027fb106a8153109ac516288a88b28a93817899460d6310b71cf1e6163e8806fa0d4b197a259e8c3ac28864268159d0ac85f8581ca28fa7d2c0c03eb91e3eee5ca7a3da2b3053c9770db73599fb149f620e3facef95e947c0ee860b72122e31e4bbd2b7c783d79cc30f60c6238651da7f0726f767d22747264fdb046f7549f26cc70ed5e18baeb6c81bb0625cb95bb4019aeecd40774ee87ae29ec517a71f6ee264c5d761379b3d7d617ca83677374b49d10aec50505ac087408ca892b573c267a712a52e1d06421fe276a03efb1889f337201110fdc32a81f8e152499af665835aabfdc6740c7e2c3791a31c3cdc9f5ab962f681b12fc092816a62f27d86025599a41233848702f0cfc0437b445682df51147a632a0a083d2d38b5e13e466a8935afff58bb533b3ef5d27fba63ee6b0fd9e67ff20af9d50deee3f8bf065ec220c1fd4ba57e341261d55997f85d66d32152526736872693d2b437a233e2337b715f6ac9a6a272622fdc2d67fcfe1da3459f8dab4ed7e40a657a54c36766c5e8ac9a88b35b05c34747e6507f6b044ab66180dc76ac1a696de03189593fedc0d0dbbd855c8ead673544899b0960e4a5a7ca43b4ef90afe607de7698caefdc242788f654b57a4fb32a71b335ef6ff9a4cc118b282b53bdd6d6192b7a82c3c5126b9c7e33c8e5a5ac9738b8bd31247fb7402054f97b573e8abb9faad219f4fd085aceaa7f542d787ee4196d365f3cc566e7bbcfbfd451230c48d804c017d21e2d8fa914e2559bb72bf0ab78c8ab92f00ef0d0d576eccdd486b64138a4172674857e543d1d5b639058dd908186597e366ad5f3d9c7ceaff44d04d1550b8d33abc751df07437834ba5acb32328a396994aebb3c40f759c2d6d7a3cb5377e55d5d218ef5a296dda8ddc355f3f50c3d0b660a51dfa4d98a6a5a33564556cf83c1373a814641d6a1dcef97b883fee61bb84fe60a3409340217e629cc7e4dcc93b85d8820921ff5826148b60e6939acd7838e1d7f20562bff8ee4b5ec4a05ad997a57b9796fdcb2eda87883c2640b072b140b946bfdf6575cacc066fdae04f6951e63624cbd316a677cad529bbe4e97b9144e4bc06c4afd1de55dd3e1175f90423847a230d34dfb71ed56f2965a7f6c72e6aa33c24c303fd67745d632656c5ef90bec80f4f5d1daa251988826cef375c81c36bf457e09687056f924677cb0bccf98dff81e014ce25f2d132497923e267363963cdf4302c5049d63131dc03fd95f65d8b6aa5934f817252c028c90f56d413b9d5d10d89790707dae2fabb249f649929927c21dd71e3f656826de5451c5da375aadecbd59d5ebf3a31fae65ac1b316a1611f1b276b26530f58d7247df459ce1f86db1d734f6f811932f042cee45d0e455306d01081bc3384f82c5fb2aacaa19d89cdfa46cc916eac61121475ba2e6191b4feecbe1789717021a158ace5d06744b40f551076b67cd63af60007f8c99876e1424883a45ec49d497ddaf808a5521ca74a999ab0b3c7aa9c80f85e93977ec61ce68b20307a1a81f71ca645b568fcd319ccbb5f651e87b707d37c39e15f945ea69e2f7c7d2ccc85b7e654c07e96f0636ae4044fe0e38590b431795ad0f8647bdd613713ada493cc17efd313206380e6a685b8198475bbd021c6e9d94daab2214947127506073e44d5408ba166c512a0b86805d07f5a44d3c41706be2bc15e712e55805248b92e8677d90f6d284d1d6ffaff2c430657042a0e82624fa3717b06cc0a6fd12230ea586dae83019fb9e06034ed2803c98d554b93c9a52348cafff75c40174a91f9ae6b8647854a156029f0b88b83316663ce574a4978277bb6bb27a31085634b6ec78864b6d8201c7e93903d75815067e378289a3d072ae172dafa6a452470f8d645bebfad9779594fc0784bb764a22e3a8181d93db7bf97893c414217a618ccb14caa9e92e8c61673afc9583662e812adba1f87a9c68202d60e909efab43c42c0cb00695fc7f1ffe67c75ca894c3c51e1e5e731360199e600f6ced9a87b2a6a87e70bf251bb5075ab222138288164b2eda727515ea7de12e2496d4fe42ea8d1a120c03cf9c50622c2afe4acb0dad98fd62d07ab4e828a94495f6d1ab973982c7ccbe6c1fae02788e4422ae22282fa49cbdb04ba54a7a238c6fc41187451383460762c06d1c8a72b9cd718866ad4b689e10c9a8c38fe5ef045bd785b01e980fc82c7e3532ce81876b778dd9f1ceeba4478e86411fb6fdd790683916ca832592485093644e8760cd7b4c01dba1ccc82b661bf13f0e3f34acd6b88";

    /// @notice Gets merkle root hash of drive with a replacement
    /// @param _position position of _drive
    /// @param _logSizeOfReplacement log2 of size the replacement
    /// @param _logSizeOfFullDrive log2 of size the full drive, which can be the entire machine
    /// @param _replacement hash of the replacement
    /// @param siblings of replacement that merkle root can be calculated
    function getRootAfterReplacementInDrive(
        uint256 _position,
        uint256 _logSizeOfReplacement,
        uint256 _logSizeOfFullDrive,
        bytes32 _replacement,
        bytes32[] calldata siblings
    ) public pure returns (bytes32) {
        require(
            _logSizeOfFullDrive >= _logSizeOfReplacement && _logSizeOfReplacement >= 3 && _logSizeOfFullDrive <= 64,
            "3 <= logSizeOfReplacement <= logSizeOfFullDrive <= 64"
        );

        uint256 size = 1 << _logSizeOfReplacement;

        require(((size - 1) & _position) == 0, "Position is not aligned");
        require(siblings.length == _logSizeOfFullDrive - _logSizeOfReplacement, "Proof length does not match");

        for (uint256 i; i < siblings.length; i++) {
            if ((_position & (size << i)) == 0) {
                _replacement = keccak256(abi.encodePacked(_replacement, siblings[i]));
            } else {
                _replacement = keccak256(abi.encodePacked(siblings[i], _replacement));
            }
        }

        return _replacement;
    }

    /// @notice Gets precomputed hash of zero in empty tree hashes
    /// @param _index of hash wanted
    /// @dev first index is keccak(0), second index is keccak(keccak(0), keccak(0))
    function getEmptyTreeHashAtIndex(uint256 _index) public pure returns (bytes32) {
        uint256 start = _index * 32;
        require(EMPTY_TREE_SIZE >= start + 32, "index out of bounds");
        bytes32 hashedZeros;
        bytes memory zeroTree = EMPTY_TREE_HASHES;

        // first word is length, then skip index words
        assembly {
            hashedZeros := mload(add(add(zeroTree, 0x20), start))
        }
        return hashedZeros;
    }

    /// @notice get merkle root of generic array of bytes
    /// @param _data array of bytes to be merklelized
    /// @param _log2Size log2 of total size of the drive
    /// @dev _data is padded with zeroes until is multiple of 8
    /// @dev root is completed with zero tree until log2size is complete
    /// @dev hashes are taken word by word (8 bytes by 8 bytes)
    function getMerkleRootFromBytes(bytes calldata _data, uint256 _log2Size) public pure returns (bytes32) {
        require(_log2Size >= 3 && _log2Size <= 64, "range of log2Size: [3,64]");

        // if _data is empty return pristine drive of size log2size
        if (_data.length == 0) return getEmptyTreeHashAtIndex(_log2Size - 3);

        // total size of the drive in words
        uint256 size = 1 << (_log2Size - 3);
        require(size << L_WORD_SIZE >= _data.length, "data is bigger than drive");
        // the stack depth is log2(_data.length / 8) + 2
        uint256 stack_depth = 2 + ((_data.length) >> L_WORD_SIZE).getLog2Floor();
        bytes32[] memory stack = new bytes32[](stack_depth);

        uint256 numOfHashes; // total number of hashes on stack (counting levels)
        uint256 stackLength; // total length of stack
        uint256 numOfJoins; // number of hashes of the same level on stack
        uint256 topStackLevel; // hash level of the top of the stack

        while (numOfHashes < size) {
            if ((numOfHashes << L_WORD_SIZE) < _data.length) {
                // we still have words to hash
                stack[stackLength] = getHashOfWordAtIndex(_data, numOfHashes);
                numOfHashes++;

                numOfJoins = numOfHashes;
            } else {
                // since padding happens in hashOfWordAtIndex function
                // we only need to complete the stack with pre-computed
                // hash(0), hash(hash(0),hash(0)) and so on
                topStackLevel = numOfHashes.ctz();

                stack[stackLength] = getEmptyTreeHashAtIndex(topStackLevel);

                //Empty Tree Hash summarizes many hashes
                numOfHashes = numOfHashes + (1 << topStackLevel);
                numOfJoins = numOfHashes >> topStackLevel;
            }

            stackLength++;

            // while there are joins, hash top of stack together
            while (numOfJoins & 1 == 0) {
                bytes32 h2 = stack[stackLength - 1];
                bytes32 h1 = stack[stackLength - 2];

                stack[stackLength - 2] = keccak256(abi.encodePacked(h1, h2));
                stackLength = stackLength - 1; // remove hashes from stack

                numOfJoins = numOfJoins >> 1;
            }
        }
        require(stackLength == 1, "stack error");

        return stack[0];
    }

    /// @notice Get the hash of a word in an array of bytes
    /// @param _data array of bytes
    /// @param _wordIndex index of word inside the bytes to get the hash of
    /// @dev if word is incomplete (< 8 bytes) it gets padded with zeroes
    function getHashOfWordAtIndex(bytes calldata _data, uint256 _wordIndex) public pure returns (bytes32) {
        uint256 start = _wordIndex << L_WORD_SIZE;
        uint256 end = start + (1 << L_WORD_SIZE);

        // TODO: in .lua this just returns zero, but this might be more consistent
        require(start <= _data.length, "word out of bounds");

        if (end <= _data.length) {
            return keccak256(abi.encodePacked(_data[start:end]));
        }

        // word is incomplete
        // fill paddedSlice with incomplete words - the rest is going to be bytes(0)
        bytes memory paddedSlice = new bytes(8);
        uint256 remaining = _data.length - start;

        for (uint256 i; i < remaining; i++) {
            paddedSlice[i] = _data[start + i];
        }

        return keccak256(paddedSlice);
    }

    /// @notice Calculate the root of Merkle tree from an array of power of 2 elements
    /// @param hashes The array containing power of 2 elements
    /// @return byte32 the root hash being calculated
    function calculateRootFromPowerOfTwo(bytes32[] memory hashes) public pure returns (bytes32) {
        // revert when the input is not of power of 2
        require((hashes.length).isPowerOf2(), "array len not power of 2");

        if (hashes.length == 1) {
            return hashes[0];
        } else {
            bytes32[] memory newHashes = new bytes32[](hashes.length >> 1);

            for (uint256 i; i < hashes.length; i += 2) {
                newHashes[i >> 1] = keccak256(abi.encodePacked(hashes[i], hashes[i + 1]));
            }

            return calculateRootFromPowerOfTwo(newHashes);
        }
    }
}

library OutputEncoding {
    /// @notice Encode a notice.
    /// @param notice The notice
    /// @return The encoded output
    function encodeNotice(
        bytes calldata notice
    ) internal pure returns (bytes memory) {
        return abi.encode(notice);
    }

    /// @notice Encode a voucher.
    /// @param destination The address that will receive the payload through a message call
    /// @param payload The payload, which—in the case of Solidity contracts—encodes a function call
    /// @return The encoded output
    function encodeVoucher(
        address destination,
        bytes calldata payload
    ) internal pure returns (bytes memory) {
        return abi.encode(destination, payload);
    }
}

library LibOutputValidation {
    using CanonicalMachine for CanonicalMachine.Log2Size;

    /// @notice Raised when some `OutputValidityProof` variables does not match
    ///         the presented finalized epoch.
    error IncorrectEpochHash();

    /// @notice Raised when `OutputValidityProof` metadata memory range is NOT
    ///         contained in epoch's output memory range.
    error IncorrectOutputsEpochRootHash();

    /// @notice Raised when Merkle root of output hash is NOT contained
    ///         in the output metadata array memory range.
    error IncorrectOutputHashesRootHash();

    /// @notice Raised when epoch input index is NOT compatible with the
    ///         provided input index range.
    error InputIndexOutOfClaimBounds();

    /// @notice Make sure the output proof is valid, otherwise revert.
    /// @param v The output validity proof
    /// @param encodedOutput The encoded output
    /// @param epochHash The hash of the epoch in which the output was generated
    /// @param outputsEpochRootHash Either `v.vouchersEpochRootHash` (for vouchers)
    ///                             or `v.noticesEpochRootHash` (for notices)
    /// @param outputEpochLog2Size Either `EPOCH_VOUCHER_LOG2_SIZE` (for vouchers)
    ///                            or `EPOCH_NOTICE_LOG2_SIZE` (for notices)
    /// @param outputHashesLog2Size Either `VOUCHER_METADATA_LOG2_SIZE` (for vouchers)
    ///                             or `NOTICE_METADATA_LOG2_SIZE` (for notices)
    function validateEncodedOutput(
        OutputValidityProof calldata v,
        bytes memory encodedOutput,
        bytes32 epochHash,
        bytes32 outputsEpochRootHash,
        uint256 outputEpochLog2Size,
        uint256 outputHashesLog2Size
    ) internal pure {
        // prove that outputs hash is represented in a finalized epoch
        if (
            keccak256(
                abi.encodePacked(
                    v.vouchersEpochRootHash,
                    v.noticesEpochRootHash,
                    v.machineStateHash
                )
            ) != epochHash
        ) {
            revert IncorrectEpochHash();
        }

        // prove that output metadata memory range is contained in epoch's output memory range
        if (
            MerkleV2.getRootAfterReplacementInDrive(
                CanonicalMachine.getIntraMemoryRangePosition(
                    v.inputIndexWithinEpoch,
                    CanonicalMachine.KECCAK_LOG2_SIZE
                ),
                CanonicalMachine.KECCAK_LOG2_SIZE.uint64OfSize(),
                outputEpochLog2Size,
                v.outputHashesRootHash,
                v.outputHashesInEpochSiblings
            ) != outputsEpochRootHash
        ) {
            revert IncorrectOutputsEpochRootHash();
        }

        // The hash of the output is converted to bytes (abi.encode) and
        // treated as data. The metadata output memory range stores that data while
        // being indifferent to its contents. To prove that the received
        // output is contained in the metadata output memory range we need to
        // prove that x, where:
        // x = keccak(
        //          keccak(
        //              keccak(hashOfOutput[0:7]),
        //              keccak(hashOfOutput[8:15])
        //          ),
        //          keccak(
        //              keccak(hashOfOutput[16:23]),
        //              keccak(hashOfOutput[24:31])
        //          )
        //     )
        // is contained in it. We can't simply use hashOfOutput because the
        // log2size of the leaf is three (8 bytes) not  five (32 bytes)
        bytes32 merkleRootOfHashOfOutput = MerkleV2.getMerkleRootFromBytes(
            abi.encodePacked(keccak256(encodedOutput)),
            CanonicalMachine.KECCAK_LOG2_SIZE.uint64OfSize()
        );

        // prove that Merkle root of bytes(hashOfOutput) is contained
        // in the output metadata array memory range
        if (
            MerkleV2.getRootAfterReplacementInDrive(
                CanonicalMachine.getIntraMemoryRangePosition(
                    v.outputIndexWithinInput,
                    CanonicalMachine.KECCAK_LOG2_SIZE
                ),
                CanonicalMachine.KECCAK_LOG2_SIZE.uint64OfSize(),
                outputHashesLog2Size,
                merkleRootOfHashOfOutput,
                v.outputHashInOutputHashesSiblings
            ) != v.outputHashesRootHash
        ) {
            revert IncorrectOutputHashesRootHash();
        }
    }

    /// @notice Make sure the output proof is valid, otherwise revert.
    /// @param v The output validity proof
    /// @param destination The address that will receive the payload through a message call
    /// @param payload The payload, which—in the case of Solidity contracts—encodes a function call
    /// @param epochHash The hash of the epoch in which the output was generated
    function validateVoucher(
        OutputValidityProof calldata v,
        address destination,
        bytes calldata payload,
        bytes32 epochHash
    ) internal pure {
        bytes memory encodedVoucher = OutputEncoding.encodeVoucher(
            destination,
            payload
        );
        validateEncodedOutput(
            v,
            encodedVoucher,
            epochHash,
            v.vouchersEpochRootHash,
            CanonicalMachine.EPOCH_VOUCHER_LOG2_SIZE.uint64OfSize(),
            CanonicalMachine.VOUCHER_METADATA_LOG2_SIZE.uint64OfSize()
        );
    }

    /// @notice Make sure the output proof is valid, otherwise revert.
    /// @param v The output validity proof
    /// @param notice The notice
    /// @param epochHash The hash of the epoch in which the output was generated
    function validateNotice(
        OutputValidityProof calldata v,
        bytes calldata notice,
        bytes32 epochHash
    ) internal pure {
        bytes memory encodedNotice = OutputEncoding.encodeNotice(notice);
        validateEncodedOutput(
            v,
            encodedNotice,
            epochHash,
            v.noticesEpochRootHash,
            CanonicalMachine.EPOCH_NOTICE_LOG2_SIZE.uint64OfSize(),
            CanonicalMachine.NOTICE_METADATA_LOG2_SIZE.uint64OfSize()
        );
    }

    /// @notice Get the position of a voucher on the bit mask.
    /// @param voucher The index of voucher from those generated by such input
    /// @param input The index of the input in the DApp's input box
    /// @return Position of the voucher on the bit mask
    function getBitMaskPosition(
        uint256 voucher,
        uint256 input
    ) internal pure returns (uint256) {
        // voucher * 2 ** 128 + input
        // this shouldn't overflow because it is impossible to have > 2**128 vouchers
        // and because we are assuming there will be < 2 ** 128 inputs on the input box
        return (((voucher << 128) | input));
    }

    /// @notice Validate input index range and get the input index.
    /// @param v The output validity proof
    /// @param firstInputIndex The index of the first input of the epoch in the input box
    /// @param lastInputIndex The index of the last input of the epoch in the input box
    /// @return The index of the input in the DApp's input box
    /// @dev Reverts if epoch input index is not compatible with the provided input index range.
    function validateInputIndexRange(
        OutputValidityProof calldata v,
        uint256 firstInputIndex,
        uint256 lastInputIndex
    ) internal pure returns (uint256) {
        uint256 inputIndex = firstInputIndex + v.inputIndexWithinEpoch;

        if (inputIndex > lastInputIndex) {
            revert InputIndexOutOfClaimBounds();
        }

        return inputIndex;
    }
}

library Bitmask {
    /// @notice Set a bit in the bit mask
    function setBit(mapping(uint256 => uint256) storage bitmask, uint256 _bit, bool _value) public {
        // calculate the number of bits has been store in bitmask now
        uint256 positionOfMask = uint256(_bit / 256);
        uint256 positionOfBit = _bit % 256;

        if (_value) {
            bitmask[positionOfMask] = bitmask[positionOfMask] | (1 << positionOfBit);
        } else {
            bitmask[positionOfMask] = bitmask[positionOfMask] & ~(1 << positionOfBit);
        }
    }

    /// @notice Get a bit in the bit mask
    function getBit(mapping(uint256 => uint256) storage bitmask, uint256 _bit) public view returns (bool) {
        // calculate the number of bits has been store in bitmask now
        uint256 positionOfMask = uint256(_bit / 256);
        uint256 positionOfBit = _bit % 256;

        return ((bitmask[positionOfMask] & (1 << positionOfBit)) != 0);
    }
}

abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}

abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
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

interface IERC1155Receiver is IERC165 {
    /**
     * @dev Handles the receipt of a single ERC1155 token type. This function is
     * called at the end of a `safeTransferFrom` after the balance has been updated.
     *
     * NOTE: To accept the transfer, this must return
     * `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
     * (i.e. 0xf23a6e61, or its own function selector).
     *
     * @param operator The address which initiated the transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param id The ID of the token being transferred
     * @param value The amount of tokens being transferred
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
     */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    /**
     * @dev Handles the receipt of a multiple ERC1155 token types. This function
     * is called at the end of a `safeBatchTransferFrom` after the balances have
     * been updated.
     *
     * NOTE: To accept the transfer(s), this must return
     * `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
     * (i.e. 0xbc197c81, or its own function selector).
     *
     * @param operator The address which initiated the batch transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param ids An array containing ids of each token being transferred (order and length must match values array)
     * @param values An array containing amounts of each token being transferred (order and length must match ids array)
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4);
}

abstract contract ERC1155Receiver is ERC165, IERC1155Receiver {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}

contract ERC1155Holder is ERC1155Receiver {
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}

interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract ERC721Holder is IERC721Receiver {
    /**
     * @dev See {IERC721Receiver-onERC721Received}.
     *
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
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

struct OutputValidityProof {
    uint64 inputIndexWithinEpoch;
    uint64 outputIndexWithinInput;
    bytes32 outputHashesRootHash;
    bytes32 vouchersEpochRootHash;
    bytes32 noticesEpochRootHash;
    bytes32 machineStateHash;
    bytes32[] outputHashInOutputHashesSiblings;
    bytes32[] outputHashesInEpochSiblings;
}

struct Proof {
    OutputValidityProof validity;
    bytes context;
}

interface ICartesiDApp {
    // Events

    /// @notice The DApp has migrated to another consensus contract.
    /// @param newConsensus The new consensus contract
    /// @dev MUST be triggered on a successful call to `migrateToConsensus`.
    event NewConsensus(IConsensus newConsensus);

    /// @notice A voucher was executed from the DApp.
    /// @param voucherId A number that uniquely identifies the voucher
    ///                  amongst all vouchers emitted by this DApp
    event VoucherExecuted(uint256 voucherId);

    // Permissioned functions

    /// @notice Migrate the DApp to a new consensus.
    /// @param _newConsensus The new consensus
    /// @dev Can only be called by the DApp owner.
    function migrateToConsensus(IConsensus _newConsensus) external;

    // Permissionless functions

    /// @notice Try to execute a voucher.
    ///
    /// Reverts if voucher was already successfully executed.
    ///
    /// @param _destination The address that will receive the payload through a message call
    /// @param _payload The payload, which—in the case of Solidity contracts—encodes a function call
    /// @param _proof The proof used to validate the voucher against
    ///               a claim submitted by the current consensus contract
    /// @return Whether the execution was successful or not
    /// @dev On a successful execution, emits a `VoucherExecuted` event.
    ///      Execution of already executed voucher will raise a `VoucherReexecutionNotAllowed` error.
    function executeVoucher(
        address _destination,
        bytes calldata _payload,
        Proof calldata _proof
    ) external returns (bool);

    /// @notice Check whether a voucher has been executed.
    /// @param _inputIndex The index of the input in the input box
    /// @param _outputIndexWithinInput The index of output emitted by the input
    /// @return Whether the voucher has been executed before
    function wasVoucherExecuted(
        uint256 _inputIndex,
        uint256 _outputIndexWithinInput
    ) external view returns (bool);

    /// @notice Validate a notice.
    /// @param _notice The notice
    /// @param _proof Data for validating outputs
    /// @return Whether the notice is valid or not
    function validateNotice(
        bytes calldata _notice,
        Proof calldata _proof
    ) external view returns (bool);

    /// @notice Get the DApp's template hash.
    /// @return The DApp's template hash
    function getTemplateHash() external view returns (bytes32);

    /// @notice Get the current consensus.
    /// @return The current consensus
    function getConsensus() external view returns (IConsensus);
}

contract CartesiDApp is
    ICartesiDApp,
    Ownable,
    ERC721Holder,
    ERC1155Holder,
    ReentrancyGuard
{
    using Bitmask for mapping(uint256 => uint256);
    using LibOutputValidation for OutputValidityProof;

    /// @notice Raised when executing an already executed voucher.
    error VoucherReexecutionNotAllowed();

    /// @notice Raised when the transfer fails.
    error EtherTransferFailed();

    /// @notice Raised when a mehtod is not called by DApp itself.
    error OnlyDApp();

    /// @notice The initial machine state hash.
    /// @dev See the `getTemplateHash` function.
    bytes32 internal immutable templateHash;

    /// @notice The executed voucher bitmask, which keeps track of which vouchers
    ///         were executed already in order to avoid re-execution.
    /// @dev See the `wasVoucherExecuted` function.
    mapping(uint256 => uint256) internal voucherBitmask;

    /// @notice The current consensus contract.
    /// @dev See the `getConsensus` and `migrateToConsensus` functions.
    IConsensus internal consensus;

    /// @notice Creates a `CartesiDApp` contract.
    /// @param _consensus The initial consensus contract
    /// @param _owner The initial DApp owner
    /// @param _templateHash The initial machine state hash
    /// @dev Calls the `join` function on `_consensus`.
    constructor(IConsensus _consensus, address _owner, bytes32 _templateHash) {
        transferOwnership(_owner);
        templateHash = _templateHash;
        consensus = _consensus;

        _consensus.join();
    }

    function executeVoucher(
        address _destination,
        bytes calldata _payload,
        Proof calldata _proof
    ) external override nonReentrant returns (bool) {
        bytes32 epochHash;
        uint256 firstInputIndex;
        uint256 lastInputIndex;
        uint256 inputIndex;

        // query the current consensus for the desired claim
        (epochHash, firstInputIndex, lastInputIndex) = getClaim(_proof.context);

        // validate input index range and calculate the input index
        // based on the input index range provided by the consensus
        inputIndex = _proof.validity.validateInputIndexRange(
            firstInputIndex,
            lastInputIndex
        );

        // reverts if proof isn't valid
        _proof.validity.validateVoucher(_destination, _payload, epochHash);

        uint256 voucherPosition = LibOutputValidation.getBitMaskPosition(
            _proof.validity.outputIndexWithinInput,
            inputIndex
        );

        // check if voucher has been executed
        if (_wasVoucherExecuted(voucherPosition)) {
            revert VoucherReexecutionNotAllowed();
        }

        // execute voucher
        (bool succ, ) = _destination.call(_payload);

        // if properly executed, mark it as executed and emit event
        if (succ) {
            voucherBitmask.setBit(voucherPosition, true);
            emit VoucherExecuted(voucherPosition);
        }

        return succ;
    }

    function wasVoucherExecuted(
        uint256 _inputIndex,
        uint256 _outputIndexWithinInput
    ) external view override returns (bool) {
        uint256 voucherPosition = LibOutputValidation.getBitMaskPosition(
            _outputIndexWithinInput,
            _inputIndex
        );
        return _wasVoucherExecuted(voucherPosition);
    }

    function _wasVoucherExecuted(
        uint256 _voucherPosition
    ) internal view returns (bool) {
        return voucherBitmask.getBit(_voucherPosition);
    }

    function validateNotice(
        bytes calldata _notice,
        Proof calldata _proof
    ) external view override returns (bool) {
        bytes32 epochHash;
        uint256 firstInputIndex;
        uint256 lastInputIndex;

        // query the current consensus for the desired claim
        (epochHash, firstInputIndex, lastInputIndex) = getClaim(_proof.context);

        // validate the epoch input index based on the input index range
        // provided by the consensus
        _proof.validity.validateInputIndexRange(
            firstInputIndex,
            lastInputIndex
        );

        // reverts if proof isn't valid
        _proof.validity.validateNotice(_notice, epochHash);

        return true;
    }

    /// @notice Retrieve a claim about the DApp from the current consensus.
    ///         The encoding of `_proofContext` might vary depending on the implementation.
    /// @param _proofContext Data for retrieving the desired claim
    /// @return The claimed epoch hash
    /// @return The index of the first input of the epoch in the input box
    /// @return The index of the last input of the epoch in the input box
    function getClaim(
        bytes calldata _proofContext
    ) internal view returns (bytes32, uint256, uint256) {
        return consensus.getClaim(address(this), _proofContext);
    }

    function migrateToConsensus(
        IConsensus _newConsensus
    ) external override onlyOwner {
        consensus = _newConsensus;

        _newConsensus.join();

        emit NewConsensus(_newConsensus);
    }

    function getTemplateHash() external view override returns (bytes32) {
        return templateHash;
    }

    function getConsensus() external view override returns (IConsensus) {
        return consensus;
    }

    /// @notice Accept Ether transfers.
    /// @dev If you wish to transfer Ether to a DApp while informing
    ///      the DApp backend of it, then please do so through the Ether portal contract.
    receive() external payable {}

    /// @notice Transfer some amount of Ether to some recipient.
    /// @param _receiver The address which will receive the amount of Ether
    /// @param _value The amount of Ether to be transferred in Wei
    /// @dev This function can only be called by the DApp itself through vouchers.
    ///      If this method is not called by DApp itself, `OnlyDApp` error is raised.
    ///      If the transfer fails, `EtherTransferFailed` error is raised.
    function withdrawEther(address _receiver, uint256 _value) external {
        if (msg.sender != address(this)) {
            revert OnlyDApp();
        }

        (bool sent, ) = _receiver.call{value: _value}("");

        if (!sent) {
            revert EtherTransferFailed();
        }
    }
}