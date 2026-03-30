import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDate } from './utils'
import type { CurrencyCode } from '@/types'

interface ReportCategory {
  name: string
  icon: string
  budget: number
  spent: number
  currency: CurrencyCode
}

interface ReportData {
  familyName: string
  period: string
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  currency: CurrencyCode
  categories: ReportCategory[]
}

export function generateFamilyReport(data: ReportData): void {
  const doc = new jsPDF()

  // Header background
  doc.setFillColor(13, 15, 20)
  doc.rect(0, 0, 210, 40, 'F')

  // Logo text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(201, 168, 76) // gold
  doc.text('🏠 Nido', 14, 20)

  // Subtitle
  doc.setFontSize(10)
  doc.setTextColor(155, 163, 194)
  doc.text(`Reporte financiero familiar · ${data.familyName}`, 14, 30)
  doc.text(data.period, 14, 37)

  // KPI cards row
  doc.setFillColor(30, 34, 48)
  doc.roundedRect(14, 50, 55, 28, 3, 3, 'F')
  doc.roundedRect(77, 50, 55, 28, 3, 3, 'F')
  doc.roundedRect(140, 50, 56, 28, 3, 3, 'F')

  doc.setFontSize(8)
  doc.setTextColor(92, 100, 128)
  doc.text('INGRESOS', 20, 58)
  doc.text('GASTOS', 83, 58)
  doc.text('AHORROS', 146, 58)

  doc.setFontSize(13)
  doc.setTextColor(74, 222, 128) // green
  doc.text(formatCurrency(data.totalIncome, data.currency), 20, 70)
  doc.setTextColor(248, 113, 113) // red
  doc.text(formatCurrency(data.totalExpenses, data.currency), 83, 70)
  doc.setTextColor(201, 168, 76) // gold
  doc.text(formatCurrency(data.totalSavings, data.currency), 146, 70)

  // Table title
  doc.setFontSize(12)
  doc.setTextColor(232, 234, 242)
  doc.setFont('helvetica', 'bold')
  doc.text('Gastos por categoría', 14, 92)

  // Table
  autoTable(doc, {
    startY: 96,
    head: [['Categoría', 'Presupuesto', 'Gastado', 'Diferencia', '%']],
    body: data.categories.map(cat => {
      const diff = cat.budget - cat.spent
      const pct = cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0
      return [
        `${cat.icon} ${cat.name}`,
        formatCurrency(cat.budget, cat.currency),
        formatCurrency(cat.spent, cat.currency),
        formatCurrency(diff, cat.currency),
        `${pct}%`,
      ]
    }),
    headStyles: {
      fillColor: [30, 34, 48],
      textColor: [201, 168, 76],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fillColor: [22, 25, 33],
      textColor: [232, 234, 242],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [30, 34, 48],
    },
    columnStyles: {
      3: {
        cellCallback: (cell, opts) => {
          const val = parseFloat(String(cell.raw).replace(/[^0-9.-]/g, ''))
          cell.styles.textColor = val >= 0 ? [74, 222, 128] : [248, 113, 113]
        },
      },
    },
    margin: { left: 14, right: 14 },
    tableLineColor: [42, 48, 69],
    tableLineWidth: 0.1,
  })

  // Footer
  const pageCount = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(13, 15, 20)
    doc.rect(0, 285, 210, 12, 'F')
    doc.setFontSize(8)
    doc.setTextColor(92, 100, 128)
    doc.text(`Generado por Nido · ${formatDate(new Date())}`, 14, 292)
    doc.text(`Página ${i} de ${pageCount}`, 196, 292, { align: 'right' })
  }

  doc.save(`nido-reporte-${data.familyName.toLowerCase()}-${Date.now()}.pdf`)
}
