interface LoadingStateProps {
  count?: number;
}

export function LoadingState({ count = 6 }: LoadingStateProps) {
  return (
    <>
      {/* Loading Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-primary rounded-full dot-pulse"></div>
          <div className="w-2 h-2 bg-primary rounded-full dot-pulse"></div>
          <div className="w-2 h-2 bg-primary rounded-full dot-pulse"></div>
        </div>
        <span className="text-sm text-muted font-medium">Loading credentials...</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="glass-morphism rounded-2xl overflow-hidden h-[440px]"
          >
            {/* Header Skeleton */}
            <div className="p-5 pb-4 border-b border-border">
              <div className="flex justify-between items-start mb-3">
                <div className="w-11 h-11 rounded-xl bg-surfaceHighlight" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surfaceHighlight" />
                  <div className="w-8 h-8 rounded-lg bg-surfaceHighlight" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-surfaceHighlight rounded w-3/4" />
                <div className="h-3 bg-surfaceHighlight rounded w-1/2" />
              </div>
            </div>

            {/* Body Skeleton */}
            <div className="p-5 pt-4 space-y-3">
              <div className="h-10 bg-surfaceHighlight rounded-lg" />
              <div className="h-10 bg-surfaceHighlight rounded-lg" />
              <div className="h-10 bg-surfaceHighlight rounded-lg" />
            </div>

            {/* Footer Skeleton */}
            <div className="px-5 pb-4 mt-auto flex items-center justify-between border-t border-border pt-3">
              <div className="h-3 bg-surfaceHighlight rounded w-20" />
              <div className="h-8 bg-surfaceHighlight rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
