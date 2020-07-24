import React, { useState } from 'react';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-regex";

import PropertiesDrawer from './PropertiesDrawer'
import Button from '@material-ui/core/Button';
import "./prism.css";

function JsonPage(props) {
  const code = props.shareData.code;
  const setCode = props.shareData.setCode;
  const convertCode = props.shareData.convertCode;

  const myProperties = (
    <div>  
      <Button variant="outlined" onClick={()=>{
        convertCode(code)
        }}>Save and Convert</Button>
    </div>
  )
   
  return (
    <div>
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