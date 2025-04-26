// A function to get and process a user's previous searches from the database.
// The data is retrieved via an API hosted on the backend.

import React from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Private helper function - gets the user's searches from the DB via API
async function fetchPreviousSearches(user_id) {
  try {                
    if (!user_id) {
      throw new Error('Invalid Submission.');
    }
    
    // Fetch search history data from searches table via my API
    const response = await axios.get(`${API_BASE_URL}/searches/userHistory?user_id=${user_id}`);
    console.log("Just queried the Search History API");
    
    return response.data;
  } catch (error) { 
    console.error("Error fetching search history:", error);
    throw error;
  }
}   // END fetchPreviousSearches()


// React component to display the previous searches
export function PreviousSearches({ user_id }) {
  const [searchHistory, setSearchHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  

  // useEffect to call fetchPreviousSearches()
  React.useEffect(() => {
    async function loadSearchHistory() {
      try {
        setLoading(true);
        const data = await fetchPreviousSearches(user_id);
        setSearchHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    // Call the function
    loadSearchHistory();
  }, [user_id]);    // END useEffect


  if (loading) return <p>Loading search history...</p>;
  if (error) return <p>Error loading search history: {error}</p>;
  if (searchHistory.length === 0) return <p>No search history available.</p>;

  // return the search history table
  return (
    <div className="search-history-container">
      <h2>Your recent searches:</h2>
      <table className="search-history-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Event Date</th>
            <th>Expected Prec</th>
            <th>Expected Temp</th>
            <th>Max Temp</th>
            <th>Min Temp</th>
            <th>Sunrise</th>
            <th>Sunset</th>
            <th>Years Searched</th>
          </tr>
        </thead>
        <tbody>
          {searchHistory.map((entry, index) => (
            <tr key={index}>
              <td>{entry.evt_location_act}</td>
              <td>{new Date(entry.evt_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                    })}</td>
              <td>{entry.rain_prcnt}% chance</td>
              <td>{entry.exp_temp}</td>
              <td>{entry.max_temp}</td>
              <td>{entry.min_temp}</td>
              <td>{entry.sunrise}</td>
              <td>{entry.sunset}</td>
              <td>{entry.num_years}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  };    // END PreviousSearches()

