import { useEffect, useState } from "react";
import type { Ref } from "react";
import type { Scene, SceneImage } from "../content/story.ts";
import {
  ChatMotif,
  CoffeeTicketMotif,
  DayMotif,
  RouteMotif,
} from "./Motifs.tsx";

type StorySceneProps = {
  scene: Scene;
  headingRef: Ref<HTMLHeadingElement>;
  reduceMotion: boolean;
  progressLabel?: string;
};

function OptionalPhoto({ image }: { image?: SceneImage }) {
  const [failed, setFailed] = useState(false);
  if (!image || failed) return null;

  return (
    <figure className="photo">
      <img src={image.src} alt={image.alt} onError={() => setFailed(true)} />
    </figure>
  );
}

function ClosingCue({
  text,
  reduceMotion,
}: {
  text: string;
  reduceMotion: boolean;
}) {
  const [announced, setAnnounced] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setTimeout(() => setAnnounced(true), 2200);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  return (
    <>
      <p className={reduceMotion ? "cue is-visible" : "cue"} aria-hidden="true">
        {text}
      </p>
      <p className="sr-only" aria-live="polite">
        {announced ? text : ""}
      </p>
    </>
  );
}

function StoryMotif({
  motif,
}: {
  motif: "none" | "chat" | "coffee" | "day" | "route";
}) {
  if (motif === "chat") return <ChatMotif />;
  if (motif === "coffee") return <CoffeeTicketMotif />;
  if (motif === "day") return <DayMotif />;
  return null;
}

export function StoryScene({
  scene,
  headingRef,
  reduceMotion,
  progressLabel,
}: StorySceneProps) {
  if (scene.kind === "opener") {
    return (
      <article className="scene-opener">
        {progressLabel ? <p className="sr-only">{progressLabel}</p> : null}
        <h1 ref={headingRef} tabIndex={-1}>
          <span>{scene.lines[0]}</span>
          <span>{scene.lines[1]}</span>
        </h1>
        <OptionalPhoto image={scene.image} />
        <p className="support">{scene.support}</p>
      </article>
    );
  }

  if (scene.kind === "transition") {
    return (
      <article className="scene-transition">
        <h1 ref={headingRef} tabIndex={-1}>
          {scene.line}
        </h1>
      </article>
    );
  }

  if (scene.kind === "closing") {
    return (
      <article className="scene-closing">
        <h1 ref={headingRef} tabIndex={-1} className="closing-title">
          <span className="closing-name">{scene.name}</span>
          <span className="closing-ask">{scene.ask}</span>
        </h1>
        <ClosingCue text={scene.cue} reduceMotion={reduceMotion} />
      </article>
    );
  }

  return (
    <article className="scene-story">
      {progressLabel ? <p className="sr-only">{progressLabel}</p> : null}
      <p className="kicker">
        <span className="moment">{scene.moment}</span>
        <span className="label">{scene.label}</span>
      </p>
      <h1 ref={headingRef} tabIndex={-1}>
        {scene.title}
      </h1>
      <OptionalPhoto image={scene.image} />
      <StoryMotif motif={scene.motif} />
      <div className="copy">
        {scene.paragraphs?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {scene.parts?.map((part) => (
          <section key={part.label} className="part">
            <h2>{part.label}</h2>
            {part.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        {scene.note ? <p className="note">{scene.note}</p> : null}
        {scene.route ? (
          <div className="route-block">
            <RouteMotif />
            <p className="route">{scene.route}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
