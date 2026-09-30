// 11 · LED DISPLAY IN ACTION — "See It in the Real World."
// Light section. Header with a top-right "view all projects" link above a
// four-card row; each card is a `Link` to `/projects` with a placeholder image,
// a (placeholder) project name and a tag line.

import { SectionHeader } from "./SectionHeader";
import { Link } from "@/i18n/navigation";
import { Placeholder } from "./Placeholder";
import indoorLedAction from "@/image/led-display/led-in-action/indoor-led-action.png";
import outdoorLedAction from "@/image/led-display/led-in-action/outdoor-led-action.png";
import controlRoomAction from "@/image/led-display/led-in-action/control-room-action.png";
import eventLedAction from "@/image/led-display/led-in-action/event-led-action.png";

const ACTION_IMAGES = [indoorLedAction, outdoorLedAction, controlRoomAction, eventLedAction];
import type { LedInActionContent } from "../../types/leddisplayTypes";

type InActionSectionProps = {
  content: LedInActionContent;
};

export function InActionSection({ content }: InActionSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "#/projects" }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.projects.map((project, index) => (
            <Link
              key={project.name}
              href="#/projects"
              className="group flex flex-col"
            >
              <Placeholder src={ACTION_IMAGES[index]} alt={project.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full transition-colors group-hover:border-brand" />
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
