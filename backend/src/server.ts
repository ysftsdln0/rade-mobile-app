import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './auth.js';
import { userRouter } from './user.js';
import { seed } from './store.js';

dotenv.config();
seed();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter());
app.use('/api', userRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
