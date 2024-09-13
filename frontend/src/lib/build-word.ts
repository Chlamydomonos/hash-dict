import { toFormat, type Format } from './format';

export type Unit = { id: number; value: string };

export const buildWord = (type: Unit, categories: Unit[], format: Format) => {
    let word = categories[0].value;
    if (word.startsWith('b')) {
        word = word.slice(1);
    }

    for (let i = 1; i < categories.length; i++) {
        word += toFormat(categories[i].value, format);
    }
    return `${word}${toFormat(type.value, format)}`;
};
