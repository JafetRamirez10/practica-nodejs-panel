const express = require('express');
const config=require('./server/config');
const app=config(express());
const router = express.Router();
require ('./database');

app.listen(app.get('port'),()=>{

	console.log('Server on port',app.get('port'));
});


