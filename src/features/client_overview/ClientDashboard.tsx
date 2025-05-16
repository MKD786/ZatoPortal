"use client"

import type React from "react"
import type { CSSProperties } from "react"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useLocation } from "react-router-dom"

// Add these type definitions for D3
// type D3PieArcDatum<T> = d3.PieArcDatum<T>

// Define style types
// interface StyleProps {
//   [key: string]: string | number | undefined
// }

// Define types for chart data
interface ChartDataPoint {
  label: string
  value: number
  color: string
}

interface BarChartDataPoint {
  name: string
  value: number
  color: string
}

interface PieChartDataPoint {
  name: string
  value: number
  color: string
}

interface LineChartDataPoint {
  month: string
  value: number
}

interface StackedBarValue {
  label: string
  value: number
  color: string
}

interface StackedBarMultiDataPoint {
  category: string
  values: StackedBarValue[]
}

// Define types for component props
interface TagProps {
  children: React.ReactNode
  color: string
  textColor?: string
}

interface MetricBoxProps {
  label: string
  value: string
  color?: string
  size?: "normal" | "large"
}

interface SectionProgressProps {
  label: string
  progress: number
}

interface CircularProgressProps {
  value: number
}

interface PieChartProps {
  data: PieChartDataPoint[]
}

interface StackedHorizontalBarProps {
  data: ChartDataPoint[]
}

interface VerticalBarChartProps {
  data: ChartDataPoint[]
}

interface HorizontalBarChartProps {
  data: BarChartDataPoint[]
}

interface LineChartProgressProps {
  data: LineChartDataPoint[]
}

interface StackedHorizontalBarMultiProps {
  data: StackedBarMultiDataPoint[]
}

// Custom color palette based on the provided schema
const colors = {
  primary: "#007BFF",
  secondary: "#00B8D9",
  tertiary: "#6C757D",
  background: "#F5F6FA",
  success: "#28a745",
  warning: "#ffc107",
  danger: "#dc3545",
  purple: "#6f42c1",
  gray: "#6C757D",
  lightGray: "#e9ecef",
  darkGray: "#495057",
  white: "#ffffff",
  black: "#212529",
  headerBg: "#00B8D9",
  borderColor: "#dee2e6",
}

// Update the style constants to use the StyleProps type
const cardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  marginBottom: "16px",
  border: `1px solid ${colors.borderColor}`,
  position: "relative",
  transition: "transform 0.2s, box-shadow 0.2s",
  height: "100%",
}

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
}

const buttonStyle: CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.1)",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.white,
  fontSize: "14px",
}

const detailsButtonStyle: CSSProperties = {
  backgroundColor: colors.primary,
  color: colors.white,
  border: "none",
  borderRadius: "4px",
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: "500",
}

const modalBackdropStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
}

const modalContentStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: "8px",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
}

const modalHeaderStyle: CSSProperties = {
  padding: "15px 20px",
  borderBottom: `1px solid ${colors.borderColor}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const modalCloseButtonStyle: CSSProperties = {
  backgroundColor: "transparent",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: colors.darkGray,
}

const modalBodyStyle: CSSProperties = {
  padding: "20px",
}

// Main Dashboard Component
export default function ClientDashboard() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Function to close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      setActiveModal(null)
    }
  }
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const routerName = useLocation().pathname
  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.background, fontFamily: "Inter, system-ui, sans-serif" }}>
      {(user_control.role === "client" || routerName === "/client-view") && (
        <header
          style={{
            background: "#0f5b6d",
            padding: "0 24px",
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
            height: "64px",
            color: colors.white,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <h3 className="text-white" style={{ margin: 0, fontWeight: 500 }}>
                Client Dashboard
              </h3>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: colors.white,
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                Sample Client
              </div>
              {/* Contract Info */}
              <div style={{ display: "flex", gap: 24, marginLeft: 24 }}>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>Start Date</span>
                  <div style={{ fontSize: "14px" }}>15/04/2023</div>
                </div>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>End Date</span>
                  <div style={{ fontSize: "14px" }}>15/05/2023</div>
                </div>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>
                    Time Elapsed
                  </span>
                  <div style={{ fontSize: "14px" }}>10 days</div>
                </div>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>
                    Time Remaining
                  </span>
                  <div style={{ fontSize: "14px" }}>20 days</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* <div style={{ textAlign: "right", marginRight: 16 }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>
                Account Manager
              </span>
              <div style={{ fontSize: "14px" }}>John Smith</div>
            </div> */}
              <button style={buttonStyle}>
                <span style={{ marginRight: "5px" }}>🔔</span> Notifications
              </button>
              {/* <div
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: colors.white,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              CA
            </div> */}
            </div>
          </div>
        </header>
      )}

      <main
        style={{
          padding: user_control.role === "client" || routerName === "/client-view" ? "24px" : "0",
          background: colors.background,
        }}
      >
        {/* Client Info - Single Row */}
        {(user_control.role === "client" || routerName === "/client-view") && (
          <section style={{ marginBottom: 24 }}>
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Client Info</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>
                  Key client metrics and compliance status
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {[
                  { label: "Industry", value: "Manufacturing" },
                  { label: "Year End", value: "31/03/2023" },
                  // { label: "Account Manager", value: "John Smith" },
                  { label: "IRD Score", value: "85/100" },
                  { label: "GST Returns", value: <Tag color={colors.success}>Up to date</Tag> },
                  { label: "Annual Returns", value: <Tag color={colors.warning}>Due in 30 days</Tag> },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      flex: "1",
                      minWidth: "150px",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ color: colors.darkGray, marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontWeight: "500" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Dashboard Grid - Rearranged as requested */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Row 1: Overall Progress, Questionnaire, Queries */}

            {/* 1. Overall Progress */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Overall Progress</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Completion status</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0" }}>
                <div style={{ position: "relative", height: "160px", width: "160px" }}>
                  <CircularProgress value={72} />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: colors.primary }}>72%</div>
                    <div style={{ fontSize: "14px", color: colors.gray }}>Complete</div>
                  </div>
                </div>
                <div style={{ marginTop: "20px", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "14px", color: colors.gray }}>Reuse Rate</div>
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>65%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", color: colors.gray }}>Last Updated</div>
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>Today, 2:30 PM</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("progress")}>
                  Details
                </button>
              </div>
            </div>

            {/* 2. Questionnaire */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Questionnaire</h4>
                <div
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  Due: 05 May 2023
                </div>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <MetricBox label="Total" value="40" />
                  <MetricBox label="Responded" value="30" color={colors.success} />
                  <MetricBox label="Draft" value="5" color={colors.warning} />
                  <MetricBox label="Overdue" value="5" color={colors.danger} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "14px" }}>Completion Progress</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>75%</span>
                  </div>
                  <div style={{ height: "8px", backgroundColor: colors.lightGray, borderRadius: "4px" }}>
                    <div
                      style={{
                        width: "75%",
                        height: "100%",
                        backgroundColor: colors.primary,
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Section completion:</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <SectionProgress label="Financial Information" progress={90} />
                    <SectionProgress label="Tax Information" progress={70} />
                    <SectionProgress label="Compliance" progress={85} />
                    <SectionProgress label="Additional Information" progress={55} />
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("questionnaire")}>
                  Details
                </button>
              </div>
            </div>

            {/* 3. Queries */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Queries</h4>
                <div
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  Due: 10 May 2023
                </div>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <MetricBox label="Total" value="30" />
                  <MetricBox label="Responded" value="20" color={colors.success} />
                  <MetricBox label="Draft" value="3" color={colors.warning} />
                  <MetricBox label="Overdue" value="7" color={colors.danger} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "14px" }}>Resolution Progress</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>67%</span>
                  </div>
                  <div style={{ height: "8px", backgroundColor: colors.lightGray, borderRadius: "4px" }}>
                    <div
                      style={{
                        width: "67%",
                        height: "100%",
                        backgroundColor: colors.primary,
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Due breakdown:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <Tag color={colors.danger}>2 Today</Tag>
                    <Tag color={colors.warning}>3 Tomorrow</Tag>
                    <Tag color={colors.primary}>5 This Week</Tag>
                    <Tag color={colors.gray}>7 Overdue</Tag>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("queries")}>
                  Details
                </button>
              </div>
            </div>

            {/* Row 2: Autocoding, GL Scrutiny, Workpapers */}

            {/* 4. Autocoding */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Autocoding</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Transaction breakdown</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ marginBottom: "15px" }}>
                  <MetricBox label="Total Transactions" value="480" size="large" />
                </div>
                <div style={{ height: "180px", marginTop: "10px" }}>
                  <VerticalBarChart
                    data={[
                      { label: "Autocoded", value: 450, color: colors.success },
                      { label: "Recoded", value: 20, color: colors.warning },
                      { label: "Human Required", value: 5, color: colors.primary },
                      { label: "Client Query", value: 3, color: colors.danger },
                      { label: "Manual Journal", value: 2, color: colors.gray },
                    ]}
                  />
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("autocoding")}>
                  Details
                </button>
              </div>
            </div>

            {/* 5. GL Scrutiny */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>GL Scrutiny</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Anomaly detection</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <MetricBox label="Account Codes Reviewed" value="200" />
                  <MetricBox label="Anomalies" value="5" color={colors.danger} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Anomaly Types:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
                    <Tag color={colors.danger}>2 GST Mismatch</Tag>
                    <Tag color={colors.warning}>1 Misposting</Tag>
                    <Tag color={colors.primary}>1 Negative Balance</Tag>
                    <Tag color={colors.gray}>1 Duplicate</Tag>
                  </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Top Anomaly Categories:</div>
                  <div style={{ height: "100px" }}>
                    <HorizontalBarChart
                      data={[
                        { name: "GST Mismatch", value: 2, color: colors.danger },
                        { name: "Misposting", value: 1, color: colors.warning },
                        { name: "Negative Balance", value: 1, color: colors.primary },
                        { name: "Duplicate", value: 1, color: colors.gray },
                      ]}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "15px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "500" }}>Manual Journals Raised:</span> 3
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("glscrutiny")}>
                  Details
                </button>
              </div>
            </div>

            {/* 6. Workpapers */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Workpapers</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Status & progress</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <MetricBox label="Total" value="45" />
                  <MetricBox label="Completed" value="30" color={colors.success} />
                  <MetricBox label="In Progress" value="10" color={colors.warning} />
                  <MetricBox label="Not Started" value="5" color={colors.gray} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Completion by Type:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    <Tag color={colors.success}>20 Automated</Tag>
                    <Tag color={colors.primary}>10 Manual</Tag>
                    <Tag color={colors.gray}>15 Pending</Tag>
                  </div>
                </div>
                <div style={{ height: "100px", marginTop: "15px" }}>
                  <LineChartProgress
                    data={[
                      { month: "Jan", value: 5 },
                      { month: "Feb", value: 12 },
                      { month: "Mar", value: 18 },
                      { month: "Apr", value: 25 },
                      { month: "May", value: 30 },
                    ]}
                  />
                </div>
                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "500" }}>Journal Actions:</span> 5 Raised, 3 Posted, 2 Draft
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("workpapers")}>
                  Details
                </button>
              </div>
            </div>

            {/* Row 3: Anomaly type, Jobs, Manual Journals */}

            {/* 7. Anomaly Type */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Anomaly Type</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Distribution & status</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Anomaly Distribution:</div>
                  <div style={{ height: "150px" }}>
                    <StackedHorizontalBarMulti
                      data={[
                        {
                          category: "Scenario",
                          values: [
                            { label: "Resolved", value: 3, color: colors.success },
                            { label: "Pending", value: 2, color: colors.warning },
                          ],
                        },
                        {
                          category: "Duplicate",
                          values: [
                            { label: "Resolved", value: 2, color: colors.success },
                            { label: "Pending", value: 1, color: colors.warning },
                          ],
                        },
                        {
                          category: "Threshold",
                          values: [
                            { label: "Resolved", value: 1, color: colors.success },
                            { label: "Pending", value: 3, color: colors.warning },
                          ],
                        },
                      ]}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>Journal Status:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <Tag color={colors.success}>6 Resolved</Tag>
                    <Tag color={colors.warning}>6 Pending</Tag>
                    <Tag color={colors.primary}>3 Journals Raised</Tag>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("anomalytype")}>
                  Details
                </button>
              </div>
            </div>

            {/* 8. Jobs */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Jobs</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Status breakdown</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ marginBottom: "15px" }}>
                  <StackedHorizontalBar
                    data={[
                      { label: "Completed", value: 68, color: colors.success },
                      { label: "On Hold", value: 12, color: colors.warning },
                      { label: "Query Stage", value: 8, color: colors.primary },
                      { label: "Review Stage", value: 12, color: colors.gray },
                    ]}
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
                    <Tag color={colors.success}>17 Completed</Tag>
                    <Tag color={colors.warning}>3 On Hold</Tag>
                    <Tag color={colors.primary}>2 Query Stage</Tag>
                    <Tag color={colors.gray}>3 Review Stage</Tag>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                    <div>
                      <div style={{ fontSize: "14px", color: colors.gray }}>Account Manager</div>
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>John Smith</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", color: colors.gray }}>Support </div>
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>Sarah Johnson, Mike Peters</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("jobs")}>
                  Details
                </button>
              </div>
            </div>

            {/* 9. Manual Journals */}
            <div style={cardStyle} className="dashboard-card">
              <div style={cardHeaderStyle}>
                <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Manual Journals</h4>
                <span style={{ color: colors.darkGray, fontSize: "14px" }}>Status distribution</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <MetricBox label="Total" value="36" />
                  <MetricBox label="Posted" value="25" color={colors.success} />
                  <MetricBox label="Draft" value="5" color={colors.warning} />
                  <MetricBox label="Void" value="6" color={colors.danger} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <div style={{ width: "200px", height: "150px" }}>
                    <PieChart
                      data={[
                        { name: "Posted", value: 25, color: colors.success },
                        { name: "Draft", value: 5, color: colors.warning },
                        { name: "Void", value: 6, color: colors.danger },
                        { name: "Reversal", value: 0, color: colors.gray },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                <button style={detailsButtonStyle} onClick={() => setActiveModal("journals")}>
                  Details
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Overall Progress */}
      {activeModal === "progress" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Overall Progress Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Completion Calculation</h4>
              <p>Overall progress is calculated as:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>40% - Questionnaire completion</li>
                <li>30% - Jobs completion</li>
                <li>20% - Queries resolution</li>
                <li>10% - Workpapers completion</li>
              </ul>
              <p>Current status: 72% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Queries */}
      {activeModal === "queries" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Query Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Query Due Dates</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Query</th>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>GST Reconciliation</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Today</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Fixed Asset Register</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Today</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Inventory Valuation</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Tomorrow</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Accounts Payable</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Tomorrow</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Accounts Receivable</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Tomorrow</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Questionnaire */}
      {activeModal === "questionnaire" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Questionnaire Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Questionnaire Details</h4>
              <p>Due date: 15 May 2023</p>
              <p>Sections requiring attention:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>Additional Information (55% complete)</li>
                <li>Tax Information (70% complete)</li>
              </ul>
              <p>5 questions are in draft state and need to be finalized.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Jobs */}
      {activeModal === "jobs" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Job Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Job Counts</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Count</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Completed</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>17</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>68%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>On Hold</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>12%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Query Stage</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>2</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>8%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Review Stage</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>12%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", fontWeight: "bold" }}>Total</td>
                    <td style={{ textAlign: "right", padding: "5px", fontWeight: "bold" }}>25</td>
                    <td style={{ textAlign: "right", padding: "5px", fontWeight: "bold" }}>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Manual Journals */}
      {activeModal === "journals" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Manual Journal Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Manual Journal Details</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Count</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Posted</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>25</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$125,450</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Draft</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>5</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$28,750</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Void</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>6</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$15,200</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Reversal</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>0</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Autocoding */}
      {activeModal === "autocoding" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Autocoding Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Autocoding Details</h4>
              <p>Total transactions: 480</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Category</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Count</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Autocoded</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>450</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>93.8%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Recoded</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>20</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>4.2%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Human Required</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>5</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>1.0%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Client Query</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>0.6%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Manual Journal</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>2</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>0.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for GL Scrutiny */}
      {activeModal === "glscrutiny" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>GL Scrutiny Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>GL Scrutiny Details</h4>
              <p>Total account codes reviewed: 200</p>
              <p>Anomalies detected: 5</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>
                      Anomaly Type
                    </th>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>
                      Account Code
                    </th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>GST Mismatch</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>4010</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$1,250</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>GST Mismatch</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>4020</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$850</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Misposting</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>6010</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$2,300</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Negative Balance</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>1200</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>-$500</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Duplicate</td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>5040</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>$750</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Workpapers */}
      {activeModal === "workpapers" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Workpapers Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Workpapers Details</h4>
              <p>Total workpapers: 45</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Category</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Completed</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>
                      In Progress
                    </th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>
                      Not Started
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Balance Sheet</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>12</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>4</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>2</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Income Statement</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>10</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>1</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Tax</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>8</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Anomaly Type */}
      {activeModal === "anomalytype" && (
        <div style={modalBackdropStyle} onClick={handleBackdropClick}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Anomaly Type Details</h3>
              <button style={modalCloseButtonStyle} onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>
            <div style={modalBodyStyle}>
              <h4 style={{ margin: "0 0 10px 0" }}>Anomaly Type Details</h4>
              <p>Total anomalies: 12</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Type</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Resolved</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Pending</th>
                    <th style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #dee2e6" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Scenario</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>2</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>5</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Duplicate</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>2</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>1</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #f5f5f5" }}>Threshold</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>1</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>3</td>
                    <td style={{ textAlign: "right", padding: "5px", borderBottom: "1px solid #f5f5f5" }}>4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Style definitions for modal */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .dashboard-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
        `,
        }}
      />
    </div>
  )
}

// Component for Tag
function Tag({ children, color, textColor = "#fff" }: TagProps) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: textColor,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "500",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  )
}

// Component for MetricBox
function MetricBox({ label, value, color, size = "normal" }: MetricBoxProps) {
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ color: colors.darkGray, fontSize: "14px", marginBottom: "4px" }}>{label}</div>
      <div
        style={{
          fontSize: size === "large" ? "24px" : "18px",
          fontWeight: "600",
          color: color || colors.darkGray,
        }}
      >
        {value}
      </div>
    </div>
  )
}

// Component for SectionProgress
function SectionProgress({ label, progress }: SectionProgressProps) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "14px" }}>{label}</span>
        <span style={{ fontSize: "14px", fontWeight: "500" }}>{progress}%</span>
      </div>
      <div style={{ height: "6px", backgroundColor: colors.lightGray, borderRadius: "3px" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: progress < 60 ? colors.warning : colors.primary,
            borderRadius: "3px",
          }}
        ></div>
      </div>
    </div>
  )
}

// Visualization Components
function CircularProgress({ value }: CircularProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = 160
    const height = 160
    const thickness = 10
    const radius = Math.min(width, height) / 2

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Create the background arc
    const backgroundArc = d3
      .arc<any>()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI)

    g.append("path").attr("d", backgroundArc).attr("fill", colors.lightGray)

    // Create the foreground arc (progress)
    const progressArc = d3
      .arc<any>()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle((2 * Math.PI * value) / 100)

    g.append("path").attr("d", progressArc).attr("fill", colors.primary)
  }, [value])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 160 160" />
}

function PieChart({ data }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = 200
    const height = 150
    const radius = Math.min(width, height) / 2

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Create the pie layout
    const pie = d3
      .pie<PieChartDataPoint>()
      .value((d) => d.value)
      .sort(null)

    // Create the arc generator
    const arc = d3
      .arc<d3.PieArcDatum<PieChartDataPoint>>()
      .innerRadius(0)
      .outerRadius(radius - 20)

    // Create the arcs
    const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")

    // Add the paths (slices)
    arcs
      .append("path")
      .attr("d", (d) => arc(d) as string)
      .attr("fill", (_, i) => data[i].color)

    // Add labels
    const labelArc = d3
      .arc<d3.PieArcDatum<PieChartDataPoint>>()
      .innerRadius(radius - 60)
      .outerRadius(radius - 60)

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .style("font-weight", "bold")
      .text((d) => (d.data.value > 0 ? d.data.value.toString() : ""))

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height - 10})`)
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(${(i - data.length / 2) * 50}, 0)`)

    legend
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => d.color)

    legend
      .append("text")
      .attr("x", 15)
      .attr("y", 8)
      .style("font-size", "10px")
      .text((d) => d.name)
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 200 150" />
}

// Fix the StackedHorizontalBar function
function StackedHorizontalBar({ data }: StackedHorizontalBarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    // const width = 400
    const height = 40
    const margin = { top: 10, right: 10, bottom: 20, left: 10 }
    // const innerWidth = width - margin.left - margin.right

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Calculate total for percentage
    const total = data.reduce((sum, d) => sum + d.value, 0)

    // Create the stack
    let cumulative = 0
    const stackedData = data.map((d) => {
      const start = cumulative
      cumulative += d.value
      return {
        ...d,
        start: (start / total) * 100,
        end: (cumulative / total) * 100,
      }
    })

    // Create the bars
    g.selectAll(".bar")
      .data(stackedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => `${d.start}%`)
      .attr("y", 0)
      .attr("width", (d) => `${d.end - d.start}%`)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", (d) => d.color)
      .attr("rx", 4)

    // Add labels
    g.selectAll(".label")
      .data(stackedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => `${(d.start + d.end) / 2}%`)
      .attr("y", (height - margin.top - margin.bottom) / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .style("font-weight", "bold")
      .text((d) => `${Math.round(d.end - d.start)}%`)

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height})`)
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(${i * 100}, 0)`)

    legend
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => d.color)

    legend
      .append("text")
      .attr("x", 15)
      .attr("y", 8)
      .style("font-size", "10px")
      .text((d) => d.label)
  }, [data])

  return <svg ref={svgRef} width="100%" height="60" />
}

// Fix the VerticalBarChart function
function VerticalBarChart({ data }: VerticalBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = 400
    const height = 180
    const margin = { top: 30, right: 10, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.value) * 1.1 || 0])
      .range([innerHeight, 0])

    // Create axes
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "10px")
      .style("text-anchor", "middle")

    g.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "10px")

    // Create bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", (d) => d.color)
      .attr("rx", 4)

    // Add value labels
    g.selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text((d) => d.value.toString())
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 180" />
}

// Fix the HorizontalBarChart function
function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = 400
    const height = 100
    const margin = { top: 5, right: 60, bottom: 5, left: 100 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Create scales
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.2)

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.value) * 1.1 || 0])
      .range([0, innerWidth])

    // Create axes
    g.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size", "10px")

    // Create bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.name) || 0)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d.value))
      .attr("fill", (d) => d.color)
      .attr("rx", 4)

    // Add value labels
    g.selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("x", (d) => x(d.value) + 5)
      .attr("dy", ".35em")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text((d) => d.value.toString())
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 100" />
}

// Fix the LineChartProgress function
function LineChartProgress({ data }: LineChartProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = 400
    const height = 100
    const margin = { top: 10, right: 10, bottom: 20, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.value) * 1.1 || 0])
      .range([innerHeight, 0])

    // Create axes
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "10px")

    g.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "10px")

    // Create line
    const line = d3
      .line<LineChartDataPoint>()
      .x((d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX)

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colors.primary)
      .attr("stroke-width", 2)
      .attr("d", line as any)

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", colors.primary)
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 100" />
}

function StackedHorizontalBarMulti({ data }: StackedHorizontalBarMultiProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = 400
    const height = 150
    const margin = { top: 5, right: 60, bottom: 20, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Create scales
    const y = d3.scaleBand().domain(data.map((d) => d.category)).range([0, innerHeight]).padding(0.2)

    const maxValue = d3.max(data, (d: StackedBarMultiDataPoint) => d3.sum(d.values, (v: StackedBarValue) => v.value))

    const x = d3.scaleLinear().domain([0, (maxValue || 0) * 1.1]).range([0, innerWidth])

    // Create axes
    g.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size", "10px")

    g.append("g").attr("transform", `translate(0, ${innerHeight})`).call(d3.axisBottom(x).ticks(5)).selectAll("text").style("font-size", "10px")

    // Create stacked bars
    data.forEach((d) => {
      let xOffset = 0

      d.values.forEach((v) => {
        g.append("rect")
          .attr("y", y(d.category) || 0)
          .attr("x", xOffset)
          .attr("height", y.bandwidth())
          .attr("width", x(v.value))
          .attr("fill", v.color)
          .attr("rx", 4)

        // Add value labels if there's enough space
        if (x(v.value) > 25) {
          g.append("text")
            .attr("y", (y(d.category) || 0) + y.bandwidth() / 2)
            .attr("x", xOffset + x(v.value) / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#fff")
            .style("font-weight", "bold")
            .text(v.value.toString())
        }

        xOffset += x(v.value)
      })
    })

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${width - margin.right}, ${margin.top})`)

    const legendItems = [
      { label: "Resolved", color: colors.success },
      { label: "Pending", color: colors.warning },
    ]

    legendItems.forEach((item, i) => {
      legend
        .append("rect")
        .attr("y", i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", item.color)

      legend
        .append("text")
        .attr("y", i * 20 + 8)
        .attr("x", 15)
        .style("font-size", "10px")
        .text(item.label)
    })
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 150" />
}













































// "use client"

// import { useEffect, useRef } from "react"
// import * as d3 from "d3"
// import { useLocation } from "react-router-dom"

// // Custom color palette based on the reference image
// const colors = {
//   primary: "#00847e",
//   secondary: "#4cc9f0",
//   success: "#4cc9f0",
//   warning: "#f9c74f",
//   error: "#f94144",
//   purple: "#7209b7",
//   gray: "#ced4da",
//   lightGray: "#f8f9fa",
//   darkGray: "#6c757d",
//   white: "#ffffff",
//   black: "#212529",
//   headerBg: "#0F5B6D",
//   borderColor: "#e9ecef",
// }

// // Main Dashboard Component
// const ClientDashboard = () => {
//   const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
//   const routerName = useLocation().pathname
//   return (
//     <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "Inter, system-ui, sans-serif" }}>
//       {(user_control.role === "client" ||  routerName === "/client-view") &&
//       (<header
//         style={{
//           background: colors.headerBg,
//           padding: "0 24px",
//           boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
//           height: "64px",
//           color: colors.white,
//         }}
//       >
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//             <h3 style={{ margin: 0, fontWeight: 500,color: colors.white }}>Client Dashboard</h3>
//             <div
//               style={{
//                 backgroundColor: "rgba(255,255,255,0.1)",
//                 color: colors.white,
//                 padding: "4px 12px",
//                 borderRadius: "4px",
//                 fontSize: "14px",
//               }}
//             >
//               Acme Corporation Ltd
//             </div>
//             {/* Top-level client info */}
//             <div style={{ display: "flex", gap: 24, marginLeft: 24 }}>
//               <div>
//                 <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>Industry</span>
//                 <div style={{ fontSize: "14px" }}>Manufacturing</div>
//               </div>
//               <div>
//                 <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>Year End</span>
//                 <div style={{ fontSize: "14px" }}>31/03/2023</div>
//               </div>
//               <div>
//                 <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block" }}>
//                   Account Manager
//                 </span>
//                 <div style={{ fontSize: "14px" }}>John Smith</div>
//               </div>
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//             <button style={buttonStyle}>
//               <span style={{ marginRight: "5px" }}>🔔</span> Notifications
//             </button>
//             <div
//               style={{
//                 backgroundColor: "rgba(255,255,255,0.2)",
//                 color: colors.white,
//                 width: "32px",
//                 height: "32px",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "14px",
//               }}
//             >
//               CA
//             </div>
//           </div>
//         </div>
//       </header>)}
//       <main style={{ padding:user_control.role === "client" ? "24px" : "0", background: "#f5f7fa" }}>
//         {/* Client Info - Single Row */}
//         {(user_control.role === "client" ||  routerName === "/client-view") && (
//           <section style={{ marginBottom: 24 }}>
//             <div style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Client Info</h4>
//                 <span style={{ color: colors.darkGray, fontSize: "14px" }}>Key client metrics and compliance status</span>
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
//               {[
//                 { label: "Industry", value: "Manufacturing" },
//                 { label: "Year End", value: "31/03/2023" },
//                 { label: "Account Manager", value: "John Smith" },
//                 { label: "IRD Score", value: "85/100" },
//                 { label: "GST Returns", value: <Tag color={colors.success}>Up to date</Tag> },
//                 { label: "Annual Returns", value: <Tag color={colors.warning}>Due in 30 days</Tag> },
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     flex: "1",
//                     minWidth: "150px",
//                     fontSize: "14px",
//                   }}
//                 >
//                   <div style={{ color: colors.darkGray, marginBottom: "4px" }}>{item.label}</div>
//                   <div style={{ fontWeight: "500" }}>{item.value}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//         )}

//         {/* Client Health Overview - Full Width */}
//         <section style={{ marginBottom: 24 }}>
//           <div style={cardStyle}>
//             <div style={cardHeaderStyle}>
//               <h4 style={{ margin: 0, fontWeight: 500, fontSize: "16px" }}>Client Health Overview</h4>
//               <span style={{ color: colors.darkGray, fontSize: "14px" }}>Overall progress and key metrics</span>
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
//               <div style={{ flex: "1", minWidth: "200px", textAlign: "center" }}>
//                 <div style={{ height: "120px" }}>
//                   <ProgressGauge value={72} />
//                 </div>
//                 <strong style={{ display: "block", marginTop: 8, fontSize: "14px" }}>Overall Progress</strong>
//                 <span style={{ color: colors.darkGray, fontSize: "14px" }}>72% Complete</span>
//               </div>
//               <div style={{ flex: "1", minWidth: "200px", textAlign: "center" }}>
//                 <div style={{ height: "120px" }}>
//                   <AnomalyRadarChart />
//                 </div>
//                 <strong style={{ display: "block", marginTop: 8, fontSize: "14px" }}>Anomaly Distribution</strong>
//                 <span style={{ color: colors.darkGray, fontSize: "14px" }}>5 Anomalies Detected</span>
//               </div>
//               <div style={{ flex: "1", minWidth: "200px", textAlign: "center" }}>
//                 <div style={{ height: "120px" }}>
//                   <CompletionBarChart />
//                 </div>
//                 <strong style={{ display: "block", marginTop: 8, fontSize: "14px" }}>Task Completion</strong>
//                 <span style={{ color: colors.darkGray, fontSize: "14px" }}>By Category</span>
//               </div>
//               <div style={{ flex: "1", minWidth: "200px", textAlign: "center" }}>
//                 <div style={{ height: "120px" }}>
//                   <TimelineChart />
//                 </div>
//                 <strong style={{ display: "block", marginTop: 8, fontSize: "14px" }}>Activity Timeline</strong>
//                 <span style={{ color: colors.darkGray, fontSize: "14px" }}>Last 30 Days</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Main Metrics Grid - Uniform Size with Varied Visualizations */}
//         <section style={{ marginBottom: 24 }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
//             {/* Jobs Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Jobs</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>17/25</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>68% Complete</div>
//               <div style={{ margin: "10px 0", backgroundColor: colors.lightGray, height: "8px", borderRadius: "4px" }}>
//                 <div
//                   style={{
//                     width: "68%",
//                     height: "100%",
//                     backgroundColor: colors.primary,
//                     borderRadius: "4px",
//                   }}
//                 ></div>
//               </div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                 <Tag color={colors.success}>12 Completed</Tag>
//                 <Tag color={colors.primary}>5 In Progress</Tag>
//                 <Tag color={colors.warning}>3 On Hold</Tag>
//                 <Tag color={colors.purple}>2 Query Stage</Tag>
//                 <Tag color={colors.lightGray} textColor={colors.darkGray}>
//                   3 Review
//                 </Tag>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <HorizontalBarChart
//                   data={[
//                     { name: "Completed", value: 12, color: colors.success },
//                     { name: "In Progress", value: 5, color: colors.primary },
//                     { name: "On Hold", value: 3, color: colors.warning },
//                     { name: "Other", value: 5, color: colors.lightGray },
//                   ]}
//                 />
//               </div>
//             </div>

//             {/* Questionnaire Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Questionnaire</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>30/40</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>75% Complete</div>
//               <div style={{ margin: "10px 0", backgroundColor: colors.lightGray, height: "8px", borderRadius: "4px" }}>
//                 <div
//                   style={{
//                     width: "75%",
//                     height: "100%",
//                     backgroundColor: colors.primary,
//                     borderRadius: "4px",
//                   }}
//                 ></div>
//               </div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                 <Tag color={colors.success}>30 Responded</Tag>
//                 <Tag color={colors.warning}>5 Draft</Tag>
//                 <Tag color={colors.lightGray} textColor={colors.darkGray}>
//                   5 Not Started
//                 </Tag>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <StackedBarChart
//                   data={[
//                     { category: "Week 1", values: [10, 2, 1] },
//                     { category: "Week 2", values: [8, 1, 2] },
//                     { category: "Week 3", values: [7, 1, 1] },
//                     { category: "Week 4", values: [5, 1, 1] },
//                   ]}
//                   colors={[colors.success, colors.warning, colors.lightGray]}
//                 />
//               </div>
//             </div>

//             {/* Queries Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Queries</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>20/30</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>67% Resolved</div>
//               <div style={{ margin: "10px 0", backgroundColor: colors.lightGray, height: "8px", borderRadius: "4px" }}>
//                 <div
//                   style={{
//                     width: "67%",
//                     height: "100%",
//                     backgroundColor: colors.primary,
//                     borderRadius: "4px",
//                   }}
//                 ></div>
//               </div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                 <Tag color={colors.success}>20 Responded</Tag>
//                 <Tag color={colors.warning}>3 Draft</Tag>
//                 <Tag color={colors.lightGray} textColor={colors.darkGray}>
//                   7 Pending
//                 </Tag>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <LineChart
//                   data={[
//                     { date: "Apr", value: 5 },
//                     { date: "May", value: 8 },
//                     { date: "Jun", value: 12 },
//                     { date: "Jul", value: 10 },
//                     { date: "Aug", value: 15 },
//                     { date: "Sep", value: 20 },
//                   ]}
//                 />
//               </div>
//             </div>

//             {/* Journals Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Journals</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>36</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>Total Journal Entries</div>
//               <div style={{ marginTop: 16 }}>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                   <Tag color={colors.success}>25 Posted</Tag>
//                   <Tag color={colors.warning}>5 Draft</Tag>
//                   <Tag color={colors.error}>6 Void</Tag>
//                 </div>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <PieChart
//                   data={[
//                     { name: "Posted", value: 25, color: colors.success },
//                     { name: "Draft", value: 5, color: colors.warning },
//                     { name: "Void", value: 6, color: colors.error },
//                   ]}
//                 />
//               </div>
//             </div>

//             {/* Workpapers Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Workpapers</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>45</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>Total Workpapers</div>
//               <div style={{ marginTop: 16 }}>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                   <Tag color={colors.success}>30 Completed</Tag>
//                   <Tag color={colors.primary}>10 In Progress</Tag>
//                   <Tag color={colors.lightGray} textColor={colors.darkGray}>
//                     5 Not Started
//                   </Tag>
//                 </div>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <BubbleChart />
//               </div>
//             </div>

//             {/* Autocoding Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Autocoding</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>480</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>Total Transactions</div>
//               <div style={{ marginTop: 16 }}>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                   <Tag color={colors.success}>450 Autocoded</Tag>
//                   <Tag color={colors.warning}>20 Recoded</Tag>
//                   <Tag color={colors.lightGray} textColor={colors.darkGray}>
//                     10 Manual
//                   </Tag>
//                 </div>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <AreaChart
//                   data={[
//                     { date: "Apr", value: 50 },
//                     { date: "May", value: 80 },
//                     { date: "Jun", value: 120 },
//                     { date: "Jul", value: 90 },
//                     { date: "Aug", value: 60 },
//                     { date: "Sep", value: 80 },
//                   ]}
//                 />
//               </div>
//             </div>

//             {/* GL Scrutiny Card */}
//             <div style={metricCardStyle}>
//               <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>GL Scrutiny</h4>
//               <div style={{ fontSize: "24px", fontWeight: "bold" }}>200</div>
//               <div style={{ color: colors.darkGray, fontSize: "14px" }}>Account Codes Reviewed</div>
//               <div style={{ marginTop: 16 }}>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
//                   <Tag color={colors.error}>5 Anomalies</Tag>
//                   <Tag color={colors.success}>3 Resolved</Tag>
//                   <Tag color={colors.lightGray} textColor={colors.darkGray}>
//                     2 Pending
//                   </Tag>
//                 </div>
//               </div>
//               <hr style={dividerStyle} />
//               <div style={{ marginTop: 16, height: "80px" }}>
//                 <HeatmapChart />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Quick Actions Section */}
//         {/* <section style={{ marginBottom: 24 }}>
//           <div style={cardStyle}>
//             <h4 style={{ marginTop: 0, fontWeight: 500, fontSize: "16px" }}>Quick Actions</h4>
//             <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//               <button style={{ ...actionButtonStyle, flex: "1", minWidth: "200px" }}>
//                 <span style={{ marginRight: "8px" }}>⬆️</span> Upload Files
//               </button>
//               <button style={{ ...actionButtonStyle, flex: "1", minWidth: "200px" }}>
//                 <span style={{ marginRight: "8px" }}>💬</span> Respond to Queries
//               </button>
//               <button style={{ ...actionButtonStyle, flex: "1", minWidth: "200px" }}>
//                 <span style={{ marginRight: "8px" }}>👁️</span> View Workpapers
//               </button>
//               <button style={{ ...actionButtonStyle, flex: "1", minWidth: "200px" }}>
//                 <span style={{ marginRight: "8px" }}>📅</span> Schedule Meeting
//               </button>
//             </div>
//           </div>
//         </section> */}
//       </main>
//     </div>
//   )
// }

// // Style constants
// const cardStyle = {
//   backgroundColor: colors.white,
//   borderRadius: "8px",
//   padding: "20px",
//   boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//   marginBottom: "16px",
//   border: `1px solid ${colors.borderColor}`,
// }

// const metricCardStyle = {
//   ...cardStyle,
//   height: "100%",
//   display: "flex",
//   flexDirection: "column",
// }

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: "20px",
// }

// const buttonStyle = {
//   backgroundColor: "rgba(255,255,255,0.1)",
//   border: "none",
//   borderRadius: "4px",
//   padding: "8px 16px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   color: colors.white,
//   fontSize: "14px",
// }

// const actionButtonStyle = {
//   backgroundColor: colors.white,
//   border: `1px solid ${colors.borderColor}`,
//   borderRadius: "4px",
//   padding: "10px 16px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   color: colors.darkGray,
//   fontSize: "14px",
//   transition: "all 0.2s",
//   fontWeight: 500,
// }

// const dividerStyle = {
//   border: 0,
//   borderTop: `1px solid ${colors.borderColor}`,
//   margin: "12px 0",
// }

// const listItemStyle = {
//   padding: "10px 0",
//   borderBottom: `1px solid ${colors.lightGray}`,
// }

// // Component for Tag
// function Tag({ children, color, textColor = "#fff" }) {
//   return (
//     <span
//       style={{
//         backgroundColor: color,
//         color: textColor,
//         padding: "2px 8px",
//         borderRadius: "4px",
//         fontSize: "12px",
//         fontWeight: "500",
//         display: "inline-block",
//       }}
//     >
//       {children}
//     </span>
//   )
// }

// // Visualization Components
// function ProgressGauge({ value }) {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 120
//     const margin = 10
//     const radius = Math.min(width, height) / 2 - margin

//     svg.selectAll("*").remove()

//     const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)

//     // Create the background arc
//     const backgroundArc = d3
//       .arc()
//       .innerRadius(radius - 10)
//       .outerRadius(radius)
//       .startAngle(-Math.PI / 2)
//       .endAngle(Math.PI / 2)

//     g.append("path").attr("d", backgroundArc).attr("fill", colors.lightGray)

//     // Create the foreground arc (progress)
//     const progressArc = d3
//       .arc()
//       .innerRadius(radius - 10)
//       .outerRadius(radius)
//       .startAngle(-Math.PI / 2)
//       .endAngle(-Math.PI / 2 + (Math.PI * value) / 100)

//     g.append("path")
//       .attr("d", progressArc)
//       .attr("fill", value < 30 ? colors.error : value < 70 ? colors.warning : colors.primary)

//     // Add the text in the middle
//     g.append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", "0em")
//       .style("font-size", "2rem")
//       .style("font-weight", "bold")
//       .text(`${value}%`)

//     g.append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", "1.5em")
//       .style("font-size", "0.8rem")
//       .style("fill", colors.darkGray)
//       .text("Complete")
//   }, [value])

//   return <svg ref={svgRef} width="100%" height="120" />
// }

// function AnomalyRadarChart() {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 200
//     const margin = 20
//     const radius = Math.min(width, height) / 2 - margin

//     svg.selectAll("*").remove()

//     const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)

//     // Sample data
//     const data = [
//       { axis: "GST Errors", value: 0.6 },
//       { axis: "Mispostings", value: 0.4 },
//       { axis: "Negative Balances", value: 0.2 },
//       { axis: "Coding Errors", value: 0.3 },
//       { axis: "Duplicates", value: 0.1 },
//     ]

//     const angleSlice = (Math.PI * 2) / data.length

//     // Create the straight lines radiating outward from the center
//     const axis = g.selectAll(".axis").data(data).enter().append("g").attr("class", "axis")

//     axis
//       .append("line")
//       .attr("x1", 0)
//       .attr("y1", 0)
//       .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
//       .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
//       .attr("stroke", colors.lightGray)
//       .attr("stroke-width", 1)

//     // Create the circles for the radar chart
//     const circles = [0.2, 0.4, 0.6, 0.8, 1]
//     circles.forEach((circle) => {
//       g.append("circle")
//         .attr("cx", 0)
//         .attr("cy", 0)
//         .attr("r", radius * circle)
//         .attr("fill", "none")
//         .attr("stroke", colors.lightGray)
//         .attr("stroke-width", 1)
//     })

//     // Create the path for the radar chart
//     const radarLine = d3
//       .lineRadial()
//       .radius((d) => d.value * radius)
//       .angle((d, i) => i * angleSlice)
//       .curve(d3.curveLinearClosed)

//     g.append("path")
//       .datum(data)
//       .attr("d", radarLine)
//       .attr("fill", colors.primary)
//       .attr("fill-opacity", 0.3)
//       .attr("stroke", colors.primary)
//       .attr("stroke-width", 2)

//     // Add the axis labels
//     axis
//       .append("text")
//       .attr("x", (d, i) => (radius + 10) * Math.cos(angleSlice * i - Math.PI / 2))
//       .attr("y", (d, i) => (radius + 10) * Math.sin(angleSlice * i - Math.PI / 2))
//       .attr("text-anchor", (d, i) => {
//         const x = Math.cos(angleSlice * i - Math.PI / 2)
//         if (Math.abs(x) < 0.1) return "middle"
//         return x > 0 ? "start" : "end"
//       })
//       .attr("dy", (d, i) => {
//         const y = Math.sin(angleSlice * i - Math.PI / 2)
//         return y > 0 ? "0.7em" : "-0.2em"
//       })
//       .style("font-size", "8px")
//       .text((d) => d.axis)
//   }, [])

//   return <svg ref={svgRef} width="100%" height="120" />
// }

// function CompletionBarChart() {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 120
//     const margin = { top: 10, right: 10, bottom: 30, left: 40 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     // Sample data
//     const data = [
//       { name: "Financial", value: 85 },
//       { name: "Tax", value: 65 },
//       { name: "Compliance", value: 90 },
//       { name: "Advisory", value: 40 },
//     ]

//     const x = d3
//       .scaleBand()
//       .domain(data.map((d) => d.name))
//       .range([0, innerWidth])
//       .padding(0.3)

//     const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0])

//     const barChart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     barChart
//       .append("g")
//       .attr("transform", `translate(0,${innerHeight})`)
//       .call(d3.axisBottom(x).tickSizeOuter(0))
//       .selectAll("text")
//       .style("text-anchor", "middle")
//       .style("font-size", "10px")

//     barChart.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0)).selectAll("text").style("font-size", "10px")

//     barChart
//       .selectAll(".bar")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", (d) => x(d.name))
//       .attr("y", (d) => y(d.value))
//       .attr("width", x.bandwidth())
//       .attr("height", (d) => innerHeight - y(d.value))
//       .attr("fill", colors.primary)
//       .attr("rx", 4)

//     barChart
//       .selectAll(".bar-value")
//       .data(data)
//       .enter()
//       .append("text")
//       .attr("class", "bar-value")
//       .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
//       .attr("y", (d) => y(d.value) - 5)
//       .attr("text-anchor", "middle")
//       .style("font-size", "10px")
//       .style("font-weight", "bold")
//       .text((d) => d.value + "%")
//   }, [])

//   return <svg ref={svgRef} width="100%" height="120" />
// }

// function TimelineChart() {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 120
//     const margin = { top: 10, right: 10, bottom: 20, left: 30 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     // Sample data - last 30 days activity
//     const today = new Date()
//     const data = Array.from({ length: 30 }, (_, i) => {
//       const date = new Date(today)
//       date.setDate(date.getDate() - (29 - i))
//       return {
//         date,
//         value: Math.floor(Math.random() * 10),
//       }
//     })

//     const x = d3
//       .scaleTime()
//       .domain(d3.extent(data, (d) => d.date))
//       .range([0, innerWidth])

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => d.value)])
//       .nice()
//       .range([innerHeight, 0])

//     const line = d3
//       .line()
//       .x((d) => x(d.date))
//       .y((d) => y(d.value))
//       .curve(d3.curveMonotoneX)

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     g.append("g")
//       .attr("transform", `translate(0,${innerHeight})`)
//       .call(d3.axisBottom(x).ticks(4).tickSizeOuter(0))
//       .selectAll("text")
//       .style("font-size", "8px")

//     g.append("g").call(d3.axisLeft(y).ticks(3).tickSizeOuter(0)).selectAll("text").style("font-size", "8px")

//     g.append("path")
//       .datum(data)
//       .attr("fill", "none")
//       .attr("stroke", colors.primary)
//       .attr("stroke-width", 2)
//       .attr("d", line)

//     g.append("path")
//       .datum(data)
//       .attr("fill", `${colors.primary}20`)
//       .attr(
//         "d",
//         d3
//           .area()
//           .x((d) => x(d.date))
//           .y0(innerHeight)
//           .y1((d) => y(d.value))
//           .curve(d3.curveMonotoneX),
//       )

//     g.selectAll(".dot")
//       .data(data.filter((_, i) => i % 5 === 0))
//       .enter()
//       .append("circle")
//       .attr("class", "dot")
//       .attr("cx", (d) => x(d.date))
//       .attr("cy", (d) => y(d.value))
//       .attr("r", 3)
//       .attr("fill", colors.primary)
//   }, [])

//   return <svg ref={svgRef} width="100%" height="120" />
// }

// function HorizontalBarChart({ data }) {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current || !data.length) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const margin = { top: 5, right: 5, bottom: 5, left: 60 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     const y = d3
//       .scaleBand()
//       .domain(data.map((d) => d.name))
//       .range([0, innerHeight])
//       .padding(0.2)

//     const x = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => d.value)])
//       .nice()
//       .range([0, innerWidth])

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     g.append("g").call(d3.axisLeft(y).tickSizeOuter(0)).selectAll("text").style("font-size", "8px")

//     g.selectAll(".bar")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .attr("y", (d) => y(d.name))
//       .attr("x", 0)
//       .attr("height", y.bandwidth())
//       .attr("width", (d) => x(d.value))
//       .attr("fill", (d) => d.color)
//       .attr("rx", 2)

//     g.selectAll(".bar-value")
//       .data(data)
//       .enter()
//       .append("text")
//       .attr("class", "bar-value")
//       .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
//       .attr("x", (d) => x(d.value) + 3)
//       .attr("dy", "0.35em")
//       .style("font-size", "8px")
//       .style("fill", colors.darkGray)
//       .text((d) => d.value)
//   }, [data])

//   return <svg ref={svgRef} width="100%" height="80" />
// }

// function StackedBarChart({ data, colors }) {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current || !data.length) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const margin = { top: 10, right: 10, bottom: 20, left: 10 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     const x = d3
//       .scaleBand()
//       .domain(data.map((d) => d.category))
//       .range([0, innerWidth])
//       .padding(0.3)

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => d3.sum(d.values))])
//       .nice()
//       .range([innerHeight, 0])

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     g.append("g")
//       .attr("transform", `translate(0,${innerHeight})`)
//       .call(d3.axisBottom(x).tickSizeOuter(0))
//       .selectAll("text")
//       .style("font-size", "8px")

//     data.forEach((d, i) => {
//       let yOffset = 0
//       d.values.forEach((value, j) => {
//         g.append("rect")
//           .attr("x", x(d.category))
//           .attr("y", y(value + yOffset))
//           .attr("width", x.bandwidth())
//           .attr("height", innerHeight - y(value))
//           .attr("fill", colors[j])
//           .attr("rx", 2)

//         yOffset += value
//       })
//     })
//   }, [data, colors])

//   return <svg ref={svgRef} width="100%" height="80" />
// }

// function LineChart({ data }) {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current || !data.length) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const margin = { top: 10, right: 10, bottom: 20, left: 25 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     const x = d3
//       .scaleBand()
//       .domain(data.map((d) => d.date))
//       .range([0, innerWidth])
//       .padding(0.3)

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => d.value) * 1.2])
//       .nice()
//       .range([innerHeight, 0])

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     g.append("g")
//       .attr("transform", `translate(0,${innerHeight})`)
//       .call(d3.axisBottom(x).tickSizeOuter(0))
//       .selectAll("text")
//       .style("font-size", "8px")

//     g.append("g").call(d3.axisLeft(y).ticks(3).tickSizeOuter(0)).selectAll("text").style("font-size", "8px")

//     const line = d3
//       .line()
//       .x((d) => x(d.date) + x.bandwidth() / 2)
//       .y((d) => y(d.value))
//       .curve(d3.curveMonotoneX)

//     g.append("path")
//       .datum(data)
//       .attr("fill", "none")
//       .attr("stroke", colors.primary)
//       .attr("stroke-width", 2)
//       .attr("d", line)

//     g.selectAll(".dot")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("class", "dot")
//       .attr("cx", (d) => x(d.date) + x.bandwidth() / 2)
//       .attr("cy", (d) => y(d.value))
//       .attr("r", 3)
//       .attr("fill", colors.primary)
//   }, [data])

//   return <svg ref={svgRef} width="100%" height="80" />
// }

// function PieChart({ data }) {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current || !data.length) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const radius = Math.min(width, height) / 2 - 10

//     svg.selectAll("*").remove()

//     const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)

//     const pie = d3.pie().value((d) => d.value)
//     const arc = d3.arc().innerRadius(0).outerRadius(radius)

//     const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")

//     arcs
//       .append("path")
//       .attr("d", arc)
//       .attr("fill", (d, i) => data[i].color)
//       .attr("stroke", "white")
//       .style("stroke-width", "1px")

//     // Add labels
//     const labelArc = d3
//       .arc()
//       .innerRadius(radius * 0.6)
//       .outerRadius(radius * 0.6)

//     arcs
//       .append("text")
//       .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
//       .attr("text-anchor", "middle")
//       .attr("dy", "0.35em")
//       .style("font-size", "8px")
//       .style("fill", "white")
//       .style("font-weight", "bold")
//       .text((d) => (d.data.value > 3 ? d.data.value : ""))
//   }, [data])

//   return <svg ref={svgRef} width="100%" height="80" />
// }

// function BubbleChart() {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const margin = { top: 10, right: 10, bottom: 10, left: 10 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     // Sample data
//     const data = [
//       { x: 10, y: 10, r: 10, category: "Balance Sheet" },
//       { x: 30, y: 40, r: 15, category: "Income Statement" },
//       { x: 60, y: 20, r: 8, category: "Tax" },
//       { x: 80, y: 30, r: 12, category: "Notes" },
//       { x: 50, y: 50, r: 9, category: "Other" },
//     ]

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     const x = d3.scaleLinear().domain([0, 100]).range([0, innerWidth])
//     const y = d3.scaleLinear().domain([0, 60]).range([innerHeight, 0])

//     const colorScale = d3
//       .scaleOrdinal()
//       .domain(["Balance Sheet", "Income Statement", "Tax", "Notes", "Other"])
//       .range([colors.primary, colors.success, colors.warning, colors.purple, colors.gray])

//     g.selectAll(".bubble")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("class", "bubble")
//       .attr("cx", (d) => x(d.x))
//       .attr("cy", (d) => y(d.y))
//       .attr("r", (d) => d.r)
//       .attr("fill", (d) => colorScale(d.category))
//       .attr("opacity", 0.7)
//       .attr("stroke", "white")
//       .attr("stroke-width", 1)
//   }, [])

//   return <svg ref={svgRef} width="100%" height="80" />
// }

// function AreaChart({ data }) {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current || !data.length) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const margin = { top: 10, right: 10, bottom: 20, left: 25 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     const x = d3
//       .scaleBand()
//       .domain(data.map((d) => d.date))
//       .range([0, innerWidth])
//       .padding(0.3)

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => d.value) * 1.2])
//       .nice()
//       .range([innerHeight, 0])

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     g.append("g")
//       .attr("transform", `translate(0,${innerHeight})`)
//       .call(d3.axisBottom(x).tickSizeOuter(0))
//       .selectAll("text")
//       .style("font-size", "8px")

//     g.append("g").call(d3.axisLeft(y).ticks(3).tickSizeOuter(0)).selectAll("text").style("font-size", "8px")

//     const area = d3
//       .area()
//       .x((d) => x(d.date) + x.bandwidth() / 2)
//       .y0(innerHeight)
//       .y1((d) => y(d.value))
//       .curve(d3.curveMonotoneX)

//     g.append("path")
//       .datum(data)
//       .attr("fill", `${colors.primary}40`)
//       .attr("stroke", colors.primary)
//       .attr("stroke-width", 1.5)
//       .attr("d", area)
//   }, [data])

//   return <svg ref={svgRef} width="100%" height="80" />
// }

// function HeatmapChart() {
//   const svgRef = useRef(null)

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     const width = 200
//     const height = 80
//     const margin = { top: 10, right: 10, bottom: 10, left: 10 }
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom

//     svg.selectAll("*").remove()

//     // Sample data - 5 categories x 5 values
//     const data = [
//       ["Revenue", "Expenses", "Assets", "Liabilities", "Equity"],
//       [0, 1, 2, 0, 1],
//       [1, 0, 3, 1, 0],
//       [2, 1, 0, 2, 1],
//       [0, 2, 1, 0, 0],
//       [1, 0, 2, 1, 0],
//     ]

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

//     const cellSize = Math.min(innerWidth / 5, innerHeight / 5)

//     const colorScale = d3
//       .scaleOrdinal()
//       .domain([0, 1, 2, 3])
//       .range([colors.lightGray, colors.success, colors.warning, colors.error])

//     // Create heatmap cells
//     for (let i = 0; i < 5; i++) {
//       for (let j = 0; j < 5; j++) {
//         g.append("rect")
//           .attr("x", j * cellSize)
//           .attr("y", i * cellSize)
//           .attr("width", cellSize - 1)
//           .attr("height", cellSize - 1)
//           .attr("rx", 2)
//           .attr("fill", colorScale(data[i + 1][j]))
//       }
//     }

//     // Add category labels at the bottom
//     g.selectAll(".category-label")
//       .data(data[0])
//       .enter()
//       .append("text")
//       .attr("class", "category-label")
//       .attr("x", (d, i) => i * cellSize + cellSize / 2)
//       .attr("y", innerHeight + 8)
//       .attr("text-anchor", "middle")
//       .style("font-size", "6px")
//       .style("fill", colors.darkGray)
//       .text((d) => d.substring(0, 3))
//   }, [])

//   return <svg ref={svgRef} width="100%" height="80" />
// }
// export default ClientDashboard;