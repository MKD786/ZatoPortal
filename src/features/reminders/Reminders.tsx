"use client"

import { useState, useEffect } from "react"
import { Card, Typography, Table, Tag, Button, Space, Modal, Form, Input, DatePicker, Select, message } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

interface Reminder {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "completed"
  clientId?: string
}

const mockReminders: Reminder[] = [
  {
    id: "1",
    title: "Tax Return Deadline",
    description: "Complete tax return for Johnson & Co",
    dueDate: "2023-05-15",
    priority: "high",
    status: "pending",
    clientId: "2",
  },
  {
    id: "2",
    title: "Quarterly Financial Review",
    description: "Review Q1 financials for Smith Enterprises",
    dueDate: "2023-04-30",
    priority: "medium",
    status: "pending",
    clientId: "1",
  },
  {
    id: "3",
    title: "Payroll Processing",
    description: "Process monthly payroll for Brown Industries",
    dueDate: "2023-04-28",
    priority: "high",
    status: "completed",
    clientId: "3",
  },
  {
    id: "4",
    title: "Annual Compliance Check",
    description: "Ensure all compliance documents are up to date for Wilson Ltd",
    dueDate: "2023-06-15",
    priority: "low",
    status: "pending",
    clientId: "5",
  },
  {
    id: "5",
    title: "Client Meeting Preparation",
    description: "Prepare documents for meeting with Davis Consulting",
    dueDate: "2023-05-05",
    priority: "medium",
    status: "pending",
    clientId: "4",
  },
]

const mockClients = [
  { id: "1", name: "Smith Enterprises" },
  { id: "2", name: "Johnson & Co" },
  { id: "3", name: "Brown Industries" },
  { id: "4", name: "Davis Consulting" },
  { id: "5", name: "Wilson Ltd" },
]

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReminders([...mockReminders])
      setLoading(false)
    }, 800)
  }

  const handleAddReminder = () => {
    setEditingReminder(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    form.setFieldsValue({
      ...reminder,
      dueDate: dayjs(reminder.dueDate),
    })
    setIsModalVisible(true)
  }

  const handleDeleteReminder = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this reminder?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        setReminders(reminders.filter((reminder) => reminder.id !== id))
        message.success("Reminder deleted successfully")
      },
    })
  }

  const handleCompleteReminder = (id: string) => {
    setReminders(reminders.map((reminder) => (reminder.id === id ? { ...reminder, status: "completed" } : reminder)))
    message.success("Reminder marked as completed")
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      const formattedValues = {
        ...values,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      }

      if (editingReminder) {
        // Update existing reminder
        setReminders(
          reminders.map((reminder) =>
            reminder.id === editingReminder.id ? { ...reminder, ...formattedValues } : reminder,
          ),
        )
        message.success("Reminder updated successfully")
      } else {
        // Create new reminder
        const newReminder: Reminder = {
          id: Math.random().toString(36).substring(2, 9),
          ...formattedValues,
          status: "pending",
        }
        setReminders([...reminders, newReminder])
        message.success("Reminder created successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a: Reminder, b: Reminder) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Client",
      dataIndex: "clientId",
      key: "clientId",
      render: (clientId: string) => {
        const client = mockClients.find((c) => c.id === clientId)
        return client ? client.name : "N/A"
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a: Reminder, b: Reminder) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      render: (date: string) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        const colorMap = {
          high: "red",
          medium: "orange",
          low: "green",
        }
        return (
          <Tag color={colorMap[priority as keyof typeof colorMap]} className="rounded-md">
            {priority.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "blue"} className="rounded-md">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Reminder) => (
        <Space size="middle">
          {record.status !== "completed" && (
            <Button
              icon={<CheckOutlined />}
              onClick={() => handleCompleteReminder(record.id)}
              type="text"
              style={{ color: "green" }}
              className="rounded-lg"
            />
          )}
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditReminder(record)}
            type="text"
            className="rounded-lg"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteReminder(record.id)}
            type="text"
            danger
            className="rounded-lg"
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Title level={3} className="m-0 text-xl md:text-2xl">
          Reminders
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddReminder} className="rounded-lg">
          Add Reminder
        </Button>
      </div>

      <Card bordered={false} className="rounded-xl shadow-sm">
        <Table
          columns={columns}
          dataSource={reminders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, className: "rounded-lg" }}
          scroll={{ x: 1000 }}
          className="rounded-lg overflow-hidden"
        />
      </Card>

      <Modal
        title={editingReminder ? "Edit Reminder" : "Add Reminder"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        className="rounded-xl"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} className="rounded-lg" />
          </Form.Item>

          <Form.Item name="clientId" label="Client">
            <Select placeholder="Select a client" className="rounded-lg">
              {mockClients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: "Please select a due date" }]}>
            <DatePicker style={{ width: "100%" }} className="rounded-lg" />
          </Form.Item>

          <Form.Item name="priority" label="Priority" rules={[{ required: true, message: "Please select a priority" }]}>
            <Select className="rounded-lg">
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Reminders
