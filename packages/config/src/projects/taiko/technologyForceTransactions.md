Users can submit a blob reference containing a standalone transaction by calling the `saveForcedInclusion()` function on the `MainnetInbox` contract.
Once any forced inclusion has been queued for {{forcedInclusionDelay}}, whitelisted proposers cannot submit new proposals unless they process all due forced inclusions.
If the oldest queued forced inclusion is still ignored for {{forcedInclusionPermissionlessDelay}}, proposing becomes permissionless and anyone can include it.
