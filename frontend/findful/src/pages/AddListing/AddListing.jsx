import React, { useState, useEffect } from "react";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";import AddListingForm from "../../components/addListingContent/AddListingForm";
import AddListingSuccessful from "../../components/addListingContent/AddListingSuccessful";
import { addListing } from "../../services/listingService";

const AddListing = () => {
  const [incompleteSubmission, setIncompleteSubmission] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const submitListing = (values) => {
    setPendingSubmission(true);

    addListing(values).then(() => {
      setPendingSubmission(false);
      setSubmissionDone(true);
    }) 
  };

  const submitFailed = () => {
    setIncompleteSubmission(true);
  };

  useEffect(() => { }, []);

  const initialValues = {
    coldRent: 0,
    heatingCost: 0,
    additionalCosts: 0,
    deposit: 0,
    amenities: {
      kitchenFitted: false,
      parkingAvailable: false,
      balconyAvailable: false,
      gardenAvailable: false,
      storageAvailable: false,
      dishWasherAvailalbe: false,
      washingMachineAvailable: false,
      wifiAvailable: false,
      tvCableIncluded: false,
      petsAllowed: false,
      smokingAllowed: false,
    },
    documents: {
      proofOfIncome: false,
      proofOfIdentity: false,
      shufaCreditReport: false,
      parentalGuarantee: false,
    },
  };


  return (
    <Layout className='page-content-layout' id='dashboard'
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Content className='page-inner-content'>
        <h1>Add a listing</h1>

        {!submissionDone ?
          (<AddListingForm
            onFinish={submitListing}
            onFinishFailed={submitFailed}
            incompleteSubmission={incompleteSubmission}
            initialValues={initialValues}
            pendingSubmission={pendingSubmission}
          />)
          :
          (<AddListingSuccessful />)
        }
      </Content>
    </Layout>

  );
};

export default AddListing;
