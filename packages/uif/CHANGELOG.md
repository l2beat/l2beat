# @l2beat/uif

## 0.3.1

### Patch Changes

- Add ability to provide configurations from different source to MultiIndexer

## 0.3.0

### Minor Changes

- Adds `MultiIndexer`
- Changes the update method `from` parameter to be inclusive as opposed to exclusive (which was the previous behavior)
- Renames `getSafeHeight` to `initialize`
- Renames `BaseIndexer` to `Indexer`
- Removes `SliceIndexer`

## 0.2.4

### Patch Changes

- Add default retry strategy jsdoc

## 0.2.3

### Patch Changes

- Updated dependencies [b8e1c2f]
  - @l2beat/backend-tools@0.5.0

## 0.2.2

### Patch Changes

- Fix retry strategies forgetting number of attempts

## 0.2.1

### Patch Changes

- Specify exact version of @l2beat/backend-tools

## 0.2.0

### Minor Changes

- 63e44af: Improve error handling: timeout retries
- 8d99c67: Enable partial invalidation
- f6fe36d: Add retries
- 7c245d8: Add SliceIndexer
- 7140656: Improve invalidation logic
- 67f99dd: Refine RootIndexer ticking logic

### Patch Changes

- 535ce58: Bug fix:

  - child's state parent.waiting changed when it should not

- 118b192: Refactor reducer code
- 535ce58: Do not emit setSafeHeight twice with the same value
- Updated dependencies [8c3cf3b]
- Updated dependencies [6f84bf6]
- Updated dependencies [a6f2896]
- Updated dependencies [6be46f5]
  - @l2beat/backend-tools@0.3.0
