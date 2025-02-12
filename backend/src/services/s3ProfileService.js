const AWS = require("aws-sdk");
const BACKEND_URL = `${process.env.FINDFUL_URL}:${process.env.PORT}`;

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class S3ProfileService {

    getProfilePictureKey(userId) {
        return `${process.env.NODE_ENV}/profiles/${userId}/profile.jpg`;
    }

    // Fetch a signed URL for profile picture
    async fetchProfileImage(userId, expiresIn = 3600) {
        const s3Key = `users/${userId}/profile.jpg`;
        try {
            await s3.headObject({ Bucket: process.env.BUCKET_NAME, Key: s3Key }).promise();

            return await s3.getSignedUrlPromise("getObject", {
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Expires: expiresIn,
            });
        } catch (error) {
            console.warn(`⚠️ No profile picture found for user ${userId}. Returning default.`);
            return `${BACKEND_URL}/default_pfp.png`; 
        }
    }

    // Upload a new profile picture
    async uploadProfileImage(userId, imageBase64, imageMimeType) {
        try {
            const imageBuffer = Buffer.from(imageBase64, "base64");
            const s3Key = this.getProfilePictureKey(userId);
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Body: imageBuffer,
                ContentType: imageMimeType,
            };
            console.log(`Uploading profile picture for user ${userId}...`);
            await s3.upload(uploadParams).promise();
            return await s3.getSignedUrlPromise("getObject", {
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key,
                Expires: 3600, 
            });
        } catch (error) {
            console.error(`Error uploading profile picture for user ${userId}:`, error);
            throw error;
        }
    }
}

module.exports = new S3ProfileService();
