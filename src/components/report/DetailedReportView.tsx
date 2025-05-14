
"use client";

import * as React from "react"; // Added this line
import type { DailyReport } from "@/types";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DetailedReportViewProps {
  report: DailyReport;
  onDownloadPdf: () => void;
  onDownloadExcel: () => void;
}

// Helper function to parse weather string (basic example)
const parseWeatherMain = (weatherString: string) => {
  if (!weatherString) return { condition: "N/A", temp: "N/A" };
  const parts = weatherString.split(",");
  return {
    condition: parts[0]?.trim() || "N/A",
    temp: parts[1]?.trim() || "N/A",
  };
};

export function DetailedReportView({ report, onDownloadPdf, onDownloadExcel }: DetailedReportViewProps) {
  const reportDate = report.date ? parseISO(report.date) : new Date();
  const submissionTimestamp = report.timestamp ? parseISO(report.timestamp) : new Date();

  // Placeholder data for sections not fully covered by DailyReport type
  const weatherReportData = {
    tempLow: "73°F", tempHigh: "85°F", tempAvg: "78°F",
    precipMidnight: "0.10 in.", precip2Days: "0.10 in.", precip3Days: "0.12 in.",
    humidityLow: "60%", humidityAvg: "79%", humidityHigh: "92%",
    dewAvg: "71°F",
    windAvg: "6.6 mph", windMax: "10 mph", windGust: "21 mph",
  };

  const dailySnapshotData = [
    { time: "06:00 AM", condition: "Partly Cloudy", temp: "76°F" },
    { time: "09:00 AM", condition: "Cloudy", temp: "77°F" },
    { time: "12:00 PM", condition: "Cloudy", temp: "78°F" },
    { time: "03:00 PM", condition: "Rain", temp: "83°F" },
    { time: "06:00 PM", condition: "No Description", temp: "82°F" },
    { time: "09:00 PM", condition: "No Description", temp: "77°F" },
  ];

  const observedWeatherData = [
    { no: 1, timeObserved: "10:15:00 AM", weatherDelay: "No", sky: "Cloudy", temp: "75°F", average: "75°F", precipitation: "0.05 in", wind: "5 mph", groundSea: "Dry", calamity: "None", comments: "Brief shower observed." },
  ];

  const manpowerLogData = [
    { no: 1, contact: "SSS Construction Reports", workers: 8, hours: 8.0, totalHours: 64.0, location: "HERNDON PARKWAY & SPRING ST", comments: "PM, SUP, FOR, OPR, FLG, LAB", createdBy: report.foremanName || "N/A" },
    { no: 2, contact: "PESSOA CONSTRUCTION CO., INC.", workers: 0, hours: 8.0, totalHours: 0.0, location: "Herndon Parkway", comments: "FOR, OPR, LAB", createdBy: report.foremanName || "N/A" },
    { no: 3, contact: "S&S PARTNERS, LLC", workers: 6, hours: 8.0, totalHours: 48.0, location: "Herndon Parkway", comments: "FOR, OPR, LAB", createdBy: report.foremanName || "N/A" },
    { no: 4, contact: "JENSPY, INC.", workers: 0, hours: 8.0, totalHours: 0.0, location: "HERNDON PARKWAY & SPRING ST", comments: "FOR, OPR, LAB", createdBy: report.foremanName || "N/A" },
  ];
  const totalWorkers = manpowerLogData.reduce((sum, entry) => sum + entry.workers, 0);
  const totalManHours = manpowerLogData.reduce((sum, entry) => sum + entry.totalHours, 0);


  return (
    <div id="report-content" className="p-4 md:p-8 bg-white text-black text-sm font-sans max-w-4xl mx-auto shadow-lg print:shadow-none">
      {/* Report Header */}
      <header className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Image src="https://placehold.co/120x50.png?text=SSS" alt="Company Logo" width={120} height={50} data-ai-hint="company logo" className="mr-4"/>
          <div>
            <h1 className="font-bold text-base">SSS Construction Reports</h1>
            <p className="text-xs">222 Main St.</p>
            <p className="text-xs">My Good City, My State, 11011</p>
            <p className="text-xs">P: +12026369535</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xs">Project: {report.projectId} - H35 Smart Scale - East Spring Street Widening</p>
          <p className="text-xs">208 Elden Street, Suite 205</p>
          <p className="text-xs">Herndon, Virginia 20170</p>
        </div>
      </header>

      <div className="text-center my-6">
        <h2 className="text-xl font-bold">Daily Log: {format(reportDate, "EEEE M/d/yyyy")}</h2>
      </div>

      {/* Status Bar */}
      <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-md flex items-center gap-3 mb-6">
        <CheckCircle className="h-6 w-6" />
        <div>
          <p className="font-semibold">Daily Log Completed</p>
          <p className="text-xs">The Daily Log was completed by {report.foremanName || report.digitalSignature} on {format(submissionTimestamp, "EEE, MMM d, yyyy 'at' h:mm a zzz")}.</p>
        </div>
      </div>
      
      {/* Action Buttons - Placed outside the printable area if desired, or can be part of it */}
      <div className="my-4 flex gap-2 print:hidden">
          <Button onClick={onDownloadPdf} variant="outline"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
          <Button onClick={onDownloadExcel} variant="outline"><Download className="mr-2 h-4 w-4" />Download Excel</Button>
      </div>

      {/* Weather Report Section */}
      <section className="mb-6">
        <h3 className="font-bold text-base mb-2 py-1 border-b border-gray-300">WEATHER REPORT</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th colSpan={3} className="p-1 border border-gray-300 font-semibold">Temperature</th>
              <th colSpan={3} className="p-1 border border-gray-300 font-semibold">Precipitation Since</th>
              <th colSpan={3} className="p-1 border border-gray-300 font-semibold">Humidity</th>
              <th className="p-1 border border-gray-300 font-semibold">Dew</th>
              <th colSpan={3} className="p-1 border border-gray-300 font-semibold">Windspeed</th>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-1 border border-gray-300 text-center">Low</td>
              <td className="p-1 border border-gray-300 text-center">High</td>
              <td className="p-1 border border-gray-300 text-center">Avg</td>
              <td className="p-1 border border-gray-300 text-center">Midnight</td>
              <td className="p-1 border border-gray-300 text-center">2 Days Ago</td>
              <td className="p-1 border border-gray-300 text-center">3 Days Ago</td>
              <td className="p-1 border border-gray-300 text-center">Low</td>
              <td className="p-1 border border-gray-300 text-center">Avg</td>
              <td className="p-1 border border-gray-300 text-center">High</td>
              <td className="p-1 border border-gray-300 text-center">Avg</td>
              <td className="p-1 border border-gray-300 text-center">Avg</td>
              <td className="p-1 border border-gray-300 text-center">Max</td>
              <td className="p-1 border border-gray-300 text-center">Gust</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.tempLow}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.tempHigh}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.tempAvg}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.precipMidnight}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.precip2Days}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.precip3Days}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.humidityLow}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.humidityAvg}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.humidityHigh}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.dewAvg}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.windAvg}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.windMax}</td>
              <td className="p-1 border border-gray-300 text-center">{weatherReportData.windGust}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs mt-1">Weather Source: {report.weather} (Field Observation)</p>
      </section>

      {/* Daily Snapshot Section */}
      <section className="mb-6">
        <h3 className="font-bold text-base mb-2 py-1 border-b border-gray-300">DAILY SNAPSHOT</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {dailySnapshotData.map(snapshot => (
            <div key={snapshot.time} className="p-2 border border-gray-200 rounded bg-gray-50 text-center">
              <p className="font-semibold">{snapshot.time}</p>
              <p>{snapshot.condition}</p>
              <p>{snapshot.temp}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Observed Weather Conditions Section */}
      <section className="mb-6">
        <h3 className="font-bold text-base mb-2 py-1 border-b border-gray-300">OBSERVED WEATHER CONDITIONS</h3>
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              {["No.", "Time Observed", "Weather Delay", "Sky", "Temp", "Average", "Precipitation", "Wind", "Ground/Sea", "Calamity"].map(header => (
                <th key={header} className="p-1 border border-gray-300 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {observedWeatherData.map(obs => (
              <React.Fragment key={obs.no}>
                <tr>
                  <td className="p-1 border border-gray-300 text-center">{obs.no}</td>
                  <td className="p-1 border border-gray-300 text-center">{obs.timeObserved}</td>
                  <td className="p-1 border border-gray-300 text-center">{obs.weatherDelay}</td>
                  <td className="p-1 border border-gray-300">{obs.sky}</td>
                  <td className="p-1 border border-gray-300 text-center">{obs.temp}</td>
                  <td className="p-1 border border-gray-300 text-center">{obs.average}</td>
                  <td className="p-1 border border-gray-300 text-center">{obs.precipitation}</td>
                  <td className="p-1 border border-gray-300 text-center">{obs.wind}</td>
                  <td className="p-1 border border-gray-300">{obs.groundSea}</td>
                  <td className="p-1 border border-gray-300">{obs.calamity}</td>
                </tr>
                <tr>
                  <td colSpan={10} className="p-1 border border-gray-300 text-left">
                    <span className="font-semibold">Comments:</span> {obs.comments || "N/A"}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {/* Manpower Log Section */}
      <section className="mb-6">
        <div className="flex justify-between items-baseline py-1 border-b border-gray-300 mb-2">
            <h3 className="font-bold text-base">MANPOWER LOG</h3>
            <p className="text-xs font-semibold">{totalWorkers} Workers | {totalManHours.toFixed(1)} Total Hours</p>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              {["No.", "Contact/Company", "Workers", "# Hours", "Total Hours", "Location"].map(header => (
                <th key={header} className="p-1 border border-gray-300 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {manpowerLogData.map(entry => (
              <React.Fragment key={entry.no}>
                <tr>
                  <td className="p-1 border border-gray-300 text-center">{entry.no}</td>
                  <td className="p-1 border border-gray-300">{entry.contact}</td>
                  <td className="p-1 border border-gray-300 text-center">{entry.workers}</td>
                  <td className="p-1 border border-gray-300 text-center">{entry.hours.toFixed(1)}</td>
                  <td className="p-1 border border-gray-300 text-center">{entry.totalHours.toFixed(1)}</td>
                  <td className="p-1 border border-gray-300">{entry.location}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-1 border-l border-r border-gray-300 ">
                    <span className="font-semibold">Comments:</span> {entry.comments}
                  </td>
                  <td colSpan={4} className="p-1 border-l border-r border-b border-gray-300 text-right">
                    <span className="font-semibold">Created By:</span> {entry.createdBy}
                  </td>
                </tr>
                 <tr><td colSpan={6} className="p-0 h-1 border-b border-gray-300"></td></tr>
              </React.Fragment>
            ))}
             <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="p-1 border border-gray-300 text-right">Total:</td>
                <td className="p-1 border border-gray-300 text-center">{totalWorkers}</td>
                <td className="p-1 border border-gray-300 text-center"></td>
                <td className="p-1 border border-gray-300 text-center">{totalManHours.toFixed(1)}</td>
                <td className="p-1 border border-gray-300"></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs mt-1">Manpower details (original): {report.manpower}</p>
      </section>
      
      {/* Photo Section (if exists) */}
      {report.photoDataUri && (
        <section className="mb-6 print-break-inside-avoid">
          <h3 className="font-bold text-base mb-2 py-1 border-b border-gray-300">ATTACHED PHOTO</h3>
          <div className="mt-2 border border-gray-300 p-2 inline-block">
            <Image 
              src={report.photoDataUri} 
              alt={report.photoFileName || "Site photo"} 
              width={600} 
              height={400}
              className="max-w-full h-auto"
              data-ai-hint="site infrastructure"
            />
          </div>
          {report.photoFileName && <p className="text-xs text-gray-600 mt-1">{report.photoFileName}</p>}
        </section>
      )}

      {/* Other Report Data (Progress, Risks - adapt as needed) */}
      <section className="mb-6">
        <h3 className="font-bold text-base mb-2 py-1 border-b border-gray-300">ADDITIONAL DETAILS</h3>
        <div className="text-xs space-y-2">
            <div><span className="font-semibold">Progress Updates:</span> <pre className="whitespace-pre-wrap font-sans">{report.progressUpdates || "N/A"}</pre></div>
            <div><span className="font-semibold">Risks/Issues:</span> <pre className="whitespace-pre-wrap font-sans">{report.risksIssues || "N/A"}</pre></div>
            {report.equipmentHours && <div><span className="font-semibold">Equipment Hours:</span> <pre className="whitespace-pre-wrap font-sans">{report.equipmentHours}</pre></div>}
            {report.materialsUsed && <div><span className="font-semibold">Materials Used:</span> <pre className="whitespace-pre-wrap font-sans">{report.materialsUsed}</pre></div>}
        </div>
      </section>


      {/* Report Footer */}
      <Separator className="my-6 print:hidden"/>
      <footer className="flex justify-between items-center text-xs pt-4 border-t border-gray-300 mt-auto">
        <p>SSS Construction Reports</p>
        <p>Page 1 of 1 (Pagination TBD)</p>
        <p>Printed On: {format(new Date(), "MMM d, yyyy 'at' h:mm a zzz")}</p>
      </footer>

       <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none; }
          .print\\:shadow-none { box-shadow: none; }
          .print-break-inside-avoid { break-inside: avoid; }
          /* Add any other print specific styles here */
          #report-content { margin: 0; padding: 0.5in; border: none; box-shadow: none; font-size: 10pt; }
          table { font-size: 9pt; }
          th, td { padding: 2px 4px !important; }
          h1,h2,h3 { margin-bottom: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
}

