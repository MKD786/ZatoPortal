import { FileText, File, User, ClipboardCheck } from "lucide-react"

interface ActivityItemProps {
  user: string
  action: string
  time: string
  type: string
}

const ActivityItem = ({ user, action, time, type }: ActivityItemProps) => {

  const getIcon = () => {
    switch (type) {
      case "file":
        return (
          <div className="p-2 rounded-full bg-blue-600 text-white">
            <File size={16} strokeWidth={1.5} />
          </div>
        )
      case "form":
        return (
          <div className="p-2 rounded-full bg-green-600 text-white">
            <ClipboardCheck size={16} strokeWidth={1.5} />
          </div>
        )
      case "profile":
        return (
          <div className="p-2 rounded-full bg-purple-600 text-white">
            <User size={16} strokeWidth={1.5} />
          </div>
        )
      default:
        return (
          <div className="p-2 rounded-full bg-gray-600 text-white">
            <FileText size={16} strokeWidth={1.5} />
          </div>
        )
    }
  }

  return (
    <div className="flex items-start gap-3 py-2 px-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {getIcon()}
      <div className="flex-1">
        <div className="font-medium text-sm">
          {user} <span className="text-gray-500 dark:text-gray-400 font-normal">{action}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</div>
      </div>
    </div>
  )
}

export default ActivityItem
