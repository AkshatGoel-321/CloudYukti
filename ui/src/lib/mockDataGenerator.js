// src/utils/mockDataGenerators.js
const locations = ['Main Entrance', 'Lobby', 'Parking Lot', 'Restricted Area', 'Emergency Exit'];
const anomalyTypes = [
  'Unauthorized Access',
  'Crowd Density High',
  'Suspicious Behavior',
  'Loitering',
  'Tailgating',
  'Object Left Behind',
  'Running',
  'Violence Detection',
  'Restricted Item Detected',
  'Wrong Direction Movement'
];

const generateRandomMetrics = () => {
  const currentDate = new Date();
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    return {
      hour: i,
      personCount: Math.floor(Math.random() * 50),
      density: Math.random() * 0.8,
      violations: Math.floor(Math.random() * 5)
    };
  });

  return {
    totalPeople: hourlyData.reduce((acc, curr) => acc + curr.personCount, 0),
    crowdDensity: Math.random() * 0.7,
    peakHour: hourlyData.reduce((a, b) => a.personCount > b.personCount ? a : b).hour,
    hourlyData,
    alerts: generateRandomAlerts(5),
    safetyScore: Math.floor(Math.random() * 40 + 60), // 60-100
    violationCount: Math.floor(Math.random() * 20),
    trendData: {
      weeklyGrowth: (Math.random() * 20 - 10).toFixed(1), // -10% to +10%
      monthlyAverage: Math.floor(Math.random() * 1000 + 500)
    }
  };
};

const generateRandomAlerts = (count = 5) => {
  return Array.from({ length: count }, () => {
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const timestamp = new Date(Date.now() - Math.random() * 86400000); // Last 24 hours

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      location,
      timestamp: timestamp.toISOString(),
      severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      details: generateAlertDetails(type, location),
      personCount: Math.floor(Math.random() * 5) + 1,
      resolved: Math.random() > 0.7,
      facesDetected: generateRandomFaces()
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const generateAlertDetails = (type, location) => {
  const details = {
    'Unauthorized Access': `Unauthorized person detected in ${location}`,
    'Crowd Density High': `Crowd density exceeded threshold in ${location}`,
    'Suspicious Behavior': `Suspicious activity detected in ${location}`,
    'Loitering': `Person loitering for extended period in ${location}`,
    'Tailgating': `Tailgating incident detected at ${location}`,
    'Object Left Behind': `Unattended object detected in ${location}`,
    'Running': `Running detected in ${location}`,
    'Violence Detection': `Potential violent behavior detected in ${location}`,
    'Restricted Item Detected': `Restricted item detected in ${location}`,
    'Wrong Direction Movement': `Wrong way movement detected in ${location}`
  };
  return details[type] || `Alert detected in ${location}`;
};

const generateRandomFaces = () => {
  const names = ['John Doe', 'Jane Smith', 'Unknown Person', 'Alice Johnson', 'Bob Wilson'];
  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }, () => names[Math.floor(Math.random() * names.length)]);
};

export { generateRandomMetrics, generateRandomAlerts };