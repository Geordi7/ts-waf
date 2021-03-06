
// import { StateEventHandler } from './core';
import { BaseInputProps, InputProps, Tag } from './tag';

type Tools<S> = {
    checkbox: (props: BaseInputProps<S>, value: boolean) => [
        'input',
        BaseInputProps<S> & {type: 'checkbox', checked?: ''},
    ];
    radios: (props: BaseInputProps<S>, choices: Record<string | number, string>) => Tag<S>[]
}

const theTools: Tools<unknown> = {
    // create a checkbox
    // it's better to use this than the tag factory (or manually)
    // because the checked state depends on the presence
    // of the property and not the value of the property
    checkbox: (props: BaseInputProps<unknown>, value: boolean) => {
        const actualProps = props as InputProps<unknown> & {type: 'checkbox'};
        actualProps.type = 'checkbox';
        delete actualProps.checked;
        if (value) actualProps.checked = ''
        return ['input', actualProps];
    },
    
    // take a Record<string | number, string> corresponding to values and labels
    // return an array of <input ...props type="radio">
    // it's a good idea to set 'name' in the props so that the controls exclude each other
    radios: (props: BaseInputProps<unknown>, choices: Record<string | number, string>): Tag<unknown>[] => {
        return Object.entries(choices).map(([k,v]) => [
            'input',
            {...props, type: 'radio', value: k},
            v
        ]);
    },
};

export const getTools: <S>() => Tools<S> =
    (() => (theTools as Tools<any>));