% TransactionRelayer relays pre-signed transactions on behalf of issuers.
% It should not appear as an independent permission holder.
preventActingIndependently(@self).

% "act" through TransactionRelayer should inherit only matching roles.
roleScopedAct(@self).

wrapperTrustService(Wrapper, TrustService) :-
  address(Wrapper, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

% Actors with issuer-or-above access can mint and burn through TransactionRelayer.
% Exclude other batch wrappers to prevent infinite "act" cycles in the transitive closure.
permission(Actor, "act", @self, 0, nil, ".minter") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).

permission(Actor, "act", @self, 0, nil, ".burner") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).
