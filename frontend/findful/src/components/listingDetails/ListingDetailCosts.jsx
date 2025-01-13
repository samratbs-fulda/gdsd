import React from "react";
import { Row, Col } from "antd";
import Paragraph from "antd/es/typography/Paragraph";

const ListingDetailCosts =  ({costs}) => {
  return (
    <div className="costs">
    <h3>Costs:</h3>
    <Row justify={"start"}>
      <Col>
        <Row>
          <Paragraph>Cold rent:</Paragraph>
        </Row>
        <Row>
          <Paragraph>Heating costs:</Paragraph>
        </Row>
        <Row>
          <Paragraph>Additional costs:</Paragraph>
        </Row>
        <Row>
          <Paragraph>Warm rent:</Paragraph>
        </Row>
        <Row>
          <Paragraph>Deposit:</Paragraph>
        </Row>
      </Col>
      <Col offset={1}>
        <Row>
          <Paragraph>{costs.coldRent}€</Paragraph>
        </Row>
        <Row>
          <Paragraph>+ {costs.heatingCost}€</Paragraph>
        </Row>
        <Row>
          <Paragraph className="last-cost-element">+ {costs.additionalCosts}€</Paragraph>
        </Row>
        <Row>
          <Paragraph>{costs.warmRent}€</Paragraph>
        </Row>
        <Row>
          <Paragraph>{costs.deposit}€</Paragraph>
        </Row>
      </Col>
    </Row>
  </div>
  );
};

export default ListingDetailCosts;