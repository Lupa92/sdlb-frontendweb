import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import style from "../styles/NewsCard.module.css";

export default function NewsCard({ news, onDelete }) {
    // Tronquer la description à 30 caractères
    const shortDescription =
        news.description.length > 30
            ? news.description.slice(0, 30) + "..."
            : news.description;

    // Format de date
    const date = new Date(news.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <div className={style.card}>
            <div className={style.content}>
                <div className={style.title}>{news.title}</div>
                <div className={style.description}>{news.title}</div>
                <div className={style.description}>{shortDescription}</div>
                <div className={style.date}>{date}</div>
            </div>
            <button
                className={style.deleteButton}
                onClick={() => onDelete(news._id)}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}
