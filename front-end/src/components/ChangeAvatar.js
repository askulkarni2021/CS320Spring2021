import { Button, Card, CardContent, Chip, TextField, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

// props: getKudos, optional: toggleShowAddKudos
export default function ChangeAvatar(props) {
    // need uri, to, from, message
    const [avatar, setAvatar] = useState('');
    const avatarArray = [props.pic1, props.pic2];
    
    const imageMapper = avatarArray.map((image, index) => {
        return (
            <img src={image}
                onClick={() => props.handleSubmitAvatar(image)} 
                style={{height: '60px', width: '60px', marginRight: '20px',}}
            />
        );
    })
    return (
        <Card style={{width: '600px', margin: '10px'}} elevation={0}>
            <CardContent>
                <Grid>
                    {imageMapper}
                    <Grid item container justify='flex-end'>
                        <Button type="submit" variant="contained" color="primary"
                        onClick={() => props.closeAvatarModal()}>Change Avatar</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
