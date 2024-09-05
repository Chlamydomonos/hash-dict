export const toDBFormat = (word: string) => word.replace(/ee/g, '0').replace(/oo/g, '1').replace(/sh/g, '2');

export const toNormalFormat = (word: string) => word.replace(/0/g, 'ee').replace(/1/g, 'oo').replace(/2/g, 'sh');
