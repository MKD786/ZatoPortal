"use client"

import { useState, useEffect } from "react"
import { Table, Typography, Button, Tag, Space } from "antd"
import { EyeOutlined, FileOutlined, ClockCircleOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography

interface QuestionnaireItem {
  key: string
  clientName: string
  companyName: string
  type: string
  progress: number
  lastUpdated: string
  status: "In Progress" | "Complete" | "Not Started"
}

const mockQuestionnaires: QuestionnaireItem[] = [
  {
    key: "1",
    clientName: "John Smith",
    companyName: "Smith Enterprises",
    type: "Business",
    progress: 65,
    lastUpdated: "Today, 10:30 AM",
    status: "In Progress",
  },
  {
    key: "2",
    clientName: "Sarah Johnson",
    companyName: "Johnson & Co",
    type: "Personal",
    progress: 100,
    lastUpdated: "Yesterday, 3:45 PM",
    status: "Complete",
  },
  {
    key: "3",
    clientName: "Michael Brown",
    companyName: "Brown Industries",
    type: "Business",
    progress: 0,
    lastUpdated: "Not started",
    status: "Not Started",
  },
  {
    key: "4",
    clientName: "Emily Davis",
    companyName: "Davis Consulting",
    type: "Business",
    progress: 40,
    lastUpdated: "3 days ago",
    status: "In Progress",
  },
  {
    key: "5",
    clientName: "Robert Wilson",
    companyName: "Wilson Ltd",
    type: "Personal",
    progress: 25,
    lastUpdated: "1 week ago",
    status: "In Progress",
  },
]

const Questionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  const fetchQuestionnaires = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setQuestionnaires([...mockQuestionnaires])
      setLoading(false)
    }, 1000)
  }

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "#52c41a"
      case "Not Started":
        return "#f5f5f5"
      case "In Progress":
        return "#0F5B6D"
      default:
        return "#0F5B6D"
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Complete":
        return {
          color: "#52c41a",
          backgroundColor: "#f6ffed",
          borderColor: "#b7eb8f",
        }
      case "Not Started":
        return {
          color: "#f5222d",
          backgroundColor: "#fff1f0",
          borderColor: "#ffa39e",
        }
      case "In Progress":
        return {
          color: "#fa8c16",
          backgroundColor: "#fff7e6",
          borderColor: "#ffd591",
        }
      default:
        return {
          color: "#1890ff",
          backgroundColor: "#e6f7ff",
          borderColor: "#91d5ff",
        }
    }
  }

  const columns: ColumnsType<QuestionnaireItem> = [
    {
      title: "Client",
      key: "client",
      render: (_, record) => (
        <div>
          <div style={{ fontSize: "14px", fontWeight: 500 }}>{record.clientName}</div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{record.companyName}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <span style={{ fontSize: "14px" }}>{text}</span>,
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "14px", marginRight: "8px", minWidth: "30px" }}>{record.progress}%</span>
          <div
            style={{
              width: "100px",
              height: "6px",
              backgroundColor: "#f0f0f0",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${record.progress}%`,
                height: "100%",
                backgroundColor: getProgressBarColor(record.status),
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Last Updated",
      key: "lastUpdated",
      render: (_, record) => (
        <div style={{ fontSize: "14px", display: "flex", alignItems: "center" }}>
          <ClockCircleOutlined style={{ fontSize: "12px", marginRight: "4px", color: "#8c8c8c" }} />
          {record.lastUpdated}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const style = getStatusBadgeStyle(status)

        return (
          <Tag
            style={{
              color: style.color,
              backgroundColor: style.backgroundColor,
              borderColor: style.borderColor,
              borderRadius: "16px",
              fontSize: "12px",
              padding: "2px 8px",
            }}
          >
            {status}
          </Tag>
        )
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} style={{ color: "#8c8c8c", border: "none" }} />
          <Button type="text" icon={<FileOutlined />} style={{ color: "#8c8c8c", border: "none" }} />
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <Title level={3} style={{ margin: 0, fontSize: "24px", marginBottom: "24px" }}>Questionnaire Status</Title>

      <div className="questionnaire-table">
        {/* <Spin spinning={loading} tip="Loading..."> */}
        <Table
          columns={columns}
          dataSource={questionnaires}
          pagination={false}
          rowKey="key"
          loading={loading}
          // bordered
          // style={{ borderRadius: "4px", overflow: "hidden" }}
          className="questionnaire-table"
        />
        {/* </Spin> */}
      </div>
    </div>
  )
}

export default Questionnaires
