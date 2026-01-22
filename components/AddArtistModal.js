import { useState } from "react";
import style from "../styles/AddModal.module.css";
import { showFeedback } from "../reducers/feedback";
import { useDispatch } from "react-redux";

export default function AddArtistModal({ onClose, token, fetchArtists }) {
    const dispatch = useDispatch()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("ARTIST");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [videos, setVideos] = useState([""]);
    const [socials, setSocials] = useState({
        instagram: "",
        facebook: "",
        youtube: "",
    });
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

    // Gestion socials
    const handleSocialChange = (key, value) => {
        setSocials({ ...socials, [key]: value });
    };

    async function handleCreate() {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("name", firstName);
        formData.append("lastName", lastName);
        formData.append("role", role);
        formData.append("description", description);

        if (photo) {
            formData.append("photo", photo)
        }
        videos.forEach((v) => {
            formData.append("videos", v)
        });
        formData.append(
            "socials",
            JSON.stringify({
                instagram: socials.instagram,
                facebook: socials.facebook,
                youtube: socials.youtube,
            })
        );
        try {
            const res = await fetch("http://localhost:3000/artists/new", {
                method: "POST",
                body: formData, // multipart/form-data auto
            });

            const data = await res.json();
            console.log(data);

            if (data.result) {
                dispatch(showFeedback({ message: "Artiste ajouté avec succès !", type: 'success' }));
                fetchArtists()
                onClose()
            } else {
                dispatch(showFeedback({ message: data.error, type: 'error' }));
            }
        } catch (err) {
            console.error(err);
            dispatch(showFeedback({ message: "Erreur réseau !", type: 'error' }));
        }
    };


    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3 className={style.title}>Ajouter un artiste</h3>

                <div className={style.form}>
                    <label>
                        Prénom
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Prénom"
                        />
                    </label>

                    <label>
                        Nom
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Nom"
                        />
                    </label>

                    <label>
                        Rôle
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="MASTER">Maître de cérémonie</option>
                            <option value="ARTIST">Artiste</option>
                        </select>
                    </label>

                    <label>
                        Description (max 500 caractères)
                        <textarea
                            maxLength={500}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <small>{description.length}/500</small>
                    </label>

                    <label>
                        Photo
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    </label>

                    <div className={style.videos}>
                        <span>Vidéos YouTube</span>
                        {videos.map((v, i) => (
                            <input
                                key={i}
                                type="text"
                                value={v}
                                placeholder={`Lien vidéo ${i + 1}`}
                                onChange={(e) => handleVideoChange(i, e.target.value)}
                            />
                        ))}
                        {videos.length < 4 && (
                            <button type="button" className={style.addVideo} onClick={addVideoInput}>
                                + Ajouter une vidéo
                            </button>
                        )}
                    </div>

                    <div className={style.socials}>
                        <span>Réseaux sociaux</span>
                        <input
                            type="text"
                            placeholder="Instagram"
                            value={socials.instagram}
                            onChange={(e) => handleSocialChange("instagram", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Facebook"
                            value={socials.facebook}
                            onChange={(e) => handleSocialChange("facebook", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="YouTube"
                            value={socials.youtube}
                            onChange={(e) => handleSocialChange("youtube", e.target.value)}
                        />
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
