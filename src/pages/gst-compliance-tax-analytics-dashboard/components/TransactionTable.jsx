import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const transactions = [
    {
      id: 'INV-2024-001',
      date: '2024-08-10',
      vendor: 'Tech Solutions Pvt Ltd',
      gstin: '29ABCDE1234F1Z5',
      amount: 125000,
      gstRate: 18,
      gstAmount: 22500,
      hsnCode: '998314',
      status: 'verified',
      type: 'purchase',
      invoiceNo: 'TS-2024-456'
    },
    {
      id: 'INV-2024-002',
      date: '2024-08-09',
      vendor: 'Office Supplies Co',
      gstin: '27FGHIJ5678K2L6',
      amount: 45000,
      gstRate: 12,
      gstAmount: 5400,
      hsnCode: '482390',
      status: 'pending',
      type: 'purchase',
      invoiceNo: 'OS-2024-789'
    },
    {
      id: 'INV-2024-003',
      date: '2024-08-08',
      vendor: 'Marketing Agency Ltd',
      gstin: '19MNOPQ9012R3S4',
      amount: 85000,
      gstRate: 18,
      gstAmount: 15300,
      hsnCode: '998399',
      status: 'verified',
      type: 'service',
      invoiceNo: 'MA-2024-123'
    },
    {
      id: 'INV-2024-004',
      date: '2024-08-07',
      vendor: 'Raw Materials Supplier',
      gstin: '33TUVWX3456Y7Z8',
      amount: 200000,
      gstRate: 5,
      gstAmount: 10000,
      hsnCode: '270900',
      status: 'error',
      type: 'purchase',
      invoiceNo: 'RMS-2024-567'
    },
    {
      id: 'INV-2024-005',
      date: '2024-08-06',
      vendor: 'Consulting Services Inc',
      gstin: '07ABCDE7890F1G2',
      amount: 150000,
      gstRate: 18,
      gstAmount: 27000,
      hsnCode: '998311',
      status: 'verified',
      type: 'service',
      invoiceNo: 'CS-2024-890'
    },
    {
      id: 'INV-2024-006',
      date: '2024-08-05',
      vendor: 'Equipment Rental Co',
      gstin: '12HIJKL4567M8N9',
      amount: 75000,
      gstRate: 28,
      gstAmount: 21000,
      hsnCode: '843149',
      status: 'pending',
      type: 'rental',
      invoiceNo: 'ER-2024-234'
    },
    {
      id: 'INV-2024-007',
      date: '2024-08-04',
      vendor: 'Software Licensing Ltd',
      gstin: '24OPQRS8901T2U3',
      amount: 300000,
      gstRate: 18,
      gstAmount: 54000,
      hsnCode: '852351',
      status: 'verified',
      type: 'software',
      invoiceNo: 'SL-2024-678'
    },
    {
      id: 'INV-2024-008',
      date: '2024-08-03',
      vendor: 'Logistics Partner Pvt',
      gstin: '36VWXYZ5678A9B0',
      amount: 25000,
      gstRate: 5,
      gstAmount: 1250,
      hsnCode: '996511',
      status: 'verified',
      type: 'transport',
      invoiceNo: 'LP-2024-345'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending' },
    { value: 'error', label: 'Error' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      verified: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getTypeIcon = (type) => {
    const icons = {
      purchase: 'ShoppingCart',
      service: 'Briefcase',
      rental: 'Home',
      software: 'Monitor',
      transport: 'Truck'
    };
    return icons?.[type] || 'FileText';
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction?.vendor?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.gstin?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.invoiceNo?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions?.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">GST Transaction Details</h3>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
            Export
          </Button>
          <Button variant="outline" size="sm" iconName="Filter" iconSize={16}>
            Advanced Filter
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by vendor, GSTIN, or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Transaction</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor Details</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GST Details</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="border-b border-border hover:bg-muted/50 financial-transition">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon name={getTypeIcon(transaction?.type)} size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{transaction?.invoiceNo}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(transaction?.date)}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-sm text-foreground">{transaction?.vendor}</div>
                    <div className="text-xs text-muted-foreground">GSTIN: {transaction?.gstin}</div>
                    <div className="text-xs text-muted-foreground">HSN: {transaction?.hsnCode}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      ₹{transaction?.amount?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{transaction?.type}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-sm text-foreground">{transaction?.gstRate}% GST</div>
                    <div className="text-xs text-muted-foreground">
                      ₹{transaction?.gstAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction?.status)}`}>
                    {transaction?.status?.charAt(0)?.toUpperCase() + transaction?.status?.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="xs" iconName="Eye" iconSize={14}>
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="xs" iconName="Edit" iconSize={14}>
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="xs" iconName="Download" iconSize={14}>
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions?.length)} of {filteredTransactions?.length} transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            iconName="ChevronLeft"
            iconSize={16}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            iconName="ChevronRight"
            iconSize={16}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;