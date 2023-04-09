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

const processImageCreateTopic = () => {
    const exchangeName = "image";
    const routingPattern = "image.upload.#"

    subscribeToTopic(exchangeName, routingPattern, async (data, prop) => {
        console.log("recieved message in processImageCreateTopic");
        const { imageName, imageData, uploadby } = data;

        const base64Image = await convertToBase64(imageData)
        await uploadImage(base64Image, imageName);
        await createImage(imageName, uploadby);
    })
}

const processImageDeleteTopic = () => {
    const exchangeName = "image";
    const routingPattern = "image.delete.#"

    subscribeToTopic(exchangeName, routingPattern, async (data, prop) => {
        console.log("recieved message in processImageDeleteTopic");
        const { imageName } = data;

        const image = await imageRepository.deleteImage(imageName);

        if(image) {
            await deleteLocalImage(image.imagename);
        }
    })
}

const processImageUpdateTopic = () => {
    const exchangeName = "image";
    const routingPattern = "image.create.#"

    subscribeToTopic(exchangeName, routingPattern, async (data, prop) => {
        console.log("recieved message in processImageUpdateTopic");
        const { imageName, imageData, uploadby } = data;

        // Delete old image
        if (imageName) {
            await deleteLocalImage(imageName);
        }
        
        // Upload updated image
        if (imageData) {
            const rawImageData = imageData;
            const binaryData = await convertToBase64(rawImageData);
            const imagename = await uploadImage(binaryData, req.params.imagename);
            console.log(`Image '${imagename}' uploaded successfully.`);
        }
    })
}

const loadAll = async () => {
    console.log("loading all subscribers");
    await processImageCreateTopic();
    await processImageDataRequest();
    await processImageUpdateTopic();
    await processImageDeleteTopic();
    console.log("loaded all subscribers")
}

loadAll();

// console.log("loading all images")
// useImage();
// console.log("loaded all images")