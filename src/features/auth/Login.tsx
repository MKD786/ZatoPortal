"use client"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Card, Alert, Typography } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { login, clearError } from "./auth.slice"
import type { RootState, AppDispatch } from "../../store"
import ZatoLogoDark from "../../assets/Zato Logo Blue Tilt.png"
import { Footer } from "antd/es/layout/layout"

const { Title } = Typography

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  // const location = useLocation()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [form] = Form.useForm()
  // Get the page they were trying to visit
  // const from = location.state?.from?.pathname || "/dashboard"
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(login(values)).unwrap()
      // navigate(from, { replace: true })
      navigate('/otp-verification', { replace: true })
    } catch (error) {
      // Error is handled in the slice
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 zato-login-bg">
      <div className="absolute top-10 left-10 w-40">
        <img src={ZatoLogoDark} alt="Zato Logo" width="100%" height="100%" className="login-logo" />
      </div>
      <div className="flex flex-col items-center" style={{ width: "35%" }}>
        <h1 className="form-decision" >From Data to Decisions</h1>
        <p className="text-gray-900 dark:text-gray-400 mb-4">AI-Powered Compliance for Tomorrow’s Accounting</p>
        <Card className="w-full shadow-lg rounded-lg" bordered={false}>
          <div className="text-center mb-6">
            <div className="flex justify-center">
              {/* <div className="bg-teal-700 dark:bg-teal-600 p-3 rounded-lg">
              <Logo />
            </div> */}
              {/* <div className="w-40 p-3 rounded-lg">
              <img src={ZatoLogoDark} alt="Zato Logo" width="100%" height="100%" />
            </div> */}
            </div>
            {/* <Title level={3}>Welcome to Zato Accounting</Title> */}
            <Title level={5} className="text-gray-500 dark:text-gray-400" type="secondary">Sign in </Title>
          </div>

          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(clearError())}
              className="mb-4"
            />
          )}

          <Form form={form} name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
            <Form.Item
              style={{ marginBottom: "10px" }}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: "10px" }} name="password" rules={[{ required: true, message: "Please input your password!" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: "0px" }}>
              <div className="flex justify-between items-center">
                <a href="#forgot-password">Forgot password?</a>
                <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-32">
                  Sign In
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer className="fixed bottom-0 right-0 z-10 w-full text-end text-gray-500 dark:text-gray-400 p-0" style={{ padding: "0.3rem 0.5rem" }}>
        <div className="flex justify-end items-center gap-2">
          <p className="text-gray-500 dark:text-gray-400 text-xs"  style={{ color:"#c6cbd5"}}>Powered by</p>
          <div className="w-10">
            <img src={ZatoLogoDark} alt="Zato Logo" width="100%" height="100%" />
          </div>
        </div>
      </Footer>
    </div>
  )
}

export default Login
