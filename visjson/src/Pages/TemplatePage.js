import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
  root: {
    padding: '14px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  oneSlot: {
    flexShrink: '0',
    border: '1px solid #48a0ba',
    margin: '8px',
    padding: '8px',
    borderRadius: '10px',
    background: '#f6faff',
    boxShadow: ' 1px 1px #c6c6c6;',

    "&: hover": {
      background: 'red'
    },
    display: 'flex'
  },
  oneColumn: {

    flexDirection: 'column',
    display: 'flex'
  },
  columnItem: {
    padding: '8px'
  }
}));

function TemplatePage(props) {
  const template = props.shareData.template;
  const setTemplate = props.shareData.setTemplate;
  const classes = useStyles();
  const [lastModify, setLastModify] = useState('');

  function setTempData(temp, key, value) {
    temp[key] = value;
    if (key === 'value') {
      try {
        temp.obj = JSON.parse(temp.value);
        temp.hasError = false
      } catch (e) {
        temp.hasError = true
      }
    }
    setTemplate(template);
    setLastModify(key + value);
  }

  function onDelete(temp) {
    const newTempate = template.filter((item, index) => {
      return item !== temp
    })
    setTemplate(newTempate)
  }

  function onAddNew() {
    template.push({
      show: '',
      label: '',
      value: `{
}
`,
      obj: {
      }
    })
    setTemplate(template)
    setLastModify('add new one ' + template.length)
  }
  return (
    <div className={classes.root}>

      {
        template.map((item, index) => {
          return (
            <div className={classes.oneSlot} key={index} style={
              item.hasError ? { 'background': "#ffa6a6" } : {}
            }>
              <div className={classes.oneColumn}>
                <div className={classes.columnItem}>
                  <TextField
                    onChange={(e) => { setTempData(item, 'show', e.target.value); }}
                    id="standard-basic" label="show key" value={item.show} />
                </div>
                <div className={classes.columnItem}>
                  <TextField
                    onChange={(e) => { setTempData(item, 'label', e.target.value); }}
                    id="standard-basic" label="label" value={item.label} />
                </div>
              </div>
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Template"
                  multiline
                  rows={6}
                  variant="outlined"
                  value={item.value}
                  onChange={(e) => { setTempData(item, 'value', e.target.value); }}
                />
              </div>
              <div>
                <Button variant="outlined" onClick={() => {
                  onDelete(item)
                }}>Delete</Button>
                {item.hasError && <div>Has Error</div>}
              </div>
            </div>
          );
        })
      }
      <Button variant="outlined" onClick={() => {
        onAddNew()
      }}>Add new Template</Button>
    </div>
  );
}

export default TemplatePage;