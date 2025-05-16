"use client"

import { Row, Col, Card, Progress, Typography } from "antd"
import { CheckCircleOutlined, ClockCircleOutlined, FileOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const QuestionnairesOverview = () => {
  // Mock data for questionnaire status percentages
  const questionnaireData = {
    completed: 45,
    inProgress: 30,
    notStarted: 25,
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Title level={4}>Questionnaire Status Overview</Title>
        <Text className="text-gray-500 dark:text-gray-400">Overview of all client questionnaires</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="text-center h-full shadow-sm rounded-lg hover:shadow-md transition-shadow">
            <CheckCircleOutlined className="text-4xl text-green-500 mb-4" />
            <Title level={3} className="m-0 text-green-600 dark:text-green-400">
              {questionnaireData.completed}%
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">Completed</Text>
            <div className="mt-4">
              <Progress
                percent={questionnaireData.completed}
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
            <ClockCircleOutlined className="text-4xl text-blue-500 mb-4" />
            <Title level={3} className="m-0 text-blue-600 dark:text-blue-400">
              {questionnaireData.inProgress}%
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">In Progress</Text>
            <div className="mt-4">
              <Progress
                percent={questionnaireData.inProgress}
                showInfo={false}
                strokeColor="#3B82F6"
                trailColor="#E5E7EB"
                strokeWidth={8}
                className="custom-progress"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="text-center h-full shadow-sm rounded-lg hover:shadow-md transition-shadow">
            <FileOutlined className="text-4xl text-gray-500 mb-4" />
            <Title level={3} className="m-0 text-gray-600 dark:text-gray-400">
              {questionnaireData.notStarted}%
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">Not Started</Text>
            <div className="mt-4">
              <Progress
                percent={questionnaireData.notStarted}
                showInfo={false}
                strokeColor="#6B7280"
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
              Total questionnaires: <span className="font-bold">64</span>
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

export default QuestionnairesOverview
