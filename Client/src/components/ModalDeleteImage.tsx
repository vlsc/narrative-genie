import React, { useState } from "react";
import {
  Button,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import api from "../config/api";

export type RelationParams = {
  id_elem_narr: number | null;
  label: string;
  descricao: string;
  prompt: string;
};

interface ModalDeleteImageProps {
  path: string;
  isOpen: boolean;
  img_path?: string;
  onClose: (saved: boolean, value?: RelationParams) => void;
};

const ModalDeleteImage: React.FC<ModalDeleteImageProps> = ({ isOpen, onClose, img_path, path, ...params }) => {
  const { id } = useParams();
  console.log({id});

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true)
    try{
      const res = await api.delete(`/${path}/waifu/${id}`, {
          data: {img_path: img_path}
      })
      window.location.reload();
    } catch (e) {
      toast({
        title: "Erro ao deletar",
        description: "Tente novamente.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      onClose(true)
    }
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => onClose(false)} size="lg">
      <ModalOverlay
        bg="rgba(0,0,0,0.5)"
        backdropFilter="auto"
        backdropBlur="2px"
      />
      <ModalContent>
        <ModalHeader pb="10px" alignContent={"center"} m="auto">
          {'Tem certeza que deseja deletar a imagem?'}
        </ModalHeader>
        <ModalBody>
          <Flex w="full" justify="center" flexWrap="nowrap" mb="16px">
            <Flex w="full" justify={"center"}>
                <Button
                    borderRadius="xl"
                    bg="#3C6C66"
                    color="white"
                    mr="2"
                    onClick={handleDelete}
                    _hover={{ bg: "#36615C", color: "white" }}
                    _active={{ bg: "#305651", color: "white" }}
                    isLoading={loading}
                >
                Sim
                </Button>
                <Button
                    borderRadius="xl"
                    bg="red.700"
                    color="white"
                    isDisabled={loading}
                    _hover={{ bg: "blue.800", color: "white" }}
                    _active={{ bg: "blue.900", color: "white" }}
                    onClick={() => onClose(false)}
                >
                Não
                </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalDeleteImage;
