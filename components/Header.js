import { useRouter } from "next/router";
import style from "../styles/Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { disconnect } from "../reducers/user"
import Image from "next/image";


export default function Header() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useDispatch()
    function handleDisconnect() {
        dispatch(disconnect())
        setIsModalOpen(false)
        router.push('/')
    }

    return (
        <header className={style.header}>
            {/* Logo à gauche */}
            <div
                className={style.left}
                onClick={() => router.push("/home")}
                role="button"
            >
                <Image
                    src="/Logo_Blanc.png"
                    alt="MyLogo"
                    width={70}
                    height={70}
                    className={style.logo} />
                {/* <span className={style.logo}>MyLogo</span> */}
            </div>

            {/* Navigation au centre */}
            <nav className={style.center}>
                <span
                    className={style.link}
                    onClick={() => router.push("/artists")}
                >
                    Artistes
                </span>
                <span
                    className={style.link}
                    onClick={() => router.push("/shows")}
                >
                    Plateaux
                </span>
                <span
                    className={style.link}
                    onClick={() => router.push("/news")}
                >
                    Actualités
                </span>
                <span
                    className={style.link}
                    onClick={() => router.push("/sponsors")}
                >
                    Partenaires
                </span>
            </nav>

            {/* Profil à droite */}
            <div
                className={style.right}
                onClick={() => setIsModalOpen(true)}
                role="button"
            >
                <FontAwesomeIcon icon={faRightFromBracket} className={style.profile} />
            </div>
            {isModalOpen && <ConfirmModal
                isOpen={isModalOpen}
                title="Voulez allez être déconnecté ? "
                onConfirm={handleDisconnect}
                onCancel={() => setIsModalOpen(false)} />}
        </header>
    );
}
