import React, { useState, useEffect } from "react";
import ReactFlow, { removeElements, addEdge, Controls, Background, getIncomers, getOutgoers } from 'react-flow-renderer';
import PrettyItemNode from "./nodes/PrettyItemNode.js";
import CustomConnectionLine from "./nodes/CustomConnectionLine.js";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AddedNodePanner from "./components/AddedNodePanner.js";

let ReactFlowChart = props => {

	// this is an example of an infinite loop. The same thing happens again and again in the same frame
	// dab exists -> renders -> dab is set -> renders -> dab is set-> ...
	//const [dab, setDab] = useState(5);
	// setDab(4);

	// returns the right color based on the current filter
	function nodeColorOnFilter(filteredData, itemId) {

		if (filteredData == null) return "var(--color-snow_white)";

		var colorString = "var(--color-jarco_gray)";
		Object.entries(filteredData).forEach(function (num, numIndex) {
			//console.log("suggestion for " + itemId + ": " + num[1]);
			if (itemId == num[1]) {
				colorString = "var(--color-snow_white)";
				//console.log("Holy smokes, you did it! they're equal! now colorstring: " + colorString);
			}
		});

		return colorString;
	}

	// determines the color of a node
	var statusColors = null;
	function statusColor(itemColumnValues, boardColumnData) {

		// retrieves the status colors if not done already
		if (statusColors == null) {

			var statusSettings = "pog";
			boardColumnData?.forEach(function (column, cIndex) {
				if (column['title'] == "Status") {
					statusSettings = column['settings_str'];
				}
			});

			statusColors = {};
			var statusInfoJson = JSON.parse(statusSettings);
			Object.entries(statusInfoJson['labels']).forEach(function (labelData) {
				var localID = labelData[0];
				var name = labelData[1];
				statusColors[name] = statusInfoJson['labels_colors'][localID]['color'];
			});
		}

		// gets the status from the column values
		var status = "";
		itemColumnValues?.forEach(function (column, cIndex) {
			if (column['title'] === "Status") {
				status = column['text'];
			}
		});

		// returns the right color css
		if (status in statusColors) return { status: status, color: statusColors[status] };
		else { return { status: "", color: "var(--color-ui_grey)" }; }
	}

	//#region Loading

	function loadPositions(currElements) {
		//Get the saved data
		let savedPositions = props?.nodeHelper.GetPositions();

		//if there was no saved positional data, return
		if (savedPositions == undefined) return currElements;

		//console.log("loading saved node positions of", currElements);

		//loop through current elements in board
		currElements.forEach(function (element) {
			// if the element is not a node, skip it
			if (element['type'] != "prettyNode") return;

			// loop through the saved position data
			savedPositions.forEach(function (posData) {

				//if the saved position data id matches the current element id
				//update the current element's position
				if (posData['id'] == element['id']) {
					element['position']['x'] = posData['position']['x'];
					element['position']['y'] = posData['position']['y'];
				}
			});

		});

		return currElements;
	}

	//returns an array of elements populated with saved connections
	function loadConnections(currElements) {
		//Get the saved data
		let savedConnections = props?.nodeHelper.GetConnections();

		//if there was no saved positional data, return
		if (savedConnections == undefined) return currElements;

		//console.log("loading saved connections of", currElements);

		// add in all the saved connections
		savedConnections.forEach(function (connection) {
			let newEdge = setUpNewEdge(connection['source'], connection['target'], connection['sourceHandle'], connection['targetHandle']);

			//console.log('edgeloaded:', newEdge);
			currElements.push(newEdge);

		});

		//console.log("loaded saved connections and returning", currElements);

		return currElements;
		//return onlyNodes;
	}

	//#endregion


	// provides the nodes passed in with data from getIncomers()
	function updateOutgoingNodesData(currElements) {

		//console.log("updating data of", currElements);

		// loop through board data
		let onlyNodes = [];
		currElements.forEach(function (element) {

			// if the element is not a node, skip it
			if (element['type'] != "prettyNode") return;

			//element['data']['incomingNodes'] = getIncomers(element, currElements);
			element['data']['outgoingNodes'] = getOutgoers(element, currElements);
			onlyNodes.push(element);

		});
		//console.log(document.getElementsByClassName("react-flow__node"));

		//the point of the code below is a workaround for the node not re-rendering on data change
		//loop through the html of the nodes
		let i = 0;
		let htmlNodes = document.getElementsByClassName("react-flow__node");
		for (i = 0; i < htmlNodes.length; i++) {

			//get id of the node from the class name
			let htmlNodeId = htmlNodes[i].classList[2];

			let j = 0;
			for (j = 0; j < onlyNodes.length; j++) {
				//if id of html node matches the json data node, update the outgoingNodes counter
				if (htmlNodeId == onlyNodes[j]['id']) {
					let currLabel = htmlNodes[i].getElementsByClassName("MuiChip-label")[0];
					currLabel.innerText = onlyNodes[j]['data']['outgoingNodes'].length + "";
				}

			}

		}

		return currElements;
	}

	// returns a json edge element with the correct styling and data
	function setUpNewEdge(source, target, sourceHandle, targetHandle) {
		let newEdgeId = 'e' + source + '_' + sourceHandle + '-' + target;
		let newEdge = {
			id: newEdgeId,
			source: source,
			target: target,
			sourceHandle: sourceHandle,
			targetHandle: targetHandle,
			className: newEdgeId,

			type: props?.pathSettings,
			animated: true,

			style: { stroke: '#fff', strokeWidth: '5px' },
			label: "jank",
			labelStyle: { visibility: 'hidden' },
			labelBgBorderRadius: '100%',
			labelBgStyle: {
				height: '24.3594', fill: 'var(--color-mud_black)', stroke: 'white', strokeWidth: '3',
				visibility: (props?.edgeGripSetting ? 'visible' : 'hidden')
			},
		};

		return newEdge;
	}

	// elements are set to board elements for initial state
	const [elements, setElements] = useState([]);

	// zoom pan helper business to pan to the added node
	//const { transform } = useZoomPanHelper();
	//let [nodes, width, height, currTransform] = useStoreState((store) => {
	//    return [store.nodes, store.width, store.height, store.transform];
	//});

	//const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

	//const selectPriority = (priorityNode) => {
	//    setSelectedElements({ id: priorityNode.id, type: priorityNode.type });
	//};

	//returns the number of nodes present in the passed in elements
	function getNodeCount(currElements) {
		let numNodes = 0;
		currElements.forEach(function (element) {
			if (element['type'] == "prettyNode") {
				numNodes++;
			}
		});
		return numNodes;
	}

	//returns the index of the newly added node from a new bdata
	function getAddedNodeIndex(bdata) {
		// checks if the boardData has an extra node added
		if (getNodeCount(elements) == 0) return -1;

		let lastAddedIndex = -1;
		if (getNodeCount(elements) < bdata[0]['items'].length) {
			//lastAddedIndex = bdata[0]['items'].length - 1;
			//console.log("node has been added with index", lastAddedIndex);

			for (var i = 0; i < bdata[0]['items'].length; i++) {
				if (i == bdata[0]['items'].length - 1) {
					lastAddedIndex = i;
					break;
				}
				else if (elements[i]['id'] != bdata[0]['items'][i]['id']) {
					lastAddedIndex = i;
					break;
				}
			}
		}


		return lastAddedIndex;
	}

	// tracks node of the most recently added new node, if any
	const [addedNode, setAddedNode] = useState(null);

	// takes in a boardData and returns an array of nodes and edges from react flow
	function generateElements(bdata) {
		//console.log("GENERATING ELEMENTS FROM", bdata);
		//let bdata = props?.boardData;
		let filteredItems = props?.filteredItems;

		let gendElements = [];

		// retrieves column data FOR JUST THE FIRST BOARD
		var columnData = bdata[0]['columns'];

		// Goes into each board element in the JSON data array
		// By the end of it, a complete node board will be populated with nodes and saved data
		// (the loop only runs once since there is only one board)
		bdata.forEach(function (board, bIndex) {
			// if the board is a subitems board, skip it
			if (board['name'].indexOf("Subitems of") == 1) return;

			// Adds an id number & index to the group ids
			let groupIds = {};
			let groupIndex = {};
			let currentGroupId = 0;
			board['items'].forEach(function (item, itIndex) {
				let groupName = item['group']['title'];
				if (!(groupName in groupIds)) {
					groupIds[groupName] = currentGroupId;
					groupIndex[groupName] = 0;
					currentGroupId++;
				}
			});

			let col = 0;
			let row = 0;
			let colOffset = 0;
			//Goes into each item element in the JSON data
			board['items'].forEach(function (item, itIndex) {

				let groupName = item['group']['title'];
				let titleName = item['name'];
				let nodeBackgroundColor = nodeColorOnFilter(filteredItems, item['id']);

				// gets status data
				let statusData = statusColor(item['column_values'], columnData);

				// gets subitems if the item has subitems
				// item['column_values'][0]['text'] provides a text of the subitems
				// if no subitems, value will be empty string
				//if (item['column_values'][0] != "") {
				//	let subitems = item['column_values'][0]['text'];
				//}

				col = groupIds[groupName] + colOffset;
				row = groupIndex[groupName] % 5;

				// adds a node
				gendElements.push(
					{
						id: item['id'],
						type: "prettyNode",
						className: item['id'],
						data: {
							title: titleName,
							group: groupName, groupColor: item['group']['color'],
							statusData: statusData,
							columnValues: item['column_values'],
							outgoingNodes: [],
							isConnecting: false
						},
						style: {
							padding: "16px",
							borderRadius: "8px",
							background: nodeBackgroundColor,
							boxShadow: "0px 6px 20px -2px rgba(0, 0, 0, 0.2)"
						},
						position: { x: 325 * col + (bIndex * 1000), y: 300 * row }
					}
				);

				// increments group index
				if (row % 5 == 4) {
					colOffset += 1;
				}
				groupIndex[groupName] += 1;
			});
		});

		//console.log("ELEMENTS BEFORE LOADING SAVED DATA", databasedElements);

		// saves what the newly added node is so the panner can pan to it
		let addedNodeIndex = getAddedNodeIndex(bdata);
		//console.log("index of added node", addedNodeIndex);
		if (addedNodeIndex > -1) {
			let addedNode = gendElements[addedNodeIndex];
			//console.log("the added node is", addedNode);
			setAddedNode(addedNode);
			//LerpToNode(addedNode, transform, 200, 200, transform);
		}


		// updates the positions of all the ndoes from saved data
		gendElements = loadPositions(gendElements);

		// adds in connections from saved data
		gendElements = loadConnections(gendElements);

		// passes nodes info on their incoming connections
		gendElements = updateOutgoingNodesData(gendElements);

		//console.log("----BOARD DATA LOADED-----");
		//console.log(bdata);
		//console.log(databasedElements);
		//console.log("----------");

		//console.log("GENERATED ELEMENTS", gendElements);
		return gendElements;
	}


	const nodeTypes = {
		prettyNode: PrettyItemNode
	};


	//const [databasedBoardData, setDatabasedBoardData] = useState(props?.boardData);

	function getDatabasedElements() {
		// sets/populates board elements
		if (props?.boardData != null) {
			return generateElements(props?.boardData);
		}

		return [];
	}

	// updates elements when props changes
	useEffect(() => {
		//console.log("current props", props);
		setElements(getDatabasedElements());
	}, [props]);

	// background settings
	var background = <div></div>;
	if (props?.backgroundSettings !== "none" && props?.backgroundSettings !== null) {
		background =
			<Background
				variant={props?.backgroundSettings}
				gap={32}
				size={2}
			/>;
	}

	//#region ReactFlow Callbacks

	const onConnect = (params) => {
		setElements(function (els) {
			if (els !== null) {
				els = addEdge(setUpNewEdge(params.source, params.target, params.sourceHandle, params.targetHandle), els);
			}

			// update internal node data with new incoming connections
			els = updateOutgoingNodesData(els);

			//console.log(els);
			//console.log('connected', params, 'in', els);
			return els;
		});

		// save dat shit
		props?.nodeHelper.AddConnection(params);
	};


	const onNodeDragStop = (event, node) => {
		//console.log("onNodeDragStop nodes ", node);
		props?.nodeHelper.AddPosition(node);
		setElements(function (els) {
			els = loadPositions(els);
			return els;
		});
	}

	const onSelectionDragStop = (event, nodes) => {
		//nodes.forEach(function(node){
		//	props?.nodeHelper.AddPosition(node);
		//});
		//console.log("SELECTION MOVED", nodes);

		props?.nodeHelper.AddPositions(nodes);

		setElements(function (els) {
			els = loadPositions(els);
			return els;
		});
	}

	//const onElementsRemove = (elementsToRemove) => {
	//setElements((els) => removeElements(elementsToRemove, els));
	//}

	//#endregion

	//#region Menu Callbacks

	// context menu handling
	const initialEdgeContextMenuState = {
		currEdge: null,
		mouseX: null,
		mouseY: null,
	};

	const initialNodeContextMenuState = {
		currNode: null,
		mouseX: null,
		mouseY: null,
	};

	const [edgeContextMenuState, setEdgeContextMenuState] = React.useState(initialEdgeContextMenuState);
	const [nodeContextMenuState, setNodeContextMenuState] = React.useState(initialNodeContextMenuState);

	// fired when context menu opened on an edge
	// called from onContextMenu html tag on the pane
	const onEdgeContextMenu = (event) => {
		// prevent default context menu from firing
		event.preventDefault();

		//console.log(event.target);
		//console.log(event.target.parentNode.parentNode.firstChild);

		// if right clicked on an edge, activate edge menu
		if (event.target.className['baseVal'] == "react-flow__edge-path") {
			setEdgeContextMenuState({
				// this currEdge is the path element
				currEdge: event.target,
				mouseX: event.clientX - 2,
				mouseY: event.clientY - 4,
			});
		}
		// if right clicked on an edge label, activate edge menu
		else if (event.target.className['baseVal'] == "react-flow__edge-textbg") {
			setEdgeContextMenuState({
				// this currEdge is the path element label is on
				currEdge: event.target.parentNode.parentNode.firstChild,
				mouseX: event.clientX - 2,
				mouseY: event.clientY - 4,
			});
		}

	};

	// fired when context menu opened on a node
	// callback from ReactFlow
	const onNodeContextMenu = (event, node) => {
		// prevent default context menu from firing
		event.preventDefault();

		// display context menu on the right-clicked node
		setNodeContextMenuState({
			currNode: node,
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
	}

	// close the context menu when clicked away
	const defaultClose = () => {
		//console.log("context menu closed");
		setEdgeContextMenuState(initialEdgeContextMenuState);
		setNodeContextMenuState(initialNodeContextMenuState);
	};

	// called by the node context menu
	function onNodeDelete() {

		var toDelete = [];
		props?.monday.execute("confirm", {
			message: "Delete this item? " +
				"It will be kept in your Recycle Bin for 30 days.",
			confirmButton: "Delete",
			cancelButton: "Cancel",
			excludeCancelButton: false
		}).then((res) => {
			if (res.data["confirm"] === true) {

				// the node we are deleting (stored in an array of size 1)
				let nodeToDelete = [nodeContextMenuState['currNode']];

				// array to hold edges to be deleted
				let edgesToDelete = [];

				//let toDelete = [nodeContextMenuState['currNode']];
				elements.forEach(function (element) {
					// if the element is an edge
					if (element['type'] != 'prettyNode') {

						// add to toDelete if it is connected to currNode
						if (nodeToDelete[0]['id'] == element['source'] ||
							nodeToDelete[0]['id'] == element['target']) {
							edgesToDelete.push(element);

						}

					}
				});

				toDelete = edgesToDelete.concat(nodeToDelete);

				// close the context menu
				setNodeContextMenuState(initialNodeContextMenuState);

				// updates database to remove the connections
				props?.nodeHelper.RemoveConnections(edgesToDelete);

				//Mutates the monday database. (deletes the node)
				props?.nodeHelper.DeleteItem(nodeContextMenuState['currNode'].id, props?.boardDataQuery);

				//console.log("deleted node", nodeContextMenuState['currNode']);
			}
		}).then((res) => {
			// removes the node and attached edges
			/*setElements(function (els) {
				//console.log("DELETING NODES AND EDGES", edgesToDelete.concat(nodeToDelete));
				// concat the two arrays into a single array for deletion
				return removeElements(toDelete, els);
			});*/
		});
	}

	// called by the edge context menu
	function onEdgeDelete() {
		// get the edge id from the class name list of the parent
		// i stored the id in the class name 
		// since it's the only place I can store data in the html of a default edge
		let currEdgeId = edgeContextMenuState['currEdge'].parentNode.classList.item(2);

		// loop through the elements until you find an id that matches currEdgeId
		// this way you can remove the actual edge that is in elements (we only have the html DOM element)
		// for loop in order to break out as soon as edge is found
		//console.log("DELETING FROM", elements);
		for (var i = 0; i < elements.length; i++) {
			if (elements[i]['id'] == currEdgeId) {

				// if id matches, remove the edge from the database
				props?.nodeHelper.RemoveConnection(elements[i]['source'], elements[i]['target'], elements[i]['sourceHandle']);

				// if id matches, remove the edge from elements
				// also update data
				setElements(function (els) {
					els = removeElements([elements[i]], els);
					els = updateOutgoingNodesData(els);
					return els;
				});
				//console.log("deleted edge", elements[i]);

				break;
			}
		}

		// close the context menu
		setEdgeContextMenuState(initialEdgeContextMenuState);
	}

	//#endregion

	//#region UI Callbacks

	// subscribes to the go to highest priority event
	/*
	useEffect(() => {
		console.log("the event changed");
		//setElements(boardElements);
	}, [props?.findPriorityEvent]);
	*/

	function GoToHighestPriority(event, element) {
		//console.log(flowChartObj);
		var flowChartObj = flowChart.toObject();
		flowChart.setTransform({ x: 100, y: 100, zoom: flowChartObj.zoom });
	}

	//#endregion

	var flowChart =
		<ReactFlow
			elements={elements}
			nodeTypes={nodeTypes}

			onElementClick={props?.onElementClick}
			onConnect={onConnect}
			onNodeDragStop={onNodeDragStop}
			//onElementsRemove={onElementsRemove}
			onNodeContextMenu={onNodeContextMenu}
			onContextMenu={onEdgeContextMenu}
			//onSelectionDragStop={onSelectionDragStop}
			multiSelectionKeyCode={0}

			connectionLineComponent={CustomConnectionLine}
		>
			<Controls />
			{background}

			<Menu
				keepMounted
				open={edgeContextMenuState.mouseY !== null}
				onClose={defaultClose}
				anchorReference="anchorPosition"
				anchorPosition={
					edgeContextMenuState.mouseY !== null && edgeContextMenuState.mouseX !== null
						? { top: edgeContextMenuState.mouseY, left: edgeContextMenuState.mouseX }
						: undefined
				}
			>
				<MenuItem onClick={onEdgeDelete}>Delete Connection</MenuItem>
			</Menu>

			<Menu
				keepMounted
				open={nodeContextMenuState.mouseY !== null}
				onClose={defaultClose}
				anchorReference="anchorPosition"
				anchorPosition={
					nodeContextMenuState.mouseY !== null && nodeContextMenuState.mouseX !== null
						? { top: nodeContextMenuState.mouseY, left: nodeContextMenuState.mouseX }
						: undefined
				}
			>
				<MenuItem onClick={onNodeDelete}>Delete Node</MenuItem>
			</Menu>

			<AddedNodePanner addedNode={addedNode} />
		</ReactFlow>;

	return (flowChart);
}

export default ReactFlowChart;