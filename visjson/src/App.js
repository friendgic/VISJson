import React from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
 
import JsonPage from './JsonPage'
import GraphPage from './GraphPage'
import TemplatePage from './TemplatePage'
import TestPage from './TestPage'
import Slide from '@material-ui/core/Slide';

import {nodeUI} from './config'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  properties_title: {
    marginRight: 10
  },
  properties_content: {
    margin: '4px'
  },

  title: {
    flexGrow: 1,
    textAlign: "right"
  }
}));
const example = `{
  "key1":123,
  "key2":"abc",
  "key3":{
    "subKey1":123321,
    "subKey2":"22222",
    "more":{
      "ABC":"AAA",
      "BCD":[1,2,3]
    }
  },
  "key4":{
    "subKey1":123321,
    "subKey2":"22222",
    "more":{
      "ABC":"AAA",
      "BCD":[1,2,3]
    }
  },
  "key5":{
    "subKey1":123321,
    "subKey2":"22222",
    "more":{
      "ABC":"AAA",
      "BCD":[1,2,3]
    }
  } ,
  "key6":{
    "subKey1":123321,
    "subKey2":"22222",
    "more":{
      "ABC":"AAA",
      "BCD":[1,2,3]
    }
  }  ,
  "key7":{
    "subKey1":123321,
    "subKey2":"22222",
    "more":{
      "ABC":"AAA",
      "BCD":[1,2,3]
    }
  }  
}
`;

function App() {
  const classes = useStyles();
  const [toolBarTabSelect, setToolBarTabSelect] = React.useState(0);
  const [drawerRightOpen, setDrawerRightOpen] = React.useState(true);
  const [code, setCode] = React.useState(example)
  const [nodes, setNodes] = React.useState([]) 

  const convertCode = (newCode,updateSet) => {
    let counter = 0;
    setCode(newCode);
    try {
      let orijson=JSON.parse(newCode); 
      let allnodes = [] 

      const node_marginLeft = nodeUI.marginLeft;
      const node_marginTop = nodeUI.marginTop;
      const node_width = nodeUI.width;
      const node_height = nodeUI.height; 

      const refs = new Map();

      const Scan = (node,pid,deep,his)=>{ 
        const keys = Object.keys(node)
        keys.forEach((ele,i) => {
          const val = node[ele]
          
          let pack = {
            name:ele,
            val:val,
            showText:''+ele+':'+(typeof(val)!=='object'?val:'{...}'),
            type:Array.isArray(val)?'array':typeof(val),
            
            id:counter ++,
            inid:i,
            his:his+i+'',
            pid:pid,
            deep:deep, 
            x:deep*node_width+node_marginLeft,
            y:i*node_height+node_marginTop,
            obj_open:false
          }

          refs.set(pack.his,pack)
          allnodes.push(pack)

          if(pack.type === 'object' || pack.type === 'array'){
            if(pack.val!==null)
            Scan(pack.val,pack.id,deep+1,his+i+'_')
          } 
        })
      } 
      
      Scan(orijson,-1,0,''); //-1 是指父亲为空， 0是深度初始值,最后一个是树的位置
      console.log(allnodes) 
      if(updateSet){
        for(let i = 0 ;i<nodes.length;i++){
          let node = nodes[i] 
          const newNode = refs.get(node.his)
          if(newNode){

            Object.keys(node).forEach((key,i)=>{
              if(updateSet[key]){
                //保留老的数据
                newNode[key] = node[key]
              }else{
              }
            })
          }
        }
      }
      setNodes(allnodes)
 
    } catch (e) {
      console.log(e)
      alert(e);
    }
  }

  const convertJSON = (changedNode)=>{
    let pack ={} 
    let refs = new Map();
    refs.set(-1,pack)
    for(let i =0 ;i<nodes.length;i++){
      const node = nodes[i];
      const parent = refs.get(node.pid)
        if(typeof(node.val)!=='object'){
          parent[node.name]=node.val
        }else{
          parent[node.name]={}
          refs.set(node.id,parent[node.name])
        }
    } 

    console.log(pack)
    if(changedNode!=null){
      const parent = refs.get(changedNode.pid)
      parent[changedNode.name] = changedNode.val
    }
    const str = JSON.stringify(pack,null,'  ') 
    convertCode(str,{x:true,y:true,obj_open:true})
    
  }

  const handle_toolBarTabSelect = (event, newValue) => {
    setToolBarTabSelect(newValue);
  };


  const shareData = {
    code: code, setCode: setCode, 
    nodes: nodes, setNodes: setNodes, 
    drawerRightOpen:drawerRightOpen, setDrawerRightOpen:setDrawerRightOpen,
    convertCode,convertJSON
  }
 
  return (
    <div className={classes.root}>
      <CssBaseline />


      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            <MenuIcon />
          </IconButton>
          <Tabs value={toolBarTabSelect} onChange={handle_toolBarTabSelect} >
            <Tab label="JSON" />
            <Tab label="GRAPH" />
            <Tab label="TEMPLATES" />
          </Tabs>
          {drawerRightOpen !== true &&
            <Typography variant="subtitle1" className={classes.title}>
              Properties
            </Typography>
          }
          {drawerRightOpen !== true &&
            <IconButton edge="end" color="inherit" onClick={() => { setDrawerRightOpen(true) }}>
              <ChevronLeftIcon />
            </IconButton>
          }
        </Toolbar>
      </AppBar>


      {toolBarTabSelect === 0 &&
        <JsonPage shareData={shareData} />
      }
      {toolBarTabSelect === 1 &&
        <GraphPage shareData={shareData} />
      }
      {toolBarTabSelect === 2 &&
        <TemplatePage shareData={shareData} />
      }

     
    </div>
  );
}

export default App;
