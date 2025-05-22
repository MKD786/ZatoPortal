import type React from "react"
import { useState, useRef } from "react"
import { Card, Input, Radio, Checkbox, Button, Tooltip, Typography, message, Space, Badge, Divider } from "antd"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  FileTextOutlined,
  DeleteOutlined,
  SendOutlined,
  EyeOutlined,
  HistoryOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons"

const { TextArea } = Input
const { Text, Title } = Typography

interface QueryDisplayProps {
  questionNumber: string
  questionText: string
  previousAnswer?: {
    response: "Yes" | "No" | "N/A"
    details: string
  }
  onSave?: (data: any) => void
  onPost?: (data: any) => void
  onPrevious?: () => void
  onNext?: () => void
  isFirst?: boolean
  isLast?: boolean
}

interface FileInfo {
  name: string
  size: number
  id: string
}

export function QueryDisplay({
  questionNumber,
  questionText,
  previousAnswer,
  onSave,
  onPost,
  onPrevious,
  onNext,
  isFirst,
  isLast,
}: QueryDisplayProps) {
  const [response, setResponse] = useState<"Yes" | "No" | "N/A">("N/A")
  const [details, setDetails] = useState("")
  const [isSaved, setIsSaved] = useState(true)
  const [files, setFiles] = useState<FileInfo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Always use the default previous answer as specified
  const defaultPreviousAnswer = {
    response: "Yes",
    details: "Completed all requirements on 30/05/2024",
  }
  const prevAnswer = previousAnswer || defaultPreviousAnswer

  const handleResponseChange = (value: "Yes" | "No" | "N/A") => {
    setResponse(value)
    setIsSaved(false)
  }

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(e.target.value)
    setIsSaved(false)
  }

  const handleUsePreviousAnswer = () => {
    // if (previousAnswer) {
    //   setResponse(previousAnswer.response)
    //   setDetails(previousAnswer.details)
    //   setIsSaved(false)
    // }
    setResponse("Yes")
    setDetails("Yes - Completed all requirements on 30/05/2024")
    setIsSaved(false)
  }

  const clearText = () => {
    setDetails("")
    setIsSaved(false)
    message.info("Text cleared")
  }

  const handleSave = () => {
    setTimeout(() => {
      setIsSaved(true)
      message.success("Response saved as draft")
      if (onSave) {
        onSave({
          response,
          details,
          files,
          status: "draft",
        })
      }
    }, 500)
  }

  const handlePost = () => {
    setTimeout(() => {
      setIsSaved(true)
      message.success("Response posted successfully")
      if (onPost) {
        onPost({
          response,
          details,
          files,
          status: "posted",
        })
      }
    }, 500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        id: Math.random().toString(36).substring(2, 9),
      }))
      setFiles((prev) => [...prev, ...newFiles])
      setIsSaved(false)
    }
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
    setIsSaved(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Card
      style={{ marginBottom: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Text strong style={{ color: "#2c3e50" }}>
            {questionNumber}
          </Text>
          <Text style={{ color: "#2c3e50" }}>{questionText}</Text>
        </div>
      }
      headStyle={{ backgroundColor: "#f9fafb", padding: "12px 24px" }}
      bodyStyle={{ padding: "24px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Response options positioned at the top */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text strong>Response:</Text>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Radio.Group
              value={response === "Yes" || response === "No" ? response : ""}
              onChange={(e) => handleResponseChange(e.target.value)}
              style={{ display: "flex", alignItems: "center", }}
            >
              <Radio value="Yes" style={{ color: "#000000", fontWeight: "500" }} className="custom-radio" >Yes</Radio>
              <Radio value="No" style={{ color: "#000000", fontWeight: "500" }} className="custom-radio">No</Radio>
            </Radio.Group>

            <Checkbox
              style={{
                fontWeight: "bold",
                color: "#000000"
              }}
              className="custom-checkbox"
              checked={response === "N/A"}
              onChange={(e) => {
                if (e.target.checked) handleResponseChange("N/A")
              }}
            >
              N/A
            </Checkbox>

            {/* File upload button */}
            <Tooltip title="Upload file">
              <Button
                icon={<UploadOutlined style={{ color: "#1890ff" }} />}
                shape="circle"
                size="small"
                onClick={() => fileInputRef.current?.click()}
              />
            </Tooltip>
            <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />
          </div>
        </div>
        

        {/* Response text area with action buttons */}
        <div style={{ position: "relative" }}>
          <TextArea
            placeholder="Enter details of compliance activities completed..."
            style={{ minHeight: "50px", paddingRight: "48px", resize: "vertical" }}
            value={details}
            onChange={handleDetailsChange}
          />

          {/* Action buttons inside textarea */}
          <div style={{ position: "absolute", bottom: "12px", right: "12px", display: "flex", gap: "8px" }}>
            <Tooltip title="Cancel">
              <Button
                icon={<CloseCircleOutlined style={{ color: "#f5222d" }} />}
                shape="circle"
                size="small"
                onClick={clearText}
                style={{ backgroundColor: "white" }}
              />
            </Tooltip>

            <Tooltip title="Save as draft">
              <Button
                icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                shape="circle"
                size="small"
                onClick={handleSave}
                style={{ backgroundColor: "white" }}
              />
            </Tooltip>

            <Tooltip title="Post response">
              <Button
                icon={<SendOutlined style={{ color: "#1890ff" }} />}
                shape="circle"
                size="small"
                onClick={handlePost}
                style={{ backgroundColor: "white" }}
              />
            </Tooltip>
          </div>
        </div>

        {/* Previous Year response */}
        {previousAnswer && (
          <div
            style={{
              backgroundColor: "#EFF6FF",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#595959",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong>Previous year:</Text> {previousAnswer.response} - {previousAnswer.details}
              </div>
              <Button
                type="link"
                size="small"
                icon={<HistoryOutlined />}
                onClick={handleUsePreviousAnswer}
                style={{ fontSize: "12px", color: "#2563eb" }}
              >
                Use Previous
              </Button>
            </div>
          </div>
        )}

        {/* Display uploaded files */}
        {files.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Text strong>Uploaded Files:</Text>
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "4px",
                  border: "1px solid #f0f0f0",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileTextOutlined style={{ color: "#8c8c8c" }} />
                  <Text strong>{file.name}</Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    ({formatFileSize(file.size)})
                  </Text>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                  // onClick={() => {
                  //   message.info(Viewing file: ${file.name})
                  // }}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => removeFile(file.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}



      </div>
    </Card>
  )
}

export default QueryDisplay