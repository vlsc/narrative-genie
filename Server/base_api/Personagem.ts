//define the Personagem router

import * as express from 'express';

import chatGPT from '../external/chatgpt';
import waifuDiff from '../external/waifudiffusion';
import { adicionarImagem, apagarPersonagem, atualizarPersonagem, buscarPersonagem, criarPersonagem, deletarImagem, listarPersonagens } from '../controllers/Personagem';
import { newImagePrompt, personagemPrompt } from '../helpers/prompt';
import { buscarHistoria } from '../controllers/Historia';

const PersonagemRouter = express.Router();

PersonagemRouter.delete('/waifu/:id', async (req, res) => {
  const imageParams = {
    id: parseInt(req.params.id),
    imagem: req.body.img_path,
  };

  const newImage = await deletarImagem(imageParams);

  if(newImage){
    res.json({newImage})
  } else {
    res.status(404).json({ message: 'erro ao deletar imagem' });
  }
});

PersonagemRouter.patch('/waifu/', async (req, res) => {
  let firstPrompt;
  let prompt;
  const character = await buscarPersonagem(parseInt(req.body.id));
  const historia = character?.elemento_narrativo.historia.descricao || ""

  if(!req.body.descricao){
    firstPrompt = character?.imgPrompt;

    const gptPrompt = newImagePrompt(firstPrompt || "Hello world", historia);
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  } else{
    firstPrompt = req.body.descricao.toString();
    const gptPrompt = newImagePrompt(firstPrompt || "Hello world", historia);
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  }

  const result = await waifuDiff.query(`character ${prompt}` || "Hello world", 'character');

  const imageParams = {
    id: parseInt(req.body.id),
    imagem: result,
    imgPrompt: prompt
  };

  const newImage = await adicionarImagem(imageParams)

  if(newImage){
    res.json({newImage})
  } else {
    res.status(400).json({ message: 'erro ao gerar imagem' })
  }
});

PersonagemRouter.get('/', async (req, res) => {
  const characters = await listarPersonagens(parseInt(req.query.id_historia?.toString() || ""));
  res.json({ characters });
});

PersonagemRouter.get('/:id', async (req, res) => {
  const character = await buscarPersonagem(parseInt(req.params.id));

  res.json({ character });
});

PersonagemRouter.delete('/:id', async (req, res) => {
  await apagarPersonagem(parseInt(req.params.id));
  res.json();
});

PersonagemRouter.patch('/:id', async (req, res) => {
  const personagemParams = {
    id_elem_narr: parseInt(req.params.id),
    ...req.body,
  };

  await atualizarPersonagem(personagemParams);
});

PersonagemRouter.post('/', async (req, res) => {
  const story = await buscarHistoria(parseInt(req.body.id_historia));
  const contexto = story?.descricao
  const prompt = personagemPrompt(req.body['prompt']?.toString() || "Hello world", contexto || "");
  const initialPrompt = req.body['prompt']?.toString();

  const gptResult = await chatGPT.completion(prompt);
  const jsonResult = JSON.parse(gptResult.data.choices[0].message?.content.toString() || "");
  const imgPrompt = jsonResult.descricao_fisica_em_ingles?.join(",") || "Hello world";
  const waifuResult = await waifuDiff.query(imgPrompt, 'character');

  const personagemParams = {
    nome: jsonResult.nome?.toString() || "Nome do personagem",
    descricao: jsonResult.descricao?.join(",") || "Descrição do personagem",
    imagem: waifuResult?.toString() || "images/teste.jpg",
    backstory: jsonResult.backstory?.toString() || "Backstory do personagem",
    especie: jsonResult.especie?.toString() || "Espécie do personagem",
    personalidade: jsonResult.personalidade?.join(",") || "Personalidade do personagem",
    prompt: initialPrompt,
    imgPrompt: imgPrompt,
    id_historia: req.body.id_historia
  };

  const personagemId = await criarPersonagem(personagemParams);
  
  res.json({ id: personagemId });
});

export default PersonagemRouter;
