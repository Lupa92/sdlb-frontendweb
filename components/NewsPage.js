import { useState, useEffect } from "react";
import style from "../styles/NewsPage.module.css";
import AddNewsModal from "./AddNewsModal";
import ShowCard from "./ShowCard";
import { useSelector } from "react-redux";
import NewsCard from "./NewsCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";



export default function NewsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [news, setNews] = useState([]);
    const user = useSelector((state) => state.user.value);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("desc");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);

    useEffect(() => {
        if (user?.token) fetchNews();
    }, [user]);

    async function fetchNews() {
        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/news/getnews/${user.token}`)
            const data = await response.json();
            if (data.result) {
                setNews(data.newsList);
            } else {
                setNews([]);
            }
        } catch (err) {
            setNews([]);
        } finally {
            setLoading(false)
        }
    }

    function askDelete(news) {
        setNewsToDelete(news);
        setConfirmOpen(true);
    }
    async function confirmDelete() {
        if (!newsToDelete) return;

        await onDelete(newsToDelete._id);
        setConfirmOpen(false);
        setNewsToDelete(null);
    }

    async function onDelete(newsId) {
        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/news/delete/${newsId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token }),
            })
            const data = await response.json();
            fetchNews()

        } catch (error) {
            console.error(error);
        }
    }
    const filteredNews = news
        .filter((n) =>
            n.title.toLowerCase().includes(search.toLowerCase())
        )
        .slice() // copie du tableau
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            return sortOrder === "desc"
                ? dateB - dateA // plus récent → plus ancien
                : dateA - dateB; // plus ancien → plus récent
        });


    let newsToDisplay = filteredNews.map((a) => {
        return (
            <NewsCard news={a} onAskDelete={() => askDelete(a)}
                key={a._id} />
        )
    })


    return (
        <div className={style.container}>
            <h1 className={style.pageTitle}>
                Page de configuration des actualités
            </h1>
            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Ajouter une actualité
                </h2>

                <button
                    className={style.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Ajouter une actualité
                </button>
            </section>

            <section className={style.section}>
                <h2 className={style.sectionTitle}>
                    Les actualités existantes
                </h2>
                <button
                    className={style.sortButton}
                    onClick={() =>
                        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                    }
                >
                    <FontAwesomeIcon
                        icon={sortOrder === "desc" ? faArrowDown : faArrowUp}
                    />
                    Trier par date
                </button>
                <input
                    type="text"
                    placeholder="Rechercher par titre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={style.searchInput}
                />
                {loading && <div> Chargement de vos news en cours</div>}
                {news.length !== 0 ? <div className={style.scrollContainer}>{newsToDisplay}</div> : <div> Vous n'avez aucune actualité pour le moment</div>}

            </section>

            {isModalOpen && (
                <AddNewsModal onClose={() => setIsModalOpen(false)} token={user.token} fetchNews={fetchNews} />
            )}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Supprimer l’actualité"
                message={`Es-tu sûr de vouloir supprimer "${newsToDelete?.title}" ?`}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}