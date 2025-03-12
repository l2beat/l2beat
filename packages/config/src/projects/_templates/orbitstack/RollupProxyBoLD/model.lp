challengePeriodSeconds(Seconds) :-
  Seconds = #confirmPeriodBlocks * 12.  % from aribtrum.ts: assumedBlockTime = 12
