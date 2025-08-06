import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

class PDFService {
  async generateAnalysisReport(analysisResult, imageData) {
    try {
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 20

      // Add header
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Creative Analysis Report', pageWidth / 2, yPosition, { align: 'center' })
      
      yPosition += 10
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const exportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      pdf.text(`Generated on: ${exportDate}`, pageWidth / 2, yPosition, { align: 'center' })
      
      yPosition += 15

      // Add analysis name/ID
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Analysis ID: ${analysisResult.Id}`, 20, yPosition)
      
      yPosition += 10
      pdf.text(`Analysis Date: ${new Date(analysisResult.analyzedAt).toLocaleDateString()}`, 20, yPosition)
      
      yPosition += 20

      // Add image if available
      if (imageData && imageData.url) {
        try {
          // Create image element and convert to canvas for PDF
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = imageData.url
          })

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Calculate dimensions to fit in PDF
          const maxWidth = 150
          const maxHeight = 100
          const imgRatio = img.width / img.height
          let imgWidth = maxWidth
          let imgHeight = maxWidth / imgRatio
          
          if (imgHeight > maxHeight) {
            imgHeight = maxHeight
            imgWidth = maxHeight * imgRatio
          }

          canvas.width = imgWidth * 2 // Higher resolution
          canvas.height = imgHeight * 2
          ctx.scale(2, 2)
          ctx.drawImage(img, 0, 0, imgWidth, imgHeight)

          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          pdf.addImage(imageDataUrl, 'JPEG', (pageWidth - imgWidth) / 2, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 20

        } catch (error) {
          console.warn('Failed to add image to PDF:', error)
          pdf.setFontSize(10)
          pdf.text('(Original image could not be included)', pageWidth / 2, yPosition, { align: 'center' })
          yPosition += 15
        }
      }

      // Overall Score Section
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Overall Performance', 20, yPosition)
      yPosition += 15

      // Score circle (simplified for PDF)
      pdf.setDrawColor(124, 58, 237) // Purple color
      pdf.setFillColor(124, 58, 237)
      pdf.circle(50, yPosition, 15, 'FD')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(analysisResult.overallScore.toString(), 50, yPosition + 5, { align: 'center' })
      
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Overall Creative Score', 75, yPosition + 2)
      
      yPosition += 35

      // Detailed Scores
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Detailed Analysis', 20, yPosition)
      yPosition += 15

      const scores = [
        { label: 'Visual Impact', value: analysisResult.visualImpact, desc: 'Eye-catching and memorable appeal' },
        { label: 'Message Clarity', value: analysisResult.messageClarity, desc: 'Clarity of advertising message' },
        { label: 'Brand Recognition', value: 85, desc: 'Brand element visibility and recognition' }
      ]

      scores.forEach(score => {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${score.label}: ${score.value}/100`, 20, yPosition)
        
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.text(score.desc, 25, yPosition + 5)
        
        yPosition += 15
      })

      yPosition += 10

      // Target Audience
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Target Audience', 20, yPosition)
      yPosition += 10

      analysisResult.targetAudience.forEach(audience => {
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`• ${audience}`, 25, yPosition)
        yPosition += 6
      })

      yPosition += 15

      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = 20
      }

      // Recommendations
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Optimization Recommendations', 20, yPosition)
      yPosition += 10

      analysisResult.suggestions.forEach((suggestion, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${index + 1}.`, 25, yPosition)
        
        pdf.setFont('helvetica', 'normal')
        // Split long text into multiple lines
        const lines = pdf.splitTextToSize(suggestion, pageWidth - 50)
        pdf.text(lines, 32, yPosition)
        yPosition += lines.length * 5 + 5
      })

      // Footer
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(128, 128, 128)
      pdf.text('Generated by AdSense AI Creative Analyzer', pageWidth / 2, pageHeight - 10, { align: 'center' })

      // Save the PDF
      const fileName = `creative-analysis-${analysisResult.Id}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Failed to generate PDF report')
    }
  }
}

export default new PDFService()