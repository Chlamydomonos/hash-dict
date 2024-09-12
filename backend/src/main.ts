import express from 'express';
import { Auth } from './user/auth';
import { queryCategory, queryType, queryWord } from './word/query';
import { createCategory, createType } from './word/create';
import { editCategory, editType } from './word/edit';
import { deleteCategory, deleteType } from './word/delete';
import { findHash } from './hash/find';
import { db } from './db';
import { commitUsers, getInvalidUsers, register, rejectUsers } from './user/register';
import { countWithParent, countWithType, listTypes, listWithParent, listWithType } from './word/list';

const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
    const body = req.body;
    if (typeof body.name != 'string' && typeof body.passwordHash != 'string') {
        res.send({ success: false });
    } else {
        res.send(await register(body.name, body.passwordHash));
    }
});

app.get('/invalid-users/:session', async (req, res) => {
    const { session } = req.params;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    res.send({ success: true, users: await getInvalidUsers() });
});

app.post('/commit-users', async (req, res) => {
    const { session, userIds } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    await commitUsers(userIds);
    res.send({ success: true });
});

app.post('/reject-users', async (req, res) => {
    const { session, userIds } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    await rejectUsers(userIds);
    res.send({ success: true });
});

app.post('/login', async (req, res) => {
    const body = req.body;
    if (typeof body.name != 'string' && typeof body.passwordHash != 'string') {
        res.send({ success: false });
    } else {
        res.send(await Auth.login(body));
    }
});

app.post('/logout', async (req, res) => {
    const { session } = req.body;
    await Auth.logout(session);
    res.sendStatus(200);
});

app.get('/query-word/:word', async (req, res) => {
    const { word } = req.params;
    if (typeof word != 'string') {
        res.send({ success: false, reason: 'parse_error' });
    } else {
        res.send(await queryWord(word));
    }
});

app.get('/query-type/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        res.send({ success: false, reason: 'format_error' });
    } else {
        const type = await queryType(parseInt(id));
        if (type == null) {
            res.send({ success: false, reason: 'not_exist' });
        } else {
            res.send({ success: true, type });
        }
    }
});

app.get('/query-category/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        res.send({ success: false, reason: 'format_error' });
    } else {
        const category = await queryCategory(parseInt(id));
        if (category == null) {
            res.send({ success: false, reason: 'not_exist' });
        } else {
            res.send({ success: true, category });
        }
    }
});

app.post('/create-category', async (req, res) => {
    const { session, typeId, value, description, parentId } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    res.send(await createCategory(typeId, value, description, parentId ?? null));
});

app.post('/create-type', async (req, res) => {
    const { session, end, description } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    res.send({ id: await createType(end, description) });
});

app.post('/edit-category', async (req, res) => {
    const { session, id, description } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    res.send({ success: await editCategory(id, description) });
});

app.post('/edit-type', async (req, res) => {
    const { session, id, description } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    res.send({ success: await editType(id, description) });
});

app.post('/delete-category', async (req, res) => {
    const { session, id } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    try {
        await deleteCategory(id);
        res.send({ success: true });
    } catch (e) {
        res.send({ success: false });
    }
});

app.post('/delete-type', async (req, res) => {
    const { session, id } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    try {
        await deleteType(id);
        res.send({ success: true });
    } catch (e) {
        res.send({ success: false });
    }
});

app.post('/find-hash', async (req, res) => {
    const { session, category, typeId, parentId } = req.body;
    if (!Auth.loggedIn(session)) {
        res.send({ loggedIn: false });
        return;
    }
    res.send(await findHash(category, typeId, parentId ?? null));
});

app.get('/count-word-with-type/:id', async (req, res) => {
    const { id: idStr } = req.params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
        res.send({ success: false });
        return;
    }
    res.send({ success: true, count: await countWithType(id) });
});

app.get('/get-words-with-type/:id/:pageSize/:page', async (req, res) => {
    const { id: idStr, page: pageStr, pageSize: pageSizeStr } = req.params;
    const id = parseInt(idStr);
    const page = parseInt(pageStr);
    const pageSize = parseInt(pageSizeStr);
    if (isNaN(id) || isNaN(page) || isNaN(pageSize)) {
        res.send({ success: false });
        return;
    }
    res.send({ success: true, words: await listWithType(id, page, pageSize) });
});

app.get('/count-word-with-parent/:id', async (req, res) => {
    const { id: idStr } = req.params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
        res.send({ success: false });
        return;
    }
    res.send({ success: true, count: await countWithParent(id) });
});

app.get('/get-words-with-parent/:id/:pageSize/:page', async (req, res) => {
    const { id: idStr, page: pageStr, pageSize: pageSizeStr } = req.params;
    const id = parseInt(idStr);
    const page = parseInt(pageStr);
    const pageSize = parseInt(pageSizeStr);
    if (isNaN(id) || isNaN(page) || isNaN(pageSize)) {
        res.send({ success: false });
        return;
    }
    res.send({ success: true, words: await listWithParent(id, page, pageSize) });
});

app.get('/types', async (_req, res) => {
    res.send(await listTypes());
});

const main = async () => {
    await db.sync();
    const port = parseInt(process.env.PORT!);
    const typeId = await createType('', '名词');
    await createCategory(typeId, 'hashy', '哈希语', null);
    app.listen(port, () => {
        console.log(`Server listening ${port}`);
    });
};

main();
