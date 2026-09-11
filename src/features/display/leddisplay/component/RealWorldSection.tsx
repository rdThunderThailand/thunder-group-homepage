// 6 · LED IN THE REAL WORLD — "Built Around What the Space Needs to Do."
// Light section. Header with a top-right "see all use cases" link above a
// six-up row of placeholder image + caption tiles (scrolls horizontally on
// small screens, settles into a grid from `lg`).

import { SectionHeader } from "./SectionHeader";
import { Placeholder } from "./Placeholder";
import retailCustomerExperience from "@/image/led-display/use-cases/retail-customer-experience.png";
import corporateWorkplace from "@/image/led-display/use-cases/corporate-workplace.png";
import controlRoom from "@/image/led-display/use-cases/control-room.png";
import eventsEntertainment from "@/image/led-display/use-cases/events-entertainment.png";
import publicSpaceTransit from "@/image/led-display/use-cases/public-space-transit.png";
import architectureProperty from "@/image/led-display/use-cases/architecture-property.png";

const USE_CASE_IMAGES = [retailCustomerExperience, corporateWorkplace, controlRoom, eventsEntertainment, publicSpaceTransit, architectureProperty];
import type { LedRealWorldContent } from "../../types/leddisplayTypes";

type RealWorldSectionProps = {
  content: LedRealWorldContent;
};

export function RealWorldSection({ content }: RealWorldSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "/projects" }}
        />

        <div className="mt-12 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
          {content.items.map((item, index) => (
            <div
              key={item.label}
              className="w-40 shrink-0 snap-start sm:w-auto"
            >
              <Placeholder src={USE_CASE_IMAGES[index]} alt={item.label} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 160px" className="aspect-[4/3] w-full" />
              <p className="mt-2.5 text-xs font-semibold leading-tight text-neutral-800">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
