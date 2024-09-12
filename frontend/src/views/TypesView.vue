<template>
    <el-table :data="types" class="main-frame">
        <el-table-column label="拉丁">
            <template #default="scope">
                <RouterLink :to="`/type/latin/${scope.row.id}-${scope.row.value}`">
                    {{ typeStr(scope.row.value, Format.LATIN) }}
                </RouterLink>
            </template>
        </el-table-column>
        <el-table-column label="ASCII">
            <template #default="scope">
                <RouterLink :to="`/type/ascii/${scope.row.id}-${scope.row.value}`">
                    {{ typeStr(scope.row.value, Format.ASCII) }}
                </RouterLink>
            </template>
        </el-table-column>
        <el-table-column label="数字">
            <template #default="scope">
                <RouterLink :to="`/type/num/${scope.row.id}-${scope.row.value}`">
                    {{ typeStr(scope.row.value, Format.NUM) }}
                </RouterLink>
            </template>
        </el-table-column>
        <el-table-column label="ASCII数字">
            <template #default="scope">
                <RouterLink :to="`/type/ascii_num/${scope.row.id}-${scope.row.value}`">
                    {{ typeStr(scope.row.value, Format.ASCII_NUM) }}
                </RouterLink>
            </template>
        </el-table-column>
        <el-table-column label="汉字">
            <template #default="scope">
                <RouterLink :to="`/type/chinese/${scope.row.id}-${scope.row.value}`">
                    {{ typeStr(scope.row.value, Format.CHINESE) }}
                </RouterLink>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import type { Unit } from '@/lib/build-word';
import { toFormat, Format } from '@/lib/format';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const types = ref([] as Unit[]);

const fetchTypes = async () => {
    const response = await axios.get('/types');
    types.value = response.data;
};

const typeStr = (type: string, format: Format) => {
    if (type == '') {
        return '■';
    } else {
        return toFormat(type, format);
    }
};

onMounted(fetchTypes);
</script>

<style lang="scss" scoped>
@use '@/assets/colors.scss';
@use '@/assets/fonts.scss';

.main-frame {
    max-width: 50rem;
    margin: 0 auto;
    border-radius: 0.5rem;
    border: 1px solid gray;

    a {
        color: var(--el-text-color-regular);
        text-decoration: none;
    }
}
</style>
