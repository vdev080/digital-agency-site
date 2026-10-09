export type Homepage = {
  banner: { heading: string; description: string; statistics: { value: string; label: string; sortOrder: number }[] };
  bannerInfo: { topList: { text: string; sortOrder: number }[]; founder: { name: string; title: string; imageUrl: string }; heading: string; services: { title: string; iconUrl: string; sortOrder: number }[] };
  work: { imageUrl: string; title: string; url: string; sortOrder: number }[];
};

export const homepageFallback: Homepage = {
  banner: { heading: "Bigger,\nBolder and Better", description: "We help business elevate their value through custom software development, product design, QA and consulting services.", statistics: [{ value: "95%", label: "Client Satisfaction", sortOrder: 0 }, { value: "125+", label: "Projects Completed", sortOrder: 1 }] },
  bannerInfo: { topList: [{ text: "Top-notch Experience", sortOrder: 0 }, { text: "Expert Team", sortOrder: 1 }, { text: "Timely Delivery", sortOrder: 2 }], founder: { name: "", title: "Founder & CEO", imageUrl: "/images/founder.png" }, heading: "We are a team of passionate designers and developers who create amazing digital experiences.", services: [{ title: "Custom Software Development", iconUrl: "/images/feature-services-icon-1.png", sortOrder: 0 }, { title: "Product Design", iconUrl: "/images/feature-services-icon-2.png", sortOrder: 1 }, { title: "Quality Assurance", iconUrl: "/images/feature-services-icon-3.png", sortOrder: 2 }, { title: "Consulting Services", iconUrl: "/images/feature-services-icon-4.png", sortOrder: 3 }] },
  work: [{ imageUrl: "/images/work-slider-img-1.webp", title: "", url: "", sortOrder: 0 }],
};

export async function getHomepage(): Promise<Homepage> {
  try {
    const response = await fetch(`${apiUrl}/api/homepage`, { cache: "no-store" });
    if (!response.ok) return homepageFallback;
    const payload = await response.json();
    return payload?.data?.homepage ?? homepageFallback;
  } catch { return homepageFallback; }
}
import { apiUrl } from "@/lib/api";
