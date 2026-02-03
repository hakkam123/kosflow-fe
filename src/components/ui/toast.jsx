import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// Toast Context
const ToastContext = createContext(null)

// Toast variants configuration
const toastVariants = {
    default: {
        container: "bg-card text-card-foreground border",
        icon: null,
    },
    success: {
        container: "bg-green-50 text-green-900 border-green-200",
        icon: CheckCircle,
        iconClass: "text-green-600",
    },
    error: {
        container: "bg-red-50 text-red-900 border-red-200",
        icon: AlertCircle,
        iconClass: "text-red-600",
    },
    warning: {
        container: "bg-amber-50 text-amber-900 border-amber-200",
        icon: AlertTriangle,
        iconClass: "text-amber-600",
    },
    info: {
        container: "bg-blue-50 text-blue-900 border-blue-200",
        icon: Info,
        iconClass: "text-blue-600",
    },
}

// Single Toast Component
function Toast({ id, title, description, variant = "default", onDismiss }) {
    const [isExiting, setIsExiting] = React.useState(false)
    const variantConfig = toastVariants[variant] || toastVariants.default
    const IconComponent = variantConfig.icon

    const handleDismiss = useCallback(() => {
        setIsExiting(true)
        setTimeout(() => onDismiss(id), 200)
    }, [id, onDismiss])

    // Auto dismiss after 5 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            handleDismiss()
        }, 5000)
        return () => clearTimeout(timer)
    }, [handleDismiss])

    return (
        <div
            className={cn(
                "pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg",
                "transition-all duration-300 ease-out",
                isExiting
                    ? "animate-out fade-out-0 slide-out-to-right-full"
                    : "animate-in fade-in-0 slide-in-from-right-full",
                variantConfig.container
            )}
        >
            {IconComponent && (
                <IconComponent className={cn("h-5 w-5 shrink-0", variantConfig.iconClass)} />
            )}
            <div className="flex-1 space-y-1">
                {title && <p className="text-sm font-semibold">{title}</p>}
                {description && (
                    <p className="text-sm opacity-90">{description}</p>
                )}
            </div>
            <button
                onClick={handleDismiss}
                className="shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

// Toast Container Component
function ToastContainer({ toasts, onDismiss }) {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
            ))}
        </div>
    )
}

// Toast Provider Component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((toast) => {
        const id = Date.now().toString()
        setToasts((prev) => [...prev, { id, ...toast }])
        return id
    }, [])

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const toast = useCallback(
        (options) => {
            if (typeof options === "string") {
                return addToast({ description: options })
            }
            return addToast(options)
        },
        [addToast]
    )

    // Convenience methods
    toast.success = (options) =>
        addToast(typeof options === "string" ? { description: options, variant: "success" } : { ...options, variant: "success" })
    toast.error = (options) =>
        addToast(typeof options === "string" ? { description: options, variant: "error" } : { ...options, variant: "error" })
    toast.warning = (options) =>
        addToast(typeof options === "string" ? { description: options, variant: "warning" } : { ...options, variant: "warning" })
    toast.info = (options) =>
        addToast(typeof options === "string" ? { description: options, variant: "info" } : { ...options, variant: "info" })

    return (
        <ToastContext.Provider value={{ toast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    )
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

export { Toast, ToastContainer }
