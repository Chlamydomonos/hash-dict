<template>
    <el-container>
        <el-header class="app-header" height="3rem">
            <div class="header-left">
                <RouterView name="title" />
            </div>
            <nav class="header-right">
                <span class="header-content">
                    <SearchBar width="20rem" />
                </span>
                <span class="header-content">
                    <a class="login-link" v-if="sessionStore.session" @click="logout">LOGOUT</a>
                    <RouterLink class="login-link" to="/login" v-else>LOGIN</RouterLink>
                </span>
                <span class="header-content min-width-1">
                    <Transition name="el-fade-in">
                        <el-icon class="theme-icon" v-if="themeStore.isDark"><Moon /></el-icon>
                        <el-icon class="theme-icon" v-else><Sunny /></el-icon>
                    </Transition>
                </span>
                <span class="header-content">
                    <el-switch v-model="themeStore.isDark" @change="toggleDark" />
                </span>
            </nav>
        </el-header>
        <el-main>
            <RouterView />
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { onMounted } from 'vue';
import { useSessionStore } from './stores/session';
import axios from 'axios';
import SearchBar from './components/SearchBar.vue';

const sessionStore = useSessionStore();
const themeStore = useThemeStore();
const toggleDark = (value: boolean) => {
    if (value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const logout = () => {
    axios.post('/logout', {
        session: sessionStore.session,
    });
    sessionStore.session = undefined;
};

onMounted(() => {
    toggleDark(themeStore.isDark);
});
</script>

<style scoped lang="scss">
@use '@/assets/colors.scss';

.app-header {
    line-height: 3rem;
    display: flex;
    justify-content: space-between;
    @include colors.frame-background;
    @include colors.frame-shadow(0, 0, 2px);
}

.header-right {
    display: flex;
    align-self: center;
}

.header-content {
    display: flex;
    align-self: center;
    align-items: center;
    height: 3rem;
    line-height: 3rem;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}

.theme-icon {
    position: absolute;
}

.min-width-1 {
    width: 1rem;
}

.login-link {
    color: var(--el-text-color-secondary);
    margin-right: 1rem;
    text-decoration: underline;
}
</style>
