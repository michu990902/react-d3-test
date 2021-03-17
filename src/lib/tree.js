import * as d3 from 'd3'

const testData = {
    name: "test",
    children: [
        {
            name: "test 2",
            children: [
                { name: "test 4" },
                { name: "test 5" },
                { name: "test 6" },
                { name: "test 7" },
            ],
        },
        {
            name: "test 3",
            children: [
                { name: "test 8" },
                { name: "test 9" },
                { name: "test 10" },
                { name: "test 11" },
            ],
        },
    ],
};

// const diagonal = d3.svg.diagonal()
//     .projection(d => [d.y, d.x]);
// const diagonal = d3.linkHorizontal()
//     .x(d => d.y)
//     .y(d => d.x);
const diagonal = (s, d) => `M ${s.y} ${s.x}
    C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`


const collapse = d  => {
    if(d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}


export const renderTree = wrapperRef => {
    const wrapper = d3.select(wrapperRef.current);
    const bcr = wrapperRef.current.getBoundingClientRect();
    const margin = {top: 20, right: 90, bottom: 30, left: 90},
        width  = bcr.width - margin.left - margin.right,
        height = bcr.height - margin.top - margin.bottom;

    let i = 0, root;
    const duration = 300;
        
    const svg = wrapper
        .append('svg')
        .attr('width', bcr.width)
        .attr('height', bcr.height)
        .call(d3.zoom().on('zoom', (event, d) => {
            svg.attr('transform', event.transform);
        }))
        .append("g");

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const treemap = d3.tree().size([height, width]);

    root = d3.hierarchy(testData, d => d.children);
    root.x0 = height / 2;
    root.y0 = margin.left;
    root.children.forEach(collapse);

    const update = source => {
        // const nodes = tree.nodes(root).reverse(),
        const treeData = treemap(root),
            nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);
      
        // Normalize for fixed-depth.
        nodes.forEach(d => { d.y = d.depth * 180; });
      
        // Update the nodes…
        const node = g.selectAll("g.node")
            .data(nodes, d => d.id || (d.id = ++i));
      
        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .on("click", handleClick);
      
        nodeEnter.append("circle")
            .attr('class', 'node')
            .attr("r", 1e-6)
            .style("fill", d => d._children ? "lightsteelblue" : "#fff");
      
        nodeEnter.append("text")
            .attr("x", d => d.children || d._children ? -13 : 13)
            .attr("dy", ".35em")
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
            .text(d => d.data.name)
            // .style("fill-opacity", 1e-6);
      
        // Transition nodes to their new position.
        const nodeUpdate = nodeEnter.merge(node);
        
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", d => `translate(${d.y},${d.x})`);
      
        nodeUpdate.select("circle.node")
            .attr("r", 10)
            .style("fill", d => d._children ? "lightsteelblue" : "#fff")
            .attr('cursor', 'pointer');
      
        // nodeUpdate.select("text")
        //     .style("fill-opacity", 1);
      
        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .remove();
      
        nodeExit.select("circle")
            .attr("r", 1e-6);
      
        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
      
        // Update the links…
        const link = g.selectAll("path.link")
            .data(links, d => d.id);
      
        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", d => {
                const o = {x: source.x0, y: source.y0};
                return diagonal(o, o);
            });
      
        // Transition links to their new position.
        const linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(duration)
            .attr('d', d => diagonal(d, d.parent));
      
        // Transition exiting nodes to the parent's new position.
        const linkExit = link.exit().transition()
            .duration(duration)
            .attr("d", d => {
                const o = {x: source.x, y: source.y};
                return diagonal(o, o);
            })
            .remove();
      
        // Stash the old positions for transition.
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    
    const handleClick = (ev, d) => {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    update(root);
    return () => {};
}
