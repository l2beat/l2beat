% clingo file with common rules

% grant permission if you can *act* as a receiver of that permission 
permission(Receiver, Permission, Giver, SumDelay, Via) :-
  permission(Receiver, act, Via, ViaDelay,_),
  permission(Via, Permission, Giver, GiverDelay, _),
  SumDelay = ViaDelay + GiverDelay,
  Permission != act. % skip intermediate