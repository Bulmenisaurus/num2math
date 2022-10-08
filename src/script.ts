declare var MathJax: any;

/* helper functions */

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
function isFactorial(n: number) {
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
}

/* end helper functions */

/* start representations of numbers */
const factorial = (n: number, gammaFunctionEnabled: boolean) => {
    if (Math.random() < 0.5 && gammaFunctionEnabled) {
        // Γ(n) = (n-1)!
        return `{\\Gamma (${n + 1})}`;
    } else {
        // Using the pi product notation of factorial
        return `{\\prod_{k=1}^{${n}} k}`;
    }
};

// Limits of natural log functions: https://en.wikipedia.org/wiki/List_of_limits#Natural_logarithms
const limit_natural_log = (n: number) => {
    if (n === 0) {
        return `{\\lim_{x \\to \\infty}{ \\ln(x) \\over {x} }}`;
    } else if (n === 1) {
        return `{\\lim_{x \\to 1}  { {\\ln(x)} \\over {x - 1} }}`;
    } else {
        return `{\\lim_{x \\to 0}{ {-\\ln(1 + ${n}(e^{-x} - 1))} \\over {x} }}`;
    }
};

// Limits of exponential functions: https://en.wikipedia.org/wiki/List_of_limits#Sums,_products_and_composites
function limit_exponential(n: number) {
    if (n === 0) {
        return `{\\lim_{x \\to \\infty}{xe^{-x}}}`;
    } else if (n === 1) {
        return `{\\lim_{x \\to 0}{ {e^x - 1} \\over {x} }}`;
    } else {
        return `{\\lim_{x \\to 0}{ {e^{${n}x} - 1} \\over {x} }}`;
    }
}

// Limits of polynomial functions
const limit_polynomial = (n: number) => {
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

        // Surround everything with curly braces so that they're treated as one
        numerator = `{ ${numerator} }`;
        denominator = `{ ${denominator} }`;
        return `{\\lim_{x \\to \\infty}{${numerator} \\over {${denominator}}}}`;
    }
};

// Using euler's identity. That is, e^(pi*i) = -1
const eulers_identity = (n: number) => {
    // e.g −6e^(pi*i)=6

    if (n !== 0) {
        return `{-${n}e^{\\pi i}}`;
    } else {
        return `{(e^{\\pi i} + 1)}`;
    }
};

// Infinite geometric series that evaluates to a finite value
const infinite_geometric_series = (n: number) => {
    // https://en.wikipedia.org/wiki/List_of_mathematical_series#Trigonometric_functions
    if (n === 0) {
        let r = Math.floor(Math.random() * 10) + 3;
        return `{\\sum\\limits_{k=0}^{${r -
            1}} {\\sin \\left({ {2 \\pi k} \\over {${r}} } \\right)}}`;
    }

    // Using the Riemann zeta function: https://en.wikipedia.org/wiki/Particular_values_of_the_Riemann_zeta_function#The_Riemann_zeta_function_at_0_and_1
    else if (n === 1) {
        return `{\\lim_{\\epsilon \\to 0}{ \\epsilon \\zeta(1 + \\epsilon) }}`;
    } else {
        // Using the infinite geometric series rule: When −1<x<1, summation from i = 0 to infinity of r^i = 1/(1-r) or (r-1)/r.
        // Decimal can be represented as fraction too. e.g (0.25)^i = (1/4)^i = 4^-i
        return `{\\sum\\limits_{k=0}^\\infty {\\left({${n - 1} \\over {${n}}}\\right)^{k}}}`;
    }
};

// Using the trig identity (cos^2)x + (sin^2)x = 1
const trig_identity = (expression: string) => {
    let randomValue = Math.random();
    if (randomValue < 0.25) {
        return `\\left({${expression} \\over {(\\cos^2x + \\sin^2x)}}\\right)`;
    } else if (randomValue < 0.5) {
        return `\\left({${expression} \\times (\\cos^2x + \\sin^2x)}\\right)`;
    }
};

/* Using the difference of two squares in limits */
const lim_diff_two_squares = (n: number) => {
    let r = Math.floor(Math.random() * 10) + 1;
    if (Math.random() < 0.5) {
        var tex = `{\\lim_{x \\to ${n - r}} {{x^2 - ${r ** 2}} \\over {x - ${r}}}}`.trim();
    } else {
        var tex = `{\\lim_{x \\to ${n + r}} {{x^2 - ${r ** 2}} \\over {x + ${r}}}}`.trim();
    }
    return tex;
};

const same_number = (n: number) => `${n}`;

/* end representations of numbers */

// Another function to break numbers down into smaller numbers, expressed using exponent
function decompose2(n: number, option1: (n: number) => string, option2: (n: number) => string) {
    // n -> (a)^b ± x
    let base = Math.floor(Math.random() * 3) + 6;

    // is b in the equation above
    let exponent = Math.log(n) / Math.log(base);

    // test a^floor(b) and a^ceil(b) to see which one is closer
    let floorLog = Math.floor(exponent);
    let ceilLog = Math.ceil(exponent);

    let expFloor = base ** floorLog;
    let expCeil = base ** ceilLog;

    let diffFloor = Math.abs(n - expFloor);
    let diffCeil = Math.abs(n - expCeil);

    // a^floor(b) is a better approximation
    // a^floor(b) is also lower than a^b, this we must add the difference
    if (diffFloor < diffCeil) {
        let power = floorLog === 1 ? '' : `^{${floorLog}}`;

        return `{ \\left({${option1(base)}}\\right)${power} + {${option2(diffFloor)}}}`;
    } else {
        let power = ceilLog === 1 ? '' : `^{${ceilLog}}`;

        return `{ \\left({${option1(base)}}\\right) ${power} - {${option2(diffCeil)}}}`;
    }
}

// Break a number down into smaller numbers separated by operators
function decompose(n: number, operations: ((n: number) => string)[]) {
    // Get three operations that can be used
    let moreRandomOptions = (num: number) => {
        return operations[Math.floor(Math.random() * operations.length)](num);
    };

    let randomOption1 = moreRandomOptions;
    let randomOption2 = moreRandomOptions;
    let randomOption3 = moreRandomOptions;

    // if there are no operations to be done
    if (operations.length === 0) {
        randomOption1 = same_number;
        randomOption2 = same_number;
        randomOption3 = same_number;
        moreRandomOptions = same_number;
    }

    if (operations.length >= 3) {
        [randomOption1, randomOption2, randomOption3] = shuffle(operations).slice(0, 3);
    }

    let randomValue = Math.random();

    // ab = (a - c)(b + c) + c (b - a + c), where c is any random positive number
    if (n !== 0 && n < 100 && (n === 2 || !isPrime(n)) && randomValue < 0.25) {
        let factors = getFactors(n);
        let randomIndex = Math.floor(Math.random() * factors.length);
        let a = factors[randomIndex];
        let b = n / a;
        let c = Math.floor(Math.random() * 30) + 1;

        // ab
        if (Math.random() < 0.2) {
            return `{{\\left({${randomOption1(a)}}\\right)}{\\left({${randomOption2(b)}}\\right)}}`;
        }

        // (a - c)(b + c) + c (b - a + c)
        else {
            return `{ \\left({${randomOption1(a)} - ${randomOption2(
                c
            )}}\\right) \\left({${randomOption3(b)} + ${moreRandomOptions(
                c
            )}}\\right) + {${moreRandomOptions(c)}}{\\left({${moreRandomOptions(
                b
            )} - ${moreRandomOptions(a)} + ${moreRandomOptions(c)}} \\right)} }`;
        }
    }

    // n = (d + 1)^2 - d^2 = 2d + 1 , where d = Math.floor(n/2)
    if (n > 2 && isOdd(n) && randomValue < 0.4) {
        let d = Math.floor(n / 2);
        if (Math.random() < 0.5) {
            return `{${randomOption1(2)} \\left({${randomOption2(d)}}\\right) + ${randomOption3(
                1
            )}}`;
        } else {
            return `{\\left({${randomOption1(d)} + ${randomOption2(
                1
            )}}\\right)^2 - \\left({${randomOption3(d)}}\\right)^2}`;
        }
    }

    // Represent (small) numbers using their square and square root
    else if (randomValue < 0.55 && n < 10) {
        let square = n ** 2;
        return `{\\sqrt{${randomOption1(square)}}}`;
    }

    // The sum of the first n odd numbers is equal to n^2 e.g 1 + 3 + 5 = 3^2
    else if (n > 1 && isSquare(n) && randomValue < 0.6) {
        let squareroot = Math.sqrt(n);
        let sum = `${randomOption1(1)}`;
        let oddVal = 1;

        if (Math.random() < 0.2) {
            for (let i = 0; i < squareroot - 1; i++) {
                let randIndex = Math.floor(Math.random() * operations.length);
                let randomOption = operations[randIndex];
                oddVal += 2;
                sum += `+ ${randomOption(oddVal)}`;
            }
            sum = `{ ${sum} }`;
            return sum;
        }

        // (a + b)^2 = a^2 + 2ab + b^2
        else {
            let a = Math.floor(Math.random() * squareroot - 1) + 1;
            let b = squareroot - a;

            // Representing (a + b)^2
            if (Math.random() < 0.5) {
                return `{ {\\left(${randomOption1(a)} + ${randomOption2(b)}\\right)}^2}`;
            }

            // Representing a^2 + 2ab + b^2
            else {
                return `{ {\\left(${randomOption1(a)}\\right)}^2 + {${moreRandomOptions(
                    2
                )}}{\\left(${randomOption2(a)}\\right)}{\\left(${randomOption3(
                    b
                )}\\right)} + {\\left(${moreRandomOptions(b)}\\right)}^2}`;
            }
        }
    }

    // The sum of two consecutive integers is the difference of their squares e.g 3 + 2 = 3^2 - 2^2
    else if (isOdd(n) && randomValue < 0.7) {
        let a = Math.floor(n / 2);
        let b = n - a;
        if (n < 22) {
            return `{${randomOption1(b ** 2)} - ${randomOption2(a ** 2)}}`;
        } else {
            return `{ \\left({${randomOption1(b)}}\\right)^2 -  \\left({${randomOption2(
                a
            )}}\\right)^2}`;
        }
    }

    // Using Fibonacci's method to generate a pythagorean triple: https://en.wikipedia.org/wiki/Formulas_for_generating_Pythagorean_triples#Fibonacci's_method
    else if (randomValue < 0.8 && isOdd(n) && n < 10) {
        let a = n;
        let a_square = a ** 2;
        let position = (a_square + 1) / 2;
        // Find sum of previous position - 1 terms
        let b_square = 0;
        let odd = -1;
        for (let i = 1; i < position; i++) {
            odd += 2;
            b_square += odd;
        }
        let b = Math.sqrt(b_square);
        let c_square = odd + 2 + b_square;
        let c = Math.sqrt(c_square);
        return `{\\sqrt{\\left({${randomOption1(c)}}\\right)^2 - \\left({${randomOption2(
            b
        )}}\\right)^2}}`;
    }

    // Express a number using multiplication and addition. E.g 4 = 1 * 3 + 1
    else if (randomValue < 0.9) {
        let randNum = Math.floor(Math.random() * n + 1) + 1;
        let r = n % randNum;
        let a = Math.floor(n / randNum);
        return `${randomOption1(a)} \\times {${randomOption2(randNum)}} + ${randomOption3(r)}`;

        // Multiply and divide by a random number. e.g 2 = (2*5)/5
    } else {
        let r = Math.floor(Math.random() * 5) + 1;
        return `${randomOption1(n * r)} \\over {${randomOption2(r)}}`;
    }
}

type ConvertOptions = {
    gammaFunction: boolean;
    eulersIdentity: boolean;
    exponentialLimits: boolean;
    polynomialLimits: boolean;
    trigonometry: boolean;
    geometricSeries: boolean;
};

const convert = (number: number, options: ConvertOptions) => {
    // Validating input
    if (isNaN(number) || number > 1000 || number < 0) {
        return;
    }

    // Checkboxes

    let gammaFuncCheckBox = options.gammaFunction;
    let eulersIdentityCheckBox = options.eulersIdentity;
    let limitExponentialCheckBox = options.exponentialLimits;
    let limitPolynomialCheckBox = options.polynomialLimits;
    let trigCheckBox = options.trigonometry;
    let geometricSeriesCheckBox = options.geometricSeries;

    /* Need to add another slash to latex strings to prevent slash escape */

    // List of functions that generate LaTeX math expressions
    // Functions are chosen randomly
    let possible_options: ((n: number) => string)[] = [];

    if (eulersIdentityCheckBox) {
        possible_options.push(eulers_identity);
    }
    if (limitExponentialCheckBox) {
        possible_options.push(limit_natural_log);
        possible_options.push(limit_exponential);
    }
    if (limitPolynomialCheckBox) {
        possible_options.push(lim_diff_two_squares);
        possible_options.push(limit_polynomial);
    }

    if (geometricSeriesCheckBox) {
        possible_options.push(infinite_geometric_series);
    }

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
    const trigonometry = document.getElementById('trig') as HTMLInputElement;
    const geometricSeries = document.getElementById('geometric-series') as HTMLInputElement;

    form.addEventListener('submit', event => {
        event.preventDefault();

        convert(parseInt(number.value), {
            gammaFunction: gammaFunction.checked,
            eulersIdentity: eulersIdentity.checked,
            exponentialLimits: exponentialLimits.checked,
            polynomialLimits: polynomialLimits.checked,
            trigonometry: trigonometry.checked,
            geometricSeries: geometricSeries.checked,
        });
    });

    // TODO
    // $('#display').on('change', convert);
};

main();
