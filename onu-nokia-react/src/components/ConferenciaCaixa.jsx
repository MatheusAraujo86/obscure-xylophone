import React, { useState, useRef } from 'react';
import './ConferenciaCaixa.css';

const ConferenciaCaixa = () => {
    const [table1, setTable1] = useState('');
    const [table2, setTable2] = useState('');
    const [storedDifferences, setStoredDifferences] = useState([]);
    const [downTableVisible, setDownTableVisible] = useState(false);
    const [resultTableVisible, setResultTableVisible] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [message, setMessage] = useState('');
    const [resultData, setResultData] = useState([]);
    const [downData, setDownData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
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
        const table1Data = table1.split('\n');
        const table2Data = table2.split('\n');
        
        const maxLength = Math.max(table1Data.length, table2Data.length);
        const newResultData = [];
        const newDownData = [];
        
        let differences = [];
        let hasDifferences = false;

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
                    differences.push({ 
                        line: `Porta ${portaCounterRef.current++}`, 
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

            if (row1.toLowerCase().includes("down")) {
                newDownData.push({
                    line: i + 1,
                    content: row1
                });
            }
        }

        setResultData(newResultData);
        setDownData(newDownData);
        storeDifferences(differences);
        
        if (!hasDifferences) {
            setMessage("Nenhuma diferença entre as tabelas.");
        } else {
            setMessage("");
        }
    };

    const storeDifferences = (differences) => {
        setStoredDifferences(prev => [...prev, ...differences]);
    };

    const removeDifference = (index) => {
        setStoredDifferences(prev => prev.filter((_, i) => i !== index));
    };

    const toggleResultTable = () => {
        setResultTableVisible(prev => !prev);
    };

    const toggleDownTable = () => {
        setDownTableVisible(prev => !prev);
    };

    const toggleLock = () => {
        setIsLocked(prev => !prev);
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
                            {isLocked ? 'Destravar tabela 🔒' : 'Travar tabela 🔒'}
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
                >
                    Comparar Tabelas
                </button>
                <button 
                    className="toggle-down-btn" 
                    onClick={() => handleButtonClick(toggleDownTable)}
                >
                    Mostrar/Ocultar Tabela Clientes Down
                </button>
                <button 
                    className="toggle-result-btn" 
                    onClick={() => handleButtonClick(toggleResultTable)}
                >
                    Mostrar/Ocultar Tabela de Resultados
                </button>
            </div>

            {downTableVisible && (
                <table className="down-table">
                    <thead>
                        <tr>
                            <th>Linha</th>
                            <th>Clientes Down</th>
                        </tr>
                    </thead>
                    <tbody>
                        {downData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.line}</td>
                                <td>{item.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {resultTableVisible && (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Linha</th>
                            <th>Primeira Tabela</th>
                            <th>Segunda Tabela</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultData.map((item, index) => (
                            <tr key={index} className={item.isDifferent ? 'difference' : ''}>
                                <td>{item.line}</td>
                                <td className={item.isDifferent ? 'difference' : ''}>{item.row1}</td>
                                <td className={item.isDifferent ? 'difference' : ''}>{item.row2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h2>Conferência Armazenada</h2>
            {message && <div className="message">{message}</div>}

            <table className="stored-differences-table">
                <thead>
                    <tr>
                        <th>Porta</th>
                        <th>Primeira Tabela</th>
                        <th>Segunda Tabela</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {storedDifferences.map((diff, index) => (
                        <tr key={index}>
                            <td>Porta {index + 1}</td>
                            <td>{diff.row1}</td>
                            <td>{diff.row2}</td>
                            <td>
                                <button 
                                    className="remove-btn" 
                                    onClick={() => removeDifference(index)}
                                >
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="conferencia-footer">
                
            </footer>
        </div>
    );
};

export default ConferenciaCaixa;