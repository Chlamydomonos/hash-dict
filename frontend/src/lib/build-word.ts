import { toFormat, type Format } from './format';

export type Unit = { id: number; value: string };

export const buildWord = (type: Unit, categories: Unit[], format: Format) => {
    let word = categories[0].value;
    let startWithConsonant = /^(?:b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)(.+)$/.exec(word);
    if (startWithConsonant) {
        word = startWithConsonant[1];
    }

    for (let i = 1; i < categories.length; i++) {
        word += toFormat(categories[i].value, format);
    }
    return `${word}${toFormat(type.value, format)}`;
};
