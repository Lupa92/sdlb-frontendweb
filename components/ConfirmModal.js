import React from "react";
import style from "../styles/ConfirmModal.module.css";

export default function ConfirmModal({
    isOpen,
    title = "Confirmation",
    message = "Êtes-vous sûr ?",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    onConfirm,
    onCancel,
    danger = false,
}) {
    if (!isOpen) return null;

    return (
        <div className={style.overlay} onClick={(e) => e.stopPropagation()}>
            <div className={style.modal}>
                <h3 className={style.title}>{title}</h3>
                <p className={style.message}>{message}</p>

                <div className={style.actions}>
                    <button
                        className={`${style.button} ${style.cancel}`}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className={`${style.button} ${danger ? style.danger : style.primary
                            }`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
