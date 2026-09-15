// SPDX-License-Identifier: MIT
// Every way to write a state variable by name, and the ways that hide the name.
//
// The first contract writes `total`, `balances`, `items`, `owner` and `paused` with every operator
// Solidity has: =, +=, ++, --, delete, push, pop, destructuring, nested index and member access.
// The second contract has the writes level 2 cannot attribute: a storage pointer, a call returning
// one, inline assembly and delegatecall. Each of them must show up as a blind spot, never vanish.
pragma solidity 0.8.20;

contract Forms {
    struct Item {
        address owner;
        uint256 amount;
    }

    uint256 public total;
    uint256 public constant CAP = 100;
    mapping(address => uint256) public balances;
    Item[] public items;
    address public owner = msg.sender;
    bool public paused;
    uint256 public counter;

    function deposit(uint256 amount) external {
        balances[msg.sender] += amount;
        total = total + amount;
    }

    function addItem(address who, uint256 amount) external {
        items.push(Item(who, amount));
        items[items.length - 1].amount = amount;
        counter++;
    }

    function removeLast() external {
        items.pop();
        counter--;
    }

    function reset(address who) external {
        delete balances[who];
        delete items;
    }

    function swapOwner(address next) external returns (address previous) {
        (previous, owner) = (owner, next);
    }

    function pause() external {
        bool wasPaused = paused;
        paused = !wasPaused;
    }

    /// Reads everything, writes nothing: a local variable is assigned, not state.
    function report() external view returns (uint256 sum) {
        uint256 n = items.length;
        for (uint256 i = 0; i < n; i++) {
            sum += items[i].amount;
        }
        sum += total;
    }
}

contract Hidden {
    struct Item {
        address owner;
        uint256 amount;
    }

    Item[] public items;
    mapping(uint256 => Item) public byId;
    uint256 public total;
    address public implementation;

    /// A storage pointer: `d` is `items[i]`, so `d.amount = ...` writes `items`. Level 2 cannot see that.
    function viaPointer(uint256 i, uint256 amount) external {
        Item storage d = items[i];
        d.amount = amount;
    }

    function find(uint256 id) internal view returns (Item storage) {
        return byId[id];
    }

    /// A call that returns a storage pointer: `find(id).amount = ...` writes `byId`.
    function viaCall(uint256 id, uint256 amount) external {
        find(id).amount = amount;
    }

    /// Inline assembly can write any slot.
    function viaAssembly(uint256 value) external {
        assembly {
            sstore(2, value)
        }
    }

    /// The implementation's code runs with this contract's storage.
    function viaDelegate(bytes calldata data) external {
        (bool ok, ) = implementation.delegatecall(data);
        require(ok, "delegatecall failed");
    }

    /// Writes total by name, next to the hidden ones: the by-name write is still exact.
    function plain(uint256 value) external {
        total = value;
    }
}
