import Image from 'next/image';
import styles from './ImageGrid.module.css';

type ImageGridProps = {
  image1: {
    url: string;
    width: number;
    height: number;
  };
  image2: {
    url: string;
    width: number;
    height: number;
  };
  image3: {
    url: string;
    width: number;
    height: number;
  };
  image4: {
    url: string;
    width: number;
    height: number;
  };
};

const ImageGrid: React.FC<{ component: ImageGridProps }> = ({ component }) => {
  const images = [
    { ...component.image1, id: 1 },
    { ...component.image2, id: 2 },
    { ...component.image3, id: 3 },
    { ...component.image4, id: 4 },
  ].filter(img => img.url); // Only show images that have URLs

  if (images.length === 0) {
    return (
      <div className={styles.imageGrid}>
        <p>No images configured for this grid.</p>
      </div>
    );
  }

  return (
    <div className={styles.imageGrid}>
      {images.map((image) => (
        <div key={image.id} className={styles.imageContainer}>
          <Image
            src={image.url}
            alt={`Grid image ${image.id}`}
            width={image.width || 300}
            height={image.height || 300}
            style={{ objectFit: 'cover' }}
            quality={85}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid; 