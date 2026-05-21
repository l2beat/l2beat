#!/usr/bin/env python3
"""
Attack-surface printer: for each externally-reachable function,
report its TRANSITIVE state writes and TRANSITIVE msg.sender guards.

Output: single JSON line on stdout. Stderr is left for slither's own logs.

Usage:  slither_attack_surface.py <target.sol> [solc_path]
"""
import json
import sys

from slither import Slither
from slither.core.declarations.function import Function
from slither.slithir.operations.high_level_call import HighLevelCall
from slither.slithir.operations.library_call import LibraryCall


def msg_sender_checks(function: Function) -> list[str]:
    """Conditionals on msg.sender, transitively through internal calls."""
    funcs = [
        ir.function for ir in function.all_internal_calls() if isinstance(ir.function, Function)
    ] + [function]
    nodes = [n for f in funcs for n in f.nodes]
    cond_nodes = [n for n in nodes if n.contains_if() or n.contains_require_or_assert()]
    return sorted({
        str(n.expression) for n in cond_nodes
        if "msg.sender" in [v.name for v in n.solidity_variables_read]
    })


def _touches_msg_sender(func: Function) -> bool:
    """True iff func or anything it transitively calls reads msg.sender.

    Covers modifiers whose body delegates to a helper (OpenZeppelin
    AccessControl: onlyRole → _checkRole → reads _msgSender() → msg.sender).
    """
    reached = [func] + [
        ir.function for ir in func.all_internal_calls() if isinstance(ir.function, Function)
    ]
    for f in reached:
        for n in f.nodes:
            if "msg.sender" in [v.name for v in n.solidity_variables_read]:
                return True
    return False


def _modifier_invocation_str(modifier_statements) -> str:
    """Reconstruct the modifier call site with arguments, e.g.
    'onlyRoleOrAdminRole(PROPOSER_ROLE)'. Falls back to bare name on miss.
    """
    for n in modifier_statements.nodes:
        if n.expression is not None:
            return str(n.expression)
    return modifier_statements.modifier.name


def msg_sender_modifiers(function: Function) -> list[str]:
    """Modifier invocations (with args) attached to the function that perform
    a msg.sender check transitively. Excludes non-auth modifiers like
    nonReentrant / whenNotPaused.
    """
    SKIP = {"virtual", "override", "payable", "view", "pure", "nonpayable"}
    out = []
    for ms in function.modifiers_statements:
        m = ms.modifier
        name = getattr(m, "name", None) or str(m)
        if name in SKIP:
            continue
        if isinstance(m, Function) and _touches_msg_sender(m):
            out.append(_modifier_invocation_str(ms))
    return sorted(set(out))


def _lib_reaches_external(fn, seen=None) -> bool:
    """Does this library function transitively reach external code execution?

    Returns True if the function body or anything it calls performs:
      - a non-library high-level call (another contract's function)
      - a low-level call (.call / .delegatecall / .staticcall)
      - inline assembly (may contain CALL/DELEGATECALL/STATICCALL opcodes)

    This separates utility libraries (EnumerableSet, SafeMath, Math) from
    libraries that actually reach external code (SafeERC20, Address,
    CallWithExactGas).
    """
    if seen is None:
        seen = set()
    if fn in seen:
        return False
    seen.add(fn)

    if list(fn.low_level_calls):
        return True
    if getattr(fn, "contains_assembly", False):
        return True

    for _c, op in fn.high_level_calls:
        if not isinstance(op, LibraryCall):
            return True
        target = getattr(op, "function", None)
        if isinstance(target, Function) and _lib_reaches_external(target, seen):
            return True

    for ic in fn.internal_calls:
        target = getattr(ic, "function", None)
        if isinstance(target, Function) and _lib_reaches_external(target, seen):
            return True

    return False


def external_calls(function: Function) -> list[dict]:
    """Transitive set of cross-contract or external-reaching calls.

    Each entry is a dict {contract, method, arity} suitable for handing
    to a strict implementation-resolver like sol_goto.find_and_pick.

    Includes HighLevelCalls always; LibraryCalls only if the library
    function transitively performs external execution (assembly, low-level
    call, or non-library HLC). Pure utilities like EnumerableSet / SafeMath
    are excluded as audit noise.
    """
    seen, out = set(), []
    for contract, op in function.all_high_level_calls():
        if isinstance(op, LibraryCall):
            target = getattr(op, "function", None)
            if not (isinstance(target, Function) and _lib_reaches_external(target)):
                continue
        callee = getattr(op, "function", None)
        raw = getattr(op, "function_name", None) \
            or (getattr(callee, "name", None) if callee else None)
        if raw is None:
            continue
        # function_name can be a slither Constant / Expression object; coerce.
        method = str(raw) if not isinstance(raw, str) else raw
        arity = len(callee.parameters) if isinstance(callee, Function) else None
        contract_name = str(contract.name) if contract and contract.name else None
        if not (method and contract_name):
            continue
        key = (contract_name, method, arity)
        if key in seen:
            continue
        seen.add(key)
        kind = ("library" if getattr(contract, "is_library", False)
                else "interface" if getattr(contract, "is_interface", False)
                else "contract")
        out.append({"contract": contract_name, "method": method,
                    "arity": arity, "kind": kind})
    out.sort(key=lambda e: (e["contract"], e["method"], e.get("arity") or 0))
    return out


def main() -> int:
    target = sys.argv[1]
    solc = sys.argv[2] if len(sys.argv) > 2 else None
    sl = Slither(target, solc=solc, disable_solc_warnings=True) if solc else Slither(target, disable_solc_warnings=True)

    out = []
    for contract in sl.contracts_derived:
        if contract.is_interface or contract.is_library:
            continue
        for f in contract.functions_entry_points:
            if not isinstance(f, Function):
                continue
            # Skip parent constructors: they're called transparently as part of
            # the derived constructor's deployment, not a separate entry point.
            if f.is_constructor and f.contract_declarer is not contract:
                continue
            # Filter constants: they're compile-time values inlined into
            # bytecode, not storage. Including them adds noise (e.g. error
            # selector constants referenced from assembly).
            def _is_storage(v):
                return v.name and not getattr(v, "is_constant", False)
            writes = sorted({v.name for v in f.all_state_variables_written() if _is_storage(v)})
            reads  = sorted({v.name for v in f.all_state_variables_read()    if _is_storage(v)})
            calls  = external_calls(f)
            # Transitive internal-call set: "Contract.fn_name" for every
            # internal function this entry point reaches. Used by the qf
            # hover handler for the reverse-callgraph lookup ("which
            # entry points reach the internal function under cursor?").
            internal = set()
            for ic in f.all_internal_calls():
                target = getattr(ic, "function", None)
                if isinstance(target, Function):
                    declarer = getattr(target, "contract_declarer", None)
                    cname = (declarer and declarer.name) or "?"
                    internal.add(f"{cname}.{target.name}")
            # Literal msg.sender conditionals + modifiers that perform a
            # msg.sender check (transitively). Other modifiers (nonReentrant,
            # whenNotPaused, etc.) are deliberately excluded since they don't
            # gate by caller identity.
            guards = sorted(set(msg_sender_checks(f) + msg_sender_modifiers(f)))
            line = (f.source_mapping.lines[0]
                    if f.source_mapping and f.source_mapping.lines else 1)
            mutability = "pure" if f.pure else "view" if f.view else (
                "payable" if f.payable else "nonpayable")
            out.append({
                "contract": contract.name,
                "function": f.full_name,            # e.g. "setRouter(address)"
                "name":     f.name,                 # e.g. "setRouter"
                "visibility": f.visibility,         # "public" | "external"
                "mutability": mutability,           # "view" | "pure" | "payable" | "nonpayable"
                "lnum": line,
                "writes": writes,
                "reads":  reads,
                "calls":  calls,
                "guards": guards,
                "internal_calls": sorted(internal),
            })

    # State variable inventory across ALL contracts (not just leaf-derived),
    # so we can resolve declarations in parent contracts when a function in
    # a derived contract writes an inherited variable. Skips constants
    # since they live in bytecode rather than storage.
    state_vars_out, seen_sv = [], set()
    for contract in sl.contracts:
        if contract.is_interface or contract.is_library:
            continue
        for sv in contract.state_variables_declared:
            if getattr(sv, "is_constant", False):
                continue
            key = (contract.name, sv.name)
            if key in seen_sv:
                continue
            seen_sv.add(key)
            sm = sv.source_mapping
            state_vars_out.append({
                "contract":    contract.name,
                "name":        sv.name,
                "lnum":        sm.lines[0] if sm and sm.lines else 0,
                "visibility":  sv.visibility,
                "is_immutable": bool(getattr(sv, "is_immutable", False)),
            })

    print(json.dumps({"success": True, "results": out,
                      "state_variables": state_vars_out}))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except Exception as e:
        print(json.dumps({"success": False, "error": f"{type(e).__name__}: {e}"}))
        sys.exit(1)
