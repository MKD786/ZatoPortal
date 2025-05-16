"use client"

import React from "react"

import { Suspense, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ConfigProvider } from "antd"
import { ErrorBoundary } from "react-error-boundary"
import type { RootState } from "./store"
import { checkTokenExpiry } from "./features/auth/auth.slice"
import { lightTheme, darkTheme } from "./styles/theme"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import MainLayout from "./components/layout/MainLayout"
import ErrorFallback from "./components/error/ErrorFallback"
import LoadingScreen from "./components/ui/LoadingScreen"
import NotFoundPage from "./components/error/NotFoundPage"
import ClientLogin from "./features/auth/ClientLogin"
import JobsManagement from "./features/Jobs/JobsManagement"
import { AnyAction } from "@reduxjs/toolkit"

// Lazy loaded routes
const Login = React.lazy(() => import("./features/auth/Login"))
// const Dashboard = React.lazy(() => import("./features/dashboard/Dashboard"))
const ClientDashboard = React.lazy(() => import("./features/client_overview/ClientDashboard"))
const ClientManagement = React.lazy(() => import("./features/clients/ClientManagement"))
const ViewClients = React.lazy(() => import("./features/clients/ViewClients"))
const Questionnaires = React.lazy(() => import("./features/questionnaires/Questionnaires"))
const Reminders = React.lazy(() => import("./features/reminders/Reminders"))
const ReminderHistory = React.lazy(() => import("./features/reminders/ReminderHistory"))
const Support = React.lazy(() => import("./features/support/Support"))
const Profile = React.lazy(() => import("./features/profile/Profile"))
const Assignments = React.lazy(() => import("./features/assignments/Assignment"))
const ClientView = React.lazy(() => import("./features/client_overview/ClientView"))
const OtpVerification = React.lazy(() => import("./features/auth/OtpVerification"))
const AddRule = React.lazy(() => import("./features/add_rule/AddRule"))
const QueryBuilder = React.lazy(() => import("./features/query_builder/QueryBuilder"))
function App() {
  const { theme } = useSelector((state: RootState) => state.theme)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  // Check token expiry on app load and when routes change
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkTokenExpiry(undefined) as unknown as AnyAction)
    }
  }, [dispatch, isAuthenticated])

  return (
    <ConfigProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/client-login" element={<ClientLogin />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<ClientDashboard />} />
                <Route path="/clients" element={<ClientManagement />} />
                <Route path="/view-clients" element={<ViewClients />} />
                <Route path="/questionnaires" element={<Questionnaires />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/reminder-history" element={<ReminderHistory />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/jobs" element={<JobsManagement />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/client-view" element={<ClientView />} />
                <Route path="/add-rule" element={<AddRule />} />
                <Route path="/rules-builder" element={<QueryBuilder />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/questionnaires" replace />} />
            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
            {/* <Route path="/" element={<Navigate to="/settings" replace />} /> */}

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </ConfigProvider>
  )
}

export default App
