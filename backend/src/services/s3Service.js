const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const BACKEND_URL = `${process.env.FINDFUL_URL}:${process.env.PORT}`;

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
            // Check if the object exists
            await s3.headObject({ Bucket: params.Bucket, Key: params.Key }).promise();
            const signedUrl = await s3.getSignedUrlPromise("getObject", params);
            return signedUrl;
        } catch (error) {
            return `${BACKEND_URL}/static/image.webp`;
        }
    }

    async fetchAllImages(folderKey, options = { multiple: true, expiresIn: 30 }) {
        const { multiple, expiresIn } = options;

        try {
            // List objects in the folder
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Prefix: folderKey, // Folder key
            };

            const data = await s3.listObjectsV2(params).promise();

            // Check if there are any objects in the folder
            if (data.Contents.length === 0) {
                console.log(`No files found. Returning default image from ${BACKEND_URL}`);
                const defaultImageUrl = `${BACKEND_URL}/static/image.webp`;
                return multiple ? [defaultImageUrl] : defaultImageUrl;
            }
            const signedUrls = await Promise.all(
                data.Contents.map((file) =>
                    s3.getSignedUrlPromise("getObject", {
                        Bucket: process.env.BUCKET_NAME,
                        Key: file.Key,
                        Expires: expiresIn,
                    })
                )
            );

            // Get thumbnail
            let thumbnail = signedUrls.filter(image => image.includes("/thumbnails/"))[0];
            if (thumbnail == undefined && !multiple) {
                console.log(`No thumbnail found. Returning default image from ${BACKEND_URL}`);
                thumbnail = `${BACKEND_URL}/static/image.webp`;
            }

            // Images without thumbnail
            const filteredImages = signedUrls.filter(image => !image.includes("/thumbnails/"));

            return multiple ? filteredImages : thumbnail;
        } catch (error) {
            console.error(`Error fetching file(s) from folder ${folderKey}:`, error);
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

    async removeImages(imagesToDelete){
        try {
            const deleteParams = {
                Bucket: process.env.BUCKET_NAME,
                Delete: {
                    Objects: imagesToDelete.map(key => ({ Key: key })),
                    Quiet: false
                }
            };

            const deleteResult = await s3.deleteObjects(deleteParams).promise();
            return deleteResult;
        } catch (error) {
            console.error("Error removing listing pictures to s3", error);
            throw error;
        }
    }
}

module.exports = new S3Service();