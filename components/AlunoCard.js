'use client';

import { useState } from 'react';

export default function AlunoCard({ aluno, onEdit, onDelete, onAddFeedback }) {
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmitFeedback = () => {
    if (onAddFeedback) {
      onAddFeedback(aluno.id, feedbackText);
      setFeedbackText('');
    }
  };

  return (
    <article className="student-card">
      <img
        src={aluno.foto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
        alt={`Foto de ${aluno.nome}`}
      />

      <h3>{aluno.nome}</h3>
      <div className="meta">
        <div>{aluno.idade} anos</div>
        <div>Turma: {aluno.turma}</div>
        <div>Entrada: {aluno.anoSemestre}</div>
      </div>

      <div className="card-actions">
        <button className="edit-btn" onClick={() => onEdit(aluno)}>
          Editar
        </button>
        <button className="delete-btn" onClick={() => onDelete(aluno.id)}>
          Excluir
        </button>
      </div>

      <div className="feedback-section">
        <h4>Feedbacks</h4>

        {aluno.feedbacks && aluno.feedbacks.length > 0 ? (
          <ul className="feedback-list">
            {aluno.feedbacks.map((item, index) => (
              <li key={`${aluno.id}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="meta">Ainda não há feedback registrado.</p>
        )}

        <div className="feedback-box">
          <input
            type="text"
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value)}
            placeholder="Ex: Prof. Aguinaldo | CT2 - 2026.2: ..."
          />
          <button onClick={handleSubmitFeedback} type="button">
            Enviar
          </button>
        </div>
      </div>
    </article>
  );
}