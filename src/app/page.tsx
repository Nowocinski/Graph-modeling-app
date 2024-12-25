'use client';

import DiagramWrapper from '../components/DiagramWrapper';
import ThreeWrapper from '../components/ThreeWrapper';
import { SceneProvider } from '../context/SceneContext';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  section: {
    flex: '1',
    height: '100%',
    position: 'relative' as const,
    overflow: 'hidden'
  }
};

export default function Home() {
  return (
    <SceneProvider>
      <main style={styles.container}>
        <section style={styles.section}>
          <DiagramWrapper />
        </section>
        <section style={styles.section}>
          <ThreeWrapper />
        </section>
      </main>
    </SceneProvider>
  );
}
