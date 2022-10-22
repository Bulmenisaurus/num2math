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

type decomposition = (n: number, ops: operation[]) => string;

import * as representations from './representations';

// for n = ab and ∀c, either return n = ab or (a-c)(b+c) + c(b-a+c)
const decomposeABC = (number: number, ops: operation[]) => {
    let factors = getFactors(number);
    let randomIndex = Math.floor(Math.random() * factors.length);
    let a = factors[randomIndex];
    let b = number / a;
    let c = Math.floor(Math.random() * 30) + 1;

    // ab
    if (Math.random() < 0.2) {
        return `{{\\left({${ops[0](a)}}\\right)}{\\left({${ops[1](b)}}\\right)}}`;
    }

    // (a - c)(b + c) + c (b - a + c)
    else {
        return `{ \\left({${ops[0](a)} - ${ops[1](c)}}\\right) \\left({${ops[2](b)} + ${ops[3](
            c
        )}}\\right) + {${ops[3](c)}}{\\left({${ops[3](b)} - ${ops[3](a)} + ${ops[3](
            c
        )}} \\right)} }`;
    }
};

// 5 = sqrt(25)
const decomposeSqrt = (n: number, ops: operation[]) => {
    let square = n ** 2;
    return `{\\sqrt{${ops[0](square)}}}`;
};

// 25 = 1 + 3 + 5 + 7 + 9
const decomposeSquare = (n: number, ops: operation[]) => {
    let squareRoot = Math.sqrt(n);
    let sum = `${ops[0](1)}`;
    let oddVal = 1;

    if (Math.random() < 0.2) {
        for (let i = 0; i < squareRoot - 1; i++) {
            oddVal += 2;
            sum += `+ ${ops[3](oddVal)}`;
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
            return `{ {\\left(${ops[0](a)} + ${ops[0](b)}\\right)}^2}`;
        }

        // Representing a^2 + 2ab + b^2
        else {
            return `{ {\\left(${ops[0](a)}\\right)}^2 + {${ops[3](2)}}{\\left(${ops[1](
                a
            )}\\right)}{\\left(${ops[2](b)}\\right)} + {\\left(${ops[3](b)}\\right)}^2}`;
        }
    }
};

// 25 = 13^2 - 12^2
const decomposeDifferenceSquares = (n: number, ops: operation[]) => {
    let a = Math.floor(n / 2);
    let b = Math.ceil(n / 2);

    if (Math.ceil(n / 2) ** 2 < 100 && Math.random() < 0.7) {
        return `{${ops[0](b ** 2)} - ${ops[0](a ** 2)}}`;
    } else {
        return `{ \\left({${ops[0](b)}}\\right)^2 -  \\left({${ops[1](a)}}\\right)^2}`;
    }
};

// 7 = 2 * 3 + 1
const decomposeAddMultiply = (n: number, ops: operation[]) => {
    let randNum = Math.floor(Math.random() * n + 1) + 1;
    let r = n % randNum;
    let a = Math.floor(n / randNum);
    return `${ops[0](a)} \\times {${ops[1](randNum)}} + ${ops[2](r)}`;
};

// 7 = 7*8/8
const decomposeMulDivide = (n: number, ops: operation[]) => {
    let r = Math.floor(Math.random() * 5) + 1;
    return `\\frac{${ops[0](n * r)}} {${ops[1](r)}}`;
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
    // Get three operation[] that can be used
    let moreRandomOptions = (num: number) => {
        return operations[Math.floor(Math.random() * operations.length)](num);
    };

    let randomOption1 = moreRandomOptions;
    let randomOption2 = moreRandomOptions;
    let randomOption3 = moreRandomOptions;

    // if there are no operation[] to be done
    if (operations.length === 0) {
        randomOption1 = representations.sameNumber;
        randomOption2 = representations.sameNumber;
        randomOption3 = representations.sameNumber;
        moreRandomOptions = representations.sameNumber;
    }

    if (operations.length >= 3) {
        [randomOption1, randomOption2, randomOption3] = shuffle(operations).slice(0, 3);
    }

    const decompositions: decomposition[] = [];

    // 1. ab = (a - c)(b + c) + c (b - a + c), where c is any random positive number
    if (n !== 0 && n < 100 && (n === 2 || !isPrime(n))) {
        decompositions.push(decomposeABC);
    }

    // 2. Represent (small) numbers using their square and square root
    if (n < 10) {
        decompositions.push(decomposeSqrt);
    }

    // 3. The sum of the first n odd numbers is equal to n^2 e.g 1 + 3 + 5 = 3^2
    if (n > 1 && isSquare(n)) {
        decompositions.push(decomposeSqrt);
    }

    // 4. The sum of two consecutive integers is the difference of their squares e.g 3 + 2 = 3^2 - 2^2
    if (isOdd(n)) {
        decompositions.push(decomposeDifferenceSquares);
    }

    // 5. Express a number using multiplication and addition. E.g 4 = 1 * 3 + 1
    if (n <= 200) {
        decompositions.push(decomposeMulDivide);
    }

    // 6. Multiply and divide by a random number. e.g 2 = (2*5)/5
    decompositions.push(decomposeAddMultiply);

    return shuffle(decompositions)[0](n, operations);
};

export { decompose, conditionalDecomposition };
