# Token relations graph

The graph is a catalogue-level view of the relation observations stored in
TokenDB. A node is a deployed token, identified by `(chain, address)` and
labelled with the deployed token's symbol. A directed edge is an observed
token relation; hovering it shows its endpoints, plugin, and bridge type.

Relations can exist before either endpoint is catalogued. The graph currently
omits a relation unless both endpoints resolve to deployed tokens. It also
omits nodes that are left without a displayed relation. The observation stays
in `TokenRelation` and can appear automatically once its missing endpoint is
catalogued.

An edge is red when both endpoints are assigned to abstract tokens and those
abstract token IDs differ. This is a conflict between the observed
non-swapping relation and the current catalogue assignments. An unassigned
endpoint is not considered a conflict.

The graph query reads only relation identity fields. It deliberately excludes
the full transfer evidence JSON used by deployed-token relation details,
because the graph neither displays nor interprets that evidence.

Node colors distinguish chains. The layout is force-directed; nodes can be
dragged and the canvas can be panned or zoomed.
