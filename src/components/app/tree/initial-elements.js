import { MarkerType } from '@vue-flow/core'

/**
 * You can pass elements together as a v-model value
 * or split them up into nodes and edges and pass them to the `nodes` and `edges` props of Vue Flow (or useVueFlow composable)
 */

let buildingIndex = 0
let nodeIndex = 0
let controllerIndex = 0

const yMarginDefault = 1200
const yMarginControllers = 1 * yMarginDefault
const yMarginNodes = 2 * yMarginDefault

const xMarginDefault = 1000
const xMarginControllers = 2 * xMarginDefault
const xMarginNodes = 3 * xMarginDefault

const createBuildingNode = (building, numberOfBuildings, index) => {
    let id = Math.floor(Math.random() * 100)
    let buidlingXMargin = xMarginDefault * buildingIndex
    buildingIndex++
    return { id: id + "" , type: 'building', label: building.name , position: { x: buidlingXMargin  , y: 0 }, class: 'light', data:building }  
}

const createControllerNode = (controller, buildingNodeId ,numberOfControllers, index) => {
    let id = Math.floor(Math.random() * 100)
    
    let buidlingXMargin = (xMarginDefault * controllerIndex) + 25
    controllerIndex++
    let edge = { id: (id * 10) + "" , target: id + "" , source: buildingNodeId, markerEnd: MarkerType.ArrowClosed }

    let controllerNode = { id: id + "" , type: 'controller', label: controller.mac_address , position: { x: buidlingXMargin  , y: yMarginControllers }, class: 'light', data:controller }  
    return [ controllerNode, edge ]
}

const createNodeNodes = (node, controllerNodeId , numberOfNodes, index) => {
    let id = Math.floor(Math.random() * 100)
    let buidlingXMargin = xMarginDefault * nodeIndex
    nodeIndex++
    let edge = { id: (id * 10) + "" , target: id + "" , source: controllerNodeId, markerEnd: MarkerType.ArrowClosed, animated:true }

    let nodeNode = { id: id + "" , type: 'node', label: node.id , position: { x: buidlingXMargin  , y: yMarginNodes }, class: 'light', data: node }  
    return [ nodeNode, edge ]
}

export const createInitalElements = (tree) => {
    const buildingNodes = []
    const controllerNodes = []
    const nodeNodes = []
    tree.forEach((item, index, arr) => {
        let node = createBuildingNode(item, arr.length , index)
        if(item.controllers.length){
            item.controllers.forEach((controller, controllerIndex, controllersArray) => {
                let controllerNode = createControllerNode(controller ,node.id, controllersArray.length , controllerIndex)
                if(controller.nodes){
                    controller.nodes.forEach((node, nodeIndex, nodesArray)=>{
                        let nodeNode = createNodeNodes(node ,controllerNode[0].id , nodesArray.length , nodeIndex)
                        nodeNodes.push(...nodeNode)
                    })
                }
                controllerNodes.push(...controllerNode)
            });
        }
        buildingNodes.push(node)
    });

    console.log('creating initial tree elements: ' , [...nodeNodes])

    return [...buildingNodes,...controllerNodes, ...nodeNodes]
    // return initialElements
}

export const initialElements = [
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 0 }, class: 'light' },
  { id: '2', type: 'output', label: 'Node 2', position: { x: 100, y: 100 }, class: 'light' },
  { id: '3', label: 'Node 3', position: { x: 400, y: 100 }, class: 'light' },
  { id: '4', label: 'Node 4', position: { x: 150, y: 200 }, class: 'light' },
  { id: '5', type: 'output', label: 'Node 5', position: { x: 300, y: 300 }, class: 'light' },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', label: 'edge with arrowhead', source: '1', target: '3', markerEnd: MarkerType.ArrowClosed },
  {
    id: 'e4-5',
    type: 'step',
    label: 'step-edge',
    source: '4',
    target: '5',
    style: { stroke: 'orange' },
    labelBgStyle: { fill: 'orange' },
  },
  { id: 'e3-4', type: 'smoothstep', label: 'smoothstep-edge', source: '3', target: '4' },
]

