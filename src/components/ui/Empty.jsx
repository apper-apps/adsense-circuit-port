import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No Data Available", 
  description = "Get started by adding some content",
  actionText = "Get Started",
  onAction,
  icon = "FileImage",
  className = ""
}) => {
  return (
    <Card className={`border-gray-200 ${className}`}>
      <CardContent className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          {description}
        </p>
        
        {onAction && (
          <Button onClick={onAction}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Empty