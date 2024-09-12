import { config } from "dotenv";
import { generateAITextResponse, generateImageCaption, getObjectsFromImage, getTextContentFromImage } from "./utils.js";
import cors from 'cors'
import express, { text } from 'express'
import multer from "multer";
import path from 'path'
import { unlink } from "fs/promises";
import { handelError } from "./middleware.js";

config();

const token = process.env.HFTOKEN;
const port = process.env.PORT || 3000;
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Filename
    },

});
const uploads = multer({ storage })


app.use(cors());
app.use(express.json())


app.post('/chatcomplition', async (req, res) => {
    const { messages } = req.body
    if(!messages) return res.status(400).json({message:"No message body"})
    try {
        const response = await generateAITextResponse(messages, token)
        res.json(response.choices[0].message).status(200)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message })
    }
})

app.post('/imageinfo', uploads.single('image'), handelError, async (req, res) => {
    try {
        if (!req.file) return res.json({ message: "Something went wrong" }).status(400)

        //  
        const caption = await generateImageCaption(req.file.path, token)
        const objects = await getObjectsFromImage(req.file.path, token)
        const textInfo = await getTextContentFromImage(req.file.path)

        const responseObject = {
            caption:caption.generated_text,
            objects,
            textInfo:{
                confidence:textInfo.confidence,
                content:textInfo.text
            }
        }

        res.json(responseObject).status(200)
        unlink(req.file.path)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }

})

app.listen(port, () => console.log(`Server running on port ${port}`));



























//  TESTING


// (async function () {
//     // const conversation = [
//     //     { role: 'user', content: 'Hey' },
//     //     { role: 'system', content: 'How can I help you?' },
//     //     {role:'user', content:"What is the best song in English? Pop"}

//     //   ];
//     // const res = await generateAITextResponse(conversation, token)
//     const res = await generateImageCaption('./download.jpeg', token)

//     // const res = await getTextContentFromImage('./download (1).jpeg')

//     // const res = await getObjectsFromImage('./download (1).jpeg', token)
//     console.log(res);

//     // console.log(res.choices[0].message)


// })();
