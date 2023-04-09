const amqp = require('amqplib');
const { createImage, getImageByimagename, deleteImage } = require('../repositories/image');
const { handleRPC } = require('../services/rabbitmq');
const { subscribeToTopic } = require('../services/rabbitmq');
const { uploadImage, getImageData, convertToBase64, deleteLocalImage } = require('../services/image');

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
    const queueName = "image_queue_upload";
    const exchangeName = "image";
    const routingPattern = "image.upload.#"

    subscribeToTopic(exchangeName, routingPattern, queueName, async (data, prop) => {
        console.log("recieved message in processImageCreateTopic");
        const { imageName, imageData, uploadby } = data;

        const base64Image = await convertToBase64(imageData)
        await uploadImage(base64Image, imageName);
        await createImage(imageName, uploadby);
    })
}

const processImageDeleteTopic = () => {
    const queueName = "image_queue_delete";
    const exchangeName = "image";
    const routingPattern = "image.delete.#"

    subscribeToTopic(exchangeName, routingPattern, queueName, async (data, prop) => {
        console.log("recieved message in processImageDeleteTopic");
        const { imageName } = data;

        const image = await deleteImage(imageName);

        if(image) {
            await deleteLocalImage(image.imagename);
        }
    })
}

const processImageUpdateTopic = () => {
    const queueName = "image_queue_update";
    const exchangeName = "image";
    const routingPattern = "image.create.#"

    subscribeToTopic(exchangeName, routingPattern, queueName, async (data, prop) => {
        console.log("recieved message in processImageUpdateTopic");
        const { imageName, imageData, uploadby } = data;

        console.log(imageName);

        if(!imageName || !imageData) {
            return;
        }

        // Delete old image
        if (imageName) {
            await deleteLocalImage(imageName);
        }
        
        // Upload updated image
        if (imageData) {
            const rawImageData = imageData;
            const binaryData = await convertToBase64(rawImageData);
            const newImageName = await uploadImage(binaryData, imageName);
            console.log(`Image '${newImageName}' uploaded successfully.`);
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