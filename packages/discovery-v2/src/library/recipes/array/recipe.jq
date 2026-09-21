# array@1: callEach pairs into [value], dropping the indices.

def pair($p):
  if ($p | type) == "object" and ($p | has("value")) then $p
  else error("array@1 expects [{ key, value }] pairs from a callEach fetch, got \($p | tojson)") end;

. as { input: $pairs }
| [ $pairs[] | pair(.).value ]
