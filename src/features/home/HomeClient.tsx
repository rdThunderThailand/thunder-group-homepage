"use client";

// Home page shell. Every section's copy is resolved on the server in
// `src/app/[locale]/page.tsx` and passed in as props — this tree never calls
// `useTranslations`. Copy in `messages/{th,en}/home.json` is a first-pass draft
// from the design screenshots. Section artwork is imported from
// `src/image/home/<section>/` (the "Talk to Thunder" banner is still a
// placeholder — no image supplied yet).

import { HeroSection } from "./components/HeroSection";
import { StartHereSection } from "./components/StartHereSection";
import { WhatWeBuildSection } from "./components/WhatWeBuildSection";
import { OurWorkSection } from "./components/OurWorkSection";
import { WhyThunderSection } from "./components/WhyThunderSection";
import { TalkToThunderSection } from "@/components/marketing/TalkToThunderSection";
import type {
  HeroContent,
  OurWorkContent,
  StartHereContent,
  TalkToThunderContent,
  WhatWeBuildContent,
  WhyThunderContent,
} from "./types";

type HomeClientProps = {
  hero: HeroContent;
  startHere: StartHereContent;
  whatWeBuild: WhatWeBuildContent;
  ourWork: OurWorkContent;
  whyThunder: WhyThunderContent;
  talkToThunder: TalkToThunderContent;
};

export function HomeClient({
  hero,
  startHere,
  whatWeBuild,
  ourWork,
  whyThunder,
  talkToThunder,
}: HomeClientProps) {
  return (
    <>
      <HeroSection content={hero} />
      <StartHereSection content={startHere} />
      <WhatWeBuildSection content={whatWeBuild} />
      <OurWorkSection content={ourWork} />
      <WhyThunderSection content={whyThunder} />
      <TalkToThunderSection content={talkToThunder} />
    </>
  );
}
