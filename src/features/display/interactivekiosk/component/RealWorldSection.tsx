// 6 · INTERACTIVE IN THE REAL WORLD — "Built Around What People Need to Do."
// Light section. Header with a top-right "view all use cases" link above a
// six-up row of placeholder image + caption tiles (scrolls horizontally on
// small screens, settles into a grid from `lg`).

import { SectionHeader } from "./SectionHeader";
import { Placeholder } from "./Placeholder";
import retailCustomerExperience from "@/image/interactive-kiosk/use-cases/retail-customer-experience.png";
import officeWorkplace from "@/image/interactive-kiosk/use-cases/office-workplace.png";
import venueExhibition from "@/image/interactive-kiosk/use-cases/venue-exhibition.png";
import publicService from "@/image/interactive-kiosk/use-cases/public-service.png";
import transportationLargePlaces from "@/image/interactive-kiosk/use-cases/transportation-large-places.png";
import tourismVisitorExperience from "@/image/interactive-kiosk/use-cases/tourism-visitor-experience.png";

const USE_CASE_IMAGES = [retailCustomerExperience, officeWorkplace, venueExhibition, publicService, transportationLargePlaces, tourismVisitorExperience];
import type { KioskRealWorldContent } from "../../types/interactivekioskTypes";

type RealWorldSectionProps = {
  content: KioskRealWorldContent;
};

export function RealWorldSection({ content }: RealWorldSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "#/projects" }}
        />

        <div className="mt-12 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
          {content.items.map((item, index) => (
            <div key={item.label} className="w-40 shrink-0 snap-start sm:w-auto">
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
