// 10 · INTERACTIVE IN ACTION — "See It in the Real World."
// Light section. Header with a top-right "view all projects" link above a
// six-card row; each card is a `Link` to `/projects` with a placeholder image,
// a (placeholder) project name and a tag line. Scrolls horizontally on small
// screens, settles into a grid from `lg`.

import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import { Placeholder } from "./Placeholder";
import interactiveWayfinding from "@/image/interactive-kiosk/projects/interactive-wayfinding.png";
import visitorRegistration from "@/image/interactive-kiosk/projects/visitor-registration.png";
import retailExperience from "@/image/interactive-kiosk/projects/retail-experience.png";
import publicInformation from "@/image/interactive-kiosk/projects/public-information.png";
import campusDirectory from "@/image/interactive-kiosk/projects/campus-directory.png";
import tourismInformation from "@/image/interactive-kiosk/projects/tourism-information.png";

const PROJECT_IMAGES = [interactiveWayfinding, visitorRegistration, retailExperience, publicInformation, campusDirectory, tourismInformation];
import type { KioskInActionContent } from "../../types/interactivekioskTypes";

type InActionSectionProps = {
  content: KioskInActionContent;
};

export function InActionSection({ content }: InActionSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "#/projects" }}
        />

        <div className="mt-12 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
          {content.projects.map((project, index) => (
            <Link
              key={project.name}
              href="#/projects"
              className="group w-44 shrink-0 snap-start sm:w-auto"
            >
              <Placeholder src={PROJECT_IMAGES[index]} alt={project.name} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 176px" className="aspect-[4/3] w-full transition-colors group-hover:border-brand" />
              <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                {project.name}
              </h3>
              <p className="mt-1 text-[0.7rem] text-slate-500">{project.tag}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
