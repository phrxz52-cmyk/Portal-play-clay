'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'SUA_URL_DO_SUPABASE',
  'SUA_CHAVE_PUBLICA'
);

export default function CadastrarAluno() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [turma, setTurma] = useState('');
  const [periodo, setPeriodo] = useState('');

  async function salvarAluno(event) {
    event.preventDefault();

    await supabase.from('alunos').insert({
      nome_completo: nome,
      idade: Number(idade),
      turma: turma,
      ano_semestre: periodo
    });

    alert('Aluno cadastrado!');
  }

  return (
    <form onSubmit={salvarAluno} className="space-y-4">
      <input
        type="text"
        placeholder="Nome completo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Idade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Turma (ex: CT2)"
        value={turma}
        onChange={(e) => setTurma(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Ano/Semestre (ex: 2026.2)"
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Cadastrar aluno
      </button>
    </form>
  );
}