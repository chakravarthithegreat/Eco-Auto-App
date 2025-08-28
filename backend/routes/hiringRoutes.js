const express = require('express');
const router = express.Router();

// Mock data store for candidates (in production, replace with MongoDB)
let candidates = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 3,
    status: 'matched',
    position: 'Frontend Developer',
    appliedDate: '2024-08-15',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 987-6543',
    skills: ['Python', 'Django', 'AWS'],
    experience: 5,
    status: 'matched',
    position: 'Backend Developer',
    appliedDate: '2024-08-10',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@example.com',
    phone: '+1 (555) 456-7890',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
    experience: 4,
    status: 'matched',
    position: 'UI/UX Designer',
    appliedDate: '2024-08-05',
    photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

// Mock data store for hiring statistics
let hiringStats = {
  matched: 120,
  unmatched: 80,
  totalApplications: 200,
  acceptanceRate: 60,
  avgTimeToHire: 15 // days
};

// Get all candidates
router.get('/candidates', (req, res) => {
  res.json(candidates);
});

// Get candidate by ID
router.get('/candidates/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if (candidate) {
    res.json(candidate);
  } else {
    res.status(404).json({ message: 'Candidate not found' });
  }
});

// Add new candidate
router.post('/candidates', (req, res) => {
  const newCandidate = {
    id: candidates.length + 1,
    ...req.body,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied'
  };
  
  candidates.push(newCandidate);
  
  // Update hiring statistics
  hiringStats.totalApplications += 1;
  hiringStats.unmatched += 1;
  
  res.status(201).json(newCandidate);
});

// Update candidate status
router.put('/candidates/:id', (req, res) => {
  const candidateIndex = candidates.findIndex(c => c.id === parseInt(req.params.id));
  
  if (candidateIndex !== -1) {
    const oldStatus = candidates[candidateIndex].status;
    const newStatus = req.body.status;
    
    candidates[candidateIndex] = {
      ...candidates[candidateIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Update hiring statistics when status changes
    if (oldStatus !== newStatus) {
      if (oldStatus === 'matched') hiringStats.matched -= 1;
      if (oldStatus === 'applied' || oldStatus === 'screened' || oldStatus === 'interviewed') hiringStats.unmatched -= 1;
      
      if (newStatus === 'matched') hiringStats.matched += 1;
      if (newStatus === 'applied' || newStatus === 'screened' || newStatus === 'interviewed') hiringStats.unmatched += 1;
    }
    
    res.json(candidates[candidateIndex]);
  } else {
    res.status(404).json({ message: 'Candidate not found' });
  }
});

// Delete candidate
router.delete('/candidates/:id', (req, res) => {
  const candidateIndex = candidates.findIndex(c => c.id === parseInt(req.params.id));
  
  if (candidateIndex !== -1) {
    const candidate = candidates[candidateIndex];
    
    // Update hiring statistics
    if (candidate.status === 'matched') hiringStats.matched -= 1;
    if (candidate.status === 'applied' || candidate.status === 'screened' || candidate.status === 'interviewed') hiringStats.unmatched -= 1;
    hiringStats.totalApplications -= 1;
    
    candidates.splice(candidateIndex, 1);
    res.json({ message: 'Candidate deleted successfully' });
  } else {
    res.status(404).json({ message: 'Candidate not found' });
  }
});

// Get hiring statistics
router.get('/stats', (req, res) => {
  res.json(hiringStats);
});

// Update hiring statistics
router.put('/stats', (req, res) => {
  hiringStats = { ...hiringStats, ...req.body };
  res.json(hiringStats);
});

module.exports = router;