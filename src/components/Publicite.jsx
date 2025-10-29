import React, { useState, useEffect } from "react";
import promo1 from "../assets/promo1.png";
import promo2 from "../assets/promo2.png";

const Promo = () => {
  const images = [promo1, promo2];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slider automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Navigation manuelle
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-100 rounded-2xl shadow-lg">
      {/* Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`promo-${index}`}
            className="w-full flex-shrink-0 object-cover h-[400px] md:h-[500px]"
          />
        ))}
      </div>

      {/* Boutons navigation */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
      >
        ❮
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
      >
        ❯
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Promo;
