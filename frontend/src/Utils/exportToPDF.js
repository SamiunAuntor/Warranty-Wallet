import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return [16, 185, 129]; // emerald-600
    case 'Expiring Soon':
      return [245, 158, 11]; // amber-600
    case 'Expired':
      return [239, 68, 68]; // rose-600
    default:
      return [100, 116, 139]; // slate-500
  }
};

export const exportProductsToPDF = (products, filters = {}) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont(undefined, 'bold');
  doc.text('WarrantyWallet - Products Report', 14, 15);
  
  // Subtitle with date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont(undefined, 'normal');
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated on: ${date}`, 14, 22);
  
  // Filters info
  let startY = 27;
  if (filters.searchQuery || filters.statusFilter !== 'all' || filters.emailSentFilter !== 'all') {
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600
    const activeFilters = [];
    if (filters.searchQuery) activeFilters.push(`Search: "${filters.searchQuery}"`);
    if (filters.statusFilter !== 'all') activeFilters.push(`Status: ${filters.statusFilter}`);
    if (filters.emailSentFilter !== 'all') {
      activeFilters.push(`Email: ${filters.emailSentFilter === 'sent' ? 'Sent' : 'Not Sent'}`);
    }
    doc.text(`Applied Filters: ${activeFilters.join(' | ')}`, 14, startY);
    startY += 5;
  }
  
  // Table data
  const tableData = products.map((product) => {
    const emailSent = Boolean(product.expiringSoonEmailSentAt);
    
    return [
      product.productName || "N/A",
      product.brand || "N/A",
      product.category || "N/A",
      formatDate(product.purchaseDate),
      product.warrantyDuration ? `${product.warrantyDuration} mo` : "N/A",
      product.warrantyType || "N/A",
      formatDate(product.expiryDate),
      product.status || "Unknown",
      emailSent ? "Sent" : "Not Sent",
      product.invoiceId ? "Available" : "None",
    ];
  });
  
  // Table columns (matching the table headers)
  const columns = [
    'Product Name',
    'Brand',
    'Category',
    'Purchase',
    'Warranty',
    'Type',
    'Expiry',
    'Status',
    'Email Sent',
    'Invoice',
  ];
  
  // Generate table with styling matching the UI
  // For jspdf-autotable v5.x, use autoTable as a function with doc as first parameter
  autoTable(doc, {
    head: [columns],
    body: tableData,
    startY: startY,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42], // slate-900 (matches table header)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'left',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85], // slate-700
      cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
      lineColor: [241, 245, 249], // slate-100
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50 (for hover effect)
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' }, // Product Name (bold in UI)
      1: { cellWidth: 28 }, // Brand
      2: { cellWidth: 28 }, // Category
      3: { cellWidth: 28 }, // Purchase
      4: { cellWidth: 22 }, // Warranty
      5: { cellWidth: 28, fontStyle: 'normal' }, // Type
      6: { cellWidth: 28, fontStyle: 'bold' }, // Expiry (semibold in UI)
      7: { cellWidth: 25 }, // Status
      8: { cellWidth: 22 }, // Email Sent
      9: { cellWidth: 22 }, // Invoice
    },
    styles: {
      lineColor: [226, 232, 240], // slate-200 (border color)
      lineWidth: 0.5,
      cellPadding: 2,
    },
    margin: { top: startY, left: 14, right: 14 },
    didParseCell: (data) => {
      // Style status column with colors
      if (data.column.index === 7 && data.row.index >= 0) {
        const status = data.cell.text[0];
        const color = getStatusColor(status);
        data.cell.styles.textColor = color;
        data.cell.styles.fontStyle = 'bold';
      }
      // Style email sent column
      if (data.column.index === 8 && data.row.index >= 0) {
        const emailStatus = data.cell.text[0];
        if (emailStatus === 'Sent') {
          data.cell.styles.textColor = [16, 185, 129]; // emerald-600
        } else {
          data.cell.styles.textColor = [148, 163, 184]; // slate-400
        }
      }
    },
  });
  
  // Footer with page numbers and product count
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont(undefined, 'normal');
    const footerText = `Page ${i} of ${pageCount} | Total Products: ${products.length} | WarrantyWallet`;
    doc.text(
      footerText,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save PDF with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `warrantywallet-products-${timestamp}.pdf`;
  doc.save(fileName);
};
