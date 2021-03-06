# ts-waf
## Typescript Web Application Framework

An opinionated library for building web applications with typescript.

    npm install -s Geordi7/ts-waf#main

See `example.ts` for a detailed example

## The Opinions

1. As strictly typed as is reasonable
1. Functional Style with no `class`es
1. A component is defined w.r.t. a State type and a view that renders it
1. Only State Transitions can change the state
1. Whenever the state changes the view is updated

## State Transitions

Two function types represent state transitions: `StateEventTransition<State>` if it will attached to a DOM event, and `StateTransition<State>` otherwise.

`StateTransition<State>` and `StateEventTransition<State>` have the same return type:

```typescript
type StateTransition<State> = (s: State) =>
    | null
    | State
    | Promise<StateTransition<State>>
    | {now: State, later: Promise<StateTransition<State>>}
```

These four return types have specific meanings and are treated in different ways:

1. `null` means no state change
1. `State` means update the state of the application now (and rerender it)
1. `Promise<StateTransition<State>>` means that at some future point a state transition will be ready. When this promise resolves send the state transition function the state at that time so that it can make its changes.
1. `{now: State, later: Promise<StateTransition<State>>}` is a combination of the previous two: update the application state with `now` and use `later` to update the application state when it resolves.

## Recommended Use

Create `model.ts`, define your `State` type and the relevant parameterized types:

```typescript
import * as waf from 'ts-waf';

export type State = {...};
export const init: () => State = () => ({...})

export type View = waf.View<State>;
export type Content = waf.Content<State>;
export type StateTransition = waf.StateTransition<State>;
export type StateEventTransition = waf.StateEventTransition<State>;
export const tag = waf.getTagFactory<State>();
export const tools = waf.getTools<State>();
```

Create `main.ts`, define your main view and mount it:

```typescript
import {init, tag, State, View} from './model';
import {mount} from 'ts-waf';

const {div} = tag;
const view: View<State> = (s) => div({}, 'Hello World');
const stateManager = mount(document.getElementById('root'), view, init());
```

When you create subviews, use the Content type

    export const loginWidget = (s: State): Content => ...


