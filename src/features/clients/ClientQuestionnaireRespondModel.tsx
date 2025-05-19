import { useState, useEffect } from "react"
import {
  CloseOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Button, Input, Radio, Select, Modal, Badge, Space, Typography, Divider, Upload, Table, Form, Card, message } from "antd"

const { TextArea } = Input
const { Text, Title } = Typography
const { Option } = Select

const fileCategories = [
  "Bank Statement",
  "Loan Statement",
  "Accounts Payable",
  "Accounts Receivable",
  "Asset Purchase",
  "Asset Sale",
  "Vehicle Expense",
  "Home Office",
  "Expense Receipt",
  "Donation Receipt",
  "Property Manager Statement",
  "Portfolio Statement",
  "Term Deposit Statement",
  "Other",
]

const glCodes = [
  "1000 - Cash and Bank",
  "1100 - Accounts Receivable",
  "1200 - Inventory",
  "1300 - Prepaid Expenses",
  "1400 - Property, Plant & Equipment",
  "2000 - Accounts Payable",
  "2100 - Accrued Liabilities",
  "2200 - Loans Payable",
  "3000 - Share Capital",
  "3100 - Retained Earnings",
  "4000 - Revenue",
  "5000 - Cost of Goods Sold",
  "6000 - Operating Expenses",
  "6100 - Rent Expense",
  "6200 - Utilities Expense",
  "6300 - Salaries and Wages",
  "6400 - Professional Fees",
  "6500 - Insurance Expense",
  "6600 - Depreciation Expense",
  "6700 - Interest Expense",
  "9000 - Other Income",
  "9500 - Other Expenses",
]
interface FileInfo {
  file: File | null;  
  name: string;      
  id: string;        
}
interface TableRow {
  description: string;
  amount: string;
  accountCode: string;
  file:FileInfo | null;
  category: string;
}

const ClientQuestionnaireRespondModel = ({ isOpen, onClose, question, onSave, onPost }: { 
  isOpen: boolean; 
  onClose: () => void; 
  question: any;
  onSave: (question: any) => void;
  onPost: (question: any) => void;
}) => {
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const [files, setFiles] = useState<{
    file: File
    name: string
    category: string
    id: string
  }[]>([])
  const [fileExplanations, setFileExplanations] = useState<Record<string, string>>({})
  const [tableRows, setTableRows] = useState<TableRow[]>([
    { description: "", amount: "", accountCode: "", file: null, category: "" },
  ])
  const [yesNoAnswer, setYesNoAnswer] = useState("no")
  const [textAnswer, setTextAnswer] = useState("")
  const [homeOfficeData, setHomeOfficeData] = useState({
    totalArea: "",
    businessArea: "",
    rates: "",
    waterRates: "",
    mortgage: "",
    electricity: "",
    insurance: "",
    repairs: "",
    telephone: "",
    other: "",
  })
  const [vehicleData, setVehicleData] = useState({
    description: "",
    fbtReturned: "no",
    daysAvailable: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when question changes
  useEffect(() => {
    if (question) {
      setFiles(question.files || [])
      setTableRows(question.tableData || [{ description: "", amount: "", accountCode: "", file: null, category: "" }])
      setYesNoAnswer(question.answer || "no")
      setTextAnswer(question.textAnswer || "")
      setIsEditing(false)
    }
  }, [question])

 const handleFileUpload = (info: any) => {
    setIsEditing(true);
    const originFile = info.fileList;
    originFile.forEach((file: any) => {
      const newFile = {
        file: file, // Now TypeScript knows it's a File
        name: file.name,
        category: "",
        id: file.uid,
      };      
      setFiles([...files, newFile]);
    })
    console.log(originFile,"originFile")
  };

  const handleFileCategory = (id: string, category: string) => {
    setFiles(files.map((file) => (file.id === id ? { ...file, category } : file)))
  }

  const handleFileExplanation = (id: string, explanation: string) => {
    setFileExplanations({
      ...fileExplanations,
      [id]: explanation,
    })
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const addTableRow = () => {
    setIsEditing(true)
    setTableRows([...tableRows, { description: "", amount: "", accountCode: "", file: null, category: "" }])
  }

  const updateTableRow = (index: number, field: keyof TableRow, value: string) => {
    setIsEditing(true)
    const newRows = [...tableRows]
    newRows[index] = { ...newRows[index], [field]: value };
    setTableRows(newRows);
  }

  const removeTableRow = (index: number) => {
    if (tableRows.length > 1) {
      setTableRows(tableRows.filter((_, i) => i !== index))
    }
  }

  const handleTableRowFile = (index: number, info: any) => {
    setIsEditing(true)
    if (info.file.status !== "uploading") {
      const newRows = [...tableRows]
      newRows[index].file = {
        file: info.file.originFileObj,
        name: info.file.name,
        id: Math.random().toString(36).substring(7),
      }
      setTableRows(newRows)
    }
  }

  const handleTableRowCategory = (index: number, category: string) => {
    const newRows = [...tableRows]
    newRows[index].category = category
    setTableRows(newRows)
  }

  const updateHomeOfficeData = (field: string, value: string) => {
    setIsEditing(true)
    setHomeOfficeData({
      ...homeOfficeData,
      [field]: value,
    })
  }

  const updateVehicleData = (field: string, value: string) => {
    setIsEditing(true)
    setVehicleData({
      ...vehicleData,
      [field]: value,
    })
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsSubmitting(true)
      
      const formattedFiles = files.map(file => ({
        name: file.name,
        category: file.category || "Other",
        explanation: fileExplanations[file.id] || "",
      }))

      const filteredTableData = tableRows.filter(
        row => row.description && row.amount && row.accountCode
      )

      const updatedQuestion = {
        ...question,
        answer: yesNoAnswer,
        textAnswer,
        files: formattedFiles,
        tableData: filteredTableData,
        answered: true,
        status: "draft",
        progress: 50,
        submittedDate: new Date().toLocaleDateString(),
        submittedBy: user_control?.name || "Current User",
      }

      onSave(updatedQuestion)
      message.success("Question saved as draft!")
      onClose()
    } catch (err) {
      console.error("Error saving draft:", err)
      message.error("Failed to save draft")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostQuestion = async () => {
    try {
      setIsSubmitting(true)
      
      const formattedFiles = files.map(file => ({
        name: file.name,
        category: file.category || "Other",
        explanation: fileExplanations[file.id] || "",
      }))

      const filteredTableData = tableRows.filter(
        row => row.description && row.amount && row.accountCode
      )

      const updatedQuestion = {
        ...question,
        answer: yesNoAnswer,
        textAnswer,
        files: formattedFiles,
        tableData: filteredTableData,
        answered: true,
        status: "posted",
        progress: 100,
        submittedDate: new Date().toLocaleDateString(),
        submittedBy: user_control?.name || "Current User",
      }

      onPost(updatedQuestion)
      message.success("Question posted successfully!")
      onClose()
    } catch (err) {
      console.error("Error posting question:", err)
      message.error("Failed to post question")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!question) {
    return null
  }

  const isPosted = question.status === "posted"
  const isDraft = question.status === "draft" || isEditing

  const tableColumns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UploadOutlined style={{ color: "#bfbfbf" }} />
          <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: string, record: any) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          onChange={(value) => handleFileCategory(record.id, value)}
          placeholder="Select category"
        >
          {fileCategories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Explanation",
      dataIndex: "explanation",
      key: "explanation",
      render: (_: string, record: any) => (
        <Input
          placeholder="Optional explanation"
          value={fileExplanations[record?.id] || ""}
          onChange={(e) => handleFileExplanation(record?.id, e.target.value)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
          onClick={() => removeFile(record.id)}
        />
      ),
    },
  ]

  const tableRowColumns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string, _: any, index: number) => (
        <Input
          value={text}
          onChange={(e) => updateTableRow(index, "description", e.target.value)}
          placeholder="Description"
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: string, _: any, index: number) => (
        <Input value={text} onChange={(e) => updateTableRow(index, "amount", e.target.value)} placeholder="$" />
      ),
    },
    {
      title: "Account Code",
      dataIndex: "accountCode",
      key: "accountCode",
      render: (text: string, _: any, index: number) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          onChange={(value) => updateTableRow(index, "accountCode", value)}
          placeholder="Select GL code"
        >
          {glCodes.map((code) => (
            <Option key={code} value={code}>
              {code}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Supporting Document",
      dataIndex: "file",
      key: "file",
      render: (record: any, _: any, index: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Upload
            customRequest={({ onSuccess }) => {
              typeof onSuccess === "function" && onSuccess("ok")
            }}
            showUploadList={false}
            onChange={(info) => handleTableRowFile(index, info)}
          >
            <Button icon={<UploadOutlined />}>{record && record?.file ? "Change" : "Upload (Optional)"}</Button>
          </Upload>
          {record?.file && (
            <span
              style={{
                fontSize: "14px",
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record?.file?.name}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: string, record: any, index: number) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          onChange={(value) => handleTableRowCategory(index, value)}
          placeholder="Select category"
          disabled={!record.file}
        >
          {fileCategories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (index: number) => (
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
          onClick={() => removeTableRow(index)}
          disabled={tableRows.length === 1}
        />
      ),
    },
  ]
  
// Simplified modal rendering
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
      bodyStyle={{ padding: 0, maxHeight: "calc(100vh - 100px)", overflow: "auto" }}
      closable={false}
    >
      <div className="respond-modal-div"
        style={{
          background: "rgb(15 91 109)",
          color: "white",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {isPosted ? "View Question" : isDraft ? (user_control.role === "client" ? "Edit Draft" : "View Draft") : "Answer Question"}
          </Title>
          {isPosted && (
            <Badge color="green" text={<Text style={{ color: "white" }}>Posted</Text>} style={{ marginLeft: "8px" }} />
          )}
          {isDraft && !isPosted && (
            <Badge color="gold" text={<Text style={{ color: "white" }}>Draft</Text>} style={{ marginLeft: "8px" }} />
          )}
        </div>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} style={{ color: "white" }} />
      </div>

      {/* Question Details */}
      <div
        style={{ background: "#f5f5f5", padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div>
          <Text type="secondary">Section:</Text>
          <div style={{ fontWeight: 500 }}>{question.sectionName}</div>
        </div>
        <div>
          <Text type="secondary">Question Number:</Text>
          <div style={{ fontWeight: 500 }}>{question.number}</div>
        </div>

        {/* Submission info for posted questions */}
        {isPosted && question.submittedDate && (
          <div style={{ gridColumn: "span 2", display: "flex", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <CalendarOutlined style={{ color: "#bfbfbf", marginRight: "8px" }} />
              <Text type="secondary" style={{ marginRight: "4px" }}>
                Submitted:
              </Text>
              <Text strong>{question.submittedDate}</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserOutlined style={{ color: "#bfbfbf", marginRight: "8px" }} />
              <Text type="secondary" style={{ marginRight: "4px" }}>
                By:
              </Text>
              <Text strong>{question.submittedBy}</Text>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "24px", ...(isPosted ? { pointerEvents: "none", opacity: 0.7 } : {}) }}>
        {/* Question */}
        <Card style={{ marginBottom: "24px" }}>
          <Text strong style={{ color: "rgba(0, 0, 0, 0.65)", display: "block", marginBottom: "8px" }}>
            Question:
          </Text>
          <Text style={{ fontSize: "16px" }}>{question.text}</Text>
        </Card>

        {/* Response Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Yes/No Response */}
          {question.type === "yesno" && (
            <Card>
              <Text strong style={{ color: "rgba(0, 0, 0, 0.65)", display: "block", marginBottom: "12px" }}>
                Yes/No Response:
              </Text>
              <Radio.Group
                value={yesNoAnswer}
                onChange={(e) => {
                  setYesNoAnswer(e.target.value)
                  setIsEditing(true)
                }}
              >
                <Space size="large">
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Space>
              </Radio.Group>

              {/* Conditional fields for Yes answers */}
              {yesNoAnswer === "yes" && question.id === "q6" && (
                <div style={{ marginTop: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                  <Text strong style={{ display: "block", marginBottom: "8px" }}>
                    Provide details of assets or investments purchased:
                  </Text>
                  <Table
                    columns={tableRowColumns}
                    dataSource={tableRows.map((row, index) => ({ ...row, key: index }))}
                    pagination={false}
                    bordered
                  />
                  <Button type="dashed" onClick={addTableRow} style={{ marginTop: "12px" }} icon={<PlusOutlined />}>
                    Add Row
                  </Button>
                </div>
              )}

              {/* Vehicle expense details */}
              {yesNoAnswer === "yes" && question.id === "q9" && (
                <div style={{ marginTop: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                  <Form layout="vertical">
                    <Form.Item label="Vehicle Description">
                      <Input
                        value={vehicleData.description}
                        onChange={(e) => updateVehicleData("description", e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Has FBT been returned">
                      <Radio.Group
                        value={vehicleData.fbtReturned}
                        onChange={(e) => updateVehicleData("fbtReturned", e.target.value)}
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="How many days vehicle was available for private use">
                      <Input
                        value={vehicleData.daysAvailable}
                        onChange={(e) => updateVehicleData("daysAvailable", e.target.value)}
                        type="number"
                      />
                    </Form.Item>
                  </Form>
                </div>
              )}

              {/* Home office details */}
              {yesNoAnswer === "yes" && question.id === "q11" && (
                <div style={{ marginTop: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                  <Form layout="vertical">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <Form.Item label="Total area of home (m²)">
                        <Input
                          value={homeOfficeData.totalArea}
                          onChange={(e) => updateHomeOfficeData("totalArea", e.target.value)}
                          type="number"
                        />
                      </Form.Item>
                      <Form.Item label="Home area used for business (m²)">
                        <Input
                          value={homeOfficeData.businessArea}
                          onChange={(e) => updateHomeOfficeData("businessArea", e.target.value)}
                          type="number"
                        />
                      </Form.Item>
                    </div>

                    <Divider orientation="left">Annual Cost</Divider>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <Form.Item label="Rates">
                        <Input
                          value={homeOfficeData.rates}
                          onChange={(e) => updateHomeOfficeData("rates", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Water Rates">
                        <Input
                          value={homeOfficeData.waterRates}
                          onChange={(e) => updateHomeOfficeData("waterRates", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Interest on mortgage">
                        <Input
                          value={homeOfficeData.mortgage}
                          onChange={(e) => updateHomeOfficeData("mortgage", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Electricity & heating">
                        <Input
                          value={homeOfficeData.electricity}
                          onChange={(e) => updateHomeOfficeData("electricity", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Home & contents insurance">
                        <Input
                          value={homeOfficeData.insurance}
                          onChange={(e) => updateHomeOfficeData("insurance", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Repair & Maintenance">
                        <Input
                          value={homeOfficeData.repairs}
                          onChange={(e) => updateHomeOfficeData("repairs", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Telephone">
                        <Input
                          value={homeOfficeData.telephone}
                          onChange={(e) => updateHomeOfficeData("telephone", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Other">
                        <Input
                          value={homeOfficeData.other}
                          onChange={(e) => updateHomeOfficeData("other", e.target.value)}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              )}
            </Card>
          )}

          {/* Text Response */}
          {question.type === "text" && (
            <Card>
              <Text strong style={{ color: "rgba(0, 0, 0, 0.65)", display: "block", marginBottom: "12px" }}>
                Text Response:
              </Text>
              <TextArea
                placeholder="Type your response here..."
                style={{ minHeight: "100px" }}
                value={textAnswer}
                onChange={(e) => {
                  setTextAnswer(e.target.value)
                  setIsEditing(true)
                }}
              />
            </Card>
          )}

          {/* File Upload */}
          {question.type === "file" && (
            <Card>
              <Text strong style={{ color: "rgba(0, 0, 0, 0.65)", display: "block", marginBottom: "12px" }}>
                File Attachments:
              </Text>
              {/* File Upload Area */}
              {user_control?.role === "client" && (
                <Upload className="flex w-full questionnaire-upload" multiple style={{ width: "100%" }} accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png" beforeUpload={() => false}
                  customRequest={({ onSuccess }) => {
                    if (!onSuccess) return
                    setTimeout(() => { onSuccess("ok") }, 0)
                  }} showUploadList={false} onChange={handleFileUpload}>
                  <div
                    style={{
                      border: "2px dashed #d9d9d9",
                      borderRadius: "4px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "16px",
                      width: "100%"
                    }}
                  >
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <UploadOutlined style={{ fontSize: "40px", color: "#bfbfbf", marginBottom: "8px" }} />
                      <Text style={{ color: "rgba(0, 0, 0, 0.65)", marginBottom: "8px" }}>
                        Drag and drop your files here, or click to browse
                      </Text>
                      <Text type="secondary" style={{ marginBottom: "16px" }}>
                        Supports PDF, Excel, Word, and image files
                      </Text>
                      <Space>
                        <Button icon={<UploadOutlined />}>Browse Files</Button>
                      </Space>
                    </div>
                  </div>
                </Upload>
              )}
              {/* Uploaded Files List */}
              {files.length > 0 || user_control?.role !== "client" ? (
                <div>
                  <Text strong style={{ display: "block", marginBottom: "12px" }}>
                    Uploaded Files
                  </Text>
                  <Table columns={tableColumns} rowKey="id" dataSource={user_control?.role !== "client" ? [
                    {
                      file: new File([''], 'GL_Last_Year.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
                      name: "GL_Last_Year.xlsx",
                      category: "Accounts Receivable",
                      id: "1",
                      explanation: ""
                    },
                    {
                      file: new File([''], 'GL_Current_Year.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
                      name: "GL_Current_Year.xlsx",
                      category: "Asset Purchase",
                      id: "2",
                      explanation: ""
                    },
                    {
                      file: new File([''], 'Bank or Credit.pdf', { type: 'application/pdf' }),
                      name: "Bank or Credit.pdf",
                      category: "Bank Statement",
                      id: "3",
                      explanation: ""
                    }
                  ] : files} pagination={false} bordered />
                </div>
              ) : null}
            </Card>
          )}

          {/* Tabular Data */}
          {question.type === "table" && (
            <Card>
              <Text strong style={{ color: "rgba(0, 0, 0, 0.65)", display: "block", marginBottom: "12px" }}>
                Tabular Data:
              </Text>

              <Table
                columns={tableRowColumns}
                dataSource={tableRows.map((row, index) => ({ ...row, key: index }))}
                pagination={false}
                bordered
              />
              <Button type="dashed" onClick={addTableRow} style={{ marginTop: "12px" }} icon={<PlusOutlined />}>
                Add Row
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center" style={{ borderTop: "1px solid #f0f0f0", padding: "16px" }}>
        {isPosted ? (
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <LockOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
            <Text type="secondary">This response has been posted and cannot be edited.</Text>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: "8px" }} />
            <Text type="secondary">
              {isDraft
                ? "This question is in draft mode. You can edit it multiple times before posting."
                : "Once you start editing, this question will be saved as a draft."}
            </Text>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          {!isPosted && (
            <>
              <Button 
                onClick={handleSaveAsDraft} 
                disabled={(!isEditing && !isDraft) || user_control?.role !== "client" || isSubmitting}
                loading={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button
                type="primary"
                onClick={handlePostQuestion}
                disabled={(!isEditing && !isDraft) || user_control?.role !== "client" || isSubmitting}
                style={{ background: user_control?.role !== "client" ? "#E2E8F0" : "rgb(15 91 109)", color: "white" }}
                loading={isSubmitting}
              >
                Post
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
export default ClientQuestionnaireRespondModel;