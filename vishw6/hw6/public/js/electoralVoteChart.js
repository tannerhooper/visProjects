
class ElectoralVoteChart {
  /**
   * Constructor for the ElectoralVoteChart
   *
   * @param shiftChart an instance of the ShiftChart class
   */
  constructor (shiftChart, tooltip){
    this.shiftChart = shiftChart;
    
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //creates svg element within the div
    this.svg = divelectoralVotes.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)
    ;

    this.tooltip = tooltip;

  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (party) {
    if (party == "R"){
      return "republican";
    }
    else if (party == "D"){
      return "democrat";
    }
    else if (party == "I"){
      return "independent";
    }
  }


  /**
   * Creates the stacked bar chart, text content and tool tips for electoral vote chart
   *
   * @param electionResult crime data for the year selected
   */

  update (electionResult){
    //----------------------------------------
    // Sort results and gather statistics
    //----------------------------------------

    let m = (d3.sum(electionResult.map(function(d){ return d.Murder })));
    let ra = (d3.sum(electionResult.map(function(d){ return d.Rape})));
    let ro = (d3.sum(electionResult.map(function(d){ return d.Robbery })));
    let as = (d3.sum(electionResult.map(function(d){ return d.Assault })));
    let b = (d3.sum(electionResult.map(function(d){ return d.Burglary })));
    let l = (d3.sum(electionResult.map(function(d){ return d.Larceny })));
    let au = (d3.sum(electionResult.map(function(d){ return d.Auto })));

    const mapTypes = {'m':'Murder','ra':'Rape','ro':'Robbery','as':'Assault',
                    'b':'Battery','l':'Larceny','au':'Auto'}
    let typesArr = [{m:m},{ra:ra},{ro:ro},{as:as},{b:b},{l:l},{au:au}]
    let types = []
    for (let type in typesArr){
      var tmp = typesArr[type]
      types.push({type:Object.keys(tmp)[0],amt:tmp[Object.keys(tmp)[0]],name:mapTypes[Object.keys(tmp)[0]] })
    }

    types = types.sort((a,b) => {
      return (+a.amt) - (+b.amt)
    });

    let range = ["#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c", "#063e78"];
    let min = d3.min(types, d => d.amt);
    let max = d3.max(types, d => d.amt);
    let typeColorScale = d3.scaleQuantile()
      .domain([min,max])
      .range(range);

    const totalEV = d3.sum(types, d => +d.amt);
    const mEV = d3.sum(types.filter(d => d.types=='m'),
                        d => +d.amt);
    const raEV = d3.sum(types.filter(d => d.types=='ra'),
                        d => +d.amt);
    const roEV = d3.sum(types.filter(d => d.types=='ro'),
                        d => +d.amt);
    const asEV = d3.sum(types.filter(d => d.types=='as'),
                        d => +d.amt);
    const bEV = d3.sum(types.filter(d => d.types=='b'),
                        d => +d.amt);
    const lEV = d3.sum(types.filter(d => d.types=='l'),
                        d => +d.amt);
    const auEV = d3.sum(types.filter(d => d.types=='au'),
                        d => +d.amt);
    const EVarray = [ { pos:0, num:mEV, theclass:'m' },
                      { pos:mEV, num:raEV, theclass:'ra' },
                      { pos:raEV, num:roEV, theclass:'ro' },
                      { pos:roEV, num:asEV, theclass:'au' },
                      { pos:asEV, num:bEV, theclass:'b' },
                      { pos:bEV, num:lEV, theclass:'l' },
                      { pos:-1, num:auEV, theclass:'au' } ];

    //----------------------------------------
    // Add rectangles. Maintain a position to
    // build the stacked bar chart.
    //----------------------------------------

    let rects = this.svg.selectAll('rect')
      .data(types)
    ;

    const barHeight = 30;
    const bary = 50;
    let f = this.svgWidth / totalEV;
    let pos = 0;
    rects
      .enter()
      .append('rect')
      .merge(rects)
      .attr('x', d => {
        let ret = pos;
        pos += f*(+d.amt);
        return ret;
      })
      .attr('y', bary)
      .attr('width', d => {
        return f*(+d.amt);
      })
      .attr('height', barHeight)
      .attr('stroke-width', 1)
      .attr('fill', d => {
        return typeColorScale(+d.amt)
      })
      .classed('electoralVotes', true)
      .on("mouseover", d => {
        this.tooltip.mouseover(d);
      })
      .on("mousemove", () => {
        this.tooltip.mousemove();
      })
      .on("mouseout", () => {
        this.tooltip.mouseout();
      })
    ;

    //----------------------------------------
    // Add a centerline
    //----------------------------------------
    let centerline = this.svg.selectAll('#evcenterline')
      .data([1]);
    centerline
      .enter()
      .append('line')
      .merge(centerline)
      .attr('x1', this.svgWidth/2)
      .attr('y1', bary-5)
      .attr('x2', this.svgWidth/2)
      .attr('y2', bary+barHeight+5)
      .attr('stroke', 'black')
      .attr('id', 'evcenterline')
    ;


    let centertext = this.svg.selectAll('#evcentertext')
      .data([1]);
    centertext
      .enter()
      .append('text')
      .merge(centertext)
      .attr('x', this.svgWidth/2)
      .attr('y', bary-20)
      .text(`Crime type`)
      .attr('text-anchor', 'middle')
      .classed('electoralVoteText', true)
      .attr('id', 'evcentertext')
    ;

    //----------------------------------------
    // Text: # votes won
    //----------------------------------------
    let EVtext = this.svg.selectAll('#evtext')
      .data(EVarray);
    EVtext
      .enter()
      .append('text')
      .merge(EVtext)
      .attr('x', d => d.pos > -1 ? f*d.pos : this.svgWidth)
      .attr('y', bary-20)
      .text(d => d.num > 0 ? d.num : '')
      .attr('class', d=>this.chooseClass(d.theclass))
      .classed('electoralVoteText', true)
      .attr('id', 'evtext')
    ;

    let brush = d3.brushX()
      .extent([[0, bary-10], [this.svgWidth, bary+barHeight+10]])
      .on("end", () => {
        if (d3.event.selection !== null){
          let x0 = d3.event.selection[0];
          let x1 = d3.event.selection[1];
          let rects = this.svg.selectAll('rect.electoralVotes')
          let selected = [];
          rects.each(function(d) {
            let start = +d3.select(this).attr('x');
            let end = start + +d3.select(this).attr('width');
            if ((start >= x0 && start <= x1) ||
                (end >= x0 && end <= x1) ||
                (x0 >= start && x1 <= end)) {
              selected.push(d);
            }
          });
          this.shiftChart.update(selected);
        }
      })
    ;

    this.svg.append("g").attr("class", "brush").call(brush);
  };
}
