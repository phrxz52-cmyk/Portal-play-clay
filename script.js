const STORAGE_KEY = 'ctrlPlayAlunos';

const seedStudents = [
  {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 1),
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    nome: 'Marina Ferreira',
    idade: 18,
    turma: 'CT2',
    anoSemestre: '2026.2',
    feedbacks: ['Prof. Aguinaldo | CT2 - 2026.2: Aluna muito prestativa e com boa lógica de código.']
  },
  {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 2),
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    nome: 'Lucas Mendes',
    idade: 19,
    turma: 'CY1',
    anoSemestre: '2026.1',
    feedbacks: ['Prof. Solange | CY1 - 2026.1: Participa ativamente das aulas e ajuda os colegas.']
  },
  {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 3),
    foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    nome: 'Beatriz Costa',
    idade: 17,
    turma: 'CK3',
    anoSemestre: '2026.2',
    feedbacks: []
  }
];

const roleButtons = [...document.querySelectorAll('.role-btn')];
const formPanel = document.getElementById('formPanel');
const accessStatus = document.getElementById('accessStatus');
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let currentRole = 'Professor';
let editingId = null;

const getStudents = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStudents));
    return [...seedStudents];
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStudents));
    return [...seedStudents];
  }
};

let students = getStudents();

const renderStudents = () => {
  studentList.innerHTML = '';

  students.forEach((aluno) => {
    const card = document.createElement('article');
    card.className = 'student-card';

    const feedbackItems = (aluno.feedbacks || []).map(
      (item) => `<li>${item}</li>`
    ).join('');

    card.innerHTML = `
      <img src="${aluno.foto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}" alt="Foto de ${aluno.nome}" />
      <h3>${aluno.nome}</h3>
      <div class="student-meta">
        <div>${aluno.idade} anos</div>
        <div>Turma: ${aluno.turma}</div>
        <div>Entrada: ${aluno.anoSemestre}</div>
      </div>

      <div class="card-actions">
        <button class="edit-btn" type="button" data-action="edit" data-id="${aluno.id}">Editar</button>
        <button class="delete-btn" type="button" data-action="delete" data-id="${aluno.id}">Excluir</button>
      </div>

      <div class="feedback-section">
        <h4>Feedbacks</h4>
        ${
          feedbackItems
            ? `<ul class="feedback-list">${feedbackItems}</ul>`
            : '<p class="student-meta">Ainda não há feedback.</p>'
        }

        <div class="feedback-box">
          <input type="text" class="feedback-input" data-id="${aluno.id}" placeholder="Prof. ..." />
          <button class="feedback-btn" type="button" data-action="feedback" data-id="${aluno.id}">Enviar</button>
        </div>
      </div>
    `;

    studentList.appendChild(card);
  });
};

const saveStudents = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const updateAccess = () => {
  const authorized = currentRole === 'Professor' || currentRole === 'Equipe';

  roleButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.role === currentRole);
  });

  formPanel.classList.toggle('hidden', !authorized);
  accessStatus.hidden = authorized;

  if (!authorized) {
    formTitle.textContent = 'Acesso restrito';
    studentForm.reset();
    editingId = null;
    cancelEditBtn.classList.add('hidden');
    submitBtn.textContent = 'Cadastrar aluno';
  } else {
    formTitle.textContent = editingId ? 'Editar aluno' : 'Cadastrar aluno';
  }
};

const resetForm = () => {
  studentForm.reset();
  editingId = null;
  submitBtn.textContent = 'Cadastrar aluno';
  cancelEditBtn.classList.add('hidden');
  formTitle.textContent = 'Cadastrar aluno';
};

const fillForm = (aluno) => {
  document.getElementById('foto').value = aluno.foto || '';
  document.getElementById('nome').value = aluno.nome;
  document.getElementById('idade').value = aluno.idade;
  document.getElementById('turma').value = aluno.turma;
  document.getElementById('anoSemestre').value = aluno.anoSemestre;

  editingId = aluno.id;
  submitBtn.textContent = 'Salvar alterações';
  cancelEditBtn.classList.remove('hidden');
  formTitle.textContent = 'Editar aluno';
};

roleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentRole = button.dataset.role;
    updateAccess();
  });
});

studentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (currentRole !== 'Professor' && currentRole !== 'Equipe') {
    updateAccess();
    return;
  }

  const payload = {
    foto: document.getElementById('foto').value.trim() || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    nome: document.getElementById('nome').value.trim(),
    idade: Number(document.getElementById('idade').value),
    turma: document.getElementById('turma').value.trim().toUpperCase(),
    anoSemestre: document.getElementById('anoSemestre').value.trim()
  };

  if (!payload.nome || !payload.turma || !payload.anoSemestre || !payload.idade) {
    alert('Preencha os campos obrigatórios.');
    return;
  }

  if (editingId) {
    students = students.map((student) =>
      student.id === editingId ? { ...student, ...payload } : student
    );
  } else {
    students.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ...payload,
      feedbacks: []
    });
  }

  saveStudents();
  renderStudents();
  resetForm();
});

cancelEditBtn.addEventListener('click', resetForm);

studentList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'delete') {
    students = students.filter((student) => student.id !== id);
    saveStudents();
    renderStudents();
    if (editingId === id) resetForm();
  }

  if (action === 'edit') {
    const aluno = students.find((student) => student.id === id);
    if (aluno) fillForm(aluno);
  }

  if (action === 'feedback') {
    const input = document.querySelector(`.feedback-input[data-id="${id}"]`);
    const text = input?.value.trim();

    if (!text) {
      alert('Digite o feedback do professor antes de enviar.');
      return;
    }

    students = students.map((student) =>
      student.id === id
        ? { ...student, feedbacks: [...(student.feedbacks || []), text] }
        : student
    );

    saveStudents();
    renderStudents();
  }
});

updateAccess();
renderStudents();
