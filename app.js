// ================================
// SUPABASE
// ================================

const SUPABASE_URL =
    "https://xkwszbbrgvhqwwzxamlm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_72MmOUrvKDAXsmVza5HB3g_dgjDyjUZ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ================================
// ELEMENTOS
// ================================

const btnEntrar =
    document.getElementById("btnEntrar");

const btnCriarConta =
    document.getElementById("btnCriarConta");

const guardarPerfil =
    document.getElementById("guardarPerfil");

const gerarPlano =
    document.getElementById("gerarPlano");


// ================================
// MOSTRAR UTILIZADOR
// ================================

async function mostrarUtilizador() {

    const area =
        document.getElementById("utilizadorLogado");

    if (!area) return;

    const {
        data: { user },
        error
    } =
        await supabaseClient.auth.getUser();

    if (error || !user) {

        area.innerHTML = "";

        return;
    }

    const {
        data: perfil,
        error: erroPerfil
    } =
        await supabaseClient
            .from("profiles")
            .select("nome")
            .eq("id", user.id)
            .maybeSingle();

    if (erroPerfil) {

        console.error(
            "Erro ao carregar nome:",
            erroPerfil
        );
    }

    const nome =
        perfil?.nome || user.email;

    area.innerHTML = `
        <div style="
            padding: 15px;
            background: white;
            margin: 15px 25px;
            border-radius: 8px;
        ">

            <strong>
                Olá, ${nome}!
            </strong>

            <br>

            <span>
                Conta autenticada
            </span>

            <br><br>

            <button id="btnSair">
                Sair
            </button>

        </div>
    `;

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

                window.location.reload();
            }
        );
    }
}


// ================================
// MINHA CONTA
// ================================

async function carregarConta() {

    const planosGratis =
        document.getElementById(
            "planosGratis"
        );

    const creditosPagos =
        document.getElementById(
            "creditosPagos"
        );

    const mensagemConta =
        document.getElementById(
            "mensagemConta"
        );

    if (!planosGratis || !creditosPagos) {

        console.error(
            "Elementos da conta não encontrados."
        );

        return;
    }

    const {
        data: { user },
        error: erroSessao
    } =
        await supabaseClient.auth.getUser();

    if (erroSessao || !user) {

        planosGratis.textContent = "--";
        creditosPagos.textContent = "--";

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

    if (error) {

        console.error(
            "Erro ao carregar conta:",
            error
        );

        planosGratis.textContent = "--";
        creditosPagos.textContent = "--";

        if (mensagemConta) {

            mensagemConta.textContent =
                "Não foi possível carregar os dados da conta.";
        }

        return;
    }

    if (!perfil) {

        planosGratis.textContent = "--";
        creditosPagos.textContent = "--";

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

    if (mensagemConta) {

        if (restantes > 0) {

            mensagemConta.textContent =
                "Ainda possui " +
                restantes +
                " plano(s) gratuito(s).";

        } else {

            mensagemConta.textContent =
                "Os 3 planos gratuitos já foram utilizados.";
        }
    }
}


// ================================
// CRIAR CONTA
// ================================

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

            const mensagem =
                document.getElementById(
                    "mensagemAcesso"
                );

            if (!email || !password) {

                mensagem.textContent =
                    "Preencha o email e a palavra-passe.";

                return;
            }

            if (password.length < 6) {

                mensagem.textContent =
                    "A palavra-passe deve ter pelo menos 6 caracteres.";

                return;
            }

            mensagem.textContent =
                "A criar a sua conta...";

            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password

                });

            if (error) {

                console.error(error);

                mensagem.textContent =
                    "Não foi possível criar a conta: " +
                    error.message;

                return;
            }

            console.log(
                "Conta criada:",
                data
            );

            mensagem.textContent =
                "Conta criada com sucesso. Verifique o seu email se for solicitado.";
        }
    );
}


// ================================
// ENTRAR
// ================================

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

            const mensagem =
                document.getElementById(
                    "mensagemAcesso"
                );

            if (!email || !password) {

                mensagem.textContent =
                    "Preencha o email e a palavra-passe.";

                return;
            }

            mensagem.textContent =
                "A entrar...";

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

                console.error(error);

                mensagem.textContent =
                    "Email ou palavra-passe incorretos.";

                return;
            }

            console.log(
                "Utilizador autenticado:",
                data.user
            );

            mensagem.textContent =
                "Entrada realizada com sucesso!";

            const acesso =
                document.getElementById(
                    "acesso"
                );

            if (acesso) {

                acesso.style.display =
                    "none";
            }

            await mostrarUtilizador();

            await carregarPerfil();

            await carregarConta();
        }
    );
}


// ================================
// MENU
// ================================

const btnMenu =
    document.getElementById("btnMenu");

const menu =
    document.getElementById("menu");

if (btnMenu && menu) {

    btnMenu.addEventListener(
        "click",
        () => {

            menu.classList.toggle(
                "aberto"
            );
        }
    );
}


// ================================
// PERFIL
// ================================

async function carregarPerfil() {

    const {
        data: { user },
        error: erroSessao
    } =
        await supabaseClient.auth.getUser();

    if (erroSessao || !user) {

        console.log(
            "Nenhum utilizador autenticado."
        );

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
            .eq(
                "id",
                user.id
            )
            .maybeSingle();

    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        return;
    }

    if (!perfil) return;

    const nomeProfessor =
        document.getElementById(
            "nomeProfessor"
        );

    const escola =
        document.getElementById(
            "escola"
        );

    const turma =
        document.getElementById(
            "turma"
        );

    const numeroAlunos =
        document.getElementById(
            "numeroAlunos"
        );

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
                await supabaseClient
                    .auth.getUser();

            if (erroSessao || !user) {

                mensagem.textContent =
                    "Entre na sua conta antes de guardar o perfil.";

                return;
            }

            const nome =
                document
                    .getElementById(
                        "nomeProfessor"
                    )
                    .value
                    .trim();

            const escola =
                document
                    .getElementById(
                        "escola"
                    )
                    .value
                    .trim();

            const turma =
                document
                    .getElementById(
                        "turma"
                    )
                    .value
                    .trim();

            const numeroAlunos =
                document
                    .getElementById(
                        "numeroAlunos"
                    )
                    .value
                    .trim();

            mensagem.textContent =
                "A guardar o perfil...";

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
                            numeroAlunos
                                ? parseInt(
                                    numeroAlunos
                                )
                                : 0

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

                mensagem.textContent =
                    "Não foi possível guardar o perfil.";

                return;
            }

            mensagem.textContent =
                "Perfil guardado com sucesso.";

            await mostrarUtilizador();
        }
    );
}


// ================================
// GERAR PLANO
// ================================

if (gerarPlano) {

    gerarPlano.addEventListener(
        "click",
        async () => {

            const disciplina =
                document
                    .getElementById(
                        "disciplina"
                    )
                    .value;

            const classe =
                document
                    .getElementById(
                        "classe"
                    )
                    .value;

            const tema =
                document
                    .getElementById(
                        "tema"
                    )
                    .value
                    .trim();

            const duracao =
                document
                    .getElementById(
                        "duracao"
                    )
                    .value;

            const tipoAula =
                document
                    .getElementById(
                        "tipoAula"
                    )
                    .value;

            const mensagem =
                document.getElementById(
                    "mensagemGeracao"
                );

            const conteudo =
                document.getElementById(
                    "conteudoPlano"
                );

            if (!tema) {

                mensagem.textContent =
                    "Digite o tema da aula.";

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
                    "Não foi possível obter o perfil do utilizador.";

                conteudo.textContent =
                    "";

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

                await carregarConta();

                const resultado =
                    document.getElementById(
                        "resultado"
                    );

                if (resultado) {

                    resultado.scrollIntoView({

                        behavior:
                            "smooth"

                    });
                }

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

                await carregarConta();
            }
        }
    );
}


// ================================
// BOTÕES DE COMPRA
// ================================

const btnComprar1 =
    document.getElementById(
        "btnComprar1"
    );

const btnComprar3 =
    document.getElementById(
        "btnComprar3"
    );


async function criarPedidoPagamento(
    pacote
) {

    const mensagemCompra =
        document.getElementById(
            "mensagemCompra"
        );

    try {

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

            prepararCompra(
                "Entre na sua conta para comprar créditos."
            );

            return;
        }

        prepararCompra(
            "A preparar o pedido de pagamento..."
        );


        const resposta =
            await fetch(
                "https://mozsaber-server.onrender.com/criar-pagamento",
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

                            pacote:
                                pacote

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
                "Não foi possível criar o pedido de pagamento."
            );
        }


        const pagamento =
            dados.pagamento;


        if (!pagamento) {

            throw new Error(
                "O servidor não devolveu os dados do pagamento."
            );
        }


        prepararCompra(
            "Pedido criado com sucesso. Referência: " +
            pagamento.referencia +
            " | Valor: " +
            pagamento.valor +
            " MZN | Estado: " +
            pagamento.estado
        );


        console.log(
            "Pagamento criado:",
            pagamento
        );


    } catch (erro) {

        console.error(
            "Erro ao criar pagamento:",
            erro
        );

        if (mensagemCompra) {

            mensagemCompra.textContent =
                erro.message ||
                "Não foi possível criar o pedido de pagamento.";
        }
    }
}


function prepararCompra(mensagem) {

    const mensagemCompra =
        document.getElementById(
            "mensagemCompra"
        );

    if (mensagemCompra) {

        mensagemCompra.textContent =
            mensagem;
    }
}


if (btnComprar1) {

    btnComprar1.addEventListener(
        "click",
        async () => {

            await criarPedidoPagamento(
                "1_plano"
            );

        }
    );
}


if (btnComprar3) {

    btnComprar3.addEventListener(
        "click",
        async () => {

            await criarPedidoPagamento(
                "3_planos"
            );

        }
    );
}


// ================================
// VERIFICAR SESSÃO
// ================================

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

        return;
    }

    const acesso =
        document.getElementById(
            "acesso"
        );

    const area =
        document.getElementById(
            "utilizadorLogado"
        );

    if (session) {

        if (acesso) {

            acesso.style.display =
                "none";
        }

        await mostrarUtilizador();

        await carregarPerfil();

        await carregarConta();

    } else {

        if (acesso) {

            acesso.style.display =
                "";
        }

        if (area) {

            area.innerHTML =
                "";
        }

        const planosGratis =
            document.getElementById(
                "planosGratis"
            );

        const creditosPagos =
            document.getElementById(
                "creditosPagos"
            );

        if (planosGratis) {

            planosGratis.textContent =
                "--";
        }

        if (creditosPagos) {

            creditosPagos.textContent =
                "--";
        }
    }
}


// ================================
// INICIAR MOZSABER
// ================================

verificarSessao();