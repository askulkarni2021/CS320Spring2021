import { Button, Card, CardContent, Chip, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';

// props: getKudos, optional: toggleShowAddKudos
export default function AddKudo(props) {
    // need uri, to, from, message
    const [name, setName] = useState('');
    const [kudo, updateKudo] = useState('');
    const [uri, setUri] = useState('');
    const [uid, setUid] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');
    const [coreValues, setCoreValues] = useState(['loading']);

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
        fetch('http://localhost:5000/api/data/get_core_values',
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
            const colors = ['#FF0000', '#FF6600', '#0000FF', '#27b4d8', '#6f4cef', '#bd954e', '#dc6b8c']
            let coloredData = data.map((value, index) => {
                return {value: value, color: colors[index]}
            })
            setCoreValues(coloredData)
        })
    }, []);

    function handleSumbit() {
        const to = nameMapUid[name]['id'];
        const from = uid;
        fetch('http://localhost:5000/api/add_kudo',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, to, from, kudo})
        })
        .then(response => {
            props.getKudos();
            if (props.toggleShowAddKudo) {
                props.toggleShowAddKudo(false);
            }
        });
    }

    return (
        <Card style={{width: '600px', margin: '10px'}} elevation={0}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSumbit();}}>
                    <Grid
                     container
                     direction="column"
                     justify="space-evenly"
                     alignItems="stretch"
                     spacing={1}
                     >
                        <Grid item>
                            <Autocomplete
                                id='toField'
                                options={Object.keys(nameMapUid)}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => {
                                    setName(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} required label="Send To..." variant="outlined"/>}
                            />
                        </Grid>
                        <Grid item>
                            <TextField 
                                required
                                label='Message' 
                                variant='outlined' 
                                multiline
                                rows={4}
                                value={kudo}
                                fullWidth
                                onChange={(e) => updateKudo(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                multiple
                                required
                                id="tags-outlined"
                                options={coreValues}
                                getOptionLabel={(option) => option.value}
                                renderTags={(value, getTagProps) => (
                                    value.map((option, index) => (
                                        <Chip
                                        style={{backgroundColor: option.color}}
                                        label={option.value}
                                        {...getTagProps({index})}
                                       />
                                    ))
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Core Values"
                                        placeholder="Core values"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item container justify='flex-end'>
                            <Button type="submit" variant="contained" color="primary">Submit Kudo</Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}