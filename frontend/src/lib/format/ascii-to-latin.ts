export const asciiToLatin = (word: string) =>
    word.replace(/ee/g, 'ə').replace(/oo/g, 'ɔ').replace(/sh/g, 'ʃ').replace(/i/g, 'ɪ');
