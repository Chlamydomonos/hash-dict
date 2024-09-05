import { useSessionStore } from '@/stores/session';

const redirect = { name: 'not-found' };

export const handleAdmin = () => {
    if (!useSessionStore().loggedIn) {
        return redirect;
    }
    return true;
};
