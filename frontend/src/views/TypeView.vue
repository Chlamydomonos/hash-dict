<template>
    <div class="main-frame">
        <header class="tree-header">
            <div class="header-left">{{ typeStr }}</div>
            <nav>
                <el-popconfirm
                    v-if="sessionStore.loggedIn && state == State.OK"
                    title="确认删除？"
                    @confirm="deleteThis"
                >
                    <template #reference>
                        <el-button size="small" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
                <FormatSelector v-model="currentFormat" @change="gotoFormat(currentFormat)" />
            </nav>
        </header>
        <div class="main-div">
            <h1 class="word">{{ typeStr }}</h1>
            <div v-if="state == State.LOADING">Loading...</div>
            <div v-else-if="state == State.OK">
                <div>
                    <hr />
                    <h3>释义</h3>
                    <div v-if="!editing" v-html="parsedDescription"></div>
                    <div v-else>
                        <el-input type="textarea" autosize v-model="editingDescription" />
                        <div class="button-box">
                            <el-button type="primary" size="small" @click="submitEdit">确定</el-button>
                            <el-button size="small" @click="editing = false">取消</el-button>
                        </div>
                    </div>
                </div>
                <div>
                    <el-button v-if="sessionStore.loggedIn && !editing" @click="startEdit" size="small">编辑</el-button>
                </div>
            </div>
            <div v-else-if="state == State.ERROR">发生服务器错误。</div>
            <div v-else-if="state == State.FORMAT_ERROR">这不是一个有效的类型。</div>
            <div v-else-if="state == State.NOT_EXIST">
                这个类型不存在。
                <el-button v-if="sessionStore.loggedIn" @click="gotoCreate">创建</el-button>
            </div>
            <ChildrenTable
                v-if="state == State.OK"
                :id="type.id"
                is-type
                :format="currentFormat"
                :base-route="childBaseRoute"
                :type="props.type.value"
                base-word=""
                ref="children"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import ChildrenTable from '@/components/ChildrenTable.vue';
import FormatSelector from '@/components/FormatSelector.vue';
import { type Unit } from '@/lib/build-word';
import { formatName, toFormat, type Format } from '@/lib/format';
import { useSessionStore } from '@/stores/session';
import axios from 'axios';
import kramed from 'kramed';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
    format: Format;
    type: Unit;
}>();

const typeStr = computed(() => {
    if (props.type.value == '') {
        return '■';
    } else {
        return toFormat(props.type.value, props.format);
    }
});

enum State {
    LOADING,
    OK,
    ERROR,
    FORMAT_ERROR,
    NOT_EXIST,
}

const state = ref(State.LOADING);
const description = ref('');
const children = ref<InstanceType<typeof ChildrenTable>>();

const fetchDescription = async () => {
    try {
        state.value = State.LOADING;
        children.value?.startLoad();
        const response = await axios.get(`/query-type/${props.type.id}`);
        const data = response.data;
        if (data.success) {
            state.value = State.OK;
            description.value = data.type.description;
            await children.value?.fetchChildren();
        } else if (data.reason == 'not_exist') {
            state.value = State.NOT_EXIST;
        } else if (data.reason == 'format_error') {
            state.value = State.FORMAT_ERROR;
        } else {
            state.value = State.ERROR;
        }
    } catch (e) {
        state.value = State.ERROR;
    }
};

onMounted(fetchDescription);

const route = useRoute();
watch(() => route.params.categories, fetchDescription);

const currentFormat = ref(props.format);
const router = useRouter();
const gotoFormat = (format: Format) => {
    router.push(`/type/${formatName(format)}/${props.type.id}-${props.type.value}`);
};

const sessionStore = useSessionStore();

const gotoCreate = () => router.push('/create-type');

const deleteThis = async () => {
    try {
        const response = await axios.post('/delete-type', {
            session: sessionStore.session,
            id: props.type.id,
        });
        if (response.data.success) {
            router.push('/');
        } else {
            alert('Unknown error');
        }
    } catch (e) {
        alert('Server error');
    }
};

const childBaseRoute = computed(() => `${props.type.id}-${props.type.value}`);

const editing = ref(false);

const parsedDescription = computed(() => kramed(description.value));
const editingDescription = ref('');

const startEdit = () => {
    editing.value = true;
    editingDescription.value = description.value;
};

const submitEdit = async () => {
    try {
        const response = await axios.post('/edit-type', {
            session: sessionStore.session,
            id: props.type.id,
            description: editingDescription.value,
        });
        const data = response.data;
        if (data.success) {
            description.value = editingDescription.value;
        } else {
            throw Error();
        }
    } catch (e) {
        alert('编辑失败，未知错误');
    }
    editing.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/assets/colors.scss';
@use '@/assets/fonts.scss';

.main-frame {
    max-width: 50rem;
    margin: 0 auto;
    border-radius: 0.5rem;
    border: 1px solid gray;
}

.tree-header {
    display: flex;
    height: 2rem;
    line-height: 2rem;
    justify-content: space-between;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom: 1px solid gray;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    @include colors.frame-background;
}

.category-link {
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    font-family: fonts.$sans-serif;
    color: var(--el-text-color-secondary);
}

.main-category {
    color: var(--el-text-color-primary);
    font-weight: bold;
}

.type-span {
    height: 1.7rem;
    border-radius: 0.1rem;
    @include colors.main-background;
}

.main-div {
    padding: 0.5rem;
}

.word {
    font-size: 4rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-family: fonts.$sans-serif;
}

.button-box {
    margin: 0.5rem 0;
}
</style>
