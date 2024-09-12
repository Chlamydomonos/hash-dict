import { Category } from '../db/models/Category';
import { Type } from '../db/models/Type';
import { Op, sql } from '@sequelize/core';
import { ParsedWord, parseWord } from './parse';
import { toDBFormat, toNormalFormat } from '../db/translate';

export const createType = async (end: string, description: string) => {
    const hasType = await Type.findOne({ where: { end } });
    if (hasType != null) {
        return -1;
    }
    const type = await Type.create({ end, description });
    return type.id as number;
};

interface Success {
    success: true;
    id: number;
}

interface NormalFail {
    success: false;
    reason: 'format_error' | 'type_error' | 'exists' | 'parent_error' | 'reserved';
}

interface Prefix {
    success: false;
    reason: 'prefix';
    prefixId: number;
    prefix: string;
}

interface IsPrefix {
    success: false;
    reason: 'is_prefix';
    prefixed: { id: number; value: string }[];
}

export type CreateCategoryResponse = Success | NormalFail | Prefix | IsPrefix;

export const lenTable = { zy: 2, cy: 3, sy: 4, gy: 5, ky: 6, hy: 7, shy: 8, ry: 9 } as Record<string, number>;

export const createCategory: (
    typeId: number,
    value: string,
    description: string,
    parentId: number | null
) => Promise<CreateCategoryResponse> = async (typeId, value, description, parentId) => {
    const type = await Type.findByPk(typeId);
    if (type == null) {
        return { success: false, reason: 'type_error' };
    }

    let word: ParsedWord;
    try {
        word = parseWord(`${value}${type.end}`);
    } catch (e) {
        return { success: false, reason: 'format_error' };
    }

    const hasCategory = await Category.findOne({ where: { typeId, value: toDBFormat(value), parentId } });
    if (hasCategory) {
        return { success: false, reason: 'exists' };
    }

    // handle special cases
    if (type.end == '' && value == 'hashy' && parentId == null) {
        const newCategory = await Category.create({ value: toDBFormat(value), description, typeId, parentId });
        return { success: true, id: newCategory.id };
    }
    if (parentId != null) {
        const parent = await Category.findByPk(parentId);
        if (parent != null && parent.value == toDBFormat('hashy')) {
            return { success: false, reason: 'reserved' };
        }
    }
    // handle special cases end

    // handle reserved
    const testReserved = /^(zy|cy|sy|gy|ky|hy|shy|ry)/.exec(value);
    if (testReserved) {
        const len = lenTable[testReserved[1]];
        if (word.units.length != len) {
            return { success: false, reason: 'reserved' };
        }
        const newCategory = await Category.create({ value: toDBFormat(value), description, typeId, parentId });
        return { success: true, id: newCategory.id };
    }
    if (/zy|cy|sy|gy|ky|hy|shy|ry/.test(value)) {
        return { success: false, reason: 'reserved' };
    }
    // handle reserved end

    const hasPrefix = await Category.findOne({
        where: sql`${toDBFormat(
            value
        )} like concat(value, '%') and Category.typeId = ${typeId} and Category.parentId = ${parentId}`,
    });
    if (hasPrefix) {
        return { success: false, reason: 'prefix', prefixId: hasPrefix.id, prefix: toNormalFormat(hasPrefix.value) };
    }

    const isPrefix = await Category.findAll({
        where: { value: { [Op.like]: `${toDBFormat(value)}%` }, typeId, parentId },
    });
    if (isPrefix.length > 0) {
        return {
            success: false,
            reason: 'is_prefix',
            prefixed: isPrefix.map((category) => ({ id: category.id, value: toNormalFormat(category.value) })),
        };
    }

    const newCategory = await Category.create({ value: toDBFormat(value), description, typeId, parentId });
    return { success: true, id: newCategory.id };
};
