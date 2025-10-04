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

    const portaCounterRef = useRef(1);

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
        let firstDifferenceFound = false;
        let firstDifferentRow1 = '';
        let firstDifferentRow2 = '';

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
                    hasDifferences = true;
                    isDifferent = true;
                    // Capturar apenas a primeira diferença encontrada
                    if (!firstDifferenceFound) {
                        firstDifferenceFound = true;
                        firstDifferentRow1 = row1;
                        firstDifferentRow2 = row2;
                    }
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
                newDownData.push({
                    line: i + 1,
                    content: row1
                });
            }
        }

        setResultData(newResultData);
        
        // Só atualiza downData se não foram analisados independentemente
        if (!downTableVisible) {
            setDownData(newDownData);
        }

        // Criar apenas UMA entrada para esta porta
        let differences = [];
        if (!hasDifferences) {
            // Adicionar entrada "Porta Vaga" quando não há diferenças
            const portaVagaEntry = {
                line: `Porta ${portaAtual}`,
                row1: "Porta Vaga",
                row2: "Porta Vaga",
                portaIndex: portaAtual,
                isPortaLivre: true
            };
            differences.push(portaVagaEntry);
            setMessage(`Porta ${portaAtual}: Porta Vaga - Marque como vaga para continuar`);
        } else {
            // Adicionar entrada com a primeira diferença encontrada
            const portaComDiferenca = {
                line: `Porta ${portaAtual}`,
                row1: firstDifferentRow1,
                row2: firstDifferentRow2,
                portaIndex: portaAtual,
                isPortaLivre: false
            };
            differences.push(portaComDiferenca);
            setMessage(`Porta ${portaAtual}: Diferenças detectadas - Marque como conferida após análise`);
        }

        storeDifferences(differences);

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
        setResultData([]);
        setDownData([]);
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
                newDownData.push({
                    line: i + 1,
                    content: row1
                });
            }
        }

        setDownData(newDownData);

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
            // Só permite marcar se não estiver já marcada
            if (!newSet.has(portaIndex)) {
                newSet.add(portaIndex);
                // Remover das vagas se estava marcada
                setPortasVagas(prev => {
                    const newVagas = new Set(prev);
                    newVagas.delete(portaIndex);
                    return newVagas;
                });
                // Se marcou a porta atual, avançar
                if (portaIndex === portaAtual) {
                    const proximaPorta = portaAtual + 1;
                    setBloqueioAtivo(false);

                    // Adicionar ao histórico
                    setHistoricoPortas(prev => [...prev, {
                        porta: portaIndex,
                        tipo: 'conferida',
                        timestamp: Date.now()
                    }]);

                    // Verificar se chegou ao limite de 16 portas
                    if (proximaPorta > 16) {
                        setPortaAtual(proximaPorta); // Setar para 17 para ativar botão de nova conferência
                        setMessage(`Porta ${portaIndex} conferida! Conferência da caixa concluída (16 portas). Use 'Comparar Tabelas' para iniciar nova conferência.`);
                    } else {
                        setPortaAtual(proximaPorta);
                        setMessage(`Porta ${portaIndex} conferida! Pronto para Porta ${proximaPorta}`);
                    }
                }
            }
            return newSet;
        });
    };

    const marcarComoVaga = (portaIndex) => {
        setPortasVagas(prev => {
            const newSet = new Set(prev);
            // Só permite marcar se não estiver já marcada
            if (!newSet.has(portaIndex)) {
                newSet.add(portaIndex);
                // Remover das conferidas se estava marcada
                setPortasConferidas(prev => {
                    const newConferidas = new Set(prev);
                    newConferidas.delete(portaIndex);
                    return newConferidas;
                });
                // Se marcou a porta atual, avançar
                if (portaIndex === portaAtual) {
                    const proximaPorta = portaAtual + 1;
                    setBloqueioAtivo(false);

                    // Adicionar ao histórico
                    setHistoricoPortas(prev => [...prev, {
                        porta: portaIndex,
                        tipo: 'vaga',
                        timestamp: Date.now()
                    }]);

                    // Verificar se chegou ao limite de 16 portas
                    if (proximaPorta > 16) {
                        setPortaAtual(proximaPorta); // Setar para 17 para ativar botão de nova conferência
                        setMessage(`Porta ${portaIndex} marcada como vaga! Conferência da caixa concluída (16 portas). Use 'Comparar Tabelas' para iniciar nova conferência.`);
                    } else {
                        setPortaAtual(proximaPorta);
                        setMessage(`Porta ${portaIndex} marcada como vaga! Pronto para Porta ${proximaPorta}`);
                    }
                }
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
                    {portaAtual > 16 ? 'Começar Nova Conferência' : `Comparar Porta ${portaAtual}`}
                    {bloqueioAtivo && portaAtual <= 16 && ' (Bloqueado)'}
                </button>
                <button
                    className="voltar-porta-btn"
                    onClick={voltarUmaPorta}
                    disabled={historicoPortas.length === 0}
                >
                    Voltar Uma Porta
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

            <table className="stored-differences-table">
                <thead>
                    <tr>
                        <th>Porta</th>
                        <th>Primeira Tabela</th>
                        <th>Segunda Tabela</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {storedDifferences
                        .sort((a, b) => (a.portaIndex || 1) - (b.portaIndex || 1))
                        .map((diff, index) => {
                            const portaIndex = diff.portaIndex || index + 1;
                            const status = getPortaStatus(portaIndex);
                            const isPortaAtual = portaIndex === portaAtual;
                            const isPortaLivre = diff.isPortaLivre;
                            const isPortaVaga = diff.isPortaVaga;
                            return (
                                <tr key={`porta-${portaIndex}`} className={`status-${status} ${isPortaAtual ? 'porta-atual' : ''} ${isPortaLivre ? 'porta-livre' : ''} ${isPortaVaga ? 'porta-vaga' : ''}`}>
                                    <td>
                                        Porta {portaIndex}
                                    </td>
                                    <td className={isPortaLivre ? 'porta-livre-text' : (isPortaVaga ? 'porta-vaga-text' : '')}>
                                        {isPortaLivre ? 'PORTA VAGA' : (isPortaVaga ? 'PORTA VAGA' : diff.row1)}
                                    </td>
                                    <td className={isPortaLivre ? 'porta-livre-text' : (isPortaVaga ? 'porta-vaga-text' : '')}>
                                        {isPortaLivre ? 'PORTA VAGA' : (isPortaVaga ? 'PORTA VAGA' : diff.row2)}
                                    </td>
                                    <td>
                                        {/* Lógica unificada para todas as portas */}
                                        {status === 'pendente' ? (
                                            <>
                                                {/* Para portas com diferenças normais, mostrar apenas botão conferida */}
                                                {!isPortaLivre && !isPortaVaga ? (
                                                    <button
                                                        className="toggle-btn"
                                                        onClick={() => togglePortaConferida(portaIndex)}
                                                        disabled={portaIndex !== portaAtual}
                                                    >
                                                        Marcar como Conferida
                                                    </button>
                                                ) : (
                                                    /* Para portas vagas ou vagas, só botão de confirmar como vaga */
                                                    <button
                                                        className="vaga-btn"
                                                        onClick={() => marcarComoVaga(portaIndex)}
                                                        disabled={portaIndex !== portaAtual}
                                                    >
                                                        {isPortaVaga ? 'Confirmar Porta Vaga' : 'Confirmar Porta Vaga'}
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            /* Quando já marcada, sempre mostrar apenas o status */
                                            <span className={`status-badge status-${status}`}>
                                                {getStatusIcon(status)} {status === 'conferida' ? 'Conferida' : 'Vaga'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    {/* Mostrar portas vagas mesmo sem diferenças */}
                    {Array.from(portasVagas)
                        .sort((a, b) => a - b)
                        .map(portaIndex => {
                            if (!storedDifferences.some(diff => diff.portaIndex === portaIndex)) {
                                return (
                                    <tr key={`vaga-${portaIndex}`} className="status-vaga">
                                        <td>Porta {portaIndex}</td>
                                        <td>
                                            <span className="status-badge status-vaga">
                                                Porta Vaga
                                            </span>
                                        </td>
                                        <td colSpan="2">Sem diferenças detectadas</td>
                                        <td>
                                            {/* Sem botões para portas vagas automáticas */}
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                </tbody>
            </table>

            <footer className="conferencia-footer">

            </footer>
        </div>
    );
};

export default ConferenciaCaixa;