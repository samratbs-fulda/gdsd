import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  message,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Select,
  Spin,
  Tooltip,
  Image,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getSpecialCharacterValidationRule } from "../..//utils/inputValidation";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isJpgOrPng) {
    message.warning("You can only upload JPG/JPEG or PNG files");
    return Upload.LIST_IGNORE;
  }
  return false;
};

const AddListingForm = ({
  onFinish,
  onFinishFailed,
  incompleteSubmission,
  initialValues,
  pendingSubmission,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  //for image upload and preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [availableFrom, setAvailableFrom] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [addressValid, setAddressValid] = useState(true);
  const [validatingAddress, setValidatingAddress] = useState(false);

  const previousValues = useRef({ street: "", houseNumber: "", postalCode: "" });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const transformImages = async () => {
    return Promise.all(
      fileList.map(async (file) => {
        const base64 = await getBase64(file.originFileObj);
        return {
          imageBase64: base64.split(",")[1], // Remove the `data:image/ prefix
          imageMimeType: file.type,
        };
      })
    );
  };

  const validateRooms = (getFieldValue) => ({
    validator(_, value) {
      const totalRooms = getFieldValue("totalRooms");
      const freeRooms = getFieldValue("freeRooms");

      // Validation logic
      if (value !== undefined && totalRooms !== undefined && freeRooms !== undefined) {
        if (freeRooms > totalRooms) {
          return Promise.reject(
            new Error("Number of available rooms cannot exceed the total number of rooms.")
          );
        }
      }
      return Promise.resolve();
    },
  });

  // Validate Address on user input
  const validateAddress = async () => {
    const { street, houseNumber, postalCode } = form.getFieldsValue([
      "street",
      "houseNumber",
      "postalCode",
    ]);
    if (
      street === previousValues.current.street &&
      houseNumber === previousValues.current.houseNumber &&
      postalCode === previousValues.current.postalCode
    ) {
      return;
    }

    previousValues.current = { street, houseNumber, postalCode };
    if (!(street && houseNumber && postalCode)) return;

    setValidatingAddress(true);

    const query = new URLSearchParams({
      "country": "Germany",
      "city": "Fulda",
      "street": street + " " + houseNumber,
      "postalcode": postalCode,
      format: 'json'
    }).toString();

    const url = `https://nominatim.openstreetmap.org/search?${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length === 0) {
        setAddressValid(false);
        message.error("Address not found.");
      } else {
        if (addressValid === false) {
          message.success("Address found.");
        }
        setAddressValid(true);
      }
    } catch (error) {
      console.error("Error validating address:", error);
      message.error("Address validation failed.");
    }
    setValidatingAddress(false);
  };


  const handleAvailableFromChange = (date) => {
    setAvailableFrom(date);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handleSubmit = async (values) => {
    const images = await transformImages();
    onFinish({ ...values, images });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onValuesChange={validateAddress}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      requiredMark={true}
    >
      <h2>General</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title." },
            getSpecialCharacterValidationRule("title")
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description." },
            getSpecialCharacterValidationRule("description")
            ]}
          >
            <TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="Size"
            name="size"
            rules={[{ required: true, message: "Please enter a size." }]}
          >
            <InputNumber suffix="²m" controls={false} min={0} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Floor"
            name="floor"
            rules={[{ required: true, message: "Please enter a floor." }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Apartment type"
            initialValue="SINGLE"
            name="type"
            rules={[
              { required: true, message: "Please select an apartment type." },
            ]}
          >
            <Select>
              <Select.Option value="SINGLE">Single</Select.Option>
              <Select.Option value="SHARED">Shared</Select.Option>
              <Select.Option value="SUBLET">Sublet</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Tooltip title="The amount of rooms rented to a single applicant.">
        <span>
          <Form.Item
            label="Number of rooms available"
            name="freeRooms"
            rules={[
              {
                required: true,
                message: "Please enter an amount of free rooms.",
              },
              ({ getFieldValue }) => validateRooms(getFieldValue),
            ]}
          >
            <InputNumber />
          </Form.Item>
        </span>
      </Tooltip>
      <Tooltip title="The total amount of rooms that the apartment has.">
        <span>
          <Form.Item
            label="Total amount of rooms"
            name="totalRooms"
            rules={[
              {
                required: true,
                message: "Please enter a total amount of rooms.",
              },
              ({ getFieldValue }) => validateRooms(getFieldValue),
            ]}
          >
            <InputNumber />
          </Form.Item>
        </span>
      </Tooltip>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Energy rating"
            name="energyRating"
            rules={[
              { required: true, message: "Please enter an energy rating." },
              getSpecialCharacterValidationRule("energy rating")
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Available from"
            name="availableFrom"
            rules={[
              {
                required: true,
                message:
                  "Please enter a date for the beginning of the availability.",
              },
            ]}
          >
            <DatePicker
              placeholder="Select a date"
              disabledDate={(current) => current && current.isBefore(moment(), 'day')}
              onChange={handleAvailableFromChange}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Available till"
            name="availableTill"
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Select a date"
              disabledDate={(current) =>
                current && current.isBefore(availableFrom, 'day')  // Disable dates before 'Available from'
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <h2>Costs</h2>
      <Form.Item
        label="Cold rent"
        name="coldRent"
        rules={[{ required: true, message: "Please enter a cold rent." }]}
      >
        <InputNumber suffix="€" controls={false} min={0} />
      </Form.Item>
      <Form.Item
        label="Heating costs"
        name="heatingCost"
        rules={[{ required: true, message: "Please enter heating costs." }]}
      >
        <InputNumber suffix="€" controls={false} min={0} />
      </Form.Item>
      <Form.Item
        label="Additional costs"
        name="additionalCosts"
        rules={[
          { required: true, message: "Please enter an additional costs." },
        ]}
      >
        <InputNumber suffix="€" controls={false} min={0} />
      </Form.Item>
      <Form.Item
        label="Deposit"
        name="deposit"
        rules={[{ required: true, message: "Please enter a deposit." }]}
      >
        <InputNumber suffix="€" controls={false} min={0} />
      </Form.Item>

      <h2>Address {validatingAddress && <Spin />}</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Street"
            name="street"
            rules={[{ required: true, message: "Please enter a street." },
            getSpecialCharacterValidationRule("street"),
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Housenumber"
            name="houseNumber"
            rules={[{ required: true, message: "Please enter a housenumber." },
            getSpecialCharacterValidationRule("house number")]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Postalcode"
            name="postalCode"
            rules={[{ required: true, message: "Please enter a postalcode." },
            getSpecialCharacterValidationRule("postal code"),
            { min: 5, message: 'Postalcode must contain 5 numbers.' },
            { max: 5, message: 'Postalcode must contain 5 numbers.' },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <h2>Amenities</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Furniture"
            name="furnished"
            initialValue="FURNISHED"
            rules={[{ required: true, message: "Please choose if your room is furnished or not." }]}
          >
            <Select>
              <Select.Option value="NONFURNISHED">Unfurnished</Select.Option>
              <Select.Option value="PARTIALLY">
                Partially furnished
              </Select.Option>
              <Select.Option value="FURNISHED">Furnished</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Fitted kitchen available"
            valuePropName="checked"
            name={["amenities", "kitchenFitted"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Parking available"
            valuePropName="checked"
            name={["amenities", "parkingAvailable"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Balcony available"
            valuePropName="checked"
            name={["amenities", "balconyAvailable"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Garden available"
            valuePropName="checked"
            name={["amenities", "gardenAvailable"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Storage available"
            valuePropName="checked"
            name={["amenities", "storageAvailable"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Dishwasher available"
            valuePropName="checked"
            name={["amenities", "dishWasherAvailalbe"]}
          >
            <Checkbox />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Washing machine available"
            valuePropName="checked"
            name={["amenities", "washingMachineAvailable"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Wifi available"
            valuePropName="checked"
            name={["amenities", "wifiAvailable"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Cable TV included"
            valuePropName="checked"
            name={["amenities", "tvCableIncluded"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Pets allowed"
            valuePropName="checked"
            name={["amenities", "petsAllowed"]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Smoking allowed"
            valuePropName="checked"
            name={["amenities", "smokingAllowed"]}
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>
      <h2>Required documents for applicants</h2>
      <Form.Item
        label="Proof of income"
        valuePropName="checked"
        name={["documents", "proofOfIncome"]}
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Proof of identity"
        valuePropName="checked"
        name={["documents", "proofOfIdentity"]}
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Schufa credit report"
        valuePropName="checked"
        name={["documents", "shufaCreditReport"]}
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Parental guarantee"
        valuePropName="checked"
        name={["documents", "parentalGuarantee"]}
      >
        <Checkbox />
      </Form.Item>

      <h2>Images (Upto 6)</h2>

      <Form.Item name="images">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={beforeUpload}
        >
          {fileList.length >= 6 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>

      {incompleteSubmission && (
        <Alert message="Form incomplete" type="error" closable />
      )}

      <Form.Item>
        {!pendingSubmission ? (
          <Button type="primary" htmlType="submit">
            Submit listing
          </Button>
        ) : (
          <Button type="primary" htmlType="submit" disabled={true}>
            Submit listing <Spin />
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default AddListingForm;
