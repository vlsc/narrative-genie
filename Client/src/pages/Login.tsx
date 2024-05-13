import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Image,
  useToast,
  Link
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import api from "../config/api";
import LoginHeader from "../layout/PublicHeader";
import { validateEmail, validatePassword } from "../Utils/validators";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const { pathname } = location;

  const validateInputs = () => {
    return validateEmail(email) && validatePassword(password);
  }

  const handleLogin = () => {
    setIsLoading(true);
    validateInputs();

    api
      .post(`/auth/`, { email: email, password: password })
      .then((res) => {
        localStorage.setItem("email", res.data.email);
        console.log('entrou no login')
        console.log(localStorage.getItem("email"))
        if(pathname != '/login') {
          window.location.reload();
        }
        else{
          navigate(`/`);
        }
        
      })
      .catch((err) => {
        toast({
          title: "Email ou senha incorreto/a",
          description: "Tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <LoginHeader />
      <Flex
        w="30%"
        maxWidth={"1000px"}
        m="auto"
        px="6"
        py="7"
        direction="column"
        align="center"
        justify="center"
        bg="rgba(255,255,255,0.2)"
        borderRadius="30px"
        boxShadow="0px 10px 30px rgba(0, 0, 0, 0.5)"
      >
        <Heading as="h1" color="white" fontWeight={"regular"}>
          Login
        </Heading>
        <Flex mt="10" mb="4" w="container.md" maxW="full" direction={"column"} gap={4}>
          <Flex direction={"column"} m={"auto"} w="70%">
            <Text color={"white"}>Email:</Text>
            <Input
              bg="white"
              border="1px solid black"
              color="black"
              placeholder="email@exemplo.com"
              m="auto"
              borderRadius="lg"
              h="35px"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Flex>

          <Flex direction={"column"} m={"auto"} w="70%">
            <Text color={"white"}>Senha:</Text>
            <Input
              bg="white"
              border="1px solid black"
              color="black"
              placeholder="********"
              m={"auto"}
              borderRadius="lg"
              h="35px"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Flex>

          <Button
            m="auto"
            mt="20px"
            mb="10px"
            w="70%"
            bg="black"
            color="white"
            _hover={{ bg: "#4e4a44" }}
            _active={{ bg: "#4e4a44" }}
            borderRadius="lg"
            h="35px"
            fontWeight={"regular"}
            onClick={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Entrar
          </Button>
        </Flex>
        <Flex gap="2" mb="10px">
          <Text color={"white"}>Não possui conta?</Text>
          <Link href="/register" color="navy">Cadastre-se</Link>
        </Flex>
      </Flex>
      <Image src={image} w="lg" marginX="auto" marginBottom="3" />
    </>
  );
};

export default Login;
