import { Grid2 } from '@mui/material';
import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

export default function Domov() {
    return (
        <div>   
            <div className="home-container">
                <Grid2 sx={{lineHeight:0.5}}>
                    <h1>Moderné webové stránky</h1>
                    <p>Dizajn, tvorba, údržba</p>
                </Grid2>
            </div>
        </div>
        
    )
}