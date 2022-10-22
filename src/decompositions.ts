/**
 * This file contains decomposition functions. They break larger numbers (3-digit) into smaller ones (2-1 digits),
 * where the [Strong law of small numbers](https://en.wikipedia.org/wiki/Strong_law_of_small_numbers) can take of them
 * as they have much more properties than larger numbers.
 */

import {
    operation,
    getFactors,
    ConvertOptions,
    isFactorial,
    isPow2,
    shuffle,
    isPrime,
    isSquare,
    isOdd,
} from './utils';
import * as representations from './representations';
// for n = ab and ∀c, either return n = ab or (a-c)(b+c) + c(b-a+c)
const decomposeABC = (
    number: number,
    op1: operation,
    op2: operation,
    op3: operation,
    moreRandomOptions: operation
) => {
    let factors = getFactors(number);
    let randomIndex = Math.floor(Math.random() * factors.length);
    let a = factors[randomIndex];
    let b = number / a;
    let c = Math.floor(Math.random() * 30) + 1;

    // ab
    if (Math.random() < 0.2) {
        return `{{\\left({${op1(a)}}\\right)}{\\left({${op2(b)}}\\right)}}`;
    }

    // (a - c)(b + c) + c (b - a + c)
    else {
        return `{ \\left({${op1(a)} - ${op2(c)}}\\right) \\left({${op3(b)} + ${moreRandomOptions(
            c
        )}}\\right) + {${moreRandomOptions(c)}}{\\left({${moreRandomOptions(
            b
        )} - ${moreRandomOptions(a)} + ${moreRandomOptions(c)}} \\right)} }`;
    }
};

// 5 = sqrt(25)
const decomposeSqrt = (n: number, op1: operation) => {
    let square = n ** 2;
    return `{\\sqrt{${op1(square)}}}`;
};

// 25 = 1 + 3 + 5 + 7 + 9
const decomposeSquare = (
    n: number,
    op1: operation,
    op2: operation,
    op3: operation,
    moreRandomOptions: operation
) => {
    let squareRoot = Math.sqrt(n);
    let sum = `${op1(1)}`;
    let oddVal = 1;

    if (Math.random() < 0.2) {
        for (let i = 0; i < squareRoot - 1; i++) {
            oddVal += 2;
            sum += `+ ${moreRandomOptions(oddVal)}`;
        }
        sum = `{ ${sum} }`;
        return sum;
    }

    // (a + b)^2 = a^2 + 2ab + b^2
    else {
        let a = Math.floor(Math.random() * squareRoot - 1) + 1;
        let b = squareRoot - a;

        // Representing (a + b)^2
        if (Math.random() < 0.5) {
            return `{ {\\left(${op1(a)} + ${op1(b)}\\right)}^2}`;
        }

        // Representing a^2 + 2ab + b^2
        else {
            return `{ {\\left(${op1(a)}\\right)}^2 + {${moreRandomOptions(2)}}{\\left(${op2(
                a
            )}\\right)}{\\left(${op3(b)}\\right)} + {\\left(${moreRandomOptions(b)}\\right)}^2}`;
        }
    }
};

// 25 = 13^2 - 12^2
const decomposeDifferenceSquares = (n: number, op1: operation, op2: operation) => {
    let a = Math.floor(n / 2);
    let b = Math.ceil(n / 2);

    if (Math.ceil(n / 2) ** 2 < 100 && Math.random() < 0.7) {
        return `{${op1(b ** 2)} - ${op2(a ** 2)}}`;
    } else {
        return `{ \\left({${op1(b)}}\\right)^2 -  \\left({${op2(a)}}\\right)^2}`;
    }
};

// 7 = 2 * 3 + 1
const decomposeAddMultiply = (n: number, op1: operation, op2: operation, op3: operation) => {
    let randNum = Math.floor(Math.random() * n + 1) + 1;
    let r = n % randNum;
    let a = Math.floor(n / randNum);
    return `${op1(a)} \\times {${op2(randNum)}} + ${op3(r)}`;
};

// 7 = 7*8/8
const decomposeMulDivide = (n: number, op1: operation, op2: operation) => {
    let r = Math.floor(Math.random() * 5) + 1;
    return `\\frac{${op1(n * r)}} {${op2(r)}}`;
};
/* end decompose functions */

const conditionalDecomposition = (
    wrappedFunction: operation,
    options: ConvertOptions
): operation => {
    return (n: number) => {
        if (Math.random() <= 0.5) {
            // inverse factorial of n, such that fac! = n
            const fac = isFactorial(n);
            if (fac) {
                // factorial(fac) = fac! = n
                return representations.factorial(fac, options.gammaFunction);
            }

            if (isPow2(n)) {
                return representations.pow2Choose(Math.log2(n), options.numberTheory);
            }
        }

        return wrappedFunction(n);
    };
};

// Break a number down into smaller numbers separated by operators
const decompose = (n: number, operations: operation[]) => {
    // Get three operations that can be used
    let moreRandomOptions = (num: number) => {
        return operations[Math.floor(Math.random() * operations.length)](num);
    };

    let randomOption1 = moreRandomOptions;
    let randomOption2 = moreRandomOptions;
    let randomOption3 = moreRandomOptions;

    // if there are no operations to be done
    if (operations.length === 0) {
        randomOption1 = representations.sameNumber;
        randomOption2 = representations.sameNumber;
        randomOption3 = representations.sameNumber;
        moreRandomOptions = representations.sameNumber;
    }

    if (operations.length >= 3) {
        [randomOption1, randomOption2, randomOption3] = shuffle(operations).slice(0, 3);
    }

    // Make each outcome equally likely (assuming all characteristics are fulfilled, which they are not)
    const randomValue = Math.random();
    const unitThreshold = 1 / 6;

    // 1. ab = (a - c)(b + c) + c (b - a + c), where c is any random positive number
    if (randomValue < unitThreshold && n !== 0 && n < 100 && (n === 2 || !isPrime(n))) {
        return decomposeABC(n, randomOption1, randomOption2, randomOption3, moreRandomOptions);
    }

    // 2. Represent (small) numbers using their square and square root
    if (randomValue < unitThreshold * 2 && n < 10) {
        return decomposeSqrt(n, randomOption1);
    }

    // 3. The sum of the first n odd numbers is equal to n^2 e.g 1 + 3 + 5 = 3^2
    if (randomValue < unitThreshold * 3 && n > 1 && isSquare(n)) {
        return decomposeSquare(n, randomOption1, randomOption2, randomOption3, moreRandomOptions);
    }

    // 4. The sum of two consecutive integers is the difference of their squares e.g 3 + 2 = 3^2 - 2^2
    if (randomValue < unitThreshold * 4 && isOdd(n) && randomValue < 0.7) {
        return decomposeDifferenceSquares(n, randomOption1, randomOption2);
    }

    // 5. Express a number using multiplication and addition. E.g 4 = 1 * 3 + 1
    if (randomValue < unitThreshold * 5 && n <= 200) {
        return decomposeMulDivide(n, randomOption1, randomOption2);
    }
    // 6. Multiply and divide by a random number. e.g 2 = (2*5)/5
    return decomposeAddMultiply(n, randomOption1, randomOption2, randomOption3);
};

export { decompose, conditionalDecomposition };
