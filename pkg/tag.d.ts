import { StateEventTransition } from './core';
export declare type StateEventWrapper<S> = (h: StateEventTransition<S>) => ((e: Event) => void);
export declare type Tag<S> = [tag: 'hr', props: BaseProps<S>] | [tag: 'br', props: BaseProps<S>] | [tag: 'img', props: ImgProps<S>] | [tag: 'div', props: BaseProps<S>, ...children: Content<S>[]] | [tag: 'li', props: BaseProps<S>, ...children: Content<S>[]] | [tag: 'td', props: BaseProps<S>, ...children: Content<S>[]] | [tag: 'th', props: BaseProps<S>, ...children: Content<S>[]] | [tag: 'a', props: AnchorProps<S>, ...children: Content<S>[]] | [tag: 'h1', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'h2', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'h3', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'h4', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'h5', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'h6', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'i', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'b', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'em', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'pre', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'span', props: BaseProps<S>, ...children: TextChildren[]] | [tag: 'ol', props: BaseProps<S>, ...children: TTag<S, 'li'>[]] | [tag: 'ul', props: BaseProps<S>, ...children: TTag<S, 'li'>[]] | [tag: 'table', props: BaseProps<S>, ...children: TTag<S, 'tr'>[]] | [tag: 'tr', props: BaseProps<S>, ...children: TTag<S, 'td' | 'th'>[]] | [tag: 'form', props: FormProps<S>, ...children: Content<S>[]] | [tag: 'label', props: LabelProps<S>, ...children: (string | TTag<S, 'input'>)[]] | [tag: 'input', props: InputProps<S>, child?: string] | [tag: 'select', props: SelectProps<S>, ...children: TTag<S, 'option'>[]] | [tag: 'option', props: SelectProps<S>, child: string];
export declare type TagTypes = Tag<any>[0];
declare type TTag<S, T extends TagTypes> = Tag<S> & [T, ...unknown[]];
declare type ITag<S, T extends TagTypes, V extends Tag<S> = Tag<S>> = V extends [T, ...any] ? V : never;
export declare type Content<S> = (string | Tag<S> | Content<S>[]);
export declare type TextChildren = (string | TextChildren[]);
export declare type TagChildren<S, T extends TagTypes> = (TTag<S, T> | TagChildren<S, T>[]);
declare type InferStructure<S, TagType extends TagTypes, V extends Tag<S> = Tag<S>> = V extends [TagType, ...infer R] ? R : never;
export declare type BaseProps<S> = {
    id?: string;
    class?: string;
    style?: string;
} & {
    [k in `on${ElementEventNames}`]?: StateEventTransition<S>;
};
export declare type FormProps<S> = BaseProps<S> & {
    method?: 'GET' | 'PUT' | 'POST';
    action?: string;
    name?: string;
};
export declare type ImgProps<S> = BaseProps<S> & {
    src: string;
};
export declare type AnchorProps<S> = BaseProps<S> & {
    href: string;
};
export declare type LabelProps<S> = BaseProps<S> & {
    for?: string;
};
export declare type BaseInputProps<S> = BaseProps<S> & {
    name?: string;
    readonly?: 'readonly';
    disabled?: 'disabled';
};
export declare type InputProps<S> = BaseInputProps<S> & ({
    type: 'text' | 'password';
    value: string;
    placeholder?: string;
} | {
    type: 'button' | 'color';
    value: string;
} | {
    type: 'checkbox' | 'radio';
    checked?: '';
} | {
    type: 'range';
    value: number;
    min: number;
    max: number;
    step?: number;
} | {
    type: 'color';
    value: `#${string}`;
} | {
    type: 'datetime-local' | 'date';
    value: string;
});
export declare type SelectProps<S> = BaseInputProps<S> & {
    value: string | number;
};
declare type ElementEventNames = 'select' | 'show' | 'copy' | 'cut' | 'paste' | 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'auxclick' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseover' | 'mousemove' | 'mouseleave' | 'mouseout' | 'wheel' | 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel' | 'focusin' | 'focus' | 'focusout' | 'blur' | 'blur';
export declare type Renderer<S> = (tag_structure: Tag<S>) => HTMLElement;
export declare const createRenderer: <S>(sew: StateEventWrapper<S>) => Renderer<S>;
export declare function isTag<S>(thing: unknown[]): thing is Tag<S>;
declare type TagFactory<S> = {
    [T in TagTypes]: (...r: InferStructure<S, T>) => ITag<S, T>;
};
export declare const getTagFactory: <S>() => TagFactory<S>;
export {};
