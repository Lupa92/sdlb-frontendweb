import { useState } from "react";
import style from "../styles/AddModal.module.css";
import { useDispatch } from "react-redux";
import { showFeedback } from "../reducers/feedback";

export default function AddSponsorModal({ onClose, token, fetchSponsors }) {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [logo, setLogo] = useState(null);

    const handleLogoChange = (e) => {
        if (e.target.files[0]) setLogo(e.target.files[0]);
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            dispatch(showFeedback({ message: "Le nom est obligatoire !", type: "error" }));
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append("name", name);
        if (logo) formData.append("photo", logo);

        try {
            const res = await fetch("http://sdlb-backend.vercel.app/sponsors/new", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.result) {
                dispatch(showFeedback({ message: "Partenaire ajouté avec succès !", type: "success" }));
                fetchSponsors();
                onClose();
            } else {
                dispatch(showFeedback({ message: data.error, type: "error" }));
            }
        } catch (err) {
            console.error(err);
            dispatch(showFeedback({ message: "Erreur réseau !", type: "error" }));
        }
    };

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3 className={style.title}>Ajouter un partenaire</h3>

                <div className={style.form}>
                    <label>
                        Nom *
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nom du partenaire"
                        />
                    </label>

                    <label>
                        Logo
                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                    </label>

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
