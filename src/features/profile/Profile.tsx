"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Card, Avatar, Typography, Tabs, Form, Input, Button, Divider, Row, Col, Upload, message } from "antd"
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import type { RootState } from "../../store"
import { Link } from "react-router-dom"

const { Title, Text } = Typography
const { TabPane } = Tabs

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(false)
  const [personalForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  console.log(user)
  // Mock user data
  const userData = {
    id: user?.id || "user123",
    name: user?.name || "CA Firm",
    email: user?.email || "admin@zatoacounting.com",
    role: user?.role || "Administrator",
    phone: user?.role === "client" ? "+64 12345 67890" : "+64 12309 87654",
    company: user?.role === "client" ? "Sample Company" : user?.role === "admin" ? "Sample CA Firm" : "Zato Accounting",
    position: user?.role === "client" ? "Client" : user?.role === "admin" ? "CA" : "Support",
    joinDate: "January 15, 2024",
  }

  const handlePersonalInfoSubmit = (values: any) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Updated personal info:", values)
      message.success("Personal information updated successfully")
      setLoading(false)
    }, 1000)
  }

  const handlePasswordSubmit = (values: any) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Password change requested:", values)
      message.success("Password changed successfully")
      passwordForm.resetFields()
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {user?.role === "client" ? (
        <div className="flex items-center justify-between">
          <Link to="/view-clients" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeftOutlined size={20} /> Back</Link>
          <Title level={3} className="m-0">My Profile</Title>
        </div>) : <Title level={3} className="m-0">My Profile</Title>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginTop: user_control?.role === "client" ? "0" : "24px" }}>
        {/* Profile Summary Card */}
        <Card bordered={false} className="rounded-xl shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar size={100} icon={<UserOutlined />} className="bg-teal-700 dark:bg-teal-600 mb-4" />
            <Title level={4} className="m-0 mb-1">
              {userData.name}
            </Title>
            <Text type="secondary" className="mb-3">
              {userData.position}
            </Text>
            <div className="w-full">
              <Divider />
              <div className="flex items-center mb-3">
                <MailOutlined className="mr-2 text-gray-500 dark:text-gray-400" />
                <Text>{userData.email}</Text>
              </div>
              <div className="flex items-center mb-3">
                <PhoneOutlined className="mr-2 text-gray-500 dark:text-gray-400" />
                <Text>{userData.phone}</Text>
              </div>
              <div className="flex items-center">
                <UserOutlined className="mr-2 text-gray-500 dark:text-gray-400" />
                <Text>{userData.role}</Text>
              </div>
              <Divider />
              <div className="text-left">
                <div className="mb-2">
                  <Text type="secondary">Company:</Text>
                  <div>{userData.company}</div>
                </div>
                <div>
                  <Text type="secondary">Member Since:</Text>
                  <div>{userData.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details Card */}
        <Card bordered={false} className="rounded-xl shadow-sm lg:col-span-2">
          <Tabs defaultActiveKey="personal">
            <TabPane tab="Personal Information" key="personal">
              <Form
                form={personalForm}
                layout="vertical"
                initialValues={{
                  name: userData.name,
                  email: userData.email,
                  phone: userData.phone,
                  company: userData.company,
                  position: userData.position,
                }}
                onFinish={handlePersonalInfoSubmit}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="phone" label="Phone Number">
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="position" label="Position">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="company" label="Company">
                  <Input />
                </Form.Item>

                <Form.Item name="avatar" label="Profile Picture">
                  <Upload name="avatar" listType="picture" maxCount={1} action="/api/upload" className="w-full">
                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Change Password" key="password">
              <Form form={passwordForm} layout="vertical" onFinish={handlePasswordSubmit}>
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: "Please enter your current password" }]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: "Please enter your new password" },
                    { min: 8, message: "Password must be at least 8 characters" },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Please confirm your new password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error("The two passwords do not match"))
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Update Password
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default Profile
