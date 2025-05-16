const ClientLogo = () => {
  return (
    <div className="flex items-center">
      <div className="bg-white dark:bg-gray-800 rounded-md p-1.5 flex items-center justify-center">
        <span className="font-bold text-lg text-teal-700 dark:text-teal-400">CA</span>
      </div>
      <span className="ml-2 text-white font-semibold" style={{ fontSize: "1rem" }}>Sample CA Firm</span>
    </div>
  )
}

export default ClientLogo