import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WeeklyData } from './excelParser';

type KPIData = ReturnType<typeof import('./excelParser').calculateKPIs>;

export const exportToPDF = (data: WeeklyData[], kpis: KPIData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('GRIDCo Performance Dashboard', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 25, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  let yPos = 45;
  
  // KPI Summary Section
  if (kpis) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Key Performance Indicators', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
  autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: [
        ['Peak Demand', `${kpis.peakDemand.value.toFixed(2)} MW`],
        ['Total Generation', `${kpis.totalGeneration.value.toFixed(2)} GWh`],
        ['Grid Stability', `${kpis.gridStability.value.toFixed(2)}%`],
        ['System Availability', `${kpis.systemAvailability.value.toFixed(2)}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Latest Week Summary
  if (data.length > 0) {
    const latestWeek = data[data.length - 1];
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Latest Week Summary', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    autoTable(doc, {
      startY: yPos,
      head: [['Period', 'Metric', 'Value']],
      body: [
        [latestWeek.date, 'Total Energy Generated', `${latestWeek.totalEnergyGenerated.toFixed(2)} GWh`],
        [latestWeek.date, 'Max Ghana Demand', `${latestWeek.maxGhanaDemand.toFixed(2)} MW`],
        [latestWeek.date, 'Max Domestic Demand', `${latestWeek.maxDomesticDemand.toFixed(2)} MW`],
        [latestWeek.date, 'Average Demand', `${latestWeek.averageDemand.toFixed(2)} MW`],
        [latestWeek.date, 'Load Factor', `${latestWeek.loadFactor.toFixed(2)}%`],
        [latestWeek.date, 'Frequency Within Range', `${latestWeek.frequencyWithinRange.toFixed(2)}%`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Transmission Availability (Latest Week)
  if (data.length > 0) {
    const latestWeek = data[data.length - 1];
    
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Transmission Line Availability', 14, yPos);
    yPos += 10;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Voltage Level', 'Availability (%)']],
      body: [
        ['69 kV', latestWeek.availability69KV.toFixed(2)],
        ['161 kV', latestWeek.availability161KV.toFixed(2)],
        ['225 kV', latestWeek.availability225KV.toFixed(2)],
        ['330 kV', latestWeek.availability330KV.toFixed(2)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Historical Data Table
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Historical Weekly Data', 14, yPos);
  yPos += 10;
  
  const historicalData = data.slice(-10).map(week => [
    week.date,
    week.totalEnergyGenerated.toFixed(2),
    week.maxGhanaDemand.toFixed(2),
    week.loadFactor.toFixed(2),
    week.frequencyWithinRange.toFixed(2),
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Week', 'Generation (GWh)', 'Peak Demand (MW)', 'Load Factor (%)', 'Freq. In Range (%)']],
    body: historicalData,
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] },
    styles: { fontSize: 8 },
  });
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      '© 2025 PURC - ESPM Analytics Portal',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `GRIDCo_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
