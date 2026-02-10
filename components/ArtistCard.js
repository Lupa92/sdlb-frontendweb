import React from "react";
import style from "../styles/ArtistCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCrown } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ArtistCard({ artist, onAskDelete }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/artist?id=${artist._id}`);
    };


    return (
        <div className={style.card} onClick={handleClick}>
            <div className={style.header}>
                <span className={style.name}>{artist.name}</span>
                <span className={style.lastName}>{artist.lastName}</span>
                {artist.role === "MASTER" && (
                    <FontAwesomeIcon icon={faCrown} className={style.masterIcon} color="#c13c8e" />
                )}
            </div>

            <div className={style.photoWrapper}>
                {artist.photo ? (
                    <img
                        src={artist.photo}
                        alt={`${artist.name} ${artist.lastName}`}
                        className={style.photo}
                    />
                ) : (
                    <div className={style.placeholder}>Pas de photo</div>
                )}
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
