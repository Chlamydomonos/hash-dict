import { toFormat, type Format } from './format';

export type Unit = { id: number; value: string };

export const buildWord = (type: Unit, categories: Unit[], format: Format) => {
    let word = '';
    for (const category of categories) {
        word += toFormat(category.value, format);
    }
    return `${word}${toFormat(type.value, format)}`;
};
