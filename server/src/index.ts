//server/src/index.ts
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authrRoutes';
import userRoutes from "./routes/userRoutes";
import staffRoutes from "./routes/staffRoutes"
import studentRoutes from "./routes/studentRoutes"
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

//routes
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/staff', staffRoutes);

app.use('/api/student', studentRoutes);

app.get('/api', (req: Request, res: Response) => {
    res.send('Hello from HostelHub Server!');
});

app.listen(port, () => {
    console.log(`[SERVER]: Server is running at http://localhost:${port}`);
});