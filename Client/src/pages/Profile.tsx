import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  Image,
  Grid,
  GridItem,
  Text,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { HiPencilAlt } from "react-icons/hi";

import api from "../config/api";

import Header from "../layout/Header";
import { validateUsername, validateEmail, validatePassword } from "../Utils/validators";

const Profile: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [disabled, setDisabled] = useState(true);
  const [changePassword, setChangePassword] = useState(false); // to show the field to change password

  const [passwordChanging, setPasswordChanging] = useState(false);

  const [username, setUsername] = useState(""); // if cancel the action of change
  const [newUsername, setNewUsername] = useState("");

  const [email, setEmail] = useState(""); // if cancel the action of change
  const [newEmail, setNewEmail] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // vericiações no form de baixo:
    // nova senha tem q ser igual a confirmação
    // abre modal de confirmar senha -> se senhas iguais, retorna erro

  useEffect(() => {
    api
      .get("/conta", { params: { email: localStorage.getItem("email") } })
      .then((res) => {
        setUsername(res.data.username);
        setNewUsername(res.data.username);

        setEmail(res.data.email);
        setNewEmail(res.data.email);
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

  const handleCancel = () => {
    setNewEmail(email);
    setNewUsername(username);
    setDisabled(true);
  }

  const checkPasswords = () => {
    setPasswordChanging(true);
    if(newPassword === confirmNewPassword){
      if(!validatePassword(newPassword)){
        toast({
          title: "Senha inválida",
          description: "Precisa possuir pelo menos 6 caracteres",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
  
        return;
      }

      onOpen();
    } else {
      toast({
        title: "As senhas precisam ser iguais",
        description: "Tente novamente",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return;
    }
  }

  const handleAuth = () => {
    api
      .post(`/auth/`, { email: email, password: password })
      .then((res) => {
        if (!passwordChanging) handleChanges();
        if (passwordChanging) handlePasswordChange();
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Senha incorreta",
          description: "Tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
  }

  const handlePasswordChange = () => {
    api
      .put(`/auth/update/`, { email: email, password: newPassword })
      .then((res) => {
        setPasswordChanging(false);
        setChangePassword(false);
        onClose();

        toast({
          title: "Senha atualizada com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
  }

  const handleChanges = () => {
    if(email === newEmail && username === newUsername) {
      setDisabled(true);
      return;
    } else {
      if(!validateUsername(newUsername)){
        toast({
          title: "Erro",
          description: "Username deve possuir ao menos 4 caracteres",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      if(!validateEmail(newEmail)){
        toast({
          title: "Erro",
          description: "Email inválido",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      var form:any = {};

      if(username !== newUsername) form.username = newUsername;
      if(email !== newEmail) form.newEmail = newEmail;

      api
      .put("/conta", { params: { ...form, email: email } })
      .then((res) => {
        localStorage.setItem("email",  res.data.email);

        setEmail(res.data.email);
        setUsername(res.data.username);
        setDisabled(true);

        toast({
          title: "Usuário atualizado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    }
  };

  return (
    <>
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay
          bg="rgba(0,0,0,0.5)"
          backdropFilter="auto"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>
            Confirme sua senha
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            justifyContent="center"
            display="flex"
            flexWrap="nowrap"
            mb="16px"
          >
            <Flex align="center" w="full" direction="column" gap={3}>
              <Input
                maxW="xl"
                onChange={e => setPassword(e.target.value)}
                bg="white"
                type="password"
              />
              <Flex justify="end" w="full" gap={2}>
                <Button
                  borderRadius="xl"
                  bg="#3C6C66"
                  color="white"
                  onClick={() => handleAuth()}
                  _hover={{ bg: "#36615C", color: "white" }}
                  _active={{ bg: "#305651", color: "white" }}
                >
                  Confirmar
                </Button>
                <Button
                  borderRadius="xl"
                  bg="red.700"
                  color="white"
                  onClick={onClose}
                  _hover={{ bg: "red.800", color: "white" }}
                  _active={{ bg: "red.900", color: "white" }}
                >
                  Cancelar
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Header text="Perfil" href="/profile" user={username} />
      <Grid
        w="50%"
        mx="auto"
        my="7"
        h="fit-content"
        bg="rgba(255,255,255,0.3)"
        border="none"
        borderRadius="3xl"
        columnGap={6}
        p="5"
        px="10"
        pb="10"
        templateAreas={`
                  "main main"
                  "footer footer"
                  "divider divider"
                  "end end"
                  "topend topend"`}
        gridTemplateRows={"40px  1fr"}
        gridTemplateColumns={"200px 1fr"}
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem area="main" display="flex" justifyContent="flex-end">
          <Button
            variant="solid"
            bg="none"
            textColor="white"
            fontWeight="regular"
            borderRadius="3xl"
            onClick={disabled ? () => setDisabled(false) : () => {onOpen(); setPasswordChanging(false)}}
          >
            <HiPencilAlt style={{ marginRight: "5px" }} />
            {disabled ? "Editar" : "Salvar"}
          </Button>
          {disabled ? (
            <></>
          ) : (
            <Button
              variant="solid"
              bg="none"
              textColor="white"
              fontWeight="regular"
              borderRadius="3xl"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          )}
        </GridItem>
        <GridItem pl="2" w="full" area={"footer"} margin="auto">
          <Flex align="center" w="full">
            <Text py="3" color="white" fontSize="xl" w="50%">
              Nome de usuário:
            </Text>
            <Input
              value={disabled ? username : newUsername}
              maxW="xl"
              onChange={e => { setNewUsername(e.target.value) }}
              bg="white"
              disabled={disabled}
              _disabled={{
                bg: "none",
                border: "none",
                fontSize: "xl",
                color: "white",
              }}
            />
          </Flex>
          <Flex align="center" w="full">
            <Text py="3" color="white" fontSize="xl" w="50%">
              Email:
            </Text>
            <Input
              value={disabled ? email : newEmail}
              bg="white"
              maxW="xl"
              onChange={e => setNewEmail(e.target.value)}
              disabled={disabled}
              _disabled={{
                bg: "none",
                border: "none",
                fontSize: "xl",
                color: "white",
              }}
            />
          </Flex>
        </GridItem>


        <GridItem area="divider"><Divider my="20px" /></GridItem>


        <GridItem area="topend">
          <Flex justifyContent="flex-end">
            {changePassword ? (
              <>
                <Button
                  variant="solid"
                  bg="none"
                  textColor="white"
                  fontWeight="regular"
                  borderRadius="3xl"
                  onClick={() => checkPasswords()}
                >
                  <HiPencilAlt style={{ marginRight: "5px" }} />
                  Salvar
                </Button>
                <Button
                  variant="solid"
                  bg="none"
                  textColor="white"
                  fontWeight="regular"
                  borderRadius="3xl"
                  onClick={() => setChangePassword(false)}
                >
                  Cancelar
                </Button>
              </>
            ) : (
             <Button
              variant="solid"
              bg="none"
              textColor="white"
              fontWeight="regular"
              borderRadius="3xl"
              onClick={() => setChangePassword(true)}
            >
              <HiPencilAlt style={{ marginRight: "5px" }} />
              Alterar senha
            </Button>
            )}
          </Flex>
        </GridItem>
        { changePassword ? <>
          <GridItem pl="2" w="full" area={"end"} margin="auto">
            <Flex align="center" w="full">
              <Text py="3" color="white" fontSize="xl" w="50%">
                Nova senha:
              </Text>
              <Input
                maxW="xl"
                onChange={e => setNewPassword(e.target.value)}
                bg="white"
                type="password"
                
              />
            </Flex>
            <Flex align="center" w="full">
              <Text py="3" color="white" fontSize="xl" w="50%">
                Confirme a nova senha:
              </Text>
              <Input
                bg="white"
                maxW="xl"
                onChange={e => setConfirmNewPassword(e.target.value)}
                type="password"
              />
            </Flex>
          </GridItem>
        </> : <></> }
      </Grid>
    </>
  );
};

export default Profile;
