<template>
    <div class="main-frame">
        <header class="tree-header">
            <div class="header-left">
                <span v-for="(_category, id) in categories">
                    <RouterLink
                        class="category-link"
                        :class="{ 'main-category': id == categories.length - 1 }"
                        :to="buildCategoryRoute(id)"
                    >
                        {{ categoryStr(id) }}
                    </RouterLink>
                    <span v-if="id < categories.length - 1">/</span>
                </span>
                <span class="type-span">
                    <RouterLink
                        class="category-link"
                        :to="`/type/${formatName(props.format)}/${props.type.id}-${props.type.value}`"
                    >
                        {{ typeStr }}
                    </RouterLink>
                </span>
            </div>
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
            <h1 class="word">{{ buildWord(type, categories, format) }}</h1>
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
                    <el-button v-if="sessionStore.loggedIn && !editing" @click="startEdit">编辑</el-button>
                </div>
            </div>
            <div v-else-if="state == State.ERROR">发生服务器错误。</div>
            <div v-else-if="state == State.FORMAT_ERROR">这不是一个有效的词语。</div>
            <div v-else-if="state == State.NOT_EXIST">
                这个词语不存在。
                <el-button v-if="sessionStore.loggedIn">创建</el-button>
            </div>
            <ChildrenTable
                :id="categories[categories.length - 1].id"
                :format="currentFormat"
                :base-route="childBaseRoute"
                :type="props.type.value"
                :base-word="childBaseWord"
                ref="children"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import ChildrenTable from '@/components/ChildrenTable.vue';
import FormatSelector from '@/components/FormatSelector.vue';
import { buildWord, type Unit } from '@/lib/build-word';
import { formatName, toFormat, type Format } from '@/lib/format';
import { useSessionStore } from '@/stores/session';
import axios from 'axios';
import kramed from 'kramed';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
    format: Format;
    type: Unit;
    categories: Unit[];
}>();

const typeStr = computed(() => {
    if (props.type.value == '') {
        return '■';
    } else {
        return toFormat(props.type.value, props.format);
    }
});
const categoryStr = (id: number) => toFormat(props.categories[id].value, props.format);

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
        children.value?.startLoad();
        const response = await axios.get(`/query-category/${props.categories[props.categories.length - 1].id}`);
        const data = response.data;
        if (data.success) {
            state.value = State.OK;
            description.value = data.category.description;
            await children.value?.fetchChildren();
        } else {
            if (data.reason == 'format_error') {
                state.value = State.FORMAT_ERROR;
            } else if (data.reason == 'not_exist') {
                state.value = State.NOT_EXIST;
            } else {
                state.value = State.ERROR;
            }
        }
    } catch (e) {
        state.value = State.ERROR;
    }
};

const buildCategoryRoute = (id: number, format: Format = props.format) => {
    let route = `/dict/${formatName(format)}/${props.type.id}-${props.type.value}`;
    for (let i = 0; i <= id; i++) {
        route += `/${props.categories[i].id}-${props.categories[i].value}`;
    }
    return route;
};

onMounted(fetchDescription);

const route = useRoute();
watch(() => route.params.categories, fetchDescription);

const currentFormat = ref(props.format);
const router = useRouter();
const gotoFormat = (format: Format) => {
    router.push(buildCategoryRoute(props.categories.length - 1, format));
};

const sessionStore = useSessionStore();

const deleteThis = async () => {
    try {
        const response = await axios.post('/delete-category', {
            session: sessionStore.session,
            id: props.categories[props.categories.length - 1].id,
        });
        if (response.data.success) {
            if (props.categories.length == 1) {
                router.push(`/type/${formatName(props.format)}/${props.type.id}-${props.type.value}`);
            } else {
                router.push(buildCategoryRoute(props.categories.length - 2, props.format));
            }
        } else {
            alert('Unknown error');
        }
    } catch (e) {
        alert('Server error');
    }
};

const childBaseRoute = computed(() => {
    let route = `${props.type.id}-${props.type.value}`;
    for (const category of props.categories) {
        route += `/${category.id}-${category.value}`;
    }
    return route;
});

const childBaseWord = computed(() => {
    let word = '';
    for (const category of props.categories) {
        word += category.value;
    }
    return word;
});

const editing = ref(false);

const parsedDescription = computed(() => kramed(description.value));
const editingDescription = ref('');

const startEdit = () => {
    editing.value = true;
    editingDescription.value = description.value;
};

const submitEdit = async () => {
    try {
        const response = await axios.post('/edit-category', {
            session: sessionStore.session,
            id: props.categories[props.categories.length - 1].id,
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
</style>
