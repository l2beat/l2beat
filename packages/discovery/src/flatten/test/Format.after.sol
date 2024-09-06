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

	function fn(function (uint256, bytes32) returns (bytes32) t);

	function fn(function () t);

	function fn(function () internal t);

	function fn(function () external payable returns (bool, bool) t);

	modifier yo;
}

interface I2 is B, C("hello", "world") {}

library Lib {}

error MyError();

error OtherError(uint256 a, bytes b);

enum Bar { X, Y, Z }

event E1();

event E2(address a, address indexed b);

event E3(address a, address indexed b) anonymous;

uint256 constant HELLO = 1;

function foo() pure returns (uint256) {
	return 1;
}

contract Test {
	using a.b for uint256;
	using a.b for *;
	using a.b for * global;
	using a.b for uint256 global;
	using { a.b, c.d as + } for uint256;

	uint256 foo;
	uint256[] foo;
	uint256[2] foo;
	uint256[2][] foo;
	address immutable foo;
	address constant foo;
	mapping(address => bool) single;
	mapping(address user => bool allowed) named;
	mapping(address => mapping(address => int256)) double;
	mapping(Foo.Bar => Baz.Xyz) xxx;

	type Money is uint256;

	struct Vector2 {
		uint256 a;
		string b;
	}

	modifier onlyOwner(address owner) {
		require(msg.sender == owner, "Only owner!");
		_;
	}

	modifier cooCoo() virtual override(Xyz) {}

	constructor() {}

	constructor(uint256 a, bytes calldata b) payable MoonLib.onlyFullMoon {}

	function variables() {
		uint256 foo = 1;
		uint256 foo = 1 wei;
		uint256 foo = 1_2_34.5 ether;
		(uint256 foo, , string a) = (1, true, "hello");
		string escape = "\"'\\and\\\\";
		string escape = "\"'\\and\\\\";
		bytes foo = hex"12_34_ab_CD";
		bytes foo = hex"12" hex"34";
		string foo = "asd";
		string foo = "asd" "fgh";
		uint256 foo = 0x12_34_ab_CD;
		uint256 x = 1 + 2;
		uint256 y = 1 + (2 + 3);
		uint256 z = 1 * (2 + 3);
		address foo = bar();
		address foo = bar.baz(1, 2);
		bool a = !true;
		x++;
		++x;
		unchecked {
			x = x + 3;
		}
		x = y[1];
		x = y[1:2];
		x = y[:2];
		x = y[:];
		ERC20 token = new ERC20("Poop", "POO", 18);
		feed.info{value: 10, gas: 800}();
	}

	function control() {
		uint256 a = b ? c : d;
		for (uint256 i = 0; i < 5; i++) {
			for (uint256 j = 0; j < 5; j++) {
				if (j == 2) {
					continue;
				}
				if (i == 4) {
					break;
				} else if (i == 5) {
					i = 6;
				} else {
					i = 7;
				}
			}
		}
		for (;;) {
			a = false;
		}
		while (true) {
			a = true;
		}
		do {
			a = !a;
		} while (a == b);
		return 3;
	}

	function tryCatchEmit() {
		emit MyEvent("foo", 1234);
		revert();
		revert("reason");
		revert MyError();
		revert MyError("reason");
		try feed.getData(token) returns (uint256 v) {
			return (v, true);
		} catch Error(string memory) {
			errorCount++;
			return (0, false);
		} catch Panic(uint256, bool) {
			errorCount++;
			return (0, false);
		} catch (bytes memory) {
			errorCount++;
			return (0, false);
		} catch {
			return (1234, false);
		}
	}

	function foo() public {
		return;
	}

	function foo() public view {}

	function foo() override(Foo, Bar) {}

	function foo() public payable onlyOwner("Joe") virtual override returns (uint256 calldata b, uint256) {}

	function fallback() {}

	fallback() {}

	function receive() {}

	receive() {}

	function sumPureAsm(uint256[] memory data) public pure returns (uint256 sum) {
		assembly {
			let len := mload(data)
			let loc := add(data, 0x20)
			for
				{
					let end := add(loc, mul(len, 0x20))
				}
				lt(loc, end)
				{
					loc := add(loc, 32)
				}
			{
				sum := add(sum, mload(loc))
				if gt(sum, 10) {
					break
				}
				if lt(sum, 5) {
					continue
				}
			}
		}
		assembly {
			fun.selector := newSelector
			fun.address := newAddress
		}
		assembly {
			function power(base, exponent) -> result {
				switch exponent
					case 0 {
						result := 1
					}
					case 1 {
						result := base
					}
					default {
						result := power(mul(base, base), div(exponent, 2))
						switch mod(exponent, 2)
							case 1 {
								result := mul(base, result)
							}
					}
			}
			function foo() {}
		}
		assembly "evmasm" {}
		assembly ("memory-safe") {}
		assembly "evmasm" ("a", "b") {}
	}

	function sorry() {
		abi.encodePacked("{\"name\": \"Token #", _tokenId.toString(), "\", \"description\": \"A NodeLicense token\", \"image\": \"data:image/svg+xml;base64,", image, "\", \"attributes\": [{\"trait_type\": \"Owner\", \"value\": \"", StringsUpgradeable.toHexString(uint160(ownerAddress)), "\"}, {\"trait_type\": \"Legal\", \"value\": \"https://xai.games/sentrynodeagreement\"}]}");
	}
}