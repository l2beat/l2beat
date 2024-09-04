pragma solidity 0.8.0;

import "a.sol";
import * as Bee from "b.sol";
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

error MyError();

error OtherError(uint256 a, bytes b);

enum Bar { X, Y, Z }

event E1();

event E2(address a, address indexed b);

event E3(address a, address indexed b) anonymous;

contract Test {
	using a.b for uint256;
	using a.b for *;
	using a.b for * global;
	using a.b for uint256 global;
	using { a.b, c.d as + } for uint256;

	type Money is uint256;

	struct Vector2 {
		uint256 a;
		string b;
	}

	constructor() {}

	constructor(uint256 a, bytes calldata b) payable onlyFullMoon {}

	function foo() {
		uint256 foo = 1;
		uint256 foo = 1 wei;
		uint256 foo = 1_2_34.5 ether;
		(uint256 foo, , string a) = (1, true, "hello");
	}

	function foo() public {}

	function foo() public view {}

	function foo() override(Foo, Bar) {}

	function foo() public payable onlyOwner("Joe") virtual override returns (uint256 calldata b, uint256) {}

	function fallback() {}

	function receive() {}
}