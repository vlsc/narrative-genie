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
      <Text
        color="white"
        fontSize="xl"
        fontFamily={"Fondamento"}
        fontWeight="regular"
        flexShrink={0}
      >
        {`Olá, ${user ? user : username}`}
      </Text>

      <Menu>
        <MenuButton
          as={IconButton}
          ml="4"
          aria-label="Menu"
          icon={<RiMenuFill size="20px" />}
          color="white"
          bg="none"
          _hover={{ color: "white", bg: "whiteAlpha.300" }}
          _active={{ color: "white", bg: "whiteAlpha.300" }}
        />
        <MenuList>
          <Link to="/">
            <MenuItem>Início</MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem>Perfil</MenuItem>
          </Link>
          <Link to="/worlds">
            <MenuItem>Mundos</MenuItem>
          </Link>
          <Button padding="0" bg="none" _hover={{color: "none"}} width="full" onClick={() => {localStorage.removeItem("email"); navigate('/login')}}>
            <MenuItem>Sair</MenuItem>
          </Button>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Header;
