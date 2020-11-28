import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, DiscreteColorLegend, VerticalBarSeries } from 'react-vis';
import { useZoomPanHelper, useStoreState } from 'react-flow-renderer';

let PriorityGraph = props => {

    let nodeState = useStoreState((store) => {
        return store;
    });

    // gets the groups
    let groupIds = {};
    let groupColors = [];
    let currentGroupId = 0;
    nodeState.nodes.forEach(function (item, itIndex) {
        let groupName = item['data']['group'];
        if (!(groupName in groupIds)) {
            groupIds[groupName] = currentGroupId;
            currentGroupId++;
            groupColors.push(item['data']['groupColor'])
        }
    });

    var colorLegend = [];
    Object.entries(groupIds).forEach((group, groupIndex) => {
        colorLegend.push({
            title: group[0],
            color: groupColors[groupIndex],
        })
    });
    //console.log(colorLegend);

    return (
        <div style={{
            position: "absolute",
            top: "0px", bottom: "0px", right: "0px", left: "0px",
            paddingTop: "45px",
            zIndex: "50",
            background: "var(--color-mud_black)"
        }}
        >
            <div style={{
                display: "flex",
                color: "#fff"
            }}>
                <TotalDependenciesGraph
                    nodeState={nodeState}
                    groupColors={groupColors}
                    colorLegend={colorLegend}
                    groupIds={groupIds} />
                <DependenciesPerNodeGraph
                    nodeState={nodeState}
                    groupColors={groupColors}
                    colorLegend={colorLegend}
                    groupIds={groupIds}
                />
            </div>

        </div>
    );
}

let TotalDependenciesGraph = props => {

    var nodeStates = {};

    let groupTotalDependenciesCount = [];
    Object.entries(props?.groupIds).forEach(function (groupId, gIndex) {
        groupTotalDependenciesCount[groupId[0]] = 0;
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
            color: props?.groupColors[countIndex]
        });
    });

    return (
        <div className="plot-graph">
            <h3 style={{ textAlign: "center" }}>Total Dependencies</h3>
            <XYPlot
                width={500}
                height={500}
            >
                <DiscreteColorLegend items={props?.colorLegend} style={{color: "#fff"}} />
                <HorizontalGridLines />
                <VerticalBarSeries
                    colorType="literal"
                    //colorRange={["#FF0000", "#00FF00", "#0000FF"]}
                    //colorDomain={[0, 1, 2]}
                    data={formattedData}
                />
                <YAxis style={{fill: "#fff"}} />
            </XYPlot>
        </div>
    );
}

let DependenciesPerNodeGraph = props => {

    let groupTotalDependenciesCount = [];
    let groupTotalNumber = [];
    Object.entries(props?.groupIds).forEach(function (groupId, gIndex) {
        groupTotalNumber[groupId[0]] = 0.0;
        groupTotalDependenciesCount[groupId[0]] = 0.0;
    });

    console.log(groupTotalDependenciesCount);

    // adds the total number of outgoing conenctions to each group
    props?.nodeState.nodes.forEach(function (item, itIndex) {
        groupTotalNumber[item['data']['group']] += 1;
        groupTotalDependenciesCount[item['data']['group']] += item['data']['outgoingNodes'].length;
    });

    console.log(groupTotalDependenciesCount);
    console.log(groupTotalNumber);

    // gets average of each connection
    let groupAverage = [];
    Object.entries(groupTotalDependenciesCount).forEach(function (dependencies, dependenciesIndex) {
        console.log("pog", groupTotalNumber[dependencies[0]]);
        groupAverage.push(dependencies[1] / groupTotalNumber[dependencies[0]]);
    });

    console.log("groupAverage", groupAverage);

    // formats it so that it's good for them vertical bar series
    var formattedData = [];
    groupAverage.forEach(function (average, averageIndex) {
        formattedData.push({
            x: averageIndex + 1,
            y: average,
            color: props?.groupColors[averageIndex]
        });
    });

    console.log("formattedData", formattedData);

    return (
        <div className="plot-graph">
            <h3 style={{ textAlign: "center" }}>Dependencies Per Node</h3>
            <XYPlot
                width={500}
                height={500}
            >
                <HorizontalGridLines />
                <VerticalBarSeries
                    colorType="literal"
                    data={formattedData}
                />
                <YAxis style={{fill: "#fff"}} />
            </XYPlot>
        </div>
    );
}

export default PriorityGraph;
export { PriorityGraph };