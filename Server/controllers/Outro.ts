import db from "../config/db";

export const listarOutros = async (id_historia: number) => {
  const outros = await db.outro.findMany({
    where: {
      elemento_narrativo: {
        Historia_id_historia: id_historia
      }
    }
  });

  return outros;
};

export const buscarOutro = async (id_elem_narr: number) => {
  const outro = await db.outro.findUnique({
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

  return outro;
};

export const apagarOutro = async (id_elem_narr: number) => {
  await db.outro.delete({
    where: {
      id_elem_narr
    }
  });
};

type OutroParams = {
  imagem: string;
  nome: string;
  descricao: string;
  prompt: string;
  imgPrompt: string;
  id_historia: number;
}

export const criarOutro = async (outroParams: OutroParams) => {
  const outro = await db.outro.create({
    data: {
      imagens: [outroParams.imagem],
      nome: outroParams.nome,
      descricao: outroParams.descricao,
      prompt: outroParams.prompt,
      imgPrompt: outroParams.imgPrompt,
      elemento_narrativo: {
        create: {
          tipo: "outro",
          historia: {
            connect: {
              id_historia: outroParams.id_historia
            }
          }
        },
      },
    }
  });

  return outro.id_elem_narr;
};

type AtualizarOutroParams = {
  id_elem_narr: number;
  imagem?: string;
  nome?: string;
  descricao?: string;
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
  const outro = await db.outro.findUnique({
    where: {
      id_elem_narr: imageParams.id
    }
  })

  let imagesArray;
  if (outro?.imagens) {
    try {
      imagesArray = JSON.parse(outro?.imagens.toString());
    } catch (e) {
      imagesArray = outro.imagens;
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

  const newImage = await db.outro.update({
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
  const outro = await db.outro.findUnique({
    where: {
      id_elem_narr: imageParams.id
    }
  })

  let imagesArray;
  if (outro?.imagens) {
    try {
      imagesArray = JSON.parse(outro?.imagens.toString());
    } catch (e) {
      imagesArray = outro.imagens;
    }
  } else {
    imagesArray = [];
  }

  if (!Array.isArray(imagesArray)) {
    imagesArray = [imagesArray];
  }

  const newImagesArray = imagesArray.filter(image => image !== imageParams.imagem);

  console.log('New images array:', newImagesArray);

  const newImage = await db.outro.update({
    where: {
      id_elem_narr: imageParams.id
    },
    data: {
      imagens: newImagesArray,
    }
  });

  return newImage;
};

export const atualizarOutro = async (outroParams: AtualizarOutroParams) => {
  await db.outro.update({
    where: {
      id_elem_narr: outroParams.id_elem_narr
    },
    data: {
      imagens: outroParams.imagem,
      nome: outroParams.nome,
      descricao: outroParams.descricao,
      prompt: outroParams.prompt,
      imgPrompt: outroParams.imgPrompt,
    }
  });
  
  await db.relacao.deleteMany({
    where: {
      OR: [
        { id_elem_narr1: outroParams.id_elem_narr },
        { id_elem_narr2: outroParams.id_elem_narr }
      ]
    }
  });

  const relacoes = [
    ...(outroParams.personagens || []),
    ...(outroParams.lugares || []),
    ...(outroParams.objetos || []),
  ];

  await db.relacao.createMany({
    data: relacoes.map(relacao => ({
      id_elem_narr1: outroParams.id_elem_narr,
      id_elem_narr2: relacao.id_elem_narr,
      descricao: relacao.descricao,
      nome_relacao: relacao.nome_relacao,
      prompt: relacao.prompt,
    }))
  });
};
