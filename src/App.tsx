import { useEffect, useRef, useState } from "react";
import { StoryNavigation } from "./components/StoryNavigation.tsx";
import { StoryScene } from "./components/StoryScene.tsx";
import { progressTotal, story } from "./content/story.ts";

const LEAVE_MS = 220;
const ENTER_MS = 380;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduce;
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress" aria-hidden="true">
      {Array.from({ length: total }, (_, step) => (
        <span
          key={step}
          className={
            step === current ? "is-current" : step < current ? "is-done" : undefined
          }
        />
      ))}
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const lockRef = useRef(false);
  const timers = useRef<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const scene = story[index];

  useEffect(() => {
    const bucket = timers;
    return () => {
      bucket.current.forEach((id) => window.clearTimeout(id));
      bucket.current.length = 0;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.length = 0;
  }

  function releaseLock() {
    lockRef.current = false;
    setLocked(false);
  }

  function go(next: number) {
    if (lockRef.current) return;
    if (next < 0 || next >= story.length) return;

    clearTimers();
    lockRef.current = true;
    setLocked(true);

    if (reduceMotion) {
      setIndex(next);
      const unlockTimer = window.setTimeout(releaseLock, ENTER_MS);
      timers.current.push(unlockTimer);
      return;
    }

    setLeaving(true);
    const leaveTimer = window.setTimeout(() => {
      setIndex(next);
      setLeaving(false);
      const enterTimer = window.setTimeout(releaseLock, ENTER_MS);
      timers.current.push(enterTimer);
    }, LEAVE_MS);
    timers.current.push(leaveTimer);
  }

  if (!scene) return null;

  const showProgress = index < progressTotal;
  const pink = scene.kind === "transition" || scene.kind === "closing";
  const nextLabel = scene.kind === "closing" ? undefined : scene.nextLabel;

  return (
    <div className={pink ? "shell is-pink" : "shell"}>
      {showProgress ? <Progress current={index} total={progressTotal} /> : null}
      <main className="stage">
        <div className={leaving ? "scene is-leaving" : "scene"}>
          <StoryScene
            key={scene.id}
            scene={scene}
            headingRef={headingRef}
            reduceMotion={reduceMotion}
            progressLabel={
              showProgress ? `Bagian ${index + 1} dari ${progressTotal}` : undefined
            }
          />
          <StoryNavigation
            nextLabel={nextLabel}
            showBack={scene.kind === "story"}
            locked={locked}
            onNext={() => go(index + 1)}
            onBack={() => go(index - 1)}
          />
        </div>
      </main>
    </div>
  );
}
