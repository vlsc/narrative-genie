//define the Outro router

import * as express from 'express';

import chatGPT from '../external/chatgpt';
import waifuDiff from '../external/waifudiffusion';
import { adicionarImagem, apagarOutro, atualizarOutro, buscarOutro, criarOutro, deletarImagem, listarOutros } from '../controllers/Outro';
import { newImagePrompt, outroPrompt } from '../helpers/prompt';
import { buscarHistoria } from '../controllers/Historia';

const OutroRouter = express.Router();

OutroRouter.delete('/waifu/:id', async (req, res) => {
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

OutroRouter.patch('/waifu/', async (req, res) => {
  let firstPrompt;
  let prompt;
  const object = await buscarOutro(parseInt(req.body.id));
  const historia = object?.elemento_narrativo.historia.descricao || ""

  if(!req.body.descricao){
    firstPrompt = object?.imgPrompt;

    const gptPrompt = newImagePrompt(firstPrompt || "Hello world", historia);
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  } else{
    firstPrompt = req.body.descricao.toString();
    const gptPrompt = newImagePrompt(firstPrompt || "Hello world", historia);
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  }

  const result = await waifuDiff.query(`object ${prompt}` || "Hello world");

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

OutroRouter.get('/', async (req, res) => {
  const others = await listarOutros(parseInt(req.query.id_historia?.toString() || ""));
  res.json({ others });
});

OutroRouter.get('/:id', async (req, res) => {
  const other = await buscarOutro(parseInt(req.params.id));
  res.json({ other });
});

OutroRouter.delete('/:id', async (req, res) => {
  await apagarOutro(parseInt(req.params.id));
  res.json();
});

OutroRouter.patch('/:id', async (req, res) => {
  const outroParams = {
    id_elem_narr: parseInt(req.params.id),
    ...req.body,
  };

  await atualizarOutro(outroParams);
});

OutroRouter.post('/', async (req, res) => {
  const story = await buscarHistoria(parseInt(req.body.id_historia));
  const contexto = story?.descricao
  const initialPrompt = req.body['prompt']?.toString();

  const prompt = outroPrompt(req.body['prompt']?.toString() || "Hello world", contexto || "");
  const gptResult = await chatGPT.completion(prompt);
  const jsonResult = JSON.parse(gptResult.data.choices[0].message?.content.toString() || "");
  const imgPrompt = jsonResult.descricao_fisica_em_ingles?.toString() || "Hello world";
  const waifuResult = await waifuDiff.query(imgPrompt, 'object');

  const outroParams = {
    nome: jsonResult.nome?.toString() || "Nome do objeto",
    descricao: jsonResult.descricao?.toString() || "Descrição do objeto",
    imagem: waifuResult?.toString() || "images/teste.jpg",
    prompt: initialPrompt,
    imgPrompt: imgPrompt,
    id_historia: req.body.id_historia
  };

  const outroId = await criarOutro(outroParams);
  
  res.json({ id: outroId });
});

export default OutroRouter;
