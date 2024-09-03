const express = require('express');
const app = express();
const port = 3000;
require('./database/db');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRoute');
const taskRouter = require('./routes/taskRoute');
require('dotenv').config();

app.use(cors({
    origin:[process.env.FRONTEND_BASE_URL,],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);


app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});