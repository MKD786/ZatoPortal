
import { useState } from "react"
import { SearchOutlined, FilterOutlined, EditOutlined, } from "@ant-design/icons";
import './assignment.scss';
import { Button, Input, Dropdown, Menu, Checkbox, Table, Tag, Card, Space } from "antd";
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

type Role = "Director" | "Manager" | "Accountant" | "Special Role" | "Admin" | "Super Admin"
type JobStatus = "Unassigned" | "Assigned" | "Pending"
type ProxyStatus = "None" | "Active" | "Pending"
type AccessLevel = "Read Only" | "Full Access" | "None"
type PermissionLevel = "Normal" | "Elevated" | "Restricted"

interface ProxyAssignment {
    proxyStaffId: string
    originalStaffId: string
    startDate: string
    endDate: string
    status: ProxyStatus
    accessLevel: AccessLevel
}

interface StaffPermission {
    staffId: string
    jobId: string
    permissionLevel: PermissionLevel
}

interface Staff {
    id: string
    name: string
    email: string
    role: Role
    assignedJobsCount: number
    assignedJobs: string[]
    selected?: boolean
}

interface Job {
    id: string
    name: string
    clientName: string
    assignedStaffCount: number
    assignedStaff: string[]
    status: JobStatus
    selected?: boolean
}


// Mock data
const initialStaff: Staff[] = [
    {
        id: "s1",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "Director",
        assignedJobsCount: 3,
        assignedJobs: ["j1", "j3"],
    },
    {
        id: "s2",
        name: "Maria Garcia",
        email: "maria@example.com",
        role: "Manager",
        assignedJobsCount: 2,
        assignedJobs: ["j2"],
    },
    {
        id: "s3",
        name: "David Lee",
        email: "david@example.com",
        role: "Accountant",
        assignedJobsCount: 1,
        assignedJobs: [],
    },
    {
        id: "s4",
        name: "Terry Farmer",
        email: "terry@example.com",
        role: "Director",
        assignedJobsCount: 0,
        assignedJobs: [],
    },
    {
        id: "s5",
        name: "Mark Smith",
        email: "mark@example.com",
        role: "Manager",
        assignedJobsCount: 2,
        assignedJobs: ["j4"],
    },
    {
        id: "s6",
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
        assignedJobsCount: 1,
        assignedJobs: ["j5"],
    },
    { id: "s7", name: "Amy Davis", email: "amy@example.com", role: "Accountant", assignedJobsCount: 0, assignedJobs: [] },
    {
        id: "s8",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "Special Role",
        assignedJobsCount: 0,
        assignedJobs: [],
    },
    {
        id: "s9",
        name: "Michael Chen",
        email: "michael@example.com",
        role: "Super Admin",
        assignedJobsCount: 0,
        assignedJobs: [],
    },
]

const initialJobs: Job[] = [
    {
        id: "j1",
        name: "Annual Audit",
        clientName: "Smith Enterprises",
        assignedStaffCount: 1,
        assignedStaff: ["s1"],
        status: "Assigned",
    },
    {
        id: "j2",
        name: "Tax Filing",
        clientName: "Johnson Consulting",
        assignedStaffCount: 1,
        assignedStaff: ["s2"],
        status: "Assigned",
    },
    {
        id: "j3",
        name: "Financial Review",
        clientName: "Williams Manufacturing",
        assignedStaffCount: 1,
        assignedStaff: ["s1"],
        status: "Assigned",
    },
    {
        id: "j4",
        name: "Bookkeeping",
        clientName: "Brown Retail Group",
        assignedStaffCount: 1,
        assignedStaff: ["s5"],
        status: "Assigned",
    },
    {
        id: "j5",
        name: "Payroll Services",
        clientName: "Davis Healthcare",
        assignedStaffCount: 1,
        assignedStaff: ["s6"],
        status: "Assigned",
    },
    {
        id: "j6",
        name: "Advisory Services",
        clientName: "Wilson Legal Services",
        assignedStaffCount: 0,
        assignedStaff: [],
        status: "Unassigned",
    },
    {
        id: "j7",
        name: "Compliance Check",
        clientName: "Taylor Industries",
        assignedStaffCount: 0,
        assignedStaff: [],
        status: "Unassigned",
    },
]

const RoleManagement = () => {
    const [staff, setStaff] = useState<Staff[]>(initialStaff)
    const [jobs, setJobs] = useState<Job[]>(initialJobs)
    const [roleFilter, setRoleFilter] = useState<Role[]>([])

    const staffPermissions: StaffPermission[] = [
        {
            staffId: "s8", // Special Role
            jobId: "j1",
            permissionLevel: "Elevated",
        },
        {
            staffId: "s8", // Special Role
            jobId: "j2",
            permissionLevel: "Elevated",
        },
        {
            staffId: "s3", // Accountant
            jobId: "j3",
            permissionLevel: "Restricted",
        },
    ]
    const proxyAssignments: ProxyAssignment[] = [
        {
            proxyStaffId: "s6", // Admin
            originalStaffId: "s1", // Director
            startDate: "2023-06-01",
            endDate: "2023-06-15",
            status: "Active",
            accessLevel: "Full Access",
        },
        {
            proxyStaffId: "s6", // Admin
            originalStaffId: "s2", // Manager
            startDate: "2023-07-01",
            endDate: "2023-07-15",
            status: "Pending",
            accessLevel: "Read Only",
        },
    ]


    // Role filter menu
    const roleFilterMenu = (
        <Menu>
            <Menu.ItemGroup title="Filter by Role">
                <Menu.Item key="director">
                    <Checkbox
                        checked={roleFilter.includes("Director")}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRoleFilter([...roleFilter, "Director"])
                            } else {
                                setRoleFilter(roleFilter.filter((r) => r !== "Director"))
                            }
                        }}
                    >
                        Director
                    </Checkbox>
                </Menu.Item>
                <Menu.Item key="manager">
                    <Checkbox
                        checked={roleFilter.includes("Manager")}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRoleFilter([...roleFilter, "Manager"])
                            } else {
                                setRoleFilter(roleFilter.filter((r) => r !== "Manager"))
                            }
                        }}
                    >
                        Manager
                    </Checkbox>
                </Menu.Item>
                <Menu.Item key="accountant">
                    <Checkbox
                        checked={roleFilter.includes("Accountant")}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRoleFilter([...roleFilter, "Accountant"])
                            } else {
                                setRoleFilter(roleFilter.filter((r) => r !== "Accountant"))
                            }
                        }}
                    >
                        Accountant
                    </Checkbox>
                </Menu.Item>
                <Menu.Item key="specialRole">
                    <Checkbox
                        checked={roleFilter.includes("Special Role")}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRoleFilter([...roleFilter, "Special Role"])
                            } else {
                                setRoleFilter(roleFilter.filter((r) => r !== "Special Role"))
                            }
                        }}
                    >
                        Special Role
                    </Checkbox>
                </Menu.Item>
                <Menu.Item key="admin">
                    <Checkbox
                        checked={roleFilter.includes("Admin")}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRoleFilter([...roleFilter, "Admin"])
                            } else {
                                setRoleFilter(roleFilter.filter((r) => r !== "Admin"))
                            }
                        }}
                    >
                        Admin
                    </Checkbox>
                </Menu.Item>
                <Menu.Item key="superAdmin">
                    <Checkbox
                        checked={roleFilter.includes("Super Admin")}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setRoleFilter([...roleFilter, "Super Admin"])
                            } else {
                                setRoleFilter(roleFilter.filter((r) => r !== "Super Admin"))
                            }
                        }}
                    >
                        Super Admin
                    </Checkbox>
                </Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    )
    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <Card
                    title={<span style={{ color: "#FFFF", fontWeight: "500" }}>Role Management</span>}
                    headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
                    extra={
                        <Button type="default" style={{ color: "#000", fontWeight: "500", borderColor: "white" }}>
                            Add Assignment
                        </Button>
                    }
                >
                    <Space style={{ marginBottom: 16 }}>
                        <Dropdown overlay={roleFilterMenu}>
                            <Button>
                                <FilterOutlined /> Staff Role
                            </Button>
                        </Dropdown>

                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="direct">Direct Assignments</Menu.Item>
                                    <Menu.Item key="proxy">Proxy Assignments</Menu.Item>
                                    <Menu.Item key="special">Special Permissions</Menu.Item>
                                </Menu>
                            }
                        >
                            <Button>
                                <FilterOutlined /> Assignment Type
                            </Button>
                        </Dropdown>

                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="full">Full Access</Menu.Item>
                                    <Menu.Item key="read">Read Only</Menu.Item>
                                    <Menu.Item key="none">None</Menu.Item>
                                </Menu>
                            }
                        >
                            <Button>
                                <FilterOutlined /> Access Level
                            </Button>
                        </Dropdown>

                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="active">Active</Menu.Item>
                                    <Menu.Item key="pending">Pending</Menu.Item>
                                    <Menu.Item key="expired">Expired</Menu.Item>
                                </Menu>
                            }
                        >
                            <Button>
                                <FilterOutlined /> Status
                            </Button>
                        </Dropdown>

                        <Input
                            placeholder="Search staff, jobs, clients..."
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                    </Space>

                    <Table
                        columns={[
                            { title: "Staff", dataIndex: "staffName", key: "staffName" },
                            { title: "Role", dataIndex: "staffRole", key: "staffRole" },
                            { title: "Job", dataIndex: "jobName", key: "jobName" },
                            { title: "Client", dataIndex: "clientName", key: "clientName" },
                            {
                                title: "Assignment Type",
                                key: "assignmentType",
                                align: "center",
                                render: (_: any, record: any) => {
                                    if (record.type === "proxy") {
                                        return <Tag color="orange">Proxy for {record.originalStaffName}</Tag>
                                    } else if (record.type === "special") {
                                        return <Tag color="green">Special Permission</Tag>
                                    }
                                    return <Tag>Direct</Tag>
                                },
                            },
                            {
                                title: "Access Level",
                                key: "accessLevel",
                                align: "center",
                                render: (_: any, record: any) => {
                                    if (record.accessLevel === "Full Access") {
                                        return <Tag color="success">Full Access</Tag>
                                    } else if (record.accessLevel === "Read Only") {
                                        return <Tag>Read Only</Tag>
                                    }
                                    return <Tag color="default">None</Tag>
                                },
                            },
                            {
                                title: "Status",
                                key: "status",
                                align: "center",
                                render: (_: any, record: any) => {
                                    if (record.status === "Active") {
                                        return <Tag color="success">Active</Tag>
                                    } else if (record.status === "Pending") {
                                        return <Tag color="warning">Pending</Tag>
                                    }
                                    return <Tag>Expired</Tag>
                                },
                            },
                            {
                                title: "Actions",
                                key: "actions",
                                align: "center",
                                render: () => <Button type="text" icon={<EditOutlined />} />,
                            },
                        ]}
                        dataSource={[
                            // Direct assignments
                            ...staff.flatMap((staffMember) =>
                                staffMember.assignedJobs
                                    .map((jobId) => {
                                        const job = jobs.find((j) => j.id === jobId)
                                        if (!job) return null
                                        return {
                                            key: `direct-${staffMember.id}-${jobId}`,
                                            staffName: staffMember.name,
                                            staffRole: staffMember.role,
                                            jobName: job.name,
                                            clientName: job.clientName,
                                            type: "direct",
                                            accessLevel: "Full Access",
                                            status: "Active",
                                        }
                                    })
                                    .filter(Boolean),
                            ),
                            // Proxy assignments
                            ...proxyAssignments.flatMap((proxy) => {
                                const proxyStaff = staff.find((s) => s.id === proxy.proxyStaffId)
                                const originalStaff = staff.find((s) => s.id === proxy.originalStaffId)
                                if (!proxyStaff || !originalStaff) return []

                                return originalStaff.assignedJobs
                                    .map((jobId) => {
                                        const job = jobs.find((j) => j.id === jobId)
                                        if (!job) return null
                                        return {
                                            key: `proxy-${proxy.proxyStaffId}-${jobId}`,
                                            staffName: proxyStaff.name,
                                            staffRole: proxyStaff.role,
                                            jobName: job.name,
                                            clientName: job.clientName,
                                            originalStaffName: originalStaff.name,
                                            type: "proxy",
                                            accessLevel: proxy.accessLevel,
                                            status: proxy.status,
                                            startDate: proxy.startDate,
                                            endDate: proxy.endDate,
                                        }
                                    })
                                    .filter(Boolean)
                            }),
                            // Special permissions
                            ...staffPermissions
                                .map((permission) => {
                                    const staffMember = staff.find((s) => s.id === permission.staffId)
                                    const job = jobs.find((j) => j.id === permission.jobId)
                                    if (!staffMember || !job) return null
                                    return {
                                        key: `permission-${permission.staffId}-${permission.jobId}`,
                                        staffName: staffMember.name,
                                        staffRole: staffMember.role,
                                        jobName: job.name,
                                        clientName: job.clientName,
                                        type: "special",
                                        permissionLevel: permission.permissionLevel,
                                        status: "Active",
                                    }
                                })
                                .filter(Boolean),
                        ]}
                        pagination={false}
                        scroll={{ x: true }}
                    />

                    <Card type="inner" title="Role Assignment Rules" style={{ marginTop: 16 }}>
                        <ul style={{ listStyleType: "disc", paddingLeft: 24 }}>
                            <li>
                                <strong>Directors</strong> can assign proxies to other Directors
                            </li>
                            <li>
                                <strong>Managers</strong> can assign proxies to other Managers
                            </li>
                            <li>
                                <strong>Accountants</strong> can assign proxies to other Accountants
                            </li>
                            <li>
                                <strong>Super Admin</strong> can assign any job at any level to anyone
                            </li>
                            <li>
                                <strong>Proxy assignments</strong> can be Read Only or Full Access
                            </li>
                            <li>
                                <strong>Special Role</strong> staff can be granted elevated access to specific jobs
                            </li>
                        </ul>
                    </Card>
                </Card>
            </div>
        </DndProvider>
    )
}
export default RoleManagement;