import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import ShowComponent from '../components/ShowComponent';

function ShowPage() {
    const router = useRouter();
    const { id } = router.query;
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [show, setShow] = useState(null);
    const [showsArtist, setShowsArtist] = useState([]);
    const [artists, setArtists] = useState([])

    if (!id) return null;
    async function getShowById() {
        if (!user || !user.token || !id) return;

        setLoading(true);
        setError("");

        try {
            console.log("go get Show by ID")
            const response = await fetch(`https://sdlb-backend.vercel.app/shows/getshowbyid/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: user.token })
            });

            const data = await response.json();
            console.log(data)

            if (!data.result) {
                setError(data.error || "Erreur lors de la récupération du show");
                setLoading(false);
                return;
            }

            setShow(data.show);
            setShowsArtist(data.showsArtist)
            setArtists(data.artists)
            setLoading(false);

        } catch (err) {
            console.error(err);
            setError("Erreur réseau");
            setLoading(false);
        }
    }
    useEffect(() => {
        getShowById();
    }, [id, user]);
    if (loading) return <div>Chargement du plateau...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;


    return (
        <>
            <Header />
            <ShowComponent show={show} refreshShow={getShowById} token={user.token} showsArtist={showsArtist} artists={artists} />;
        </>)
}

export default ShowPage