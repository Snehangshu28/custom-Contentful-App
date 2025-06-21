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
      <div className={styles.left}>
        <h2>{component.leftHeading}</h2>
        <p>{component.leftSubtitle}</p>
        <button>{component.leftCta}</button>
      </div>
      <div className={styles.right}>
        <Image
          src={component.rightImage.url}
          alt={component.leftHeading}
          width={component.rightImage.width}
          height={component.rightImage.height}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default TwoColumnRow; 