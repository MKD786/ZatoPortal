import React, { useState, useRef, useEffect } from "react"
import { Table, Button, Input, Badge, Switch, Select, Divider, Modal, Alert, Progress, Tooltip, Dropdown, Space, Typography, Form, Card, Row, Col, Upload, message,} from "antd"
import type { UploadProps } from "antd"
import { EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined, ExclamationCircleOutlined, BankOutlined, HomeOutlined, TeamOutlined, UserOutlined, HeartOutlined, ArrowRightOutlined, CalculatorOutlined, SaveOutlined,} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { MenuProps } from "antd"
import TextArea from "antd/es/input/TextArea";
import './AddRule.scss';
import { Building2, HeartHandshake, Landmark, User, Users } from "lucide-react"

const entityTypeIcons = [
    {
        key: "company",
        tooltip: "Company",
        icon: <Building2 />,
        selectedBg: "#DBEAFE", // blue-100
        selectedColor: "#2563EB", // blue-600
    },
    {
        key: "trust",
        tooltip: "Trust",
        icon: <Landmark />,
        selectedBg: "#EDE9FE", // purple-100
        selectedColor: "#7C3AED", // purple-600
    },
    {
        key: "partnership",
        tooltip: "Partnership",
        icon: <Users />,
        selectedBg: "#DCFCE7", // green-100
        selectedColor: "#16A34A", // green-600
    },
    {
        key: "sole_traders",
        tooltip: "Sole Trader",
        icon: <User />,
        selectedBg: "#FEF3C7", // amber-100
        selectedColor: "#D97706", // amber-600
    },
    {
        key: "non_profit",
        tooltip: "Non Profit",
        icon: <HeartHandshake />,
        selectedBg: "#FEE2E2", // red-100
        selectedColor: "#DC2626", // red-600
    },
];

const { Title, Text, Paragraph } = Typography
const { Option } = Select

// NZ Chart of Accounts with descriptions for GL Scrutiny
const accountCodes = [
    { code: "2340", description: "Accident Compensation Levy" },
    { code: "6610", description: "Accountancy Fee" },
    { code: "2000", description: "Accounts Payable" },
    { code: "1100", description: "Accounts Receivable" },
    { code: "6000", description: "Advertising" },
    { code: "1000", description: "Bank" },
    { code: "6100", description: "Bank Charges" },
    { code: "1010", description: "Cash on hand" },
    { code: "6310", description: "Cleaning" },
    { code: "6320", description: "Client Gifts" },
    { code: "4200", description: "Commission" },
    { code: "6330", description: "Computer Expenses" },
    { code: "6950", description: "Contractors (GST)" },
    { code: "6955", description: "Contractors (no GST)" },
    { code: "2400", description: "Current Portion of Term Loan" },
    { code: "5200", description: "Customs related expenses" },
    { code: "9000", description: "Default instruction" },
    { code: "6960", description: "Director Fee" },
    { code: "4400", description: "Dividend Income" },
    { code: "4410", description: "Dividend Income - Overseas" },
    { code: "7500", description: "Donations" },
    { code: "7400", description: "Entertainment Expense" },
    { code: "6970", description: "FBT" },
    { code: "7910", description: "Fine" },
    { code: "1400", description: "Fixed Assets" },
    { code: "7800", description: "Foreign Exchange Gain/(Losses)" },
    { code: "5210", description: "Freight" },
    { code: "6340", description: "Home Office Expense" },
    { code: "4120", description: "Income - Overseas" },
    { code: "6300", description: "Insurance" },
    { code: "1700", description: "Intangible Assets" },
    { code: "6400", description: "Interest Expense" },
    { code: "6410", description: "Interest - Overseas" },
    { code: "4300", description: "Interest Received" },
    { code: "6910", description: "KiwiSaver Employer Contributions" },
    { code: "6620", description: "Legal Fee" },
    { code: "6350", description: "Licence" },
    { code: "6110", description: "Merchant Services" },
    { code: "6360", description: "Minor Assets" },
    { code: "1420", description: "Motor Vehicle" },
    { code: "7310", description: "Motor Vehicle Expenses Reimbursement" },
    { code: "4500", description: "Other Income" },
    { code: "6370", description: "Plant Hire" },
    { code: "6380", description: "Postage, Printing & Stationery" },
    { code: "7000", description: "Power" },
    { code: "6600", description: "Professional & Consultancy" },
    { code: "5100", description: "Purchase" },
    { code: "5110", description: "Purchase Overseas" },
    { code: "6810", description: "Rates" },
    { code: "4510", description: "Realised Currency Gains" },
    { code: "4520", description: "Rebate Income" },
    { code: "6980", description: "Recruitment Costs" },
    { code: "2800", description: "Related Party" },
    { code: "6700", description: "Rent Expense Commercial" },
    { code: "4530", description: "Rent Received - Commercial" },
    { code: "4540", description: "Rent Received - Residential" },
    { code: "6800", description: "Repair & Maintenance" },
    { code: "6820", description: "Residential Rates" },
    { code: "6390", description: "Safety & Protective Clothing" },
    { code: "4000", description: "Sales" },
    { code: "4100", description: "Sales Overseas" },
    { code: "6395", description: "Security" },
    { code: "3400", description: "Share Capital" },
    { code: "6990", description: "Shareholder Salaries" },
    { code: "6010", description: "Sponsorship" },
    { code: "6940", description: "Staff Related Costs" },
    { code: "1200", description: "Stock on Hand" },
    { code: "5300", description: "Subcontractors (GST)" },
    { code: "5310", description: "Subcontractors (no GST)" },
    { code: "7600", description: "Subscriptions" },
    { code: "7100", description: "Telephone" },
    { code: "6930", description: "Training" },
    { code: "7210", description: "Travel - International" },
    { code: "7200", description: "Travel - National" },
    { code: "4550", description: "Unrealised Currency Gains" },
    { code: "2500", description: "Unsecured Loan" },
    { code: "6900", description: "Wages" },
]

// Type definitions
export type Rule = {
    id: string
    name: string
    account_code: string
    condition_id?: string
    field_column: string
    triggered_condition: string
    field_value: string
    data_type: string
    action_message: string
    applicability: string
    status: "active" | "inactive"
    gst_applicability: "with gst" | "without gst" | "both"
    entity_types: {
        company: boolean
        trust: boolean
        partnership: boolean
        sole_traders: boolean
        non_profit: boolean
    }
    year_applicability: string
    auto_apply?: boolean
    keywords?: string[]
    reclassification?: {
        from: string
        to: string
    }
    createdBy?: string
    createdAt?: string
    modifiedBy?: string
    modifiedAt?: string
}

// PageHeader Component
function PageHeader() {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <CalculatorOutlined style={{ fontSize: 20, color: "#10b981" }} /> &nbsp;
                <Title level={3} style={{ margin: 0 }}>
                    Rules Builder for GL Scrutiny
                </Title>
            </div>
            <Paragraph type="secondary">Define and manage classification rules for General Ledger transactions</Paragraph>
            <Divider />
        </div>
    )
}

// RuleModal Component
interface RuleModalProps {
    isOpen: boolean
    onClose: () => void
    initialRule: Rule | null
    onRuleAdded: (rule: Rule) => void
}

function RuleModal({ isOpen, onClose, initialRule, onRuleAdded }: RuleModalProps) {
    const [form] = Form.useForm()
    const [entityTypesState, setEntityTypesState] = useState(form.getFieldValue("entityTypes") || {});

useEffect(() => {
    form.setFieldsValue({ entityTypes: entityTypesState });
}, [entityTypesState]);

const handleClick = (key:any) => {
    const updated = {
        ...entityTypesState,
        [key]: !entityTypesState[key],
    };
    setEntityTypesState(updated);

    console.log(`${key}: ${!entityTypesState[key]}`);
};


    // Initialize form with initial rule data when editing
    React.useEffect(() => {
        if (initialRule) {
            form.setFieldsValue({
                ruleName: initialRule.name || "",
                accountCode: initialRule.account_code || "",
                fieldColumn: initialRule.field_column || "debit",
                triggeredCondition: initialRule.triggered_condition || ">",
                fieldValue: initialRule.field_value || "",
                dataType: initialRule.data_type || "integer",
                actionMessage: initialRule.action_message || "",
                applicability: initialRule.applicability || "general",
                status: initialRule.status || "active",
                gstApplicability: initialRule.gst_applicability || "both",
                entityTypes: initialRule.entity_types || {
                    company: false,
                    trust: false,
                    partnership: false,
                    sole_traders: false,
                    non_profit: false,
                },
                yearApplicability: initialRule.year_applicability || "current year",
                autoApply: initialRule.auto_apply || false,
                keywords: initialRule.keywords || [],
                reclassFrom: initialRule.reclassification?.from || "",
                reclassTo: initialRule.reclassification?.to || "",
            })
        } else {
            // Reset form for new rule
            form.resetFields()
            form.setFieldsValue({
                fieldColumn: "debit",
                triggeredCondition: ">",
                dataType: "integer",
                applicability: "general",
                status: "active",
                gstApplicability: "both",
                entityTypes: {
                    company: false,
                    trust: false,
                    partnership: false,
                    sole_traders: false,
                    non_profit: false,
                },
                yearApplicability: "current year",
                autoApply: false,
            })
        }
    }, [initialRule, isOpen, form])

    // const handleSaveRule = () => {
    //     form.validateFields().then((values) => {
    //         const newRule: Rule = {
    //             id: initialRule?.id || `rule-${Date.now()}`,
    //             name: values.ruleName,
    //             account_code: values.accountCode,
    //             condition_id: initialRule?.condition_id || `${Date.now()}`,
    //             field_column: values.fieldColumn,
    //             triggered_condition: values.triggeredCondition,
    //             field_value: values.fieldValue,
    //             data_type: values.dataType,
    //             action_message: values.actionMessage,
    //             applicability: values.applicability,
    //             status: values.status,
    //             gst_applicability: values.gstApplicability,
    //             entity_types: values.entityTypes,
    //             year_applicability: values.yearApplicability,
    //             auto_apply: values.autoApply,
    //             keywords: values.keywords?.length > 0 ? values.keywords : undefined,
    //             reclassification:
    //                 values.reclassFrom && values.reclassTo
    //                     ? {
    //                         from: values.reclassFrom,
    //                         to: values.reclassTo,
    //                     }
    //                     : undefined,
    //             createdBy: initialRule?.createdBy || "Current User",
    //             createdAt: initialRule?.createdAt || new Date().toISOString(),
    //             modifiedBy: initialRule ? "Current User" : undefined,
    //             modifiedAt: initialRule ? new Date().toISOString() : undefined,
    //         }

    //         onRuleAdded(newRule)
    //     })
    // }

    const handleSaveRule = () => {
        form
            .validateFields()
            .then((values) => {
                // Field-wise custom validation with specific message
                if (!values.ruleName) {
                    message.error("Rule Name is required.");
                    return;
                }
                if (!values.accountCode) {
                    message.error("Account Code is required.");
                    return;
                }
                if (!values.fieldColumn) {
                    message.error("Field Column is required.");
                    return;
                }
                if (!values.triggeredCondition) {
                    message.error("Triggered Condition is required.");
                    return;
                }
                if (!values.fieldValue) {
                    message.error("Field Value is required.");
                    return;
                }
                if (!values.dataType) {
                    message.error("Data Type is required.");
                    return;
                }
    
                // If all pass
                const newRule: Rule = {
                    id: initialRule?.id || `rule-${Date.now()}`,
                    name: values.ruleName,
                    account_code: values.accountCode,
                    condition_id: initialRule?.condition_id || `${Date.now()}`,
                    field_column: values.fieldColumn,
                    triggered_condition: values.triggeredCondition,
                    field_value: values.fieldValue,
                    data_type: values.dataType,
                    action_message: values.actionMessage,
                    applicability: values.applicability,
                    status: values.status,
                    gst_applicability: values.gstApplicability,
                    entity_types: values.entityTypes,
                    year_applicability: values.yearApplicability,
                    auto_apply: values.autoApply,
                    keywords: values.keywords?.length > 0 ? values.keywords : undefined,
                    reclassification:
                        values.reclassFrom && values.reclassTo
                            ? {
                                from: values.reclassFrom,
                                to: values.reclassTo,
                            }
                            : undefined,
                    createdBy: initialRule?.createdBy || "Current User",
                    createdAt: initialRule?.createdAt || new Date().toISOString(),
                    modifiedBy: initialRule ? "Current User" : undefined,
                    modifiedAt: initialRule ? new Date().toISOString() : undefined,
                };
    
                onRuleAdded(newRule);
            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
            });
    };
    


    // Find account description by code
    // const getAccountDescription = (code: string) => {
    //     const account = accountCodes.find((acc) => acc.code === code)
    //     return account ? account.description : code
    // }

    // Data type options - preserve exact case for consistency
    const dataTypeOptions = [
        { value: "integer", label: "Integer" },
        { value: "decimal", label: "Decimal" },
        { value: "string", label: "String" },
        { value: "date", label: "Date" },
        { value: "boolean", label: "Boolean" },
    ]

    // Applicability options - preserve exact case for consistency
    const applicabilityOptions = [
        { value: "general", label: "General" },
        { value: "specific", label: "Specific" },
        { value: "custom", label: "Custom" },
    ]

    // Entity type icons with tooltips
    // const entityTypeIcons = [
    //     {
    //         key: "company",
    //         icon: <BankOutlined />,
    //         tooltip: "Company",
    //         color: "#1890ff",
    //     },
    //     {
    //         key: "trust",
    //         icon: <HomeOutlined />,
    //         tooltip: "Trust",
    //         color: "#722ed1",
    //     },
    //     {
    //         key: "partnership",
    //         icon: <TeamOutlined />,
    //         tooltip: "Partnership",
    //         color: "#52c41a",
    //     },
    //     {
    //         key: "sole_traders",
    //         icon: <UserOutlined />,
    //         tooltip: "Sole Trader",
    //         color: "#faad14",
    //     },
    //     {
    //         key: "non_profit",
    //         icon: <HeartOutlined />,
    //         tooltip: "Non Profit",
    //         color: "#f5222d",
    //     },
    // ]

    return (

        <Modal
            closable={false}
            title={
                <Form
                    form={form}
                    initialValues={{
                        autoApply: false, // Switch default ON
                        status: "active", // Select default to "Active"
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0px 0px 0px" }}>
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                {initialRule ? "Edit Rule" : "Add New Rule"}
                            </Title>
                            <Text type="secondary">Define the conditions and actions for this classification rule</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Space>
                                <Text>Auto Apply</Text>
                                <Form.Item name="autoApply" valuePropName="checked" noStyle>
                                    <Switch />
                                </Form.Item>
                            </Space>
                            <Form.Item name="status" noStyle>
                                <Select style={{ width: 120 }} placeholder="Select status">
                                    <Option value="active">
                                        <Badge status="success" text="Active" />
                                    </Option>
                                    <Option value="inactive">
                                        <Badge status="default" text="Inactive" />
                                    </Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            }
            open={isOpen}
            onCancel={onClose}
            width={1000}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSaveRule} icon={<SaveOutlined />}>
                    Save Rule
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                style={{ maxHeight: "calc(90vh - 200px)", overflowY: "auto", padding: "10px 0 15px 0px" }}
            >
                {/* Rule Name and Account Code */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="ruleName"
                            label="Rule Name"
                            rules={[{ required: true, message: "Please enter a rule name" }]}
                        >
                            <Input placeholder="Enter a descriptive name for this rule" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="accountCode"
                            label="Account Code"
                            rules={[{ required: true, message: "Please select an account code" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select account code"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                options={accountCodes.map((account) => ({
                                    value: account.code,
                                    //   label: `${account.code} - ${account.description}`,
                                    label: `${account.description}`,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Entity Types and Applicability Section */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Entity Type Applicability">
                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                                {entityTypeIcons.map((item) => {
                                    const isSelected = entityTypesState[item.key] ?? false;
                                    const bgColor = isSelected ? item.selectedBg : "#f0f0f0";
                                    const iconColor = isSelected ? item.selectedColor : "#a0a0a0";

                                    return (
                                        <div key={item.key} style={{ textAlign: "center" }}>
                                            <Tooltip title={item.tooltip}>
                                                <div
                                                    onClick={() => handleClick(item.key)}
                                                    style={{
                                                        width: 31,
                                                        height: 31,
                                                        borderRadius: "50%",
                                                        backgroundColor: bgColor,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        transition: "0.3s",
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {React.cloneElement(item.icon, { style: { color: iconColor, fontSize: 20, width:"1.25rem", height:"1.25rem" } })}
                                                </div>
                                            </Tooltip>
                                        </div>
                                    );
                                })}

                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item name="gstApplicability" label="GST Applicability" rules={[{ required: true, message: "Please select GST Applicability" }]}>
                                    <Select placeholder='Select GST Applicability'>
                                        <Option value="with gst">With GST</Option>
                                        <Option value="without gst">Without GST</Option>
                                        <Option value="both">Both</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="yearApplicability" label="Year Applicability" rules={[{ required: true, message: "Please select Year Applicability" }]}>
                                    <Select>
                                        <Option value="current year">Current Year</Option>
                                        <Option value="previous year">Previous Year</Option>
                                        <Option value="all years">All Years</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="applicability" label="Applicability" rules={[{ required: true, message: "Please select Applicability" }]}>
                                    <Select>
                                        {applicabilityOptions.map((option) => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Divider style={{ margin: "8px" }} />

                {/* Condition Section */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                            Condition
                        </Title>
                        {form.getFieldValue("fieldColumn") === "description" && (
                            <Form.Item name="keywords" label="Keywords" style={{ marginBottom: 0 }}>
                                <Select mode="tags" style={{ width: "300px" }} placeholder="Enter keywords" tokenSeparators={[","]} />
                            </Form.Item>
                        )}
                    </div>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="fieldColumn" label="Field" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="debit">Debit</Option>
                                    <Option value="credit">Credit</Option>
                                    <Option value="amount">Amount</Option>
                                    <Option value="description">Description</Option>
                                    <Option value="date">Date</Option>
                                    <Option value="source">Source</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="triggeredCondition" label="Operator" rules={[{ required: true }]}>
                                <Select>
                                    <Option value=">">Greater than (&gt;)</Option>
                                    <Option value="<">Less than (&lt;)</Option>
                                    <Option value="=">Equal to (=)</Option>
                                    <Option value="!=">Not equal to (!=)</Option>
                                    <Option value="contains">Contains</Option>
                                    <Option value="starts_with">Starts with</Option>
                                    <Option value="ends_with">Ends with</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="fieldValue" label="Value" rules={[{ required: true }]}>
                                <Input placeholder="Enter value" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="dataType" label="Data Type" rules={[{ required: true }]}>
                                <Select>
                                    {dataTypeOptions.map((option) => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                {/* Reclassification Section */}
                <div style={{ marginTop: "5px" }}>
                    <Title level={5}>Reclassification</Title>
                    <Row gutter={16} align="middle">
                        <Col span={11}>
                            <Form.Item name="reclassFrom" label="From Account">
                                <Select
                                    showSearch
                                    placeholder="Select source account"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                    options={accountCodes.map((account) => ({
                                        value: account.code,
                                        label: `${account.code} - ${account.description}`,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2} style={{ textAlign: "center" }}>
                            <ArrowRightOutlined style={{ fontSize: "20px", color: "#8c8c8c" }} />
                        </Col>
                        <Col span={11}>
                            <Form.Item name="reclassTo" label="To Account">
                                <Select
                                    showSearch
                                    placeholder="Select destination account"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                    options={accountCodes.map((account) => ({
                                        value: account.code,
                                        label: `${account.code} - ${account.description}`,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                {/* Action Message Section */}
                <Form.Item name="actionMessage" label="Action Message">
                    <TextArea placeholder="Enter message to display when rule is triggered" rows={2} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

// RuleTable Component
interface RuleTableProps {
    onEditRule: (rule: Rule) => void
    onAddRule: () => void
    rules: Rule[]
    setRules: React.Dispatch<React.SetStateAction<Rule[]>>
}

function RuleTable({ onEditRule, onAddRule, rules, setRules }: RuleTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
    const [importMessage, setImportMessage] = useState("")
    const [importProgress, setImportProgress] = useState(0)
    const [importedRulesCount, setImportedRulesCount] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showImportModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    // const handleFinalImport = () => {
    //     setImportStatus('processing');
    //     setIsModalVisible(false);

    //     // Simulate import
    //     setTimeout(() => {
    //         const success = Math.random() > 0.2;
    //         if (success) {
    //             setImportStatus('success');
    //             setImportMessage('');
    //             setImportedRulesCount(12); // Example number
    //         } else {
    //             setImportStatus('error');
    //             setImportMessage('There was an error importing the rules. Please try again.');
    //         }
    //     }, 2000);
    // };


    // Find account description by code
    const getAccountDescription = (code: string) => {
        const account = accountCodes.find((acc) => acc.code === code)
        return account ? account.description : code
    }

    const filteredRules = rules.filter(
        (rule) =>
            rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rule.account_code.includes(searchTerm) ||
            getAccountDescription(rule.account_code).toLowerCase().includes(searchTerm.toLowerCase()) ||
            rule.action_message.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleDeleteRule = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this rule?",
            icon: <ExclamationCircleOutlined />,
            content: "This action cannot be undone.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                setRules(rules.filter((rule) => rule.id !== id))
                message.success("Rule deleted successfully")
            },
        })
    }

    const handleToggleStatus = (id: string) => {
        setRules(
            rules.map((rule) =>
                rule.id === id
                    ? {
                        ...rule,
                        status: rule.status === "active" ? "inactive" : "active",
                    }
                    : rule,
            ),
        )
        message.success("Rule status updated")
    }

    const handleToggleAutoApply = (id: string) => {
        setRules(
            rules.map((rule) =>
                rule.id === id
                    ? {
                        ...rule,
                        auto_apply: !rule.auto_apply,
                    }
                    : rule,
            ),
        )
        message.success("Auto apply setting updated")
    }

    const handleExportRules = () => {
        // Generate CSV content based on the rules
        const csvHeader = [
            "Account_code",
            "Condition_Id",
            "Field_Column",
            "Triggered_Condition",
            "Field_value",
            "Data_Type",
            "Action_Message",
            "Applicability",
            "Status",
            "Gst_Applicability",
            "Company",
            "Trust",
            "Partnership",
            "Sole_traders",
            "Non Profit",
            "Year_applicability",
            "Auto_Apply",
            "Keywords",
            "Reclassification_From",
            "Reclassification_To",
        ].join(",")

        const csvRows = rules.map((rule) => {
            return [
                rule.account_code,
                rule.condition_id,
                rule.field_column,
                rule.triggered_condition,
                rule.field_value,
                rule.data_type,
                `"${rule.action_message.replace(/"/g, '""')}"`, // Escape quotes in CSV
                rule.applicability,
                rule.status,
                rule.gst_applicability,
                rule.entity_types.company ? "Yes" : "No",
                rule.entity_types.trust ? "Yes" : "No",
                rule.entity_types.partnership ? "Yes" : "No",
                rule.entity_types.sole_traders ? "Yes" : "No",
                rule.entity_types.non_profit ? "Yes" : "No",
                rule.year_applicability,
                rule.auto_apply ? "Yes" : "No",
                `"${(rule.keywords || []).join(", ")}"`,
                rule.reclassification?.from || "",
                rule.reclassification?.to || "",
            ].join(",")
        })

        const csvContent = [csvHeader, ...csvRows].join("\n")

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "gl_scrutiny_rules.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        message.success("Rules exported successfully")
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setImportStatus("idle")
            setImportMessage("")
            setImportProgress(0)
            setImportedRulesCount(0)
        }
    }

    // Function to trigger file input click
    // const triggerFileInput = () => {
    //     if (fileInputRef.current) {
    //         fileInputRef.current.click()
    //     }
    // }

    // Function to parse CSV data with proper handling of quoted fields
    const parseCSV = (text: string): string[][] => {
        const result: string[][] = []
        let row: string[] = []
        let cell = ""
        let inQuotes = false

        for (let i = 0; i < text.length; i++) {
            const char = text[i]
            const nextChar = text[i + 1]

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Handle escaped quotes (two double quotes in a row)
                    cell += '"'
                    i++ // Skip the next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes
                }
            } else if (char === "," && !inQuotes) {
                // End of cell
                row.push(cell.trim())
                cell = ""
            } else if ((char === "\n" || (char === "\r" && nextChar === "\n")) && !inQuotes) {
                // End of row
                if (char === "\r") i++ // Skip the \n in \r\n
                row.push(cell.trim())
                if (row.some((c) => c !== "")) {
                    // Skip empty rows
                    result.push(row)
                }
                row = []
                cell = ""
            } else {
                cell += char
            }
        }

        // Handle the last cell and row
        if (cell) {
            row.push(cell.trim())
        }
        if (row.length > 0) {
            result.push(row)
        }

        return result
    }

    const handleImportRules = async () => {
        setIsModalVisible(false)
        if (!file) return

        setImportStatus("processing")
        setImportProgress(10)
        setImportMessage("Reading file...")

        try {
            const text = await file.text()
            setImportProgress(30)
            setImportMessage("Parsing CSV data...")

            // Parse CSV data
            const parsedData = parseCSV(text)

            if (parsedData.length < 2) {
                throw new Error("CSV file is empty or has no data rows")
            }

            const headers = parsedData[0]
            setImportProgress(50)
            setImportMessage("Processing rules...")

            // Map headers to indices for easier access
            const headerMap: Record<string, number> = {}
            headers.forEach((header, index) => {
                headerMap[header.trim()] = index
            })

            // Required headers
            const requiredHeaders = ["Account_code", "Field_Column", "Triggered_Condition", "Field_value"]

            // Check if all required headers exist
            const missingHeaders = requiredHeaders.filter((h) => headerMap[h] === undefined)
            if (missingHeaders.length > 0) {
                throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
            }

            // Process data rows
            const importedRules: Rule[] = []

            // Skip header row and process data rows
            for (let i = 1; i < parsedData.length; i++) {
                const row = parsedData[i]
                if (row.length < headers.length) continue // Skip incomplete rows

                // Update progress
                setImportProgress(50 + Math.floor((i / parsedData.length) * 40))

                // Get account code and find a matching account
                const accountCode = row[headerMap["Account_code"]]
                const matchingAccount = accountCodes.find(
                    (acc) => acc.code === accountCode || acc.description.toLowerCase() === accountCode.toLowerCase(),
                )

                // Create rule name based on account
                let ruleName = ""
                if (matchingAccount) {
                    ruleName = `Rule for ${matchingAccount.description}`
                } else {
                    ruleName = `Rule for ${accountCode}`
                }

                // Parse keywords if available
                let keywords: string[] = []
                if (headerMap["Keywords"] !== undefined && row[headerMap["Keywords"]]) {
                    keywords = row[headerMap["Keywords"]]
                        .split(",")
                        .map((k: string) => k.trim())
                        .filter((k: string) => k)
                }

                // Parse reclassification if available
                let reclassification = undefined
                if (
                    headerMap["Reclassification_From"] !== undefined &&
                    headerMap["Reclassification_To"] !== undefined &&
                    row[headerMap["Reclassification_From"]] &&
                    row[headerMap["Reclassification_To"]]
                ) {
                    reclassification = {
                        from: row[headerMap["Reclassification_From"]],
                        to: row[headerMap["Reclassification_To"]],
                    }
                }

                // Create rule object from CSV data
                const rule: Rule = {
                    id: `imported-${Date.now()}-${i}`,
                    name: ruleName,
                    account_code: matchingAccount?.code || accountCode,
                    condition_id: row[headerMap["Condition_Id"]] || `${Date.now()}-${i}`,
                    field_column: (row[headerMap["Field_Column"]] || "debit").toLowerCase(),
                    triggered_condition: row[headerMap["Triggered_Condition"]] || ">",
                    field_value: row[headerMap["Field_value"]] || "0",
                    data_type: row[headerMap["Data_Type"]] || "integer",
                    action_message: row[headerMap["Action_Message"]] || "",
                    applicability: row[headerMap["Applicability"]] || "general",
                    status: (row[headerMap["Status"]] || "active").toLowerCase() as "active" | "inactive",
                    gst_applicability: (row[headerMap["Gst_Applicability"]] || "both").toLowerCase() as
                        | "with gst"
                        | "without gst"
                        | "both",
                    entity_types: {
                        company: (row[headerMap["Company"]] || "").toLowerCase() === "yes",
                        trust: (row[headerMap["Trust"]] || "").toLowerCase() === "yes",
                        partnership: (row[headerMap["Partnership"]] || "").toLowerCase() === "yes",
                        sole_traders: (row[headerMap["Sole_traders"]] || "").toLowerCase() === "yes",
                        non_profit: (row[headerMap["Non Profit"]] || "").toLowerCase() === "yes",
                    },
                    year_applicability: (row[headerMap["Year_applicability"]] || "current year").toLowerCase(),
                    auto_apply: (row[headerMap["Auto_Apply"]] || "").toLowerCase() === "yes",
                    keywords: keywords,
                    reclassification: reclassification,
                    createdBy: "CSV Import",
                    createdAt: new Date().toISOString(),
                }

                importedRules.push(rule)
            }

            setImportProgress(95)
            setImportMessage("Finalizing import...")

            // Add imported rules to existing rules
            setRules((prevRules) => [...prevRules, ...importedRules])
            setImportedRulesCount(importedRules.length)

            setImportProgress(100)
            setImportStatus("success")
            setImportMessage(`Successfully imported ${importedRules.length} rules`)
            message.success(`Successfully imported ${importedRules.length} rules`)

            // Reset file input after successful import
            setTimeout(() => {
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            }, 2000)
        } catch (error) {
            console.error("Import error:", error)
            setImportStatus("error")
            setImportMessage(`Error importing CSV: ${error instanceof Error ? error.message : "Unknown error"}`)
            setImportProgress(100)
            message.error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
    }

    const resetImport = () => {
        setFile(null)
        setImportStatus("idle")
        setImportMessage("")
        setImportProgress(0)
        setImportedRulesCount(0)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Render entity type icons with appropriate colors
    const renderEntityTypeIcons = (entityTypes: Rule["entity_types"]) => {
        return (
            <Space>
                {entityTypes.company && (
                    <Tooltip title="Company">
                        <div style={{ padding: "4px", borderRadius: "50%", backgroundColor: "#e6f7ff" }}>
                            <BankOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
                        </div>
                    </Tooltip>
                )}
                {entityTypes.trust && (
                    <Tooltip title="Trust">
                        <div style={{ padding: "4px", borderRadius: "50%", backgroundColor: "#f9f0ff" }}>
                            <HomeOutlined style={{ color: "#722ed1", fontSize: "14px" }} />
                        </div>
                    </Tooltip>
                )}
                {entityTypes.partnership && (
                    <Tooltip title="Partnership">
                        <div style={{ padding: "4px", borderRadius: "50%", backgroundColor: "#f6ffed" }}>
                            <TeamOutlined style={{ color: "#52c41a", fontSize: "14px" }} />
                        </div>
                    </Tooltip>
                )}
                {entityTypes.sole_traders && (
                    <Tooltip title="Sole Trader">
                        <div style={{ padding: "4px", borderRadius: "50%", backgroundColor: "#fffbe6" }}>
                            <UserOutlined style={{ color: "#faad14", fontSize: "14px" }} />
                        </div>
                    </Tooltip>
                )}
                {entityTypes.non_profit && (
                    <Tooltip title="Non Profit">
                        <div style={{ padding: "4px", borderRadius: "50%", backgroundColor: "#fff1f0" }}>
                            <HeartOutlined style={{ color: "#f5222d", fontSize: "14px" }} />
                        </div>
                    </Tooltip>
                )}
            </Space>
        )
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString()
        } catch (e) {
            return dateString
        }
    }

    // Format condition for display
    const formatCondition = (rule: Rule) => {
        const fieldName = rule.field_column.charAt(0).toUpperCase() + rule.field_column.slice(1)
        let operator = rule.triggered_condition

        // Format operator for display
        switch (operator) {
            case ">":
                operator = "Greater than"
                break
            case "<":
                operator = "Less than"
                break
            case "=":
                operator = "Equal to"
                break
            case "!=":
                operator = "Not equal to"
                break
            case "contains":
                operator = "Contains"
                break
            case "starts_with":
                operator = "Starts with"
                break
            case "ends_with":
                operator = "Ends with"
                break
        }

        // Get color based on applicability
        // let applicabilityColor = "#f0f0f0"
        // if (rule.applicability === "general") {
        //     applicabilityColor = "#e6f7ff"
        // } else if (rule.applicability === "specific") {
        //     applicabilityColor = "#fffbe6"
        // } else if (rule.applicability === "custom") {
        //     applicabilityColor = "#f9f0ff"
        // }

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: applicabilityColor }} /> */}
                    <div style={{ fontWeight: 500 }}>
                        {fieldName} <Text type="secondary">({rule.data_type})</Text>
                    </div>
                </div>
                <div>
                    {operator}: <span style={{ fontWeight: 500 }}>{rule.field_value}</span>
                </div>
            </div>
        )
    }

    // Upload props for CSV import
    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            setFile(file)
            return false
        },
        showUploadList: false,
    }

    // Table columns
    const columns: ColumnsType<Rule> = [
        {
            title: "Account",
            dataIndex: "account_code",
            key: "account_code",
            width: "12%",
            render: (text) => (
                <div style={{ display: "flex", flexDirection: "column"}}>
                    {/* <span>{text}</span> */}
                    <Text type="secondary" ellipsis={{ tooltip: getAccountDescription(text) }}>
                        {getAccountDescription(text)}
                    </Text>
                </div>
            ),
        },
        {
            title: "Condition",
            key: "condition",
            width: "13%",
            render: (_, record) => formatCondition(record),
        },
        {
            title: "Action Message",
            dataIndex: "action_message",
            key: "action_message",
            width: "22%",
            ellipsis: { showTitle: false },
            render: (text) => (

                <div style={{
                    maxHeight: "60px", overflow: "hidden", whiteSpace: "normal",
                    wordBreak: "break-word"
                }}>{text}</div>
            ),
        },
        {
            title: "Entity Types",
            key: "entity_types",
            width: "10%",
            render: (_, record) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {renderEntityTypeIcons(record.entity_types)}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        GST: {record.gst_applicability}
                    </Text>
                </div>
            ),
        },
        {
            title: "Keywords",
            key: "keywords",
            width: "8%",
            render: (_, record) =>
                record.keywords && record.keywords.length > 0 ? (
                    <div style={{ maxHeight: "60px", overflow: "hidden", whiteSpace: "normal", wordBreak: "break-word" }}>
                        {record.keywords.join(", ")}
                    </div>
                ) : (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        No keywords
                    </Text>
                ),
        },

        {
            title: "Reclassification",
            key: "reclassification",
            width: "10%",
            render: (_, record) =>
                record.reclassification ? (
                    <Space>
                        <Tooltip title={getAccountDescription(record.reclassification.from)}>
                            <Text strong>{record.reclassification.from}</Text>
                        </Tooltip>
                        <ArrowRightOutlined style={{ fontSize: "9px", color: "#8c8c8c" }} />
                        <Tooltip title={getAccountDescription(record.reclassification.to)}>
                            <Text strong>{record.reclassification.to}</Text>
                        </Tooltip>
                    </Space>
                ) : (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        None
                    </Text>
                ),
        },
        {
            title: "Auto Apply",
            key: "auto_apply",
            width: "5%",
            align: "center",
            render: (_, record) => (
                <Switch checked={record.auto_apply || false} onChange={() => handleToggleAutoApply(record.id)} size="small"
                    style={{
                        backgroundColor: record.auto_apply ? "rgb(16 185 129)" : undefined, // active color if true
                    }} />
            ),
        },
        {
            title: "Status",
            key: "status",
            width: "5%",
            align: "center",
            render: (_, record) => {
                const isActive = record.status === "active";
                const color = isActive ? "rgb(16 185 129)" : "#f5f5f5"; // light green for active, light gray for inactive
                const textColor = isActive ? "#FFFF" : "#000";

                return (
                    <span
                        style={{
                            backgroundColor: color,
                            color: textColor,
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            display: "inline-block",
                        }}
                    >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                );
            },
        },

        {
            title: "Created By",
            key: "createdBy",
            width: "8%",
            render: (_, record) => (
                <div style={{ fontSize: "12px" }}>
                    <div>{record.createdBy || "System"}</div>
                    <Text type="secondary">{formatDate(record.createdAt || "")}</Text>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: "5%",
            align: "right",
            render: (_, record) => {
                const items: MenuProps["items"] = [
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        onClick: () => onEditRule(record),
                    },
                    {
                        key: "toggle-status",
                        label: `Set ${record.status === "active" ? "Inactive" : "Active"}`,
                        icon: <Badge status={record.status === "active" ? "default" : "success"} />,
                        onClick: () => handleToggleStatus(record.id),
                    },
                    {
                        key: "delete",
                        label: "Delete",
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => handleDeleteRule(record.id),
                    },
                ]

                return (
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                )
            },
        },
    ]

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Input
                    placeholder="Search Rules by Name, Account Code, or Message..."
                    prefix={<SearchOutlined />}
                    style={{ width: 400 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Space>
                    <Button icon={<DownloadOutlined />} onClick={handleExportRules}>
                        Export Rules
                    </Button>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="csv-file"
                        ref={fileInputRef}
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />

                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Import Rules</Button>
                    </Upload>

                    <Button type="primary" icon={<PlusOutlined />} onClick={onAddRule}>
                        Add Rule
                    </Button>
                </Space>
            </div>

            {/* Show import status if a file is selected */}
            {file && (
                <Card size="small">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                            <UploadOutlined />
                            <span>Selected file: {file.name}</span>
                        </Space>
                        <Space>
                            <Button size="small" onClick={resetImport}>
                                Cancel
                            </Button>
                            {/* <Button size="small" type="primary" onClick={handleImportRules} loading={importStatus === "processing"}>
                {importStatus === "processing" ? "Importing..." : "Import"}
              </Button> */}
                            <Button
                                size="small"
                                type="primary"
                                onClick={showImportModal}
                                disabled={!file}
                            >
                                Import
                            </Button>
                        </Space>
                    </div>

                    {importStatus === "processing" && (
                        <div style={{ marginTop: "12px" }}>
                            <Progress percent={importProgress} size="small" />
                            <Text type="secondary">{importMessage}</Text>
                        </div>
                    )}

                    <Modal
                        title="Import Rules"
                        open={isModalVisible}
                        onCancel={handleCancel}
                        closable={false}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="import" type="primary" onClick={handleImportRules}>
                                Import
                            </Button>,
                        ]}
                    >
                        <p style={{ padding: '10px 0px' }}>Selected file: <Text strong>{file?.name}</Text></p>
                        <p style={{ padding: '10px 0px' }}>Ready to import <Text code>{file?.name}</Text>. Click "Import" to continue.</p>
                    </Modal>

                    {importStatus === "success" && (
                        <Alert
                            message="Import Successful"
                            description={`${importedRulesCount} rules have been successfully imported.`}
                            type="success"
                            showIcon
                            style={{ marginTop: "12px" }}
                        />
                    )}

                    {importStatus === "error" && (
                        <Alert
                            message="Import Failed"
                            description={importMessage}
                            type="error"
                            showIcon
                            style={{ marginTop: "12px" }}
                        />
                    )}
                </Card>
            )}

            <Table
                columns={columns}
                dataSource={filteredRules}
                scroll={{ x: 1500 }}
                rowKey="id"
                className="rule-table"
                pagination={{ pageSize: 10 }}
                locale={{
                    emptyText: (
                        <div style={{ padding: "24px", textAlign: "center" }}>
                            <Text type="secondary">No rules found. Try adjusting your search or add a new rule.</Text>
                        </div>
                    ),
                }}
            />

            {/* Import Dialog */}
            <Modal
                title="Import Rules"
                open={isImportDialogOpen}
                onCancel={() => {
                    resetImport()
                    setIsImportDialogOpen(false)
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            resetImport()
                            setIsImportDialogOpen(false)
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="import"
                        type="primary"
                        onClick={handleImportRules}
                        disabled={!file || importStatus === "processing"}
                        loading={importStatus === "processing"}
                    >
                        {importStatus === "processing" ? "Importing..." : "Import"}
                    </Button>,
                ]}
            >
                <div style={{ marginBottom: "16px" }}>
                    {file ? (
                        <Text>Selected file: {file.name}</Text>
                    ) : (
                        <Text type="secondary">Please select a CSV file to import rules.</Text>
                    )}
                </div>

                {importStatus === "processing" && (
                    <div>
                        <Progress percent={importProgress} />
                        <Text type="secondary">{importMessage}</Text>
                    </div>
                )}

                {importStatus === "success" && (
                    <Alert
                        message="Import Successful"
                        description={`${importedRulesCount} rules have been successfully imported.`}
                        type="success"
                        showIcon
                    />
                )}

                {importStatus === "error" && (
                    <Alert message="Import Failed" description={importMessage} type="error" showIcon />
                )}
            </Modal>
        </div>
    )
}

// Main GL Scrutiny Component
const AddRule = () => {
    const [editingRule, setEditingRule] = useState<Rule | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rules, setRules] = useState<Rule[]>([
        // {
        //   id: "1",
        //   name: "Wages Rule",
        //   account_code: "6900",
        //   condition_id: "368",
        //   field_column: "debit",
        //   triggered_condition: ">",
        //   field_value: "0",
        //   data_type: "integer",
        //   action_message: "Investigate if through paye reconcile with shareholder's IRD soe",
        //   applicability: "general",
        //   status: "inactive",
        //   gst_applicability: "both",
        //   entity_types: {
        //     company: true,
        //     trust: false,
        //     partnership: false,
        //     sole_traders: false,
        //     non_profit: true,
        //   },
        //   year_applicability: "current year",
        //   auto_apply: false,
        //   keywords: ["wages", "salary", "payroll"],
        //   reclassification: {
        //     from: "6900",
        //     to: "6990",
        //   },
        //   createdBy: "John Smith",
        //   createdAt: "2023-05-15T10:30:00Z",
        // },
        // {
        //   id: "2",
        //   name: "Advertising Rule",
        //   account_code: "6000",
        //   condition_id: "369",
        //   field_column: "credit",
        //   triggered_condition: ">",
        //   field_value: "1000",
        //   data_type: "decimal",
        //   action_message: "Check if this is a legitimate advertising expense",
        //   applicability: "specific",
        //   status: "active",
        //   gst_applicability: "with gst",
        //   entity_types: {
        //     company: true,
        //     trust: true,
        //     partnership: false,
        //     sole_traders: true,
        //     non_profit: false,
        //   },
        //   year_applicability: "all years",
        //   auto_apply: true,
        //   keywords: ["marketing", "promotion", "advertisement"],
        //   createdBy: "Sarah Johnson",
        //   createdAt: "2023-06-20T14:45:00Z",
        // },
    ])

    const handleEditRule = (rule: Rule) => {
        setEditingRule(rule)
        setIsModalOpen(true)
    }

    const handleAddRule = () => {
        setEditingRule(null)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setEditingRule(null)
        setIsModalOpen(false)
    }

    const handleRuleAdded = (newRule: Rule) => {
        if (editingRule) {
            // Update existing rule
            setRules(rules.map((rule) => (rule.id === editingRule.id ? newRule : rule)))
            message.success("Rule updated successfully")
        } else {
            // Add new rule
            setRules([...rules, newRule])
            message.success("Rule added successfully")
        }
        setEditingRule(null)
        setIsModalOpen(false)
    }

    return (
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "10px" }}>
            <PageHeader />

            <div style={{ marginTop: "24px" }}>
                <RuleTable onEditRule={handleEditRule} onAddRule={handleAddRule} rules={rules} setRules={setRules} />
            </div>

            <RuleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialRule={editingRule}
                onRuleAdded={handleRuleAdded}
            />
        </div>
    )
}
export default AddRule;