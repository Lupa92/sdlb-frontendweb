import { useState, useEffect } from "react";
import style from "../styles/NewsPage.module.css";
import AddNewsModal from "./AddNewsModal";
import ShowCard from "./ShowCard";
import { useSelector } from "react-redux";
import NewsCard from "./NewsCard";

export default function NewsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [news, setNews] = useState([]);
    const user = useSelector((state) => state.user.value);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

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

    async function onDelete(newsId) {
        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/news/delete/${newsId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token }),
            })
            const data = await response.json();
            console.log(data)
            fetchNews()

        } catch (error) {
            console.error(error);
        }
    }
    const filteredNews = news.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase())
    );

    let newsToDisplay = filteredNews.map((a) => {
        return (
            <NewsCard news={a} onDelete={onDelete} key={a._id} />
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
        </div>
    );
}