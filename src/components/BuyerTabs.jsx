import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, List, ListItemButton, ListItemText } from '@mui/material';

const BuyerTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch buyer names when component mounts
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, using mock data
        setLoading(true);
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock buyer data
        const mockBuyers = [
          { id: 1, name: "ABC Corporation" },
          { id: 2, name: "XYZ Industries" },
          { id: 3, name: "Global Enterprises" },
          { id: 4, name: "Tech Solutions Ltd" },
          { id: 5, name: "Summit Holdings" }
        ];
        
        setBuyers(mockBuyers);
      } catch (err) {
        console.error("Error fetching buyers:", err);
        setError("Failed to load buyer data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    // This function could be expanded later to fetch data for the selected buyer
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (buyers.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No buyers found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: '#f9f9f9',
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      height: '100%'
    }}>
      {/* Vertical Tab List - Only the tabs without content area */}
      <List component="nav" aria-label="buyer tabs" sx={{ height: '100%' }}>
        {buyers.map((buyer, index) => (
          <ListItemButton
            key={buyer.id}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
            sx={{
              borderLeft: selectedIndex === index ? '4px solid #1976d2' : '4px solid transparent',
              backgroundColor: selectedIndex === index ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            <ListItemText 
              primary={buyer.name} 
              primaryTypographyProps={{
                fontWeight: selectedIndex === index ? '600' : '400',
                fontSize: '0.9rem'
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default BuyerTabs;
