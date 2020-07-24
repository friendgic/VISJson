import React, { useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    properties_title: {
        marginRight: 10
    },
    properties_content: {
        margin: '4px'
    },

}));

function PropertiesDrawer(props) {
    const open = props.shareData.drawerRightOpen
    const setOpen = props.shareData.setDrawerRightOpen
    const content = props.content

    const classes = useStyles();

    return <Drawer
        anchor="right"
        variant="persistent"
        open={open}
        classes={{
            paper: classes.drawerPaper,
        }}>
        <div >
            <IconButton onClick={() => { setOpen(false) }}>
                <ChevronRightIcon />
            </IconButton>
            <span className={classes.properties_title}>
                Properties
        </span>
            <Divider />
            <div className={classes.properties_content}>
                {content}
            </div>
        </div>
    </Drawer>
}

export default PropertiesDrawer