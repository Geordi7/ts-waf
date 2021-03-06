import { mount, getTools, getTagFactory } from './index';
const { checkbox } = getTools();
const userdb = {
    'geordi': {
        fname: 'Geordi',
        lname: 'Filiotis',
        pw: '123',
    },
    'lucas': {
        fname: 'Lucas',
        lname: 'Desoto',
        pw: '321',
    },
};
const init = () => ({
    loading: false,
    user: undefined,
    newTask: '',
    tasks: [{
            state: 'open',
            description: 'Get this bloody thing working'
        }],
});
const tag = getTagFactory();
// View
const { div, hr, input, form, label } = tag;
const main = (s) => {
    console.log('view');
    return div({ class: 'root' }, (s.user === undefined) ? login() : [
        `Welcome ${s.user.fname} ${s.user.lname}`,
        hr({}),
        input({ type: 'text', value: s.newTask, oninput: editNewTask }),
        input({ type: 'button', value: 'Do it!', onclick: commitNewTask }),
        hr({}),
        s.tasks.map((task, i) => {
            if (task.state === 'open')
                return div({ class: 'task ' + task.state }, input({ type: 'button', value: '✔',
                    onclick: (s, _) => { s.tasks[i].state = 'done'; return s; }
                }), input({ type: 'button', value: '❌',
                    onclick: (s, _) => { s.tasks[i].state = 'canceled'; return s; }
                }), ' - ', task.description);
            else
                return '';
        }),
        hr({}),
        s.tasks.map((task) => {
            if (task.state !== 'open')
                return div({ class: 'task ' + task.state }, task.description);
            else
                return '';
        }),
    ]);
};
const editNewTask = (s, { target }) => {
    const v = target.value;
    return { ...s, newTask: v };
};
const commitNewTask = (s, _) => {
    s.tasks.push({
        state: 'open',
        description: s.newTask,
    });
    s.newTask = '';
    return s;
};
(async () => {
    while (true) {
        await new Promise(r => setTimeout(r, 5000));
        console.log('saved');
        stateManager.update(s => {
            if (s.user !== undefined) {
                const lst = window.localStorage;
                lst.setItem(s.user.userid, JSON.stringify(s.tasks));
            }
            return null;
        });
    }
})();
const login = () => [
    'Please Log In ',
    hr({}),
    form({}, div({}, label({}, 'Username: ', input({ type: 'text', name: 'userid', value: '' }))), div({}, label({}, 'Password: ', input({ type: 'password', name: 'password', value: '' }))), input({ type: 'button', value: 'Go!', onclick: tryLogin }))
];
const tryLogin = async (_, { target }) => {
    const result = await doLogin(target.form.userid.value, target.form.password.value);
    return s => {
        s.user = result;
        const t = JSON.parse(window.localStorage.getItem(result.userid));
        if (t !== null)
            s.tasks = t;
        return s;
    };
};
async function doLogin(username, password) {
    await new Promise(r => setTimeout(r, 1000));
    if (username in userdb && userdb[username].pw === password)
        return {
            userid: username,
            fname: userdb[username].fname,
            lname: userdb[username].lname,
        };
    else
        return undefined;
}
const stateManager = mount(document.body, main, init());
const u = async function* (s) {
    while (s < 10) {
        await new Promise(r => setTimeout(r, 1000));
        s = yield s;
    }
    return s;
};
const waity = async function* (s) {
    let n = s.length;
    while (n > 1) {
        await new Promise(r => setTimeout(r, 100));
        if (n % 2) {
            n = (3 * n) + 1;
        }
        else {
            n /= 2;
        }
        s = yield n;
        n = s.length;
    }
    return true;
};
(async () => {
    const r1 = waity('well hello there how are you?');
    let x = { value: null };
    while ((x = await r1.next(x.value)) && !x.done) {
        console.log(x.value);
    }
    console.log(r1);
    const r2 = waity('things are kinda great right now');
    for await (const z of r2) {
        console.log(z);
    }
});
//# sourceMappingURL=example.js.map