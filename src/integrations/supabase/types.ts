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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      loot_claims: {
        Row: {
          awarded_xp: number
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          loot_id: string
          photo_path: string
          status: Database["public"]["Enums"]["claim_status"]
          sticker_path: string | null
          sticker_status: Database["public"]["Enums"]["sticker_status"]
          user_id: string
          verification_reason: string | null
          verified_at: string | null
        }
        Insert: {
          awarded_xp?: number
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          loot_id: string
          photo_path: string
          status?: Database["public"]["Enums"]["claim_status"]
          sticker_path?: string | null
          sticker_status?: Database["public"]["Enums"]["sticker_status"]
          user_id: string
          verification_reason?: string | null
          verified_at?: string | null
        }
        Update: {
          awarded_xp?: number
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          loot_id?: string
          photo_path?: string
          status?: Database["public"]["Enums"]["claim_status"]
          sticker_path?: string | null
          sticker_status?: Database["public"]["Enums"]["sticker_status"]
          user_id?: string
          verification_reason?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loot_claims_loot_id_fkey"
            columns: ["loot_id"]
            isOneToOne: false
            referencedRelation: "loot_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      loot_definitions: {
        Row: {
          active: boolean
          created_at: string
          description: string
          difficulty: number
          id: string
          rarity: Database["public"]["Enums"]["loot_rarity"]
          title: string
          verification_prompt: string
          xp: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          difficulty: number
          id?: string
          rarity: Database["public"]["Enums"]["loot_rarity"]
          title: string
          verification_prompt: string
          xp: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          difficulty?: number
          id?: string
          rarity?: Database["public"]["Enums"]["loot_rarity"]
          title?: string
          verification_prompt?: string
          xp?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          level: number | null
          total_xp: number
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          level?: number | null
          total_xp?: number
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          total_xp?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      finalize_loot_claim: {
        Args: {
          claim_id: string
          reason: string
          verdict: Database["public"]["Enums"]["claim_status"]
        }
        Returns: {
          awarded_xp: number
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          loot_id: string
          photo_path: string
          status: Database["public"]["Enums"]["claim_status"]
          sticker_path: string | null
          sticker_status: Database["public"]["Enums"]["sticker_status"]
          user_id: string
          verification_reason: string | null
          verified_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "loot_claims"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      claim_status: "pending" | "approved" | "rejected"
      loot_rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
      sticker_status: "pending" | "ready" | "failed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      claim_status: ["pending", "approved", "rejected"],
      loot_rarity: ["common", "uncommon", "rare", "epic", "legendary"],
      sticker_status: ["pending", "ready", "failed"],
    },
  },
} as const
