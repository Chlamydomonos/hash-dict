<template>
    <h1 class="header-title"><RouterLink to="/">Haʃy</RouterLink> {{ value ? '|' : '' }} {{ value }}</h1>
</template>

<script lang="ts" setup>
defineProps<{ value: string }>();
</script>

<style lang="scss" scoped>
@use '@/assets/fonts.scss';
.header-title {
    font-family: fonts.$sans-serif;
    font-size: 1.5rem;
    margin: 0;
    line-height: 3rem;
    a {
        color: var(--el-text-color-primary);
        text-decoration: none;
    }
}
</style>
