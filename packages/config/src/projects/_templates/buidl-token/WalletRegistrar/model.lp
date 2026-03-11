% WalletRegistrar is a wrapper for investor wallet registration.
% It should not appear as an independent permission holder.
preventActingIndependently(@self).

% "act" through WalletRegistrar should inherit only matching roles.
roleScopedAct(@self).

wrapperTrustService(Wrapper, TrustService) :-
  address(Wrapper, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

% Actors with issuer-or-above access can act through WalletRegistrar.
% Exclude other batch wrappers to prevent infinite "act" cycles in the transitive closure.
permission(Actor, "act", @self, 0, nil, ".issuerOrAbove") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).
