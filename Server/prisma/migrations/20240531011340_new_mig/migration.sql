-- CreateTable
CREATE TABLE "conta" (
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(64) NOT NULL,

    CONSTRAINT "conta_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "elemento_narrativo" (
    "id_elem_narr" SERIAL NOT NULL,
    "Historia_id_historia" INTEGER NOT NULL,
    "tipo" VARCHAR(45),

    CONSTRAINT "elemento_narrativo_pkey" PRIMARY KEY ("id_elem_narr")
);

-- CreateTable
CREATE TABLE "historia" (
    "id_historia" SERIAL NOT NULL,
    "nome" VARCHAR(255),
    "descricao" VARCHAR(3000),
    "paths_img_capa" JSONB NOT NULL,
    "email_escritor" VARCHAR(255) NOT NULL,
    "prompt" VARCHAR(2000),
    "imgPrompt" VARCHAR(2000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historia_pkey" PRIMARY KEY ("id_historia")
);

-- CreateTable
CREATE TABLE "lugar" (
    "id_elem_narr" INTEGER NOT NULL,
    "nome" VARCHAR(255),
    "descricao" VARCHAR(3000),
    "imagens" JSONB NOT NULL,
    "riqueza" INTEGER NOT NULL DEFAULT 0,
    "saude" INTEGER NOT NULL DEFAULT 0,
    "seguranca" INTEGER NOT NULL DEFAULT 0,
    "agua" INTEGER NOT NULL DEFAULT 0,
    "prompt" VARCHAR(2000),
    "imgPrompt" VARCHAR(2000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lugar_pkey" PRIMARY KEY ("id_elem_narr")
);

-- CreateTable
CREATE TABLE "outro" (
    "id_elem_narr" INTEGER NOT NULL,
    "nome" VARCHAR(255),
    "descricao" VARCHAR(3000),
    "imagens" JSONB NOT NULL,
    "prompt" VARCHAR(2000),
    "imgPrompt" VARCHAR(2000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outro_pkey" PRIMARY KEY ("id_elem_narr")
);

-- CreateTable
CREATE TABLE "personagem" (
    "id_elem_narr" INTEGER NOT NULL,
    "nome" VARCHAR(255),
    "descricao" VARCHAR(3000),
    "backstory" VARCHAR(2000),
    "especie" VARCHAR(255),
    "personalidade" VARCHAR(2000),
    "imagens" JSONB NOT NULL,
    "prompt" VARCHAR(2000),
    "imgPrompt" VARCHAR(2000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personagem_pkey" PRIMARY KEY ("id_elem_narr")
);

-- CreateTable
CREATE TABLE "relacao" (
    "id_elem_narr1" INTEGER NOT NULL,
    "id_elem_narr2" INTEGER NOT NULL,
    "nome_relacao" VARCHAR(255),
    "descricao" VARCHAR(3000),
    "prompt" VARCHAR(2000),

    CONSTRAINT "relacao_pkey" PRIMARY KEY ("id_elem_narr1","id_elem_narr2")
);

-- CreateIndex
CREATE INDEX "idx_elemento_narrativo_historia_id" ON "elemento_narrativo"("Historia_id_historia");

-- CreateIndex
CREATE INDEX "fk_Historia_Conta_index" ON "historia"("email_escritor");

-- CreateIndex
CREATE INDEX "lugar_id_elem_narr_idx" ON "lugar"("id_elem_narr");

-- CreateIndex
CREATE INDEX "outro_id_elem_narr_idx" ON "outro"("id_elem_narr");

-- CreateIndex
CREATE INDEX "personagem_id_elem_narr_idx" ON "personagem"("id_elem_narr");

-- CreateIndex
CREATE INDEX "idx_relacao_elem1" ON "relacao"("id_elem_narr1");

-- CreateIndex
CREATE INDEX "idx_relacao_elem2" ON "relacao"("id_elem_narr2");
