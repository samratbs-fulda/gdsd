class Calculations {

    static calculateWarmRent(listingData) {
        return (
          listingData.coldRent + listingData.heatingCost + listingData.additionalCosts
        );
    }
}

module.exports = Calculations;
