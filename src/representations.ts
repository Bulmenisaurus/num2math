/**
 * Exploits the [Strong law of small numbers](https://en.wikipedia.org/wiki/Strong_law_of_small_numbers) to
 * find properties of the smaller numbers given by the decompositions, such as the euler phi and prime counting functions,
 * factorial/gamma, and more.
 */

import { gcd, randomElement } from './utils';

const _eulerPhi = (n: number) => {
    let x = 0;

    for (let i = 1; i <= n; i++) {
        if (gcd(i, n) === 1) {
            x++;
        }
    }

    return x;
};

const _primeSieve = (n: number) => {
    const primeSieve = [];
    for (let i = 0; i <= n; i++) {
        primeSieve.push(true);
    }
    primeSieve[0] = false;
    primeSieve[1] = false;

    for (let p = 2; p * p <= n; p++) {
        if (primeSieve[p] === true) {
            for (let i = p * p; i <= n; i += p) {
                primeSieve[i] = false;
            }
        }
    }

    let resPrimes = [];
    for (let i = 0; i <= n; i++) {
        if (primeSieve[i]) {
            resPrimes.push(i);
        }
    }
    return resPrimes;
};

const _cachedPrimes = _primeSieve(999);

const _primeCountingFunction = (n: number) => {
    return _cachedPrimes.filter(x => x <= n).length;
};

const numberTheoryFunctions = (n: number) => {
    let matchingPhiInputs = [];
    let matchingPiInputs = [];
    let functionOptions = [];

    for (let i = 1; i <= 999; i++) {
        if (_eulerPhi(i) === n) {
            matchingPhiInputs.push(i);
        }

        if (_primeCountingFunction(i) === n) {
            matchingPiInputs.push(i);
        }
    }

    if (matchingPhiInputs.length > 0) {
        let matchingInput = randomElement(matchingPhiInputs);
        functionOptions.push(`\\varphi(${matchingInput})`);
    }

    if (matchingPiInputs.length > 0) {
        let matchingInput = randomElement(matchingPiInputs);
        functionOptions.push(`\\pi(${matchingInput})`);
    }

    if (functionOptions.length === 0 || Math.random() < 0.3) {
        functionOptions.push(`${n}`);
    }

    return randomElement(functionOptions);
};

const factorial = (n: number, gammaFunctionEnabled: boolean) => {
    if (Math.random() < 0.5 && gammaFunctionEnabled) {
        // Γ(n) = (n-1)!
        return `{\\Gamma (${n + 1})}`;
    } else {
        // Using the pi product notation of factorial
        return `{\\prod_{k=1}^{${n}} k}`;
    }
};

// representation of 2^n
const pow2Choose = (n: number, numberTheoryEnabled: boolean) => {
    let x = numberTheoryEnabled ? numberTheoryFunctions(n) : n;
    return `{\\sum_{k=0}^{${x}} {${n} \\choose k}}`;
};

// Limits of natural log functions: https://en.wikipedia.org/wiki/List_of_limits#Natural_logarithms
const limitNaturalLog = (n: number, numberTheoryEnabled: boolean) => {
    if (n === 0) {
        return `{\\lim_{x \\to \\infty}{ \\frac{\\ln(x)}{x} }}`;
    } else if (n === 1) {
        return `{\\lim_{x \\to 1}  {\\frac{\\ln(x)}{x - 1}}}`;
    } else {
        let x = numberTheoryEnabled ? numberTheoryFunctions(n) : n;
        return `{\\lim_{x \\to 0}{ \\frac{-\\ln(1 + ${x}(e^{-x} - 1))}{x} }}`;
    }
};

// Limits of exponential functions: https://en.wikipedia.org/wiki/List_of_limits#Sums,_products_and_composites
const limitExponential = (n: number, numberTheoryEnabled: boolean) => {
    if (n === 0) {
        return `{\\lim_{x \\to \\infty}{xe^{-x}}}`;
    } else if (n === 1) {
        return `{\\lim_{x \\to 0}{ \\frac{e^x - 1}{x} }}`;
    } else {
        let x = numberTheoryEnabled ? numberTheoryFunctions(n) : n;
        return `{\\lim_{x \\to 0}{ \\frac{e^{${x}x} - 1}{x} }}`;
    }
};

// Limits of polynomial functions
const limitPolynomial = (n: number) => {
    // https://en.wikipedia.org/wiki/List_of_limits#Functions_of_the_form_xa
    if (n === 0) {
        let r = Math.floor(Math.random() * 20);
        return `{\\lim_{x \\to \\infty}{${r}x^{-1}}}`;
    }

    // https://en.wikipedia.org/wiki/List_of_limits#Functions_of_the_form_xg(x)
    else if (n === 1) {
        return `{\\lim_{x \\to \\infty}{x^{1/x}}}`;
    } else {
        // generate random polynomial limits like lim x -> ∞ (28x^2 - 11x)/(4x^2 + 10x)
        // since the highest power terms dominate in the limits, the rest are ignored and can be random

        // Get random multiplier greater than 1
        let m = Math.floor(Math.random() * 5) + 1;
        // Choose a random highest power. This determines the final solution of the limit
        let highestPower = Math.floor(Math.random() * 3) + 2;

        let numeratorNumberOfTerms = highestPower - 1;
        let denominatorNumberOfTerms = highestPower - 1;

        let signs = ['-', '+'];
        let numerator = `${m * n}x^{${highestPower}} `;
        let denominator = `${m}x^{${highestPower}} `;

        // Generate a polynomial numerator with random length and coefficients
        //ex: 15x^2
        for (let i = numeratorNumberOfTerms; i > 0; i--) {
            let coef = Math.floor(Math.random() * 10) + 2;

            let power = i < 2 ? '' : `^{${i}}`;
            let sign = signs[Math.floor(Math.random() * 2)];

            numerator += `${sign} ${coef}x${power} `;
        }

        // Generate a polynomial denominator with random length and coefficients
        for (let i = denominatorNumberOfTerms; i > 0; i--) {
            let coef = Math.floor(Math.random() * 10) + 2;

            let power = i < 2 ? '' : `^{${i}}`;
            let sign = signs[Math.floor(Math.random() * 2)];

            denominator += `${sign} ${coef}x${power} `;
        }

        return `{ \\lim_{x \\to \\infty} { \\frac{${numerator}}{${denominator}}} }`;
    }
};

// Using euler's identity. That is, e^(pi*i) = -1
const eulersIdentity = (n: number) => {
    // e.g −6e^(pi*i)=6

    if (n !== 0) {
        return `{-${n}e^{\\pi i}}`;
    } else {
        return `{(e^{\\pi i} + 1)}`;
    }
};

// Infinite geometric series that evaluates to a finite value
const infiniteGeometricSeries = (n: number, numberTheoryEnabled: boolean) => {
    // https://en.wikipedia.org/wiki/List_of_mathematical_series#Trigonometric_functions
    if (n === 0) {
        let r = Math.floor(Math.random() * 10) + 3;
        return `{\\sum\\limits_{k=0}^{${r -
            1}} {\\sin \\left({ \\frac{2 \\pi k}{${r}} } \\right)}}`;
    }

    // Using the Riemann zeta function: https://en.wikipedia.org/wiki/Particular_values_of_the_Riemann_zeta_function#The_Riemann_zeta_function_at_0_and_1
    else if (n === 1) {
        return `{\\lim_{\\epsilon \\to 0}{ \\epsilon \\zeta(1 + \\epsilon) }}`;
    } else {
        // Using the infinite geometric series rule: When −1<x<1, summation from i = 0 to infinity of r^i = 1/(1-r) or (r-1)/r.
        // Decimal can be represented as fraction too. e.g (0.25)^i = (1/4)^i = 4^-i
        let x1 = numberTheoryEnabled ? numberTheoryFunctions(n - 1) : n - 1;
        let x2 = numberTheoryEnabled ? numberTheoryFunctions(n) : n;
        return `{\\sum\\limits_{k=0}^\\infty {\\left({\\frac{${x1}}{${x2}}}\\right)^{k}}}`;
    }
};

// Using the trig identity (cos^2)x + (sin^2)x = 1
const trigIdentity = (expression: string) => {
    let randomValue = Math.random();
    if (randomValue < 0.25) {
        return `\\left(\\frac{${expression}}{(\\cos^2x + \\sin^2x)}\\right)`;
    } else if (randomValue < 0.5) {
        return `\\left({${expression} \\times (\\cos^2x + \\sin^2x)}\\right)`;
    }
};

/* Using the difference of two squares in limits */
const limDiffTwoSquares = (n: number) => {
    let r = Math.floor(Math.random() * 10) + 1;
    if (Math.random() < 0.5) {
        var tex = `\\lim_{x \\to ${n - r}} \\frac{x^2 - ${r ** 2}}{x - ${r}}`;
    } else {
        var tex = `\\lim_{x \\to ${n + r}} \\frac{x^2 - ${r ** 2}}{x + ${r}}`;
    }
    return `{${tex}}`;
};

const sameNumber = (n: number) => `${n}`;

export {
    numberTheoryFunctions,
    factorial,
    pow2Choose,
    limitNaturalLog,
    limitExponential,
    limitPolynomial,
    eulersIdentity,
    infiniteGeometricSeries,
    trigIdentity,
    limDiffTwoSquares,
    sameNumber,
};
