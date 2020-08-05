import React from 'react';
import { CssBaseline, Toolbar, IconButton, Typography, Tabs, Tab, AppBar } from '@material-ui/core';

import { Menu, ArrowLeft, Code } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import JsonPage from './Pages/JsonPage';
import GraphPage from './Pages/GraphPage';
import TemplatePage from './Pages/TemplatePage';

import { nodeUI } from './config';

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
  "root":[]
}`;

const temp = [{
  show: 'Name',
  label: '+Person',
  value: `{
  "Name":"",
  "Age":""
}
`,
  obj: {
    "Name": "",
    "Age": ""
  },
  hasError: false
}];

function App() {
  const classes = useStyles();
  let [toolBarTabSelect, setToolBarTabSelect] = React.useState(0);
  let [drawerRightOpen, setDrawerRightOpen] = React.useState(true);
  let [code, setCode] = React.useState(example);
  let [template, setTemplate] = React.useState(temp);
  let [nodes, setNodes] = React.useState([]);

  const convertCode = (newCode, updateSet) => {
    let counter = 0;
    code = newCode;
    setCode(newCode);
    try {
      let orijson = JSON.parse(newCode);
      let allnodes = [];

      const node_marginLeft = nodeUI.marginLeft;
      const node_marginTop = nodeUI.marginTop;
      const node_width = nodeUI.width;
      const node_height = nodeUI.height;

      const refs = new Map();

      const Scan = (node, pid, deep, his) => {
        const keys = Object.keys(node);
        keys.forEach((ele, i) => {
          const val = node[ele];

          let pack = {
            name: ele,
            val: val,
            showText: '' + ele + ':' + (typeof (val) !== 'object' ? val : '{...}'),
            type: Array.isArray(val) ? 'array' : typeof (val),

            id: counter++,
            inid: i,
            his: his + i + '',
            pid: pid,
            deep: deep,
            x: deep * node_width + node_marginLeft,
            y: i * node_height + node_marginTop,
            obj_open: false
          };

          refs.set(pack.his, pack);
          allnodes.push(pack);

          if (pack.type === 'object' || pack.type === 'array') {
            if (pack.val !== null)
              Scan(pack.val, pack.id, deep + 1, his + i + '_');
          }
        });
      };

      Scan(orijson, -1, 0, ''); //-1 是指父亲为空， 0是深度初始值,最后一个是树的位置
      console.log(allnodes);
      if (updateSet) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          const newNode = refs.get(node.his);
          if (newNode) {

            Object.keys(node).forEach((key, i) => {
              if (updateSet[key]) {
                //保留老的数据
                newNode[key] = node[key];
              } else {
              }
            });
          }
        }
      }
      nodes = allnodes
      setNodes(allnodes);

    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  function setObject(obj, key, value) {
    if (Array.isArray(obj)) {
      obj.push(value)
    } else {
      obj[key] = value
    }
  }

  const convertJSON = (changedNode) => {
    console.log(changedNode);
    let pack = {};
    let refs = new Map();
    refs.set(-1, pack);
    let hasNull = false;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.val === null) continue;
      const parent = refs.get(node.pid);
      if (parent === undefined) continue;
      if (typeof (node.val) !== 'object') {
        setObject(parent, node.name, node.val);
      } else if (Array.isArray(node.val)) {
        setObject(parent, node.name, []);
        refs.set(node.id, parent[node.name]);
      } else {
        const obj = {}
        setObject(parent, node.name, obj);
        refs.set(node.id, obj);
      }
    }

    console.log(pack);
    if (changedNode != null) {
      const parent = refs.get(changedNode.pid);
      if (changedNode.val != null)
        parent[changedNode.name] = changedNode.val;
      else {

      }
    }
    const str = JSON.stringify(pack, null, '  ');
    convertCode(str, { x: true, y: true, obj_open: true });

  };

  const handle_toolBarTabSelect = (event, newValue) => {
    setToolBarTabSelect(newValue);
  };


  const shareData = {
    code: code, setCode: setCode,
    nodes: nodes, setNodes: setNodes,
    template: template, setTemplate: setTemplate,
    drawerRightOpen: drawerRightOpen, setDrawerRightOpen: setDrawerRightOpen,
    convertCode, convertJSON,

  };

  return (
    <div className={classes.root}>
      <CssBaseline />


      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            <Menu />
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
            <IconButton edge="end" color="inherit" onClick={() => { setDrawerRightOpen(true); }}>
              <ArrowLeft />
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
