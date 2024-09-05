<template>
    <h1>创建词语</h1>
    <div class="main-frame">
        <h3>父词语</h3>
        <div>
            <span class="parent">{{ categories.length > 0 ? buildWord(type, categories, Format.ASCII) : '■' }}</span>
            <el-input v-model="parentToChange" style="width: 10rem" />
            <el-button @click="changeParent">更改</el-button>
        </div>
        <h3>从已有字符串哈希</h3>
        <div>
            <el-input style="width: 10rem" v-model="toHash"></el-input>
            <el-button @click="findHash">哈希</el-button>
        </div>
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" class="main-form">
            <el-form-item label="词语" prop="value">
                <el-input v-model="form.value">
                    <template #prefix>{{ parentWithoutEnd }}</template>
                    <template #suffix v-if="type.value.length > 0">{{ type.value }}</template>
                </el-input>
                <el-button @click="checkHash">检查哈希碰撞</el-button>
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
import { buildWord, type Unit } from '@/lib/build-word';
import { Format } from '@/lib/format';
import { useSessionStore } from '@/stores/session';
import axios from 'axios';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    type: Unit;
    categories: Unit[];
}>();

const parentToChange = ref('');
const router = useRouter();

const changeParent = async () => {
    try {
        const query = await axios.get(`/query-word/${parentToChange.value}`);
        const data = query.data;
        if (data.success) {
            let route = `/create-category/${data.type.id}-${data.type.value}`;
            for (const category of data.categories) {
                route += `/${category.id}-${category.value}`;
            }
            router.push(route);
        } else if (data.reason == 'type_error') {
            alert('词语所在的类别不存在！');
            return false;
        } else if (data.reason == 'parse_error') {
            alert('不是有效的词语！');
            return false;
        } else if (data.reason == 'category_error') {
            alert('词语不存在！');
        }
    } catch (e) {
        alert('Server Error');
    }
};

const parentWithoutEnd = computed(() => {
    let out = '';
    for (const category of props.categories) {
        out += category.value;
    }
    return out;
});

const form = reactive({
    value: '',
    description: '',
});

const formRef = ref<FormInstance>();

const rules: FormRules = {
    value: [
        {
            validator: (_rule, value, callback) => {
                if (props.categories.length > 0) {
                    if (/^((b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)(a|e|ee|i|oo|o|u|y))+$/.test(value)) {
                        callback();
                    } else {
                        callback(new Error('必须是有效的词语'));
                    }
                } else {
                    if (/^(a|e|ee|i|oo|o|u|y)$/.test(value)) {
                        callback();
                    } else if (
                        /^(a|e|ee|i|oo|o|u|y)?((b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)(a|e|ee|i|oo|o|u|y))+$/.test(value)
                    ) {
                        callback();
                    } else {
                        callback(new Error('必须是有效的词语'));
                    }
                }
            },
            trigger: 'blur',
        },
    ],
    description: [{ required: true, min: 1, max: 65536, message: '1 - 65536 个字符', trigger: 'blur' }],
};

const buildWithNew = (newCategory: string) => {
    let word = '';
    for (const category of props.categories) {
        word += category.value;
    }
    return `${word}${newCategory}${props.type.value}`;
};

const handleSubmit = () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            if (!sessionStore.loggedIn) {
                alert('未登录');
                return;
            }
            try {
                const response = await axios.post('/create-category', {
                    session: sessionStore.session,
                    typeId: props.type.id,
                    parentId: props.categories.length == 0 ? null : props.categories[props.categories.length - 1].id,
                    value: form.value,
                    description: form.description,
                });
                const data = response.data;
                if (data.loggedIn === false) {
                    alert('未登录');
                    return;
                }
                if (!data.success) {
                    if (data.reason == 'format_error') {
                        alert('格式错误');
                        return;
                    } else if (data.reason == 'type_error') {
                        alert('类别不存在');
                        return;
                    } else if (data.reason == 'exists') {
                        alert('词语已存在');
                        return;
                    } else if (data.reason == 'parent_error') {
                        alert('父词语不存在');
                        return;
                    } else if (data.reason == 'reserver') {
                        alert('词语违反特殊规则');
                        return;
                    } else if (data.reason == 'prefix') {
                        alert(`以下词语是词语的前缀: ${buildWithNew(data.prefix)}`);
                    } else if (data.reason == 'is_prefix') {
                        alert(`词语是以下词语的前缀: ${buildWithNew(data.prefixed[0].value)}`);
                    } else {
                        alert('Unknown error');
                    }
                } else {
                    let path = `/dict/ascii/${props.type.id}-${props.type.value}`;
                    for (const category of props.categories) {
                        path += `/${category.id}-${category.value}`;
                    }
                    router.push(`${path}/${data.id}-${form.value}`);
                }
            } catch (e) {
                alert('Unknown error');
            }
        } else {
            alert('词语格式错误');
        }
    });
};

const toHash = ref('');

const sessionStore = useSessionStore();

const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }

    const randomNumber = Math.abs(hash) % 1000;

    if (randomNumber < 700) {
        return (Math.abs(hash) % (16384 - 128)) + 128;
    } else {
        return (Math.abs(hash) % (2097152 - 16384)) + 16384;
    }
};

const toBase128 = (num: number) => {
    if (num === 0) {
        return [0];
    }

    const result: number[] = [];
    while (num > 0) {
        result.unshift(num % 128);
        num = Math.floor(num / 128);
    }

    return result;
};

const numVowelTable = ['a', 'e', 'ee', 'i', 'oo', 'o', 'u', 'y'];

const numConsonantTable = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'z', 'c', 's', 'g', 'k', 'h', 'sh', 'r'];

const toCategory = (hash: number[]) => {
    let word = '';
    for (const value of hash) {
        const consonant = numConsonantTable[value >> 3];
        const vowel = numVowelTable[value & 7];
        word += `${consonant}${vowel}`;
    }
    return word;
};

const reservedHashList = [71, 79, 87, 95, 103, 111, 119, 127];

const nextHash = (hash: number[], minDigit: number = hash.length - 1) => {
    const result = [...hash];

    let i = minDigit;
    while (i >= 0) {
        result[i]++;

        if (result[i] === 128) {
            result[i] = 0;
            i--;
        } else if (!reservedHashList.includes(result[i])) {
            break;
        }
    }

    if (i < 0) {
        result.unshift(1);
    }

    for (let j = i + 1; j < result.length; j++) {
        while (reservedHashList.includes(result[j])) {
            result[j]++;
            if (result[j] === 128) {
                result[j] = 0;
                let k = j - 1;
                while (k >= 0) {
                    result[k]++;
                    if (result[k] === 128) {
                        result[k] = 0;
                        k--;
                    } else if (!reservedHashList.includes(result[k])) {
                        break;
                    }
                }
                if (k < 0) {
                    result.unshift(1);
                }
            }
        }
    }
    return result;
};

const findHash = async () => {
    if (!sessionStore.loggedIn) {
        alert('未登录');
        return;
    }
    try {
        const response = await axios.post('/find-hash', {
            session: sessionStore.session,
            typeId: props.type.id,
            parentId: props.categories.length > 0 ? props.categories[props.categories.length - 1].id : null,
            category: toCategory(nextHash(toBase128(hashString(toHash.value)))),
        });
        const data = response.data;
        if (data.loggedIn === false) {
            alert('未登录');
            return;
        }
        if (data.success) {
            form.value = data.value;
        } else {
            alert('哈希域已满');
        }
    } catch (e) {
        alert('Server error');
    }
};

const checkHash = async () => {
    if (!sessionStore.loggedIn) {
        alert('未登录');
        return;
    }
    try {
        const response = await axios.post('/find-hash', {
            session: sessionStore.session,
            typeId: props.type.id,
            parentId: props.categories.length > 0 ? props.categories[props.categories.length - 1].id : null,
            category: form.value,
        });
        const data = response.data;
        if (data.loggedIn === false) {
            alert('未登录');
            return;
        }
        if (data.success) {
            if (form.value != data.value) {
                alert('检测到哈希碰撞，已自动更改');
            } else {
                alert('无哈希碰撞');
            }
            form.value = data.value;
        } else {
            alert('哈希域已满');
        }
    } catch (e) {
        alert('Server error');
    }
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

.submit {
    width: 100%;
    display: flex;
    justify-content: center;
}

.parent {
    margin-right: 1rem;
}

.main-form {
    margin-top: 1rem;
}
</style>
