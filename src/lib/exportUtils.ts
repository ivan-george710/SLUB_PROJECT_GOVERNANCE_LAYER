import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const downloadCSV = (data: any[], filename = 'export.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadImage = async (elementId: string, filename = 'chart.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const dataUrl = await toPng(element, { backgroundColor: '#1e293b', pixelRatio: 2 });
    const link = document.createElement("a");
    link.setAttribute("href", dataUrl);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error generating image:", error);
  }
};

export const downloadPDF = async (elementId: string, filename = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await toPng(element, { backgroundColor: '#0b1120', pixelRatio: 2 });
    
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
      pdf.save(filename);
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
