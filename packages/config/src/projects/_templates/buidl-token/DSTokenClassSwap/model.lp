classSwap(Self) :-
  address(Self, Chain, &$.address:raw|lower|quote).

% DSTokenClassSwap can be called by anyone — treat it as an independent actor.
% We keep preventActingIndependently (via template.jsonc) so that wrapper "act"
% rules (BulkOperator, etc.) don't grant it transitive permissions through the
% TrustService issuer role it holds.  Clingo's union semantics let us assert
% canActIndependently directly, overriding the preventActingIndependently gate
% in the core rules.
canActIndependently(Self) :-
  classSwap(Self).

sourceToken(Self, SourceDSToken) :-
  classSwap(Self),
  address(SourceDSToken, Chain, &sourceDSToken:raw|lower|quote).

targetToken(Self, TargetDSToken) :-
  classSwap(Self),
  address(TargetDSToken, Chain, &targetDSToken:raw|lower|quote).

permission(Self, "interact", SourceDSToken, 0, "Can burn the configured source token during a class swap.", ".burner") :-
  sourceToken(Self, SourceDSToken).

permission(Self, "interact", TargetDSToken, 0, "Can mint the configured target token during a class swap.", ".minter") :-
  targetToken(Self, TargetDSToken).
