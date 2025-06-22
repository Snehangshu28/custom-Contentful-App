import Image from 'next/image';
import styles from './HeroBlock.module.css';

type HeroBlockProps = {
  heading: string;
  subtitle: string;
  cta: string;
  backgroundImage: {
    url: string;
    width: number;
    height: number;
  };
};

const HeroBlock: React.FC<{ component: HeroBlockProps }> = ({ component }) => {
  return (
    <div className={styles.hero}>
      {component.backgroundImage && (
        <Image
          src={component.backgroundImage.url}
          alt={component.heading || 'Hero background'}
          fill
          style={{ objectFit: 'cover' }}
          quality={85}
          priority
        />
      )}
      <div className={styles.content}>
        <h1>{component.heading || 'Welcome'}</h1>
        <p>{component.subtitle || 'Discover amazing content'}</p>
        {component.cta && (
          <button className={styles.ctaButton}>{component.cta}</button>
        )}
      </div>
    </div>
  );
};

export default HeroBlock; 