import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../services/api-request.service';

@Component({
  selector: 'app-transaction-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './transaction-ledger.component.html',
  styleUrls: ['./transaction-ledger.component.css']
})
export class TransactionLedgerComponent {
  transactions: any[] = [];
  currentPage: number = 1;
  limit: number = 10;
  totalTransactions: number = 0;
  totalPages: number = 0;
  limitOptions: number[] = [5, 10, 20, 50];
  isLoading: boolean = false;

  constructor(private apiRequestService: ApiRequestService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;

    const payload = { page: this.currentPage, limit: this.limit };

    this.apiRequestService.getTransactionLedger(payload).subscribe({
      next: (response) => {
        this.transactions = response.transactions || [];
        this.totalTransactions = response.pagination?.totalTransactions || 0;
        this.totalPages = response.pagination?.totalPages || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      }
    });
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  handleLimitChange(): void {
    this.currentPage = 1;
    this.loadTransactions();
  }


 downloadCreditNote(transactionId: string) {
  if (!transactionId) return;

  // 🔹 Find the selected transaction in the list
  const transaction = this.transactions.find(t => t._id === transactionId);

  // 🔹 Safely handle missing unique code
  const uniqueCode = transaction?.uniqueCode?.trim();
  const fileName = uniqueCode
    ? `CreditNote-${uniqueCode}.pdf`
    : `CreditNote.pdf`;

  this.apiRequestService.downloadTransactionLedgerPDF(transactionId).subscribe({
    next: (pdfBlob) => {
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);

      //Open Preview Tab
      const previewTab = window.open('', '_blank');
      if (!previewTab) {
        alert('Please allow popups for this site to preview PDF.');
        return;
      }

      // Simple Preview Page with one download button
      previewTab.document.write(`
        <html>
          <head>
            <title>Credit Note Preview</title>
            <style>
              body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: #f4f4f4;
              }
              .header {
                display: flex;
                justify-content: flex-end;
                background-color: #28a745;
                padding: 10px 20px;
              }
              .header button {
                background-color: #fff;
                color: #28a745;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                padding: 8px 14px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
              }
              .header button:hover {
                background-color: #d4edda;
              }
              iframe {
                width: 100%;
                height: 94vh;
                border: none;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <button id="downloadBtn">⬇ Download PDF</button>
            </div>
            <iframe src="${blobUrl}"></iframe>
            <script>
              document.getElementById('downloadBtn').addEventListener('click', function() {
                const a = document.createElement('a');
                a.href = '${blobUrl}';
                a.download = '${fileName}';
                a.click();
              });
            </script>
          </body>
        </html>
      `);

      previewTab.document.close();
    },
    error: (err) => {
      console.error('Failed to preview or download PDF:', err);
      alert('Error generating Credit Note PDF');
    }
  });
}



}
