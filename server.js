require ('dotenv'). config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {console.log('connected to mongoDB')});

app.use(express.json())

const workExperiencesRouter = require('./routes/workExperiences')
app.use('/workExperiences', workExperiencesRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});