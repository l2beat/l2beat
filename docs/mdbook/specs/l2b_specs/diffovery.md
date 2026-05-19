# Diffovery

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Diff filtering](#diff-filtering)
  - [How it works](#how-it-works)
  - [What are tokens](#what-are-tokens)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Diff filtering

Diffovery takes two addresses, fetches their source code, flattens it and diffs it side by side.
This has multiple use cases, but the main one is determining to what extent contracts share source code.
A potential use case is checking if two deployments are the same across chains or time.
We might want to know if a contract deployed 5 years ago uses the same source code as a contract deployed a few days ago.
We already know that both of them fulfil the same role or exhibit the same behaviour, but we want to find out if their source is the same.

This works very well for sources deployed close in time.
In most cases the source is exactly the same and results in an empty diff.
Sometimes source code that was written a long time ago is still used.
This creates problems because with time tooling changes and things like formatters change the source while keeping behaviour the same.
Determining if two sources are equal is now harder because we are going to see many differences in comment formatting or simply in used white space.

Our goal is to provide tools that will speed up work associated with understanding the differences between two contracts.
A part of it is exposing the actual difference in the source that results in behaviour changes.
This means that diff entries that only show white space changes are noise.
To solve this issue we use a mechanism called diff filtering.

### How it works

Diffovery uses Monaco (the VSCode engine) to display text, it comes with some niceties included, like a builtin diff viewer.
We would much rather use something like [difftastic](https://github.com/wilfred/difftastic).
We can't, so we settle for Monaco because the quality is good enough and reinventing the wheel ourselves is not worth it.
The middle ground to reduce noise is to keep using Monaco's diff computer but to do extra logic to determine if we want to show that diff entry or not.
A computed diff is an array of ranges, each range is a start and an end line in the left file and the right file.
We can think of it as if we are filtering ranges out with a predicate:

`.filter((range) => importantDiff(range))`

To determine if the computed difference is important to us we run two checks.
The first check is very simple, we fetch all tokens that fall within the range on both sides and we only show the entry if the tokens between the left and right side are different.
If the tokens are the same, this means that the change is purely in the white space.
The second check is conditional, we only run it if the user selected to ignore comments.
If they did, all comment tokens are stripped from both sides before we compare, so any difference that lives entirely in comments gets ignored.
This applies both to lines that are purely comments and to trailing comments on lines that also contain code.

The actual behaviour is a little bit more complex than just accepting or rejecting a diff entry.
For each entry, we are going to try to narrow the range down from the left and right side.
You can think of it as trimming the range, but the logic used for trimming is:

`if(!importantDiff(line in range)) trimThisLine()`

It's the same logic function as described above that works on white space and comment changes.
If we narrow the range down to nothing, the entire entry is filtered out.

### What are tokens

By tokens we mean the result of lexing the source code of Solidity.
For our purpose, we only care about the string content and whether the token is a comment or something else, we don't actually care about what this something else is.
When checking for equivalence, we only compare the content of each token.
The lexer is a small piece of code written by us, we don't use a library.
We can allow ourselves this freedom because we assume that diffovery will only ever show Solidity contracts.
