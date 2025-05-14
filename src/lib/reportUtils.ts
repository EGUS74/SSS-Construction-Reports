
"use client";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import type { DailyReport } from '@/types';
import { format, parseISO } from 'date-fns';

export const handleDownloadPdf = async (reportId?: string) => {
  const reportContentElement = document.getElementById('report-content');
  if (!reportContentElement) {
    console.error("Report content element not found for PDF generation.");
    alert("Could not generate PDF: Content area not found.");
    return;
  }
  
  alert("Generating PDF... This might take a moment. Please ensure pop-ups are allowed if the download doesn't start automatically.");

  try {
    // Temporarily adjust styles for printing if necessary, e.g. ensuring all content is visible
    // const originalWidth = reportContentElement.style.width;
    // reportContentElement.style.width = '1024px'; // Example: Set a fixed width for canvas capture

    const canvas = await html2canvas(reportContentElement, {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // If you have external images
      logging: true,
      // windowWidth: reportContentElement.scrollWidth, // Attempt to capture full width
      // windowHeight: reportContentElement.scrollHeight, // Attempt to capture full height
    });

    // reportContentElement.style.width = originalWidth; // Revert style changes

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt', // points
      format: 'a4', // or letter, etc.
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0; // Start at top, or add margin

    // Calculate how many pages are needed
    const pageHeightPt = pdf.internal.pageSize.getHeight();
    let currentImgHeight = 0;
    let pageCount = 0;

    while(currentImgHeight < imgHeight) {
        pageCount++;
        if(pageCount > 1) {
            pdf.addPage();
        }
        // sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight
        // For html2canvas, the source (sX, sY, etc.) are relative to the canvas itself
        // The y-coordinate on the source canvas for this page
        const sourceY = currentImgHeight; 
        // The height of the segment to draw from the source canvas
        const sourceSegmentHeight = Math.min(imgHeight - currentImgHeight, pageHeightPt / ratio);

        pdf.addImage(
          imgData, 
          'PNG', 
          imgX, 
          imgY, 
          imgWidth * ratio, // scaled width of the image on PDF
          imgHeight * ratio, // scaled total height of the image on PDF
          undefined, // alias for compression
          'FAST', // compression
          0, // rotation
          sourceY, // y-coordinate on source (canvas)
          sourceSegmentHeight // height of source segment to draw
        );
        currentImgHeight += sourceSegmentHeight * (imgHeight / (imgHeight * ratio)); // This calculation is tricky
                                                                                // Effectively, advance by the height of the segment drawn on the PDF, converted back to canvas pixels
                                                                                // A simpler conceptual approach might be needed if this is buggy
                                                                                // For a simple single-page or image-per-page:
                                                                                // currentImgHeight += pageHeightPt / ratio;
    }


    pdf.save(`report-${reportId || 'current'}-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Check console for details.");
  }
};


export const handleDownloadExcel = (report: DailyReport) => {
  if (!report) {
    alert("No report data to export.");
    return;
  }
  
  alert("Generating Excel file...");

  const wb = XLSX.utils.book_new();

  // Sheet 1: Report Summary
  const summaryData = [
    ["Report ID", report.id],
    ["Project ID", report.projectId],
    ["Date", format(parseISO(report.date), "yyyy-MM-dd")],
    ["Foreman", report.foremanName || report.digitalSignature],
    ["GPS Location", report.gpsLocation],
    ["Weather", report.weather],
    ["Status", report.status],
    ["Submitted At", format(parseISO(report.timestamp), "yyyy-MM-dd HH:mm:ss")],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Sheet 2: Details
  const detailsData = [
    { Section: "Manpower", Details: report.manpower },
    { Section: "Equipment Hours", Details: report.equipmentHours },
    { Section: "Materials Used", Details: report.materialsUsed },
    { Section: "Progress Updates", Details: report.progressUpdates },
    { Section: "Risks & Issues", Details: report.risksIssues },
  ];
  if (report.pmComments) {
    detailsData.push({ Section: "PM Comments", Details: report.pmComments });
  }
  const wsDetails = XLSX.utils.json_to_sheet(detailsData);
  XLSX.utils.book_append_sheet(wb, wsDetails, "Details");
  
  // Placeholder for actual log data (manpower log, weather observations if structured)
  // For example, if manpowerLogData from DetailedReportView was available here:
  // const manpowerLogDataForExcel = manpowerLogData.map(entry => ({
  //   Company: entry.contact,
  //   Workers: entry.workers,
  //   Hours: entry.hours,
  //   "Total Hours": entry.totalHours,
  //   Location: entry.location,
  //   Comments: entry.comments,
  //   "Created By": entry.createdBy
  // }));
  // const wsManpower = XLSX.utils.json_to_sheet(manpowerLogDataForExcel);
  // XLSX.utils.book_append_sheet(wb, wsManpower, "Manpower Log");


  XLSX.writeFile(wb, `report-${report.id}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

