import styles from './Loading.module.css';

interface LoadingProps {
  isFullscreen?: boolean;
  onClick?: ()=>void
}

export default function Loading({ isFullscreen, onClick }:LoadingProps){
  return (
    <div onClick={onClick} className={isFullscreen ? styles.loading_fullscreen : styles.loading}>
      <svg width="50" height="50">
        <circle cx="25" cy="25" r="20" className={styles.outer_circle} />
      </svg> 
    </div>
  );
}