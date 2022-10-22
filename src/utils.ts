type operation = (n: number) => string;

type ConvertOptions = {
    gammaFunction: boolean;
    eulersIdentity: boolean;
    exponentialLimits: boolean;
    polynomialLimits: boolean;
    numberTheory: boolean;
    geometricSeries: boolean;
};

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

export {
    operation,
    ConvertOptions,
    randomElement,
    shuffle,
    isOdd,
    isSquare,
    isPrime,
    getFactors,
    isFactorial,
    isPow2,
    gcd,
};
