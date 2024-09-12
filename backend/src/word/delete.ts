import { sql } from '@sequelize/core';
import { db } from '../db';
import { Category } from '../db/models/Category';
import { Type } from '../db/models/Type';

export const deleteType = async (id: number) => {
    const type = await Type.findByPk(id);
    if (type == null) {
        return;
    }
    await Category.destroy({ where: { typeId: type.id } });
    await type.destroy();
};

export const deleteCategory = async (id: number) => {
    const category = await Category.findByPk(id);
    if (category == null) {
        return;
    }
    await db.query(sql`
        with recursive "categoryTree" as (
            select "id" from "Categories" where "id" = ${id}
            union all
            select "c"."id" from "Categories" "c" join "categoryTree" "ct" on "c"."parentId" = "ct"."id"
        )
        delete from "Categories" where "id" in (select "id" from "categoryTree")
    `);
};
