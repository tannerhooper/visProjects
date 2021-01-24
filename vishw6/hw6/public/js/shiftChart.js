/** Class implementing the shiftChart. */
class ShiftChart {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor(){
    this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);

  };

  /**
   * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
   *
   * @param selectedTypes data corresponding to the states selected on brush
   */
  update(selectedTypes){
    let html = '<ul>';
    selectedTypes.forEach(d => {
      html += `<li>${d.name}</li>`;
    });
    html += '</ul>';

    d3.select('#stateList').html(html);
  };
}
