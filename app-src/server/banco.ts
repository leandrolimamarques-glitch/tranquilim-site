// Acesso ao Postgres por uma interface mínima: em produção, postgres-js (Neon);
// nos testes, PGlite (Postgres em memória). As consultas usam $1, $2...

export interface Banco {
  q<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  fechar(): Promise<void>;
}

export async function bancoPostgres(url: string): Promise<Banco> {
  const { default: postgres } = await import("postgres");
  const sql = postgres(url, { max: 5, idle_timeout: 20, prepare: false });
  return {
    q: async <T>(texto: string, params: unknown[] = []) => (await sql.unsafe(texto, params as never[])) as unknown as T[],
    fechar: () => sql.end({ timeout: 5 }),
  };
}

export async function bancoMemoria(): Promise<Banco> {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  return {
    q: async <T>(texto: string, params: unknown[] = []) => (await db.query<T>(texto, params)).rows,
    fechar: () => db.close(),
  };
}

// Cada migração roda uma vez, em ordem. Nunca edite uma que já foi publicada:
// acrescente outra no fim.
const MIGRACOES: string[] = [
  `create table medicos (
     id uuid primary key,
     email text not null unique,
     senha_hash text not null,
     nome text not null,
     registro text not null,
     titulo text,
     whatsapp text,
     telefone text,
     local text,
     criado_em timestamptz not null default now()
   );
   create table pacientes (
     id uuid primary key,
     medico_id uuid not null references medicos(id),
     nome text not null,
     nascimento date not null,
     sexo text not null check (sexo in ('menina','menino')),
     responsavel text not null default '',
     whatsapp text not null default '',
     convite_token text not null unique,
     convite_em timestamptz,
     ativado_em timestamptz,
     consentimento_em timestamptz,
     criado_em timestamptz not null default now(),
     removido_em timestamptz
   );
   create index pacientes_medico on pacientes(medico_id);
   create table documentos (
     chave text primary key,
     doc jsonb not null,
     versao integer not null default 0,
     atualizado_em timestamptz not null default now()
   );
   create table sessoes (
     hash text primary key,
     tipo text not null check (tipo in ('medico','familia')),
     medico_id uuid references medicos(id),
     paciente_id uuid references pacientes(id),
     criada_em timestamptz not null default now(),
     expira_em timestamptz not null
   );
   create table carteiras (
     id uuid primary key,
     paciente_id uuid not null references pacientes(id),
     enviado_por text not null,
     mime text not null,
     bytes bytea not null,
     tamanho integer not null,
     leitura jsonb,
     erro text,
     criado_em timestamptz not null default now()
   );
   create index carteiras_paciente on carteiras(paciente_id);`,
  // O postgres-js gravava o JSON como texto entre aspas; desfaz nos registros já gravados.
  `update documentos set doc = (doc #>> '{}')::jsonb where jsonb_typeof(doc) = 'string';
   update carteiras set leitura = (leitura #>> '{}')::jsonb where leitura is not null and jsonb_typeof(leitura) = 'string'`,
  `create table perguntas (
     id uuid primary key,
     paciente_id uuid not null references pacientes(id),
     pergunta text not null,
     tipo text not null,
     resposta text not null,
     fluxo text not null default '',
     criado_em timestamptz not null default now()
   );
   create index perguntas_paciente on perguntas(paciente_id, criado_em)`,
  // Login único para todos (família, pediatra, dono). Os dados de teste do modelo
  // anterior (convite por link) são descartados.
  `drop table if exists perguntas;
   drop table if exists carteiras;
   drop table if exists sessoes;
   drop table if exists pacientes;
   drop table if exists medicos;
   delete from documentos;
   create table contas (
     id uuid primary key,
     email text not null unique,
     senha_hash text not null,
     nome text not null,
     dono boolean not null default false,
     pediatra boolean not null default false,
     registro text,
     titulo text,
     whatsapp text,
     telefone text,
     local text,
     email_verificado_em timestamptz,
     criado_em timestamptz not null default now()
   );
   create table criancas (
     id uuid primary key,
     nome text not null,
     nascimento date not null,
     sexo text not null check (sexo in ('menina','menino')),
     criado_por uuid not null references contas(id),
     criado_em timestamptz not null default now(),
     removido_em timestamptz
   );
   create table responsaveis (
     crianca_id uuid not null references criancas(id),
     conta_id uuid not null references contas(id),
     criado_em timestamptz not null default now(),
     primary key (crianca_id, conta_id)
   );
   create table acompanhamentos (
     crianca_id uuid not null references criancas(id),
     pediatra_id uuid not null references contas(id),
     desde timestamptz not null default now(),
     primary key (crianca_id, pediatra_id)
   );
   create table pedidos (
     id uuid primary key,
     pediatra_id uuid not null references contas(id),
     email text not null,
     criado_em timestamptz not null default now(),
     resolvido_em timestamptz
   );
   create index pedidos_email on pedidos(email);
   create table sessoes (
     hash text primary key,
     conta_id uuid not null references contas(id),
     criada_em timestamptz not null default now(),
     expira_em timestamptz not null
   );
   create table carteiras (
     id uuid primary key,
     crianca_id uuid not null references criancas(id),
     enviado_por uuid not null references contas(id),
     mime text not null,
     bytes bytea not null,
     tamanho integer not null,
     leitura jsonb,
     erro text,
     criado_em timestamptz not null default now()
   );
   create index carteiras_crianca on carteiras(crianca_id);
   create table perguntas (
     id uuid primary key,
     crianca_id uuid not null references criancas(id),
     conta_id uuid not null references contas(id),
     pergunta text not null,
     tipo text not null,
     resposta text not null,
     fluxo text not null default '',
     criado_em timestamptz not null default now()
   );
   create index perguntas_crianca on perguntas(crianca_id, criado_em)`,
  `create table config (
     chave text primary key,
     valor text not null,
     atualizado_em timestamptz not null default now()
   )`,
  `create table tokens (
     hash text primary key,
     conta_id uuid not null references contas(id),
     tipo text not null check (tipo in ('confirmar','senha')),
     expira_em timestamptz not null,
     usado_em timestamptz
   )`,
  // O que dá errado no aparelho das pessoas e o que elas sugerem.
  `create table erros (
     id bigserial primary key,
     conta_id uuid references contas(id) on delete set null,
     onde text not null default '',
     mensagem text not null,
     pilha text not null default '',
     navegador text not null default '',
     em timestamptz not null default now()
   );
   create index erros_em on erros(em);
   create table sugestoes (
     id bigserial primary key,
     conta_id uuid references contas(id) on delete set null,
     texto text not null,
     em timestamptz not null default now()
   )`,
  // LGPD: aceite registrado; exclusão de conta apaga de vez. O que era só escondido
  // (criança tirada por todos os responsáveis) é apagado agora.
  `alter table contas add column consentimento_em timestamptz;
   alter table contas add column consentimento_versao text;
   alter table criancas alter column criado_por drop not null;
   alter table carteiras alter column enviado_por drop not null;
   delete from carteiras where crianca_id in (select id from criancas where removido_em is not null);
   delete from perguntas where crianca_id in (select id from criancas where removido_em is not null);
   delete from acompanhamentos where crianca_id in (select id from criancas where removido_em is not null);
   delete from responsaveis where crianca_id in (select id from criancas where removido_em is not null);
   delete from documentos where chave in (select 'crianca:' || id::text from criancas where removido_em is not null);
   delete from criancas where removido_em is not null`,
  // Lembrete de vacina por e-mail (ligado por padrão; a pessoa desliga em Ajustes ou pelo link do e-mail).
  `alter table contas add column lembretes boolean not null default true;
   alter table contas add column lembrete_em timestamptz;
   alter table contas add column lembrete_verificado_em timestamptz`,
  // Idade gestacional ao nascer (semanas), para a idade corrigida dos prematuros.
  `alter table criancas add column semanas_gestacao smallint check (semanas_gestacao between 22 and 42)`,
  // Prontuário do pediatra: só ele vê; não depende da conta da família (guarda de 20 anos).
  `create table prontuario_pacientes (
     id uuid primary key,
     pediatra_id uuid not null references contas(id),
     crianca_id uuid references criancas(id) on delete set null,
     nome text not null,
     nascimento date not null,
     sexo text not null check (sexo in ('menina','menino')),
     responsavel text not null default '',
     telefone text not null default '',
     alergias text not null default '',
     antecedentes text not null default '',
     semanas_gestacao smallint check (semanas_gestacao between 22 and 42),
     criado_em timestamptz not null default now(),
     atualizado_em timestamptz not null default now()
   );
   create index prontuario_pacientes_pediatra on prontuario_pacientes(pediatra_id);
   create unique index prontuario_pacientes_crianca on prontuario_pacientes(pediatra_id, crianca_id) where crianca_id is not null;
   create table prontuario_registros (
     id uuid primary key,
     paciente_id uuid not null references prontuario_pacientes(id),
     pediatra_id uuid not null references contas(id),
     tipo text not null check (tipo in ('atendimento','adendo')),
     referente_a uuid references prontuario_registros(id),
     data date not null,
     conteudo jsonb not null,
     criado_em timestamptz not null default now(),
     finalizado_em timestamptz
   );
   create index prontuario_registros_paciente on prontuario_registros(paciente_id, data);
   create table prontuario_documentos (
     id uuid primary key,
     paciente_id uuid not null references prontuario_pacientes(id),
     pediatra_id uuid not null references contas(id),
     tipo text not null check (tipo in ('receita','atestado','comparecimento','exame')),
     conteudo jsonb not null,
     criado_em timestamptz not null default now(),
     enviado_em timestamptz
   );
   create index prontuario_documentos_paciente on prontuario_documentos(paciente_id)`,
  // Resposta rápida: o que o pediatra orienta em casa, por tema, para as famílias dele.
  `create table respostas_rapidas (
     pediatra_id uuid not null references contas(id),
     tema text not null,
     texto text not null,
     publicado boolean not null default false,
     atualizado_em timestamptz not null default now(),
     primary key (pediatra_id, tema)
   )`,
];

export async function migrar(banco: Banco): Promise<number> {
  await banco.q(`create table if not exists migracoes (id integer primary key, em timestamptz not null default now())`);
  const feitas = new Set((await banco.q<{ id: number }>(`select id from migracoes`)).map((r) => Number(r.id)));
  let n = 0;
  for (let i = 0; i < MIGRACOES.length; i++) {
    if (feitas.has(i + 1)) continue;
    for (const comando of MIGRACOES[i].split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) await banco.q(comando);
    await banco.q(`insert into migracoes (id) values ($1)`, [i + 1]);
    n++;
  }
  return n;
}
