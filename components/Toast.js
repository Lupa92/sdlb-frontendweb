import { useSelector, useDispatch } from 'react-redux';
import { hideFeedback } from '../reducers/feedback';
import { useEffect } from 'react';
import styles from '../styles/Toast.module.css';

export default function Toast() {
    console.log("toast")
    const { message, type, visible } = useSelector((state) => state.feedback.value);
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => dispatch(hideFeedback()), 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, dispatch]);

    if (!visible) return null;

    return (
        <div className={`${styles.toast} ${type === 'error' ? styles.error : styles.success}`}>
            {message}
            <button
                className={styles.closeButton}
                onClick={() => dispatch(hideFeedback())}
                aria-label="Fermer"
            >
                ×
            </button>
        </div>
    );
}
