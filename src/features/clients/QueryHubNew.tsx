import { useState } from "react"
import {
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  FilterOutlined,
} from "@ant-design/icons"
import {
  Button,
  Input,
  Progress,
  Badge,
  Tooltip,
  Card,
  Tabs,
  Divider,
  Space,
  Typography,
  Tag,
  Dropdown,
  Menu,
} from "antd"
import ClientQuestionnaireRespondModel from "./ClientQuestionnaireRespondModel"

interface FileObject {
  name: string
  category: string
  explanation: string
}

interface TableRow {
  description: string
  amount: string
  accountCode: string
}

interface Question {
  id: string
  number: string
  text: string
  type: "yesno" | "file" | "table" | "text"
  answered: boolean
  answer?: string // for yesno
  textAnswer?: string // for text
  status: "draft" | "posted" | "unanswered"
  submittedDate?: string
  submittedBy?: string
  files: FileObject[]
  tableData?: TableRow[]
  date?: string
}

interface QuestionnaireSection {
  id: string
  name: string
  progress: number
  status: "completed" | "partial" | "pending"
  questions: Question[]
}

const { Text, Title, Paragraph } = Typography
const QueryHubNew = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("");


  const questionnaireInfo = {
    clientName: " Sample Client",
    type: "Queries",
    fiscalYear: "1 April 20XX to 31 March 20XX",
    dueDate: "30 April 20XX",
    assignedManager: "Jane Smith",
    status: "In Progress",
    lastUpdated: "15 April 20XX",
  }

  // Add dates to the questions
  const questionnaireSections: QuestionnaireSection[] = [
    {
      id: "trading",
      name: "Trading Information",
      progress: 100,
      status: "completed",
      questions: [
        {
          id: "q1",
          number: "1",
          text: "Please provide the bank statements for January 2024",
          type: "yesno",
          answered: true,
          answer: "Yes",
          status: "posted",
          submittedDate: "12 April 2024",
          submittedBy: "John Doe",
          files: [],
          date: "2024-04-12",
        },
      ],
    },

    {
      id: "bank",
      name: "Bank / Credit Card",
      progress: 75,
      status: "partial",
      questions: [
        {
          id: "q2",
          number: "2",
          text: "Confirm the total revenue amount of $98,750 for January 2024",
          type: "file",
          answered: true,
          status: "draft",
          files: [
            {
              name: "ANZ-statement-march.pdf",
              category: "Bank Statement",
              explanation: "ANZ Business Account closing statement",
            },
            {
              name: "Westpac-statement-march.pdf",
              category: "Bank Statement",
              explanation: "Westpac Savings Account closing statement",
            },
          ],
        },
      ],
    },

    {
      id: "loans",
      name: "Loans",
      progress: 0,
      status: "pending",
      questions: [
        {
          id: "q3",
          number: "3",
          text: "Please explain the increase in marketing expenses for January 2024",
          type: "file",
          answered: false,
          status: "unanswered",
          submittedDate: "27 April 2024",
          submittedBy: "Alex Johnson",
          files: [],
          date: "2024-04-27",
        },
      ],
    },
    {
      id: "accounts-payable",
      name: "Accounts Payable",
      progress: 50,
      status: "partial",
      questions: [
        {
          id: "q4",
          number: "4",
          text: "Provide details on the new equipment purchase of $12,500",
          type: "table",
          answered: true,
          status: "draft",
          submittedDate: "10 May 2024",
          submittedBy: "Sarah Williams",
          files: [
            {
              name: "accounts-payable-summary.xlsx",
              category: "Accounts Payable",
              explanation: "Summary of all outstanding invoices",
            },
          ],
          tableData: [
            { description: "Office Supplies Ltd", amount: "$1,250.00", accountCode: "6000 - Operating Expenses" },
            { description: "IT Services Co", amount: "$3,500.00", accountCode: "6400 - Professional Fees" },
          ],
          date: "2024-05-10",
        },
      ],
    },
  ]

  // Calculate statistics
  const totalQuestions = questionnaireSections.reduce((acc, section) => acc + section.questions.length, 0)

  const unansweredQuestions = questionnaireSections.reduce((acc, section) => {
    return acc + section.questions.filter((q) => q.status === "unanswered").length
  }, 0)
  const draftQuestions = questionnaireSections.reduce((acc, section) => {
    return acc + section.questions.filter((q) => q.status === "draft").length
  }, 0)
  const postedQuestions = questionnaireSections.reduce((acc, section) => {
    return acc + section.questions.filter((q) => q.status === "posted").length
  }, 0)

  const overallProgress = Math.round(((draftQuestions + postedQuestions) / totalQuestions) * 100)

  const handleOpenQuestion = (sectionId: string, questionId: string) => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)
    setSelectedQuestion({ ...(question as any), sectionName: section?.name })
    setIsModalOpen(true)
  }

  // Get unique dates from questions
  const getUniqueDates = () => {
    const dates: string[] = []
    questionnaireSections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.date && !dates.includes(question.date)) {
          dates.push(question.date)
        }
      })
    })
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }

  const uniqueDates = getUniqueDates()

  const handleDateFilter = (date: string | null) => {
    setSelectedDate(date)
  }

  // Filter questions based on active tab only
  // const filteredSections = questionnaireSections
  //   .map((section) => {
  //     if (activeTab === "all") return section
  //     return {
  //       ...section,
  //       questions: section.questions.filter((q) => {
  //         if (activeTab === "unanswered") return q.status === "unanswered"
  //         if (activeTab === "draft") return q.status === "draft"
  //         if (activeTab === "posted") return q.status === "posted"
  //         return true
  //       }),
  //     }
  //   })
  //   .filter((section) => section.questions.length > 0)
  const filteredSections = questionnaireSections
    .map((section) => {
      if (activeTab === "all") {
        // Filter questions by search query only
        return {
          ...section,
          questions: section.questions.filter((q) => {
            // Check if question matches search
            const query = searchQuery.toLowerCase();

            const matchesSearch =
              q.text.toLowerCase().includes(query) ||
              (q.files &&
                q.files.some(
                  (file) =>
                    file.name.toLowerCase().includes(query) ||
                    (file.category && file.category.toLowerCase().includes(query)) ||
                    (file.explanation && file.explanation.toLowerCase().includes(query))
                ));

            return matchesSearch;
          }),
        };
      }

      // For other activeTab filters, also add search filtering inside questions filter
      return {
        ...section,
        questions: section.questions.filter((q) => {
          // First filter by activeTab status
          let statusMatch = false;
          if (activeTab === "unanswered") statusMatch = q.status === "unanswered";
          else if (activeTab === "draft") statusMatch = q.status === "draft";
          else if (activeTab === "posted") statusMatch = q.status === "posted";
          else statusMatch = true;

          if (!statusMatch) return false;

          // Then filter by search query
          const query = searchQuery.toLowerCase();

          const matchesSearch =
            q.text.toLowerCase().includes(query) ||
            (q.files &&
              q.files.some(
                (file) =>
                  file.name.toLowerCase().includes(query) ||
                  (file.category && file.category.toLowerCase().includes(query)) ||
                  (file.explanation && file.explanation.toLowerCase().includes(query))
              ));

          return matchesSearch;
        }),
      };
    })
    .filter((section) => section.questions.length > 0);

  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const items = [
    { key: "all", label: `All Queries (${totalQuestions})` },
    { key: "unanswered", label: `Pending (${unansweredQuestions})` },
    { key: "draft", label: `Draft (${draftQuestions})` },
    { key: "posted", label: `Posted (${postedQuestions})` },
  ]


  const dateMenu = (
    <Menu>
      {uniqueDates.map((date) => (
        <Menu.Item key={date} onClick={() => handleDateFilter(date)}>
          {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div
      className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "" : ""}`}
    >
      {/* Header */}
      {user_control?.role === "client" && (
        <div
        // style={{ background: "rgb(15 91 109)", color: "white", padding: "16px" }}
        // className="flex justify-between items-center"
        >
          {/* <div>
            <h1 className="text-white text-xl font-bold"></h1>
            <p style={{ color: "#fff", opacity: 0.8 }}></p>
          </div> */}
          {/* <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Input placeholder="Search files, etc." style={{ width: "250px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> */}
          {/* <Text strong style={{ color: "white", whiteSpace: "nowrap", fontSize: "16px" }}> */}
          {/* Mid Job query */}
          {/* </Text> */}
          {/* <Dropdown overlay={dateMenu} trigger={["click"]}>
                <Button
                  icon={<FilterOutlined />}
                  style={{
                    background: selectedDate ? "#0f766e" : undefined,
                    color: selectedDate ? "white" : undefined,
                  }}
                > */}
          {/* {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "May 10"}
                </Button>
              </Dropdown> */}
          {/* </div> */}
          {/* // </div> */}
        </div>
      )}

      {/* Questionnaire Overview */}
      <div
        className="dark:bg-gray-900 dark:text-white"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
        <div style={{ margin: "0 auto", }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* <div>
              <Title level={4} style={{ marginTop: 0, marginBottom: "4px" }}>
                {questionnaireInfo.type}
              </Title>
              <Text type="secondary">{questionnaireInfo.fiscalYear}</Text>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px 48px", marginTop: "16px" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CalendarOutlined style={{ color: "#bfbfbf", marginRight: "8px" }} />
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    Due Date:
                  </Text>
                  <Text strong>{questionnaireInfo.dueDate}</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <UserOutlined style={{ color: "#bfbfbf", marginRight: "8px" }} />
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    Assigned Manager:
                  </Text>
                  <Text strong>{questionnaireInfo.assignedManager}</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ClockCircleOutlined style={{ color: "#bfbfbf", marginRight: "8px" }} />
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    Last Updated:
                  </Text>
                  <Text strong>{questionnaireInfo.lastUpdated}</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: "8px" }} />
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    Status:
                  </Text>
                  <Tag color="warning">{questionnaireInfo.status}</Tag>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <Text type="secondary" style={{ marginBottom: "4px", display: "block" }}>
                Overall Progress
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Progress percent={overallProgress} style={{ width: "160px" }} strokeColor="#0f766e" />
                <Text strong style={{ fontSize: "18px", color: "#0f766e" }}>
                  {overallProgress}%
                </Text>
              </div>
              <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
                {draftQuestions + postedQuestions} of {totalQuestions} questions answered
              </Text>
            </div> */}
          </div>
        </div>
      </div>


      {/* Sticky Top-Right Filter */}
      <div
        style={{
          position: "sticky",
          top: 0,
          right: 0,
          zIndex: 20,
          background: "white",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          float: "right",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          borderRadius: "0 0 0 8px",
          marginLeft: "auto",
          marginBottom: "8px",
          minWidth: "fit-content",
        }}
      >
        <span style={{ whiteSpace: "nowrap", fontWeight: 500 }}>Mid Job query</span>
        <Dropdown overlay={dateMenu} trigger={["click"]}>
          <Button
            icon={<FilterOutlined />}
            style={{
              background: selectedDate ? "#0f766e" : undefined,
              color: selectedDate ? "white" : undefined,
            }}
          >
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
              : "Filter Date"}
          </Button>
        </Dropdown>
      </div>

      {/* Statistics Dashboard */}
      <div
        className="dark:bg-gray-900 dark:text-white"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            <Card bordered={false} style={{ borderLeft: "4px solid #d9d9d9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text type="secondary">Pending</Text>
                  <Title level={2} style={{ margin: "4px 0" }}>
                    {unansweredQuestions}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {Math.round((unansweredQuestions / totalQuestions) * 100)}% of total
                  </Text>
                </div>
                <ExclamationCircleOutlined style={{ fontSize: "32px", color: "#d9d9d9" }} />
              </div>
            </Card>
            <Card bordered={false} style={{ borderLeft: "4px solid #faad14" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text type="secondary">Draft</Text>
                  <Title level={2} style={{ margin: "4px 0" }}>
                    {draftQuestions}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {Math.round((draftQuestions / totalQuestions) * 100)}% of total
                  </Text>
                </div>
                <ClockCircleOutlined style={{ fontSize: "32px", color: "#faad14" }} />
              </div>
            </Card>
            <Card bordered={false} style={{ borderLeft: "4px solid #52c41a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text type="secondary">Posted</Text>
                  <Title level={2} style={{ margin: "4px 0" }}>
                    {postedQuestions}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {Math.round((postedQuestions / totalQuestions) * 100)}% of total
                  </Text>
                </div>
                <CheckCircleOutlined style={{ fontSize: "32px", color: "#52c41a" }} />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{

          padding: "8px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // You can also increase gap here if needed
          // gap: "48px", 
        }}
      >
        {/* Left side: Horizontal Tabs */}
        <div
          style={{
            flex: "1 1 auto",
            marginRight: "48px"  // <-- increased margin between left and right
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
          />
          {selectedDate && (
            <Tag
              color="#0f766e"
              closable
              onClose={() => handleDateFilter(null)}
              style={{ marginTop: "8px", display: "inline-block" }}
            >
              Date:{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Tag>
          )}
        </div>
        {/* Right side: Search bar, text, filter button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexShrink: 0,
            flexWrap: "nowrap",
          }}
        >
          <Input
            placeholder="Search Queries, etc."
            style={{ width: "250px", minWidth: "200px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
          <div>
          </div>
        </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px" }}>
          <div style={{ margin: "0 auto" }}>
            {filteredSections.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "48px 0" }}>
                <Text type="secondary" style={{ fontSize: "18px" }}>
                  No data found
                </Text>
              </div>
            ) : (
              filteredSections.map((section) => (
                <div key={section.id} style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Title level={4} style={{ margin: 0 }}>
                      {section.name}
                    </Title>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Progress
                        percent={section.progress}
                        style={{ width: "128px" }}
                        size="small"
                        strokeColor="#0f766e"
                        showInfo={false}
                      />
                      {/* <Text strong>{section.progress}%</Text> */}
                      {section.status === "completed" && (
                        <CheckCircleOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
                      )}
                      {section.status === "partial" && (
                        <ClockCircleOutlined style={{ fontSize: "20px", color: "#faad14" }} />
                      )}
                      {section.status === "pending" && (
                        <ExclamationCircleOutlined style={{ fontSize: "20px", color: "#d9d9d9" }} />
                      )}
                    </div>
                  </div>

                  {/* {section.questions.map((question) => (
                <div key={question.id} style={{ marginBottom: "16px" }}>
                  <Card
                    style={{
                      borderLeft: 
                      selectedDate && question.date === selectedDate ? "4px solid #0f766e" : undefined,
              }}
              > */}
                  {section.questions
                    .filter((question) => !selectedDate || question.date === selectedDate)
                    .map((question) => (
                      <div key={question.id} style={{ marginBottom: "16px" }}>
                        <Card
                          style={{
                            borderLeft:
                              selectedDate && question.date === selectedDate ? "4px solid #0f766e" : undefined,
                          }}
                        >
                          <div style={{ padding: "8px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <Paragraph>
                                  <Text strong>{question.number}</Text> {question.text}
                                </Paragraph>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: "8px",
                                  }}
                                >
                                  <Badge
                                    status={
                                      question.status === "posted"
                                        ? "success"
                                        : question.status === "draft"
                                          ? "warning"
                                          : "default"
                                    }
                                    text={
                                      question.status === "posted"
                                        ? "Posted"
                                        : question.status === "draft"
                                          ? "Draft"
                                          : "Unanswered"
                                    }
                                  />
                                  <Text type="secondary" style={{ fontSize: "12px" }}>
                                    {question.type === "yesno" && "Yes/No Question"}
                                    {question.type === "file" && "File Upload"}
                                    {question.type === "text" && "Text Response"}
                                    {question.type === "table" && "Tabular Data"}
                                  </Text>

                                  {/* Date display for all questions */}
                                  <Text type="secondary" style={{ fontSize: "12px" }}>
                                    |
                                  </Text>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "12px",
                                      color:
                                        selectedDate && question.date === selectedDate
                                          ? "#0f766e"
                                          : "rgba(0, 0, 0, 0.45)",
                                      fontWeight:
                                        selectedDate && question.date === selectedDate ? "bold" : "normal",
                                    }}
                                  >
                                    <CalendarOutlined style={{ marginRight: "4px", fontSize: "12px" }} />
                                    {question.date
                                      ? new Date(question.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                      : "No date"}
                                  </div>

                                  {/* Submission info for posted questions */}
                                  {question.status === "posted" && (
                                    <>
                                      <Text type="secondary" style={{ fontSize: "12px" }}>
                                        |
                                      </Text>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          fontSize: "12px",
                                          color: "rgba(0, 0, 0, 0.45)",
                                        }}
                                      >
                                        <UserOutlined style={{ marginRight: "4px", fontSize: "12px" }} />
                                        By: {question.submittedBy}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Action buttons moved to the top right */}
                              <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                                {question.status === "posted" ? (
                                  <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handleOpenQuestion(section.id, question.id)}
                                  >
                                    View Only
                                  </Button>
                                ) : question.status === "draft" ? (
                                  <>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => handleOpenQuestion(section.id, question.id)}
                                    >
                                      {user_control.role === "client" ? "Edit Draft" : "View Draft"}
                                    </Button>
                                    <Button
                                      disabled={user_control.role !== "client"}
                                      type="primary"
                                      icon={<CheckCircleOutlined />}
                                      style={{
                                        background: "#0f766e",
                                        color: user_control.role !== "client" ? "#d9d9d9" : "#fff",
                                      }}
                                    >
                                      Post
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    disabled={user_control.role !== "client"}
                                    icon={<EditOutlined />}
                                    onClick={() => handleOpenQuestion(section.id, question.id)}
                                  >
                                    Answer
                                  </Button>
                                )}
                              </div>
                            </div>

                            <Divider style={{ margin: "12px 0" }} />

                            {/* Answer content */}
                            {!question.answered ? (
                              <Text type="secondary" italic>
                                No response provided yet
                              </Text>
                            ) : (
                              <div style={{ fontSize: "14px" }} className="dark:bg-gray-900 dark:text-white">
                                {/* Yes/No Answer */}
                                {question.type === "yesno" && question.answer && (
                                  <div className="dark:bg-gray-900 dark:text-white">
                                    <Text strong>Answer:</Text> {question.answer}
                                  </div>
                                )}

                                {/* Text Answer */}
                                {question.type === "text" && question.textAnswer && (
                                  <div>
                                    <Text strong>Response:</Text> {question.textAnswer}
                                  </div>
                                )}

                                {/* Tabular Data */}
                                {question.tableData && question.tableData.length > 0 && (
                                  <div className="dark:bg-gray-900 dark:text-white">
                                    <Text strong>Data:</Text>
                                    <div
                                      style={{ marginTop: "4px", padding: "8px", borderRadius: "4px" }}
                                    >
                                      <table
                                        className="dark:bg-gray-900 dark:text-white"
                                        style={{ width: "100%", fontSize: "14px" }}
                                      >
                                        <thead>
                                          <tr
                                            className="dark:bg-gray-900 dark:text-white"
                                            style={{ textAlign: "left", fontSize: "12px" }}
                                          >
                                            <th style={{ paddingBottom: "4px" }}>Description</th>
                                            <th style={{ paddingBottom: "4px" }}>Amount</th>
                                            <th style={{ paddingBottom: "4px" }}>Account Code</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {question.tableData.map((row, idx) => (
                                            <tr key={idx} style={{ borderTop: "1px solid #f0f0f0" }}>
                                              <td style={{ padding: "4px 0" }}>{row.description}</td>
                                              <td style={{ padding: "4px 0", fontWeight: 500 }}>{row.amount}</td>
                                              <td
                                                className="dark:bg-gray-900 dark:text-white"
                                                style={{ padding: "4px 0" }}
                                              >
                                                {row.accountCode}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* Files */}
                                {question.files && question.files.length > 0 && (
                                  <div
                                    style={{
                                      marginTop:
                                        question.tableData && question.tableData.length > 0 ? "12px" : "0",
                                    }}
                                  >
                                    <Text strong>Files:</Text>
                                    <div
                                      style={{
                                        marginTop: "4px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                      }}
                                    >
                                      {question.files.map((file, idx) => (
                                        <div
                                          key={idx}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          <PaperClipOutlined
                                            style={{ fontSize: "12px", color: "#bfbfbf" }}
                                          />
                                          <Text style={{ color: "#1890ff" }}>{file.name}</Text>
                                          <Tag style={{ fontSize: "small" }}>{file.category}</Tag>
                                          {file.explanation && (
                                            <Tooltip title={file.explanation}>
                                              <InfoCircleOutlined
                                                style={{ fontSize: "12px", color: "#bfbfbf" }}
                                              />
                                            </Tooltip>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px",
            background: "white",
            borderTop: "1px solid #f0f0f0",
            boxShadow: "0 -1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text type="secondary">
                {draftQuestions + postedQuestions} of {totalQuestions} questions answered ({overallProgress}% complete)
              </Text>
            </div>
            <Space>
              <Button disabled={user_control.role !== "client"}>Save All Drafts</Button>
              <Button
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:text-zinc-900"
                disabled={user_control.role !== "client"}
                type="primary"
                style={{ background: "#0f766e" }}
              >
                Post All Drafts
              </Button>
            </Space>
          </div>
        </div>

        {/* Respond Modal */}
        <ClientQuestionnaireRespondModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          question={selectedQuestion}
        />
      </div>
      )
}

      export default QueryHubNew
