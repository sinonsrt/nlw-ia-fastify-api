import dotenv from 'dotenv';
import { fastify } from 'fastify';
import { getAllPromptRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';
import { createTranscriptionRoutes } from './routes/create-transcription';
import fastifyCors from '@fastify/cors';

dotenv.config();

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

app.register(getAllPromptRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoutes);

app.get('/', () => {
  return 'Hello World';
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server is up 🚀!'));
