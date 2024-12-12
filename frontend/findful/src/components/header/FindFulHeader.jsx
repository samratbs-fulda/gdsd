import React from "react";
import "./FindFulHeader.css";
import { Flex, Grid, Layout } from "antd";
import Link from "antd/es/typography/Link";
import { getEnvironment } from "../../utils/fetchEnvironment";
import { Content } from "antd/es/layout/layout";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

const FindFulHeader = () => {
  
  return (
    <>
      <Flex vertical={false} gap={"middle"}>
        <a href="/">FindFul</a>
        <p id="demonstrationNotice">Fulda University of Applied Sciences Software Engineering Project, Fall 2024 For Demonstration Only</p>
      </Flex>
    </>
  );
};

export default FindFulHeader;
