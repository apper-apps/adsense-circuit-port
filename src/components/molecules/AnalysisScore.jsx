import React from "react"
import ProgressRing from "@/components/molecules/ProgressRing"

const AnalysisScore = ({ title, score, description, color = "purple" }) => {
  const getColorClass = (color, type) => {
    const colors = {
      purple: {
        text: "text-purple-600",
        bg: "bg-purple-50"
      },
      green: {
        text: "text-green-600",
        bg: "bg-green-50"
      },
      blue: {
        text: "text-blue-600",
        bg: "bg-blue-50"
      },
      amber: {
        text: "text-amber-600",
        bg: "bg-amber-50"
      }
    }
    return colors[color]?.[type] || colors.purple[type]
  }

  return (
    <div className={`p-6 rounded-xl ${getColorClass(color, "bg")} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start space-x-4">
        <ProgressRing progress={score} size={60} strokeWidth={6} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          <div className="mt-2">
            <span className={`text-sm font-medium ${getColorClass(color, "text")}`}>
              Score: {score}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisScore