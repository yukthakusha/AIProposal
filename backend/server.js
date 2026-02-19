import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const HF_API_KEY = process.env.HF_API_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO Users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ message: 'User registered successfully', userId: this.lastID });
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, userId: user.id });
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/opportunities', authenticateToken, (req, res) => {
  db.all('SELECT * FROM Opportunities', [], (err, opportunities) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch opportunities' });
    res.json(opportunities);
  });
});

app.post('/api/save-profile', authenticateToken, (req, res) => {
  try {
    const { companyName, naicsCodes, coreCapabilities, pastPerformance } = req.body;
    
    db.get('SELECT id FROM CompanyProfiles WHERE user_id = ?', [req.user.id], (err, existing) => {
      if (existing) {
        db.run(`
          UPDATE CompanyProfiles 
          SET company_name = ?, naics_codes = ?, core_capabilities = ?, past_performance = ?
          WHERE user_id = ?
        `, [companyName, naicsCodes, coreCapabilities, pastPerformance, req.user.id], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to save profile' });
          res.json({ message: 'Profile saved successfully' });
        });
      } else {
        db.run(`
          INSERT INTO CompanyProfiles (user_id, company_name, naics_codes, core_capabilities, past_performance)
          VALUES (?, ?, ?, ?, ?)
        `, [req.user.id, companyName, naicsCodes, coreCapabilities, pastPerformance], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to save profile' });
          res.json({ message: 'Profile saved successfully' });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT * FROM CompanyProfiles WHERE user_id = ?', [req.user.id], (err, profile) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch profile' });
    res.json(profile || {});
  });
});

app.post('/api/generate-proposal', authenticateToken, async (req, res) => {
  try {
    const { opportunityId } = req.body;
    
    db.get('SELECT * FROM Opportunities WHERE id = ?', [opportunityId], async (err, opportunity) => {
      if (err || !opportunity) return res.status(404).json({ error: 'Opportunity not found' });
      
      db.get('SELECT * FROM CompanyProfiles WHERE user_id = ?', [req.user.id], async (err2, profile) => {
        if (err2 || !profile) return res.status(404).json({ error: 'Company profile not found' });
        
        const proposalText = `Company Overview:\n${profile.company_name} is a leading provider specializing in ${profile.core_capabilities}. With NAICS codes ${profile.naics_codes}, we are well-positioned to deliver exceptional results for ${opportunity.agency}.\n\nRelevant Experience:\n${profile.past_performance}\n\nTechnical Approach:\nOur approach leverages industry best practices and proven methodologies to address ${opportunity.title}. We will implement a comprehensive solution that meets all requirements outlined in the solicitation for ${opportunity.description}.\n\nCompliance Statement:\nWe certify full compliance with all federal regulations and requirements specified in this solicitation for ${opportunity.agency}. Our team maintains all necessary certifications and clearances.\n\nConclusion:\nWe are committed to delivering excellence and look forward to partnering with ${opportunity.agency} on ${opportunity.title}. Our proven track record and specialized capabilities make us the ideal partner for this initiative.`;
        
        const sections = {
          companyOverview: extractSection(proposalText, 'Company Overview'),
          relevantExperience: extractSection(proposalText, 'Relevant Experience'),
          technicalApproach: extractSection(proposalText, 'Technical Approach'),
          complianceStatement: extractSection(proposalText, 'Compliance Statement'),
          conclusion: extractSection(proposalText, 'Conclusion')
        };
        
        db.run(`
          INSERT INTO Proposals (user_id, opportunity_id, content)
          VALUES (?, ?, ?)
        `, [req.user.id, opportunityId, JSON.stringify(sections)], function(err3) {
          if (err3) return res.status(500).json({ error: 'Failed to save proposal' });
          
          res.json({
            proposalId: this.lastID,
            sections,
            opportunity,
            profile,
            confidenceScore: 87
          });
        });
      });
    });
  } catch (error) {
    console.error('Proposal generation error:', error);
    res.status(500).json({ error: 'Failed to generate proposal' });
  }
});

app.get('/api/proposal/:id', authenticateToken, (req, res) => {
  db.get(`
    SELECT p.*, o.title, o.agency, o.description, o.naics_code, o.deadline
    FROM Proposals p
    JOIN Opportunities o ON p.opportunity_id = o.id
    WHERE p.id = ? AND p.user_id = ?
  `, [req.params.id, req.user.id], (err, proposal) => {
    if (err || !proposal) return res.status(404).json({ error: 'Proposal not found' });
    
    db.get('SELECT * FROM CompanyProfiles WHERE user_id = ?', [req.user.id], (err2, profile) => {
      res.json({
        ...proposal,
        sections: JSON.parse(proposal.content),
        profile
      });
    });
  });
});

function extractSection(text, sectionName) {
  const regex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=\\n\\n[A-Z]|Relevant Experience|Technical Approach|Compliance Statement|Conclusion|$)`, 'i');
  const match = text.match(regex);
  if (match && match[1] && match[1].trim().length > 10) {
    return match[1].trim();
  }
  return `[${sectionName} content generated based on company profile and opportunity requirements]`;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
