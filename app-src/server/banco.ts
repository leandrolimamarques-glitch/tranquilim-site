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
