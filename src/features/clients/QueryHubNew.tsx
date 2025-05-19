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
  FilterOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import {
  Button,
  Input,
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
  Modal,
  Upload,
  Radio,
  Table,
  Progress,
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
  answer?: string 
  textAnswer?: string 
  status: "draft" | "posted" | "unanswered"
  submittedDate?: string
  submittedBy?: string
  files: FileObject[]
  tableData?: TableRow[]
  date?: string
  sectionName?: string
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

const QueryHubNew = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPenModalOpen, setIsPenModalOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [modalMode, setModalMode] = useState<"edit" | "answer" | "view">("edit")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState<QueryItem | null>(null)
  const [response, setResponse] = useState("")
  const [yesNoAnswer, setYesNoAnswer] = useState<string>("")
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [currentQueryIndex, setCurrentQueryIndex] = useState(0)
  const [allQueries, setAllQueries] = useState<QueryItem[]>([])
  const [unansweredQueries, setUnansweredQueries] = useState<QueryItem[]>([])
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [questionnaireSections, setQuestionnaireSections] = useState<QuestionnaireSection[]>([
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
          sectionName: "Trading Information",
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
          sectionName: "Bank / Credit Card",
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
          submittedDate: "27 April 2024",
          submittedBy: "Alex Johnson",
          files: [],
          date: "2024-04-27",
          sectionName: "Loans",
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
          sectionName: "Accounts Payable",
        },
      ],
    },
  ])

  const questionnaireInfo = {
    clientName: " Sample Client",
    type: "Queries",
    fiscalYear: "1 April 20XX to 31 March 20XX",
    dueDate: "30 April 20XX",
    assignedManager: "Jane Smith",
    status: "In Progress",
    lastUpdated: "15 April 20XX",
  }

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

  const handleOpenQuestion = (sectionId: string, questionId: string, mode: "edit" | "answer" | "view") => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)

    if (question) {
      if (mode === "edit" || mode === "answer" || mode === "view") {
        setSelectedQuestion(question)
        setModalMode(mode)
        setIsModalOpen(true)

        if (question.type === "yesno") {
          setYesNoAnswer(question.answer || "")
        } else if (question.type === "file") {
          setFileList(
            question.files.map((file, index) => ({
              uid: `existing-${index}`,
              name: file.name,
              status: "done",
              url: "#",
            })),
          )
        } else if (question.type === "table") {
          setTableData(question.tableData || [])
        } else {
          setResponse(question.textAnswer || "")
        }
      } else {
        const queryItem: QueryItem = {
          ...question,
          id: question.id || `Q-${2000 + Math.floor(Math.random() * 1000)}`,
          description: question.text,
          raisedDate: question.date || "2025-04-08",
          dueDate: "2025-04-22",
          urgency: getUrgencyByStatus(question.status),
          index: 1,
          sectionName: section?.name || "",
          total: 1,
        }

        setQuery(queryItem)
        setVisible(true)
        resetResponseInputs(question.type)
      }
    }
  }

  const resetResponseInputs = (type: string) => {
    setResponse("")
    setYesNoAnswer("")
    setFileList([])
    setTableData([])
  }
const handlePenIconClick = (sectionId: string, questionId: string) => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)

    if (question) {
      setCurrentQuestion(question)
      setIsPenModalOpen(true)
      resetResponseInputs(question.type)
    }
  }
  const handleClosePenModal = () => {
    setIsPenModalOpen(false)
    setCurrentQuestion(null)
    resetResponseInputs("")
  }
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
const filteredSections = questionnaireSections
    .map((section) => {
      const filteredQuestions = section.questions.filter((q) => {
        let statusMatch = false
        if (activeTab === "all") statusMatch = true
        else if (activeTab === "unanswered") statusMatch = q.status === "unanswered"
        else if (activeTab === "draft") statusMatch = q.status === "draft"
        else if (activeTab === "posted") statusMatch = q.status === "posted"
        else statusMatch = true

        if (!statusMatch) return false

        // Search filter
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          q.text.toLowerCase().includes(query) ||
          (q.files &&
            q.files.some(
              (file) =>
                file.name.toLowerCase().includes(query) ||
                (file.category && file.category.toLowerCase().includes(query)) ||
                (file.explanation && file.explanation.toLowerCase().includes(query)),
            ))

        if (!matchesSearch) return false

        // Date filter
        if (selectedDate && q.date !== selectedDate) return false

        return true
      })

      return {
        ...section,
        questions: filteredQuestions,
      }
    })
    .filter((section) => section.questions.length > 0)

  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const user = JSON.parse(sessionStorage.getItem("user") || "{}")

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
        return { status: "Due in 14 days", color: "#4CAF50" }
      case "draft":
        return { status: "In Progress", color: "#FFC107" }
      case "posted":
        return { status: "Completed", color: "#2196F3" }
      default:
        return { status: "Due in 14 days", color: "#4CAF50" }
    }
  }
  const handleRespondToQueries = () => {
    if (unansweredQueries.length > 0) {
      const firstUnansweredIndex = allQueries.findIndex((q) => q.status === "unanswered")

      if (firstUnansweredIndex !== -1) {
        setCurrentQueryIndex(firstUnansweredIndex)
        const currentQuery = allQueries[firstUnansweredIndex]
        setQuery({
          ...currentQuery,
          index: firstUnansweredIndex + 1,
          total: allQueries.length,
        })
        setVisible(true)
        resetResponseInputs(currentQuery.type)
      }
    } else {
      alert("There are no unanswered queries to respond to.")
    }
  }
  const handlePreviousQuery = () => {
    if (currentQueryIndex > 0) {
      const newIndex = currentQueryIndex - 1
      const currentQuery = allQueries[newIndex]
      setCurrentQueryIndex(newIndex)
      setQuery({
        ...currentQuery,
        index: newIndex + 1,
        total: allQueries.length,
      })
      resetResponseInputs(currentQuery.type)
    }
  }
  const handleNextQuery = () => {
    if (currentQueryIndex < allQueries.length - 1) {
      const newIndex = currentQueryIndex + 1
      const currentQuery = allQueries[newIndex]
      setCurrentQueryIndex(newIndex)
      setQuery({
        ...currentQuery,
        index: newIndex + 1,
        total: allQueries.length,
      })
      resetResponseInputs(currentQuery.type)
    }
  }

  const handleCloseModal = () => {
    setVisible(false)
    setQuery(null)
    resetResponseInputs("")
  }

  // Function to close the question modal
  const handleCloseQuestionModal = () => {
    setIsModalOpen(false)
    setSelectedQuestion(null)
    resetResponseInputs("")
  }

  // Function to calculate elapsed days
  const calculateElapsedDays = (raisedDate: string) => {
    const raised = new Date(raisedDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - raised.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Function to update section progress
  const updateSectionProgress = (sectionId: string) => {
    const updatedSections = [...questionnaireSections]
    const sectionIndex = updatedSections.findIndex((s) => s.id === sectionId)

    if (sectionIndex !== -1) {
      const section = updatedSections[sectionIndex]
      const totalQuestions = section.questions.length
      const answeredQuestions = section.questions.filter((q) => q.status === "draft" || q.status === "posted").length

      const progress = Math.round((answeredQuestions / totalQuestions) * 100)

      let status: "completed" | "partial" | "pending" = "pending"
      if (progress === 100) {
        status = "completed"
      } else if (progress > 0) {
        status = "partial"
      }

      updatedSections[sectionIndex] = {
        ...section,
        progress,
        status,
      }

      setQuestionnaireSections(updatedSections)
    }
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
          const sectionId = updatedSections[sectionIndex].id

          // Update the question based on its type
          if (query.type === "yesno") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: "draft",
              answered: true,
              answer: yesNoAnswer,
            }
          } else if (query.type === "file") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: "draft",
              answered: true,
              files: fileList.map((file) => ({
                name: file.name,
                category: "Uploaded File",
                explanation: "",
              })),
            }
          } else if (query.type === "table") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: "draft",
              answered: true,
              tableData: tableData,
            }
          } else {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: "draft",
              answered: true,
              textAnswer: response,
            }
          }

          // Update the state with the modified sections
          setQuestionnaireSections(updatedSections)

          // Update section progress
          setTimeout(() => updateSectionProgress(sectionId), 0)
        }
      }

      alert("Response submitted successfully!")

      // Move to the next query instead of closing the modal
      if (currentQueryIndex < allQueries.length - 1) {
        handleNextQuery()
      } else {
        handleCloseModal()
        alert("All queries have been responded to!")
      }
    }
  }

  const handleQuestionSubmit = (action: "save" | "post") => {
    if (selectedQuestion) {
      const sectionIndex = questionnaireSections.findIndex((s) => s.questions.some((q) => q.id === selectedQuestion.id))

      if (sectionIndex !== -1) {
        const questionIndex = questionnaireSections[sectionIndex].questions.findIndex(
          (q) => q.id === selectedQuestion.id,
        )

        if (questionIndex !== -1) {
          const updatedSections = [...questionnaireSections]
          const sectionId = updatedSections[sectionIndex].id
          const newStatus = action === "save" ? "draft" : "posted"

          if (selectedQuestion.type === "yesno") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              answer: yesNoAnswer,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else if (selectedQuestion.type === "file") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              files: fileList.map((file) => ({
                name: file.name,
                category: "Uploaded File",
                explanation: "",
              })),
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else if (selectedQuestion.type === "table") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              tableData: tableData,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              textAnswer: response,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          }
          setQuestionnaireSections(updatedSections)
          setTimeout(() => updateSectionProgress(sectionId), 0)
        }
      }

      if (action === "save") {
        alert("Response saved as draft.")
      } else {
        alert("Response posted successfully!")
      }
      handleCloseQuestionModal()
    }
  }

  // Function to handle pen modal submit
  const handlePenModalSubmit = (action: "save" | "post") => {
    if (currentQuestion) {
      // Find the section and question to update
      const sectionIndex = questionnaireSections.findIndex((s) => s.questions.some((q) => q.id === currentQuestion.id))

      if (sectionIndex !== -1) {
        const questionIndex = questionnaireSections[sectionIndex].questions.findIndex(
          (q) => q.id === currentQuestion.id,
        )

        if (questionIndex !== -1) {
          // Create a deep copy of the questionnaire sections
          const updatedSections = [...questionnaireSections]
          const sectionId = updatedSections[sectionIndex].id

          // Update the question based on its type and action
          const newStatus = action === "save" ? "draft" : "posted"

          if (currentQuestion.type === "yesno") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              answer: yesNoAnswer,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else if (currentQuestion.type === "file") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              files: fileList.map((file) => ({
                name: file.name,
                category: "Uploaded File",
                explanation: "",
              })),
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else if (currentQuestion.type === "table") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              tableData: tableData,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              answered: true,
              textAnswer: response,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          }

          // Update the state with the modified sections
          setQuestionnaireSections(updatedSections)

          // Update section progress
          setTimeout(() => updateSectionProgress(sectionId), 0)
        }
      }

      if (action === "save") {
        alert("Response saved as draft.")
      } else {
        alert("Response posted successfully!")
      }
      handleClosePenModal()
    }
  }

  // Function to handle post all drafts
  const handlePostAllDrafts = () => {
    const updatedSections = questionnaireSections.map((section) => {
      const updatedQuestions = section.questions.map((question) => {
        if (question.status === "draft") {
          return {
            ...question,
            status: "posted",
            submittedDate: new Date().toISOString().split("T")[0],
            submittedBy: user.name || "Current User",
          }
        }
        return question
      })

      return {
        ...section,
        questions: updatedQuestions,
      }
    })

    setQuestionnaireSections(updatedSections)

    // Update all section progress
    updatedSections.forEach((section) => {
      setTimeout(() => updateSectionProgress(section.id), 0)
    })

    alert("All drafts have been posted successfully!")
  }

  // Render the appropriate input based on question type
  const renderQuestionInput = (type: string, mode: string) => {
    const isViewOnly = mode === "view"

    switch (type) {
      case "yesno":
        return (
          <div style={{ padding: "0 1rem 1rem" }}>
            <Text type="secondary">Answer:</Text>
            <div style={{ marginTop: "0.5rem" }}>
              <Radio.Group value={yesNoAnswer} onChange={(e) => setYesNoAnswer(e.target.value)} disabled={isViewOnly}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </div>
        )

      case "file":
        return (
          <div style={{ padding: "0 1rem 1rem" }}>
            <Text type="secondary">File Attachments:</Text>
            <div
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: "4px",
                marginTop: "0.5rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
              }}
            >
              <div style={{ fontSize: "18px", color: "#d9d9d9", marginBottom: "4px" }}>+</div>
              <div style={{ color: "#666", marginBottom: "8px", fontSize: "13px" }}>Click to browse files</div>
              <Upload
                multiple
                onChange={(info) => {
                  // Only update fileList with files that have been successfully uploaded or are new
                  const newFileList = info.fileList.filter((file) => !file.status || file.status === "done")
                  setFileList(newFileList)
                }}
                beforeUpload={() => false}
                fileList={[]}
                showUploadList={false}
                disabled={isViewOnly}
              >
                <Button size="small" style={{ borderRadius: "4px", fontSize: "12px", height: "24px", padding: "0 8px" }}>
                  Browse Files
                </Button>
              </Upload>
            </div>

            {/* File list displayed below the upload area */}
            {fileList.length > 0 && (
              <div style={{ marginTop: "1rem", padding: "0 0.5rem" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Uploaded Files:
                </Text>
                {fileList.map((file) => (
                  <div
                    key={file.uid}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                      padding: "0.75rem",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PaperClipOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                      <span style={{ color: "#1890ff" }}>{file.name}</span>
                    </div>
                    <div>
                      <Button
                        type="text"
                        icon={<EyeOutlined style={{ color: "#52c41a" }} />}
                        size="small"
                        style={{ marginRight: "8px" }}
                      />
                      {!isViewOnly && (
                        <Button
                          type="text"
                          icon={<DeleteOutlined style={{ color: "#f5222d" }} />}
                          size="small"
                          onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "table":
        return (
          <div style={{ padding: "0 1rem 1rem" }}>
            <Text type="secondary">Tabular Data:</Text>
            <div style={{ marginTop: "0.5rem" }}>
              <Table
                dataSource={tableData}
                columns={[
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                    render: (text, record, index) =>
                      isViewOnly ? (
                        text
                      ) : (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...tableData]
                            newData[index].description = e.target.value
                            setTableData(newData)
                          }}
                        />
                      ),
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    render: (text, record, index) =>
                      isViewOnly ? (
                        text
                      ) : (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...tableData]
                            newData[index].amount = e.target.value
                            setTableData(newData)
                          }}
                        />
                      ),
                  },
                  {
                    title: "Account Code",
                    dataIndex: "accountCode",
                    key: "accountCode",
                    render: (text, record, index) =>
                      isViewOnly ? (
                        text
                      ) : (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...tableData]
                            newData[index].accountCode = e.target.value
                            setTableData(newData)
                          }}
                        />
                      ),
                  },
                ]}
                pagination={false}
                size="small"
              />
              {!isViewOnly && (
                <Button
                  type="dashed"
                  onClick={() => setTableData([...tableData, { description: "", amount: "", accountCode: "" }])}
                  style={{ marginTop: "10px" }}
                >
                  Add Row
                </Button>
              )}
            </div>
          </div>
        )

      case "text":
      default:
        return (
          <div style={{ padding: "0 1rem 1rem" }}>
            <Text type="secondary">Your Response:</Text>
            <div style={{ marginTop: "0.5rem" }}>
              <TextArea
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                disabled={isViewOnly}
              />
            </div>
          </div>
        )
    }
  }

  // Render the appropriate input for the respond modal
  const renderRespondModalInput = (type: string) => {
    switch (type) {
      case "yesno":
        return (
          <div style={{ padding: "0 1rem 0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                color: "#2D3748",
                fontWeight: 500,
              }}
            >
              <span style={{ marginRight: "8px", color: "#718096" }}>✉️</span> Your Response
            </div>
            <Radio.Group
              value={yesNoAnswer}
              onChange={(e) => setYesNoAnswer(e.target.value)}
              style={{ marginTop: "10px" }}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </div>
        )

      case "file":
        return (
          <div style={{ padding: "0 1rem 0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", color: "#2D3748", fontWeight: 500 }}>
                <span style={{ marginRight: "8px", color: "#718096" }}>📎</span>Attach Files
              </div>
            </div>

            {/* File upload area */}
            <div
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: "4px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
              }}
            >
              <div style={{ fontSize: "18px", color: "#d9d9d9", marginBottom: "4px" }}>+</div>
              <div style={{ color: "#666", marginBottom: "8px", fontSize: "13px" }}>Click to browse files</div>
              <Upload
                multiple
                onChange={(info) => {
                  // Only update fileList with files that have been successfully uploaded or are new
                  const newFileList = info.fileList.filter((file) => !file.status || file.status === "done")
                  setFileList(newFileList)
                }}
                beforeUpload={() => false}
                fileList={[]}
                showUploadList={false}
              >
                <Button size="small" style={{ borderRadius: "4px", fontSize: "12px", height: "24px", padding: "0 8px" }}>
                  Browse Files
                </Button>
              </Upload>
            </div>

            {/* File list displayed below the upload area - only show after upload */}
            {fileList.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Uploaded Files:
                </Text>
                {fileList.map((file) => (
                  <div
                    key={file.uid}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                      padding: "0.75rem",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PaperClipOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                      <span style={{ color: "#1890ff" }}>{file.name}</span>
                    </div>
                    <div>
                      <Button
                        type="text"
                        icon={<EyeOutlined style={{ color: "#52c41a" }} />}
                        size="small"
                        style={{ marginRight: "8px" }}
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined style={{ color: "#f5222d" }} />}
                        size="small"
                        onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "table":
        return (
          <div style={{ padding: "0 1rem 0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                color: "#2D3748",
                fontWeight: 500,
              }}
            >
              <span style={{ marginRight: "8px", color: "#718096" }}>✉️</span> Tabular Data
            </div>
            <Table
              dataSource={tableData}
              columns={[
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData]
                        newData[index].description = e.target.value
                        setTableData(newData)
                      }}
                      size="small"
                    />
                  ),
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData]
                        newData[index].amount = e.target.value
                        setTableData(newData)
                      }}
                      size="small"
                    />
                  ),
                },
                {
                  title: "Account Code",
                  dataIndex: "accountCode",
                  key: "accountCode",
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData]
                        newData[index].accountCode = e.target.value
                        setTableData(newData)
                      }}
                      size="small"
                    />
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
            <Button
              type="dashed"
              onClick={() => setTableData([...tableData, { description: "", amount: "", accountCode: "" }])}
              style={{ marginTop: "10px" }}
              size="small"
            >
              Add Row
            </Button>
          </div>
        )

      case "text":
      default:
        return (
          <div style={{ padding: "0 1rem 0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                color: "#2D3748",
                fontWeight: 500,
              }}
            >
              <span style={{ marginRight: "8px", color: "#718096" }}>✉️</span> Your Response
            </div>
            <TextArea
              rows={3}
              placeholder="Type your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #E2E8F0",
                padding: "8px",
                fontSize: "14px",
              }}
            />
          </div>
        )
    }
  }

  return (
    <div
      className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "" : ""}`}
    >
      {/* Header */}
      <div
        className="dark:bg-gray-900 dark:text-white"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
        <div style={{ margin: "0 auto", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Header content can be added here if needed */}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div
        style={{
          position: "absolute",
          top: 66,
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

      {/* Filter Tabs and Search */}
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
                marginBottom: "18px",
                paddingLeft: "25px",
              }}
            >
              <Text style={{ whiteSpace: "nowrap" }}>Submitted: Apr 8, 2025</Text>
              <Text style={{ whiteSpace: "nowrap" }}>Due date: Apr 22, 2025</Text>
              <Text style={{ whiteSpace: "nowrap", color: "#4CAF50" }}>Due in 14 days</Text>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: "18px" }}>
            <Input
              placeholder="Search Queries, etc"
              // prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />
          </div>
        </div>

        {/* Date filter tag */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 8px" }}>
          {selectedDate && (
            <Tag color="#0f766e" closable onClose={() => handleDateFilter(null)} style={{ display: "inline-block" }}>
              Date:{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Tag>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={handleRespondToQueries}
              style={{
                background: "#0f766e",
                height: "36px",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                fontWeight: 500,
                padding: "0 16px",
              }}
            >
              Respond to Queries
            </Button>
          </div>

          {/* No results message */}
          {filteredSections.length === 0 && (
            <div
              style={{
                margin: "40px 0",
                padding: "40px 20px",
                textAlign: "center",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <ExclamationCircleOutlined style={{ fontSize: "24px", color: "#d9d9d9" }} />
              </div>
              <Title level={3} style={{ margin: "0 0 8px", fontWeight: "500", color: "#333" }}>
                No data found
              </Title>
              <Text type="secondary">No questions match the search term "{searchQuery}"</Text>
            </div>
          )}

          {filteredSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "25px" }}>
              {/* Section Header with Name - Simple Text with Progress */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
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
                  <Card
                    style={{
                      borderLeft: selectedDate && question.date === selectedDate ? "4px solid #0f766e" : undefined,
                    }}
                  >
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
                                  selectedDate && question.date === selectedDate ? "#0f766e" : "rgba(0, 0, 0, 0.45)",
                                fontWeight: selectedDate && question.date === selectedDate ? "bold" : "normal",
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
                            <>
                              <Button
                                icon={<EyeOutlined />}
                                onClick={() => handleOpenQuestion(section.id, question.id, "view")}
                              >
                                View Only
                              </Button>
                              <Button
                                icon={<EditOutlined />}
                                style={{ border: "none", padding: "0 8px" }}
                                onClick={() => handlePenIconClick(section.id, question.id)}
                              />
                            </>
                          ) : question.status === "draft" ? (
                            <>
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => handleOpenQuestion(section.id, question.id, "edit")}
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
                                onClick={() => {
                                  // Find the section and question to update
                                  const sectionIndex = questionnaireSections.findIndex((s) => s.id === section.id)
                                  if (sectionIndex !== -1) {
                                    const questionIndex = questionnaireSections[sectionIndex].questions.findIndex(
                                      (q) => q.id === question.id,
                                    )
                                    if (questionIndex !== -1) {
                                      // Create a deep copy of the questionnaire sections
                                      const updatedSections = [...questionnaireSections]

                                      // Update the question status to posted
                                      updatedSections[sectionIndex].questions[questionIndex] = {
                                        ...updatedSections[sectionIndex].questions[questionIndex],
                                        status: "posted",
                                        submittedDate: new Date().toISOString().split("T")[0],
                                        submittedBy: user.name || "Current User",
                                      }

                                      // Update the state with the modified sections
                                      setQuestionnaireSections(updatedSections)

                                      // Update section progress
                                      setTimeout(() => updateSectionProgress(section.id), 0)

                                      alert("Question posted successfully!")
                                    }
                                  }
                                }}
                              >
                                Post
                              </Button>
                              <Button
                                icon={<EditOutlined />}
                                style={{ border: "none", padding: "0 8px" }}
                                onClick={() => handlePenIconClick(section.id, question.id)}
                              />
                            </>
                          ) : (
                            <>
                              <Button
                                disabled={user_control.role !== "client"}
                                icon={<EditOutlined />}
                                onClick={() => handleOpenQuestion(section.id, question.id, "answer")}
                              >
                                Answer
                              </Button>
                              <Button
                                icon={<EditOutlined />}
                                style={{ border: "none", padding: "0 8px" }}
                                onClick={() => handlePenIconClick(section.id, question.id)}
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
              onClick={handlePostAllDrafts}
            >
              Post All Drafts
            </Button>
          </Space>
        </div>
      </div>

      {/* Edit Draft / Answer / View Only Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCloseQuestionModal}
        footer={null}
        width={640}
        closable={false}
        className="question-modal"
        bodyStyle={{ padding: 0 }}
      >
        {selectedQuestion && (
          <div style={{ overflow: "hidden" }}>
            {/* Custom header */}
            <div
              style={{
                backgroundColor: "#0F5B6D",
                color: "white",
                padding: "0.75rem 1rem",
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>
                {modalMode === "edit" ? "Edit Draft" : modalMode === "answer" ? "Answer Question" : "View Question"}
              </h2>
            </div>

            {/* Content area */}
            <div>
              {/* Section and Question Number */}
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Text type="secondary">Section:</Text>
                  <div>{selectedQuestion.sectionName}</div>
                </div>
                <div>
                  <Text type="secondary">Question Number:</Text>
                  <div>{selectedQuestion.number}</div>
                </div>
              </div>

              {/* Question */}
              <div style={{ padding: "1rem" }}>
                <Text type="secondary">Question:</Text>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                  }}
                >
                  {selectedQuestion.text}
                </div>
              </div>

              {/* Render appropriate input based on question type */}
              {renderQuestionInput(selectedQuestion.type, modalMode)}

              {/* Status message */}
              {(modalMode === "edit" || modalMode === "answer") && (
                <div style={{ padding: "0 1rem 1rem", display: "flex", alignItems: "center" }}>
                  <InfoCircleOutlined style={{ color: "#faad14", marginRight: "0.5rem" }} />
                  <span style={{ color: "#faad14", fontSize: "0.875rem" }}>
                    {modalMode === "edit"
                      ? "This question is in draft mode. You can edit it multiple times before posting."
                      : "Once you start editing, this question will be saved as a draft."}
                  </span>
                </div>
              )}

              {/* Footer buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  borderTop: "1px solid #e8e8e8",
                  padding: "0.75rem 1rem",
                  background: "#fafafa",
                }}
              >
                <Button onClick={handleCloseQuestionModal}>Cancel</Button>
                {modalMode !== "view" && (
                  <>
                    <Button onClick={() => handleQuestionSubmit("save")}>Save as Draft</Button>
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#0F5B6D", borderColor: "#0F5B6D" }}
                      onClick={() => handleQuestionSubmit("post")}
                    >
                      Post
                    </Button>
                  </>
                )}
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
        width={450}
        closable={false}
        className="respond-modal"
        bodyStyle={{ padding: 0 }}
      >
        {query && (
          <div style={{ borderRadius: "8px", overflow: "hidden" }}>
            {/* Custom header */}
            <div style={{ backgroundColor: "#0F3A47", color: "white", padding: "0.75rem 1rem", position: "relative" }}>
              <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>Respond to Query</h2>
            </div>

            {/* Content area */}
            <div>
              {/* Query navigation */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #E2E8F0",
                  background: "#EBF8FF",
                  padding: "0.5rem 1rem",
                }}
              >
                <div style={{ color: "#4A5568", fontSize: "14px" }}>
                  Query {query.index} of {query.total}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handlePreviousQuery}
                    disabled={currentQueryIndex === 0}
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
                    disabled={currentQueryIndex === allQueries.length - 1}
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
                    <span style={{ marginRight: "5px" }}>Next</span>
                    <ArrowRightOutlined />
                  </Button>
                </div>
              </div>

              {/* Query content */}
              <div style={{ padding: "0.5rem 1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    color: "#2D3748",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ marginRight: "8px", color: "#718096" }}>💬</span>
                  Query
                </div>
                <div
                  style={{
                    backgroundColor: "#EBF8FF",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    color: "#2D3748",
                  }}
                >
                  {query.description}
                </div>
              </div>

              {/* Render appropriate input based on question type */}
              {renderRespondModalInput(query.type)}

              {/* Footer buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  borderTop: "1px solid #E2E8F0",
                  padding: "0.5rem 1rem",
                  background: "#FAFAFA",
                }}
              >
                <Button
                  onClick={handleCloseModal}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "28px",
                    padding: "0 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    alert("Response saved as draft.")
                    handleCloseModal()
                  }}
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    height: "28px",
                    padding: "0 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "#0F3A47",
                    color: "white",
                    borderColor: "#0F3A47",
                    display: "flex",
                    alignItems: "center",
                    height: "28px",
                    padding: "0 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ marginRight: "5px" }}>✉️</span> Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Pen Icon Modal */}
      <Modal
        title={null}
        open={isPenModalOpen}
        onCancel={handleClosePenModal}
        footer={null}
        width={500}
        closable={false}
        className="pen-modal"
        bodyStyle={{ padding: 0 }}
      >
        {currentQuestion && (
          <div style={{ borderRadius: "8px", overflow: "hidden" }}>
            {/* Header */}
            <div
              style={{
                backgroundColor: "#0F3A47",
                color: "white",
                padding: "0.75rem 1rem",
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>Respond to Query</h2>
            </div>

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 1rem",
                backgroundColor: "#EBF8FF",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div style={{ color: "#4A5568", fontSize: "14px" }}>Query 1 of 1</div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  disabled={true}
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
                  disabled={true}
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
                  <span style={{ marginRight: "5px" }}>Next</span>
                  <ArrowRightOutlined />
                </Button>
              </div>
            </div>

            {/* Query */}
            <div style={{ padding: "1rem 1rem 0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                  color: "#2D3748",
                  fontWeight: 500,
                }}
              >
                <span style={{ marginRight: "8px", color: "#718096" }}>💬</span>
                Query
              </div>
              <div
                style={{
                  backgroundColor: "#EBF8FF",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  color: "#2D3748",
                }}
              >
                {currentQuestion.text}
              </div>
            </div>

            {/* Render appropriate input based on question type */}
            {currentQuestion.type === "yesno" ? (
              <div style={{ padding: "0 1rem 0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    color: "#2D3748",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ marginRight: "8px", color: "#718096" }}>✉️</span> Your Response
                </div>
                <Radio.Group
                  value={yesNoAnswer}
                  onChange={(e) => setYesNoAnswer(e.target.value)}
                  style={{ marginTop: "10px" }}
                >
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </div>
            ) : currentQuestion.type === "file" ? (
              <div style={{ padding: "0 1rem 0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", color: "#2D3748", fontWeight: 500 }}>
                    <span style={{ marginRight: "8px", color: "#718096" }}>📎</span>Attach Files
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                  }}
                >
                  <div style={{ fontSize: "18px", color: "#d9d9d9", marginBottom: "4px" }}>+</div>
                  <div style={{ color: "#666", marginBottom: "8px", fontSize: "13px" }}>Click to browse files</div>
                  <Upload
                    multiple
                    onChange={(info) => {
                      // Only update fileList with files that have been successfully uploaded or are new
                      const newFileList = info.fileList.filter((file) => !file.status || file.status === "done")
                      setFileList(newFileList)
                    }}
                    beforeUpload={() => false}
                    fileList={[]}
                    showUploadList={false}
                  >
                    <Button size="small" style={{ borderRadius: "4px", fontSize: "12px", height: "24px", padding: "0 8px" }}>
                      Browse Files
                    </Button>
                  </Upload>
                </div>

                {/* File list displayed below the upload area - only show after upload */}
                {fileList.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <Text type="secondary" style={{ display: "block", marginBottom: "0.5rem" }}>
                      Uploaded Files:
                    </Text>
                    {fileList.map((file) => (
                      <div
                        key={file.uid}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                          padding: "0.75rem",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "4px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <PaperClipOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                          <span style={{ color: "#1890ff" }}>{file.name}</span>
                        </div>
                        <div>
                          <Button
                            type="text"
                            icon={<EyeOutlined style={{ color: "#52c41a" }} />}
                            size="small"
                            style={{ marginRight: "8px" }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined style={{ color: "#f5222d" }} />}
                            size="small"
                            onClick={() => setFileList(fileList.filter((f) => f.uid !== file.uid))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : currentQuestion.type === "table" ? (
              <div style={{ padding: "0 1rem 0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    color: "#2D3748",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ marginRight: "8px", color: "#718096" }}>✉️</span> Tabular Data
                </div>
                <Table
                  dataSource={tableData}
                  columns={[
                    {
                      title: "Description",
                      dataIndex: "description",
                      key: "description",
                      render: (text, record, index) => (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...tableData]
                            newData[index].description = e.target.value
                            setTableData(newData)
                          }}
                          size="small"
                        />
                      ),
                    },
                    {
                      title: "Amount",
                      dataIndex: "amount",
                      key: "amount",
                      render: (text, record, index) => (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...tableData]
                            newData[index].amount = e.target.value
                            setTableData(newData)
                          }}
                          size="small"
                        />
                      ),
                    },
                    {
                      title: "Account Code",
                      dataIndex: "accountCode",
                      key: "accountCode",
                      render: (text, record, index) => (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...tableData]
                            newData[index].accountCode = e.target.value
                            setTableData(newData)
                          }}
                          size="small"
                        />
                      ),
                    },
                  ]}
                  pagination={false}
                  size="small"
                />
                <Button
                  type="dashed"
                  onClick={() => setTableData([...tableData, { description: "", amount: "", accountCode: "" }])}
                  style={{ marginTop: "10px" }}
                  size="small"
                >
                  Add Row
                </Button>
              </div>
            ) : (
              <div style={{ padding: "0 1rem 0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    color: "#2D3748",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ marginRight: "8px", color: "#718096" }}>✉️</span> Your Response
                </div>
                <TextArea
                  rows={3}
                  placeholder="Type your response here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #E2E8F0",
                    padding: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #E2E8F0",
                padding: "0.75rem 1rem",
                background: "#FAFAFA",
              }}
            >
              <Button
                onClick={handleClosePenModal}
                style={{
                  borderColor: "#E2E8F0",
                  color: "#4A5568",
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => handlePenModalSubmit("save")}
                style={{
                  borderColor: "#E2E8F0",
                  color: "#4A5568",
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
                }}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default QueryHubNew
