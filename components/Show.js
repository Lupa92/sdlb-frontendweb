import { useState, useEffect } from "react";
import style from "../styles/Show.module.css";
import AddShowModal from "./AddShowModal";
import ShowCard from "./ShowCard";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";


export default function Show() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shows, setShows] = useState([]);
    const [mastersList, setMastersList] = useState([])
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [showToDelete, setShowToDelete] = useState(null);

    useEffect(() => {
        if (user?.token) fetchShows();
    }, [user]);

    async function fetchShows() {
        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/shows/getshows/${user.token}`)
            const data = await response.json();
            if (data.result) {
                setShows(data.shows);
                setMastersList(data.mastersList)
            } else {
                setShows([]);
            }
        } catch (err) {
            console.error(err);
            setShows([]);
            setMastersList([]);
        } finally {
            setLoading(false)
        }
    }

    function askDelete(show) {
        setShowToDelete(show);
        setConfirmOpen(true);
    }
    async function confirmDelete() {
        if (!showToDelete) return;

        await onDelete(showToDelete._id);
        setConfirmOpen(false);
        setShowToDelete(null);
    }

    async function onDelete(showId) {
        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/shows/delete/${showId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token }),
            })
            const data = await response.json();
            fetchShows()

        } catch (error) {
            console.error(error);
        }
    }

    let showToDisplay = shows.map((a) => {
        return (
            <ShowCard show={a} onDelete={onDelete} key={a._id} onAskDelete={() => askDelete(a)} />
        )
    })


    return (
        <div className={style.container}>
            <h1 className={style.pageTitle}>
                Page de configuration des plateaux
            </h1>
            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Ajouter un plateau
                </h2>

                <button
                    className={style.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Ajouter un plateau
                </button>
            </section>

            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Les plateaux existants
                </h2>
                {loading && <div> Chargement de vos shows en cours</div>}
                {shows.length !== 0 ? <div className={style.scrollContainer}>{showToDisplay}</div> : <div> Vous n'avez aucun plateau pour le moment</div>}

            </section>

            {/* Modale */}
            {isModalOpen && (
                <AddShowModal onClose={() => setIsModalOpen(false)} token={user.token} fetchShows={fetchShows} mastersList={mastersList} />
            )}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Supprimer le plateau"
                message={`Es-tu sûr de vouloir supprimer le plateau ${showToDelete?.number} ?`}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
