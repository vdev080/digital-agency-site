import Image from "next/image";
import Link from "next/link";
import MenuButton from "@/components/MenuButton";
import WorkCarousel from "@/components/WorkCarousel";

const services = [
  ["/images/feature-services-icon-1.png", "Custom Software Development"],
  ["/images/feature-services-icon-2.png", "Product Design"],
  ["/images/feature-services-icon-3.png", "Quality Assurance"],
  ["/images/feature-services-icon-4.png", "Consulting Services"],
] as const;

export default function Home() {
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
              Bigger,<br />Bolder and <span>Better</span>
            </h1>
            <div className="hero-copy">
              <p>We help business elevate their value through custom software development, product design, QA and consulting services.</p>
              <a href="#about" className="button button-outline">Learn More</a>
            </div>
          </div>
          <div className="hero-stats">
            <ul>
              <li><strong>95%</strong><span>Client Satisfaction</span></li>
              <li><strong>125+</strong><span>Projects Completed</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="about" className="info-section section-padding">
        <div className="container">
          <ul className="qualities">
            <li>Top-notch Experience</li><li>Expert Team</li><li>Timely Delivery</li>
          </ul>
          <div className="intro-row">
            <div className="founder">
              <Image src="/images/founder.png" alt="Founder" width={100} height={100} />
              <span>Founder &amp; CEO</span>
            </div>
            <div className="intro-copy">
              <h2>We are a team of passionate designers and developers who create amazing digital experiences.</h2>
              <a href="#work" className="button button-blue">Learn More</a>
            </div>
          </div>
          <ul className="service-list">
            {services.map(([icon, title]) => (
              <li key={title}>
                <Image src={icon} alt="" width={60} height={60} />
                <h3>{title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="work" className="work-section">
        <div className="container">
          <div className="work-heading"><h2>Our Work</h2><a href="#work" className="button button-blue">View All</a></div>
        </div>
        <WorkCarousel />
      </section>
    </main>
  );
}
