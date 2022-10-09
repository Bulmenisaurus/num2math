# num2math

Generate a complicated math expression that results in a number. If you wanna do this for some reason.

Try it: https://enjeck.com/num2math/

## How does it work?

First, larger numbers are broken down into smaller numbers through `decompose` functions. For example, a number like 476 could be broken down into `5 * 88 + 36`.

Then, each of the smaller numbers (in our example 5, 88, and 36) are obfuscated through representation functions, which use various identities and formulas to hide the values of functions. For example, `5` could be turned into `-5e^(pi * i)`. Various representation functions are made available based on the options you select, and if none are selected this step is skipped.
