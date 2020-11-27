(this["webpackJsonpmonday-integration-quickstart-app"]=this["webpackJsonpmonday-integration-quickstart-app"]||[]).push([[0],{119:function(e,t,n){},154:function(e,t,n){"use strict";n.r(t);var o=n(0),i=n.n(o),a=n(5),l=n.n(a),s=(n(97),n(32)),c=n(41),r=n(42),u=n(85),d=n(84),m=(n(98),n(59)),h=n.n(m),g=(n(114),n(7)),p=n(18),f=n(80),v=n.n(f),y=n(81),b=n.n(y),E=n(187),x=n(186),k=Object(o.memo)((function(e){var t=e.data,n=Object(o.useState)(!0),a=Object(p.a)(n,2),l=a[0],s=a[1],c=l?{bottom:"-2px"}:{top:"-2px"},r=l?{top:"-2px"}:{bottom:"-2px"},u=i.a.createElement(x.a,{className:"small-avatar pos-absolute collapse-chip ignore-node-on-click",style:{left:"-10px",top:"-10px"},onClick:function(){s(!l)}},i.a.createElement(b.a,{className:"pos-absolute noClick",style:r}),i.a.createElement(v.a,{className:"pos-absolute noClick",style:c})),d=l?i.a.createElement("div",null):i.a.createElement("div",{style:{maxWidth:"300px"}},i.a.createElement("table",null,i.a.createElement("tbody",null,i.a.createElement("tr",null,i.a.createElement("td",null,"Group"),i.a.createElement("td",{style:{width:"16px"}}),i.a.createElement("td",{className:"centered-td"},null===t||void 0===t?void 0:t.group)),null===t||void 0===t?void 0:t.columnValues.map((function(e,t){switch(e.title){case"Subitems":case"Person":case"Status":return i.a.createElement("tr",{key:t});default:return i.a.createElement("tr",{key:t},i.a.createElement("td",null,e.title),i.a.createElement("td",{style:{width:"16px"}}),i.a.createElement("td",{className:"centered-td"},""===e.text||null===e.text?"- - -":e.text))}}))))),m=i.a.createElement("div",{className:"react-flow__handle-top react-flow__handle",style:{background:"#0071d9",width:"10px",height:"10px",top:"-5px"}}),h=i.a.createElement("div",{className:"react-flow__handle-left react-flow__handle",style:{background:"var(--color-mud_black)",width:"10px",height:"10px",left:"-5px"}}),f=i.a.createElement("div",{className:"react-flow__handle-right react-flow__handle",style:{background:"var(--color-mud_black)",width:"10px",height:"10px",right:"-5px"}}),y=i.a.createElement("div",{className:"react-flow__handle-bottom react-flow__handle",style:{background:"var(--color-mud_black)",width:"10px",height:"10px",bottom:"-5px"}});return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{style:{position:"fixed",background:null===t||void 0===t?void 0:t.groupColor,height:"16px",borderRadius:"8px",top:"0px",left:"0px",right:"0px"}},i.a.createElement("div",{style:{position:"absolute",background:null===t||void 0===t?void 0:t.groupColor,height:"8px",bottom:"0px",left:"0px",right:"0px"}}),u,i.a.createElement(E.a,{size:"medium",label:null===t||void 0===t?void 0:t.outgoingNodes.length,style:{position:"absolute",right:"-8px",top:"-8px",background:null===t||void 0===t?void 0:t.groupColor}})),i.a.createElement(g.c,{type:"target",position:"top",id:"t",style:{background:"#0071d9",width:"30%",height:"20px",borderRadius:"0%",top:"-5px",opacity:"0%"}}),i.a.createElement(g.c,{type:"source",position:"bottom",id:"b",style:{background:"var(--color-mud_black)",width:"30%",height:"20px",borderRadius:"0%",bottom:"-5px",opacity:"0%"}}),i.a.createElement(g.c,{type:"source",position:"right",id:"r",style:{background:"var(--color-mud_black)",width:"20px",height:"30%",borderRadius:"0%",right:"-5px",opacity:"0%"}}),i.a.createElement(g.c,{type:"source",position:"left",id:"l",style:{background:"var(--color-mud_black)",width:"20px",height:"30%",borderRadius:"0%",left:"-5px",opacity:"0%"}}),m,h,f,y,i.a.createElement("div",{style:{maxWidth:"170px"}},i.a.createElement("h4",null,null===t||void 0===t?void 0:t.title)),d,i.a.createElement("div",{style:{textAlign:"center",background:null===t||void 0===t?void 0:t.statusData.color,borderRadius:"4px",padding:"4px",marginTop:"8px"}},""===(null===t||void 0===t?void 0:t.statusData.status)?"Empty":t.statusData.status))})),N=function(){function e(t){Object(c.a)(this,e),this.monday=t,this.QueryConnections(),this.QueryPositions()}return Object(r.a)(e,[{key:"EventHasClass",value:function(e,t){if(null==e.path)return!1;for(var n=Object.entries(e.path[0].classList),o=0;o<n.length;o++)if(n[o][1]===t)return!0;return!1}},{key:"QueryConnections",value:function(){var e=this;this.monday.storage.instance.getItem("connection_objects").then((function(t){console.log(t),null!==t.data.value?(e.connections=JSON.parse(t.data.value),console.log(e.connections)):(e.connections=[],console.log(e.connections))}))}},{key:"GetConnections",value:function(){return this.connections}},{key:"AddConnection",value:function(e){var t=this;if(null!=e){console.log("saving connections ",e);for(var n=-1,o=0;o<this.connections.length;o++)if(this.connections[o].source==e.source&&this.connections[o].target==e.target&&this.connections[o].sourceHandle==e.sourceHandle){n=o;break}n<0?this.connections.push(e):this.connections[o]=e;var i=JSON.stringify(this.connections);this.monday.storage.instance.setItem("connection_objects",i).then((function(e){console.log(e),console.log(i),t.QueryConnections()}))}}},{key:"RemoveConnection",value:function(e,t,n){for(var o=this,i=-1,a=0;a<this.connections.length;a++)if(this.connections[a].source==e&&this.connections[a].target==t&&this.connections[a].sourceHandle==n){i=a,console.log("REMOVING FROM DATABASE",this.connections[a]);break}if(i>=0){console.log("BEFORE REMOVAL:",this.connections),this.connections.splice(a,1),console.log("AFTER REMOVAL:",this.connections);var l=JSON.stringify(this.connections);this.monday.storage.instance.setItem("connection_objects",l).then((function(e){console.log(e),console.log(l),o.QueryConnections()}))}}},{key:"RemoveConnections",value:function(e){for(var t=this,n=0;n<e.length;n++){for(var o=-1,i=0;i<this.connections.length;i++)if(this.connections[i].source==e[n].source&&this.connections[i].target==e[n].target&&this.connections[i].sourceHandle==e[n].sourceHandle){o=i,console.log("REMOVING FROM DATABASE",this.connections[i]);break}o>=0&&(console.log("BEFORE REMOVAL:",this.connections),this.connections.splice(i,1),console.log("AFTER REMOVAL:",this.connections))}var a=JSON.stringify(this.connections);this.monday.storage.instance.setItem("connection_objects",a).then((function(e){console.log(e),console.log(a),t.QueryConnections()}))}},{key:"QueryPositions",value:function(){var e=this;this.monday.storage.instance.getItem("node_positions").then((function(t){console.log(t),null!==t.data.value?(e.positions=JSON.parse(t.data.value),console.log(e.positions)):(e.positions=[],console.log(e.positions))}))}},{key:"GetPositions",value:function(){return this.positions}},{key:"AddPosition",value:function(e){var t=this;if(null!=e){console.log("saving positions ",e);for(var n=-1,o=0;o<this.positions.length;o++)if(this.positions[o].id==e.id){n=o;break}n<0?this.positions.push({id:e.id,position:e.position}):this.positions[o].position=e.position;var i=JSON.stringify(this.positions);this.monday.storage.instance.setItem("node_positions",i).then((function(e){console.log(e),console.log(i),t.QueryPositions()}))}}},{key:"DeleteItem",value:function(e,t){console.log(typeof e),console.log(e),this.monday.api("mutation ($itemId: Int) \n        { \n            delete_item (item_id: $itemId) { id } \n        }",{variables:{itemId:parseInt(e)}}).then((function(e){t()}))}}]),e}(),_=(n(119),n(12)),w=function(e){return i.a.createElement("div",{style:{position:"absolute",top:"0px",bottom:"0px",right:"0px",left:"0px",paddingTop:"80px"}},i.a.createElement("div",{style:{display:"flex"}},i.a.createElement("div",{className:"plot-graph"},i.a.createElement("h3",{style:{textAlign:"center"}},"Total Dependencies"),i.a.createElement(_.d,{width:500,height:500},i.a.createElement(_.a,null),i.a.createElement(_.b,{data:[{x:1,y:10},{x:2,y:5},{x:3,y:15}]}),i.a.createElement(_.c,null),i.a.createElement(_.e,null))),i.a.createElement("div",{className:"plot-graph"},i.a.createElement("h3",{style:{textAlign:"center"}},"Dependencies Per Item"),i.a.createElement(_.d,{width:500,height:500},i.a.createElement(_.a,null),i.a.createElement(_.b,{data:[{x:1,y:2},{x:2,y:5},{x:3,y:12}]}),i.a.createElement(_.c,null),i.a.createElement(_.e,null)))))},C=n(35),O=n.n(C),I=(n(78),function(e){var t=Object(g.k)().transform,n=Object(g.j)((function(e){return[e.nodes,e.width,e.height,e.transform]})),o=Object(p.a)(n,4),a=o[0],l=o[1],s=o[2],c=o[3];function r(e,t,n){return e*(1-n)+t*n}return i.a.createElement(O.a,{size:"small",style:{marginRight:"8px"},onClick:function(e){var n=function(){var e=0,t=0;return Object.entries(a).forEach((function(n,o){n[1].data.outgoingNodes.length>t&&(t=n[1].data.outgoingNodes.length,e=o)})),a[e]}(),o=0,i=[c[0],c[1]],u=i[0],d=i[1],m=-n.position.x+l/2-85,h=-n.position.y+s/2-63,g=setInterval((function(){var e={x:r(u,m,o),y:r(d,h,o),zoom:1};t(e),(o+=.05)>=1&&clearInterval(g)}),10)}},"Find Priority")}),S=function(e){return i.a.createElement("div",{style:{zIndex:"100",position:"absolute",top:"0px",bottom:"0px",right:"0px",left:"0px",visibility:"hidden"}},i.a.createElement("span",{className:"ui-overlay-item"},null===e||void 0===e?void 0:e.children))},R=function(e){var t=e.sourceX,n=e.sourceY,o=e.sourcePosition,a=e.targetX,l=e.targetY,s=e.targetPosition,c=(e.connectionLineType,e.connectionLineStyle,Object(g.g)({sourceX:t,sourceY:n,sourcePosition:o,targetX:a,targetY:l,targetPosition:s}));return i.a.createElement("g",null,i.a.createElement("path",{fill:"none",stroke:"#fff",strokeWidth:5,className:"animated",d:c}),i.a.createElement("circle",{cx:a,cy:l,fill:"#0071d9",r:5,stroke:"#fff",strokeWidth:1.5}))},j=n(183),D=n(185),A=function(e){var t=null;function n(t){var n=null===e||void 0===e?void 0:e.nodeHelper.GetPositions();return void 0==n||(console.log("loading saved node positions of",t),t.forEach((function(e){"prettyNode"==e.type&&n.forEach((function(t){t.id==e.id&&(e.position.x=t.position.x,e.position.y=t.position.y)}))}))),t}function a(e){console.log("updating data of",e);var t=[];e.forEach((function(n){"prettyNode"==n.type&&(n.data.outgoingNodes=Object(g.h)(n,e),t.push(n))}));var n=0,o=document.getElementsByClassName("react-flow__node");for(n=0;n<o.length;n++){var i=o[n].classList[2],a=0;for(a=0;a<t.length;a++){if(i==t[a].id)o[n].getElementsByClassName("MuiChip-label")[0].innerText=t[a].data.outgoingNodes.length+""}}return e}function l(t,n,o,i){var a="e"+t+"_"+o+"-"+n;return{id:a,source:t,target:n,sourceHandle:o,targetHandle:i,className:a,type:null===e||void 0===e?void 0:e.pathSettings,animated:!0,style:{stroke:"#fff",strokeWidth:"5px"},label:"jank",labelStyle:{visibility:"hidden"},labelBgBorderRadius:"100%",labelBgStyle:{height:"24.3594",fill:"var(--color-mud_black)",stroke:"white",strokeWidth:"3",visibility:(null===e||void 0===e?void 0:e.edgeGripSetting)?"visible":"hidden"}}}function s(o){console.log("GENERATING ELEMENTS FROM",o);var i=null===e||void 0===e?void 0:e.filteredItems,s=[],c=o[0].columns;return o.forEach((function(e,n){if(1!=e.name.indexOf("Subitems of")){var o={},a={},l=0;e.items.forEach((function(e,t){var n=e.group.title;n in o||(o[n]=l,a[n]=0,l++)})),e.items.forEach((function(e,l){var r=e.group.title,u=e.name,d=function(e,t){if(null==e)return"var(--color-snow_white)";var n="var(--color-jarco_gray)";return Object.entries(e).forEach((function(e,o){t==e[1]&&(n="var(--color-snow_white)")})),n}(i,e.id),m=function(e,n){if(null==t){var o="pog";null===n||void 0===n||n.forEach((function(e,t){"Status"==e.title&&(o=e.settings_str)})),t={};var i=JSON.parse(o);Object.entries(i.labels).forEach((function(e){var n=e[0],o=e[1];t[o]=i.labels_colors[n].color}))}var a="";return null===e||void 0===e||e.forEach((function(e,t){"Status"===e.title&&(a=e.text)})),a in t?{status:a,color:t[a]}:{status:"",color:"var(--color-ui_grey)"}}(e.column_values,c);if(""!=e.column_values[0])e.column_values[0].text;s.push({id:e.id,type:"prettyNode",className:e.id,data:{title:u,group:r,groupColor:e.group.color,statusData:m,columnValues:e.column_values,outgoingNodes:[],isConnecting:!1},style:{padding:"16px",borderRadius:"8px",background:d,boxShadow:"0px 6px 20px -2px rgba(0, 0, 0, 0.2)"},position:{x:325*o[r]+1e3*n,y:300*a[r]}}),a[r]+=1}))}})),s=a(s=function(t){var n=null===e||void 0===e?void 0:e.nodeHelper.GetConnections();return void 0==n||(console.log("loading saved connections of",t),n.forEach((function(e){var n=l(e.source,e.target,e.sourceHandle,e.targetHandle);t.push(n)})),console.log("loaded saved connections and returning",t)),t}(s=n(s))),console.log("GENERATED ELEMENTS",s),s}var c={prettyNode:k},r=Object(o.useState)([]),u=Object(p.a)(r,2),d=u[0],m=u[1];Object(o.useEffect)((function(){m(null!=(null===e||void 0===e?void 0:e.boardData)?s(null===e||void 0===e?void 0:e.boardData):[])}),[e]);var h=i.a.createElement("div",null);"none"!==(null===e||void 0===e?void 0:e.backgroundSettings)&&null!==(null===e||void 0===e?void 0:e.backgroundSettings)&&(h=i.a.createElement(g.a,{variant:null===e||void 0===e?void 0:e.backgroundSettings,gap:32,size:2}));var f={currEdge:null,mouseX:null,mouseY:null},v={currNode:null,mouseX:null,mouseY:null},y=i.a.useState(f),b=Object(p.a)(y,2),E=b[0],x=b[1],N=i.a.useState(v),_=Object(p.a)(N,2),w=_[0],C=_[1],O=function(){console.log("context menu closed"),x(f),C(v)};var I=i.a.createElement(g.f,{elements:d,nodeTypes:c,onElementClick:null===e||void 0===e?void 0:e.onElementClick,onConnect:function(t){m((function(e){return null!==e&&(e=Object(g.e)(l(t.source,t.target,t.sourceHandle,t.targetHandle),e)),e=a(e),console.log("connected",t,"in",e),e})),null===e||void 0===e||e.nodeHelper.AddConnection(t)},onNodeDragStop:function(t,o){null===e||void 0===e||e.nodeHelper.AddPosition(o),m((function(e){return e=n(e)}))},onNodeContextMenu:function(e,t){e.preventDefault(),C({currNode:t,mouseX:e.clientX-2,mouseY:e.clientY-4})},onContextMenu:function(e){e.preventDefault(),"react-flow__edge-path"==e.target.className.baseVal?x({currEdge:e.target,mouseX:e.clientX-2,mouseY:e.clientY-4}):"react-flow__edge-textbg"==e.target.className.baseVal&&x({currEdge:e.target.parentNode.parentNode.firstChild,mouseX:e.clientX-2,mouseY:e.clientY-4})},connectionLineComponent:R},i.a.createElement(g.b,null),h,i.a.createElement(j.a,{keepMounted:!0,open:null!==E.mouseY,onClose:O,anchorReference:"anchorPosition",anchorPosition:null!==E.mouseY&&null!==E.mouseX?{top:E.mouseY,left:E.mouseX}:void 0},i.a.createElement(D.a,{onClick:function(){var t=E.currEdge.parentNode.classList.item(2),n=0;for(n=0;n<d.length;n++)if(d[n].id==t){null===e||void 0===e||e.nodeHelper.RemoveConnection(d[n].source,d[n].target,d[n].sourceHandle),m((function(e){return e=a(e=Object(g.i)([d[n]],e))}));break}x(f)}},"Delete Connection")),i.a.createElement(j.a,{keepMounted:!0,open:null!==w.mouseY,onClose:O,anchorReference:"anchorPosition",anchorPosition:null!==w.mouseY&&null!==w.mouseX?{top:w.mouseY,left:w.mouseX}:void 0},i.a.createElement(D.a,{onClick:function(){null===e||void 0===e||e.monday.execute("confirm",{message:"Delete this item? It will be kept in your Recycle Bin for 30 days.",confirmButton:"Delete",cancelButton:"Cancel",excludeCancelButton:!1}).then((function(t){if(!0===t.data.confirm){var n=[w.currNode],o=[];m((function(e){return e.forEach((function(e){"prettyNode"!=e.type&&(n[0].id!=e.source&&n[0].id!=e.target||o.push(e))})),Object(g.i)(o.concat(n),e)})),C(v),null===e||void 0===e||e.nodeHelper.RemoveConnections(o),null===e||void 0===e||e.nodeHelper.DeleteItem(w.currNode.id,null===e||void 0===e?void 0:e.boardDataQuery)}}))}},"Delete Node")));return I},H=h()(),P=new N(H),B=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).state={settings:{},name:"",chartView:0},o}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var e=this;H.listen("settings",(function(t){e.setState({settings:t.data})})),H.listen("context",(function(t){e.setState({context:t.data}),H.api("query ($boardIds: [Int]) \n      { \n        boards (ids:$boardIds) { \n          name \n          items { id name group {title color} column_values { title text } } \n          columns {\n            title\n            settings_str\n          }\n        } \n      }",{variables:{boardIds:e.state.context.boardIds}}).then((function(t){e.setState({boardData:t.data})})),console.log(e.state.context)})),H.listen("itemIds",(function(t){e.setState({filteredItems:t.data})})),H.listen("events",(function(t){switch(t.type){case"new_items":alert("NEW ITEM BRUH"),e.boardDataQuery();break;case"change_column_value":e.boardDataQuery()}}))}},{key:"boardDataQuery",value:function(){var e=this;console.log("APP CONTEXT",this.state),H.api("query ($boardIds: [Int]) \n          { \n            boards (ids:$boardIds) { \n              name \n              items { id name group {title color} column_values { title text } } \n              columns {\n                title\n                settings_str\n              }\n            } \n          }",{variables:{boardIds:this.state.context.boardIds}}).then((function(t){e.setState({boardData:t.data})}))}},{key:"render",value:function(){var e,t,n,o,a,l=this;var c=0==this.state.chartView?i.a.createElement(A,{nodeHelper:P,monday:H,boardDataQuery:this.boardDataQuery.bind(this),boardData:null===(e=this.state.boardData)||void 0===e?void 0:e.boards,filteredItems:null===(t=this.state)||void 0===t?void 0:t.filteredItems,pathSettings:null===(n=this.state.settings)||void 0===n?void 0:n.pathdisplay,edgeGripSetting:null===(o=this.state.settings)||void 0===o?void 0:o.edgeGrips,backgroundSettings:null===(a=this.state.settings)||void 0===a?void 0:a.backgroundType,onElementClick:function(e,t){if(null!=e){try{console.log(JSON.stringify(e))}catch(n){return void console.log("spaghetti code oh yeah")}P.EventHasClass(e,"ignore-node-on-click")?console.log("Click detected, but ignoring."):typeof t===typeof k?(console.log("node actions happened i guess",e),H.execute("openItemCard",{itemId:t.id,kind:"columns"})):alert("OH")}},findPriorityEvent:this.state.findPriorityEvent}):i.a.createElement(w,null);return i.a.createElement("div",{className:"App",style:{display:"block",background:"var(--color-mud_black)",fontFamily:"Roboto, sans-serif"}},i.a.createElement(g.d,null,c,i.a.createElement(S,null,i.a.createElement(I,null),i.a.createElement(O.a,{size:"small",style:{marginRight:"8px"},onClick:function(){l.setState({chartView:0==l.state.chartView?1:0}),console.log("damn thing with the freaking render fernaggly",l.state.chartView)}},0==this.state.chartView?"View Group Priorities":"View With Nodes"),i.a.createElement(O.a,Object(s.a)({size:"small",kind:"secondary",style:{marginRight:"8px"},onClick:function(){H.execute("confirm",{message:"Are you sure you want to reset the nodes? You will lose all of the connections that you have made, and all of the original connections will be returned.",confirmButton:"Confirm",cancelButton:"Cancel",excludeCancelButton:!1}).then((function(e){e.data.confirm}))}},"style",{marginRight:"8px"}),"Reset"))))}}]),n}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(i.a.createElement(B,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},97:function(e,t,n){},98:function(e,t,n){}},[[154,1,2]]]);
//# sourceMappingURL=main.da3c0b15.chunk.js.map