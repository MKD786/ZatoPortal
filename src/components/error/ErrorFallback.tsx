"use client"

import { Button } from "antd"
import type { FallbackProps } from "react-error-boundary"
// import Logo from "../../components/ui/Logo"
import ZatoLogo from "../../assets/Zato Logo Blue Tilt.png"
import ZatoLogoDark from "../../assets/Zato Logo Blue Tilt.png"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { theme } = useSelector((state: RootState) => state.theme)
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <img src={theme === "dark" ? ZatoLogoDark : ZatoLogo} alt="Zato Logo" width="10%" height="10%" />
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-red-500 mb-4">We'll be back soon.</p>
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-left overflow-auto max-w-full mb-4">
          {error.message}
        </pre>
      )}
      <Button type="primary" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  )
}

export default ErrorFallback
