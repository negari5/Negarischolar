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
      applications: {
        Row: {
          created_at: string | null
          id: string
          next_step: string | null
          notes: string | null
          progress: number | null
          scholarship_id: string
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          next_step?: string | null
          notes?: string | null
          progress?: number | null
          scholarship_id: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          next_step?: string | null
          notes?: string | null
          progress?: number | null
          scholarship_id?: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_sessions: {
        Row: {
          created_at: string | null
          id: string
          meeting_link: string | null
          mentor_id: string
          notes: string | null
          session_date: string
          session_time: string
          status: string | null
          student_id: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          mentor_id: string
          notes?: string | null
          session_date: string
          session_time: string
          status?: string | null
          student_id: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          mentor_id?: string
          notes?: string | null
          session_date?: string
          session_time?: string
          status?: string | null
          student_id?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string | null
          id: string
          recipient_count: number | null
          sent_at: string | null
          sent_by: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          address: string | null
          career_interests: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          current_grade_level: string | null
          date_of_birth: string | null
          dream_major: string | null
          dream_university: string | null
          education_level: string | null
          email: string | null
          english_proficiency_level: string | null
          extracurricular_activities: string[] | null
          fayda_fan_number: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          gpa: number | null
          has_completed_profile: boolean | null
          id: string
          interests: string[] | null
          is_admin: boolean | null
          is_super_admin: boolean | null
          last_name: string | null
          phone: string | null
          phone_number: string | null
          preferred_countries: string[] | null
          preferred_fields: string[] | null
          preparatory_school_type: string | null
          profile_picture_url: string | null
          school_name: string | null
          subscription_expires_at: string | null
          subscription_type: string | null
          target_country: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          career_interests?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_grade_level?: string | null
          date_of_birth?: string | null
          dream_major?: string | null
          dream_university?: string | null
          education_level?: string | null
          email?: string | null
          english_proficiency_level?: string | null
          extracurricular_activities?: string[] | null
          fayda_fan_number?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          gpa?: number | null
          has_completed_profile?: boolean | null
          id: string
          interests?: string[] | null
          is_admin?: boolean | null
          is_super_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          phone_number?: string | null
          preferred_countries?: string[] | null
          preferred_fields?: string[] | null
          preparatory_school_type?: string | null
          profile_picture_url?: string | null
          school_name?: string | null
          subscription_expires_at?: string | null
          subscription_type?: string | null
          target_country?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          account_type?: string | null
          address?: string | null
          career_interests?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_grade_level?: string | null
          date_of_birth?: string | null
          dream_major?: string | null
          dream_university?: string | null
          education_level?: string | null
          email?: string | null
          english_proficiency_level?: string | null
          extracurricular_activities?: string[] | null
          fayda_fan_number?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          gpa?: number | null
          has_completed_profile?: boolean | null
          id?: string
          interests?: string[] | null
          is_admin?: boolean | null
          is_super_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          phone_number?: string | null
          preferred_countries?: string[] | null
          preferred_fields?: string[] | null
          preparatory_school_type?: string | null
          profile_picture_url?: string | null
          school_name?: string | null
          subscription_expires_at?: string | null
          subscription_type?: string | null
          target_country?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          access_level: string | null
          category: string
          content_type: string | null
          content_url: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          category: string
          content_type?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          category?: string
          content_type?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: string
          application_url: string | null
          country: string | null
          created_at: string | null
          deadline: string
          description: string | null
          eligibility_criteria: string | null
          id: string
          requirements: string[] | null
          status: string | null
          title: string
          university: string
          updated_at: string | null
        }
        Insert: {
          amount: string
          application_url?: string | null
          country?: string | null
          created_at?: string | null
          deadline: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          requirements?: string[] | null
          status?: string | null
          title: string
          university: string
          updated_at?: string | null
        }
        Update: {
          amount?: string
          application_url?: string | null
          country?: string | null
          created_at?: string | null
          deadline?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          requirements?: string[] | null
          status?: string | null
          title?: string
          university?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
