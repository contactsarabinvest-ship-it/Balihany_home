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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      calculator_leads: {
        Row: {
          created_at: string
          email: string
          estimated_monthly_profit: number | null
          estimated_yearly_roi: number | null
          id: string
          monthly_expenses: number | null
          nightly_rate: number | null
          occupancy_rate: number | null
          purchase_price: number | null
        }
        Insert: {
          created_at?: string
          email: string
          estimated_monthly_profit?: number | null
          estimated_yearly_roi?: number | null
          id?: string
          monthly_expenses?: number | null
          nightly_rate?: number | null
          occupancy_rate?: number | null
          purchase_price?: number | null
        }
        Update: {
          created_at?: string
          email?: string
          estimated_monthly_profit?: number | null
          estimated_yearly_roi?: number | null
          id?: string
          monthly_expenses?: number | null
          nightly_rate?: number | null
          occupancy_rate?: number | null
          purchase_price?: number | null
        }
        Relationships: []
      }
      menage_companies: {
        Row: {
          cities_covered_ar: string[]
          cities_covered_en: string[]
          cities_covered_fr: string[]
          city_ar: string
          city_en: string
          city_fr: string
          created_at: string
          description_ar: string
          description_en: string
          description_fr: string
          experience_years: string | null
          id: string
          is_premium: boolean
          logo_url: string | null
          name: string
          portfolio_photos: string[]
          portfolio_photos_pending: string[]
          portfolio_urls: string[]
          services_ar: string[]
          services_en: string[]
          services_fr: string[]
          status: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          cities_covered_ar?: string[]
          cities_covered_en?: string[]
          cities_covered_fr?: string[]
          city_ar?: string
          city_en: string
          city_fr: string
          experience_years?: string | null
          created_at?: string
          description_ar?: string
          description_en: string
          description_fr: string
          id?: string
          is_premium?: boolean
          logo_url?: string | null
          name: string
          portfolio_photos?: string[]
          portfolio_photos_pending?: string[]
          portfolio_urls?: string[]
          services_ar?: string[]
          services_en?: string[]
          services_fr?: string[]
          status?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          cities_covered_ar?: string[]
          cities_covered_en?: string[]
          cities_covered_fr?: string[]
          city_ar?: string
          city_en?: string
          city_fr?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          description_fr?: string
          experience_years?: string | null
          id?: string
          is_premium?: boolean
          logo_url?: string | null
          name?: string
          portfolio_photos?: string[]
          portfolio_photos_pending?: string[]
          portfolio_urls?: string[]
          services_ar?: string[]
          services_en?: string[]
          services_fr?: string[]
          status?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      concierge_companies: {
        Row: {
          cities_covered_ar: string[]
          cities_covered_en: string[]
          cities_covered_fr: string[]
          city_ar: string
          city_en: string
          city_fr: string
          created_at: string
          description_ar: string
          description_en: string
          description_fr: string
          experience_years: string | null
          id: string
          is_premium: boolean
          logo_url: string | null
          name: string
          portfolio_photos: string[]
          portfolio_photos_pending: string[]
          portfolio_urls: string[]
          services_ar: string[]
          services_en: string[]
          services_fr: string[]
          status: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          cities_covered_ar?: string[]
          cities_covered_en?: string[]
          cities_covered_fr?: string[]
          city_ar?: string
          city_en: string
          city_fr: string
          experience_years?: string | null
          created_at?: string
          description_ar?: string
          description_en: string
          description_fr: string
          id?: string
          is_premium?: boolean
          logo_url?: string | null
          name: string
          portfolio_photos?: string[]
          portfolio_photos_pending?: string[]
          portfolio_urls?: string[]
          services_ar?: string[]
          services_en?: string[]
          services_fr?: string[]
          status?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          cities_covered_ar?: string[]
          cities_covered_en?: string[]
          cities_covered_fr?: string[]
          city_ar?: string
          city_en?: string
          city_fr?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          description_fr?: string
          experience_years?: string | null
          id?: string
          is_premium?: boolean
          logo_url?: string | null
          name?: string
          portfolio_photos?: string[]
          portfolio_photos_pending?: string[]
          portfolio_urls?: string[]
          services_ar?: string[]
          services_en?: string[]
          services_fr?: string[]
          status?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string
          subject?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          concierge_company_id: string | null
          designer_id: string | null
          menage_company_id: string | null
          author_name: string
          rating: number
          comment: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          concierge_company_id?: string | null
          designer_id?: string | null
          menage_company_id?: string | null
          author_name: string
          rating: number
          comment: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          concierge_company_id?: string | null
          designer_id?: string | null
          menage_company_id?: string | null
          author_name?: string
          rating?: number
          comment?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      designers: {
        Row: {
          budget_level: string
          city_ar: string
          city_en: string
          city_fr: string
          created_at: string
          experience_years: string | null
          description_ar: string
          description_en: string
          description_fr: string
          id: string
          is_premium: boolean
          logo_url: string | null
          name: string
          portfolio_photos: string[]
          portfolio_photos_pending: string[]
          portfolio_urls: string[]
          status: string
          styles_ar: string[]
          styles_en: string[]
          styles_fr: string[]
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          budget_level?: string
          city_ar?: string
          city_en: string
          city_fr: string
          created_at?: string
          experience_years?: string | null
          description_ar?: string
          description_en: string
          description_fr: string
          id?: string
          is_premium?: boolean
          logo_url?: string | null
          name: string
          portfolio_photos?: string[]
          portfolio_photos_pending?: string[]
          portfolio_urls?: string[]
          status?: string
          styles_ar?: string[]
          styles_en?: string[]
          styles_fr?: string[]
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          budget_level?: string
          city_ar?: string
          city_en?: string
          city_fr?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          description_fr?: string
          experience_years?: string | null
          id?: string
          is_premium?: boolean
          logo_url?: string | null
          name?: string
          portfolio_photos?: string[]
          portfolio_photos_pending?: string[]
          portfolio_urls?: string[]
          status?: string
          styles_ar?: string[]
          styles_en?: string[]
          styles_fr?: string[]
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          user_id?: string
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
      app_role: "admin" | "concierge" | "user"
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
      app_role: ["admin", "concierge", "user"],
    },
  },
} as const
