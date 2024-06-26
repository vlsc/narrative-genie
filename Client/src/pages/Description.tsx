import React, { useState, useEffect } from "react";
import { Flex, Spinner, useToast } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";

import api from "../config/api";
import DescriptionCard from "../components/DescriptionCard";
import WorldHeader from "../components/WorldHeader";
import CategoriesList from "../components/CategoriesList";
import Header from "../layout/Header";

export type CharacterParams = {
  id_elem_narr: number;
  nome: string;
  descricao: string;
  backstory: string;
  personalidade: string;
  especie: string;
  imagens: string[];
  created_at: any;
  updated_at: any;
};

export type ObjectParams = {
  id_elem_narr: number;
  nome: string;
  descricao: string;
  imagens: string[];
  created_at: any;
  updated_at: any;
};

export type PlaceParams = {
  id_elem_narr: number;
  nome: string;
  descricao: string;
  riqueza: number;
  saude: number;
  seguranca: number;
  agua: number;
  imagens: string[];
  created_at: any;
  updated_at: any;
};

export type NarrativeElementParams = {
  id_elem_narr: number;
  Historia_id_historia: number;
  tipo: "personagem" | "lugar" | "outro";
  personagem: CharacterParams | null;
  lugar: PlaceParams | null;
  outro: ObjectParams | null;
  created_at: any;
  updated_at: any;
};

export type WorldParams = {
  id_historia: number;
  nome: string;
  descricao: string;
  paths_img_capa: string[];
  email_escritor: string;
  elemento_narrativo: NarrativeElementParams[];
  created_at: any;
  updated_at: any;
};

const Description: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [world, setWorld] = useState<WorldParams | null>(null);
  const toast = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState("");
  const [worldTitle, setWorldTitle] = useState("")

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');
  const [current, setCurrent] = useState(tab || "Des");

  useEffect(() => {
    fetchWorld();
  }, []);

  const fetchWorld = () => {
    setLoading(true);
    api
      .get(`/historia/${id}`)
      .then((res) => {
        setWorld(res.data.story);
        setLoading(false);
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
  };

  const onEdit = (newCurrent: any) => {
    setCurrent(newCurrent);
  };

  const onDelete = (id: number) => {
    api
      .delete(`/elemento-narrativo/${id}`)
      .then((res) => {
        fetchWorld();
      })
      .catch((err) => {
        toast({
          title: "Erro ao apagar",
          description: "Tente novamente mais tarde",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const chooseTab = () => {
    if (loading) {
      return (
        <Flex w="full" justify="center" py="10">
          <Spinner color="white" size="lg" />
        </Flex>
      );
    } else if (current === "Des") {
      return <DescriptionCard world={world as WorldParams} worldTitle={setWorldTitle} />;
    } else {
      let items: CharacterParams[] | PlaceParams[] | ObjectParams[] = [];

      if (current === "characters") {
        items = (world?.elemento_narrativo
          .filter((elem) => elem.tipo === "personagem")
          .map((elem) => elem.personagem) || []) as CharacterParams[];
      } else if (current === "places") {
        items = (world?.elemento_narrativo
          .filter((elem) => elem.tipo === "lugar")
          .map((elem) => elem.lugar) || []) as PlaceParams[];
      } else if (current === "objects") {
        items = (world?.elemento_narrativo
          .filter((elem) => elem.tipo === "outro")
          .map((elem) => elem.outro) || []) as ObjectParams[];
      }

      return (
        <CategoriesList
          category={current}
          items={formattedData(items)}
          onDelete={onDelete}
        />
      );
    }
  };

  const searchString = (data: string) => {
    setSearchValue(data.toLowerCase());
  };

  const classification = (data: string) => {
    setSort(data);
  };

  const filteredData = (
    items: CharacterParams[] | PlaceParams[] | ObjectParams[]
  ) => {
    let filteredItems = items.filter((i) => i.nome.toLowerCase().indexOf(searchValue) > -1);

    return filteredItems;
  };

  const sortedData = (
    items: CharacterParams[] | PlaceParams[] | ObjectParams[]
  ) => {
    switch (sort) {
      case "Nome":
        items = items.sort(function (a, b) {
          if (a.nome < b.nome) return -1;
          if (a.nome > b.nome) return 1;
          return 0;
        });
        return items;
        case "Mais antigo":
          items = items.sort(function (a, b) {
            if (a.created_at < b.created_at) return -1;
            else if (a.created_at > b.created_at) return 1;
            return 0;
          });
          return items;
        case "Mais novo":
          items = items.sort(function (a, b) {
            if (a.created_at < b.created_at) return 1;
            else if (a.created_at > b.created_at) return -1;
            return 0;
          });
          return items;
        case "Última atualização":
          items = items.sort(function (a, b) {
            if (a.updated_at < b.updated_at) return 1;
            else if (a.updated_at > b.updated_at) return -1;
            return 0;
          });
          return items;
    }
    return items;
  };

  const formattedData = (
    items: CharacterParams[] | PlaceParams[] | ObjectParams[]
  ) => {
    let newItems: any;

    newItems = filteredData(items);
    newItems = sortedData(newItems);
    return newItems;
  };

  return (
    <Flex direction={"column"} h="full" w="full" alignSelf={"center"}>
      <Header text={worldTitle || world?.nome || "Carregando..."} href="/worlds" />
      <WorldHeader
        current={current}
        onEdit={onEdit}
        searchString={searchString}
        classification={classification}
      />
      {chooseTab()}
    </Flex>
  );
};

export default Description;
