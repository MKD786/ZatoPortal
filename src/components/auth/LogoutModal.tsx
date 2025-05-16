import { Modal, Typography } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import { logout } from "../../features/auth/auth.slice"
import type { AppDispatch } from "../../store"

const { Text } = Typography

interface LogoutModalProps {
  visible: boolean
  onCancel: () => void
}

const LogoutModal = ({ visible, onCancel }: LogoutModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const handleLogout = () => {
    dispatch(logout())
    onCancel()
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <LogoutOutlined className="mr-2 text-red-500" />
          <span>Logout Confirmation</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleLogout}
      okText="Logout"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      centered
    >
      <div className="py-4">
        <Text>Are you sure you want to logout from your account?</Text>
        <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
          You will need to login again to access your account.
        </div>
      </div>
    </Modal>
  )
}

export default LogoutModal
