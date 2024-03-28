/*
 * parseDp.js: 데이터 전처리
 */

export function parseDp(data) {
    const { optimizer } = data;
    const nodeMap = new Map();

    const generateId = baseId => {
        let counter = 1;
        let newId = `${baseId} ${counter}`;
        while (nodeMap.has(newId)) {
            counter++;
            newId = `${baseId} ${counter}`;
        }
        return newId;
    };

    const addNode = nodeId => {
        if (!nodeMap.has(nodeId)) {
            nodeMap.set(nodeId, { id: nodeId, parentIds: [], labels: [] });
        }
    };

    const addLabel = (pathNodeId, label) => {
        nodeMap.get(pathNodeId).labels.push(label);
    };

    [...optimizer.base, ...optimizer.dp].forEach(entry => {
        addNode(entry.relid);

        entry.paths?.forEach(path => {
            let pathNodeId = generateId(`${entry.relid} - ${path.node}`);
            addNode(pathNodeId);

            nodeMap.get(entry.relid).parentIds.push(pathNodeId);

            if (path.join) {
                const processJoin = (side, sideType) => {
                    if (side) {
                        addNode(side.relid);
                        nodeMap.get(pathNodeId).parentIds.push(side.relid);
                        if (side.node === 'Material' || side.node === 'Memoize') {
                            addLabel(pathNodeId, `${side.node}`);
                        }
                    }
                };

                processJoin(path.join.outer, 'outer');
                processJoin(path.join.inner, 'inner');
            }
        });
    });

    return Array.from(nodeMap.values()).map(node => ({
        id: node.id,
        parentIds: node.parentIds,
        // only include labels if they exist
        ...(node.labels.length > 0 && { labels: node.labels }),
    }));
}
