-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('credit_card', 'debit_card', 'bank_account', 'insurance')),
  card_last_four TEXT,
  card_brand TEXT,
  card_expiry_month INTEGER,
  card_expiry_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  billing_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for payment methods
CREATE POLICY "Admins can view all payment methods"
ON public.payment_methods
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all payment methods"
ON public.payment_methods
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Patients can view their own payment methods"
ON public.payment_methods
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own payment methods"
ON public.payment_methods
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own payment methods"
ON public.payment_methods
FOR UPDATE
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own payment methods"
ON public.payment_methods
FOR DELETE
USING (auth.uid() = patient_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create payments table to track all payment transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('completed', 'pending', 'failed', 'refunded')),
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Admins can view all payments"
ON public.payments
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all payments"
ON public.payments
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Patients can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = patient_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();