
import { useState, useRef, useEffect } from "react"
import {
  // Tabs,
  Card,
  Button,
  Checkbox,
  // Progress,
  Input,
  Select,
  Modal,
  Form,
  Tag,
  Space,
  Typography,
  // Row,
  // Col,
} from "antd"
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  // ClockCircleOutlined,
  // UserOutlined,
  // ExclamationCircleOutlined,
  // CheckCircleOutlined,
  // FileTextOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  EditFilled,
} from "@ant-design/icons"
// import './QueryBuilder.scss'

// const { TabPane } = Tabs
const { TextArea } = Input
const { Title, Text } = Typography
const { Option } = Select

interface Question {
  id: string
  section: string
  number: string
  text: string
  type: string | "text" | "file" | "options"
  module: string
  date: string
  submittedBy: string
  status: "posted" | "draft" | "unanswered"
  answer?: string
  required: boolean
  isYesNo: boolean
  hasFileAttachment: boolean
  hasTextResponse: boolean
  files?: string[]
  options?: string[]
}

interface MidjobQuery {
  id: string
  date: string
  questionIds: string[]
  label: string
}

interface SectionData {
  name: string
  questions: Question[]
  progress: number
}

const QueryBuilder = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [isAddQuestionModalVisible, setIsAddQuestionModalVisible] = useState(false)

  // New state for add question dialog
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    module: "Auto Coding",
    isYesNo: false,
    hasFileAttachment: false,
    hasTextResponse: true,
  })

  // First, let's add state to track midjob queries
  const [midjobQueries, setMidjobQueries] = useState<MidjobQuery[]>([])
  const [activeMidjobQueryId, setActiveMidjobQueryId] = useState<string | null>(null)

  // Sample data for questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      section: "Trading Information",
      number: "1.1",
      text: "Has this entity traded in the financial year?",
      type: "yes-no",
      module: "Auto Coding",
      date: "12 April 20XX",
      submittedBy: "John Doe",
      status: "posted",
      answer: "Yes",
      required: true,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
    {
      id: "q2",
      section: "Trading Information",
      number: "1.2",
      text: "Please provide details of the main trading activities.",
      type: "text",
      module: "GL Scrutiny",
      date: "13 April 20XX",
      submittedBy: "Jane Smith",
      status: "draft",
      answer: "Retail sales of electronic goods and accessories.",
      required: true,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
    {
      id: "q3",
      section: "Trading Information",
      number: "1.3",
      text: "Have there been any changes to the business activities during the year?",
      type: "yes-no",
      module: "Work papers",
      date: "14 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q4",
      section: "Bank / Credit Card",
      number: "2.1",
      text: "Please upload the bank statements for all accounts.",
      type: "file",
      module: "Journal",
      date: "15 April 20XX",
      submittedBy: "John Doe",
      status: "posted",
      files: ["bank_statements.pdf"],
      required: true,
      isYesNo: false,
      hasFileAttachment: true,
      hasTextResponse: false,
    },
    {
      id: "q5",
      section: "Bank / Credit Card",
      number: "2.2",
      text: "Have all bank accounts been reconciled monthly?",
      type: "yes-no",
      module: "GL Scrutiny",
      date: "16 April 20XX",
      submittedBy: "Jane Smith",
      status: "draft",
      answer: "Yes",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q6",
      section: "Bank / Credit Card",
      number: "2.4",
      text: "Are there any unreconciled items older than 3 months?",
      type: "yes-no",
      module: "Auto Coding",
      date: "18 April 20XX",
      submittedBy: "John Doe",
      status: "draft",
      answer: "No",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q7",
      section: "Bank / Credit Card",
      number: "2.3",
      text: "Please provide details of any new bank accounts opened during the year.",
      type: "text",
      module: "Work papers",
      date: "17 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: false,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
    {
      id: "q8",
      section: "Fixed Assets",
      number: "3.1",
      text: "Please upload the fixed asset register.",
      type: "file",
      module: "Queries",
      date: "19 April 20XX",
      submittedBy: "",
      status: "unanswered",
      files: [],
      required: true,
      isYesNo: false,
      hasFileAttachment: true,
      hasTextResponse: false,
    },
    {
      id: "q9",
      section: "Fixed Assets",
      number: "3.2",
      text: "Have there been any significant additions or disposals during the year?",
      type: "yes-no",
      module: "GL Scrutiny",
      date: "20 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q10",
      section: "Fixed Assets",
      number: "3.3",
      text: "Please provide details of the depreciation policy.",
      type: "text",
      module: "Work papers",
      date: "21 April 20XX",
      submittedBy: "Jane Smith",
      status: "draft",
      answer: "Straight-line method over useful economic life.",
      required: true,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
    {
      id: "q11",
      section: "Inventory",
      number: "4.1",
      text: "Has a physical inventory count been performed?",
      type: "yes-no",
      module: "Auto Coding",
      date: "22 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q12",
      section: "Inventory",
      number: "4.2",
      text: "Please upload the inventory valuation report.",
      type: "file",
      module: "Queries",
      date: "23 April 20XX",
      submittedBy: "",
      status: "unanswered",
      files: [],
      required: true,
      isYesNo: false,
      hasFileAttachment: true,
      hasTextResponse: false,
    },
    {
      id: "q13",
      section: "Inventory",
      number: "4.3",
      text: "What method is used for inventory valuation?",
      type: "options",
      options: ["FIFO", "LIFO", "Weighted Average", "Specific Identification"],
      module: "GL Scrutiny",
      date: "24 April 20XX",
      submittedBy: "Jane Smith",
      status: "draft",
      answer: "FIFO",
      required: true,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
    {
      id: "q14",
      section: "Inventory",
      number: "4.4",
      text: "Is there any obsolete or slow-moving inventory?",
      type: "yes-no",
      module: "Work papers",
      date: "25 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: false,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q15",
      section: "Accounts Receivable",
      number: "5.1",
      text: "Please upload the aged receivables report.",
      type: "file",
      module: "Queries",
      date: "26 April 20XX",
      submittedBy: "",
      status: "unanswered",
      files: [],
      required: true,
      isYesNo: false,
      hasFileAttachment: true,
      hasTextResponse: false,
    },
    {
      id: "q16",
      section: "Accounts Receivable",
      number: "5.2",
      text: "Has a provision for doubtful debts been made?",
      type: "yes-no",
      module: "GL Scrutiny",
      date: "27 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q17",
      section: "Accounts Receivable",
      number: "5.3",
      text: "Please provide details of any significant bad debts written off during the year.",
      type: "text",
      module: "Work papers",
      date: "28 April 20XX",
      submittedBy: "Jane Smith",
      status: "draft",
      answer: "No significant bad debts were written off during the year.",
      required: true,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
    {
      id: "q18",
      section: "Accounts Receivable",
      number: "5.4",
      text: "Are there any receivables from related parties?",
      type: "yes-no",
      module: "Auto Coding",
      date: "29 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: true,
      isYesNo: true,
      hasFileAttachment: false,
      hasTextResponse: false,
    },
    {
      id: "q19",
      section: "Accounts Receivable",
      number: "5.5",
      text: "Please provide details of any receivables that have been written off during the financial year.",
      type: "text",
      module: "GL Scrutiny",
      date: "30 April 20XX",
      submittedBy: "",
      status: "unanswered",
      answer: "",
      required: true,
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    },
  ])

  const handleCheckboxChange = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId)
      } else {
        return [...prev, questionId]
      }
    })
  }

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId))
    setSelectedQuestions((prev) => prev.filter((id) => id !== questionId))
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id)
    setEditText(question.text)
  }

  const saveEditedQuestion = () => {
    if (editingQuestionId) {
      setQuestions((prev) => prev.map((q) => (q.id === editingQuestionId ? { ...q, text: editText } : q)))
      setEditingQuestionId(null)
    }
  }

  const cancelEdit = () => {
    setEditingQuestionId(null)
  }

  // Now, update the handleSendSelectedQuestions function to create midjob queries
  const handleSendSelectedQuestions = () => {
    if (selectedQuestions.length === 0) return

    const today = new Date()
    const dateStr = today.toLocaleDateString()
    const newQueryId = `query-${Date.now()}`

    const newMidjobQuery = {
      id: newQueryId,
      date: `${dateStr}`,
      questionIds: [...selectedQuestions],
      label: `${dateStr}`,
    }

    setMidjobQueries((prev) => [...prev, newMidjobQuery])
    setActiveMidjobQueryId(newQueryId)

    // Clear selected questions after sending
    setSelectedQuestions([])
  }


  const handleAddQuestion = () => {
    const today = new Date()
    const formattedDate = `${today.getDate()} ${today.toLocaleString("default", { month: "long" })} 20XX`

    const newId = `q${questions.length + 1}`
    const newQuestionObj = {
      id: newId,
      section: "Trading Information", // Default section
      number: `1.${questions.length + 1}`,
      text: newQuestion.text,
      type: newQuestion.isYesNo ? "yes-no" : newQuestion.hasFileAttachment ? "file" : "text",
      module: newQuestion.module,
      date: formattedDate,
      submittedBy: "",
      status: "unanswered" as const,
      answer: "",
      required: true,
      isYesNo: newQuestion.isYesNo,
      hasFileAttachment: newQuestion.hasFileAttachment,
      hasTextResponse: newQuestion.hasTextResponse,
    }

    setQuestions((prev) => [...prev, newQuestionObj])
    setIsAddQuestionModalVisible(false)

    // Reset form
    setNewQuestion({
      text: "",
      module: "Auto Coding",
      isYesNo: false,
      hasFileAttachment: false,
      hasTextResponse: true,
    })
  }

  const toggleQuestionType = (questionId: string, type: "isYesNo" | "hasFileAttachment" | "hasTextResponse") => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          // Create a new question object with the current state
          const updatedQuestion = { ...q }

          // Toggle the selected type
          updatedQuestion[type] = !updatedQuestion[type]

          // If turning on Yes/No, disable the other options
          if (type === "isYesNo" && updatedQuestion.isYesNo) {
            updatedQuestion.hasFileAttachment = false
            updatedQuestion.hasTextResponse = false
          }

          // If turning on other options, disable Yes/No
          if ((type === "hasFileAttachment" || type === "hasTextResponse") && updatedQuestion[type]) {
            updatedQuestion.isYesNo = false
          }

          return updatedQuestion
        }
        return q
      }),
    )
  }

  // For new question dialog
  const toggleNewQuestionType = (type: "isYesNo" | "hasFileAttachment" | "hasTextResponse") => {
    const updatedQuestion = { ...newQuestion }

    // Toggle the selected type
    updatedQuestion[type] = !updatedQuestion[type]

    // If turning on Yes/No, disable the other options
    if (type === "isYesNo" && updatedQuestion.isYesNo) {
      updatedQuestion.hasFileAttachment = false
      updatedQuestion.hasTextResponse = false
    }

    // If turning on other options, disable Yes/No
    if ((type === "hasFileAttachment" || type === "hasTextResponse") && updatedQuestion[type]) {
      updatedQuestion.isYesNo = false
    }

    setNewQuestion(updatedQuestion)
  }

  const getModuleTagClass = (module: string) => {
    switch (module) {
      case "Auto Coding":
        return "autoCoding"
      case "GL Scrutiny":
        return "glScrutiny"
      case "Work papers":
        return "workPapers"
      case "Queries":
        return "queries"
      case "Journal":
        return "journal"
      default:
        return ""
    }
  }
  // Calculate statistics
  // const totalQuestions = questions.length
  // const answeredQuestions = questions.filter((q) => q.status === "posted").length
  // const draftQuestions = questions.filter((q) => q.status === "draft").length
  // const unansweredQuestions = questions.filter((q) => q.status === "unanswered").length
  // const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100)

  // Group questions by section
  const sections = [...new Set(questions.map((q) => q.section))]
  const questionsBySection: SectionData[] = sections.map((section) => {
    const sectionQuestions = questions.filter((q) => q.section === section)
    const sectionAnswered = sectionQuestions.filter((q) => q.status === "posted").length
    const sectionProgress = Math.round((sectionAnswered / sectionQuestions.length) * 100)
    return {
      name: section,
      questions: sectionQuestions,
      progress: sectionProgress,
    }
  })

  // Available modules
  const modules = ["Auto Coding", "GL Scrutiny", "Work papers", "Queries", "Journal"]

  const grammarCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add this effect for auto grammar checking
  useEffect(() => {
    if (editingQuestionId && editText) {
      // Grammar checking removed as requested
      if (grammarCheckTimeoutRef.current) {
        clearTimeout(grammarCheckTimeoutRef.current)
      }
    }

    return () => {
      if (grammarCheckTimeoutRef.current) {
        clearTimeout(grammarCheckTimeoutRef.current)
      }
    }
  }, [editingQuestionId, editText])

  // Similar effect for new question text
  useEffect(() => {
    if (newQuestion.text) {
      // Grammar checking removed as requested
      if (grammarCheckTimeoutRef.current) {
        clearTimeout(grammarCheckTimeoutRef.current)
      }
    }
  }, [newQuestion.text])

  const checkGrammar = async (text: string) => {
    // Grammar checking removed as requested
    console.log("Grammar checking disabled", text)
  }

  return (
    <div style={{ maxWidth: '100%', margin: "0 auto", padding: "5px 0rem 0rem 0.5rem" }}>
        <div style={{ padding: "0rem 0.3rem 0rem 0rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  {/* Midjob Query Tabs */}
                  {midjobQueries.length > 0 && (
                    <div style={{ borderBottom: "1px solid #f0f0f0", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: 8 }}>
                        <Text strong style={{ marginRight: 8, whiteSpace: "nowrap" }}>
                          Mid Job Query:
                        </Text>
                        <Button
                          type={activeMidjobQueryId === null ? "primary" : "default"}
                          size="small"
                          onClick={() => setActiveMidjobQueryId(null)}
                          style={{ marginRight: 8 }}
                        >
                          All Queries
                        </Button>

                        {midjobQueries.map((query) => (
                          <Button
                            key={query.id}
                            type={activeMidjobQueryId === query.id ? "primary" : "default"}
                            size="small"
                            onClick={() => setActiveMidjobQueryId(query.id)}
                            style={{ marginRight: 8, display: "flex", alignItems: "center" }}
                          >
                            <span>{query.date}</span>
                            <Tag color="blue" style={{ marginLeft: 4, fontSize: 10 }}>
                              {query.questionIds.length}
                            </Tag>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddQuestionModalVisible(true)}
                    disabled={activeMidjobQueryId !== null}
                  >
                    Queries
                  </Button>

                  <Button
                    type="primary"
                    onClick={handleSendSelectedQuestions}
                    disabled={selectedQuestions.length === 0 || activeMidjobQueryId !== null}
                    style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  >
                    Send Selected Queries
                  </Button>
                </div>
              </div>

              {/* Now, let's filter the questions based on the active midjob query */}
              {questionsBySection.map((section) => {
                // Get all question IDs that are part of any midjob query
                const allMidjobQuestionIds = midjobQueries.flatMap((query) => query.questionIds)

                // Filter questions based on whether a midjob query is active
                const filteredQuestions = activeMidjobQueryId
                  ? section.questions.filter((q) => {
                      const activeQuery = midjobQueries.find((query) => query.id === activeMidjobQueryId)
                      return activeQuery?.questionIds.includes(q.id)
                    })
                  : section.questions.filter((q) => !allMidjobQuestionIds.includes(q.id)) // Exclude questions that are part of any midjob query

                // Skip sections with no questions after filtering
                if (filteredQuestions.length === 0) return null

                return (
                  <div key={section.name} style={{ marginBottom: 32 }}>
                    <div className="sectionHeader">
                      <Title level={4}>{section.name}</Title>
                    </div>

                    {filteredQuestions.map((question) => (
                      <Card key={question.id} className="questionCard" size="small">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          {/* Left side: Module, date, and question text */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onChange={() => handleCheckboxChange(question.id)}
                              disabled={activeMidjobQueryId !== null}
                            />

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span className={`moduleTag ${getModuleTagClass(question.module)}`}>
                                  {question.module}
                                </span>
                                <span style={{ fontSize: 12, color: "#8c8c8c", display: "flex", alignItems: "center" }}>
                                  <CalendarOutlined style={{ fontSize: 12, marginRight: 4 }} />
                                  {question.date}
                                </span>
                              </div>

                              {editingQuestionId === question.id ? (
                                <div style={{ width: "100%", marginTop: 4 }}>
                                  <div className="inputContainer">
                                    <div className="inputArea">
                                      <TextArea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder="Edit your question here..."
                                        autoSize={{ minRows: 2 }}
                                      />
                                    </div>
                                    <div className="iconContainer">
                                      <Button
                                        type="text"
                                        size="small"
                                        onClick={() => checkGrammar(editText)}
                                        icon={<EditFilled />}
                                        title="Check grammar and spelling"
                                        style={{ marginRight: 4 }}
                                      />
                                      <Button
                                        type="text"
                                        size="small"
                                        onClick={saveEditedQuestion}
                                        icon={<SaveOutlined />}
                                        style={{ marginRight: 4 }}
                                      />
                                      <Button type="text" size="small" onClick={cancelEdit} icon={<CloseOutlined />} />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Text strong>{question.text}</Text>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                            {/* Question type options */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                                Query Type
                              </Text>
                              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <Checkbox
                                  checked={question.isYesNo}
                                  onChange={() => toggleQuestionType(question.id, "isYesNo")}
                                  disabled={activeMidjobQueryId !== null}
                                >
                                  <Text style={{ color: activeMidjobQueryId !== null ? "#d9d9d9" : "inherit" }}>
                                    Yes/No
                                  </Text>
                                </Checkbox>

                                <Checkbox
                                  checked={question.hasFileAttachment}
                                  onChange={() => toggleQuestionType(question.id, "hasFileAttachment")}
                                  disabled={question.isYesNo || activeMidjobQueryId !== null}
                                >
                                  <Text
                                    style={{
                                      color: question.isYesNo || activeMidjobQueryId !== null ? "#d9d9d9" : "inherit",
                                    }}
                                  >
                                    File
                                  </Text>
                                </Checkbox>

                                <Checkbox
                                  checked={question.hasTextResponse}
                                  onChange={() => toggleQuestionType(question.id, "hasTextResponse")}
                                  disabled={question.isYesNo || activeMidjobQueryId !== null}
                                >
                                  <Text
                                    style={{
                                      color: question.isYesNo || activeMidjobQueryId !== null ? "#d9d9d9" : "inherit",
                                    }}
                                  >
                                    Text
                                  </Text>
                                </Checkbox>
                              </div>
                            </div>

                            {/* Edit and Delete buttons */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEditQuestion(question)}
                                disabled={activeMidjobQueryId !== null}
                              />
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteQuestion(question.id)}
                                danger
                                disabled={activeMidjobQueryId !== null}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              })}
        </div>

      {/* Add Question Modal */}
      <Modal
        title="Add New Question"
        open={isAddQuestionModalVisible}
        onOk={handleAddQuestion}
        onCancel={() => setIsAddQuestionModalVisible(false)}
        width={650}
      >
        <Form layout="vertical">
          <Form.Item label="Question Text">
            <div className="inputContainer">
              <div className="inputArea">
                <TextArea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Enter your question here..."
                  autoSize={{ minRows: 3 }}
                />
              </div>
              <div className="iconContainer">
                <Button
                  type="text"
                  size="small"
                  onClick={() => checkGrammar(newQuestion.text)}
                  icon={<EditFilled />}
                  title="Check grammar and spelling"
                />
              </div>
            </div>
          </Form.Item>
          <Form.Item label="Module">
            <Select
              value={newQuestion.module}
              onChange={(value) => setNewQuestion({ ...newQuestion, module: value })}
              style={{ width: "100%" }}
            >
              {modules.map((module) => (
                <Option key={module} value={module}>
                  {module}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Question Type">
            <Space>
              <Checkbox checked={newQuestion.isYesNo} onChange={() => toggleNewQuestionType("isYesNo")}>
                Yes/No
              </Checkbox>
              <Checkbox
                checked={newQuestion.hasFileAttachment}
                onChange={() => toggleNewQuestionType("hasFileAttachment")}
                disabled={newQuestion.isYesNo}
              >
                <span style={{ color: newQuestion.isYesNo ? "#d9d9d9" : "inherit" }}>File</span>
              </Checkbox>
              <Checkbox
                checked={newQuestion.hasTextResponse}
                onChange={() => toggleNewQuestionType("hasTextResponse")}
                disabled={newQuestion.isYesNo}
              >
                <span style={{ color: newQuestion.isYesNo ? "#d9d9d9" : "inherit" }}>Text</span>
              </Checkbox>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default QueryBuilder