import { useDispatch, useSelector } from "react-redux"
import { Moon, Sun } from "lucide-react"
import { toggleTheme } from "../../features/theme/theme.slice"
import type { RootState } from "../../store"

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.theme)

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <div className="flex items-center gap-2">
      <div className="cursor-pointer" onClick={handleToggle}>
        {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />}
      </div>
    </div>
  )
}

export default ThemeToggle
