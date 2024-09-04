pragma solidity 0.8.0;

import "a.sol";
import * as Bee from "b.sol";
import { C1, C2 as Cee } from "c.sol";
import * as Dee from "d.sol";

contract Test {
	using a.b for uint256;
	using a.b for *;
	using a.b for * global;
	using a.b for uint256 global;
	using { a.b, c.d as + } for uint256;
}