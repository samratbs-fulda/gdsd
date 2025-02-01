require("dotenv-flow").config();
const prisma = require("../utils/db");
const ListingRepository = require("../repo/listingRepository");
const Calculations = require("../utils/calculationUtils");
const S3Service = require("../services/s3Service");
const { compressImageToThumbnail } = require('../utils/imageCompressor');
const axios = require('axios');

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
      
      const folderKey = `${process.env.NODE_ENV}/listings/${id}/`;
      
      try {
        listing.images = await S3Service.fetchAllImages(folderKey, { multiple: true });
        listing.images.pop(); // remove thumbnail from response
      } catch (error) {
        console.error(`Error fetching images for listing ${listing.id}:`, error);
        listing.images = await S3Service.fetchImage("image.webp");
      }
      return listing;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }

  async getFilteredListings(searchText, filters) {
    try {
      // Prepare the filter for the amenities relation
      const amenitiesFilter = filters.amenities ? {
        is: {
          kitchenFitted: filters.amenities.kitchenFitted,
          petsAllowed: filters.amenities.petsAllowed,
          parkingAvailable: filters.amenities.parkingAvailable,
          balconyAvailable: filters.amenities.balconyAvailable,
          gardenAvailable: filters.amenities.gardenAvailable,
          wifiAvailable: filters.amenities.wifiAvailable,
          storageAvailable: filters.amenities.storageAvailable,
          smokingAllowed: filters.amenities.smokingAllowed,
          dishWasherAvailalbe: filters.amenities.dishWasherAvailalbe,
          washingMachineAvailable: filters.amenities.washingMachineAvailable,
          tvCableIncluded: filters.amenities.tvCableIncluded
        }
      } : {};

      const listings = await prisma.listing.findMany({
        where: {
          ...filters,  // Spread the filters (direct fields)
          amenities: amenitiesFilter.is,
          OR: [
            {
              street: {
                contains: searchText,
              },
            },
            {
              postalCode: {
                contains: searchText,
              },
            },
          ],
          status: "APPROVED",
        },
        include: {
          amenities: true, // Include the amenities data in the result
        },
      });
      const listingsWithImages = await Promise.all(
        listings.map(async (listing) => {
          const folderKey = `${process.env.NODE_ENV}/listings/${listing.id}/thumbnails`;
          let image;
          try {
            image = await S3Service.fetchAllImages(folderKey, { multiple: false });
          } catch (error) {
            console.error(`Error fetching image for listing ${listing.id}:`, error);
            image = await S3Service.fetchImage("image.webp");
          }
          return { ...listing, img: image };
        })
      );
      return listingsWithImages;
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
      const listingsWithImages = await Promise.all(
        listings.map(async (listing) => {
          const folderKey = `${process.env.NODE_ENV}/listings/${listing.id}/thumbnails`;
          let image;
          try {
            image = await S3Service.fetchAllImages(folderKey, { multiple: false });
          } catch (error) {
            console.error(`Error fetching image for listing ${listing.id}:`, error);
            image = await S3Service.fetchImage("image.webp");
          }
          return { ...listing, img: image };
        })
      );
      return listingsWithImages;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async getListingsByLandlordId(landlordId, status) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          status: status,
          landlordId: landlordId,
        },
      });
      const listingsWithImages = await Promise.all(
        listings.map(async (listing) => {
          const folderKey = `${process.env.NODE_ENV}/listings/${listing.id}/thumbnails`;
          let image;
          try {
            image = await S3Service.fetchAllImages(folderKey, { multiple: false });
          } catch (error) {
            console.error(`Error fetching image for listing ${listing.id}:`, error);
            image = await S3Service.fetchImage("image.webp");
          }
          return { ...listing, img: image };
        })
      );
      return listingsWithImages;
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

      // Fetch latitude and longitude of listing
      const queryString = new URLSearchParams({
        "country": "Germany", 
        "street": listingData.street + " " + listingData.houseNumber, 
        "postalcode": listingData.postalCode,
        format: 'json'
      }).toString();  

      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?${queryString}`);
        const { lat, lon } = response.data[0];
        listingData.latitude = parseFloat(lat);
        listingData.longitude = parseFloat(lon);
      } catch (error) {
        console.error("Failed to fetch listing position:", error);
        throw error;
      }

      // Fetch distance from uni
      try {
        const response = await axios.get(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.ORS_KEY}&start=9.687715,50.564695&end=${listingData.longitude},${listingData.latitude}`);
        listingData.distanceFromUni = parseFloat((response.data.features[0].properties.segments[0].distance / 1000).toFixed(2));
      } catch (error) {
        console.error("Failed to fetch distance from uni:", error);
        throw error;
      }

      const newListing = await ListingRepository.createNewListing(listingData, warmRent);
      const listingId = newListing.id;
      const folderKey = `${process.env.NODE_ENV}/listings/${listingId}`;
      const thumbnailFolderKey = `${folderKey}/thumbnails`;
      let s3Warning = false;
      if (images && images.length > 0) {
        const firstImage = images[0];
        const { imageBase64 } = firstImage;
        if (firstImage) {
          const compressedBase64 = await compressImageToThumbnail(imageBase64, 1024, 768);
          await S3Service.uploadImage(compressedBase64, 'image/jpeg', thumbnailFolderKey);
        }
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
