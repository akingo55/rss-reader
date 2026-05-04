import type { User } from "@supabase/supabase-js";

export type GraphQLContext = {
  user: User | null;
};
