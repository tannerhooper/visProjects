
/** Class implementing the tileChart. */
class TileChart {

  /**
   * Initializes the svg elements required to lay the tiles
   * and to populate the legend.
   */
  constructor(tooltip){

    let divTiles = d3.select("#tiles").classed("content", true);
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = divTiles.node().getBoundingClientRect();
    this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = this.svgWidth/2;
    let legendHeight = 150;
    //add the svg to the div
    let legend = d3.select("#legend").classed("content",true);

    //creates svg elements within the div
    this.legendSvg = legend.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",legendHeight)
      .attr("transform", "translate(" + this.margin.left + ",0)")
    this.svg = divTiles.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)
      .attr("transform", "translate(" + this.margin.left + ",0)")

    this.tooltip = tooltip;
  };

  /**
   * Creates tiles and tool tip for each state, legend for encoding the color scale information.
   *
   * @param crimeStats election data for the year selected
   */
  update (crimeStats){

    let range = ["#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c", "#063e78"];
    let min = d3.min(crimeStats, d => d.Index);
    let max = d3.max(crimeStats, d => d.Index);
    let typeColorScale = d3.scaleQuantile()
      .domain([min,max])
      .range(range);

    this.maxColumns = d3.max(crimeStats, d => +d.Column) + 1;
    this.maxRows = d3.max(crimeStats, d => +d.Row) + 1;

    let w = this.svgWidth/this.maxColumns;
    let h = this.svgHeight/this.maxRows;

    this.svg.html('');
    this.svg.selectAll('rect')
      .data(crimeStats)
      .enter()
      .append('rect')
      .attr('x', d => w*d.Column)
      .attr('y', d => h*d.Row)
      .attr('width', w)
      .attr('height', h)
      .attr('stroke-width', 1)
      .style('fill', d => {return typeColorScale(+d.Index)})
      .classed('tile', true)
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

    //--------------------------------------------------
    // State abbreviation
    //--------------------------------------------------
    this.svg.selectAll('#tilename')
      .data(crimeStats)
      .enter()
      .append('text')
      .attr('x', d => w*d.Column + w/2)
      .attr('y', d => h*d.Row + h/2)
      .attr('dy', '-.5em')
      .text(d => `${d.Initial}`)
      .attr('text-anchor', 'middle')
      .classed('tilestext', true)
      .attr('id', 'tilename')
      .attr('pointer-events', 'none')
    ;

    //--------------------------------------------------
    // # electoral votes
    //--------------------------------------------------
    this.svg.selectAll('#tileev')
      .data(crimeStats)
      .enter()
      .append('text')
      .attr('x', d => w*d.Column + w/2)
      .attr('y', d => h*d.Row + h/2)
      .attr('dy', '1em')
      .text(d => parseInt(d.Index))
      .attr('text-anchor', 'middle')
      .classed('tilestext', true)
      .attr('id', 'tileev')
      .attr('pointer-events', 'none')
    ;
  };
}
