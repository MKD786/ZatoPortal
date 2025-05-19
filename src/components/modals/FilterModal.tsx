"use client"

import { Modal, Form, Select, DatePicker, Checkbox, Button, Divider } from "antd"
import { FilterOutlined } from "@ant-design/icons"

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

const { Option } = Select
const { RangePicker } = DatePicker

const FilterModal = ({ visible, onClose, onApply }: FilterModalProps) => {
  const [form] = Form.useForm()

  const handleApply = () => {
    form.validateFields().then((values) => {
      onApply(values)
      onClose()
    })
  }

  const handleReset = () => {
    form.resetFields()
  }

  

  return (
    <Modal
      title={
        <div className="flex items-center">
          <FilterOutlined className="mr-2" />
          <span>Filter Queries</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Reset
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply Filters
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status" allowClear>
              <Option value="responded">Responded</Option>
              <Option value="yetToRespond">Yet to respond</Option>
              <Option value="overdue">Overdue</Option>
            </Select>
          </Form.Item>

          <Form.Item name="urgency" label="Urgency">
            <Select placeholder="Select urgency" allowClear>
              <Option value="completed">Completed</Option>
              <Option value="dueToday">Due today</Option>
              <Option value="dueTomorrow">Due tomorrow</Option>
              <Option value="dueThisWeek">Due this week</Option>
              <Option value="late">Late</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="manager" label="Manager">
            <Select placeholder="Select manager" allowClear>
              <Option value="sj">Sarah Johnson</Option>
              <Option value="mc">Michael Chen</Option>
              <Option value="jl">Jennifer Lee</Option>
            </Select>
          </Form.Item>

          <Form.Item name="workpaper" label="Workpaper Type">
            <Select placeholder="Select workpaper type" allowClear>
              <Option value="BRC">Bank Reconciliation (BRC)</Option>
              <Option value="ACP">Accounts Payable (ACP)</Option>
              <Option value="ACR">Accounts Receivable (ACR)</Option>
              <Option value="GRC">GST Reconciliation (GRC)</Option>
              <Option value="WRC">Wages Reconciliation (WRC)</Option>
              <Option value="GPV">GST Period Variance (GPV)</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="dateRange" label="Date Range">
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Divider />

        <Form.Item name="hasAttachments" valuePropName="checked">
          <Checkbox>Has attachments</Checkbox>
        </Form.Item>

        <Form.Item name="showOnlyMyQueries" valuePropName="checked">
          <Checkbox>Show only my queries</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FilterModal
