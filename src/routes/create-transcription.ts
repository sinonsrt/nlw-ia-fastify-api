import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { openai } from '../lib/openai';

export const createTranscriptionRoutes = async (app: FastifyInstance) => {
  app.post('/videos/:videoId/transcription', async (request) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(request.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    const audioVideoStream = createReadStream(video.path);

    const transcription = await openai.audio.transcriptions.create({
      file: audioVideoStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt: prompt,
    });

    await prisma.video.updateMany({
      where: {
        id: videoId,
      },
      data: {
        transcription: transcription.text,
      },
    });

    return transcription.text;
  });
};
