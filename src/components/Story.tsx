import { HOURS, SITE } from "../data/site.ts";
import { useYear } from "../hooks/useNow.ts";
import { useLanguage } from "../i18n/context.ts";
import {
  DAY_INDEXES,
  formatDays,
  formatInterval,
  formatTime,
  openDays,
} from "../lib/hours.ts";
import Photo from "./Photo.tsx";
import "./Story.css";

export default function Story() {
  const { t } = useLanguage();
  const year = useYear();

  const cafeDays = openDays(HOURS.cafe);
  const earliest = Math.min(...cafeDays.map((day) => HOURS.cafe[day]!.open));
  const earliestDays = DAY_INDEXES.filter(
    (day) => HOURS.cafe[day]?.open === earliest,
  );
  const delivery = HOURS.delivery.find((interval) => interval !== null);

  const stats = [
    {
      key: "years",
      value: String(year - SITE.foundedYear),
      label: t.story.stats.years,
    },
    {
      key: "days",
      value: `${cafeDays.length}/7`,
      label: t.story.stats.daysOpen(cafeDays.length),
    },
    {
      key: "first",
      value: formatTime(earliest),
      label: t.story.stats.firstCoffee(formatDays(earliestDays, t.daysShort)),
    },
    ...(delivery
      ? [
          {
            key: "delivery",
            value: formatInterval(delivery),
            label: t.story.stats.delivery,
          },
        ]
      : []),
  ];

  return (
    <section
      id="story"
      className="section section--cream story"
      aria-labelledby="story-title"
      tabIndex={-1}
    >
      <div className="container story__grid">
        <div className="story__visual" data-reveal>
          <span className="story__year" aria-hidden="true">
            {SITE.foundedYear}
          </span>
          <div className="story__arch arch-frame">
            <div className="arch">
              <Photo
                name="pergola-night"
                alt={t.story.photoAlt}
                sizes="(min-width: 960px) 400px, 70vw"
                position="61% 50%"
              />
            </div>
          </div>
          <div className="story__inset">
            <Photo
              name="night-exterior"
              alt={t.story.insetAlt}
              sizes="(min-width: 960px) 280px, 46vw"
              position="50% 86%"
            />
          </div>
        </div>

        <div className="story__content">
          <p className="eyebrow" data-reveal>
            {t.story.eyebrow}
          </p>
          <h2 id="story-title" className="display" data-reveal>
            {t.story.title}
          </h2>
          <div className="story__body" data-reveal>
            {t.story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="stats" data-reveal>
            {stats.map((stat) => (
              <div key={stat.key} className="stats__item">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
