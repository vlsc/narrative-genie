import React, { useState } from "react";
import {
  Button,
  Flex,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import api from "../config/api";

export type RelationParams = {
  id_elem_narr: number | null;
  label: string;
  descricao: string;
  prompt: string;
};

interface ModalImagePromptProps {
  path: string;
  index: number | null;
  isOpen: boolean;
  onClose: (saved: boolean, value?: RelationParams) => void;
};

const ModalImagePrompt: React.FC<ModalImagePromptProps> = ({ isOpen, onClose, path, index, ...params }) => {
  const { id } = useParams();
  console.log({id})

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [descricao, setDescricao] = useState("");
  const [generateNew, setGenerateNew] = useState(false);

  const handleSubmit = async () => {
    setLoading(true)
    try{
      const res = await api.patch(`/${path}/waifu/`, {
          descricao: descricao.toString(),
          id: id,
      })
      window.location.reload();
    } catch (e) {
      toast({
        title: "Erro na criação",
        description: "Não foi possível gerar a nova imagem. Tente novamente.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      onClose(true)
    }
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => onClose(false)} size="xl">
      <ModalOverlay
        bg="rgba(0,0,0,0.5)"
        backdropFilter="auto"
        backdropBlur="2px"
      />
      <ModalContent>
        <ModalHeader pb="10px">
          {generateNew ? 'Gerar uma nova descrição' : 'Gerar uma nova imagem'}
        </ModalHeader>
        <ModalCloseButton onClick={() => onclose} />
        <ModalBody>
          <Flex w="full" justify="center" flexWrap="nowrap" mb="16px">
            { !generateNew && <Flex w="full" justify={"center"}>
                <Button
                    borderRadius="xl"
                    bg="#3C6C66"
                    color="white"
                    mr="2"
                    onClick={handleSubmit}
                    _hover={{ bg: "#36615C", color: "white" }}
                    _active={{ bg: "#305651", color: "white" }}
                    isLoading={loading}
                >
                Utilizar a mesma descrição
                </Button>
                <Button
                    borderRadius="xl"
                    bg="blue.700"
                    color="white"
                    isDisabled={loading}
                    _hover={{ bg: "blue.800", color: "white" }}
                    _active={{ bg: "blue.900", color: "white" }}
                    onClick={() => setGenerateNew(true)}
                >
                Gerar uma nova descrição
                </Button>
            </Flex>}
            {generateNew && 
            <Input
              bg="white"
              border="1px solid black"
              color="black"
              placeholder="Descreva a imagem que você deseja criar"
              ml="2"
              w="full"
              borderRadius="xl"

              onChange={(e) => setDescricao(e.target.value)}
            />}
          </Flex>
          {generateNew && <Flex w="full" my="16px">
            <Spacer />
            <Button
              borderRadius="xl"
              bg="#3C6C66"
              color="white"
              mr="2"
              onClick={handleSubmit}
              _hover={{ bg: "#36615C", color: "white" }}
              _active={{ bg: "#305651", color: "white" }}
              isLoading={loading}
            >
              {index !== null ? "Atualizar" : "Criar"}
            </Button>
            <Button
              borderRadius="xl"
              bg="red.700"
              color="white"
              _hover={{ bg: "red.800", color: "white" }}
              _active={{ bg: "red.900", color: "white" }}
              onClick={() => onClose(false)}
            >
              Cancelar
            </Button>
          </Flex>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalImagePrompt;
