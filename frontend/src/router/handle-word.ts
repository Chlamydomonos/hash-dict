import axios from 'axios';
import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { getFormat } from './handle-dict';
import type { Unit } from '@/lib/build-word';
import { formatName, type Format } from '@/lib/format';

const redirect = { name: 'not-found' };

const buildCategoryRoute = (format: Format, type: Unit, categories: Unit[]) => {
    let route = `/dict/${formatName(format)}/${type.id}-${type.value}`;
    for (const category of categories) {
        route += `/${category.id}-${category.value}`;
    }
    return route;
};

export const handleWord = async (to: RouteLocationNormalizedGeneric) => {
    const format = getFormat(to.params);
    if (format === undefined) {
        return redirect;
    }

    const word = to.params.word;
    if (typeof word != 'string') {
        return redirect;
    }
    try {
        const query = await axios.get(`/query-word/${word}`);
        const data = query.data;
        if (data.success) {
            return buildCategoryRoute(format, data.type, data.categories);
        } else if (data.reason == 'type_error') {
            alert('词语所在的类别不存在！');
            return false;
        } else if (data.reason == 'parse_error') {
            alert('不是有效的词语！');
            return false;
        } else if (data.reason == 'category_error') {
            return `${buildCategoryRoute(format, data.type, data.categories)}/-1-${data.failed}`;
        }
    } catch (e) {
        alert('Server Error');
        return false;
    }
};
