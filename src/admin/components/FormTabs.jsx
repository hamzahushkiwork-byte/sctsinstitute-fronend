import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

function FormTabs({ children, tabs = ['Basic', 'Media'] }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>
      {Array.isArray(children) ? children[activeTab] : children}
    </Box>
  );
}

export default FormTabs;
