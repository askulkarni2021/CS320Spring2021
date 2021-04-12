import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';
import Plus from '../Plus_symbol.svg';


export default function AddValue(props) {
    // need uri, to, from, message
    const [name, setName] = useState('');
    const [kudo, updateKudo] = useState('');
    const [uri, setUri] = useState('');
    const [uid, setUid] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');
    /* FAKE CORE VALUES, PRESET */
    //const [coreValues] = useState(['Test Value', 'Teamwork', 'Spirited']);
    const [value, setVal] = useState('');
    const [color, setColor] = useState('');
    const [coreValues, setCoreValues] = useState(['loading']);
    

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    
    
    function formChips() {
        console.log(coreValues);

        let ans = '';
        if (coreValues){
            coreValues.map((val) =>
            <Chip
                style={{marginBottom: "0.5rem"}} 
                label={val} 
                color="secondary"
                onClick={handleClick} ></Chip>
            )
        }
        return ans;
    } 

    useEffect(() => {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid;
        setUri(uri);
        setUid(uid);
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
                    arr.push(val.value);
                });
            }
            console.log(`This is ${arr[1]}`);
            setCoreValues(arr);

            
        });
    }, []);

       //Passes the arguments from setUri, setVal, and setColor to the backend
    //Proceeds to then empty the Val string so another value can be added.
    function handleSubmit() {
        console.log('uri', uri);
        setColor("red");
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
        setVal('');
    }




    return (
        <Card style={{width: '300px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>

                    <Grid container direction="column" alignItems="flex-start">
                  
                        {coreValues ? coreValues.map((tag, index) => {
                                        return <Chip key={index} label={tag} style={{marginBottom: "15px"}}/>
                        }) : null} 
                    </Grid>
                   
                    {'\n'}

                    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}}>+</Button>
                    
                    <TextField 
                        label='Add Value' 
                        variant='outlined' 
                        rows={1}
                        value={value}
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
                        
                        onChange={(e) => setVal(e.target.value)}
                    />


                </form>
            </CardContent>
        </Card>
    );
}