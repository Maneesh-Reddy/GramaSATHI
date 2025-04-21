interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

type SupabaseResponse<T> = {
  data: T | null;
  error: SupabaseError | null;
}

declare module '../supabaseClient' {
  export const supabase: {
    from: (table: string) => {
      select: (columns?: string) => Promise<SupabaseResponse<any[]>>;
      insert: (data: any) => Promise<SupabaseResponse<any>>;
      update: (data: any) => Promise<SupabaseResponse<any>>;
      delete: () => Promise<SupabaseResponse<any>>;
    };
  };
}

declare module '../../supabaseClient' {
  export const supabase: {
    from: (table: string) => {
      select: (columns?: string) => Promise<SupabaseResponse<any[]>>;
      insert: (data: any) => Promise<SupabaseResponse<any>>;
      update: (data: any) => Promise<SupabaseResponse<any>>;
      delete: () => Promise<SupabaseResponse<any>>;
    };
  };
} 