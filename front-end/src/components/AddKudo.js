import { Button, Card, CardContent, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';

export default function AddKudo(props) {
    // need uri, to, from, message
    const [to, setTo] = useState('');
    const [message, updateMessage] = useState('');
    const [uri, setUri] = useState('');
    const [uid, setUid] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');

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
        console.log('to', to);
        console.log('to object', nameMapUid[to]);
        console.log('message', message);
        console.log('from', uid);
        console.log('uri', uri);
        const id = nameMapUid[to]['id'];
        const reactions = {};   //trying to figure this out
        fetch('http://localhost:5000/api/add_kudo',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, id, uid, message, reactions})
        })
        .then(response => console.log(response));
    }

    return (
        <Card style={{width: '600px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSumbit();}}>
                    <Autocomplete
                        id='toField'
                        options={Object.keys(nameMapUid)}
                        getOptionLabel={(option) => option}
                        onChange={(event, newValue) => {
                            setTo(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Send To..." variant="outlined"/>}
                    />
                    <TextField 
                        label='Message' 
                        variant='outlined' 
                        multiline
                        rows={4}
                        value={message}
                        fullWidth
                        onChange={(e) => updateMessage(e.target.value)}
                    />
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={['Nice', 'Hardworking', 'Helpful']}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Multiple values"
                                placeholder="Core values"
                            />
                        )}
                    />
                    <Button type="submit" variant="contained">Submit Kudo</Button>
                </form>
            </CardContent>
        </Card>
    );
}