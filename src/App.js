import React from "react";
import { supabase } from "./lib/api";
import {Auth} from "./components/Auth";
import {Home} from "./components/Home";
import {QueryClientProvider, QueryClient} from 'react-query';

export const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0
      }
    }
  })
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            const currentUser = session?.user;
            setUser(currentUser ?? null);
        }
    );

    return () => {
        authListener?.unsubscribe();
    };
  }, [user]);

  return (
      <div className="min-w-full min-h-screen flex items-center justify-center bg-gray-200">
        {!user
          ? <Auth/>
          : <QueryClientProvider client={queryClient}>
              <Home user={user}/>
            </QueryClientProvider>
        }
      </div>
  );
}
