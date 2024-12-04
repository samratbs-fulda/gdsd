require("dotenv-flow").config();
const prisma = require("../utils/db");

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION, 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class SearchService {
  async fetImage(key, expiresIn = 30){
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key, // name of the image file
      Expires: expiresIn,
    };
  
    try {
      const signedUrl = await s3.getSignedUrlPromise('getObject', params);
      return signedUrl;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async getAllListings() {
    try {
      const listings = await prisma.listing.findMany();
      const image = await this.fetImage('image.webp');
      const img = {"img": image};
      const newListing = listings.map((listing) => {
        return {...listing, ...img};
      });
      return newListing;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async getListingsByApartmentType(apartment_type, postal_code) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          apartment_type: apartment_type,
          postcode: postal_code
        }
      });
      const image = await this.fetImage('image.webp');
      const img = {"img": image};
      const newListing = listings.map((listing) => {
        return {...listing, ...img};
      });
      return newListing;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async getListingsByStatus(status) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          status: status,
        },
      });
      const image = await this.fetImage('image.webp');
      const img = {"img": image};
      const newListing = listings.map((listing) => {
        return {...listing, ...img};
      });
      return newListing;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }
}

module.exports = SearchService;
