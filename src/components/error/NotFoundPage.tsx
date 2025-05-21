"use client"

import { Button, Typography, Space } from "antd"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import type { RootState } from "../../store"
import darkSvg from "../../assets/404-dark.svg"
import lightSvg from "../../assets/404-light.svg"

const { Title, Paragraph } = Typography

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { theme } = useSelector((state: RootState) => state.theme)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const handleGoHome = () => {
    navigate(isAuthenticated ? "/client-activities" : "/login")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 transition-all duration-500 hover:transform hover:scale-105">
          <img
            src={theme === "dark" ? darkSvg : lightSvg}
            alt="404 Not Found Illustration"
            className="mx-auto w-full max-w-xl h-auto"
          />
        </div>

        <Title level={2} className="font-bold mb-2 transition-colors duration-300">
          Oops! Page Not Found
        </Title>

        <Paragraph className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg mx-auto transition-colors duration-300">
          We can't seem to find the page you're looking for. It might have been moved, deleted, or never existed.
        </Paragraph>

        <Space size="middle" className="flex flex-col sm:flex-row justify-center">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            className="rounded-lg px-8 h-12 text-base min-w-[200px]"
          >
            {isAuthenticated ? "Back to Clients" : "Go to Login"}
          </Button>

          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="rounded-lg px-8 h-12 text-base min-w-[200px]"
          >
            Go Back
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default NotFoundPage
