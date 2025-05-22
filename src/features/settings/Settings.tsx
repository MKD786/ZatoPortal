import type React from "react"
 
import { useState } from "react"
import { Select, Button, Modal } from "antd"
import { SaveOutlined } from "@ant-design/icons"
import "./settings.scss"
 
const { Option } = Select
// const reminderTabs = [
//   {
//     key: "login",
//     title: "Login Reminder",
//     subject: "Reminder: Please Log In to Your Client Portal",
//     body: `Dear {{client_name}},\n\nWe noticed that you haven't logged into your client portal recently. To ensure we can process your information efficiently, please log in and complete any pending tasks.\n\nYour CA Firm Team`,
//   },
//   {
//     key: "missing",
//     title: "Missing Files",
//     subject: "Reminder: Submit Missing Files",
//     body: `Dear {{client_name}},\n\nIt seems some required files are missing from your account. Please upload them at your earliest convenience.\n\nYour CA Firm Team`,
//   },
//   {
//     key: "questionnaire",
//     title: "Questionnaire",
//     body: `Dear {{client_name}},\n\nYou have a pending questionnaire in your client portal. Please complete it to avoid delays.\n\nYour CA Firm Team`,
//     subject: "Reminder: Complete Your Questionnaire",
//   },
//   {
//     key: "inactive",
//     title: "Inactive Users",
//     subject: "We Miss You on the Portal!",
//     body: `Dear {{client_name}},\n\nWe haven't seen you on our portal in a while. Log in to check updates or complete pending items.\n\nYour CA Firm Team`,
//   },
// ]
 
// const availableVars = ["{{client_name}}", "{{company_name}}", "{{login_link}}", "{{days_inactive}}"]
 
interface SettingsProps {
  visible: boolean
  onCancel: () => void
  defaultCompany?: string
  onSave: (selectedCompany: string) => void
 
}
 
const Settings: React.FC<SettingsProps> = ({ visible, onCancel , onSave, defaultCompany }) => {
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>(defaultCompany || "")
 
 
  const handleSave = async () => {
    try {
      setLoading(true)
     // Show success message
      onSave(selectedCompany)
      onCancel()
    } catch (error) {
      console.error("Validation failed:", error)
    } finally {
      setLoading(false)
    }
  }
 
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value)
    console.log("Selected company:", value)
  }
 
  return (
    <Modal
      title="Select Your Entity"
      open={visible}
      onCancel={onCancel}
      width={400}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
          disabled={!selectedCompany}
        >
          Proceed
        </Button>,
      ]}
    >
        <div className="mt-2 w-full">
       <h6 className="mb-1" style={{fontSize:"12px"}}>Entity</h6>
        <Select
          placeholder="Select from your linked companies"
          allowClear
          style={{ width: "100%" }}
          value={selectedCompany}
          onChange={handleCompanyChange}
        >
          <Option value="Smith & Sons Holdings Ltd">Smith & Sons Holdings Ltd</Option>
          <Option value="Kiwi Ventures Trust">Kiwi Ventures Trust</Option>
          <Option value="North Shore Advisors Ltd">North Shore Advisors Ltd</Option>
        </Select>
        <p className="mt-2" style={{fontSize:"11px"}}>Note : You can only proceed after selecting a entity</p>
      </div>
       
    </Modal>
  )
}
 
export default Settings
 
 