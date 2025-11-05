import { useEffect } from 'react';
import './HelpModal.css';

/**
 * Componente de modal para exibir ajuda sobre comandos
 */
function HelpModal({ isOpen, onClose, commands }) {
    // Fechar modal ao pressionar ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevenir scroll do body quando modal está aberto
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="help-modal-header">
                    <h2><span className="icon">◉</span> Guia de Comandos</h2>
                    <button className="help-modal-close" onClick={onClose} aria-label="Fechar">
                        ×
                    </button>
                </div>
                
                <div className="help-modal-body">
                    {commands.map((section, idx) => (
                        <div key={idx} className="help-section">
                            <h3 className="help-section-title">{section.title}</h3>
                            
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="help-item">
                                    <div className="help-item-header">
                                        <span className="help-item-name">{item.name}</span>
                                        {item.description && (
                                            <span className="help-item-description">{item.description}</span>
                                        )}
                                    </div>
                                    
                                    {item.command && (
                                        <div className="help-item-command">
                                            <code>{item.command}</code>
                                        </div>
                                    )}
                                    
                                    {item.explanation && (
                                        <div className="help-item-explanation">
                                            {item.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                
                <div className="help-modal-footer">
                    <button className="help-modal-button" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HelpModal;
