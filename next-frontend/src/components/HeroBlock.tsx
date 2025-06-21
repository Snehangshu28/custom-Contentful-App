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
      <Image
        src={component.backgroundImage.url}
        alt={component.heading}
        layout="fill"
        objectFit="cover"
        quality={85}
      />
      <div className={styles.content}>
        <h1>{component.heading}</h1>
        <p>{component.subtitle}</p>
        <button>{component.cta}</button>
      </div>
    </div>
  );
};

export default HeroBlock; 