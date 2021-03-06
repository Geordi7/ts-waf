const theTools = {
    // create a checkbox
    // it's better to use this than the tag factory (or manually)
    // because the checked state depends on the presence
    // of the property and not the value of the property
    checkbox: (props, value) => {
        const actualProps = props;
        actualProps.type = 'checkbox';
        delete actualProps.checked;
        if (value)
            actualProps.checked = '';
        return ['input', actualProps];
    },
    // take a Record<string | number, string> corresponding to values and labels
    // return an array of <input ...props type="radio">
    // it's a good idea to set 'name' in the props so that the controls exclude each other
    radios: (props, choices) => {
        return Object.entries(choices).map(([k, v]) => [
            'input',
            { ...props, type: 'radio', value: k },
            v
        ]);
    },
};
export const getTools = (() => theTools);
//# sourceMappingURL=tools.js.map