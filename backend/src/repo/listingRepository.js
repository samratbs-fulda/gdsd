const prisma = require("../utils/db");
const { getEnumValue, ApartmentTypeEnum, FurnishedEnum, ListingStatusEnum } = require("../utils/enumUtils");

const zeroDate = new Date(0);

class ListingRepository {

  static async createAmenities(data, listingId, prisma) {
    return await prisma.amenities.create({
      data: {
        listingId: listingId,
        kitchenFitted: data.kitchenFitted,
        petsAllowed: data.petsAllowed,
        parkingAvailable: data.parkingAvailable,
        balconyAvailable: data.balconyAvailable,
        gardenAvailable: data.gardenAvailable,
        wifiAvailable: data.wifiAvailable,
        storageAvailable: data.storageAvailable,
        smokingAllowed: data.smokingAllowed,
        dishWasherAvailalbe: data.dishWasherAvailalbe,
        washingMachineAvailable: data.washingMachineAvailable,
        tvCableIncluded: data.tvCableIncluded,
      },
    });
  }

  static async createDocuments(data, listingId, prisma) {
    return await prisma.documents.create({
      data: {
        listingId: listingId,
        proofOfIncome: data.proofOfIncome,
        proofOfIdentity: data.proofOfIdentity,
        shufaCreditReport: data.shufaCreditReport,
        parentalGuarantee: data.parentalGuarantee,
      },
    });
  }

  // Create Listing along with Amenities and Documents in a transaction
  static async createNewListing(listingData, warmRent) {
    const { amenities, documents, type, furnished } = listingData;
    const status = "PENDING";
    const apartmentType = getEnumValue(ApartmentTypeEnum, type);
    const furnishedStatus = getEnumValue(FurnishedEnum, furnished);
    const listingStatus = getEnumValue(ListingStatusEnum, status);

    // Start the transaction
    const result = await prisma.$transaction(async (prisma) => {
      const newListing = await prisma.listing.create({
        data: {
          landlordId: listingData.landlordId,
          title: listingData.title,
          description: listingData.description,
          type: apartmentType,
          availableFrom: listingData.availableFrom,
          availableTill: listingData.availableTill || zeroDate,
          coldRent: listingData.coldRent,
          deposit: listingData.deposit,
          heatingCost: listingData.heatingCost,
          additionalCosts: listingData.additionalCosts,
          warmRent: warmRent,
          size: listingData.size,
          floor: listingData.floor,
          totalRooms: listingData.totalRooms,
          freeRooms: listingData.freeRooms,
          energyRating: listingData.energyRating,
          furnished: furnishedStatus,
          street: listingData.street,
          postalCode: listingData.postalCode,
          houseNumber: listingData.houseNumber,
          latitude: listingData.latitude || 0,
          longitude: listingData.longitude || 0,
          distanceFromUni: listingData.distanceFromUni,
          status: listingStatus,
        },
      });
      await this.createAmenities(amenities, newListing.id, prisma);
      await this.createDocuments(documents, newListing.id, prisma);

      return newListing;
    });

    return result;
  }

  static async updateListing(newData, warmRent, listingId){
    const { amenities, documents, type, furnished, ...listingData } = newData;
    const status = "PENDING";
    const apartmentType = getEnumValue(ApartmentTypeEnum, type);
    const furnishedStatus = getEnumValue(FurnishedEnum, furnished);
    const listingStatus = getEnumValue(ListingStatusEnum, status);

    listingData["status"] = listingStatus;
    listingData["type"] = apartmentType;
    listingData["furnished"] = furnishedStatus;
    listingData["warmRent"] = warmRent;

    const updatedListing = await prisma.$transaction(async (prisma) => {
      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: listingData,
      });

      if (amenities) {
        await prisma.amenities.update({
          where: { listingId: listingId },
          data: amenities,
        });
      }

      if (documents) {
        await prisma.documents.update({
          where: { listingId: listingId },
          data: documents,
        });
      }

      return updatedListing;
    });

    return updatedListing;
  }
}

module.exports = ListingRepository;
