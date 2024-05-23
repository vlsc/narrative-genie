//define the Lugar router

import * as express from 'express';

import chatGPT from '../external/chatgpt';
import waifuDiff from '../external/waifudiffusion';
import { adicionarImagem, apagarLugar, atualizarLugar, buscarLugar, criarLugar, deletarImagem, listarLugares } from '../controllers/Lugar';
import { lugarPrompt, newImagePrompt } from '../helpers/prompt';
import { buscarHistoria } from '../controllers/Historia';

const LugarRouter = express.Router();

LugarRouter.delete('/waifu/:id', async (req, res) => {
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

LugarRouter.patch('/waifu/', async (req, res) => {
  let firstPrompt;
  let prompt;
  const place = await buscarLugar(parseInt(req.body.id));
  const historia = place?.elemento_narrativo.historia.descricao || ""

  if(!req.body.descricao){
    firstPrompt = place?.imgPrompt;
    const gptPrompt = newImagePrompt(firstPrompt || "Hello world", historia);
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  } else{
    firstPrompt = req.body.descricao.toString();
    const gptPrompt = newImagePrompt(firstPrompt || "Hello world", historia);
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  }

  const result = await waifuDiff.query(`place ${prompt}` || "Hello world");

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

LugarRouter.get('/', async (req, res) => {
  const places = await listarLugares(parseInt(req.query.id_historia?.toString() || ""));
  res.json({ places });
});

LugarRouter.get('/:id', async (req, res) => {
  const place = await buscarLugar(parseInt(req.params.id));
  res.json({ place });
});

LugarRouter.delete('/:id', async (req, res) => {
  await apagarLugar(parseInt(req.params.id));
  res.json();
});

LugarRouter.patch('/:id', async (req, res) => {
  const lugarParams = {
    id_elem_narr: parseInt(req.params.id),
    ...req.body,
  };

  await atualizarLugar(lugarParams);
});

LugarRouter.post('/', async (req, res) => {
  const story = await buscarHistoria(parseInt(req.body.id_historia));
  const contexto = story?.descricao
  const initialPrompt = req.body['prompt']?.toString();

  const prompt = lugarPrompt(req.body['prompt']?.toString() || "Hello world", contexto || "");
  const gptResult = await chatGPT.completion(prompt);
  const jsonResult = JSON.parse(gptResult.data.choices[0].message?.content.toString() || "");
  const imgPrompt = jsonResult.descricao_fisica_em_ingles?.join(",") || "Hello world";
  const waifuResult = await waifuDiff.query(imgPrompt, 'place');

  const lugarParams = {
    nome: jsonResult.nome?.toString() || "Nome do lugar",
    descricao: jsonResult.descricao?.toString() || "Descrição do lugar",
    imagem: waifuResult?.toString() || "images/teste.jpg",
    riqueza: parseInt(jsonResult.riqueza) || 0,
    saude: parseInt(jsonResult.saude) || 0,
    seguranca: parseInt(jsonResult.seguranca) || 0,
    agua: parseInt(jsonResult.agua) || 0,
    prompt: initialPrompt,
    imgPrompt: imgPrompt,
    id_historia: req.body.id_historia
  };

  const lugarId = await criarLugar(lugarParams);
  
  res.json({ id: lugarId });
});

export default LugarRouter;
