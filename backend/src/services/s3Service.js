const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class S3Service {

    async fetchImage(key, expiresIn = 30) {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Expires: expiresIn,
        };

        try {
            const signedUrl = await s3.getSignedUrlPromise("getObject", params);
            return signedUrl;
        } catch (error) {
            console.error("Error fetching file:", error);
            throw error;
        }
    }

    async uploadImage(imageBase64, imageMimeType, folderKey) {
        try {
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            const guidName = uuidv4();
            const s3Key = `${folderKey}/${guidName}`;
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Body: imageBuffer,
                ContentType: imageMimeType
            };

            const uploadResult = await s3.upload(uploadParams).promise();
            return uploadResult.Location;
        }
        catch (error) {
            console.error("Error adding listing pictures to s3", error);
            throw error;
        }
    }

}

module.exports = new S3Service();