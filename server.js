import * as dotenv from 'dotenv';
// allows us to access the environment variables defined in the .env
dotenv.config();


/*

##### Old method for openAI initialization pre v4 #####
@see: https://github.com/openai/openai-node/discussions/217
// initialize the OpenAI SDK
import { Configuration, OpenAIApi } from 'openai';

// create a configuration Object that requires apiKey
const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});

// use our configuration Object to initialize the OpenAI SDK
const openai = new OpenAIApi(configuration);

*/

/* New Initialization Method OpenAi v4+ */
import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI
});


// import express.js server
import express from 'express';
// cool thing about express.js is for every request we can apply middleware --> cors
import cors from 'cors';

const app = express();
// use the Cross Origin Resource Sharing i.e., cors as a security mechanism
app.use(cors());
//middleware to tell our API that we only want to handle incoming data in a JSON format
app.use(express.json());

/*
    Create our first endpoint
    using an HTTP method like GET, POST, PATCH, etc.
*/
/*
    POST is the best option bc we're creating new a piece of data
    POST method takes two arguments:
    
    (1) string representing the URL of the API --> '/dream'
    (2) callback function that has a response & request Object

*/
app.post('/dream', async function(req, res){
    // we want to access the prompt, the text description that the user wants to generate
try {    
    
    const prompt = req.body.prompt;

    // call the openAi API & pass our prompt to the createImage() method
        /* *NOTE await keyword is used here to 'wait' / pause execution of this function until openAI to finish generating an image based on our prompt* */
    /* ######## OLD IMG GENERATION FORMAT ######### 
            const aiResponse = await openai.createImage({
            model: 'dall-e-3',
            prompt,
            // number of imgs we want to generate per request
            n: 1,
            // img resolution
            size: '1024x1024',
        });
    */

    /* v4+ image generate method */
    const aiResponse = await openai.images.generate({
        model: 'dall-e-2',
        prompt,
        n: 1,
        size: '1024x1024',
    });
    
    // when openAI is 'done' generating an image it will give us the response Object that contains the image URL
    /* v3 syntax --> const image = aiResponse.data.data[0].url;  */
    const image = aiResponse.data[0].url;

    
    // with the image URL available from the aiResponse above when need to send it back to the client as a response
    // this is done by calling the .send() on the res (aka, response) Object
    res.send({ image });

    } catch (error){
        // best practice is to log the error
        console.error(error);
        res.status(500).send(error?.error.message || `Something went wrong, it's probably Ai's fault.`);
    }

    // the client or browser will recieve this image data as JSON
});

// 🔥 fire up the server
// call app.listen(PORT_TO_USE)

app.listen(8080, function(){console.log('make art on http://localhost:8080/dream')});

