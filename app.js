// ======================================================
// MOZSABER — APP.JS
// ======================================================


// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL =
    "https://xkwszbbrgvhqwwzxamlm.supabase.co";

// MANTENHA A SUA SUPABASE_KEY ATUAL AQUI
const SUPABASE_KEY =
    "sb_publishable_72MmOUrvKDAXsmVza5HB3g_dgjDyjUZ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ======================================================
// ELEMENTOS
// ======================================================

const paginaLogin =
    document.getElementById("paginaLogin");

const paginaInicio =
    document.getElementById("paginaInicio");

const paginaPerfil =
    document.getElementById("paginaPerfil");

const paginaGerador =
    document.getElementById("paginaGerador");

const paginaResultado =
    document.getElementById("paginaResultado");

const btnEntrar =
    document.getElementById("btnEntrar");

const btnCriarConta =
    document.getElementById("btnCriarConta");

const guardarPerfil =
    document.getElementById("guardarPerfil");

const gerarPlano =
    document.getElementById("gerarPlano");


// ======================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ======================================================

function mostrarPagina(nomePagina) {

    const paginas = [
        paginaLogin,
        paginaInicio,
        paginaPerfil,
        paginaGerador,
        paginaResultado
    ];

    paginas.forEach((pagina) => {

        if (pagina) {
            pagina.style.display = "none";
        }

    });


    if (nomePagina === "login" && paginaLogin) {
        paginaLogin.style.display = "flex";
    }


    if (nomePagina === "inicio" && paginaInicio) {
        paginaInicio.style.display = "block";
    }


    if (nomePagina === "perfil" && paginaPerfil) {
        paginaPerfil.style.display = "block";
    }


    if (nomePagina === "gerador" && paginaGerador) {
        paginaGerador.style.display = "block";
    }


    if (nomePagina === "resultado" && paginaResultado) {
        paginaResultado.style.display = "block";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================================
// MENSAGEM DE LOGIN
// ======================================================

function mostrarMensagemAcesso(texto) {

    const mensagem =
        document.getElementById("mensagemAcesso");

    if (mensagem) {
        mensagem.textContent = texto;
    }
}


// ======================================================
// CARREGAR PERFIL
// ======================================================

async function carregarPerfil() {

    const {
        data: { user },
        error: erroSessao
    } = await supabaseClient.auth.getUser();


    if (erroSessao || !user) {
        return;
    }


    const {
        data: perfil,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "nome, escola, turma, numero_alunos"
            )
            .eq("id", user.id)
            .maybeSingle();


    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        return;
    }


    if (!perfil) {
        return;
    }


    const nomeProfessor =
        document.getElementById("nomeProfessor");

    const escola =
        document.getElementById("escola");

    const turma =
        document.getElementById("turma");

    const numeroAlunos =
        document.getElementById("numeroAlunos");


    if (nomeProfessor) {
        nomeProfessor.value =
            perfil.nome || "";
    }


    if (escola) {
        escola.value =
            perfil.escola || "";
    }


    if (turma) {
        turma.value =
            perfil.turma || "";
    }


    if (numeroAlunos) {
        numeroAlunos.value =
            perfil.numero_alunos || "";
    }
}


// ======================================================
// GUARDAR PERFIL
// ======================================================

if (guardarPerfil) {

    guardarPerfil.addEventListener(
        "click",
        async () => {

            const mensagem =
                document.getElementById(
                    "mensagemPerfil"
                );


            const {
                data: { user },
                error: erroSessao
            } =
                await supabaseClient.auth.getUser();


            if (erroSessao || !user) {

                if (mensagem) {
                    mensagem.textContent =
                        "A sessão terminou. Entre novamente.";
                }

                mostrarPagina("login");

                return;
            }


            const nome =
                document
                    .getElementById("nomeProfessor")
                    .value
                    .trim();


            const escola =
                document
                    .getElementById("escola")
                    .value
                    .trim();


            const turma =
                document
                    .getElementById("turma")
                    .value
                    .trim();


            const numeroAlunos =
                document
                    .getElementById("numeroAlunos")
                    .value
                    .trim();


            if (
                !nome ||
                !escola ||
                !turma ||
                !numeroAlunos
            ) {

                if (mensagem) {
                    mensagem.textContent =
                        "Preencha todos os campos do perfil.";
                }

                return;
            }


            if (mensagem) {
                mensagem.textContent =
                    "A guardar o perfil...";
            }


            const {
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .update({

                        nome: nome,

                        escola: escola,

                        turma: turma,

                        numero_alunos:
                            parseInt(
                                numeroAlunos
                            )

                    })
                    .eq(
                        "id",
                        user.id
                    );


            if (error) {

                console.error(
                    "Erro ao guardar perfil:",
                    error
                );

                if (mensagem) {
                    mensagem.textContent =
                        "Não foi possível guardar o perfil.";
                }

                return;
            }


            if (mensagem) {
                mensagem.textContent = "";
            }


            mostrarPagina("gerador");
        }
    );
}


// ======================================================
// ENTRAR
// ======================================================

if (btnEntrar) {

    btnEntrar.addEventListener(
        "click",
        async () => {

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            if (!email || !password) {

                mostrarMensagemAcesso(
                    "Preencha o email e a palavra-passe."
                );

                return;
            }


            mostrarMensagemAcesso(
                "A entrar..."
            );


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth.signInWithPassword({

                        email: email,

                        password: password

                    });


            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                mostrarMensagemAcesso(
                    "Email ou palavra-passe incorretos."
                );

                return;
            }


            if (!data.session) {

                mostrarMensagemAcesso(
                    "Não foi possível iniciar a sessão."
                );

                return;
            }


            mostrarMensagemAcesso(
                "Entrada realizada com sucesso!"
            );


            await carregarPerfil();

            await carregarConta();


            setTimeout(() => {

                mostrarPagina("inicio");

            }, 300);

        }
    );
}


// ======================================================
// CRIAR CONTA
// ======================================================

if (btnCriarConta) {

    btnCriarConta.addEventListener(
        "click",
        async () => {

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            if (!email || !password) {

                mostrarMensagemAcesso(
                    "Preencha o email e a palavra-passe."
                );

                return;
            }


            if (password.length < 6) {

                mostrarMensagemAcesso(
                    "A palavra-passe deve ter pelo menos 6 caracteres."
                );

                return;
            }


            mostrarMensagemAcesso(
                "A criar a sua conta..."
            );


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password

                });


            if (error) {

                console.error(
                    "Erro ao criar conta:",
                    error
                );

                mostrarMensagemAcesso(
                    "Não foi possível criar a conta: " +
                    error.message
                );

                return;
            }


            if (data.session) {

                mostrarMensagemAcesso(
                    "Conta criada com sucesso!"
                );


                await carregarPerfil();

                await carregarConta();


                setTimeout(() => {

                    mostrarPagina("inicio");

                }, 300);


                return;
            }


            mostrarMensagemAcesso(
                "Conta criada. Verifique o seu email para confirmar a conta e depois entre."
            );

        }
    );
}


// ======================================================
// GERAR PLANO
// ======================================================

if (gerarPlano) {

    gerarPlano.addEventListener(
        "click",
        async () => {

            const disciplina =
                document
                    .getElementById("disciplina")
                    .value
                    .trim();


            const unidadeTematica =
                document
                    .getElementById("unidadeTematica")
                    .value
                    .trim();


            const classe =
                document
                    .getElementById("classe")
                    .value;


            const tema =
                document
                    .getElementById("tema")
                    .value
                    .trim();


            const duracao =
                document
                    .getElementById("duracao")
                    .value
                    .trim();


            const tipoAula =
                document
                    .getElementById("tipoAula")
                    .value;


            const mensagem =
                document.getElementById(
                    "mensagemGeracao"
                );


            const conteudo =
                document.getElementById(
                    "conteudoPlano"
                );


            if (!disciplina) {

                mensagem.textContent =
                    "Escreva a disciplina.";

                return;
            }


            if (!unidadeTematica) {

                mensagem.textContent =
                    "Escreva a unidade temática.";

                return;
            }


            if (!tema) {

                mensagem.textContent =
                    "Escreva o tema da aula.";

                return;
            }


            if (!tipoAula) {

                mensagem.textContent =
                    "Selecione o tipo de aula.";

                return;
            }


            if (!duracao) {

                mensagem.textContent =
                    "Informe a duração.";

                return;
            }


            if (!classe) {

                mensagem.textContent =
                    "Selecione a classe.";

                return;
            }


            const {
                data: { session },
                error: erroSessao
            } =
                await supabaseClient
                    .auth.getSession();


            if (
                erroSessao ||
                !session
            ) {

                mensagem.textContent =
                    "Entre na sua conta antes de gerar um plano.";

                mostrarPagina("login");

                return;
            }


            mensagem.textContent =
                "O MozSaber está a preparar o seu plano...";


            conteudo.textContent =
                "Aguarde enquanto o plano está a ser preparado.";


            const {
                data: perfil,
                error: erroPerfil
            } =
                await supabaseClient
                    .from("profiles")
                    .select(
                        "nome, escola, turma, numero_alunos"
                    )
                    .eq(
                        "id",
                        session.user.id
                    )
                    .maybeSingle();


            if (erroPerfil) {

                console.error(
                    "Erro ao obter perfil:",
                    erroPerfil
                );

                mensagem.textContent =
                    "Não foi possível obter o perfil.";

                return;
            }


            const perfilPlano = {

                nomeProfessor:
                    perfil?.nome || "",

                escola:
                    perfil?.escola || "",

                turma:
                    perfil?.turma || "",

                numeroAlunos:
                    perfil?.numero_alunos || ""

            };


            try {

                const resposta =
                    await fetch(
                        "https://mozsaber-server.onrender.com/gerar-plano",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " +
                                    session.access_token

                            },

                            body:
                                JSON.stringify({

                                    disciplina,

                                    unidadeTematica,

                                    classe,

                                    tema,

                                    duracao,

                                    tipoAula,

                                    perfil:
                                        perfilPlano

                                })

                        }
                    );


                let dados;


                try {

                    dados =
                        await resposta.json();

                } catch {

                    dados = {

                        mensagem:
                            "Resposta inválida do servidor."

                    };
                }


                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        "Erro ao gerar o plano."
                    );
                }


                conteudo.textContent =
                    dados.plano ||
                    "Plano não recebido.";


                mensagem.textContent =
                    "Plano gerado com sucesso.";


                mostrarPagina("resultado");


                await carregarConta();

            } catch (erro) {

                console.error(
                    "Erro ao gerar plano:",
                    erro
                );


                mensagem.textContent =
                    erro.message ||
                    "Não foi possível gerar o plano.";


                conteudo.textContent =
                    "Ocorreu um erro ao comunicar com o servidor MozSaber.";
            }
        }
    );
}


// ======================================================
// CARREGAR CONTA
// ======================================================

async function carregarConta() {

    const planosGratis =
        document.getElementById(
            "planosGratis"
        );


    const creditosPagos =
        document.getElementById(
            "creditosPagos"
        );


    if (
        !planosGratis ||
        !creditosPagos
    ) {
        return;
    }


    const {
        data: { user },
        error: erroSessao
    } =
        await supabaseClient.auth.getUser();


    if (erroSessao || !user) {

        planosGratis.textContent =
            "--";

        creditosPagos.textContent =
            "--";

        return;
    }


    const {
        data: perfil,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "planos_gratis_usados, creditos"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (error || !perfil) {

        planosGratis.textContent =
            "--";

        creditosPagos.textContent =
            "--";

        return;
    }


    const usados =
        Number(
            perfil.planos_gratis_usados || 0
        );


    const creditos =
        Number(
            perfil.creditos || 0
        );


    const restantes =
        Math.max(
            0,
            3 - usados
        );


    planosGratis.textContent =
        restantes + " de 3";


    creditosPagos.textContent =
        creditos;
}


// ======================================================
// PAINÉIS DA BARRA INFERIOR
// ======================================================

function abrirPainel(nome) {

    let painel = null;


    if (nome === "biblioteca") {

        painel =
            document.getElementById(
                "painelBiblioteca"
            );
    }


    if (nome === "conta") {

        painel =
            document.getElementById(
                "painelConta"
            );
    }


    if (nome === "autor") {

        painel =
            document.getElementById(
                "painelAutor"
            );
    }


    if (painel) {

        painel.classList.add("ativo");

    }


    if (nome === "conta") {

        carregarConta();

    }
}


function fecharPainel(nome) {

    let painel = null;


    if (nome === "biblioteca") {

        painel =
            document.getElementById(
                "painelBiblioteca"
            );
    }


    if (nome === "conta") {

        painel =
            document.getElementById(
                "painelConta"
            );
    }


    if (nome === "autor") {

        painel =
            document.getElementById(
                "painelAutor"
            );
    }


    if (painel) {

        painel.classList.remove("ativo");

    }
}


// ======================================================
// BIBLIOTECA
// ======================================================

function abrirBibliotecaOpcao(opcao) {

    const painel =
        document.getElementById(
            "painelBiblioteca"
        );


    if (!painel) {
        return;
    }


    const conteudo =
        painel.querySelector(
            ".painel-conteudo"
        );


    if (!conteudo) {
        return;
    }


    if (opcao === "manuais") {

        mostrarMenuClasses();

        return;
    }


    let titulo = "";
    let mensagem = "";


    if (opcao === "recursos") {

        titulo = "Recursos Didácticos";

        mensagem =
            "Aqui estarão disponíveis fichas, textos de apoio, materiais de aula e outros recursos didácticos.";

    }


    if (opcao === "outros") {

        titulo = "Outros";

        mensagem =
            "Aqui serão disponibilizados outros materiais educativos e académicos.";

    }


    conteudo.innerHTML = `

        <button
            class="btn-fechar"
            data-fechar="biblioteca"
        >
            ×
        </button>

        <h2>${titulo}</h2>

        <div class="biblioteca-vazio">

            <div class="biblioteca-icone">
                📚
            </div>

            <p>
                ${mensagem}
            </p>

            <p>
                <strong>
                    Conteúdo em preparação.
                </strong>
            </p>

            <button
                class="opcao-painel"
                id="voltarBiblioteca"
            >
                Voltar à Biblioteca
            </button>

        </div>

    `;


    const btnVoltar =
        document.getElementById(
            "voltarBiblioteca"
        );


    if (btnVoltar) {

        btnVoltar.addEventListener(
            "click",
            () => {

                mostrarMenuBiblioteca();

            }
        );

    }


    const btnFechar =
        conteudo.querySelector(
            "[data-fechar='biblioteca']"
        );


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            () => {

                fecharPainel("biblioteca");

            }
        );

    }
}


// ======================================================
// MENU DE CLASSES DOS MANUAIS
// ======================================================

function mostrarMenuClasses() {

    const painel =
        document.getElementById(
            "painelBiblioteca"
        );


    if (!painel) {
        return;
    }


    const conteudo =
        painel.querySelector(
            ".painel-conteudo"
        );


    if (!conteudo) {
        return;
    }


    let botoesClasses = "";


    for (let i = 1; i <= 12; i++) {

        botoesClasses += `

            <button
                class="opcao-painel"
                data-classe-manual="${i}"
            >
                ${i}ª Classe
            </button>

        `;

    }


    conteudo.innerHTML = `

        <button
            class="btn-fechar"
            data-fechar="biblioteca"
        >
            ×
        </button>

        <h2>Manuais</h2>

        <p>
            Escolha a classe:
        </p>

        <div class="lista-classes">

            ${botoesClasses}

        </div>

        <button
            class="opcao-painel"
            id="voltarBibliotecaPrincipal"
        >
            ← Voltar à Biblioteca
        </button>

    `;


    const botoes =
        conteudo.querySelectorAll(
            "[data-classe-manual]"
        );


    botoes.forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                const classe =
                    botao.dataset.classeManual;

                abrirClasseManual(classe);

            }
        );

    });


    const voltar =
        document.getElementById(
            "voltarBibliotecaPrincipal"
        );


    if (voltar) {

        voltar.addEventListener(
            "click",
            () => {

                mostrarMenuBiblioteca();

            }
        );

    }


    const btnFechar =
        conteudo.querySelector(
            "[data-fechar='biblioteca']"
        );


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            () => {

                fecharPainel("biblioteca");

            }
        );

    }
}


// ======================================================
// ABRIR UMA CLASSE
// ======================================================

function abrirClasseManual(classe) {

    const painel =
        document.getElementById(
            "painelBiblioteca"
        );


    if (!painel) {
        return;
    }


    const conteudo =
        painel.querySelector(
            ".painel-conteudo"
        );


    if (!conteudo) {
        return;
    }


    conteudo.innerHTML = `

        <button
            class="btn-fechar"
            data-fechar="biblioteca"
        >
            ×
        </button>

        <h2>${classe}ª Classe</h2>

        <div class="biblioteca-vazio">

            <div class="biblioteca-icone">
                📖
            </div>

            <p>
                Manuais da ${classe}ª Classe
            </p>

            <p>
                <strong>
                    Escolha a disciplina.
                </strong>
            </p>

            <p>
                Os manuais desta classe serão
                organizados aqui.
            </p>

            <button
                class="opcao-painel"
                id="voltarClasses"
            >
                ← Voltar às Classes
            </button>

        </div>

    `;


    const voltar =
        document.getElementById(
            "voltarClasses"
        );


    if (voltar) {

        voltar.addEventListener(
            "click",
            () => {

                mostrarMenuClasses();

            }
        );

    }


    const btnFechar =
        conteudo.querySelector(
            "[data-fechar='biblioteca']"
        );


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            () => {

                fecharPainel("biblioteca");

            }
        );

    }
}


// ======================================================
// MENU PRINCIPAL DA BIBLIOTECA
// ======================================================

function mostrarMenuBiblioteca() {

    const painel =
        document.getElementById(
            "painelBiblioteca"
        );


    if (!painel) {
        return;
    }


    const conteudo =
        painel.querySelector(
            ".painel-conteudo"
        );


    if (!conteudo) {
        return;
    }


    conteudo.innerHTML = `

        <button
            class="btn-fechar"
            data-fechar="biblioteca"
        >
            ×
        </button>

        <h2>Biblioteca</h2>

        <button
            class="opcao-painel"
            id="btnManuais"
        >
            📚 Manuais
        </button>

        <button
            class="opcao-painel"
            id="btnRecursos"
        >
            📝 Recursos Didácticos
        </button>

        <button
            class="opcao-painel"
            id="btnOutros"
        >
            📂 Outros
        </button>

    `;


    const btnManuais =
        document.getElementById(
            "btnManuais"
        );


    const btnRecursos =
        document.getElementById(
            "btnRecursos"
        );


    const btnOutros =
        document.getElementById(
            "btnOutros"
        );


    if (btnManuais) {

        btnManuais.addEventListener(
            "click",
            () => {

                abrirBibliotecaOpcao(
                    "manuais"
                );

            }
        );

    }


    if (btnRecursos) {

        btnRecursos.addEventListener(
            "click",
            () => {

                abrirBibliotecaOpcao(
                    "recursos"
                );

            }
        );

    }


    if (btnOutros) {

        btnOutros.addEventListener(
            "click",
            () => {

                abrirBibliotecaOpcao(
                    "outros"
                );

            }
        );

    }


    const btnFechar =
        conteudo.querySelector(
            "[data-fechar='biblioteca']"
        );


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            () => {

                fecharPainel("biblioteca");

            }
        );

    }
}


// ======================================================
// NAVEGAÇÃO DO DASHBOARD
// ======================================================

const btnCriarPlanoDashboard =
    document.getElementById(
        "btnCriarPlanoDashboard"
    );

const atalhoPlano =
    document.getElementById(
        "atalhoPlano"
    );

const atalhoPerfil =
    document.getElementById(
        "atalhoPerfil"
    );

const atalhoMeusPlanos =
    document.getElementById(
        "atalhoMeusPlanos"
    );

const atalhoRecursos =
    document.getElementById(
        "atalhoRecursos"
    );

const cartaoPlanos =
    document.getElementById(
        "cartaoPlanos"
    );

const cartaoBiblioteca =
    document.getElementById(
        "cartaoBiblioteca"
    );


// Criar Plano

if (btnCriarPlanoDashboard) {

    btnCriarPlanoDashboard.addEventListener(
        "click",
        () => {

            mostrarPagina("gerador");

        }
    );
}


// Plano

if (atalhoPlano) {

    atalhoPlano.addEventListener(
        "click",
        () => {

            mostrarPagina("gerador");

        }
    );
}


// Perfil

if (atalhoPerfil) {

    atalhoPerfil.addEventListener(
        "click",
        async () => {

            await carregarPerfil();

            mostrarPagina("perfil");

        }
    );
}


// Meus Planos

if (atalhoMeusPlanos) {

    atalhoMeusPlanos.addEventListener(
        "click",
        () => {

            alert(
                "A área Meus Planos será adicionada em breve."
            );

        }
    );
}


// Recursos

if (atalhoRecursos) {

    atalhoRecursos.addEventListener(
        "click",
        () => {

            mostrarMenuBiblioteca();

            abrirPainel("biblioteca");

        }
    );
}


// Cartão Planos

if (cartaoPlanos) {

    cartaoPlanos.addEventListener(
        "click",
        () => {

            mostrarPagina("gerador");

        }
    );
}


// Cartão Biblioteca

if (cartaoBiblioteca) {

    cartaoBiblioteca.addEventListener(
        "click",
        () => {

            mostrarMenuBiblioteca();

            abrirPainel("biblioteca");

        }
    );
}


// ======================================================
// BOTÕES INÍCIO
// ======================================================

const botoesInicio = [

    document.getElementById("navInicio"),

    document.getElementById("navInicioPerfil"),

    document.getElementById("navInicioGerador"),

    document.getElementById("navInicioResultado")

];


botoesInicio.forEach((botao) => {

    if (botao) {

        botao.addEventListener(
            "click",
            () => {

                mostrarPagina("inicio");

            }
        );

    }

});


// ======================================================
// ABRIR PAINÉIS DA BARRA INFERIOR
// ======================================================

document
    .querySelectorAll("[data-abrir]")
    .forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                const nome =
                    botao.dataset.abrir;


                if (nome === "biblioteca") {

                    mostrarMenuBiblioteca();

                }


                abrirPainel(nome);

            }
        );

    });


// ======================================================
// FECHAR PAINÉIS
// ======================================================

document
    .querySelectorAll("[data-fechar]")
    .forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                fecharPainel(
                    botao.dataset.fechar
                );

            }
        );

    });


// ======================================================
// FECHAR AO CLICAR FORA
// ======================================================

document
    .querySelectorAll(".painel")
    .forEach((painel) => {

        painel.addEventListener(
            "click",
            (evento) => {

                if (
                    evento.target === painel
                ) {

                    painel.classList.remove(
                        "ativo"
                    );

                }

            }
        );

    });


// ======================================================
// SAIR DA CONTA
// ======================================================

const btnSair =
    document.getElementById("btnSair");


if (btnSair) {

    btnSair.addEventListener(
        "click",
        async () => {

            const {
                error
            } =
                await supabaseClient
                    .auth.signOut();


            if (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                return;
            }


            fecharPainel("conta");

            mostrarPagina("login");


            const email =
                document.getElementById("email");

            const password =
                document.getElementById("password");


            if (email) {
                email.value = "";
            }


            if (password) {
                password.value = "";
            }


            mostrarMensagemAcesso("");

        }
    );
}


// ======================================================
// VERIFICAR SESSÃO AO ABRIR
// ======================================================

async function verificarSessao() {

    const {
        data: { session },
        error
    } =
        await supabaseClient
            .auth.getSession();


    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        mostrarPagina("login");

        return;
    }


    if (session) {

        await carregarPerfil();

        await carregarConta();

        mostrarPagina("inicio");

    } else {

        mostrarPagina("login");

    }
}


// ======================================================
// INICIAR
// ======================================================

verificarSessao();