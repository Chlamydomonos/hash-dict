<template>
    <div class="search-bar" :style="{ width, '--el-font-size-base': fontSize }">
        <el-input class="search-bar-input" v-model="input" :style="{ '--el-input-border-radius': fontSize }">
            <template #suffix>
                <el-icon class="icon-button" @click="search"><Search /></el-icon>
            </template>
        </el-input>
    </div>
</template>

<script lang="ts" setup>
import { formatName } from '@/lib/format';
import { testFormat } from '@/lib/format/test';
import router from '@/router';
import { useSessionStore } from '@/stores/session';
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const props = defineProps({
    width: String,
    fontSize: {
        type: String,
        default: '1rem',
    },
});
const input = ref('');

const sessionStore = useSessionStore();

const search = () => {
    if (input.value.length > 0) {
        const format = formatName(testFormat(input.value));
        router.push(`/word/${format}/${input.value}`);
    }
};
</script>

<style lang="scss" scoped>
.search-bar {
    width: 100%;
    display: flex;
    align-self: center;
}

.icon-button:hover {
    color: var(--el-color-primary-light-3);
}

.el-input__inner {
    font-size: var(--search-bar-font-size);
}
</style>
