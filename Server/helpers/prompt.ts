export const historiaPrompt = (prompt: string) => {
  let result = `fill the json with data about a fictional world described by "${prompt.trim()}". Add all possible details, add the most common species/races, economic sistem, coin used, technologies, kind of government
  religion, etc in the 'descricao' field (at least 500 characters). the only field in english is 'prompt_para_modelo_de_imagem_em_ingles', there, describe in details the fisical
  characteristics of the world. Do not generate anything but the JSON. 'descricao' e 'nome' should be in pt-BR. Do not copy this input, create a entire new description to the world.`
  result += `{ nome: string; descricao: string; prompt_para_modelo_de_imagem_em_ingles: string; }`;

  return result;
};

export const newImagePrompt = (prompt: string, storyPrompt?: string) => {
  let result;
  if(storyPrompt){
    result = `generate a prompt to create a image described by "${prompt.trim()}" in the context of "${storyPrompt.trim()}". Add all possible details, at least 8 words to describe it. It have to be in english`
  } else {
    result = `generate a prompt to create a image described by "${prompt.trim()}". Add all possible details, at least 8 words to describe it. It have to be in english`
  }

  return result;
};

export const lugarPrompt = (prompt: string, contexto: string) => {
  let result = `fill the json with data about a fictional place described by "${prompt.trim()}", that exists in the world of "${contexto}". 
  Add all possible details, the story, the culture, geographical characteristics, physical characteristics, give a deep description, 
  show how it is related to the world, etc in the 'descricao' field (at least 500 characters). 
  the only fields in english are 'descricao_fisica_em_ingles' and 'nome'. 
  'descricao_fisica_em_ingles' should be a LIST of ALL the physical characteristics of the place (at least 8). The physical characteristics have to match with the 'descricao' of the place. 
  Do not generate anything but the JSON. Do not copy this input, create a entire new description to the object. Give an interesting name in the field 'nome', not common.
  All the fields have to be in pt-BR, the only ones in english are 'descricao_fisica_em_ingles and 'nome'`

  result += `{ nome: string; descricao: string; riqueza: int (min: 0, max: 3); saude: int (min: 0, max: 3); seguranca: int (min: 0, max: 3); agua: int (min: 0, max: 3); descricao_fisica_em_ingles: string[]; }`;

  return result;
};

export const outroPrompt = (prompt: string, contexto?: string) => {
  let result = `fill the json with data about a fictional object described by "${prompt.trim()}", that exists in a world of "${contexto}". 
  Add all possible details, give a deep description, format, color, material, story, how it is used, show how it is related to the world, etc in the 'descricao' field (at least 500 characters). 
  the only fields in english are 'descricao_fisica_em_ingles' and 'nome'. 
  'descricao_fisica_em_ingles' should be a LIST of ALL the physical characteristics of the object (at least 8). The physical characteristics have to match with the 'descricao' of the object. 
  Do not generate anything but the JSON. Do not copy this input, create a entire new description to the object. Give an interesting name in the field 'nome', not common.
  All the fields have to be in pt-BR, the only ones in english are 'descricao_fisica_em_ingles and 'nome'`
  
  result += `{ nome: string; descricao: string; descricao_fisica_em_ingles: string[]; }`;

  return result;
};

export const personagemPrompt = (prompt: string, contexto?: string) => {
  let result = `fill the json with data about a fictional character described by "${prompt.trim()}", that lives in a world of "${contexto}". 
  Add all possible details, give a deep description, personality, main life goals, how it is related to the world, etc in the 'backstory' field (at least 500 characters). 
  the only field in english is 'descricao_fisica_em_ingles'. 
  'descricao_fisica_em_ingles' should be a LIST of ALL the physical characteristics of the character (at least 8), include in the list the gender and species. The physical characteristics have to match with the backstory of the character. 
  in the 'descricao' fill with the adjectives for the character, be creative, do not copy the input. Be sure that all the fields match.
  Do not generate anything but the JSON. Do not copy this input, create a entire new description to the character. Give an interesting name in the field 'nome', not common.
  All the fields have to be in pt-BR, the only one in english is 'descricao_fisica_em_ingles`
  
  result += `{ nome: string; descricao: string[]; backstory: string; especie: string; personalidade: string[]; descricao_fisica_em_ingles: string[]; }`;

  return result;
};

export const relacaoPrompt = (category1: string, name1: string, category2: string, name2: string, prompt: string, contexto?: string, c1_backstory?: string, c2_backstory?: string) => {
  let result = `Knowing that ${c1_backstory} and ${c2_backstory} write the relation between ${category1.trim()} ${name1.trim()} and ${category2.trim()} ${name2.trim()} described by "${prompt.trim()}" in a world of ${contexto?.trim()}.
  write all the important details between their relation, give deep details. Maximum of 200 characters. It have to be in pt-BR.`

  return result;
};
