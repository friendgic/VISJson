import React, { useState } from 'react';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-regex";

import PropertiesDrawer from './PropertiesDrawer'
import Button from '@material-ui/core/Button';
import "./prism.css";

import {nodeUI} from './config'

function JsonPage(props) {
  const code = props.shareData.code;
  const setCode = props.shareData.setCode; 
  const setNodes = props.shareData.setNodes;
  const setTree = props.shareData.setTree;

  const convertCode = (newCode) => {
    let counter = 0;
    setCode(newCode);
    try {
      let orijson=JSON.parse(code);
      let allnodes = [] 

      const node_marginLeft = nodeUI.marginLeft;
      const node_marginTop = nodeUI.marginTop;
      const node_width = nodeUI.width;
      const node_height = nodeUI.height; 

      const Scan = (node,pid,deep)=>{
        const keys = Object.keys(node)
        keys.forEach((ele,i) => {
          const val = node[ele]
          
          let pack = {
            name:ele,
            val:val,
            showText:''+ele+':'+(typeof(val)!=='object'?val:'{...}'),
            id:counter ++,
            inid:i,
            type:Array.isArray(val)?'array':typeof(val),
            pid:pid,
            deep:deep, 
            x:deep*node_width+node_marginLeft,
            y:i*node_height+node_marginTop,

            obj_open:false
            
          }
          allnodes.push(pack)

          if(pack.type === 'object' || pack.type === 'array'){
            Scan(pack.val,pack.id,deep+1)
          } 
        })
      } 
      
      Scan(orijson,-1,0); //-1 是指父亲为空， 0是深度初始值
      console.log(allnodes) 
      setNodes(allnodes);
 
    } catch (e) {
      alert(e);
    }
  }

  const myProperties = (
    <div>  
      <Button variant="outlined" onClick={()=>{
        convertCode(code)
        }}>Save and Convert</Button>
    </div>
  )
   
  return (
    <div>
      {console.log("json page")}
      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.js)}
        padding={10}
      />
    <PropertiesDrawer shareData = {props.shareData} content = {myProperties}></PropertiesDrawer>
    </div>
  )
}


export default JsonPage;