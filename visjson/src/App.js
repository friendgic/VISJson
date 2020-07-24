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
    "subKey2":"22222"
  }    
}
`;

function App() {
  const classes = useStyles();
  const [toolBarTabSelect, setToolBarTabSelect] = React.useState(0);
  const [drawerRightOpen, setDrawerRightOpen] = React.useState(true);
  const [code, setCode] = React.useState(example)
  const [nodes, setNodes] = React.useState({})

  const handle_toolBarTabSelect = (event, newValue) => {
    setToolBarTabSelect(newValue);
  };

  const node_marginLeft = 50;
  const node_marginTop = 50;
  const node_width = 200;
  const node_height = 100; 

  const convertCode = (newCode) => {
    let counter = 0;
    setCode(newCode);
    try {
      let orijson=JSON.parse(code);
      let allnodes = []

      let deep = 0
      const Scan = (node,pid,deep)=>{
        const keys = Object.keys(node)
        keys.forEach((ele,i) => {
          const val = node[ele]
          
          let pack = {
            name:ele,
            id:counter ++,
            inid:i,
            type:typeof(val),
            val:val,
            pid:pid,
            deep:deep, 
            x:deep*node_width+node_marginLeft,
            y:i*node_height+node_marginTop
            
          }
          allnodes.push(pack)

          if(pack.type === 'object'){
            Scan(pack.val,pack.id,deep+1)
          } 
        })
      } 
      
      Scan(orijson,-1,0); //-1 是指父亲为空， 0是深度初始值
      console.log(allnodes)
      setNodes(allnodes);

      // let root = {}
      // const InitScan = (node,root,parent,deep) => {
        
      //   const keys = Object.keys(node)
      //   keys.forEach((element,index) => {
      //     const value = node[element]
      //     //console.log(element + ":" + value)    //"key1":123
          
      //     if (typeof (value) === 'object') {
      //       let newRoot = {}
      //       InitScan(value,newRoot,root,deep+1)
    
      //       root[element] = {
      //         child:newRoot ,
      //         type:'object'
      //       } 
      //     }else{
      //       root[element] = {
      //         child:value ,
      //         type:'normal'
      //       } 
      //     }
      //     root[element]['deep']=deep
      //     root[element]['id'] = counter++ 
      //   });
      // }
      // InitScan(orijson,root,0,0)
      //console.log(root) 
      //setNodes(root)
    } catch (e) {
      alert(e);
    }
  }

  const shareData = {
    code: code, setCode: setCode, convertCode : convertCode,
    nodes: nodes, setNodes: setNodes,
    drawerRightOpen:drawerRightOpen, setDrawerRightOpen:setDrawerRightOpen
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
