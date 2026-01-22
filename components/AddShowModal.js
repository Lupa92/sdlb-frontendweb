import { useState } from "react";
import style from "../styles/AddModal.module.css"; // réutilise le même style
import { showFeedback } from "../reducers/feedback";
import { useDispatch } from "react-redux";

export default function AddShowModal({ onClose, token, mastersList, fetchShows }) {
    const dispatch = useDispatch();
    const [number, setNumber] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [masterOfCeremony, setMasterOfCeremony] = useState("");
    const [status, setStatus] = useState("DRAFT");

    const statusOptions = [
        { value: "DRAFT", label: "Brouillon" },
        { value: "CONFIGURING", label: "Configuration" },
        { value: "READY", label: "Prêt" },
        { value: "PUBLISHED", label: "Publié" },
    ];

    async function handleCreate() {
        if (!number || !date || !startTime || !endTime) {
            dispatch(showFeedback({ message: "Veuillez remplir tous les champs obligatoires", type: 'error' }));
            return;
        }

        // On construit l'objet Show
        const body = {
            token,
            number,
            date,
            startTime,
            endTime,
            masterOfCeremonyId: masterOfCeremony || null,
            status,
        };
        try {
            const response = await fetch("http://sdlb-backend.vercel.app/shows/new", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            console.log("datafromFetch", data);

            if (data.result) {
                dispatch(showFeedback({ message: "Show ajouté avec succès !", type: 'success' }));
                fetchShows()
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
                <h3 className={style.title}>Créer un show</h3>

                <div className={style.form}>
                    <label>
                        Numéro *
                        <input
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Numéro du show"
                        />
                    </label>

                    <label>
                        Date *
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>

                    <label>
                        Heure de début *
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </label>

                    <label>
                        Heure de fin *
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </label>

                    <label>
                        Maître de cérémonie
                        <select
                            value={masterOfCeremony}
                            onChange={(e) => setMasterOfCeremony(e.target.value)}
                        >
                            <option value="">Aucun</option>
                            {mastersList.map((master) => (
                                <option key={master._id} value={master._id}>
                                    {master.name} {master.lastName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Status
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            {statusOptions.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
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
