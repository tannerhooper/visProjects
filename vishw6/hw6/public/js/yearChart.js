
class YearChart {

  /**
   * Constructor for the Year Chart
   *
   * @param electoralVoteChart instance of ElectoralVoteChart
   * @param tileChart instance of TileChart
   * @param votePercentageChart instance of Vote Percentage Chart
   * @param electionInfo instance of ElectionInfo
   * @param electionWinners data corresponding to the winning parties over mutiple election years
   */
  constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

    //Creating YearChart instance
    this.electoralVoteChart = electoralVoteChart;
    this.tileChart = tileChart;
    this.votePercentageChart = votePercentageChart;
    // the data
    this.electionWinners = electionWinners;
    
    // Initializes the svg elements required for this chart
    this.margin = {top: 10, right: 20, bottom: 30, left: 50};
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 100;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

  /**
   * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
   */
  update () {

    //Domain definition for global color scale
    let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    let range = ["#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c", "#063e78" ];

    //ColorScale be used consistently by all the charts
    this.colorScale = d3.scaleQuantile()
      .domain(domain)
      .range(range);

      let domain2 = [300000, 250000, 200000, 150000, 100000, 80000];
      this.YearColorScale = d3.scaleQuantile()
      .domain(domain2)
      .range(range);
    // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    let r = 10;
    let xscale = d3.scaleLinear()
      .domain([0, this.electionWinners.length])
      .range([3*r, this.svgWidth-3*r]);

    this.svg.selectAll('line')
      .data(this.electionWinners)
      .enter()
      .append('line')
      .attr('x1', (d,i) => xscale(i))
      .attr('y1', r+4)
      .attr('x2', (d,i) => i>0 ? xscale(i-1) : xscale(i))
      .attr('y2', r+4)

      .classed('lineChart', true)
    ;

    this.svg.selectAll('circle')
      .data(this.electionWinners)
      .enter()
      .append('circle')
      .attr('cx', (d,i) => xscale(i))
      .attr('cy', r+4)
      .attr('r', r)
      .attr('fill', d => {
        return this.YearColorScale(+d.Total)
      })
      .classed('yearChart', true)
      .attr('id', d => `y${d.YEAR}`)
      .on('click', d => {
        this.selectYear(d3.select(d3.event.target), d);
      })
    .on('mouseover', function (d) {
     d3.select(this).transition()
          .duration('100')
          .attr("r", 15);
    })
     .on('mouseout', function (d) {
         d3.select(this).transition()
              .duration('200')
              .attr("r", 10);
    })
    ;

    this.svg.selectAll('text')
      .data(this.electionWinners)
      .enter()
      .append('text')
      .attr('x', (d,i) => xscale(i))
      .attr('y', r+8)
      .attr('dy', '1.3em')
      .text(d => d.YEAR)
      .classed('yeartext', true)
    ;


  }

  selectYear(selected, d) {
    if (this.selected) {
      this.selected.classed('highlighted', false);
    }
    this.selected = selected;
    this.selected.classed('highlighted', true);

    d3.csv(`data/${d.YEAR}.csv`).then(year => {
      // console.log(year);
      this.electoralVoteChart.update(year);
      this.tileChart.update(year);
      this.votePercentageChart.update(year, this.colorScale);
    });
    
  }

}
