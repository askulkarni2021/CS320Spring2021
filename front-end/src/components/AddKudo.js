import { Button, Card, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';

export default function AddKudo(props) {
    // need uri, to, from, message
    const [to, setTo] = useState('');
    const [message, updateMessage] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');

    useEffect(() => {
        const uri = localStorage.getItem('uri');
        fetch('http://localhost:5000/api/data/name_map_uid',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: uri
        })
        .then(response => response.json())
        .then(data => {
            setNameMapUid(data);
            console.log(data);
        });
    }, []);

    return (
        <Card>
            <form onSubmit={(e) => {e.preventDefault();}}>
                <Autocomplete
                    id='toField'
                    options={['test1', 'test2', 'test3']}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label="Send To..." variant="outlined" />}
                />
                <TextField 
                    label='Message' 
                    variant='outlined' 
                    multiline
                    rowsMax={5}
                    value={message}
                    onChange={(e) => updateMessage(e.target.value)}
                />
                <Button type="submit" variant="contained">Submit Kudo</Button>
            </form>
        </Card>
    );
}