import { BaseInputProps, Tag } from './tag';
declare type Tools<S> = {
    checkbox: (props: BaseInputProps<S>, value: boolean) => [
        'input',
        BaseInputProps<S> & {
            type: 'checkbox';
            checked?: '';
        }
    ];
    radios: (props: BaseInputProps<S>, choices: Record<string | number, string>) => Tag<S>[];
};
export declare const getTools: <S>() => Tools<S>;
export {};
