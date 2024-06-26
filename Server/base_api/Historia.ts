//define the Historia router

import * as express from 'express';

import chatGPT from '../external/chatgpt';
import waifuDiff from '../external/waifudiffusion';
import { listarHistorias, buscarHistoria, criarHistoria, apagarHistoria, atualizarHistoria, adicionarImagem, deletarImagem } from '../controllers/Historia';
import { historiaPrompt, newImagePrompt } from '../helpers/prompt';

const HistoriaRouter = express.Router();

HistoriaRouter.get('/', async (req, res) => {
  const stories = await listarHistorias(req.query.email?.toString() || "");
  res.json({ stories });
});

HistoriaRouter.post('/gpt/', async (req, res) => {
  const gptResult = await chatGPT.completion(req.body['prompt']?.toString() || "Hello world");
  
  res.json({ result: gptResult.data });
});

HistoriaRouter.delete('/waifu/:id', async (req, res) => {
  const historiaParams = {
    id_historia: parseInt(req.params.id),
    path_img_capa: req.body.img_path,
  };

  const newHistoria = await deletarImagem(historiaParams);

  if(newHistoria){
    res.json({newHistoria})
  } else {
    res.status(404).json({ message: 'erro ao deletar imagem' });
  }
});

HistoriaRouter.patch('/waifu/', async (req, res) => {
  let firstPrompt;
  let prompt;

  if(!req.body.descricao){
    const story = await buscarHistoria(parseInt(req.body.id));
    firstPrompt = story?.imgPrompt;

    const gptPrompt = newImagePrompt(firstPrompt || "Hello world");
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  } else{
    firstPrompt = req.body.descricao.toString();
    const gptPrompt = newImagePrompt(firstPrompt || "Hello world");
    const gptResult = await chatGPT.completion(gptPrompt);
    prompt = gptResult.data.choices[0].message?.content.toString();
  }

  const result = await waifuDiff.query(`world ${prompt}` || "Hello world", 'world');

  const historiaParams = {
    id_historia: parseInt(req.body.id),
    path_img_capa: result,
    imgPrompt: prompt
  };

  const newHistoria = await adicionarImagem(historiaParams)

  if(newHistoria){
    res.json({newHistoria})
  } else {
    res.status(400).json({ message: 'erro ao gerar imagem' })
  }
});

HistoriaRouter.get('/:id', async (req, res) => {
  const story = await buscarHistoria(parseInt(req.params.id));
  res.json({ story });
});

HistoriaRouter.delete('/:id', async (req, res) => {
  await apagarHistoria(parseInt(req.params.id));
  res.json();
});

HistoriaRouter.patch('/:id', async (req, res) => {
  const historiaParams = {
    id_historia: parseInt(req.params.id),
    ...req.body,
  };

  const historia = await atualizarHistoria(historiaParams);

  if(historia){
    res.json({ message: 'atualizado com sucesso' });
  } else {
    res.status(404).json({ message: 'mundo nao encontrado'})
  }
});

/***
 * @api {post} /historia/ Cria uma nova história no banco de dados
 * @apiName CriarHistoria
 * @apiGroup Historia
 * @param {string} titulo - Título da história
 */
HistoriaRouter.post('/', async (req, res) => {
  console.log('aqui')
  const prompt = historiaPrompt(req.body['prompt']?.toString() || "Hello world");
  const gptResult = await chatGPT.completion(prompt);
  const jsonResult = JSON.parse(gptResult.data.choices[0].message?.content.toString() || "");
  const imgPrompt = jsonResult.prompt_para_modelo_de_imagem_em_ingles?.toString() || "Hello world";
  console.log({imgPrompt})
  const waifuResult = await waifuDiff.query(imgPrompt, 'world');
  const email = req.body["email"].toString();
  console.log({jsonResult})
  const historiaParams = {
    nome: jsonResult.nome?.toString() || "Nome do mundo",
    descricao: jsonResult.descricao?.toString() || "Descrição do mundo",
    path_img_capa: waifuResult?.toString() || "images/teste.jpg",
    prompt: prompt,
    imgPrompt: imgPrompt,
    email: email,
  };

  const historiaId = await criarHistoria(historiaParams);
  
  res.json({ id: historiaId });
});

export default HistoriaRouter;
