import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Image,
  GridItem,
  Grid,
  Text,
  Textarea,
  Tag,
  Input,
  useToast,
  useDisclosure,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { HiPencilAlt, HiOutlineChevronDown, HiTrash } from "react-icons/hi";
import { useParams } from "react-router-dom";

import api from "../config/api";
import environment from "../config/environment";
import Header from "../layout/Header";
import ModalList from "../components/ModalList";
import ModalRelation, { RelationParams } from "../components/ModalRelation";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline, IoReloadCircleOutline, IoTrash } from "react-icons/io5";
import ModalImagePrompt from "../components/ModalImagePrompt";
import ModalDeleteImage from "../components/ModalDeleteImage";
import ElementHeader from "../components/ElementHeader";

type RelatedParams = {
  personagens: RelationParams[],
  lugares: RelationParams[],
  objetos: RelationParams[],
  personalidade: string[],
  //caracteristicas: string[],
};

type CharacterParams = {
  id_elem_narr: number;
  nome: string;
  descricao: string;
  backstory: string;
  personalidade: string;
  especie: string;
  imagens: string[];
  elemento_narrativo: {
    historia: {
      id_historia: number;
      nome: string;
    };
  };
};

const relatedKeyToPath: Record<string, string> = {
  personagens: "personagem",
  objetos: "outro",
  lugares: "lugar",
};

const Character: React.FC = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<CharacterParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(character?.descricao || "");
  const [titleValue, setTitleValue] = useState(character?.nome || "");
  const [related, setRelated] = useState<RelatedParams>({
    personagens: [],
    lugares: [],
    objetos: [],
    personalidade: [],
    //caracteristicas: [],
  });
  const [backup, setBackup] = useState("");
  const [backupTitle, setBackupTitle] = useState("");
  const [backupRelated, setBackupRelated] = useState<RelatedParams>({
    personagens: [],
    lugares: [],
    objetos: [],
    personalidade: [],
    //caracteristicas: [],
  });
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
  const [listConfig, setListConfig] = useState({
    type: "",
    title: "",
    index: null,
    value: ""
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenList, onOpen: onOpenList, onClose: onCloseList } = useDisclosure();
  const toast = useToast();
  const [imgIndex, setImgIndex] = useState(0);
  const [length, setImgLength] = useState(0);

  useEffect(() => {
    api.get(`/personagem/${id}`).then((res) => {
      setCharacter(res.data.character);
      setValue(res.data.character.backstory);
      setTitleValue(res.data.character.nome);
      const length = res.data.character.imagens.length-1
      setImgIndex(length)
      setImgLength(length);

      const elemento_narrativo = res.data.character.elemento_narrativo;

      const personagens1 = elemento_narrativo?.relacao_relacao_id_elem_narr1Toelemento_narrativo?.filter((relacao: any) =>
        relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo.tipo === "personagem"
      ).map((relacao: any) => ({
        id_elem_narr: relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo.id_elem_narr,
        label: relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo["personagem"].nome,
        descricao: relacao.descricao,
        prompt: relacao.prompt,
      })) || [];

      const personagens2 = elemento_narrativo?.relacao_relacao_id_elem_narr2Toelemento_narrativo?.filter((relacao: any) =>
        relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo.tipo === "personagem"
      ).map((relacao: any) => ({
        id_elem_narr: relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo.id_elem_narr,
        label: relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo["personagem"].nome,
        descricao: relacao.descricao,
        prompt: relacao.prompt,
      })) || [];

      const lugares1 = elemento_narrativo?.relacao_relacao_id_elem_narr1Toelemento_narrativo?.filter((relacao: any) =>
        relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo.tipo === "lugar"
      ).map((relacao: any) => ({
        id_elem_narr: relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo.id_elem_narr,
        label: relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo["lugar"].nome,
        descricao: relacao.descricao,
        prompt: relacao.prompt,
      })) || [];

      const lugares2 = elemento_narrativo?.relacao_relacao_id_elem_narr2Toelemento_narrativo?.filter((relacao: any) =>
        relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo.tipo === "lugar"
      ).map((relacao: any) => ({
        id_elem_narr: relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo.id_elem_narr,
        label: relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo["lugar"].nome,
        descricao: relacao.descricao,
        prompt: relacao.prompt,
      })) || [];

      const objetos1 = elemento_narrativo?.relacao_relacao_id_elem_narr1Toelemento_narrativo?.filter((relacao: any) =>
        relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo.tipo === "outro"
      ).map((relacao: any) => ({
        id_elem_narr: relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo.id_elem_narr,
        label: relacao.elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo["outro"].nome,
        descricao: relacao.descricao,
        prompt: relacao.prompt,
      })) || [];

      const objetos2 = elemento_narrativo?.relacao_relacao_id_elem_narr2Toelemento_narrativo?.filter((relacao: any) =>
        relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo.tipo === "outro"
      ).map((relacao: any) => ({
        id_elem_narr: relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo.id_elem_narr,
        label: relacao.elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo["outro"].nome,
        descricao: relacao.descricao,
        prompt: relacao.prompt,
      })) || [];

      setRelated(related => ({
        ...related,
        personagens: [...personagens1, ...personagens2],
        lugares: [...lugares1, ...lugares2],
        objetos: [...objetos1, ...objetos2],
        personalidade: res.data.character.personalidade.split(","),
        //caracteristicas: res.data.character.descricao.split(","),
      }));
      setLoading(false);
    }).catch(err => {
      toast({
        title: "Erro no carregamento",
        description: "Tente novamente mais tarde",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    });
  }, []);

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleTitleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setTitleValue(inputValue);
  };

  const capitalize = (string: string) => {
    return <text>{string[0].toUpperCase() + string.substring(1)}</text>;
  };

  const handleEdit = () => {
    setBackup(value);
    setBackupTitle(titleValue);
    setBackupRelated(related);
    setDisabled(false);
  };

  const handleSave = () => {
    setLoading(true);
    setDisabled(true);

    api.patch(`/personagem/${id}`, {
      nome: titleValue,
      backstory: value,
      personalidade: related.personalidade.join(","),
      //descricao: related.caracteristicas.join(","),
      personagens: related.personagens.map((personagem: any) => ({ ...personagem, nome_relacao: "Relação" })),
      lugares: related.lugares.map((personagem: any) => ({ ...personagem, nome_relacao: "Relação" })),
      objetos: related.objetos.map((objeto: any) => ({ ...objeto, nome_relacao: "Relação" })),
    }).then(res => {
      toast({
        title: "Personagem atualizado",
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

  const openModalList = (params: any) => {
    setListConfig({ ...params });

    onOpenList();
  };

  const closeModalList = (saved: boolean, value?: string) => {
    if (saved) {
      setRelated(related => {
        // @ts-ignore
        const newRelated = [...related[listConfig.type]];

        if (listConfig.index !== null) {
          newRelated[listConfig.index] = value;
        } else {
          newRelated.push(value);
        }
        
        return {
          ...related,
          [listConfig.type]: newRelated
        };
      });
    }

    onCloseList();
  };

  const openModal = (params: any) => {
    setModalConfig({ ...params });

    onOpen();
  };

  const closeModal = (saved: boolean, value?: RelationParams) => {
    if (saved) {
      setRelated(related => {
        // @ts-ignore
        const newRelated = [...related[modalConfig.type]];

        if (modalConfig.index !== null) {
          newRelated[modalConfig.index] = value;
        } else {
          newRelated.push(value);
        }
        
        return {
          ...related,
          [modalConfig.type]: newRelated
        };
      });
    }

    onClose();
  };

  const removeRelated = (type: string, index: number) => {
    setRelated(related => {
      // @ts-ignore
      const newRelated = [...related[type]];

      newRelated.splice(index, 1);

      return {
        ...related,
        [type]: newRelated
      };
    });
  };

  const story = character?.elemento_narrativo.historia;
  const relatedIds = related.personagens.map( p => p.id_elem_narr).concat(related.lugares.map( p => p.id_elem_narr), related.objetos.map( p => p.id_elem_narr))
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openImgModal, setOpenImgModal] = useState(false);

  const closeImageModal = () => {
    setOpenImgModal(false);
  }

  return (
    <>
      {openImgModal && (<ModalImagePrompt
        isOpen
        onClose={closeImageModal}
        path={"personagem"}
        index={modalConfig.index}
      />)}
      {openDeleteModal && (<ModalDeleteImage
        isOpen
        onClose={setOpenDeleteModal}
        path={"personagem"}
        img_path={character?.imagens[imgIndex]}
      />)}

      {isOpen && (<ModalRelation
        isOpen
        onClose={closeModal}
        path={relatedKeyToPath[modalConfig.type] || ""}
        storyId={story?.id_historia || 0}
        type={modalConfig.type}
        title={modalConfig.title}
        index={modalConfig.index}
        value={modalConfig.value}
        elemCategory="personagem"
        elemName={character?.nome || "Nome"}
        related={relatedIds}
      />)}
      {isOpenList && (<ModalList
        isOpen
        onClose={closeModalList}
        type={listConfig.type}
        title={listConfig.title}
        index={listConfig.index}
        value={listConfig.value}
      />)}
      <Header text={story?.nome || "Carregando..."} href={`/worlds/${story?.id_historia}`} />
      <ElementHeader current="characters" worldId={character?.elemento_narrativo.historia.id_historia || 0} />
      <Flex
        direction={"column"}
        h="fit-content"
        align="center"
        overflow="hidden"
        m="10"
        mr="5"
      >
        <Grid
          w="full"
          h="full"
          bg="rgba(0,0,0,0.4)"
          border="none"
          borderRadius="3xl"
          overflowY={"scroll"}
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
          gridGap={3}
          p="7"
          pt="5"
          pb="10"
          templateAreas={`
                  "main main"
                  "nav footer"
                  "tags tags"`}
          gridTemplateRows={"1fr  auto 2fr"}
          gridTemplateColumns={"1fr 3fr"}
          color="blackAlpha.700"
          fontWeight="bold"
        >
          <GridItem
            area="main"
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
            gap="2"
          >
            <Button
              size="sm"
              variant="solid"
              bg="none"
              textColor="white"
              fontWeight="regular"
              borderRadius="3xl"
              onClick={() => (disabled ? handleEdit() : handleSave())}
              _hover={{ bg: "whiteAlpha.200" }}
              _active={{ bg: "whiteAlpha.300" }}
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
                  setTitleValue(backupTitle);
                  setRelated(backupRelated);
                }}
                _hover={{ bg: "whiteAlpha.200" }}
                _active={{ bg: "whiteAlpha.300" }}
              >
                Cancelar
              </Button>
            )}
          </GridItem>

          <GridItem area={"nav"} alignSelf="auto">
            <Image
              alignSelf="auto"
              objectFit="cover"
              borderRadius="2xl"
              src={environment.API_URL + character?.imagens[imgIndex]}
              alt="Lugar"
              fallbackSrc="https://demofree.sirv.com/nope-not-here.jpg"
            />
            <Flex justify={'space-between'} marginTop={1}>
              <Flex>
                <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}} 
                  bg="none" 
                  size="small"
                  onClick={() => {imgIndex > 0 ? setImgIndex(imgIndex-1) : setImgIndex(imgIndex)}}
                  isDisabled={imgIndex === 0}
                >
                  <IoArrowBackCircleOutline color="white" size={25} />
                </Button>
                <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}}
                  bg="none"
                  size="small"
                  onClick={() => {imgIndex < length ? setImgIndex(imgIndex+1) : setImgIndex(imgIndex)}}
                  isDisabled={imgIndex === length}
                >
                  <IoArrowForwardCircleOutline color="white" size={25} />
                </Button>
              </Flex>
              <Flex>
                <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}} bg="none" size="small">
                  <IoReloadCircleOutline color="white" size={25} onClick={() => setOpenImgModal(true)} />
                </Button>
                <Button _hover={{bg:'rgba(255, 255, 255, 0.3)'}} bg="none" size="small" onClick={() => setOpenDeleteModal(true)} >
                  <IoTrash color="rgba(140,0,0)" size={20} />
                </Button>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem
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
              <>
                <Text color="white">
                  {titleValue}
                </Text>
                <Text color="white" fontWeight="normal">
                  {value}
                </Text>
              </>
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
                  size="sm"
                  value={value}
                  bg="white"
                  w="full"
                  maxH="87%"
                  h="full"
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
          <GridItem area={"tags"} alignSelf="flex-start" mt="2">
            {Object.entries(related).map(([key, value]) => (
              <Text color="white" fontSize="md">
                {capitalize(key)}:{" "}
                {value.map((v, i) => (
                  <Tag
                    m="2px"
                    fontWeight="bold"
                    fontSize="sm"
                    borderRadius="xl"
                    color="orange.600"
                  >
                    <>
                      {["personalidade"].includes(key) ? (
                        v
                      ) : (
                        <Tooltip hasArrow label={(v as RelationParams).descricao} placement="top">
                          {(v as RelationParams).label}
                        </Tooltip>
                      )}
                      {!disabled && (
                        <>
                          <Icon
                            as={HiPencilAlt}
                            ml="2"
                            cursor="pointer"
                            _hover={{ color: "orange.700" }}
                            _active={{ color: "orange.800" }}
                            onClick={() => ["personalidade"].includes(key) ? openModalList({
                              title: capitalize(key),
                              type: key,
                              index: i,
                              value: v,
                            }) : openModal({
                              title: capitalize(key),
                              type: key,
                              index: i,
                              value: v,
                            })}
                          />
                          <Icon
                            as={HiTrash}
                            ml="1"
                            cursor="pointer"
                            _hover={{ color: "orange.700" }}
                            _active={{ color: "orange.800" }}
                            onClick={() => removeRelated(key, i)}
                          />
                        </>
                      )}
                    </>
                  </Tag>
                ))}
                {!disabled && (
                  <Tag
                    m="2px"
                    fontWeight="bold"
                    fontSize="md"
                    borderRadius="xl"
                    color="white"
                    bg="whiteAlpha.600"
                    cursor="pointer"
                    _hover={{ bg: "whiteAlpha.700" }}
                    _active={{ bg: "whiteAlpha.700" }}
                    onClick={() => ["personalidade"].includes(key) ? openModalList({
                      title: capitalize(key),
                      type: key,
                      index: null,
                      value: "",
                    }) : openModal({
                      title: capitalize(key),
                      type: key,
                      index: null,
                      value: {
                        id_elem_narr: null,
                        label: "",
                        descricao: "",
                        prompt: ""
                      },
                    })}
                  >
                    +
                  </Tag>
                )}
              </Text>
            ))}
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
};

export default Character;
