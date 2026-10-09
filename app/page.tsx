import Image from "next/image";
import Link from "next/link";
import MenuButton from "@/components/MenuButton";
import WorkCarousel from "@/components/WorkCarousel";
import { getHomepage } from "@/lib/homepage";

export default async function Home() {
  const homepage = await getHomepage();
  const headingLines = homepage.banner.heading.split("\n");
  const firstLine = headingLines[0] || "Bigger,";
  const secondLineWords = (headingLines.slice(1).join(" ") || "Bolder and Better").split(" ");
  const emphasizedWord = secondLineWords.pop();
  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="home-link" aria-label="Home" />
          <MenuButton />
        </div>
      </header>

      <section className="banner-section" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero-top">
            <h1 id="hero-heading" className="hero-title">
              {firstLine}<br />{secondLineWords.join(" ")} {emphasizedWord && <span>{emphasizedWord}</span>}
            </h1>
            <div className="hero-copy">
              <p>{homepage.banner.description}</p>
              <a href="#about" className="button button-outline">Learn More</a>
            </div>
          </div>
          <div className="hero-stats">
            <ul>
              {homepage.banner.statistics.sort((a, b) => a.sortOrder - b.sortOrder).map((statistic) => <li key={`${statistic.value}-${statistic.label}`}><strong>{statistic.value}</strong><span>{statistic.label}</span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="about" className="info-section section-padding">
        <div className="container">
          <ul className="qualities">
            {homepage.bannerInfo.topList.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => <li key={item.text}>{item.text}</li>)}
          </ul>
          <div className="intro-row">
            <div className="founder">
              <Image src={homepage.bannerInfo.founder.imageUrl || "/images/founder.png"} alt={homepage.bannerInfo.founder.name || "Founder"} width={100} height={100} unoptimized />
              <span>{homepage.bannerInfo.founder.title}</span>
            </div>
            <div className="intro-copy">
              <h2>{homepage.bannerInfo.heading}</h2>
              <a href="#work" className="button button-blue">Learn More</a>
            </div>
          </div>
          <ul className="service-list">
            {homepage.bannerInfo.services.sort((a, b) => a.sortOrder - b.sortOrder).map((service) => (
              <li key={service.title}>
                <Image src={service.iconUrl} alt="" width={60} height={60} unoptimized />
                <h3>{service.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="work" className="work-section">
        <div className="container">
          <div className="work-heading"><h2>Our Work</h2><a href="#work" className="button button-blue">View All</a></div>
        </div>
        <WorkCarousel work={homepage.work.sort((a, b) => a.sortOrder - b.sortOrder)} />
      </section>
    </main>
  );
}
