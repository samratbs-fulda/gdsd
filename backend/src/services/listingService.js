require("dotenv-flow").config();
const prisma = require("../utils/db");
const ListingRepository = require("../repo/listingRepository");
const Calculations = require("../utils/calculationUtils");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class ListingService {
  async fetImage(key, expiresIn = 30) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key, // name of the image file
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

  async getAllListings() {
    try {
      const listings = await prisma.listing.findMany();
      console.log(listings)
      const image = await this.fetImage("image.webp");
      const img = { img: image };
      const newListing = listings.map((listing) => {
        return { ...listing, ...img };
      });
      return newListing;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async getListingById(id) {
    try {
      const listing = await prisma.listing.findUnique({
        where: {
          id,
        },
      });

      const [amenities, documents] = await Promise.all([
        this.getAmenitiesByListingId(id),
        this.getDocumentsByListingId(id),
      ]);
      // const amenities = await this.getAmenitiesByListingId(id);
      listing.amenities = amenities;

      // const documents = await this.getDocumentsByListingId(id);
      listing.documents = documents;

      return listing;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }

  async getFilteredListings(filters) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          ...filters,
        },
      });
      const image = await this.fetImage("image.webp");
      const img = { img: image };
      const newListing = listings.map((listing) => {
        return { ...listing, ...img };
      });
      return newListing;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }

  async getListingsByStatus(status) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          status: status,
        },
      });
      const image = await this.fetImage("image.webp");
      const img = { img: image };
      const newListing = listings.map((listing) => {
        return { ...listing, ...img };
      });
      return newListing;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async addListing(listingData) {
    try {
      const warmRent = Calculations.calculateWarmRent(listingData);
      const newListing = await ListingRepository.createNewListing(
        listingData,
        warmRent
      );

      return {
        status: "success",
        message: "Listing created successfully",
        data: newListing,
      };
    } catch (error) {
      console.error("Error adding listing:", error);
      return {
        status: "error",
        message: "Failed to create listing",
      };
    }
  }

  async getAmenitiesByListingId(listingId) {
    try {
      const amenities = await prisma.amenities.findUnique({
        where: {
          listingId,
        },
      });

      return amenities;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }

  async getDocumentsByListingId(listingId) {
    try {
      const documents = await prisma.documents.findUnique({
        where: {
          listingId,
        },
      });

      return documents;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }
}

module.exports = ListingService;
