function processXMLNode (node, nodeName) {
    const children = [];
    const attributes = {};

    Object.keys(node).forEach(key => {
        if (key.startsWith('@_')) {
            attributes[key] = node[key];
        } else {
            children.push({ key, values: node[key] });
        }
    });
    return { key: nodeName, values: children, attributes: attributes };
}

function attributeToString(key, value) {
    key = key.slice(2)
    if (typeof value === 'number') {
        return `${key}=${value}`
    }
    return `${key}="${value}"`
}

export { processXMLNode, attributeToString };
