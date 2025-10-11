import Package from './models/Package.js';

export const createPackage = async (req, res) => {
  const { name, restaurantChain, numberOfTables, details } = req.body;

  try {
    const createdPackage = await Package.create({
      name,
      restaurantChain,
      numberOfTables,
      details,
      createdBy: req.user.id, // Assuming req.user is populated by auth middleware
    });
    res.status(201).json(createdPackage); // Use the new variable name
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ createdBy: req.user.id });
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};
