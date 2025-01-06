const Sharp = require('sharp');

async function compressImageToThumbnail(imageBase64, width = 1024, height = 768) {
    try {
      const thumbnailBuffer = await Sharp(Buffer.from(imageBase64, 'base64'))
        .resize(width, height, { fit: 'cover', position: 'center' })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toBuffer();
        
      return thumbnailBuffer.toString('base64');
    } catch (error) {
      console.error('Error compressing the thumbnail: ', error);
      throw error;
    }
  }
  
  module.exports = { compressImageToThumbnail };