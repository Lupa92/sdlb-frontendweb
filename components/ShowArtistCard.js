import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCrown } from "@fortawesome/free-solid-svg-icons";
import style from "../styles/ShowArtistCard.module.css";

export default function ShowArtistCard({ showArtist, onAskDelete }) {
    const { artist, title, duration, order } = showArtist;


    function handleDelete(e) {
        e.stopPropagation(); // évite les clics parasites
        if (onDelete) {
            onDelete(showArtist._id);
        }
    }

    return (
        <div className={style.card}>
            <div className={style.order}>{order}</div>

            <div className={style.name}>
                {artist.name} {artist.lastName}
                {artist.role === "MASTER" && (
                    <FontAwesomeIcon icon={faCrown} className={style.masterIcon} color="#c13c8e" />
                )}
            </div>

            {title && <div className={style.title}>Titre : {title}</div>}
            {duration && (
                <div className={style.duration}>Durée : {duration} min</div>
            )}
            <button
                className={style.deleteButton}
                onClick={(e) => {
                    e.stopPropagation(); // empêche la navigation
                    onAskDelete();
                }}
                aria-label="Supprimer le créneau artiste"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}
