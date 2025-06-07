import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

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
import authRoutes from "./routes/authrRoutes";
app.use('/api/auth', authRoutes);

import userRoutes from "./routes/userRoutes";
app.use('/api/users', userRoutes);

app.get('/api', (req: Request, res: Response) => {
    res.send('Hello from HostelHub Server!');
});

app.listen(port, () => {
    console.log(`[SERVER]: Server is running at http://localhost:${port}`);
});