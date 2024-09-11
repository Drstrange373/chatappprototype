import { HfInference } from "@huggingface/inference";
import { readFileSync } from 'fs'


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

export async function generateImageCaption(imageFilePath, hfAccessToken) {
    // Read the image file as base64
    const inference = new HfInference(hfAccessToken);
    return await inference.imageToText({
        data: readFileSync(imageFilePath),
        model: 'nlpconnect/vit-gpt2-image-captioning'
    })
}