import { fastify } from 'fastify';
import { getAllPromptsRoute } from './routes/get-all-prompts';

const app = fastify();

app.register(getAllPromptsRoute);

app.get('/', () => {
  return 'Hello World';
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server is up 🚀!'));
