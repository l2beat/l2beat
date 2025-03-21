# Quick Reference: Delays & ADMIN_ROLE Functions

## `executionDelay` vs. `targetAdminDelay`
- **executionDelay:**  
  - Applies **per actor, role** and delays their ability to execute restricted functions (the function targets configured in the AccessManager).
  - If nonzero, operations must be scheduled and can only execute after the delay expires.
  
- **targetAdminDelay:**  
  - Applies **per target** to changes in a target’s configuration in the AccessManager (e.g., updating target function roles, setting delays, closing a target).
  - Ensures that configuration updates for a certain target do not take effect immediately.

## `minSetBack`
- **Setback Mechanism:**  
  - Updates to delay values are not instantaneous; they become effective after a setback period.
- **Increasing Delays (e.g., from 7d to 11d):**  
  - The setback defaults to the minimum setback (e.g., 5 days).
- **Decreasing Delays (e.g., from 7d to 3d):**  
  - The effective delay change is postponed by the maximum of the minimum setback and the difference (7d–3d = 4d, so 5 days if min setback is 5 days).

## ADMIN_ROLE internal function targets
- **ADMIN_ROLE (ID 0):**  
  - **Role Management:** Granting, revoking, and updating execution delays for roles.
  - **Administration:** Changing role admins and guardians.
  - **Target Configuration:**  
    - Setting function roles on targets.
    - Updating target admin delays.
    - Opening or closing targets.
  - **Authority Updates:** Adjusting internal authority for managed contracts (not used in the scoped contracts).

## Misc
- delays during scheduled ops **remain the same** until the op is executed
- scheduled ops that require ADMIN_ROLE and target internal config changes in the AccessManager have a complex delay calculation in which all above delays are taken into account