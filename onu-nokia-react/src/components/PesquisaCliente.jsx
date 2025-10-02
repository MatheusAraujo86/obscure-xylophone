import { useState } from 'react';
import { pesquisarPorNome, pesquisarPorAlcl } from '../services/onuService';
import { validateAlcl, copyToClipboard } from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente para pesquisar clientes por nome ou ALCL
 */
function PesquisaCliente() {
    const [searchData, setSearchData] = useState({
        pesquisarAlcl: '',
        pesquisarNome: ''
    });
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    const handleInputChange = (field, value) => {
        let processedValue = value;

        // Aplicar transformações específicas por campo
        switch (field) {
            case 'pesquisarAlcl': // ALCL - mesmo comportamento do SERNUM
                processedValue = value.toUpperCase();
                break;
        }

        setSearchData({ ...searchData, [field]: processedValue });
    };

    const handlePesquisar = async () => {
        const { pesquisarNome, pesquisarAlcl } = searchData;
        
        try {
            let comando = '';
            
            if (pesquisarNome.trim() !== '') {
                comando = pesquisarPorNome(pesquisarNome);
            } else if (pesquisarAlcl.trim() !== '') {
                if (!validateAlcl(pesquisarAlcl)) {
                    showErrorAlert("Por favor, insira um código ALCL válido com 12 caracteres.");
                    return;
                }
                comando = pesquisarPorAlcl(pesquisarAlcl);
            } else {
                showErrorAlert("Por favor, preencha o nome ou ALCL para pesquisar.");
                return;
            }

            const result = await copyToClipboard(comando);
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            showErrorAlert("Erro ao realizar pesquisa.");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">◯</span>
                <h3>PESQUISAR CLIENTE</h3>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="pesquisarAlcl">ALCL</label>
                    <input
                        id="pesquisarAlcl" 
                        type="text"
                        className="form-input"
                        value={searchData.pesquisarAlcl}
                        onChange={(e) => handleInputChange('pesquisarAlcl', e.target.value)}
                        placeholder="Inserir ALCL"
                        maxLength="12"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pesquisarNome">Nome do Cliente</label>
                    <input
                        id="pesquisarNome"
                        type="text"
                        className="form-input"
                        value={searchData.pesquisarNome}
                        onChange={(e) => handleInputChange('pesquisarNome', e.target.value)}
                        placeholder="Inserir nome"
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handlePesquisar}
                >
                    ◈ Pesquisar cliente
                </button>
            </form>
        </div>
    );
}

export default PesquisaCliente;