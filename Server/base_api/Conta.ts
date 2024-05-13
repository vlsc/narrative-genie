import * as express from 'express';

import { atualizarEmail, atualizarUsername, atualizarDados, buscarConta } from '../controllers/Conta';

const ContaRouter = express.Router();

ContaRouter.get('/', async (req, res) => {
  const conta = await buscarConta(req.query.email?.toString() || "");

  if(conta){
    res.json({ username: conta?.username, email: conta?.email, password: conta?.senha });
  } else {
    res.json({ message: 'conta não encontrada' });
  }
});

ContaRouter.put('/', async (req, res) => {
  const email = req.body.params.email?.toString() || "";
  const newEmail = req.body.params.newEmail?.toString();
  const username = req.body.params.username?.toString();

  if(newEmail && username) { // MUDA EMAIL E USERNAME
    const conta = await atualizarDados(email, newEmail, username);

    if(conta){
      res.json({username: conta.username, email: conta.email})
    } else {
      res.status(404).json({message: 'Não foi possível atualizar a conta'});
    }

  } else {
    if(newEmail){ // MUDA SOH EMAIL
      const conta = await atualizarEmail(email, newEmail);

      if(conta){
        res.json({username: conta.username, email: conta.email})
      } else {
        res.status(404).json({message: 'Não foi possível atualizar a conta'});
      }

    } else { // MUDA SOH USERNAME
      const conta = await atualizarUsername(email, username);

      if(conta.count){
        res.json({username: username, email: email})
      } else {
        res.status(404).json({message: 'Não foi possível atualizar a conta'});
      }
    }
  }
});

export default ContaRouter;
