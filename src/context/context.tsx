// "use client";

// import React, { createContext, useState, useContext, useEffect } from "react";
// import { User } from "@supabase/supabase-js";
// import supabase from "../supabase/Auth";

// interface AuthContextType {
//   user: User | null;
//   isSubscribed: boolean;
//   loading: boolean;
//   login: (email: string, firstName: string, lastName: string) => Promise<void>;
//   fetchUser: () => Promise<void>;
//   logout: () => Promise<void>;
//   checkSubscriptionStatus: (userId: string) => Promise<void>;
//   updateSubscriptionStatus: (
//     userId: string,
//     isSubscribed: boolean
//   ) => Promise<void>;
//   handleAuthRedirect: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");

//   useEffect(() => {
//     fetchUser();
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === "SIGNED_IN" && session?.user) {
//           setUser(session.user);
//         } else if (event === "SIGNED_OUT") {
//           setUser(null);
//           setIsSubscribed(false);
//         }
//       }
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   async function fetchUser() {
//     setLoading(true);
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (user) {
//       setUser(user);
//     }
//     setLoading(false);
//   }

//   async function login(email: string, firstName: string, lastName: string) {
//     setLoading(true);
//     const { data, error } = await supabase.auth.signInWithOtp({
//       email: email,
//       options: {
//         emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/confirm`,
//       },
//     });
//     setFirstName(firstName);
//     setLastName(lastName);

//     if (error) {
//       console.error("Error logging in:", error.message);
//       setLoading(false);
//       throw error;
//     }

//     if (data) {
//       console.log("Login initiated:", data);
//     }
//     setLoading(false);
//   }

//   async function handleAuthRedirect() {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.auth.getSession();

//       if (error) throw error;

//       if (data && data.session) {
//         const { user } = data.session;
//         setUser(user);

//         await supabase.from("users").upsert([
//           {
//             id: user.id,
//             email: user.email,
//             Display_Name: `${firstName} ${lastName}`,
//           },
//         ]);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error handling auth redirect:", error);
//       setLoading(false);
//       throw error;
//     }
//   }

//   async function logout() {
//     setLoading(true);
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Error logging out:", error.message);
//       setLoading(false);
//       throw error;
//     }
//     setUser(null);
//     setIsSubscribed(false);
//     setLoading(false);
//   }

//   async function checkSubscriptionStatus(userId: string) {
//     const { data: subscriptionData, error } = await supabase
//       .from("subscriptions")
//       .select("is_subscribed, subscription_end_date")
//       .eq("user_id", userId)
//       .single();

//     if (error) {
//       if (error.code === "PGRST116") {
//         console.log("No subscription found");
//         return;
//       } else {
//         console.error("Error fetching subscription status:", error);
//         setIsSubscribed(false);
//         return;
//       }
//     }

//     if (subscriptionData) {
//       const isActive =
//         subscriptionData.is_subscribed &&
//         subscriptionData.subscription_end_date &&
//         new Date(subscriptionData.subscription_end_date) > new Date();

//       setIsSubscribed(isActive);

//       if (!isActive && subscriptionData.is_subscribed) {
//         const { error: updateError } = await supabase
//           .from("subscriptions")
//           .update({ is_subscribed: false })
//           .eq("user_id", userId);

//         if (updateError) {
//           console.error("Error updating expired subscription:", updateError);
//         }
//       }
//     } else {
//       setIsSubscribed(false);
//     }
//   }

//   async function updateSubscriptionStatus(
//     userId: string,
//     isSubscribed: boolean
//   ) {
//     console.log("Updating subscription status...");
//     console.log("User ID:", userId);
//     console.log("Is Subscribed:", isSubscribed);

//     let startDate = new Date();
//     // end date = 1 year from now
//     let endDate = new Date();

//     try {
//       // First, check if a record exists
//       const { data, error: selectError } = await supabase
//         .from("subscriptions")
//         .select("*")
//         .eq("user_id", userId)
//         .single();

//       if (selectError) {
//         console.error("Error checking existing subscription:", selectError);
//       }

//       let result;

//       if (data) {
//         result = await supabase
//           .from("subscriptions")
//           .update({
//             is_subscribed: isSubscribed,
//             subscription_start_date: startDate,
//             subscription_end_date: endDate,
//           })
//           .eq("user_id", userId);
//       } else {
//         result = await supabase.from("subscriptions").insert([
//           {
//             user_id: userId,
//             is_subscribed: isSubscribed,
//             subscription_start_date: startDate,
//             subscription_end_date: endDate,
//           },
//         ]);
//       }

//       if (result.error) {
//         console.error("Error updating subscription status:", result.error);
//         throw result.error;
//       }
//       setIsSubscribed(isSubscribed);

//       console.log("Subscription status updated successfully");

//       const { data: updatedData, error: fetchError } = await supabase
//         .from("subscriptions")
//         .select("*")
//         .eq("user_id", userId)
//         .single();

//       if (fetchError) {
//         console.error("Error fetching updated subscription:", fetchError);
//       } else {
//         console.log("Updated subscription data:", updatedData);
//         setIsSubscribed(updatedData.is_subscribed);
//       }
//     } catch (error) {
//       console.error("Unexpected error in updateSubscriptionStatus:", error);
//       throw error;
//     }
//   }

//   const value = {
//     user,
//     isSubscribed,
//     loading,
//     login,
//     fetchUser,
//     logout,
//     checkSubscriptionStatus,
//     updateSubscriptionStatus,
//     handleAuthRedirect,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === null) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
