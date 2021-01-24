/** Class implementing the votePercentageChart. */
class VotePercentageChart {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor(tooltip){
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //fetch the svg bounds
    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 200;

    //add the svg to the div
    this.svg = divvotesPercentage.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)

    this.tooltip = tooltip;
  }


  /**
   * Renders the HTML content for tool tip
   *
   * @param tooltip_data information that needs to be populated in the tool tip
   * @return text HTML content for toop tip
   */
  tooltip_render (tooltip_data) {
    let text = "<ul>";
    tooltip_data.result.forEach((row)=>{
      text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
  }

  /**
   * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
   *
   * @param electionResult election data for the year selected
   */
  update (electionResult){

    //----------------------------------------
    // Gather statistics
    //----------------------------------------
    let propSum = (d3.sum(electionResult.map(function(d){ return parseFloat(d.Property.replace(/,/g, ''))})));
    let vioSum = (d3.sum(electionResult.map(function(d){ return parseFloat(d.Violent.replace(/,/g, ''))})));
    let totalSum = propSum + vioSum;
    let Dperc = (propSum)/totalSum;
    let Rperc = vioSum/totalSum;

    let data = [
      { pos : 0, perc : Dperc, anchor : 'start', candidate: 'Property', class: 'purple' },
      { pos : Dperc, perc : Rperc, anchor : 'middle', candidate: 'Violence', class: 'red'},
    ];

    //----------------------------------------
    // Add rectangles. Maintain a position to
    // build the stacked bar chart.
    //----------------------------------------

    const barHeight = 30;
    const bary = 70;
    const f = this.svgWidth / 1;

    this.svg.html('');
    this.svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => f*d.pos)
      .attr('y', bary)
      .attr('width', d => f*d.perc)
      .attr('height', barHeight)
      .attr('stroke-width', 1)
      .style('fill', d => d.class)
      .classed('votesPercentage', true)
    ;

    //----------------------------------------
    // Add a centerline
    //----------------------------------------
    let centerline = this.svg.selectAll('#vcenterline')
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
      .attr('id', 'vcenterline')
    ;

    //----------------------------------------
    // Text: midline
    //----------------------------------------
    let centertext = this.svg.selectAll('#vcentertext')
      .data([1]);
    centertext
      .enter()
      .append('text')
      .merge(centertext)
      .attr('x', this.svgWidth/2)
      .attr('y', bary-20)
//      .text('Crime Category')
      .attr('text-anchor', 'middle')
      .classed('votesPercentageText', true)
      .attr('id', 'vcentertext')
    ;

    //----------------------------------------
    // Text: # crime percentage
    //----------------------------------------
    let Vtext = this.svg.selectAll('#vtext')
      .data(data);
    Vtext
      .enter()
      .append('text')
      .merge(Vtext)
      .attr('x', d => d.pos > -1 ? f*(d.pos+d.perc/2) : this.svgWidth)
      .attr('y', bary-20)
      .text(d => d.perc > 0 ? `${(100*d.perc).toFixed(1)}%` : '')
      .style('text-anchor',  d => d.anchor)
      .attr('class', d=>d.party)
      .classed('electoralVoteText', true)
      .attr('id', 'vtext')
    ;

    //----------------------------------------
    // Text: Crime Category
    //----------------------------------------
    let Ctext = this.svg.selectAll('#ctext')
      .data(data);
    Ctext
      .enter()
      .append('text')
      .merge(Ctext)
      .attr('x', d => d.pos > -1 ? f*(d.pos+d.perc/2) : this.svgWidth)
      .attr('y', bary-50)
      .text(d => d.perc > 0 ? d.candidate : '')
      .style('text-anchor', d => d.anchor)
      .attr('class', d=>d.party)
      .classed('electoralVoteText', true)
      .attr('id', 'ctext')
    ;

  };


}
