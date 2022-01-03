const express = require('express');

const app = express();

app.use(express.json())

const PORT = 8080;

/* output hello word */
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});