require("dotenv-flow").config();
const prisma = require("../utils/db");
const ListingRepository = require("../repo/listingRepository");
const Calculations = require("../utils/calculationUtils");
const S3Service = require("../services/s3Service");

class ListingService {

  async getAllListings() {
    try {
      const listings = await prisma.listing.findMany();
      const image = await S3Service.fetchImage("image.webp");
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
      listing.amenities = amenities;
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
      const image = await S3Service.fetchImage("image.webp");
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
      const image = await S3Service.fetchImage("image.webp");
      const img = { img: image };
      const newListing = listings.map((listing) => {
        return { ...listing, ...img };
      });
      return newListing;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async getListingsByLandlordId(landlordId) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          landlordId: landlordId,
        },
      });
      const image = await S3Service.fetchImage("image.webp");
      const img = { img: image };
      const newListings = listings.map((listing) => {
        return { ...listing, ...img };
      });
      return newListings;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async updateListingStatus(listingId, status) {
    try {
      const updatedListing = await prisma.listing.update({
        where: {
          id: listingId,
        },
        data: {
          status: status,
        },
      });

      return updatedListing;
    } catch (error) {
      console.error("Error updating listing status:", error);
      throw error;
    }
  }

  async addListing(listingData) {
    try {
      const { images } = listingData;
      const warmRent = Calculations.calculateWarmRent(listingData);
      const newListing = await ListingRepository.createNewListing(listingData, warmRent);
      const listingId = newListing.id;
      const folderKey = `listings/${listingId}`;
      let s3Warning = false;
  
      if (images && images.length > 0) {
        for (const image of images) {
          try {
            const { imageBase64, imageMimeType } = image;
            await S3Service.uploadImage(imageBase64, imageMimeType, folderKey);
          } catch (error) {
            console.error(`Error uploading image to S3 for listing ${listingId}:`, error);
            s3Warning = true;
          }
        }
      }
      return {
        data: newListing,
        warnings: s3Warning,
      };
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
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
