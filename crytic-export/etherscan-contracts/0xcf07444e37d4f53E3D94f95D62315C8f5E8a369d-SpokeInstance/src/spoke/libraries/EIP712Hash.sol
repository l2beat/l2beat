// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {ITokenizationSpoke} from 'src/spoke/interfaces/ITokenizationSpoke.sol';
import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';

/// @title EIP712Hash library
/// @author Aave Labs
/// @notice Helper methods to hash EIP712 typed data structs.
library EIP712Hash {
  using EIP712Hash for *;

  bytes32 public constant SET_USER_POSITION_MANAGERS_TYPEHASH =
    // keccak256('SetUserPositionManagers(address onBehalfOf,PositionManagerUpdate[] updates,uint256 nonce,uint256 deadline)PositionManagerUpdate(address positionManager,bool approve)')
    0xba01f7bf3d3674c63670ec4a78b0d56aac1ad6e8c84468920b9e61bfe0b9851a;

  bytes32 public constant POSITION_MANAGER_UPDATE =
    // keccak256('PositionManagerUpdate(address positionManager,bool approve)')
    0x187dbd227227274b90655fb4011fc21dd749e8966fc040bd91e0b92609202565;

  bytes32 public constant TOKENIZED_DEPOSIT_TYPEHASH =
    // keccak256('TokenizedDeposit(address depositor,uint256 assets,address receiver,uint256 nonce,uint256 deadline)')
    0xdecc632fabbd6d9f578203db4396740eb2d81cf0fd7681b726d116e49cbc240c;

  bytes32 public constant TOKENIZED_MINT_TYPEHASH =
    // keccak256('TokenizedMint(address depositor,uint256 shares,address receiver,uint256 nonce,uint256 deadline)')
    0x12737e595645af6fb99e7985f3dff6fb716ac1ec517c0d2b21313985dc207343;

  bytes32 public constant TOKENIZED_WITHDRAW_TYPEHASH =
    // keccak256('TokenizedWithdraw(address owner,uint256 assets,address receiver,uint256 nonce,uint256 deadline)')
    0xe81b79af873473ec5cb79baa56499159fca87ff2e3333f24183127408a14acb5;

  bytes32 public constant TOKENIZED_REDEEM_TYPEHASH =
    // keccak256('TokenizedRedeem(address owner,uint256 shares,address receiver,uint256 nonce,uint256 deadline)')
    0x03929148275eed00e4c3ef9c0ee72e49ec6cb96c7a34941708e052f9a511334e;

  bytes32 public constant PERMIT_TYPEHASH =
    // keccak256('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')
    0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;

  function hash(ISpoke.SetUserPositionManagers calldata params) internal pure returns (bytes32) {
    bytes32[] memory updatesHashes = new bytes32[](params.updates.length);
    for (uint256 i = 0; i < updatesHashes.length; ++i) {
      updatesHashes[i] = params.updates[i].hash();
    }
    return
      keccak256(
        abi.encode(
          SET_USER_POSITION_MANAGERS_TYPEHASH,
          params.onBehalfOf,
          keccak256(abi.encodePacked(updatesHashes)),
          params.nonce,
          params.deadline
        )
      );
  }

  function hash(
    ISpoke.PositionManagerUpdate calldata params
  ) internal pure returns (bytes32 digest) {
    // equivalent to: keccak256(abi.encode(POSITION_MANAGER_UPDATE, params.positionManager, params.approve))
    assembly {
      let fmp := mload(0x40)
      mstore(0, POSITION_MANAGER_UPDATE)
      mstore(0x20, shr(96, shl(96, calldataload(params)))) // params.positionManager
      mstore(0x40, iszero(iszero(calldataload(add(params, 0x20))))) // params.approve
      digest := keccak256(0, 0x60)
      mstore(0x40, fmp)
    }
  }

  function hash(
    ITokenizationSpoke.TokenizedDeposit calldata params
  ) internal pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          TOKENIZED_DEPOSIT_TYPEHASH,
          params.depositor,
          params.assets,
          params.receiver,
          params.nonce,
          params.deadline
        )
      );
  }

  function hash(ITokenizationSpoke.TokenizedMint calldata params) internal pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          TOKENIZED_MINT_TYPEHASH,
          params.depositor,
          params.shares,
          params.receiver,
          params.nonce,
          params.deadline
        )
      );
  }

  function hash(
    ITokenizationSpoke.TokenizedWithdraw calldata params
  ) internal pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          TOKENIZED_WITHDRAW_TYPEHASH,
          params.owner,
          params.assets,
          params.receiver,
          params.nonce,
          params.deadline
        )
      );
  }

  function hash(
    ITokenizationSpoke.TokenizedRedeem calldata params
  ) internal pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          TOKENIZED_REDEEM_TYPEHASH,
          params.owner,
          params.shares,
          params.receiver,
          params.nonce,
          params.deadline
        )
      );
  }
}
