classSwap(Self) :-
  address(Self, Chain, &$.address:raw|lower|quote).

sourceWallet(Self, Actor) :-
  classSwap(Self),
  address(Actor, Chain, &sourceWallets:raw|lower|quote|orNil).

sourceToken(Self, SourceDSToken) :-
  classSwap(Self),
  address(SourceDSToken, Chain, &sourceDSToken:raw|lower|quote).

targetToken(Self, TargetDSToken) :-
  classSwap(Self),
  address(TargetDSToken, Chain, &targetDSToken:raw|lower|quote).

permission(Actor, "act", Self, 0, "Can trigger the source-token burn leg of the class swap from a registered source wallet.", ".burner") :-
  sourceWallet(Self, Actor).

permission(Actor, "act", Self, 0, "Can trigger the target-token mint leg of the class swap from a registered source wallet.", ".minter") :-
  sourceWallet(Self, Actor).

permission(Self, "interact", SourceDSToken, 0, "Can burn the configured source token during a class swap.", ".burner") :-
  sourceToken(Self, SourceDSToken).

permission(Self, "interact", TargetDSToken, 0, "Can mint the configured target token during a class swap.", ".minter") :-
  targetToken(Self, TargetDSToken).

% DSTokenClassSwap should only forward the burn and mint scopes exposed by the swap.
roleScopedAct(Self) :-
  classSwap(Self).
