import {
  DownloadOutlined,
  UserAddOutlined,
  UserOutlined,
  MessageOutlined,
  FileOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons"
import { Button, Card, Col, Row, Space, Tabs, Typography } from "antd"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchDashboardData } from "./dashboard.slice"
import type { AppDispatch } from "@/store"
import { Link } from "react-router-dom"
// import { fetchDashboardData } from "./dashboardSlice"

const { TabPane } = Tabs
const { Title, Text } = Typography

// Replace the existing Dashboard component with this implementation
const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchDashboardData())
    }

    fetchData()
  }, [dispatch])
  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <div>
          <Title level={2} className="m-0 text-2xl font-bold">
            Dashboard
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">Welcome back to your CA Firm Portal</Text>
        </div>
        <Space className="mt-4 sm:mt-0">
          <Button icon={<DownloadOutlined />} className="flex items-center">
            Export
          </Button>
          <Link to="/clients"><Button type="primary" icon={<UserAddOutlined />} className="flex items-center">
            New Client
          </Button></Link>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm rounded-lg hover:shadow-md transition-shadow dashboard-header-card">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-gray-500 dark:text-gray-400">Total Clients</Text>
                <Title level={4} className="m-0 mt-1">
                  128
                </Title>
                <Text className="text-green-600 dark:text-green-400">+6 from last month</Text>
                <div className="mt-1">
                  <a href="/view-clients" className="text-xs text-primary-teal dark:text-primary-dark">
                    View all clients
                  </a>
                </div>
              </div>
              <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900">
                <UserOutlined className="text-blue-500 dark:text-blue-400 text-base" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm rounded-lg hover:shadow-md transition-shadow dashboard-header-card">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-gray-500 dark:text-gray-400">Active Queries</Text>
                <Title level={4} className="m-0 mt-1">
                  45
                </Title>
                <Text className="text-green-600 dark:text-green-400">+12 from last week</Text>
                <div className="mt-1">
                  <a href="#" className="text-xs text-primary-teal dark:text-primary-dark">
                    View client queries
                  </a>
                </div>
              </div>
              <div className="p-1.5 rounded-full bg-green-50 dark:bg-green-900">
                <MessageOutlined className="text-green-500 dark:text-green-400 text-base" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm rounded-lg hover:shadow-md transition-shadow dashboard-header-card">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-gray-500 dark:text-gray-400">Pending Documents</Text>
                <Title level={4} className="m-0 mt-1">
                  32
                </Title>
                <Text className="text-red-600 dark:text-red-400">-4 from last week</Text>
                <div className="mt-1">
                  <a href="#" className="text-xs text-primary-teal dark:text-primary-dark">
                    View client documents
                  </a>
                </div>
              </div>
              <div className="p-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900">
                <FileOutlined className="text-yellow-500 dark:text-yellow-400 text-base" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm rounded-lg hover:shadow-md transition-shadow dashboard-header-card">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-gray-500 dark:text-gray-400">Response Rate</Text>
                <Title level={4} className="m-0 mt-1">
                  78%
                </Title>
                <Text className="text-green-600 dark:text-green-400">+2% from last month</Text>
              </div>
              <div className="p-1.5 rounded-full bg-purple-50 dark:bg-purple-900">
                <BarChartOutlined className="text-purple-500 dark:text-purple-400 text-base" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="rounded-lg shadow-sm p-0">
        <Tabs activeKey={activeTab} onChange={handleTabChange} className="dashboard-tabs">
          <TabPane tab="Overview" key="overview">
            <div className="p-4">
              <Row gutter={[24, 16]} className="dashboard-overview">
                <Col xs={24} lg={8}>
                  <div style={{ height: "100%", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "16px" }}>
                    <div className="text-lg font-medium">Client Engagement</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Client activity over the last 30 days
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      [Chart Placeholder]
                    </div>
                  </div>
                </Col>
                <Col xs={24} lg={8}>
                  <div style={{ height: "100%", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "16px" }}>
                    <div className="text-lg font-medium">Query Response Time</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Average time to respond to queries
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      [Chart Placeholder]
                    </div>
                  </div>
                </Col>
                <Col xs={24} lg={8}>
                  <div style={{ height: "100%", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "16px" }}>
                    <div className="text-lg font-medium">Recent Activity</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Latest client interactions</div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                          <MessageOutlined className="text-blue-500 dark:text-blue-400 text-sm" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">New query response</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Smith Enterprises - 2 hours ago
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-green-100 dark:bg-green-900">
                          <FileOutlined className="text-green-500 dark:text-green-400 text-sm" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Document uploaded</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Johnson Consulting - 4 hours ago
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900">
                          <CheckCircleOutlined className="text-purple-500 dark:text-purple-400 text-sm" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Questionnaire completed</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Williams Manufacturing - 1 day ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane tab="Clients" key="clients">
            <div className="p-4">
              <div className="text-lg font-medium">Client Overview</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Quick view of client status</div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <CheckCircleOutlined className="text-green-500 mr-2" />
                      <span className="text-sm">Active Clients</span>
                    </div>
                    <span className="font-medium">86</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-yellow-500 mr-2" />
                      <span className="text-sm">Pending Clients</span>
                    </div>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "19%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <StopOutlined className="text-red-500 mr-2" />
                      <span className="text-sm">Inactive Clients</span>
                    </div>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "14%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <a href="/clients" className="text-primary-teal dark:text-primary-dark text-sm">
                  View detailed client management
                </a>
              </div>
            </div>
          </TabPane>

          <TabPane tab="Questionnaires" key="questionnaires">
            <div className="p-4">
              <div className="text-lg font-medium">Questionnaire Status</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Overview of all client questionnaires</div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <CheckCircleOutlined className="text-green-500 mr-2" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-blue-500 mr-2" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="font-medium">36</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "36%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <FileOutlined className="text-gray-500 mr-2" />
                      <span className="text-sm">Not Started</span>
                    </div>
                    <span className="font-medium">22</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <a href="/questionnaires" className="text-primary-teal dark:text-primary-dark text-sm">
                  View all questionnaires
                </a>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
export default Dashboard
