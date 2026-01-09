# DeFiDisco Permission Monitoring

This module implements continuous monitoring of permission changes in DeFi protocols.

## Overview

The permission monitoring system tracks changes in resolved owner addresses for permissioned functions. When the discovery system detects contract changes, permissions are automatically re-resolved and compared with previous states. If ownership changes are detected, notifications are sent to Discord.

## Architecture

### Data Flow

```
Discovery Update → Discovery Diff Detected → Store Discovery
                                              ↓
                                    Permission Resolution Triggered
                                              ↓
                         Load functions.json → Resolve Owner Paths
                                              ↓
                            Store Resolution Blob (append-only history)
                                              ↓
                         Compare with Previous Resolution
                                              ↓
                            Detect Owner Changes (added/removed)
                                              ↓
                         Store Changes in UpdateDiff Table
                                              ↓
                            Send Discord Notification (INTERNAL)
```

### Key Components

#### 1. PermissionResolver (`PermissionResolver.ts`)

Main service class that orchestrates permission resolution and change detection.

**Key Methods:**

- `resolveAndCompare()`: Entry point called when discovery diff is detected
- `resolveAllFunctions()`: Resolves all permissioned functions to owner addresses
- `compareResolutions()`: Identifies ownership changes between resolutions
- `detectAndStoreChanges()`: Stores changes and triggers notifications

**Smart Triggering:**
Only runs when `diff.length > 0` (actual discovery changes, not just timestamp)

#### 2. Database Schema

**PermissionResolution Table:**

```typescript
{
  id: number              // Auto-increment
  projectId: string
  timestamp: UnixTime
  resolutionBlob: {       // JSONB
    version: "1.0"
    resolvedAt: string
    contracts: {
      [address: string]: {
        contractName: string
        functions: [{
          functionName: string
          ownerResolutions: [{
            path: string
            addresses: string[]
            error: string | null
          }]
          allOwners: string[]
          resolutionErrors: string[]
        }]
      }
    }
  }
}
```

**UpdateDiff Table (enhanced):**

```typescript
{
  projectId: string
  address: string
  type: UpdateDiffType    // Added 'permissionChange'
  timestamp: UnixTime
  diffBaseTimestamp: number
  diffHeadTimestamp: number
  details?: {             // JSONB - NEW FIELD
    functionName: string
    changes: {
      addedOwners: Array<{ address: string; name: string }>
      removedOwners: Array<{ address: string; name: string }>
    }
    resolutionErrors: string[]
  }
}
```

#### 3. Owner Resolution Logic (`ownerResolution.ts`)

Lightweight copy of the UI's resolution logic for backend use.

**DiscoveredDataAccess:**

- Navigates discovered.json structure
- Resolves contract references ($self, @field, eth:0x...)
- Handles nested paths with dot notation

**Path Expression Support:**

- `$self.owner` - Owner field in current contract
- `@governor.signers[0]` - Follow address field, get first signer
- `eth:0x123...acl.permissions` - Absolute contract reference
- `$self.accessControl.DEFAULT_ADMIN_ROLE.members` - AccessControl role members

#### 4. Notification Formatting (`UpdateNotifier.ts`)

**notifyPermissionChanges()** method formats and sends Discord alerts.

**Message Format:**

```
🔒 **Permission Changes Detected: project-name**
Timestamp: 2025-12-03T10:30:00.000Z

**Contract:** `0x123...` - Function: `pause`
  ✅ **Added owners:**
    - `0xabc...` (Multisig)
    - `0xdef...` (Timelock)
  ❌ **Removed owners:**
    - `0x456...` (OldAdmin)

⚠️ **Resolution Errors:**
  - $self.nonexistent: Field not found
```

## Integration with UpdateMonitor

The PermissionResolver is instantiated in UpdateMonitor's constructor:

```typescript
this.permissionResolver = new PermissionResolver(
  db,
  logger,
  configBasePath,
  (projectId, timestamp) =>
    this.updateNotifier.notifyPermissionChanges(projectId, timestamp)
);
```

Resolution is triggered after storing discovery:

```typescript
// Resolve permissions if discovery changes were detected
if (diff.length > 0) {
  await this.permissionResolver.resolveAndCompare(
    projectConfig.name,
    discovery,
    timestamp
  );
}
```

## Change Detection Logic

### What Triggers Notifications

✅ **Added owners**: New addresses resolved from permission paths
✅ **Removed owners**: Previously resolved addresses no longer found

### What Does NOT Trigger Notifications

❌ **Config changes**: Functions newly marked/unmarked as permissioned
❌ **Manual changes**: Score updates, descriptions, checked status
❌ **Path updates**: Changes to ownerDefinitions paths

**Rationale:** We only care about RESOLVED owner changes (on-chain state changes), not manual configuration updates.

### Handling Resolution Errors

When owner resolution fails:

1. Error message is stored in `resolutionErrors` array
2. Empty address list is used for that path
3. All errors are displayed at end of Discord notification
4. Change detection continues for other paths

## Configuration Requirements

### functions.json Structure

Each project must have a `functions.json` file at:

```
packages/config/src/projects/{project}/functions.json
```

Required structure:

```json
{
  "version": "1.0",
  "lastModified": "2025-12-03T10:00:00.000Z",
  "contracts": {
    "eth:0x123...": {
      "functions": [
        {
          "functionName": "pause",
          "isPermissioned": true,
          "ownerDefinitions": [
            { "path": "$self.owner" },
            { "path": "@timelock.admin" }
          ]
        }
      ]
    }
  }
}
```

### Database Migration

Run the migration to add required tables:

```bash
# Migration file: 20251202000000_add_permission_monitoring
# Tables: PermissionResolution, UpdateDiff.details
```

## Testing

### Manual Testing

1. **Create test project:**

   ```bash
   cd packages/config/src/projects
   mkdir test-permissions
   ```

2. **Add functions.json with permissioned function**

3. **Run discovery:**

   ```bash
   cd packages/l2b
   l2b discover test-permissions
   ```

4. **Trigger UpdateMonitor:**

   - Wait for hourly run, or
   - Manually trigger via API/code

5. **Modify contract state** (simulate ownership change)

6. **Run discovery again**

7. **Check Discord INTERNAL channel** for notification

### Automated Tests

See `PermissionResolver.test.ts` for unit tests covering:

- File existence checks
- Resolution logic
- Change detection
- Error handling

## Monitoring and Debugging

### Logs

Permission resolution logs to look for:

```
DEBUG: No functions.json found, skipping resolution
DEBUG: No permissioned functions configured
INFO: Permissions resolved and stored (contractCount: 5)
INFO: First permission resolution, no changes to detect
INFO: No permission changes detected
INFO: Permission changes detected and stored (changeCount: 2)
ERROR: Failed to resolve permissions
```

### Database Queries

**Check resolution history:**

```sql
SELECT * FROM "PermissionResolution"
WHERE "projectId" = 'compound-v3'
ORDER BY "timestamp" DESC
LIMIT 10;
```

**Check permission changes:**

```sql
SELECT * FROM "UpdateDiff"
WHERE "projectId" = 'compound-v3'
AND "type" = 'permissionChange'
ORDER BY "timestamp" DESC;
```

**Get latest resolution blob:**

```sql
SELECT "resolutionBlob"
FROM "PermissionResolution"
WHERE "projectId" = 'compound-v3'
ORDER BY "timestamp" DESC
LIMIT 1;
```

## Performance Considerations

### Resolution Frequency

- Only runs when `diff.length > 0` (discovery changes detected)
- Typical frequency: Hours to days between resolutions
- Not triggered by timestamp-only updates

### Data Size

- Resolution blobs are JSONB, compressed by PostgreSQL
- Typical size: 1-10 KB per resolution
- Append-only: Old resolutions are preserved (implement cleanup if needed)

### Optimization Opportunities

1. **Add cleanup job** to delete old resolutions (>30 days)
2. **Index optimization** on PermissionResolution.timestamp
3. **Batch notifications** if multiple projects change simultaneously

## Error Handling

### Resolution Errors

When path resolution fails:

- Error is logged but does not stop processing
- Other functions/paths continue to resolve
- Error appears in Discord notification
- Empty address list used for failed path

### File System Errors

- Missing functions.json: Silently skipped (DEBUG log)
- Invalid JSON: Error logged, resolution aborted
- File read errors: Error logged, resolution aborted

### Database Errors

- Insert failure: Error logged, notification not sent
- Query failure: Error logged, resolution aborted
- Transaction not used (each operation is independent)

## Future Enhancements

### Potential Improvements

1. **Historical analysis**: Query permission changes over time
2. **Alerting thresholds**: Different severity for different changes
3. **Change attribution**: Link to specific on-chain transactions
4. **Web UI**: Display permission history in defidisco UI
5. **Cleanup job**: Automated deletion of old resolutions
6. **Batch processing**: Handle multiple projects efficiently
7. **Retry logic**: Retry failed resolutions after errors

### Integration Points

- **Defiscan**: Display permission change count in dashboard
- **Reports**: Include permission changes in generated reports
- **API**: Expose permission history via REST endpoints
- **Analytics**: Track permission change patterns across protocols

## References

- [CLAUDE.md](../../../../../../CLAUDE.md) - DeFiDisco architecture
- [UpdateMonitor.ts](../UpdateMonitor.ts) - Main discovery loop
- [UpdateNotifier.ts](../UpdateNotifier.ts) - Discord notifications
- [functions.json example](../../../../../../packages/config/src/projects/compound-v3/functions.json)
