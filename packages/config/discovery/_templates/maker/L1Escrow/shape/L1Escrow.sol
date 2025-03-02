// SPDX-License-Identifier: Unknown
pragma solidity 0.7.6;

contract L1Escrow {

  // --- Auth ---
  mapping (address => uint256) public wards;
  function rely(address usr) external auth {
    wards[usr] = 1;
    emit Rely(usr);
  }
  function deny(address usr) external auth {
    wards[usr] = 0;
    emit Deny(usr);
  }
  modifier auth {
    require(wards[msg.sender] == 1, "L1Escrow/not-authorized");
    _;
  }

  event Rely(address indexed usr);
  event Deny(address indexed usr);

  event Approve(address indexed token, address indexed spender, uint256 value);

  constructor() {
    wards[msg.sender] = 1;
    emit Rely(msg.sender);
  }

  function approve(address token, address spender, uint256 value) external auth {
    emit Approve(token, spender, value);
    ApproveLike(token).approve(spender, value);
  }
}