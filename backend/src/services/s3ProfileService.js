const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const BACKEND_URL = `${process.env.FINDFUL_URL}:${process.env.PORT}`;

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class S3Service {

    // Fetch an image 
    async fetchImage(key, expiresIn = 3600) {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Expires: expiresIn,
        };

        try {
            await s3.headObject({ Bucket: params.Bucket, Key: params.Key }).promise();
            return await s3.getSignedUrlPromise("getObject", params);
        } catch (error) {
            console.warn(`No image found for key: ${key}. Returning default.`);
            if (key.includes("/profiles/")) {
                return `${BACKEND_URL}/default_pfp.png`; 
            }
            return `${BACKEND_URL}/static/image.webp`; 
        }
    }

    // Upload image
    async uploadImage(imageBase64, imageMimeType, folderKey, fileName = uuidv4()) {
        try {
            const imageBuffer = Buffer.from(imageBase64, "base64");
            const s3Key = `${folderKey}/${fileName}`;

            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Body: imageBuffer,
                ContentType: imageMimeType,
            };

            console.log(`Uploading image to S3: ${s3Key}`);
            await s3.upload(uploadParams).promise();

            return await s3.getSignedUrlPromise("getObject", {
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Expires: 3600, 
            });
        } catch (error) {
            console.error(`Error uploading image to S3:`, error);
            throw error;
        }
    }
}

module.exports = new S3Service();
