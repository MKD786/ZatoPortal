import { useState, useEffect } from "react"
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
  ArrowLeftOutlined,
  DeleteOutlined,
  CloseOutlined,
  PlusOutlined,
  WarningOutlined,
  LinkOutlined,
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
  Modal,
  Upload,
  Radio,
} from "antd"

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

interface UploadFile {
  uid: string
  name: string
  status?: string
  url?: string
}

interface QueryItem {
  id: string
  number: string
  description: string
  type: "yesno" | "file" | "table" | "text"
  answered: boolean
  answer?: string
  textAnswer?: string
  status: "draft" | "posted" | "unanswered"
  submittedDate?: string
  submittedBy?: string
  files: FileObject[]
  tableData?: TableRow[]
  raisedDate: string
  dueDate: string
  urgency: { status: string; color: string }
  index: number
  sectionName: string
  total?: number
}

const { Text, Title, Paragraph } = Typography
const { TextArea } = Input

const ClientQuestionaire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPenModalOpen, setIsPenModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState<QueryItem | null>(null)
  const [response, setResponse] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [currentQueryIndex, setCurrentQueryIndex] = useState(0)
  const [allQueries, setAllQueries] = useState<QueryItem[]>([])
  const [unansweredQueries, setUnansweredQueries] = useState<QueryItem[]>([])
  const [currentPenQuestionIndex, setCurrentPenQuestionIndex] = useState(0)

  const questionnaireInfo = {
    clientName: " Sample Client",
    type: "General Questionnaire",
    fiscalYear: "1 April 20XX to 31 March 20XX",
    dueDate: "30 April 20XX",
    assignedManager: "Jane Smith",
    status: "In Progress",
    lastUpdated: "15 April 20XX",
  }

  const questionnaireSections: QuestionnaireSection[] = [
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
          submittedDate: "12 April 20XX",
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
          number: "2.1",
          text: "Attach a copy of each bank statement showing the closing balance as at 31 March 20xx.",
          type: "file",
          answered: true,
          status: "draft",
          files: [
            {
              name: "Westpac-statement-march.pdf",
              category: "Bank Statement",
              explanation: "Westpac Savings Account closing statement",
            },
          ],
          date: "2024-04-15",
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
          files: [],
          date: "2024-04-18",
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
          date: "2024-04-20",
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
          files: [],
          date: "2024-04-22",
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
          date: "2024-04-25",
        },
        {
          id: "q7",
          number: "6.2",
          text: "Were any assets or investments sold during the year?",
          type: "yesno",
          answered: true,
          answer: "No",
          status: "draft",
          files: [],
          date: "2024-04-26",
        },
        {
          id: "q8",
          number: "6.3",
          text: "Were any assets or investments scrapped or written off during the year?",
          type: "yesno",
          answered: false,
          status: "unanswered",
          files: [],
          date: "2024-04-27",
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
          files: [],
          date: "2024-04-28",
        },
        {
          id: "q10",
          number: "7.2",
          text: "Do you have a vehicle logbook that was completed for any three months period over the last three years?",
          type: "yesno",
          answered: false,
          status: "unanswered",
          files: [],
          date: "2024-04-29",
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
          files: [],
          date: "2024-04-30",
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
          files: [],
          date: "2024-05-01",
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
          files: [],
          date: "2024-05-02",
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
          submittedDate: "10 April 20XX",
          submittedBy: "John Doe",
          files: [
            {
              name: "red-cross-donation.pdf",
              category: "Donation Receipt",
              explanation: "Annual donation to Red Cross",
            },
          ],
          date: "2024-05-03",
        },
        {
          id: "q15",
          number: "11.2",
          text: "Advise the number of income earning days from 1 April 20xx to 31 March 20xx.",
          type: "text",
          answered: true,
          status: "draft",
          textAnswer: "245 days",
          files: [],
          date: "2024-05-04",
        },
        {
          id: "q16",
          number: "11.3",
          text: "Advise the number of days used privately for yourself, family and friends from 1 April 20xx to 31 March 20xx.",
          type: "text",
          answered: true,
          status: "draft",
          textAnswer: "120 days",
          files: [],
          date: "2024-05-05",
        },
        {
          id: "q17",
          number: "11.4",
          text: "Attach property manager summaries from 1 April 20xx to 31 March 20xx for the property.",
          type: "file",
          answered: false,
          status: "unanswered",
          files: [],
          date: "2024-05-06",
        },
        {
          id: "q18",
          number: "11.5",
          text: "Attach a copy of your Portfolio Manager for FY20xx.",
          type: "file",
          answered: false,
          status: "unanswered",
          files: [],
          date: "2024-05-07",
        },
      ],
    },
  ]

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

  useEffect(() => {
    const allQueriesArray: QueryItem[] = []
    const unansweredQueriesArray: QueryItem[] = []

    questionnaireSections.forEach((section) => {
      section.questions.forEach((question, idx) => {
        const queryItem: QueryItem = {
          ...question,
          id: question.id || `Q-${2000 + idx + 1}`,
          description: question.text,
          raisedDate: question.date || "2025-04-08",
          dueDate: "2025-04-22",
          urgency: getUrgencyByStatus(question.status),
          index: allQueriesArray.length + 1,
          sectionName: section.name,
        }

        allQueriesArray.push(queryItem)

        if (question.status === "unanswered") {
          unansweredQueriesArray.push({
            ...queryItem,
            index: unansweredQueriesArray.length + 1,
          })
        }
      })
    })

    const updatedAllQueries = allQueriesArray.map((q, idx) => ({
      ...q,
      index: idx + 1,
      total: allQueriesArray.length,
    }))

    // Update the total count for unanswered queries
    const updatedUnansweredQueries = unansweredQueriesArray.map((q, idx) => ({
      ...q,
      index: idx + 1,
      total: unansweredQueriesArray.length,
    }))

    setAllQueries(updatedAllQueries)
    setUnansweredQueries(updatedUnansweredQueries)
  }, [questionnaireSections])

  const getUrgencyByStatus = (status: string) => {
    switch (status) {
      case "unanswered":
        return { status: "Due in 14 ", color: "#4CAF50" }
      case "draft":
        return { status: "In Progress", color: "#FFC107" }
      case "posted":
        return { status: "Completed", color: "#2196F3" }
      default:
        return { status: "Due in 14 ", color: "#4CAF50" }
    }
  }

  const handleOpenQuestion = (sectionId: string, questionId: string) => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)

    if (question && section) {
      setSelectedQuestion({
        ...question,
        sectionName: section.name,
      })

      setFileList([])

      if (question.status === "draft" && question.files && question.files.length > 0) {
        const uploadFiles = question.files.map((file, index) => ({
          uid: `existing-${index}`,
          name: file.name,
          status: "done",
          url: "#", 
        }))
        setFileList(uploadFiles)
      }
      setIsModalOpen(true)
    }
  }

  const handleOpenPenModal = (sectionId: string, questionId: string) => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)

    if (question && section) {
      const questionIndex = allQueries.findIndex((q) => q.id === questionId)

      setCurrentPenQuestionIndex(questionIndex)
      setSelectedQuestion({
        ...question,
        sectionName: section.name,
      })

      if (question.type === "yesno") {
        setResponse(question.answer || "")
      } else if (question.type === "text") {
        setResponse(question.textAnswer || "")
      } else {
        setResponse("")
      }

      setFileList([])

      if (question.files && question.files.length > 0) {
        const uploadFiles = question.files.map((file, index) => ({
          uid: `existing-${index}`,
          name: file.name,
          status: "done",
          url: "#", 
        }))
        setFileList(uploadFiles)
      }

      setIsPenModalOpen(true)
    }
  }

  // Function to navigate to previous question in pen modal
  const handlePreviousPenQuestion = () => {
    if (currentPenQuestionIndex > 0) {
      const prevIndex = currentPenQuestionIndex - 1
      const prevQuestion = allQueries[prevIndex]

      // Find the section for this question
      const section = questionnaireSections.find((s) => s.questions.some((q) => q.id === prevQuestion.id))

      if (section) {
        const question = section.questions.find((q) => q.id === prevQuestion.id)

        if (question) {
          setCurrentPenQuestionIndex(prevIndex)
          setSelectedQuestion({
            ...question,
            sectionName: section.name,
          })

          // Reset response based on question type
          if (question.type === "yesno") {
            setResponse(question.answer || "")
          } else if (question.type === "text") {
            setResponse(question.textAnswer || "")
          } else {
            setResponse("")
          }

          // Reset fileList
          setFileList([])

          // If it has files, add them to fileList
          if (question.files && question.files.length > 0) {
            const uploadFiles = question.files.map((file, index) => ({
              uid: `existing-${index}`,
              name: file.name,
              status: "done",
              url: "#", // Placeholder URL
            }))
            setFileList(uploadFiles)
          }
        }
      }
    }
  }

  // Function to navigate to next question in pen modal
  const handleNextPenQuestion = () => {
    if (currentPenQuestionIndex < allQueries.length - 1) {
      const nextIndex = currentPenQuestionIndex + 1
      const nextQuestion = allQueries[nextIndex]

      // Find the section for this question
      const section = questionnaireSections.find((s) => s.questions.some((q) => q.id === nextQuestion.id))

      if (section) {
        const question = section.questions.find((q) => q.id === nextQuestion.id)

        if (question) {
          setCurrentPenQuestionIndex(nextIndex)
          setSelectedQuestion({
            ...question,
            sectionName: section.name,
          })

          // Reset response based on question type
          if (question.type === "yesno") {
            setResponse(question.answer || "")
          } else if (question.type === "text") {
            setResponse(question.textAnswer || "")
          } else {
            setResponse("")
          }

          // Reset fileList
          setFileList([])

          // If it has files, add them to fileList
          if (question.files && question.files.length > 0) {
            const uploadFiles = question.files.map((file, index) => ({
              uid: `existing-${index}`,
              name: file.name,
              status: "done",
              url: "#", // Placeholder URL
            }))
            setFileList(uploadFiles)
          }
        }
      }
    }
  }

  // Function to handle opening the respond modal
  const handleRespondToQueries = () => {
    if (unansweredQueries.length > 0) {
      // Find the loan statements question (q3) in the unanswered queries
      const loanStatementQuery = unansweredQueries.find((q) => q.id === "q3")

      if (loanStatementQuery) {
        // If the loan statement query exists, show it first
        const indexInAllQueries = allQueries.findIndex((q) => q.id === "q3")

        if (indexInAllQueries !== -1) {
          setCurrentQueryIndex(indexInAllQueries)
          setQuery({
            ...loanStatementQuery,
            index: 1, // Show as first in the unanswered set
            total: unansweredQueries.length,
          })
          setVisible(true)
          setResponse("")
          setFileList([])
          return
        }
      }

      // Fallback to the first unanswered query if loan statement query is not found
      const firstUnansweredQuery = unansweredQueries[0]
      const indexInAllQueries = allQueries.findIndex((q) => q.id === firstUnansweredQuery.id)

      if (indexInAllQueries !== -1) {
        setCurrentQueryIndex(indexInAllQueries)
        setQuery({
          ...firstUnansweredQuery,
          index: 1, // Show as first in the unanswered set
          total: unansweredQueries.length,
        })
        setVisible(true)
        setResponse("")
        setFileList([])
      }
    } else {
      // If there are no unanswered queries, show a message
      alert("There are no unanswered queries to respond to.")
    }
  }

  // Function to navigate to previous query
  const handlePreviousQuery = () => {
    // Only navigate among unanswered queries
    if (query && currentQueryIndex > 0) {
      const prevUnansweredIndex = unansweredQueries.findIndex((q) => q.id === query.id) - 1

      if (prevUnansweredIndex >= 0) {
        const prevQuery = unansweredQueries[prevUnansweredIndex]
        const indexInAllQueries = allQueries.findIndex((q) => q.id === prevQuery.id)

        setCurrentQueryIndex(indexInAllQueries)
        setQuery({
          ...prevQuery,
          index: prevUnansweredIndex + 1,
          total: unansweredQueries.length,
        })
        setResponse("")
        setFileList([])
      }
    }
  }

  // Function to navigate to next query
  const handleNextQuery = () => {
    // Only navigate among unanswered queries
    if (query) {
      const nextUnansweredIndex = unansweredQueries.findIndex((q) => q.id === query.id) + 1

      if (nextUnansweredIndex < unansweredQueries.length) {
        const nextQuery = unansweredQueries[nextUnansweredIndex]
        const indexInAllQueries = allQueries.findIndex((q) => q.id === nextQuery.id)

        setCurrentQueryIndex(indexInAllQueries)
        setQuery({
          ...nextQuery,
          index: nextUnansweredIndex + 1,
          total: unansweredQueries.length,
        })
        setResponse("")
        setFileList([])
      }
    }
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setVisible(false)
    setQuery(null)
    setResponse("")
    setFileList([])
    setIsModalOpen(false)
    setIsPenModalOpen(false)
    setSelectedQuestion(null)
  }

  // Function to calculate elapsed days
  const calculateElapsedDays = (raisedDate: string) => {
    const raised = new Date(raisedDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - raised.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Function to handle submit
  const handleSubmit = () => {
    if (query) {
      // Find the section and question to update
      const sectionIndex = questionnaireSections.findIndex((s) => s.questions.some((q) => q.id === query.id))

      if (sectionIndex !== -1) {
        const questionIndex = questionnaireSections[sectionIndex].questions.findIndex((q) => q.id === query.id)

        if (questionIndex !== -1) {
          // Create a deep copy of the questionnaire sections
          const updatedSections = [...questionnaireSections]

          // Update the question
          updatedSections[sectionIndex].questions[questionIndex] = {
            ...updatedSections[sectionIndex].questions[questionIndex],
            status: "draft",
            answered: true,
            textAnswer: response,
            files: fileList.map((file) => ({
              name: file.name,
              category: "Uploaded File",
              explanation: "",
            })),
          }

          // Here you would typically save to your backend
          // For now, we'll just update the state
          // This is a simplified example - in a real app, you'd update your state management
        }
      }
    }

    // Instead of closing the modal, navigate to the next query if available
    if (query && unansweredQueries.findIndex((q) => q.id === query.id) < unansweredQueries.length - 1) {
      handleNextQuery()
      // Reset response and fileList for the next query
      setResponse("")
      setFileList([])
    } else {
      // If this is the last query, then close the modal
      alert("All queries have been answered!")
      handleCloseModal()
    }
  }

  // Function to handle submit for the new question modal
  const handleQuestionSubmit = (action: "draft" | "post") => {
    if (selectedQuestion) {
      // Here you would typically save to your backend
      // For now, we'll just show an alert
      if (action === "draft") {
        alert("Response saved as draft.")
      } else {
        alert("Response posted successfully!")
      }
      handleCloseModal()
    }
  }

  // Function to handle submit for the pen modal
  const handlePenModalSubmit = (action: "draft" | "post") => {
    if (selectedQuestion) {
      // Here you would typically save to your backend
      // For now, we'll just show an alert
      if (action === "draft") {
        alert("Response saved as draft.")
      } else {
        alert("Response posted successfully!")
      }

      // Navigate to next question if available
      if (currentPenQuestionIndex < allQueries.length - 1) {
        handleNextPenQuestion()
      } else {
        handleCloseModal()
      }
    }
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
    <div
      className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "p-4 md:p-6" : ""}`}
    >
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
        className="dark:bg-gray-900 dark:text-white"
        style={{
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "8px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                color: "#4A5568",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              <Text style={{ whiteSpace: "nowrap" }}>Submitted: Apr 8, 2025</Text>
              <Text style={{ whiteSpace: "nowrap" }}>Due date: Apr 22, 2025</Text>
              <Text style={{ whiteSpace: "nowrap", color: "#4CAF50" }}>Due in 14 days</Text>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Button
                type="primary"
                onClick={handleRespondToQueries}
                style={{
                  background: "#0f766e",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                Respond to Queries
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px" }}>
        <div style={{ margin: "0 auto" }}>
          {filteredSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "32px" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  {section.name}
                </Title>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Progress percent={section.progress} style={{ width: "128px" }} size="small" strokeColor="#0f766e" />
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

              {section.questions.map((question) => (
                <div key={question.id} style={{ marginBottom: "16px" }}>
                  <Card>
                    <div style={{ padding: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <Paragraph>
                            <Text strong>{question.number}</Text> {question.text}
                          </Paragraph>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
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
                          {question.status === "posted" ? (
                            <>
                              <Button
                                icon={<EyeOutlined />}
                                onClick={() => handleOpenQuestion(section.id, question.id)}
                              >
                                View Only
                              </Button>
                              <Button
                                icon={<EditOutlined />}
                                style={{ border: "none", padding: "0 8px" }}
                                onClick={() => handleOpenPenModal(section.id, question.id)}
                              />
                            </>
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
                              <Button
                                icon={<EditOutlined />}
                                style={{ border: "none", padding: "0 8px" }}
                                onClick={() => handleOpenPenModal(section.id, question.id)}
                              />
                            </>
                          ) : (
                            <>
                              <Button
                                disabled={user_control.role !== "client"}
                                icon={<EditOutlined />}
                                onClick={() => handleOpenQuestion(section.id, question.id)}
                              >
                                Answer
                              </Button>
                              <Button
                                icon={<EditOutlined />}
                                style={{ border: "none", padding: "0 8px" }}
                                onClick={() => handleOpenPenModal(section.id, question.id)}
                              />
                            </>
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

      {/* New Question Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        closable={true}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        className="question-modal"
        bodyStyle={{ padding: 0 }}
      >
        {selectedQuestion && (
          <div style={{ borderRadius: "8px", overflow: "hidden" }}>
            {/* Custom header */}
            <div
              style={{
                backgroundColor: "#0F3A47",
                color: "white",
                padding: "0.75rem 1rem",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>
                {selectedQuestion.status === "draft" ? "Edit Draft" : "Answer Question"}
              </h2>
            </div>

            {/* Content area */}
            <div>
              {/* Section and Question Number */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "#f5f5f5",
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                <div>
                  <span style={{ color: "#666", fontSize: "14px" }}>Section:</span>
                  <div style={{ fontWeight: 500 }}>{selectedQuestion.sectionName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>Question Number:</span>
                  <div style={{ fontWeight: 500 }}>{selectedQuestion.number}</div>
                </div>
              </div>

              {/* Question */}
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "14px" }}>Question:</div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    background: "white",
                  }}
                >
                  {selectedQuestion.text}
                </div>
              </div>

              {/* File Attachments */}
              <div style={{ padding: "0 1rem 1rem" }}>
                <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "14px" }}>File Attachments:</div>
                <Upload.Dragger
                  multiple
                  // fileList={fileList}
                  onChange={(info) => setFileList(info.fileList)}
                  style={{ width: "100%" }}
                  accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png"
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <div style={{ padding: "1.5rem 0" }}>
                    <p className="ant-upload-drag-icon" style={{ marginBottom: "8px" }}>
                      <PlusOutlined style={{ fontSize: "24px", color: "#bbb" }} />
                    </p>
                    <p style={{ fontSize: "16px", color: "#666" }}>Drag and drop your files here, or click to browse</p>
                    <p style={{ fontSize: "12px", color: "#999" }}>Supports PDF, Excel, Word, and image files</p>
                    <Button
                      style={{
                        marginTop: "12px",
                        borderColor: "#d9d9d9",
                        color: "#666",
                      }}
                    >
                      Browse Files
                    </Button>
                  </div>
                </Upload.Dragger>

                {/* Uploaded Files */}
                {fileList.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "14px" }}>Uploaded Files:</div>
                    <div>
                      {fileList.map((file) => (
                        <div
                          key={file.uid}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <LinkOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                            <span style={{ color: "#1890ff" }}>{file.name}</span>
                          </div>
                          <div>
                            <Button
                              type="text"
                              icon={<EyeOutlined style={{ color: "green" }} />}
                              style={{ marginRight: "8px" }}
                            />
                            <Button
                              type="text"
                              icon={<DeleteOutlined style={{ color: "red" }} />}
                              onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Draft Notice */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderTop: "1px solid #f0f0f0",
                  background: "#fffbe6",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WarningOutlined style={{ color: "#faad14", marginRight: "8px" }} />
                <span style={{ color: "#d48806", fontSize: "14px" }}>
                  {selectedQuestion.status === "draft"
                    ? "This question is in draft mode. You can edit it multiple times before posting."
                    : "Once you start editing, this question will be saved as a draft."}
                </span>
              </div>

              {/* Footer buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop: "1px solid #E2E8F0",
                  padding: "0.75rem 1.5rem",
                  background: "#FAFAFA",
                }}
              >
                <Button
                  onClick={handleCloseModal}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleQuestionSubmit("draft")}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleQuestionSubmit("post")}
                  style={{
                    backgroundColor: "#0F3A47",
                    color: "white",
                    borderColor: "#0F3A47",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Pen Modal (Respond to Query) */}
      <Modal
        title={null}
        open={isPenModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        closable={true}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        className="pen-modal"
        bodyStyle={{ padding: 0 }}
      >
        {selectedQuestion && (
          <div style={{ borderRadius: "8px", overflow: "hidden" }}>
            {/* Custom header */}
            <div
              style={{
                backgroundColor: "#0F3A47",
                color: "white",
                padding: "0.75rem 1rem",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>Respond to Query</h2>
            </div>

            {/* Navigation bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "#EBF8FF",
                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <div style={{ color: "#4A5568", fontSize: "14px" }}>
                Query {currentPenQuestionIndex + 1} of {allQueries.length}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePreviousPenQuestion}
                  disabled={currentPenQuestionIndex === 0}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#4A5568",
                    borderColor: "#E2E8F0",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    height: "auto",
                  }}
                >
                  <span style={{ marginLeft: "5px" }}>Previous</span>
                </Button>
                <Button
                  onClick={handleNextPenQuestion}
                  disabled={currentPenQuestionIndex === allQueries.length - 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#4A5568",
                    borderColor: "#E2E8F0",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    height: "auto",
                  }}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Content area */}
            <div>
              {/* Section and Question Number */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "#f5f5f5",
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                <div>
                  <span style={{ color: "#666", fontSize: "14px" }}>Section:</span>
                  <div style={{ fontWeight: 500 }}>{selectedQuestion.sectionName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>Question Number:</span>
                  <div style={{ fontWeight: 500 }}>{selectedQuestion.number}</div>
                </div>
              </div>

              {/* Question */}
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "14px" }}>Question:</div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    background: "white",
                  }}
                >
                  {selectedQuestion.text}
                </div>
              </div>

              {/* Response Section */}
              <div style={{ padding: "0 1rem 1rem" }}>
                <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "14px" }}>Your Response:</div>
                {selectedQuestion.type === "yesno" && (
                  <Radio.Group
                    onChange={(e) => setResponse(e.target.value)}
                    value={response}
                    style={{ marginTop: "0.5rem" }}
                  >
                    <Space direction="vertical">
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Space>
                  </Radio.Group>
                )}
                {selectedQuestion.type === "text" && (
                  <TextArea
                    rows={4}
                    placeholder="Enter your response here"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    style={{ marginTop: "0.5rem" }}
                  />
                )}
                {selectedQuestion.type === "file" && (
                  <Upload.Dragger
                    multiple
                    // fileList={fileList}
                    onChange={(info) => setFileList(info.fileList)}
                    style={{ width: "100%" }}
                    accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png"
                    beforeUpload={() => false}
                    showUploadList={false}
                  >
                    <div style={{ padding: "1.5rem 0" }}>
                      <p className="ant-upload-drag-icon" style={{ marginBottom: "8px" }}>
                        <PlusOutlined style={{ fontSize: "24px", color: "#bbb" }} />
                      </p>
                      <p style={{ fontSize: "16px", color: "#666" }}>
                        Drag and drop your files here, or click to browse
                      </p>
                      <p style={{ fontSize: "12px", color: "#999" }}>Supports PDF, Excel, Word, and image files</p>
                      <Button
                        style={{
                          marginTop: "12px",
                          borderColor: "#d9d9d9",
                          color: "#666",
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </Upload.Dragger>
                )}
                {selectedQuestion.type === "table" && (
                  <TextArea
                    rows={4}
                    placeholder="Enter your response here"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    style={{ marginTop: "0.5rem" }}
                  />
                )}

                {/* Uploaded Files */}
                {fileList.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "14px" }}>Uploaded Files:</div>
                    <div>
                      {fileList.map((file) => (
                        <div
                          key={file.uid}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <LinkOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                            <span style={{ color: "#1890ff" }}>{file.name}</span>
                          </div>
                          <div>
                            <Button
                              type="text"
                              icon={<EyeOutlined style={{ color: "green" }} />}
                              style={{ marginRight: "8px" }}
                            />
                            <Button
                              type="text"
                              icon={<DeleteOutlined style={{ color: "red" }} />}
                              onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Draft Notice */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderTop: "1px solid #f0f0f0",
                  background: "#fffbe6",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WarningOutlined style={{ color: "#faad14", marginRight: "8px" }} />
                <span style={{ color: "#d48806", fontSize: "14px" }}>
                  {selectedQuestion.status === "draft"
                    ? "This question is in draft mode. You can edit it multiple times before posting."
                    : "Once you start editing, this question will be saved as a draft."}
                </span>
              </div>

              {/* Footer buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop: "1px solid #E2E8F0",
                  padding: "0.75rem 1.5rem",
                  background: "#FAFAFA",
                }}
              >
                <Button
                  onClick={handleCloseModal}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePenModalSubmit("draft")}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handlePenModalSubmit("post")}
                  style={{
                    backgroundColor: "#0F3A47",
                    color: "white",
                    borderColor: "#0F3A47",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Respond to Queries Modal */}
      <Modal
        title={null}
        open={visible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        closable={false}
        className="respond-modal"
        bodyStyle={{ padding: 0 }}
      >
        {query && (
          <div style={{ borderRadius: "8px", overflow: "hidden" }}>
            {/* Custom header */}
            <div
              style={{
                backgroundColor: "#0F3A47",
                color: "white",
                padding: "1rem 1.5rem",
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>Respond to Query</h2>
              <CloseOutlined
                style={{ color: "white", fontSize: "16px", cursor: "pointer" }}
                onClick={handleCloseModal}
              />
            </div>

            {/* Navigation bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "#EBF8FF",
                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <div style={{ color: "#4A5568", fontSize: "16px" }}>
                Query {query.index} of {query.total}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePreviousQuery}
                  disabled={query.index === 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#4A5568",
                    borderColor: "#E2E8F0",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    height: "auto",
                  }}
                >
                  <span style={{ marginLeft: "5px" }}>Previous</span>
                </Button>
                <Button
                  onClick={handleNextQuery}
                  disabled={query.index === query.total}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#4A5568",
                    borderColor: "#E2E8F0",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    height: "auto",
                  }}
                >
                  Next <ArrowLeftOutlined style={{ marginLeft: "5px", transform: "rotate(180deg)" }} />
                </Button>
              </div>
            </div>

            {/* Content area */}
            <div>
              {/* Query */}
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    marginBottom: "0.5rem",
                    color: "#666",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#E6E6FA",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "8px",
                    }}
                  >
                    <span style={{ color: "#6A5ACD" }}>💬</span>
                  </div>
                  <span style={{ fontWeight: 500 }}>Query</span>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    background: "#F0F8FF",
                    marginBottom: "1.5rem",
                  }}
                >
                  {query.description}
                </div>
              </div>

              {/* File Attachments */}
              <div style={{ padding: "0 1rem 1rem" }}>
                <div
                  style={{
                    marginBottom: "0.5rem",
                    color: "#666",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PaperClipOutlined style={{ marginRight: "8px" }} />
                  <span style={{ fontWeight: 500 }}>Attach Files</span>
                </div>
                <Upload.Dragger
                  multiple
                  fileList={fileList}
                  onChange={(info) => setFileList(info.fileList)}
                  style={{ width: "100%" }}
                  accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png"
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <div style={{ padding: "2rem 0" }}>
                    <div
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "8px" }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "#F5F5F5",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <PlusOutlined style={{ fontSize: "24px", color: "#bbb" }} />
                      </div>
                    </div>
                    <p style={{ fontSize: "16px", color: "#666", textAlign: "center" }}>
                      Drag files here or click to browse
                    </p>
                  </div>
                </Upload.Dragger>

                {/* Uploaded Files */}
                {fileList.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div>
                      {fileList.map((file) => (
                        <div
                          key={file.uid}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <LinkOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                            <span style={{ color: "#1890ff" }}>{file.name}</span>
                          </div>
                          <div>
                            <Button
                              type="text"
                              icon={<DeleteOutlined style={{ color: "red" }} />}
                              onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop: "1px solid #E2E8F0",
                  padding: "0.75rem 1.5rem",
                  background: "#FAFAFA",
                }}
              >
                <Button
                  onClick={handleCloseModal}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => {
                    handleSubmit()
                    alert("Response posted successfully!")
                  }}
                  style={{
                    backgroundColor: "#0F3A47",
                    color: "white",
                    borderColor: "#0F3A47",
                    height: "auto",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ClientQuestionaire
