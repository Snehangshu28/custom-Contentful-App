import Image from 'next/image';
import styles from './ImageGrid.module.css';

type Image = {
  url: string;
  width: number;
  height: number;
};

type ImageGridProps = {
  image1: Image;
  image2: Image;
  image3: Image;
  image4: Image;
};

const ImageGrid: React.FC<{ component: ImageGridProps }> = ({ component }) => {
  const images = [component.image1, component.image2, component.image3, component.image4];
  
  return (
    <div className={styles.imageGrid}>
      {images.map((image, index) => (
        image && (
          <div key={index} className={styles.gridItem}>
            <Image
              src={image.url}
              alt={`Grid image ${index + 1}`}
              width={image.width}
              height={image.height}
              className={styles.image}
            />
          </div>
        )
      ))}
    </div>
  );
};

export default ImageGrid; 