// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.8;

import {Ownable} from 'solidity-utils/contracts/oz-common/Ownable.sol';
import {IExecutor} from './interfaces/IExecutor.sol';
import {Errors} from '../libraries/Errors.sol';

/**
 * @title Executor
 * @author BGD Labs
 * @notice this contract contains the logic to execute a payload.
 * @dev Same code for all Executor levels.
 */
contract Executor is IExecutor, Ownable {
  /// @inheritdoc IExecutor
  function executeTransaction(
    address target,
    uint256 value,
    string memory signature,
    bytes memory data,
    bool withDelegatecall
  ) public payable onlyOwner returns (bytes memory) {
    require(target != address(0), Errors.INVALID_EXECUTION_TARGET);

    bytes memory callData;

    if (bytes(signature).length == 0) {
      callData = data;
    } else {
      callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
    }

    bool success;
    bytes memory resultData;
    if (withDelegatecall) {
      require(msg.value >= value, Errors.NOT_ENOUGH_MSG_VALUE);
      // solium-disable-next-line security/no-call-value
      (success, resultData) = target.delegatecall(callData);
    } else {
      // solium-disable-next-line security/no-call-value
      (success, resultData) = target.call{value: value}(callData);
    }

    require(success, Errors.FAILED_ACTION_EXECUTION);

    emit ExecutedAction(
      target,
      value,
      signature,
      data,
      block.timestamp,
      withDelegatecall,
      resultData
    );

    return resultData;
  }

  receive() external payable {}
}
