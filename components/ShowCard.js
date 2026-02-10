import React from "react";
import style from "../styles/ShowCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function ShowCard({ show, onAskDelete }) {
    const router = useRouter();

    const handleClick = () => {
        // Navigue vers la fiche show
        router.push(`/show?id=${show._id}`);
    };

    return (
        <div className={style.card} onClick={handleClick}>
            <div className={style.header}>
                <span className={style.number}>Plateau #{show.number}</span>
                <span className={style.status}>{show.status}</span>
            </div>

            <div className={style.timeWrapper}>
                <span className={style.time}> {<span>{new Date(show.date).toLocaleDateString('fr-FR', { weekday: 'long' })}</span>} </span>
                <span className={style.time}>Début : {show.startTime}</span>
                <span className={style.time}>Fin : {show.endTime}</span>
            </div>

            <button
                className={style.deleteButton}
                onClick={(e) => {
                    e.stopPropagation(); // empêche la navigation
                    onAskDelete();
                }}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}
