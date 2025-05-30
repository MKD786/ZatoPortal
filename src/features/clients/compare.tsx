import { useState, useEffect } from "react"
import { EditOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PaperClipOutlined, InfoCircleOutlined, EyeOutlined, CalendarOutlined, UserOutlined, FilterOutlined, ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Input, Progress, Badge, Tooltip, Card, Tabs, Divider, Space, Typography, Tag, Dropdown, Menu, Modal, Upload, Radio, Table,message, Collapse } from "antd"

interface FileObject {
  name: string
  category: string
  explanation: string
}

interface TableRow {
  description: string
  amount: string
  accountCode: string
  key?: string
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
  progress: number
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
  progress: number
}

// Interface for storing individual question responses
interface QuestionResponse {
  yesNoAnswer: string
  textResponse: string
  fileList: UploadFile[]
  tableData: TableRow[]
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

  const [questionResponses, setQuestionResponses] = useState<Record<string, QuestionResponse>>({})

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
          progress: 100,
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
          progress: 50,
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
          progress: 0,
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
          progress: 63,
        },
      ],
    },
  ])

  // Initialize responses for each question
  useEffect(() => {
    const initialResponses: Record<string, QuestionResponse> = {}

    questionnaireSections.forEach((section) => {
      section.questions.forEach((question) => {
        initialResponses[question.id] = {
          yesNoAnswer: question.answer || "",
          textResponse: question.textAnswer || "",
          fileList: question.files.map((file, index) => ({
            uid: `existing-${index}`,
            name: file.name,
            status: "done",
            url: "#",
          })),
          tableData: question.tableData || [],
        }
      })
    })

    setQuestionResponses(initialResponses)
  }, [])
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

  // Get or initialize response for a question
  const getQuestionResponse = (questionId: string) => {
    if (!questionResponses[questionId]) {
      const question = findQuestionById(questionId)
      if (question) {
        setQuestionResponses((prev) => ({
          ...prev,
          [questionId]: {
            yesNoAnswer: question.answer || "",
            textResponse: question.textAnswer || "",
            fileList: question.files.map((file, index) => ({
              uid: `existing-${index}`,
              name: file.name,
              status: "done",
              url: "#",
            })),
            tableData: question.tableData || [],
          },
        }))
      } else {
        setQuestionResponses((prev) => ({
          ...prev,
          [questionId]: {
            yesNoAnswer: "",
            textResponse: "",
            fileList: [],
            tableData: [],
          },
        }))
      }
    }
    return questionResponses[questionId] || { yesNoAnswer: "", textResponse: "", fileList: [], tableData: [] }
  }

  // Update response for a specific question
  const updateQuestionResponse = (questionId: string, field: keyof QuestionResponse, value: any) => {
    setQuestionResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }))
  }

  // Find a question by ID
  const findQuestionById = (questionId: string): Question | null => {
    for (const section of questionnaireSections) {
      const question = section.questions.find((q) => q.id === questionId)
      if (question) return question
    }
    return null
  }

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
          progress: question.progress,
        }

        setQuery(queryItem)
        setVisible(true)
      }
    }
  }
  const handlePenIconClick = (sectionId: string, questionId: string) => {
    const section = questionnaireSections.find((s) => s.id === sectionId)
    const question = section?.questions.find((q) => q.id === questionId)

    if (question) {
      setCurrentQuestion(question)
      setIsPenModalOpen(true)
      getQuestionResponse(question.id)
    }
  }
  const handleClosePenModal = () => {
    setIsPenModalOpen(false)
    setCurrentQuestion(null)
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

  const handleSaveAllDrafts = () => {
    const updatedSections = [...questionnaireSections]
    let pendingQuestionsCount = 0
    updatedSections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        if (question.status === "unanswered") {
          pendingQuestionsCount++
          const response = getQuestionResponse(question.id)
          updatedSections[sectionIndex].questions[questionIndex] = {
            ...question,
            status: "draft",
            answered: true,
            answer: response.yesNoAnswer,
            textAnswer: response.textResponse,
            files: response.fileList.map((file) => ({
              name: file.name,
              category: "Uploaded File",
              explanation: "",
            })),
            tableData: response.tableData,
            submittedDate: new Date().toISOString().split("T")[0],
            submittedBy: user.name || "Current User",
          }
        }
      })
      const totalSectionQuestions = section.questions.length
      const answeredSectionQuestions = updatedSections[sectionIndex].questions.filter(
        (q) => q.status === "draft" || q.status === "posted",
      ).length
      updatedSections[sectionIndex].progress = Math.round((answeredSectionQuestions / totalSectionQuestions) * 100)
      if (updatedSections[sectionIndex].progress === 100) {
        updatedSections[sectionIndex].status = "completed"
      } else if (updatedSections[sectionIndex].progress > 0) {
        updatedSections[sectionIndex].status = "partial"
      } else {
        updatedSections[sectionIndex].status = "pending"
      }
    })
    setQuestionnaireSections(updatedSections)
    if (pendingQuestionsCount > 0) {
      // message.success(`${pendingQuestionsCount} pending questions saved as drafts successfully!`)
      console.log(`${pendingQuestionsCount} pending questions saved as drafts successfully!`)
    } else {
      // message.info("No pending questions to save as drafts.")
      console.log("No pending questions to save as drafts.")
    }
  }

  const handlePostAllDrafts = () => {
    const updatedSections = [...questionnaireSections]
    let draftQuestionsCount = 0
    updatedSections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        if (question.status === "draft") {
          draftQuestionsCount++
          updatedSections[sectionIndex].questions[questionIndex] = {
            ...question,
            status: "posted",
            submittedDate: new Date().toISOString().split("T")[0],
            submittedBy: user.name || "Current User",
          }
        }
      })
      const totalSectionQuestions = section.questions.length
      const answeredSectionQuestions = updatedSections[sectionIndex].questions.filter(
        (q) => q.status === "draft" || q.status === "posted",
      ).length
      updatedSections[sectionIndex].progress = Math.round((answeredSectionQuestions / totalSectionQuestions) * 100)
      if (updatedSections[sectionIndex].progress === 100) {
        updatedSections[sectionIndex].status = "completed"
      } else if (updatedSections[sectionIndex].progress > 0) {
        updatedSections[sectionIndex].status = "partial"
      } else {
        updatedSections[sectionIndex].status = "pending"
      }
    })
    setQuestionnaireSections(updatedSections)
    if (draftQuestionsCount > 0) {
      message.success(`${draftQuestionsCount} draft questions posted successfully!`)
    } else {
      message.info("No draft questions to post.")
    }
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
          progress: question.progress,
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
        getQuestionResponse(currentQuery.id)
      }
    } else {
      console.log("There are no unanswered queries to respond to.")
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
      getQuestionResponse(currentQuery.id)
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
      getQuestionResponse(currentQuery.id)
    }
  }

  const handleCloseModal = () => {
    setVisible(false)
    setQuery(null)
  }

  // Function to close the question modal
  const handleCloseQuestionModal = () => {
    setIsModalOpen(false)
    setSelectedQuestion(null)
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
  const handleSubmit = (action: "draft" | "post" = "draft") => {
    if (query) {
      // Find the section and question to update
      const sectionIndex = questionnaireSections.findIndex((s) => s.questions.some((q) => q.id === query.id))

      if (sectionIndex !== -1) {
        const questionIndex = questionnaireSections[sectionIndex].questions.findIndex((q) => q.id === query.id)

        if (questionIndex !== -1) {
          // Create a deep copy of the questionnaire sections
          const updatedSections = [...questionnaireSections]
          const sectionId = updatedSections[sectionIndex].id

          // Get the response for this specific question
          const response = getQuestionResponse(query.id)

          // Update the question based on its type
          if (query.type === "yesno") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: action === "post" ? "posted" : "draft",
              progress: action === "post" ? 100 : Math.round((query.progress / 100) * 100), // Set progress based on action
              answered: true,
              answer: yesNoAnswer,
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user.name || "Current User",      
            }
          } else if (query.type === "file") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: action === "post" ? "posted" : "draft",
              progress: action === "post" ? 100 : Math.round((query.progress / 100) * 100), // Set progress based on action
              answered: true,
              files: fileList.map((file) => ({
                name: file.name,
                category: "Uploaded File",
                explanation: "",
              })),
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user.name || "Current User",
            }
          } else if (query.type === "table") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: action === "post" ? "posted" : "draft",
              progress: action === "post" ? 100 : Math.round((query.progress / 100) * 100), // Set progress based on action
              answered: true,
              tableData: tableData,
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user.name || "Current User",
            }
          } else {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: action === "post" ? "posted" : "draft",
              progress: action === "post" ? 100 : Math.round((query.progress / 100) * 100), // Set progress based on action
              answered: true,
              textAnswer: response.textResponse,
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user.name || "Current User",
            }
          }

          // Update the state with the modified sections
          setQuestionnaireSections(updatedSections)

          // Update section progress
          setTimeout(() => updateSectionProgress(sectionId), 0)
        }
      }

      // message.success(`Response ${action === "post" ? "posted" : "saved as draft"} successfully!`)
      console.log(`Response ${action === "post" ? "posted" : "saved as draft"} successfully!`)

      // Move to the next query instead of closing the modal
      if (currentQueryIndex < allQueries.length - 1) {
        handleNextQuery()
      } else {
        // If this is the last query, then close the modal
        // message.success("All queries have been answered!")
        console.log("All queries have been answered!")
        handleCloseModal()
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
          const newProgress = action === "save" ? Math.round((selectedQuestion.progress / 100) * 100) : 100

          if (selectedQuestion.type === "yesno") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              progress: newProgress,
              answered: true,
              answer: yesNoAnswer,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else if (selectedQuestion.type === "file") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,              
              progress: newProgress,
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
              progress: newProgress,
              answered: true,
              tableData: tableData,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              progress: newProgress,
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
        // message.success("Response saved as draft.")
        console.log("Response saved as draft.")
        setActiveTab("draft") // Switch to draft tab after saving
      } else {
        // message.success("Response posted successfully!")
        console.log("Response posted successfully!")
        setActiveTab("posted") // Switch to posted tab after posting
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
          const newProgress = action === "save" ? Math.round((currentQuestion.progress / 100) * 100) : 100 // Set progress to 50% for draft, 100% for posted

          if (currentQuestion.type === "yesno") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              progress: newProgress,
              answered: true,
              answer: yesNoAnswer,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else if (currentQuestion.type === "file") {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              progress: newProgress,
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
              progress: newProgress,
              answered: true,
              tableData: tableData,
              submittedDate: new Date().toISOString().split("T")[0],
              submittedBy: user.name || "Current User",
            }
          } else {
            updatedSections[sectionIndex].questions[questionIndex] = {
              ...updatedSections[sectionIndex].questions[questionIndex],
              status: newStatus,
              progress: newProgress,
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
        // message.success("Response saved as draft.")
        console.log("Response saved as draft.")
        setActiveTab("draft") // Switch to draft tab after saving
      } else {
        // message.success("Response posted successfully!")
        console.log("Response posted successfully!")
        setActiveTab("posted") // Switch to posted tab after posting
      }
      handleClosePenModal()
    }
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
                  progress: 100, // Set progress to 100% when posting
                  submittedDate: new Date().toLocaleDateString(),
                  submittedBy: user?.name || "Current User",
                }
              }
              return question
            }),
          }
        }
        return section
      })
    })
    // message.success("Question posted successfully")
    console.log("Question posted successfully")
    setActiveTab("posted") // Switch to posted tab after posting
  }


  // Render the appropriate input based on question type
  const renderQuestionInput = (questionId: string, type: string, mode: string) => {
    const isViewOnly = mode === "view"
    const response = getQuestionResponse(questionId)

    switch (type) {
      case "yesno":
        return (
          <div style={{ padding: "0 1rem 1rem" }}>
            <Text type="secondary">Answer:</Text>
            <div style={{ marginTop: "0.5rem" }}>
              <Radio.Group
                value={response.yesNoAnswer}
                onChange={(e) => updateQuestionResponse(questionId, "yesNoAnswer", e.target.value)}
                disabled={isViewOnly}
              >
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
                  updateQuestionResponse(questionId, "fileList", newFileList)
                }}
                beforeUpload={() => false}
                fileList={[]}
                showUploadList={false}
                disabled={isViewOnly}
              >
                <Button
                  size="small"
                  style={{ borderRadius: "4px", fontSize: "12px", height: "24px", padding: "0 8px" }}
                >
                  Browse Files
                </Button>
              </Upload>
            </div>

            {/* File list displayed below the upload area */}
            {response.fileList.length > 0 && (
              <div style={{ marginTop: "1rem", padding: "0 0.5rem" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Uploaded Files:
                </Text>
                {response.fileList.map((file) => (
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
                          onClick={() => {
                            const newFileList = response.fileList.filter((f) => f.uid !== file.uid)
                            updateQuestionResponse(questionId, "fileList", newFileList)
                          }}
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
                dataSource={response.tableData}
                columns={[
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                    render: (text, _, index) =>
                      isViewOnly ? (
                        text
                      ) : (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...response.tableData]
                            newData[index].description = e.target.value
                            updateQuestionResponse(questionId, "tableData", newData)
                          }}
                        />
                      ),
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    render: (text, _, index) =>
                      isViewOnly ? (
                        text
                      ) : (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...response.tableData]
                            newData[index].amount = e.target.value
                            updateQuestionResponse(questionId, "tableData", newData)
                          }}
                        />
                      ),
                  },
                  {
                    title: "Account Code",
                    dataIndex: "accountCode",
                    key: "accountCode",
                    render: (text, _, index) =>
                      isViewOnly ? (
                        text
                      ) : (
                        <Input
                          value={text}
                          onChange={(e) => {
                            const newData = [...response.tableData]
                            newData[index].accountCode = e.target.value
                            updateQuestionResponse(questionId, "tableData", newData)
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
                  onClick={() => {
                    const newData = [...response.tableData, { description: "", amount: "", accountCode: "" }]
                    updateQuestionResponse(questionId, "tableData", newData)
                  }}
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
                value={response.textResponse}
                onChange={(e) => updateQuestionResponse(questionId, "textResponse", e.target.value)}
                placeholder="Type your response here..."
                disabled={isViewOnly}
              />
            </div>
          </div>
        )
    }
  }

  // Render the appropriate input for the respond modal
  const renderRespondModalInput = (questionId: string, type: string) => {
    const response = getQuestionResponse(questionId)

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
              value={response.yesNoAnswer}
              onChange={(e) => updateQuestionResponse(questionId, "yesNoAnswer", e.target.value)}
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
                  updateQuestionResponse(questionId, "fileList", newFileList)
                }}
                beforeUpload={() => false}
                fileList={[]}
                showUploadList={false}
              >
                <Button
                  size="small"
                  style={{ borderRadius: "4px", fontSize: "12px", height: "24px", padding: "0 8px" }}
                >
                  Browse Files
                </Button>
              </Upload>
            </div>

            {/* File list displayed below the upload area - only show after upload */}
            {response.fileList.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Uploaded Files:
                </Text>
                {response.fileList.map((file) => (
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
                        onClick={() => {
                          const newFileList = response.fileList.filter((f) => f.uid !== file.uid)
                          updateQuestionResponse(questionId, "fileList", newFileList)
                        }}
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
              dataSource={response.tableData}
              columns={[
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                  render: (text, _, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newData = [...response.tableData]
                        newData[index].description = e.target.value
                        updateQuestionResponse(questionId, "tableData", newData)
                      }}
                      size="small"
                    />
                  ),
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                  render: (text, _, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newData = [...response.tableData]
                        newData[index].amount = e.target.value
                        updateQuestionResponse(questionId, "tableData", newData)
                      }}
                      size="small"
                    />
                  ),
                },
                {
                  title: "Account Code",
                  dataIndex: "accountCode",
                  key: "accountCode",
                  render: (text, _, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newData = [...response.tableData]
                        newData[index].accountCode = e.target.value
                        updateQuestionResponse(questionId, "tableData", newData)
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
              onClick={() => {
                const newData = [...response.tableData, { description: "", amount: "", accountCode: "" }]
                updateQuestionResponse(questionId, "tableData", newData)
              }}
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
              value={response.textResponse}
              onChange={(e) => updateQuestionResponse(questionId, "textResponse", e.target.value)}
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
  const renderQuestionCard = (question: Question, section: QuestionnaireSection) => {
    const response = getQuestionResponse(question.id)
    return (
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
                      question.status === "posted" ? "success" : question.status === "draft" ? "warning" : "default"
                    }
                    text={
                      question.status === "posted" ? "Posted" : question.status === "draft" ? "Draft" : "Unanswered"
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
                      color: selectedDate && question.date === selectedDate ? "#0f766e" : "rgba(0, 0, 0, 0.45)",
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
                    <Button icon={<EyeOutlined />} onClick={() => handleOpenQuestion(section.id, question.id, "view")}>
                      View Only
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
                  </>
                ) : question.status === "draft" ? (
                  <>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenQuestion(section.id, question.id, "edit")}>
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
                  </>
                )}
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Answer content with accordion */}
            <div style={{ marginTop: "0.5rem" }}>
  <Collapse defaultActiveKey={[]} expandIconPosition="end">
    <Collapse.Panel
      header={<Text strong>Answer:</Text>}
      key="1"
    >
      {/* Yes/No Radio Buttons */}
      <div style={{ marginBottom: "1rem" }}>
       
        <Radio.Group
          value={response.yesNoAnswer}
          onChange={(e) => updateQuestionResponse(question.id, "yesNoAnswer", e.target.value)}
        >
          <Radio value="Yes">Yes</Radio>
          <Radio value="No">No</Radio>
        </Radio.Group>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Response section */}
        <div style={{ flex: 1 }}>
          <Text type="secondary">Your Response:</Text>
          <div style={{ marginTop: "0.5rem" }}>
            <TextArea
              rows={4}
              value={response.textResponse}
              onChange={(e) => updateQuestionResponse(question.id, "textResponse", e.target.value)}
              placeholder="Type your response here..."
            />
          </div>
        </div>

        {/* File attachment section */}
        <div style={{ flex: 1 }}>
          <Text type="secondary">File Attachments:</Text>
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
              marginTop: "0.5rem",
            }}
          >
            <div style={{ fontSize: "18px", color: "#d9d9d9", marginBottom: "4px" }}>+</div>
            <div style={{ color: "#666", marginBottom: "8px", fontSize: "13px" }}>
              Click to browse files
            </div>
            <Upload
              multiple
              onChange={(info) => {
                const newFileList = info.fileList.filter((file) => !file.status || file.status === "done")
                updateQuestionResponse(question.id, "fileList", newFileList)
              }}
              beforeUpload={() => false}
              fileList={[]}
              showUploadList={false}
            >
              <Button
                size="small"
                style={{ borderRadius: "4px", fontSize: "12px", height: "24px", padding: "0 8px" }}
              >
                Browse Files
              </Button>
            </Upload>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button
          onClick={() => {
            const sectionIndex = questionnaireSections.findIndex((s) => s.id === section.id)
            if (sectionIndex !== -1) {
              const questionIndex = questionnaireSections[sectionIndex].questions.findIndex((q) => q.id === question.id)
              if (questionIndex !== -1) {
                const updatedSections = [...questionnaireSections]
                updatedSections[sectionIndex].questions[questionIndex] = {
                  ...updatedSections[sectionIndex].questions[questionIndex],
                  status: "draft",
                  answered: true,
                  answer: response.yesNoAnswer,
                  textAnswer: response.textResponse,
                  files: response.fileList.map((file) => ({
                    name: file.name,
                    category: "Uploaded File",
                    explanation: "",
                  })),
                  tableData: response.tableData,
                  submittedDate: new Date().toISOString().split("T")[0],
                  submittedBy: user.name || "Current User",
                }
                setQuestionnaireSections(updatedSections)
                setTimeout(() => updateSectionProgress(section.id), 0)
                message.success("Response saved as draft.")
              }
            }
          }}
        >
          Save as Draft
        </Button>
        <Button
          type="primary"
          style={{ background: "#0f766e" }}
          onClick={() => {
            const sectionIndex = questionnaireSections.findIndex((s) => s.id === section.id)
            if (sectionIndex !== -1) {
              const questionIndex = questionnaireSections[sectionIndex].questions.findIndex((q) => q.id === question.id)
              if (questionIndex !== -1) {
                const updatedSections = [...questionnaireSections]
                updatedSections[sectionIndex].questions[questionIndex] = {
                  ...updatedSections[sectionIndex].questions[questionIndex],
                  status: "posted",
                  answered: true,
                  answer: response.yesNoAnswer,
                  textAnswer: response.textResponse,
                  files: response.fileList.map((file) => ({
                    name: file.name,
                    category: "Uploaded File",
                    explanation: "",
                  })),
                  tableData: response.tableData,
                  submittedDate: new Date().toISOString().split("T")[0],
                  submittedBy: user.name || "Current User",
                }
                setQuestionnaireSections(updatedSections)
                setTimeout(() => updateSectionProgress(section.id), 0)
                message.success("Response posted successfully!")
              }
            }
          }}
        >
          Post
        </Button>
      </div>
    </Collapse.Panel>
  </Collapse>
</div>


            {/* Display uploaded files */}
            {response.fileList.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Uploaded Files:
                </Text>
                {response.fileList.map((file) => (
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
                        onClick={() => {
                          const newFileList = response.fileList.filter((f) => f.uid !== file.uid)
                          updateQuestionResponse(question.id, "fileList", newFileList)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Display existing answers if available */}
            {question.answered && (
              <div style={{ fontSize: "14px" }} className="dark:bg-gray-900 dark:text-white">
                {/* Yes/No Answer */}
                {question.type === "yesno" && question.answer && (
                  <div className="dark:bg-gray-900 dark:text-white">
                    
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
                      <table className="dark:bg-gray-900 dark:text-white" style={{ width: "100%", fontSize: "14px" }}>
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
                  <div style={{ marginTop: question.tableData && question.tableData.length > 0 ? "12px" : "0" }}>
                    <Text strong>Files:</Text>
                    <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {question.files.map((file, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
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
    )
  }

  return (
    <div
      className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "p-4 md:p-6" : ""}`}
    >
      {/* Sticky Top-Right Filter */}
      <div
        style={{
          position: "absolute",
          top: "4.1rem",
          right: 0,
          zIndex: 20,
          background: "white",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          borderRadius: "0 0 0 8px",
          marginLeft: "auto",
          marginBottom: "0px",
          minWidth: "fit-content",
        }}
      >
        <span style={{ whiteSpace: "nowrap", fontWeight: 500, padding: "0 1rem" }}>Mid Job query</span>
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
      <div className="dark:bg-gray-900 dark:text-white" style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 1.5rem" }}>
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
      <div className="dark:bg-gray-900 dark:text-white " style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div style={{ margin: "0 auto", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
          <div className="flex justify-between items-center gap-4 w-full query-hub-inner-tabs">
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
            <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#4A5568", fontSize: "14px", paddingLeft: "25px" }}>
              <Text style={{ whiteSpace: "nowrap" }}>Submitted: Apr 8, 2025</Text>
              <Text style={{ whiteSpace: "nowrap" }}>Due date: Apr 22, 2025</Text>
              <Text style={{ whiteSpace: "nowrap", color: "#4CAF50" }}>Due in 14 days</Text>
            </div>
            {/* Search bar */}
            <Input
              placeholder="Search Queries, etc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />
          </div>
        </div>

        {/* Date filter tag */}
        <div style={{ margin: "0 auto", padding: "0 24px 8px" }}>
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
        <div style={{ marginBottom: "0.6rem", display: "flex", justifyContent: "flex-end" }}>
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
          <div key={section?.id} style={{ marginBottom: "25px" }}>
            {/* Section Header with Name - Simple Text with Progress */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                // borderBottom: "1px solid #f0f0f0",
                paddingBottom: "8px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {section?.name}
              </Title>
              {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Progress
                  percent={section?.progress}
                  style={{ width: "128px" }}
                  size="small"
                  strokeColor="#0f766e"
                  showInfo={false}
                />
                {section?.status === "completed" && (
                  <CheckCircleOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
                )}
                {section?.status === "partial" && (
                  <ClockCircleOutlined style={{ fontSize: "20px", color: "#faad14" }} />
                )}
                {section?.status === "pending" && (
                  <ExclamationCircleOutlined style={{ fontSize: "20px", color: "#d9d9d9" }} />
                )} 
                </div>*/}
              </div>
              
                          {section?.questions.map((question) => (
                            <div key={question.id} style={{ marginBottom: "16px" }}>
                               <div style={{ position: "relative", padding: "8px 0" }}>
                                                   {/* Progress + Icon */}
                                                              <div
                                                                style={{
                                                                  position: "absolute",
                                                                  top: "-22px",
                                                                  right: "0px",
                                                                  zIndex: 1,
                                                                  padding: "4px 8px",
                                                                  borderRadius: "4px",
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: "4px",
                                                                }}
                                                              >
                                                                <Progress
                                                                  percent={question.progress}
                                                                  size="small"
                                                                  style={{ width: "128px" }}
                                                                  strokeColor={
                                                                    question.progress === 100
                                                                      ? "#0f766e"
                                                                      : question.progress > 0
                                                                      ? "#faad14"
                                                                      : "#d9d9d9"
                                                                  }
                                                                  showInfo={false}
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
                                        onClick={() => handlePostSingleQuestion(section.id, question.id)}
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
          
                              <Divider style={{ margin: "12px 0"}} />
          
                              {/* Answer content */}
                              {!question.answered ? (
                                <Text type="secondary" italic>No response provided yet</Text>
                              ) : (
                                <div style={{ fontSize: "14px" }} className="dark:bg-gray-900 dark:text-white">
                                  {/* Yes/No Answer */}
                                  {question.type === "yesno" && question.answer && (
                                    <div className="dark:bg-gray-900 dark:text-white"><Text strong>Answer:</Text> {question.answer}</div>
                                  )}
                                  {/* Text Answer */}
                                  {question.type === "text" && question.textAnswer && (
                                    <div><Text strong>Response:</Text> {question.textAnswer}</div>
                                  )}
                                  {/* Tabular Data */}
                                  {question.tableData && question.tableData.length > 0 && (
                                    <div className="dark:bg-gray-900 dark:text-white">
                                      <Text strong>Data:</Text>
                                      <div style={{ marginTop: "4px", padding: "8px", borderRadius: "4px" }}>
                                        <table className="dark:bg-gray-900 dark:text-white" style={{ width: "100%", fontSize: "14px" }}>
                                          <thead>
                                            <tr className="dark:bg-gray-900 dark:text-white" style={{ textAlign: "left", fontSize: "12px" }}>
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

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center w-full">
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
              {renderRespondModalInput(query.id, query.type)}

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
                    // Save as draft
                    const sectionIndex = questionnaireSections.findIndex((s) =>
                      s.questions.some((q) => q.id === query.id),
                    )
                    if (sectionIndex !== -1) {
                      const questionIndex = questionnaireSections[sectionIndex].questions.findIndex(
                        (q) => q.id === query.id,
                      )
                      if (questionIndex !== -1) {
                        const response = getQuestionResponse(query.id)
                        const updatedSections = [...questionnaireSections]
                        updatedSections[sectionIndex].questions[questionIndex] = {
                          ...updatedSections[sectionIndex].questions[questionIndex],
                          status: "draft",
                          answered: true,
                          answer: response.yesNoAnswer,
                          textAnswer: response.textResponse,
                          files: response.fileList.map((file) => ({
                            name: file.name,
                            category: "Uploaded File",
                            explanation: "",
                          })),
                          tableData: response.tableData,
                          submittedDate: new Date().toISOString().split("T")[0],
                          submittedBy: user.name || "Current User",
                        }
                        setQuestionnaireSections(updatedSections)
                        setTimeout(() => updateSectionProgress(updatedSections[sectionIndex].id), 0)
                      }
                    }
                    alert("Response saved as draft.")
                    handleCloseModal()
                    handleSubmit("draft")}}
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
                  onClick={() => handleSubmit("post")}
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
    </div>
  )
}

export default QueryHubNew