import Image from 'next/image';
import styles from './TwoColumnRow.module.css';

type TwoColumnRowProps = {
  leftHeading: string;
  leftSubtitle: string;
  leftCta: string;
  rightImage: {
    url: string;
    width: number;
    height: number;
  };
};

const TwoColumnRow: React.FC<{ component: TwoColumnRowProps }> = ({ component }) => {
  return (
    <div className={styles.twoColumnRow}>
      <div className={styles.leftColumn}>
        <h2>{component.leftHeading || 'Section Title'}</h2>
        <p>{component.leftSubtitle || 'Section description goes here'}</p>
        {component.leftCta && (
          <button className={styles.ctaButton}>{component.leftCta}</button>
        )}
      </div>
      <div className={styles.rightColumn}>
        {component.rightImage && (
          <Image
            src={component.rightImage.url}
            alt={component.leftHeading || 'Section image'}
            width={component.rightImage.width || 600}
            height={component.rightImage.height || 400}
            style={{ objectFit: 'cover' }}
            quality={85}
          />
        )}
      </div>
    </div>
  );
};

export default TwoColumnRow; 