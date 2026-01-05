
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface BillingRecord {
  id: string;
  date: string;
  description: string;
  totalAmount: number;
  insuranceCovered: number;
  amountPaid: number;
  status: string;
}

interface PaymentMethod {
  id: string;
  payment_type: string;
  card_last_four?: string;
  card_brand?: string;
  card_expiry_month?: number;
  card_expiry_year?: number;
  is_default: boolean;
}

interface BillingTabProps {
  billingHistory: BillingRecord[];
}

interface Profile {
  insurance_provider?: string;
  insurance_number?: string;
}

const BillingTab = ({ billingHistory }: BillingTabProps) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    payment_type: 'credit_card',
    card_last_four: '',
    card_brand: '',
    card_expiry_month: '',
    card_expiry_year: '',
    billing_address: ''
  });

  // Calculate dynamic billing stats
  const currentBalance = billingHistory.reduce((total, bill) => {
    if (bill.status.toLowerCase() !== 'paid') {
      return total + (bill.totalAmount - bill.insuranceCovered - bill.amountPaid);
    }
    return total;
  }, 0);

  const paidInvoices = billingHistory.filter(b => b.status.toLowerCase() === 'paid');
  const lastPaidInvoice = paidInvoices.length > 0 
    ? paidInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const totalPaid = billingHistory.reduce((sum, bill) => sum + bill.amountPaid, 0);
  const totalInsuranceCovered = billingHistory.reduce((sum, bill) => sum + bill.insuranceCovered, 0);
  
  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('insurance_provider, insurance_number')
      .eq('id', user.id)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };
  
  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('patient_id', user.id)
      .order('is_default', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentMethods(data || []);
  };
  
  const handleAddPaymentMethod = async () => {
    if (!user) return;
    
    if (!newPaymentMethod.card_last_four || !newPaymentMethod.card_brand) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await supabase
      .from('payment_methods')
      .insert([{
        patient_id: user.id,
        payment_type: newPaymentMethod.payment_type,
        card_last_four: newPaymentMethod.card_last_four,
        card_brand: newPaymentMethod.card_brand,
        card_expiry_month: parseInt(newPaymentMethod.card_expiry_month),
        card_expiry_year: parseInt(newPaymentMethod.card_expiry_year),
        billing_address: newPaymentMethod.billing_address,
        is_default: paymentMethods.length === 0
      }]);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Payment method added successfully"
    });
    
    setIsAddDialogOpen(false);
    setNewPaymentMethod({
      payment_type: 'credit_card',
      card_last_four: '',
      card_brand: '',
      card_expiry_month: '',
      card_expiry_year: '',
      billing_address: ''
    });
    fetchPaymentMethods();
  };
  
  const handleDeletePaymentMethod = async (id: string) => {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Payment method deleted successfully"
    });
    
    fetchPaymentMethods();
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Billing & Payments</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Insurance Info</Button>
          <Button>Make a Payment</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60">Current Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${currentBalance.toFixed(2)}
                </p>
              </div>
              <Separator className="bg-white/10" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Total Paid</span>
                  <span className="text-sm text-white/90">${totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Insurance Covered</span>
                  <span className="text-sm text-white/90">${totalInsuranceCovered.toFixed(2)}</span>
                </div>
                {lastPaidInvoice && (
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-sm text-white/70">Last Payment</span>
                    <div className="text-right">
                      <p className="text-sm text-white/90">${lastPaidInvoice.amountPaid.toFixed(2)}</p>
                      <p className="text-xs text-white/60">{formatDate(lastPaidInvoice.date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Insurance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.insurance_provider || profile?.insurance_number ? (
                <>
                  {profile.insurance_provider && (
                    <div>
                      <p className="text-sm text-white/60">Provider</p>
                      <p className="font-medium text-white">{profile.insurance_provider}</p>
                    </div>
                  )}
                  {profile.insurance_number && (
                    <div>
                      <p className="text-sm text-white/60">Member ID</p>
                      <p className="font-medium text-white">{profile.insurance_number}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white/60">Total Coverage Used</p>
                    <p className="font-medium text-white">${totalInsuranceCovered.toFixed(2)}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-white/60">No insurance information on file</p>
                  <Button 
                    variant="link" 
                    className="text-white/80 mt-2 p-0 h-auto"
                    onClick={() => toast({
                      title: "Update Profile",
                      description: "Add insurance info in Account Settings"
                    })}
                  >
                    Add Insurance Info
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-white/70" />
                    <div>
                      <p className="font-medium text-white">{method.card_brand} •••• {method.card_last_four}</p>
                      <p className="text-xs text-white/60">
                        Expires {method.card_expiry_month?.toString().padStart(2, '0')}/{method.card_expiry_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.is_default && <Badge variant="outline" className="text-white border-white/20">Default</Badge>}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-sm text-white/60 text-center py-4">No payment methods added yet</p>
              )}
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>Add a new payment method to your account</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Payment Type</Label>
                      <Select 
                        value={newPaymentMethod.payment_type}
                        onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, payment_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="bank_account">Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Card Brand</Label>
                      <Input
                        placeholder="Visa, Mastercard, etc."
                        value={newPaymentMethod.card_brand}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, card_brand: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last 4 Digits</Label>
                      <Input
                        placeholder="4242"
                        maxLength={4}
                        value={newPaymentMethod.card_last_four}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, card_last_four: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Month</Label>
                        <Input
                          type="number"
                          placeholder="MM"
                          min="1"
                          max="12"
                          value={newPaymentMethod.card_expiry_month}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, card_expiry_month: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Year</Label>
                        <Input
                          type="number"
                          placeholder="YYYY"
                          value={newPaymentMethod.card_expiry_year}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, card_expiry_year: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Billing Address</Label>
                      <Input
                        placeholder="123 Main St, City, State"
                        value={newPaymentMethod.billing_address}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, billing_address: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.length > 0 ? (
              billingHistory.map((bill) => (
                <div key={bill.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-white/60">Date</p>
                    <p className="font-medium text-white">{formatDate(bill.date)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-white/60">Description</p>
                    <p className="font-medium text-white">{bill.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Amount</p>
                    <div>
                      <p className="font-medium text-white">${(bill.totalAmount || 0).toFixed(2)}</p>
                      {bill.insuranceCovered > 0 && (
                        <p className="text-xs text-white/60">Insurance: ${bill.insuranceCovered.toFixed(2)}</p>
                      )}
                      <p className="text-xs text-white/60">You paid: ${bill.amountPaid.toFixed(2)}</p>
                      {(bill.totalAmount - bill.insuranceCovered - bill.amountPaid) > 0 && (
                        <p className="text-xs text-red-400">Due: ${(bill.totalAmount - bill.insuranceCovered - bill.amountPaid).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start md:justify-end">
                    <Badge 
                      variant={bill.status.toLowerCase() === "paid" ? "outline" : "destructive"} 
                      className="text-white border-white/20"
                    >
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No billing history available</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">View All Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingTab;
