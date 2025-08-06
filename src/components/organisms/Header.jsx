import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Creative Ad Analyzer
              </h1>
              <p className="text-xs text-gray-500">Powered by AdSense AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Sparkles" size={16} className="text-purple-500" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header