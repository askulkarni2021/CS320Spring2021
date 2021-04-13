import React, { useEffect, useState } from 'react'
import {Chip, Grid, Popover, Typography, TextField} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Emoji from './Emoji';


//kudoID=kudo._id, kudoReactions=kudo.reactions, compReactions=props.compReactions
//kudo.reactions = [{emoji: '🙌', by: 'NAME'}]
//compReactions = [ '🎇', '🙌', '👍', '👀' ]
export default function Reactions(props) {
    const [compReactions] = useState(props.compReactions);
    const [kudoReactions, setKudoReactions] = useState(props.kudoReactions);
    const [reactionCounters, setReactionCounters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);

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
        console.log('updateReaction', value, reacted)
        let obj = {emoji: value, by: JSON.parse(localStorage.getItem('data')).uid}
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
            //update backend
        } else {
            tempKudoReactions.push(obj)
            setKudoReactions(tempKudoReactions);
            //update backend
        }
    }

    return(
        <Grid container>
            {Object.keys(reactionCounters).length > 0 && compReactions.map((value, index) => {
                if (reactionCounters[value] !== 0) {
                    // if user has reacted to this reaction
                    // let reacted = true else false
                    let reacted = false
                    kudoReactions.map((kRvalue) => {
                        if(kRvalue.emoji === value && kRvalue.by === JSON.parse(localStorage.getItem('data')).uid) {
                            reacted = true
                        }
                    })
                    const count = reactionCounters[value]
                    console.log('reactionCounters', reactionCounters)
                    console.log('kudoReactions', kudoReactions)
                    console.log(value, reacted)
                    return <Chip
                            variant="outlined"
                            label={value + " " + count} 
                            onClick={() => updateReaction(value, reacted)}
                            key={index}
                            color={reacted ? 'primary' : 'default'} //set color depending on reacted to or not
                            />
                }
            })}
            <Chip
            variant="outlined"
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
               {compReactions.map((value, index) => {
                    return <Chip
                            label={<Emoji symbol={value}/>}
                            onClick={() => {return null}}
                            key={index}
                          />
               })}
            </Popover>
        </Grid>
    )
}