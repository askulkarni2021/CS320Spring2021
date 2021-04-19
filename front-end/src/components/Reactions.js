import React, { useEffect, useState } from 'react'
import {Chip, Grid, Popover, makeStyles} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Emoji from './Emoji';

const useStyles = makeStyles(theme => ({
    popchips: {
        margin: '5px 2px',
        fontSize: '17px'
    },
    reacchips: {
        margin: '5px 2px',
        fontSize: '15px'
    }
}));

//kudoID=kudo._id, kudoReactions=kudo.reactions, compReactions=props.compReactions
//kudo.reactions = [{emoji: '🙌', by: 'NAME'}]
//compReactions = [ '🎇', '🙌', '👍', '👀' ]
export default function Reactions(props) {
    const [compReactions] = useState(props.compReactions);
    const [kudoReactions, setKudoReactions] = useState(props.kudoReactions);
    const [reactionCounters, setReactionCounters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        let rc = {...reactionCounters};
        compReactions.map((value) => {
            rc[value] = 0;
        })
        kudoReactions.map((value) => {
            rc[value.emoji] += 1;
        })
        setReactionCounters(rc);
    }, [kudoReactions])
    
    //value = emoji that was reacted to
    //reacted = boolean of whether user has reacted to the reaction already
    function updateReaction(value, reacted) {
        let obj = {emoji: value, by: JSON.parse(localStorage.getItem('data')).uid}
        let body = {uri: localStorage.getItem('uri'), kudoID: props.kudoID, emoji: obj.emoji, by: obj.by}
        let tempKudoReactions = [...kudoReactions]
        if(reacted) {
            const index = tempKudoReactions.map((e) => { 
                if (e.emoji === obj.emoji && e.by === obj.by){
                  return e.emoji
                }
                return(null)
              }).indexOf(obj.emoji);
            tempKudoReactions.splice(index, 1)
            setKudoReactions(tempKudoReactions);
            fetch('http://localhost:5000/api/delete_kudo_reaction',
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json());
        } else {
            tempKudoReactions.push(obj)
            setKudoReactions(tempKudoReactions);
            fetch('http://localhost:5000/api/add_kudo_reaction',
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json());
        }
    }

    return(
        <Grid container justify='flex-end'>
            {Object.keys(reactionCounters).length > 0 && compReactions.map((emoji, index) => {
                if (reactionCounters[emoji] !== 0) {
                    // if user has reacted to this reaction
                    // let reacted = true else false
                    let reacted = false
                    kudoReactions.map((kRvalue) => {
                        if(kRvalue.emoji === emoji && kRvalue.by === JSON.parse(localStorage.getItem('data')).uid) {
                            reacted = true
                        }
                    })
                    const count = reactionCounters[emoji]
                    return <Chip
                            variant="outlined"
                            label={emoji + " " + count} 
                            onClick={() => updateReaction(emoji, reacted)}
                            key={index}
                            color={reacted ? 'primary' : 'default'} //set color depending on reacted to or not
                            className={classes.reacchips}
                            />
                }
            })}
            <Chip
            variant="outlined"
            label="+"
            onClick={handleClick}
            className={classes.reacchips}
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
               {compReactions.map((emoji, index) => {
                   let reacted = false
                   kudoReactions.map((kRvalue) => {
                       if(kRvalue.emoji === emoji && kRvalue.by === JSON.parse(localStorage.getItem('data')).uid) {
                           reacted = true
                       }
                   })
                    return <Chip
                            label={<Emoji symbol={emoji}/>}
                            onClick={() => updateReaction(emoji, reacted)}
                            key={index}
                            className={classes.popchips}
                          />
               })}
            </Popover>
        </Grid>
    )
}