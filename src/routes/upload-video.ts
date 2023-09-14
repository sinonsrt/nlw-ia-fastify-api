import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import { prisma } from '../lib/prisma';

const pump = promisify(pipeline);

export const uploadVideoRoute = async (app: FastifyInstance) => {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25,
    },
  });

  app.post('/videos', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'Missing File Input.' });
    }

    const { file, filename } = data;

    const extension = path.extname(filename);
    console.log({ extension, filename });
    if (extension !== '.mp3') {
      return reply
        .status(400)
        .send({ error: 'Invalid input type, please upload a MP3 file.' });
    }

    const fileBaseName = path.basename(filename, extension);
    const fileUploadedName = `${fileBaseName}-${randomUUID()}${extension}`;
    const uploadDir = path.resolve(__dirname, '../../tmp', fileUploadedName);

    await pump(file, fs.createWriteStream(uploadDir));

    const video = await prisma.video.create({
      data: {
        name: filename,
        path: uploadDir,
      },
    });

    return {
      video,
    };
  });
};
