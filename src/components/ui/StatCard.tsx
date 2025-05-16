import { Users, FileText, AlertTriangle, Clock, Plus } from "lucide-react"
// import { useSelector } from "react-redux"
// import type { RootState } from "../../store"

interface StatCardProps {
  title: string
  value: number
  subtext: string
  color: "teal" | "purple" | "orange" | "pink"
  icon: "users" | "files" | "alert" | "clock" | "plus"
}

const StatCard = ({ title, value, subtext, color, icon }: StatCardProps) => {
  // const { theme } = useSelector((state: RootState) => state.theme)

  const getIcon = () => {
    switch (icon) {
      case "users":
        return <Users size={20} strokeWidth={1.5} />
      case "files":
        return <FileText size={20} strokeWidth={1.5} />
      case "alert":
        return <AlertTriangle size={20} strokeWidth={1.5} />
      case "clock":
        return <Clock size={20} strokeWidth={1.5} />
      case "plus":
        return <Plus size={20} strokeWidth={1.5} />
    }
  }

  const getColorClass = () => {
    switch (color) {
      case "teal":
        return "bg-teal-700 dark:bg-teal-800"
      case "purple":
        return "bg-purple-600 dark:bg-purple-700"
      case "orange":
        return "bg-orange-500 dark:bg-orange-600"
      case "pink":
        return "bg-pink-600 dark:bg-pink-700"
    }
  }

  return (
    <div className={`rounded-xl p-4 text-white ${getColorClass()} shadow-md`} style={{ minHeight: "110px" }}>
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium opacity-90">{title}</div>
        <div className="p-1.5 rounded-full bg-white bg-opacity-20">{getIcon()}</div>
      </div>
      <div className="text-2xl md:text-3xl font-bold mt-2">{value}</div>
      <div className="text-xs mt-1 opacity-80">{subtext}</div>
    </div>
  )
}

export default StatCard
