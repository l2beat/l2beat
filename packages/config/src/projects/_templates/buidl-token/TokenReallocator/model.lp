% TokenReallocator reallocates omnibus-held tokens to investor wallets.
% It should not appear as an independent permission holder.
preventActingIndependently(@self).

% "act" through TokenReallocator should inherit only matching roles.
roleScopedAct(@self).

wrapperTrustService(Wrapper, TrustService) :-
  address(Wrapper, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

% Actors with issuer-or-above access can operate omnibus reallocations through TokenReallocator.
% Exclude other batch wrappers to prevent infinite "act" cycles in the transitive closure.
permission(Actor, "act", @self, 0, nil, ".omnibusOperator") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).

% Actors with transfer-agent-or-above access can also operate omnibus reallocations.
permission(Actor, "act", @self, 0, nil, ".omnibusOperator") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, transferAgent, Actor),
  not preventActingIndependently(Actor).
