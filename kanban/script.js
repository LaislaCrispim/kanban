let projetos = [];

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const card = document.getElementById(data);
  ev.target.closest(".kanban-column").appendChild(card);
  sortCards(ev.target.closest(".kanban-column"));
}

function criarProjetoCard(projeto, index) {
  const div = document.createElement("div");
  div.className = `project-card priority-${projeto.prioridade}`;
  div.draggable = true;
  div.id = "proj-" + Date.now() + "-" + index;
  div.ondragstart = drag;

  div.innerHTML = `
    <strong>${projeto.titulo}</strong>
    <small>Entrega: ${projeto.dataEntrega}</small>
    <small>Responsável: ${projeto.responsavel || "Não atribuído"}</small>
    <div class="botoes">
      <button onclick="editarProjeto(${index}, event)">✏️</button>
      <button onclick="excluirProjeto(${index}, event)">❌</button>
    </div>
  `;

  div.addEventListener("click", function(e) {
    if (e.target.tagName !== "BUTTON") {
      e.stopPropagation();
      visualizarProjeto(index);
    }
  });

  return div;
}

function inicializarProjetos() {
  projetos.forEach((projeto, index) => {
    const card = criarProjetoCard(projeto, index);
    document.getElementById(projeto.status).appendChild(card);
  });
}

function sortCards(column) {
  const cards = Array.from(column.querySelectorAll(".project-card"));
  cards.sort((a, b) => {
    const dateA = new Date(a.querySelector("small").textContent.replace("Entrega: ", ""));
    const dateB = new Date(b.querySelector("small").textContent.replace("Entrega: ", ""));
    return dateA - dateB;
  });
  cards.forEach(card => column.appendChild(card));
}

function abrirModal(statusColuna) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("colunaDestino").value = statusColuna;
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("formProjeto").reset();
}

document.getElementById("formProjeto").addEventListener("submit", function (e) {
  e.preventDefault();

  const projeto = {
    titulo: document.getElementById("titulo").value,
    dataEntrega: document.getElementById("dataEntrega").value,
    responsavel: document.getElementById("responsavel").value,
    prioridade: document.getElementById("prioridade").value,
    imagem: document.getElementById("imagem").value,
    observacoes: document.getElementById("observacoes").value,
    status: document.getElementById("colunaDestino").value
  };

  projetos.push(projeto);
  const card = criarProjetoCard(projeto, projetos.length - 1);
  const coluna = document.getElementById(projeto.status);
  coluna.appendChild(card);
  sortCards(coluna);
  fecharModal();
});

function visualizarProjeto(index) {
  const p = projetos[index];
  const conteudo = `
    <h3>${p.titulo}</h3>
    <p><strong>Entrega:</strong> ${p.dataEntrega}</p>
    <p><strong>Responsável:</strong> ${p.responsavel}</p>
    <p><strong>Prioridade:</strong> ${p.prioridade}</p>
    <p><strong>Observações:</strong> ${p.observacoes}</p>
    ${p.imagem ? `<img src="${p.imagem}" style="max-width:100%; border-radius:8px;">` : ""}
  `;
  document.getElementById("visualizacaoConteudo").innerHTML = conteudo;
  document.getElementById("visualizacaoModal").style.display = "flex";
}

function fecharVisualizacao() {
  document.getElementById("visualizacaoModal").style.display = "none";
}

function excluirProjeto(index, e) {
  e.stopPropagation();
  if (confirm("Deseja excluir este projeto?")) {
    projetos.splice(index, 1);
    atualizarKanban();
  }
}

function editarProjeto(index, e) {
  e.stopPropagation();
  const p = projetos[index];
  document.getElementById("modal").style.display = "flex";
  document.getElementById("colunaDestino").value = p.status;
  document.getElementById("titulo").value = p.titulo;
  document.getElementById("dataEntrega").value = p.dataEntrega;
  document.getElementById("responsavel").value = p.responsavel;
  document.getElementById("prioridade").value = p.prioridade;
  document.getElementById("imagem").value = p.imagem;
  document.getElementById("observacoes").value = p.observacoes;

  projetos.splice(index, 1);
}

function atualizarKanban() {
  document.querySelectorAll(".kanban-column").forEach(coluna => coluna.querySelectorAll(".project-card").forEach(card => card.remove()));
  inicializarProjetos();
}

inicializarProjetos();
