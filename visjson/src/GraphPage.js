import React from 'react';   
import {  makeStyles } from '@material-ui/core/styles';
import ICEditor from './ICEditor'

//https://ggeditor.com/guide/getting-started
 

function GraphPage(props) { 
  const shareData = props.shareData; 
  return (
    <div > 
    {console.log("graph page")}
       <ICEditor shareData = {shareData}>
         
       </ICEditor>
    </div>
  )
}

export default GraphPage;