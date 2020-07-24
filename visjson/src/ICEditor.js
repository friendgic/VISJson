import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Konva from 'konva';
import { Stage, Layer, Rect, Text, Group, Arrow, Circle, Star } from 'react-konva';
import { nodeUI } from './config'
import PropertiesDrawer from './PropertiesDrawer'
import Button from '@material-ui/core/Button';

const nodeWidth = 100;
const nodeHight = 25;

//https://konvajs.org/docs/react/index.html
function ICEditor(props) {
    const shareData = props.shareData;
    const nodes = shareData.nodes; const setNodes = shareData.setNodes;
 
    const stageRef = React.useRef(null);
    const layerRef = React.useRef(null);
    const [refresh, setRefresh] = React.useState(0);
    const [selectedId, setSelectedID] = React.useState(null);
    let [idTrack, setIdTrack] = React.useState([]);
    const [subNodes, setSubNodes] = React.useState([]);

    if (Object.keys(nodes).length === 0) return <></>
    
    const myProperties = (
        <div>  
          <Button variant="outlined" onClick={()=>{
            
            }}>Test</Button>
        </div>
      )

    const onDragStart = (node) => {
        setSubNodes(findChildrenFromNode(node))
    }

    const onDrag = (node) => {
        relocateSubNodes(subNodes)
        setNodes(nodes)
        setRefresh(refresh + 1)
    }

    const onSelect = (id) => {
        let node = nodes[id];
        idTrack = [];
        if (node) {
            while (node.pid !== -1) {
                idTrack.push(node.id);
                node = nodes[node.pid];
            }
        }
        setIdTrack(idTrack)
        setSelectedID(id)
    }

    const onDblClick = (id) => {
        let node = nodes[id]
        if (node.type === 'object' || node.type === 'array') {
            node.obj_open = !node.obj_open
            if (node.obj_open) {

                relocateSubNodes(findChildrenFromNode(node))
            }
        }
        setNodes(nodes)
        setRefresh(refresh + 1)
    }

    const showNode = (node) => {
        let cn = node
        while (cn.pid !== -1) {
            cn = nodes[cn.pid]
            if (!cn.obj_open) return false
        }
        return true
    }

    //find all children from a node
    const findChildrenFromNode = (node) => {
        let allchildren = []
        for (let i = 0; i < nodes.length; i++) {
            var one = nodes[i]
            if (one.pid === node.id) {
                allchildren.push({ node: one, parent: node })
                if (one.type === 'object' || one.type === 'array') {
                    const children = findChildrenFromNode(one)
                    allchildren = allchildren.concat(children)
                }
            }
        }
        return allchildren
    }

    //put node on right of the parent
    const relocateNode = (node, parentNode) => {
        const deep = node.deep - parentNode.deep
        const chindrenCount = Object.keys(parentNode.val).length
        node.x = parentNode.x + deep * nodeUI.width
        node.y = parentNode.y + node.inid * nodeUI.height - chindrenCount/2*nodeUI.height + nodeUI.height/2
    }

    //relocate all subnodes
    const relocateSubNodes = (children) => {
        for (let i = 0; i < children.length; i++) {
            var n = children[i].node
            var parent = children[i].parent
            relocateNode(n, parent)
        }
    }

    return (
    <div>
    <Stage
        ref={stageRef}
        draggable
        width={window.innerWidth} height={window.innerHeight}
        onMouseDown={(e) => {
            e.target === e.target.getStage() && onSelect(-1)
        }}
        >
        <Layer
            ref={layerRef}>
            {
                nodes.filter(showNode).filter(ele => { return ele.pid !== -1 }).map((ele, i) => {
                    const parent = nodes[ele.pid]
                    
                    return <Link
                    key={i}
                    element={ele}
                    parent={parent}
                    isSelect={idTrack.includes(ele.id)}
                    />
                })
            }
            {
                nodes.filter(showNode).map((ele, i) => {
                    return <Node
                        key={i}
                        node={ele}
                        isSelect={selectedId === ele.id}
                        onClick={() => { onSelect(ele.id) }}
                        onDblClick={() => { onDblClick(ele.id) }}
                        onMove={() => { onDrag(ele) }}
                        onDragStart={() => { onDragStart(ele) }}
                        />
                    })
                }


        </Layer>

    </Stage>
    <PropertiesDrawer shareData = {props.shareData} content = {myProperties}></PropertiesDrawer>
    </div>)
}

function Link(props) {
    const element = props.element
    const parent = props.parent
    const x = parent.x + nodeWidth + 4;
    const y = parent.y + nodeHight / 2;
    const tx = element.x - 4;
    const ty = element.y + nodeHight / 2;
    const color = props.isSelect ? '#3780db' : '#7a7a7a'
    return (<Arrow
        stroke={color}
        fill={color}
        shadowBlur={props.isSelect ?10:0}
        shadowColor={color}
        shadowOpacity={props.isSelect ? '1' : '0'}
        x={x}
        y={y}
        points={[0, 0, tx - x, ty - y]}
    />)
}

function Node(props) {
    const x = props.node.x
    const y = props.node.y
    const text = props.node.showText
    const normalColor = props.color ? props.color : '#ebfff0'
    const objColor = props.objColor ? props.objColor : '#ffe77d'
    const arrayColor = props.arrayColor ? props.arrayColor : '#8ecdfa'
    const color = props.node.type === 'object' ? objColor :
        props.node.type === 'array' ? arrayColor : normalColor
    return (
        <Group
            id={props.node.id}
            x={x}
            y={y}
            draggable
            onDragStart={e => { props.onDragStart && props.onDragStart() }}
            onDragMove={e => {
                props.node.x = e.target.x()
                props.node.y = e.target.y()
                props.onMove && props.onMove()
            }}
            onClick={props.onClick}
            onDblClick={props.onDblClick}
        >
            <Rect
                x={0}
                y={0}
                width={nodeWidth}
                height={nodeHight}
                fill={color}
                stroke= {props.isSelect?'#3780db': '#7a7a7a'}
                strokeWidth ={props.isSelect?3:1}

                shadowBlur={props.isSelect ?10:0}
                shadowColor={'#7a7a7a'}
                shadowOpacity={props.isSelect ? '1' : '0'}
                cornerRadius={6}
            >
            </Rect>

            <Text
                text={text}
                x={4}
                y={4}
                fontSize={14}
                width={90}
                height={16}
            ></Text>

            {!props.node.obj_open &&
                (props.node.type === 'object' || props.node.type === 'array') &&
                <Group
                    x={nodeWidth + 5}
                    y={nodeHight / 2}>
                    <Circle
                        radius={5}
                        fill={'yellow'}
                        stroke={'black'}
                    />
                </Group>
            }
        </Group>
    )
}

export default ICEditor