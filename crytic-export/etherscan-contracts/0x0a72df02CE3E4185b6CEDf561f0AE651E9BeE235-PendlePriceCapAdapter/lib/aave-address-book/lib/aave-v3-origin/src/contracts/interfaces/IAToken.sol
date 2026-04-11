// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {IScaledBalanceToken} from './IScaledBalanceToken.sol';
import {IInitializableAToken} from './IInitializableAToken.sol';

/**
 * @title IAToken
 * @author Aave
 * @notice Defines the basic interface for an AToken.
 */
interface IAToken is IERC20, IScaledBalanceToken, IInitializableAToken {
  /**
   * @dev Emitted during the transfer action
   * @param from The user whose tokens are being transferred
   * @param to The recipient
   * @param value The scaled amount being transferred
   * @param index The next liquidity index of the reserve
   */
  event BalanceTransfer(address indexed from, address indexed to, uint256 value, uint256 index);

  /**
   * @notice Mints `amount` aTokens to `user`
   * @param caller The address performing the mint
   * @param onBehalfOf The address of the user that will receive the minted aTokens
   * @param scaledAmount The scaled amount of tokens getting minted
   * @param index The next liquidity index of the reserve
   * @return `true` if the the previous balance of the user was 0
   */
  function mint(
    address caller,
    address onBehalfOf,
    uint256 scaledAmount,
    uint256 index
  ) external returns (bool);

  /**
   * @notice Burns aTokens from `user` and sends the equivalent amount of underlying to `receiverOfUnderlying`.
   * @dev Passing both the unscaled and scaled amounts enhances precision. The `scaledAmount` is used for precise balance updates,
   * while the `amount` is used for the underlying asset transfer, preventing cumulative rounding errors.
   * @dev In some instances, a mint event may be emitted from a burn transaction if the amount to burn is less than the interest that the user accrued.
   * @param from The address from which the aTokens will be burned
   * @param receiverOfUnderlying The address that will receive the underlying
   * @param amount The amount of underlying to be burned (non scaled)
   * @param scaledAmount The scaled amount of aTokens to be burned (scaled)
   * @param index The next liquidity index of the reserve
   * @return `true` if the the new balance of the user is 0
   */
  function burn(
    address from,
    address receiverOfUnderlying,
    uint256 amount,
    uint256 scaledAmount,
    uint256 index
  ) external returns (bool);

  /**
   * @notice Mints aTokens to the reserve treasury
   * @param scaledAmount The scaled amount of tokens getting minted
   * @param index The next liquidity index of the reserve
   */
  function mintToTreasury(uint256 scaledAmount, uint256 index) external;

  /**
   * @notice Transfers aTokens in the event of a borrow being liquidated, in case the liquidator reclaims the aToken.
   * @dev Passing both the unscaled and scaled amounts enhances precision. The `scaledAmount` is used for precise balance updates,
   * while the `amount` is used for logging and consistency, preventing cumulative rounding errors.
   * @param from The address getting liquidated, current owner of the aTokens
   * @param to The recipient
   * @param amount The amount of tokens getting transferred (non-scaled)
   * @param scaledAmount The scaled amount of tokens getting transferred (scaled)
   * @param index The next liquidity index of the reserve
   */
  function transferOnLiquidation(
    address from,
    address to,
    uint256 amount,
    uint256 scaledAmount,
    uint256 index
  ) external;

  /**
   * @notice Transfers the underlying asset to `target`.
   * @dev Used by the Pool to transfer assets in borrow(), withdraw() and flashLoan()
   * @param target The recipient of the underlying
   * @param amount The amount getting transferred
   */
  function transferUnderlyingTo(address target, uint256 amount) external;

  /**
   * @notice Allow passing a signed message to approve spending
   * @dev implements the permit function as for
   * https://github.com/ethereum/EIPs/blob/8a34d644aacf0f9f8f00815307fd7dd5da07655f/EIPS/eip-2612.md
   * @param owner The owner of the funds
   * @param spender The spender
   * @param value The amount
   * @param deadline The deadline timestamp, type(uint256).max for max deadline
   * @param v Signature param
   * @param s Signature param
   * @param r Signature param
   */
  function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external;

  /**
   * @notice Returns the address of the underlying asset of this aToken (E.g. WETH for aWETH)
   * @return The address of the underlying asset
   */
  function UNDERLYING_ASSET_ADDRESS() external view returns (address);

  /**
   * @notice Returns the address of the Aave treasury, receiving the fees on this aToken.
   * @return Address of the Aave treasury
   */
  function RESERVE_TREASURY_ADDRESS() external view returns (address);

  /**
   * @notice Get the domain separator for the token
   * @dev Return cached value if chainId matches cache, otherwise recomputes separator
   * @return The domain separator of the token at current chain
   */
  function DOMAIN_SEPARATOR() external view returns (bytes32);

  /**
   * @notice Returns the nonce for owner.
   * @param owner The address of the owner
   * @return The nonce of the owner
   */
  function nonces(address owner) external view returns (uint256);

  /**
   * @notice Rescue and transfer tokens locked in this contract
   * @param token The address of the token
   * @param to The address of the recipient
   * @param amount The amount of token to transfer
   */
  function rescueTokens(address token, address to, uint256 amount) external;
}
