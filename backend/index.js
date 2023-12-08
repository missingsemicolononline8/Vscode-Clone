const connectToMongo = require('./db');
const express = require("express");
const cors = require('cors');
const app = express();
const port = 5000;
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/projects',require('./routes/project'));
connectToMongo()

app.listen(port,() => {
    console.log('Vscode backend listening on port http://localhost:',port)
});
