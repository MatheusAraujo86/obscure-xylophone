// Exemplo de uso do sistema de Toast em seus componentes
// Adicione este import em qualquer componente onde quiser usar notificações

import { useToast } from '../hooks/useToast';

// No componente:
function ExemploComponente() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success('Operação realizada com sucesso!');
  };

  const handleError = () => {
    error('Ocorreu um erro ao processar a solicitação.');
  };

  const handleWarning = () => {
    warning('Atenção: Verifique os dados antes de continuar.');
  };

  const handleInfo = () => {
    info('Esta é uma mensagem informativa.');
  };

  // Exemplo em uma função async
  const handleSubmit = async () => {
    try {
      // Sua lógica aqui
      const response = await fetch('/api/endpoint');
      if (response.ok) {
        success('Dados salvos com sucesso!');
      } else {
        error('Falha ao salvar dados.');
      }
    } catch (err) {
      error('Erro de conexão: ' + err.message);
    }
  };

  return (
    <div>
      <button onClick={handleSuccess}>Sucesso</button>
      <button onClick={handleError}>Erro</button>
      <button onClick={handleWarning}>Aviso</button>
      <button onClick={handleInfo}>Info</button>
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}

export default ExemploComponente;
