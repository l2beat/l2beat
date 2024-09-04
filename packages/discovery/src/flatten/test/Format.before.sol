pragma solidity 0.8.0;

import "a.sol";
import "b.sol" as Bee;
import { C1, C2 as Cee } from "c.sol";
import * as Dee from "d.sol";

contract A {}

contract A is B {}

contract A is B, C("hello", "world") {}

interface I1 {
	function foo() public view;
}

interface I2 is B, C("hello", "world") {}

library Lib {}

contract Test {
	using a.b for uint;
	using a.b for *;
	using a.b for * global;
	using a.b for uint global;
	using { a.b, c.d as + } for uint;

	constructor() {}

	constructor(uint a, bytes calldata b) payable onlyFullMoon {}

	function foo() {}

	function foo() public {}

	function foo() public view {}

	function foo() override(Foo, Bar) {}

	function foo() public payable onlyOwner("Joe") virtual override returns (uint calldata b, uint) {}

	function fallback() {}

	function receive() {}
}
