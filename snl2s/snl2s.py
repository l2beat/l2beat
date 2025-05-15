import requests
import json
import time
import argparse
import os
import glob
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from dotenv import load_dotenv

# Event name to hash mapping
EVENT_KEYS = {
    "L1BridgeSet": "0x10f262273ceaa52776e74b306e33ad0b9e1b4051ae2efdfd782bc4569b421cf",
    "L2TokenGovernanceChanged": "0xa5939adc9600c99eba18c0760fc0884d52129df955922bb7f3a114485b4606",
    "WithdrawalLimitEnabled": "0xcfefac9fac087f5372e9e1f677824f7420c3261eaf33ba240b836cd570e152",
    "WithdrawalLimitDisabled": "0x3da438fe76a955cfd731f2521594d43baae6615852ab7fd9099dc0709b8f75b",
    "ImplementationAdded": "0x38a81c7fd04bac40e22e3eab2bcb3a09398bba67d0c5a263c6665c9c0b13a3",
    "ImplementationRemoved": "0x7633a8d8b49c5c6002a1329e2c9791ea2ced86e06e01e17b5d0d1d5312c792",
    "ImplementationReplaced": "0x34bb683f971572e1b0f230f3dd40f3dbcee94e0b3e3261dd0a91229a1adc4b7",
    "ImplementationFinalized": "0xd1831486d8c46712712653f17d3414869aa50b4c16836d0b3d4afcfeafa024",
    "RoleGranted": "0x9d4a59b844ac9d98627ddba326ab3707a7d7e105fd03c777569d0f61a91f1e",
    "RoleRevoked": "0x2842fd3b01bb0858fef6a2da51cdd9f995c7d36d7625fb68dd5d69fcc0a6d76",
    "RoleAdminChanged": "0x2b23b0c08c7b22209aea4100552de1b7876a49f04ee5a4d94f83ad24bc4ec1c",
    "AppGovernorAdded": "0x1f9961b3744c1e017cbcfafecec635be98ae8c6aeb9f70be5b7e93f2f52e2e5",
    "AppGovernorRemoved": "0xf98c2e7c652ac3805eb73ff089b53a4b501f8e2d750a6131f474d71d49fef8",
    "AppRoleAdminAdded": "0x209ff368803f5de65188245078e888d4462f8d98697699c1dcdd8b02ffb250f",
    "AppRoleAdminRemoved": "0x198116a5c5421876feb02bdb0b472ace223bdde3dbd87f92db8d735a233fbb0",
    "GovernanceAdminAdded": "0x3ae95723946e49d38f0cf844cef1fb25870e9a74999a4b96271625efa849b4c",
    "GovernanceAdminRemoved": "0x2d8a82390cce552844e57407d23a1e48a38c4b979d525b1673171e503e116ab",
    "OperatorAdded": "0x20e4d3438ce3d451a0b4c17cdcbdd5aef2ba11c5b28a2d65353f91db3eb26dd",
    "OperatorRemoved": "0xf73e08374e6098adb9600916577e3311612674306f1c2e3fe239a4576ad157",
    "TokenAdminAdded": "0x36d743b501f1ce191c02b6bd687c6790def364974947f206de67805a5d0d794",
    "TokenAdminRemoved": "0xa3eac89d22258ea63a7f47b0be3c559c6177eb4d7fe6641b109da1e1272d60",
    "UpgradeGovernorAdded": "0x2143175c365244751ccde24dd8f54f934672d6bc9110175c9e58e1e73705531",
    "UpgradeGovernorRemoved": "0x25e2d538533284b9d61dfe45b9aaa563d33ef8374d9bb26d77a009b8e21f0de",
    "SecurityAdminAdded": "0x1d6c15800e6da7a5556b49a824ea4b70c1169d71092c1a4c5d80aaadc6636d1",
    "SecurityAdminRemoved": "0x2eb7ab861b6ade361ff0e949e94d48fd5b2052639b40cfe9f796f2bb7864f45",
    "SecurityAgentAdded": "0xde2aa78658531ebb6d1125461e139734c22e0d3045a3a44366066a2756070e",
    "SecurityAgentRemoved": "0x2642a36e73652fddc2c8b6e54d2dd5396dd5385d190a121e2e1da5772dff325"
}
EVENT_NAMES = {v: k for k, v in EVENT_KEYS.items()}
DEFAULT_FROM_BLOCK = 0
SCAN_FILENAME_PREFIX = "events_data_"
DIGEST_FILENAME_PREFIX = "governance_state_"

# ROLE ID to Label Mapping
ROLE_ID_TO_LABEL = {
    "0xd2ead78c620e94b02d0a996e99298c59ddccfa1d8a0149080ac3a20de06068": "APP_GOVERNOR",
    "0x3e615638e0b79444a70f8c695bf8f2a47033bf1cf95691ec3130f64939cee99": "APP_ROLE_ADMIN",
    "0x3711c9d994faf6055172091cb841fd4831aa743e6f3315163b06a122c841846": "GOVERNANCE_ADMIN",
    "0x023edb77f7c8cc9e38e8afe78954f703aeeda7fffe014eeb6e56ea84e62f6da7": "OPERATOR",
    "0x0128d63adbf6b09002c26caf55c47e2f26635807e3ef1b027218aa74c8d61a3e": "TOKEN_ADMIN",
    "0x251e864ca2a080f55bce5da2452e8cfcafdbc951a3e7fff5023d558452ec228": "UPGRADE_GOVERNOR",
    "0x26bd110619d11cfdfc28e281df893bc24828e89177318e9dbd860cdaedeb6b3": "SECURITY_ADMIN",
    "0x37693ba312785932d430dccf0f56ffedd0aa7c0f8b6da2cc4530c2717689b96": "SECURITY_AGENT",
}


def get_role_label(role_id: Optional[str]) -> Optional[str]:
    """Converts a role ID to its label, or returns the ID if no mapping exists."""
    if role_id is None:
        return None
    return ROLE_ID_TO_LABEL.get(role_id.lower(), role_id)

def get_bridge_output_dir(bridge_address: str) -> str:
    return os.path.join(".", bridge_address)

def fetch_governance_events(
    api_key: str,
    bridge_address: str,
    from_block_number: int,
    event_hashes_to_fetch: Optional[List[str]] = None
) -> Dict[str, Any]:
    if event_hashes_to_fetch is None:
        event_hashes_to_fetch = list(EVENT_KEYS.values())

    url = f"https://starknet-mainnet.g.alchemy.com/v2/{api_key}"
    all_events_by_name: Dict[str, List[Dict[str, Any]]] = {}
    highest_block_fetched_this_run = from_block_number -1 

    print(f"Fetching events from block {from_block_number} for bridge {bridge_address}...")

    for i, event_key_hash in enumerate(event_hashes_to_fetch, 1):
        event_name = EVENT_NAMES.get(event_key_hash, f"Unknown({event_key_hash})")
        all_events_by_name.setdefault(event_name, [])
        
        print(f"[{i}/{len(event_hashes_to_fetch)}] Fetching {event_name} events...")

        continuation_token: Optional[str] = None
        page = 1
        max_retries = 3
        current_event_type_count = 0

        while True:
            payload = {
                "jsonrpc": "2.0",
                "method": "starknet_getEvents",
                "params": [{
                    "from_block": {"block_number": from_block_number},
                    "to_block": "latest",
                    "address": bridge_address,
                    "keys": [[event_key_hash]],
                    "chunk_size": 1000
                }],
                "id": 1
            }
            if continuation_token:
                payload["params"][0]["continuation_token"] = continuation_token

            response_data = None
            for attempt in range(max_retries):
                try:
                    response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=60)
                    response.raise_for_status()
                    response_data = response.json()
                    break
                except (requests.RequestException, requests.Timeout) as e:
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt
                        print(f"Request failed for {event_name} (page {page}), retrying in {wait_time}s: {e}")
                        time.sleep(wait_time)
                    else:
                        print(f"Failed to fetch {event_name} after {max_retries} attempts: {e}")
                        raise  

            if response_data is None: 
                break 
            
            if "error" in response_data:
                raise Exception(f"API error for {event_name}: {response_data['error']}")

            events_chunk = response_data["result"]["events"]

            for event in events_chunk:
                event["event_name"] = event_name 
                all_events_by_name[event_name].append(event)
                current_event_type_count +=1
                if "block_number" in event and event["block_number"] > highest_block_fetched_this_run:
                    highest_block_fetched_this_run = event["block_number"]
            
            if "continuation_token" in response_data["result"] and response_data["result"]["continuation_token"]:
                continuation_token = response_data["result"]["continuation_token"]
                page += 1
            else:
                break
        if current_event_type_count > 0:
             print(f"  Total {event_name} events fetched in this run: {current_event_type_count}")

    return {
        "events_by_name": all_events_by_name,
        "highest_block_fetched_this_run": highest_block_fetched_this_run
    }

def decode_event(event: Dict[str, Any]) -> Dict[str, Any]:
    event_name = event.get("event_name", "Unknown")
    decoded: Dict[str, Any] = {
        "transaction_hash": event.get("transaction_hash"),
        "block_hash": event.get("block_hash"),
        "block_number": event.get("block_number"),
        "event_name": event_name,
        "_raw_keys": event.get("keys", []), 
        "_raw_data": event.get("data", [])
    }
    raw_data = event.get("data", [])
    raw_event_keys = event.get("keys", []) 

    if event_name == "L1BridgeSet" and len(raw_data) >= 1:
        decoded["l1_bridge_address"] = raw_data[0]
    elif event_name == "L2TokenGovernanceChanged" and len(raw_data) >= 2:
        decoded["previous_governance"] = raw_data[0]
        decoded["new_governance"] = raw_data[1]
    elif event_name in ["WithdrawalLimitEnabled", "WithdrawalLimitDisabled"]:
        if len(raw_event_keys) >= 3:
             decoded["sender"] = raw_event_keys[1] 
             decoded["l1_token"] = raw_event_keys[2]
    elif event_name in ["ImplementationAdded", "ImplementationRemoved", "ImplementationReplaced"]:
        decoded["implementation_data_raw"] = raw_data 
    elif event_name == "ImplementationFinalized" and len(raw_data) >= 1:
        decoded["impl_hash"] = raw_data[0]
    elif event_name in ["RoleGranted", "RoleRevoked"] and len(raw_data) >= 3:
        decoded["role"] = raw_data[0]
        decoded["account"] = raw_data[1]
        decoded["sender"] = raw_data[2]
    elif event_name == "RoleAdminChanged" and len(raw_data) >= 3:
        decoded["role"] = raw_data[0]
        decoded["previous_admin_role"] = raw_data[1]
        decoded["new_admin_role"] = raw_data[2]
    elif event_name in [
        "AppGovernorAdded", "AppRoleAdminAdded", "GovernanceAdminAdded", 
        "OperatorAdded", "TokenAdminAdded", "UpgradeGovernorAdded", 
        "SecurityAdminAdded", "SecurityAgentAdded"
    ] and len(raw_data) >= 2:
        decoded["added_account"] = raw_data[0]
        decoded["added_by"] = raw_data[1]
    elif event_name in [
        "AppGovernorRemoved", "AppRoleAdminRemoved", "GovernanceAdminRemoved", 
        "OperatorRemoved", "TokenAdminRemoved", "UpgradeGovernorRemoved", 
        "SecurityAdminRemoved", "SecurityAgentRemoved"
    ] and len(raw_data) >= 2:
        decoded["removed_account"] = raw_data[0]
        decoded["removed_by"] = raw_data[1]
    return decoded

def load_cached_scan_data(output_dir: str, initial_from_block: int, force_rescan: bool) -> Tuple[List[Dict[str, Any]], int, int]:
    if force_rescan:
        print(f"Cache override: Forcing rescan from block {initial_from_block}.")
        default_val = -1 if initial_from_block == 0 else initial_from_block - 1
        return [], initial_from_block, default_val

    scan_files = sorted(glob.glob(os.path.join(output_dir, f"{SCAN_FILENAME_PREFIX}*.json")), key=os.path.getctime, reverse=True)
    
    if not scan_files:
        print(f"No previous scan data found in {output_dir}. Starting fresh scan from block {initial_from_block}.")
        default_val = -1 if initial_from_block == 0 else initial_from_block - 1
        return [], initial_from_block, default_val

    latest_scan_file = scan_files[0]
    print(f"Loading cached data from: {latest_scan_file}")
    try:
        # Specify encoding when opening the file for reading
        with open(latest_scan_file, 'r', encoding='utf-8') as f: 
            data = json.load(f)
        
        cached_events = data.get("events", [])
        metadata = data.get("metadata", {})

        # --- Optional Debugging ---
        # print(f"DEBUG: Loaded metadata keys: {list(metadata.keys())}")
        # print(f"DEBUG: Value for 'highest_block_scanned_in_file': {metadata.get('highest_block_scanned_in_file')}")
        # --- End Optional Debugging ---

        retrieved_block_val = metadata.get("highest_block_scanned_in_file")

        if isinstance(retrieved_block_val, int):
            highest_block_in_cache = retrieved_block_val
        else:
            if retrieved_block_val is not None: 
                print(f"Warning: 'highest_block_scanned_in_file' in {latest_scan_file} metadata is not an int (value: {retrieved_block_val}, type: {type(retrieved_block_val)}). Defaulting.")
            
            default_cache_value = -1 
            if initial_from_block != 0: 
                default_cache_value = initial_from_block - 1
            
            highest_block_in_cache = default_cache_value
            
            if not (initial_from_block == 0 and highest_block_in_cache == -1 and retrieved_block_val is None):
                 print(f"Info: Using default highest_block_in_cache: {highest_block_in_cache} (initial_from_block: {initial_from_block}, retrieved value: {retrieved_block_val}).")

        scan_from_block = highest_block_in_cache + 1
        print(f"Resuming scan from block {scan_from_block} (based on highest block in cache: {highest_block_in_cache}).")
        return cached_events, scan_from_block, highest_block_in_cache
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from cache file {latest_scan_file}: {e}. Starting fresh scan.")
        default_val = -1 if initial_from_block == 0 else initial_from_block -1
        return [], initial_from_block, default_val
    except Exception as e:
        print(f"Error loading cache file {latest_scan_file}: {e}. Starting fresh scan from block {initial_from_block}.")
        default_val = -1 if initial_from_block == 0 else initial_from_block -1
        return [], initial_from_block, default_val

def manage_scan_file_rotation(output_dir: str, keep_scans: int):
    scan_files = sorted(glob.glob(os.path.join(output_dir, f"{SCAN_FILENAME_PREFIX}*.json")), key=os.path.getctime)
    files_to_delete_count = len(scan_files) - keep_scans
    if files_to_delete_count > 0:
        print(f"Rotating scan files: removing {files_to_delete_count} oldest files...")
        for i in range(files_to_delete_count):
            try:
                os.remove(scan_files[i])
                print(f"  Removed: {scan_files[i]}")
            except OSError as e:
                print(f"  Error removing {scan_files[i]}: {e}")

def digest_events_data(events_list: List[Dict[str, Any]], bridge_address: str) -> Dict[str, Any]:
    events_list = [e for e in events_list if e.get("block_number") is not None]
    events_list.sort(key=lambda e: e["block_number"])

    state: Dict[str, Any] = {
        "bridge_address": bridge_address,
        "roles": {
            "app_governors": {}, "app_role_admins": {}, "governance_admins": {},
            "operators": {}, "token_admins": {}, "upgrade_governors": {},
            "security_admins": {}, "security_agents": {},
        },
        "role_admins": {},
        "generic_roles": {},
        "l1_bridge": None,
        "l2_token_governance": None,
        "implementations": {"added": {}, "removed": {}, "replaced": {}, "finalized": None},
        "withdrawal_limits": {},
        "last_processed_block": 0 
    }
    if events_list: # Initialize last_processed_block to a value before the first event if events exist
        first_block = events_list[0].get("block_number")
        if first_block is not None:
             state["last_processed_block"] = first_block -1
        else: # Should not happen due to filter, but defensive
             state["last_processed_block"] = -1


    for event in events_list:
        event_name = event.get("event_name")
        block_num = event.get("block_number")

        if not event_name or block_num is None: 
            continue

        if block_num > state["last_processed_block"]:
            state["last_processed_block"] = block_num

        if event_name == "L1BridgeSet":
            state["l1_bridge"] = {
                "address": event.get("l1_bridge_address"),
                "set_at_block": block_num
            }
        elif event_name == "L2TokenGovernanceChanged":
            state["l2_token_governance"] = {
                "previous": event.get("previous_governance"),
                "current": event.get("new_governance"),
                "changed_at_block": block_num
            }
        elif event_name == "WithdrawalLimitEnabled":
            token = event.get("l1_token")
            if token: 
                state["withdrawal_limits"][token] = {
                    "enabled": True,
                    "sender": event.get("sender"), 
                    "updated_at_block": block_num
                }
        elif event_name == "WithdrawalLimitDisabled":
            token = event.get("l1_token")
            if token:
                state["withdrawal_limits"][token] = {
                    "enabled": False,
                    "sender": event.get("sender"),
                    "updated_at_block": block_num
                }
        elif event_name == "ImplementationAdded":
            impl_data = event.get("implementation_data_raw", [])
            if len(impl_data) > 0:
                impl_hash = impl_data[0]
                state["implementations"]["added"][impl_hash] = {
                    "data": impl_data, 
                    "added_at_block": block_num
                }
        elif event_name == "ImplementationRemoved":
            impl_data = event.get("implementation_data_raw", [])
            if len(impl_data) > 0:
                impl_hash = impl_data[0]
                state["implementations"]["removed"][impl_hash] = {
                    "data": impl_data,
                    "removed_at_block": block_num
                }
                if impl_hash in state["implementations"]["added"]:
                    del state["implementations"]["added"][impl_hash]
        elif event_name == "ImplementationReplaced":
            impl_data = event.get("implementation_data_raw", [])
            if len(impl_data) > 0: 
                impl_hash = impl_data[0] 
                state["implementations"]["replaced"][impl_hash] = { 
                    "data": impl_data,
                    "replaced_at_block": block_num
                }
        elif event_name == "ImplementationFinalized":
            state["implementations"]["finalized"] = {
                "impl_hash": event.get("impl_hash"),
                "finalized_at_block": block_num
            }
        elif event_name == "RoleGranted":
            role_id, account = event.get("role"), event.get("account")
            if role_id and account:
                role_label = get_role_label(role_id) # Convert ID to label
                if role_label not in state["generic_roles"]:
                    state["generic_roles"][role_label] = {}
                state["generic_roles"][role_label][account] = {
                    "granted_by": event.get("sender"),
                    "granted_at_block": block_num
                }
        elif event_name == "RoleRevoked":
            role_id, account = event.get("role"), event.get("account")
            if role_id and account:
                role_label = get_role_label(role_id) # Convert ID to label
                if role_label in state["generic_roles"] and account in state["generic_roles"][role_label]:
                    del state["generic_roles"][role_label][account]
                    if not state["generic_roles"][role_label]: 
                        del state["generic_roles"][role_label]
        elif event_name == "RoleAdminChanged":
            role_id = event.get("role")
            if role_id is not None: 
                role_label = get_role_label(role_id) # Convert main role ID to label
                
                prev_admin_id = event.get("previous_admin_role")
                # Convert previous admin role ID to label
                prev_admin_label = get_role_label(prev_admin_id) 
                
                new_admin_id = event.get("new_admin_role")
                # Convert new admin role ID to label
                new_admin_label = get_role_label(new_admin_id)
                
                state["role_admins"][role_label] = {
                    "previous_admin_role": prev_admin_label,
                    "current_admin_role": new_admin_label,
                    "changed_at_block": block_num
                }
        elif event_name == "AppGovernorAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["app_governors"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "AppRoleAdminAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["app_role_admins"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "GovernanceAdminAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["governance_admins"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "OperatorAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["operators"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "TokenAdminAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["token_admins"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "UpgradeGovernorAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["upgrade_governors"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "SecurityAdminAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["security_admins"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "SecurityAgentAdded":
            acc, by = event.get("added_account"), event.get("added_by")
            if acc and by: state["roles"]["security_agents"][acc] = {"added_by": by, "added_at_block": block_num}
        elif event_name == "AppGovernorRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["app_governors"]: del state["roles"]["app_governors"][acc]
        elif event_name == "AppRoleAdminRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["app_role_admins"]: del state["roles"]["app_role_admins"][acc]
        elif event_name == "GovernanceAdminRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["governance_admins"]: del state["roles"]["governance_admins"][acc]
        elif event_name == "OperatorRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["operators"]: del state["roles"]["operators"][acc]
        elif event_name == "TokenAdminRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["token_admins"]: del state["roles"]["token_admins"][acc]
        elif event_name == "UpgradeGovernorRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["upgrade_governors"]: del state["roles"]["upgrade_governors"][acc]
        elif event_name == "SecurityAdminRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["security_admins"]: del state["roles"]["security_admins"][acc]
        elif event_name == "SecurityAgentRemoved":
            acc = event.get("removed_account")
            if acc and acc in state["roles"]["security_agents"]: del state["roles"]["security_agents"][acc]

    state["summary"] = {
        "app_governors_count": len(state["roles"]["app_governors"]),
        "app_role_admins_count": len(state["roles"]["app_role_admins"]),
        "governance_admins_count": len(state["roles"]["governance_admins"]),
        "operators_count": len(state["roles"]["operators"]),
        "token_admins_count": len(state["roles"]["token_admins"]),
        "upgrade_governors_count": len(state["roles"]["upgrade_governors"]),
        "security_admins_count": len(state["roles"]["security_admins"]),
        "security_agents_count": len(state["roles"]["security_agents"]),
        "role_admins_count": len(state["role_admins"]),
        "generic_roles_count": sum(len(accounts) for accounts in state["generic_roles"].values()),
        "withdrawal_limits_count": len(state["withdrawal_limits"]),
        "implementations_added_count": len(state["implementations"]["added"]),
        "implementations_removed_count": len(state["implementations"]["removed"]),
        "implementations_replaced_count": len(state["implementations"]["replaced"]),
        "implementation_finalized": state["implementations"]["finalized"] is not None,
        "last_processed_block": state["last_processed_block"]
    }
    return state

def display_governance_state(state: Dict[str, Any]):
    print("\n===== CURRENT GOVERNANCE STATE =====")
    print(f"Bridge Address: {state.get('bridge_address')}")
    print(f"Digest based on events up to block: {state.get('last_processed_block')}")
    l1_bridge = state.get("l1_bridge")
    if l1_bridge and l1_bridge.get('address'):
        print(f"  Address: {l1_bridge['address']}")
        print(f"  Set at Block: {l1_bridge.get('set_at_block')}")
    else:
        print("  Not set")
    l2_gov = state.get("l2_token_governance")
    if l2_gov and l2_gov.get('current'):
        print(f"  Current: {l2_gov['current']}")
        print(f"  Previous: {l2_gov.get('previous')}")
        print(f"  Changed at Block: {l2_gov.get('changed_at_block')}")
    else:
        print("  Not set")
    print("\n--- Role Counts (from summary) ---")
    summary = state.get("summary", {})
    for key, count in summary.items():
        if key.endswith("_count"):
            print(f"  {key.replace('_count', '').replace('_', ' ').title()}: {count}")
    print("\n--- Active Role Accounts ---")
    for role_type, accounts in state.get("roles", {}).items():
        if accounts: 
            print(f"\n  {role_type.replace('_', ' ').title()} ({len(accounts)}):")
            for account, details in accounts.items():
                print(f"    Account: {account}")
                print(f"      Added by: {details.get('added_by')}")
                print(f"      Added at block: {details.get('added_at_block')}")
    if state.get("role_admins"):
        print("\n--- Role Admin Relationships ---")
        for role, admin_details in state["role_admins"].items():
            print(f"  Role: {role}")
            print(f"    Administered by (Current): {admin_details.get('current_admin')}")
            print(f"    Previous Admin: {admin_details.get('previous_admin')}")
            print(f"    Changed at Block: {admin_details.get('changed_at_block')}")
    if state.get("generic_roles"):
        print("\n--- Generic Roles Granted ---")
        for role, accounts_data in state["generic_roles"].items():
            print(f"  Role: {role} ({len(accounts_data)} holder(s))")
            for account, grant_details in accounts_data.items():
                print(f"    Account: {account}")
                print(f"      Granted by: {grant_details.get('granted_by')}")
                print(f"      Granted at Block: {grant_details.get('granted_at_block')}")
    print("\n--- Implementation Status ---")
    implementations = state.get("implementations", {})
    finalized_impl = implementations.get("finalized")
    if finalized_impl:
        print(f"  Finalized Implementation: {finalized_impl.get('impl_hash')} at block {finalized_impl.get('finalized_at_block')}")
    else:
        print("  No implementation finalized.")
    if implementations.get("added"):
        print(f"  Currently Added Implementations ({len(implementations['added'])}):")
        for impl_hash, details in implementations["added"].items():
            print(f"    Hash: {impl_hash} (Added at block: {details.get('added_at_block')}, Data: {details.get('data')})")
    if implementations.get("replaced"):
         print(f"  Replaced Implementations Log ({len(implementations['replaced'])}):")
         for impl_hash, details in implementations["replaced"].items():
            print(f"    Hash: {impl_hash} (Replaced at block: {details.get('replaced_at_block')}, Data: {details.get('data')})")
    if state.get("withdrawal_limits"):
        print("\n--- Withdrawal Limits ---")
        for token, details in state["withdrawal_limits"].items():
            status = "Enabled" if details.get("enabled") else "Disabled"
            print(f"  Token: {token}")
            print(f"    Status: {status}")
            print(f"    Set by: {details.get('sender')}")
            print(f"    Updated at Block: {details.get('updated_at_block')}")
    print("====================================")

def handle_scan_mode(args: argparse.Namespace):
    print(f"Running in SCAN mode for bridge: {args.bridge_address}")
    process_start_time = time.time() 

    output_dir = get_bridge_output_dir(args.bridge_address)
    os.makedirs(output_dir, exist_ok=True)

    cached_events, scan_from_block, highest_block_in_cache = load_cached_scan_data(
        output_dir, args.initial_from_block, args.force_rescan
    )

    print(f"Fetching new events from block {scan_from_block}...")
    fetch_start_time = time.time()
    fetch_result = fetch_governance_events(
        args.api_key, args.bridge_address, scan_from_block
    )
    fetch_duration = time.time() - fetch_start_time
    print(f"Event fetching took {fetch_duration:.2f} seconds.")
    
    raw_new_events_by_name = fetch_result["events_by_name"]
    highest_block_in_new_fetch = fetch_result["highest_block_fetched_this_run"]

    newly_decoded_events: List[Dict[str, Any]] = []
    total_new_events_count = 0
    for event_name, raw_events_list in raw_new_events_by_name.items():
        if raw_events_list:
            for raw_event in raw_events_list:
                newly_decoded_events.append(decode_event(raw_event))
            total_new_events_count += len(raw_events_list)
    
    print(f"Fetched and decoded {total_new_events_count} new events in this run.")

    all_events_combined = cached_events + newly_decoded_events
    if all_events_combined:
        all_events_combined.sort(key=lambda e: (e.get("block_number", 0), e.get("transaction_hash", ""), str(e.get("_raw_keys", [])), str(e.get("_raw_data",[])) ))
        unique_events = []
        seen_event_signatures = set()
        for event in all_events_combined:
            if event.get("block_number") is None: continue 
            sig_parts = (
                event.get("transaction_hash"),
                event.get("block_number"),
                event.get("event_name"),
                tuple(event.get("_raw_keys", [])), 
                tuple(event.get("_raw_data", [])) 
            )
            if sig_parts not in seen_event_signatures:
                unique_events.append(event)
                seen_event_signatures.add(sig_parts)
        all_events_combined = unique_events
        print(f"Total unique events after combining with cache: {len(all_events_combined)}")


    current_scan_highest_block = highest_block_in_cache
    if all_events_combined: 
        current_scan_highest_block = max(e.get("block_number", current_scan_highest_block) for e in all_events_combined)
    elif highest_block_in_new_fetch > current_scan_highest_block : 
        current_scan_highest_block = highest_block_in_new_fetch

    scan_end_time_dt = datetime.now(datetime.utcnow().tzinfo) 
    metadata = {
        "bridge_address": args.bridge_address,
        "scan_process_start_time_utc": datetime.fromtimestamp(process_start_time, tz=datetime.utcnow().tzinfo).isoformat(),
        "scan_fetch_duration_seconds": round(fetch_duration, 2),
        "scan_completed_time_utc": scan_end_time_dt.isoformat(),
        "cache_status": "forced_rescan" if args.force_rescan else ("initial_scan" if not cached_events and highest_block_in_cache < scan_from_block else "resumed_from_cache"),
        "scanned_from_block_for_new_data": scan_from_block,
        "highest_block_scanned_in_file": current_scan_highest_block,
        "total_events_in_file": len(all_events_combined),
        "new_events_fetched_this_run": total_new_events_count
    }

    timestamp_str = scan_end_time_dt.strftime("%Y%m%d_%H%M%S")
    output_filename = os.path.join(output_dir, f"{SCAN_FILENAME_PREFIX}{timestamp_str}_block{current_scan_highest_block}.json")
    
    # Specify encoding when opening the file for writing
    with open(output_filename, 'w', encoding='utf-8') as f: 
        json.dump({"metadata": metadata, "events": all_events_combined}, f, indent=2)
    print(f"\nScan results saved to: {output_filename}")

    manage_scan_file_rotation(output_dir, args.keep_scans)

    total_elapsed_time = time.time() - process_start_time
    print(f"Scan completed in {total_elapsed_time:.2f} seconds.")
    print(f"  Total unique events in file: {len(all_events_combined)}")
    print(f"  Highest block covered in file: {current_scan_highest_block}")
    print("\nTo interpret the current state, run the script with the 'digest' mode.")

def handle_digest_mode(args: argparse.Namespace):
    print(f"Running in DIGEST mode for bridge: {args.bridge_address}")
    output_dir = get_bridge_output_dir(args.bridge_address)

    events_file_to_digest = args.file
    if not events_file_to_digest:
        scan_files = sorted(glob.glob(os.path.join(output_dir, f"{SCAN_FILENAME_PREFIX}*.json")), key=os.path.getctime, reverse=True)
        if not scan_files:
            print(f"No scan files found in {output_dir} to digest. Please run a scan first.")
            return
        events_file_to_digest = scan_files[0]
        print(f"Digesting the latest scan file: {events_file_to_digest}")
    else:
        if not os.path.isabs(events_file_to_digest) and not os.path.exists(events_file_to_digest):
             events_file_to_digest = os.path.join(output_dir, events_file_to_digest)
        
        if not os.path.exists(events_file_to_digest):
            print(f"Specified events file not found: {args.file} (tried: {events_file_to_digest})")
            return
        print(f"Digesting specified file: {events_file_to_digest}")
    
    try:
        # Specify encoding for reading digest source file
        with open(events_file_to_digest, 'r', encoding='utf-8') as f:
            scan_data = json.load(f)
        
        events_list = scan_data.get("events", [])
        metadata = scan_data.get("metadata", {})
        bridge_addr_from_file = metadata.get("bridge_address", args.bridge_address) 

        if not events_list:
            print(f"No events found in the file {events_file_to_digest} to digest.")
            return

        governance_state = digest_events_data(events_list, bridge_addr_from_file)
        display_governance_state(governance_state)

        output_digest_file = args.output
        if not output_digest_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            highest_block = metadata.get("highest_block_scanned_in_file", "unknown")
            output_digest_file = f"{DIGEST_FILENAME_PREFIX}{timestamp}_block{highest_block}.json"
        
        if not os.path.isabs(output_digest_file):
            output_digest_file = os.path.join(output_dir, output_digest_file)
        
        os.makedirs(os.path.dirname(output_digest_file), exist_ok=True)
        # Specify encoding for writing digest output file
        with open(output_digest_file, 'w', encoding='utf-8') as f:
            json.dump(governance_state, f, indent=2)
        print(f"\nGovernance state digest saved to: {output_digest_file}")

    except FileNotFoundError:
        print(f"Error: Events file not found at {events_file_to_digest}")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {events_file_to_digest}")
    except Exception as e:
        import traceback
        print(f"An error occurred during digest: {str(e)}")
        traceback.print_exc()

def main():
    load_dotenv() 

    parser = argparse.ArgumentParser(description="StarkNet Bridge Governance Events Tool")
    subparsers = parser.add_subparsers(dest="mode", required=True, help="Operating mode: 'scan' to fetch events, 'digest' to analyze stored events.")

    scan_parser = subparsers.add_parser("scan", help="Fetch and store governance events.")
    scan_parser.add_argument("-k", "--api-key", help="Alchemy API Key. Overrides ALCHEMY_API_KEY from .env.")
    scan_parser.add_argument("-b", "--bridge-address", required=True, help="The StarkNet bridge contract address to scan.")
    scan_parser.add_argument("--initial-from-block", type=int, default=DEFAULT_FROM_BLOCK,
                             help=f"Block number to start scanning from if no cache exists or --force-rescan is used (default: {DEFAULT_FROM_BLOCK}).")
    scan_parser.add_argument("--force-rescan", action="store_true",
                             help="Ignore cached data and rescan from --initial-from-block.")
    scan_parser.add_argument("--keep-scans", type=int, default=3,
                             help="Number of latest scan files to keep (default: 3).")
    scan_parser.set_defaults(func=handle_scan_mode)

    digest_parser = subparsers.add_parser("digest", help="Interpret and summarize stored event data.")
    digest_parser.add_argument("-b", "--bridge-address", required=True, help="The StarkNet bridge contract address for which to digest events.")
    digest_parser.add_argument("-f", "--file", help="Specific events_data JSON file to digest (filename only, expected in bridge's output dir). If not provided, uses the latest for the bridge.")
    digest_parser.add_argument("-o", "--output", help="Output file for digest results (e.g., governance_state.json). Saved in bridge directory.")
    digest_parser.set_defaults(func=handle_digest_mode)
    
    args = parser.parse_args()

    if args.mode == "scan":
        if not args.api_key:
            args.api_key = os.getenv("ALCHEMY_API_KEY")
        if not args.api_key:
            parser.error("API key must be provided via --api-key or ALCHEMY_API_KEY environment variable for scan mode.")
    
    args.func(args)

if __name__ == "__main__":
    main()