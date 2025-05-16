import type React from "react"
import { useState } from "react"
import {
  SearchOutlined,
  SettingOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  PauseOutlined,
  ClockCircleOutlined,
  FileOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { Select, Card, Button, Progress, Table, Input, Space, Tabs } from "antd"

interface Job {
  id: number
  jobNumber: string
  jobName: string
  clientName: string
  type: string
  category: string
  allocatedTo: string
  allocationDate: string
  assignedTo: string
  status: string
}
export default function JobsManagement() {  
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [filteredJobsData, setFilteredJobsData] = useState<Job[]>([])
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  // Filter questions based on active tab
  const filteredSections = (filteredJobsData.length > 0 ? filteredJobsData : jobsData)
    .filter((section) => {
      if (activeTab === "all") return section
      if (activeTab === "ready") return section.status === "ready"
      if (activeTab === "query") return section.status === "query";
      if (activeTab === "hold") return section.status === "hold";
      if (activeTab === "review") return section.status === "review";
      if (activeTab === "completed") return section.status === "completed";
      return true;
    })
  // Status color mapping
  // const getStatusTag = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "on hold":
  //       return <Tag color="default">{status}</Tag>
  //     case "review":
  //       return <Tag color="blue">{status}</Tag>
  //     case "query":
  //       return <Tag color="gold">{status}</Tag>
  //     case "ready":
  //       return <Tag color="green">{status}</Tag>
  //     default:
  //       return <Tag color="default">{status}</Tag>
  //   }
  // }

  // Table columns
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    // {
    //   title: "Client Name",
    //   dataIndex: "clientName",
    //   key: "clientName",
    // },
    {
      title: "Job ID",
      dataIndex: "jobNumber",
      key: "jobNumber",
    },
    {
      title: "Job Name",
      dataIndex: "jobName",
      key: "jobName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Alloct'd. To",
      dataIndex: "allocatedTo",
      key: "allocatedTo",
      width: 120,
      hidden: user_control?.role === "client",
    },
    {
      title: "Allc. Date",
      dataIndex: "allocationDate",
      key: "allocationDate",
      width: 120,
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      width: 120,
    },
    {
      title: "Change Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => (
        <Select
          defaultValue={status.toLocaleUpperCase()}
          style={{ width: "100%" }}
          options={[
            { value: "On Hold", label: "On Hold" },
            { value: "Review", label: "Review" },
            { value: "Query", label: "Query" },
            { value: "Ready To Start", label: "Ready To Start" },
          ]}
        />
      ),
    },
    {
      title: <SettingOutlined />,
      key: "action",
      width: 60,
      render: () => <Button type="text" icon={<MoreOutlined />} />,
    },
  ]
  return (
    <div className={`flex flex-col w-full min-h-screen ${user_control?.role === "client" ? "p-4 md:p-6" : ""}`}>
      <main className="flex-1 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <Space>
            <Button icon={<DownloadOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: "#0a6e85" }}>
              Add Job
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* <StatCard title="Total Jobs" value={user_control?.role === "client" ? "5" : "125"} icon={<FileOutlined />} />
          <StatCard title="Jobs Pending" value={user_control?.role === "client" ? "2" : "42"} icon={<ClockCircleOutlined />} />
          <StatCard title="Query Stage" value={user_control?.role === "client" ? "1" : "18"} icon={<QuestionCircleOutlined />} />
          <StatCard title="On Hold" value={user_control?.role === "client" ? "1" : "15"} icon={<PauseOutlined />} />
          <StatCard title="Completed" value={user_control?.role === "client" ? "1" : "50"} icon={<CheckCircleOutlined />} /> */}
          <StatCard title="Total Jobs" value={"5"} icon={<FileOutlined />} />
          <StatCard title="Jobs Pending" value={"2"} icon={<ClockCircleOutlined />} />
          <StatCard title="Query Stage" value={"1"} icon={<QuestionCircleOutlined />} />
          <StatCard title="On Hold" value={"1"} icon={<PauseOutlined />} />
          <StatCard title="Completed" value={"1"} icon={<CheckCircleOutlined />} />
        </div>

        {/* Additional Statistics */}
        {user_control?.role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card title="Jobs by Account Lead" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div className="flex justify-between items-center">
                  <span>John</span>
                <span className="font-medium">3</span>
              </div>
              <Progress percent={Math.round((3 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />

              <div className="flex justify-between items-center">
                <span>Laura</span>
                <span className="font-medium">2</span>
              </div>
              <Progress percent={Math.round((2 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />

              <div className="flex justify-between items-center">
                <span>Sarah</span>
                <span className="font-medium">1</span>
              </div>
              <Progress percent={Math.round((1 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />
            </Space>
          </Card>

          <Card title="Jobs by Status" size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="flex justify-between items-center">
                <span>Ready To Start</span>
                <span className="font-medium">1</span>
              </div>
              <Progress percent={Math.round((1 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />

              <div className="flex justify-between items-center">
                <span>Query</span>
                <span className="font-medium">1</span>
              </div>
              <Progress percent={Math.round((1 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />

              <div className="flex justify-between items-center">
                <span>On Hold</span>
                <span className="font-medium">1</span>
              </div>
              <Progress percent={Math.round((1 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />
            </Space>
          </Card>

          <Card title={user_control?.role !== "admin" ? "Jobs by Support Team" : "Jobs by Zato Support"} size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="flex justify-between items-center">
                <span>Manish</span>
                <span className="font-medium">3</span>
              </div>
              <Progress percent={Math.round((3 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />

              <div className="flex justify-between items-center">
                <span>Sandeep</span>
                <span className="font-medium">2</span>
              </div>
              <Progress percent={Math.round((2 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />

              <div className="flex justify-between items-center">
                <span>Akash Mishra</span>
                <span className="font-medium">0</span>
              </div>
              <Progress percent={Math.round((0 / 5) * 100)} showInfo={false} strokeColor="#0a6e85" />
            </Space>
          </Card>
        </div>
      )}
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Search Jobs, Job ID..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => {
              const searchValue = e.target.value;
              const filteredJobs = jobsData?.filter(job =>
                job.jobNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                job.clientName.toLowerCase().includes(searchValue.toLowerCase())
              );
              return setFilteredJobsData(filteredJobs);
            }}
          />
          {user_control?.role === "admin" && (
            <>
              {/* <Select
                placeholder="Account Lead (Alloct'd to)"
                style={{ width: 200 }}
                options={[
                  { value: "all", label: "All Account Leads" },
                  { value: "john", label: "John" },
                  { value: "laura", label: "Laura" },
                  { value: "anthony", label: "Anthony" },
                  { value: "sarah", label: "Sarah" },
                  { value: "jennifer", label: "Jennifer" },
                  { value: "ryan", label: "Ryan" },
                  { value: "brian", label: "Brian" },
                  { value: "christopher", label: "Christopher" },
                  { value: "david", label: "David" },
                ]}
              /> */}

              <Select
                placeholder="Zato Support (Assigned to)"
                style={{ width: 200 }}
                options={[
                  { value: "all", label: "All Support Staff" },
                  { value: "manish", label: "Manish" },
                  { value: "sandeep", label: "Sandeep" },
                  { value: "akash", label: "Akash Mishra" },
                ]}
                onChange={(value) => {
                  if (value === "all" ) {
                    setFilteredJobsData(jobsData)
                  } else {
                    const filteredJobs = jobsData?.filter(
                      (job) => job.assignedTo.toLowerCase().includes(value.toLowerCase())
                    )
                    setFilteredJobsData(filteredJobs)
                  }
                }}
              />

            </>)}
          <Select
            placeholder="Status"
            style={{ width: 200 }}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "hold", label: "On Hold" },
              { value: "review", label: "Review" },
              { value: "query", label: "Query" },
              { value: "ready", label: "Ready To Start" },
            ]}
            onChange={(value) => {
              const filteredJobs = jobsData?.filter(job =>
                job.status.toLowerCase().includes(value.toLowerCase())
              );
              return setFilteredJobsData(filteredJobs);
            }}
          />
          {/* <Button icon={<FilterOutlined />}>More Filters</Button> */}
        </div>

        {/* Status Tabs */}
        <div>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "all", label: `All Jobs (${jobsData?.length})` },
              { key: "ready", label: `Ready To Start (${jobsData?.filter((job) => job.status === "ready").length})` },
              { key: "query", label: `Query (${jobsData?.filter((job) => job.status === "query").length})` },
              { key: "hold", label: `On Hold (${jobsData?.filter((job) => job.status === "hold").length})` },
              { key: "review", label: `Review (${jobsData?.filter((job) => job.status === "review").length})` },
              { key: "completed", label: `Completed (${jobsData?.filter((job) => job.status === "completed").length})` },
            ]}
          />
        </div>

        {/* Jobs Table */}
        <Table
          rowSelection={rowSelection}
          columns={user_control?.role === "client" ?
            columns.filter((column) => column.key !== "assignedTo") :
            columns.filter((column) => column.key !== "allocatedTo")}
          dataSource={filteredSections}
          rowKey="id"
          size="large"
          className="jobs-table"
          style={{ width: "100%", fontSize: "14px" }}
          // pagination={{
          //   total: 125,
          //   showSizeChanger: true,
          //   pageSizeOptions: ["10", "20", "50", "100"],
          //   showTotal: (total) => `Showing 1-10 of ${total} jobs`,
          // }}
        // size="middle"
        />
      </main>
    </div>
  )
}

// Helper Components
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card size="small">
      <div className="flex items-center gap-4">
        <div style={{ background: "rgba(10, 110, 133, 0.1)", padding: "0.3rem 1px", borderRadius: "50%", width: "40px", height: "40px", textAlign: "center" }}>
          <div style={{ color: "#0a6e85", fontSize: "1.2rem", textAlign: "center" }}>{icon}</div>
        </div>
        <div>
          <div style={{ fontSize: "14px", color: "#8c8c8c" }}>{title}</div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>{value}</div>
        </div>
      </div>
    </Card>
  )
}

// Sample data
const jobsData = [
  {
    id: 1,
    clientName: "Elite Consulting Services",
    jobNumber: "J000379",
    jobName: "Annual Financial Statements",
    type: "Annuals",
    category: "High",
    allocatedTo: "Angelina Barratt",
    allocationDate: "2-04-2025",
    assignedTo: "Manish",
    status: "hold",
  },
 
  {
    id: 2,
    clientName: "Elite Consulting Services",
    jobNumber: "J000384",
    jobName: "Income Tax Return",
    type: "Tax Return",
    category: "High",
    allocatedTo: "Angelina Barratt",
    allocationDate: "15-04-2025",
    assignedTo: "Manish",
    status: "query",
  },
 
  {
    id: 3,
    clientName: "Elite Consulting Services",
    jobNumber: "J000371",
    jobName: "Account Reconciliation",
    type: "Compliance",
    category: "High",
    allocatedTo: "Angelina Barratt",
    allocationDate: "20-04-2025",
    assignedTo: "Sandeep",
    status: "ready",
  },
 
  {
 
    id: 4,
    clientName: "Elite Consulting Services",
    jobNumber: "J000429",
    jobName: "Management Reporting",
    type: "Management Accounts",
    category: "High",
    allocatedTo: "Angelina Barratt",
    allocationDate: "9-04-2025",
    assignedTo: "Sandeep",
    status: "review",
  },
 
  {
    id: 5,
    clientName: "Elite Consulting Services",
    jobNumber: "J000406",
    jobName: "GST Return",
    type: "GST",
    category: "High",
    allocatedTo: "Angelina Barratt",
    allocationDate: "25-03-2025",
    assignedTo: "Manish",
     status: "completed",
  },
 
]
 
 