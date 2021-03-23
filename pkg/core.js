import morphdom from 'morphdom';
import { createRenderer } from './tag';
export function mount(el, vi, st) {
    const sm = initPrivateStateManager(st);
    const root = sm.renderer(vi(sm.state));
    el.prepend(root);
    (async () => {
        while (true) {
            const state = await new Promise(r => { sm.trigger = r; });
            console.log(JSON.parse(JSON.stringify(state)));
            const newRoot = sm.renderer(vi(state));
            morphdom(root, newRoot);
            if (sm.publicInterface.postupdate !== undefined) {
                sm.publicInterface.postupdate(state);
            }
        }
    })();
    return sm.publicInterface;
}
const initPrivateStateManager = (start) => {
    let sm = {
        state: start,
        requestedFrame: 0,
        trigger: (s) => { s; },
        renderer: createRenderer((h) => (e) => {
            console.log('event');
            sm.publicInterface.update((s) => h(s, e));
        }),
        publicInterface: {
            update: (st) => {
                const res = st(sm.state);
                if (res == null) {
                }
                else if (res instanceof Promise) {
                    res.then(sm.publicInterface.update);
                }
                else if ('now' in res && 'later' in res) {
                    sm.state = res.now;
                    renderNextFrame(sm);
                    res.later.then(sm.publicInterface.update);
                }
                else {
                    sm.state = res;
                    renderNextFrame(sm);
                }
            }
        }
    };
    return sm;
};
const renderNextFrame = (sm) => {
    if (sm.requestedFrame) {
    }
    else {
        sm.requestedFrame = requestAnimationFrame(() => sm.trigger(sm.state));
    }
};
//# sourceMappingURL=core.js.map