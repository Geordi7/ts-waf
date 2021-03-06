import {mount, getTools, getTagFactory, StateEventTransition, View, Content} from './index';

const {checkbox} = getTools<State>();

type State = {
    loading: boolean,
    user?: UserInfo,
    newTask: string,
    tasks: {
        description: string,
        state: 'open' | 'done' | 'canceled',
    }[],
}

type UserInfo = {
    userid: string,
    fname: string,
    lname: string,
}

const userdb: Record<string,{fname: string, lname: string, pw: string}> = {
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
}

const init = (): State => ({
    loading: false,
    user: undefined,
    newTask: '',
    tasks: [{
        state: 'open',
        description: 'Get this bloody thing working'
    }],
});

const tag = getTagFactory<State>();

// View
const {div, hr, input, form, label} = tag;

const main: View<State> = (s) => {
    console.log('view')
    return div({class: 'root'},
        (s.user === undefined) ? login() : [
            `Welcome ${s.user.fname} ${s.user.lname}`,
            hr({}),
            input({type: 'text', value: s.newTask, oninput: editNewTask}),
            input({type: 'button', value: 'Do it!', onclick: commitNewTask}),
            hr({}),
            s.tasks.map((task,i) => {
                if (task.state === 'open')
                    return div({class: 'task ' + task.state},
                        input({type: 'button', value: '✔', 
                            onclick: (s,_) => {s.tasks[i].state = 'done'; return s;}
                        }),
                        input({type: 'button', value: '❌',
                            onclick: (s,_) => {s.tasks[i].state = 'canceled'; return s;}
                        }),
                        ' - ',
                        task.description,
                    )
                else return '';
            }),
            hr({}),
            s.tasks.map((task) => {
                if (task.state !== 'open')
                    return div({class: 'task ' + task.state}, task.description);
                else return '';
            }),
        ]
    )
};

const editNewTask: StateEventTransition<State> =
(s, {target}: any) => {
    const v = target.value;
    return {...s, newTask: v};
}

const commitNewTask: StateEventTransition<State> = (s,_) => {
    s.tasks.push({
        state: 'open',
        description: s.newTask,
    });
    s.newTask = '';
    return s;
}

(async ()=>{
    while(true) {
        await new Promise(r => setTimeout(r,5000));
        console.log('saved');
        stateManager.update(s => {
            if (s.user !== undefined) {
                const lst = window.localStorage;

                lst.setItem(s.user.userid, JSON.stringify(s.tasks));
            }
            return null;
        })
    }
})();

const login = (): Content<State> => [
    'Please Log In ',
    hr({}),
    form({},
        div({}, label({}, 'Username: ',
            input({type: 'text', name: 'userid', value: ''}),
        )),
        div({}, label({}, 'Password: ',
            input({type: 'password', name: 'password', value: ''}),
        )),
        input({type: 'button', value: 'Go!', onclick: tryLogin}),
    )
];

const tryLogin: StateEventTransition<State> = async (_, {target}: any) => {
    const result = await doLogin(target.form.userid.value, target.form.password.value)
    return s => {
        s.user = result;
        const t = JSON.parse(window.localStorage.getItem(result.userid));
        if (t !== null)
            s.tasks = t;
        return s;
    }
}

async function doLogin(username: string, password: string): Promise<UserInfo | undefined> {
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

const u = async function*(s: number) {
    while (s < 10) {
        await new Promise(r => setTimeout(r,1000));
        s = yield s;
    }
    return s;
}

const waity = async function*(s: string) {
    let n = s.length;
    while (n > 1) {
        await new Promise(r => setTimeout(r,100));
        if (n % 2) {
            n = (3*n)+1;
        } else {
            n /= 2;
        }
        s = yield n;
        n = s.length;
    }
    return true;
};


(async () => {
    const r1 = waity('well hello there how are you?');
    let x: {value: any, done?: boolean} = {value:null};
    while ((x = await r1.next(x.value)) && !x.done) {
        console.log(x.value);
    }
    console.log(r1);

    const r2 = waity('things are kinda great right now');
    for await (const z of r2) {
        console.log(z);
    }
});
