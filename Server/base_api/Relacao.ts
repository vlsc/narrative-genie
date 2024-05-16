import * as express from 'express';
import db from '../config/db';
import { relacaoPrompt } from '../helpers/prompt';
import chatGPT from '../external/chatgpt';
import { buscarHistoria } from '../controllers/Historia';
import { buscarPersonagem } from '../controllers/Personagem';
import { buscarLugar } from '../controllers/Lugar';
import { buscarOutro } from '../controllers/Outro';
const RelacoesRouter = express.Router();

RelacoesRouter.post('/', async (req, res) => {
    
});

RelacoesRouter.get('/descricao', async (req, res) => {
    if(req.query['descricao']){
        return res.json({ result: req.query['descricao'], prompt: req.query['prompt'] });
    }

    const settingTable = async (category: string, id: number) => {
        switch(category){
            case 'personagem':
                const personagem = await buscarPersonagem(id);
                return personagem?.backstory;
            case 'lugar':
                const lugar = await buscarLugar(id);
                return lugar?.descricao;
            case 'objeto':
                const objeto = await buscarOutro(id);
                return objeto?.descricao;
            default:
                //
                break;
        }
    }

    const story = await buscarHistoria(parseInt(req.query['id_historia']?.toString() || ""));
    const contexto = story?.descricao

    const category1 = req.query['categoria_1']?.toString() || "personagem";
    const category2 = req.query['categoria_2']?.toString() || "personagem";
    const c1_id = parseInt(req.query['c1_id']?.toString() || "")
    const c2_id = parseInt(req.query['c2_id']?.toString() || "")

	const c1_backstory = settingTable(category1, c1_id)
    const c2_backstory = settingTable(category2, c2_id)

    const prompt = relacaoPrompt(
        category1,
        req.query['nome_1']?.toString() || "Nome",
        category2,
        req.query['nome_2']?.toString() || "Nome",
        req.query['prompt']?.toString() || "relacionamento entre personagens",
        contexto?.toString(),
            c1_backstory?.toString(),
            c2_backstory?.toString(),
    );

    const gptResult = await chatGPT.completion(prompt);
    res.json({ result: gptResult.data.choices[0].message?.content.toString() || "Descrição da relação", prompt: req.query['prompt'] });
});

RelacoesRouter.put('/', async (req, res) => {
    await db.$connect();

    const relacao = await db.relacao.create({
        data: {
            id_elem_narr1: req.body.id_elem_narr1,
            id_elem_narr2: req.body.id_elem_narr2,
            nome_relacao: req.body.nome_relacao || "",
            descricao: req.body.descricao || "",
        }
    });

    res.json({ relacao });
});

RelacoesRouter.delete('/', async (req, res) => {
    await db.$connect();

    try{
        await db.relacao.delete({
            where: {
                id_elem_narr1_id_elem_narr2: {
                    id_elem_narr1: req.body.id_elem_narr1,
                    id_elem_narr2: req.body.id_elem_narr2,
                }
            }
        });
    }catch(err){
        db.$disconnect();
        res.status(500).json({message: "database error"});
    }

    db.$disconnect();
    res.json({message: "Relacao deleted"});
});

RelacoesRouter.get('/:mundoId/', async (req, res) => {
    await db.$connect();

    const relacoes = await db.historia.findMany({
        where: {
            id_historia: parseInt(req.params.mundoId)
        },
        select: {
            elemento_narrativo: {
                select: {
                    relacao_relacao_id_elem_narr1Toelemento_narrativo: {
                        select: {
                            id_elem_narr2: true,
                            nome_relacao: true,
                            descricao: true,
                        }
                    }
                }
            }
        }
    });

    db.$disconnect();
    res.json({ relacoes });

});

RelacoesRouter.get('/:mundoId/:idElemNarrativo', async (req, res) => {
    await db.$connect();

    const relacao = await db.relacao.findMany({
        where: {
            OR: [
                {id_elem_narr1: parseInt(req.params.idElemNarrativo)},
                {id_elem_narr2: parseInt(req.params.idElemNarrativo)}
            ]
        },
    });

    db.$disconnect();
    res.json({ relacao });
});

RelacoesRouter.get('/:mundoId/:idElemNarrativo1/:idElemNarrativo2', async (req, res) => {
    await db.$connect();

    const relacao = await db.relacao.findMany({
        where: {
            AND: [
                {id_elem_narr1: parseInt(req.params.idElemNarrativo1)},
                {id_elem_narr2: parseInt(req.params.idElemNarrativo2)}
            ]
        },
    });

    db.$disconnect();
    res.json({ relacao });

});

RelacoesRouter.put('/:idElemNarrativo1/:idElemNarrativo2', async (req, res) => {
    await db.$connect();

    const relacao = await db.relacao.update({
        where: {
            id_elem_narr1_id_elem_narr2: {
                id_elem_narr1: parseInt(req.params.idElemNarrativo1),
                id_elem_narr2: parseInt(req.params.idElemNarrativo2),
            }
        },
        data: {
            descricao: req.body.descricao || "",
        }
    });

    res.json({ relacao });
});

export default RelacoesRouter;
