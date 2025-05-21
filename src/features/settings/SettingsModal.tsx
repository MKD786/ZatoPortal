"use client"


import { useState } from "react"
import { Card, Typography, Tabs, Form, Switch, Select, Button, Divider, Row, Col, message, Input, Upload, Space, Tag ,Modal, } from "antd"
import { BellOutlined, InfoCircleOutlined, LockOutlined, NotificationOutlined } from "@ant-design/icons"
import { MailOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';
import './settings.scss'
import { KeyRoundIcon, LucideAlarmCheck, LucideAlarmPlus } from "lucide-react";

const { TextArea } = Input;
const { Title } = Typography
const { TabPane } = Tabs
const reminderTabs = [
  {
    key: 'login',
    title: 'Login Reminder',
    subject: 'Reminder: Please Log In to Your Client Portal',
    body: `Dear {{client_name}},\n\nWe noticed that you haven't logged into your client portal recently. To ensure we can process your information efficiently, please log in and complete any pending tasks.\n\nYour CA Firm Team`,
  },
  {
    key: 'missing',
    title: 'Missing Files',
    subject: 'Reminder: Submit Missing Files',
    body: `Dear {{client_name}},\n\nIt seems some required files are missing from your account. Please upload them at your earliest convenience.\n\nYour CA Firm Team`,
  },
  {
    key: 'questionnaire',
    title: 'Questionnaire',
    body: `Dear {{client_name}},\n\nYou have a pending questionnaire in your client portal. Please complete it to avoid delays.\n\nYour CA Firm Team`,
    subject: 'Reminder: Complete Your Questionnaire',
  },
  {
    key: 'inactive',
    title: 'Inactive Users',
    subject: 'We Miss You on the Portal!',
    body: `Dear {{client_name}},\n\nWe haven't seen you on our portal in a while. Log in to check updates or complete pending items.\n\nYour CA Firm Team`,
  },
];

const availableVars = [
  '{{client_name}}',
  '{{company_name}}',
  '{{login_link}}',
  '{{days_inactive}}',
];

interface SettingsModalProps {
  visible: boolean
  onCancel: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onCancel }) => {
  // const [activeTab, setActiveTab] = useState("profile")
  // const [profileForm] = Form.useForm()
  // const [securityForm] = Form.useForm()
  // const [notificationsForm] = Form.useForm()
  // const [preferencesForm] = Form.useForm()
  const [showEmailInput, setShowEmailInput] = useState(false);
  const handleGeneralSubmit = (values: any) => {
    setTimeout(() => {
      console.log("Updated general settings:", values)
      message.success("General settings updated successfully")
    }, 1000)
  }







  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")




  
  // const handleSave = async () => {
  //   try {

  //     // Determine which form to validate based on active tab
  //     let formValues
  //     switch (activeTab) {
  //       case "profile":
  //         formValues = await profileForm.validateFields()
  //         break
  //       case "security":
  //         formValues = await securityForm.validateFields()
  //         break
  //       case "notifications":
  //         formValues = await notificationsForm.validateFields()
  //         break
  //       case "preferences":
  //         formValues = await preferencesForm.validateFields()
  //         break
  //       default:
  //         break
  //     }

  //     // Here you would typically save the form data to your backend
  //     console.log("Saving settings:", formValues)

  //     // Show success message
  //     message.success("Settings saved successfully")
  //   } catch (error) {
  //     console.error("Validation failed:", error)
  //   } 
  // }



  
  return (
    <Modal title="Settings" open={visible} onCancel={onCancel} footer={null}
      // width={700}
      // footer={[
      //   <Button key="cancel" onClick={onCancel}>
      //     Cancel
      //   </Button>,
      //   <Button key="save" type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>
      //     Save Changes
      //   </Button>,
      // ]}
      className="settings-modal"
    >
     <Card bordered={false} className="rounded-xl shadow-sm">
               <Tabs defaultActiveKey="general">
     
                 {user_control?.role === "client" ? (
                   <>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><NotificationOutlined /></span> App Notifications</span>} key="notifications">
                       <div style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: 16 }}>
                         <Form
                           layout="vertical"
                           onFinish={handleGeneralSubmit}
                           initialValues={{
                             emailNotifications: true,
                             appNotifications: true,
                             queryNotifications: true,
                             questionnaireNotifications: true,
                             documentNotifications: true,
                             email: "user@example.com",
                             digestFrequency: "daily",
                           }}
                         >
                           <Typography.Title level={4} >App Notifications</Typography.Title>
                           {/* Notification Preferences */}
                           <Divider style={{ padding: '0.3rem 0', margin: '0' }} />
                           <div className="align-center gap-2">
                             <div className="w-[100%] h-[100%] pr-2">
                               <Typography.Title level={5} style={{ fontSize: '1rem', fontWeight: '500' }}>Notification Preferences</Typography.Title>
                               <div className="flex justify-between items-center mb-2">
                                 {/* Left: Label and description */}
                                 <div>
                                   <div className="text-sm " style={{ fontSize: '0.8rem', fontWeight: '500' }}>Email Notifications</div>
                                   <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Receive notifications via email</div>
                                 </div>
     
                                 {/* Middle: Input - only show when switch is active */}
                                 {showEmailInput && (
                                   <div style={{ width: '40%', display: 'flex', justifyContent: 'start' }}>
                                     <Form.Item name="emailInput" noStyle>
                                       <Input placeholder="Add additional email ids if required" />
                                     </Form.Item>
                                   </div>
                                 )}
     
                                 {/* Right: Switch */}
                                 <Form.Item name="emailNotifications" valuePropName="checked" noStyle>
                                   <Switch
                                     onChange={(checked) => {
                                       setShowEmailInput(checked); // Toggle input visibility
                                     }}
                                   />
                                 </Form.Item>
                               </div>
                               <div className="flex justify-between items-center mb-4">
                                 <div>
                                   <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>App Notifications</div>
                                   <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Receive notifications in the app</div>
                                 </div>
                                 <Form.Item name="appNotifications" valuePropName="checked" noStyle>
                                   <Switch />
                                 </Form.Item>
                               </div>
                             </div>
                             {/* <div className="w-[50%] h-[100%] pl-2">
                               <Typography.Title level={5} style={{ fontSize: '1rem', fontWeight: '500' }}>Notification Types</Typography.Title>
                               <div className="flex justify-between items-center mb-2">
                                 <div>
                                   <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Query Notifications</div>
                                   <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Notifications about new and updated queries</div>
                                 </div>
                                 <Form.Item name="queryNotifications" valuePropName="checked" noStyle>
                                   <Switch />
                                 </Form.Item>
                               </div>
                               <div className="flex justify-between items-center mb-2">
                                 <div>
                                   <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Questionnaire Notifications</div>
                                   <div className="text-gray-500 text-sm w-80" style={{ fontSize: '0.8rem' }}>Notifications about questionnaire submissions  and updates</div>
                                 </div>
                                 <Form.Item name="questionnaireNotifications" valuePropName="checked" noStyle>
                                   <Switch />
                                 </Form.Item>
                               </div>
     
                               <div className="flex justify-between items-center mb-4">
                             <div>
                               <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Document Notifications</div>
                               <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Notifications about document uploads and updates</div>
                             </div>
                             <Form.Item name="documentNotifications" valuePropName="checked" noStyle>
                               <Switch />
                             </Form.Item>
                           </div>
                             </div> */}
                           </div>
     
                           {/* Email Settings */}
                           {/* <Divider style={{ margin: '15px' }} /> */}
                           {/* <Typography.Title level={5}>Email Settings</Typography.Title>
      
                       <Form.Item label="Email Address" name="email">
                         <Input />
                       </Form.Item>
      
                       <Form.Item label="Digest Frequency" name="digestFrequency">
                         <Select>
                           <Select.Option value="daily">Daily Digest</Select.Option>
                           <Select.Option value="weekly">Weekly Digest</Select.Option>
                           <Select.Option value="monthly">Monthly Digest</Select.Option>
                         </Select>
                       </Form.Item> */}
                           {/* <div style={{ display: 'flex', justifyContent: 'end' }}>
                             <Form.Item>
                               <Button type="primary" htmlType="submit">
                                 Save Settings
                               </Button>
                             </Form.Item>
                           </div> */}
                         </Form>
                       </div>
                     </TabPane>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><LockOutlined /></span>Change Password</span>} key="default">
                       <div className="classname-general" >
                         <Form layout="vertical" className="flex flex-col sm:w-xl md:w-2/3 lg:w-80">
                           <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: "Please enter your current password" }]}>
                             <Input.Password prefix={<LockOutlined />} />
                           </Form.Item>
     
                           <Form.Item name="newPassword" label="New Password" rules={[
                             { required: true, message: "Please enter your new password" },
                             { min: 8, message: "Password must be at least 8 characters" },
                           ]}>
                             <Input.Password prefix={<LockOutlined />} />
                           </Form.Item>
     
                           <Form.Item name="confirmPassword" label="Confirm New Password" dependencies={["newPassword"]} rules={[
                             { required: true, message: "Please confirm your new password" },
                             ({ getFieldValue }) => ({
                               validator(_, value) {
                                 if (!value || getFieldValue("newPassword") === value) {
                                   return Promise.resolve()
                                 }
                                 return Promise.reject(new Error("The two passwords do not match"))
                               },
                             }),
                           ]}><Input.Password prefix={<LockOutlined />} /></Form.Item>
                           {/* <Form.Item><Button type="primary" htmlType="submit" loading={loading}>Update Password</Button></Form.Item> */}
                         </Form>
                       </div>
                     </TabPane>
                     {/* <TabPane tab={<span className="flex items-center"><span className="pr-2"><KeyRoundIcon size={14} /></span> Credentials</span>} key="credentials">
                       <Form style={{ width: "60%", margin: "0 auto" }}>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-1 border px-1 py-1 rounded-[0.4rem]">
                           <div className="flex items-center"><img src="https://taxmates.co.nz/wp-content/uploads/2024/03/logo-1.png" className="w-6" alt="" /><p className="ml-2 text-[0.7rem] font-semibold">IRD</p></div>
                           <div className="w-50 flex justify-end"><Button type="primary" className="">Connect</Button></div>
                         </div>
                       </Form>
                     </TabPane> */}
                   </>
                 ) : (
                   <>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><InfoCircleOutlined /></span>General</span>} key="general">
                       <div className="classname-general general-tab-form" >
                         <Form layout="vertical" className="classname-general_form" >
                           <div className="max-w-xl">
                             <Form.Item
                               // label="Company Name"
                               label="Business Name"
                               name="companyName"
                               rules={[{ required: true, message: 'Please enter company name' }]}
                             >
                               <Input
                                 size="large"
                                 placeholder="Enter your company name"
                                 prefix={<EditOutlined />}
                               />
                             </Form.Item>
     
                             <Form.Item label="Your Company's Logo" name="logo">
                               <Upload.Dragger
                                 name="file"
                                 beforeUpload={() => false}
                                 multiple={false}
                                 showUploadList={true}
                                 accept=".png,.jpg,.jpeg"
                               >
                                 <p className="ant-upload-drag-icon">
                                   <InboxOutlined />
                                 </p>
                                 <p className="ant-upload-text">Click or drag and drop your company's logo.</p>
                                 <p className="ant-upload-hint  text-gray-500" style={{ fontSize: 'small' }}>
                                   PNG, JPG supported.
                                 </p>
                               </Upload.Dragger>
                             </Form.Item>
                             <Form.Item label="Title" name="title">
                               <Input size="large" prefix={<EditOutlined />} name="title" placeholder="Enter title" />
                             </Form.Item>
     
                             <Form.Item className="text-sm" label="Tag Line" name="tagLine" >
                               <Input size="large" prefix={<EditOutlined />} name="tag line" placeholder="Enter tag line" />
                             </Form.Item>
     
                             <Form.Item
                               label="Change Password"
                               name="password"
                               rules={[{ required: true, message: 'Please enter new password' }]}
                             >
                               <Input.Password
                                 size="large"
                                 placeholder="Enter new password"
                                 prefix={<LockOutlined />}
                               />
                             </Form.Item>
     
                             <Form.Item
                               label="Notification Email"
                               name="notificationEmail"
                               rules={[
                                 { required: true, message: 'Please enter email' },
                                 { type: 'email', message: 'Enter a valid email' },
                               ]}
                             >
                               <Input
                                 size="large"
                                 placeholder="you@example.com"
                                 prefix={<MailOutlined />}
                               />
                             </Form.Item>
     
                             <div className="flex justify-end mt-6 bottom-0 right-3 w-full bg-white z-50"><Button type="primary" htmlType="submit"> Save Changes </Button></div>
                           </div>
                         </Form>
                       </div>
                     </TabPane>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><BellOutlined /></span> App Notifications</span>} key="notifications">
                       <div style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: 16 }}>
                         <Form
                           layout="vertical"
                           onFinish={handleGeneralSubmit}
                           initialValues={{
                             emailNotifications: true,
                             appNotifications: true,
                             queryNotifications: true,
                             questionnaireNotifications: true,
                             documentNotifications: true,
                             email: "user@example.com",
                             digestFrequency: "daily",
                           }}
                         >
                           <Typography.Title level={4} className="mb-1">App Notifications</Typography.Title>
     
     
                           {/* Notification Preferences */}
                           <Divider style={{ padding: '0.3rem 0', margin: '0' }} />
                           <div className="flex justify-between align-center gap-2">
                             <div className="w-[100%] h-[100%] pr-2">
                               <Typography.Title level={5} style={{ fontSize: '1rem', fontWeight: '500' }}>Notification Preferences</Typography.Title>
                               <div className="flex justify-between items-center mb-2">
                                 {/* Left: Label and description */}
                                 <div>
                                   <div className="text-sm " style={{ fontSize: '0.8rem', fontWeight: '500' }}>Email Notifications</div>
                                   <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Receive notifications via email</div>
                                 </div>
     
                                 {/* Middle: Input - only show when switch is active */}
                                 {showEmailInput && (
                                   <div style={{ width: '40%', display: 'flex', justifyContent: 'start' }}>
                                     <Form.Item name="emailInput" noStyle>
                                       <Input placeholder="Add additional email ids if required" />
                                     </Form.Item>
                                   </div>
                                 )}
     
                                 {/* Right: Switch */}
                                 <Form.Item name="emailNotifications" valuePropName="checked" noStyle>
                                   <Switch
                                     onChange={(checked) => {
                                       setShowEmailInput(checked); // Toggle input visibility
                                     }}
                                   />
                                 </Form.Item>
                               </div>
                               <div className="flex justify-between items-center mb-4">
                                 <div>
                                   <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>App Notifications</div>
                                   <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Receive notifications in the app</div>
                                 </div>
                                 <Form.Item name="appNotifications" valuePropName="checked" noStyle>
                                   <Switch />
                                 </Form.Item>
                               </div>
                             </div>
                             {/* <div className="w-[50%] h-[100%] pl-2">
                               <Typography.Title level={5} style={{ fontSize: '1rem', fontWeight: '500' }}>Notification Types</Typography.Title>
                               <div className="flex justify-between items-center mb-2">
                                 <div>
                                   <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Query Notifications</div>
                                   <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Notifications about new and updated queries</div>
                                 </div>
                                 <Form.Item name="queryNotifications" valuePropName="checked" noStyle>
                                   <Switch />
                                 </Form.Item>
                               </div>
                               <div className="flex justify-between items-center mb-2">
                                 <div>
                                   <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Questionnaire Notifications</div>
                                   <div className="text-gray-500 text-sm w-80" style={{ fontSize: '0.8rem' }}>Notifications about questionnaire submissions  and updates</div>
                                 </div>
                                 <Form.Item name="questionnaireNotifications" valuePropName="checked" noStyle>
                                   <Switch />
                                 </Form.Item>
                               </div>
     
                               <div className="flex justify-between items-center mb-4">
                             <div>
                               <div className="font-semibold" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Document Notifications</div>
                               <div className="text-gray-500 text-sm" style={{ fontSize: '0.8rem' }}>Notifications about document uploads and updates</div>
                             </div>
                             <Form.Item name="documentNotifications" valuePropName="checked" noStyle>
                               <Switch />
                             </Form.Item>
                           </div>
                             </div> */}
                           </div>
                           {/* Email Settings */}
                           <Divider style={{ margin: '15px' }} />
                           {/* <Typography.Title level={5}>Email Settings</Typography.Title>
      
                       <Form.Item label="Email Address" name="email">
                         <Input />
                       </Form.Item>
      
                       <Form.Item label="Digest Frequency" name="digestFrequency">
                         <Select>
                           <Select.Option value="daily">Daily Digest</Select.Option>
                           <Select.Option value="weekly">Weekly Digest</Select.Option>
                           <Select.Option value="monthly">Monthly Digest</Select.Option>
                         </Select>
                       </Form.Item> */}
                           <div style={{ display: 'flex', justifyContent: 'end' }}>
                             <Form.Item>
                               <Button type="primary" htmlType="submit">
                                 Save Settings
                               </Button>
                             </Form.Item>
                           </div>
                         </Form>
                       </div>
                     </TabPane>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><LucideAlarmPlus size={14} /></span> Reminder Settings</span>} key="reminder-settings">
                       <Form
                         // form={reminderForm}
                         layout="vertical"
                         initialValues={{
                           notLoggedInReminder: true,
                           notLoggedInAfter: '48h',
                           inactiveReminder: true,
                           inactiveAfter: '1 week',
                           missingFilesReminder: true,
                           missingFilesAfter: '72h',
                           questionnaireReminder: true,
                           questionnaireAfter: '96h',
                         }}
                       // onFinish={handleReminderSubmit}
                       >
                         <Title level={5}>Reminder Settings</Title>
     
                         <Row gutter={[16, 16]}>
                           {/* Not Logged In */}
                           <Col xs={24} md={12}>
                             <div className="border p-4 rounded-md shadow-sm">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="font-medium">Not Logged In Reminder</span>
                                 <Form.Item name="notLoggedInReminder" valuePropName="checked" noStyle>
                                   <Switch size="small" />
                                 </Form.Item>
                               </div>
                               <Form.Item name="notLoggedInAfter" label="Send reminder after">
                                 <Select style={{ width: '25%' }}>
                                   <Select.Option value="24h">24h</Select.Option>
                                   <Select.Option value="48h">48h</Select.Option>
                                   <Select.Option value="72h">72h</Select.Option>
                                 </Select>
                               </Form.Item>
                             </div>
                           </Col>
     
                           {/* Inactive Users */}
                           <Col xs={24} md={12}>
                             <div className="border p-4 rounded-md shadow-sm">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="font-medium">Inactive Users Reminder</span>
                                 <Form.Item name="inactiveReminder" valuePropName="checked" noStyle>
                                   <Switch size="small" />
                                 </Form.Item>
                               </div>
                               <Form.Item name="inactiveAfter" label="Send reminder after">
                                 <Select style={{ width: '25%' }}>
                                   <Select.Option value="3 days">3 days</Select.Option>
                                   <Select.Option value="1 week">1 week</Select.Option>
                                   <Select.Option value="2 weeks">2 weeks</Select.Option>
                                 </Select>
                               </Form.Item>
                             </div>
                           </Col>
     
                           {/* Missing Files */}
                           <Col xs={24} md={12}>
                             <div className="border p-4 rounded-md shadow-sm">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="font-medium">Missing Files Reminder</span>
                                 <Form.Item name="missingFilesReminder" valuePropName="checked" noStyle>
                                   <Switch size="small" />
                                 </Form.Item>
                               </div>
                               <Form.Item name="missingFilesAfter" label="Send reminder after">
                                 <Select style={{ width: '25%' }}>
                                   <Select.Option value="48h">48h</Select.Option>
                                   <Select.Option value="72h">72h</Select.Option>
                                   <Select.Option value="96h">96h</Select.Option>
                                 </Select>
                               </Form.Item>
                             </div>
                           </Col>
     
                           {/* Questionnaire */}
                           <Col xs={24} md={12}>
                             <div className="border p-4 rounded-md shadow-sm">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="font-medium">Questionnaire Reminder</span>
                                 <Form.Item name="questionnaireReminder" valuePropName="checked" noStyle>
                                   <Switch size="small" />
                                 </Form.Item>
                               </div>
                               <Form.Item name="questionnaireAfter" label="Send reminder after">
                                 <Select style={{ width: '25%' }}>
                                   <Select.Option value="48h">48h</Select.Option>
                                   <Select.Option value="72h">72h</Select.Option>
                                   <Select.Option value="96h">96h</Select.Option>
                                 </Select>
                               </Form.Item>
                             </div>
                           </Col>
                         </Row>
                         <div className="w-full flex justify-end items-center mt-4">
                           <Form.Item>
                             <Button type="default" >
                               Reset to Defaults
                             </Button>
                             <Button type="primary" htmlType="submit" className="ml-2">
                               Save Settings
                             </Button>
                           </Form.Item>
                         </div>
                       </Form>
                     </TabPane>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><LucideAlarmCheck size={14} /></span>Reminder Templates</span>} key="privacy">
                       <Form layout="vertical">
                         <Title level={4}>Reminder Templates</Title>
                         <Tabs defaultActiveKey="login">
                           {reminderTabs.map((tab) => (
                             <TabPane tab={tab.title} key={tab.key}>
                               <Form.Item
                                 label="Email Subject"
                                 name={`subject_${tab.key}`}
                                 initialValue={tab.subject}
                               >
                                 <Input placeholder={tab.subject} />
                               </Form.Item>
     
                               <Form.Item
                                 label="Email Body"
                                 name={`body_${tab.key}`}
                                 initialValue={tab.body}
                               >
                                 <TextArea rows={6} placeholder={tab.body} />
                               </Form.Item>
     
                               <div className="mb-4">
                                 <div className="font-medium mb-1">Available variables:</div>
                                 <Space wrap>
                                   {availableVars.map((v) => (
                                     <Tag key={v} bordered={false} color="blue">
                                       {v}
                                     </Tag>
                                   ))}
                                 </Space>
                               </div>
                             </TabPane>
                           ))}
                         </Tabs>
     
                         <div className="flex justify-end gap-2 mt-4">
                           <Button htmlType="reset">Reset to Defaults</Button>
                           <Button type="primary" htmlType="submit">
                             Save Template
                           </Button>
                         </div>
                       </Form>
                     </TabPane>
                     <TabPane tab={<span className="flex items-center"><span className="pr-2"><KeyRoundIcon size={14} /></span> Credentials</span>} key="credentials">
                       <Form style={{ width: "60%", margin: "0 auto" }}>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-1 border px-1 py-1 rounded-[0.4rem]">
                           <div className="flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Xero-logo-hires-RGB.png" className="w-6 " alt="" /><p className="ml-2 text-[0.7rem] font-semibold">XERO</p></div>
                           <div className="w-50 flex justify-end"><Button type="primary" className="">Connect</Button></div>
                         </div>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-1 border px-1 py-1 rounded-[0.4rem]">
                           <div className="flex items-center"><img src="https://fyi.app/wp-content/uploads/2022/04/fyi-logo.png" className="w-6" alt="" /><p className="ml-2 text-[0.7rem] font-semibold">Fyi Docs</p></div>
                           <div className="w-50 flex justify-end"><Button type="primary" className="">Connect</Button></div>
                         </div>
                       </Form>
                     </TabPane>
                     {/* <TabPane tab={<span className="flex items-center"><span className="pr-2"><SettingOutlined /></span>Pre Setup</span>} key="preSetup">
                         <Table 
                         style={{position: "relative", overflow: "auto"}}
                         columns={accountCodeColumn} 
                         dataSource={accountCodeData} 
                         pagination={{
                           pageSize: 5,
                           // showSizeChanger: true,
                           // showQuickJumper: true,
                           // showTotal: (total) => `Total ${total} items`,
                         }}
                         />
                         <div style={{position: "absolute", bottom: "1rem", left: "1rem"}}><Button type="primary" className="mt-2">Add Alias</Button></div>
                     </TabPane> */}
                   </>
                 )}
               </Tabs>
             </Card>
    </Modal>
  )
}

export default SettingsModal
