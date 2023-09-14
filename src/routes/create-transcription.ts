import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export const createTranscriptionRoutes = async (app: FastifyInstance) => {
  app.post('/videos/:videoId/transcription', async (request) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = paramsSchema.parse(request.params);
  });
};
