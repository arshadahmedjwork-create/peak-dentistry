
export const upcomingAppointments = [
  {
    id: 1,
    type: "Dental Cleaning & Check-up",
    date: "2025-04-15",
    time: "10:30 AM",
    dentist: "Dr. Sarah Johnson",
    notes: "Regular 6-month cleaning and examination"
  },
  {
    id: 2,
    type: "Filling Replacement",
    date: "2025-05-02",
    time: "2:00 PM",
    dentist: "Dr. Michael Chen",
    notes: "Replace old amalgam filling with composite"
  }
];

export const treatmentHistory = [
  {
    id: 1,
    date: "2024-10-20",
    procedure: "Dental Cleaning & X-rays",
    dentist: "Dr. Sarah Johnson",
    details: "Regular cleaning, full mouth X-rays, no cavities found"
  },
  {
    id: 2,
    date: "2024-04-12",
    procedure: "Dental Cleaning",
    dentist: "Dr. Sarah Johnson",
    details: "Regular cleaning, mild gingivitis noted on upper molars"
  },
  {
    id: 3,
    date: "2023-10-05",
    procedure: "Filling (Tooth #19)",
    dentist: "Dr. Michael Chen",
    details: "Composite filling on lower left molar due to moderate decay"
  },
  {
    id: 4,
    date: "2023-09-18",
    procedure: "Emergency Visit",
    dentist: "Dr. Emily Roberts",
    details: "Pain in lower right quadrant, diagnosed as infection, prescribed antibiotics"
  },
  {
    id: 5,
    date: "2023-07-30",
    procedure: "Root Canal (Tooth #30)",
    dentist: "Dr. Michael Chen",
    details: "Root canal treatment on lower right molar due to deep decay reaching the pulp"
  }
];

export const documents = [
  {
    id: 1,
    name: "2024 Full Mouth X-Rays",
    type: "X-ray",
    date: "2024-10-20",
    size: "8.2 MB"
  },
  {
    id: 2,
    name: "Treatment Plan - Invisalign",
    type: "PDF",
    date: "2024-10-20",
    size: "1.5 MB"
  },
  {
    id: 3,
    name: "Insurance Claim Form",
    type: "PDF",
    date: "2024-10-20",
    size: "420 KB"
  },
  {
    id: 4,
    name: "Receipt - Oct 2024 Visit",
    type: "PDF",
    date: "2024-10-20",
    size: "320 KB"
  }
];

export const billingHistory = [
  {
    id: 1,
    date: "2024-10-20",
    description: "Dental Cleaning & X-rays",
    totalAmount: 250,
    insuranceCovered: 200,
    amountPaid: 50,
    status: "Paid"
  },
  {
    id: 2,
    date: "2023-10-05",
    description: "Filling (Tooth #19)",
    totalAmount: 180,
    insuranceCovered: 126,
    amountPaid: 54,
    status: "Paid"
  },
  {
    id: 3,
    date: "2023-07-30",
    description: "Root Canal (Tooth #30)",
    totalAmount: 1200,
    insuranceCovered: 840,
    amountPaid: 360,
    status: "Paid"
  }
];

export const notificationPreferences = [
  { id: "appointment_reminder", label: "Appointment Reminders", description: "Get notified about upcoming appointments", checked: true },
  { id: "appointment_change", label: "Appointment Changes", description: "Get notified when appointments are rescheduled or canceled", checked: true },
  { id: "treatment_reminders", label: "Treatment Reminders", description: "Reminders for follow-up treatments and care", checked: true },
  { id: "billing_updates", label: "Billing Updates", description: "Get notified about bills and payments", checked: true },
  { id: "promotions", label: "Special Offers", description: "Receive information about special offers and promotions", checked: false }
];
