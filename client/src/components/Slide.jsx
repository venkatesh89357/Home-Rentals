import { useState, useEffect } from "react";
import "../styles/Slide.scss"

const Slide = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/assets/beach_cat.jpg',
    '/assets/pool_cat.jpg',
    '/assets/countryside_cat.webp',
    '/assets/island_cat.webp',
    '/assets/lake_cat.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="slide"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${images[currentImageIndex]}')`
      }}
    >
      <h1>
        Welcome Home! Anywhere you roam <br /> Stay in the moment. Make your
        memories
      </h1>
    </div>
  );
};

export default Slide;