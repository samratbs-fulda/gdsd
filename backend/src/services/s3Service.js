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
            // Check if the object exists
            await s3.headObject({ Bucket: params.Bucket, Key: params.Key }).promise();  
            const signedUrl = await s3.getSignedUrlPromise("getObject", params);
            return signedUrl;
        } catch (error) {
            // Return the default image URL
            const defaultParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: "image.webp",
                Expires: expiresIn,
            };
            return s3.getSignedUrlPromise("getObject", defaultParams);
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
                console.log(`No files found. Returning default image.`);
                const defaultParams = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: "image.webp",
                    Expires: expiresIn,
                };
                const defaultSignedUrl = await s3.getSignedUrlPromise("getObject", defaultParams);
                return multiple ? [defaultSignedUrl] : defaultSignedUrl;
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
            return multiple ? signedUrls : signedUrls[0];
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

}

module.exports = new S3Service();