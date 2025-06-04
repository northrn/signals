import AuthButton from './AuthButton'

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="w-full px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Signals
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
} 