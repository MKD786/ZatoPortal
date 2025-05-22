import { useState } from "react"
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons"
import {
  Button,
  Input,
  Progress,
  Card,
  Tabs,
  Typography,
  Tag,
  Dropdown,
  Menu,
  Space,
  message,
  Badge,
  Divider,
} from "antd"
import { QueryDisplay } from "./QueryDisplay"

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
  previousAnswer?: {
    response: "Yes" | "No" | "N/A"
    details: string
  }
}

interface QuestionnaireSection {
  id: string
  name: string
  progress: number
  status: "completed" | "partial" | "pending"
  questions: Question[]
}
// Add this after your existing interfaces
const calculateProgress = (question: Question): number => {
  switch (question.status) {
    case "posted":
      return 100;
    case "draft":
      let progress = 50; // Base progress for draft status
      
      switch (question.type) {
        case "yesno":
          if (question.answer) progress = 50;
          break;
        case "text":
          if (question.textAnswer) progress = 50;
          break;
        case "file":
          if (question.files && question.files.length > 0) progress = 50;
          break;
        case "table":
          if (question.tableData && question.tableData.length > 0) progress = 50;
          break;
      }
      return progress;
    
    case "unanswered":
    default:
      return 0;
  }
};

// Add the ProgressIndicator component
const ProgressIndicator: React.FC<{ progress: number }> = ({ progress }) => {
  const getProgressColor = (value: number) => {
    if (value === 100) return "#0f766e"; // Complete
    if (value > 0) return "#faad14";     // In progress
    return "#d9d9d9";                    // Not started
  };

  const getProgressIcon = (value: number) => {
    if (value === 100) {
      return <CheckCircleOutlined style={{ fontSize: "16px", color: "#0f766e" }} />;
    }
    if (value > 0) {
      return <ClockCircleOutlined style={{ fontSize: "16px", color: "#faad14" }} />;
    }
    return <ExclamationCircleOutlined style={{ fontSize: "16px", color: "#d9d9d9" }} />;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <Progress
        percent={progress}
        size="small"
        style={{ width: "128px" }}
        strokeColor={getProgressColor(progress)}
        showInfo={false}
      />
      {getProgressIcon(progress)}
    </div>
  );
};

const { Text, Title } = Typography

const QueryHubNew = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
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
          status: "posted",
          submittedDate: "12 April 2024",
          submittedBy: "John Doe",
          files: [],
          date: "2024-04-12",
          sectionName: "Trading Information",
          progress: 100,
          previousAnswer: {
            response: "Yes",
            details: "Completed all requirements on 30/05/2024",
          },
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
          progress: 50,
        },
      ],
    },
  ])

  const totalQuestions = questionnaireSections.reduce((acc, section) => acc + section.questions.length, 0)
  const unansweredQuestions = questionnaireSections.reduce((acc, section) => acc + section.questions.filter((q) => q.status === "unanswered").length, 0)
  const draftQuestions = questionnaireSections.reduce((acc, section) => acc + section.questions.filter((q) => q.status === "draft").length, 0)
  const postedQuestions = questionnaireSections.reduce((acc, section) => acc + section.questions.filter((q) => q.status === "posted").length, 0)
  const overallProgress = Math.round(((draftQuestions + postedQuestions) / totalQuestions) * 100)

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

 const filteredSections = questionnaireSections
  .map((section) => {
    const filteredQuestions = section.questions.map((q) => {
      // Apply status filtering first
      let statusMatch = false;
      switch (activeTab) {
        case "all":
          // For "all" tab, return question with reset data
          statusMatch = true;
          const resetQuestion = {
            ...q,
            answer: "",
            textAnswer: "",
            files: [],
            tableData: [],
            status: "unanswered",
            progress: 0,
            answered: false,
            submittedDate: undefined,
            submittedBy: undefined
          };
          return resetQuestion;
        case "unanswered":
          statusMatch = q.status === "unanswered";
          break;
        case "draft":
          statusMatch = q.status === "draft";
          break;
        case "posted":
          statusMatch = q.status === "posted";
          break;
        default:
          statusMatch = true;
      }

      if (!statusMatch) return null;

      // Search filter
      if (searchQuery) {
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

        if (!matchesSearch) return null;
      }

      // Date filter
      if (selectedDate && q.date !== selectedDate) return null;

      // Return original question data for other tabs
      return q;
    }).filter(Boolean); // Remove null items

    if (filteredQuestions.length === 0) return null;

    return {
      ...section,
      questions: filteredQuestions,
    };
  })
  .filter((section): section is QuestionnaireSection => section !== null);

  
  const handleSaveAllDrafts = () => {
    const updatedSections = [...questionnaireSections]
    let pendingQuestionsCount = 0
    updatedSections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        if (question.status === "unanswered") {
          pendingQuestionsCount++
          updatedSections[sectionIndex].questions[questionIndex] = {
            ...question,
            status: "draft",
            answered: true,
            progress: 50,
            submittedDate: new Date().toISOString().split("T")[0],
            submittedBy: user_control.name || "Current User",
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
      message.success(`${pendingQuestionsCount} pending questions saved as drafts successfully!`)
    } else {
      message.info("No pending questions to save as drafts.")
    }
  }

  // Post all drafts
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
            progress: 100,
            submittedDate: new Date().toISOString().split("T")[0],
            submittedBy: user_control.name || "Current User",
          }
        }
      })
      const totalSectionQuestions = section.questions.length
      const answeredSectionQuestions = updatedSections[sectionIndex].questions.filter(
        (q) => q.status === "posted",
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

  
const handleQuestionSave = (sectionId: string, questionId: string, data: any) => {
  setQuestionnaireSections((prev) =>
    prev.map((section) => {
      if (section.id === sectionId) {
        // Update question with all necessary fields
        const updatedQuestions = section.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                status: data.status,
                answered: true,
                answer: data.response || q.answer,
                textAnswer: data.details || q.textAnswer,
                files: data.files
                  ? data.files.map((f: any) => ({
                      name: f.name,
                      category: "Uploaded File",
                      explanation: f.explanation || "",
                    }))
                  : q.files,
                tableData: data.tableData || q.tableData,
                progress: data.status === "posted" ? 100 : 50,
                submittedDate: new Date().toLocaleDateString(),
                submittedBy: user_control?.name || "Current User",
              }
            : q
        );

        // Calculate section progress
        const totalQuestions = updatedQuestions.length;
        const answeredQuestions = updatedQuestions.filter(
          (q) => q.status === "posted" || q.status === "draft"
        ).length;
        const sectionProgress = Math.round((answeredQuestions / totalQuestions) * 100);

        // Update section with new progress
        return {
          ...section,
          questions: updatedQuestions,
          progress: sectionProgress,
          status: sectionProgress === 100 ? "completed" : sectionProgress > 0 ? "partial" : "pending",
        };
      }
      return section;
    })
  );

  // Show success message and switch tab
  // message.success(data.status === "posted" ? "Question posted successfully" : "Question saved as draft");
  setActiveTab(data.status); // Switch to appropriate tab
};

  return (
    <div className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "p-4 md:p-6" : ""}`}>
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
            <div className="flex items-center gap-4 text-[#4A5568] text-[14px] pl-9">
            <Text style={{ whiteSpace: "nowrap" }}>Submitted: Apr 8, 2025</Text>
            <Text style={{ whiteSpace: "nowrap" }}>Due date: Apr 22, 2025</Text>
            <Text style={{ whiteSpace: "nowrap", color: "#4CAF50" }}>Due in 14 days</Text>
          </div>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "8px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {section?.name}
              </Title>
            </div>
           
            {section?.questions.map((question, idx) => (
  <div key={question.id} style={{ position: "relative", marginBottom: "16px" }}>
    {/* Progress indicator */}
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
      <ProgressIndicator progress={calculateProgress(question)} />
    </div>
    
    <QueryDisplay
      key={question.id}
      questionNumber={question.number}
      questionText={question.text}
      previousAnswer={question.previousAnswer}
      onSave={(data) => handleQuestionSave(section.id, question.id, { 
        ...data, 
        status: "draft",
        progress: 50 
      })}
      onPost={(data) => handleQuestionSave(section.id, question.id, { 
        ...data, 
        status: "posted",
        progress: 100 
      })}
    />
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
    </div>
  )
}

export default QueryHubNew