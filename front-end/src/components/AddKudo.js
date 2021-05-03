import { Button, Card, CardContent, Chip, TextField, Grid, Modal, Fade } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    modalCenter: {
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: '0',
    },
});

// props: getKudos, optional: toggleShowAddKudos
export default function AddKudo(props) {
    // need uri, to, from, message
    const [name, setName] = useState('');
    const [kudo, updateKudo] = useState('');
    const [uri, setUri] = useState('');
    const [uid, setUid] = useState('');
    const [nameMapUid, setNameMapUid] = useState('');
    const [coreValues, setCoreValues] = useState(['loading']);
    const [showAddSuccess, toggleShowAddSuccess] = useState(false);
    const [tags, updateTags] = useState('');
    const classes = useStyles();
    
    useEffect(() => {
        if(showAddSuccess) {
          setTimeout(() => toggleShowAddSuccess(false), 1500)
        }
    }, [showAddSuccess])

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
            const filterObject = (obj, filter, filterValue) =>
                Object.keys(obj).reduce((acc, val) =>
                    (obj[val][filter] === filterValue ? acc : {
                        ...acc,
                        [val]: obj[val]
                    }
                ),
            {});
            setNameMapUid(filterObject(data, "id", uid));
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
            //[ {value: "Innovative", color: "hex", active: 1, numTags: 0}, {...}, ... ]
            let active = []
            data.forEach(el => {
                if (el['active'] == 1) {
                    active.push(el)
                }
            })
            setCoreValues(active)
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
            body: JSON.stringify({uri, to, from, kudo, tags})
        })
        .then(response => {
            props.getKudos();
            if (props.toggleShowAddKudo) {
                props.toggleShowAddKudo(false);
            }
            if (props.toggleShowAddSuccess) {
                props.toggleShowAddSuccess(true);
            } else {
                toggleShowAddSuccess(true)
            }
        });
        setName('');
        updateKudo('');
        updateTags([]);
    }

    return (
        <div>
            <Modal
            open={showAddSuccess}
            onClose={() => toggleShowAddSuccess(false)}
            aria-labelledby="report-confirmed"
            aria-describedby="report-kudo"
            >
                <Fade in={showAddSuccess}>
                    <div className={classes.modalCenter}>
                        <Card style={{width: '600px', margin: '10px', backgroundColor: '#00FF00', textAlign: 'center'}} elevation={0}>
                        <h1>Kudo Submitted Succesfully</h1>
                        </Card>
                    </div>
                </Fade>
            </Modal>
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
                                    value={name !== '' ? name : null}
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
                                    id="tags-outlined"
                                    options={coreValues}
                                    getOptionLabel={(option) => option.value}
                                    renderTags={() => (
                                        tags.map((option, index) => (
                                            <Chip
                                            style={{backgroundColor: option.color}}
                                            label={option.value}
                                            key={index}
                                        />
                                        ))
                                    )}
                                    onChange={(event, newValue) => {
                                        updateTags(newValue)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required={tags.length === 0}
                                            variant="outlined"
                                            label="Core Values"
                                            placeholder="Core Values"
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
        </div>
    );
}
