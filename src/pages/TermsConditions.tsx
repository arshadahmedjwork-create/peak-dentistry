import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

const TermsConditions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Layout>
      <div className={`py-28 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-50'}`}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  By accessing and using PEAK Dentistry's services, website, and patient portal, you agree to be bound by 
                  these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. Appointment Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Scheduling:</strong></p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Appointments must be scheduled in advance through our patient portal, phone, or in person</li>
                  <li>Appointment requests are subject to availability and confirmation</li>
                  <li>We recommend scheduling routine checkups 6 months in advance</li>
                </ul>
                
                <p><strong>Cancellation & Rescheduling:</strong></p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Cancellations must be made at least 24 hours in advance</li>
                  <li>Late cancellations or no-shows may incur a fee</li>
                  <li>Repeated no-shows may result in appointment privileges being revoked</li>
                </ul>

                <p><strong>Late Arrivals:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Please arrive 10-15 minutes early for your appointment</li>
                  <li>Late arrivals may result in reduced treatment time or rescheduling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment is due at the time of service unless other arrangements have been made</li>
                  <li>We accept cash, credit cards, debit cards, and insurance</li>
                  <li>Patients are responsible for understanding their insurance coverage and benefits</li>
                  <li>Any amounts not covered by insurance are the patient's responsibility</li>
                  <li>Outstanding balances may be subject to collection procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Insurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We accept most major dental insurance plans. However:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Insurance is a contract between you and your insurance company</li>
                  <li>We will file claims on your behalf as a courtesy</li>
                  <li>You are ultimately responsible for payment of all services rendered</li>
                  <li>We recommend verifying your coverage before treatment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Treatment and Care</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Treatment Plans:</strong></p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>All treatment plans will be discussed and explained before proceeding</li>
                  <li>Costs will be estimated and communicated in advance</li>
                  <li>You have the right to accept or decline any proposed treatment</li>
                </ul>

                <p><strong>Medical History:</strong></p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>You must provide accurate and complete medical history</li>
                  <li>Notify us of any changes to your health status or medications</li>
                  <li>Failure to disclose relevant information may affect treatment outcomes</li>
                </ul>

                <p><strong>Follow-up Care:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Follow all post-treatment instructions provided</li>
                  <li>Attend all scheduled follow-up appointments</li>
                  <li>Contact us immediately if you experience complications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Patient Portal Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>When using our patient portal, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain the confidentiality of your login credentials</li>
                  <li>Not share your account with others</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Use the portal only for lawful purposes</li>
                  <li>Provide accurate and current information</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7. Privacy and Confidentiality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We are committed to protecting your privacy and maintaining the confidentiality of your medical 
                  information in accordance with HIPAA regulations. Please refer to our Privacy Policy for 
                  detailed information.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>8. Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  While we strive to provide the highest quality dental care:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All dental procedures carry inherent risks</li>
                  <li>Results may vary based on individual circumstances</li>
                  <li>We cannot guarantee specific outcomes</li>
                  <li>You will be informed of all risks before treatment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>9. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  All content on our website, including text, graphics, logos, and images, is the property of 
                  PEAK Dentistry and protected by copyright laws. You may not use, reproduce, or distribute 
                  any content without our written permission.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>10. Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We reserve the right to modify these Terms and Conditions at any time. Changes will be posted 
                  on our website with an updated "Last updated" date. Continued use of our services constitutes 
                  acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>PEAK Dentistry</strong></p>
                  <p>B38, Prithvi Avenue 2nd Street, Abiramapuram, Alwarpet, Chennai – 600018</p>
                  <p>Phone: +91 73 73 044 044</p>
                  <p>Email: contact@peak-dentistry.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditions;
