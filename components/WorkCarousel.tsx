type WorkItem = { imageUrl: string; title: string; url: string };

export default function WorkCarousel({ work }: { work: WorkItem[] }) {
  const source = work.length ? work : [{ imageUrl: "/images/work-slider-img-1.webp", title: "Featured project", url: "" }];
  const slides = Array.from({ length: Math.max(6, source.length * 2) }, (_, index) => source[index % source.length]);
  return (
    <div className="work-slider" aria-label="Selected work">
      <div className="work-track">
        {slides.map((slide, index) => <div className="slide-item" key={`${slide.imageUrl}-${index}`}><img src={slide.imageUrl} alt={slide.title || "Featured project"} /></div>)}
      </div>
    </div>
  );
}
