
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackUserInteraction, getUserId } from '@/utils/analytics';

export interface CustomerSupport {
  id: string;
  customerId: string;
  type: 'inquiry' | 'complaint' | 'feedback' | 'order_issue';
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate: string;
  lastActive: string;
  orders: string[]; // Order IDs
  supportHistory: CustomerSupport[];
  totalSpent: number;
  notes?: string;
  preferences?: Record<string, any>;
}

interface CRMContextType {
  customers: Customer[];
  currentCustomer: Customer | null;
  supportHistory: Record<string, CustomerSupport[]>;
  createCustomer: (customer: Omit<Customer, 'id' | 'joinedDate' | 'lastActive' | 'orders' | 'supportHistory' | 'totalSpent'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addSupportRecord: (supportRecord: Omit<CustomerSupport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupportRecord: (id: string, updates: Partial<CustomerSupport>) => void;
  getCustomerById: (id: string) => Customer | null;
  getSupportHistory: (customerId: string) => CustomerSupport[];
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}

interface CRMProviderProps {
  children: ReactNode;
}

export function CRMProvider({ children }: CRMProviderProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [supportHistory, setSupportHistory] = useState<Record<string, CustomerSupport[]>>({});
  
  // Get the current customer based on the user ID from analytics
  const currentUserId = getUserId();
  const currentCustomer = customers.find(c => c.id === currentUserId) || null;
  
  // Load customer data from localStorage on initial render
  useEffect(() => {
    const savedCustomers = localStorage.getItem('bcd_crm_customers');
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error("Failed to parse saved customers:", error);
        setCustomers([]);
      }
    }
    
    const savedSupportHistory = localStorage.getItem('bcd_crm_support_history');
    if (savedSupportHistory) {
      try {
        setSupportHistory(JSON.parse(savedSupportHistory));
      } catch (error) {
        console.error("Failed to parse saved support history:", error);
        setSupportHistory({});
      }
    }
  }, []);
  
  // Save customer data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bcd_crm_customers', JSON.stringify(customers));
  }, [customers]);
  
  useEffect(() => {
    localStorage.setItem('bcd_crm_support_history', JSON.stringify(supportHistory));
  }, [supportHistory]);

  const createCustomer = (customerData: Omit<Customer, 'id' | 'joinedDate' | 'lastActive' | 'orders' | 'supportHistory' | 'totalSpent'>) => {
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      ...customerData,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      orders: [],
      supportHistory: [],
      totalSpent: 0
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    
    // Track customer creation in analytics
    trackUserInteraction('customer_created', {
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      customerEmail: newCustomer.email
    });
    
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id ? { ...customer, ...updates, updatedAt: new Date().toISOString() } : customer
      )
    );
    
    // Track customer update in analytics
    trackUserInteraction('customer_updated', {
      customerId: id,
      updates: Object.keys(updates)
    });
  };
  
  const addSupportRecord = (record: Omit<CustomerSupport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRecord: CustomerSupport = {
      id: crypto.randomUUID(),
      ...record,
      createdAt: now,
      updatedAt: now
    };
    
    setSupportHistory(prev => {
      const customerRecords = prev[record.customerId] || [];
      return {
        ...prev,
        [record.customerId]: [...customerRecords, newRecord]
      };
    });
    
    // Update the customer's supportHistory array
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === record.customerId 
          ? { 
              ...customer, 
              supportHistory: [...customer.supportHistory, newRecord],
              lastActive: now
            } 
          : customer
      )
    );
    
    // Track support record creation in analytics
    trackUserInteraction('support_record_created', {
      customerId: record.customerId,
      supportRecordId: newRecord.id,
      type: record.type,
      status: record.status
    });
  };
  
  const updateSupportRecord = (id: string, updates: Partial<CustomerSupport>) => {
    // First, find which customer this support record belongs to
    let customerId = '';
    
    // Update in the supportHistory state
    setSupportHistory(prev => {
      const updatedHistory = { ...prev };
      
      // Find the customer that has this support record
      Object.keys(updatedHistory).forEach(cId => {
        const recordIndex = updatedHistory[cId].findIndex(r => r.id === id);
        if (recordIndex >= 0) {
          customerId = cId;
          updatedHistory[cId][recordIndex] = { 
            ...updatedHistory[cId][recordIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
      });
      
      return updatedHistory;
    });
    
    // Also update the record in the customer's supportHistory array
    if (customerId) {
      setCustomers(prev => 
        prev.map(customer => {
          if (customer.id === customerId) {
            const updatedSupportHistory = customer.supportHistory.map(record => 
              record.id === id 
                ? { ...record, ...updates, updatedAt: new Date().toISOString() } 
                : record
            );
            return { ...customer, supportHistory: updatedSupportHistory };
          }
          return customer;
        })
      );
      
      // Track support record update in analytics
      trackUserInteraction('support_record_updated', {
        supportRecordId: id,
        customerId,
        updates: Object.keys(updates)
      });
    }
  };
  
  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id) || null;
  };
  
  const getSupportHistory = (customerId: string) => {
    return supportHistory[customerId] || [];
  };

  const value = {
    customers,
    currentCustomer,
    supportHistory,
    createCustomer,
    updateCustomer,
    addSupportRecord,
    updateSupportRecord,
    getCustomerById,
    getSupportHistory
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}
