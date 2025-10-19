import jsPDF from 'jspdf'

export const generateBenefitSummary = (user: any, selections: any[], totalCost: number) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFillColor(165, 0, 52)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('Benefits Enrollment Summary', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Lincoln Financial Group', 105, 30, { align: 'center' })
  
  // User Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.text('Employee Information', 20, 55)
  doc.setFontSize(11)
  doc.text(`Name: ${user.name}`, 20, 65)
  doc.text(`Age: ${user.age}`, 20, 72)
  doc.text(`Salary: $${user.salary.toLocaleString()}`, 20, 79)
  doc.text(`Dependents: ${user.dependents}`, 20, 86)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 93)
  
  // Selected Benefits
  doc.setFontSize(14)
  doc.text('Selected Benefits', 20, 110)
  
  let yPos = 120
  if (selections.length === 0) {
    doc.setFontSize(11)
    doc.text('No benefits selected yet.', 20, yPos)
  } else {
    selections.forEach((selection, index) => {
      doc.setFillColor(247, 246, 245)
      doc.rect(20, yPos - 5, 170, 20, 'F')
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${selection.name}`, 25, yPos + 3)
      doc.setFontSize(10)
      doc.text(`$${selection.cost.toFixed(2)} per paycheck`, 25, yPos + 10)
      yPos += 25
    })
  }
  
  // Cost Summary
  yPos += 10
  doc.setFillColor(238, 217, 183)
  doc.rect(20, yPos, 170, 30, 'F')
  doc.setFontSize(14)
  doc.text('Cost Summary', 25, yPos + 10)
  doc.setFontSize(12)
  doc.text(`Per Paycheck: $${totalCost.toFixed(2)}`, 25, yPos + 20)
  doc.text(`Yearly Estimate: $${(totalCost * 26).toFixed(2)}`, 120, yPos + 20)
  
  // Footer
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text('This is a summary of your benefit selections. Please review carefully.', 105, 280, { align: 'center' })
  doc.text('For questions, contact HR at benefits@lincoln.com', 105, 285, { align: 'center' })
  
  // Save
  doc.save(`Benefits_Summary_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
}
