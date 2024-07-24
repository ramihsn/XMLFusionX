function processXMLNode (node, nodeName) {
    const children = [];
    const attributes = {};

    Object.keys(node).forEach(key => {
        if (key.startsWith('@_')) {
            attributes[key] = node[key];
        } else if (typeof node[key] === 'object') {
            children.push({ key, values: node[key] });
        } else {
            children.push({ key, values: node[key] });
        }
    });
    return { key: nodeName, values: children, attributes: attributes };
}

export { processXMLNode };
