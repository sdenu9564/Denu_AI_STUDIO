import { Response } from "express";
import { sendHttpResponse } from "../utils/sendHttpResponse";
import path from "path";
import fs from 'fs';
import * as GenerationQuries from "../prismaQueries/images.queries";
import constant from '../config/constants'; 




export const createGeneration = async (req: any, res: Response) => {
  try {
    const { prompt, style } = req.body;
   const {id} = req.user;
    const file = req.file;
    if (!file) {
    return sendHttpResponse(res, 'Please Upload an Image!', {}, 400, false)
}

    if (!file) {
      return res.status(400).json({ message: 'Image upload required' });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
    if (constant?.NODE_ENV !== 'test') {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      if (Math.random() < 0.2) {
        return res.status(503).json({ message: 'Model overloaded. Please try again.' });
      }
    }
    const originalsDir = path.join(__dirname, '../../uploads/originals');
    const generatedDir = path.join(__dirname, '../../uploads/generated');
    fs.mkdirSync(generatedDir, { recursive: true });

    const imageName = file.filename;
    const generatedImageName = `generated-${imageName}`;

    // Simulate “generated image” by copying original to generated folder
    fs.copyFileSync(
      path.join(originalsDir, imageName),
      path.join(generatedDir, generatedImageName)
    );
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/originals/${imageName}`;
    const generatedImageUrl = `${baseUrl}/uploads/generated/${generatedImageName}`;

   const generation = await GenerationQuries.createGenerationQuery({
        prompt,
        style,
        imageUrl,
        generatedImageUrl,
        status: 'completed',
        userId : id,
    });

    sendHttpResponse(res, "Success", {
        id: generation.id,
        prompt: generation.prompt,
        style: generation.style,
        imageUrl: generation.imageUrl,
        generatedImageUrl: generation.generatedImageUrl,
        createdAt: generation.createdAt,
        status: generation.status,
    })
  } catch (err: any) {
    console.error(
        'err ------------ createGeneration -------- generation.controller.ts',
        err
    );
    sendHttpResponse(res, 'Failed to generate Image', {}, 500, false)
  }
};


export const getImages = async(req: any, res : Response) : Promise<void> => {
    try {
        const userId = req.user.id;
        const images = await GenerationQuries.getUserGenerationsQuery(userId);
        sendHttpResponse(res, 'Success', images)

    } catch (err) {
        console.error(
            'err --------- getImages------------ generation.controller.ts',
            err
        );
        sendHttpResponse(res, 'Failed to fetch Images', {}, 500, false);
    }
}