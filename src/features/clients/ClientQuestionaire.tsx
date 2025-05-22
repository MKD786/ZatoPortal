import { useState, useEffect } from "react"
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { Button, Input, Progress, Card, Tabs, Divider, Space, Typography, message } from "antd"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import QueryDisplay from "./QueryDisplay"
import { QuestionnaireSampleData } from "./constant"

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
  answer?: string // for yesno
  textAnswer?: string // for text
  status: "draft" | "posted" | "unanswered"
  submittedDate?: string
  submittedBy?: string
  files: FileObject[]
  tableData?: TableRow[]
  progress: number
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
interface ClientQuestionaireProps {
  onPost?: (updatedQuestion: any) => void
  onSave?: (updatedQuestion: any) => void
}

// Add after interfaces and before the main component
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

const ProgressIndicator: React.FC<{ progress: number }> = ({ progress }) => {
  const getProgressColor = (value: number) => {
    if (value === 100) return "#0f766e";
    if (value > 0) return "#faad14";
    return "#d9d9d9";
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

const ClientQuestionaire = ({ onPost, onSave }: ClientQuestionaireProps) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [questionnaireSections, setQuestionnaireSections] = useState(QuestionnaireSampleData as QuestionnaireSection[])

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

  const items = [
    { key: "all", label: `All Questions (${totalQuestions})` },
    { key: "unanswered", label: `Pending (${unansweredQuestions})` },
    { key: "draft", label: `Draft (${draftQuestions})` },
    { key: "posted", label: `Posted (${postedQuestions})` },
  ]
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")

  // Filter sections based on active tab and search term
  const filteredSections = questionnaireSections
    .map((section) => {
      const filteredQuestions = section.questions.filter((q) => {
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "unanswered" && q.status === "unanswered") ||
          (activeTab === "draft" && q.status === "draft") ||
          (activeTab === "posted" && q.status === "posted")

        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesTab && matchesSearch
      })

      if (filteredQuestions.length === 0) return null // Skip sections with no questions

      return {
        ...section,
        questions: filteredQuestions,
      }
    })
    .filter(Boolean as any) 

  //   if (onSave) {
  //     onSave(updatedQuestion)
  //   } else {
  //     setQuestionnaireSections((prevSections) => {
  //       return prevSections.map((section) => {
  //         if (section.id === updatedQuestion.sectionId) {
  //           return {
  //             ...section,
  //             questions: section.questions.map((question) => {
  //               if (question.id === updatedQuestion.id) {
  //                 return {
  //                   ...question,
  //                   ...updatedQuestion,
  //                   answered: true,
  //                   status: "draft",
  //                   progress: 50,
  //                   submittedDate: new Date().toLocaleDateString(),
  //                   submittedBy: user?.name || "Current User",
  //                 }
  //               }
  //               return question
  //             }),
  //           }
  //         }
  //         return section
  //       })
  //     })
  //     message.success("Question saved as draft")
  //   }
  // }
//     const handleSaveQuestion = (updatedQuestion: any) => {
//   if (onSave) {
//     onSave(updatedQuestion);
//   } else {
//     setQuestionnaireSections((prevSections) => {
//       return prevSections.map((section) => {
//         if (section.id === updatedQuestion.sectionId) {
//           const updatedQuestionWithProgress = {
//             ...updatedQuestion,
//             answered: true,
//             status: "draft",
//             progress: calculateProgress({ ...updatedQuestion, status: "draft" }),
//             submittedDate: new Date().toLocaleDateString(),
//             submittedBy: user?.name || "Current User",
//           };

//           return {
//             ...section,
//             questions: section.questions.map((q) =>
//               q.id === updatedQuestion.id ? updatedQuestionWithProgress : q
//             ),
//           };
//         }
//         return section;
//       });
//       });
//     message.success("Question saved as draft");
//   }
// };
// const handleSaveQuestion = (updatedQuestion: any) => {
//   if (onSave) {
//     onSave(updatedQuestion);
//   } else {
//     setQuestionnaireSections((prevSections) => {
//       return prevSections.map((section) => {
//         if (section.id === updatedQuestion.sectionId) {
//           // Create updated question with all necessary fields
//           const updatedQuestionWithProgress = {
//             ...updatedQuestion,
//             answered: true,
//             status: "draft",
//             progress: 50,
//             submittedDate: new Date().toLocaleDateString(),
//             submittedBy: user?.name || "Current User",
//             // Handle different question types
//             ...(updatedQuestion.type === "yesno" && {
//               answer: updatedQuestion.response
//             }),
//             ...(updatedQuestion.type === "text" && {
//               textAnswer: updatedQuestion.details
//             }),
//             ...(updatedQuestion.type === "table" && {
//               tableData: updatedQuestion.tableData || []
//             }),
//             files: updatedQuestion.files || []
//           };

//           // Update section questions
//           const updatedQuestions = section.questions.map((q) =>
//             q.id === updatedQuestion.id ? updatedQuestionWithProgress : q
//           );

//           // Calculate section progress
//           const totalQuestions = updatedQuestions.length;
//           const answeredQuestions = updatedQuestions.filter(q => q.answered).length;
//           const sectionProgress = Math.round((answeredQuestions / totalQuestions) * 100);

//           return {
//             ...section,
//             questions: updatedQuestions,
//             progress: sectionProgress,
//             status: sectionProgress === 100 ? "completed" : sectionProgress > 0 ? "partial" : "pending"
//           };
//         }
//         return section;
//       });
//     });
    
//     message.success("Question saved as draft");
//     setActiveTab("draft"); // Switch to draft tab after saving
//   }
// };
const handleSaveQuestion = (updatedQuestion: any) => {
  if (onSave) {
    onSave(updatedQuestion);
  } else {
    setQuestionnaireSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.id === updatedQuestion.sectionId) {
          // Create updated question with all necessary fields
          const updatedQuestionWithProgress = {
            ...updatedQuestion,
            answered: true,
            status: "draft",
            progress: 50,
            submittedDate: new Date().toLocaleDateString(),
            submittedBy: user?.name || "Current User",
            // Handle different question types
            ...(updatedQuestion.type === "yesno" && {
              answer: updatedQuestion.response
            }),
            ...(updatedQuestion.type === "text" && {
              textAnswer: updatedQuestion.details
            }),
            ...(updatedQuestion.type === "table" && {
              tableData: updatedQuestion.tableData || []
            }),
            files: updatedQuestion.files || []
          };

          // Update section questions
          const updatedQuestions = section.questions.map((q) =>
            q.id === updatedQuestion.id ? updatedQuestionWithProgress : q
          );

          // Calculate section progress
          const totalQuestions = updatedQuestions.length;
          const answeredQuestions = updatedQuestions.filter(q => q.answered).length;
          const sectionProgress = Math.round((answeredQuestions / totalQuestions) * 100);

          return {
            ...section,
            questions: updatedQuestions,
            progress: sectionProgress,
            status: sectionProgress === 100 ? "completed" : sectionProgress > 0 ? "partial" : "pending"
          };
        }
        return section;
      });
    });
    
    // message.success("Question saved as draft");
    setActiveTab("draft"); 
  }
};
const handlePostQuestion = (updatedQuestion: any) => {
  if (onPost) {
    onPost(updatedQuestion);
  } else {
    setQuestionnaireSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.id === updatedQuestion.sectionId) {
          // Create updated question with all necessary fields
          const updatedQuestionWithProgress = {
            ...updatedQuestion,
            answered: true,
            status: "posted",
            progress: 100,
            submittedDate: new Date().toLocaleDateString(),
            submittedBy: user?.name || "Current User",
            // Handle different question types
            ...(updatedQuestion.type === "yesno" && {
              answer: updatedQuestion.response
            }),
            ...(updatedQuestion.type === "text" && {
              textAnswer: updatedQuestion.details
            }),
            ...(updatedQuestion.type === "table" && {
              tableData: updatedQuestion.tableData || []
            }),
            files: updatedQuestion.files || []
          };

          // Update section questions
          const updatedQuestions = section.questions.map((q) =>
            q.id === updatedQuestion.id ? updatedQuestionWithProgress : q
          );

          // Calculate section progress
          const totalQuestions = updatedQuestions.length;
          const answeredQuestions = updatedQuestions.filter(q => q.status === "posted").length;
          const sectionProgress = Math.round((answeredQuestions / totalQuestions) * 100);

          return {
            ...section,
            questions: updatedQuestions,
            progress: sectionProgress,
            status: sectionProgress === 100 ? "completed" : sectionProgress > 0 ? "partial" : "pending"
          };
        }
        return section;
      });
    });

    // message.success("Question posted successfully");
    setActiveTab("posted"); // Switch to posted tab after posting
  }
};
  const handleSaveAllDrafts = () => {
    const hasDraftableQuestions = questionnaireSections.some((section) =>
      section.questions.some((q) => q.status === "unanswered" && q.answered),
    )

    if (!hasDraftableQuestions) {
      message.warning("No pending questions to save as drafts")
      return
    }

    setQuestionnaireSections((prevSections) => {
      return prevSections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => {
          if (question.status === "unanswered" && question.answered) {
            return {
              ...question,
              status: "draft",
              progress: Math.floor(Math.random() * 100),
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user?.name || "Current User",
            }
          }
          return question
        }),
      }))
    })
    message.success("All pending questions saved as drafts")
    setActiveTab("draft")
  }

  const handlePostAllDrafts = () => {
    const hasDraftQuestions = questionnaireSections.some((section) =>
      section.questions.some((q) => q.status === "draft"),
    )

    if (!hasDraftQuestions) {
      message.warning("No draft questions to post")
      return
    }

    setQuestionnaireSections((prevSections) => {
      return prevSections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => {
          if (question.status === "draft") {
            return {
              ...question,
              status: "posted",
              progress: 100,
              submittedDate: new Date().toLocaleDateString(),
              submittedBy: user?.name || "Current User",
            }
          }
          return question
        }),
      }))
    })
    message.success("All draft questions posted successfully")
    setActiveTab("posted")
  }

  return (
    <div
      className={`flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 ${user_control?.role === "client" ? "p-4 md:p-6" : ""}`}
    >
      {/* Statistics Dashboard */}
      <div
        className="dark:bg-gray-900 dark:text-white"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
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

      {/* Filter Tabs */}
      <div
        className="dark:bg-gray-900 dark:text-white"
        style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
        <div
          className="flex justify-between items-center query-hub-inner-tabs"
          style={{ margin: "0 auto", padding: "8px 24px" }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
          <div className="flex items-center gap-4 text-[#4A5568] text-[14px] pl-9">
            <Text style={{ whiteSpace: "nowrap" }}>Submitted: Apr 8, 2025</Text>
            <Text style={{ whiteSpace: "nowrap" }}>Due date: Apr 22, 2025</Text>
            <Text style={{ whiteSpace: "nowrap", color: "#4CAF50" }}>Due in 14 days</Text>
          </div>
          <Input
            placeholder="Search Questionnaire, etc"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "200px" }}
            allowClear
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px" }}>
        <div style={{ margin: "0 auto" }}>
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <div key={section?.id} style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    {section?.name}
                  </Title>
                </div>

                {/* Render QueryDisplay for each question */}
                {/* {section?.questions.map((question, idx) => (
                  <div key={question.id} style={{ marginBottom: "16px" }}>
                    <QueryDisplay
                      questionNumber={question.number}
                      questionText={question.text}
                      previousAnswer={
                        idx === 0
                          ? { response: "Yes", details: "Completed all requirements on 30/05/2024" }
                          : undefined
                      }
                      onSave={(data) => {
                        handleSaveQuestion({
                          ...question,
                          ...data,
                          sectionId: section.id,
                          id: question.id,
                        })
                      }}
                      onPost={(data) => {
                        handlePostQuestion({
                          ...question,
                          ...data,
                          sectionId: section.id,
                          id: question.id,
                        })
                      }}
                    />
                  </div>
                ))} */}
                
{section?.questions.map((question) => (
  <div key={question.id} style={{ marginBottom: "16px" }}>
    <div style={{ position: "relative", padding: "8px 0" }}>
      {/* Add Progress Indicator */}
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
        questionNumber={question.number}
        questionText={question.text}
        previousAnswer={
          question.status === "posted"
            ? {
                response: question.answer as "Yes" | "No" | "N/A",
                details: question.textAnswer || "",
              }
            : undefined
        }
        onSave={(data) => {
          handleSaveQuestion({
            ...question,
            ...data,
            sectionId: section.id,
            id: question.id,
          })
        }}
        onPost={(data) => {
          handlePostQuestion({
            ...question,
            ...data,
            sectionId: section.id,
            id: question.id,
          })
        }}
      />
    </div>
  </div>
))}
              </div>
            ))
          ) : (
            <Card style={{ textAlign: "center", padding: "40px 0" }}>
              <ExclamationCircleOutlined style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }} />
              <Title level={4} style={{ margin: 0, color: "#666" }}>
                No data found
              </Title>
              <Text type="secondary">
                {searchTerm
                  ? `No questions match the search term "${searchTerm}"`
                  : "No questions match the selected filter"}
              </Text>
            </Card>
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

export default ClientQuestionaire