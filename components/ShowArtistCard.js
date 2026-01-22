import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import style from "../styles/ShowArtistCard.module.css";

export default function ShowArtistCard({ showArtist, refreshShow, token }) {
    const { artist, title, duration, order } = showArtist;

    async function onDelete(showArtistId) {
        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/showsArtists/delete/${showArtistId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token }),
            })
            const data = await response.json();
            refreshShow()

        } catch (error) {
            console.error(error);
        }
    }
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
            </div>

            {title && <div className={style.title}>Titre : {title}</div>}
            {duration && (
                <div className={style.duration}>Durée : {duration} min</div>
            )}
            <button
                className={style.deleteButton}
                onClick={handleDelete}
                aria-label="Supprimer le créneau artiste"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}
