interface ProgressBarProps {
  progress: number | string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
}) => {
  // 문자열이나 숫자를 처리하여 퍼센트 문자열로 변환
  const progressString =
    typeof progress === "number" ? `${(progress * 100).toFixed(0)}%` : progress;

  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-[13px] px-2.5 py-[2px]">
      <div className="flex-1">
        <div className="progress bg-slate-100 flex justify-start rounded-full items-center relative px-1 h-1 w-full">
          <div
            className="progress-value shadow-md rounded-full bg-black h-1"
            style={{
              width: progressString,
              transition: "width 1.5s ease-in-out",
            }}
          />
        </div>
      </div>
      {showPercentage && (
        <span className="text-slate-900 text-xs font-semibold">
          {progressString}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
