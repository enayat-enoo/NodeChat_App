import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import mongoDb from './db/connectToMongoDb.js';
const app = express();
dotenv.config();
const PORT=3000;
app.use(express.json());
app.use('/api/auth',authRoutes);
app.listen(PORT,()=>{
    mongoDb();
    console.log(`Server is running on port ${PORT}`);
})