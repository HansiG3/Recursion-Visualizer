const express=require('express');
require('dotenv').config();
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
app.use('/api/execute',require('./routes/execution'));
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})