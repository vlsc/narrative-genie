import db from "../config/db";

export const listarPersonagens = async (id_historia: number) => {
  const personagens = await db.personagem.findMany({
    where: {
      elemento_narrativo: {
        Historia_id_historia: id_historia
      }
    }
  });

  return personagens;
};

export const buscarPersonagem = async (id_elem_narr: number) => {
  const personagem = await db.personagem.findUnique({
    where: {
      id_elem_narr
    },
    include: {
      elemento_narrativo: {
        include: {
          historia: true,
          relacao_relacao_id_elem_narr1Toelemento_narrativo: {
            include: {
              elemento_narrativo_relacao_id_elem_narr2Toelemento_narrativo: {
                include: {
                  personagem: true,
                  outro: true,
                  lugar: true,
                }
              }
            }
          },
          relacao_relacao_id_elem_narr2Toelemento_narrativo: {
            include: {
              elemento_narrativo_relacao_id_elem_narr1Toelemento_narrativo: {
                include: {
                  personagem: true,
                  outro: true,
                  lugar: true,
                }
              }
            }
          }
        }
      },
    }
  });

  return personagem;
};

export const apagarPersonagem = async (id_elem_narr: number) => {
  await db.personagem.delete({
    where: {
      id_elem_narr
    }
  });
};

type PersonagemParams = {
  imagem: string;
  nome: string;
  descricao: string;
  backstory: string;
  personalidade: string;
  especie: string;
  prompt: string;
  imgPrompt: string;
  id_historia: number;
}

export const criarPersonagem = async (personagemParams: PersonagemParams) => {
  const personagem = await db.personagem.create({
    data: {
      imagens: [personagemParams.imagem],
      nome: personagemParams.nome,
      descricao: personagemParams.descricao,
      backstory: personagemParams.backstory,
      personalidade: personagemParams.personalidade,
      especie: personagemParams.especie,
      prompt: personagemParams.prompt,
      imgPrompt: personagemParams.imgPrompt,
      elemento_narrativo: {
        create: {
          tipo: "personagem",
          historia: {
            connect: {
              id_historia: personagemParams.id_historia
            }
          }
        },
      },
    }
  });

  return personagem.id_elem_narr;
};

type AtualizarPersonagemParams = {
  id_elem_narr: number;
  imagem?: string;
  nome?: string;
  descricao?: string;
  backstory?: string;
  personalidade?: string;
  especie?: string;
  prompt?: string;
  imgPrompt?: string;
  personagens?: {
    id_elem_narr: number;
    descricao: string;
    nome_relacao: string;
    prompt: string;
  }[];
  lugares?: {
    id_elem_narr: number;
    descricao: string;
    nome_relacao: string;
    prompt: string;
  }[];
  objetos?: {
    id_elem_narr: number;
    descricao: string;
    nome_relacao: string;
    prompt: string;
  }[];
}

type AdicionarImagemParams = {
  id: number;
  imagem?: string;
  imgPrompt?: string;
}

export const adicionarImagem = async (imageParams: AdicionarImagemParams) => {
  const personagem = await db.personagem.findUnique({
    where: {
      id_elem_narr: imageParams.id
    }
  })

  let imagesArray;
  if (personagem?.imagens) {
    try {
      imagesArray = JSON.parse(personagem?.imagens.toString());
    } catch (e) {
      imagesArray = personagem.imagens;
    }
  } else {
    imagesArray = [];
  }

  if (!Array.isArray(imagesArray)) {
    imagesArray = [imagesArray];
  }

  const newImagesArray = [...imagesArray, imageParams.imagem];

  console.log('New images array:', newImagesArray);
  console.log('New prompt:', imageParams.imgPrompt);

  const newImage = await db.personagem.update({
    where: {
      id_elem_narr: imageParams.id
    },
    data: {
      imagens: newImagesArray,
      imgPrompt: imageParams.imgPrompt?.toString()
    }
  });

  return newImagesArray.length;
};

export const deletarImagem = async (imageParams: AdicionarImagemParams) => {
  const personagem = await db.personagem.findUnique({
    where: {
      id_elem_narr: imageParams.id
    }
  })

  let imagesArray;
  if (personagem?.imagens) {
    try {
      imagesArray = JSON.parse(personagem?.imagens.toString());
    } catch (e) {
      imagesArray = personagem.imagens;
    }
  } else {
    imagesArray = [];
  }

  if (!Array.isArray(imagesArray)) {
    imagesArray = [imagesArray];
  }

  const newImagesArray = imagesArray.filter(image => image !== imageParams.imagem);

  console.log('New images array:', newImagesArray);

  const newImage = await db.personagem.update({
    where: {
      id_elem_narr: imageParams.id
    },
    data: {
      imagens: newImagesArray,
    }
  });

  return newImage;
};

export const atualizarPersonagem = async (personagemParams: AtualizarPersonagemParams) => {
  await db.personagem.update({
    where: {
      id_elem_narr: personagemParams.id_elem_narr
    },
    data: {
      imagens: personagemParams.imagem,
      nome: personagemParams.nome,
      descricao: personagemParams.descricao,
      backstory: personagemParams.backstory,
      personalidade: personagemParams.personalidade,
      especie: personagemParams.especie,
      prompt: personagemParams.prompt,
      imgPrompt: personagemParams.imgPrompt,
    }
  });

  await db.relacao.deleteMany({
    where: {
      OR: [
        { id_elem_narr1: personagemParams.id_elem_narr },
        { id_elem_narr2: personagemParams.id_elem_narr }
      ]
    }
  });

  const relacoes = [
    ...(personagemParams.personagens || []),
    ...(personagemParams.lugares || []),
    ...(personagemParams.objetos || []),
  ];

  await db.relacao.createMany({
    data: relacoes.map(relacao => ({
      id_elem_narr1: personagemParams.id_elem_narr,
      id_elem_narr2: relacao.id_elem_narr,
      descricao: relacao.descricao,
      nome_relacao: relacao.nome_relacao,
      prompt: relacao.prompt,
    }))
  });
};
