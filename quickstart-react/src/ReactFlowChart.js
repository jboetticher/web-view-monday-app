import React, { useState, useEffect } from "react";
import ReactFlow, { removeElements, addEdge, Controls, Background, getIncomers, getOutgoers } from 'react-flow-renderer';
import PrettyItemNode from "./nodes/PrettyItemNode.js";
import CustomConnectionLine from "./nodes/CustomConnectionLine.js";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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

	/* CURRENTLY UNABLE TO WORK DUE TO CONSTRAINTS WITH MONDAY API AND SUBITEMS 
	// pass in the item and the board it is in, alogn with all the boardData
	// returns an array that holds all the data about the subitems of an item
	function getSubitems(boardData, board, parentItem){
	  let subitemArray = [];

	  let subitemBoard;
	  boardData.forEach(function(board){
		if (board['name'] == "Subitems of " + board['name']){
		  subitemBoard = board;
		}
	  });

	  let parentSubitemText = parentItem['column_values'][0]['text'];
	  subitemBoard.forEach(function(subitem){
	    
		//if the parent subitem text contains the name of the subitem,
		//then that subitem in the pool is a subitem of our parent
		if (parentSubitemText.indexOf(subitem['name']) > 0){
		  subitemArray.push(subitem);
		}
	  });

	  return subitemArray;
	}*/

	//#region Loading

	function loadPositions(currElements) {
		//Get the saved data
		let savedPositions = props?.nodeHelper.GetPositions();

		//if there was no saved positional data, return
		if (savedPositions == undefined) return;

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

		// create an array of only nodes in the board
		let onlyNodes = [];
		currElements.forEach(function (element) {
			// if the element is not a node, skip it
			if (element['type'] == "prettyNode") {
				onlyNodes.push(element);
			}
		});

		// add in all the saved connections
		savedConnections.forEach(function (connection) {
			let newEdge = setUpNewEdge(connection['source'], connection['target'], connection['sourceHandle'], connection['targetHandle']);

			//console.log('edgeloaded:', newEdge);
			onlyNodes.push(newEdge);
			//currElements.push(newEdge);

		});

		//return currElements;
		return onlyNodes;
	}

	//#endregion

	// provides the nodes passed in with data from getIncomers()
	function updateIncomingNodesData(currElements) {

		// loop through board data
		currElements.forEach(function (element) {

			// if the element is not a node, skip it
			if (element['type'] != "prettyNode") return;

			//element['data']['incomingNodes'] = getIncomers(element, currElements);
			element['data']['outgoingNodes'] = getOutgoers(element, currElements);

		});

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


	var boardElements = [];

	const nodeTypes = {
		prettyNode: PrettyItemNode
	};

	// sets/populates board elements
	if (props?.boardData != null) {
		// the board data and the items that should be highlighted by the filter
		let bdata = props?.boardData;
		let filteredItems = props?.filteredItems;

		// retrieves column data FOR JUST THE FIRST BOARD
		var columnData = bdata[0]['columns'];

		//Goes into each board element in the JSON data array
		//By the end of it, a complete node board will be populated with nodes and default connections
		bdata.forEach(function (board, bIndex) {
			if (board['name'].indexOf("Subitems of") == 1) return;
			var previousNodeId = -1;
			var previousGroupName = "";

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
				if (item['column_values'][0] != "") {
					let subitems = item['column_values'][0]['text'];
				}

				// adds a node
				boardElements.push(
					{
						id: item['id'],
						type: "prettyNode",
						data: {
							title: titleName,
							group: groupName, groupColor: item['group']['color'],
							statusData: statusData,
							columnValues: item['column_values'],
							incomingNodes: [],
							isConnecting: false
						},
						style: {
							padding: "16px",
							borderRadius: "8px", //border: "4px solid", borderColor: item['group']['color'],
							background: nodeBackgroundColor, //item['group']['color']
							boxShadow: "0px 6px 20px -2px rgba(0, 0, 0, 0.2)"
						},
						position: { x: 325 * groupIds[groupName] + bIndex * 1000, y: 300 * groupIndex[groupName] }
					}
				);

				// increments group index
				groupIndex[groupName] += 1;

				// adds an animated connector to the next one if in same group
				if (previousNodeId > 0 && previousGroupName == groupName) {

					boardElements.push(setUpNewEdge(previousNodeId, item['id'], 'b', 't'));
				}

				previousNodeId = item['id'];
				previousGroupName = groupName;
			});
		});

		// updates the positions of all the ndoes from saved data
		boardElements = loadPositions(boardElements);

		// adds in connections from saved data
		boardElements = loadConnections(boardElements);

		// passes nodes info on their incoming connections
		boardElements = updateIncomingNodesData(boardElements);

		console.log("----BOARD DATA LODAED-----");
		//console.log(bdata);
		console.log(boardElements);
		console.log("----------");
	}

	// elements are set to board elements for initial state
	const [elements, setElements] = useState(boardElements);

	// updates elements when props changes
	useEffect(() => {
		setElements(boardElements);
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
			els = updateIncomingNodesData(els);

			console.log(els);
			//console.log('onConnect', params)
			return els;
		});



		// save dat shit
		props?.nodeHelper.AddConnection(params);
	};

	const onConnectStart = (event, { nodeId, handleType }) => {
		console.log('on connect start', { nodeId, handleType });

		//loop through all the current elements and replace target handles with bigger versions
		setElements(function (els) {
			els.forEach(function (elsItem) {
				if (elsItem['type'] != "prettyNode") return;

				elsItem['data']['isConnecting'] = true;
				//console.log(elsItem['data']['isConnecting']);

			});
			return els;
		});
	};

	const onConnectStop = (event) => {
		//console.log('on connect stop', event);

		//loop through all the current elements and replace target handles with bigger versions
		setElements(function (els) {
			els.forEach(function (elsItem) {
				if (elsItem['type'] != "prettyNode") return;

				elsItem['data']['isConnecting'] = false;
				//elsItem['data']['groupColor'] = '#579bfc';
				//elsItem['style']['background'] = '#579bfc';	
				//console.log(elsItem);

			});
			return els;
		});

	};

	const onNodeDragStop = (event, node) => {
		//console.log("onNodeDragStop nodes ", node);
		props?.nodeHelper.AddPosition(node);
	}

	const onElementsRemove = (elementsToRemove) => {
		//setElements((els) => removeElements(elementsToRemove, els));
	}

	//#endregion

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
		console.log("context menu closed");
		setEdgeContextMenuState(initialEdgeContextMenuState);
		setNodeContextMenuState(initialNodeContextMenuState);
	};

	function onNodeDelete() {

		props?.monday.execute("confirm", {
			message: "Delete this item? " +
				"It will be kept in your Recycle Bin for 30 days.",
			confirmButton: "Delete",
			cancelButton: "Cancel",
			excludeCancelButton: false
		}).then((res) => {
			if (res.data["confirm"] === true) {
				// removes the node
				setElements((els) => removeElements([nodeContextMenuState['currNode']], els));
				//console.log("deleted node", nodeContextMenuState['currNode']);

				// close the context menu
				setNodeContextMenuState(initialNodeContextMenuState);

				//Mutates the monday database.
				props?.nodeHelper.DeleteItem(nodeContextMenuState['currNode'].id);

			}
		});
	}

	function onEdgeDelete() {
		// get the edge id from the class name list of the parent
		// i stored the id in the class name 
		// since it's the only place I can store data in the html of a default edge
		let currEdgeId = edgeContextMenuState['currEdge'].parentNode.classList.item(2);

		// loop through the elements until you find an id that matches currEdgeId
		// this way you can remove the actual edge that is in elements (we only have the html DOM element)
		// for loop in order to break out as soon as edge is found
		let i = 0;
		//console.log("DELETING FROM", elements);
		for (i = 0; i < elements.length; i++) {
			if (elements[i]['id'] == currEdgeId) {

				// if id matches, remove the edge from the database
				props?.nodeHelper.RemoveConnection(elements[i]['source'], elements[i]['target'], elements[i]['sourceHandle']);

				// if id matches, remove the edge from elements
				setElements((els) => removeElements([elements[i]], els));
				//console.log("deleted edge", elements[i]);


				break;
			}
		}

		// close the context menu
		setEdgeContextMenuState(initialEdgeContextMenuState);
	}

	var flowChart =
		<ReactFlow
			onContextMenu={onEdgeContextMenu}
			elements={elements}
			nodeTypes={nodeTypes}
			onElementClick={props?.onElementClick}
			onConnect={onConnect}
			onConnectStart={onConnectStart}
			onConnectStop={onConnectStop}
			onNodeDragStop={onNodeDragStop}
			//onElementsRemove={onElementsRemove}
			onNodeContextMenu={onNodeContextMenu}
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

		</ReactFlow>;

	function GoToHighestPriority() {

	}

	return (flowChart);
}

export default ReactFlowChart;