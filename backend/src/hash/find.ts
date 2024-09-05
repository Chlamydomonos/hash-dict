import { Op, sql } from '@sequelize/core';
import { Category } from '../db/models/Category';
import { ParsedWord, parseWord } from '../word/parse';
import { toHash, toCategory } from './translate';
import { lenTable } from '../word/create';
import { toDBFormat } from '../db/translate';

const reservedHashList = [71, 79, 87, 95, 103, 111, 119, 127];
const reservedHashes = new Set(reservedHashList);
const reservedList = ['zy', 'cy', 'sy', 'gy', 'ky', 'hy', 'shy', 'ry'];

const nextHash = (hash: number[], minDigit: number = hash.length - 1) => {
    const result = [...hash];

    let i = minDigit;
    while (i >= 0) {
        result[i]++;

        if (result[i] === 128) {
            result[i] = 0;
            i--;
        } else if (!reservedHashList.includes(result[i])) {
            break;
        }
    }

    if (i < 0) {
        result.unshift(1);
    }

    for (let j = i + 1; j < result.length; j++) {
        while (reservedHashList.includes(result[j])) {
            result[j]++;
            if (result[j] === 128) {
                result[j] = 0;
                let k = j - 1;
                while (k >= 0) {
                    result[k]++;
                    if (result[k] === 128) {
                        result[k] = 0;
                        k--;
                    } else if (!reservedHashList.includes(result[k])) {
                        break;
                    }
                }
                if (k < 0) {
                    result.unshift(1);
                }
            }
        }
    }
    return result;
};

const nextReservedHash = (hash: number[]) => {
    const result = [...hash];
    let carry = 1;
    for (let i = result.length - 1; i >= 0; i--) {
        result[i] += carry;
        if (result[i] === 128) {
            result[i] = 0;
            carry = 1;
        } else {
            carry = 0;
        }
    }
    if (carry === 1) {
        result.unshift(1);
    }
    return result;
};

const findNormal = async (category: string, typeId: number, parentId: number | null) => {
    const parsed = parseWord(category);
    let hash = toHash(parsed);
    for (let i = 0; i < hash.length; i++) {
        if (reservedHashes.has(hash[i])) {
            hash[i]++;
        }
    }

    for (let i = 0; i < 20; i++) {
        const built = toDBFormat(toCategory(hash));
        const hasPrefix = await Category.findOne({
            where: sql`${built} like concat(value, '%') and typeId = ${typeId} and parentId = ${parentId}`,
        });
        if (hasPrefix) {
            const parsedPrefix = parseWord(hasPrefix.value);
            hash = nextHash(hash, parsedPrefix.units.length - 1);
            continue;
        }
        const isPrefix = await Category.findAll({ where: { value: { [Op.like]: `${built}%` }, typeId, parentId } });
        if (isPrefix.length > 0) {
            hash = nextHash(hash);
            continue;
        }
        return toCategory(hash);
    }

    return findReserved(`${reservedList[parsed.units.length - 1]}${category}`, typeId, parentId);
};

const buildReserved = (firstUnit: string, hash: number[]) => {
    const hash2 = [...hash];
    const len = lenTable[firstUnit] - 1;
    while (hash2.length < len) {
        hash2.unshift(0);
    }
    return `${firstUnit}${toCategory(hash2)}`;
};

const findReserved = async (category: string, typeId: number, parentId: number | null) => {
    const parsedWithoutFirst = parseWord(category);
    let firstUnit = parsedWithoutFirst.units.shift()!;
    let len = lenTable[firstUnit] - 1;
    let hash = toHash(parsedWithoutFirst);
    while (len < 9) {
        const hasReserved = await Category.findOne({
            where: { value: toDBFormat(buildReserved(firstUnit, hash)), typeId, parentId },
        });
        if (hasReserved) {
            hash = nextReservedHash(hash);
            if (hash.length > len) {
                len = hash.length;
                firstUnit = reservedList[len - 1] as any;
            }
        } else {
            return buildReserved(firstUnit, hash);
        }
    }
    throw Error('All fields full');
};

interface Success {
    success: true;
    value: string;
}

interface Fail {
    success: false;
    reason: 'parse_fail' | 'reserved' | 'full';
}

enum CheckReservedResult {
    ERROR,
    RESERVED_ERROR,
    NORMAL,
    RESERVED,
}

const checkReserved = (category: string) => {
    let parsed: ParsedWord;
    try {
        parsed = parseWord(category);
    } catch (e) {
        return CheckReservedResult.ERROR;
    }

    if (reservedList.includes(parsed.units[0])) {
        const len = lenTable[parsed.units[0]];
        if (parsed.units.length != len) {
            return CheckReservedResult.RESERVED_ERROR;
        }
        return CheckReservedResult.RESERVED;
    }
    for (let i = 1; i < parsed.units.length; i++) {
        if (reservedList.includes(parsed.units[i])) {
            return CheckReservedResult.RESERVED_ERROR;
        }
    }
    return CheckReservedResult.NORMAL;
};

export type FindHashResponse = Success | Fail;

const toWord = (word: string, parentId: number | null) =>
    word.startsWith('b') && parentId == null ? word.slice(1) : word;

export const findHash: (
    category: string,
    typeId: number,
    parentId: number | null
) => Promise<FindHashResponse> = async (category, typeId, parentId) => {
    const checkResult = checkReserved(category);
    try {
        if (checkResult == CheckReservedResult.ERROR) {
            return { success: false, reason: 'parse_fail' };
        } else if (checkResult == CheckReservedResult.RESERVED_ERROR) {
            return { success: false, reason: 'reserved' };
        } else if (checkResult == CheckReservedResult.NORMAL) {
            return { success: true, value: toWord(await findNormal(category, typeId, parentId), parentId) };
        } else {
            return { success: true, value: toWord(await findReserved(category, typeId, parentId), parentId) };
        }
    } catch (e) {
        return { success: false, reason: 'full' };
    }
};
