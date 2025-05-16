"use client"

import { Row, Col, Card, Progress, Typography } from "antd"
import { UserOutlined, LockOutlined, StopOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const ClientsOverview = () => {
  // Mock data for client status percentages
  const clientData = {
    active: 72,
    inactive: 18,
    pending: 10,
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Title level={4}>Client Status Overview</Title>
        <Text className="text-gray-500 dark:text-gray-400">Distribution of clients by their current status</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="text-center h-full shadow-sm rounded-lg hover:shadow-md transition-shadow">
            <UserOutlined className="text-4xl text-green-500 mb-4" />
            <Title level={3} className="m-0 text-green-600 dark:text-green-400">
              {clientData.active}%
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">Active Clients</Text>
            <div className="mt-4">
              <Progress
                percent={clientData.active}
                showInfo={false}
                strokeColor="#10B981"
                trailColor="#E5E7EB"
                strokeWidth={8}
                className="custom-progress"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="text-center h-full shadow-sm rounded-lg hover:shadow-md transition-shadow">
            <StopOutlined className="text-4xl text-red-500 mb-4" />
            <Title level={3} className="m-0 text-red-600 dark:text-red-400">
              {clientData.inactive}%
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">Inactive Clients</Text>
            <div className="mt-4">
              <Progress
                percent={clientData.inactive}
                showInfo={false}
                strokeColor="#EF4444"
                trailColor="#E5E7EB"
                strokeWidth={8}
                className="custom-progress"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="text-center h-full shadow-sm rounded-lg hover:shadow-md transition-shadow">
            <LockOutlined className="text-4xl text-yellow-500 mb-4" />
            <Title level={3} className="m-0 text-yellow-600 dark:text-yellow-400">
              {clientData.pending}%
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">Pending Clients</Text>
            <div className="mt-4">
              <Progress
                percent={clientData.pending}
                showInfo={false}
                strokeColor="#F59E0B"
                trailColor="#E5E7EB"
                strokeWidth={8}
                className="custom-progress"
              />
            </div>
          </Card>
        </Col>
      </Row>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <Text className="text-gray-500 dark:text-gray-400">
              Total number of clients: <span className="font-bold">128</span>
            </Text>
          </div>
          <div className="mt-4 md:mt-0">
            <Text className="text-gray-500 dark:text-gray-400">
              Last updated: <span className="font-medium">Today at 10:30 AM</span>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientsOverview
