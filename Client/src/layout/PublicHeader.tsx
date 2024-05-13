import React from "react";
import {
  Flex,
  Image,
  Heading,
} from "@chakra-ui/react";


import logo from "../assets/logo_img.svg";

interface HeaderProps {
  text?: string;
  href?: string;
}

const PublicHeader: React.FC<HeaderProps> = ({ text, href }) => {
  return (
    <Flex
      px="4"
      py="3"
      bg="rgba(0,0,0,0.7)"
      align="center"
      ml="10"
      mr="9"
      mt="5"
      mb="8"
      justify="center"
      style={{
        borderRadius: "30px",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.7)",
      }}
    >
      <Heading
        pl="4"
        fontSize="50px"
        textColor="white"
        fontFamily="Fondamento"
        fontWeight="regular"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <a href={href ?? "/"}> {text ?? "Narrative Genie"} </a>
      </Heading>

      <a href="/">
        <Image src={logo} alt="logo" h="60px" flexShrink={0} ml="5" mt="-2"/>
      </a>
    </Flex>
  );
};

export default PublicHeader;
