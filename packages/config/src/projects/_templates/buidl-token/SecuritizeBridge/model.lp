bridgeDSToken(@self, DSToken) :-
  address(@self, Chain, _),
  address(DSToken, Chain, &dsToken:raw|lower|quote).

permission(@self, "interact", DSToken, 0, "Can burn user-requested tokens before bridging them out.", ".burner") :-
  bridgeDSToken(@self, DSToken).

permission(@self, "interact", DSToken, 0, "Can mint bridged tokens delivered from an approved remote bridge.", ".minter") :-
  bridgeDSToken(@self, DSToken).

roleScopedAct(@self).

% Owner can upgrade SecuritizeBridge and configure service parameters.
bridgeOwner(@self, Owner) :-
  address(@self, Chain, _),
  address(Owner, Chain, &owner:raw|lower|quote|orNil).

permission(Owner, "upgrade", @self, 0, "Can upgrade SecuritizeBridge and configure service parameters.", ".admin") :-
  bridgeOwner(@self, Owner).
