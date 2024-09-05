import {
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { Type } from './Type';

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare value: string;

    @BelongsTo(() => Type, {
        foreignKey: 'typeId',
        inverse: {
            as: 'categories',
            type: 'hasMany',
        },
    })
    declare type?: NonAttribute<Type>;
    declare getType: BelongsToGetAssociationMixin<Type>;
    declare setType: BelongsToSetAssociationMixin<Type, Category['typeId']>;
    declare createType: BelongsToCreateAssociationMixin<Type>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare typeId: number;

    @HasMany(() => Category, {
        foreignKey: 'parentId',
        inverse: 'parent',
    })
    declare children: NonAttribute<Category[]>;
    declare getChildren: HasManyGetAssociationsMixin<Category>;
    declare setChildren: HasManySetAssociationsMixin<Category, Category['id']>;
    declare addChild: HasManyAddAssociationMixin<Category, Category['id']>;
    declare removeChild: HasManyRemoveAssociationMixin<Category, Category['id']>;
    declare createChild: HasManyCreateAssociationMixin<Category, 'parentId'>;
    declare hasChild: HasManyHasAssociationMixin<Category, Category['id']>;
    declare countChildren: HasManyCountAssociationsMixin<Category>;

    @BelongsTo(() => Category, {
        foreignKey: 'parentId',
        inverse: {
            as: 'children',
            type: 'hasMany',
        },
    })
    declare parent: Category | null;
    declare getParent: BelongsToGetAssociationMixin<Category>;
    declare setParent: BelongsToSetAssociationMixin<Category, Category['parentId']>;
    declare createParent: BelongsToCreateAssociationMixin<Category>;

    @Attribute(DataTypes.INTEGER)
    declare parentId: number | null;
}
