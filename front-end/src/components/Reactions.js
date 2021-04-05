import React, { useEffect, useState } from 'react'
import {Chip, Grid, Popover, Typography, TextField} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Emoji from './Emoji';


//kudoID=kudo._id, kudoReactions=kudo.reactions, compReactions=props.compReactions
export default function Reactions(props) {
    const [reactions, updateReactions] = useState({});
    const [compReactions] = useState(props.compReactions);
    const [addReactions, setAddReactions] = useState();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    useEffect(() => {
        console.log(props.kudoID);
        console.log(props.kudoReactions);
        console.log(compReactions);
        const uri = localStorage.getItem('uri');
        updateReactions(props.kudoReactions)
    }, []);

    function addReaction() {

    }
    

    return(
        <Grid container>
            <Chip
            label="+"
            onClick={handleClick}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
               {compReactions.map((value) => {
                    let uni = value.substring(2);
                    let emoji = "\\u" + uni
                    return <Chip
                            label={<Emoji symbol="🐑"/>}
                          />
               })}
            </Popover>
        </Grid>
    )
}