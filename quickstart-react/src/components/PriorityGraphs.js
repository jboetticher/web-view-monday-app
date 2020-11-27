import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, DiscreteColorLegend, VerticalBarSeries } from 'react-vis';
import { useZoomPanHelper, useStoreState } from 'react-flow-renderer';

let TotalDependenciesGraph = props => {

    var nodeStates = {};

    // gets the groups
    let groupIds = {};
    let groupTotalDependenciesCount = {};
    let groupColors = [];
    let currentGroupId = 0;
    props?.nodeState.nodes.forEach(function (item, itIndex) {
        let groupName = item['data']['group'];
        if (!(groupName in groupIds)) {
            groupIds[groupName] = currentGroupId;
            currentGroupId++;
            groupTotalDependenciesCount[groupName] = 0;
            groupColors.push(item['data']['groupColor'])
        }
    });

    // adds the total number of outgoing conenctions to each group
    props?.nodeState.nodes.forEach(function (item, itIndex) {
        groupTotalDependenciesCount[item['data']['group']] += item['data']['outgoingNodes'].length;
    });

    // formats it so that it's good for them vertical bar series
    var formattedData = [];
    Object.entries(groupTotalDependenciesCount).forEach(function (count, countIndex) {
        formattedData.push({
            x: countIndex + 1,
            y: count[1] + 1,
            color: groupColors[countIndex]
        });
    });
    console.log("WHY IS IT GONE", formattedData);


    return (
        <div className="plot-graph">
            <h3 style={{ textAlign: "center" }}>Total Dependencies</h3>
            <XYPlot
                width={500}
                height={500}
            >
                <DiscreteColorLegend items={[
                    {
                        title: "bitch",
                        color: "#FF0000"
                    },
                    {
                        title: "bruh",
                        color: "#00FF00"
                    }
                ]} />
                <HorizontalGridLines />
                <VerticalBarSeries
                    colorType="literal"
                    //colorRange={["#FF0000", "#00FF00", "#0000FF"]}
                    //colorDomain={[0, 1, 2]}
                    data={formattedData}
                />
                <XAxis />
                <YAxis />
            </XYPlot>
        </div>
    );
}

let PriorityGraph = props => {

    let nodeState = useStoreState((store) => {
        return store;
    });

    return (
        <div style={{
            position: "absolute",
            top: "0px", bottom: "0px", right: "0px", left: "0px",
            paddingTop: "80px",
            zIndex: "50",
            background: "var(--color-mud_black)"
        }}
        >
            <div style={{
                display: "flex"
            }}>
                <TotalDependenciesGraph nodeState={nodeState} />
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