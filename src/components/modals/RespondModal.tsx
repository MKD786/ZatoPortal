"use client"

import { Modal, Input, Button, Upload } from "antd"
import { useState } from "react"
import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, EyeOutlined, FileExcelOutlined, FileOutlined, FilePdfOutlined } from "@ant-design/icons"

interface RespondModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: any) => void
  query?: {
    id: string
    description: string
    raisedDate: string
    dueDate: string
    status: string
    urgency: {
      status: string
      color: string
    }
    index?: number
    total?: number
  }
  onPrevious?: () => void
  onNext?: () => void
}

const { TextArea } = Input

const RespondModal = ({ visible, onClose, onSubmit, query, onPrevious, onNext }: RespondModalProps) => {
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const [response, setResponse] = useState("")
  const [fileList, setFileList] = useState<any[]>(
    user_control.role !== "client" ? [
      {
        name: "GL_Last_Year.xlsx",
        size: 1024,
        uid: "1"
      },
      {
        name: "GL_Current_Year.xlsx",
        size: 1024,
        uid: "2"
      },
      {
        name: "Bank or Credit.pdf",
        size: 1024,
        uid: "3"
      }
    ] : []
  )
  console.log("query", query)
  const handleSubmit = () => {
    onSubmit({
      response,
      files: fileList,
    })
    setResponse("")
    setFileList([])
  }

  // Calculate elapsed days
  const calculateElapsedDays = (raisedDate: string) => {
    if (!raisedDate) return "0"
    const raised = new Date(raisedDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - raised.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays.toString()
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      closable={false}
      className="respond-modal"
      //   style={{ top: 20 }}
      bodyStyle={{ padding: 0 }}
    >
      {query && (
        <div style={{ borderRadius: "8px", overflow: "hidden" }}>
          {/* Custom header */}
          <div style={{ backgroundColor: "#0F3A47", color: "white", padding: "1rem", position: "relative" }}>
            {/* <div style={{ position: "absolute", top: 15, right: 15 }}>
              <Button type="text" onClick={onClose} style={{ color: "white", fontSize: "18px" }}>×</Button>
            </div> */}
            <div className="flex items-center justify-left mb-2 gap-2">
              <h2 style={{ color: "white", fontSize: "1.2rem", fontWeight: 500 }}>Respond to Query</h2>
             <p>| ACCT. Manager: Jane Smith</p>
              {/* {user_control?.role === "client" && <p>| ACCT. Manager: Jane Smith</p>} */}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#A0AEB8", marginBottom: "5px" }}>Query ID:</div>
                <div style={{ fontSize: "16px", fontWeight: 500 }}>{query.id}</div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#A0AEB8", marginBottom: "5px" }}>Raised:</div>
                <div>{query.raisedDate}</div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#A0AEB8", marginBottom: "5px" }}>Due:</div>
                <div>{query.dueDate}</div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#A0AEB8", marginBottom: "5px" }}>Elapsed:</div>
                <div>{calculateElapsedDays(query.raisedDate)} days</div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#A0AEB8", marginBottom: "5px" }}>Status:</div>
                <div style={{ backgroundColor: query.urgency.color, color: "white", padding: "2px 10px", borderRadius: "20px", display: "inline-block", fontSize: "14px" }}>
                  {query.urgency.status}
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div>
            {/* Query navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: "0.4rem", background: "#EBF8FF", padding: "0.5rem 0.7rem" }}>
              <div style={{ color: "#4A5568", fontSize: "14px" }}>Query {query.index || 1} of {query.total || 2}</div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button icon={<ArrowLeftOutlined />} onClick={onPrevious} disabled={!onPrevious || (query.index || 1) <= 1} style={{ display: "flex", alignItems: "center", color: "#4A5568", borderColor: "#E2E8F0" }}>
                  <span style={{ marginLeft: "5px" }}>Previous Query</span>
                </Button>
                <Button
                  onClick={onNext}
                  disabled={!onNext || (query.index || 1) >= (query.total || 2)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#4A5568",
                    borderColor: "#E2E8F0",
                  }}
                >
                  <span style={{ marginRight: "5px" }}>Next Query</span>
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
                  marginBottom: "10px",
                  color: "#2D3748",
                  fontWeight: 500,
                }}
              >
                <span style={{ marginRight: "8px", color: "#4A5568" }}>💬</span>
                Query
              </div>
              <div
                style={{
                  backgroundColor: "#EBF8FF",
                  padding: "15px",
                  borderRadius: "5px",
                  color: "#2D3748",
                }}
              >
                {query.description}
              </div>
            </div>

            {/* Response section */}
            <div style={{ padding: "0.5rem 1rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", color: "#2D3748", fontWeight: 500, }}>
                <span style={{ marginRight: "8px", color: "#4A5568" }}>✉️</span> Your Response</div>
              <TextArea
                rows={6}
                placeholder="Type your response here..."
                value={response}
                disabled={user_control?.role === "admin"}
                onChange={(e) => setResponse(e.target.value)}
                autoSize={{ minRows: 3 }}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  border: "2px solid #E2E8F0",
                }}
              />
            </div>

            {/* File attachment section */}
            <div className="response-model-upload" style={{ padding: "0.5rem 1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", color: "#2D3748", fontWeight: 500, }}>
                  <span style={{ paddingRight: "0.2rem", color: "#4A5568" }}>📎</span>Attach Files</div>
                {/* <div style={{ display: "flex", gap: "10px" }}>
                  <Button style={{ display: "flex", alignItems: "center", color: "#4A5568", borderColor: "#E2E8F0" }}>
                    <span style={{ marginRight: "5px" }}>📄</span>FYI Docs</Button>
                  <Button style={{ display: "flex", alignItems: "center", color: "#4A5568", borderColor: "#E2E8F0" }}>
                    <span style={{ marginRight: "5px" }}>📦</span>Dropbox</Button>
                  <Button style={{ display: "flex", alignItems: "center", color: "#4A5568", borderColor: "#E2E8F0" }}>
                    <span style={{ marginRight: "5px" }}>📁</span>Google Drive</Button>
                </div> */}
              </div>

              {/* File upload area */}
              {user_control?.role === "client" && (
                <div>
                  <Upload className="flex w-full" multiple fileList={fileList} onChange={(info) => setFileList(info.fileList)} style={{ width: "100%" }} accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png" beforeUpload={() => false}>
                    <div style={{ border: "2px dashed #CBD5E0", borderRadius: "5px", padding: "1rem", textAlign: "center", backgroundColor: "#F7FAFC", width: "100%" }}>
                      <div>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto" }}>
                          <path d="M12 6v12M18 12H6" stroke="#A0AEB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#A0AEB8" strokeWidth="2" />
                        </svg>
                      </div>
                      <div style={{ color: "#4A5568" }}>Drag and drop your files here, or click to browse</div>
                      <div style={{ fontSize: "12px", color: "#A0AEB8" }}>Supports PDF, Excel, Word, and image files</div>
                      <Button style={{ borderColor: "#E2E8F0", color: "#4A5568" }}>Browse Files</Button>
                    </div>
                  </Upload>
                </div>
              )}
              <div style={{ padding: "0 0.4rem 0.4rem 0.8rem" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {fileList.map(file => (
                    <li key={file.uid}>
                      <div className="flex items-center justify-between mb-1 sm:w-full md:w-[33.3%] lg:w-[33.3%%] py-1">
                        {user_control?.role === "client" &&
                          <>
                            <DeleteOutlined style={{ color: "red" }} onClick={() => setFileList(fileList.filter(f => f.uid !== file.uid))} />
                            <EyeOutlined style={{ color: "green" }} />
                          </>}
                        <span className="text-gray-500 text-[0.7rem] pl-1">{file.name}
                          <span style={{ marginLeft: "0.25rem" }}>
                            {file.name.endsWith(".pdf") && <FilePdfOutlined style={{ color: "red" }} />}
                            {file.name.endsWith(".xlsx") && <FileExcelOutlined style={{ color: "#0c29cfe0" }} />}
                            {file.name.endsWith(".csv") && <FileExcelOutlined />}
                            {!(file.name.endsWith(".pdf") || file.name.endsWith(".xlsx") || file.name.endsWith(".csv")) && <FileOutlined />}
                          </span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer buttons */}
            {/* <div className="flex justify-between items-center" style={{ borderTop: "1px solid #f0f0f0", padding: "16px" }}> */}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #E2E8F0", padding: "1rem" }}>
                <Button onClick={onClose} style={{ borderColor: "#E2E8F0", color: "#4A5568" }}>
                  Close</Button>
                <Button disabled={user_control?.role === "admin"} onClick={() => { alert("Response saved as draft."); onClose() }} style={{ borderColor: "#E2E8F0", color: "#4A5568" }}>
                  Save as Draft</Button>
                {user_control?.role === "client" && (
                  <Button onClick={handleSubmit} style={{ backgroundColor: "#0f3a47", color: "white", borderColor: "#718096", display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "5px" }}>✉️</span> Save</Button>
                )}
              </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </Modal>
  )
}

export default RespondModal
