import React, { useState, useEffect } from "react";

import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RiMenuFill } from "react-icons/ri";

import logo from "../assets/logo_img.svg";
import avatar from "../assets/avatar.png";

import { useNavigate } from "react-router-dom";

import api from "../config/api";

interface HeaderProps {
  text?: string;
  href?: string;
  user?: string;
}

const Header: React.FC<HeaderProps> = ({ text, href, user }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("");

  useEffect(() => {
    api
      .get("/conta", { params: { email: localStorage.getItem("email") } })
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((err) => {
        toast({
          title: "Erro no carregamento",
          description: "Tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, []);

  return (
    <Flex
      px="4"
      py="3"
      bg="rgba(0,0,0,0.7)"
      align="center"
      ml="10"
      mr="9"
      mt="5"
      mb="5"
      style={{
        borderRadius: "30px",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.7)",
      }}
    >
      <a href="/">
        <Image src={logo} alt="logo" h="60px" flexShrink={0} />
      </a>
      
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
      <Spacer />
      <Flex gap={1}>
        <Link to="/">
            <Button colorScheme="whiteAlpha" bg="none" borderRadius={"20px"}>Início</Button>
          </Link>
          <Link to="/profile">
            <Button colorScheme="whiteAlpha" bg="none" borderRadius={"20px"}>Perfil</Button>
          </Link>
          <Link to="/worlds">
            <Button colorScheme="whiteAlpha" bg="none" borderRadius={"20px"}>Mundos</Button>
          </Link>
          <Button colorScheme="whiteAlpha" bg="none" borderRadius={"20px"} width="full" onClick={() => {localStorage.removeItem("email"); navigate('/login')}}>
            Sair
          </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
