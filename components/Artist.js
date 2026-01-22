import { useState, useEffect } from "react";
import style from "../styles/Artist.module.css";
import AddArtistModal from "./AddArtistModal";
import ArtistCard from "./ArtistCard";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";

export default function Artist() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [artists, setArtists] = useState([]);
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (user?.token) fetchArtists();
    }, [user]);

    async function fetchArtists() {
        try {
            const response = await fetch(`http://sdlb-backend.vercel.app/artists/getartists/${user.token}`)
            const data = await response.json();
            console.log("data", data)
            if (data.result) {
                console.log("data", data)
                setArtists(data.artists);
            } else {
                setArtists([]);
            }
        } catch (err) {
            console.error(err);
            setArtists([]);
        } finally {
            setLoading(false)
        }
    }

    async function onDelete(artistId) {
        try {
            const response = await fetch(`http://sdlb-backend.vercel.app/artists/delete/${artistId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token }),
            })
            const data = await response.json();
            console.log(data)
            fetchArtists()

        } catch (error) {
            console.error(error);
        }
    }
    const filteredArtists = artists.filter((n) =>
        n.name.toLowerCase().includes(search.toLowerCase()) || n.lastName.toLowerCase().includes(search.toLowerCase())
    );
    let artistsToDisplay = filteredArtists.map((a) => {
        return (
            <ArtistCard artist={a} onDelete={onDelete} />
        )
    })


    return (
        <div className={style.container}>
            <h1 className={style.pageTitle}>
                Artistes de Show dans la Baie
            </h1>
            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Ajouter un artiste
                </h2>

                <button
                    className={style.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Ajouter un artiste
                </button>
            </section>

            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Les artistes présents
                </h2>
                <input
                    type="text"
                    placeholder="Rechercher un artiste..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={style.searchInput}
                />
                {loading && <div> Chargement de vos artistes en cours</div>}
                {artists.length !== 0 ? <div className={style.scrollContainer}>{artistsToDisplay}</div> : <div> Vous n'avez aucun artiste pour le moment</div>}

            </section>

            {/* Modale */}
            {isModalOpen && (
                <AddArtistModal onClose={() => setIsModalOpen(false)} token={user.token} fetchArtists={fetchArtists} />
            )}
        </div>
    );
}
