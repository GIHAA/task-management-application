
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CustomerService from '../api/cusService';

export const PdfGenerator = ( total: number ,  data : any) => {

  const name = "Customer Report";
  const pdf_title = "Customer Report";
  const pdf_email = "info@taskmanager.com";
  const pdf_phone = "+94 11 234 5678";
  const pdf_address = " No 221/B, Peradeniya Road, Kandy";

  const doc = new jsPDF("landscape", "px", "a4", false);
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const title = `${pdf_title}`;
  doc.setFont("helvetica");
  doc.setTextColor("#000000");

  doc.setFontSize(24);
  doc.text(title, 30, 30);
  doc.setFontSize(12);
  doc.setTextColor("#999999");
  doc.text(`Generated on ${date}`, 30, 40);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000000");
  doc.text("Task Manager", 30, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#999999");
  doc.text(`Tel: ${pdf_phone}`, 30, 80);
  doc.text(`Email: ${pdf_email}`, 30, 90);
  doc.text(`Address: ${pdf_address}`, 30, 100);
  doc.line(30, 110, 600, 110);

  doc.setTextColor("#000000");

  doc.setFontSize(20);
  doc.text(`Total number of clients : ${total}`, 30, 135);

  // Add table with data
  doc.setTextColor("#999999");
  doc.setFontSize(12);
  doc.setTextColor("#000000");

  (doc as any).autoTable({
    startY: 145,
    head: [["Id", "Name", "Email", "Phone Number", "Gender"]],
    body: data.map((request: any) => [
      request.id,
      request.firstName + " " + request.lastName,
      request.email,
      request.phoneNumber,
      request.gender,
    ]),
    theme: "grid",
  });
  
  doc.save(`${name}.pdf`);
};