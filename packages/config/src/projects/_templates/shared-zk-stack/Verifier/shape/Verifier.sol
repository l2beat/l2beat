// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

interface IVerifier {
    /// @dev Verifies a zk-SNARK proof.
    /// @return A boolean value indicating whether the zk-SNARK proof is valid.
    /// Note: The function may revert execution instead of returning false in some cases.
    function verify(
        uint256[] calldata _publicInputs,
        uint256[] calldata _proof,
        uint256[] calldata _recursiveAggregationInput
    ) external view returns (bool);

    /// @notice Calculates a keccak256 hash of the runtime loaded verification keys.
    /// @return vkHash The keccak256 hash of the loaded verification keys.
    function verificationKeyHash() external pure returns (bytes32);
}

contract Verifier is IVerifier {
    /*//////////////////////////////////////////////////////////////
                             Verification keys
    //////////////////////////////////////////////////////////////*/

    // Memory slots from 0x000 to 0x200 are reserved for intermediate computations and call to precompiles.

    uint256 internal constant VK_GATE_SETUP_0_X_SLOT = 0x200 + 0x000;
    uint256 internal constant VK_GATE_SETUP_0_Y_SLOT = 0x200 + 0x020;
    uint256 internal constant VK_GATE_SETUP_1_X_SLOT = 0x200 + 0x040;
    uint256 internal constant VK_GATE_SETUP_1_Y_SLOT = 0x200 + 0x060;
    uint256 internal constant VK_GATE_SETUP_2_X_SLOT = 0x200 + 0x080;
    uint256 internal constant VK_GATE_SETUP_2_Y_SLOT = 0x200 + 0x0a0;
    uint256 internal constant VK_GATE_SETUP_3_X_SLOT = 0x200 + 0x0c0;
    uint256 internal constant VK_GATE_SETUP_3_Y_SLOT = 0x200 + 0x0e0;
    uint256 internal constant VK_GATE_SETUP_4_X_SLOT = 0x200 + 0x100;
    uint256 internal constant VK_GATE_SETUP_4_Y_SLOT = 0x200 + 0x120;
    uint256 internal constant VK_GATE_SETUP_5_X_SLOT = 0x200 + 0x140;
    uint256 internal constant VK_GATE_SETUP_5_Y_SLOT = 0x200 + 0x160;
    uint256 internal constant VK_GATE_SETUP_6_X_SLOT = 0x200 + 0x180;
    uint256 internal constant VK_GATE_SETUP_6_Y_SLOT = 0x200 + 0x1a0;
    uint256 internal constant VK_GATE_SETUP_7_X_SLOT = 0x200 + 0x1c0;
    uint256 internal constant VK_GATE_SETUP_7_Y_SLOT = 0x200 + 0x1e0;

    uint256 internal constant VK_GATE_SELECTORS_0_X_SLOT = 0x200 + 0x200;
    uint256 internal constant VK_GATE_SELECTORS_0_Y_SLOT = 0x200 + 0x220;
    uint256 internal constant VK_GATE_SELECTORS_1_X_SLOT = 0x200 + 0x240;
    uint256 internal constant VK_GATE_SELECTORS_1_Y_SLOT = 0x200 + 0x260;

    uint256 internal constant VK_PERMUTATION_0_X_SLOT = 0x200 + 0x280;
    uint256 internal constant VK_PERMUTATION_0_Y_SLOT = 0x200 + 0x2a0;
    uint256 internal constant VK_PERMUTATION_1_X_SLOT = 0x200 + 0x2c0;
    uint256 internal constant VK_PERMUTATION_1_Y_SLOT = 0x200 + 0x2e0;
    uint256 internal constant VK_PERMUTATION_2_X_SLOT = 0x200 + 0x300;
    uint256 internal constant VK_PERMUTATION_2_Y_SLOT = 0x200 + 0x320;
    uint256 internal constant VK_PERMUTATION_3_X_SLOT = 0x200 + 0x340;
    uint256 internal constant VK_PERMUTATION_3_Y_SLOT = 0x200 + 0x360;

    uint256 internal constant VK_LOOKUP_SELECTOR_X_SLOT = 0x200 + 0x380;
    uint256 internal constant VK_LOOKUP_SELECTOR_Y_SLOT = 0x200 + 0x3a0;

    uint256 internal constant VK_LOOKUP_TABLE_0_X_SLOT = 0x200 + 0x3c0;
    uint256 internal constant VK_LOOKUP_TABLE_0_Y_SLOT = 0x200 + 0x3e0;
    uint256 internal constant VK_LOOKUP_TABLE_1_X_SLOT = 0x200 + 0x400;
    uint256 internal constant VK_LOOKUP_TABLE_1_Y_SLOT = 0x200 + 0x420;
    uint256 internal constant VK_LOOKUP_TABLE_2_X_SLOT = 0x200 + 0x440;
    uint256 internal constant VK_LOOKUP_TABLE_2_Y_SLOT = 0x200 + 0x460;
    uint256 internal constant VK_LOOKUP_TABLE_3_X_SLOT = 0x200 + 0x480;
    uint256 internal constant VK_LOOKUP_TABLE_3_Y_SLOT = 0x200 + 0x4a0;

    uint256 internal constant VK_LOOKUP_TABLE_TYPE_X_SLOT = 0x200 + 0x4c0;
    uint256 internal constant VK_LOOKUP_TABLE_TYPE_Y_SLOT = 0x200 + 0x4e0;

    uint256 internal constant VK_RECURSIVE_FLAG_SLOT = 0x200 + 0x500;

    /*//////////////////////////////////////////////////////////////
                             Proof
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant PROOF_PUBLIC_INPUT = 0x200 + 0x520 + 0x000;

    uint256 internal constant PROOF_STATE_POLYS_0_X_SLOT = 0x200 + 0x520 + 0x020;
    uint256 internal constant PROOF_STATE_POLYS_0_Y_SLOT = 0x200 + 0x520 + 0x040;
    uint256 internal constant PROOF_STATE_POLYS_1_X_SLOT = 0x200 + 0x520 + 0x060;
    uint256 internal constant PROOF_STATE_POLYS_1_Y_SLOT = 0x200 + 0x520 + 0x080;
    uint256 internal constant PROOF_STATE_POLYS_2_X_SLOT = 0x200 + 0x520 + 0x0a0;
    uint256 internal constant PROOF_STATE_POLYS_2_Y_SLOT = 0x200 + 0x520 + 0x0c0;
    uint256 internal constant PROOF_STATE_POLYS_3_X_SLOT = 0x200 + 0x520 + 0x0e0;
    uint256 internal constant PROOF_STATE_POLYS_3_Y_SLOT = 0x200 + 0x520 + 0x100;

    uint256 internal constant PROOF_COPY_PERMUTATION_GRAND_PRODUCT_X_SLOT = 0x200 + 0x520 + 0x120;
    uint256 internal constant PROOF_COPY_PERMUTATION_GRAND_PRODUCT_Y_SLOT = 0x200 + 0x520 + 0x140;

    uint256 internal constant PROOF_LOOKUP_S_POLY_X_SLOT = 0x200 + 0x520 + 0x160;
    uint256 internal constant PROOF_LOOKUP_S_POLY_Y_SLOT = 0x200 + 0x520 + 0x180;

    uint256 internal constant PROOF_LOOKUP_GRAND_PRODUCT_X_SLOT = 0x200 + 0x520 + 0x1a0;
    uint256 internal constant PROOF_LOOKUP_GRAND_PRODUCT_Y_SLOT = 0x200 + 0x520 + 0x1c0;

    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_0_X_SLOT = 0x200 + 0x520 + 0x1e0;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_0_Y_SLOT = 0x200 + 0x520 + 0x200;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_1_X_SLOT = 0x200 + 0x520 + 0x220;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_1_Y_SLOT = 0x200 + 0x520 + 0x240;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_2_X_SLOT = 0x200 + 0x520 + 0x260;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_2_Y_SLOT = 0x200 + 0x520 + 0x280;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_3_X_SLOT = 0x200 + 0x520 + 0x2a0;
    uint256 internal constant PROOF_QUOTIENT_POLY_PARTS_3_Y_SLOT = 0x200 + 0x520 + 0x2c0;

    uint256 internal constant PROOF_STATE_POLYS_0_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x2e0;
    uint256 internal constant PROOF_STATE_POLYS_1_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x300;
    uint256 internal constant PROOF_STATE_POLYS_2_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x320;
    uint256 internal constant PROOF_STATE_POLYS_3_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x340;

    uint256 internal constant PROOF_STATE_POLYS_3_OPENING_AT_Z_OMEGA_SLOT = 0x200 + 0x520 + 0x360;
    uint256 internal constant PROOF_GATE_SELECTORS_0_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x380;

    uint256 internal constant PROOF_COPY_PERMUTATION_POLYS_0_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x3a0;
    uint256 internal constant PROOF_COPY_PERMUTATION_POLYS_1_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x3c0;
    uint256 internal constant PROOF_COPY_PERMUTATION_POLYS_2_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x3e0;

    uint256 internal constant PROOF_COPY_PERMUTATION_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT = 0x200 + 0x520 + 0x400;
    uint256 internal constant PROOF_LOOKUP_S_POLY_OPENING_AT_Z_OMEGA_SLOT = 0x200 + 0x520 + 0x420;
    uint256 internal constant PROOF_LOOKUP_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT = 0x200 + 0x520 + 0x440;
    uint256 internal constant PROOF_LOOKUP_T_POLY_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x460;
    uint256 internal constant PROOF_LOOKUP_T_POLY_OPENING_AT_Z_OMEGA_SLOT = 0x200 + 0x520 + 0x480;
    uint256 internal constant PROOF_LOOKUP_SELECTOR_POLY_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x4a0;
    uint256 internal constant PROOF_LOOKUP_TABLE_TYPE_POLY_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x4c0;
    uint256 internal constant PROOF_QUOTIENT_POLY_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x4e0;
    uint256 internal constant PROOF_LINEARISATION_POLY_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x500;

    uint256 internal constant PROOF_OPENING_PROOF_AT_Z_X_SLOT = 0x200 + 0x520 + 0x520;
    uint256 internal constant PROOF_OPENING_PROOF_AT_Z_Y_SLOT = 0x200 + 0x520 + 0x540;
    uint256 internal constant PROOF_OPENING_PROOF_AT_Z_OMEGA_X_SLOT = 0x200 + 0x520 + 0x560;
    uint256 internal constant PROOF_OPENING_PROOF_AT_Z_OMEGA_Y_SLOT = 0x200 + 0x520 + 0x580;

    uint256 internal constant PROOF_RECURSIVE_PART_P1_X_SLOT = 0x200 + 0x520 + 0x5a0;
    uint256 internal constant PROOF_RECURSIVE_PART_P1_Y_SLOT = 0x200 + 0x520 + 0x5c0;

    uint256 internal constant PROOF_RECURSIVE_PART_P2_X_SLOT = 0x200 + 0x520 + 0x5e0;
    uint256 internal constant PROOF_RECURSIVE_PART_P2_Y_SLOT = 0x200 + 0x520 + 0x600;

    /*//////////////////////////////////////////////////////////////
                             Transcript slot
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant TRANSCRIPT_BEGIN_SLOT = 0x200 + 0x520 + 0x620 + 0x00;
    uint256 internal constant TRANSCRIPT_DST_BYTE_SLOT = 0x200 + 0x520 + 0x620 + 0x03;
    uint256 internal constant TRANSCRIPT_STATE_0_SLOT = 0x200 + 0x520 + 0x620 + 0x04;
    uint256 internal constant TRANSCRIPT_STATE_1_SLOT = 0x200 + 0x520 + 0x620 + 0x24;
    uint256 internal constant TRANSCRIPT_CHALLENGE_SLOT = 0x200 + 0x520 + 0x620 + 0x44;

    /*//////////////////////////////////////////////////////////////
                             Partial verifier state
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant STATE_ALPHA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x000;
    uint256 internal constant STATE_BETA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x020;
    uint256 internal constant STATE_GAMMA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x040;
    uint256 internal constant STATE_POWER_OF_ALPHA_2_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x060;
    uint256 internal constant STATE_POWER_OF_ALPHA_3_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x080;
    uint256 internal constant STATE_POWER_OF_ALPHA_4_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x0a0;
    uint256 internal constant STATE_POWER_OF_ALPHA_5_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x0c0;
    uint256 internal constant STATE_POWER_OF_ALPHA_6_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x0e0;
    uint256 internal constant STATE_POWER_OF_ALPHA_7_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x100;
    uint256 internal constant STATE_POWER_OF_ALPHA_8_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x120;
    uint256 internal constant STATE_ETA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x140;
    uint256 internal constant STATE_BETA_LOOKUP_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x160;
    uint256 internal constant STATE_GAMMA_LOOKUP_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x180;
    uint256 internal constant STATE_BETA_PLUS_ONE_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x1a0;
    uint256 internal constant STATE_BETA_GAMMA_PLUS_GAMMA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x1c0;
    uint256 internal constant STATE_V_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x1e0;
    uint256 internal constant STATE_U_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x200;
    uint256 internal constant STATE_Z_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x220;
    uint256 internal constant STATE_Z_MINUS_LAST_OMEGA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x240;
    uint256 internal constant STATE_L_0_AT_Z_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x260;
    uint256 internal constant STATE_L_N_MINUS_ONE_AT_Z_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x280;
    uint256 internal constant STATE_Z_IN_DOMAIN_SIZE = 0x200 + 0x520 + 0x620 + 0x80 + 0x2a0;

    /*//////////////////////////////////////////////////////////////
                             Queries
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant QUERIES_BUFFER_POINT_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x00;

    uint256 internal constant QUERIES_AT_Z_0_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x40;
    uint256 internal constant QUERIES_AT_Z_0_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x60;
    uint256 internal constant QUERIES_AT_Z_1_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x80;
    uint256 internal constant QUERIES_AT_Z_1_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0xa0;

    uint256 internal constant QUERIES_T_POLY_AGGREGATED_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0xc0;
    uint256 internal constant QUERIES_T_POLY_AGGREGATED_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0xe0;

    /*//////////////////////////////////////////////////////////////
                             Aggregated commitment
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant AGGREGATED_AT_Z_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x00;
    uint256 internal constant AGGREGATED_AT_Z_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x20;

    uint256 internal constant AGGREGATED_AT_Z_OMEGA_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x40;
    uint256 internal constant AGGREGATED_AT_Z_OMEGA_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x60;

    uint256 internal constant AGGREGATED_OPENING_AT_Z_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x80;
    uint256 internal constant AGGREGATED_OPENING_AT_Z_OMEGA_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0xa0;

    /*//////////////////////////////////////////////////////////////
                             Pairing data
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant PAIRING_BUFFER_POINT_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0xc0 + 0x00;
    uint256 internal constant PAIRING_BUFFER_POINT_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0xc0 + 0x20;

    uint256 internal constant PAIRING_PAIR_WITH_GENERATOR_X_SLOT =
        0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0xc0 + 0x40;
    uint256 internal constant PAIRING_PAIR_WITH_GENERATOR_Y_SLOT =
        0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0xc0 + 0x60;

    uint256 internal constant PAIRING_PAIR_WITH_X_X_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x100 + 0x80;
    uint256 internal constant PAIRING_PAIR_WITH_X_Y_SLOT = 0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x100 + 0xa0;

    /*//////////////////////////////////////////////////////////////
               Slots for scalar multiplication optimizations
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant COPY_PERMUTATION_FIRST_AGGREGATED_COMMITMENT_COEFF =
        0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x100 + 0xc0;
    uint256 internal constant LOOKUP_GRAND_PRODUCT_FIRST_AGGREGATED_COMMITMENT_COEFF =
        0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x100 + 0xe0;
    uint256 internal constant LOOKUP_S_FIRST_AGGREGATED_COMMITMENT_COEFF =
        0x200 + 0x520 + 0x620 + 0x80 + 0x2c0 + 0x100 + 0x100 + 0x100;

    /*//////////////////////////////////////////////////////////////
                             Constants
    //////////////////////////////////////////////////////////////*/

    uint256 internal constant OMEGA = 0x1951441010b2b95a6e47a6075066a50a036f5ba978c050f2821df86636c0facb;
    uint256 internal constant DOMAIN_SIZE = 0x1000000; // 2^24
    uint256 internal constant Q_MOD = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    uint256 internal constant R_MOD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

    /// @dev flip of 0xe000000000000000000000000000000000000000000000000000000000000000;
    uint256 internal constant FR_MASK = 0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    // non residues
    uint256 internal constant NON_RESIDUES_0 = 0x05;
    uint256 internal constant NON_RESIDUES_1 = 0x07;
    uint256 internal constant NON_RESIDUES_2 = 0x0a;

    // trusted setup g2 elements
    uint256 internal constant G2_ELEMENTS_0_X1 = 0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2;
    uint256 internal constant G2_ELEMENTS_0_X2 = 0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed;
    uint256 internal constant G2_ELEMENTS_0_Y1 = 0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b;
    uint256 internal constant G2_ELEMENTS_0_Y2 = 0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa;
    uint256 internal constant G2_ELEMENTS_1_X1 = 0x260e01b251f6f1c7e7ff4e580791dee8ea51d87a358e038b4efe30fac09383c1;
    uint256 internal constant G2_ELEMENTS_1_X2 = 0x0118c4d5b837bcc2bc89b5b398b5974e9f5944073b32078b7e231fec938883b0;
    uint256 internal constant G2_ELEMENTS_1_Y1 = 0x04fc6369f7110fe3d25156c1bb9a72859cf2a04641f99ba4ee413c80da6a5fe4;
    uint256 internal constant G2_ELEMENTS_1_Y2 = 0x22febda3c0c0632a56475b4214e5615e11e6dd3f96e6cea2854a87d4dacc5e55;

    /// @inheritdoc IVerifier
    function verificationKeyHash() external pure returns (bytes32 vkHash) {
        _loadVerificationKey();

        assembly {
            let start := VK_GATE_SETUP_0_X_SLOT
            let end := VK_RECURSIVE_FLAG_SLOT
            let length := add(sub(end, start), 0x20)

            vkHash := keccak256(start, length)
        }
    }

    /// @notice Load verification keys to memory in runtime.
    /// @dev The constants are loaded into memory in a specific layout declared in the constants starting from
    /// `VK_` prefix.
    /// NOTE: Function may corrupt the memory state if some memory was used before this function was called.
    /// The VK consists of commitments to setup polynomials:
    /// [q_a], [q_b], [q_c], [q_d],                  - main gate setup commitments
    /// [q_{d_next}], [q_ab], [q_ac], [q_const]      /
    /// [main_gate_selector], [custom_gate_selector] - gate selectors commitments
    /// [sigma_0], [sigma_1], [sigma_2], [sigma_3]   - permutation polynomials commitments
    /// [lookup_selector]                            - lookup selector commitment
    /// [col_0], [col_1], [col_2], [col_3]           - lookup columns commitments
    /// [table_type]                                 - lookup table type commitment
    function _loadVerificationKey() internal pure virtual {
        assembly {
            // gate setup commitments
            mstore(VK_GATE_SETUP_0_X_SLOT, 0x110deb1e0863737f9a3d7b4de641a03aa00a77bc9f1a05acc9d55b76ab9fdd4d)
            mstore(VK_GATE_SETUP_0_Y_SLOT, 0x2c9dc252441e9298b7f6df6335a252517b7bccb924adf537b87c5cd3383fd7a9)
            mstore(VK_GATE_SETUP_1_X_SLOT, 0x04659caf7b05471ba5ba85b1ab62267aa6c456836e625f169f7119d55b9462d2)
            mstore(VK_GATE_SETUP_1_Y_SLOT, 0x0ea63403692148d2ad22189a1e5420076312f4d46e62036a043a6b0b84d5b410)
            mstore(VK_GATE_SETUP_2_X_SLOT, 0x0e6696d09d65fce1e42805be03fca1f14aea247281f688981f925e77d4ce2291)
            mstore(VK_GATE_SETUP_2_Y_SLOT, 0x0228f6cf8fe20c1e07e5b78bf8c41d50e55975a126d22a198d1e56acd4bbb3dd)
            mstore(VK_GATE_SETUP_3_X_SLOT, 0x14685dafe340b1dec5eafcd5e7faddaf24f3781ddc53309cc25d0b42c00541dd)
            mstore(VK_GATE_SETUP_3_Y_SLOT, 0x0e651cff9447cb360198899b80fa23e89ec13bc94ff161729aa841d2b55ea5be)
            mstore(VK_GATE_SETUP_4_X_SLOT, 0x16e9ef76cb68f2750eb0ee72382dd9911a982308d0ab10ef94dada13c382ae73)
            mstore(VK_GATE_SETUP_4_Y_SLOT, 0x22e404bc91350f3bc7daad1d1025113742436983c85eac5ab7b42221a181b81e)
            mstore(VK_GATE_SETUP_5_X_SLOT, 0x0d9b29613037a5025655c82b143d2b7449c98f3aea358307c8529249cc54f3b9)
            mstore(VK_GATE_SETUP_5_Y_SLOT, 0x15b3c4c946ad1babfc4c03ff7c2423fd354af3a9305c499b7fb3aaebe2fee746)
            mstore(VK_GATE_SETUP_6_X_SLOT, 0x2a4cb6c495dbc7201142cc773da895ae2046e790073988fb850aca6aead27b8a)
            mstore(VK_GATE_SETUP_6_Y_SLOT, 0x28ef9200c3cb67da82030520d640292014f5f7c2e2909da608812e04671a3acf)
            mstore(VK_GATE_SETUP_7_X_SLOT, 0x283344a1ab3e55ecfd904d0b8e9f4faea338df5a4ead2fa9a42f0e103da40abc)
            mstore(VK_GATE_SETUP_7_Y_SLOT, 0x223b37b83b9687512d322993edd70e508dd80adb10bcf7321a3cc8a44c269521)

            // gate selectors commitments
            mstore(VK_GATE_SELECTORS_0_X_SLOT, 0x1f67f0ba5f7e837bc680acb4e612ebd938ad35211aa6e05b96cad19e66b82d2d)
            mstore(VK_GATE_SELECTORS_0_Y_SLOT, 0x2820641a84d2e8298ac2ac42bd4b912c0c37f768ecc83d3a29e7c720763d15a1)
            mstore(VK_GATE_SELECTORS_1_X_SLOT, 0x0353257957562270292a17860ca8e8827703f828f440ee004848b1e23fdf9de2)
            mstore(VK_GATE_SELECTORS_1_Y_SLOT, 0x305f4137fee253dff8b2bfe579038e8f25d5bd217865072af5d89fc8800ada24)

            // permutation commitments
            mstore(VK_PERMUTATION_0_X_SLOT, 0x13a600154b369ff3237706d00948e465ee1c32c7a6d3e18bccd9c4a15910f2e5)
            mstore(VK_PERMUTATION_0_Y_SLOT, 0x138aa24fbf4cdddc75114811b3d59040394c218ecef3eb46ef9bd646f7e53776)
            mstore(VK_PERMUTATION_1_X_SLOT, 0x277fff1f80c409357e2d251d79f6e3fd2164b755ce69cfd72de5c690289df662)
            mstore(VK_PERMUTATION_1_Y_SLOT, 0x25235588e28c70eea3e35531c80deac25cd9b53ea3f98993f120108bc7abf670)
            mstore(VK_PERMUTATION_2_X_SLOT, 0x0990e07a9b001048b947d0e5bd6157214c7359b771f01bf52bd771ba563a900e)
            mstore(VK_PERMUTATION_2_Y_SLOT, 0x05e5fb090dd40914c8606d875e301167ae3047d684a02b44d9d36f1eaf43d0b4)
            mstore(VK_PERMUTATION_3_X_SLOT, 0x1d4656690b33299db5631401a282afab3e16c78ee2c9ad9efea628171dcbc6bc)
            mstore(VK_PERMUTATION_3_Y_SLOT, 0x0ebda2ebe582f601f813ec1e3970d13ef1500c742a85cce9b7f190f333de03b0)

            // lookup tables commitments
            mstore(VK_LOOKUP_TABLE_0_X_SLOT, 0x2c513ed74d9d57a5ec901e074032741036353a2c4513422e96e7b53b302d765b)
            mstore(VK_LOOKUP_TABLE_0_Y_SLOT, 0x04dd964427e430f16004076d708c0cb21e225056cc1d57418cfbd3d472981468)
            mstore(VK_LOOKUP_TABLE_1_X_SLOT, 0x1ea83e5e65c6f8068f4677e2911678cf329b28259642a32db1f14b8347828aac)
            mstore(VK_LOOKUP_TABLE_1_Y_SLOT, 0x1d22bc884a2da4962a893ba8de13f57aaeb785ed52c5e686994839cab8f7475d)
            mstore(VK_LOOKUP_TABLE_2_X_SLOT, 0x0b2e7212d0d9cff26d0bdf3d79b2cac029a25dfeb1cafdf49e2349d7db348d89)
            mstore(VK_LOOKUP_TABLE_2_Y_SLOT, 0x1301f9b252419ea240eb67fda720ca0b16d92364027285f95e9b1349490fa283)
            mstore(VK_LOOKUP_TABLE_3_X_SLOT, 0x02f7b99fdfa5b418548c2d777785820e02383cfc87e7085e280a375a358153bf)
            mstore(VK_LOOKUP_TABLE_3_Y_SLOT, 0x09d004fe08dc4d19c382df36fad22ef676185663543703e6a4b40203e50fd8a6)

            // lookup selector commitment
            mstore(VK_LOOKUP_SELECTOR_X_SLOT, 0x2f4d347c7fb61daaadfff881e24f4b5dcfdc0d70a95bcb148168b90ef93e0007)
            mstore(VK_LOOKUP_SELECTOR_Y_SLOT, 0x2322632465ba8e28cd0a4befd813ea85a972f4f6fa8e8603cf5d062dbcb14065)

            // table type commitment
            mstore(VK_LOOKUP_TABLE_TYPE_X_SLOT, 0x1e3c9fc98c118e4bc34f1f93d214a5d86898e980c40d8e2c180c6ada377a7467)
            mstore(VK_LOOKUP_TABLE_TYPE_Y_SLOT, 0x2260a13535c35a15c173f5e5797d4b675b55d164a9995bfb7624971324bd84a8)

            // flag for using recursive part
            mstore(VK_RECURSIVE_FLAG_SLOT, 0)
        }
    }

    /// @inheritdoc IVerifier
    function verify(
        uint256[] calldata, // _publicInputs
        uint256[] calldata, // _proof
        uint256[] calldata // _recursiveAggregationInput
    ) public view virtual returns (bool) {
        // No memory was accessed yet, so keys can be loaded into the right place and not corrupt any other memory.
        _loadVerificationKey();

        // Beginning of the big inline assembly block that makes all the verification work.
        // Note: We use the custom memory layout, so the return value should be returned from the assembly, not
        // Solidity code.
        assembly {
            /*//////////////////////////////////////////////////////////////
                                    Utils
            //////////////////////////////////////////////////////////////*/

            /// @dev Reverts execution with a provided revert reason.
            /// @param len The byte length of the error message string, which is expected to be no more than 32.
            /// @param reason The 1-word revert reason string, encoded in ASCII.
            function revertWithMessage(len, reason) {
                // "Error(string)" signature: bytes32(bytes4(keccak256("Error(string)")))
                mstore(0x00, 0x08c379a000000000000000000000000000000000000000000000000000000000)
                // Data offset
                mstore(0x04, 0x0000000000000000000000000000000000000000000000000000000000000020)
                // Length of revert string
                mstore(0x24, len)
                // Revert reason
                mstore(0x44, reason)
                // Revert
                revert(0x00, 0x64)
            }

            /// @dev Performs modular exponentiation using the formula (value ^ power) mod R_MOD.
            function modexp(value, power) -> res {
                mstore(0x00, 0x20)
                mstore(0x20, 0x20)
                mstore(0x40, 0x20)
                mstore(0x60, value)
                mstore(0x80, power)
                mstore(0xa0, R_MOD)
                if iszero(staticcall(gas(), 5, 0, 0xc0, 0x00, 0x20)) {
                    revertWithMessage(24, "modexp precompile failed")
                }
                res := mload(0x00)
            }

            /// @dev Performs a point multiplication operation and stores the result in a given memory destination.
            function pointMulIntoDest(point, s, dest) {
                mstore(0x00, mload(point))
                mstore(0x20, mload(add(point, 0x20)))
                mstore(0x40, s)
                if iszero(staticcall(gas(), 7, 0, 0x60, dest, 0x40)) {
                    revertWithMessage(30, "pointMulIntoDest: ecMul failed")
                }
            }

            /// @dev Performs a point addition operation and stores the result in a given memory destination.
            function pointAddIntoDest(p1, p2, dest) {
                mstore(0x00, mload(p1))
                mstore(0x20, mload(add(p1, 0x20)))
                mstore(0x40, mload(p2))
                mstore(0x60, mload(add(p2, 0x20)))
                if iszero(staticcall(gas(), 6, 0x00, 0x80, dest, 0x40)) {
                    revertWithMessage(30, "pointAddIntoDest: ecAdd failed")
                }
            }

            /// @dev Performs a point subtraction operation and updates the first point with the result.
            function pointSubAssign(p1, p2) {
                mstore(0x00, mload(p1))
                mstore(0x20, mload(add(p1, 0x20)))
                mstore(0x40, mload(p2))
                mstore(0x60, sub(Q_MOD, mload(add(p2, 0x20))))
                if iszero(staticcall(gas(), 6, 0x00, 0x80, p1, 0x40)) {
                    revertWithMessage(28, "pointSubAssign: ecAdd failed")
                }
            }

            /// @dev Performs a point addition operation and updates the first point with the result.
            function pointAddAssign(p1, p2) {
                mstore(0x00, mload(p1))
                mstore(0x20, mload(add(p1, 0x20)))
                mstore(0x40, mload(p2))
                mstore(0x60, mload(add(p2, 0x20)))
                if iszero(staticcall(gas(), 6, 0x00, 0x80, p1, 0x40)) {
                    revertWithMessage(28, "pointAddAssign: ecAdd failed")
                }
            }

            /// @dev Performs a point multiplication operation and then adds the result to the destination point.
            function pointMulAndAddIntoDest(point, s, dest) {
                mstore(0x00, mload(point))
                mstore(0x20, mload(add(point, 0x20)))
                mstore(0x40, s)
                let success := staticcall(gas(), 7, 0, 0x60, 0, 0x40)

                mstore(0x40, mload(dest))
                mstore(0x60, mload(add(dest, 0x20)))
                success := and(success, staticcall(gas(), 6, 0x00, 0x80, dest, 0x40))

                if iszero(success) {
                    revertWithMessage(22, "pointMulAndAddIntoDest")
                }
            }

            /// @dev Negates an elliptic curve point by changing the sign of the y-coordinate.
            function pointNegate(point) {
                let pY := mload(add(point, 0x20))
                switch pY
                case 0 {
                    if mload(point) {
                        revertWithMessage(26, "pointNegate: invalid point")
                    }
                }
                default {
                    mstore(add(point, 0x20), sub(Q_MOD, pY))
                }
            }

            /*//////////////////////////////////////////////////////////////
                                    Transcript helpers
            //////////////////////////////////////////////////////////////*/

            /// @dev Updates the transcript state with a new challenge value.
            function updateTranscript(value) {
                mstore8(TRANSCRIPT_DST_BYTE_SLOT, 0x00)
                mstore(TRANSCRIPT_CHALLENGE_SLOT, value)
                let newState0 := keccak256(TRANSCRIPT_BEGIN_SLOT, 0x64)
                mstore8(TRANSCRIPT_DST_BYTE_SLOT, 0x01)
                let newState1 := keccak256(TRANSCRIPT_BEGIN_SLOT, 0x64)
                mstore(TRANSCRIPT_STATE_1_SLOT, newState1)
                mstore(TRANSCRIPT_STATE_0_SLOT, newState0)
            }

            /// @dev Retrieves a transcript challenge.
            function getTranscriptChallenge(numberOfChallenge) -> challenge {
                mstore8(TRANSCRIPT_DST_BYTE_SLOT, 0x02)
                mstore(TRANSCRIPT_CHALLENGE_SLOT, shl(224, numberOfChallenge))
                challenge := and(keccak256(TRANSCRIPT_BEGIN_SLOT, 0x48), FR_MASK)
            }

            /*//////////////////////////////////////////////////////////////
                                    1. Load Proof
            //////////////////////////////////////////////////////////////*/

            /// @dev This function loads a zk-SNARK proof, ensures it's properly formatted, and stores it in memory.
            /// It ensures the number of inputs and the elliptic curve point's validity.
            /// Note: It does NOT reject inputs that exceed these module sizes, but rather wraps them within the
            /// module bounds.
            /// The proof consists of:
            /// 1. Public input: (1 field element from F_r)
            ///
            /// 2. Polynomial commitments (elliptic curve points over F_q):
            ///     [a], [b], [c], [d]         - state polynomials commitments
            ///     [z_perm]                   - copy-permutation grand product commitment
            ///     [s]                        - polynomial for lookup argument commitment
            ///     [z_lookup]                 - lookup grand product commitment
            ///     [t_0], [t_1], [t_2], [t_3] - quotient polynomial parts commitments
            ///     [W], [W']                  - proof openings commitments
            ///
            /// 3. Polynomial evaluations at z and z*omega (field elements from F_r):
            ///     t(z)                                  - quotient polynomial opening
            ///     a(z), b(z), c(z), d(z), d(z*omega)    - state polynomials openings
            ///     main_gate_selector(z)                 - main gate selector opening
            ///     sigma_0(z), sigma_1(z), sigma_2(z)    - permutation polynomials openings
            ///     z_perm(z*omega)                       - copy-permutation grand product opening
            ///     z_lookup(z*omega)                     - lookup grand product opening
            ///     lookup_selector(z)                    - lookup selector opening
            ///     s(x*omega), t(z*omega), table_type(z) - lookup argument polynomial openings
            ///     r(z)                                  - linearisation polynomial opening
            ///
            /// 4. Recursive proof (0 or 2 elliptic curve points over F_q)
            function loadProof() {
                // 1. Load public input
                let offset := calldataload(0x04)
                let publicInputLengthInWords := calldataload(add(offset, 0x04))
                let isValid := eq(publicInputLengthInWords, 1) // We expect only one public input
                mstore(PROOF_PUBLIC_INPUT, and(calldataload(add(offset, 0x24)), FR_MASK))

                // 2. Load the proof (except for the recursive part)
                offset := calldataload(0x24)
                let proofLengthInWords := calldataload(add(offset, 0x04))
                isValid := and(eq(proofLengthInWords, 44), isValid)

                // PROOF_STATE_POLYS_0
                {
                    let x := mod(calldataload(add(offset, 0x024)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x044)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_STATE_POLYS_0_X_SLOT, x)
                    mstore(PROOF_STATE_POLYS_0_Y_SLOT, y)
                }
                // PROOF_STATE_POLYS_1
                {
                    let x := mod(calldataload(add(offset, 0x064)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x084)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_STATE_POLYS_1_X_SLOT, x)
                    mstore(PROOF_STATE_POLYS_1_Y_SLOT, y)
                }
                // PROOF_STATE_POLYS_2
                {
                    let x := mod(calldataload(add(offset, 0x0a4)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x0c4)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_STATE_POLYS_2_X_SLOT, x)
                    mstore(PROOF_STATE_POLYS_2_Y_SLOT, y)
                }
                // PROOF_STATE_POLYS_3
                {
                    let x := mod(calldataload(add(offset, 0x0e4)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x104)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_STATE_POLYS_3_X_SLOT, x)
                    mstore(PROOF_STATE_POLYS_3_Y_SLOT, y)
                }
                // PROOF_COPY_PERMUTATION_GRAND_PRODUCT
                {
                    let x := mod(calldataload(add(offset, 0x124)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x144)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_X_SLOT, x)
                    mstore(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_Y_SLOT, y)
                }
                // PROOF_LOOKUP_S_POLY
                {
                    let x := mod(calldataload(add(offset, 0x164)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x184)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_LOOKUP_S_POLY_X_SLOT, x)
                    mstore(PROOF_LOOKUP_S_POLY_Y_SLOT, y)
                }
                // PROOF_LOOKUP_GRAND_PRODUCT
                {
                    let x := mod(calldataload(add(offset, 0x1a4)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x1c4)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_LOOKUP_GRAND_PRODUCT_X_SLOT, x)
                    mstore(PROOF_LOOKUP_GRAND_PRODUCT_Y_SLOT, y)
                }
                // PROOF_QUOTIENT_POLY_PARTS_0
                {
                    let x := mod(calldataload(add(offset, 0x1e4)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x204)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_0_X_SLOT, x)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_0_Y_SLOT, y)
                }
                // PROOF_QUOTIENT_POLY_PARTS_1
                {
                    let x := mod(calldataload(add(offset, 0x224)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x244)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_1_X_SLOT, x)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_1_Y_SLOT, y)
                }
                // PROOF_QUOTIENT_POLY_PARTS_2
                {
                    let x := mod(calldataload(add(offset, 0x264)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x284)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_2_X_SLOT, x)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_2_Y_SLOT, y)
                }
                // PROOF_QUOTIENT_POLY_PARTS_3
                {
                    let x := mod(calldataload(add(offset, 0x2a4)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x2c4)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_3_X_SLOT, x)
                    mstore(PROOF_QUOTIENT_POLY_PARTS_3_Y_SLOT, y)
                }

                mstore(PROOF_STATE_POLYS_0_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x2e4)), R_MOD))
                mstore(PROOF_STATE_POLYS_1_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x304)), R_MOD))
                mstore(PROOF_STATE_POLYS_2_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x324)), R_MOD))
                mstore(PROOF_STATE_POLYS_3_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x344)), R_MOD))

                mstore(PROOF_STATE_POLYS_3_OPENING_AT_Z_OMEGA_SLOT, mod(calldataload(add(offset, 0x364)), R_MOD))
                mstore(PROOF_GATE_SELECTORS_0_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x384)), R_MOD))

                mstore(PROOF_COPY_PERMUTATION_POLYS_0_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x3a4)), R_MOD))
                mstore(PROOF_COPY_PERMUTATION_POLYS_1_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x3c4)), R_MOD))
                mstore(PROOF_COPY_PERMUTATION_POLYS_2_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x3e4)), R_MOD))

                mstore(
                    PROOF_COPY_PERMUTATION_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT,
                    mod(calldataload(add(offset, 0x404)), R_MOD)
                )
                mstore(PROOF_LOOKUP_S_POLY_OPENING_AT_Z_OMEGA_SLOT, mod(calldataload(add(offset, 0x424)), R_MOD))
                mstore(PROOF_LOOKUP_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT, mod(calldataload(add(offset, 0x444)), R_MOD))
                mstore(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x464)), R_MOD))
                mstore(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_OMEGA_SLOT, mod(calldataload(add(offset, 0x484)), R_MOD))
                mstore(PROOF_LOOKUP_SELECTOR_POLY_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x4a4)), R_MOD))
                mstore(PROOF_LOOKUP_TABLE_TYPE_POLY_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x4c4)), R_MOD))
                mstore(PROOF_QUOTIENT_POLY_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x4e4)), R_MOD))
                mstore(PROOF_LINEARISATION_POLY_OPENING_AT_Z_SLOT, mod(calldataload(add(offset, 0x504)), R_MOD))

                // PROOF_OPENING_PROOF_AT_Z
                {
                    let x := mod(calldataload(add(offset, 0x524)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x544)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_OPENING_PROOF_AT_Z_X_SLOT, x)
                    mstore(PROOF_OPENING_PROOF_AT_Z_Y_SLOT, y)
                }
                // PROOF_OPENING_PROOF_AT_Z_OMEGA
                {
                    let x := mod(calldataload(add(offset, 0x564)), Q_MOD)
                    let y := mod(calldataload(add(offset, 0x584)), Q_MOD)
                    let xx := mulmod(x, x, Q_MOD)
                    isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                    mstore(PROOF_OPENING_PROOF_AT_Z_OMEGA_X_SLOT, x)
                    mstore(PROOF_OPENING_PROOF_AT_Z_OMEGA_Y_SLOT, y)
                }

                // 3. Load the recursive part of the proof
                offset := calldataload(0x44)
                let recursiveProofLengthInWords := calldataload(add(offset, 0x04))

                switch mload(VK_RECURSIVE_FLAG_SLOT)
                case 0 {
                    // recursive part should be empty
                    isValid := and(iszero(recursiveProofLengthInWords), isValid)
                }
                default {
                    // recursive part should be consist of 2 points
                    isValid := and(eq(recursiveProofLengthInWords, 4), isValid)
                    // PROOF_RECURSIVE_PART_P1
                    {
                        let x := mod(calldataload(add(offset, 0x024)), Q_MOD)
                        let y := mod(calldataload(add(offset, 0x044)), Q_MOD)
                        let xx := mulmod(x, x, Q_MOD)
                        isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                        mstore(PROOF_RECURSIVE_PART_P1_X_SLOT, x)
                        mstore(PROOF_RECURSIVE_PART_P1_Y_SLOT, y)
                    }
                    // PROOF_RECURSIVE_PART_P2
                    {
                        let x := mod(calldataload(add(offset, 0x064)), Q_MOD)
                        let y := mod(calldataload(add(offset, 0x084)), Q_MOD)
                        let xx := mulmod(x, x, Q_MOD)
                        isValid := and(eq(mulmod(y, y, Q_MOD), addmod(mulmod(x, xx, Q_MOD), 3, Q_MOD)), isValid)
                        mstore(PROOF_RECURSIVE_PART_P2_X_SLOT, x)
                        mstore(PROOF_RECURSIVE_PART_P2_Y_SLOT, y)
                    }
                }

                // Revert if a proof is not valid
                if iszero(isValid) {
                    revertWithMessage(27, "loadProof: Proof is invalid")
                }
            }

            /*//////////////////////////////////////////////////////////////
                                    2. Transcript initialization
            //////////////////////////////////////////////////////////////*/

            /// @notice Recomputes all challenges
            /// @dev The process is the following:
            /// Commit:   PI, [a], [b], [c], [d]
            /// Get:      eta
            /// Commit:   [s]
            /// Get:      beta, gamma
            /// Commit:   [z_perm]
            /// Get:      beta', gamma'
            /// Commit:   [z_lookup]
            /// Get:      alpha
            /// Commit:   [t_0], [t_1], [t_2], [t_3]
            /// Get:      z
            /// Commit:   t(z), a(z), b(z), c(z), d(z), d(z*omega),
            ///           main_gate_selector(z),
            ///           sigma_0(z), sigma_1(z), sigma_2(z),
            ///           z_perm(z*omega),
            ///           t(z), lookup_selector(z), table_type(z),
            ///           s(x*omega), z_lookup(z*omega), t(z*omega),
            ///           r(z)
            /// Get:      v
            /// Commit:   [W], [W']
            /// Get:      u
            function initializeTranscript() {
                // Round 1
                updateTranscript(mload(PROOF_PUBLIC_INPUT))
                updateTranscript(mload(PROOF_STATE_POLYS_0_X_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_0_Y_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_1_X_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_1_Y_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_2_X_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_2_Y_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_3_X_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_3_Y_SLOT))

                mstore(STATE_ETA_SLOT, getTranscriptChallenge(0))

                // Round 1.5
                updateTranscript(mload(PROOF_LOOKUP_S_POLY_X_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_S_POLY_Y_SLOT))

                mstore(STATE_BETA_SLOT, getTranscriptChallenge(1))
                mstore(STATE_GAMMA_SLOT, getTranscriptChallenge(2))

                // Round 2
                updateTranscript(mload(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_X_SLOT))
                updateTranscript(mload(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_Y_SLOT))

                mstore(STATE_BETA_LOOKUP_SLOT, getTranscriptChallenge(3))
                mstore(STATE_GAMMA_LOOKUP_SLOT, getTranscriptChallenge(4))

                // Round 2.5
                updateTranscript(mload(PROOF_LOOKUP_GRAND_PRODUCT_X_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_GRAND_PRODUCT_Y_SLOT))

                mstore(STATE_ALPHA_SLOT, getTranscriptChallenge(5))

                // Round 3
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_0_X_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_0_Y_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_1_X_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_1_Y_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_2_X_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_2_Y_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_3_X_SLOT))
                updateTranscript(mload(PROOF_QUOTIENT_POLY_PARTS_3_Y_SLOT))

                {
                    let z := getTranscriptChallenge(6)

                    mstore(STATE_Z_SLOT, z)
                    mstore(STATE_Z_IN_DOMAIN_SIZE, modexp(z, DOMAIN_SIZE))
                }

                // Round 4
                updateTranscript(mload(PROOF_QUOTIENT_POLY_OPENING_AT_Z_SLOT))

                updateTranscript(mload(PROOF_STATE_POLYS_0_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_1_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_2_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_STATE_POLYS_3_OPENING_AT_Z_SLOT))

                updateTranscript(mload(PROOF_STATE_POLYS_3_OPENING_AT_Z_OMEGA_SLOT))
                updateTranscript(mload(PROOF_GATE_SELECTORS_0_OPENING_AT_Z_SLOT))

                updateTranscript(mload(PROOF_COPY_PERMUTATION_POLYS_0_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_COPY_PERMUTATION_POLYS_1_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_COPY_PERMUTATION_POLYS_2_OPENING_AT_Z_SLOT))

                updateTranscript(mload(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_SELECTOR_POLY_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_TABLE_TYPE_POLY_OPENING_AT_Z_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_S_POLY_OPENING_AT_Z_OMEGA_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT))
                updateTranscript(mload(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_OMEGA_SLOT))
                updateTranscript(mload(PROOF_LINEARISATION_POLY_OPENING_AT_Z_SLOT))

                mstore(STATE_V_SLOT, getTranscriptChallenge(7))

                // Round 5
                updateTranscript(mload(PROOF_OPENING_PROOF_AT_Z_X_SLOT))
                updateTranscript(mload(PROOF_OPENING_PROOF_AT_Z_Y_SLOT))
                updateTranscript(mload(PROOF_OPENING_PROOF_AT_Z_OMEGA_X_SLOT))
                updateTranscript(mload(PROOF_OPENING_PROOF_AT_Z_OMEGA_Y_SLOT))

                mstore(STATE_U_SLOT, getTranscriptChallenge(8))
            }

            /*//////////////////////////////////////////////////////////////
                                    3. Verifying quotient evaluation
            //////////////////////////////////////////////////////////////*/

            /// @notice Compute linearisation polynomial's constant term: r_0
            /// @dev To save a verifier scalar multiplication, we split linearisation polynomial
            /// into its constant and non-constant terms. The constant term is computed with the formula:
            ///
            /// r_0 = alpha^0 * L_0(z) * PI * q_{main selector}(z) + r(z)         -- main gate contribution
            ///
            ///     - alpha^4 * z_perm(z*omega)(sigma_0(z) * beta + gamma + a(z)) \
            ///                           (sigma_1(z) * beta + gamma + b(z))      |
            ///                           (sigma_2(z) * beta + gamma + c(z))      | - permutation contribution
            ///                           (sigma_3(z) + gamma)                    |
            ///     - alpha^5 * L_0(z)                                            /
            ///
            ///     + alpha^6 * (s(z*omega) * beta' + gamma' (beta' + 1))         \
            ///               * (z - omega^{n-1}) * z_lookup(z*omega)             | - lookup contribution
            ///     - alpha^7 * L_0(z)                                            |
            ///     - alpha^8 * L_{n-1}(z) * (gamma' (beta' + 1))^{n-1}           /
            ///
            /// In the end we should check that t(z)*Z_H(z) = r(z) + r_0!
            function verifyQuotientEvaluation() {
                // Compute power of alpha
                {
                    let alpha := mload(STATE_ALPHA_SLOT)
                    let currentAlpha := mulmod(alpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_2_SLOT, currentAlpha)
                    currentAlpha := mulmod(currentAlpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_3_SLOT, currentAlpha)
                    currentAlpha := mulmod(currentAlpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_4_SLOT, currentAlpha)
                    currentAlpha := mulmod(currentAlpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_5_SLOT, currentAlpha)
                    currentAlpha := mulmod(currentAlpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_6_SLOT, currentAlpha)
                    currentAlpha := mulmod(currentAlpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_7_SLOT, currentAlpha)
                    currentAlpha := mulmod(currentAlpha, alpha, R_MOD)
                    mstore(STATE_POWER_OF_ALPHA_8_SLOT, currentAlpha)
                }

                // z
                let stateZ := mload(STATE_Z_SLOT)
                // L_0(z)
                mstore(STATE_L_0_AT_Z_SLOT, evaluateLagrangePolyOutOfDomain(0, stateZ))
                // L_{n-1}(z)
                mstore(STATE_L_N_MINUS_ONE_AT_Z_SLOT, evaluateLagrangePolyOutOfDomain(sub(DOMAIN_SIZE, 1), stateZ))
                // L_0(z) * PI
                let stateT := mulmod(mload(STATE_L_0_AT_Z_SLOT), mload(PROOF_PUBLIC_INPUT), R_MOD)

                // Compute main gate contribution
                let result := mulmod(stateT, mload(PROOF_GATE_SELECTORS_0_OPENING_AT_Z_SLOT), R_MOD)

                // Compute permutation contribution
                result := addmod(result, permutationQuotientContribution(), R_MOD)

                // Compute lookup contribution
                result := addmod(result, lookupQuotientContribution(), R_MOD)

                // Check that r(z) + r_0 = t(z) * Z_H(z)
                result := addmod(mload(PROOF_LINEARISATION_POLY_OPENING_AT_Z_SLOT), result, R_MOD)

                let vanishing := addmod(mload(STATE_Z_IN_DOMAIN_SIZE), sub(R_MOD, 1), R_MOD)
                let lhs := mulmod(mload(PROOF_QUOTIENT_POLY_OPENING_AT_Z_SLOT), vanishing, R_MOD)
                if iszero(eq(lhs, result)) {
                    revertWithMessage(27, "invalid quotient evaluation")
                }
            }

            /// @notice Evaluating L_{polyNum}(at) out of domain
            /// @dev L_i is a Lagrange polynomial for our domain such that:
            /// L_i(omega^i) = 1 and L_i(omega^j) = 0 for all j != i
            function evaluateLagrangePolyOutOfDomain(polyNum, at) -> res {
                let omegaPower := 1
                if polyNum {
                    omegaPower := modexp(OMEGA, polyNum)
                }

                res := addmod(modexp(at, DOMAIN_SIZE), sub(R_MOD, 1), R_MOD)

                // Vanishing polynomial can not be zero at point `at`
                if iszero(res) {
                    revertWithMessage(28, "invalid vanishing polynomial")
                }
                res := mulmod(res, omegaPower, R_MOD)
                let denominator := addmod(at, sub(R_MOD, omegaPower), R_MOD)
                denominator := mulmod(denominator, DOMAIN_SIZE, R_MOD)
                denominator := modexp(denominator, sub(R_MOD, 2))
                res := mulmod(res, denominator, R_MOD)
            }

            /// @notice Compute permutation contribution to linearisation polynomial's constant term
            function permutationQuotientContribution() -> res {
                // res = alpha^4 * z_perm(z*omega)
                res := mulmod(
                    mload(STATE_POWER_OF_ALPHA_4_SLOT),
                    mload(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT),
                    R_MOD
                )

                {
                    let gamma := mload(STATE_GAMMA_SLOT)
                    let beta := mload(STATE_BETA_SLOT)

                    let factorMultiplier
                    {
                        // res *= sigma_0(z) * beta + gamma + a(z)
                        factorMultiplier := mulmod(mload(PROOF_COPY_PERMUTATION_POLYS_0_OPENING_AT_Z_SLOT), beta, R_MOD)
                        factorMultiplier := addmod(factorMultiplier, gamma, R_MOD)
                        factorMultiplier := addmod(
                            factorMultiplier,
                            mload(PROOF_STATE_POLYS_0_OPENING_AT_Z_SLOT),
                            R_MOD
                        )
                        res := mulmod(res, factorMultiplier, R_MOD)
                    }
                    {
                        // res *= sigma_1(z) * beta + gamma + b(z)
                        factorMultiplier := mulmod(mload(PROOF_COPY_PERMUTATION_POLYS_1_OPENING_AT_Z_SLOT), beta, R_MOD)
                        factorMultiplier := addmod(factorMultiplier, gamma, R_MOD)
                        factorMultiplier := addmod(
                            factorMultiplier,
                            mload(PROOF_STATE_POLYS_1_OPENING_AT_Z_SLOT),
                            R_MOD
                        )
                        res := mulmod(res, factorMultiplier, R_MOD)
                    }
                    {
                        // res *= sigma_2(z) * beta + gamma + c(z)
                        factorMultiplier := mulmod(mload(PROOF_COPY_PERMUTATION_POLYS_2_OPENING_AT_Z_SLOT), beta, R_MOD)
                        factorMultiplier := addmod(factorMultiplier, gamma, R_MOD)
                        factorMultiplier := addmod(
                            factorMultiplier,
                            mload(PROOF_STATE_POLYS_2_OPENING_AT_Z_SLOT),
                            R_MOD
                        )
                        res := mulmod(res, factorMultiplier, R_MOD)
                    }

                    // res *= sigma_3(z) + gamma
                    res := mulmod(res, addmod(mload(PROOF_STATE_POLYS_3_OPENING_AT_Z_SLOT), gamma, R_MOD), R_MOD)
                }

                // res = -res
                res := sub(R_MOD, res)

                // -= L_0(z) * alpha^5
                let l0AtZ := mload(STATE_L_0_AT_Z_SLOT)
                l0AtZ := mulmod(l0AtZ, mload(STATE_POWER_OF_ALPHA_5_SLOT), R_MOD)
                res := addmod(res, sub(R_MOD, l0AtZ), R_MOD)
            }

            /// @notice Compute lookup contribution to linearisation polynomial's constant term
            function lookupQuotientContribution() -> res {
                let betaLookup := mload(STATE_BETA_LOOKUP_SLOT)
                let gammaLookup := mload(STATE_GAMMA_LOOKUP_SLOT)
                let betaPlusOne := addmod(betaLookup, 1, R_MOD)
                let betaGamma := mulmod(betaPlusOne, gammaLookup, R_MOD)

                mstore(STATE_BETA_PLUS_ONE_SLOT, betaPlusOne)
                mstore(STATE_BETA_GAMMA_PLUS_GAMMA_SLOT, betaGamma)

                // res =  alpha^6 * (s(z*omega) * beta' + gamma' (beta' + 1)) * z_lookup(z*omega)
                res := mulmod(mload(PROOF_LOOKUP_S_POLY_OPENING_AT_Z_OMEGA_SLOT), betaLookup, R_MOD)
                res := addmod(res, betaGamma, R_MOD)
                res := mulmod(res, mload(PROOF_LOOKUP_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT), R_MOD)
                res := mulmod(res, mload(STATE_POWER_OF_ALPHA_6_SLOT), R_MOD)

                // res *= z - omega^{n-1}
                {
                    let lastOmega := modexp(OMEGA, sub(DOMAIN_SIZE, 1))
                    let zMinusLastOmega := addmod(mload(STATE_Z_SLOT), sub(R_MOD, lastOmega), R_MOD)
                    mstore(STATE_Z_MINUS_LAST_OMEGA_SLOT, zMinusLastOmega)
                    res := mulmod(res, zMinusLastOmega, R_MOD)
                }

                // res -= alpha^7 * L_{0}(z)
                {
                    let intermediateValue := mulmod(
                        mload(STATE_L_0_AT_Z_SLOT),
                        mload(STATE_POWER_OF_ALPHA_7_SLOT),
                        R_MOD
                    )
                    res := addmod(res, sub(R_MOD, intermediateValue), R_MOD)
                }

                // res -= alpha^8 * L_{n-1}(z) * (gamma' (beta' + 1))^{n-1}
                {
                    let lnMinusOneAtZ := mload(STATE_L_N_MINUS_ONE_AT_Z_SLOT)
                    let betaGammaPowered := modexp(betaGamma, sub(DOMAIN_SIZE, 1))
                    let alphaPower8 := mload(STATE_POWER_OF_ALPHA_8_SLOT)

                    let subtrahend := mulmod(mulmod(lnMinusOneAtZ, betaGammaPowered, R_MOD), alphaPower8, R_MOD)
                    res := addmod(res, sub(R_MOD, subtrahend), R_MOD)
                }
            }

            /// @notice Compute main gate contribution to linearisation polynomial commitment multiplied by v
            function mainGateLinearisationContributionWithV(
                dest,
                stateOpening0AtZ,
                stateOpening1AtZ,
                stateOpening2AtZ,
                stateOpening3AtZ
            ) {
                // += a(z) * [q_a]
                pointMulIntoDest(VK_GATE_SETUP_0_X_SLOT, stateOpening0AtZ, dest)
                // += b(z) * [q_b]
                pointMulAndAddIntoDest(VK_GATE_SETUP_1_X_SLOT, stateOpening1AtZ, dest)
                // += c(z) * [q_c]
                pointMulAndAddIntoDest(VK_GATE_SETUP_2_X_SLOT, stateOpening2AtZ, dest)
                // += d(z) * [q_d]
                pointMulAndAddIntoDest(VK_GATE_SETUP_3_X_SLOT, stateOpening3AtZ, dest)
                // += a(z) * b(z) * [q_ab]
                pointMulAndAddIntoDest(VK_GATE_SETUP_4_X_SLOT, mulmod(stateOpening0AtZ, stateOpening1AtZ, R_MOD), dest)
                // += a(z) * c(z) * [q_ac]
                pointMulAndAddIntoDest(VK_GATE_SETUP_5_X_SLOT, mulmod(stateOpening0AtZ, stateOpening2AtZ, R_MOD), dest)
                // += [q_const]
                pointAddAssign(dest, VK_GATE_SETUP_6_X_SLOT)
                // += d(z*omega) * [q_{d_next}]
                pointMulAndAddIntoDest(VK_GATE_SETUP_7_X_SLOT, mload(PROOF_STATE_POLYS_3_OPENING_AT_Z_OMEGA_SLOT), dest)

                // *= v * main_gate_selector(z)
                let coeff := mulmod(mload(PROOF_GATE_SELECTORS_0_OPENING_AT_Z_SLOT), mload(STATE_V_SLOT), R_MOD)
                pointMulIntoDest(dest, coeff, dest)
            }

            /// @notice Compute custom gate contribution to linearisation polynomial commitment multiplied by v
            function addAssignRescueCustomGateLinearisationContributionWithV(
                dest,
                stateOpening0AtZ,
                stateOpening1AtZ,
                stateOpening2AtZ,
                stateOpening3AtZ
            ) {
                let accumulator
                let intermediateValue
                //  = alpha * (a(z)^2 - b(z))
                accumulator := mulmod(stateOpening0AtZ, stateOpening0AtZ, R_MOD)
                accumulator := addmod(accumulator, sub(R_MOD, stateOpening1AtZ), R_MOD)
                accumulator := mulmod(accumulator, mload(STATE_ALPHA_SLOT), R_MOD)
                // += alpha^2 * (b(z)^2 - c(z))
                intermediateValue := mulmod(stateOpening1AtZ, stateOpening1AtZ, R_MOD)
                intermediateValue := addmod(intermediateValue, sub(R_MOD, stateOpening2AtZ), R_MOD)
                intermediateValue := mulmod(intermediateValue, mload(STATE_POWER_OF_ALPHA_2_SLOT), R_MOD)
                accumulator := addmod(accumulator, intermediateValue, R_MOD)
                // += alpha^3 * (c(z) * a(z) - d(z))
                intermediateValue := mulmod(stateOpening2AtZ, stateOpening0AtZ, R_MOD)
                intermediateValue := addmod(intermediateValue, sub(R_MOD, stateOpening3AtZ), R_MOD)
                intermediateValue := mulmod(intermediateValue, mload(STATE_POWER_OF_ALPHA_3_SLOT), R_MOD)
                accumulator := addmod(accumulator, intermediateValue, R_MOD)

                // *= v * [custom_gate_selector]
                accumulator := mulmod(accumulator, mload(STATE_V_SLOT), R_MOD)
                pointMulAndAddIntoDest(VK_GATE_SELECTORS_1_X_SLOT, accumulator, dest)
            }

            /// @notice Compute copy-permutation contribution to linearisation polynomial commitment multiplied by v
            function addAssignPermutationLinearisationContributionWithV(
                dest,
                stateOpening0AtZ,
                stateOpening1AtZ,
                stateOpening2AtZ,
                stateOpening3AtZ
            ) {
                // alpha^4
                let factor := mload(STATE_POWER_OF_ALPHA_4_SLOT)
                // Calculate the factor
                {
                    // *= (a(z) + beta * z + gamma)
                    let zMulBeta := mulmod(mload(STATE_Z_SLOT), mload(STATE_BETA_SLOT), R_MOD)
                    let gamma := mload(STATE_GAMMA_SLOT)

                    let intermediateValue := addmod(addmod(zMulBeta, gamma, R_MOD), stateOpening0AtZ, R_MOD)
                    factor := mulmod(factor, intermediateValue, R_MOD)

                    // (b(z) + beta * z * k0 + gamma)
                    intermediateValue := addmod(
                        addmod(mulmod(zMulBeta, NON_RESIDUES_0, R_MOD), gamma, R_MOD),
                        stateOpening1AtZ,
                        R_MOD
                    )
                    factor := mulmod(factor, intermediateValue, R_MOD)

                    // (c(z) + beta * z * k1 + gamma)
                    intermediateValue := addmod(
                        addmod(mulmod(zMulBeta, NON_RESIDUES_1, R_MOD), gamma, R_MOD),
                        stateOpening2AtZ,
                        R_MOD
                    )
                    factor := mulmod(factor, intermediateValue, R_MOD)

                    // (d(z) + beta * z * k2 + gamma)
                    intermediateValue := addmod(
                        addmod(mulmod(zMulBeta, NON_RESIDUES_2, R_MOD), gamma, R_MOD),
                        stateOpening3AtZ,
                        R_MOD
                    )
                    factor := mulmod(factor, intermediateValue, R_MOD)
                }

                // += alpha^5 * L_0(z)
                let l0AtZ := mload(STATE_L_0_AT_Z_SLOT)
                factor := addmod(factor, mulmod(l0AtZ, mload(STATE_POWER_OF_ALPHA_5_SLOT), R_MOD), R_MOD)

                // Here we can optimize one scalar multiplication by aggregating coefficients near [z_perm] during
                // computing [F]
                // We will sum them and add and make one scalar multiplication: (coeff1 + coeff2) * [z_perm]
                factor := mulmod(factor, mload(STATE_V_SLOT), R_MOD)
                mstore(COPY_PERMUTATION_FIRST_AGGREGATED_COMMITMENT_COEFF, factor)

                // alpha^4 * beta * z_perm(z*omega)
                factor := mulmod(mload(STATE_POWER_OF_ALPHA_4_SLOT), mload(STATE_BETA_SLOT), R_MOD)
                factor := mulmod(factor, mload(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT), R_MOD)
                {
                    // *= (a(z) + beta * sigma_0(z) + gamma)
                    let beta := mload(STATE_BETA_SLOT)
                    let gamma := mload(STATE_GAMMA_SLOT)

                    let intermediateValue := addmod(
                        addmod(
                            mulmod(mload(PROOF_COPY_PERMUTATION_POLYS_0_OPENING_AT_Z_SLOT), beta, R_MOD),
                            gamma,
                            R_MOD
                        ),
                        stateOpening0AtZ,
                        R_MOD
                    )
                    factor := mulmod(factor, intermediateValue, R_MOD)

                    // *= (b(z) + beta * sigma_1(z) + gamma)
                    intermediateValue := addmod(
                        addmod(
                            mulmod(mload(PROOF_COPY_PERMUTATION_POLYS_1_OPENING_AT_Z_SLOT), beta, R_MOD),
                            gamma,
                            R_MOD
                        ),
                        stateOpening1AtZ,
                        R_MOD
                    )
                    factor := mulmod(factor, intermediateValue, R_MOD)

                    // *= (c(z) + beta * sigma_2(z) + gamma)
                    intermediateValue := addmod(
                        addmod(
                            mulmod(mload(PROOF_COPY_PERMUTATION_POLYS_2_OPENING_AT_Z_SLOT), beta, R_MOD),
                            gamma,
                            R_MOD
                        ),
                        stateOpening2AtZ,
                        R_MOD
                    )
                    factor := mulmod(factor, intermediateValue, R_MOD)
                }

                // *= v * [sigma_3]
                factor := mulmod(factor, mload(STATE_V_SLOT), R_MOD)
                pointMulIntoDest(VK_PERMUTATION_3_X_SLOT, factor, QUERIES_BUFFER_POINT_SLOT)

                pointSubAssign(dest, QUERIES_BUFFER_POINT_SLOT)
            }

            /// @notice Compute lookup contribution to linearisation polynomial commitment multiplied by v
            function addAssignLookupLinearisationContributionWithV(
                dest,
                stateOpening0AtZ,
                stateOpening1AtZ,
                stateOpening2AtZ
            ) {
                // alpha^6 * v * z_lookup(z*omega) * (z - omega^{n-1}) * [s]
                let factor := mload(PROOF_LOOKUP_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT)
                factor := mulmod(factor, mload(STATE_POWER_OF_ALPHA_6_SLOT), R_MOD)
                factor := mulmod(factor, mload(STATE_Z_MINUS_LAST_OMEGA_SLOT), R_MOD)
                factor := mulmod(factor, mload(STATE_V_SLOT), R_MOD)

                // Here we can optimize one scalar multiplication by aggregating coefficients near [s] during
                // computing [F]
                // We will sum them and add and make one scalar multiplication: (coeff1 + coeff2) * [s]
                mstore(LOOKUP_S_FIRST_AGGREGATED_COMMITMENT_COEFF, factor)

                // gamma(1 + beta) + t(x) + beta * t(x*omega)
                factor := mload(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_OMEGA_SLOT)
                factor := mulmod(factor, mload(STATE_BETA_LOOKUP_SLOT), R_MOD)
                factor := addmod(factor, mload(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_SLOT), R_MOD)
                factor := addmod(factor, mload(STATE_BETA_GAMMA_PLUS_GAMMA_SLOT), R_MOD)

                // *= (gamma + f(z))
                // We should use fact that f(x) =
                // lookup_selector(x) * (a(x) + eta * b(x) + eta^2 * c(x) + eta^3 * table_type(x))
                // to restore f(z)
                let fReconstructed
                {
                    fReconstructed := stateOpening0AtZ
                    let eta := mload(STATE_ETA_SLOT)
                    let currentEta := eta

                    fReconstructed := addmod(fReconstructed, mulmod(currentEta, stateOpening1AtZ, R_MOD), R_MOD)
                    currentEta := mulmod(currentEta, eta, R_MOD)
                    fReconstructed := addmod(fReconstructed, mulmod(currentEta, stateOpening2AtZ, R_MOD), R_MOD)
                    currentEta := mulmod(currentEta, eta, R_MOD)

                    // add type of table
                    fReconstructed := addmod(
                        fReconstructed,
                        mulmod(mload(PROOF_LOOKUP_TABLE_TYPE_POLY_OPENING_AT_Z_SLOT), currentEta, R_MOD),
                        R_MOD
                    )
                    fReconstructed := mulmod(fReconstructed, mload(PROOF_LOOKUP_SELECTOR_POLY_OPENING_AT_Z_SLOT), R_MOD)
                    fReconstructed := addmod(fReconstructed, mload(STATE_GAMMA_LOOKUP_SLOT), R_MOD)
                }
                // *= -alpha^6 * (beta + 1) * (z - omega^{n-1})
                factor := mulmod(factor, fReconstructed, R_MOD)
                factor := mulmod(factor, mload(STATE_BETA_PLUS_ONE_SLOT), R_MOD)
                factor := sub(R_MOD, factor)
                factor := mulmod(factor, mload(STATE_POWER_OF_ALPHA_6_SLOT), R_MOD)

                factor := mulmod(factor, mload(STATE_Z_MINUS_LAST_OMEGA_SLOT), R_MOD)

                // += alpha^7 * L_0(z)
                factor := addmod(
                    factor,
                    mulmod(mload(STATE_L_0_AT_Z_SLOT), mload(STATE_POWER_OF_ALPHA_7_SLOT), R_MOD),
                    R_MOD
                )

                // += alpha^8 * L_{n-1}(z)
                factor := addmod(
                    factor,
                    mulmod(mload(STATE_L_N_MINUS_ONE_AT_Z_SLOT), mload(STATE_POWER_OF_ALPHA_8_SLOT), R_MOD),
                    R_MOD
                )

                // Here we can optimize one scalar multiplication by aggregating coefficients near [z_lookup] during
                // computing [F]
                // We will sum them and add and make one scalar multiplication: (coeff1 + coeff2) * [z_lookup]
                factor := mulmod(factor, mload(STATE_V_SLOT), R_MOD)
                mstore(LOOKUP_GRAND_PRODUCT_FIRST_AGGREGATED_COMMITMENT_COEFF, factor)
            }

            /*//////////////////////////////////////////////////////////////
                                    4. Prepare queries
            //////////////////////////////////////////////////////////////*/

            /// @dev Here we compute the first and second parts of batched polynomial commitment
            /// We use the formula:
            ///     [D0] = [t_0] + z^n * [t_1] + z^{2n} * [t_2] + z^{3n} * [t_3]
            /// and
            ///     [D1] = main_gate_selector(z) * (                                        \
            ///                a(z) * [q_a] + b(z) * [q_b] + c(z) * [q_c] + d(z) * [q_d] +  | - main gate contribution
            ///                a(z) * b(z) * [q_ab] + a(z) * c(z) * [q_ac] +                |
            ///                [q_const] + d(z*omega) * [q_{d_next}])                       /
            ///
            ///            + alpha * [custom_gate_selector] * (                             \
            ///                (a(z)^2 - b(z))              +                               | - custom gate contribution
            ///                (b(z)^2 - c(z))    * alpha   +                               |
            ///                (a(z)*c(z) - d(z)) * alpha^2 )                               /
            ///
            ///            + alpha^4 * [z_perm] *                                           \
            ///                (a(z) + beta * z      + gamma) *                             |
            ///                (b(z) + beta * z * k0 + gamma) *                             |
            ///                (c(z) + beta * z * k1 + gamma) *                             |
            ///                (d(z) + beta * z * k2 + gamma)                               | - permutation contribution
            ///            - alpha^4 * z_perm(z*omega) * beta * [sigma_3] *                 |
            ///                (a(z) + beta * sigma_0(z) + gamma) *                         |
            ///                (b(z) + beta * sigma_1(z) + gamma) *                         |
            ///                (c(z) + beta * sigma_2(z) + gamma) *                         |
            ///            + alpha^5 * L_0(z) * [z_perm]                                    /
            ///
            ///            - alpha^6 * (1 + beta') * (gamma' + f(z)) * (z - omega^{n-1}) *  \
            ///                (gamma'(1 + beta') + t(z) + beta' * t(z*omega)) * [z_lookup] |
            ///            + alpha^6 * z_lookup(z*omega) * (z - omega^{n-1}) * [s]          | - lookup contribution
            ///            + alpha^7 * L_0(z) * [z_lookup]                                  |
            ///            + alpha^8 * L_{n-1}(z) * [z_lookup]                              /
            function prepareQueries() {
                // Calculate [D0]
                {
                    let zInDomainSize := mload(STATE_Z_IN_DOMAIN_SIZE)
                    let currentZ := zInDomainSize

                    mstore(QUERIES_AT_Z_0_X_SLOT, mload(PROOF_QUOTIENT_POLY_PARTS_0_X_SLOT))
                    mstore(QUERIES_AT_Z_0_Y_SLOT, mload(PROOF_QUOTIENT_POLY_PARTS_0_Y_SLOT))

                    pointMulAndAddIntoDest(PROOF_QUOTIENT_POLY_PARTS_1_X_SLOT, currentZ, QUERIES_AT_Z_0_X_SLOT)
                    currentZ := mulmod(currentZ, zInDomainSize, R_MOD)

                    pointMulAndAddIntoDest(PROOF_QUOTIENT_POLY_PARTS_2_X_SLOT, currentZ, QUERIES_AT_Z_0_X_SLOT)
                    currentZ := mulmod(currentZ, zInDomainSize, R_MOD)

                    pointMulAndAddIntoDest(PROOF_QUOTIENT_POLY_PARTS_3_X_SLOT, currentZ, QUERIES_AT_Z_0_X_SLOT)
                }

                // Calculate v * [D1]
                // We are going to multiply all the points in the sum by v to save
                // one scalar multiplication during [F] computation
                {
                    let stateOpening0AtZ := mload(PROOF_STATE_POLYS_0_OPENING_AT_Z_SLOT)
                    let stateOpening1AtZ := mload(PROOF_STATE_POLYS_1_OPENING_AT_Z_SLOT)
                    let stateOpening2AtZ := mload(PROOF_STATE_POLYS_2_OPENING_AT_Z_SLOT)
                    let stateOpening3AtZ := mload(PROOF_STATE_POLYS_3_OPENING_AT_Z_SLOT)

                    mainGateLinearisationContributionWithV(
                        QUERIES_AT_Z_1_X_SLOT,
                        stateOpening0AtZ,
                        stateOpening1AtZ,
                        stateOpening2AtZ,
                        stateOpening3AtZ
                    )

                    addAssignRescueCustomGateLinearisationContributionWithV(
                        QUERIES_AT_Z_1_X_SLOT,
                        stateOpening0AtZ,
                        stateOpening1AtZ,
                        stateOpening2AtZ,
                        stateOpening3AtZ
                    )

                    addAssignPermutationLinearisationContributionWithV(
                        QUERIES_AT_Z_1_X_SLOT,
                        stateOpening0AtZ,
                        stateOpening1AtZ,
                        stateOpening2AtZ,
                        stateOpening3AtZ
                    )

                    addAssignLookupLinearisationContributionWithV(
                        QUERIES_AT_Z_1_X_SLOT,
                        stateOpening0AtZ,
                        stateOpening1AtZ,
                        stateOpening2AtZ
                    )
                }

                // Also we should restore [t] for future computations
                // [t] = [col_0] + eta*[col_1] + eta^2*[col_2] + eta^3*[col_3]
                {
                    mstore(QUERIES_T_POLY_AGGREGATED_X_SLOT, mload(VK_LOOKUP_TABLE_0_X_SLOT))
                    mstore(QUERIES_T_POLY_AGGREGATED_Y_SLOT, mload(VK_LOOKUP_TABLE_0_Y_SLOT))

                    let eta := mload(STATE_ETA_SLOT)
                    let currentEta := eta

                    pointMulAndAddIntoDest(VK_LOOKUP_TABLE_1_X_SLOT, currentEta, QUERIES_T_POLY_AGGREGATED_X_SLOT)
                    currentEta := mulmod(currentEta, eta, R_MOD)

                    pointMulAndAddIntoDest(VK_LOOKUP_TABLE_2_X_SLOT, currentEta, QUERIES_T_POLY_AGGREGATED_X_SLOT)
                    currentEta := mulmod(currentEta, eta, R_MOD)

                    pointMulAndAddIntoDest(VK_LOOKUP_TABLE_3_X_SLOT, currentEta, QUERIES_T_POLY_AGGREGATED_X_SLOT)
                }
            }

            /*//////////////////////////////////////////////////////////////
                                    5. Prepare aggregated commitment
            //////////////////////////////////////////////////////////////*/

            /// @dev Here we compute aggregated commitment for the final pairing
            /// We use the formula:
            /// [E] = ( t(z) + v * r(z)
            ///       + v^2*a(z) + v^3*b(z) + v^4*c(z) + v^5*d(z)
            ///       + v^6*main_gate_selector(z)
            ///       + v^7*sigma_0(z) + v^8*sigma_1(z) + v^9*sigma_2(z)
            ///       + v^10*t(z) + v^11*lookup_selector(z) + v^12*table_type(z)
            ///       + u * (v^13*z_perm(z*omega) + v^14*d(z*omega)
            ///           + v^15*s(z*omega) + v^16*z_lookup(z*omega) + v^17*t(z*omega)
            ///       )
            ///  ) * [1]
            /// and
            /// [F] = [D0] + v * [D1]
            ///       + v^2*[a] + v^3*[b] + v^4*[c] + v^5*[d]
            ///       + v^6*[main_gate_selector]
            ///       + v^7*[sigma_0] + v^8*[sigma_1] + v^9*[sigma_2]
            ///       + v^10*[t] + v^11*[lookup_selector] + v^12*[table_type]
            ///       + u * ( v^13*[z_perm] + v^14*[d]
            ///           + v^15*[s] + v^16*[z_lookup] + v^17*[t]
            ///       )
            function prepareAggregatedCommitment() {
                // Here we compute parts of [E] and [F] without u multiplier
                let aggregationChallenge := 1
                let firstDCoeff
                let firstTCoeff

                mstore(AGGREGATED_AT_Z_X_SLOT, mload(QUERIES_AT_Z_0_X_SLOT))
                mstore(AGGREGATED_AT_Z_Y_SLOT, mload(QUERIES_AT_Z_0_Y_SLOT))
                let aggregatedOpeningAtZ := mload(PROOF_QUOTIENT_POLY_OPENING_AT_Z_SLOT)
                {
                    function updateAggregationChallenge(
                        queriesCommitmentPoint,
                        valueAtZ,
                        curAggregationChallenge,
                        curAggregatedOpeningAtZ
                    ) -> newAggregationChallenge, newAggregatedOpeningAtZ {
                        newAggregationChallenge := mulmod(curAggregationChallenge, mload(STATE_V_SLOT), R_MOD)
                        pointMulAndAddIntoDest(queriesCommitmentPoint, newAggregationChallenge, AGGREGATED_AT_Z_X_SLOT)
                        newAggregatedOpeningAtZ := addmod(
                            curAggregatedOpeningAtZ,
                            mulmod(newAggregationChallenge, mload(valueAtZ), R_MOD),
                            R_MOD
                        )
                    }

                    // We don't need to multiply by v, because we have already computed v * [D1]
                    pointAddIntoDest(AGGREGATED_AT_Z_X_SLOT, QUERIES_AT_Z_1_X_SLOT, AGGREGATED_AT_Z_X_SLOT)
                    aggregationChallenge := mulmod(aggregationChallenge, mload(STATE_V_SLOT), R_MOD)
                    aggregatedOpeningAtZ := addmod(
                        aggregatedOpeningAtZ,
                        mulmod(aggregationChallenge, mload(PROOF_LINEARISATION_POLY_OPENING_AT_Z_SLOT), R_MOD),
                        R_MOD
                    )

                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        PROOF_STATE_POLYS_0_X_SLOT,
                        PROOF_STATE_POLYS_0_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        PROOF_STATE_POLYS_1_X_SLOT,
                        PROOF_STATE_POLYS_1_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        PROOF_STATE_POLYS_2_X_SLOT,
                        PROOF_STATE_POLYS_2_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )

                    // Here we can optimize one scalar multiplication by aggregating coefficients near [d]
                    // We will sum them and add and make one scalar multiplication: (coeff1 + coeff2) * [d]
                    aggregationChallenge := mulmod(aggregationChallenge, mload(STATE_V_SLOT), R_MOD)
                    firstDCoeff := aggregationChallenge
                    aggregatedOpeningAtZ := addmod(
                        aggregatedOpeningAtZ,
                        mulmod(aggregationChallenge, mload(PROOF_STATE_POLYS_3_OPENING_AT_Z_SLOT), R_MOD),
                        R_MOD
                    )

                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        VK_GATE_SELECTORS_0_X_SLOT,
                        PROOF_GATE_SELECTORS_0_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        VK_PERMUTATION_0_X_SLOT,
                        PROOF_COPY_PERMUTATION_POLYS_0_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        VK_PERMUTATION_1_X_SLOT,
                        PROOF_COPY_PERMUTATION_POLYS_1_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        VK_PERMUTATION_2_X_SLOT,
                        PROOF_COPY_PERMUTATION_POLYS_2_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )

                    // Here we can optimize one scalar multiplication by aggregating coefficients near [t]
                    // We will sum them and add and make one scalar multiplication: (coeff1 + coeff2) * [t]
                    aggregationChallenge := mulmod(aggregationChallenge, mload(STATE_V_SLOT), R_MOD)
                    firstTCoeff := aggregationChallenge
                    aggregatedOpeningAtZ := addmod(
                        aggregatedOpeningAtZ,
                        mulmod(aggregationChallenge, mload(PROOF_LOOKUP_T_POLY_OPENING_AT_Z_SLOT), R_MOD),
                        R_MOD
                    )

                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        VK_LOOKUP_SELECTOR_X_SLOT,
                        PROOF_LOOKUP_SELECTOR_POLY_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                    aggregationChallenge, aggregatedOpeningAtZ := updateAggregationChallenge(
                        VK_LOOKUP_TABLE_TYPE_X_SLOT,
                        PROOF_LOOKUP_TABLE_TYPE_POLY_OPENING_AT_Z_SLOT,
                        aggregationChallenge,
                        aggregatedOpeningAtZ
                    )
                }
                mstore(AGGREGATED_OPENING_AT_Z_SLOT, aggregatedOpeningAtZ)

                // Here we compute parts of [E] and [F] with u multiplier
                aggregationChallenge := mulmod(aggregationChallenge, mload(STATE_V_SLOT), R_MOD)

                let copyPermutationCoeff := addmod(
                    mload(COPY_PERMUTATION_FIRST_AGGREGATED_COMMITMENT_COEFF),
                    mulmod(aggregationChallenge, mload(STATE_U_SLOT), R_MOD),
                    R_MOD
                )

                pointMulIntoDest(
                    PROOF_COPY_PERMUTATION_GRAND_PRODUCT_X_SLOT,
                    copyPermutationCoeff,
                    AGGREGATED_AT_Z_OMEGA_X_SLOT
                )
                let aggregatedOpeningAtZOmega := mulmod(
                    mload(PROOF_COPY_PERMUTATION_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT),
                    aggregationChallenge,
                    R_MOD
                )

                {
                    function updateAggregationChallenge(
                        queriesCommitmentPoint,
                        valueAtZ_Omega,
                        previousCoeff,
                        curAggregationChallenge,
                        curAggregatedOpeningAtZ_Omega
                    ) -> newAggregationChallenge, newAggregatedOpeningAtZ_Omega {
                        newAggregationChallenge := mulmod(curAggregationChallenge, mload(STATE_V_SLOT), R_MOD)
                        let finalCoeff := addmod(
                            previousCoeff,
                            mulmod(newAggregationChallenge, mload(STATE_U_SLOT), R_MOD),
                            R_MOD
                        )
                        pointMulAndAddIntoDest(queriesCommitmentPoint, finalCoeff, AGGREGATED_AT_Z_OMEGA_X_SLOT)
                        newAggregatedOpeningAtZ_Omega := addmod(
                            curAggregatedOpeningAtZ_Omega,
                            mulmod(newAggregationChallenge, mload(valueAtZ_Omega), R_MOD),
                            R_MOD
                        )
                    }

                    aggregationChallenge, aggregatedOpeningAtZOmega := updateAggregationChallenge(
                        PROOF_STATE_POLYS_3_X_SLOT,
                        PROOF_STATE_POLYS_3_OPENING_AT_Z_OMEGA_SLOT,
                        firstDCoeff,
                        aggregationChallenge,
                        aggregatedOpeningAtZOmega
                    )
                    aggregationChallenge, aggregatedOpeningAtZOmega := updateAggregationChallenge(
                        PROOF_LOOKUP_S_POLY_X_SLOT,
                        PROOF_LOOKUP_S_POLY_OPENING_AT_Z_OMEGA_SLOT,
                        mload(LOOKUP_S_FIRST_AGGREGATED_COMMITMENT_COEFF),
                        aggregationChallenge,
                        aggregatedOpeningAtZOmega
                    )
                    aggregationChallenge, aggregatedOpeningAtZOmega := updateAggregationChallenge(
                        PROOF_LOOKUP_GRAND_PRODUCT_X_SLOT,
                        PROOF_LOOKUP_GRAND_PRODUCT_OPENING_AT_Z_OMEGA_SLOT,
                        mload(LOOKUP_GRAND_PRODUCT_FIRST_AGGREGATED_COMMITMENT_COEFF),
                        aggregationChallenge,
                        aggregatedOpeningAtZOmega
                    )
                    aggregationChallenge, aggregatedOpeningAtZOmega := updateAggregationChallenge(
                        QUERIES_T_POLY_AGGREGATED_X_SLOT,
                        PROOF_LOOKUP_T_POLY_OPENING_AT_Z_OMEGA_SLOT,
                        firstTCoeff,
                        aggregationChallenge,
                        aggregatedOpeningAtZOmega
                    )
                }
                mstore(AGGREGATED_OPENING_AT_Z_OMEGA_SLOT, aggregatedOpeningAtZOmega)

                // Now we can merge both parts and get [E] and [F]
                let u := mload(STATE_U_SLOT)

                // [F]
                pointAddIntoDest(
                    AGGREGATED_AT_Z_X_SLOT,
                    AGGREGATED_AT_Z_OMEGA_X_SLOT,
                    PAIRING_PAIR_WITH_GENERATOR_X_SLOT
                )

                // [E] = (aggregatedOpeningAtZ + u * aggregatedOpeningAtZOmega) * [1]
                let aggregatedValue := addmod(
                    mulmod(mload(AGGREGATED_OPENING_AT_Z_OMEGA_SLOT), u, R_MOD),
                    mload(AGGREGATED_OPENING_AT_Z_SLOT),
                    R_MOD
                )

                mstore(PAIRING_BUFFER_POINT_X_SLOT, 1)
                mstore(PAIRING_BUFFER_POINT_Y_SLOT, 2)
                pointMulIntoDest(PAIRING_BUFFER_POINT_X_SLOT, aggregatedValue, PAIRING_BUFFER_POINT_X_SLOT)
            }

            /*//////////////////////////////////////////////////////////////
                                    5. Pairing
            //////////////////////////////////////////////////////////////*/

            /// @notice Checks the final pairing
            /// @dev We should check the equation:
            /// e([W] + u * [W'], [x]_2) = e(z * [W] + u * z * omega * [W'] + [F] - [E], [1]_2),
            /// where [F] and [E] were computed previously
            ///
            /// Also we need to check that e([P1], [x]_2) = e([P2], [1]_2)
            /// if we have the recursive part of the proof
            /// where [P1] and [P2] are parts of the recursive proof
            ///
            /// We can aggregate both pairings into one for gas optimization:
            /// e([W] + u * [W'] + u^2 * [P1], [x]_2) =
            /// e(z * [W] + u * z * omega * [W'] + [F] - [E] + u^2 * [P2], [1]_2)
            ///
            /// u is a valid challenge for such aggregation,
            /// because [P1] and [P2] are used in PI
            function finalPairing() {
                let u := mload(STATE_U_SLOT)
                let z := mload(STATE_Z_SLOT)
                let zOmega := mulmod(mload(STATE_Z_SLOT), OMEGA, R_MOD)

                // [F] - [E]
                pointSubAssign(PAIRING_PAIR_WITH_GENERATOR_X_SLOT, PAIRING_BUFFER_POINT_X_SLOT)

                // +z * [W] + u * z * omega * [W']
                pointMulAndAddIntoDest(PROOF_OPENING_PROOF_AT_Z_X_SLOT, z, PAIRING_PAIR_WITH_GENERATOR_X_SLOT)
                pointMulAndAddIntoDest(
                    PROOF_OPENING_PROOF_AT_Z_OMEGA_X_SLOT,
                    mulmod(zOmega, u, R_MOD),
                    PAIRING_PAIR_WITH_GENERATOR_X_SLOT
                )

                // [W] + u * [W']
                mstore(PAIRING_PAIR_WITH_X_X_SLOT, mload(PROOF_OPENING_PROOF_AT_Z_X_SLOT))
                mstore(PAIRING_PAIR_WITH_X_Y_SLOT, mload(PROOF_OPENING_PROOF_AT_Z_Y_SLOT))
                pointMulAndAddIntoDest(PROOF_OPENING_PROOF_AT_Z_OMEGA_X_SLOT, u, PAIRING_PAIR_WITH_X_X_SLOT)
                pointNegate(PAIRING_PAIR_WITH_X_X_SLOT)

                // Add recursive proof part if needed
                if mload(VK_RECURSIVE_FLAG_SLOT) {
                    let uu := mulmod(u, u, R_MOD)
                    pointMulAndAddIntoDest(PROOF_RECURSIVE_PART_P1_X_SLOT, uu, PAIRING_PAIR_WITH_GENERATOR_X_SLOT)
                    pointMulAndAddIntoDest(PROOF_RECURSIVE_PART_P2_X_SLOT, uu, PAIRING_PAIR_WITH_X_X_SLOT)
                }

                // Calculate pairing
                {
                    mstore(0x000, mload(PAIRING_PAIR_WITH_GENERATOR_X_SLOT))
                    mstore(0x020, mload(PAIRING_PAIR_WITH_GENERATOR_Y_SLOT))

                    mstore(0x040, G2_ELEMENTS_0_X1)
                    mstore(0x060, G2_ELEMENTS_0_X2)
                    mstore(0x080, G2_ELEMENTS_0_Y1)
                    mstore(0x0a0, G2_ELEMENTS_0_Y2)

                    mstore(0x0c0, mload(PAIRING_PAIR_WITH_X_X_SLOT))
                    mstore(0x0e0, mload(PAIRING_PAIR_WITH_X_Y_SLOT))

                    mstore(0x100, G2_ELEMENTS_1_X1)
                    mstore(0x120, G2_ELEMENTS_1_X2)
                    mstore(0x140, G2_ELEMENTS_1_Y1)
                    mstore(0x160, G2_ELEMENTS_1_Y2)

                    let success := staticcall(gas(), 8, 0, 0x180, 0x00, 0x20)
                    if iszero(success) {
                        revertWithMessage(32, "finalPairing: precompile failure")
                    }
                    if iszero(mload(0)) {
                        revertWithMessage(29, "finalPairing: pairing failure")
                    }
                }
            }

            /*//////////////////////////////////////////////////////////////
                                    Verification
            //////////////////////////////////////////////////////////////*/

            // Step 1: Load the proof and check the correctness of its parts
            loadProof()

            // Step 2: Recompute all the challenges with the transcript
            initializeTranscript()

            // Step 3: Check the quotient equality
            verifyQuotientEvaluation()

            // Step 4: Compute queries [D0] and v * [D1]
            prepareQueries()

            // Step 5: Compute [E] and [F]
            prepareAggregatedCommitment()

            // Step 6: Check the final pairing with aggregated recursive proof
            finalPairing()

            mstore(0, true)
            return(0, 32)
        }
    }
}