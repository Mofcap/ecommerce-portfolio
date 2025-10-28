import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ou tout autre icône que tu veux

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-blue-500 text-white p-2 rounded-full z-10 transition-colors"
  >
    <ChevronRight size={20} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-blue-500 text-white p-2 rounded-full z-10 transition-colors"
  >
    <ChevronLeft size={20} />
  </button>
);

const ProductImageSlider = ({ images = [] }) => {
  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
        <span className="text-gray-500">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="relative mb-3">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="w-full h-40 object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductImageSlider;
