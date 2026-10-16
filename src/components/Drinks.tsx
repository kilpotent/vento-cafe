import type { CSSProperties } from "react";
import { HOURS } from "../data/site.ts";
import { useLanguage } from "../i18n/context.ts";
import { formatTime, openDays } from "../lib/hours.ts";
import { MoonIcon, SunIcon, SunriseIcon } from "./Icons.tsx";
import Photo from "./Photo.tsx";
import "./Drinks.css";

const MOMENTS = [
  {
    key: "morning",
    photo: "iced-coffee",
    position: "34% 50%",
    Icon: SunriseIcon,
  },
  {
    key: "afternoon",
    photo: "crepes",
    position: "50% 50%",
    Icon: SunIcon,
  },
  {
    key: "evening",
    photo: "white-wine",
    position: "35% 60%",
    Icon: MoonIcon,
  },
] as const;

export default function Drinks() {
  const { t } = useLanguage();

  const days = openDays(HOURS.cafe);
  const earliest = Math.min(...days.map((day) => HOURS.cafe[day]!.open));
  const latest = Math.max(...days.map((day) => HOURS.cafe[day]!.close));
  const times: Record<(typeof MOMENTS)[number]["key"], string | null> = {
    morning: t.drinks.from(formatTime(earliest)),
    afternoon: null,
    evening: t.drinks.until(formatTime(latest)),
  };

  return (
    <section
      id="drinks"
      className="section section--night drinks"
      aria-labelledby="drinks-title"
      tabIndex={-1}
    >
      <div className="container">
        <header className="section-head section-head--center">
          <p className="eyebrow" data-reveal>
            {t.drinks.eyebrow}
          </p>
          <h2 id="drinks-title" className="display" data-reveal>
            {t.drinks.title}
          </h2>
          <p className="section-head__intro" data-reveal>
            {t.drinks.intro}
          </p>
        </header>

        <div className="dayline" aria-hidden="true" data-reveal>
          <span className="dayline__end">
            <SunriseIcon />
            {formatTime(earliest)}
          </span>
          <span className="dayline__track" />
          <span className="dayline__end">
            {formatTime(latest)}
            <MoonIcon />
          </span>
        </div>

        <ol className="moments plain-list">
          {MOMENTS.map(({ key, photo, position, Icon }, index) => {
            const moment = t.drinks.moments[key];
            return (
              <li
                key={key}
                className="moment"
                data-reveal
                style={{ "--reveal-delay": index } as CSSProperties}
              >
                <div className="moment__arch arch">
                  <Photo
                    name={photo}
                    alt={moment.alt}
                    sizes="(min-width: 1100px) 370px, (min-width: 760px) 30vw, 38vw"
                    position={position}
                  />
                </div>
                <div className="moment__body">
                  <p className="moment__time">
                    <Icon />
                    <span>
                      {times[key]
                        ? `${moment.label} · ${times[key]}`
                        : moment.label}
                    </span>
                  </p>
                  <h3 className="moment__title">{moment.title}</h3>
                  <p className="moment__text">{moment.text}</p>
                  <ul className="tags plain-list">
                    {moment.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
