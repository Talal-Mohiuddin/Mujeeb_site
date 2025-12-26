import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import supabase from "../supabase/Auth";

interface AuthState {
  user: User | null;
  isSubscribed: boolean;
  loading: boolean;
  firstName: string;
  lastName: string;
  isFirstTimeLogin: boolean;
  login: (email: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  checkSubscriptionStatus: (userId: string) => Promise<void>;
  updateSubscriptionStatus: (
    userId: string,
    isSubscribed: boolean
  ) => Promise<void>;
  handleAuthRedirect: () => Promise<void>;
  showSignupModal: boolean;
  setShowSignupModal: (show: boolean) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isSubscribed: false,
  loading: false,
  firstName: "",
  lastName: "",
  isFirstTimeLogin: false,
  showSignupModal: false,

  login: async (email: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/confirm`,
        },
      });

      if (error) {
        console.error("Error logging in:", error.message);
        throw error;
      }

      if (data) {
        console.log("Login initiated:", data);
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        set({ user });
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
        throw error;
      }
      set({ user: null, isSubscribed: false });
    } finally {
      set({ loading: false });
    }
  },

  checkSubscriptionStatus: async (userId: string) => {
    try {
      const { data: subscriptionData, error } = await supabase
        .from("subscriptions")
        .select("is_subscribed, subscription_end_date")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No subscription found");
          set({ isSubscribed: false });
          return;
        } else {
          console.error("Error fetching subscription status:", error);
          set({ isSubscribed: false });
          return;
        }
      }

      if (subscriptionData) {
        const isActive =
          subscriptionData.is_subscribed &&
          subscriptionData.subscription_end_date &&
          new Date(subscriptionData.subscription_end_date) > new Date();

        set({ isSubscribed: isActive });

        if (!isActive && subscriptionData.is_subscribed) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ is_subscribed: false })
            .eq("user_id", userId);

          if (updateError) {
            console.error("Error updating expired subscription:", updateError);
          }
        }
      } else {
        set({ isSubscribed: false });
      }
    } catch (error) {
      console.error("Error in checkSubscriptionStatus:", error);
    }
  },

  updateSubscriptionStatus: async (userId: string, isSubscribed: boolean) => {
    console.log("Updating subscription status...");
    console.log("User ID:", userId);
    console.log("Is Subscribed:", isSubscribed);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    try {
      const { data, error: selectError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (selectError) {
        console.error("Error checking existing subscription:", selectError);
      }

      let result;

      if (data) {
        result = await supabase
          .from("subscriptions")
          .update({
            is_subscribed: isSubscribed,
            subscription_start_date: startDate,
            subscription_end_date: endDate,
          })
          .eq("user_id", userId);
      } else {
        result = await supabase.from("subscriptions").insert([
          {
            user_id: userId,
            is_subscribed: isSubscribed,
            subscription_start_date: startDate,
            subscription_end_date: endDate,
          },
        ]);
      }

      if (result.error) {
        console.error("Error updating subscription status:", result.error);
        throw result.error;
      }

      set({ isSubscribed });

      console.log("Subscription status updated successfully");

      const { data: updatedData, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching updated subscription:", fetchError);
      } else {
        console.log("Updated subscription data:", updatedData);
        set({ isSubscribed: updatedData.is_subscribed });
      }
    } catch (error) {
      console.error("Unexpected error in updateSubscriptionStatus:", error);
      throw error;
    }
  },

  handleAuthRedirect: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data && data.session) {
        const { user } = data.session;
        set({ user });

        // Check if user exists in database to determine if first-time login
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        const isFirstTime = !existingUser;
        set({ isFirstTimeLogin: isFirstTime });

        await supabase.from("users").upsert([
          {
            id: user.id,
            email: user.email,
            Display_Name: `${get().firstName} ${get().lastName}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error handling auth redirect:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setShowSignupModal: (show: boolean) => set({ showSignupModal: show }),
}));

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    useAuthStore.setState({ user: session.user });
  } else if (event === "SIGNED_OUT") {
    useAuthStore.setState({ user: null, isSubscribed: false });
  }
});

export default useAuthStore;
