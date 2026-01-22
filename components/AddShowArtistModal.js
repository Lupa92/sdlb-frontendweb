import { useState } from "react";
import style from "../styles/AddModal.module.css";
import { useDispatch } from "react-redux";
import { showFeedback } from "../reducers/feedback";

export default function AddShowArtistModal({ onClose, artists, token, refreshShow, show }) {
    const dispatch = useDispatch();

    const [artistId, setArtistId] = useState("");
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [order, setOrder] = useState("");

    async function handleCreate() {
        if (!artistId || !duration) {
            dispatch(
                showFeedback({
                    message: "Veuillez remplir tous les champs obligatoires",
                    type: "error",
                })
            );
            return;
        }

        const body = {
            token: token,
            artistId,
            title,
            duration,
            order: order || null,
            showId: show._id,
        };
        try {
            const response = await fetch("https://sdlb-backend.vercel.app/showsArtists/new", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            console.log("datafromFetch", data);

            if (data.result) {
                dispatch(showFeedback({ message: "Créneau Artiste ajouté avec succès !", type: 'success' }));
                refreshShow()
                onClose()
            } else {
                dispatch(showFeedback({ message: data.error, type: 'error' }));
            }
        } catch (err) {
            console.error(err);
            dispatch(showFeedback({ message: "Erreur réseau !", type: 'error' }));
        }

    }

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3 className={style.title}>Créer un créneau artiste</h3>

                <div className={style.form}>
                    <label>
                        Artiste *
                        <select
                            value={artistId}
                            onChange={(e) => setArtistId(e.target.value)}
                        >
                            <option value="">Sélectionner un artiste</option>
                            {artists.map((artist) => (
                                <option key={artist._id} value={artist._id}>
                                    {artist.name} {artist.lastName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Titre
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titre du passage"
                        />
                    </label>

                    <label>
                        Durée (en minutes) *
                        <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="Durée"
                        />
                    </label>

                    <label>
                        Ordre de passage
                        <input
                            type="number"
                            min="1"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            placeholder="Ordre"
                        />
                    </label>

                    <div className={style.actions}>
                        <button
                            type="button"
                            className={style.createButton}
                            onClick={handleCreate}
                        >
                            Créer
                        </button>
                        <button
                            type="button"
                            className={style.closeButton}
                            onClick={onClose}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
