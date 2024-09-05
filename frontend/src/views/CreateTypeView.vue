<template>
    <h1>创建类型</h1>
    <div class="main-frame">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
            <el-form-item label="尾辅音" prop="end">
                <el-input v-model="form.end" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input type="textarea" v-model="form.description" />
            </el-form-item>
        </el-form>
        <div class="submit">
            <el-button type="primary" @click="handleSubmit">创建</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useSessionStore } from '@/stores/session';
import axios from 'axios';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const form = reactive({
    end: '',
    description: '',
});

const formRef = ref<FormInstance>();

const rules: FormRules = {
    end: [{ pattern: /^(b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)$/, message: '必须为辅音或空', trigger: 'blur' }],
    description: [{ required: true, min: 1, max: 65536, message: '1 - 65536 个字符', trigger: 'blur' }],
};

const sessionStore = useSessionStore();
const router = useRouter();

const handleSubmit = () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            if (!sessionStore.loggedIn) {
                alert('未登录');
                return;
            }
            try {
                const response = await axios.post('/create-type', {
                    session: sessionStore.session,
                    end: form.end,
                    description: form.description,
                });
                const id = response.data.id;
                if (id === null || id === undefined) {
                    alert('Unknown error');
                } else if (id == -1) {
                    alert('已存在');
                } else {
                    router.push(`/type/ascii/${id}-${form.end}`);
                }
            } catch (e) {
                alert('Server error');
            }
        } else {
            alert('格式错误');
        }
    });
};
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: 50rem;
    margin: 0 auto;
    border-radius: 0.5rem;
    border: 1px solid gray;
    padding: 0.25rem;
}

.submit {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>
