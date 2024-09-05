import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSessionStore = defineStore(
    'session',
    () => {
        const session = ref(undefined as string | undefined);
        const loggedIn = computed(() => session.value != undefined);
        return { session, loggedIn };
    },
    {
        persist: true,
    }
);
