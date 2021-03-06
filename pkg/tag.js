// tag.ts
// types and tools for rendering reactive html
export const createRenderer = (sew) => {
    const renderer = (tag_structure) => {
        const [tag, props, ...content] = tag_structure;
        const el = document.createElement(tag);
        for (const [attr, val] of Object.entries(props)) {
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                if (attr === 'class') {
                    val.split(' ').map(cl => el.classList.add(cl));
                }
                else {
                    el.setAttribute(attr, val.toString());
                }
            }
            else {
                if (attr.slice(0, 2) === 'on') {
                    el.addEventListener(attr.slice(2), sew(val));
                }
                else {
                    console.error(`attribute ignored: ${attr}`, val);
                }
            }
        }
        while (content.length > 0) {
            const item = content.shift();
            if (Array.isArray(item)) {
                if (isTag(item)) {
                    el.appendChild(renderer(item));
                }
                else {
                    content.unshift(...item);
                }
            }
            else if (typeof item === 'string') {
                el.appendChild(document.createTextNode(item));
            }
            else {
                console.log('What do we do with this', item);
            }
        }
        return el;
    };
    return renderer;
};
export function isTag(thing) {
    return (typeof thing[0] === 'string' &&
        typeof thing[1] === 'object' &&
        !Array.isArray(thing[1]));
}
const theTagFactory = new Proxy({}, {
    get(t, k) {
        if (!(k in t))
            t[k] = (...r) => [k, ...r];
        return t[k];
    }
});
export const getTagFactory = () => theTagFactory;
//# sourceMappingURL=tag.js.map