import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';
import Plus from '../Plus_symbol.svg';
import { makeStyles } from '@material-ui/core/styles';

class Values extends React.Component {
    // need uri, to, from, message

    constructor(props){
        super(props);

        this.state = {
            name: '',
            kudo: '',
            uri: '',
            uid: '',
            nameMapUid: '',
            value: '',
            color: '',
            coreValues: []
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.useEffect = this.useEffect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.useEffect();
    }
    

    handleDelete (value){
        console.info('You clicked the Chip.');
        //let value = label;

        let uri = this.state.uri;

        this.state.coreValues.pop(value);

        let modValues = this.state.coreValues;

        console.log(uri);
        console.log(value);

        fetch('http://localhost:5000/api/data/delete_value',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, value})
        })
        .then(response => {
            
            if (response) {
                console.log(response)
            }
        });

        this.setState(() =>{
            return {
                coreValues: modValues
            }
        })

    };


    useEffect() {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid;
        fetch('http://localhost:5000/api/data/get_core_values',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri})
        })
        .then((response) => response.json())
        .then(data => {
            let arr = [];
            console.log(data);
            if(data){
                //response comes in an array of objects, traverse this to load into the values
                data.forEach(val => {
                    if(val.active){
                        arr.push(val.value);
                    }
                });
            }
            console.log(`This is ${arr[0]}`);

            this.setState(() =>{
                return {
                    coreValues: arr,
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
        const value = this.state.value;
        const color = this.state.color;

        const modArr = this.state.coreValues;
        modArr.push(this.state.value);

        console.log("submit ran")

        fetch('http://localhost:5000/api/data/add_value',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, value, color})
        })
        .then(response => {
            
            if (response) {
                console.log(response)
            }
        });

        this.setState(() =>{
            return {
                coreValues: modArr,
                value: ''
            }
        })
        
    }


    render(){
    return (
        <Card style={{width: '300px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); this.handleSubmit();}}>

                    <Grid container direction="column" alignItems="flex-start">
                  
                        {console.log(this.state.coreValues)}

                        {this.state.coreValues ? this.state.coreValues.map((tag, index) => {
                                        return <Chip key={index} label={tag} style={{marginBottom: "15px"}} onDelete={() => this.handleDelete(tag)}/>
                        }) : null} 
                    </Grid>
                   
                    {'\n'}

                    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}} >+</Button>
                    
                    <TextField 
                        label='Add Value' 
                        variant='outlined' 
                        rows={1}
                        value={this.value}
                        style={{
                            flex:1,
                            flexDirection: 'column',
                            maxWidth: '150px',
                            minWidth: '150px',
                            maxHeight: '16px',
                            minHeight: '16px',
                            marginLeft: '0.5rem',
                            marginBottom: '0.5rem'
                        }}
                        
                        onChange={(e) => this.state.value = e.target.value}
                    />


                </form>
            </CardContent>
        </Card>
    );
    }
}
export default Values;