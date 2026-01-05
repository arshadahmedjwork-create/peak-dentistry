
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, UserX, KeyRound } from "lucide-react";

interface SecuritySectionProps {
  onDeleteAccount?: () => void;
}

const SecuritySection = ({ onDeleteAccount }: SecuritySectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium flex items-center">
        <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
        Account Security
      </h3>
      <div className="space-y-4 mt-4">
        <Button variant="outline" className="w-full justify-start">
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Two-Factor Authentication
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full justify-start mt-6">
              <UserX className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteAccount} className="bg-destructive text-destructive-foreground">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SecuritySection;
