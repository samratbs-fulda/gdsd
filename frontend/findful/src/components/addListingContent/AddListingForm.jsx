import React, { useState } from "react";
import { Alert, Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Spin, Tooltip, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";


const AddListingForm = ({ onFinish, onFinishFailed, incompleteSubmission, initialValues, pendingSubmission }) => {
  const [form] = Form.useForm();
  
  const { TextArea } = Input;

  const [fileList, setFileList] = useState([]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      requiredMark={false}
    >
      <h2>General</h2>
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title.' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description.' }]}>
        <TextArea />
      </Form.Item>
      <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please enter a size.' }]}>
        <InputNumber suffix="²m" controls={false} min={0}/>
      </Form.Item>
      <Form.Item label="Floor" name="floor" rules={[{ required: true, message: 'Please enter a floor.' }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="Apartment type" name="type"  rules={[{ required: true, message: 'Please select an apartment type.' }]}>
        <Select>
          <Select.Option value="SINGLE">Single</Select.Option>
          <Select.Option value="SHARED">Shared</Select.Option>
          <Select.Option value="SUBLET">Sublet</Select.Option>
        </Select>
      </Form.Item>
      <Tooltip title="The total amount of rooms that the apartment has.">
        <span>
        <Form.Item label="Total amount of rooms" name="totalRooms" rules={[{ required: true, message: 'Please enter a total amount of rooms.' }]}>
          <InputNumber />
        </Form.Item>
        </span>
      </Tooltip>
      <Tooltip title="The amount of rooms rented to a single applicant.">
        <span>
        <Form.Item label="Number of rooms available" name="freeRooms" rules={[{ required: true, message: 'Please enter an amount of free rooms.' }]}>
          <InputNumber />
        </Form.Item>
        </span>
      </Tooltip>
      <Form.Item label="Energy rating" name="energyRating" rules={[{ required: true, message: 'Please enter an energy rating.' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Available from" name="availableFrom" rules={[{ required: true, message: 'Please enter a date for the beginning of the availability.' }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item label="Available till" name="availableTill" rules={[{ required: true, message: 'Please enter a date for the end of the availability.' }]}>
        <DatePicker />
      </Form.Item>

      <h2>Costs</h2>
      <Form.Item label="Cold rent" name="coldRent" rules={[{ required: true, message: 'Please enter a cold rent.' }]}>
        <InputNumber suffix="€" controls={false} min={0} />
      </Form.Item>
      <Form.Item label="Heating costs" name="heatingCost" rules={[{ required: true, message: 'Please enter heating costs.' }]}>
        <InputNumber suffix="€" controls={false} min={0}/>
      </Form.Item>
      <Form.Item label="Additional costs" name="additionalCosts" rules={[{ required: true, message: 'Please enter an additional costs.' }]}>
        <InputNumber suffix="€" controls={false} min={0} />
      </Form.Item>
      <Form.Item label="Deposit" name="deposit" rules={[{ required: true, message: 'Please enter a deposit.' }]}>
        <InputNumber suffix="€" controls={false} min={0}  />
      </Form.Item>

      <h2>Address</h2>
      <Form.Item label="Street" name="street">
        <Input />
      </Form.Item>
      <Form.Item label="Housenumber" name="houseNumber">
        <Input />
      </Form.Item>
      <Form.Item label="Postalcode" name="postalCode">
        <InputNumber />
      </Form.Item>

      <h2>Amenities</h2>
      <Form.Item label="Fitted kitchen available" valuePropName="checked" name={["amenities", "kitchenFitted"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Furniture" name="furnished">
        <Select>
          <Select.Option value="NONFURNISHED">Nonfurnished</Select.Option>
          <Select.Option value="PARTIALLY">Partially furnished</Select.Option>
          <Select.Option value="FURNISHED">Furnished</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Parking available" valuePropName="checked" name={["amenities", "parkingAvailable"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Balcony available" valuePropName="checked" name={["amenities", "balconyAvailable"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Garden available" valuePropName="checked" name={["amenities", "gardenAvailable"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Storage available" valuePropName="checked" name={["amenities", "storageAvailable"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Dishwasher available" valuePropName="checked" name={["amenities", "dishWasherAvailalbe"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Washing machine available" valuePropName="checked" name={["amenities", "washingMachineAvailable"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Wifi available" valuePropName="checked" name={["amenities", "wifiAvailable"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Cable TV included" valuePropName="checked" name={["amenities", "tvCableIncluded"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Pets allowed" valuePropName="checked" name={["amenities", "petsAllowed"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Smoking allowed" valuePropName="checked" name={["amenities", "smokingAllowed"]}>
        <Checkbox />
      </Form.Item>

      <h2>Required documents for applicants</h2>
      <Form.Item label="Proof of income" valuePropName="checked" name={["documents", "proofOfIncome"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Proof of identity" valuePropName="checked" name={["documents", "proofOfIdentity"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Schufa credit report" valuePropName="checked" name={["documents", "shufaCreditReport"]}>
        <Checkbox />
      </Form.Item>
      <Form.Item label="Parental guarantee" valuePropName="checked" name={["documents", "parentalGuarantee"]}>
        <Checkbox />
      </Form.Item>

      <h2>Images</h2>
      
      <Form.Item name="images">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          onPreview={() => {}}
          beforeUpload={() => false}
        >
          <PlusOutlined />
        </Upload>
      </Form.Item>

      {incompleteSubmission && (
        <Alert
        message="Form incomplete"
        type="error"
        closable
      />)}
      
      <Form.Item>
        {!pendingSubmission ?
          (<Button type="primary" htmlType="submit">Submit listing</Button>)
          :
          (<Button type="primary" htmlType="submit" disabled={true}>Submit listing <Spin /></Button>)
        }
      </Form.Item>
    </Form>
  );
};

export default AddListingForm;