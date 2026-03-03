Generated with discovered.json: 0x8eb14c501639f8fb5890d5586de6e658f942a2e5

# Diff at Tue, 03 Mar 2026 15:27:02 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@3047506b735612eed63f88825acf567786fab433 block: 1758824267
- current timestamp: 1758824267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758824267 (main branch discovery), not current.

```diff
    contract GovernorBravoDelegate (eth:0x53a328F4086d7C0F1Fa19e594c9b842125263026) {
    +++ description: None
      values.getActions:
-        [[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]]
      errors:
-        {"getActions":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x0cbebf703d619e7b0a43d41c743b1fef09878fdd

# Diff at Tue, 03 Mar 2026 14:36:11 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@8022124997d98da1ae388eae53ed6b9be1f19a8d block: 1758824267
- current timestamp: 1758824267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758824267 (main branch discovery), not current.

```diff
    contract UniswapV2Pair (eth:0x0C722a487876989Af8a05FFfB6e32e45cc23FB3A) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"approve","signature":"function approve(address spender, uint value)","file":"UniswapV2Pair.sol","permissionType":"none","category":"other"},{"function":"burn","signature":"function burn(address to)","file":"UniswapV2Pair.sol","permissionType":"none","category":"financial","requireStatementCount":2},{"function":"initialize","signature":"function initialize(address, address)","file":"UniswapV2Pair.sol","permissionType":"none","category":"other","requireStatementCount":3},{"function":"mint","signature":"function mint(address to)","file":"UniswapV2Pair.sol","permissionType":"none","category":"financial","requireStatementCount":1},{"function":"permit","signature":"function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s)","file":"UniswapV2Pair.sol","permissionType":"none","category":"other"},{"function":"skim","signature":"function skim(address to)","file":"UniswapV2Pair.sol","permissionType":"none","category":"financial","requireStatementCount":3},{"function":"swap","signature":"function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data)","file":"UniswapV2Pair.sol","permissionType":"none","category":"other","requireStatementCount":2},{"function":"sync","signature":"function sync()","file":"UniswapV2Pair.sol","permissionType":"none","category":"other","requireStatementCount":3},{"function":"transfer","signature":"function transfer(address to, uint value)","file":"UniswapV2Pair.sol","permissionType":"none","category":"financial"},{"function":"transferFrom","signature":"function transferFrom(address from, address to, uint value)","file":"UniswapV2Pair.sol","permissionType":"none","category":"financial"}]
    }
```

```diff
    contract FeeToSetter (eth:0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"setFeeToSetter","signature":"function setFeeToSetter(address feeToSetter_)","file":"FeeToSetter.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"setOwner","signature":"function setOwner(address owner_)","file":"FeeToSetter.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"toggleFees","signature":"function toggleFees(bool on)","file":"FeeToSetter.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract Timelock (eth:0x1a9C8182C09F50C8318d769245beA52c32BE35BC) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"acceptAdmin","signature":"function acceptAdmin()","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":7},{"function":"cancelTransaction","signature":"function cancelTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"executeTransaction","signature":"function executeTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"queueTransaction","signature":"function queueTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)","file":"Timelock.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":7},{"function":"setDelay","signature":"function setDelay(uint delay_)","file":"Timelock.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":8},{"function":"setPendingAdmin","signature":"function setPendingAdmin(address pendingAdmin_)","file":"Timelock.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":8}]
    }
```

```diff
    contract GovernorBravoDelegator (eth:0x408ED6354d4973f66138C91495F2f2FCbd8724C3) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"_setImplementation","signature":"function _setImplementation(address implementation_)","file":"contracts/GovernorBravoDelegator.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":2}]
    }
```

```diff
    contract GovernorBravoDelegate (eth:0x53a328F4086d7C0F1Fa19e594c9b842125263026) {
    +++ description: None
      values.proposals:
-        [[0,"eth:0x0000000000000000000000000000000000000000",0,0,0,0,0,0,false,false],[0,"eth:0x0000000000000000000000000000000000000000",0,0,0,0,0,0,false,false],[0,"eth:0x0000000000000000000000000000000000000000",0,0,0,0,0,0,false,false],[0,"eth:0x0000000000000000000000000000000000000000",0,0,0,0,0,0,false,false],[0,"eth:0x0000000000000000000000000000000000000000",0,0,0,0,0,0,false,false]]
      values.writeFunctionPermissions:
-        [{"function":"_acceptAdmin","signature":"function _acceptAdmin()","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"_initiate","signature":"function _initiate(uint proposalCount)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"_setPendingAdmin","signature":"function _setPendingAdmin(address newPendingAdmin)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"_setProposalThreshold","signature":"function _setProposalThreshold(uint newProposalThreshold)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":5},{"function":"_setVotingDelay","signature":"function _setVotingDelay(uint newVotingDelay)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"_setVotingPeriod","signature":"function _setVotingPeriod(uint newVotingPeriod)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":6},{"function":"cancel","signature":"function cancel(uint proposalId)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"castVote","signature":"function castVote(uint proposalId, uint8 support)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"castVoteBySig","signature":"function castVoteBySig(uint proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"none","category":"other","requireStatementCount":4},{"function":"castVoteWithReason","signature":"function castVoteWithReason(uint proposalId, uint8 support, string calldata reason)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":4},{"function":"execute","signature":"function execute(uint proposalId)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"initialize","signature":"function initialize(address timelock_, address uni_, uint votingPeriod_, uint votingDelay_, uint proposalThreshold_)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":9},{"function":"propose","signature":"function propose(address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas, string memory description)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":7},{"function":"queue","signature":"function queue(uint proposalId)","file":"contracts/GovernorBravoDelegate.sol","permissionType":"none","category":"other","requireStatementCount":4}]
      errors.proposals:
-        "Processing error occurred."
    }
```

```diff
    contract UniswapV2Factory (eth:0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"createPair","signature":"function createPair(address tokenA, address tokenB)","file":"UniswapV2Factory.sol","permissionType":"none","category":"other"},{"function":"setFeeTo","signature":"function setFeeTo(address)","file":"UniswapV2Factory.sol","permissionType":"none","category":"administrative"},{"function":"setFeeToSetter","signature":"function setFeeToSetter(address)","file":"UniswapV2Factory.sol","permissionType":"none","category":"administrative"}]
    }
```

```diff
    contract UniswapV2Router02 (eth:0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"addLiquidity","signature":"function addLiquidity(\r\n        address tokenA,\r\n        address tokenB,\r\n        uint amountADesired,\r\n        uint amountBDesired,\r\n        uint amountAMin,\r\n        uint amountBMin,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"addLiquidityETH","signature":"function addLiquidityETH(\r\n        address token,\r\n        uint amountTokenDesired,\r\n        uint amountTokenMin,\r\n        uint amountETHMin,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"removeLiquidity","signature":"function removeLiquidity(\r\n        address tokenA,\r\n        address tokenB,\r\n        uint liquidity,\r\n        uint amountAMin,\r\n        uint amountBMin,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"removeLiquidityETH","signature":"function removeLiquidityETH(\r\n        address token,\r\n        uint liquidity,\r\n        uint amountTokenMin,\r\n        uint amountETHMin,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"removeLiquidityETHSupportingFeeOnTransferTokens","signature":"function removeLiquidityETHSupportingFeeOnTransferTokens(\r\n        address token,\r\n        uint liquidity,\r\n        uint amountTokenMin,\r\n        uint amountETHMin,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"removeLiquidityETHWithPermit","signature":"function removeLiquidityETHWithPermit(\r\n        address token,\r\n        uint liquidity,\r\n        uint amountTokenMin,\r\n        uint amountETHMin,\r\n        address to,\r\n        uint deadline,\r\n        bool approveMax, uint8 v, bytes32 r, bytes32 s\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","signature":"function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(\r\n        address token,\r\n        uint liquidity,\r\n        uint amountTokenMin,\r\n        uint amountETHMin,\r\n        address to,\r\n        uint deadline,\r\n        bool approveMax, uint8 v, bytes32 r, bytes32 s\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"removeLiquidityWithPermit","signature":"function removeLiquidityWithPermit(\r\n        address tokenA,\r\n        address tokenB,\r\n        uint liquidity,\r\n        uint amountAMin,\r\n        uint amountBMin,\r\n        address to,\r\n        uint deadline,\r\n        bool approveMax, uint8 v, bytes32 r, bytes32 s\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"swapETHForExactTokens","signature":"function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"swapExactETHForTokens","signature":"function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"swapExactETHForTokensSupportingFeeOnTransferTokens","signature":"function swapExactETHForTokensSupportingFeeOnTransferTokens(\r\n        uint amountOutMin,\r\n        address[] calldata path,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"swapExactTokensForETH","signature":"function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"swapExactTokensForETHSupportingFeeOnTransferTokens","signature":"function swapExactTokensForETHSupportingFeeOnTransferTokens(\r\n        uint amountIn,\r\n        uint amountOutMin,\r\n        address[] calldata path,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"swapExactTokensForTokens","signature":"function swapExactTokensForTokens(\r\n        uint amountIn,\r\n        uint amountOutMin,\r\n        address[] calldata path,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"swapExactTokensForTokensSupportingFeeOnTransferTokens","signature":"function swapExactTokensForTokensSupportingFeeOnTransferTokens(\r\n        uint amountIn,\r\n        uint amountOutMin,\r\n        address[] calldata path,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other","requireStatementCount":1},{"function":"swapTokensForExactETH","signature":"function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"},{"function":"swapTokensForExactTokens","signature":"function swapTokensForExactTokens(\r\n        uint amountOut,\r\n        uint amountInMax,\r\n        address[] calldata path,\r\n        address to,\r\n        uint deadline\r\n    )","file":"UniswapV2Router02.sol","permissionType":"none","category":"other"}]
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"approve","signature":"function approve(address guy, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"other","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"deposit","signature":"function deposit()","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"transfer","signature":"function transfer(address dst, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"transferFrom","signature":"function transferFrom(address src, address dst, uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"withdraw","signature":"function withdraw(uint wad)","file":"WETH9.sol","permissionType":"msgSender","category":"financial","hasMsgSenderCheck":true,"requireStatementCount":3}]
      template:
+        "tokens"
    }
```

```diff
    contract FeeTo (eth:0xDAF819c2437a82f9e01f6586207ebF961a7f0970) {
    +++ description: None
      values.writeFunctionPermissions:
-        [{"function":"claim","signature":"function claim(address pair)","file":"FeeTo.sol","permissionType":"none","category":"other"},{"function":"renounce","signature":"function renounce(address pair)","file":"FeeTo.sol","permissionType":"none","category":"other"},{"function":"setFeeRecipient","signature":"function setFeeRecipient(address feeRecipient_)","file":"FeeTo.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":2},{"function":"setOwner","signature":"function setOwner(address owner_)","file":"FeeTo.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":3},{"function":"updateTokenAllowState","signature":"function updateTokenAllowState(address token, bool allowed)","file":"FeeTo.sol","permissionType":"msgSender","category":"administrative","hasMsgSenderCheck":true,"requireStatementCount":1},{"function":"updateTokenAllowStates","signature":"function updateTokenAllowStates(address[] memory tokens, bool allowed)","file":"FeeTo.sol","permissionType":"none","category":"administrative"}]
    }
```

Generated with discovered.json: 0xf9d3217dc681d0a0720797648a91b1d9ad2b381d

# Diff at Thu, 25 Sep 2025 18:18:57 GMT:

- author: emduc (<emilien@defiscan.info>)
- current timestamp: 1758824267

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract UniswapV2Pair (eth:0x0C722a487876989Af8a05FFfB6e32e45cc23FB3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeToSetter (eth:0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (eth:0x1a9C8182C09F50C8318d769245beA52c32BE35BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorBravoDelegator (eth:0x408ED6354d4973f66138C91495F2f2FCbd8724C3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorBravoDelegate (eth:0x53a328F4086d7C0F1Fa19e594c9b842125263026)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Factory (eth:0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Router02 (eth:0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeTo (eth:0xDAF819c2437a82f9e01f6586207ebF961a7f0970)
    +++ description: None
```
