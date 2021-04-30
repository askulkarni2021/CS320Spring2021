import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';

import Plus from '../Plus_symbol.svg';
import {JsonToCsv, useJsonToCsv} from 'react-json-csv';


export default function ExportData(props) {
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
    const {saveAsCsv} = useJsonToCsv();
    const [expData, setExpData] = useState('');
    const [expData2, setExpData2] = useState([{}]);

    

    const filename = 'Csv-file5',
    fields = {
    "given": "Kudos Given",
    "received": "Kudos Recieved",
    "numreact": "Number of Rxns"
    },
    style = {
        padding: "5px"
    },
    data = [
        { index: 0, guid: 'asdf231234'},
        { index: 1, guid: 'wetr2343af'}
      ],
    text = "Convert Json to Csv";


    const handleClick = () => {
        console.info('You clicked the Chip.');
        //let value = label;

        

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
    }, []);

       //Passes the arguments from setUri, setVal, and setColor to the backend
    //Proceeds to then empty the Val string so another value can be added.
    function handleSubmit() {
        console.log('uri', uri);
        
        fetch('http://localhost:5000/api/data/export_data',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, uid})
        })
        .then(response => response.json())
        .then(data => {
            
        })
    }




    return (
        <Card style={{width: '600px', margin: '10px'}}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>

                    <Grid container direction="column" alignItems="flex-start">
                  
                    <Autocomplete
                                id='toField'
                                value={name !== '' ? name : null}
                                options={Object.keys(nameMapUid)}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => {
                                    setName(newValue);
                                }}
                                style={{
                                    maxWidth: '400px',
                                    minWidth: '400px'
                                }}
                                renderInput={(params) => <TextField {...params} required label="Select Employee" variant="outlined"/>}
                            /> 
                    </Grid>
                   
                    {'\n'}

                    {/* /*<JsonToCsv
                        data={data}
                        filename={filename}
                        fields={fields}
                        style={style}
                        text={text}
                    /> */}
                    {console.log(expData)}
                    <Button type="submit" variant="contained" color="primary" style={{maxWidth: '100px', minWidth: '100px', marginTop: '20px'}}>Export Data</Button>
                    <Button onClick={() => saveAsCsv({expData, fields, filename})}>Download Data</Button>

                </form>
            </CardContent>
        </Card>
    );
}