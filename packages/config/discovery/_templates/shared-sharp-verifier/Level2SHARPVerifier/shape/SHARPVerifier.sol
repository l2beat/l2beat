// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

contract PrimeFieldElement0 {
    uint256 internal constant K_MODULUS =
        0x800000000000011000000000000000000000000000000000000000000000001;
    uint256 internal constant K_MONTGOMERY_R =
        0x7fffffffffffdf0ffffffffffffffffffffffffffffffffffffffffffffffe1;
    uint256 internal constant K_MONTGOMERY_R_INV =
        0x40000000000001100000000000012100000000000000000000000000000000;
    uint256 internal constant GENERATOR_VAL = 3;
    uint256 internal constant ONE_VAL = 1;

    function fromMontgomery(uint256 val) internal pure returns (uint256 res) {
        // uint256 res = fmul(val, kMontgomeryRInv);
        assembly {
            res := mulmod(val, K_MONTGOMERY_R_INV, K_MODULUS)
        }
        return res;
    }

    function fromMontgomeryBytes(bytes32 bs) internal pure returns (uint256) {
        // Assuming bs is a 256bit bytes object, in Montgomery form, it is read into a field
        // element.
        uint256 res = uint256(bs);
        return fromMontgomery(res);
    }

    function toMontgomeryInt(uint256 val) internal pure returns (uint256 res) {
        //uint256 res = fmul(val, kMontgomeryR);
        assembly {
            res := mulmod(val, K_MONTGOMERY_R, K_MODULUS)
        }
        return res;
    }

    function fmul(uint256 a, uint256 b) internal pure returns (uint256 res) {
        //uint256 res = mulmod(a, b, kModulus);
        assembly {
            res := mulmod(a, b, K_MODULUS)
        }
        return res;
    }

    function fadd(uint256 a, uint256 b) internal pure returns (uint256 res) {
        // uint256 res = addmod(a, b, kModulus);
        assembly {
            res := addmod(a, b, K_MODULUS)
        }
        return res;
    }

    function fsub(uint256 a, uint256 b) internal pure returns (uint256 res) {
        // uint256 res = addmod(a, kModulus - b, kModulus);
        assembly {
            res := addmod(a, sub(K_MODULUS, b), K_MODULUS)
        }
        return res;
    }

    function fpow(uint256 val, uint256 exp) internal view returns (uint256) {
        return expmod(val, exp, K_MODULUS);
    }

    function expmod(
        uint256 base,
        uint256 exponent,
        uint256 modulus
    ) private view returns (uint256 res) {
        assembly {
            let p := mload(0x40)
            mstore(p, 0x20) // Length of Base.
            mstore(add(p, 0x20), 0x20) // Length of Exponent.
            mstore(add(p, 0x40), 0x20) // Length of Modulus.
            mstore(add(p, 0x60), base) // Base.
            mstore(add(p, 0x80), exponent) // Exponent.
            mstore(add(p, 0xa0), modulus) // Modulus.
            // Call modexp precompile.
            if iszero(staticcall(gas(), 0x05, p, 0xc0, p, 0x20)) {
                revert(0, 0)
            }
            res := mload(p)
        }
    }

    function inverse(uint256 val) internal view returns (uint256) {
        return expmod(val, K_MODULUS - 2, K_MODULUS);
    }
}

contract CairoBootloaderProgramSize {
    uint256 internal constant PROGRAM_SIZE = 728;
}

interface Identity {
    /*
      Allows a caller to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
}

contract PageInfo {
    uint256 public constant PAGE_INFO_SIZE = 3;
    // PAGE_INFO_SIZE_IN_BYTES cannot reference PAGE_INFO_SIZE as only direct constants are
    // supported in assembly.
    uint256 public constant PAGE_INFO_SIZE_IN_BYTES = 3 * 32;

    uint256 public constant PAGE_INFO_ADDRESS_OFFSET = 0;
    uint256 public constant PAGE_INFO_SIZE_OFFSET = 1;
    uint256 public constant PAGE_INFO_HASH_OFFSET = 2;

    // A regular page entry is a (address, value) pair stored as 2 uint256 words.
    uint256 internal constant MEMORY_PAIR_SIZE = 2;
}

contract CpuPublicInputOffsetsBase is PageInfo {
    // The following constants are offsets of data expected in the public input.
    uint256 internal constant OFFSET_LOG_N_STEPS = 0;
    uint256 internal constant OFFSET_RC_MIN = 1;
    uint256 internal constant OFFSET_RC_MAX = 2;
    uint256 internal constant OFFSET_LAYOUT_CODE = 3;
    uint256 internal constant OFFSET_PROGRAM_BEGIN_ADDR = 4;
    uint256 internal constant OFFSET_PROGRAM_STOP_PTR = 5;
    uint256 internal constant OFFSET_EXECUTION_BEGIN_ADDR = 6;
    uint256 internal constant OFFSET_EXECUTION_STOP_PTR = 7;
    uint256 internal constant OFFSET_OUTPUT_BEGIN_ADDR = 8;
    uint256 internal constant OFFSET_OUTPUT_STOP_PTR = 9;
    uint256 internal constant OFFSET_PEDERSEN_BEGIN_ADDR = 10;
    uint256 internal constant OFFSET_PEDERSEN_STOP_PTR = 11;
    uint256 internal constant OFFSET_RANGE_CHECK_BEGIN_ADDR = 12;
    uint256 internal constant OFFSET_RANGE_CHECK_STOP_PTR = 13;

    // The program segment starts from 1, so that memory address 0 is kept for the null pointer.
    uint256 internal constant INITIAL_PC = 1;
    // The first Cairo instructions are:
    //   ap += n_args; call main; jmp rel 0.
    // As the first two instructions occupy 2 cells each, the "jmp rel 0" instruction is at
    // offset 4 relative to INITIAL_PC.
    uint256 internal constant FINAL_PC = INITIAL_PC + 4;
}

interface IFactRegistry {
    /*
      Returns true if the given fact was previously registered in the contract.
    */
    function isValid(bytes32 fact) external view returns (bool);
}

interface IQueryableFactRegistry is IFactRegistry {
    /*
      Returns true if at least one fact has been registered.
    */
    function hasRegisteredFact() external view returns (bool);
}

contract FactRegistry is IQueryableFactRegistry {
    // Mapping: fact hash -> true.
    mapping(bytes32 => bool) private verifiedFact;

    // Indicates whether the Fact Registry has at least one fact registered.
    bool anyFactRegistered = false;

    /*
      Checks if a fact was registered.
    */
    function isValid(bytes32 fact) external view virtual override returns (bool) {
        return internalIsValid(fact);
    }

    /*
      The internal implementation that checks if the fact was registered.
    */
    function internalIsValid(bytes32 fact) internal view virtual returns (bool) {
        return verifiedFact[fact];
    }

    function registerFact(bytes32 factHash) internal {
        // This function stores the fact hash in the mapping.
        verifiedFact[factHash] = true;

        // Mark first time off.
        if (!anyFactRegistered) {
            anyFactRegistered = true;
        }
    }

    /*
      Indicates whether at least one fact was registered.
    */
    function hasRegisteredFact() external view override returns (bool) {
        return anyFactRegistered;
    }
}

library Addresses {
    /*
      Note: isContract function has some known limitation.
      See https://github.com/OpenZeppelin/
      openzeppelin-contracts/blob/master/contracts/utils/Address.sol.
    */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function performEthTransfer(address recipient, uint256 amount) internal {
        if (amount == 0) return;
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
}

contract ReferableFactRegistry is FactRegistry {
    IFactRegistry public referenceFactRegistry;
    uint256 public referralExpirationTime;
    using Addresses for address;

    constructor(address refFactRegistry, uint256 referralDurationSeconds) public {
        // Allow 0 address, i.e. no referral.
        if (refFactRegistry != address(0)) {
            referenceFactRegistry = IFactRegistry(refFactRegistry);
            // NOLINTNEXTLINE: no-block-members.
            referralExpirationTime = block.timestamp + referralDurationSeconds;
            require(referralExpirationTime >= block.timestamp, "DURATION_WRAP_AROUND");
            require(refFactRegistry.isContract(), "REFERENCE_NOT_CONTRACT");
            require(refFactRegistry != address(this), "SELF_ASSIGNMENT");

            // NOLINTNEXTLINE: reentrancy-benign no-low-level-calls.
            (bool success, ) = refFactRegistry.staticcall(
                abi.encodeWithSelector(
                    IFactRegistry(refFactRegistry).isValid.selector,
                    bytes32(0x0)
                )
            );
            require(success, "REFERENCE_NOT_FACT_REGISTRY");
        }
    }

    /*
      Checks if a fact was registered.
    */
    function isValid(bytes32 fact) external view virtual override returns (bool) {
        if (internalIsValid(fact)) {
            return true;
        }
        return isValidOnReference(fact);
    }

    /*
      Checks if the fact is stored in the local fact registry.
    */
    function localIsValid(bytes32 fact) external view returns (bool) {
        return internalIsValid(fact);
    }

    function isReferralActive() internal view returns (bool) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp < referralExpirationTime;
    }

    /*
      Checks if a fact has been verified by the reference IFactRegistry.
    */
    function isValidOnReference(bytes32 fact) internal view returns (bool) {
        if (!isReferralActive()) {
            return false;
        }

        return referenceFactRegistry.isValid(fact);
    }
}

contract GpsOutputParser is CpuPublicInputOffsetsBase, ReferableFactRegistry {
    uint256 internal constant METADATA_TASKS_OFFSET = 1;
    uint256 internal constant METADATA_OFFSET_TASK_OUTPUT_SIZE = 0;
    uint256 internal constant METADATA_OFFSET_TASK_PROGRAM_HASH = 1;
    uint256 internal constant METADATA_OFFSET_TASK_N_TREE_PAIRS = 2;
    uint256 internal constant METADATA_TASK_HEADER_SIZE = 3;

    uint256 internal constant METADATA_OFFSET_TREE_PAIR_N_PAGES = 0;
    uint256 internal constant METADATA_OFFSET_TREE_PAIR_N_NODES = 1;

    uint256 internal constant NODE_STACK_OFFSET_HASH = 0;
    uint256 internal constant NODE_STACK_OFFSET_END = 1;
    // The size of each node in the node stack.
    uint256 internal constant NODE_STACK_ITEM_SIZE = 2;

    uint256 internal constant FIRST_CONTINUOUS_PAGE_INDEX = 1;

    /*
      Logs the program output fact together with the relevant continuous memory pages' hashes.
      The event is emitted for each registered fact.
    */
    event LogMemoryPagesHashes(bytes32 programOutputFact, bytes32[] pagesHashes);

    constructor(address refFactRegistry, uint256 referralDuration)
        public
        ReferableFactRegistry(refFactRegistry, referralDuration)
    {}

    /*
      Parses the GPS program output (using taskMetadata, which should be verified by the caller),
      and registers the facts of the tasks which were executed.

      The first entry in taskMetadata is the number of tasks.

      For each task, the structure is as follows:
        1. Size (including the size and hash fields).
        2. Program hash.
        3. The number of pairs in the Merkle tree structure (see below).
        4. The Merkle tree structure (see below).

      The fact of each task is stored as a (non-binary) Merkle tree.
      Leaf nodes are labeled with the hash of their data.
      Each non-leaf node is labeled as 1 + the hash of (node0, end0, node1, end1, ...)
      where node* is a label of a child children and end* is the total number of data words up to
      and including that node and its children (including the previous sibling nodes).
      We add 1 to the result of the hash to prevent an attacker from using a preimage of a leaf node
      as a preimage of a non-leaf hash and vice versa.

      The structure of the tree is passed as a list of pairs (n_pages, n_nodes), and the tree is
      constructed using a stack of nodes (initialized to an empty stack) by repeating for each pair:
      1. Add n_pages to the stack of nodes.
      2. Pop the top n_nodes, construct a parent node for them, and push it back to the stack.
      After applying the steps above, the stack much contain exactly one node, which will
      constitute the root of the Merkle tree.
      For example, [(2, 2)] will create a Merkle tree with a root and two direct children, while
      [(3, 2), (0, 2)] will create a Merkle tree with a root whose left child is a leaf and
      right child has two leaf children.

      Assumptions: taskMetadata and cairoAuxInput are verified externally.
    */
    function registerGpsFacts(
        uint256[] calldata taskMetadata,
        uint256[] memory publicMemoryPages,
        uint256 outputStartAddress
    ) internal {
        uint256 totalNumPages = publicMemoryPages[0];

        // Allocate some of the loop variables here to avoid the stack-too-deep error.
        uint256 task;
        uint256 nTreePairs;
        uint256 nTasks = taskMetadata[0];

        // Contains fact hash with the relevant memory pages' hashes.
        // Size is bounded from above with the total number of pages. Three extra places are
        // dedicated for the fact hash and the array address and length.
        uint256[] memory pageHashesLogData = new uint256[](totalNumPages + 3);
        // Relative address to the beginning of the memory pages' hashes in the array.
        pageHashesLogData[1] = 0x40;

        uint256 taskMetadataOffset = METADATA_TASKS_OFFSET;

        // Skip the 5 first output cells which contain the bootloader config, the number of tasks
        // and the size and program hash of the first task. curAddr points to the output of the
        // first task.
        uint256 curAddr = outputStartAddress + 5;

        // Skip the main page.
        uint256 curPage = FIRST_CONTINUOUS_PAGE_INDEX;

        // Bound the size of the stack by the total number of pages.
        // TODO(lior, 15/04/2022): Get a better bound on the size of the stack.
        uint256[] memory nodeStack = new uint256[](NODE_STACK_ITEM_SIZE * totalNumPages);

        // Copy to memory to workaround the "stack too deep" error.
        uint256[] memory taskMetadataCopy = taskMetadata;

        uint256[PAGE_INFO_SIZE] memory pageInfoPtr;
        assembly {
            // Skip the array length and the first page.
            pageInfoPtr := add(add(publicMemoryPages, 0x20), PAGE_INFO_SIZE_IN_BYTES)
        }

        // Register the fact for each task.
        for (task = 0; task < nTasks; task++) {
            uint256 curOffset = 0;
            uint256 firstPageOfTask = curPage;
            nTreePairs = taskMetadataCopy[taskMetadataOffset + METADATA_OFFSET_TASK_N_TREE_PAIRS];

            // Build the Merkle tree using a stack (see the function documentation) to compute
            // the fact.
            uint256 nodeStackLen = 0;
            for (uint256 treePair = 0; treePair < nTreePairs; treePair++) {
                // Add nPages to the stack of nodes.
                uint256 nPages = taskMetadataCopy[
                    taskMetadataOffset +
                        METADATA_TASK_HEADER_SIZE +
                        2 *
                        treePair +
                        METADATA_OFFSET_TREE_PAIR_N_PAGES
                ];

                // Ensure 'nPages' is bounded from above as a sanity check
                // (the bound is somewhat arbitrary).
                require(nPages < 2**20, "Invalid value of n_pages in tree structure.");

                for (uint256 i = 0; i < nPages; i++) {
                    (uint256 pageSize, uint256 pageHash) = pushPageToStack(
                        pageInfoPtr,
                        curAddr,
                        curOffset,
                        nodeStack,
                        nodeStackLen
                    );
                    pageHashesLogData[curPage - firstPageOfTask + 3] = pageHash;
                    curPage += 1;
                    nodeStackLen += 1;
                    curAddr += pageSize;
                    curOffset += pageSize;

                    assembly {
                        pageInfoPtr := add(pageInfoPtr, PAGE_INFO_SIZE_IN_BYTES)
                    }
                }

                // Pop the top n_nodes, construct a parent node for them, and push it back to the
                // stack.
                uint256 nNodes = taskMetadataCopy[
                    taskMetadataOffset +
                        METADATA_TASK_HEADER_SIZE +
                        2 *
                        treePair +
                        METADATA_OFFSET_TREE_PAIR_N_NODES
                ];
                if (nNodes != 0) {
                    nodeStackLen = constructNode(nodeStack, nodeStackLen, nNodes);
                }
            }
            require(nodeStackLen == 1, "Node stack must contain exactly one item.");

            uint256 programHash = taskMetadataCopy[
                taskMetadataOffset + METADATA_OFFSET_TASK_PROGRAM_HASH
            ];

            // Verify that the sizes of the pages correspond to the task output, to make
            // sure that the computed hash is indeed the hash of the entire output of the task.
            {
                uint256 outputSize = taskMetadataCopy[
                    taskMetadataOffset + METADATA_OFFSET_TASK_OUTPUT_SIZE
                ];

                require(
                    nodeStack[NODE_STACK_OFFSET_END] + 2 == outputSize,
                    "The sum of the page sizes does not match output size."
                );
            }

            uint256 programOutputFact = nodeStack[NODE_STACK_OFFSET_HASH];
            bytes32 fact = keccak256(abi.encode(programHash, programOutputFact));

            // Update taskMetadataOffset.
            taskMetadataOffset += METADATA_TASK_HEADER_SIZE + 2 * nTreePairs;

            {
                // Log the output Merkle root with the hashes of the relevant memory pages.
                // Instead of emit, we use log1 https://docs.soliditylang.org/en/v0.4.24/assembly.html,
                // https://docs.soliditylang.org/en/v0.6.2/abi-spec.html#use-of-dynamic-types.

                bytes32 logHash = keccak256("LogMemoryPagesHashes(bytes32,bytes32[])");
                assembly {
                    let buf := add(pageHashesLogData, 0x20)
                    // Number of memory pages that are relevant for this fact.
                    let length := sub(curPage, firstPageOfTask)
                    mstore(buf, programOutputFact)
                    mstore(add(buf, 0x40), length)
                    log1(buf, mul(add(length, 3), 0x20), logHash)
                }
            }
            registerFact(fact);

            // Move curAddr to the output of the next task (skipping the size and hash fields).
            curAddr += 2;
        }

        require(totalNumPages == curPage, "Not all memory pages were processed.");
    }

    /*
      Push one page (curPage) to the top of the node stack.
      curAddr is the memory address, curOffset is the offset from the beginning of the task output.
      Verifies that the page has the right start address and returns the page size and the page
      hash.
    */
    function pushPageToStack(
        uint256[PAGE_INFO_SIZE] memory pageInfoPtr,
        uint256 curAddr,
        uint256 curOffset,
        uint256[] memory nodeStack,
        uint256 nodeStackLen
    ) private pure returns (uint256 pageSize, uint256 pageHash) {
        // Read the first address, page size and hash.
        uint256 pageAddr = pageInfoPtr[PAGE_INFO_ADDRESS_OFFSET];
        pageSize = pageInfoPtr[PAGE_INFO_SIZE_OFFSET];
        pageHash = pageInfoPtr[PAGE_INFO_HASH_OFFSET];

        // Ensure 'pageSize' is bounded as a sanity check (the bound is somewhat arbitrary).
        require(pageSize < 2**30, "Invalid page size.");
        require(pageAddr == curAddr, "Invalid page address.");

        nodeStack[NODE_STACK_ITEM_SIZE * nodeStackLen + NODE_STACK_OFFSET_END] =
            curOffset +
            pageSize;
        nodeStack[NODE_STACK_ITEM_SIZE * nodeStackLen + NODE_STACK_OFFSET_HASH] = pageHash;
    }

    /*
      Pops the top nNodes nodes from the stack and pushes one parent node instead.
      Returns the new value of nodeStackLen.
    */
    function constructNode(
        uint256[] memory nodeStack,
        uint256 nodeStackLen,
        uint256 nNodes
    ) private pure returns (uint256) {
        require(nNodes <= nodeStackLen, "Invalid value of n_nodes in tree structure.");
        // The end of the node is the end of the last child.
        uint256 newNodeEnd = nodeStack[
            NODE_STACK_ITEM_SIZE * (nodeStackLen - 1) + NODE_STACK_OFFSET_END
        ];
        uint256 newStackLen = nodeStackLen - nNodes;
        // Compute node hash.
        uint256 nodeStart = 0x20 + newStackLen * NODE_STACK_ITEM_SIZE * 0x20;
        uint256 newNodeHash;
        assembly {
            newNodeHash := keccak256(
                add(nodeStack, nodeStart),
                mul(
                    nNodes,
                    // NODE_STACK_ITEM_SIZE * 0x20 =
                    0x40
                )
            )
        }

        nodeStack[NODE_STACK_ITEM_SIZE * newStackLen + NODE_STACK_OFFSET_END] = newNodeEnd;
        // Add one to the new node hash to distinguish it from the hash of a leaf (a page).
        nodeStack[NODE_STACK_ITEM_SIZE * newStackLen + NODE_STACK_OFFSET_HASH] = newNodeHash + 1;
        return newStackLen + 1;
    }
}

contract GpsStatementVerifier is
    GpsOutputParser,
    Identity,
    CairoBootloaderProgramSize,
    PrimeFieldElement0
{
    CairoBootloaderProgram bootloaderProgramContractAddress;
    MemoryPageFactRegistry memoryPageFactRegistry;
    CairoVerifierContract[] cairoVerifierContractAddresses;

    uint256 internal constant N_BUILTINS = 9;
    uint256 internal constant N_MAIN_ARGS = N_BUILTINS;
    uint256 internal constant N_MAIN_RETURN_VALUES = N_BUILTINS;
    // Cairo verifier program hash.
    uint256 immutable hashedSupportedCairoVerifiers_;
    // Simple bootloader program hash.
    uint256 immutable simpleBootloaderProgramHash_;

    /*
      Constructs an instance of GpsStatementVerifier.
      bootloaderProgramContract is the address of the bootloader program contract
      and cairoVerifierContracts is a list of cairoVerifiers indexed by their id.
    */
    constructor(
        address bootloaderProgramContract,
        address memoryPageFactRegistry_,
        address[] memory cairoVerifierContracts,
        uint256 hashedSupportedCairoVerifiers,
        uint256 simpleBootloaderProgramHash,
        address referenceVerifier,
        uint256 referralDurationSeconds
    ) public GpsOutputParser(referenceVerifier, referralDurationSeconds) {
        bootloaderProgramContractAddress = CairoBootloaderProgram(bootloaderProgramContract);
        memoryPageFactRegistry = MemoryPageFactRegistry(memoryPageFactRegistry_);
        cairoVerifierContractAddresses = new CairoVerifierContract[](cairoVerifierContracts.length);
        for (uint256 i = 0; i < cairoVerifierContracts.length; ++i) {
            cairoVerifierContractAddresses[i] = CairoVerifierContract(cairoVerifierContracts[i]);
        }
        hashedSupportedCairoVerifiers_ = hashedSupportedCairoVerifiers;
        simpleBootloaderProgramHash_ = simpleBootloaderProgramHash;
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_GpsStatementVerifier_2023_9";
    }

    /*
      Returns the bootloader config.
    */
    function getBootloaderConfig() external view returns (uint256, uint256) {
        return (simpleBootloaderProgramHash_, hashedSupportedCairoVerifiers_);
    }

    /*
      Verifies a proof and registers the corresponding facts.
      For the structure of cairoAuxInput, see cpu/CpuPublicInputOffsets.sol.
      taskMetadata is structured as follows:
      1. Number of tasks.
      2. For each task:
         1. Task output size (including program hash and size).
         2. Program hash.
    */
    function verifyProofAndRegister(
        uint256[] calldata proofParams,
        uint256[] calldata proof,
        uint256[] calldata taskMetadata,
        uint256[] calldata cairoAuxInput,
        uint256 cairoVerifierId
    ) external {
        require(
            cairoVerifierId < cairoVerifierContractAddresses.length,
            "cairoVerifierId is out of range."
        );
        CairoVerifierContract cairoVerifier = cairoVerifierContractAddresses[cairoVerifierId];

        // The values z and alpha are used only for the fact registration of the main page.
        // They are not part of the public input of CpuVerifier as they are computed there.
        // Take the relevant slice from 'cairoAuxInput'.
        uint256[] calldata cairoPublicInput = (
            cairoAuxInput[:cairoAuxInput.length -
                // z and alpha.
                2]
        );

        uint256[] memory publicMemoryPages;
        {
            (uint256 publicMemoryOffset, uint256 selectedBuiltins) = cairoVerifier.getLayoutInfo();

            require(cairoAuxInput.length > publicMemoryOffset, "Invalid cairoAuxInput length.");
            publicMemoryPages = (uint256[])(cairoPublicInput[publicMemoryOffset:]);
            uint256 nPages = publicMemoryPages[0];
            require(nPages < 10000, "Invalid nPages.");

            // Validate publicMemoryPages.length.
            // Each page has a page info and a cumulative product.
            // There is no 'page address' in the page info for page 0, but this 'free' slot is
            // used to store the number of pages.
            require(
                publicMemoryPages.length == nPages * (PAGE_INFO_SIZE + 1),
                "Invalid publicMemoryPages length."
            );

            // Process public memory.
            (
                uint256 publicMemoryLength,
                uint256 memoryHash,
                uint256 prod
            ) = registerPublicMemoryMainPage(taskMetadata, cairoAuxInput, selectedBuiltins);

            // Make sure the first page is valid.
            // If the size or the hash are invalid, it may indicate that there is a mismatch
            // between the prover and the verifier on the bootloader program or bootloader config.
            require(
                publicMemoryPages[PAGE_INFO_SIZE_OFFSET] == publicMemoryLength,
                "Invalid size for memory page 0."
            );
            require(
                publicMemoryPages[PAGE_INFO_HASH_OFFSET] == memoryHash,
                "Invalid hash for memory page 0."
            );
            require(
                publicMemoryPages[nPages * PAGE_INFO_SIZE] == prod,
                "Invalid cumulative product for memory page 0."
            );
        }

        // NOLINTNEXTLINE: reentrancy-benign.
        cairoVerifier.verifyProofExternal(proofParams, proof, (uint256[])(cairoPublicInput));

        registerGpsFacts(taskMetadata, publicMemoryPages, cairoAuxInput[OFFSET_OUTPUT_BEGIN_ADDR]);
    }

    /*
      Registers the fact for memory page 0, which includes:
      1. The bootloader program,
      2. Arguments and return values of main()
      3. Some of the data required for computing the task facts. which is represented in
         taskMetadata.
      Returns information on the registered fact.

      Arguments:
        selectedBuiltins: A bit-map of builtins that are present in the layout.
            See CairoVerifierContract.sol for more information.
        taskMetadata: Per task metadata.
        cairoAuxInput: Auxiliary input for the cairo verifier.

      Assumptions: cairoAuxInput is connected to the public input, which is verified by
      cairoVerifierContractAddresses.
      Guarantees: taskMetadata is consistent with the public memory, with some sanity checks.
    */
    function registerPublicMemoryMainPage(
        uint256[] calldata taskMetadata,
        uint256[] calldata cairoAuxInput,
        uint256 selectedBuiltins
    )
        private
        returns (
            uint256 publicMemoryLength,
            uint256 memoryHash,
            uint256 prod
        )
    {
        uint256 nTasks = taskMetadata[0];
        // Ensure 'nTasks' is bounded as a sanity check (the bound is somewhat arbitrary).
        require(nTasks < 2**30, "Invalid number of tasks.");

        // Public memory length.
        publicMemoryLength = (PROGRAM_SIZE +
            // return fp and pc =
            2 +
            N_MAIN_ARGS +
            N_MAIN_RETURN_VALUES +
            // Bootloader config size =
            2 +
            // Number of tasks cell =
            1 +
            2 *
            nTasks);
        uint256[] memory publicMemory = new uint256[](MEMORY_PAIR_SIZE * publicMemoryLength);

        uint256 offset = 0;

        // Write public memory, which is a list of pairs (address, value).
        {
            // Program segment.
            uint256[PROGRAM_SIZE] memory bootloaderProgram = bootloaderProgramContractAddress
                .getCompiledProgram();
            for (uint256 i = 0; i < bootloaderProgram.length; i++) {
                // Force that memory[i + INITIAL_PC] = bootloaderProgram[i].
                publicMemory[offset] = i + INITIAL_PC;
                publicMemory[offset + 1] = bootloaderProgram[i];
                offset += 2;
            }
        }

        {
            // Execution segment - Make sure [initial_fp - 2] = initial_fp and .
            // This is required for the "safe call" feature (that is, all "call" instructions will
            // return, even if the called function is malicious).
            // It guarantees that it's not possible to create a cycle in the call stack.
            uint256 initialFp = cairoAuxInput[OFFSET_EXECUTION_BEGIN_ADDR];
            require(initialFp >= 2, "Invalid execution begin address.");
            publicMemory[offset + 0] = initialFp - 2;
            publicMemory[offset + 1] = initialFp;
            // Make sure [initial_fp - 1] = 0.
            publicMemory[offset + 2] = initialFp - 1;
            publicMemory[offset + 3] = 0;
            offset += 4;

            // Execution segment: Enforce main's arguments and return values.
            // Note that the page hash depends on the order of the (address, value) pair in the
            // publicMemory and consequently the arguments must be written before the return values.
            uint256 returnValuesAddress = cairoAuxInput[OFFSET_EXECUTION_STOP_PTR] - N_BUILTINS;
            uint256 builtinSegmentInfoOffset = OFFSET_OUTPUT_BEGIN_ADDR;

            for (uint256 i = 0; i < N_BUILTINS; i++) {
                // Write argument address.
                publicMemory[offset] = initialFp + i;
                uint256 returnValueOffset = offset + 2 * N_BUILTINS;

                // Write return value address.
                publicMemory[returnValueOffset] = returnValuesAddress + i;

                // Write values.
                if ((selectedBuiltins & 1) != 0) {
                    // Set the argument to the builtin start pointer.
                    publicMemory[offset + 1] = cairoAuxInput[builtinSegmentInfoOffset];
                    // Set the return value to the builtin stop pointer.
                    publicMemory[returnValueOffset + 1] = cairoAuxInput[
                        builtinSegmentInfoOffset + 1
                    ];
                    builtinSegmentInfoOffset += 2;
                } else {
                    // Builtin is not present in layout, set the argument value and return value to 0.
                    publicMemory[offset + 1] = 0;
                    publicMemory[returnValueOffset + 1] = 0;
                }
                offset += 2;
                selectedBuiltins >>= 1;
            }
            require(selectedBuiltins == 0, "SELECTED_BUILTINS_VECTOR_IS_TOO_LONG");
            // Skip the return values which were already written.
            offset += 2 * N_BUILTINS;
        }

        // Program output.
        {
            {
                uint256 outputAddress = cairoAuxInput[OFFSET_OUTPUT_BEGIN_ADDR];
                // Force that memory[outputAddress] and memory[outputAddress + 1] contain the
                // bootloader config (which is 2 words size).
                publicMemory[offset + 0] = outputAddress;
                publicMemory[offset + 1] = simpleBootloaderProgramHash_;
                publicMemory[offset + 2] = outputAddress + 1;
                publicMemory[offset + 3] = hashedSupportedCairoVerifiers_;
                // Force that memory[outputAddress + 2] = nTasks.
                publicMemory[offset + 4] = outputAddress + 2;
                publicMemory[offset + 5] = nTasks;
                offset += 6;
                outputAddress += 3;

                uint256[] calldata taskMetadataSlice = taskMetadata[METADATA_TASKS_OFFSET:];
                for (uint256 task = 0; task < nTasks; task++) {
                    uint256 outputSize = taskMetadataSlice[METADATA_OFFSET_TASK_OUTPUT_SIZE];

                    // Ensure 'outputSize' is at least 2 and bounded from above as a sanity check
                    // (the bound is somewhat arbitrary).
                    require(2 <= outputSize && outputSize < 2**30, "Invalid task output size.");
                    uint256 programHash = taskMetadataSlice[METADATA_OFFSET_TASK_PROGRAM_HASH];
                    uint256 nTreePairs = taskMetadataSlice[METADATA_OFFSET_TASK_N_TREE_PAIRS];

                    // Ensure 'nTreePairs' is at least 1 and bounded from above as a sanity check
                    // (the bound is somewhat arbitrary).
                    require(
                        1 <= nTreePairs && nTreePairs < 2**20,
                        "Invalid number of pairs in the Merkle tree structure."
                    );
                    // Force that memory[outputAddress] = outputSize.
                    publicMemory[offset + 0] = outputAddress;
                    publicMemory[offset + 1] = outputSize;
                    // Force that memory[outputAddress + 1] = programHash.
                    publicMemory[offset + 2] = outputAddress + 1;
                    publicMemory[offset + 3] = programHash;
                    offset += 4;
                    outputAddress += outputSize;
                    taskMetadataSlice = taskMetadataSlice[METADATA_TASK_HEADER_SIZE +
                        2 *
                        nTreePairs:];
                }
                require(taskMetadataSlice.length == 0, "Invalid length of taskMetadata.");

                require(
                    cairoAuxInput[OFFSET_OUTPUT_STOP_PTR] == outputAddress,
                    "Inconsistent program output length."
                );
            }
        }

        require(publicMemory.length == offset, "Not all Cairo public inputs were written.");

        uint256 z = cairoAuxInput[cairoAuxInput.length - 2];
        uint256 alpha = cairoAuxInput[cairoAuxInput.length - 1];
        bytes32 factHash;
        (factHash, memoryHash, prod) = memoryPageFactRegistry.registerRegularMemoryPage(
            publicMemory,
            z,
            alpha,
            K_MODULUS
        );
    }
}