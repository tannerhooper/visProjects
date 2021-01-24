class Tooltip {

  constructor() {
    //----------------------------------------
    // tooltip
    //----------------------------------------
    this.tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      // .attr("opacity", 0)
      .style("background", "#FFFFFF")
      .attr('id', 'tooltip')
      .classed('tooltipDiv', true)
    ;
    // this.tooltip
    //   .append('svg')
    //   .attr('width', 50)
    //   .attr('height', 50)
    //   .append('rect')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', 50)
    //   .attr('height', 50)
    //   .attr('fill', 'red')
    // ;
  };

  chooseClass (party) {
    if (party == "R"){
      return "republican";
    }
    else if (party== "D"){
      return "democrat";
    }
    else if (party == "I"){
      return "independent";
    }
  }

  /**
   * Gets the HTML content for a tool tip.
   */
  tooltip_html(d) {
    let text = "<h2>" + d.State + "</h2>";
    text +=  "Total Crimes: " + d.Index;
    text += "<ul>"
    // Murder
    text += "<li class = murder>" + "Murder:\t\t"+d.Murder+"</li>"
    // Rape
    text += "<li class = rape>" + "Rape:\t\t"+d.Rape+"</li>"
    // Robbery
    text += "<li class = independent>" + "Robbery:\t\t"+d.Robbery+"</li>"
    // Assault
    text += "<li class = independent>" + "Assault:\t\t"+d.Assault+"</li>"
    // Burglary
    text += "<li class = independent>" + "Burglary:\t\t"+d.Burglary+"</li>"
    // Larceny
    text += "<li class = independent>" + "Larceny:\t\t"+d.Larceny+"</li>"
    // Auto
    text += "<li class = independent>" + "Auto:\t\t"+d.Auto+"</li>"
    
    text += "</ul>";
    return text;
  }

  mouseover(d) {
    // this.set(this.tooltip_html(d), true);
    this.tooltip
      .html(this.tooltip_html(d))
      .classed('tooltip-title', true)
    ;
    this.tooltip.style("visibility", "visible");
  }

  mousemove(d) {
    // this.setPosition();
    this.tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px");
  }

  mouseout(d) {
    this.tooltip.style("visibility", "hidden");
  }

  // set(text, visible) {
  //   this.tooltip
  //     .html(text)
  //     .classed('tooltip-title', true)
  //   ;
  //   // this.tooltip
  //   //   .html('')
  //   // ;
  //   // this.tooltip
  //   //   .append('svg')
  //   //   .attr('width', 50)
  //   //   .attr('height', 50)
  //   //   .append('text')
  //   //   .text(text)
  //   //   .attr('y', 0)
  //   //   .attr('width', 50)
  //   //   .attr('height', 50)
  //   //   .attr('fill', 'red')
  //   // ;
  //   this.tooltip.style("visibility", visible?"visible":"hidden");
  // };

  // mouseMove(event) {
  //   this.tooltip.style("top", (d3.event.pageY-10)+"px")
  //     .style("left",(d3.event.pageX+10)+"px");
  // };

};
