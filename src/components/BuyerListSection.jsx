import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";

const BuyerListSection = () => {
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
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" component="h3" sx={{ 
        mb: 2, 
        fontWeight: 600, 
        color: '#333',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '8px'
      }}>
        Buyer List
      </Typography>
      <Box sx={{ height: 'calc(100% - 50px)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        ) : buyers.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography>No buyers found.</Typography>
          </Box>
        ) : (
          <Box sx={{ 
            width: '100%',
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            height: '100%'
          }}>
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
        )}
      </Box>
    </Paper>
  );
};

export default BuyerListSection;
