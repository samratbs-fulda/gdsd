const Sharp = require('sharp');

async function compressImageToThumbnail(imageBuffer, width = 500, height = 500) {
    try {
      const thumbnailBuffer = await Sharp(imageBuffer)
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