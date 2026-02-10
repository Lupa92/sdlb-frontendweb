import { useState } from "react";
import style from "../styles/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()


    const handleConnect = async () => {
        setError("");

        if (!email || !password) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://sdlb-backend.vercel.app/users/signin', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json()
            if (!data.result || !data.user?.token) {
                console.error("Token manquant ou utilisateur non trouvé.", data);
                setError(data.error || "Données de connexion incomplètes.");
                return;
            }

            dispatch(login(data.user))
            setEmail("");
            setError("");
            setPassword("");
            router.push("/home");
        } catch (error) {
            console.log({ result: false, error: error.message })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.card}>
                <h2 className={style.title}>Connexion</h2>

                {error && <p className={style.error}>{error}</p>}

                <div className={style.field}>
                    <label className={style.label}>Email</label>
                    <input
                        className={style.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                    />
                </div>

                <div className={style.field}>
                    <label className={style.label}>Mot de passe</label>
                    <div className={style.passwordWrapper}>
                        <input
                            className={style.input}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <span
                            className={style.passwordEye}
                            onClick={() => setShowPassword(!showPassword)}
                            role="button"
                            aria-label="Afficher ou masquer le mot de passe"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className={style.button}
                    onClick={handleConnect}
                    disabled={loading}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </div>
        </div>
    );
}
