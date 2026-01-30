import { useState } from "react";
import style from "../styles/ModifyArtistModal.module.css";
import { showFeedback } from "../reducers/feedback";
import { useDispatch } from "react-redux";

export default function ModifyShowModal({
    show,
    masters,
    token,
    onClose,
    refreshShow,
}) {
    const dispatch = useDispatch();

    const [number, setNumber] = useState(show.number || "");
    const [date, setDate] = useState(
        show.date ? show.date.split("T")[0] : ""
    );
    const [startTime, setStartTime] = useState(show.startTime || "");
    const [endTime, setEndTime] = useState(show.endTime || "");
    const [master, setMaster] = useState(show.masterOfCeremony._id || "");
    const [status, setStatus] = useState(show.status || "DRAFT");

    async function handleSave() {
        if (!number || !date || !startTime || !endTime) {
            dispatch(
                showFeedback({
                    message: "Tous les champs obligatoires doivent être remplis",
                    type: "error",
                })
            );
            return;
        }
        const body = {
            token: token,
            number: number,
            date: date,
            startTime: startTime,
            endTime: endTime,
            masterOfCeremonyId: master,
            status: status,
        }

        try {
            const response = await fetch(
                `https://sdlb-backend.vercel.app/shows/${show._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (data.result) {
                dispatch(
                    showFeedback({
                        message: "Plateau modifié",
                        type: "success",
                    })
                );
                refreshShow();
                onClose();
            } else {
                dispatch(
                    showFeedback({
                        message: data.error,
                        type: "error",
                    })
                );
            }
        } catch (err) {
            console.error(err);
            dispatch(
                showFeedback({
                    message: "Erreur réseau",
                    type: "error",
                })
            );
        }
    }

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3 className={style.title}>Modifier le plateau</h3>

                {/* Numéro */}
                <input
                    className={style.input}
                    type="number"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Numéro du plateau"
                />

                {/* Date */}
                <input
                    className={style.input}
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* Heure début */}
                <input
                    className={style.input}
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />

                {/* Heure fin */}
                <input
                    className={style.input}
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />

                {/* Maître de cérémonie */}
                <select
                    className={style.input}
                    value={master}
                    onChange={(e) => setMaster(e.target.value)}
                >
                    <option value="">Sélectionner un maître de cérémonie</option>
                    {masters.map((m) => (
                        <option key={m._id} value={m._id}>
                            {m.name} {m.lastName}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    className={style.input}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="DRAFT">Brouillon</option>
                    <option value="CONFIGURING">Configuration</option>
                    <option value="READY">Prêt</option>
                    <option value="PUBLISHED">Publié</option>
                </select>

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
