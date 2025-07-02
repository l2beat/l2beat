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

function foo() pure returns(uint256) {
	return 1;
}

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
	mapping(address => bool) single;
	mapping(address user => bool allowed) named;
	mapping(address => mapping(address => int)) double;
	mapping(Foo.Bar => Baz.Xyz) xxx;

	type Money is uint;

	struct Vector2 {
		uint a;
		string b;
	}

	modifier onlyOwner(address owner) {
		require(msg.sender == owner, "Only owner!");
		_;
	}

	modifier cooCoo() virtual override(Xyz) {}

	constructor() {}

	constructor(uint a, bytes calldata b) payable MoonLib.onlyFullMoon {}

	function variables() {
		uint256 foo = 1;
		uint256 foo = 1 wei;
		uint256 foo = 1_2_34.5 ether;
		(uint256 foo, , string a) = (1, true, "hello");
		string escape = "\"'\\and\\\\";
		string escape = '"\'\\and\\\\';
		// Unsupported:
		// (bool a) = (false);
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
		// UNSUPPORTED:
		// address foo = bar.baz({ x: 1, y: 2 });
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

	function tryCatchEmit() {
		emit MyEvent("foo", 1234);
		revert();
		revert("reason");
		revert MyError();
		revert MyError("reason");

		try feed.getData(token) returns (uint v) {
			return (v, true);
		} catch Error(string memory) {
			errorCount++;
			return (0, false);
		} catch Panic(uint, bool) {
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

	function foo() public payable onlyOwner("Joe") virtual override returns (uint calldata b, uint) {}

	function fallback() {}

	fallback() {}

	function receive() {}

	receive() {}

	function sumPureAsm(uint[] memory data) public pure returns (uint sum) {
		assembly {
			let len := mload(data)
			let loc := add(data, 0x20)
			for
				{ let end := add(loc, mul(len, 0x20)) }
				lt(loc, end)
				{ loc := add(loc, 32) }
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
			fun.address  := newAddress
		}
		assembly {
			function power(base, exponent) -> result
			{
				switch exponent
				case 0 { result := 1 }
				case 1 { result := base }
				default
				{
					result := power(mul(base, base), div(exponent, 2))
					switch mod(exponent, 2)
						case 1 { result := mul(base, result) }
				}
			}
			function foo() {}
			// Unsupported:
			// foo()
		}
		assembly "evmasm" {}
		assembly ("memory-safe") {}
		assembly "evmasm" ("a", "b") {}
	}

	function sorry() {
		abi.encodePacked(
			'{"name": "Token #',
			_tokenId.toString(),
			'", "description": "A NodeLicense token", "image": "data:image/svg+xml;base64,',
			image,
			'", "attributes": [{"trait_type": "Owner", "value": "',
			StringsUpgradeable.toHexString(uint160(ownerAddress)),
			'"}, {"trait_type": "Legal", "value": "https://xai.games/sentrynodeagreement"}]}'
		);
	}

    function verify(
        uint256[] calldata,
        uint256[] calldata
    ) public view virtual returns (bool) {
        assembly {
            function evaluateLagrangePolyOutOfDomain(polyNum, at) -> res {
                let omegaPower := 1
                if polyNum {
                    omegaPower := modexp(OMEGA, polyNum)
                }

                res := addmod(modexp(at, DOMAIN_SIZE), sub(R_MOD, 1), R_MOD)

                if iszero(res) {
                    revertWithMessage(28, "invalid vanishing polynomial")
                }
                res := mulmod(res, omegaPower, R_MOD)
                let denominator := addmod(at, sub(R_MOD, omegaPower), R_MOD)
                denominator := mulmod(denominator, DOMAIN_SIZE, R_MOD)
                denominator := modexp(denominator, sub(R_MOD, 2))
                res := mulmod(res, denominator, R_MOD)
            }
        }
    }
}
