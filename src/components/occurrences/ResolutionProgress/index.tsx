import styles from './styles.module.css';
type ResolutionProgressProps={votes:number;goal?:number};
export function ResolutionProgress({votes,goal=3}:ResolutionProgressProps){const clamped=Math.min(votes,goal);const percent=(clamped/goal)*100;return <div className={styles.wrapper}><div className={styles.row}><strong>Resolução comunitária</strong><span>{clamped}/{goal} fotos</span></div><div className={styles.track}><span style={{width:`${percent}%`}} /></div></div>;}
