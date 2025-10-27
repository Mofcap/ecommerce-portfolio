import Slider from "react-slick";


const ProductImageSlider = ({ images = [] }) => {
  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
        <span className="text-gray-500">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="max-h-40 w-auto object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductImageSlider;