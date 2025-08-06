import analysisResultsData from "@/services/mockData/analysisResults.json"

class AnalysisService {
async analyzeImage(imageId, progressCallback = null) {
    const steps = [
      { message: "Analyzing visual elements...", duration: 500 },
      { message: "Processing copy and messaging...", duration: 800 },
      { message: "Evaluating brand recognition...", duration: 600 },
      { message: "Assessing target audience fit...", duration: 700 },
      { message: "Generating recommendations...", duration: 900 },
      { message: "Finalizing analysis...", duration: 400 }
    ]

    let totalProgress = 0
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)

    try {
      // Simulate step-by-step analysis with progress updates
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        
        if (progressCallback) {
          progressCallback({
            step: i,
            message: step.message,
            progress: Math.round((totalProgress / totalDuration) * 100)
          })
        }

        await new Promise(resolve => setTimeout(resolve, step.duration))
        totalProgress += step.duration
      }

      // Final progress update
      if (progressCallback) {
        progressCallback({
          step: steps.length - 1,
          message: "Analysis complete!",
          progress: 100
        })
      }

      // Generate a realistic analysis result
      const baseResult = analysisResultsData[Math.floor(Math.random() * analysisResultsData.length)]
      
      // Create a new result with some randomization
      const result = {
        ...baseResult,
        Id: Date.now(),
        imageId: imageId,
        overallScore: this.generateScore(70, 95),
        visualImpact: this.generateScore(65, 98),
        messageClarity: this.generateScore(70, 95),
        brandRecognition: this.generateScore(60, 95),
        targetAudience: this.getRandomTargetAudience(),
        suggestions: this.getRandomSuggestions(),
        analyzedAt: new Date().toISOString()
      }
      
      return result
    } catch (error) {
      throw new Error("Failed to analyze image")
    }
  }

  async saveAnalysis(analysisResult, imageData) {
    try {
      // Get existing saved analyses
      const existingAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]')
      
      // Create saved analysis with image data
      const savedAnalysis = {
        ...analysisResult,
        imageName: imageData.name,
        imageUrl: imageData.url,
        imageSize: imageData.size,
        imageType: imageData.type,
        savedAt: new Date().toISOString()
      }
      
      // Add to beginning of array (most recent first)
      existingAnalyses.unshift(savedAnalysis)
      
      // Limit to 50 most recent analyses
      const limitedAnalyses = existingAnalyses.slice(0, 50)
      
      // Save to localStorage
      localStorage.setItem('savedAnalyses', JSON.stringify(limitedAnalyses))
      
      return savedAnalysis
    } catch (error) {
      console.error('Failed to save analysis:', error)
      throw new Error("Failed to save analysis")
    }
  }

  async getAnalysisHistory() {
    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]')
      return savedAnalyses.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt))
    } catch (error) {
      console.error('Failed to load analysis history:', error)
      return []
    }
  }

  async deleteAnalysis(analysisId) {
    try {
      const existingAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]')
      const filteredAnalyses = existingAnalyses.filter(analysis => analysis.Id !== analysisId)
      localStorage.setItem('savedAnalyses', JSON.stringify(filteredAnalyses))
      return filteredAnalyses
    } catch (error) {
      console.error('Failed to delete analysis:', error)
      throw new Error("Failed to delete analysis")
    }
  }
  
  generateScore(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  getRandomTargetAudience() {
    const allAudiences = [
      "Young Adults (18-34)",
      "Tech Enthusiasts", 
      "Urban Professionals",
      "Social Media Users",
      "Business Professionals",
      "Decision Makers",
      "B2B Audience",
      "Enterprise Clients",
      "Millennials",
      "Eco-Conscious Consumers",
      "Lifestyle Enthusiasts",
      "Social Impact Oriented",
      "Gen Z Consumers",
      "Working Parents",
      "Health & Wellness Focused"
    ]
    
    // Return 3-5 random audiences
    const count = Math.floor(Math.random() * 3) + 3
    const shuffled = allAudiences.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
  getRandomSuggestions() {
    const allSuggestions = [
      "Consider increasing the contrast between your main text and background for better readability",
      "Your color palette effectively captures attention - maintain this vibrant approach in future creatives",
      "The call-to-action could be more prominent by increasing its size by 20-30%",
      "Adding a subtle shadow or glow effect to your brand logo would improve brand recognition",
      "Consider testing this creative with A/B variations focusing on different value propositions",
      "Enhance visual hierarchy by making the headline 25% larger",
      "Consider using a more dynamic background to increase visual interest",
      "Your messaging is clear and direct - excellent work on value proposition",
      "Try incorporating more brand colors to strengthen brand association",
      "Adding testimonials or social proof could boost credibility",
      "Outstanding visual composition - this creative should perform excellently",
      "Your brand elements are perfectly integrated and highly recognizable",
      "Consider creating variations of this high-performing creative for different platforms",
      "The emotional appeal is strong - maintain this approach in future campaigns",
      "Test different call-to-action wordings to optimize conversion rates",
      "Consider using more whitespace to improve visual breathing room",
      "Your typography choices are excellent and highly readable",
      "Try testing this creative across different device orientations",
      "The visual balance is well-executed between text and imagery",
      "Consider adding animated elements for social media versions"
    ]
    
    // Return 4-6 random suggestions
    const count = Math.floor(Math.random() * 3) + 4
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
}

export default new AnalysisService()