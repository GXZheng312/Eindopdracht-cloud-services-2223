const amqp = require('amqplib');
const { createImage, getImageByimagename } = require('../repositories/image');
const { handleRPC } = require('../services/rabbitmq');
const { subscribeToTopic } = require('../services/rabbitmq');
const { uploadImage, getImageData, convertToBase64 } = require('../services/image');

const processImageDataRequest = async () => {
    const queueName = "imagedata_request";

    handleRPC(queueName, async (data) => {
        console.log("recieved message in processImageDataRequest");
        const imageObject = await getImageByimagename(data.imagename);

        if(!imageObject) {
            return { message: `Image name: ${data.imagename} doesn't exist.`}
        }

        const imageData = await getImageData(imageObject.imagename);

        return { imageData }
    })
}

const processImageTopic = () => {
    const exchangeName = "image";
    const routingPattern = "image.upload.#"

    subscribeToTopic(exchangeName, routingPattern, async (data, prop) => {
        console.log("recieved message in processImageTopic");
        const { imageName, imageData, uploadby } = data;

        const base64Image = await convertToBase64(imageData)
        await uploadImage(base64Image, imageName);
        await createImage(imageName, uploadby);
    })
}

const loadAll = async () => {
    console.log("loading all subscribers");
    await processImageTopic();
    await processImageDataRequest();
    console.log("loaded all subscribers")
}

loadAll();

// console.log("loading all images")
// useImage();
// console.log("loaded all images")