import styles from "./page.module.css";
import DiagramWrapper from '../components/DiagramWrapper';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>React Flow Demo</h1>
        <DiagramWrapper />
      </main>
    </div>
  );
}
