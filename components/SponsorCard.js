import React from "react";
import style from "../styles/SponsorCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SponsorCard({ sponsor, onDelete }) {
    return (
        <div className={style.card}>
            <div className={style.header}>
                <span className={style.name}>{sponsor.name}</span>
            </div>

            <div className={style.logoWrapper}>
                {sponsor.photo ? (
                    <img
                        src={sponsor.photo}
                        alt={`${sponsor.name} logo`}
                        className={style.logo}
                    />
                ) : (
                    <div className={style.placeholder}>Pas de logo</div>
                )}
            </div>

            <button
                className={style.deleteButton}
                onClick={() => onDelete(sponsor._id)}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}
