import React, { useState, useEffect } from "react";
import { message, Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import EditListingForm from "../../components/editListingContent/EditListingForm";
import AddListingSuccessful from "../../components/addListingContent/AddListingSuccessful";
import { updateListing, getListingImages, getListingById } from "../../services/listingService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const EditListing = () => {
  const { id } = useParams();
  
  const listingQuery = useQuery({
    queryKey: ["listing", { id }],
    queryFn: async () => getListingById(id),
  });

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (listingQuery.data) {
      console.log(listingQuery.data)
      setInitialValues({
        coldRent: listingQuery.data.coldRent || 0,
        heatingCost: listingQuery.data.heatingCost || 0,
        additionalCosts: listingQuery.data.additionalCosts || 0,
        deposit: listingQuery.data.deposit || 0,
        availableFrom: dayjs(listingQuery.data.availableFrom),
        availableTill: dayjs(listingQuery.data.availableTill),
        description: listingQuery.data.description || "",
        distanceFromUni: listingQuery.data.distanceFromUni || 0,
        energyRating: listingQuery.data.energyRating || "",
        floor: listingQuery.data.floor || 1,
        freeRooms: listingQuery.data.freeRooms || 1,
        furnished: listingQuery.data.furnished || "FURNISHED",
        houseNumber: listingQuery.data.houseNumber || 0,
        latitude: listingQuery.data.latitude || 0,
        longitude: listingQuery.data.longitude || 0,
        postalCode: listingQuery.data.postalCode || "",
        size: listingQuery.data.size || 0,
        status: listingQuery.data.status || "PENDING",
        street: listingQuery.data.street || "",
        title: listingQuery.data.title || "",
        totalRooms: listingQuery.data.totalRooms || 0,
        type: listingQuery.data.type || "SINGLE",
        warmRent: listingQuery.data.warmRent || 0,
        amenities: {
          kitchenFitted: listingQuery.data.amenities?.kitchenFitted || false,
          parkingAvailable: listingQuery.data.amenities?.parkingAvailable || false,
          balconyAvailable: listingQuery.data.amenities?.balconyAvailable || false,
          gardenAvailable: listingQuery.data.amenities?.gardenAvailable || false,
          storageAvailable: listingQuery.data.amenities?.storageAvailable || false,
          dishWasherAvailalbe: listingQuery.data.amenities?.dishWasherAvailalbe || false,
          washingMachineAvailable: listingQuery.data.amenities?.washingMachineAvailable || false,
          wifiAvailable: listingQuery.data.amenities?.wifiAvailable || false,
          tvCableIncluded: listingQuery.data.amenities?.tvCableIncluded || false,
          petsAllowed: listingQuery.data.amenities?.petsAllowed || false,
          smokingAllowed: listingQuery.data.amenities?.smokingAllowed || false,
        },
        documents: {
          proofOfIncome: listingQuery.data.documents?.proofOfIncome || false,
          proofOfIdentity: listingQuery.data.documents?.proofOfIdentity || false,
          shufaCreditReport: listingQuery.data.documents?.shufaCreditReport || false,
          parentalGuarantee: listingQuery.data.documents?.parentalGuarantee || false,
        },
      });
    }
  }, [listingQuery.data]); // Update only when data changes

  const imagesQuery = useQuery({
    queryKey: ["listingId", {id}],
    queryFn: async () => getListingImages(id),
  });

  const listingImages = imagesQuery.data || [];

  const [incompleteSubmission, setIncompleteSubmission] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const submitListing = (values) => {
    setPendingSubmission(true);
    updateListing(values, id)
      .then(() => {
        setPendingSubmission(false);
        setSubmissionDone(true);
      })
      .catch(() => {
        setPendingSubmission(false);
        message.error("Failed to add Listing");
      });
  };

  const submitFailed = () => {
    setIncompleteSubmission(true);
  };

  return (
    <Layout className="page-content-layout" id="dashboard"
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Content className="page-inner-content">
        <h1>Edit Listing</h1>

        {/* Show loading indicator until the listing data is fetched */}
        {listingQuery.isLoading || !initialValues ? (
          <p>Loading...</p>
        ) : !submissionDone ? (
          <EditListingForm
            onFinish={submitListing}
            onFinishFailed={submitFailed}
            incompleteSubmission={incompleteSubmission}
            initialValues={initialValues}
            initialImages={listingImages}
            pendingSubmission={pendingSubmission}
          />
        ) : (
          <AddListingSuccessful />
        )}
      </Content>
    </Layout>
  );
};

export default EditListing;
