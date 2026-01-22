import { useState } from "react";
import style from "../styles/AddModal.module.css";
import { useDispatch } from "react-redux";
import { showFeedback } from "../reducers/feedback";

export default function AddNewsModal({ onClose, token, fetchNews }) {
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [videos, setVideos] = useState([""]);
    const [button, setButton] = useState({ label: "", link: "", type: "" });

    // Ajouter un input vidéo (max 4)
    const addVideoInput = () => {
        if (videos.length < 4) setVideos([...videos, ""]);
    };

    const handleVideoChange = (index, value) => {
        const newVideos = [...videos];
        newVideos[index] = value;
        setVideos(newVideos);
    };

    // Gestion photo upload
    const handlePhotoChange = (e) => {
        if (e.target.files[0]) setPhoto(e.target.files[0]);
    };

    // Gestion button
    const handleButtonChange = (key, value) => {
        setButton({ ...button, [key]: value });
    };

    async function handleCreate() {
        // Validation des champs obligatoires
        if (!title.trim() || !subtitle.trim() || !description.trim()) {
            dispatch(showFeedback({ message: "Tous les champs obligatoires doivent être remplis", type: "error" }));
            return;
        }
        console.log("button", button)

        // Validation du bouton si rempli
        const hasAnyField = button.label || button.link || button.type;
        const hasAllValidFields = button.label?.trim() && button.link?.trim() && ["INTERNAL", "EXTERNAL"].includes(button.type);
        if (hasAnyField && !hasAllValidFields) {
            dispatch(showFeedback({ message: "Le bouton est mal configuré", type: "error" }));
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("description", description);

        if (photo) formData.append("photo", photo);

        videos.forEach((v) => formData.append("videos", v));

        if (button.label && button.link) {
            formData.append("button", JSON.stringify(button));
        }

        try {
            const res = await fetch("http://localhost:3000/news/new", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.result) {
                dispatch(showFeedback({ message: "Actualité ajoutée avec succès !", type: "success" }));
                fetchNews();
                onClose();
            } else {
                dispatch(showFeedback({ message: data.error, type: "error" }));
            }
        } catch (err) {
            console.error(err);
            dispatch(showFeedback({ message: "Erreur réseau !", type: "error" }));
        }
    }

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3 className={style.title}>Ajouter une actualité</h3>

                <div className={style.form}>
                    <label>
                        Titre *
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
                    </label>

                    <label>
                        Sous-titre *
                        <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Sous-titre" />
                    </label>

                    <label>
                        Description *
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                    </label>

                    <label>
                        Photo
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    </label>

                    <div className={style.videos}>
                        <span>Vidéos YouTube</span>
                        {videos.map((v, i) => (
                            <input key={i} type="text" value={v} placeholder={`Lien vidéo ${i + 1}`} onChange={(e) => handleVideoChange(i, e.target.value)} />
                        ))}
                        {videos.length < 4 && (
                            <button type="button" className={style.addVideo} onClick={addVideoInput}>
                                + Ajouter une vidéo
                            </button>
                        )}
                    </div>

                    <div className={style.form}>
                        <span>Bouton (optionnel)</span>
                        <input
                            type="text"
                            placeholder="Titre du bouton"
                            value={button.label}
                            onChange={(e) => handleButtonChange("label", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Lien"
                            value={button.link}
                            onChange={(e) => handleButtonChange("link", e.target.value)}
                        />
                        <select value={button.type} onChange={(e) => handleButtonChange("type", e.target.value)}>
                            <option value="">Sélectionnez le type</option>
                            <option value="INTERNAL">Interne</option>
                            <option value="EXTERNAL">Externe</option>
                        </select>
                    </div>

                    <div className={style.actions}>
                        <button type="button" className={style.createButton} onClick={handleCreate}>
                            Créer
                        </button>
                        <button type="button" className={style.closeButton} onClick={onClose}>
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}