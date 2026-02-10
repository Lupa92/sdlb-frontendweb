import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ArtistPageComponent from '../components/ArtistComponent';
import Header from '../components/Header';

function ArtistPage() {
    const router = useRouter();
    const { id } = router.query;
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [artist, setArtist] = useState(null);

    if (!id) return null;
    async function getArtistById() {
        if (!user || !user.token || !id) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`https://sdlb-backend.vercel.app/artists/getartistbyid/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: user.token })
            });

            const data = await response.json();

            if (!data.result) {
                setError(data.error || "Erreur lors de la récupération de la liste");
                setLoading(false);
                return;
            }

            setArtist(data.artist);
            setLoading(false);

        } catch (err) {
            console.error(err);
            setError("Erreur réseau");
            setLoading(false);
        }
    }
    useEffect(() => {
        getArtistById();
    }, [id, user]);
    if (loading) return <div>Chargement de l'artiste...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;


    return (
        <>
            <Header />
            <ArtistPageComponent artist={artist} refreshArtist={getArtistById} token={user.token} />;
        </>)
}

export default ArtistPage