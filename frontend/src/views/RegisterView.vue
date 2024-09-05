<template>
    <div class="register-container">
        <h1 class="register-title">注册</h1>
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
            </el-form-item>
            <div class="submit">
                <el-button type="primary" @click="handleSubmit">注册</el-button>
                <RouterLink to="/login" class="alternate-link">登录</RouterLink>
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

const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
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
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (_rule, value, callback) => {
                if (value !== form.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
};

const handleSubmit = () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                const response = await axios.post('/register', {
                    name: form.username,
                    passwordHash: Md5.hashStr(form.password),
                });
                if (response.data.success) {
                    alert('注册成功，请等待审核');
                    router.push('/login');
                } else if (response.data.reason == 'exists') {
                    alert('用户已存在，注册失败');
                } else if (response.data.reason == 'full') {
                    alert('待审核用户数超过20个，注册失败');
                } else {
                    alert('Unknown error');
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

.register-container {
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

.register-title {
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
