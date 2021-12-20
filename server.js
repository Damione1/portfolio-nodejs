require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('connected to mongoDB') });

app.use(express.json())
app.use(cors());

const workExperiencesRouter = require('./routes/workExperiences')
app.use('/api/workExperiences', workExperiencesRouter)

const qualificationsRouter = require('./routes/qualifications')
app.use('/api/qualifications', qualificationsRouter)

const userRouter = require('./routes/users')
app.use('/api/user', userRouter)

const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)

app.listen(4001, () => {
    console.log('Server is running on port 4001');
});