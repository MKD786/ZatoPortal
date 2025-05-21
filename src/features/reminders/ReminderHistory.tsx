"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, Input, Select, Tag, Typography } from "antd"
import { SearchOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography
const { Option } = Select
interface ReminderHistoryItem {
  key: string
  client: string
  type: "Missing Files" | "Questionnaire" | "Inactive User" | "Not Logged In" | "Explanation"
  subject: string
  sentDate: string
  sentTime: string
  status: "Opened" | "Not Opened"
  details: string
  response: string
}
interface ReminderHistoryItemCA {
  key: string
  client: string
  type: "Missing Files" | "Questionnaire" | "Inactive User" | "Not Logged In" | "Explanation"
  subject: string
  sentDate: string
  sentTime: string
  status: "Opened" | "Not Opened"
  details: string
  response: string
  acct_manager: string | null
  reminder: string
}

const ReminderHistory = () => {
  const [reminderHistory, setReminderHistory] = useState<(ReminderHistoryItem | ReminderHistoryItemCA)[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [selectedType, setSelectedType] = useState<string>("All Types")
  const user_selector = JSON.parse(sessionStorage.getItem("user") || "{}")
  const mockReminderHistory: (ReminderHistoryItem | ReminderHistoryItemCA)[] =
    user_selector.role === "client"
      ? [
        {
          key: "1",
          client: "Please complete the Tax Year 2024 Questionnaire by May 20th",
          type: "Questionnaire",
          subject: "Tax Questionnaire Submission Reminder",
          sentDate: "May 10, 2025",
          sentTime: "09:30 AM",
          status: "Opened",
          details: "Annual tax questionnaire needs to be completed for timely filing",
          response: "Will complete by tomorrow",
        },
        {
          key: "2",
          client: "Mid Job Query: Please confirm business mileage for Q1 2025",
          type: "Questionnaire",
          subject: "Mid Job Query - Business Mileage",
          sentDate: "May 8, 2025",
          sentTime: "11:15 AM",
          status: "Not Opened",
          details: "Need confirmation of business mileage for accurate deduction calculation",
          response: "No response",
        },
        {
          key: "3",
          client: "We noticed you haven't been active in your account recently",
          type: "Inactive User",
          subject: "Account Activity Reminder",
          sentDate: "May 5, 2025",
          sentTime: "2:45 PM",
          status: "Opened",
          details: "No activity in the last 30 days",
          response: "Been on vacation, will log in this week",
        },
        {
          key: "4",
          client: "Please login to your portal to review important tax documents",
          type: "Not Logged In",
          subject: "Portal Login Reminder",
          sentDate: "May 3, 2025",
          sentTime: "10:20 AM",
          status: "Opened",
          details: "No login since April 15th",
          response: "Logged in and reviewed documents",
        },
        {
          key: "5",
          client: "Mid Job Query: Please explain the $3,500 expense on April 22nd",
          type: "Explanation",
          subject: "Mid Job Query - Expense Clarification",
          sentDate: "May 1, 2025",
          sentTime: "3:05 PM",
          status: "Opened",
          details: "Need clarification on business purpose of expense",
          response: "This was for new office equipment. Invoice attached.",
        },
        {
          key: "6",
          client: "Please complete the Business Structure Questionnaire",
          type: "Questionnaire",
          subject: "Business Questionnaire Reminder",
          sentDate: "Apr 28, 2025",
          sentTime: "1:30 PM",
          status: "Not Opened",
          details: "Information needed for business entity selection",
          response: "No response",
        },
        {
          key: "7",
          client: "Mid Job Query: Confirm total revenue of $127,850 for Q1 2025",
          type: "Questionnaire",
          subject: "Mid Job Query - Revenue Confirmation",
          sentDate: "Apr 25, 2025",
          sentTime: "11:15 AM",
          status: "Opened",
          details: "Need confirmation of Q1 revenue figures for quarterly filing",
          response: "Confirmed. The amount is correct.",
        },
        {
          key: "8",
          client: "Please login to your portal to approve draft tax returns",
          type: "Not Logged In",
          subject: "Portal Login Reminder - Urgent",
          sentDate: "Apr 20, 2025",
          sentTime: "9:45 AM",
          status: "Not Opened",
          details: "Tax filing deadline approaching, approval needed",
          response: "No response",
        },
      ]
      : [
        {
          key: "1",
          client: "Smith Enterprises",
          type: "Questionnaire",
          subject: "Tax Questionnaire Submission Reminder",
          sentDate: "May 10, 2025",
          sentTime: "09:30 AM",
          status: "Opened",
          details: "Annual tax questionnaire needs to be completed for timely filing",
          response: "Will complete by tomorrow",
          acct_manager: "John Doe",
          reminder: "Please complete the Tax Year 2024 Questionnaire by May 20th",
        },
        {
          key: "2",
          client: "Johnson LLC",
          type: "Questionnaire",
          subject: "Mid Job Query - Business Mileage",
          sentDate: "May 8, 2025",
          sentTime: "11:15 AM",
          status: "Not Opened",
          details: "Need confirmation of business mileage for accurate deduction calculation",
          response: "No response",
          acct_manager: "John Smith",
          reminder: "Mid Job Query: Please confirm business mileage for Q1 2025",
        },
        {
          key: "3",
          client: "Williams Consulting",
          type: "Inactive User",
          subject: "Account Activity Reminder",
          sentDate: "May 5, 2025",
          sentTime: "2:45 PM",
          status: "Opened",
          details: "No activity in the last 30 days",
          response: "Been on vacation, will log in this week",
          acct_manager: "Anderson",
          reminder: "We noticed you haven't been active in your account recently",
        },
        {
          key: "4",
          client: "Davis Group",
          type: "Not Logged In",
          subject: "Portal Login Reminder",
          sentDate: "May 3, 2025",
          sentTime: "10:20 AM",
          status: "Opened",
          details: "No login since April 15th",
          response: "Logged in and reviewed documents",
          acct_manager: "JRGeorge",
          reminder: "Please login to your portal to review important tax documents",
        },
        {
          key: "5",
          client: "Miller & Sons",
          type: "Explanation",
          subject: "Mid Job Query - Expense Clarification",
          sentDate: "May 1, 2025",
          sentTime: "3:05 PM",
          status: "Opened",
          details: "Need clarification on business purpose of expense",
          response: "This was for new office equipment. Invoice attached.",
          acct_manager: "Martin",
          reminder: "Mid Job Query: Please explain the $3,500 expense on April 22nd",
        },
        {
          key: "6",
          client: "Wilson Incorporated",
          type: "Questionnaire",
          subject: "Business Questionnaire Reminder",
          sentDate: "Apr 28, 2025",
          sentTime: "1:30 PM",
          status: "Not Opened",
          details: "Information needed for business entity selection",
          response: "No response",
          acct_manager: "Edward",
          reminder: "Please complete the Business Structure Questionnaire",
        },
        {
          key: "7",
          client: "Moore Enterprises",
          type: "Questionnaire",
          subject: "Mid Job Query - Revenue Confirmation",
          sentDate: "Apr 25, 2025",
          sentTime: "11:15 AM",
          status: "Opened",
          details: "Need confirmation of Q1 revenue figures for quarterly filing",
          response: "Confirmed. The amount is correct.",
          acct_manager: "Sr.George",
          reminder: "Mid Job Query: Confirm total revenue of $127,850 for Q1 2025",
        },
        {
          key: "8",
          client: "Taylor Associates",
          type: "Not Logged In",
          subject: "Portal Login Reminder - Urgent",
          sentDate: "Apr 20, 2025",
          sentTime: "9:45 AM",
          status: "Not Opened",
          details: "Tax filing deadline approaching, approval needed",
          response: "No response",
          acct_manager: "Williams",
          reminder: "Please login to your portal to approve draft tax returns",
        },
      ]
  useEffect(() => {
    fetchReminderHistory()
  }, [])

  const fetchReminderHistory = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReminderHistory([...mockReminderHistory])
      setLoading(false)
    }, 1000)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
  }

  // Filter the reminder history based on search text and selected type
  const filteredReminderHistory = reminderHistory.filter((reminder) => {
    // Search filter
    if (
      searchText &&
      !reminder.client.toLowerCase().includes(searchText.toLowerCase()) &&
      !reminder.subject.toLowerCase().includes(searchText.toLowerCase()) &&
      !reminder.details.toLowerCase().includes(searchText.toLowerCase()) &&
      !(reminder as ReminderHistoryItemCA).acct_manager?.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false
    }

    // Type filter
    if (selectedType !== "All Types" && reminder.type !== selectedType) {
      return false
    }

    return true
  })

  const columns: ColumnsType<ReminderHistoryItem> = [
    {
      title: user_selector.role === "client" ? "Reminder" : "Client",
      dataIndex: "client",
      key: "client",
      width: user_selector.role === "client" ? 300 : 150,
      render: (text) => <span style={{ fontSize: "0.8rem" }}>{text}</span>,
    },
    {
      title: "ACCT.Manager",
      dataIndex: "acct_manager",
      key: "acct_manager",
      width: 150,
      render: (text) => <span style={{ fontSize: "0.8rem" }}>{text}</span>,
      hidden: user_selector.role === "client",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => {
        let color = ""
        let bgColor = ""
        switch (type) {
          case "Explanation":
            color = "#fff"
            bgColor = "#f5b622"
            break
          case "Missing Files":
            color = "#fff"
            bgColor = "#f5222d"
            break
          case "Questionnaire":
            color = "#fff"
            bgColor = "#1890ff"
            break
          case "Inactive User":
            color = "#fff"
            bgColor = "#0F5B6D"
            break
          case "Not Logged In":
            color = "#000"
            bgColor = "#f0f0f0"
            break
        }
        return (
          <Tag style={{ color, backgroundColor: bgColor, borderRadius: "16px", fontSize: "0.6rem", padding: "0.1rem 0.3rem", border: "none" }}>
            {type}
          </Tag>
        )
      },
    },
    {
      title: user_selector.role !== "client" ? "Reminder" : "Subject",
      dataIndex: user_selector.role !== "client" ? "reminder" : "subject",
      key: user_selector.role !== "client" ? "reminder" : "subject",
      width: 200,
      render: (text) => <span style={{ fontSize: "0.8rem" }}>{text}</span>,
    },
    {
      title: "Sent Date",
      key: "sentDate",
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: "0.8rem" }}>
          <div>
            <CalendarOutlined style={{ fontSize: "12px", marginRight: "4px", color: "#8c8c8c" }} />
            {record.sentDate}
          </div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            <ClockCircleOutlined style={{ fontSize: "10px", marginRight: "4px" }} />
            {record.sentTime}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => {
        // const color = status === "Opened" ? "#52c41a" : "#1890ff"
        const bgColor = status === "Opened" ? "#f6ffed" : "#e6f7ff"
        const textColor = status === "Opened" ? "#389e0d" : "#1890ff"

        return (
          <Tag style={{ color: textColor, backgroundColor: bgColor, borderRadius: "16px", fontSize: "0.6rem", padding: "0rem 0.3rem", border: "none" }}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      width: 250,
      render: (text) => <span style={{ fontSize: "0.8rem" }}>{text}</span>,
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      width: 250,
      render: (text) => (
        <span style={{ fontSize: "0.8rem", color: text === "No response" ? "#8c8c8c" : "inherit" }}>
          <input
            className="border-2 border-gray-200 p-1  hover:outline-none focus:outline-none "
            style={{ width: "100%", outline: "none", borderRadius: "4px" }}
            type="text"
            defaultValue={text}
            onChange={(e) => {
              console.log(e.target.value)
            }}
          />
        </span>
      ),
    },
  ]

  return (
    <div className={`space-y-5 ${user_selector?.role === "client" ? "p-4 md:p-6" : ""}`}>
      {user_selector?.role === "client" && (
        <div className="flex items-center justify-between mt-2">
          <Title level={3} style={{ margin: 0, fontSize: "24px" }}>
            Reminder History
          </Title>
        </div>
      )}
      <div className="flex items-center justify-between sm:flex-col md:flex-row lg:flex-row gap-4 mb-2" style={{ marginTop: 0 }}>
        <div className="flex items-center gap-2 w-[50%]">
          <Input placeholder={user_selector.role === "client" ? "Search Queries, Subjects, or Details..." : "Search Clients, Subjects,ACCT. Manager or Details..."} prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />} onChange={handleSearch} value={searchText} style={{ width: "100%", borderRadius: "4px" }} size="large" className="py-1 px-2 text-sm w-full" />
          <Select defaultValue="All Types" style={{ width: 180 }} onChange={handleTypeChange} size="middle">
            <Option value="All Types">All Types</Option>
            <Option value="Explanation">Explanation</Option>
            <Option value="Missing Files">Missing Files</Option>
            <Option value="Questionnaire">Questionnaire</Option>
            <Option value="Inactive User">Inactive User</Option>
            <Option value="Not Logged In">Not Logged In</Option>
          </Select>
        </div>
      </div>
      <div style={{ fontSize: "14px", color: "#8c8c8c", margin: "0" }}>Showing {filteredReminderHistory.length} of {reminderHistory.length} reminders</div>
      <div className="reminder-history-table" style={{ marginTop: 0 }}>
        <Table columns={columns} dataSource={filteredReminderHistory} pagination={{ pageSize: 10 }} loading={loading}
          rowKey="key"
          scroll={{
            y: 420,
            x: "auto",
            scrollToFirstRowOnChange: true,
          }}
          style={{ overflow: "auto" }}
          // bordered
          // style={{ borderRadius: "4px", overflow: "hidden" }}
          className="reminder-table"
        />
      </div>
    </div>
  )
}

export default ReminderHistory
