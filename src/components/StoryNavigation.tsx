type StoryNavigationProps = {
  nextLabel?: string;
  showBack: boolean;
  locked: boolean;
  onNext: () => void;
  onBack: () => void;
};

export function StoryNavigation({
  nextLabel,
  showBack,
  locked,
  onNext,
  onBack,
}: StoryNavigationProps) {
  if (!nextLabel && !showBack) return null;

  return (
    <div className={showBack ? "nav nav-split" : "nav"}>
      {showBack ? (
        <button type="button" className="back" onClick={onBack} disabled={locked}>
          Kembali
        </button>
      ) : null}
      {nextLabel ? (
        <button type="button" className="next" onClick={onNext} disabled={locked}>
          {nextLabel}
        </button>
      ) : null}
    </div>
  );
}
