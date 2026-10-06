import Image from "next/image";

const slides = [1, 2, 3, 4, 5, 6];

export default function WorkCarousel() {
  return (
    <div className="work-slider" aria-label="Selected work">
      <div className="work-track">
        {slides.map((slide) => (
          <div className="slide-item" key={slide}>
            <Image
              src="/images/work-slider-img-1.webp"
              alt="Featured project"
              width={1200}
              height={675}
              sizes="(max-width: 767px) 88vw, 1200px"
              priority={slide === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
