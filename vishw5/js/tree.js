class Tree {
  constructor() {
  }
createTree(treeData) { 
    let root = d3.stratify()
      .id(d => d.Id)
      .parentId(d => d.Parent)
      (treeData);

    // Add nodes and links to the tree. 
    let mapped = d3.cluster().size([900, 400])(root);

    // Compute the new tree layout.
    let nodes = mapped.descendants();
    let links = mapped.descendants().slice(1);
    let svg = d3.select('#tree')
      .attr('transform', 'translate(80, 0)')
      ;

    // adds the links between the nodes
    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", d => { d.data.SName })
      .classed("link", true)
      .classed('treelink', true)
      .attr("stroke-width", 2)
      .attr("d", function (d) {
        return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
      });

    let node = svg.selectAll('g.node')
      // .data(nodes, d => d.id || (d.id = ++i));
      .data(nodes);

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", d => {
        return "translate(" + d.y + "," + d.x + ")";
      })
      ;

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr("class", d => {
        let n = d.data.SName.split(' ').join('');
        return n;
      })
      .classed('treenode', true)
      .attr('fill', '#be2714')
      .attr('r', 5)
      .on('mouseover', d => {
        this.updateTree(d.data.SName);
        updatePicture(d.data.Leader, d.data.Name);
      })
      .on('mouseout', d => this.clearTree())
      ;

    // Add labels for the nodes
    nodeEnter.append('title')
      .attr("dy", ".35em")
      .attr("x", -10)
      .attr("text-anchor", "end")
      .text(d => d.data.Name + '\n' + d.data.SName);
  };

  updateTree(row) {
    let n = d3.selectAll('.' + row.split(' ').join(''))
    n.attr('r', 8).attr('fill', 'blue')
      ;
  }

  clearTree() {
    d3.selectAll('.treenode')
      .attr('r', 5)
      .attr('fill', '#be2714')
      ;
    // links
    d3.selectAll('.treelink')
      .attr('stroke-width', 2)
      ;
  }
}
