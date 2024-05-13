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
import PublicHeader from "../layout/PublicHeader";
import { validateEmail, validatePassword, validateUsername } from "../Utils/validators";

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const validateInputs = () => {
    if(!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Tente novamente",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return false;
    }
    if(!validatePassword(password)) {
      toast({
        title: "Senha inválida",
        description: "Deve possuir ao menos 6 caracteres",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return false;
    }

    if(!validateUsername(username)) {
      toast({
        title: "Nome de usuário inválido",
        description: "Deve possuir ao menos 4 caracteres",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return false;
    }

    if(password !== confirmPassword){
      toast({
        title: "As senhas devem ser iguais",
        description: "Tente novamente",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return false;
    }

    return true;
  }

  const handleRegister = () => {
    if(validateInputs()){
      setIsLoading(true);
      api
      .post(`/auth/register/`, { username: username, email: email, password: password })
      .then((res) => {
        localStorage.setItem("email", res.data.email);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Divirta-se!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate(`/`);
      })
      .catch((err) => {
        toast({
          title: "Email já cadastrado",
          description: "Tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <PublicHeader />
      <Flex
      overflow={"hidden"}
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
          Cadastro
        </Heading>
        <Flex mt="5" mb="4" w="container.md" maxW="full" direction={"column"} gap={2}>
        <Flex direction={"column"} m={"auto"} w="70%">
            <Text color={"white"}>Nome de usuário:</Text>
            <Input
              bg="white"
              border="1px solid black"
              color="black"
              placeholder="exemplo"
              m="auto"
              borderRadius="lg"
              h="35px"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Flex>
          <Flex direction={"column"} m={"auto"} w="70%">
            <Text color={"white"}>Email:</Text>
            <Input
              bg="white"
              h="35px"
              border="1px solid black"
              color="black"
              placeholder="email@exemplo.com"
              m="auto"
              borderRadius="lg"
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
          <Flex direction={"column"} m={"auto"} w="70%">
            <Text color={"white"}>Confirme sua senha:</Text>
            <Input
              bg="white"
              border="1px solid black"
              color="black"
              placeholder="********"
              m={"auto"}
              borderRadius="lg"
              h="35px"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={handleRegister}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Cadastrar
          </Button>
        </Flex>
        <Flex gap="2" mb="10px">
          <Text color={"white"}>Já possui conta?</Text>
          <Link href="/login" color="navy">Login</Link>
        </Flex>
      </Flex>
      <Image src={image} w="lg" marginX="auto" marginBottom="3" />
    </>
  );
};

export default Register;
