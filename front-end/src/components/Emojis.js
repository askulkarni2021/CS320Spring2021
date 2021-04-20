import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';
import Plus from '../Plus_symbol.svg';

// props: getKudos, optional: toggleShowAddKudos
export default function AddEmoji(props) {
    // need uri, to, from, message
    const [name, setName] = useState('');
    const [kudo, updateKudo] = useState('');
    const [uri, setUri] = useState('');
    const [uid, setUid] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');
    /* FAKE CORE VALUES, PRESET */
    const [rxn, setRxn] = useState(['loading']);
    const [emoji, setEmoji] = useState('');

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };
    


    useEffect(() => {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid;
        setUri(uri);
        setUid(uid);
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
            setRxn(data);

        });
    }, []);

       //Passes the arguments from setUri, setVal, and setColor to the backend
    //Proceeds to then empty the Val string so another value can be added.
    function handleSubmit() {
        console.log('uri', uri);
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
        setEmoji('');
    }

    return (
        <Card style={{width: '300px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>

                    <Grid container direction="column" alignItems="flex-start">

                    {rxn ? rxn.map((tag, index) => {
                                        return <Chip key={index} label={tag} style={{marginBottom: "15px"}}/>
                        }) : null} 
                        
                    </Grid>
                   
                    {'\n'}

                    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}}>+</Button>
                    
                    <TextField 
                        label='Add Emoji' 
                        variant='outlined' 
                        rows={1}
                        value={emoji}
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
                        
                        onChange={(e) => setEmoji(e.target.value)}
                    />


                </form>
            </CardContent>
        </Card>
    );
}