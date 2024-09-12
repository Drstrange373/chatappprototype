import { HfInference } from "@huggingface/inference";
import { readFileSync } from 'fs'
import fetch from "node-fetch";
import {createWorker} from 'tesseract.js'


const worker = await createWorker('eng')

export async function generateAITextResponse(messages, hfToken) {
    // message of type array of object {role:"System" | "User", content:string}
    const hf = new HfInference(hfToken)
      // Flatten the conversation into a single string
      const out = await hf.chatCompletion({
        model: "google/gemma-2-2b-it",
        messages
      });
      return out
}



//  Image related helpers
export async function generateImageCaption(imageFilePath, hfAccessToken) {

    const inference = new HfInference(hfAccessToken);
    return await inference.imageToText({
        data: readFileSync(imageFilePath),
        model: 'Salesforce/blip-image-captioning-large'
    })
}


export async function getTextContentFromImage(imagePath){
    const ret = await worker.recognize(imagePath)
    return ret.data
}

export async function getObjectsFromImage(imagePath, hfToken){
  const data = readFileSync(imagePath);
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    {
      headers: {
        Authorization: "Bearer "+hfToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: data,
    }
  );
  const result = await response.json();
  return result;

}