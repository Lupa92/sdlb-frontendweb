import { useState, useEffect } from "react";
import style from "../styles/SponsorsPage.module.css";
import AddSponsorModal from "./AddSponsorModal";
import SponsorCard from "./SponsorCard";
import { useSelector } from "react-redux";

export default function SponsorPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sponsors, setSponsors] = useState([]);
    const user = useSelector((state) => state.user.value);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) fetchSponsors();
    }, [user]);

    async function fetchSponsors() {
        try {
            const response = await fetch(`http://localhost:3000/sponsors/getsponsors/${user.token}`)
            const data = await response.json();
            if (data.result) {
                setSponsors(data.sponsors);
            } else {
                setSponsors([]);
            }
        } catch (err) {
            setSponsors([]);
        } finally {
            setLoading(false)
        }
    }

    async function onDelete(sponsorId) {
        try {
            const response = await fetch(`http://localhost:3000/sponsors/delete/${sponsorId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token }),
            })
            const data = await response.json();
            fetchSponsors()

        } catch (error) {
            console.error(error);
        }
    }
    const filteredSponsors = sponsors.filter((n) =>
        n.name.toLowerCase().includes(search.toLowerCase())
    );

    let sponsorsToDisplay = filteredSponsors.map((s) => {
        return (
            <SponsorCard sponsor={s} onDelete={onDelete} key={s._id} />
        )
    })


    return (
        <div className={style.container}>
            <h1 className={style.pageTitle}>
                Page de configuration des partenaires
            </h1>
            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Ajouter un sponsor
                </h2>

                <button
                    className={style.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Ajouter un sponsor
                </button>
            </section>
            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Les partenaires existants
                </h2>
                <input
                    type="text"
                    placeholder="Rechercher par nom ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={style.searchInput}
                />
                {loading && <div> Chargement de vos partenaires en cours</div>}
                {sponsors.length !== 0 ? <div className={style.scrollContainer}>{sponsorsToDisplay}</div> : <div> Vous n'avez aucun partenaire pour le moment</div>}

            </section>

            {isModalOpen && (
                <AddSponsorModal onClose={() => setIsModalOpen(false)} token={user.token} fetchSponsors={fetchSponsors} />
            )}
        </div>
    );
}