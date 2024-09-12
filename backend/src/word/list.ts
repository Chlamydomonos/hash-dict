import { Category } from '../db/models/Category';
import { Type } from '../db/models/Type';
import { toNormalFormat } from '../db/translate';

export const countWithType = (id: number) => Category.count({ where: { typeId: id, parentId: null } });

export const listWithType = async (id: number, page: number, pageSize: number) => {
    const query = await Category.findAll({
        where: { typeId: id, parentId: null },
        limit: pageSize,
        order: ['value'],
        offset: page * pageSize,
    });
    return query.map((category) => ({ id: category.id as number, value: toNormalFormat(category.value) }));
};

export const countWithParent = (id: number) => Category.count({ where: { parentId: id } });

export const listWithParent = async (id: number, page: number, pageSize: number) => {
    const query = await Category.findAll({
        where: { parentId: id },
        limit: pageSize,
        order: ['value'],
        offset: page * pageSize,
    });
    return query.map((category) => ({ id: category.id as number, value: toNormalFormat(category.value) }));
};

export const listTypes = async () => {
    return (await Type.findAll()).map((value) => ({
        id: value.id as number,
        value: value.end,
    }));
};
