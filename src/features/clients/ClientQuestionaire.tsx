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
} from "@ant-design/icons"
import { Button, Input, Progress, Badge, Tooltip, Card, Tabs, Divider, Space, Typography, Tag, message } from "antd"
import ClientQuestionnaireRespondModel from "./ClientQuestionnaireRespondModel"
// import { useLocation } from "react-router-dom"

interface FileObject {
  name: string;
  category: string;
  explanation: string;
}

interface TableRow {
  description: string;
  amount: string;
  accountCode: string;
}

interface Question {
  id: string;
  number: string;
  text: string;
  type: "yesno" | "file" | "table" | "text";
  answered: boolean;
  answer?: string; // for yesno
  textAnswer?: string; // for text
  status: "draft" | "posted" | "unanswered";
  submittedDate?: string;
  submittedBy?: string;
  files: FileObject[];
  tableData?: TableRow[];
  progress: number; // Added progress field (optional to maintain compatibility)
}

interface QuestionnaireSection {
  id: string;
  name: string;
  progress: number;
  status: "completed" | "partial" | "pending";
  questions: Question[];
}

const { Text, Title, Paragraph } = Typography

const ClientQuestionaire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null) // Changed to any to maintain compatibility
  const [activeTab, setActiveTab] = useState("all")
  // Added state for sections to enable state management
  const [questionnaireSections, setQuestionnaireSections] = useState<QuestionnaireSection[]>([
    {
      id: "trading",
      name: "Trading Information",
      progress: 100,
      status: "completed",
      questions: [
        {
          id: "q1",
          number: "1.1",
          text: "Has this entity traded in the financial year?",
          type: "yesno",
          answered: true,
          answer: "Yes",
          status: "unanswered",
          progress: 0, // Added progress field
          submittedDate: "12 April 20XX",
          submittedBy: "John Doe",
          files: [],
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
          number: "2.1",
          text: "Attach a copy of each bank statement showing the closing balance as at 31 March 20xx.",
          type: "file",
          answered: true,
          status: "draft",
          progress: 50, // Added progress field
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
          number: "3.1",
          text: "Upload the loan statements / summaries showing interest and principal payments breakdown details from 1 April 20xx to 31 March 20xx.",
          type: "file",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
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
          number: "4.1",
          text: "Upload invoices/summary of any accounts payable as at 31 March 20xx.",
          type: "table",
          answered: true,
          status: "draft",
          progress: 50, // Added progress field
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
        },
      ],
    },
    {
      id: "accounts-receivable",
      name: "Accounts Receivable",
      progress: 0,
      status: "pending",
      questions: [
        {
          id: "q5",
          number: "5.1",
          text: "Upload invoices/summary of any accounts receivable as at 31 March 20xx.",
          type: "table",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
    {
      id: "assets",
      name: "Asset and Investments",
      progress: 33,
      status: "partial",
      questions: [
        {
          id: "q6",
          number: "6.1",
          text: "Were any assets or investments purchased during the year?",
          type: "yesno",
          answered: true,
          answer: "Yes",
          status: "draft",
          progress: 50, // Added progress field
          files: [
            {
              name: "new-equipment-invoice.pdf",
              category: "Asset Purchase",
              explanation: "New office equipment purchased in December",
            },
          ],
          tableData: [
            { description: "Office Equipment", amount: "$5,200.00", accountCode: "1400 - Property, Plant & Equipment" },
          ],
        },
        {
          id: "q7",
          number: "6.2",
          text: "Were any assets or investments sold during the year?",
          type: "yesno",
          answered: true,
          answer: "No",
          status: "draft",
          progress: 50, // Added progress field
          files: [],
        },
        {
          id: "q8",
          number: "6.3",
          text: "Were any assets or investments scrapped or written off during the year?",
          type: "yesno",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
    {
      id: "vehicle",
      name: "Vehicle Expense",
      progress: 0,
      status: "pending",
      questions: [
        {
          id: "q9",
          number: "7.1",
          text: "Was the business vehicle used or available for private use during the period 1 April 20xx to 31 March 20xx.",
          type: "yesno",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
        {
          id: "q10",
          number: "7.2",
          text: "Do you have a vehicle logbook that was completed for any three months period over the last three years?",
          type: "yesno",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
    {
      id: "home-office",
      name: "Home Office",
      progress: 0,
      status: "pending",
      questions: [
        {
          id: "q11",
          number: "8.1",
          text: "Did you use a personal home for business purposes during the period?",
          type: "yesno",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
    {
      id: "expenses-1000",
      name: "Expenses Over $1,000",
      progress: 0,
      status: "pending",
      questions: [
        {
          id: "q12",
          number: "9.1",
          text: "Attach invoices for expenses over $1000 paid during the FYxx. Also provide description of nature of work undertaken.",
          type: "table",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
    {
      id: "expenses-personal",
      name: "Expenses paid personally",
      progress: 0,
      status: "pending",
      questions: [
        {
          id: "q13",
          number: "10.1",
          text: "Provide details of expenses which are related to business but not paid from your business bank accounts.",
          type: "table",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
    {
      id: "other",
      name: "Other Information",
      progress: 20,
      status: "partial",
      questions: [
        {
          id: "q14",
          number: "11.1",
          text: "Attach donation receipts from 1 April 2023 to 31 March 2024, if any",
          type: "file",
          answered: true,
          status: "posted",
          progress: 100, // Added progress field
          submittedDate: "10 April 20XX",
          submittedBy: "John Doe",
          files: [
            {
              name: "red-cross-donation.pdf",
              category: "Donation Receipt",
              explanation: "Annual donation to Red Cross",
            },
          ],
        },
        {
          id: "q15",
          number: "11.2",
          text: "Advise the number of income earning days from 1 April 20xx to 31 March 20xx.",
          type: "text",
          answered: true,
          status: "draft",
          progress: 50, // Added progress field
          textAnswer: "245 days",
          files: [],
        },
        {
          id: "q16",
          number: "11.3",
          text: "Advise the number of days used privately for yourself, family and friends from 1 April 20xx to 31 March 20xx.",
          type: "text",
          answered: true,
          status: "draft",
          progress: 50, // Added progress field
          textAnswer: "120 days",
          files: [],
        },
        {
          id: "q17",
          number: "11.4",
          text: "Attach property manager summaries from 1 April 20xx to 31 March 20xx for the property.",
          type: "file",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
        {
          id: "q18",
          number: "11.5",
          text: "Attach a copy of your Portfolio Manager for FY20xx.",
          type: "file",
          answered: false,
          status: "unanswered",
          progress: 0, // Added progress field
          files: [],
        },
      ],
    },
  ])

  // Questionnaire metadata
  const questionnaireInfo = {
    clientName: " Sample Client",
    type: "General Questionnaire",
    fiscalYear: "1 April 20XX to 31 March 20XX",
    dueDate: "30 April 20XX",
    assignedManager: "Jane Smith",
    status: "In Progress",
    lastUpdated: "15 April 20XX",
  }

  // Calculate statistics
  const totalQuestions = questionnaireSections.reduce((acc, section) => acc + section.questions.length, 0)

  const unansweredQuestions = questionnaireSections.reduce((acc, section) => {
    return acc + section.questions.filter((q) => q.status === "unanswered").length;
  }, 0);
  const draftQuestions = questionnaireSections.reduce((acc, section) => {
    return acc + section.questions.filter((q) => q.status === "draft").length;
  }, 0);
  const postedQuestions = questionnaireSections.reduce((acc, section) => {
    return acc + section.questions.filter((q) => q.status === "posted").length;
  }, 0);

  const overallProgress = Math.round(((draftQuestions + postedQuestions) / totalQuestions) * 100)

  // Added new handler functions for state management
  const handleSaveAllDrafts = () => {
    const hasDraftableQuestions = questionnaireSections.some(section =>
      section.questions.some(q => q.status === "unanswered" && q.answered)
    )

    if (!hasDraftableQuestions) {
      message.warning("No pending questions to save as drafts")
      return
    }

    setQuestionnaireSections(prevSections => {
      return prevSections.map(section => ({
        ...section,
        questions: section.questions.map(question => {
          if (question.status === "unanswered" && question.answered) {
            return {
              ...question,
              status: "draft",
              progress: 50, // Set progress when saving as draft
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user_control?.name || "Current User",
            }
          }
          return question
        }),
      }))
    })
    message.success("All pending questions saved as drafts")
    setActiveTab("draft") // Switch to draft tab after saving
  }

  const handlePostAllDrafts = () => {
    const hasDraftQuestions = questionnaireSections.some(section =>
      section.questions.some(q => q.status === "draft")
    )

    if (!hasDraftQuestions) {
      message.warning("No draft questions to post")
      return
    }

    setQuestionnaireSections(prevSections => {
      return prevSections.map(section => ({
        ...section,
        questions: section.questions.map(question => {
          if (question.status === "draft") {
            return {
              ...question,
              status: "posted",
              progress: 100, // Set progress when posting
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user_control?.name || "Current User",
            }
          }
          return question
        }),
      }))
    })
    message.success("All draft questions posted successfully")
    setActiveTab("posted") // Switch to posted tab after posting
  }

  const handlePostSingleQuestion = (sectionId: string, questionId: string) => {
    setQuestionnaireSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.map(question => {
              if (question.id === questionId && question.status === "draft") {
                return {
                  ...question,
                  status: "posted",
                  progress: 100, // Set progress when posting
                  submittedDate: new Date().toLocaleDateString(),
                  submittedBy: user_control?.name || "Current User",
                }
              }
              return question
            }),
          }
        }
        return section
      })
    })
    message.success("Question posted successfully")
    setActiveTab("posted") // Switch to posted tab after posting
  }

  const handleOpenQuestion = (sectionId: string, questionId: string) => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)
    setSelectedQuestion({ ...(question as any), sectionName: section?.name, sectionId: section?.id })
    setIsModalOpen(true)
  }

  // Added new handler functions for modal actions
  const handleSaveQuestion = (updatedQuestion: any) => {
    setQuestionnaireSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === updatedQuestion.sectionId) {
          return {
            ...section,
            questions: section.questions.map(question => {
              if (question.id === updatedQuestion.id) {
                return {
                  ...question,
                  ...updatedQuestion,
                  answered: true,
                  status: "draft",
                  progress: 50, // Set progress when saving as draft
                  submittedDate: new Date().toLocaleDateString(),
                  submittedBy: user_control?.name || "Current User",
                }
              }
              return question
            }),
          }
        }
        return section
      })
    })
    setIsModalOpen(false)
    setActiveTab("draft") // Switch to draft tab after saving
    message.success("Question saved as draft")
  }

  const handlePostQuestion = (updatedQuestion: any) => {
    setQuestionnaireSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === updatedQuestion.sectionId) {
          return {
            ...section,
            questions: section.questions.map(question => {
              if (question.id === updatedQuestion.id) {
                return {
                  ...question,
                  ...updatedQuestion,
                  answered: true,
                  status: "posted",
                  progress: 100, // Set progress when posting
                  submittedDate: new Date().toLocaleDateString(),
                  submittedBy: user_control?.name || "Current User",
                }
              }
              return question
            }),
          }
        }
        return section
      })
    })
    setIsModalOpen(false)
    setActiveTab("posted") // Switch to posted tab after posting
    message.success("Question posted successfully")
  }

  // Filter questions based on active tab
  const filteredSections = questionnaireSections
    .map((section) => {
      if (activeTab === "all") return section

      return {
        ...section,
        questions: section.questions.filter((q) => {
          if (activeTab === "unanswered") return q.status === "unanswered"
          if (activeTab === "draft") return q.status === "draft"
          if (activeTab === "posted") return q.status === "posted"
          return true
        }),
      }
    })
    .filter((section) => section.questions.length > 0)

  const items = [
    { key: "all", label: `All Questions (${totalQuestions})` },
    { key: "unanswered", label: `Pending (${unansweredQuestions})` },
    { key: "draft", label: `Draft (${draftQuestions})` },
    { key: "posted", label: `Posted (${postedQuestions})` },
  ]
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  // const routerName = useLocation().pathname
  return (
    <div className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "p-4 md:p-6" : ""}`} >
      {/* Header */}
      {/* {(user_control?.role === "client") && (
        <div style={{ background: "rgb(15 91 109)", color: "white", padding: "16px" }} className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-xl font-bold">Sample CA Firm</h1>
            <p style={{ color: "#fff", opacity: 0.8 }}>Portal</p>
            </div>
          <div style={{ width: "320px" }}>
            <Input placeholder="Search files, etc." />
          </div>
       </div>)} */}

      {/* Questionnaire Overview */}
      {/* <div className="dark:bg-gray-900 dark:text-white" style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div style={{ margin: "0 auto", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Title level={4} style={{ marginTop: 0, marginBottom: "4px" }}>
                {questionnaireInfo.type} for {questionnaireInfo.clientName}
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
            </div>
          </div>
        </div>
      </div> */}

      {/* Statistics Dashboard */}
      <div className="dark:bg-gray-900 dark:text-white" style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
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
      <div className="dark:bg-gray-900 dark:text-white"
        style={{
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "8px 24px" }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px" }}>
        <div style={{ margin: "0 auto" }}>
          {filteredSections.map(section => (
            <div key={section.id} style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <Title level={4} style={{ margin: 0 }}>
                  {section.name}
                </Title>
              </div>

              {section.questions.map(question => (
                <div key={question.id} style={{ marginBottom: "16px" }}>

                  <div style={{ position: "relative", padding: "8px 0" }}>

                    <div style={{
                      position: "absolute",
                      top: "-22px",
                      right: "0px",
                      zIndex: 1,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <Progress
                        percent={question.progress}
                        size="small"
                        strokeColor={
                          question.progress === 100
                            ? "#0f766e"
                            : question.progress > 0
                              ? "#faad14"
                              : "#d9d9d9"
                        }
                        style={{ width: '80px' }}
                      />

                      {question.progress === 100 && (
                        <CheckCircleOutlined style={{ fontSize: "16px", color: "#0f766e" }} />
                      )}
                      {question.progress > 0 && question.progress < 100 && (
                        <ClockCircleOutlined style={{ fontSize: "16px", color: "#faad14" }} />
                      )}
                      {question.progress === 0 && (
                        <ExclamationCircleOutlined style={{ fontSize: "16px", color: "#d9d9d9" }} />
                      )}
                    </div>
                    <Card>
                      <div style={{ padding: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <Paragraph style={{ margin: 0 }}>
                              <Text strong>{question.number}</Text> {question.text}
                            </Paragraph>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                              <Badge
                                status={
                                  question.progress === 100
                                    ? "success"
                                    : question.progress > 0
                                      ? "warning"
                                      : "default"
                                }
                                text={
                                  question.progress === 100
                                    ? "Posted"
                                    : question.progress > 0
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

                              {/* Submission info for posted questions */}
                              {question.progress === 100 && (
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
                                    <CalendarOutlined style={{ marginRight: "4px", fontSize: "12px" }} />
                                    Submitted: {question?.submittedDate}
                                  </div>
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
                            {question.progress === 100 ? (
                              <Button icon={<EyeOutlined />} onClick={() => handleOpenQuestion(section.id, question.id)}>
                                View Only
                              </Button>
                            ) : question.progress > 0 ? (
                              <>
                                <Button
                                  icon={<EditOutlined />}
                                  onClick={() => handleOpenQuestion(section.id, question.id)}
                                >
                                  Edit Draft
                                </Button>
                                <Button
                                  disabled={user_control.role !== "client"}
                                  type="primary"
                                  icon={<CheckCircleOutlined />}
                                  style={{
                                    background: "#0f766e",
                                    color: user_control.role !== "client" ? "#d9d9d9" : "#fff",
                                  }}
                                  onClick={() => handlePostSingleQuestion(section.id, question.id)}
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
                        {question.progress === 0 ? (
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
                                <div style={{ marginTop: "4px", padding: "8px", borderRadius: "4px" }}>
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
                                          <td className="dark:bg-gray-900 dark:text-white" style={{ padding: "4px 0" }}>
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
                                style={{ marginTop: question.tableData && question.tableData.length > 0 ? "12px" : "0" }}
                              >
                                <Text strong>Files:</Text>
                                <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  {question.files.map((file, idx) => (
                                    <div
                                      key={idx}
                                      style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}
                                    >
                                      <PaperClipOutlined style={{ fontSize: "12px", color: "#bfbfbf" }} />
                                      <Text style={{ color: "#1890ff" }}>{file.name}</Text>
                                      <Tag style={{ fontSize: "small" }}>{file.category}</Tag>
                                      {file.explanation && (
                                        <Tooltip title={file.explanation}>
                                          <InfoCircleOutlined style={{ fontSize: "12px", color: "#bfbfbf" }} />
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
                </div>
              ))}
            </div>
          ))}
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
            <Button
              disabled={user_control.role !== "client" || activeTab !== "unanswered"}
              onClick={handleSaveAllDrafts}
            >
              Save All Drafts
            </Button>
            <Button
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:text-zinc-900"
              disabled={user_control.role !== "client" || activeTab !== "draft"}
              type="primary"
              style={{ background: "#0f766e" }}
              onClick={handlePostAllDrafts}
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
        onSave={handleSaveQuestion}
        onPost={handlePostQuestion}
      />
    </div>
  )
}
export default ClientQuestionaire;





