'use client';

import { useEffect, useState } from 'react';
import AlunoCard from '../AlunoCard';

const initialForm = {
  nome: '',
  idade: '',
  turma: '',
  anoSemestre: '',
  foto: ''
};

const initialStudents = [
  {
    id: '1',
    nome: 'Marina Ferreira',
    idade: 18,
    turma: 'CT2',
    anoSemestre: '2026.2',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    feedbacks: ['Prof. Aguinaldo | CT2 - 2026.2: Aluna muito prestativa e com boa lógica de código.']
  },
  {
    id: '2',
    nome: 'Lucas Mendes',
    idade: 19,
    turma: 'CY1',
    anoSemestre: '2026.1',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    feedbacks: ['Prof. Solange | CY1 - 2026.1: Participa ativamente das aulas e ajuda os colegas.']
  },
  {
    id: '3',
    nome: 'Beatriz Costa',
    idade: 17,
    turma: 'CK3',
    anoSemestre: '2026.2',
    foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    feedbacks: []
  }
];

export default function HomePage() {
  const [userRole, setUserRole] = useState('Professor');
  const [alunos, setAlunos] = useState(initialStudents);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('ctrl-play-alunos');
    if (saved) {
      try {
        setAlunos(JSON.parse(saved));
      } catch {
        setAlunos(initialStudents);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ctrl-play-alunos', JSON.stringify(alunos));
  }, [alunos]);

  const isAuthorized = userRole === 'Professor' || userRole === 'Equipe';

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.nome || !form.idade || !form.turma || !form.anoSemestre) {
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      idade: Number(form.idade),
      turma: form.turma.trim().toUpperCase(),
      anoSemestre: form.anoSemestre.trim(),
      foto: form.foto.trim() || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    };

    if (editingId) {
      setAlunos((prev) =>
        prev.map((aluno) =>
          aluno.id === editingId ? { ...aluno, ...payload } : aluno
        )
      );
    } else {
      setAlunos((prev) => [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          ...payload,
          feedbacks: []
        },
        ...prev
      ]);
    }

    resetForm();
  };

  const handleEdit = (aluno) => {
    setEditingId(aluno.id);
    setForm({
      nome: aluno.nome,
      idade: String(aluno.idade),
      turma: aluno.turma,
      anoSemestre: aluno.anoSemestre,
      foto: aluno.foto || ''
    });
  };

  const handleDelete = (id) => {
    setAlunos((prev) => prev.filter((aluno) => aluno.id !== id));
    if (editingId === id) resetForm();
  };

  const handleAddFeedback = (id, feedbackText) => {
    const text = feedbackText.trim();
    if (!text) return;

    setAlunos((prev) =>
      prev.map((aluno) =>
        aluno.id === id
          ? { ...aluno, feedbacks: [...(aluno.feedbacks || []), text] }
          : aluno
      )
    );
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <span className="eyebrow">CTRL PLAY</span>
          <h1>Carômetro dos Alunos</h1>
        </div>

        <div className="role-switcher">
          <button className={userRole === 'Professor' ? 'role active' : 'role'} onClick={() => setUserRole('Professor')}>Professor</button>
          <button className={userRole === 'Equipe' ? 'role active' : 'role'} onClick={() => setUserRole('Equipe')}>Equipe</button>
          <button className={userRole === 'Visitante' ? 'role active' : 'role'} onClick={() => setUserRole('Visitante')}>Visitante</button>
        </div>
      </section>

      {!isAuthorized ? (
        <section className="restricted-panel">
          <h2>Acesso restrito</h2>
          <p>Esta plataforma é exclusiva para professores e equipe autorizada da CTRL PLAY.</p>
          <p>Para continuar, escolha uma conta com acesso autorizado no seletor acima.</p>
        </section>
      ) : (
        <>
          <section className="form-card">
            <div className="section-header">
              <h2>{editingId ? 'Editar aluno' : 'Cadastrar aluno'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <label>
                <span>Foto</span>
                <input type="url" value={form.foto} onChange={(event) => handleChange('foto', event.target.value)} placeholder="https://..." />
              </label>

              <label>
                <span>Nome completo</span>
                <input type="text" value={form.nome} onChange={(event) => handleChange('nome', event.target.value)} placeholder="Ex: Ana Silva" />
              </label>

              <label>
                <span>Idade</span>
                <input type="number" min="1" max="99" value={form.idade} onChange={(event) => handleChange('idade', event.target.value)} placeholder="18" />
              </label>

              <label>
                <span>Turma</span>
                <input type="text" value={form.turma} onChange={(event) => handleChange('turma', event.target.value)} placeholder="Ex: CT2" />
              </label>

              <label>
                <span>Ano/Semestre de entrada</span>
                <input type="text" value={form.anoSemestre} onChange={(event) => handleChange('anoSemestre', event.target.value)} placeholder="Ex: 2026.2" />
              </label>

              <div className="form-actions">
                <button type="submit" className="primary-btn">{editingId ? 'Salvar alterações' : 'Cadastrar aluno'}</button>
                {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </section>

          <section className="student-grid">
            {alunos.map((aluno) => (
              <AlunoCard key={aluno.id} aluno={aluno} onEdit={handleEdit} onDelete={handleDelete} onAddFeedback={handleAddFeedback} />
            ))}
          </section>
        </>
      )}
    </main>
  );
}