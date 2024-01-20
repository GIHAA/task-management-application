import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./image.png";
const doc = new jsPDF();

const exportPDF = (tableData) => {
  doc.addImage(logo, "PNG", 0, 0, 210, 60);
  doc.setFontSize(12);
  doc.text("Event Report", 15, 60);
  doc.text("Date: " + new Date().toLocaleString(), 15, 70);

  // It can parse html:
  // <table id="my-table"><!-- ... --></table>
  autoTable(doc, { html: "#my-table" });
  const data = tableData.map((item) => [item.name, item.price, item.Period]);
  // Or use javascript directly:
  autoTable(doc, {
    head: [["Event", "Date", "Status"]],
    body: data,
    styles: {
      cellWidth: "wrap",
    },
    startY: 80,
  });

  doc.save("Events.pdf");
};

const packagePDF = ({ tableData }) => {
  return (
    <div>
      {/* <Button
        color="primary"
        onClick={() => {
          exportPDF(tableData);
        }}
        variant="contained"
      >
        Export as PDF
      </Button> */}
      <button
        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
        onClick={() => {
          exportPDF(tableData);
        }}
      >
        Export as PDF
      </button>
    </div>
  );
};

export default packagePDF;
