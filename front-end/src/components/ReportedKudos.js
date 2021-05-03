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
            reports: [],
            columns: [
                { field: 'from', headerName: 'From', width: 130 },
                { field: 'to', headerName: 'To', width: 130 },
                { field: 'message', headerName: 'Message', width: 200 },
                { field: 'time', headerName: 'Time', width: 70 },
                { field: 'reported', headerName: 'Reported By', width: 130 },
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
            if(data){
                //response comes in an array of objects, traverse this to load into the values
                data.forEach(val => {
                    arr.push(val.value);
                });
            }
            console.log(`This is ${arr[0]}`);

            this.setState(() =>{
                return {
                    reports: data,
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
        <div style={{ height: 400, width: '100%'}}>
            <DataGrid rows={this.state.rows} columns={this.state.columns} pageSize={5} checkboxSelection />
                <form onSubmit={(e) => {e.preventDefault(); this.handleSubmit();}}>

                    
                  
                        {console.log(this.state.reports)}

                        {this.state.reports ? this.state.reports.map((tag, index) => {
                                        console.log(tag);
                        }) : null} 
                    
                    
                        

                    {'\n'}

                    {/* <Button type="submit" variant="contained" color="primary" style={{maxWidth: '20px', minWidth: '20px'}} >+</Button> */}


                </form>
                </div>

    );
    }
}
export default ReportedKudos;