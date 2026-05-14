/* ============================================
   VittaWear - Sistema de Autenticação Real
   Conectado à API Flask (vittawear-backend)
   ============================================ */

const API_URL = 'http://127.0.0.1:5000';
const AUTH_KEY = 'vittawear_usuario';
const TOKEN_KEY = 'vittawear_token';

function obterUsuarioLogado() {
    try {
        const usuario = localStorage.getItem(AUTH_KEY);
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        return null;
    }
}

function obterToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function estaLogado() {
    return obterToken() !== null && obterUsuarioLogado() !== null;
}

function _salvarSessao(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
}

function realizarLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);

    if (typeof mostrarNotificacao === 'function') {
        mostrarNotificacao('Você saiu da sua conta', 'info');
    }

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

async function cadastrarUsuario(dados) {
    const { nome, email, senha, telefone } = dados;

    if (!nome || !email || !senha) {
        return { sucesso: false, mensagem: 'Preencha todos os campos obrigatórios' };
    }

    if (!validarEmail(email)) {
        return { sucesso: false, mensagem: 'E-mail inválido' };
    }

    if (senha.length < 6) {
        return { sucesso: false, mensagem: 'A senha deve ter pelo menos 6 caracteres' };
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, telefone: telefone || '' }),
        });

        const dados_resposta = await response.json();

        if (!response.ok) {
            return { sucesso: false, mensagem: dados_resposta.erro || 'Erro ao realizar cadastro' };
        }

        _salvarSessao(dados_resposta.token, dados_resposta.usuario);
        return { sucesso: true, mensagem: dados_resposta.mensagem || 'Cadastro realizado com sucesso!' };

    } catch (error) {
        return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor. Tente novamente.' };
    }
}

async function realizarLogin(email, senha) {
    if (!email || !senha) {
        return { sucesso: false, mensagem: 'Preencha todos os campos' };
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const dados = await response.json();

        if (!response.ok) {
            return { sucesso: false, mensagem: dados.erro || 'E-mail ou senha incorretos' };
        }

        _salvarSessao(dados.token, dados.usuario);
        return { sucesso: true, mensagem: dados.mensagem || 'Login realizado com sucesso!' };

    } catch (error) {
        return { sucesso: false, mensagem: 'Não foi possível conectar ao servidor. Tente novamente.' };
    }
}

async function buscarPerfil() {
    const token = obterToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/api/auth/perfil`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401) {
            realizarLogout();
            return null;
        }

        const dados = await response.json();
        localStorage.setItem(AUTH_KEY, JSON.stringify(dados));
        return dados;

    } catch (error) {
        return null;
    }
}

function atualizarBotaoLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const loginText = loginBtn?.querySelector('.login-text');
    const usuario = obterUsuarioLogado();

    if (!loginBtn || !loginText) return;

    if (usuario) {
        const primeiroNome = usuario.nome.split(' ')[0];
        loginText.textContent = primeiroNome;
        loginBtn.href = 'perfil.html';

        if (!document.getElementById('logoutBtn')) {
            const sairBtn = document.createElement('button');
            sairBtn.id = 'logoutBtn';
            sairBtn.textContent = 'Sair';
            sairBtn.className = 'logout-btn';
            sairBtn.addEventListener('click', realizarLogout);
            loginBtn.parentElement.appendChild(sairBtn);
        }
    } else {
        loginText.textContent = 'Entrar';
        loginBtn.href = 'login.html';
    }
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function exigirLogin() {
    if (!estaLogado()) {
        window.location.href = 'login.html';
    }
}

function redirecionarSeLogado() {
    if (estaLogado()) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', atualizarBotaoLogin);
