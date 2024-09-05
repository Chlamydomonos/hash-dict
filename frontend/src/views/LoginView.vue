<template>
    <div class="login-container">
        <h1 class="login-title">登录</h1>
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            <div class="submit">
                <el-button type="primary" @click="handleSubmit">登录</el-button>
                <RouterLink to="/register" class="alternate-link">注册</RouterLink>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import axios from 'axios';
import { Md5 } from 'ts-md5';
import router from '@/router';
import { useSessionStore } from '@/stores/session';

const form = reactive({
    username: '',
    password: '',
});

const formRef = ref<FormInstance>();

const rules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
        { pattern: /^[A-Za-z0-9_]+$/, message: '由大小写字母，数字和下划线组成', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
        {
            pattern: /^[A-Za-z0-9!@#\$%\^&\*\(\)\-_=\+\{\[\]\}\\\|;:'",\.<>\?\/]+$/,
            message: '由大小写字母，数字和特殊符号组成',
            trigger: 'blur',
        },
    ],
};

const handleSubmit = () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                const response = await axios.post('/login', {
                    name: form.username,
                    passwordHash: Md5.hashStr(form.password),
                });
                if (response.data.success) {
                    useSessionStore().session = response.data.session;
                    alert('登录成功');
                    router.push('/');
                } else if (response.data.reason == 'not_exist') {
                    alert('用户名或密码错误');
                } else {
                    alert('用户未经审核');
                }
            } catch (e) {
                alert('Unknown error');
            }
        } else {
            alert('用户名或密码格式错误');
        }
    });
};
</script>

<style lang="scss" scoped>
@use '@/assets/colors.scss';

.login-container {
    width: 400px;
    padding: 1rem;
    border-radius: 0.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @include colors.frame-background;
    @include colors.frame-shadow(0, 2px, 4px);
}

.login-title {
    margin-top: 0;
    margin-bottom: 1rem;
    text-align: center;
}

.submit {
    width: 100%;
    display: flex;
    justify-content: center;
}

.alternate-link {
    margin-left: 1.5rem;
    align-self: center;
    color: var(--el-text-color-secondary);
}
</style>
