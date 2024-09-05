import { Category } from '../db/models/Category';
import { Type } from '../db/models/Type';
import { toDBFormat, toNormalFormat } from '../db/translate';
import { lenTable } from './create';
import { ParsedWord, parseWord } from './parse';

interface Unit {
    id: number;
    value: string;
}

interface Success {
    success: true;
    type: Unit;
    categories: Unit[];
}

interface Fail {
    success: false;
    reason: 'parse_error' | 'type_error';
}

interface PartFail {
    success: false;
    reason: 'category_error';
    type: Unit;
    categories: Unit[];
    failed: string;
}

export type QueryWordResponse = Success | Fail | PartFail;

export const queryWord: (word: string) => Promise<QueryWordResponse> = async (word) => {
    let parsed: ParsedWord;
    try {
        parsed = parseWord(word);
    } catch (e) {
        return { success: false, reason: 'parse_error' };
    }

    const typeQuery = await Type.findOne({ where: { end: parsed.type } });
    if (typeQuery == null) {
        return { success: false, reason: 'type_error' };
    }
    const type = { id: typeQuery.id, value: typeQuery.end };

    // handle special cases
    if (parsed.type == '' && parsed.units.length == 2 && parsed.units[0] == 'ha' && parsed.units[1] == 'shy') {
        const category = await Category.findOne({ where: { value: toDBFormat('hashy') } });
        if (category == null) {
            return { success: false, reason: 'category_error', type, categories: [], failed: 'hashy' };
        }
        return { success: true, type, categories: [{ id: category.id, value: toNormalFormat(category.value) }] };
    }
    // handle special cases end

    const categories: Unit[] = [];
    let tempUnit = '';
    let tempCategory: Category | null = null as Category | null;
    for (let i = 0; i < parsed.units.length; i++) {
        const parsedUnit = parsed.units[i];
        tempUnit += parsedUnit;

        // handle reserved start
        const isReserved = /zy|cy|sy|gy|ky|hy|shy|ry/.test(parsedUnit);
        if (isReserved) {
            const len = lenTable[parsedUnit];
            if (parsed.units.length - i - 1 < len) {
                return { success: false, reason: 'parse_error' };
            }
            if (tempUnit.length > 0) {
                let failed = '';
                for (let j = i; j < parsed.units.length; j++) {
                    failed += parsed.units[j];
                }
                return { success: false, reason: 'category_error', type, categories, failed };
            }
            for (let j = i + 1; j < i + len; j++) {
                tempUnit += parsed.units[j];
            }
            i += len - 1;
        }
        //handle reserved end

        const tryQuery: Category | null = await Category.findOne({
            where: { typeId: typeQuery.id, parentId: tempCategory?.id ?? null, value: toDBFormat(tempUnit) },
        });
        if (tryQuery != null) {
            categories.push({ id: tryQuery.id, value: toNormalFormat(tryQuery.value) });
            tempCategory = tryQuery;
            tempUnit = '';
        }
    }

    if (categories.length >= 1 && categories[0].value.startsWith('b')) {
        categories[0].value = categories[0].value.slice(1);
    }
    if (categories.length == 0 && tempUnit.startsWith('b')) {
        tempUnit = tempUnit.slice(1);
    }

    if (tempUnit.length == 0) {
        return {
            success: true,
            type,
            categories,
        };
    }

    return {
        success: false,
        reason: 'category_error',
        type,
        categories,
        failed: tempUnit,
    };
};

export const queryCategory = async (id: number) => {
    const result = await Category.findByPk(id);
    if (result == null) {
        return null;
    }

    let value = toNormalFormat(result.value);
    if (result.parentId == null && value.startsWith('b')) {
        value = value.slice(1);
    }

    return {
        value,
        description: result.description,
    };
};

export const queryType = async (id: number) => {
    const result = await Type.findByPk(id);
    if (result == null) {
        return null;
    }

    return {
        end: result.end,
        description: result.description,
    };
};
