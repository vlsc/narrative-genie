//define the auth router
import * as express from 'express';
import { atualizarSenha } from '../controllers/Conta';
const authRouter = express.Router();
import db from '../config/db';
import * as bcrypt from 'bcrypt';
const saltRounds = 7;

authRouter.post('/', async (req, res) => {
  let user = null;

  await db.$connect()
  user = await db.conta.findFirst({
    where: {
      email: req.body.email,
    }
  });

  let senha = "";
  if(user && user.senha) senha = user.senha;

  let password = ""
  if(req.body.password) password = req.body.password

  let match = false
  
  if(user && !password && !senha){
    match = true;
  } 
  else {
    match = bcrypt.compareSync(password, senha);
  }

  if(match){
    res.status(200).json({email: req.body.email, password: req.body.password});
  }
  else{
    res.status(401).json({message: "Wrong password"});
  }
  await db.$disconnect();
    
});

authRouter.post('/register/', async (req, res) => {
  await db.$connect();
  
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  let user = await db.conta.findFirst({
    where: {
      AND: [
        {email: req.body.email},
      ]
    }
  });
  if(user){
    res.status(409).json({message: "User already exists"});
  }
  else{
    db.conta.create({
      data: {
        email: req.body.email,
        senha: hash,
        username: req.body.username
      }
    }).then((user) => {
      res.status(201).json({email: req.body.email});
    }).catch((err) => {
      res.status(500).json({message: "database error"});
    });
  }
  
  await db.$disconnect();
});

authRouter.put('/update/', async (req, res) => {
  const email = req.body.email?.toString() || "";
  const password = req.body.password?.toString() || "";

  await db.$connect();

  const hash = await bcrypt.hash(password, saltRounds);
  const conta = await atualizarSenha(email, hash);

  if(conta.count){
    res.json({message: 'Senha atualizada com sucesso'})
  } else {
    res.status(404).json({message: 'Não foi possível atualizar a senha'});
  }
  
  await db.$disconnect();
});

export default authRouter;