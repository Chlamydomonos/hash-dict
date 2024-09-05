import { ParsedWord } from '../word/parse';

const consonantMap = {
    b: 0,
    p: 1,
    m: 2,
    f: 3,
    d: 4,
    t: 5,
    n: 6,
    l: 7,
    z: 8,
    c: 9,
    s: 10,
    g: 11,
    k: 12,
    h: 13,
    sh: 14,
    r: 15,
} as Record<string, number>;

const vowelMap = { a: 0, e: 1, ee: 2, i: 3, oo: 4, o: 5, u: 6, y: 7 } as Record<string, number>;

const numVowelTable = ['a', 'e', 'ee', 'i', 'oo', 'o', 'u', 'y'];

const numConsonantTable = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'z', 'c', 's', 'g', 'k', 'h', 'sh', 'r'];

const toHashRe = /^(b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)(a|e|ee|i|oo|o|u|y)$/;

export const toHash = (word: ParsedWord) =>
    word.units.map((value) => {
        let result = toHashRe.exec(value);
        if (result == null) {
            throw Error('unknown error');
        }
        return consonantMap[result[1]] * 8 + vowelMap[result[2]];
    });

export const toCategory = (hash: number[]) => {
    let word = '';
    for (const value of hash) {
        const consonant = numConsonantTable[value >> 3];
        const vowel = numVowelTable[value & 7];
        word += `${consonant}${vowel}`;
    }
    return word;
};
