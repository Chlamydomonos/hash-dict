import {
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
import { Attribute, AutoIncrement, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { Category } from './Category';

export class Type extends Model<InferAttributes<Type>, InferCreationAttributes<Type>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.STRING(1))
    @NotNull
    declare end: string;

    @HasMany(() => Category, {
        foreignKey: 'typeId',
        inverse: 'type',
    })
    declare categories?: NonAttribute<Category[]>;
    declare getCategories: HasManyGetAssociationsMixin<Category>;
    declare setCategories: HasManySetAssociationsMixin<Category, Category['id']>;
    declare addCategory: HasManyAddAssociationMixin<Category, Category['id']>;
    declare removeCategory: HasManyRemoveAssociationMixin<Category, Category['id']>;
    declare createCategory: HasManyCreateAssociationMixin<Category, 'typeId'>;
    declare hasCategory: HasManyHasAssociationMixin<Category, Category['id']>;
    declare countCategories: HasManyCountAssociationsMixin<Category>;
}
