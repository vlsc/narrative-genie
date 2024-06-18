import React from "react";
import {
  Flex,
  Button,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

interface ComponentHandlerProps {
  worldId: string | Number | null;
  current?: string;
}

const ElementHeader: React.FC<ComponentHandlerProps> = ({
  worldId,
  current,
}) => {
  const [tab, setTab] = React.useState(current || "Des");

  return (
    <Flex
      px="4"
      py="1"
      bg="rgba(0,0,0,0.5)"
      align="center"
      mx="16"
      style={{
        borderRadius: "30px",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.8)",
      }}
      gap="2"
    >
        <Link to={`/worlds/${worldId}`}>
            <Button
            color="white"
            size="sm"
            fontWeight="normal"
            _hover={{ bg: "rgba(255,255,255, 0.3)" }}
            borderRadius="3xl"
            bg={tab == "Des" ? "rgba(255,255,255, 0.3)" : "none"}
            >
                Descrição
            </Button>
        </Link>
        <Link to={{pathname: `/worlds/${worldId}`, search: "?tab=characters"}}>
            <Button
                size="sm"
                color="white"
                fontWeight="normal"

                _hover={{ bg: "rgba(255,255,255, 0.3)" }}
                borderRadius="3xl"
                bg={tab == "characters" ? "rgba(255,255,255, 0.3)" : "none"}
            >
                Personagens
            </Button>
        </Link>
        <Link to={{pathname: `/worlds/${worldId}`, search: "?tab=places"}}>
            <Button
                size="sm"
                color="white"
                bg={tab == "places" ? "rgba(255,255,255, 0.3)" : "none"}
                fontWeight="normal"
                _hover={{ bg: "rgba(255,255,255, 0.3)" }}
                borderRadius="3xl"
            >
                Lugares
            </Button>
        </Link>
        <Link to={{pathname: `/worlds/${worldId}`, search: "?tab=objects"}}>
            <Button
            size="sm"
            color="white"
            bg={tab == "objects" ? "rgba(255,255,255, 0.3)" : "none"}
            fontWeight="normal"

            _hover={{ bg: "rgba(255,255,255, 0.3)" }}
            borderRadius="3xl"
        >
            Objetos
        </Button>
      </Link>
    </Flex>
  );
};

export default ElementHeader;
