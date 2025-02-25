require("dotenv-flow").config();
const prisma = require("../utils/db");
const ListingRepository = require("../repo/listingRepository");
const Calculations = require("../utils/calculationUtils");
const S3Service = require("../services/s3Service");
const { compressImageToThumbnail } = require('../utils/imageCompressor');
const axios = require('axios');
const JSZip = require('jszip');
const mime = require('mime-types');
const ListingPositionService = require("./listingPositionService");

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

  async getListingImgs(listingId, multiple) {
    const folderKey = `${process.env.NODE_ENV}/listings/${listingId}/`;
    try {
      const images = await S3Service.fetchAllImages(folderKey, { multiple: multiple });
      if (multiple && listingId < 21) {
        images.shift(); // Remove first image from seed S3 images
      }
      return images;
    } catch (error) {
      console.error(`Error fetching images for listing ${listingId}:`, error);
      return [];
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

      // Fetch images for the listing
      try {
        listing.images = await this.getListingImgs(id, true);
      } catch (error) {
        console.error(`Error fetching images for listing ${id}:`, error);
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
          // Fetch thumbnails for the listings
          let image;
          try {
            image = await this.getListingImgs(listing.id, false);
          } catch (error) {
            console.error(`Error fetching images for listing ${listing.id}:`, error);
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

  async updateListing(listingData, listingId) {
    try {
      const { images, removedImages, ...newData } = listingData;
      const warmRent = Calculations.calculateWarmRent(newData);
      const updatedListing = await ListingRepository.updateListing(newData, warmRent, listingId);

      const folderKey = `${process.env.NODE_ENV}/listings/${listingId}`;
      const thumbnailFolderKey = `${folderKey}/thumbnails`;
      let s3Warning = false;

      // Remove Images
      if (removedImages.length > 0) {
        const imagesToRemove = removedImages.map((img) => {
          return img.split(".amazonaws.com/")[1].split("?")[0];
        });
        console.log("Removing: ", imagesToRemove)
        await S3Service.removeImages(imagesToRemove);
      }

      // Add new images
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
      return updatedListing;
    } catch (error) {
      throw error;
    }
  }

  async addListing(listingData) {
    try {
      const { imagesPacked } = listingData;
      const warmRent = Calculations.calculateWarmRent(listingData);

      // Fetch latitude, longitude and distanceFromUni of listing
      const { latitude, longitude, distanceFromUni } = await ListingPositionService.fetchListingPositionDetails(listingData);
      listingData.latitude = latitude;
      listingData.longitude = longitude;
      listingData.distanceFromUni = distanceFromUni;

      // Create the new listing
      const newListing = await ListingRepository.createNewListing(listingData, warmRent);

      // Add images and a thumbnail to S3
      const listingId = newListing.id;
      const folderKey = `${process.env.NODE_ENV}/listings/${listingId}`;
      const thumbnailFolderKey = `${folderKey}/thumbnails`;
      let s3Warning = false;
      if (imagesPacked) {
        s3Warning = await this.compressAndAddListingImages(imagesPacked, thumbnailFolderKey, folderKey, listingId, s3Warning);
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

  async compressAndAddListingImages(imagesPacked, thumbnailFolderKey, folderKey, listingId, s3Warning) {
    const zipBuffer = Buffer.from(imagesPacked, 'base64');
    const zip = await JSZip.loadAsync(zipBuffer);
    const fileKeys = Object.keys(zip.files); //name of files
    const imageFiles = fileKeys.filter((key) => /\.(jpg|jpeg|png)$/i.test(key));
    if (imageFiles.length > 0) {
      const firstImage = zip.files[imageFiles[0]];
      const firstImageBuffer = await firstImage.async('nodebuffer');
      if (firstImage) {
        const compressedBase64 = await compressImageToThumbnail(firstImageBuffer, 1024, 768);
        await S3Service.uploadImage(compressedBase64, 'image/jpeg', thumbnailFolderKey);
      }
      for (const image of imageFiles) {
        try {
          const imageContent = zip.files[image];
          const imageBuffer = await imageContent.async('nodebuffer');
          await S3Service.uploadImage(imageBuffer.toString('base64'), mime.lookup(image), folderKey);
        } catch (error) {
          console.error(`Error uploading image to S3 for listing ${listingId}:`, error);
          s3Warning = true;
        }
      }
    }
    return s3Warning;
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

  async getRouteForMap(start, end) {
    try {
      const route = await axios.get(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.ORS_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`);
      return route.data;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }

  async getIsochronesForMap(locations, range) {
    try {
      const isochrones = await axios.post("https://api.openrouteservice.org/v2/isochrones/foot-walking",
        {
          locations: locations,
          range: range,
        },
        {
          headers: { Authorization: `Bearer ${process.env.ORS_KEY}` },
        }
      );
      return isochrones.data;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }
}

module.exports = ListingService;
