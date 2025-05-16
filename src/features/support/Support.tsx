"use client"

import { useState } from "react"
import {
  Card,
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  List,
  Avatar,
  Space,
  Divider,
} from "antd"
import {
  UploadOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import type { TabsProps } from "antd"
import { Link } from "react-router-dom"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

interface FAQ {
  question: string
  answer: string
}

interface Resource {
  id: string
  title: string
  description: string
  type: "guide" | "video" | "template"
  url: string
}

const mockFAQs: FAQ[] = [
  {
    question: "How do I add a new client?",
    answer:
      "You can add a new client by navigating to the Client Management page and clicking the 'Add Client' button in the top right corner. Fill in the required information and click 'Save'.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on the 'Forgot password?' link on the login page. You will receive an email with instructions to reset your password.",
  },
  {
    question: "Can I export client data?",
    answer:
      "Yes, you can export client data by going to the Client Management page, selecting the clients you want to export, and clicking the 'Export' button.",
  },
  {
    question: "How do I set up reminders?",
    answer:
      "You can set up reminders by navigating to the Reminders page and clicking the 'Add Reminder' button. Fill in the details including title, description, due date, and priority.",
  },
  {
    question: "What file formats are supported for uploads?",
    answer:
      "We support various file formats including PDF, DOCX, XLSX, CSV, JPG, and PNG. The maximum file size is 10MB per file.",
  },
]

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Getting Started Guide",
    description: "A comprehensive guide to help you get started with the platform.",
    type: "guide",
    url: "/resources/getting-started.pdf",
  },
  {
    id: "2",
    title: "Client Management Tutorial",
    description: "Learn how to effectively manage your clients in the system.",
    type: "video",
    url: "/resources/client-management.mp4",
  },
  {
    id: "3",
    title: "Tax Return Template",
    description: "A template for preparing tax returns for your clients.",
    type: "template",
    url: "/resources/tax-return-template.xlsx",
  },
  {
    id: "4",
    title: "Financial Reporting Guide",
    description: "Best practices for financial reporting and compliance.",
    type: "guide",
    url: "/resources/financial-reporting.pdf",
  },
  {
    id: "5",
    title: "Data Security Best Practices",
    description: "Learn how to keep your client data secure.",
    type: "guide",
    url: "/resources/data-security.pdf",
  },
]

const Support = () => {
  const [supportForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const handleSupportSubmit = async (values: any) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Support request submitted:", values)
      message.success("Your support request has been submitted. We'll get back to you soon.")
      supportForm.resetFields()
      setLoading(false)
    }, 1000)
  }

  const items: TabsProps["items"] = [
    {
      key: "faq",
      label: "FAQ",
      children: (
        <div className="space-y-6">
          <Paragraph>Find answers to frequently asked questions about using the platform.</Paragraph>

          <List
            itemLayout="vertical"
            dataSource={mockFAQs}
            renderItem={(item) => (
              <List.Item>
                <div className="space-y-2">
                  <Title level={5} className="flex items-center">
                    <QuestionCircleOutlined className="mr-2 text-primary" />
                    {item.question}
                  </Title>
                  <Paragraph>{item.answer}</Paragraph>
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "resources",
      label: "Resources",
      children: (
        <div className="space-y-6">
          <Paragraph>Access guides, tutorials, and templates to help you use the platform effectively.</Paragraph>

          <List
            itemLayout="horizontal"
            dataSource={mockResources}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button key="download" type="link">
                    Download
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<FileTextOutlined />}
                      style={{
                        backgroundColor:
                          item.type === "guide" ? "#1677ff" : item.type === "video" ? "#f5222d" : "#52c41a",
                      }}
                    />
                  }
                  title={<a href={item.url}>{item.title}</a>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact Support",
      children: (
        <div className="space-y-6">
          <Paragraph>
            Need help? Fill out the form below and our support team will get back to you as soon as possible.
          </Paragraph>

          <Form form={supportForm} layout="vertical" onFinish={handleSupportSubmit}>
            <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please enter a subject" }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select a category">
                <Option value="technical">Technical Issue</Option>
                <Option value="billing">Billing</Option>
                <Option value="feature">Feature Request</Option>
                <Option value="account">Account Management</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter a description" }]}
            >
              <TextArea rows={5} />
            </Form.Item>

            <Form.Item
              name="attachments"
              label="Attachments"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e
                }
                return e?.fileList
              }}
            >
              <Upload name="files" action="/upload" listType="text">
                <Button icon={<UploadOutlined />}>Upload Files</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Request
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div className="space-y-4">
            <Title level={5}>Other Ways to Reach Us</Title>

            <Space direction="vertical">
              <div className="flex items-center">
                <PhoneOutlined className="mr-2" />
                <Text>Phone: +64 12345 67890</Text>
              </div>

              <div className="flex items-center">
                <MailOutlined className="mr-2" />
                <Text>Email: {user_control.role === "client" ? "samplecafirm@gmail.com" : "support@zatoacounting.com"}</Text>
              </div>
            </Space>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {user_control?.role === "client" ? (
        <div className="flex items-center justify-between">
          <Link to="/view-clients" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeftOutlined size={20} /> Back</Link>
          <Title level={3} className="m-0">Support</Title>
        </div>) : (
      <Title level={3} className="m-0">Support</Title>
      )}

      <Card bordered={false} style={{ marginTop: user_control?.role === "client" ? "0" : "24px" }}>
        <Tabs defaultActiveKey="faq" items={items} />
      </Card>
    </div>
  )
}

export default Support
