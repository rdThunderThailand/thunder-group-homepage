// Server wrapper that reads the shared `Cta` namespace and renders the closing
// `TalkToThunderSection`. Interior route pages drop `<TalkToThunder />` at the
// end of their tree; the Home page renders `TalkToThunderSection` directly so it
// can add its own section number.

import { getTranslations } from "next-intl/server";
import { TalkToThunderSection } from "./TalkToThunderSection";
import type { ContactChannel } from "./types";

export async function TalkToThunder() {
  const t = await getTranslations("Cta");

  return (
    <TalkToThunderSection
      content={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        description: t("description"),
        cta: t("cta"),
        sideNote: t("sideNote"),
        channels: t.raw("channels") as ContactChannel[],
      }}
    />
  );
}
