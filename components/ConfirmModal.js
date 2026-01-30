import React from "react";
import style from "../styles/ConfirmModal.module.css";

export default function ConfirmModal({
    isOpen,
    title = "Confirmation",
    message,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3>{title}</h3>
                <p>{message}</p>

                <div className={style.actions}>
                    <button className={style.cancel} onClick={onCancel}>
                        Annuler
                    </button>
                    <button className={style.confirm} onClick={onConfirm}>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

