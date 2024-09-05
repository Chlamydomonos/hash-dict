import { Category } from '../db/models/Category';
import { Type } from '../db/models/Type';

export const editType = async (id: number, description: string) => {
    const type = await Type.findByPk(id);
    if (type == null) {
        return false;
    }
    type.description = description;
    await type.save();
    return true;
};

export const editCategory = async (id: number, description: string) => {
    const category = await Category.findByPk(id);
    if (category == null) {
        return false;
    }
    category.description = description;
    await category.save();
    return true;
};
