// 1. CONFIGURAÇÃO DO FIREBASE (Com suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyCU3wUqSVdmtV8sjIikGPjojylP1cBDSp4",
  authDomain: "site-trabalho3.firebaseapp.com",
  databaseURL: "https://site-trabalho3-default-rtdb.firebaseio.com",
  projectId: "site-trabalho3",
  storageBucket: "site-trabalho3.firebasestorage.app",
  messagingSenderId: "938960999851",
  appId: "1:938960999851:web:beffbf91bd4644d3456eee",
  measurementId: "G-2847P953EK"
};

// 2. INICIALIZAR FIREBASE E BANCO DE DADOS
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const vagasRef = db.ref('vagas');

// 3. CAPTURAR ELEMENTOS DA TELA
const form = document.getElementById('vagaForm');
const container = document.getElementById('vagasContainer');
const mensagemDiv = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
    mensagemDiv.textContent = texto;
    if (tipo === 'sucesso') {
        mensagemDiv.className = 'p-3 rounded text-sm text-center font-medium block bg-green-100 text-green-700';
    } else {
        mensagemDiv.className = 'p-3 rounded text-sm text-center font-medium block bg-red-100 text-red-700';
    }
    setTimeout(() => {
        mensagemDiv.classList.add('hidden');
        mensagemDiv.classList.remove('block');
    }, 3500);
}

// 4. CADASTRAR A VAGA
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const empresa = document.getElementById('empresa').value;
    const descricao = document.getElementById('descricao').value;
    const dataAtual = new Date().toLocaleDateString('pt-PT');

    // Envia para o Firebase
    vagasRef.push({
        titulo: titulo,
        empresa: empresa,
        descricao: descricao,
        dataPublicacao: dataAtual
    }).then(() => {
        form.reset();
        mostrarMensagem('Vaga publicada com sucesso!', 'sucesso');
    }).catch((error) => {
        console.error("Erro Firebase:", error);
        mostrarMensagem('Erro. Verifique as Regras do Firebase.', 'erro');
    });
});

// 5. CARREGAR AS VAGAS NA TELA
vagasRef.on('value', (snapshot) => {
    container.innerHTML = ''; 
    const dados = snapshot.val();
    
    if (dados) {
        const vagas = Object.entries(dados).reverse();
        vagas.forEach(([id, vaga]) => {
            const card = document.createElement('div');
            card.className = 'bg-white p-5 rounded-lg shadow-sm border border-gray-200 fade-in hover:shadow-md transition-shadow';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold text-blue-700 leading-tight">${vaga.titulo}</h3>
                    <span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold whitespace-nowrap">Estágio</span>
                </div>
                <p class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">🏢 ${vaga.empresa}</p>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${vaga.descricao}</p>
                <div class="mt-auto border-t pt-3 text-xs text-gray-400 text-right">Publicado em: ${vaga.dataPublicacao || 'Hoje'}</div>
            `;
            container.appendChild(card);
        });
    } else {
        container.innerHTML = `
            <div class="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                <p class="text-gray-500 text-lg">Nenhuma vaga cadastrada ainda.</p>
                <p class="text-gray-400 text-sm mt-1">Preencha o formulário para ser o primeiro!</p>
            </div>
        `;
    }
});