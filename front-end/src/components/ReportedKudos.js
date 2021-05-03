import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect, images } from 'react';
import Chip from '@material-ui/core/Chip';
import Plus from '../Plus_symbol.svg';
import { DataGrid } from '@material-ui/data-grid'

import { makeStyles } from '@material-ui/core/styles';

class ReportedKudos extends React.Component {
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
            uidEmployees: props.employees,
            selection: [],
            reports: [],
            columns: [
                { field: 'from', headerName: 'From', width: 130 },
                { field: 'to', headerName: 'To', width: 130 },
                { field: 'message', headerName: 'Message', width: 200 },
                { field: 'time', headerName: 'Time', width: 100 },
                { field: 'reported', headerName: 'Reported By', width: 170 },
                { field: 'reason', headerName: 'Reason', width: 200 }
            ],
            rows: [
                {id: "1234abc", from: props.employees[1].name, to: props.employees[5].name, message: "Hello World", time: "5:10", reported: props.employees[54].name, reason: "Cuz!"}
            ]
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.useEffect = this.useEffect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.useEffect();
    }
    

    handleDelete (){
        console.info('You clicked the Delete Button for reported Kudos');
        //let value = label;

        let uri = this.state.uri;
        let values = this.state.selection;
        let kid = values[0];

        values.forEach(val => {
            this.state.rows.pop(val);
        })

        console.log(uri);

        fetch('http://localhost:5000/api/data/delete_kudo',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, kid})//this needs to change to allow an array of kudos to be deleted
        })
        .then(response => {
            
            if (response) {
                console.log(response)
            }
        });

        this.setState(() =>{
            return {
                selection: []
            }
        })

    };


    useEffect() {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid;
        const employees = this.state.uidEmployees;
        fetch('http://localhost:5000/api/data/reported_kudo',
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
            if(data && employees){
                //response comes in an array of objects, traverse this to load into the values
                data.forEach(val => {
                    arr.push({id: val._id,
                        from: employees[val.from].name,
                        to: employees[val.to].name, 
                        message: val.kudo, 
                        time: val.time, 
                        reported: employees[val.report[0].by].name, 
                        reason: val.report[0].reason});
                });
            }
            console.log(`This is ${arr[0]}`);

            this.setState(() =>{
                return {
                    rows: arr,
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
        <div style={{ height: 400, width: '90%', marginTop: '50px'}}>
            <Button onClick={() => this.handleDelete()} variant="contained" color="secondary" style={{maxWidth: '100px', minWidth: '100px', marginBottom: '10px'}} >Delete</Button>
            <DataGrid rows={this.state.rows} columns={this.state.columns} autoPageSize checkboxSelection onSelectionModelChange={(selects) => {
                console.log(selects.selectionModel);
                this.setState(() =>{
                    return {
                        selection: selects.selectionModel
                    }
                })
            }}>

            

            </DataGrid>
            

                </div>

    );
    }
}
export default ReportedKudos;