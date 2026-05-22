const Loader = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-[3px] border-primary-200"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-1 w-10 h-10 rounded-full border-[3px] border-transparent border-b-secondary opacity-60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-24">
      {content}
    </div>
  );
};

export default Loader;
