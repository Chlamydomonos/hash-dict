import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { getCategories, getType } from './handle-dict';

const redirect = { name: 'not-found' };

export const handleCreateCategory = (to: RouteLocationNormalizedGeneric) => {
    if (!getType(to.params)) {
        return redirect;
    }
    if (to.params.categories != '' && !getCategories(to.params)) {
        return redirect;
    }
    return true;
};
