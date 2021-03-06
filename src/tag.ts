// tag.ts
// types and tools for rendering reactive html

import {StateEventTransition} from './core';

export type StateEventWrapper<S> = (h: StateEventTransition<S>) => ((e: Event) => void);

export type Tag<S> =
    | [tag: 'hr', props: BaseProps<S>]
    | [tag: 'br', props: BaseProps<S>]
    | [tag: 'img', props: ImgProps<S>]
    | [tag: 'div', props: BaseProps<S>, ...children: Content<S>[]]
    | [tag: 'li', props: BaseProps<S>, ...children: Content<S>[]]
    | [tag: 'td', props: BaseProps<S>, ...children: Content<S>[]]
    | [tag: 'th', props: BaseProps<S>, ...children: Content<S>[]]
    | [tag: 'a', props: AnchorProps<S>, ...children: Content<S>[]]
    | [tag: 'h1', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'h2', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'h3', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'h4', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'h5', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'h6', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'i', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'b', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'em', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'pre', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'span', props: BaseProps<S>, ...children: TextChildren[]]
    | [tag: 'ol', props: BaseProps<S>, ...children: TTag<S, 'li'>[]]
    | [tag: 'ul', props: BaseProps<S>, ...children: TTag<S, 'li'>[]]
    | [tag: 'table', props: BaseProps<S>, ...children: TTag<S, 'tr'>[]]
    | [tag: 'tr', props: BaseProps<S>, ...children: TTag<S, 'td' | 'th'>[]]
    | [tag: 'form', props: FormProps<S>, ...children: Content<S>[]]
    | [tag: 'label', props: LabelProps<S>, ...children: (string | TTag<S, 'input'>)[]]
    | [tag: 'input', props: InputProps<S>, child?: string]
    | [tag: 'select', props: SelectProps<S>, ...children: TTag<S, 'option'>[]]
    | [tag: 'option', props: SelectProps<S>, child: string]
;

export type TagTypes = Tag<any>[0];
type TTag<S, T extends TagTypes> = Tag<S> & [T, ...unknown[]];
type ITag<S, T extends TagTypes, V extends Tag<S> = Tag<S>> =
    V extends [T, ...any] ? V : never;

export type Content<S> = (string | Tag<S> | Content<S>[]);
export type TextChildren = (string | TextChildren[]);
export type TagChildren<S, T extends TagTypes> = (TTag<S,T> | TagChildren<S,T>[])

type InferStructure<S, TagType extends TagTypes, V extends Tag<S> = Tag<S>> =
    V extends [TagType, ...infer R] ? R : never;

export type BaseProps<S> = {
    id?: string,
    class?: string,
    style?: string,
} & {
    [k in `on${ElementEventNames}`]?: StateEventTransition<S>
}
    
export type FormProps<S> = BaseProps<S> & {
    method?: 'GET' | 'PUT' | 'POST',
    action?: string,
    name?: string,
}

export type ImgProps<S> = BaseProps<S> & {src: string};
export type AnchorProps<S> = BaseProps<S> & {href: string};
export type LabelProps<S> = BaseProps<S> & {for?: string};

export type BaseInputProps<S> = BaseProps<S> & {
    name?: string,
    readonly?: 'readonly', // value will be sent on submit
    disabled?: 'disabled', // value will not be sent on submit
}

export type InputProps<S> = BaseInputProps<S> & ({
    type: 'text' | 'password',
    value: string,
    placeholder?: string,
} | {
    type: 'button' | 'color',
    value: string,
} | {
    type: 'checkbox' | 'radio',
    checked?: '',
} | {
    type: 'range',
    value: number,
    min: number,
    max: number,
    step?: number,
} | {
    type: 'color',
    value: `#${string}`,
} | {
    type: 'datetime-local' | 'date',
    value: string,
});

export type SelectProps<S> = BaseInputProps<S> & {
    value: string | number,
}

type ElementEventNames =
    // general events
    | 'select' // text was selected
    | 'show' // a contextmenu event has reached an element with a contextmenu attribute
    // clipboard
    | 'copy' // the user initiates a copy action
    | 'cut' // the user initiates a cut action
    | 'paste' // the user initiates a paste action
    // input events
    | 'input'   
    | 'change'
    // keyboard events
    | 'keydown'
    | 'keyup'
    // | 'keypress' -- deprecated
    // mouse events
    | 'click'
    | 'auxclick' // an auxiliary button (not the LMB)
    | 'dblclick' // primary button double click
    | 'mousedown' // any button down
    | 'mouseup' // any button up
    | 'mouseenter' // mouse entered the element
    | 'mouseover' // mouse entered the element or one of its children
    | 'mousemove' // mouse moved while over an element
    | 'mouseleave' // mouse left the element
    | 'mouseout' // mouse left the element or one of its children
    | 'wheel' // a mousewheel input was received
    // touch events
    | 'touchstart' // a touchpoint was created over this element
    | 'touchmove' // a touch point moved over this element
    | 'touchend' // a touch point was removed
    | 'touchcancel' // a touchpoint has been disrupted (maybe too many touch points created)
    // focus events
    | 'focusin' // element will get focus
    | 'focus' // element just got focus
    | 'focusout' // element will lose focus
    | 'blur' // element just lost focus
    | 'blur' // element just lost focus
;

export type Renderer<S> = (tag_structure: Tag<S>) => HTMLElement;
export const createRenderer = <S>(sew: StateEventWrapper<S>): Renderer<S> => {
    const renderer = (tag_structure: Tag<S>): HTMLElement =>
    {
        const [tag, props, ...content] = tag_structure;
        const el = document.createElement(tag);
        for (const [attr, val] of Object.entries(props)) {
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                if (attr === 'class') {
                    (val as string).split(' ').map(cl => el.classList.add(cl));
                } else {
                    el.setAttribute(attr, val.toString());
                }
            } else {
                if (attr.slice(0,2) === 'on') {
                    el.addEventListener(attr.slice(2), sew(val));
                } else {
                    console.error(`attribute ignored: ${attr}`, val);
                }
            }
        }
        while (content.length > 0) {
            const item = content.shift();
            if (Array.isArray(item)) {
                if (isTag<S>(item)) {
                    el.appendChild(renderer(item));
                } else {
                    (content as unknown[]).unshift(...(item as unknown[]));
                }
            } else if (typeof item === 'string') {
                el.appendChild(document.createTextNode(item));
            } else {
                console.log('What do we do with this', item);
            }
        }
        return el;
    }
    return renderer;
}

export function isTag<S>(thing: unknown[]): thing is Tag<S> {
    return (typeof thing[0] === 'string' &&
        typeof thing[1] === 'object' &&
        !Array.isArray(thing[1]))
}

type TagFactory<S> = {[T in TagTypes]: (...r: InferStructure<S,T>) => ITag<S, T>};

const theTagFactory: TagFactory<unknown> = new Proxy(
    {} as {[k in TagTypes]: any}, {
        get(t: any, k: TagTypes) {
            if (!(k in t))
                t[k] = (...r: unknown[]) => [k, ...r];
            return t[k];
        }
    }
);

export const getTagFactory = <S>(): TagFactory<S> => (theTagFactory as TagFactory<any>);