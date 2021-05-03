import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';
import Plus from '../Plus_symbol.svg';

// props: getKudos, optional: toggleShowAddKudos
class Emojis extends React.Component{
    // need uri, to, from, message

    constructor(props){
        super(props);

        this.state = {
            name: '',
            kudo: '',
            uri: '',
            uid: '',
            nameMapUid: '',
            rxn: '',
            emoji: '',
            emojis: []
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.useEffect = this.useEffect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.useEffect();
    }

    handleDelete(emoji){
        console.info('You clicked the Chip.');
        //let value = label;

        const uri = this.state.uri;
        this.state.emojis.pop(emoji);
        const modEmoji = this.state.emojis;


        
        fetch('http://localhost:5000/api/data/delete_emoji',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, emoji})
        })
        .then(response => {
            
            if (response) {
                console.log(response)
            }
        });

        this.setState(()=>{
            return {
                emojis: modEmoji
            }
        })

    };
    


    useEffect(){
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid;

        let setEmojis = [];
        
 
        fetch('http://localhost:5000/api/data/get_emojis',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri})
        })
        .then(response => response.json())
        .then(data => {

            this.setState(() =>{
                return {
                    emojis: data,
                    uri: uri,
                    uid: uid
                }
            })
        });

        
    }

       //Passes the arguments from setUri, setVal, and setColor to the backend
    //Proceeds to then empty the Val string so another value can be added.
    handleSubmit() {
        
        const uri = this.state.uri;
        const emoji = this.state.emoji;

        const modArr = this.state.emojis;
        modArr.push(this.state.emoji);


        fetch('http://localhost:5000/api/data/add_emoji',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, emoji})
        })
        .then(response => {
            
            if (response) {
                console.log(response)
            }
        });
        
        this.setState(() =>{
            return {
                emojis: modArr,
                emoji: ''
            }
        })
    }

    render (){
        return(
        <Card style={{width: '300px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); this.handleSubmit();}}>

                    <Grid container direction="column" alignItems="flex-start">

                    {this.state.emojis ? this.state.emojis.map((tag, index) => {
                                        return <Chip key={index} label={tag} style={{marginBottom: "15px"}} onDelete={() => this.handleDelete(tag)} />
                        }) : null} 
                        
                    </Grid>
                   
                    {'\n'}

                    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}}>+</Button>
                    
                    <TextField 
                        label='Add Emoji' 
                        variant='outlined' 
                        rows={1}
                        value={this.emoji}
                        style={{
                            flex:1,
                            flexDirection: 'column',
                            maxWidth: '150px',
                            minWidth: '150px',
                            maxHeight: '16px',
                            minHeight: '16px',
                            marginLeft: '0.5rem',
                            marginBottom: '0.7rem'
                        }}
                        
                        onChange={(e) => this.state.emoji = (e.target.value)}
                    />


                </form>
            </CardContent>
        </Card>
        );
    }
}
export default Emojis;