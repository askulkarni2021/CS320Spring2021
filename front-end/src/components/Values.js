import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';
import Plus from '../Plus_symbol.svg';

// props: getKudos, optional: toggleShowAddKudos
export default function AddKudo(props) {
    // need uri, to, from, message
    const [name, setName] = useState('');
    const [kudo, updateKudo] = useState('');
    const [uri, setUri] = useState('');
    const [uid, setUid] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');
    /* FAKE CORE VALUES, PRESET */
    const [coreValues] = useState(['Test Value', 'Teamwork', 'Spirited']);
    const [val, setVal] = useState('');

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    const valueChips = coreValues.map((val) =>
        <Chip
        style={{marginBottom: "0.5rem"}} 
        label={val} 
        color="secondary"
        onClick={handleClick} ></Chip>
    )

    const valueX = coreValues.map((val) =>
    
    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}}>x</Button>

    
    );

    useEffect(() => {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid;
        setUri(uri);
        setUid(uid);
        fetch('http://localhost:5000/api/data/name_map_uid',
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
            setNameMapUid(data);
            console.log(data);
        });
    }, []);

    function handleSumbit() {
        console.log('name', name);
        console.log('to object', nameMapUid[name]);
        console.log('kudo', kudo);
        console.log('from', uid);
        console.log('uri', uri);
        const to = nameMapUid[name]['id'];
        const from = uid;
        fetch('http://localhost:5000/api/data/add_value',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, val})
        })
        .then(response => {
            
            if (response) {
                console.log("post happened")
            }
        });
    }

    return (
        <Card style={{width: '200px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSumbit();}}>

                    <Grid container direction="column" alignItems="flex-start">

                         {valueChips} </Grid>
                   
                    {'\n'}

                    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}}>+</Button>

                    <TextField 
                        m="2rem"
                        label='Add Value' 
                        variant='outlined' 
                        multiline
                        rows={1}
                        value=''
                        style={{
                            flex:1,
                            flexDirection: 'column',
                            maxWidth: '100px',
                            minWidth: '100px',
                            maxHeight: '16px',
                            minHeight: '16px',
                            marginLeft: '0.5rem'
                        }}
                        
                        onChange={(e) => updateKudo(e.target.value)}
                    />


                </form>
            </CardContent>
        </Card>
    );
}