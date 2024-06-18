import React, { useState } from "react";
import {
  Button,
  Flex,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

import { useParams, useNavigate } from "react-router-dom";

import api from "../config/api";

export type RelationParams = {
  id_elem_narr: number | null;
  label: string;
  descricao: string;
  prompt: string;
};

interface ModalCreationProps {
  isOpen: boolean;
  onClose: (saved: boolean, value?: RelationParams) => void;
  category: string;
};

const categoryName = (category: string) => {
    if(category === 'characters') return 'personagem'
    else{
        if(category === 'places') return 'lugar'
        else return 'objeto'
    }
}

const categoryApi = (category: string) => {
    if(category === 'characters') return 'personagem'
    else{
        if(category === 'places') return 'lugar'
        else return 'outro'
    }
}

const ModalCreation: React.FC<ModalCreationProps> = ({ isOpen, onClose, category, ...params }) => {
  const { id } = useParams();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');


  const navigate = useNavigate();

  const handleCreate = () => {
    setLoading(true);
    const apiName = categoryApi(category)
    const idHistoria = parseInt(id || "")
  
    api
      .post(`/${apiName}`, { prompt: prompt, id_historia: idHistoria, email: localStorage.getItem("email") })
      .then((res) => {
        setPrompt("");
        navigate(`/${category}/${res.data.id}`);
      })
      .catch((err) => {
        console.log({err})
        toast({
          title: "Erro na criação",
          description: "Tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => onClose(false)} size="xl">
      <ModalOverlay
        bg="rgba(0,0,0,0.5)"
        backdropFilter="auto"
        backdropBlur="2px"
      />
      <ModalContent>
        <ModalHeader pb="10px">
          {"Descreva seu "+ categoryName(category)}
        </ModalHeader>
        <ModalCloseButton onClick={() => onclose} />
        <ModalBody pb="16px">
            <Flex flexDirection="column" gap="2" alignItems="flex-end">
                <Textarea
                    bg="white"
                    border="1px solid black"
                    color="black"
                    placeholder="Digite o que você deseja criar..."
                    w="full"
                    borderRadius="xl"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                    w="80px"
                    borderRadius="xl"
                    bg="#3C6C66"
                    color="white"
                    onClick={handleCreate}
                    _hover={{ bg: "#36615C", color: "white" }}
                    _active={{ bg: "#305651", color: "white" }}
                    isLoading={loading}
                    >
                    Criar
                </Button>
            </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalCreation;
