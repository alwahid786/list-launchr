"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    content: "We booked 12 new HVAC clients from just one campaign.",
    author: "Mike",
    role: "ServicePro Heating",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    content: "Our list went from 120 to 800 in two weeks — now we actually use email!",
    author: "Sarah",
    role: "Local Boutique Owner",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
  },
  {
    id: 3,
    content: "Revenue doubled after implementing their strategy.",
    author: "John",
    role: "Cafe Owner",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 4,
    content: "Our ads started converting within days, amazing ROI.",
    author: "Emma",
    role: "Salon Owner",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: 5,
    content: "We went from struggling to fully booked weeks in advance.",
    author: "David",
    role: "Gym Owner",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    id: 6,
    content: "Finally marketing that actually brings in customers!",
    author: "Sophia",
    role: "Bakery Owner",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
  },
  {
    id: 7,
    content: "The campaign brought in more calls than we could handle.",
    author: "Chris",
    role: "Plumber",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 8,
    content: "Now we’re hiring new staff just to keep up with demand.",
    author: "Olivia",
    role: "Restaurant Owner",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
  },
];

const TestimonialsCarousel = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="py-[40px] sm:py-[60px]">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
            <div className="h-2 w-2 rounded-full bg-purple-600 mr-2"></div>
            <span className="text-purple-600 text-sm font-medium">
              Success Stories
            </span>
          </div>
          <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-neutral">
            What Local Business Owners{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
              Say
            </span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1300: { slidesPerView: 3 },
            1600: { slidesPerView: 4 },
          }}
          className="pb-14"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="flex">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col w-full h-full transition-all duration-500 group-hover:shadow-md group-hover:border-purple-200">
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xl text-neutral-700 font-medium leading-relaxed mb-6">
                    "{t.content}"
                  </p>
                </div>
                <div className="mt-auto flex items-center">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-neutral text-lg flex items-center gap-2">
                      {t.author}
                      <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">
                        ✔ Verified Customer
                      </span>
                    </h4>
                    <p className="text-sm text-neutral-600">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

       

        {/* Pagination */}
        <div className="custom-pagination flex justify-center mt-6"></div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
