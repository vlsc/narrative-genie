import db from "../config/db";

export const listarHistorias = async (email: string) => {
  const historias = await db.historia.findMany({
    where: {
      /* conta: {
        email
      } */
      email_escritor: email
    }
  });

  return historias;
};

export const buscarHistoria = async (id_historia: number) => {
  const historia = await db.historia.findUnique({
    where: {
      id_historia
    },
    include: {
      elemento_narrativo: {
        include: {
          personagem: true,
          lugar: true,
          outro: true,
        }
      }
    }
  });

  return historia;
};

export const apagarHistoria = async (id_historia: number) => {
  await db.historia.delete({
    where: {
      id_historia
    }
  });
};

type HistoriaParams = {
  nome: string;
  descricao: string;
  path_img_capa: string;
  prompt: string;
  imgPrompt: string;
  email: string;
}

export const criarHistoria = async (historiaParams: HistoriaParams) => {
  const historia = await db.historia.create({
    data: {
      nome: historiaParams.nome,
      descricao: historiaParams.descricao,
      paths_img_capa: [historiaParams.path_img_capa],
      prompt: historiaParams.prompt,
      imgPrompt: historiaParams.imgPrompt,
      conta: {
        connect: {
          email: historiaParams.email
        }
      }
    }
  });

  return historia.id_historia;
};

type AtualizarHistoriaParams = {
  id_historia: number;
  nome?: string;
  descricao?: string;
  path_img_capa?: string;
  prompt?: string;
  imgPrompt?: string;
}

export const atualizarHistoria = async (historiaParams: AtualizarHistoriaParams) => {
  const historia = await db.historia.update({
    where: {
      id_historia: historiaParams.id_historia
    },
    data: {
      nome: historiaParams.nome,
      descricao: historiaParams.descricao,
    }
  });

  return historia;
};

type AdicionarImagemParams = {
  id_historia: number;
  path_img_capa?: string;
  imgPrompt?: string;
}

export const adicionarImagem = async (historiaParams: AdicionarImagemParams) => {
  const historia = await db.historia.findUnique({
    where: {
      id_historia: historiaParams.id_historia
    }
  })

  let imagesArray;
  if (historia?.paths_img_capa) {
    try {
      imagesArray = JSON.parse(historia?.paths_img_capa.toString());
    } catch (e) {
      imagesArray = historia.paths_img_capa;
    }
  } else {
    imagesArray = [];
  }

  if (!Array.isArray(imagesArray)) {
    imagesArray = [imagesArray];
  }

  const newImagesArray = [...imagesArray, historiaParams.path_img_capa];

  console.log('New images array:', newImagesArray);
  console.log('New prompt:', historiaParams.imgPrompt);

  const newHistoria = await db.historia.update({
    where: {
      id_historia: historiaParams.id_historia
    },
    data: {
      paths_img_capa: newImagesArray,
      imgPrompt: historiaParams.imgPrompt?.toString()
    }
  });

  return newImagesArray.length;
};

export const deletarImagem = async (historiaParams: AdicionarImagemParams) => {
  const historia = await db.historia.findUnique({
    where: {
      id_historia: historiaParams.id_historia
    }
  })

  let imagesArray;
  if (historia?.paths_img_capa) {
    try {
      imagesArray = JSON.parse(historia?.paths_img_capa.toString());
    } catch (e) {
      imagesArray = historia.paths_img_capa;
    }
  } else {
    imagesArray = [];
  }

  if (!Array.isArray(imagesArray)) {
    imagesArray = [imagesArray];
  }

  const newImagesArray = imagesArray.filter(image => image !== historiaParams.path_img_capa);

  console.log('New images array:', newImagesArray);

  const newHistoria = await db.historia.update({
    where: {
      id_historia: historiaParams.id_historia
    },
    data: {
      paths_img_capa: newImagesArray,
    }
  });

  return newHistoria;
};
