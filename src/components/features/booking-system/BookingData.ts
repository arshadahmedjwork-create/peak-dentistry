
// Sample data for the booking system

// Sample available time slots
export const timeSlots: Record<string, string[]> = {
  "2025-04-10": ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"],
  "2025-04-11": ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
  "2025-04-12": ["10:00 AM", "11:30 AM", "2:30 PM"],
  "2025-04-15": ["9:30 AM", "11:00 AM", "2:00 PM", "3:30 PM", "5:00 PM"],
  "2025-04-16": ["8:00 AM", "9:30 AM", "1:00 PM", "4:30 PM"],
};

// Sample services
export const services = [
  { id: "cleaning", name: "Dental Cleaning & Check-up", duration: "45 min", price: "$120" },
  { id: "whitening", name: "Teeth Whitening", duration: "60 min", price: "$300" },
  { id: "filling", name: "Dental Filling", duration: "30-60 min", price: "$150-$250" },
  { id: "rootcanal", name: "Root Canal Treatment", duration: "90 min", price: "$800-$1,200" },
  { id: "extraction", name: "Tooth Extraction", duration: "30-60 min", price: "$150-$350" },
  { id: "crown", name: "Dental Crown", duration: "60-90 min", price: "$800-$1,500" },
  { id: "veneer", name: "Porcelain Veneer", duration: "60 min", price: "$900-$2,500" },
  { id: "invisalign", name: "Invisalign Consultation", duration: "45 min", price: "$100" },
];

// Sample dentists
export const dentists = [
  { id: "dr-johnson", name: "Dr. Sarah Johnson", specialty: "General Dentistry", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVudGlzdHxlbnwwfHwwfHx8MA%3D%3D" },
  { id: "dr-chen", name: "Dr. Michael Chen", specialty: "Cosmetic Dentistry", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D" },
  { id: "dr-roberts", name: "Dr. Emily Roberts", specialty: "Periodontics", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D" },
  { id: "dr-wilson", name: "Dr. James Wilson", specialty: "Orthodontics", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG9jdG9yfGVufDB8fDB8fHww" },
];
