import React from "react";
import { supabase } from "../lib/api";
import {RecoverPassword} from "./RecoverPassword";
import {useFetchClubsQuery} from '../lib/clubs';

export const Home = ({ user }) => {
    const [recoveryToken, setRecoveryToken] = React.useState(null);
    const newTaskTextRef = React.useRef();
    const [errorText, setError] = React.useState("");
    const [maxCapacity, setMaxCapacity] = React.useState();
    const [limit, setLimit] = React.useState();
    const {isLoading: isLoadingClubs, data: clubs, isError} = useFetchClubsQuery({maxCapacity, limit});

console.log(limit);
    React.useEffect(() => {
        /* Recovery url is of the form
         * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
         * Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
         */
        let url = window.location.hash;
        let query = url.substr(1);
        let result = {};

        query.split("&").forEach((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });

        if (result.type === "recovery") {
            setRecoveryToken(result.access_token);
        }
    }, []);

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <div>
            <button onClick={handleLogout}>Logout</button>
            {isLoadingClubs
              ? 'Loading...'
              : <div>
                  <p>
                      <label>Limit</label>
                      <select onClick={(e) => setLimit(e.target.value)}>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                      </select>
                  </p>
                  <p>
                      <label>Aforo</label>
                      <select onClick={(e) => setMaxCapacity(e.target.value)}>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                      </select>
                  </p>
                  {
                    clubs.map((club) => (
                      <div>{club.name}, {club.max_capacity}</div>
                    )
                  )}
              </div>
            }
        </div>
    );
};
