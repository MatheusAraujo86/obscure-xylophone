import Swal from "sweetalert2";

/**
 * Hook customizado para usar SweetAlert2
 */
export function useSweetAlert() {
  /**
   * Mostra alerta de sucesso quando comando é copiado
   */
  const showSuccessAlert = () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Salvo na área de transferência",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  /**
   * Mostra alerta de erro
   * @param {string} message - Mensagem de erro
   */
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: message,
    });
  };

  /**
   * Mostra alerta de aviso
   * @param {string} message - Mensagem de aviso
   */
  const showWarningAlert = (message) => {
    Swal.fire({
      icon: "warning",
      title: "Atenção",
      text: message,
    });
  };

  /**
   * Mostra alerta de informação
   * @param {string} message - Mensagem de informação
   */
  const showInfoAlert = (message) => {
    Swal.fire({
      icon: "info",
      title: "Informação",
      text: message,
    });
  };

  /**
   * Mostra alerta de confirmação
   * @param {string} message - Mensagem de confirmação
   * @param {Function} onConfirm - Função a ser executada na confirmação
   */
  const showConfirmAlert = (message, onConfirm) => {
    Swal.fire({
      title: "Confirmar ação",
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, confirmar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  };

  return {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    showConfirmAlert,
  };
}
