declare var MathJax: any;

type operation = (n: number) => string;

/* helper functions */

const randomElement = <A>(array: A[]) => {
    return array[Math.floor(Math.random() * array.length)];
};

const shuffle = <A>(array: A[]) => {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
};

const isOdd = (n: number) => n % 2 !== 0;

const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

const isPrime = (n: number) => {
    if (n <= 1 || (n % 2 == 0 && n > 2)) return false;

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
};

const getFactors = (n: number) => {
    let factors = [];
    for (let i = 0; i <= n; i++) {
        if (n % i === 0) {
            factors.push(i);
        }
    }
    return factors;
};

// Checking if a number can be formed using factorial
const isFactorial = (n: number) => {
    const factorials: { [key: number]: number } = {
        2: 2,
        6: 3,
        24: 4,
        120: 5,
        720: 6,
    };

    if (n in factorials) {
        return factorials[n];
    } else {
        return false;
    }
};

const isPow2 = (n: number) => n >= 2 && Number.isInteger(Math.log2(n));

const gcd = (a: number, b: number): number => {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
};

/* end helper functions */

/* start representations of numbers */

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
        return `{\\lim_{x \\to 0}{ \\frac{e^{${n}x} - 1}{x} }}`;
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

/* end representations of numbers */

/* start decompose functions */

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
                return factorial(fac, options.gammaFunction);
            }

            if (isPow2(n)) {
                return pow2Choose(Math.log2(n), options.numberTheory);
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
        randomOption1 = sameNumber;
        randomOption2 = sameNumber;
        randomOption3 = sameNumber;
        moreRandomOptions = sameNumber;
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

type ConvertOptions = {
    gammaFunction: boolean;
    eulersIdentity: boolean;
    exponentialLimits: boolean;
    polynomialLimits: boolean;
    numberTheory: boolean;
    geometricSeries: boolean;
};

const convert = (number: number, options: ConvertOptions) => {
    // Validating input
    if (isNaN(number) || number > 1000 || number < 0) {
        return;
    }

    /* Need to add another slash to latex strings to prevent slash escape */

    // List of functions that generate LaTeX math expressions
    // Functions are chosen randomly
    let possible_options: operation[] = [];

    if (options.eulersIdentity) {
        possible_options.push(eulersIdentity);
    }
    if (options.exponentialLimits) {
        possible_options.push(n => limitNaturalLog(n, options.numberTheory));
        possible_options.push(n => limitExponential(n, options.numberTheory));
    }
    if (options.polynomialLimits) {
        possible_options.push(limDiffTwoSquares);
        possible_options.push(limitPolynomial);
    }

    if (options.geometricSeries) {
        possible_options.push(n => infiniteGeometricSeries(n, options.numberTheory));
    }

    // decorate each operation with a function that checks if the input is of a certain form, and if it is it overrides the decorated function's usual result with it's own.
    possible_options = possible_options.map(f => {
        return conditionalDecomposition(f, options);
    });

    let input = decompose(number, possible_options);

    //  Disable the display and render buttons until MathJax is done
    var display = <HTMLInputElement>document.getElementById('display');
    var button = <HTMLButtonElement>document.getElementById('render');
    button.disabled = display.disabled = true;
    let downloadBtn = <HTMLButtonElement>document.getElementById('download-img');

    //  Clear the old output

    let output = document.getElementById('output')!;
    output.innerHTML = '';

    //  Reset the tex labels (and automatic equation numbers, though there aren't any here).
    //  Get the conversion options (metrics and display settings)
    //  Convert the input to CommonHTML output and use a promise to wait for it to be ready
    //    (in case an extension needs to be loaded dynamically).
    MathJax.texReset();
    var mathJaxOptions = MathJax.getMetricsFor(output);
    mathJaxOptions.display = display.checked;
    MathJax.tex2svgPromise(input, mathJaxOptions)
        .then(function(node: any) {
            //  The promise returns the typeset node, which we add to the output
            //  Then update the document to include the adjusted CSS for the
            //    content of the new equation.
            output.appendChild(node);
            MathJax.startup.document.clear();
            MathJax.startup.document.updateDocument();
            // Display download button
            downloadBtn.style.display = 'block';
        })
        .catch(function(err: Error) {
            //  If there was an error, put the message into the output instead
            output
                .appendChild(document.createElement('pre'))
                .appendChild(document.createTextNode(err.message));
        })
        .then(function() {
            //  Error or not, re-enable the display and render buttons
            button.disabled = display.disabled = false;
        });
};
const main = () => {
    const form = document.getElementById('form') as HTMLFormElement;
    const number = document.getElementById('input') as HTMLInputElement;

    const gammaFunction = document.getElementById('gamma-function') as HTMLInputElement;
    const eulersIdentity = document.getElementById('eulers-identity') as HTMLInputElement;
    const exponentialLimits = document.getElementById('limits-exponential') as HTMLInputElement;
    const polynomialLimits = document.getElementById('limits-polynomial') as HTMLInputElement;
    const numberTheory = document.getElementById('number-theory') as HTMLInputElement;
    const geometricSeries = document.getElementById('geometric-series') as HTMLInputElement;

    form.addEventListener('submit', event => {
        event.preventDefault();

        convert(parseInt(number.value), {
            gammaFunction: gammaFunction.checked,
            eulersIdentity: eulersIdentity.checked,
            exponentialLimits: exponentialLimits.checked,
            polynomialLimits: polynomialLimits.checked,
            numberTheory: numberTheory.checked,
            geometricSeries: geometricSeries.checked,
        });
    });

    // TODO
    // $('#display').on('change', convert);
};

main();
