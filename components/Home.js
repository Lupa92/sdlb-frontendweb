import { useState, useEffect } from "react";
import style from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const [countdown, setCountdown] = useState({});
  const router = useRouter();

  useEffect(() => {
    const targetDate = new Date("2026-04-03T12:00:00");
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderCountdown = () => {
    const { days, hours, minutes, seconds } = countdown;
    return (
      <div className={style.countdown}>
        <div><span>{days}</span>J</div>
        <div><span>{hours}</span>H</div>
        <div><span>{minutes}</span>M</div>
        <div><span>{seconds}</span>S</div>
      </div>
    );

  };

  const cards = [
    { label: "Artistes", route: "/artists", color: "#c13cBe" },
    { label: "Shows", route: "/shows", color: "#f9b226" },
    { label: "Actualités", route: "/news", color: "#68c6e1" },
    { label: "Partenaires", route: "/sponsors", color: "#312561" },
  ];

  return (
    <div className={style.container}>
      <h1 className={style.pageTitle}>Configuration de l'application Show dans la Baie</h1>

      <section className={style.section}>
        {/* <h2 className={style.sectionTitle}>TIC TAC</h2> */}
        {renderCountdown()}
      </section>

      <section className={style.section}>
        {/* <h2 className={style.sectionTitle}>Accès rapide</h2> */}
        <div className={style.cardsContainer}>
          {cards.map((c) => (
            <div
              key={c.label}
              className={style.card}
              style={{ backgroundColor: c.color }}
              onClick={() => router.push(c.route)}
            >
              <p className={style.cardLabel}>{c.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
