import React from "react";
import style from "../styles/ArtistComponent.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash, faCrown } from "@fortawesome/free-solid-svg-icons";
import {
    faInstagram as faInstagramBrand,
    faFacebook as faFacebookBrand,
    faYoutube as faYoutubeBrand
} from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";
import ModifyArtistModal from "./ModifyArtistModal";


export default function ArtistComponent({ artist, refreshArtist, token }) {
    const router = useRouter();
    const [showModifyModal, setShowModifyModal] = useState(false);

    if (!artist) return <p>Chargement...</p>;

    // Fonction pour transformer en embed
    function getYoutubeEmbedUrl(url) {
        if (!url) return null;

        const regExp =
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }
    let facebook;
    if (artist.socials.facebook) {
        facebook = getYoutubeEmbedUrl(artist.socials.facebook)
    }

    let youtube;
    if (artist.socials.youtube) {
        facebook = getYoutubeEmbedUrl(artist.socials.youtube)
    }
    let instagram;
    if (artist.socials.instagram) {
        facebook = getYoutubeEmbedUrl(artist.socials.instagram)
    }

    let role;
    if (artist.role === "MASTER") {
        role = "Maitre de cérémonie"
    } else {
        role = "Artiste"
    }


    return (
        <div className={style.container}>
            <button className={style.backButton} onClick={() => router.push('/artists')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </button>
            <h1 className={style.title}>Page Artiste</h1>

            <div className={style.header}>
                <h2 className={style.name}>
                    {artist.name} {artist.lastName}{" "}
                    {artist.role === "MASTER" && (
                        <FontAwesomeIcon icon={faCrown} className={style.masterIcon} color="#c13c8e" />
                    )}
                </h2>
                <span className={style.role}>{role}</span>
            </div>

            {artist.photo && (
                <div className={style.photoWrapper}>
                    <img
                        src={artist.photo}
                        alt={`${artist.name} ${artist.lastName}`}
                        className={style.photo}
                    />
                </div>
            )}

            {artist.videos && artist.videos.length > 0 && (
                <div className={style.videosSection}>
                    <h3 className={style.sectionTitle}>Vidéos</h3>
                    <div className={style.videosScroll}>
                        {artist.videos.map((video, index) => {
                            const embedUrl = getYoutubeEmbedUrl(video);
                            if (!embedUrl) return null;
                            return (
                                <iframe
                                    key={index}
                                    src={embedUrl}
                                    className={style.video}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {artist.socials && (
                <div className={style.socialsSection}>
                    <h3 className={style.sectionTitle}>Réseaux sociaux</h3>
                    <div className={style.socials}>
                        {artist.socials.instagram && (
                            <div className={style.socialItem}>
                                <a href={instagram} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faInstagramBrand} className={style.socialIcon} />
                                </a>
                                <div>{artist.socials.instagram}</div>
                            </div>
                        )}
                        {artist.socials.facebook && (
                            <div className={style.socialItem}>
                                <a href={facebook} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faFacebookBrand} className={style.socialIcon} />
                                </a>
                                <div>{artist.socials.facebook}</div>
                            </div>
                        )}
                        {artist.socials.youtube && (

                            <div className={style.socialItem}>
                                <a href={youtube} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faYoutubeBrand} className={style.socialIcon} />
                                </a>
                                <div> {artist.socials.youtube} </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button
                className={style.editButton}
                onClick={() => setShowModifyModal(true)}
            >
                Modifier
            </button>
            {showModifyModal && (
                <ModifyArtistModal
                    artist={artist}
                    onClose={() => setShowModifyModal(false)}
                    onSave={refreshArtist}
                    token={token}
                />
            )}
        </div>
    );
}