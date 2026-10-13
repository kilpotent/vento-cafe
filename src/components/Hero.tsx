import type { CSSProperties } from "react";
import { emblem } from "../assets/images/optimized/manifest.ts";
import { MAPS, SITE } from "../data/site.ts";
import { useLanguage } from "../i18n/context.ts";
import { NavigationIcon, PhoneIcon } from "./Icons.tsx";
import Logo from "./Logo.tsx";
import Photo from "./Photo.tsx";
import StatusPill from "./StatusPill.tsx";
import "./Hero.css";

const delay = (step: number) => ({ "--reveal-delay": step }) as CSSProperties;

export default function Hero() {
  const { t } = useLanguage();
  const landline = SITE.phones[0];

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow eyebrow--light" data-reveal>
            {t.hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="hero__logo"
            data-reveal
            style={delay(1)}
          >
            <Logo
              tone="white"
              alt={t.hero.logoAlt}
              sizes="(min-width: 960px) 440px, 78vw"
              priority
            />
          </h1>
          <p className="hero__lead" data-reveal style={delay(2)}>
            {t.hero.lead}
          </p>
          <p className="hero__sub" data-reveal style={delay(3)}>
            {t.hero.sub}
          </p>
          <div className="hero__status" data-reveal style={delay(4)}>
            <StatusPill />
          </div>
          <div className="hero__actions" data-reveal style={delay(5)}>
            <a className="btn btn--gold" href={`tel:${landline.tel}`}>
              <PhoneIcon />
              {t.hero.call}
            </a>
            <a
              className="btn btn--ghost"
              href={MAPS.directions}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NavigationIcon />
              {t.hero.directions}
              <span className="sr-only">{t.a11y.newTab}</span>
            </a>
          </div>
        </div>

        <div className="hero__visual" data-reveal style={delay(2)}>
          <Sunburst />
          <div className="hero__arch hero__arch--main arch-frame">
            <div className="arch">
              <Photo
                name="coffee-bar"
                alt={t.hero.mainPhotoAlt}
                sizes="(min-width: 960px) 350px, 62vw"
                priority
              />
            </div>
          </div>
          <div className="hero__arch hero__arch--accent">
            <div className="arch">
              <Photo
                name="drinks"
                alt={t.hero.accentPhotoAlt}
                sizes="(min-width: 960px) 220px, 40vw"
                position="38% 50%"
              />
            </div>
          </div>
          <Badge text={t.hero.badge} />
        </div>
      </div>

      <a className="hero__scroll" href="#story">
        <span>{t.hero.scroll}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}

/** Art-deco sun rays rising behind the arches, after the logo's fan. */
function Sunburst() {
  const rays = Array.from(
    { length: 17 },
    (_, i) => ((10 + i * 10) * Math.PI) / 180,
  );
  return (
    <svg
      className="hero__rays"
      viewBox="0 0 1200 600"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {rays.map((angle) => (
          <line
            key={angle}
            x1="600"
            y1="600"
            x2={(600 - Math.cos(angle) * 900).toFixed(1)}
            y2={(600 - Math.sin(angle) * 900).toFixed(1)}
          />
        ))}
        <path d="M300 600a300 300 0 0 1 600 0" />
        <path d="M120 600a480 480 0 0 1 960 0" />
      </g>
    </svg>
  );
}

/** Rotating "In Coffee We Trust" seal with the fan emblem at its centre. */
function Badge({ text }: { text: string }) {
  return (
    <div className="badge" aria-hidden="true">
      <svg className="badge__ring" viewBox="0 0 200 200" focusable="false">
        <defs>
          <path
            id="badge-circle"
            d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"
          />
        </defs>
        <text>
          <textPath
            href="#badge-circle"
            textLength="488"
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
      </svg>
      <img
        className="badge__emblem"
        src={emblem.src}
        width={emblem.width}
        height={emblem.height}
        alt=""
      />
    </div>
  );
}
