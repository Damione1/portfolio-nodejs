require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.options('*', cors());
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
mongoose.set('strictQuery', false);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('connected to mongoDB') });

app.use(express.json())

app.get('/', (req, res) => {
    res.send(`Hi! The API is working !`)
});


const workExperiencesRouter = require('./routes/workExperiences')
app.use('/workExperiences', workExperiencesRouter)

const qualificationsRouter = require('./routes/qualifications')
app.use('/qualifications', qualificationsRouter)

const projectsRouter = require('./routes/projects')
app.use('/projects', projectsRouter)

const blogPostsRouter = require('./routes/blogPosts')
app.use('/blogPosts', blogPostsRouter)

const skillsRouter = require('./routes/skills')
app.use('/skills', skillsRouter)

const uploadRouter = require('./routes/fileUploads')
app.use('/upload', uploadRouter)

const userRouter = require('./routes/users')
app.use('/user', userRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const publicRouter = require('./routes/public')
app.use('/public', publicRouter)

const optionsRouter = require('./routes/options')
app.use('/options', optionsRouter)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
