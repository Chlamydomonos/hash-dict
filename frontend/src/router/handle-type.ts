import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { getFormat, getType } from './handle-dict';

const redirect = { name: 'not-found' };

export const handleType = (to: RouteLocationNormalizedGeneric) => {
    if (getFormat(to.params) === undefined) {
        return redirect;
    }
    if (!getType(to.params)) {
        return redirect;
    }
    return true;
};
