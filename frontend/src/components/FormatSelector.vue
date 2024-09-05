<template>
    <el-select v-model="model" @change="onChange" style="width: 7rem" size="small">
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
    </el-select>
</template>

<script lang="ts" setup>
import { Format } from '@/lib/format';

const options = [
    { label: 'ASCII', value: Format.ASCII },
    { label: '拉丁', value: Format.LATIN },
    { label: '数字', value: Format.NUM },
    { label: 'ASCII数字', value: Format.ASCII_NUM },
    { label: '汉字', value: Format.CHINESE },
];

const model = defineModel();

const emit = defineEmits(['change']);

const onChange = () => {
    console.log('onChange');
    emit('change');
};
</script>
