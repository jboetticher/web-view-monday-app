import "monday-ui-react-core/dist/Button.css";

function lerp(start, end, time) {
    return start * (1 - time) + end * time;
}

function LerpToNode(priorityNode, currentViewTransform, flowChartWidth, flowChartHeight, zoomPanHelperTransformFunction) {
    let time = 0;

    let [currX, currY] = [currentViewTransform[0], currentViewTransform[1]];
    let x = -priorityNode.position.x + flowChartWidth / 2 - 85;
    let y = -priorityNode.position.y + flowChartHeight / 2 - 63;

    const panner = setInterval(() => {
        var repos = {
            x: lerp(currX, x, time),
            y: lerp(currY, y, time),
            zoom: 1
        };

        zoomPanHelperTransformFunction(repos);
        time += 0.05;

        if (time >= 1) clearInterval(panner);
    }, 10);
}

export { LerpToNode };