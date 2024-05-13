import db from "../config/db";

export const buscarConta = async (email: string) => {
  const conta = await db.conta.findUnique({
    where: {
      email: email
    }
  });

  return conta;
};

export const listarContas = async () => {
  const conta = await db.conta.findMany();

  return conta;
};

export const atualizarSenha = async (email: string, password: string) => {
  const conta = await db.conta.updateMany({
    where: {
      email: email
    },
    data: {
      senha: password,
    }
  });

  return conta;
};

export const atualizarEmail = async (email: string, newEmail: string) => {
  await db.conta.updateMany({
    where: {
      email: email
    },
    data: {
      email: newEmail,
    }
  });

  const conta  = await buscarConta(newEmail);

  return conta;
};

export const atualizarUsername = async (email: string, username: string) => {
  const conta = await db.conta.updateMany({
    where: {
      email: email
    },
    data: {
      username: username,
    }
  });
  
  return conta;
};

export const atualizarDados = async (email: string, newEmail: string, username: string) => {
  await db.conta.updateMany({
    where: {
      email: email
    },
    data: {
      username: username,
      email: newEmail
    }
  });

  const conta  = await buscarConta(newEmail);

  return conta;
};

