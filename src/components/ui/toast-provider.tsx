
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const VIEWPORT_PADDING = 25;

export function ToastWrapper() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg transition-all",
              {
                "bg-white border-green-100 text-green-600 dark:bg-green-950 dark:border-green-900 dark:text-green-400": variant === "success",
                "bg-white border-red-100 text-red-600 dark:bg-red-950 dark:border-red-900 dark:text-red-400": variant === "error",
                "bg-white border-blue-100 text-blue-600 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400": variant === "info"
              }
            )}
          >
            <div className="flex items-center gap-3">
              {variant === "success" && <CheckCircle className="h-5 w-5" />}
              {variant === "error" && <XCircle className="h-5 w-5" />}
              {variant === "info" && <Info className="h-5 w-5" />}
              {!variant && <AlertCircle className="h-5 w-5" />}
              
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm opacity-90">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-0 z-[200] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  );
}
