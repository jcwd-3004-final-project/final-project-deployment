import React, { useState, useEffect } from 'react';

function HeroSection() {
  const images = [
    {
      src: 'https://imageio.forbes.com/specials-images/imageserve/1183012322/Grocery-store/960x0.jpg?format=jpg&width=960',
      alt: 'Grocery Store',
    },
    {
      src: 'https://static.blog.bolt.eu/LIVE/wp-content/uploads/2022/04/30135418/grocery-list-1024x536.jpg',
      alt: 'Grocery List',
    },
    {
      src: 'https://media.self.com/photos/599c997a774b667d3bbe1214/4:3/w_2560%2Cc_limit/groceries-family-month.jpg',
      alt: 'Family Groceries',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Images */}
      <div className="absolute inset-0">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Don't miss our daily amazing deals
        </h1>
        <p className="text-xl md:text-2xl text-white mb-6">
          Save up to <span className="font-bold">60%</span>
        </p>
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full md:w-auto px-4 py-2 text-black rounded-md md:rounded-l-md md:rounded-r-none outline-none"
          />
          <button className="w-full md:w-auto px-6 py-2 bg-green-500 text-white font-medium rounded-md md:rounded-r-md md:rounded-l-none hover:bg-green-600 transition duration-300">
            Subscribe
          </button>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
      >
        &#10094;
      </button>
      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
      >
        &#10095;
      </button>
    </div>
  );
}

export default HeroSection;