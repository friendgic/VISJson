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

  const handle_toolBarTabSelect = (event, newValue) => {
    setToolBarTabSelect(newValue);
  };


  const shareData = {
    code: code, setCode: setCode, 
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
