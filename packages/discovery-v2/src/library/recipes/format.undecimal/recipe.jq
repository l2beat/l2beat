# format.undecimal@1: integer scaled by 10^decimals into BigNumber.toFormat() style.
#
# Done on the digit string rather than with arithmetic: jq numbers are
# doubles and would lose digits of any uint256 above 2^53, while V1's
# BigNumber rendering is exact. A JSON number above 2^53 is rejected for the
# same reason; the executor passes such values as decimal strings.

def maxSafe: 9007199254740991;

def rejected: error("format.undecimal@1 expects an integer as a number or decimal string, got \(tojson)");

def digitString:
  if type == "string" then (if test("^-?[0-9]+$") then . else rejected end)
  elif type == "number" then
    (if . == floor and fabs <= maxSafe then tostring else rejected end)
  else rejected end;

# "1234567" -> "1,234,567"
def groupThousands:
  (length % 3) as $head
  | [ (.[:$head] | select(length > 0)), (.[$head:] | scan(".{3}")) ]
  | join(",");

def stripLeadingZeros: sub("^0+(?=[0-9])"; "");
def stripTrailingZeros: sub("0+$"; "");

def undecimal($decimals):
  startswith("-") as $negative
  | ltrimstr("-")
  # Pad so there is always at least one integer digit in front of the point.
  | if length <= $decimals then ("0" * ($decimals - length + 1)) + . else . end
  | (.[:(length - $decimals)] | stripLeadingZeros | groupThousands) as $integer
  | (.[(length - $decimals):] | stripTrailingZeros) as $fraction
  | (if $fraction == "" then $integer else "\($integer).\($fraction)" end) as $magnitude
  | if $negative and $magnitude != "0" then "-\($magnitude)" else $magnitude end;

. as { input: $value, args: $args }
| $value | digitString | undecimal($args.decimals)
