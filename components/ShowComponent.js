import React, { useState } from "react";
import style from "../styles/ShowComponent.module.css";
import ShowArtistCard from "./ShowArtistCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import AddShowArtistModal from "./AddShowArtistModal";
import ModifyShowModal from "./ModifyShowModal";
import ConfirmModal from "./ConfirmModal";


export default function ShowComponent({
    show,
    showsArtist,
    token,
    refreshShow,
    artists,
}) {
    const router = useRouter();
    const [AddShowArtistModalVisible, setAddShowArtistModalVisible] = useState(false)
    const [editShowModalVisible, setEditShowModalVisible] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [showArtistToDelete, setShowArtistToDelete] = useState(null);


    // Formatage de la date et du jour
    const showDate = new Date(show.date);
    const dayOfWeek = showDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    const formattedDate = showDate.toLocaleDateString('fr-FR');

    async function onAddShowArtist() {
        setAddShowArtistModalVisible(true)
    }
    async function onEditShow() {
        setEditShowModalVisible(true)
    }

    const sortedShowsArtist = [...showsArtist].sort(
        (a, b) => a.order - b.order
    );
    const masters = artists.filter((a) => a.role === "MASTER")
    console.log("master", masters)

    // Fonction pour delete le showArtist
    function askDelete(showArtist) {
        setShowArtistToDelete(showArtist);
        setConfirmOpen(true);
    }
    async function confirmDelete() {
        if (!showArtistToDelete) return;

        await onDelete(showArtistToDelete._id);
        setConfirmOpen(false);
        setShowArtistToDelete(null);
    }
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

    return (
        <div className={style.container}>
            {/* Bouton retour */}
            <button className={style.backButton} onClick={() => router.push('/shows')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </button>

            {/* Titre */}
            <h1 className={style.title}>Page Plateau</h1>

            {/* Informations du show */}
            <h2> Informations </h2>
            <div className={style.infoCard}>
                <p className={style.info}><strong>Numéro :</strong> {show.number}</p>
                <p className={style.info}><strong>Date :</strong> {dayOfWeek} ({formattedDate})</p>
                <p className={style.info}><strong>Début :</strong> {show.startTime}</p>
                <p className={style.info}><strong>Fin :</strong> {show.endTime}</p>
                <p className={style.info}><strong>Status :</strong> {show.status}</p>
                <p className={style.info}>
                    <strong>Maître de cérémonie :</strong>{" "}
                    {show.masterOfCeremony ? `${show.masterOfCeremony.name} ${show.masterOfCeremony.lastName}` : "Aucun"}
                </p>
            </div>

            {/* Liste des ShowArtists */}
            <div className={style.artistsSection}>
                <h2> Artistes</h2>
                <div className={style.artistsList}>
                    {showsArtist.length > 0 ? (
                        sortedShowsArtist.map(sa => (
                            <ShowArtistCard key={sa._id} showArtist={sa} onAskDelete={() => askDelete(sa)} />
                        ))
                    ) : (
                        <p>Aucun artiste assigné pour l'instant.</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className={style.actions}>
                <button className={style.addButton} onClick={onAddShowArtist}>
                    <FontAwesomeIcon icon={faPlus} /> Ajouter ShowArtist
                </button>
                <button className={style.editButton} onClick={onEditShow}>
                    <FontAwesomeIcon icon={faEdit} /> Modifier la configuration du plateau
                </button>
            </div>
            {AddShowArtistModalVisible && <AddShowArtistModal show={show} token={token} refreshShow={refreshShow} artists={artists} onClose={() => setAddShowArtistModalVisible(false)} />}
            {editShowModalVisible && <ModifyShowModal show={show} token={token} refreshShow={refreshShow} onClose={() => setEditShowModalVisible(false)} masters={masters} />}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Supprimer le show de l'artiste"
                message={`Es-tu sûr de vouloir supprimer le show de l'artiste ${showArtistToDelete?.artist.name} ?`}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
