import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import HeaderTitle from '@/components/HeaderTitle.vue';
import DictView from '@/views/DictView.vue';
import { getCategories, getFormat, getFullWord, getType, handleDict } from './handle-dict';
import WordView from '@/views/WordView.vue';
import { handleWord } from './handle-word';
import TypeView from '@/views/TypeView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import CreateTypeView from '@/views/CreateTypeView.vue';
import CreateCategoryView from '@/views/CreateCategoryView.vue';
import { handleType } from './handle-type';
import { handleCreateCategory } from './handle-create-category';
import AdminView from '@/views/AdminView.vue';
import { handleAdmin } from './handle-admin';
import TypesView from '@/views/TypesView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            components: {
                default: HomeView,
                title: HeaderTitle,
            },
        },
        {
            path: '/register',
            name: 'register',
            components: {
                default: RegisterView,
                title: HeaderTitle,
            },
            props: { title: { value: '注册' } },
        },
        {
            path: '/login',
            name: 'login',
            components: {
                default: LoginView,
                title: HeaderTitle,
            },
            props: { title: { value: '登录' } },
        },
        {
            path: '/dict/:format/:type/:categories+',
            name: 'dict',
            components: {
                default: DictView,
                title: HeaderTitle,
            },
            props: {
                title: (route) => ({ value: getFullWord(route.params) }),
                default: (route) => ({
                    format: getFormat(route.params),
                    type: getType(route.params),
                    categories: getCategories(route.params),
                }),
            },
            beforeEnter: handleDict,
        },
        {
            path: '/word/:format/:word',
            name: 'word',
            component: WordView,
            beforeEnter: handleWord,
        },
        {
            path: '/type/:format/:type',
            name: 'type',
            components: {
                default: TypeView,
                title: HeaderTitle,
            },
            props: {
                title: (route) => ({ value: getType(route.params)?.value == '' ? '■' : getType(route.params)?.value }),
                default: (route) => ({
                    format: getFormat(route.params),
                    type: getType(route.params),
                }),
            },
            beforeEnter: handleType,
        },
        {
            path: '/not-found',
            name: 'not-found',
            components: {
                default: NotFoundView,
                title: HeaderTitle,
            },
            props: { title: { value: 'Not Found' } },
        },
        {
            path: '/create-type',
            name: '/create-type',
            components: {
                default: CreateTypeView,
                title: HeaderTitle,
            },
            props: { title: { value: '创建类型' } },
        },
        {
            path: '/create-category/:type/:categories*',
            name: 'create-category',
            components: {
                default: CreateCategoryView,
                title: HeaderTitle,
            },
            props: {
                title: { value: '创建词语' },
                default: (route) => ({
                    type: getType(route.params),
                    categories: getCategories(route.params) ?? [],
                }),
            },
            beforeEnter: handleCreateCategory,
        },
        {
            path: '/admin',
            name: 'admin',
            components: {
                default: AdminView,
                title: HeaderTitle,
            },
            props: {
                title: { value: '注册请求' },
            },
            beforeEnter: handleAdmin,
        },
        {
            path: '/types',
            name: 'types',
            components: {
                default: TypesView,
                title: HeaderTitle,
            },
            props: {
                title: { value: '类型列表' },
            },
        },
    ],
});

export default router;
