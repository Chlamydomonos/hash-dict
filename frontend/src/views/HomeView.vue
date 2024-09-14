<template>
    <div class="main-title" ref="mainTitle">
        <div class="main-title-text" ref="mainTitleText">
            <RouterLink to="/word/latin/hashy">haʃø</RouterLink>
            /
            <RouterLink to="/word/ascii/hashy">hashy</RouterLink>
            /
            <RouterLink to="/word/num/hashy">D0̅E7̅</RouterLink>
            /
            <RouterLink to="/word/ascii_num/hashy">D_0E_7</RouterLink>
            /
            <RouterLink to="/word/chinese/hashy">哈希</RouterLink>
        </div>
        <div class="button-container">
            <el-button type="primary" size="large" @click="gotoTypes" v-if="sessionStore.loggedIn">类型列表</el-button>
            <el-button type="primary" size="large" @click="gotoCreateType">创建类型</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/session';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const mainTitle = ref<HTMLElement>();
const mainTitleText = ref<HTMLElement>();

const adjustFontSize = () => {
    let minFontSize = 1;
    let maxFontSize = window.innerWidth;
    let fontSize = (minFontSize + maxFontSize) / 2;

    mainTitleText.value!.style.fontSize = fontSize + 'px';

    while (maxFontSize - minFontSize > 1) {
        if (mainTitleText.value!.offsetWidth < mainTitle.value!.offsetWidth) {
            minFontSize = fontSize;
        } else {
            maxFontSize = fontSize;
        }

        fontSize = (minFontSize + maxFontSize) / 2;
        mainTitleText.value!.style.fontSize = fontSize + 'px';
    }

    if (mainTitleText.value!.offsetWidth < mainTitle.value!.offsetWidth) {
        mainTitleText.value!.style.fontSize = maxFontSize + 'px';
    } else {
        mainTitleText.value!.style.fontSize = minFontSize + 'px';
    }
};

onMounted(() => {
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustFontSize);
});

const sessionStore = useSessionStore();
const router = useRouter();
const gotoCreateType = () => {
    router.push('/create-type');
};

const gotoTypes = () => {
    router.push('/types');
};
</script>

<style lang="scss" scoped>
@use '@/assets/fonts.scss';

.main-title {
    font-family: fonts.$sans-serif;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    margin-top: 3rem;
    text-align: center;
    color: gray;
    a {
        color: var(--el-text-color-primary);
        font-weight: bold;
        text-decoration: none;
    }
}
.main-title-text {
    width: max-content;
}
.button-container {
    margin-top: 3rem;
}
</style>
