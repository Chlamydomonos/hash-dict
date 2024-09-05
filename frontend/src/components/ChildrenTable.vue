<template>
    <div>
        <hr />
        <h3>子词语列表</h3>
        <div v-if="childState == ChildState.LOADING">Loading...</div>
        <div v-else-if="childState == ChildState.FAIL" style="color: darkred">FAILED TO LOAD</div>
        <div v-else-if="childPageCount == 0">
            暂无子词语
            <div class="button-container" v-if="sessionStore.loggedIn">
                <el-button type="primary" size="small" @click="gotoCreate">创建</el-button>
            </div>
        </div>
        <div v-else>
            <ul class="child-list">
                <li v-for="child in children">
                    <RouterLink :to="buildChildRoute(child)">{{ buildChild(child) }}</RouterLink>
                </li>
            </ul>
            <div class="button-container" v-if="sessionStore.loggedIn">
                <el-button type="primary" size="small" @click="gotoCreate">创建</el-button>
            </div>
            <div class="page-nav">
                <el-button size="small" circle :icon="DArrowLeft" @click="gotoPage(1)" />
                <el-button
                    size="small"
                    circle
                    :icon="ArrowLeft"
                    @click="gotoPage(childPage - 1)"
                    :disabled="childPage == 1"
                />
                <span class="separator"></span>
                <el-input-number size="small" v-model="pageToGo" :min="1" :max="childPageCount" />
                &nbsp;
                <span class="page-total"> / {{ childPageCount }}</span>
                &nbsp;
                <el-button size="small" :disabled="pageToGo == childPage" @click="gotoPage(pageToGo)">跳转</el-button>
                <el-button
                    size="small"
                    circle
                    :icon="ArrowRight"
                    @click="gotoPage(childPage + 1)"
                    :disabled="childPage == childPageCount"
                />
                <el-button size="small" circle :icon="DArrowRight" @click="gotoPage(childPageCount)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Unit } from '@/lib/build-word';
import { formatName, toFormat, type Format } from '@/lib/format';
import { useSessionStore } from '@/stores/session';
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from '@element-plus/icons-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    id: number;
    isType?: true;
    format: Format;
    baseRoute: string;
    type: string;
    baseWord: string;
}>();

const childPageCount = ref(0);
const childPage = ref(1);
const pageToGo = ref(1);
enum ChildState {
    LOADING,
    SUCCESS,
    FAIL,
}
const childState = ref(ChildState.LOADING);
const children = ref([] as Unit[]);

const startLoad = () => {
    childState.value = ChildState.LOADING;
};

const fetchChildren = async () => {
    try {
        childState.value = ChildState.LOADING;
        const pageSize = 20;
        const response = await axios.get(`/count-word-with-${props.isType ? 'type' : 'parent'}/${props.id}`);
        const data = response.data;
        if (!data.success) {
            childState.value = ChildState.FAIL;
            return;
        }
        childPageCount.value = Math.ceil(data.count / pageSize);
        childPage.value = 1;
        await getChildPage();
    } catch (e) {
        childState.value = ChildState.FAIL;
    }
};

onMounted(fetchChildren);

const getChildPage = async () => {
    try {
        childState.value = ChildState.LOADING;
        const response = await axios.get(
            `/get-words-with-${props.isType ? 'type' : 'parent'}/${props.id}/20/${childPage.value - 1}`
        );
        const data = response.data;
        if (!data.success) {
            childState.value = ChildState.FAIL;
        }
        childState.value = ChildState.SUCCESS;
        children.value = data.words;
    } catch (e) {
        childState.value = ChildState.FAIL;
    }
};

const gotoPage = async (page: number) => {
    childPage.value = page;
    pageToGo.value = page;
    await getChildPage();
};

const buildChildRoute = (child: Unit) =>
    `/dict/${formatName(props.format)}/${props.baseRoute}/${child.id}-${child.value}`;

const buildChild = (child: Unit) => toFormat(`${props.baseWord}${child.value}${props.type}`, props.format);

const router = useRouter();
const sessionStore = useSessionStore();
const gotoCreate = () => {
    router.push(`/create-category/${props.baseRoute}`);
};

defineExpose({ startLoad, fetchChildren });
</script>

<style lang="scss" scoped>
@use '@/assets/fonts.scss';
.child-list a {
    color: var(--el-text-color-secondary);
    font-family: fonts.$sans-serif;
    font-size: 1rem;
}

.page-nav {
    display: flex;
}

.separator {
    margin: 0 6px;
}

.page-total {
    margin: 0 10px;
}

.button-container {
    margin: 0.5rem 0;
}
</style>
