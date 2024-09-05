import { Op } from '@sequelize/core';
import { User } from '../db/models/User';

export const register = async (name: string, passwordHash: string) => {
    const tryQueryUser = await User.findOne({ where: { name } });
    if (tryQueryUser != null) {
        return { success: false, reason: 'exists' };
    }

    const invalidCount = await User.count({ where: { valid: false } });
    if (invalidCount >= 20) {
        return { success: false, reason: 'full' };
    }

    User.create({ name, passwordHash, valid: (await User.count()) == 0 });
    return { success: true };
};

export const getInvalidUsers = async () => {
    const users = await User.findAll({ where: { valid: false } });
    return users.map((user) => ({ id: user.id as number, name: user.name }));
};

export const commitUsers = async (userIds: number[]) => {
    await User.update({ valid: true }, { where: { id: { [Op.in]: userIds } } });
};

export const rejectUsers = async (userIds: number[]) => {
    await User.destroy({ where: { id: { [Op.in]: userIds } } });
};
