import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ progress = 0, message = "Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-slate-600">
            {progress > 0 ? `${progress}%` : ""}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-700 font-medium">{message}</p>
        {progress > 0 && (
          <div className="mt-2 w-64 bg-slate-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
