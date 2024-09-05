<template>
    <div class="main-frame">
        <h1>注册请求</h1>
        <div class="table-container">
            <el-table :data="data" @selection-change="handleSelection">
                <el-table-column type="selection" />
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="name" label="用户名" width="200" />
            </el-table>
            <el-row class="button-container">
                <el-button type="primary" @click="commitUsers">接受</el-button>
                <el-button type="danger" @click="rejectUsers">拒绝</el-button>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useSessionStore } from '@/stores/session';
import axios from 'axios';
import { onMounted, ref } from 'vue';

interface User {
    id: number;
    name: string;
}

const data = ref([] as User[]);

const sessionStore = useSessionStore();
const fetchData = async () => {
    const response = await axios.get(`/invalid-users/${sessionStore.session}`);
    if (response.data.success) {
        data.value = response.data.users;
    }
};
onMounted(fetchData);

const selected = ref([] as User[]);

const handleSelection = (users: User[]) => {
    selected.value = users;
};

const commitUsers = async () => {
    await axios.post('/commit-users', {
        session: sessionStore.session,
        userIds: selected.value.map((user) => user.id),
    });
    await fetchData();
};

const rejectUsers = async () => {
    await axios.post('/reject-users', {
        session: sessionStore.session,
        userIds: selected.value.map((user) => user.id),
    });
    await fetchData();
};
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: 50rem;
    margin: 0 auto;
    border-radius: 0.5rem;
    border: 1px solid gray;
    padding: 0.5rem;
}

.button-container {
    margin-top: 0.5rem;
}
</style>
