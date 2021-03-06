import { Tag } from './tag';
export declare type StateTransition<S> = (s: S) => StateUpdateResult<S>;
export declare type StateUpdateResult<S> = null | S | DeferredUpdate<S> | {
    now: S;
    later: DeferredUpdate<S>;
};
export declare type DeferredUpdate<S> = Promise<(s: S) => StateUpdateResult<S>>;
export declare type StateEventTransition<S> = <E extends Event>(s: S, e: E) => StateUpdateResult<S>;
export declare function mount<State>(el: HTMLElement, vi: View<State>, st: State): StateManager<State>;
export declare type View<State> = (st: State) => Tag<State>;
export declare type StateManager<S> = {
    update: (st: StateTransition<S>) => void;
    postupdate?: (s: S) => void;
};
