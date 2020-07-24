import React from 'react'; 
import GGEditor, { Mind, EditableLabel } from "gg-editor";
import  { Flow } from "gg-editor";

import {  makeStyles } from '@material-ui/core/styles';
/*
{
  "key1":123,
  "key2":"abc",
  "key3":{
    "subKey1":123321,
    "subKey2":"22222"
  }    
}

*/

//https://ggeditor.com/guide/getting-started
const useStyles = makeStyles(() => ({
  root:{
    display:'flex',
    width:'100%',
    height:'fill-available',
    overflow:'hidden'
  },
  editor:{
    display:'flex',
    flex:1,
    blackgroundColor:'#f4f6f8'
  },
  editorBd:{
    flex:1
  }
}));

function GraphPage(props) {
  const classes = useStyles();
  const nodes = props.shareData.nodes;

  let data2={nodes:[],edges:[]}
  nodes.forEach((ele,i) => {
    data2.nodes.push({
      id:ele.id+'',
      label:ele.name,
      x:ele.x,
      y:ele.y
    })

    if(ele.pid!==-1){
      data2.edges.push({
        label: "",
        source: ele.pid+'' ,
        target: ele.id+''
      })
    }
  });
  
  const data = {
    nodes: [
      {
        id: "0",
        label: "Node",
        x: 55,
        y: 55
      },
      {
        id: "1",
        label: "Node",
        x: 55,
        y: 255
      },
      {
        id: "2",
        label: "Node",
        x: 155,
        y: 255
      }
    ],
    edges: [
      {
        label: "Label",
        source: "0",
        target: "1"
      }
    ]
  };

  console.log(data2) 
  return (
    <div className={classes.root}>
      {/* GraphPage Page
      {JSON.stringify(nodes)} */}
      <GGEditor className={classes.editor}>
      <Flow
        className={classes.editorBd}
        data={data2}
        graphConfig={{
          defaultNode: {
            shape: "bizFlowNode"
          },
          defaultEdge: {
            shape: "bizFlowEdge"
          }
        }}
      /> 
      <EditableLabel />
    </GGEditor>
    </div>
  )
}

export default GraphPage;