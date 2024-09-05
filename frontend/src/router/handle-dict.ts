import { buildWord } from '@/lib/build-word';
import { formatOf } from '@/lib/format';
import type { RouteLocationNormalizedGeneric } from 'vue-router';

const redirect = { name: 'not-found' };
const parseRe = /^(-?[0-9]+)-([a-z]+)$/;

export const getFormat = (params: Record<string, any>) => {
    const formatStr = params.format;
    if (typeof formatStr != 'string') {
        return undefined;
    }
    return formatOf(formatStr);
};

export const getType = (params: Record<string, any>) => {
    const typeStr = params.type;
    if (typeof typeStr != 'string') {
        return undefined;
    }
    const parse = parseRe.exec(typeStr);
    if (!parse) {
        const parse2 = /^(-?[0-9]+)-$/.exec(typeStr);
        if (!parse2) {
            return undefined;
        }
        return { id: parseInt(parse2[1]), value: '' };
    }
    return { id: parseInt(parse[1]), value: parse[2] };
};

export const getCategories = (params: Record<string, any>) => {
    try {
        const raw = params.categories;
        if (!Array.isArray(raw)) {
            return undefined;
        }
        return raw.map((value) => {
            if (typeof value != 'string') {
                throw Error();
            }
            const parse = parseRe.exec(value);
            if (!parse) {
                throw Error();
            }
            return { id: parseInt(parse[1]), value: parse[2] };
        });
    } catch (e) {
        return undefined;
    }
};

export const getFullWord = (params: Record<string, any>) => {
    const format = getFormat(params);
    if (format === undefined) {
        return undefined;
    }

    const type = getType(params);
    if (!type) {
        return undefined;
    }
    const categories = getCategories(params);
    if (!categories) {
        return undefined;
    }
    return buildWord(type, categories, format);
};

export const handleDict = (to: RouteLocationNormalizedGeneric) => {
    if (!getFullWord(to.params)) {
        return redirect;
    }
    return true;
};
