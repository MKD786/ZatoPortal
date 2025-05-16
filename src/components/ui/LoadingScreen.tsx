import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} tip="Loading..." />
    </div>
  )
}

export default LoadingScreen
