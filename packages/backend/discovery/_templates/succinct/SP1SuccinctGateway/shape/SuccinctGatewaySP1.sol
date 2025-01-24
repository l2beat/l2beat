// SPDX-License-Identifier: Unknown
pragma solidity 0.8.20;

struct VerifierRoute {
    address verifier;
    bool frozen;
}

abstract contract Context {
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

abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
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
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
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
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
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

interface ISP1VerifierGatewayEvents {
    /// @notice Emitted when a verifier route is added.
    /// @param selector The verifier selector that was added.
    /// @param verifier The address of the verifier contract.
    event RouteAdded(bytes4 selector, address verifier);

    /// @notice Emitted when a verifier route is frozen.
    /// @param selector The verifier selector that was frozen.
    /// @param verifier The address of the verifier contract.
    event RouteFrozen(bytes4 selector, address verifier);
}

interface ISP1VerifierGatewayErrors {
    /// @notice Thrown when the verifier route is not found.
    /// @param selector The verifier selector that was specified.
    error RouteNotFound(bytes4 selector);

    /// @notice Thrown when the verifier route is found, but is frozen.
    /// @param selector The verifier selector that was specified.
    error RouteIsFrozen(bytes4 selector);

    /// @notice Thrown when adding a verifier route and the selector already contains a route.
    /// @param verifier The address of the verifier contract in the existing route.
    error RouteAlreadyExists(address verifier);

    /// @notice Thrown when adding a verifier route and the selector returned by the verifier is
    /// zero.
    error SelectorCannotBeZero();
}

interface ISP1Verifier {
    /// @notice Verifies a proof with given public values and vkey.
    /// @dev It is expected that the first 4 bytes of proofBytes must match the first 4 bytes of
    /// target verifier's VERIFIER_HASH.
    /// @param programVKey The verification key for the RISC-V program.
    /// @param publicValues The public values encoded as bytes.
    /// @param proofBytes The proof of the program execution the SP1 zkVM encoded as bytes.
    function verifyProof(
        bytes32 programVKey,
        bytes calldata publicValues,
        bytes calldata proofBytes
    ) external view;
}

interface ISP1VerifierGateway is
    ISP1VerifierGatewayEvents,
    ISP1VerifierGatewayErrors,
    ISP1Verifier
{
    /// @notice Mapping of 4-byte verifier selectors to verifier routes.
    /// @dev Only one verifier route can be added for each selector.
    /// @param selector The verifier selector, which is both the first 4 bytes of the VERIFIER_HASH
    /// and the first 4 bytes of the proofs designed for that verifier.
    /// @return verifier The address of the verifier contract.
    /// @return frozen Whether the verifier is frozen.
    function routes(bytes4 selector) external view returns (address verifier, bool frozen);

    /// @notice Adds a verifier route. This enable proofs to be routed to this verifier.
    /// @dev Only callable by the owner. The owner is responsible for ensuring that the specified
    /// verifier is correct with a valid VERIFIER_HASH. Once a route to a verifier is added, it
    /// cannot be removed.
    /// @param verifier The address of the verifier contract. This verifier MUST implement the
    /// ISP1VerifierWithHash interface.
    function addRoute(address verifier) external;

    /// @notice Freezes a verifier route. This prevents proofs from being routed to this verifier.
    /// @dev Only callable by the owner. Once a route to a verifier is frozen, it cannot be
    /// unfrozen.
    /// @param selector The verifier selector to freeze.
    function freezeRoute(bytes4 selector) external;
}

contract SP1VerifierGateway is ISP1VerifierGateway, Ownable {
    /// @inheritdoc ISP1VerifierGateway
    mapping(bytes4 => VerifierRoute) public routes;

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @inheritdoc ISP1Verifier
    function verifyProof(
        bytes32 programVKey,
        bytes calldata publicValues,
        bytes calldata proofBytes
    ) external view {
        bytes4 selector = bytes4(proofBytes[:4]);
        VerifierRoute memory route = routes[selector];
        if (route.verifier == address(0)) {
            revert RouteNotFound(selector);
        } else if (route.frozen) {
            revert RouteIsFrozen(selector);
        }

        ISP1Verifier(route.verifier).verifyProof(programVKey, publicValues, proofBytes);
    }

    /// @inheritdoc ISP1VerifierGateway
    function addRoute(address verifier) external onlyOwner {
        bytes4 selector = bytes4(ISP1VerifierWithHash(verifier).VERIFIER_HASH());
        if (selector == bytes4(0)) {
            revert SelectorCannotBeZero();
        }

        VerifierRoute storage route = routes[selector];
        if (route.verifier != address(0)) {
            revert RouteAlreadyExists(route.verifier);
        }

        route.verifier = verifier;

        emit RouteAdded(selector, verifier);
    }

    /// @inheritdoc ISP1VerifierGateway
    function freezeRoute(bytes4 selector) external onlyOwner {
        VerifierRoute storage route = routes[selector];
        if (route.verifier == address(0)) {
            revert RouteNotFound(selector);
        }
        if (route.frozen) {
            revert RouteIsFrozen(selector);
        }

        route.frozen = true;

        emit RouteFrozen(selector, route.verifier);
    }
}