#!/usr/bin/env python3
"""Find array overflow errors in discovered.json and suggest ignoreMethods.

Usage: python analyze-array-errors.py <discovered_json_path> <config_jsonc_path>
"""
import json
import sys
from collections import defaultdict


def classify_method(name, sig, val_preview):
    """Heuristic classification of what the method does."""
    name_lower = name.lower()
    sig_lower = sig.lower()

    # NFT / token ID enumeration
    if any(x in name_lower for x in ["ownerof", "getapproved", "tokenuri", "tokenbyindex", "balanceofnft"]):
        return "NFT enumeration"
    if any(x in name_lower for x in ["escrowtype", "locked", "voted", "deactivated", "delegates"]):
        return "veNFT state"
    if any(x in name_lower for x in ["managedto", "idtomanaged"]):
        return "veNFT delegation"
    if any(x in name_lower for x in ["numcheckpoints", "userpointepoch", "slopechanges", "pointhistory"]):
        return "veNFT checkpoints"
    if any(x in name_lower for x in ["getpasttotalsupply", "totalsupplyat"]):
        return "historical supply"

    # Pool / AMM state
    if any(x in name_lower for x in ["observation", "lastobservation"]):
        return "TWAP observations"
    if any(x in name_lower for x in ["pools", "allpools"]):
        return "pool enumeration"
    if any(x in name_lower for x in ["tickspacing"]):
        return "pool config"

    # Gauge / rewards
    if any(x in name_lower for x in ["reward", "lastupdatetime"]):
        return "gauge rewards"
    if any(x in name_lower for x in ["epoch"]):
        return "epoch data"

    # Voting / governance
    if any(x in name_lower for x in ["lastvoted", "usedweight", "proposal"]):
        return "voting state"
    if any(x in name_lower for x in ["iswhitelisted"]):
        return "whitelist check"

    # Upkeep / automation
    if any(x in name_lower for x in ["upkeep", "watchlist"]):
        return "Chainlink automation"

    # Monetary values
    if any(x in name_lower for x in ["calculategrowth", "emission", "weekly", "totalweight"]):
        return "emission params"

    # Fee
    if any(x in name_lower for x in ["fee", "unstakedfee"]):
        return "fee config"

    # Time
    if any(x in name_lower for x in ["claimable", "timecursor", "tokensperweek", "tokentime"]):
        return "distribution schedule"

    # Check return type for addresses
    if "address" in sig_lower:
        return "address lookup"

    return "unknown"


def analyze(discovered_path, config_path):
    with open(discovered_path) as f:
        data = json.load(f)
    with open(config_path) as f:
        config_text = f.read()

    entries = {c["address"]: c for c in data.get("entries", []) if c.get("type") != "EOA"}
    abis = data.get("abis", {})

    # Collect all error fields
    items = []
    seen = set()

    for c in data.get("entries", []):
        if c.get("type") == "EOA":
            continue
        errors = c.get("errors", {})
        if not errors:
            continue

        addr = c["address"]
        name = c.get("name", "???")

        # Get ABIs
        contract_abis = list(abis.get(addr, []))
        for impl_addr in c.get("implementationNames", {}):
            contract_abis.extend(abis.get(impl_addr, []))

        for field in errors:
            # Deduplicate by address + field name (NOT contract name,
            # since multiple instances of the same template have different addresses)
            dedup_key = f"{addr}:{field}"
            if dedup_key in seen:
                continue
            seen.add(dedup_key)

            # Check if already in ignoreMethods
            # Simple heuristic: field name appears in config near the address
            already_ignored = False
            idx = config_text.find(f'"{addr}"')
            if idx != -1:
                chunk = config_text[idx:idx + 500]
                if f'"{field}"' in chunk and "ignoreMethods" in chunk:
                    already_ignored = True

            if already_ignored:
                continue

            # Find ABI signature
            sig = ""
            for abi_str in contract_abis:
                if f" {field}(" in abi_str:
                    sig = abi_str
                    break

            # Get value preview
            val = c.get("values", {}).get(field)
            val_preview = ""
            if isinstance(val, list) and len(val) > 0:
                val_preview = str(val[0])[:50]
            elif val is not None:
                val_preview = str(val)[:50]

            # Get return type from sig
            returns = ""
            if "returns" in sig:
                returns = sig.split("returns")[1].strip().strip("()")

            category = classify_method(field, sig, val_preview)

            items.append({
                "contract": name,
                "address": addr,
                "field": field,
                "sig": sig,
                "returns": returns,
                "val_preview": val_preview,
                "category": category,
            })

    if not items:
        print("No array overflow errors found (or all already in ignoreMethods).")
        return

    # Print table
    print(f"Found {len(items)} array overflow fields to review:\n")

    def short_addr(addr):
        return addr[:10] + "..." + addr[-4:]

    print(f"{'#':>3}  {'Contract':<30} {'Address':<20} {'Field':<25} {'Returns':<22} {'Category':<20} {'Sample val'}")
    print("-" * 155)

    for i, item in enumerate(items, 1):
        returns_short = item["returns"][:21] if item["returns"] else ""
        val_short = item["val_preview"][:25] if item["val_preview"] else ""
        print(
            f"{i:>3}  {item['contract']:<30} {short_addr(item['address']):<20} {item['field']:<25} {returns_short:<22} {item['category']:<20} {val_short}"
        )

    # Group by contract address for easy reference
    print("\n\nGrouped by contract (address):")
    by_contract = defaultdict(list)
    for i, item in enumerate(items, 1):
        by_contract[(item["address"], item["contract"])].append((i, item["field"]))

    for (addr, name), fields in sorted(by_contract.items(), key=lambda x: x[0][1]):
        nums = ",".join(str(n) for n, _ in fields)
        field_names = ", ".join(f for _, f in fields)
        print(f"  {name} ({addr}): [{nums}] {field_names}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <discovered.json> <config.jsonc>")
        sys.exit(1)
    analyze(sys.argv[1], sys.argv[2])
