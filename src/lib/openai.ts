import { OpenAI } from 'openai';

export const openai = new OpenAI({ apiKey: process.env.DATABASE_URL });
