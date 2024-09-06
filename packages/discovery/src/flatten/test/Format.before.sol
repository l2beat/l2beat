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

error MyError();

error OtherError(uint256 a, bytes b);

enum Bar { X, Y, Z }

event E1();

event E2(address a, address indexed b);

event E3(address a, address indexed b) anonymous;

contract Test {
	using a.b for uint;
	using a.b for *;
	using a.b for * global;
	using a.b for uint global;
	using { a.b, c.d as + } for uint;

	uint256 foo;
	uint256[] foo;
	uint256[2] foo;
	uint256[2][] foo;
	address immutable foo;
	address constant foo;

	type Money is uint;

	struct Vector2 {
		uint a;
		string b;
	}

	constructor() {}

	constructor(uint a, bytes calldata b) payable onlyFullMoon {}

	function foo() {
		uint256 foo = 1;
		uint256 foo = 1 wei;
		uint256 foo = 1_2_34.5 ether;
		(uint256 foo, , string a) = (1, true, "hello");
		bytes foo = hex"12_34_ab_CD";
		uint256 foo = 0x12_34_ab_CD;

		bool a = !true;
		x++;
		++x;
		uint256 x = 1 + 2;
		uint256 y = 1 + (2 + 3);
		uint256 z = 1 * (2 + 3);
		address foo = bar();
		address foo = bar.baz(1, 2);

		for (uint i = 0; i < 5; i++) {
			for (uint j = 0; j < 5; j++) {
				if (j == 2) {
					continue;
				}
				if (i == 4) break;
				else if (i == 5) {
					i = 6;
				} else i = 7;
			}
		}
		for (;;) a = false;
		while(true) {
			a = true;
		}
		do {
			a = !a;
		} while ( a== b);
		return 3;
	}

	function foo() public {
		return;
	}

	function foo() public view {}

	function foo() override(Foo, Bar) {}

	function foo() public payable onlyOwner("Joe") virtual override returns (uint calldata b, uint) {}

	function fallback() {}

	function receive() {}
}
