import { asciiToAsciiNum } from './ascii-to-ascii-num';
import { asciiToChinese } from './ascii-to-chinese';
import { asciiToLatin } from './ascii-to-latin';
import { asciiToNum } from './ascii-to-num';

export enum Format {
    ASCII,
    LATIN,
    NUM,
    ASCII_NUM,
    CHINESE,
}

export const formatOf = (str: string) => {
    switch (str) {
        case 'ascii':
            return Format.ASCII;
        case 'latin':
            return Format.LATIN;
        case 'num':
            return Format.NUM;
        case 'ascii_num':
            return Format.ASCII_NUM;
        case 'chinese':
            return Format.CHINESE;
    }
};

export const formatName = (format: Format) => {
    switch (format) {
        case Format.ASCII:
            return 'ascii';
        case Format.LATIN:
            return 'latin';
        case Format.NUM:
            return 'num';
        case Format.ASCII_NUM:
            return 'ascii_num';
        case Format.CHINESE:
            return 'chinese';
    }
};

export const toFormat = (word: string, format: Format) => {
    switch (format) {
        case Format.ASCII:
            return word;
        case Format.LATIN:
            return asciiToLatin(word);
        case Format.NUM:
            return asciiToNum(word);
        case Format.ASCII_NUM:
            return asciiToAsciiNum(word);
        case Format.CHINESE:
            return asciiToChinese(word);
    }
};
