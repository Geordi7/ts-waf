
import morphdom from 'morphdom';
import { request } from 'node:http';
import { Tag, Renderer, createRenderer } from './tag';

export type StateTransition<S> = (s: S) => StateUpdateResult<S>;
export type StateUpdateResult<S> = null | S | DeferredUpdate<S> | {now: S, later: DeferredUpdate<S>}
export type DeferredUpdate<S> = Promise<(s: S) => StateUpdateResult<S> >

export type StateEventTransition<S> = <E extends Event>(s: S, e: E) => StateUpdateResult<S>

export function mount<State>(el: HTMLElement, vi: View<State>, st: State): StateManager<State> {
    const sm = initPrivateStateManager(st);
    const root = sm.renderer(vi(sm.state));
    el.prepend(root);

    (async () => {
        while (true) {
            const state = await new Promise<State>(r => {sm.trigger = r;});
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

export type View<State> = (st: State) => Tag<State>;

type PrivateStateManager<S> = {
    state: S,
    trigger:  (s: S) => void,
    renderer: Renderer<S>,
    publicInterface: StateManager<S>,
    requestedFrame: number,
}

export type StateManager<S> = {
    update: (st: StateTransition<S>) => void,
    postupdate?: (s: S) => void,
}

const initPrivateStateManager = <S>(start: S): PrivateStateManager<S> => {
    let sm: PrivateStateManager<S> = {
        state: start,
        requestedFrame: 0,
        trigger: (s: S) => {s;},
        renderer: createRenderer(
            (h: StateEventTransition<S>) =>
                (e: Event) => {
                    console.log('event');
                    sm.publicInterface.update((s: S) => h(s,e));
                },
        ),
        publicInterface: {
            update: (st) => {
                const res = st(sm.state);
                if (res == null) {
                } else if (res instanceof Promise) {
                    res.then(sm.publicInterface.update);
                } else if ('now' in res && 'later' in res) {
                    sm.state = res.now;
                    renderNextFrame(sm);
                    res.later.then(sm.publicInterface.update);
                } else {
                    sm.state = res;
                    renderNextFrame(sm);
                }
            }
        }
    };

    return sm;
}

const renderNextFrame = <S>(sm: PrivateStateManager<S>): void => {
    if (sm.requestedFrame) {
    } else {
        sm.requestedFrame = requestAnimationFrame(() => sm.trigger(sm.state));
    }
}
