export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          created_at: string
          dentist_name: string
          id: string
          notes: string | null
          patient_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          created_at?: string
          dentist_name: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          created_at?: string
          dentist_name?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          patient_name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          service_type: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          patient_name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          service_type: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          patient_name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          service_type?: string
          status?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_type_detail: string | null
          file_size_bytes: number | null
          file_type: string | null
          file_url: string
          id: string
          patient_id: string
          upload_date: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_type_detail?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          patient_id: string
          upload_date?: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          document_type_detail?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          patient_id?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          title: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          title: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          title?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_paid: number | null
          created_at: string
          description: string
          doctor_id: string | null
          due_date: string | null
          id: string
          insurance_covered: number | null
          invoice_date: string
          invoice_number: string
          patient_id: string
          service_type: string
          status: Database["public"]["Enums"]["billing_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          description: string
          doctor_id?: string | null
          due_date?: string | null
          id?: string
          insurance_covered?: number | null
          invoice_date: string
          invoice_number: string
          patient_id: string
          service_type: string
          status?: Database["public"]["Enums"]["billing_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          description?: string
          doctor_id?: string | null
          due_date?: string | null
          id?: string
          insurance_covered?: number | null
          invoice_date?: string
          invoice_number?: string
          patient_id?: string
          service_type?: string
          status?: Database["public"]["Enums"]["billing_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          appointment_change: boolean | null
          appointment_reminder: boolean | null
          billing_updates: boolean | null
          created_at: string
          id: string
          promotions: boolean | null
          treatment_reminders: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_change?: boolean | null
          appointment_reminder?: boolean | null
          billing_updates?: boolean | null
          created_at?: string
          id?: string
          promotions?: boolean | null
          treatment_reminders?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_change?: boolean | null
          appointment_reminder?: boolean | null
          billing_updates?: boolean | null
          created_at?: string
          id?: string
          promotions?: boolean | null
          treatment_reminders?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          patient_id: string
          read_at: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          patient_id: string
          read_at?: string | null
          status?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          patient_id?: string
          read_at?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oral_health_metrics: {
        Row: {
          assessed_date: string
          cavity_risk: string
          created_at: string
          gum_health: string
          id: string
          notes: string | null
          patient_id: string
          plaque_level: string
          updated_at: string
        }
        Insert: {
          assessed_date?: string
          cavity_risk: string
          created_at?: string
          gum_health: string
          id?: string
          notes?: string | null
          patient_id: string
          plaque_level: string
          updated_at?: string
        }
        Update: {
          assessed_date?: string
          cavity_risk?: string
          created_at?: string
          gum_health?: string
          id?: string
          notes?: string | null
          patient_id?: string
          plaque_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          billing_address: string | null
          card_brand: string | null
          card_expiry_month: number | null
          card_expiry_year: number | null
          card_last_four: string | null
          created_at: string
          id: string
          is_default: boolean | null
          patient_id: string
          payment_type: string
          updated_at: string
        }
        Insert: {
          billing_address?: string | null
          card_brand?: string | null
          card_expiry_month?: number | null
          card_expiry_year?: number | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          patient_id: string
          payment_type: string
          updated_at?: string
        }
        Update: {
          billing_address?: string | null
          card_brand?: string | null
          card_expiry_month?: number | null
          card_expiry_year?: number | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          patient_id?: string
          payment_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          patient_id: string
          payment_date: string
          payment_method_id: string | null
          payment_status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          patient_id: string
          payment_date?: string
          payment_method_id?: string | null
          payment_status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          patient_id?: string
          payment_date?: string
          payment_method_id?: string | null
          payment_status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          first_name: string
          id: string
          insurance_number: string | null
          insurance_provider: string | null
          last_name: string
          phone: string | null
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          first_name: string
          id: string
          insurance_number?: string | null
          insurance_provider?: string | null
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          first_name?: string
          id?: string
          insurance_number?: string | null
          insurance_provider?: string | null
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      treatment_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      treatment_procedures: {
        Row: {
          aftercare: string | null
          benefits: string | null
          category_id: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          procedure_details: string | null
          updated_at: string
        }
        Insert: {
          aftercare?: string | null
          benefits?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          display_order: number
          id?: string
          name: string
          procedure_details?: string | null
          updated_at?: string
        }
        Update: {
          aftercare?: string | null
          benefits?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          procedure_details?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_procedures_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "treatment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          created_at: string
          dentist_name: string
          details: string | null
          doctor_id: string | null
          id: string
          patient_id: string
          procedure_id: string | null
          procedure_name: string
          tooth_number: string | null
          treatment_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_name: string
          details?: string | null
          doctor_id?: string | null
          id?: string
          patient_id: string
          procedure_id?: string | null
          procedure_name: string
          tooth_number?: string | null
          treatment_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_name?: string
          details?: string | null
          doctor_id?: string | null
          id?: string
          patient_id?: string
          procedure_id?: string | null
          procedure_name?: string
          tooth_number?: string | null
          treatment_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "treatment_procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      setup_admin_user: {
        Args: { p_user_email: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "patient"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no-show"
        | "pending_confirmation"
      billing_status: "paid" | "pending" | "overdue" | "cancelled"
      document_type: "xray" | "pdf" | "image" | "scan" | "receipt" | "insurance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "patient"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "cancelled",
        "completed",
        "no-show",
        "pending_confirmation",
      ],
      billing_status: ["paid", "pending", "overdue", "cancelled"],
      document_type: ["xray", "pdf", "image", "scan", "receipt", "insurance"],
    },
  },
} as const
