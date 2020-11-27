import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalBarSeries } from 'react-vis';

let PriorityGraph = props => {

    return (
        <div style={{
            position: "absolute",
            top: "0px", bottom: "0px", right: "0px", left: "0px",
            paddingTop: "80px"
        }}
        >
            <div style={{
                display: "flex"
            }}>
                <div className="plot-graph">
                    <h3 style={{ textAlign: "center" }}>Total Dependencies</h3>
                    <XYPlot
                        width={500}
                        height={500}>
                        <HorizontalGridLines />
                        <VerticalBarSeries
                            data={[
                                { x: 1, y: 10 },
                                { x: 2, y: 5 },
                                { x: 3, y: 15 }
                            ]} />
                        <XAxis />
                        <YAxis />
                    </XYPlot>
                </div>
                <div className="plot-graph">
                    <h3 style={{ textAlign: "center" }}>Dependencies Per Item</h3>
                    <XYPlot
                        width={500}
                        height={500}>
                        <HorizontalGridLines />
                        <VerticalBarSeries
                            data={[
                                { x: 1, y: 2 },
                                { x: 2, y: 5 },
                                { x: 3, y: 12 }
                            ]} />
                        <XAxis />
                        <YAxis />
                    </XYPlot>
                </div>
            </div>

        </div>
    );
}

export default PriorityGraph;
export { PriorityGraph };