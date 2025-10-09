import React, { useState, useRef } from 'react';
import './ConferenciaCaixa.css';
import { useSweetAlert } from '../hooks/useSweetAlert';

const ConferenciaCaixa = () => {
    const { showErrorAlert } = useSweetAlert();
    const [table1, setTable1] = useState('');
    const [table2, setTable2] = useState('');
    const [storedDifferences, setStoredDifferences] = useState([]);
    const [downTableVisible, setDownTableVisible] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [message, setMessage] = useState('');
    const [resultData, setResultData] = useState([]);
    const [downData, setDownData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [portasConferidas, setPortasConferidas] = useState(new Set());
    const [portasVagas, setPortasVagas] = useState(new Set());
    const [portaAtual, setPortaAtual] = useState(1);
    const [bloqueioAtivo, setBloqueioAtivo] = useState(false);
    const [historicoPortas, setHistoricoPortas] = useState([]); // Histórico de portas processadas
    const [portasPendentes, setPortasPendentes] = useState([]); // Portas que precisam ser conferidas no grupo atual
    const [clientesDownMostrados, setClientesDownMostrados] = useState(new Set()); // Clientes down já exibidos

    const portaCounterRef = useRef(1);

    // Função para extrair posição, nome e descrição da caixa de uma linha
    const extractPosicaoENome = (linha) => {
        if (!linha || linha.trim() === '') return { posicao: '', nome: '', descricao: '' };
        
        // Padrão: 1/1/1/1    1/1/1/1/2      ALCL:B3DA95BD up down -26.0 6.0 "NOME" DESCRICAO
        // ou:     1/1/8/6    1/1/8/6/1      ALCL:FC205F5D up up -27.6 2.5 JAQUELINE_RODRIGUES_DE_LIMA Blarg/39530/2132-jaquelinerlima
        
        // Tentar extrair nome entre aspas primeiro
        const regexNomeComAspas = /"([^"]+)"/;
        const matchNomeComAspas = linha.match(regexNomeComAspas);
        let nome = '';
        let indexFimNome = -1;
        
        if (matchNomeComAspas) {
            // Nome está entre aspas
            nome = matchNomeComAspas[1].trim();
            indexFimNome = linha.indexOf(matchNomeComAspas[0]) + matchNomeComAspas[0].length;
        } else {
            // Nome SEM aspas - buscar após os números de sinal (ex: -27.6 2.5)
            // Padrão: depois de "up/down" vem dois números (sinal), depois o nome
            const regexNomeSemAspas = /(?:up|down)\s+(?:up|down)\s+[-\d.]+\s+[\d.]+\s+([A-Z_]+(?:[A-Z_]+)*)/i;
            const matchNomeSemAspas = linha.match(regexNomeSemAspas);
            if (matchNomeSemAspas) {
                nome = matchNomeSemAspas[1].trim().replace(/_/g, ' '); // Substituir _ por espaço
                indexFimNome = linha.indexOf(matchNomeSemAspas[1]) + matchNomeSemAspas[1].length;
            }
        }
        
        // Encontrar a posição (formato X/X/X/X ou X/X/X/X/X)
        const regexPosicao = /(\d+\/\d+\/\d+\/\d+(?:\/\d+)?)/g;
        const posicoesEncontradas = linha.match(regexPosicao);
        // A segunda posição geralmente é a correta (primeira é rack/slot, segunda é porta completa)
        const posicao = posicoesEncontradas && posicoesEncontradas.length > 1 ? 
                        posicoesEncontradas[1] : 
                        (posicoesEncontradas && posicoesEncontradas.length > 0 ? posicoesEncontradas[0] : '');
        
        // Extrair descrição da caixa (tudo após o nome)
        let descricao = '';
        if (indexFimNome > 0) {
            // Pegar todo o resto da linha após o nome
            const restoCompleto = linha.substring(indexFimNome).trim();
            
            // Remover múltiplos espaços e "undefined"
            const descricaoLimpa = restoCompleto
                .replace(/\s+/g, ' ')
                .replace(/\bundefined\b/g, '')
                .trim();
            
            // Só atribuir se não estiver vazio
            if (descricaoLimpa && descricaoLimpa.length > 0) {
                descricao = descricaoLimpa;
            }
        }
        
        return { posicao, nome, descricao };
    };

    const handleButtonClick = async (callback) => {
        setIsLoading(true);

        // Simula o efeito de loading
        await new Promise(resolve => setTimeout(resolve, 100));

        callback();

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const compareTables = () => {
        // Verificar se pode comparar
        if (bloqueioAtivo) {
            showErrorAlert(`Por favor, marque a Porta ${portaAtual} como conferida ou vaga antes de prosseguir.`);
            return;
        }

        // Verificar se chegou ao limite de 16 portas - iniciar nova conferência
        if (portaAtual > 16) {
            iniciarNovaConferencia();
            return;
        }

        const table1Data = table1.split('\n');
        const table2Data = table2.split('\n');

        // Verificar se as tabelas estão vazias ou só têm espaços
        const table1Empty = table1.trim() === '' || table1Data.every(line => line.trim() === '');
        const table2Empty = table2.trim() === '' || table2Data.every(line => line.trim() === '');

        // AMBAS as tabelas devem estar preenchidas - verificar se alguma está vazia
        if (table1Empty || table2Empty) {
            if (table1Empty && table2Empty) {
                showErrorAlert('Ambas as tabelas estão vazias. Por favor, preencha a "Tabela Antes" e a "Tabela Depois" para realizar a verificação da porta.');
                setMessage(`Erro: Ambas as tabelas vazias - Preencha as duas tabelas para continuar`);
            } else if (table1Empty) {
                showErrorAlert('A "Tabela Antes" está vazia. Por favor, insira os dados da tabela antes de retirar qualquer porta da caixa.');
                setMessage(`Erro: Tabela Antes vazia - Insira os dados para continuar`);
            } else if (table2Empty) {
                showErrorAlert('A "Tabela Depois" está vazia. Por favor, insira os dados da tabela após o técnico retirar alguma porta.');
                setMessage(`Erro: Tabela Depois vazia - Insira os dados para continuar`);
            }
            return;
        }

        const maxLength = Math.max(table1Data.length, table2Data.length);
        const newResultData = [];
        const newDownData = [];

        let hasDifferences = false;
        const allDifferences = []; // Array para armazenar todas as diferenças

        for (let i = 0; i < maxLength; i++) {
            const row1 = (table1Data[i] || '').trim();
            const row2 = (table2Data[i] || '').trim();

            const cols1 = row1.split(/\s+/);
            const cols2 = row2.split(/\s+/);

            const index1 = cols1.findIndex(col => col.startsWith('-'));
            const index2 = cols2.findIndex(col => col.startsWith('-'));

            const compareLength = Math.min(
                index1 >= 0 ? index1 : cols1.length,
                index2 >= 0 ? index2 : cols2.length
            );

            let isDifferent = false;
            for (let j = 0; j < compareLength; j++) {
                if (cols1[j] !== cols2[j]) {
                    // Verificar se é um caso de cliente down que ficou up
                    const row1IsDown = row1.toLowerCase().includes("down");
                    const row2IsUp = row2 && !row2.toLowerCase().includes("down");
                    
                    // Se estava down na tabela 1 e ficou up na tabela 2, ignorar essa diferença
                    if (row1IsDown && row2IsUp) {
                        isDifferent = false;
                        break;
                    }
                    
                    // Verificar se é um cliente down que já foi mostrado
                    if (row1IsDown) {
                        const { posicao, nome } = extractPosicaoENome(row1);
                        const clienteId = posicao || nome || row1;
                        
                        // Se já foi mostrado, ignorar esta diferença
                        if (clientesDownMostrados.has(clienteId)) {
                            isDifferent = false;
                            break;
                        }
                    }
                    
                    hasDifferences = true;
                    isDifferent = true;
                    // Armazenar todas as diferenças encontradas
                    allDifferences.push({
                        row1: row1,
                        row2: row2
                    });
                    break;
                }
            }

            newResultData.push({
                line: i + 1,
                row1: row1,
                row2: row2,
                isDifferent: isDifferent
            });

            // Só coleta dados de clientes down se não foram analisados independentemente
            if (row1.toLowerCase().includes("down") && !downTableVisible) {
                // Extrair identificador único do cliente (posição ou nome)
                const { posicao, nome } = extractPosicaoENome(row1);
                const clienteId = posicao || nome || row1;
                
                // Só adiciona se ainda não foi mostrado
                if (!clientesDownMostrados.has(clienteId)) {
                    newDownData.push({
                        line: i + 1,
                        content: row1
                    });
                }
            }
        }

        setResultData(newResultData);
        
        // Atualizar o Set de clientes down ANTES de criar as diferenças
        const novosClientesDown = new Set(clientesDownMostrados);
        
        // Só atualiza downData se não foram analisados independentemente
        if (!downTableVisible) {
            setDownData(newDownData);
            
            // Adicionar os clientes down ao Set de já mostrados
            newDownData.forEach(item => {
                const { posicao, nome } = extractPosicaoENome(item.content);
                const clienteId = posicao || nome || item.content;
                novosClientesDown.add(clienteId);
            });
        }
        
        // Adicionar clientes down de allDifferences ao Set
        allDifferences.forEach(diff => {
            const row1IsDown = diff.row1 && diff.row1.toLowerCase().includes("down");
            if (row1IsDown) {
                const { posicao, nome } = extractPosicaoENome(diff.row1);
                const clienteId = posicao || nome || diff.row1;
                novosClientesDown.add(clienteId);
            }
        });
        
        // Atualizar o estado do Set
        setClientesDownMostrados(novosClientesDown);

        // Criar entradas para TODAS as diferenças encontradas, cada uma em uma porta diferente
        let differences = [];
        const novasPortasPendentes = [];
        
        if (!hasDifferences) {
            // Verificar se as tabelas têm conteúdo e são idênticas a uma comparação anterior
            const conteudoTabela1 = table1.trim();
            const conteudoTabela2 = table2.trim();
            
            // Se ambas as tabelas têm conteúdo e são idênticas entre si
            if (conteudoTabela1 && conteudoTabela2 && conteudoTabela1 === conteudoTabela2) {
                // Verificar se esse conteúdo já foi usado em alguma porta anterior
                const portaComMesmoConteudo = storedDifferences.find(stored => {
                    // Comparar o conteúdo da linha com as diferenças armazenadas
                    const linhasTabela1 = conteudoTabela1.split('\n').filter(l => l.trim());
                    const linhaArmazenada = stored.row1 || stored.row2;
                    
                    // Verificar se alguma linha da tabela atual está nas diferenças armazenadas
                    return linhasTabela1.some(linha => {
                        const { posicao, nome } = extractPosicaoENome(linha.trim());
                        const clienteId = posicao || nome;
                        if (!clienteId) return false;
                        
                        const { posicao: storedPos, nome: storedNome } = extractPosicaoENome(linhaArmazenada);
                        const storedId = storedPos || storedNome;
                        return clienteId === storedId;
                    });
                });
                
                if (portaComMesmoConteudo) {
                    showErrorAlert(`As tabelas são idênticas, mas esse conteúdo já foi registrado na Porta ${portaComMesmoConteudo.portaIndex}!\n\nPor favor, verifique se você atualizou as tabelas corretamente para a Porta ${portaAtual}.`);
                    setMessage(`Erro: Conteúdo duplicado da Porta ${portaComMesmoConteudo.portaIndex} - Verifique as tabelas`);
                    setIsLoading(false);
                    return;
                }
            }
            
            // Adicionar entrada "Porta Vaga" quando não há diferenças
            const portaVagaEntry = {
                line: `Porta ${portaAtual}`,
                row1: "Porta Vaga",
                row2: "Porta Vaga",
                portaIndex: portaAtual,
                isPortaLivre: true
            };
            differences.push(portaVagaEntry);
            novasPortasPendentes.push(portaAtual);
            setMessage(`Porta ${portaAtual}: Porta Vaga - Marque como vaga para continuar`);
        } else {
            // Verificar se alguma das diferenças já está em uma porta anterior
            const diferencasDuplicadas = [];
            
            allDifferences.forEach((diff) => {
                const linhaRemovida = diff.row1 && !diff.row2 ? diff.row1 : 
                                      !diff.row1 && diff.row2 ? diff.row2 : 
                                      diff.row1;
                
                const { posicao, nome } = extractPosicaoENome(linhaRemovida);
                const clienteId = posicao || nome;
                
                if (clienteId) {
                    // Verificar se já existe em storedDifferences
                    const portaExistente = storedDifferences.find(stored => {
                        const storedLinha = stored.row1 || stored.row2;
                        const { posicao: storedPos, nome: storedNome } = extractPosicaoENome(storedLinha);
                        const storedId = storedPos || storedNome;
                        return storedId === clienteId;
                    });
                    
                    if (portaExistente) {
                        diferencasDuplicadas.push({
                            cliente: clienteId,
                            portaAnterior: portaExistente.portaIndex
                        });
                    }
                }
            });
            
                        // Se encontrou duplicatas, alertar e parar
            if (diferencasDuplicadas.length > 0) {
                const mensagensErro = diferencasDuplicadas.map(dup => 
                    `Cliente "${dup.cliente}" já foi registrado na Porta ${dup.portaAnterior}`
                ).join('\n');
                
                showErrorAlert(`Diferenças duplicadas detectadas!\n\n${mensagensErro}\n\nPor favor, verifique se a Porta ${portaAtual} foi comparada corretamente. As tabelas podem estar idênticas à comparação anterior.`);
                setMessage(`Erro: Diferenças duplicadas - Verifique a Porta ${portaAtual}`);
                setIsLoading(false);
                return;
            }
            
            // Verificar se há múltiplas diferenças - indicando erro na conferência
            if (allDifferences.length > 1) {
                // Extrair informações de cada diferença para mostrar no alerta
                const listadiferencas = allDifferences.map((diff, index) => {
                    const linhaRemovida = diff.row1 && !diff.row2 ? diff.row1 : 
                                          !diff.row1 && diff.row2 ? diff.row2 : 
                                          diff.row1;
                    const { posicao, nome } = extractPosicaoENome(linhaRemovida);
                    
                    if (posicao && nome) {
                        return `${index + 1}. ${posicao} - "${nome}"`;
                    } else if (nome) {
                        return `${index + 1}. "${nome}"`;
                    } else if (posicao) {
                        return `${index + 1}. ${posicao}`;
                    } else {
                        // Mostrar apenas os primeiros 60 caracteres da linha
                        const linhaResumida = linhaRemovida.length > 60 ? 
                                              linhaRemovida.substring(0, 60) + '...' : 
                                              linhaRemovida;
                        return `${index + 1}. ${linhaResumida}`;
                    }
                }).join('\n');
                
                showErrorAlert(
                    `Múltiplas diferenças detectadas (${allDifferences.length} clientes)!\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `DIFERENÇAS ENCONTRADAS:\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `${listadiferencas}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `Isso indica que as tabelas não foram atualizadas\n` +
                    `corretamente ou que múltiplos clientes foram\n` +
                    `removidos simultaneamente.\n\n` +
                    `Por favor:\n\n` +
                    `1. Verifique se você atualizou a\n` +
                    `   "Tabela Depois" corretamente\n\n` +
                    `2. Certifique-se de que apenas UM cliente\n` +
                    `   foi removido por vez\n\n` +
                    `3. Faça uma nova comparação da Porta ${portaAtual}`
                );
                setMessage(`Erro na Porta ${portaAtual}: ${allDifferences.length} diferenças - Refaça a conferência`);
                setIsLoading(false);
                return;
            }
            
            // Processar a diferença única
            const diff = allDifferences[0];
            const numeroDaPorta = portaAtual;
            
            // Extrair posição e nome da linha que foi removida
            const linhaRemovida = diff.row1 && !diff.row2 ? diff.row1 : 
                                  !diff.row1 && diff.row2 ? diff.row2 : 
                                  diff.row1;
            
            const { posicao, nome, descricao } = extractPosicaoENome(linhaRemovida);
            
            // Formatar o texto para exibição: Posição    "Nome"    Descrição
            let displayText = '';
            if (posicao && nome) {
                // Formato: 1/1/1/1/2    "NILSON BARBOSA DE OLIVEIRA"    SNT-CON-NQ-SP32-SS6-P01
                displayText = `${posicao}    "${nome}"`;
                // Só adiciona descrição se existir, não for undefined e não estiver vazio
                if (descricao && descricao !== 'undefined' && typeof descricao === 'string' && descricao.trim() !== '') {
                    // Remover qualquer ocorrência de "undefined" da descrição
                    const descricaoLimpa = descricao.replace(/\bundefined\b/g, '').trim();
                    if (descricaoLimpa && descricaoLimpa.length > 0) {
                        displayText += `    ${descricaoLimpa}`;
                    }
                }
            } else {
                // Se não conseguiu extrair, usar a linha completa como fallback
                displayText = linhaRemovida;
            }
            
            const portaComDiferenca = {
                line: `Porta ${numeroDaPorta}`,
                row1: diff.row1,
                row2: diff.row2,
                displayText: displayText, // Texto formatado para exibição
                portaIndex: numeroDaPorta,
                isPortaLivre: false
            };
            differences.push(portaComDiferenca);
            novasPortasPendentes.push(numeroDaPorta);
            
            setMessage(`Porta ${numeroDaPorta}: Diferença detectada - Marque como conferida após análise`);
            
            // Verificar se há múltiplas diferenças (mais de uma)
            if (allDifferences.length > 1) {
                showErrorAlert(
                    `Foram detectadas ${allDifferences.length} diferenças na comparação!\n\n` +
                    `Isso indica que mais de um cliente foi removido/alterado, ou que as tabelas não foram atualizadas corretamente.\n\n` +
                    `Por favor:\n` +
                    `1. Verifique se você atualizou a "Tabela Depois" corretamente\n` +
                    `2. Certifique-se de que apenas UMA porta foi alterada\n` +
                    `3. Compare novamente a Porta ${portaAtual}`
                );
                setMessage(`Erro: ${allDifferences.length} diferenças detectadas - Verifique e compare novamente`);
                setIsLoading(false);
                return;
            }
            
            // Cada diferença é uma porta separada
            allDifferences.forEach((diff, index) => {
                const numeroDaPorta = portaAtual + index;
                
                // Extrair posição e nome da linha que foi removida
                const linhaRemovida = diff.row1 && !diff.row2 ? diff.row1 : 
                                      !diff.row1 && diff.row2 ? diff.row2 : 
                                      diff.row1;
                
                const { posicao, nome, descricao } = extractPosicaoENome(linhaRemovida);
                
                // Formatar o texto para exibição: Posição    "Nome"    Descrição
                let displayText = '';
                if (posicao && nome) {
                    // Formato: 1/1/1/1/2    "NILSON BARBOSA DE OLIVEIRA"    SNT-CON-NQ-SP32-SS6-P01
                    displayText = `${posicao}    "${nome}"`;
                    // Só adiciona descrição se existir, não for undefined e não estiver vazio
                    if (descricao && descricao !== 'undefined' && typeof descricao === 'string' && descricao.trim() !== '') {
                        // Remover qualquer ocorrência de "undefined" da descrição
                        const descricaoLimpa = descricao.replace(/\bundefined\b/g, '').trim();
                        if (descricaoLimpa && descricaoLimpa.length > 0) {
                            displayText += `    ${descricaoLimpa}`;
                        }
                    }
                } else {
                    // Se não conseguiu extrair, usar a linha completa como fallback
                    displayText = linhaRemovida;
                }
                
                const portaComDiferenca = {
                    line: `Porta ${numeroDaPorta}`,
                    row1: diff.row1,
                    row2: diff.row2,
                    displayText: displayText, // Texto formatado para exibição
                    portaIndex: numeroDaPorta,
                    isPortaLivre: false
                };
                differences.push(portaComDiferenca);
                novasPortasPendentes.push(numeroDaPorta);
            });
            
            // Atualizar a mensagem com a quantidade e portas afetadas
            const primeiraPorta = portaAtual;
            const ultimaPorta = portaAtual + allDifferences.length - 1;
            if (allDifferences.length === 1) {
                setMessage(`Porta ${primeiraPorta}: Diferença detectada - Marque como conferida após análise`);
            } else {
                setMessage(`Portas ${primeiraPorta} a ${ultimaPorta}: ${allDifferences.length} diferenças detectadas - Marque todas como conferidas`);
            }
        }

        storeDifferences(differences);
        setPortasPendentes(novasPortasPendentes);

        // Sempre bloquear após comparação até usuário marcar status
        setBloqueioAtivo(true);
    };

    const iniciarNovaConferencia = () => {
        // Limpar todos os dados
        setTable1('');
        setTable2('');
        setStoredDifferences([]);
        setPortasConferidas(new Set());
        setPortasVagas(new Set());
        setHistoricoPortas([]);
        setPortasPendentes([]);
        setResultData([]);
        setDownData([]);
        setClientesDownMostrados(new Set()); // Limpar o Set de clientes down já mostrados
        setPortaAtual(1);
        setBloqueioAtivo(false);
        setMessage('Nova conferência iniciada! Pronto para Porta 1.');
    };

    const storeDifferences = (differences) => {
        setStoredDifferences(prev => {
            // Criar uma nova lista sem as portas que vão ser adicionadas novamente
            const newDifferences = [...prev];

            differences.forEach(newDiff => {
                // Remover entrada existente da mesma porta se houver
                const existingIndex = newDifferences.findIndex(
                    diff => diff.portaIndex === newDiff.portaIndex
                );
                if (existingIndex !== -1) {
                    newDifferences.splice(existingIndex, 1);
                }
                // Adicionar a nova entrada
                newDifferences.push(newDiff);
            });

            return newDifferences;
        });
    };

    const toggleDownTable = () => {
        // Se está mostrando, apenas oculta
        if (downTableVisible) {
            setDownTableVisible(false);
            return;
        }

        // Se está oculta, analisa a primeira tabela e mostra
        analisarClientesDown();
        setDownTableVisible(true);
    };

    const analisarClientesDown = () => {
        if (!table1.trim()) {
            showErrorAlert('Por favor, insira dados na primeira tabela antes de analisar clientes down.');
            return;
        }

        const table1Data = table1.split('\n');
        const newDownData = [];

        for (let i = 0; i < table1Data.length; i++) {
            const row1 = (table1Data[i] || '').trim();
            
            if (row1.toLowerCase().includes("down")) {
                // Extrair identificador único do cliente (posição ou nome)
                const { posicao, nome } = extractPosicaoENome(row1);
                const clienteId = posicao || nome || row1;
                
                // Só adiciona se ainda não foi mostrado
                if (!clientesDownMostrados.has(clienteId)) {
                    newDownData.push({
                        line: i + 1,
                        content: row1
                    });
                }
            }
        }

        setDownData(newDownData);
        
        // Adicionar os clientes down ao Set de já mostrados
        const novosClientesDown = new Set(clientesDownMostrados);
        newDownData.forEach(item => {
            const { posicao, nome } = extractPosicaoENome(item.content);
            const clienteId = posicao || nome || item.content;
            novosClientesDown.add(clienteId);
        });
        setClientesDownMostrados(novosClientesDown);

        if (newDownData.length === 0) {
            setMessage('Nenhum cliente down encontrado na primeira tabela.');
        } else {
            setMessage(`${newDownData.length} cliente(s) down encontrado(s) na primeira tabela.`);
        }
    };

    const toggleLock = () => {
        setIsLocked(prev => !prev);
    };

    const togglePortaConferida = (portaIndex) => {
        setPortasConferidas(prev => {
            const newSet = new Set(prev);
            // Só permite marcar se não estiver já marcada e estiver nas portas pendentes
            if (!newSet.has(portaIndex) && portasPendentes.includes(portaIndex)) {
                newSet.add(portaIndex);
                // Remover das vagas se estava marcada
                setPortasVagas(prev => {
                    const newVagas = new Set(prev);
                    newVagas.delete(portaIndex);
                    return newVagas;
                });
                
                // Adicionar ao histórico
                setHistoricoPortas(prev => [...prev, {
                    porta: portaIndex,
                    tipo: 'conferida',
                    timestamp: Date.now()
                }]);

                // Remover da lista de pendentes
                setPortasPendentes(prev => {
                    const novasPendentes = prev.filter(p => p !== portaIndex);
                    
                    // Se não há mais portas pendentes, liberar bloqueio e avançar
                    if (novasPendentes.length === 0) {
                        setBloqueioAtivo(false);
                        // Usar o maior número de porta das que estavam pendentes
                        const maiorPortaPendente = prev.length > 0 ? Math.max(...prev) : portaIndex;
                        const proximaPorta = maiorPortaPendente + 1;
                        
                        // Verificar se chegou ao limite de 16 portas
                        if (proximaPorta > 16) {
                            setPortaAtual(proximaPorta);
                            setMessage(`Porta ${portaIndex} conferida! Conferência da caixa concluída (16 portas). Use 'Comparar Tabelas' para iniciar nova conferência.`);
                        } else {
                            setPortaAtual(proximaPorta);
                            setMessage(`Porta ${portaIndex} conferida! Pronto para Porta ${proximaPorta}`);
                        }
                    } else {
                        // Ainda há portas pendentes
                        setMessage(`Porta ${portaIndex} conferida! Ainda faltam ${novasPendentes.length} porta(s) pendente(s)`);
                    }
                    
                    return novasPendentes;
                });
            }
            return newSet;
        });
    };

    const marcarComoVaga = (portaIndex) => {
        setPortasVagas(prev => {
            const newSet = new Set(prev);
            // Só permite marcar se não estiver já marcada e estiver nas portas pendentes
            if (!newSet.has(portaIndex) && portasPendentes.includes(portaIndex)) {
                newSet.add(portaIndex);
                // Remover das conferidas se estava marcada
                setPortasConferidas(prev => {
                    const newConferidas = new Set(prev);
                    newConferidas.delete(portaIndex);
                    return newConferidas;
                });
                
                // Adicionar ao histórico
                setHistoricoPortas(prev => [...prev, {
                    porta: portaIndex,
                    tipo: 'vaga',
                    timestamp: Date.now()
                }]);

                // Remover da lista de pendentes
                setPortasPendentes(prev => {
                    const novasPendentes = prev.filter(p => p !== portaIndex);
                    
                    // Se não há mais portas pendentes, liberar bloqueio e avançar
                    if (novasPendentes.length === 0) {
                        setBloqueioAtivo(false);
                        // Usar o maior número de porta das que estavam pendentes
                        const maiorPortaPendente = prev.length > 0 ? Math.max(...prev) : portaIndex;
                        const proximaPorta = maiorPortaPendente + 1;
                        
                        // Verificar se chegou ao limite de 16 portas
                        if (proximaPorta > 16) {
                            setPortaAtual(proximaPorta);
                            setMessage(`Porta ${portaIndex} marcada como vaga! Conferência da caixa concluída (16 portas). Use 'Comparar Tabelas' para iniciar nova conferência.`);
                        } else {
                            setPortaAtual(proximaPorta);
                            setMessage(`Porta ${portaIndex} marcada como vaga! Pronto para Porta ${proximaPorta}`);
                        }
                    } else {
                        // Ainda há portas pendentes
                        setMessage(`Porta ${portaIndex} marcada como vaga! Ainda faltam ${novasPendentes.length} porta(s) pendente(s)`);
                    }
                    
                    return novasPendentes;
                });
            }
            return newSet;
        });
    };

    const getPortaStatus = (portaIndex) => {
        if (portasVagas.has(portaIndex)) return 'vaga';
        if (portasConferidas.has(portaIndex)) return 'conferida';
        return 'pendente';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'vaga': return '';
            case 'conferida': return '';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'vaga': return 'Porta Vaga';
            case 'conferida': return 'Conferida';
            default: return 'Pendente';
        }
    };

    const removerPorta = (portaIndex) => {
        // Reorganizar todas as portas após a remoção
        setStoredDifferences(prev => {
            // Remover a porta especificada
            const semPortaRemovida = prev.filter(diff => diff.portaIndex !== portaIndex);
            
            // Renumerar todas as portas que estão após a porta removida
            const renumeradas = semPortaRemovida.map(diff => {
                if (diff.portaIndex > portaIndex) {
                    return {
                        ...diff,
                        portaIndex: diff.portaIndex - 1,
                        line: `Porta ${diff.portaIndex - 1}`
                    };
                }
                return diff;
            });
            
            // Ajustar portaAtual
            if (renumeradas.length === 0) {
                setPortaAtual(1);
            } else {
                const maiorPorta = Math.max(...renumeradas.map(d => d.portaIndex));
                setPortaAtual(maiorPorta);
            }
            
            return renumeradas;
        });

        // Atualizar histórico - renumerar portas após a removida
        setHistoricoPortas(prev => {
            // Remover a porta do histórico
            const semPortaRemovida = prev.filter(p => p.porta !== portaIndex);
            
            // Renumerar portas no histórico que estão após a removida
            const renumeradas = semPortaRemovida.map(p => {
                if (p.porta > portaIndex) {
                    return {
                        ...p,
                        porta: p.porta - 1
                    };
                }
                return p;
            });
            
            return renumeradas;
        });

        // Atualizar status de conferidas - renumerar
        setPortasConferidas(prev => {
            const newSet = new Set();
            prev.forEach(porta => {
                if (porta !== portaIndex) {
                    newSet.add(porta > portaIndex ? porta - 1 : porta);
                }
            });
            return newSet;
        });
        
        // Atualizar status de vagas - renumerar
        setPortasVagas(prev => {
            const newSet = new Set();
            prev.forEach(porta => {
                if (porta !== portaIndex) {
                    newSet.add(porta > portaIndex ? porta - 1 : porta);
                }
            });
            return newSet;
        });

        // Atualizar portas pendentes - renumerar
        setPortasPendentes(prev => {
            const semPortaRemovida = prev.filter(p => p !== portaIndex);
            const renumeradas = semPortaRemovida.map(p => p > portaIndex ? p - 1 : p);
            
            // Se não há mais portas pendentes, liberar bloqueio
            if (renumeradas.length === 0 && bloqueioAtivo) {
                setBloqueioAtivo(false);
                setMessage(`Porta ${portaIndex} removida! Portas renumeradas. Pronto para nova comparação`);
            } else if (renumeradas.length > 0) {
                setMessage(`Porta ${portaIndex} removida! Portas renumeradas. Ainda faltam ${renumeradas.length} porta(s) pendente(s)`);
            } else {
                setMessage(`Porta ${portaIndex} removida! Todas as portas foram renumeradas`);
            }
            
            return renumeradas;
        });
    };

    const voltarUmaPorta = () => {
        if (historicoPortas.length === 0) {
            showErrorAlert('Não há portas para voltar!');
            return;
        }

        const ultimaPorta = historicoPortas[historicoPortas.length - 1];
        const portaAtualAnterior = portaAtual;

        // Remover a última porta do histórico
        setHistoricoPortas(prev => prev.slice(0, -1));

        // Voltar para a porta anterior
        setPortaAtual(ultimaPorta.porta);

        // Remover do status correspondente
        if (ultimaPorta.tipo === 'conferida') {
            setPortasConferidas(prev => {
                const newSet = new Set(prev);
                newSet.delete(ultimaPorta.porta);
                return newSet;
            });
        } else if (ultimaPorta.tipo === 'vaga') {
            setPortasVagas(prev => {
                const newSet = new Set(prev);
                newSet.delete(ultimaPorta.porta);
                return newSet;
            });
        }

        // Remover da lista de diferenças armazenadas:
        // 1. A porta do histórico (que foi marcada)
        // 2. A porta atual (que pode ter sido comparada mas não marcada)
        setStoredDifferences(prev =>
            prev.filter(diff =>
                diff.portaIndex !== ultimaPorta.porta &&
                diff.portaIndex !== portaAtualAnterior
            )
        );

        // Limpar dados das tabelas de resultado para evitar confusão
        setResultData([]);
        setDownData([]);

        // Desbloquear para permitir nova comparação
        setBloqueioAtivo(false);

        setMessage(`Voltou para Porta ${ultimaPorta.porta}. Status removido, porta pronta para nova análise.`);
    };

    return (
        <div className="conferencia-caixa">
            <header>
                <h1>Conferência de Caixa</h1>
                <p>Utilize a ferramenta para comparar tabelas e visualizar resultados.</p>
            </header>

            {isLoading && (
                <div className="progress-container">
                    <div className="progress-bar"></div>
                </div>
            )}

            <div className="container" id="tabelas">
                <div className="textarea-container">
                    <div className="textarea-title-container">
                        <div className="textarea-title">Tabela Antes</div>
                        <button className="lock-btn" onClick={toggleLock}>
                            {isLocked ? 'Destravar tabela' : 'Travar tabela'}
                        </button>
                    </div>
                    <textarea
                        value={table1}
                        onChange={(e) => setTable1(e.target.value)}
                        disabled={isLocked}
                        placeholder="Insira a tabela antes de retirar qualquer porta da caixa"
                    />
                </div>

                <div className="textarea-container">
                    <div className="textarea-title-container">
                        <div className="textarea-title">Tabela Depois</div>
                    </div>
                    <textarea
                        value={table2}
                        onChange={(e) => setTable2(e.target.value)}
                        placeholder="Insira a tabela após o técnico retirar alguma porta"
                    />
                </div>
            </div>

            <div className="button-container">
                <button
                    className="compare-btn"
                    onClick={() => handleButtonClick(compareTables)}
                    disabled={bloqueioAtivo && portaAtual <= 16}
                >
                    {portaAtual > 16 ? 'Começar Nova Conferência' : `Comparar Porta`}
                    {bloqueioAtivo && portaAtual <= 16 && ' (Bloqueado)'}
                </button>
                <button
                    className="toggle-down-btn"
                    onClick={() => handleButtonClick(toggleDownTable)}
                >
                    {downTableVisible ? 'Ocultar' : 'Analisar'} Clientes Down (Tabela 1)
                </button>
            </div>

            {downTableVisible && (
                <table className="down-table">
                    <thead>
                        <tr>
                            <th>Clientes Down</th>
                        </tr>
                    </thead>
                    <tbody>
                        {downData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h2>Conferência Armazenada</h2>
            <div className="status-atual">
                <h3>Porta Atual: {portaAtual} {historicoPortas.length > 0 && `(${historicoPortas.length}/16)`}</h3>
                {message && <div className="message">{message}</div>}
            </div>

            {storedDifferences.length === 0 ? (
                <div className="empty-state">
                    <h3>Nenhuma diferença encontrada</h3>
                    <p>Compare as tabelas para ver os resultados aqui.</p>
                </div>
            ) : (
                <table className="conferencia-table">
                    <thead>
                        <tr>
                            <th>Porta</th>
                            <th>Cliente Removido / Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storedDifferences
                            .sort((a, b) => (a.portaIndex || 1) - (b.portaIndex || 1))
                            .map((diff, index) => {
                                const portaIndex = diff.portaIndex || index + 1;
                                const status = getPortaStatus(portaIndex);
                                const isPortaPendente = portasPendentes.includes(portaIndex);
                                const isPortaLivre = diff.isPortaLivre;
                                const isPortaVaga = diff.isPortaVaga;

                                return (
                                    <tr 
                                        key={`porta-${portaIndex}`}
                                        className={`status-${status}`}
                                        data-status={status}
                                    >
                                        <td className="porta-numero">Porta {portaIndex}</td>
                                        <td className="cliente-info">
                                            {isPortaLivre ? (
                                                <span className="badge-livre">PORTA VAGA</span>
                                            ) : isPortaVaga ? (
                                                <span className="badge-vaga">PORTA VAGA</span>
                                            ) : (
                                                <span>
                                                    {diff.displayText ? diff.displayText : 
                                                     (() => {
                                                         // Se não tem displayText, extrair da linha original
                                                         const linha = diff.row1 || diff.row2 || '';
                                                         const { posicao, nome, descricao } = extractPosicaoENome(linha);
                                                         if (posicao && nome) {
                                                             let texto = `${posicao}    "${nome}"`;
                                                             if (descricao && descricao !== 'undefined' && descricao.trim() !== '') {
                                                                 const descricaoLimpa = descricao.replace(/\bundefined\b/g, '').trim();
                                                                 if (descricaoLimpa) {
                                                                     texto += `    ${descricaoLimpa}`;
                                                                 }
                                                             }
                                                             return texto;
                                                         }
                                                         return linha;
                                                     })()
                                                    }
                                                </span>
                                            )}
                                        </td>
                                        <td className="acoes-cell">
                                            {status === 'pendente' ? (
                                                <>
                                                    {!isPortaLivre && !isPortaVaga ? (
                                                        <button
                                                            className="toggle-btn"
                                                            onClick={() => togglePortaConferida(portaIndex)}
                                                            disabled={!isPortaPendente}
                                                        >
                                                            Conferida
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="vaga-btn"
                                                            onClick={() => marcarComoVaga(portaIndex)}
                                                            disabled={!isPortaPendente}
                                                        >
                                                            Vaga
                                                        </button>
                                                    )}
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => removerPorta(portaIndex)}
                                                    >
                                                        Remover
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className={`status-badge status-${status}`}>
                                                        {getStatusIcon(status)} {status === 'conferida' ? 'Conferida' : 'Vaga'}
                                                    </span>
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => removerPorta(portaIndex)}
                                                    >
                                                        Remover
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            )}

            <footer className="conferencia-footer">

            </footer>
        </div>
    );
};

export default ConferenciaCaixa;