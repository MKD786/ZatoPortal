// import { useSelector } from "react-redux"
// import type { RootState } from "../../store"

const Logo = () => {
  // const { theme } = useSelector((state: RootState) => state.theme)

  return (
    <div className="flex items-center">
      <div className="bg-white dark:bg-gray-800 rounded-md p-1.5 flex items-center justify-center">
        <span className="font-bold text-lg text-teal-700 dark:text-teal-400">ZA</span>
      </div>
      <span className="ml-2 text-white font-semibold text-lg">Zato</span>
    </div>
  )
}

export default Logo
