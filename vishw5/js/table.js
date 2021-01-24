class Table {
  constructor(data, treeObject) {
    this.tree = treeObject;
    this.ranks = data[2];
    this.symbols = [{color:'#feda4a',title:'The Senate'},{color:'blue',title:'Jedi'},{color:'red',title:'Clone'}];
    console.log(data)
    this.tableElements = data[1].slice();
    this.updateListIndices();
    this.data = data[0];
    this.maxCount = findMax(data[1]);

    this.tableHeaders = ["General", "Count", "Leader Positions"];

    this.cell = {
      "width": 70,
      "height": 20,
      "buffer": 15
    };
    this.bar = {
      "height": 20
    };

    this.goalScale = d3.scaleLinear();
    this.goalsWidth = 97;
    this.gameScale = d3.scaleLinear();
  }

  createTable() {
    this.updateList(0);
    this.goalScale.domain([0, this.maxCount]).range([2, this.goalsWidth - 10]);

    this.gameWidth = 90;
    this.gameScale.domain([0, this.maxCount]).range([0, this.gameWidth]);

    let goalAxis = d3.axisBottom();
    goalAxis.scale(this.goalScale);

    d3.select('#leaderHeader')
      .append('svg')
      .attr('width', this.goalsWidth)
      .attr('height', 20)
      .append('g')
      .call(goalAxis.ticks(5))
      .attr('pointer-events', 'none');

    let legend = d3.select('#leg');
    legend.append('rect')
      .attr('width',125).attr('height',75)
      .attr('class','legend')

    legend.selectAll('path').data(this.symbols)
          .enter()
          .append('path')
          .attr('d',d3.symbol().type(d3.symbolWye).size(100))
          .style('fill',d => d.color)
          .attr("transform",(d,i) => `translate(13,${(i*25)+10})`)
          .style('stroke','black')
          .style('stroke-width',.5)
          ;

    legend.selectAll('text').data(this.symbols)
          .enter().append('text')
          .attr('y',(d,i) => (i*25)+17).attr('x',50)
          .text(d => d.title)
          .style('fill','black').style('stroke-width',1)
          ;
    
    let thisTable = this;
    d3.selectAll('.sortCol')
      .on('click', function () {
        thisTable.collapseList();
        let col = d3.select(this).html();
        let compare;
        if (col == 'General') {
          compare = (a, b) => {
            a.name.localeCompare(b.name)
          };
        } else if (col == 'Troopers') {
          compare = (a, b) => b.c - a.c;
        }
        else if (col == 'Leader Positions') {
          compare = (a, b) => b.n - a.n;
        }
        else if (col == 'Rank') {
          compare = (a, b) => b.r - a.r;
        }
        else if (col == 'Classification') {
          compare = (a,b) => b.cl - a.cl;
        }
        thisTable.tableElements.sort(compare);
        if (thisTable.lastSort == col) {
          thisTable.tableElements = thisTable.tableElements.reverse();
          thisTable.lastSort = null;
        } else {
          thisTable.lastSort = col;
        }
        thisTable.updateTable();
      });
  }

  updateTable() {
    let rows = d3.select('#table').selectAll('.tableRow')
      .data(this.tableElements);
    rows.exit().remove();
    rows = rows
      .enter()
      .append('tr')
      .attr('class', 'tableRow')
      .merge(rows)
      .on('mouseover', d => {
        this.tree.updateTree(d.name);
        updatePicture(d.l, d.g);
        if (d.cl == 0) playSound();
      })
      .on('mouseout', d => {
        this.tree.clearTree();
        if (d.cl == 0) stopSound();
      })
      ;
    
    let headers = rows
      .selectAll('th')
      .data(function (d) {
        return [d];
      });
    headers
      .enter()
      .append('th')
      .merge(headers)
      .attr('class', function (d) {
        return d.name;
      })
      .html(d => d.name)
      .on('mousedown', d => {
        this.collapseList();
        this.updateList(d.i);
      })
      ;

    
    let test = rows
      .selectAll('td')
      .data(function (d) {
        let count = {value:d.c,vis:'num'};
        let groups = {value:d.n,vis:'bar'};
        let rank = {value:d.r,vis:'str'}
        let cl = {value:d.cl,vis:'sym'}
        return [ count, groups, rank, cl ];
      })
      ;
    test = test
      .enter()
      .append('td')
      ;
    
    d3.selectAll('td').filter(function (d) {
      return d != null;
    }).html(d => {
      if (d.vis === 'num') return d.value;
      else if (d.vis === 'str') {
        return this.ranks[d.value.toString()];
      }
    });

    d3.selectAll('td').filter(function (d) {
      return d != null && (d.vis == 'sym');
    }).selectAll('*').remove();

    let syms = d3.selectAll('td').filter(function (d) {
      return d != null && d.vis == 'sym';
    })

    syms
      .append('svg')
      .attr('height',23).attr('width',75)
      .append('path')
      .attr('d',d3.symbol().type(d3.symbolWye).size(75))
      .style('fill',d => this.symbols[d.value].color)
      .style('stroke','black')
      .style('stroke-width',.5)
      .attr("transform", `translate(35,13)`)
      ;

    // remove bar and goal graphs
    d3.selectAll('td').filter(function (d) {
      return d != null && (d.vis == 'bar');
    }).selectAll('*').remove();

    let sscale = d3.scaleLinear()
      .domain([0, 5]).range([.4, .4]);
    let lscale = d3.scaleLinear()
      .domain([0, 5]).range([.8, 0]);

    // win/loss/games bar graph
    let bars = d3.selectAll('td').filter(function (d) {
      return d != null && d.vis == 'bar';
    })
      .append('svg')
      .attr('width', this.gameWidth)
      .attr('height', this.bar.height)
    // .filter(d => d.type == 'aggregate');

    bars
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', d => this.gameScale(d.value))
      .attr('height', this.bar.height)
      .attr('fill', d => '#feda4a')
      // .attr('fill', d => d3.hsl(136, sscale(d.value), lscale(d.value)))
      ;

    bars
      .append('text')
      .text(d => d.value)
      .attr('x', d => this.gameScale(d.value) - 2)
      .attr('y', '1em')
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      // .attr('stroke', 'black')
      ;
  };

  updateListIndices() {
    for (let i = 0; i < this.tableElements.length; ++i) {
      this.tableElements[i].i = i;
    }
  }

  updateList(i) {
    this.updateListIndices();
    this.updateTable();
  }

  collapseList() {
    this.updateListIndices();
  }
}
