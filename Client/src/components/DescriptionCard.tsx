import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Image,
  GridItem,
  Grid,
  Text,
  Spinner,
  Textarea,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { HiPencilAlt } from "react-icons/hi";
import { IoReloadCircleOutline, IoArrowBackCircleOutline, IoArrowForwardCircleOutline, IoTrash } from "react-icons/io5";
import { useParams } from "react-router-dom";

import api from "../config/api";
import environment from "../config/environment";
import { WorldParams } from "../pages/Description";
import  ModalImagePrompt from "./ModalImagePrompt";
import ModalDeleteImage from "./ModalDeleteImage";

interface DescriptionCardProps {
  world: WorldParams;
  worldTitle: any;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ world, worldTitle }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(world?.descricao || "");
  const [titleValue, setTitleValue] = useState(world?.nome || "");
  const [backup, setBackup] = useState("");
  const [backupTitle, setBackupTitle] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [index, setIndex] = useState(world.paths_img_capa.length-1 || 0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "",
    title: "",
    index: null,
    value: {
      id_elem_narr: null,
      label: "",
      descricao: "",
      prompt: ""
    }
  });

  const openModal = () => {
    onOpen();
  }

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleTitleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setTitleValue(inputValue);
  };

  const handleEdit = () => {
    setBackup(value);
    setBackupTitle(titleValue);
    setDisabled(false);
  };

  const handleSave = () => {
    setLoading(true);

    api.patch(`/historia/${id}`, {
      nome: titleValue,
      descricao: value,
    }).then(res => {
      setDisabled(true);
      worldTitle(titleValue);
      toast({
        title: "Mundo atualizado",
        description: "As informações foram atualizadas com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }).catch(err => {
      toast({
        title: "Erro na atualização",
        description: "Tente novamente mais tarde",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  const closeModal = (saved: boolean, value?: any) => {
    onClose();
  };

  return (
    <>
    {isOpen && (<ModalImagePrompt
        isOpen
        onClose={closeModal}
        path={"historia"}
        index={modalConfig.index}
      />)}
      {openDeleteModal && (<ModalDeleteImage
        isOpen
        onClose={setOpenDeleteModal}
        path={"historia"}
        img_path={world.paths_img_capa[index]}
      />)}

      <Flex
        direction={"column"}
        h="fit-content"
        overflow="hidden"
        mx="10"
        my="7"
        mr="9"
      >
        <Grid
          h="full"
          bg="rgba(255,255,255,0.2)"
          border="none"
          borderRadius="3xl"
          gridGap={3}
          p="7"
          pt="4"
          templateAreas={`
                  "main main"
                  "nav footer"`}
          gridTemplateRows={"1fr  auto"}
          gridTemplateColumns={"1fr 3fr"}
          color="blackAlpha.700"
          fontWeight="bold"
        >
          <GridItem
            area="main"
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <Button
              size="sm"
              variant="solid"
              bg="none"
              textColor="white"
              fontWeight="regular"
              borderRadius="3xl"
              onClick={() => (disabled ? handleEdit() : handleSave())}
              _hover={{ bg: "blackAlpha.200" }}
              _active={{ bg: "blackAlpha.300" }}
            >
              <HiPencilAlt style={{ marginRight: "5px" }} />
              {disabled ? "Editar" : "Salvar"}
            </Button>
            {disabled ? (
              <></>
            ) : (
              <Button
                size="sm"
                variant="solid"
                bg="none"
                textColor="white"
                fontWeight="regular"
                borderRadius="3xl"
                onClick={() => {
                  setDisabled(true);
                  setValue(backup);
                }}
              >
                Cancelar
              </Button>
            )}
          </GridItem>

          {loading ? (
            <Flex w="full" justify="center" py="10">
              <Spinner color="white" size="lg" />
            </Flex>
          ) : (
            <>
              <GridItem area={"nav"} alignSelf="auto">
                <Image
                  alignSelf="auto"
                  objectFit="cover"
                  borderRadius="2xl"
                  src={environment.API_URL + world?.paths_img_capa[index]}
                  alt="Imagem do mundo"
                  fallbackSrc="https://demofree.sirv.com/nope-not-here.jpg"
                />
                <Flex justify={'space-between'} marginTop={1}>
                  <Flex>
                    <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}} 
                      bg="none" 
                      size="small"
                      onClick={() => {index > 0 ? setIndex(index-1) : setIndex(index)}}
                      isDisabled={index == 0}
                    >
                      <IoArrowBackCircleOutline color="white" size={25} />
                    </Button>
                    <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}}
                      bg="none"
                      size="small"
                      onClick={() => {index !== (world.paths_img_capa.length-1) ? setIndex(index+1) : setIndex(index)}}
                      isDisabled={index == world.paths_img_capa.length-1}
                    >
                      <IoArrowForwardCircleOutline color="white" size={25} />
                    </Button>
                  </Flex>
                  <Flex>
                    <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}} bg="none" size="small" onClick={() => openModal()}>
                      <IoReloadCircleOutline color="white" size={25} />
                    </Button>
                    <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}} bg="none" size="small" onClick={() => setOpenDeleteModal(true)}>
                      <IoTrash color="rgba(140,0,0)" size={20} />
                    </Button>
                  </Flex>
                </Flex>
              </GridItem>
              <GridItem
                pl="2"
                w="full"
                area={"footer"}
                overflowY={disabled ? "scroll" : "hidden"}
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "16px",
                    borderRadius: "8px",
                    backgroundColor: "none",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    borderRadius: "8px",
                    backgroundColor: `rgba(0, 0, 0, 0.8)`,
                  },
                }}
              >
                {disabled ? (
                  <Text py="1" color="white" fontWeight="normal">
                    {value}
                  </Text>
                ) : (
                  <>
                    <Input
                      size="sm"
                      mb="1"
                      value={titleValue}
                      bg="white"
                      w="full"
                      onChange={handleTitleInputChange}
                    />
                    <Textarea
                      value={value}
                      size="sm"
                      bg="white"
                      maxH="87%"
                      h="full"
                      w="full"
                      onChange={handleInputChange}
                      overflowY="scroll"
                      sx={{
                        "&::-webkit-scrollbar": {
                          width: "16px",
                          borderRadius: "8px",
                          backgroundColor: "none",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          borderRadius: "8px",
                          backgroundColor: `rgba(0, 0, 0, 0.8)`,
                        },
                      }}
                    />
                  </>
                )}
              </GridItem>
            </>
          )}
        </Grid>
      </Flex>
    </>
  );
};

export default DescriptionCard;
