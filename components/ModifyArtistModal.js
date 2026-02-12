import { useState } from "react";
import style from "../styles/ModifyArtistModal.module.css";
import { showFeedback } from '../reducers/feedback';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";


export default function ModifyArtistModal({ artist, onClose, token, refreshArtist }) {
    const router = useRouter();
    const dispatch = useDispatch()
    const [name, setName] = useState(artist.name);
    const [lastName, setLastName] = useState(artist.lastName);
    const [role, setRole] = useState(artist.role);
    const [description, setDescription] = useState(artist.description || "");
    const [photo, setPhoto] = useState(null);
    const [videos, setVideos] = useState(artist.videos || []);
    const [socials, setSocials] = useState({
        instagram: artist.socials?.instagram || "",
        facebook: artist.socials?.facebook || "",
        youtube: artist.socials?.youtube || "",
        tiktok: artist.socials?.tiktok || "",
        web: artist.socials?.web || "",
    });

    const handleAddVideo = () => {
        if (videos.length >= 4) return;
        setVideos([...videos, ""]);
    };

    const handleVideoChange = (index, value) => {
        const updated = [...videos];
        updated[index] = value;
        setVideos(updated);
    };

    async function handleSave() {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("name", name);
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
                tiktok: socials.tiktok,
                web: socials.web,
            })
        );
        try {
            const res = await fetch(`https://sdlb-backend.vercel.app/artists/${artist._id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (data.result) {
                dispatch(showFeedback({ message: "Artiste modifié", type: 'success' }));
                router.push(`/artists`);
                onClose()
            } else {
                dispatch(showFeedback({ message: data.error, type: 'error' }));

            }
        } catch (err) {
            console.error(err);
            dispatch(showFeedback({ message: "erreur réseau", type: 'error' }));
        }
    };

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3 className={style.title}>Modifier l’artiste</h3>

                {/* Nom */}
                <input
                    className={style.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom"
                />

                {/* Prénom */}
                <input
                    className={style.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Prénom"
                />

                {/* Rôle */}
                <select
                    className={style.input}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="MASTER">Maître de cérémonie</option>
                    <option value="ARTIST">Artiste</option>
                </select>

                {/* Description */}
                <textarea
                    className={style.input}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (1000 caractères max)"
                />

                {/* Photo */}
                {artist.photo && (
                    <img
                        src={artist.photo}
                        alt="Photo artiste"
                        className={style.preview}
                    />
                )}
                <input
                    className={style.input}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                />

                {/* Vidéos */}
                {videos.map((video, index) => (
                    <input
                        key={index}
                        className={style.input}
                        value={video}
                        onChange={(e) =>
                            handleVideoChange(index, e.target.value)
                        }
                        placeholder={`Lien YouTube ${index + 1}`}
                    />
                ))}

                {videos.length < 4 && (
                    <button
                        type="button"
                        className={style.addVideoButton}
                        onClick={handleAddVideo}
                    >
                        + Ajouter une vidéo
                    </button>
                )}

                {/* Réseaux sociaux */}
                <div className={style.socialsGroup}>
                    <input
                        className={style.input}
                        value={socials.instagram}
                        onChange={(e) =>
                            setSocials({ ...socials, instagram: e.target.value })
                        }
                        placeholder="Instagram"
                    />
                    <input
                        className={style.input}
                        value={socials.facebook}
                        onChange={(e) =>
                            setSocials({ ...socials, facebook: e.target.value })
                        }
                        placeholder="Facebook"
                    />
                    <input
                        className={style.input}
                        value={socials.youtube}
                        onChange={(e) =>
                            setSocials({ ...socials, youtube: e.target.value })
                        }
                        placeholder="YouTube"
                    />
                    <input
                        className={style.input}
                        value={socials.tiktok}
                        onChange={(e) =>
                            setSocials({ ...socials, tiktok: e.target.value })
                        }
                        placeholder="tiktok"
                    />
                    <input
                        className={style.input}
                        value={socials.web}
                        onChange={(e) =>
                            setSocials({ ...socials, web: e.target.value })
                        }
                        placeholder="web"
                    />
                </div>

                {/* Actions */}
                <div className={style.actions}>
                    <button
                        className={style.closeButton}
                        type="button"
                        onClick={onClose}
                    >
                        Fermer
                    </button>
                    <button
                        className={style.saveButton}
                        type="button"
                        onClick={handleSave}
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}