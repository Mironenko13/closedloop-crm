import { useState, useMemo, useEffect } from 'react';

// ─── Trades ──────────────────────────────────────────────────────────────────
const TRADE_LIST = [
  'Roofing', 'Gutters', 'Siding', 'Windows', 'Excavation',
  'General Construction', 'HVAC', 'Plumbing', 'Welding', 'Electrical',
  'Masonry', 'Painting', 'Flooring', 'Insulation', 'Drywall',
  'Landscaping', 'Concrete', 'Fencing', 'Carpentry', 'Waterproofing',
  'Solar', 'Garage Doors', 'Demolition', 'Septic', 'Tree Service',
  'Pressure Washing', 'Seal Coating', 'Real Estate',
];

const TRADE_COLORS = {
  'Roofing': '#f97316',
  'Gutters': '#06b6d4',
  'Siding': '#8b5cf6',
  'Windows': '#3b82f6',
  'Excavation': '#b45309',
  'General Construction': '#64748b',
  'HVAC': '#ef4444',
  'Plumbing': '#0ea5e9',
  'Welding': '#f59e0b',
  'Electrical': '#eab308',
  'Masonry': '#a8a29e',
  'Painting': '#ec4899',
  'Flooring': '#84cc16',
  'Insulation': '#14b8a6',
  'Drywall': '#cbd5e1',
  'Landscaping': '#22c55e',
  'Concrete': '#94a3b8',
  'Fencing': '#d97706',
  'Carpentry': '#fb923c',
  'Waterproofing': '#0284c7',
  'Solar': '#fbbf24',
  'Garage Doors': '#7c3aed',
  'Demolition': '#dc2626',
  'Septic': '#65a30d',
  'Tree Service': '#15803d',
  'Pressure Washing': '#0891b2',
  'Seal Coating': '#57534e',
  'Real Estate': '#10b981',
};

const TRADE_CHECKLISTS = {
  'Roofing': [
    { id: 1, label: 'Site inspection / measurements' },
    { id: 2, label: 'Material order & delivery' },
    { id: 3, label: 'Tear off old roof' },
    { id: 4, label: 'Install underlayment' },
    { id: 5, label: 'Install new roof' },
    { id: 6, label: 'Flashing & sealing' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Gutters': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Remove old gutters' },
    { id: 4, label: 'Install new gutters' },
    { id: 5, label: 'Downspout install' },
    { id: 6, label: 'Sealing & testing' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Siding': [
    { id: 1, label: 'Inspection & measurements' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Remove old siding' },
    { id: 4, label: 'Weather barrier install' },
    { id: 5, label: 'Siding install' },
    { id: 6, label: 'Trim & finishing' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Windows': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Remove old windows' },
    { id: 4, label: 'Frame prep' },
    { id: 5, label: 'Window install' },
    { id: 6, label: 'Seal & insulate' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Excavation': [
    { id: 1, label: 'Site survey' },
    { id: 2, label: 'Permits' },
    { id: 3, label: 'Equipment mobilization' },
    { id: 4, label: 'Excavation' },
    { id: 5, label: 'Grading' },
    { id: 6, label: 'Backfill & compaction' },
    { id: 7, label: 'Site cleanup' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'General Construction': [
    { id: 1, label: 'Project scoping' },
    { id: 2, label: 'Permits & approvals' },
    { id: 3, label: 'Site prep' },
    { id: 4, label: 'Foundation' },
    { id: 5, label: 'Framing' },
    { id: 6, label: 'Mechanicals rough-in' },
    { id: 7, label: 'Drywall & finishes' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'HVAC': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Equipment order' },
    { id: 3, label: 'Old unit removal' },
    { id: 4, label: 'New unit install' },
    { id: 5, label: 'Ductwork' },
    { id: 6, label: 'Refrigerant charge' },
    { id: 7, label: 'System test' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Plumbing': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Rough-in plumbing' },
    { id: 4, label: 'Fixture install' },
    { id: 5, label: 'Pressure test' },
    { id: 6, label: 'Final inspection' },
    { id: 7, label: 'Invoice sent' },
    { id: 8, label: 'Payment received' },
  ],
  'Welding': [
    { id: 1, label: 'Project scoping' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Fabrication' },
    { id: 4, label: 'On-site install' },
    { id: 5, label: 'Grinding & finishing' },
    { id: 6, label: 'Final inspection' },
    { id: 7, label: 'Invoice sent' },
    { id: 8, label: 'Payment received' },
  ],
  'Electrical': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Permits' },
    { id: 3, label: 'Panel/service work' },
    { id: 4, label: 'Rough-in wiring' },
    { id: 5, label: 'Device install' },
    { id: 6, label: 'Inspection & testing' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Masonry': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Site prep' },
    { id: 4, label: 'Foundation/footing' },
    { id: 5, label: 'Masonry work' },
    { id: 6, label: 'Mortar & sealing' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Painting': [
    { id: 1, label: 'Surface assessment' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Surface prep & patching' },
    { id: 4, label: 'Prime coat' },
    { id: 5, label: 'Paint coat 1' },
    { id: 6, label: 'Paint coat 2' },
    { id: 7, label: 'Trim & detail work' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Flooring': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Remove old flooring' },
    { id: 4, label: 'Subfloor prep' },
    { id: 5, label: 'Flooring install' },
    { id: 6, label: 'Trim & transitions' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Insulation': [
    { id: 1, label: 'Assessment & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Air sealing' },
    { id: 4, label: 'Insulation install' },
    { id: 5, label: 'Vapor barrier' },
    { id: 6, label: 'Final inspection' },
    { id: 7, label: 'Invoice sent' },
    { id: 8, label: 'Payment received' },
  ],
  'Drywall': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Frame inspection' },
    { id: 4, label: 'Drywall hang' },
    { id: 5, label: 'Tape & mud' },
    { id: 6, label: 'Sand & prime' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Landscaping': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Design approval' },
    { id: 3, label: 'Material & plant order' },
    { id: 4, label: 'Site prep' },
    { id: 5, label: 'Hardscape install' },
    { id: 6, label: 'Planting' },
    { id: 7, label: 'Irrigation' },
    { id: 8, label: 'Cleanup' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Concrete': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Permits' },
    { id: 3, label: 'Excavation & prep' },
    { id: 4, label: 'Form setup' },
    { id: 5, label: 'Rebar/wire mesh' },
    { id: 6, label: 'Pour concrete' },
    { id: 7, label: 'Finishing & sealing' },
    { id: 8, label: 'Cure time' },
    { id: 9, label: 'Final inspection' },
    { id: 10, label: 'Invoice sent' },
    { id: 11, label: 'Payment received' },
  ],
  'Fencing': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Mark & locate utilities' },
    { id: 4, label: 'Post holes & setting' },
    { id: 5, label: 'Rail install' },
    { id: 6, label: 'Picket/panel install' },
    { id: 7, label: 'Gates' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Carpentry': [
    { id: 1, label: 'Project scoping' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Site prep' },
    { id: 4, label: 'Framing/rough carpentry' },
    { id: 5, label: 'Finish carpentry' },
    { id: 6, label: 'Trim & molding' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Waterproofing': [
    { id: 1, label: 'Assessment & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Excavation if needed' },
    { id: 4, label: 'Surface prep' },
    { id: 5, label: 'Membrane/coating apply' },
    { id: 6, label: 'Drainage install' },
    { id: 7, label: 'Backfill' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Solar': [
    { id: 1, label: 'Site & roof assessment' },
    { id: 2, label: 'Permit & utility approval' },
    { id: 3, label: 'Material order' },
    { id: 4, label: 'Roof mount install' },
    { id: 5, label: 'Panel install' },
    { id: 6, label: 'Inverter & wiring' },
    { id: 7, label: 'Utility inspection' },
    { id: 8, label: 'System activation' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Garage Doors': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Remove old door' },
    { id: 4, label: 'Track & spring install' },
    { id: 5, label: 'Door panel install' },
    { id: 6, label: 'Opener install' },
    { id: 7, label: 'Test & adjust' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Demolition': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Permits' },
    { id: 3, label: 'Utility disconnect' },
    { id: 4, label: 'Hazmat check' },
    { id: 5, label: 'Demolition' },
    { id: 6, label: 'Debris removal' },
    { id: 7, label: 'Site grading' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Septic': [
    { id: 1, label: 'Site assessment' },
    { id: 2, label: 'Permits' },
    { id: 3, label: 'Excavation' },
    { id: 4, label: 'Tank install' },
    { id: 5, label: 'Leach field install' },
    { id: 6, label: 'Inspection & test' },
    { id: 7, label: 'Backfill' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Tree Service': [
    { id: 1, label: 'Site assessment & quote' },
    { id: 2, label: 'Equipment setup' },
    { id: 3, label: 'Tree removal/trimming' },
    { id: 4, label: 'Stump grinding' },
    { id: 5, label: 'Debris chipping' },
    { id: 6, label: 'Haul away' },
    { id: 7, label: 'Site cleanup' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Pressure Washing': [
    { id: 1, label: 'Assessment & quote' },
    { id: 2, label: 'Equipment setup' },
    { id: 3, label: 'Pre-treatment' },
    { id: 4, label: 'Pressure wash' },
    { id: 5, label: 'Rinse & inspect' },
    { id: 6, label: 'Post-treatment seal' },
    { id: 7, label: 'Final walkthrough' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Seal Coating': [
    { id: 1, label: 'Inspect surface for cracks and damage' },
    { id: 2, label: 'Clean and degrease surface' },
    { id: 3, label: 'Fill cracks and potholes' },
    { id: 4, label: 'Edge and trim around borders' },
    { id: 5, label: 'Apply first coat of sealer' },
    { id: 6, label: 'Apply second coat if required' },
    { id: 7, label: 'Block off area for curing time' },
    { id: 8, label: 'Final inspection with client' },
  ],
  'Real Estate': [
    { id: 1,  label: 'Initial client consultation' },
    { id: 2,  label: 'Property valuation / CMA' },
    { id: 3,  label: 'Listing agreement signed' },
    { id: 4,  label: 'Photos and staging arranged' },
    { id: 5,  label: 'MLS listing live' },
    { id: 6,  label: 'Showings scheduled' },
    { id: 7,  label: 'Offer received and reviewed' },
    { id: 8,  label: 'Inspection contingency cleared' },
    { id: 9,  label: 'Closing date confirmed' },
    { id: 10, label: 'Keys handed over' },
  ],
};

// ─── Demo Data ───────────────────────────────────────────────────────────────
const DEMO_LEADS = [
  {
    id: 1, name: 'Hargrove Residence', contact: 'Frank Hargrove', role: 'Homeowner',
    trade: 'Roofing', status: 'stalled', value: 14800, stage: 'estimate',
    callbackDate: '2026-03-25', lastContact: '2026-03-10',
    stallReason: 'price_objection', notes: 'Wants 15% off. Comparing 2 other bids.',
    industry: 'Residential', dealAge: 22,
  },
  {
    id: 2, name: 'Greenfield Office Park', contact: 'Dana Nguyen', role: 'Property Manager',
    trade: 'HVAC', status: 'stalled', value: 23500, stage: 'approved',
    callbackDate: '2026-03-24', lastContact: '2026-03-08',
    stallReason: 'budget_freeze', notes: 'Q1 budget locked. Revisit April per board decision.',
    industry: 'Commercial', dealAge: 38,
  },
  {
    id: 3, name: 'Martinez Family', contact: 'Rosa Martinez', role: 'Homeowner',
    trade: 'Windows', status: 'active', value: 18700, stage: 'inspection',
    callbackDate: '2026-03-23', lastContact: '2026-03-20',
    stallReason: null, notes: 'Replacing 12 windows. Anderson 400 series preferred.',
    industry: 'Residential', dealAge: 9,
  },
  {
    id: 4, name: 'Sunridge Apartments', contact: 'Todd Whitfield', role: 'Building Manager',
    trade: 'Plumbing', status: 'stalled', value: 11400, stage: 'estimate',
    callbackDate: '2026-03-19', lastContact: '2026-03-05',
    stallReason: 'no_response', notes: '3 follow-ups, no reply. 24-unit re-pipe job.',
    industry: 'Commercial', dealAge: 41,
  },
  {
    id: 5, name: 'Pinnacle Retail Center', contact: 'Jeff Bloom', role: 'Facilities Director',
    trade: 'Electrical', status: 'active', value: 31200, stage: 'approved',
    callbackDate: '2026-03-26', lastContact: '2026-03-21',
    stallReason: null, notes: '400A panel upgrade + 6 EV charger circuits. Near close.',
    industry: 'Commercial', dealAge: 27,
  },
  {
    id: 6, name: 'Keller Residence', contact: 'Amy Keller', role: 'Homeowner',
    trade: 'Siding', status: 'stalled', value: 22600, stage: 'estimate',
    callbackDate: '2026-03-22', lastContact: '2026-03-12',
    stallReason: 'competitor', notes: 'Got lower bid from another company. Need to show value.',
    industry: 'Residential', dealAge: 35,
  },
  {
    id: 7, name: 'Westview HOA', contact: 'Susan Park', role: 'HOA President',
    trade: 'General Construction', status: 'active', value: 94000, stage: 'inspection',
    callbackDate: '2026-03-27', lastContact: '2026-03-18',
    stallReason: null, notes: 'Community center addition. Board vote scheduled for 3/28.',
    industry: 'HOA', dealAge: 18,
  },
  {
    id: 8, name: 'Magnolia Square', contact: 'Ryan Chen', role: 'Property Manager',
    trade: 'Gutters', status: 'stalled', value: 5800, stage: 'estimate',
    callbackDate: '2026-03-15', lastContact: '2026-03-03',
    stallReason: 'technical_fit', notes: 'Concerned about K-style vs half-round fit on older building.',
    industry: 'Commercial', dealAge: 49,
  },
  {
    id: 9, name: 'Clearwater Gym', contact: 'Marcus Brown', role: 'Owner',
    trade: 'Flooring', status: 'cold', value: 17200, stage: 'lead',
    callbackDate: '2026-04-05', lastContact: '2026-02-20',
    stallReason: 'timing', notes: 'Remodel on hold until summer. Follow up Q2.',
    industry: 'Commercial', dealAge: 64,
  },
  {
    id: 10, name: 'Riverside Church', contact: 'Pastor James Willis', role: 'Facilities Coord',
    trade: 'Painting', status: 'won', value: 9400, stage: 'completed',
    callbackDate: null, lastContact: '2026-03-17',
    stallReason: null, notes: 'Closed! Exterior repaint starting April 1.',
    industry: 'Institutional', dealAge: 55,
  },
  {
    id: 11, name: 'Sagebrush Ranch', contact: 'Dale Cooper', role: 'Ranch Owner',
    trade: 'Fencing', status: 'stalled', value: 28500, stage: 'approved',
    callbackDate: '2026-03-23', lastContact: '2026-03-13',
    stallReason: 'wrong_contact', notes: 'Need to reach spouse who holds the purse strings.',
    industry: 'Residential', dealAge: 46,
  },
  {
    id: 12, name: 'Brookhaven Commons', contact: 'Tina Rosario', role: 'HOA Director',
    trade: 'Landscaping', status: 'active', value: 34800, stage: 'estimate',
    callbackDate: '2026-03-24', lastContact: '2026-03-22',
    stallReason: null, notes: 'Common area redesign. Proposal well received by board.',
    industry: 'HOA', dealAge: 14,
  },
  {
    id: 13, name: 'Morrison Trucking', contact: 'Bill Morrison', role: 'Owner',
    trade: 'Concrete', status: 'lost', value: 19600, stage: 'lost',
    callbackDate: null, lastContact: '2026-03-09',
    stallReason: 'competitor', notes: 'Lost on price. $3k lower bid from local outfit.',
    industry: 'Commercial', dealAge: 61,
  },
  {
    id: 14, name: 'Torres Residence', contact: 'Miguel Torres', role: 'Homeowner',
    trade: 'Solar', status: 'stalled', value: 42000, stage: 'approved',
    callbackDate: '2026-03-23', lastContact: '2026-03-15',
    stallReason: 'budget_freeze', notes: 'Waiting on utility rebate approval. Big deal.',
    industry: 'Residential', dealAge: 74,
  },
  {
    id: 15, name: 'Lakewood Auto', contact: 'Steve Kim', role: 'Shop Owner',
    trade: 'Garage Doors', status: 'active', value: 7200, stage: 'inspection',
    callbackDate: '2026-03-28', lastContact: '2026-03-23',
    stallReason: null, notes: '3 commercial overhead doors. Second call scheduled.',
    industry: 'Commercial', dealAge: 8,
  },
  {
    id: 16, name: 'Heritage Inn', contact: 'Patricia Lawson', role: 'General Manager',
    trade: 'Masonry', status: 'active', value: 26400, stage: 'estimate',
    callbackDate: '2026-03-26', lastContact: '2026-03-19',
    stallReason: null, notes: 'Retaining wall + patio resurfacing. Historic property.',
    industry: 'Commercial', dealAge: 20,
  },
  {
    id: 17, name: 'City Storage LLC', contact: 'Nick Ferreira', role: 'Operations Mgr',
    trade: 'Demolition', status: 'stalled', value: 38000, stage: 'estimate',
    callbackDate: '2026-03-20', lastContact: '2026-03-04',
    stallReason: 'budget_freeze', notes: 'Old warehouse demo. Full board approval pending.',
    industry: 'Commercial', dealAge: 53,
  },
  {
    id: 18, name: 'Oakwood Estates', contact: 'Carol Jensen', role: 'Homeowner',
    trade: 'Septic', status: 'active', value: 15800, stage: 'inspection',
    callbackDate: '2026-03-25', lastContact: '2026-03-20',
    stallReason: null, notes: 'Failing system. Urgent job. Permits in process.',
    industry: 'Residential', dealAge: 12,
  },
  {
    id: 19, name: 'Highland Park HOA', contact: 'David Moore', role: 'Board President',
    trade: 'Tree Service', status: 'cold', value: 8600, stage: 'lead',
    callbackDate: '2026-04-10', lastContact: '2026-02-28',
    stallReason: 'timing', notes: '15 trees to remove. Waiting on spring budget approval.',
    industry: 'HOA', dealAge: 71,
  },
  {
    id: 20, name: 'Bay Area Car Wash', contact: 'Lena Torres', role: 'Owner',
    trade: 'Pressure Washing', status: 'won', value: 4200, stage: 'completed',
    callbackDate: null, lastContact: '2026-03-18',
    stallReason: null, notes: 'Closed! Full lot + canopy wash scheduled 3/27.',
    industry: 'Commercial', dealAge: 29,
  },
  {
    id: 21, name: 'Summit Developers', contact: 'Greg Patterson', role: 'Project Manager',
    trade: 'Excavation', status: 'stalled', value: 67000, stage: 'approved',
    callbackDate: '2026-03-22', lastContact: '2026-03-11',
    stallReason: 'price_objection', notes: 'Large site clearing. Need to value-engineer scope.',
    industry: 'Commercial', dealAge: 45,
  },
  {
    id: 22, name: 'Iron Works Industrial', contact: 'Carlos Reyes', role: 'Plant Manager',
    trade: 'Welding', status: 'active', value: 19800, stage: 'inspection',
    callbackDate: '2026-03-27', lastContact: '2026-03-21',
    stallReason: null, notes: 'Steel platform fabrication + install. Strong fit.',
    industry: 'Industrial', dealAge: 17,
  },
  {
    id: 23, name: 'Northgate Mall', contact: 'Janet Farley', role: 'Facilities Mgr',
    trade: 'Insulation', status: 'stalled', value: 31500, stage: 'estimate',
    callbackDate: '2026-03-21', lastContact: '2026-03-07',
    stallReason: 'no_response', notes: 'Submitted proposal 2 weeks ago. Zero feedback.',
    industry: 'Commercial', dealAge: 58,
  },
  {
    id: 24, name: 'Sunrise Senior Living', contact: 'Andrew Mills', role: 'Maintenance Dir',
    trade: 'Drywall', status: 'active', value: 13200, stage: 'estimate',
    callbackDate: '2026-03-26', lastContact: '2026-03-20',
    stallReason: null, notes: 'Wing renovation. 40 rooms. On track.',
    industry: 'Institutional', dealAge: 22,
  },
  {
    id: 25, name: 'The Craftsman Kitchen', contact: 'Sandra Yee', role: 'Owner',
    trade: 'Carpentry', status: 'stalled', value: 24100, stage: 'approved',
    callbackDate: '2026-03-23', lastContact: '2026-03-14',
    stallReason: 'technical_fit', notes: 'Custom cabinet specs need rework. Awaiting revisions.',
    industry: 'Commercial', dealAge: 40,
  },
  {
    id: 26, name: 'Harbor View Condos', contact: 'Robert Chang', role: 'Board Treasurer',
    trade: 'Waterproofing', status: 'stalled', value: 47500, stage: 'estimate',
    callbackDate: '2026-03-24', lastContact: '2026-03-10',
    stallReason: 'wrong_contact', notes: 'Need to engage full board, not just treasurer.',
    industry: 'HOA', dealAge: 62,
  },
];

const STALL_LABELS = {
  price_objection: 'Price Objection',
  budget_freeze: 'Budget Freeze',
  no_response: 'No Response',
  competitor: 'Competitor',
  timing: 'Bad Timing',
  wrong_contact: 'Wrong Contact',
  technical_fit: 'Technical Fit',
};

const STATUS_COLORS = {
  active: '#22c55e',
  stalled: '#f97316',
  cold: '#6b7280',
  won: '#a855f7',
  lost: '#ef4444',
};

const STAGE_ORDER = ['lead', 'inspection', 'estimate', 'approved', 'in_progress', 'completed'];

const STAGE_LABELS = {
  lead: 'Lead',
  inspection: 'Inspection',
  estimate: 'Estimate',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  lost: 'Lost',
};

// Operational next-step tips shown inside the job detail modal, keyed by pipeline stage
const STAGE_TIPS = {
  lead: [
    'Call or visit the property to confirm scope and identify any visible damage',
    'Check Google Maps satellite view of the property before the site visit',
    'Ask about insurance claim status before quoting — it changes the entire conversation',
    'Log contact details, job address, and initial scope notes before moving forward',
  ],
  inspection: [
    'Take photos of all four sides, close-ups of damage areas, ridge, valleys, and all penetrations',
    'Measure total square footage and note roof pitch — both directly affect material quantities',
    'Identify flashing condition at chimney, skylights, and valleys — the most common callback sources',
    'Walk the attic if accessible — note soft spots or rot that must be priced before the estimate',
  ],
  estimate: [
    'Include a line item for each material: shingles, underlayment, ice & water shield, drip edge, flashing, ridge cap',
    'Add a conditional deck repair line item — unexpected rot found during tear-off needs prior approval',
    'Send the estimate within 24 hours of inspection — close rate drops significantly after 48 hours',
    'Follow up by phone 48 hours after sending — ask about specific line items, not just "did you see it"',
  ],
  approved: [
    'Order all materials now — lock in pricing and eliminate last-minute delivery delays',
    'Assign the crew lead and confirm availability for the scheduled start date in writing',
    'Pull the permit if required — verify local requirements before the crew arrives on site',
    'Confirm payment schedule with the customer: deposit amount, method, and balance due on completion',
  ],
  in_progress: [
    'Check in with the crew lead at noon — confirm daily progress and flag material shortages early',
    'Take before, during, and after photos at each phase — they protect you on warranty claims',
    'Get written customer approval before adding any scope found during tear-off (deck damage, rotted fascia)',
    'Run a magnetic nail sweep around the perimeter at end of each day — nail callbacks are avoidable',
  ],
  completed: [
    'Walk the completed job with the customer before requesting final payment',
    'Run a full magnetic nail sweep — driveway, lawn, and sidewalk — before leaving the site',
    'File the permit close-out inspection if required by your jurisdiction',
    'Ask for a Google review and one referral within 48 hours — this is your highest-converting window',
  ],
};
const TODAY = '2026-03-23';

// ─── Jobs Data ────────────────────────────────────────────────────────────────
const DEMO_JOBS = [
  {
    id: 101, customer: 'Frank & Linda Hargrove', address: '2847 Maplewood Dr, Austin TX 78745',
    trade: 'Roofing', value: 18400, status: 'In Progress',
    scheduledDate: '2026-03-20', completedSteps: [1, 2, 3, 4, 5],
    notes: 'GAF Timberline HDZ shingles. Crew of 4. Day 2 of 3.',
  },
  {
    id: 102, customer: 'Greenfield Office Park', address: '510 Oak Creek Blvd, Houston TX 77084',
    trade: 'HVAC', value: 22800, status: 'Scheduled',
    scheduledDate: '2026-03-28', completedSteps: [1, 2],
    notes: 'Carrier 5-ton rooftop unit. Replacement for Suite A.',
  },
  {
    id: 103, customer: 'Rosa & Carlos Martinez', address: '91 Birchwood Ct, Dallas TX 75208',
    trade: 'Windows', value: 18700, status: 'Complete',
    scheduledDate: '2026-03-14', completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    notes: 'Anderson 400 series, 12 windows. Fully sealed and inspected.',
  },
  {
    id: 104, customer: 'Sunridge Apartments — Bldg B', address: '3300 Sunridge Pkwy, San Antonio TX 78230',
    trade: 'Plumbing', value: 11400, status: 'In Progress',
    scheduledDate: '2026-03-21', completedSteps: [1, 2, 3, 4],
    notes: 'Re-piping units 12–24. PEX throughout. Pressure test pending.',
  },
  {
    id: 105, customer: 'Pinnacle Retail Center', address: '668 Elmwood Ave, Plano TX 75023',
    trade: 'Electrical', value: 29600, status: 'Scheduled',
    scheduledDate: '2026-04-01', completedSteps: [1, 2],
    notes: '400A panel upgrade + 6 EV charger circuits. Permits pulled.',
  },
  {
    id: 106, customer: 'Brookhaven Commons HOA', address: '1190 Brookhaven Blvd, Frisco TX 75034',
    trade: 'Landscaping', value: 34800, status: 'In Progress',
    scheduledDate: '2026-03-16', completedSteps: [1, 2, 3, 4, 5],
    notes: 'Phase 1 hardscape complete. Planting + irrigation starting next week.',
  },
  {
    id: 107, customer: 'Miguel & Carmen Torres', address: '4421 Sunset Ridge Rd, Austin TX 78731',
    trade: 'Solar', value: 41500, status: 'In Progress',
    scheduledDate: '2026-03-17', completedSteps: [1, 2, 3, 4],
    notes: '18-panel system. Mounts installed. Panel install in progress.',
  },
  {
    id: 108, customer: 'Sagebrush Ranch', address: '8801 County Rd 312, Waco TX 76708',
    trade: 'Fencing', value: 27200, status: 'Complete',
    scheduledDate: '2026-03-11', completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    notes: '1,200 ft cedar privacy fence. All gates hung and tested.',
  },
  {
    id: 109, customer: 'Morrison Trucking Depot', address: '2244 Industrial Blvd, Dallas TX 75207',
    trade: 'Concrete', value: 19600, status: 'Scheduled',
    scheduledDate: '2026-04-07', completedSteps: [1, 2],
    notes: '4" reinforced slab, 6,000 sq ft truck yard. Forms set next week.',
  },
  {
    id: 110, customer: 'Riverside Church', address: '200 Riverside Ave, Fort Worth TX 76107',
    trade: 'Painting', value: 9400, status: 'Scheduled',
    scheduledDate: '2026-04-01', completedSteps: [1, 2, 3],
    notes: 'Exterior repaint, full building. Sherwin-Williams Duration.',
  },
  {
    id: 111, customer: 'Westview HOA — Phase 1', address: '5500 Westview Commons, Irving TX 75038',
    trade: 'General Construction', value: 94000, status: 'In Progress',
    scheduledDate: '2026-03-10', completedSteps: [1, 2, 3, 4],
    notes: 'Community center addition. Framing complete. Mechanicals next.',
  },
  {
    id: 112, customer: 'Heritage Inn', address: '312 Heritage Blvd, San Antonio TX 78205',
    trade: 'Masonry', value: 26400, status: 'Scheduled',
    scheduledDate: '2026-04-03', completedSteps: [1, 2, 3],
    notes: 'Retaining wall + patio resurfacing. Historic limestone.',
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: '100vh',
    background: '#0f1117',
    color: '#e2e8f0',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: 14,
  },
  header: {
    background: '#161b27',
    borderBottom: '1px solid #1e2535',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    height: 56,
  },
  logo: { fontSize: 18, fontWeight: 700, color: '#f97316', letterSpacing: '-0.5px' },
  logoSub: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  tabs: { display: 'flex', gap: 4, marginLeft: 'auto' },
  tab: (active) => ({
    padding: '6px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    background: active ? '#f97316' : 'transparent',
    color: active ? '#fff' : '#94a3b8',
    transition: 'all 0.15s',
  }),
  body: { padding: 24, maxWidth: 1400, margin: '0 auto' },

  filterRow: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' },
  tradeFilterRow: {
    display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
    paddingBottom: 12, borderBottom: '1px solid #1e2535',
  },
  filterBtn: (active) => ({
    padding: '8px 14px',
    borderRadius: 20,
    border: `1px solid ${active ? '#f97316' : '#1e2535'}`,
    background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
    color: active ? '#f97316' : '#94a3b8',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    minHeight: 36,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    WebkitTapHighlightColor: 'transparent',
  }),
  tradeFilterBtn: (active, color) => ({
    padding: '4px 12px',
    borderRadius: 20,
    border: `1px solid ${active ? color : '#1e2535'}`,
    background: active ? color + '22' : 'transparent',
    color: active ? color : '#64748b',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  card: (hovered) => ({
    background: hovered ? '#1a2035' : '#161b27',
    border: '1px solid #1e2535',
    borderRadius: 10,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.15s',
    transform: hovered ? 'translateY(-2px)' : 'none',
    boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
  }),
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardName: { fontSize: 15, fontWeight: 600, color: '#f1f5f9' },
  cardContact: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: (status) => ({
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    background: STATUS_COLORS[status] + '22',
    color: STATUS_COLORS[status],
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  }),
  tradeBadge: (trade) => ({
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    background: (TRADE_COLORS[trade] || '#64748b') + '22',
    color: TRADE_COLORS[trade] || '#64748b',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    marginTop: 6,
  }),
  cardMeta: { display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  metaItem: { fontSize: 12, color: '#94a3b8' },
  metaValue: { color: '#e2e8f0', fontWeight: 500 },
  stallTag: {
    marginTop: 10,
    display: 'inline-block',
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(249,115,22,0.1)',
    color: '#f97316',
    border: '1px solid rgba(249,115,22,0.2)',
  },

  // Callbacks
  cbSection: { marginBottom: 28 },
  cbSectionHeader: {
    fontSize: 13, fontWeight: 600, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
  },
  cbBadge: (color) => ({
    background: color + '22', color, padding: '1px 8px', borderRadius: 10, fontSize: 11,
  }),
  cbRow: (hovered) => ({
    background: hovered ? '#1a2035' : '#161b27',
    border: '1px solid #1e2535', borderRadius: 8,
    padding: '12px 16px', marginBottom: 8,
    display: 'flex', alignItems: 'center', gap: 16,
    cursor: 'pointer', transition: 'background 0.15s',
  }),
  cbDate: (overdue) => ({
    fontSize: 13, fontWeight: 600,
    color: overdue ? '#ef4444' : '#f97316', minWidth: 90,
  }),
  cbName: { fontSize: 14, fontWeight: 600, color: '#f1f5f9', flex: 1 },
  cbContact: { fontSize: 12, color: '#64748b' },
  cbValue: { fontSize: 13, fontWeight: 600, color: '#22c55e' },

  // Analytics
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16, marginBottom: 28,
  },
  statCard: {
    background: '#161b27', border: '1px solid #1e2535',
    borderRadius: 10, padding: 20, textAlign: 'center',
  },
  statVal: { fontSize: 28, fontWeight: 700, color: '#f97316' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  chartSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  chartCard: {
    background: '#161b27', border: '1px solid #1e2535',
    borderRadius: 10, padding: 20,
  },
  chartTitle: { fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 16 },
  barRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  barLabel: { fontSize: 12, color: '#94a3b8', width: 120, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: '#1e2535', borderRadius: 4, overflow: 'hidden' },
  barFill: (pct, color) => ({
    height: '100%', width: `${pct}%`, background: color,
    borderRadius: 4, transition: 'width 0.5s ease',
  }),
  barCount: { fontSize: 12, color: '#64748b', width: 28, textAlign: 'right' },

  // Jobs
  progressTrack: { height: 6, background: '#1e2535', borderRadius: 3, overflow: 'hidden', marginTop: 10 },
  progressFill: (pct, color) => ({
    height: '100%', width: `${pct}%`, background: color,
    borderRadius: 3, transition: 'width 0.4s ease',
  }),

  // Checklist modal
  checklistItem: () => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid #1e2535', cursor: 'pointer',
  }),
  checkbox: (done) => ({
    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
    border: `2px solid ${done ? '#f97316' : '#2d3748'}`,
    background: done ? '#f97316' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  }),
  checkLabel: (done) => ({
    fontSize: 13, color: done ? '#64748b' : '#cbd5e1',
    textDecoration: done ? 'line-through' : 'none', flex: 1,
  }),
  checkTs: { fontSize: 11, color: '#374151', whiteSpace: 'nowrap' },

  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#161b27', border: '1px solid #1e2535',
    borderRadius: 14, width: '100%', maxWidth: 560,
    maxHeight: '85vh', overflow: 'auto', padding: 28, position: 'relative',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  closeBtn: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e2535',
    borderRadius: 8,
    color: '#94a3b8', cursor: 'pointer', fontSize: 20, lineHeight: 1,
    width: 40, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#f97316',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10,
  },
  playbookList: { listStyle: 'none', padding: 0, margin: '0 0 20px 0' },
  playbookItem: {
    display: 'flex', gap: 10, padding: '8px 0',
    borderBottom: '1px solid #1e2535', fontSize: 13, color: '#cbd5e1',
    alignItems: 'flex-start',
  },
  playbookNum: {
    background: 'rgba(249,115,22,0.15)', color: '#f97316',
    borderRadius: 4, width: 22, height: 22, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
  },
  aiBtn: (loading) => ({
    width: '100%', padding: '10px 16px',
    background: loading ? '#1e2535' : 'linear-gradient(135deg, #f97316, #ea580c)',
    border: 'none', borderRadius: 8,
    color: loading ? '#64748b' : '#fff',
    fontWeight: 600, fontSize: 14,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginBottom: 16, transition: 'opacity 0.15s',
  }),
  aiResponse: {
    background: '#0f1117', border: '1px solid rgba(249,115,22,0.2)',
    borderRadius: 8, padding: 16, fontSize: 13,
    lineHeight: 1.75, color: '#cbd5e1', whiteSpace: 'pre-wrap',
  },
  apiKeyNote: { fontSize: 11, color: '#374151', marginTop: 10, textAlign: 'center' },
};

// ─── Mobile Hook ─────────────────────────────────────────────────────────────
function useMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return isMobile;
}

// Shared tab definitions for bottom nav
const NAV_TABS = [
  { key: 'pipeline',  label: 'Pipeline',  icon: '📋' },
  { key: 'callbacks', label: 'Callbacks', icon: '📞' },
  { key: 'analytics', label: 'Analytics', icon: '📊' },
  { key: 'jobs',      label: 'Jobs',      icon: '🔨' },
  { key: 'photos',    label: 'Photos',    icon: '📸' },
];

function BottomNav({ tab, setTab, tabs, color }) {
  const c = color || '#f97316';
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#161b27', borderTop: '1px solid #1e2535',
      display: 'flex', height: 64, zIndex: 200,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.35)',
    }}>
      {(tabs || NAV_TABS).map(({ key, label, icon, locked }) => (
        <button
          key={key}
          onClick={() => !locked && setTab(key)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            color: locked ? '#2d3748' : tab === key ? c : '#64748b',
            fontSize: 10, fontWeight: 600,
            cursor: locked ? 'not-allowed' : 'pointer',
            gap: 3, minHeight: 64, padding: 0,
            borderTop: tab === key && !locked ? `2px solid ${c}` : '2px solid transparent',
            transition: 'color 0.15s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>
            {locked ? '🔒' : icon}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + n.toLocaleString();

const diffDays = (dateStr) => {
  if (!dateStr) return null;
  return Math.round((new Date(dateStr) - new Date(TODAY)) / 86400000);
};



// Operational demo AI responses keyed by stage — used when demoMode is true in CoachPanel
function getStageAiDemo(lead) {
  const stage = lead.stage || 'lead';
  const name = lead.name;
  const val = fmt(lead.value);
  const contact = lead.contact;
  const trade = lead.trade;

  const responses = {
    lead: `1. Call ${contact} today to schedule a site visit for the ${name} job — leads that get a same-day visit convert 3× higher than those that wait a week. Ask about insurance coverage before the call ends; it changes the entire pricing conversation.\n\n2. Pull the ${name} property on Google Maps and check the satellite view before visiting — estimate roof pitch, square footage, and any visible damage areas. Arriving prepared on a ${val} ${trade} lead signals professionalism before you've said a word.\n\n3. Check the county assessor site for any open permits on the ${name} address. An existing open permit on a ${val} job can delay your approval at the estimate stage if you don't catch it now.\n\n4. Create the job folder today: address, ${contact}'s contact details, Street View screenshot, and your initial scope notes. Organization from the lead stage sets the pace for every stage that follows.`,

    inspection: `1. Take a minimum of 20 photos at the ${name} inspection — four sides from ground level, close-ups of each damage area, the ridge, both valleys, and all penetrations. ${contact} will use these to understand exactly what they're approving at the ${val} estimate stage.\n\n2. Measure the roof in sections: ridge length, each slope's dimensions, and pitch. Accurate square footage on a ${val} ${trade} job prevents under-ordering shingles or padding your estimate with expensive overage.\n\n3. Walk the attic if accessible — inspect the decking for soft spots, rot, and prior patching. Any damaged decking at ${name} must be priced as a conditional line item in the estimate, not discovered mid-job when the crew is already on site.\n\n4. Document flashing condition at every penetration — chimney, skylights, and valleys are the #1 source of callbacks on completed ${trade} jobs. Note what needs replacing now so it's in the ${val} estimate, not an afterthought after approval.`,

    estimate: `1. Send the ${name} estimate within 24 hours of today's inspection — close rate drops sharply after 48 hours. The ${val} estimate should include materials, labor, disposal, and a conditional line item for deck repair with a per-sheet rate.\n\n2. Break the estimate into specific line items: shingles (brand and warranty tier), underlayment, ice & water shield, drip edge, flashing, ridge cap, tear-off, and disposal. ${contact} will compare your bid to others — being itemized makes your ${val} scope impossible to compare directly against a lump-sum competitor.\n\n3. Include your workmanship warranty terms explicitly in the estimate document. Most cheap ${trade} bids carry no written warranty. Putting yours in writing is a direct differentiator at the ${val} level and protects you in future disputes.\n\n4. Follow up with a call to ${contact} 48 hours after sending — don't wait for a response. Ask: "Did you have a chance to look over the line items? Any questions on the material spec?" The goal is a conversation that surfaces concerns, not a silent approval or no-show.`,

    approved: `1. Order all materials for ${name} today — shingles, underlayment, drip edge, flashing, and ridge cap. Lock in pricing now. ${trade} supply pricing shifts and specific SKUs can slip if you wait until the week of the job.\n\n2. Assign the crew lead for ${name} and confirm their availability for the scheduled start date in writing. For a ${val} ${trade} job, a confirmed crew lead is not the same as a tentative one — get the name and start time committed before materials are delivered.\n\n3. Check permit requirements for the ${name} address — many jurisdictions require a permit for full ${trade} replacement. Pulling it now prevents the most common avoidable delay: a crew on site with no permit in hand.\n\n4. Confirm the payment schedule with ${contact} before day one: deposit amount, collection method, and balance due on completion. Get this in writing so there is no ambiguity at the ${val} final invoice.`,

    in_progress: `1. Check in with the crew lead at ${name} at noon today — confirm progress against the daily plan, flag any material shortages, and get an updated completion estimate. Daily visibility on a ${val} ${trade} job prevents small delays from compounding into schedule problems.\n\n2. Take progress photos at each phase today: deck exposed, underlayment down, and shingles going on. These photos protect you on future warranty claims and give ${contact} confidence the ${val} job is moving as expected.\n\n3. If the crew finds soft or rotted decking at ${name} today, stop and call ${contact} before proceeding — show them a photo, explain the issue, and get written approval before adding scope. Never absorb deck repair on a ${val} job without documented customer sign-off.\n\n4. Confirm your debris disposal plan for end of day — dumpster location, magnet sweep route for nails, and where excess materials will be staged overnight. Nail injuries and neighbor complaints are the two most common issues on active ${trade} jobs.`,

    completed: `1. Schedule the final walkthrough with ${contact} before requesting the balance on the ${name} job — walk the perimeter together, check the ridge line, and inspect all flashing points. A face-to-face final walkthrough closes the ${val} job cleanly and sets up the referral conversation naturally.\n\n2. Run a magnetic nail sweep around the full perimeter of the ${name} property before leaving — driveway, lawn, and sidewalk. One nail in a tire generates a callback that costs more in goodwill than the sweep takes in time.\n\n3. File the permit close-out inspection if required by your jurisdiction for the ${name} address. Some counties issue lien notices if the final inspection isn't filed within 30 days of completion — don't leave this open on a ${val} job.\n\n4. Ask ${contact} for a Google review and one referral within 48 hours of final sign-off. Say it directly: "If you're happy with the job, a Google review and one referral are the two best ways to help us grow — I'll send you the link right now." This is your highest-converting window on any completed job.`,
  };

  return responses[stage] || responses.lead;
}

// ─── Add / Edit Lead Modal ────────────────────────────────────────────────────
const LEAD_SOURCES = ['Referral', 'Door knock', 'Online', 'Phone call', 'Repeat customer', 'Other'];
const LEAD_STAGES = ['lead', 'inspection', 'estimate', 'approved', 'in_progress', 'completed'];

const FI = { // form input base
  width: '100%', padding: '9px 12px', background: '#0f1117',
  border: '1px solid #1e2535', borderRadius: 7, color: '#e2e8f0',
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Inter', -apple-system, sans-serif",
};
const FLbl = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b',
  marginBottom: 5, marginTop: 14, textTransform: 'uppercase', letterSpacing: '0.4px',
};
const FRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

function AddLeadModal({ lead, defaultTrade, customTrade, onSave, onClose }) {
  const isMobile = useMobile();
  const isEdit = !!lead;
  const [form, setForm] = useState({
    name: lead?.name || '',
    contact: lead?.contact || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    address: lead?.address || '',
    value: lead?.value ? String(lead.value) : '',
    trade: lead?.trade || defaultTrade || 'Roofing',
    stage: lead?.stage || 'lead',
    source: lead?.source || 'Referral',
    notes: lead?.notes || '',
    callbackDate: lead?.callbackDate || '',
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const fi = (field) => ({
    ...FI,
    border: errors[field] ? '1px solid #ef4444'
      : focused === field ? '1px solid #f97316'
      : '1px solid #1e2535',
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) e.value = true;
    if (!form.trade) e.trade = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...(isEdit ? lead : {}),
      id: lead?.id || Date.now(),
      name: form.name.trim(),
      contact: form.contact.trim(),
      role: lead?.role || '',
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      trade: form.trade,
      status: lead?.status || 'active',
      value: Math.round(Number(form.value)),
      stage: form.stage,
      source: form.source,
      callbackDate: form.callbackDate || null,
      lastContact: lead?.lastContact || TODAY,
      stallReason: lead?.stallReason || null,
      notes: form.notes.trim(),
      industry: lead?.industry || 'Residential',
      dealAge: lead?.dealAge || 0,
    });
  };

  const mobileOverlay = { ...S.overlay, padding: 0, alignItems: 'flex-end' };
  const mobileModal = {
    ...S.modal, maxWidth: '100vw', width: '100vw',
    maxHeight: '95dvh', borderRadius: '16px 16px 0 0',
    margin: 0,
  };
  const mobileInput = { ...FI, padding: '13px 14px', fontSize: 16 }; // 16px prevents iOS zoom
  const mRow = isMobile
    ? { display: 'grid', gridTemplateColumns: '1fr', gap: 0 }
    : FRow;

  return (
    <div style={isMobile ? mobileOverlay : { ...S.overlay }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={isMobile ? mobileModal : { ...S.modal, maxWidth: 560 }}>
        <button style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ ...S.modalTitle, paddingRight: 48 }}>{isEdit ? 'Edit Lead' : 'Add New Lead'}</div>
        <div style={{ ...S.modalSub, marginBottom: 4 }}>
          {isEdit ? `Editing: ${lead.name}` : 'Required fields are marked with *'}
        </div>

        <div style={mRow}>
          <div>
            <label style={FLbl}>Customer / Company *</label>
            <input style={isMobile ? { ...mobileInput, ...(errors.name ? { border: '1px solid #ef4444' } : {}) } : fi('name')} value={form.name} placeholder="Apex Roofing LLC"
              onChange={e => set('name', e.target.value)}
              onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
          </div>
          <div>
            <label style={FLbl}>Contact Name</label>
            <input style={isMobile ? mobileInput : fi('contact')} value={form.contact} placeholder="Jane Smith"
              onChange={e => set('contact', e.target.value)}
              onFocus={() => setFocused('contact')} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <div style={mRow}>
          <div>
            <label style={FLbl}>Phone *</label>
            <input style={isMobile ? { ...mobileInput, ...(errors.phone ? { border: '1px solid #ef4444' } : {}) } : fi('phone')} value={form.phone} placeholder="(512) 555-0100"
              onChange={e => set('phone', e.target.value)}
              onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
          </div>
          <div>
            <label style={FLbl}>Email</label>
            <input style={isMobile ? mobileInput : fi('email')} type="email" value={form.email} placeholder="jane@company.com"
              onChange={e => set('email', e.target.value)}
              onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <label style={FLbl}>Job Address</label>
        <input style={isMobile ? mobileInput : fi('address')} value={form.address} placeholder="1234 Oak St, Austin TX 78701"
          onChange={e => set('address', e.target.value)}
          onFocus={() => setFocused('address')} onBlur={() => setFocused(null)} />

        <div style={mRow}>
          <div>
            <label style={FLbl}>Estimated Value ($) *</label>
            <input style={isMobile ? { ...mobileInput, ...(errors.value ? { border: '1px solid #ef4444' } : {}) } : fi('value')} value={form.value} placeholder="15000" type="number" min="0"
              onChange={e => set('value', e.target.value)}
              onFocus={() => setFocused('value')} onBlur={() => setFocused(null)} />
          </div>
          <div>
            <label style={FLbl}>Callback Date</label>
            <input style={isMobile ? mobileInput : fi('callbackDate')} type="date" value={form.callbackDate}
              onChange={e => set('callbackDate', e.target.value)}
              onFocus={() => setFocused('callbackDate')} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <div style={mRow}>
          <div>
            <label style={FLbl}>Trade *</label>
            <select style={isMobile ? { ...mobileInput, ...(errors.trade ? { border: '1px solid #ef4444' } : {}) } : fi('trade')} value={form.trade}
              onChange={e => set('trade', e.target.value)}
              onFocus={() => setFocused('trade')} onBlur={() => setFocused(null)}>
              {customTrade && !TRADE_LIST.includes(customTrade) && (
                <option value={customTrade}>{customTrade} ✨</option>
              )}
              {TRADE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={FLbl}>Lead Stage</label>
            <select style={isMobile ? mobileInput : fi('stage')} value={form.stage}
              onChange={e => set('stage', e.target.value)}
              onFocus={() => setFocused('stage')} onBlur={() => setFocused(null)}>
              {LEAD_STAGES.map(s => (
                <option key={s} value={s}>{STAGE_LABELS[s] || s}</option>
              ))}
            </select>
          </div>
        </div>

        <label style={FLbl}>Lead Source</label>
        <select style={isMobile ? mobileInput : fi('source')} value={form.source}
          onChange={e => set('source', e.target.value)}
          onFocus={() => setFocused('source')} onBlur={() => setFocused(null)}>
          {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label style={FLbl}>Notes</label>
        <textarea
          style={isMobile
            ? { ...mobileInput, minHeight: 80, resize: 'vertical', lineHeight: 1.5 }
            : { ...FI, minHeight: 72, resize: 'vertical', lineHeight: 1.5 }}
          value={form.notes} placeholder="Any relevant details about this lead..."
          onChange={e => set('notes', e.target.value)}
          onFocus={() => setFocused('notes')} onBlur={() => setFocused(null)}
        />

        {Object.keys(errors).length > 0 && (
          <div style={{ fontSize: 13, color: '#ef4444', marginTop: 10 }}>
            Please fill in all required fields marked with *.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingBottom: isMobile ? 8 : 0 }}>
          <button
            style={{
              flex: 1, padding: isMobile ? '14px 16px' : '10px 16px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              minHeight: 48, WebkitTapHighlightColor: 'transparent',
            }}
            onClick={handleSave}
          >
            {isEdit ? 'Save Changes' : 'Add Lead'}
          </button>
          <button
            style={{
              padding: isMobile ? '14px 20px' : '10px 20px',
              background: 'transparent',
              border: '1px solid #1e2535', borderRadius: 8,
              color: '#64748b', cursor: 'pointer', fontSize: 14,
              minHeight: 48, WebkitTapHighlightColor: 'transparent',
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CoachPanel ──────────────────────────────────────────────────────────────
function CoachPanel({ lead, onClose, demoMode, tier, onStageChange }) {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localStage, setLocalStage] = useState(lead.stage || 'lead');
  const isMobile = useMobile();
  const goToSignup = () => { window.location.href = '/'; };

  const stageTips = STAGE_TIPS[localStage] || STAGE_TIPS.lead;
  const isStarterLocked = demoMode && tier === 'starter';

  const handleStageChange = (newStage) => {
    setLocalStage(newStage);
    setAiText('');
    setError('');
    if (onStageChange) onStageChange(newStage);
  };

  const getAiAdvice = async () => {
    setLoading(true);
    setError('');
    setAiText('');

    if (demoMode) {
      const text = getStageAiDemo({ ...lead, stage: localStage });
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(r => setTimeout(r, 28));
        setAiText(prev => prev + (i === 0 ? '' : ' ') + words[i]);
      }
      setLoading(false);
      return;
    }

    const currentStageLabel = STAGE_LABELS[localStage] || localStage;

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade: lead.trade,
          stage: currentStageLabel,
          notes: lead.notes,
          value: fmt(lead.value),
          name: lead.name,
          contact: lead.contact,
          role: lead.role,
          industry: lead.industry,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error contacting AI coach.');
      } else {
        setAiText(data.text);
      }
    } catch (e) {
      setError('Error: ' + (e.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const coachOverlay = isMobile
    ? { ...S.overlay, padding: 0, alignItems: 'flex-end' }
    : S.overlay;
  const coachModal = isMobile
    ? { ...S.modal, maxWidth: '100vw', width: '100vw', maxHeight: '95dvh', borderRadius: '16px 16px 0 0', margin: 0 }
    : S.modal;

  return (
    <div style={coachOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={coachModal}>
        <button style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ ...S.modalTitle, paddingRight: 52 }}>{lead.name}</div>
        <div style={S.modalSub}>
          {lead.contact} · {lead.role} · {fmt(lead.value)} · {STAGE_LABELS[lead.stage] || lead.stage}
          {lead.stallReason && ` · ${STALL_LABELS[lead.stallReason]}`}
        </div>
        <div style={{ marginBottom: 20 }}>
          <span style={S.tradeBadge(lead.trade)}>{lead.trade}</span>
        </div>

        {lead.notes && (
          <>
            <div style={S.sectionLabel}>Job Notes</div>
            <div style={{
              fontSize: 13, color: '#94a3b8', marginBottom: 20,
              padding: '10px 12px', background: '#0f1117', borderRadius: 6,
            }}>
              {lead.notes}
            </div>
          </>
        )}

        <div style={S.sectionLabel}>Stage</div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20,
        }}>
          {STAGE_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => handleStageChange(s)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11,
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                border: localStage === s ? 'none' : '1px solid #1e2535',
                background: localStage === s ? '#f97316' : '#0f1117',
                color: localStage === s ? '#fff' : '#64748b',
              }}
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
        </div>

        <div style={S.sectionLabel}>What to do at this stage</div>
        <ul style={S.playbookList}>
          {stageTips.map((tip, i) => (
            <li key={i} style={S.playbookItem}>
              <span style={S.playbookNum}>{i + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div style={S.sectionLabel}>AI Coach — Job Advice</div>
        {isStarterLocked ? (
          <div>
            <button
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 8,
                background: '#1a1f2e', border: '1px solid #2d3748',
                color: '#475569', fontSize: 13, fontWeight: 600,
                cursor: 'not-allowed', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              disabled
            >
              <span style={{ fontSize: 16 }}>🔒</span>
              AI Job Advice — Pro feature
            </button>
            <div style={{
              marginTop: 10, padding: '10px 14px',
              background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)',
              borderRadius: 7, fontSize: 12, color: '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <span>AI job advice with stage-specific next steps is available on Pro and Business plans.</span>
              <button
                onClick={goToSignup}
                style={{
                  padding: '5px 14px', background: '#f97316', border: 'none',
                  borderRadius: 6, color: '#fff', fontWeight: 700,
                  fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Upgrade
              </button>
            </div>
          </div>
        ) : (
          <button style={S.aiBtn(loading)} onClick={getAiAdvice} disabled={loading}>
            {loading ? '⟳  Generating job advice...' : '✦  Get AI Job Advice'}
          </button>
        )}

        {error && (
          <div style={{
            fontSize: 12, color: '#ef4444', marginBottom: 12,
            padding: '8px 12px', background: 'rgba(239,68,68,0.08)',
            borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)',
          }}>
            {error}
          </div>
        )}

        {aiText && <div style={S.aiResponse}>{aiText}</div>}

        {!demoMode && <div style={S.apiKeyNote}>Powered by Claude · Add ANTHROPIC_API_KEY to Vercel environment variables</div>}
      </div>
    </div>
  );
}

// ─── Disabled Tooltip ────────────────────────────────────────────────────────
function DisabledTooltip({ active, label, children }) {
  const [show, setShow] = useState(false);
  if (!active) return children;
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: '110%', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f1117', border: '1px solid #2d3748',
          borderRadius: 6, padding: '5px 10px',
          fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap',
          zIndex: 200, pointerEvents: 'none',
        }}>
          {label}
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '5px solid #2d3748',
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Lead Card ───────────────────────────────────────────────────────────────
function LeadCard({ lead, onClick, onEdit, onDelete, demoMode }) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const days = diffDays(lead.callbackDate);
  const isOverdue = days !== null && days < 0;

  return (
    <div
      style={S.card(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false); }}
      onClick={() => onClick(lead)}
    >
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardName}>{lead.name}</div>
          <div style={S.cardContact}>{lead.contact}{lead.role ? ` · ${lead.role}` : ''}</div>
        </div>
        <span style={S.statusBadge(lead.status)}>{lead.status}</span>
      </div>

      <span style={S.tradeBadge(lead.trade)}>{lead.trade}</span>

      <div style={S.cardMeta}>
        <div style={S.metaItem}>Value: <span style={S.metaValue}>{fmt(lead.value)}</span></div>
        <div style={S.metaItem}>Stage: <span style={S.metaValue}>{STAGE_LABELS[lead.stage] || lead.stage}</span></div>
        <div style={S.metaItem}>Age: <span style={S.metaValue}>{lead.dealAge}d</span></div>
      </div>

      {lead.stallReason && (
        <div style={S.stallTag}>⚠ {STALL_LABELS[lead.stallReason]}</div>
      )}

      {lead.callbackDate && (
        <div style={{
          marginTop: 10, fontSize: 11,
          color: isOverdue ? '#ef4444' : days === 0 ? '#f97316' : '#64748b',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span>{isOverdue ? '🔴' : days === 0 ? '🟡' : '📅'}</span>
          <span>
            {isOverdue
              ? `Overdue — ${Math.abs(days)}d ago`
              : days === 0 ? 'Callback today'
              : `Callback in ${days}d`}
          </span>
        </div>
      )}

      {(demoMode || onEdit || onDelete) && hovered && (
        <div
          style={{
            display: 'flex', gap: 6, marginTop: 12, paddingTop: 10,
            borderTop: '1px solid #1e2535',
          }}
          onClick={e => e.stopPropagation()}
        >
          <DisabledTooltip active={demoMode} label="Sign up to add your own data">
            <button
              style={{
                flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 500,
                background: 'transparent', border: '1px solid #1e2535',
                borderRadius: 6, color: demoMode ? '#3d4f63' : '#94a3b8',
                cursor: demoMode ? 'not-allowed' : 'pointer',
                minWidth: 70,
              }}
              onClick={demoMode ? undefined : () => onEdit && onEdit(lead)}
            >
              ✏ Edit
            </button>
          </DisabledTooltip>

          {!confirmDelete && (
            <DisabledTooltip active={demoMode} label="Sign up to add your own data">
              <button
                style={{
                  flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 500,
                  background: 'transparent', border: '1px solid #1e2535',
                  borderRadius: 6, color: demoMode ? '#3d4f63' : '#64748b',
                  cursor: demoMode ? 'not-allowed' : 'pointer',
                  minWidth: 70,
                }}
                onClick={demoMode ? undefined : () => onDelete && setConfirmDelete(true)}
              >
                🗑 Delete
              </button>
            </DisabledTooltip>
          )}
          {!demoMode && onDelete && confirmDelete && (
            <>
              <span style={{ fontSize: 11, color: '#94a3b8', alignSelf: 'center', flex: 1 }}>Sure?</span>
              <button
                style={{
                  padding: '5px 12px', fontSize: 12, fontWeight: 600,
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                }}
                onClick={() => onDelete(lead.id)}
              >
                Delete
              </button>
              <button
                style={{
                  padding: '5px 12px', fontSize: 12,
                  background: 'transparent', border: '1px solid #1e2535',
                  borderRadius: 6, color: '#64748b', cursor: 'pointer',
                }}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pipeline Tab ─────────────────────────────────────────────────────────────
function PipelineTab({ leads, onSelectLead, onAddLead, onEditLead, onDeleteLead, demoMode }) {
  const [filter, setFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');
  const isMobile = useMobile();
  const filters = ['all', 'active', 'stalled', 'cold', 'won', 'lost'];

  const filtered = useMemo(() => {
    let result = filter === 'all' ? leads : leads.filter(l => l.status === filter);
    if (tradeFilter !== 'all') result = result.filter(l => l.trade === tradeFilter);
    return result;
  }, [leads, filter, tradeFilter]);

  const total = filtered.reduce((s, l) => s + l.value, 0);

  const scrollRow = {
    display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center',
    overflowX: 'auto', flexWrap: 'nowrap',
    WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
    msOverflowStyle: 'none', paddingBottom: 4,
  };

  return (
    <div>
      {/* Status filter row */}
      <div style={isMobile ? scrollRow : S.filterRow}>
        {filters.map(f => (
          <button key={f} style={S.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f === 'all'
              ? `All (${leads.length})`
              : `${f.charAt(0).toUpperCase() + f.slice(1)} (${leads.filter(l => l.status === f).length})`}
          </button>
        ))}
        {!isMobile && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Total: <span style={{ color: '#f97316', fontWeight: 700, marginLeft: 4 }}>{fmt(total)}</span>
            </div>
            {(onAddLead || demoMode) && (
              <DisabledTooltip active={demoMode} label="Sign up to add your own data">
                <button
                  style={{
                    padding: '8px 16px',
                    background: demoMode ? 'transparent' : 'linear-gradient(135deg, #f97316, #ea580c)',
                    border: demoMode ? '1px solid #2d3748' : 'none',
                    borderRadius: 7,
                    color: demoMode ? '#3d4f63' : '#fff',
                    fontWeight: 700, fontSize: 13,
                    cursor: demoMode ? 'not-allowed' : 'pointer',
                    minHeight: 36,
                  }}
                  onClick={demoMode ? undefined : onAddLead}
                >
                  + Add Lead
                </button>
              </DisabledTooltip>
            )}
          </div>
        )}
      </div>

      {/* Mobile: total + Add Lead on own row */}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            Total: <span style={{ color: '#f97316', fontWeight: 700 }}>{fmt(total)}</span>
          </div>
          {(onAddLead || demoMode) && (
            <DisabledTooltip active={demoMode} label="Sign up to add your own data">
              <button
                style={{
                  padding: '10px 18px',
                  background: demoMode ? 'transparent' : 'linear-gradient(135deg, #f97316, #ea580c)',
                  border: demoMode ? '1px solid #2d3748' : 'none',
                  borderRadius: 8,
                  color: demoMode ? '#3d4f63' : '#fff',
                  fontWeight: 700, fontSize: 14,
                  cursor: demoMode ? 'not-allowed' : 'pointer',
                  minHeight: 44,
                  WebkitTapHighlightColor: 'transparent',
                }}
                onClick={demoMode ? undefined : onAddLead}
              >
                + Add Lead
              </button>
            </DisabledTooltip>
          )}
        </div>
      )}

      {/* Trade filter row — always horizontal scroll */}
      <div style={{
        ...S.tradeFilterRow,
        overflowX: 'auto', flexWrap: 'nowrap',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <button
          style={S.tradeFilterBtn(tradeFilter === 'all', '#f97316')}
          onClick={() => setTradeFilter('all')}
        >
          All Trades
        </button>
        {TRADE_LIST.filter(t => leads.some(l => l.trade === t)).map(t => (
          <button
            key={t}
            style={S.tradeFilterBtn(tradeFilter === t, TRADE_COLORS[t])}
            onClick={() => setTradeFilter(tradeFilter === t ? 'all' : t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{
        ...S.grid,
        ...(isMobile ? { gridTemplateColumns: '1fr', gap: 12 } : {}),
      }}>
        {filtered.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={onSelectLead}
            onEdit={onEditLead}
            onDelete={onDeleteLead}
            demoMode={demoMode}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Callbacks Tab ────────────────────────────────────────────────────────────
function CallbacksTab({ leads, onSelectLead }) {
  const [hovered, setHovered] = useState(null);

  const withCallbacks = leads
    .filter(l => l.callbackDate && l.status !== 'won' && l.status !== 'lost')
    .sort((a, b) => new Date(a.callbackDate) - new Date(b.callbackDate));

  const overdue = withCallbacks.filter(l => diffDays(l.callbackDate) < 0);
  const today = withCallbacks.filter(l => diffDays(l.callbackDate) === 0);
  const upcoming = withCallbacks.filter(l => diffDays(l.callbackDate) > 0);

  const CbSection = ({ title, items, color }) => {
    if (!items.length) return null;
    return (
      <div style={S.cbSection}>
        <div style={S.cbSectionHeader}>
          {title}
          <span style={S.cbBadge(color)}>{items.length}</span>
        </div>
        {items.map(lead => {
          const days = diffDays(lead.callbackDate);
          return (
            <div
              key={lead.id}
              style={S.cbRow(hovered === lead.id)}
              onMouseEnter={() => setHovered(lead.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectLead(lead)}
            >
              <div style={S.cbDate(days < 0)}>
                {days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `in ${days}d`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={S.cbName}>{lead.name}</div>
                <div style={S.cbContact}>
                  {lead.contact} · {STAGE_LABELS[lead.stage] || lead.stage}
                  <span style={{ ...S.tradeBadge(lead.trade), marginLeft: 8 }}>{lead.trade}</span>
                </div>
              </div>
              {lead.stallReason && (
                <div style={{ fontSize: 11, color: '#f97316' }}>
                  {STALL_LABELS[lead.stallReason]}
                </div>
              )}
              <div style={{ textAlign: 'right' }}>
                <div style={S.cbValue}>{fmt(lead.value)}</div>
                <div style={{ fontSize: 11, color: '#374151' }}>{lead.callbackDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <CbSection title="🔴  Overdue" items={overdue} color="#ef4444" />
      <CbSection title="🟡  Due Today" items={today} color="#f97316" />
      <CbSection title="🟢  Upcoming" items={upcoming} color="#22c55e" />
      {!overdue.length && !today.length && !upcoming.length && (
        <div style={{ textAlign: 'center', color: '#374151', padding: 60 }}>
          No callbacks scheduled
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ leads, tier }) {
  const isMobile = useMobile();
  const active = leads.filter(l => ['active', 'stalled', 'cold'].includes(l.status));
  const stalled = leads.filter(l => l.status === 'stalled');
  const won = leads.filter(l => l.status === 'won');

  const totalPipeline = active.reduce((s, l) => s + l.value, 0);
  const stalledValue = stalled.reduce((s, l) => s + l.value, 0);
  const wonValue = won.reduce((s, l) => s + l.value, 0);

  const closedDeals = leads.filter(l => ['won', 'lost'].includes(l.status));
  const winRate = closedDeals.length ? Math.round(won.length / closedDeals.length * 100) : 0;

  const avgDealAge = active.length
    ? Math.round(active.reduce((s, l) => s + l.dealAge, 0) / active.length) : 0;

  const stallBreakdown = Object.entries(
    stalled.reduce((acc, l) => {
      if (l.stallReason) acc[l.stallReason] = (acc[l.stallReason] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const stageFunnel = STAGE_ORDER.map(stage => ({
    stage,
    count: active.filter(l => l.stage === stage).length,
    value: active.filter(l => l.stage === stage).reduce((s, l) => s + l.value, 0),
  })).filter(s => s.count > 0);

  const maxStageCount = Math.max(...stageFunnel.map(s => s.count), 1);
  const maxStallCount = Math.max(...stallBreakdown.map(s => s[1]), 1);

  const STAGE_COLORS = ['#6366f1', '#8b5cf6', '#f97316', '#f59e0b', '#22c55e', '#ef4444'];
  const STALL_COLORS = {
    price_objection: '#f97316', budget_freeze: '#6366f1', no_response: '#ef4444',
    competitor: '#f59e0b', timing: '#64748b', wrong_contact: '#8b5cf6', technical_fit: '#06b6d4',
  };

  return (
    <div>
      <div style={{
        ...S.statsRow,
        ...(isMobile ? { gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 } : {}),
      }}>
        {[
          { val: fmt(totalPipeline), label: 'Active Pipeline' },
          { val: fmt(stalledValue), label: 'Value at Risk' },
          { val: fmt(wonValue), label: 'Won This Period' },
          { val: `${winRate}%`, label: 'Win Rate' },
          { val: `${avgDealAge}d`, label: 'Avg Deal Age' },
          { val: stalled.length, label: 'Stalled Deals' },
        ].map(({ val, label }) => (
          <div key={label} style={{ ...S.statCard, ...(isMobile ? { padding: 14 } : {}) }}>
            <div style={{ ...S.statVal, ...(isMobile ? { fontSize: 22 } : {}) }}>{val}</div>
            <div style={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.chartSection, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Pipeline by Stage</div>
          {stageFunnel.map(({ stage, count, value }, i) => (
            <div key={stage} style={S.barRow}>
              <div style={S.barLabel}>{STAGE_LABELS[stage] || stage}</div>
              <div style={S.barTrack}>
                <div style={S.barFill(count / maxStageCount * 100, STAGE_COLORS[i % STAGE_COLORS.length])} />
              </div>
              <div style={S.barCount}>{count}</div>
              <div style={{ fontSize: 11, color: '#475569', width: 72, textAlign: 'right' }}>
                {fmt(value)}
              </div>
            </div>
          ))}
        </div>

        <div style={S.chartCard}>
          <div style={S.chartTitle}>Stall Reason Breakdown</div>
          {stallBreakdown.length === 0 && (
            <div style={{ color: '#475569', fontSize: 13 }}>No stalled deals</div>
          )}
          {stallBreakdown.map(([reason, count]) => (
            <div key={reason} style={S.barRow}>
              <div style={S.barLabel}>{STALL_LABELS[reason]}</div>
              <div style={S.barTrack}>
                <div style={S.barFill(count / maxStallCount * 100, STALL_COLORS[reason] || '#f97316')} />
              </div>
              <div style={S.barCount}>{count}</div>
              <div style={{ fontSize: 11, color: '#475569', width: 72, textAlign: 'right' }}>
                {fmt(stalled.filter(l => l.stallReason === reason).reduce((s, l) => s + l.value, 0))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #1e2535' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Total value at risk</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f97316' }}>{fmt(stalledValue)}</div>
          </div>
        </div>
      </div>

      {/* Export row — Business tier only in demo; always visible with upgrade nudge otherwise */}
      {tier !== undefined && (
        <div style={{
          marginTop: 24, display: 'flex', justifyContent: 'flex-end',
        }}>
          <DisabledTooltip
            active={tier !== 'business'}
            label={tier === 'business' ? '' : 'Export — Business feature. Click to upgrade.'}
          >
            <button
              onClick={() => tier === 'business' && window.location.href === void 0}
              style={{
                padding: '8px 20px',
                background: tier === 'business'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : '#1a1f2e',
                border: tier === 'business' ? 'none' : '1px solid #2d3748',
                borderRadius: 7, color: tier === 'business' ? '#fff' : '#475569',
                fontWeight: 600, fontSize: 13,
                cursor: tier === 'business' ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              {tier !== 'business' && <span>🔒</span>}
              Export Pipeline Report
            </button>
          </DisabledTooltip>
        </div>
      )}
    </div>
  );
}

// ─── Job Modal ────────────────────────────────────────────────────────────────
function JobModal({ job, onClose, customChecklist }) {
  const steps = TRADE_CHECKLISTS[job.trade]
    || (customChecklist ? customChecklist.map((label, i) => ({ id: i + 1, label })) : null)
    || TRADE_CHECKLISTS['Roofing'];
  const tradeColor = TRADE_COLORS[job.trade] || '#f97316';

  const [checks, setChecks] = useState(() => {
    const init = {};
    steps.forEach(s => {
      init[s.id] = job.completedSteps.includes(s.id)
        ? { done: true, ts: '2026-03-' + String(10 + s.id).padStart(2, '0') + ' 09:00' }
        : { done: false, ts: null };
    });
    return init;
  });

  const toggle = (id) => {
    setChecks(prev => {
      const wasDone = prev[id].done;
      return {
        ...prev,
        [id]: {
          done: !wasDone,
          ts: wasDone ? null : new Date().toISOString().slice(0, 16).replace('T', ' '),
        },
      };
    });
  };

  const doneCount = Object.values(checks).filter(c => c.done).length;
  const total = steps.length;
  const pct = Math.round(doneCount / total * 100);
  const statusColor = pct === 100 ? '#22c55e' : pct > 0 ? '#f97316' : '#6366f1';

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <button style={S.closeBtn} onClick={onClose}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={S.modalTitle}>{job.customer}</div>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
            background: statusColor + '22', color: statusColor,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {pct === 100 ? 'Complete' : pct > 0 ? 'In Progress' : 'Scheduled'}
          </span>
        </div>
        <div style={S.modalSub}>
          {job.address} · {fmt(job.value)}
        </div>
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            padding: '3px 10px', borderRadius: 10,
            background: tradeColor + '22', color: tradeColor,
            letterSpacing: '0.3px',
          }}>
            {job.trade}
          </span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{doneCount}/{total} steps — {pct}%</span>
          </div>
          <div style={S.progressTrack}>
            <div style={S.progressFill(pct, statusColor)} />
          </div>
        </div>

        <div style={S.sectionLabel}>Job Notes</div>
        <div style={{
          fontSize: 13, color: '#94a3b8', marginBottom: 20,
          padding: '10px 12px', background: '#0f1117', borderRadius: 6,
        }}>
          {job.notes}
        </div>

        <div style={S.sectionLabel}>{job.trade} Checklist</div>
        <div>
          {steps.map((step) => {
            const c = checks[step.id];
            return (
              <div key={step.id} style={S.checklistItem(c.done)} onClick={() => toggle(step.id)}>
                <div style={S.checkbox(c.done)}>
                  {c.done && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={S.checkLabel(c.done)}>
                  <span style={{ color: '#475569', marginRight: 6, fontSize: 11 }}>{step.id}.</span>
                  {step.label}
                </span>
                {c.ts && <span style={S.checkTs}>{c.ts}</span>}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16, fontSize: 11, color: '#374151', textAlign: 'center' }}>
          Scheduled: {job.scheduledDate}
        </div>
      </div>
    </div>
  );
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────
function JobsTab({ jobs, customChecklist }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');

  const statuses = ['all', 'Scheduled', 'In Progress', 'Complete'];

  const filtered = useMemo(() => {
    let result = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);
    if (tradeFilter !== 'all') result = result.filter(j => j.trade === tradeFilter);
    return result;
  }, [jobs, filter, tradeFilter]);

  const statusColor = (s) => ({ Scheduled: '#6366f1', 'In Progress': '#f97316', Complete: '#22c55e' }[s] || '#64748b');

  return (
    <div>
      <div style={S.filterRow}>
        {statuses.map(s => (
          <button key={s} style={S.filterBtn(filter === s)} onClick={() => setFilter(s)}>
            {s === 'all'
              ? `All (${jobs.length})`
              : `${s} (${jobs.filter(j => j.status === s).length})`}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8' }}>
          Total: <span style={{ color: '#f97316', fontWeight: 700, marginLeft: 4 }}>
            {fmt(filtered.reduce((s, j) => s + j.value, 0))}
          </span>
        </div>
      </div>

      <div style={S.tradeFilterRow}>
        <button
          style={S.tradeFilterBtn(tradeFilter === 'all', '#f97316')}
          onClick={() => setTradeFilter('all')}
        >
          All Trades
        </button>
        {TRADE_LIST.filter(t => jobs.some(j => j.trade === t)).map(t => (
          <button
            key={t}
            style={S.tradeFilterBtn(tradeFilter === t, TRADE_COLORS[t])}
            onClick={() => setTradeFilter(tradeFilter === t ? 'all' : t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={S.grid}>
        {filtered.map(job => {
          const steps = TRADE_CHECKLISTS[job.trade]
            || (customChecklist ? customChecklist.map((label, i) => ({ id: i + 1, label })) : null)
            || TRADE_CHECKLISTS['Roofing'];
          const doneCount = job.completedSteps.length;
          const total = steps.length;
          const pct = Math.round(doneCount / total * 100);
          const color = statusColor(job.status);
          const tradeColor = TRADE_COLORS[job.trade] || '#64748b';

          return (
            <div
              key={job.id}
              style={S.card(hovered === job.id)}
              onMouseEnter={() => setHovered(job.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelectedJob(job)}
            >
              <div style={S.cardHeader}>
                <div>
                  <div style={S.cardName}>{job.customer}</div>
                  <div style={S.cardContact}>{job.address}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: color + '22', color, textTransform: 'uppercase',
                  letterSpacing: '0.5px', whiteSpace: 'nowrap',
                }}>
                  {job.status}
                </span>
              </div>

              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 600,
                padding: '2px 8px', borderRadius: 10, marginBottom: 8,
                background: tradeColor + '22', color: tradeColor,
                letterSpacing: '0.3px',
              }}>
                {job.trade}
              </span>

              <div style={S.cardMeta}>
                <div style={S.metaItem}>Value: <span style={{ ...S.metaValue, color: '#22c55e' }}>{fmt(job.value)}</span></div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    {steps[doneCount < total ? doneCount : total - 1]?.label || 'Complete'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color }}>
                    {doneCount}/{total}
                  </span>
                </div>
                <div style={S.progressTrack}>
                  <div style={S.progressFill(pct, color)} />
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>
                📅 Scheduled: {job.scheduledDate}
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} customChecklist={customChecklist} />
      )}
    </div>
  );
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────
const DEMO_TEAM = [
  {
    id: 't1', name: 'Marcus Johnson', initials: 'MJ',
    color: '#6366f1', role: 'Senior Sales Rep', status: 'active',
    leads: 24, won: 8, lost: 3, winRate: 73,
    pipelineValue: 187400, revenue: 142000,
    callbacksDue: 6, avgDealAge: 28,
  },
  {
    id: 't2', name: 'Sara Chen', initials: 'SC',
    color: '#22c55e', role: 'Sales Rep', status: 'active',
    leads: 19, won: 9, lost: 2, winRate: 82,
    pipelineValue: 221600, revenue: 198500,
    callbacksDue: 3, avgDealAge: 21,
  },
  {
    id: 't3', name: 'Dale Russo', initials: 'DR',
    color: '#f97316', role: 'Sales Rep', status: 'away',
    leads: 11, won: 3, lost: 4, winRate: 43,
    pipelineValue: 94200, revenue: 67800,
    callbacksDue: 8, avgDealAge: 41,
  },
];

function TeamTab() {
  const [hovered, setHovered] = useState(null);
  const totals = {
    leads: DEMO_TEAM.reduce((s, r) => s + r.leads, 0),
    revenue: DEMO_TEAM.reduce((s, r) => s + r.revenue, 0),
    pipeline: DEMO_TEAM.reduce((s, r) => s + r.pipelineValue, 0),
    callbacks: DEMO_TEAM.reduce((s, r) => s + r.callbacksDue, 0),
  };

  return (
    <div style={{ padding: '0 2px' }}>
      {/* Summary bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24,
      }}>
        {[
          { label: 'Total Leads', value: totals.leads, color: '#6366f1' },
          { label: 'Pipeline Value', value: fmt(totals.pipeline), color: '#f97316' },
          { label: 'Revenue Closed', value: fmt(totals.revenue), color: '#22c55e' },
          { label: 'Callbacks Due', value: totals.callbacks, color: '#ef4444' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: '#161b27', border: '1px solid #1e2535', borderRadius: 10,
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Rep cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DEMO_TEAM.map(rep => (
          <div
            key={rep.id}
            style={{
              background: hovered === rep.id ? '#1a2035' : '#161b27',
              border: `1px solid ${hovered === rep.id ? rep.color + '44' : '#1e2535'}`,
              borderRadius: 12, padding: '16px 20px',
              display: 'grid', gridTemplateColumns: 'auto 1fr repeat(5, auto)',
              gap: 16, alignItems: 'center',
              transition: 'all 0.15s', cursor: 'default',
            }}
            onMouseEnter={() => setHovered(rep.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Avatar */}
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: rep.color + '22', border: `2px solid ${rep.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: rep.color, flexShrink: 0,
            }}>
              {rep.initials}
            </div>

            {/* Name + role */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                {rep.name}
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 10,
                  background: rep.status === 'active' ? '#22c55e22' : '#6b728022',
                  color: rep.status === 'active' ? '#22c55e' : '#6b7280',
                  border: `1px solid ${rep.status === 'active' ? '#22c55e33' : '#6b728033'}`,
                }}>
                  {rep.status === 'active' ? 'Active' : 'Away'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{rep.role}</div>
            </div>

            {/* Stats */}
            {[
              { label: 'Leads', value: rep.leads, color: '#94a3b8' },
              { label: 'Win Rate', value: `${rep.winRate}%`, color: rep.winRate >= 70 ? '#22c55e' : rep.winRate >= 50 ? '#f97316' : '#ef4444' },
              { label: 'Pipeline', value: fmt(rep.pipelineValue), color: '#f97316' },
              { label: 'Closed Revenue', value: fmt(rep.revenue), color: '#22c55e' },
              { label: 'Callbacks Due', value: rep.callbacksDue, color: rep.callbacksDue > 5 ? '#ef4444' : '#94a3b8' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Auth Styles ─────────────────────────────────────────────────────────────
const A = {
  page: {
    minHeight: '100vh',
    background: '#0f1117',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    background: '#161b27',
    border: '1px solid #1e2535',
    borderRadius: 16,
    padding: '40px 40px',
    width: '100%',
    maxWidth: 440,
  },
  logo: {
    fontSize: 28,
    fontWeight: 800,
    color: '#f97316',
    letterSpacing: '-1px',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 36,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: '#0f1117',
    border: '1px solid #1e2535',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputFocus: {
    border: '1px solid #f97316',
  },
  btn: {
    width: '100%',
    padding: '11px 16px',
    marginTop: 24,
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.2px',
  },
  btnSecondary: {
    width: '100%',
    padding: '11px 16px',
    marginTop: 10,
    background: 'transparent',
    border: '1px solid #1e2535',
    borderRadius: 8,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: '#475569',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#f97316',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
  },
  error: {
    marginTop: 14,
    padding: '10px 12px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 8,
    color: '#ef4444',
    fontSize: 12,
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  stepDot: (active, done) => ({
    width: active ? 24 : 8,
    height: 8,
    borderRadius: 4,
    background: done ? '#f97316' : active ? '#f97316' : '#1e2535',
    transition: 'all 0.2s',
  }),
  stepTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 24,
  },
  tradeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    marginBottom: 24,
    maxHeight: 340,
    overflowY: 'auto',
    paddingRight: 4,
  },
  tradeCard: (selected, color) => ({
    padding: '10px 8px',
    borderRadius: 8,
    border: `1px solid ${selected ? color : '#1e2535'}`,
    background: selected ? color + '18' : '#0f1117',
    color: selected ? color : '#64748b',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: selected ? 600 : 400,
    textAlign: 'center',
    transition: 'all 0.12s',
  }),
  planGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginBottom: 24,
  },
  planCard: (selected) => ({
    padding: '20px 16px',
    borderRadius: 10,
    border: `2px solid ${selected ? '#f97316' : '#1e2535'}`,
    background: selected ? 'rgba(249,115,22,0.06)' : '#0f1117',
    cursor: 'pointer',
    transition: 'all 0.12s',
    position: 'relative',
  }),
  planName: { fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  planPrice: { fontSize: 22, fontWeight: 800, color: '#f97316', marginBottom: 12 },
  planPriceSub: { fontSize: 11, color: '#475569', fontWeight: 400 },
  planFeature: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 5,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
  },
  planCheck: { color: '#22c55e', fontWeight: 700, flexShrink: 0 },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#f97316',
    color: '#fff',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 10px',
    borderRadius: 10,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    features: ['Up to 25 active leads', '1 trade checklist', 'Job progress tracking', 'Basic analytics', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    popular: true,
    features: ['Unlimited leads', 'All 26 trades', 'AI coaching (Claude)', 'Advanced analytics', 'Callbacks & reminders', 'Priority support'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '$149',
    features: ['Everything in Pro', 'Multi-user access', 'Team analytics', 'Custom checklist steps', 'Dedicated account manager', 'API access'],
  },
];

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onStartSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'demo@ridgeos.com' && password === 'demo123') {
      onLogin({ isDemo: true, companyName: 'RidgeOS', userName: 'Demo User', trade: 'Roofing', plan: 'pro' });
    } else if (email && password) {
      setError('Incorrect email or password. Try demo@ridgeos.com / demo123');
    } else {
      setError('Please enter your email and password.');
    }
  };

  const inputStyle = (field) => ({
    ...A.input,
    ...(focusedField === field ? A.inputFocus : {}),
  });

  return (
    <div style={A.page}>
      <div style={A.card}>
        <div style={A.logo}>RidgeOS</div>
        <div style={A.tagline}>The operating system for your roofing business.</div>

        <form onSubmit={handleSubmit}>
          <label style={A.label}>Email</label>
          <input
            style={inputStyle('email')}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            autoComplete="email"
          />

          <label style={A.label}>Password</label>
          <input
            style={inputStyle('password')}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            autoComplete="current-password"
          />

          {error && <div style={A.error}>{error}</div>}

          <button style={A.btn} type="submit">Sign In</button>
        </form>

        <div style={A.link}>
          New here?{' '}
          <button style={A.linkBtn} onClick={onStartSignup}>Create an account</button>
        </div>
      </div>
    </div>
  );
}

// ─── Onboarding Flow ──────────────────────────────────────────────────────────
function OnboardingFlow({ onComplete, onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm] = useState({
    companyName: '', userName: '', email: '', password: '',
    trade: '', plan: 'pro',
  });
  const [errors, setErrors] = useState({});
  const [customTradeInput, setCustomTradeInput] = useState('');
  const [customTradeConfig, setCustomTradeConfig] = useState(null);
  const [customTradeLoading, setCustomTradeLoading] = useState(false);
  const [customTradeError, setCustomTradeError] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const inputStyle = (field) => ({
    ...A.input,
    ...(focusedField === field ? A.inputFocus : {}),
    ...(errors[field] ? { border: '1px solid #ef4444' } : {}),
  });

  const validateStep1 = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = true;
    if (!form.userName.trim()) e.userName = true;
    if (!form.email.trim()) e.email = true;
    if (form.password.length < 6) e.password = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !form.trade) {
      setErrors({ trade: true });
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleGenerateCustomTrade = async () => {
    const tradeName = customTradeInput.trim();
    if (!tradeName) return;
    setCustomTradeLoading(true);
    setCustomTradeError('');
    setCustomTradeConfig(null);
    try {
      const res = await fetch('/api/custom-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCustomTradeError(data.error || "Couldn't generate that trade — try being more specific.");
      } else {
        setCustomTradeConfig(data);
        set('trade', tradeName);
        setErrors({});
      }
    } catch {
      setCustomTradeError("Couldn't generate that trade — try being more specific.");
    } finally {
      setCustomTradeLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete({
      isDemo: false,
      companyName: form.companyName,
      userName: form.userName,
      email: form.email,
      trade: form.trade,
      plan: form.plan,
      customTradeConfig: customTradeConfig || null,
    });
  };

  return (
    <div style={A.page}>
      <div style={{ ...A.card, maxWidth: step === 2 ? 560 : step === 3 ? 720 : 440 }}>
        <div style={A.logo}>RidgeOS</div>

        <div style={A.stepIndicator}>
          {[1, 2, 3].map(n => (
            <div key={n} style={A.stepDot(step === n, step > n)} />
          ))}
        </div>

        {/* ── Step 1: Company Info ── */}
        {step === 1 && (
          <>
            <div style={A.stepTitle}>Set up your account</div>
            <div style={A.stepSub}>Just a few details to get started.</div>

            <label style={A.label}>Company name</label>
            <input
              style={inputStyle('companyName')}
              placeholder="Apex Roofing LLC"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              onFocus={() => setFocusedField('companyName')}
              onBlur={() => setFocusedField(null)}
            />

            <label style={A.label}>Your name</label>
            <input
              style={inputStyle('userName')}
              placeholder="Jane Smith"
              value={form.userName}
              onChange={e => set('userName', e.target.value)}
              onFocus={() => setFocusedField('userName')}
              onBlur={() => setFocusedField(null)}
            />

            <label style={A.label}>Email</label>
            <input
              style={inputStyle('email')}
              type="email"
              placeholder="jane@apexroofing.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />

            <label style={A.label}>Password</label>
            <input
              style={inputStyle('password')}
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />

            {errors.password && (
              <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6 }}>
                Password must be at least 6 characters.
              </div>
            )}
            {(errors.companyName || errors.userName || errors.email) && (
              <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6 }}>
                Please fill in all fields.
              </div>
            )}

            <button style={A.btn} onClick={handleNext}>Next →</button>
            <div style={A.link}>
              Already have an account?{' '}
              <button style={A.linkBtn} onClick={onBackToLogin}>Sign in</button>
            </div>
          </>
        )}

        {/* ── Step 2: Pick Trade ── */}
        {step === 2 && (
          <>
            <div style={A.stepTitle}>What's your trade?</div>
            <div style={A.stepSub}>
              {errors.trade
                ? <span style={{ color: '#ef4444' }}>Please select your trade to continue.</span>
                : 'Select the trade you primarily work in.'}
            </div>

            <div style={A.tradeGrid}>
              {TRADE_LIST.map(trade => (
                <div
                  key={trade}
                  style={A.tradeCard(form.trade === trade, TRADE_COLORS[trade])}
                  onClick={() => { set('trade', trade); setErrors({}); setCustomTradeConfig(null); setShowCustomInput(false); }}
                >
                  {trade}
                </div>
              ))}
            </div>

            {/* Custom trade section */}
            {!showCustomInput ? (
              <button
                onClick={() => { setShowCustomInput(true); setErrors({}); }}
                style={{
                  width: '100%', marginBottom: 16, padding: '9px 12px',
                  background: 'transparent',
                  border: '1px dashed #2d3748',
                  borderRadius: 8, color: '#64748b',
                  fontSize: 13, cursor: 'pointer', textAlign: 'center',
                }}
              >
                ✨ My trade isn't listed — generate it with AI
              </button>
            ) : (
              <div style={{
                background: '#0f1117', border: '1px solid #1e2535',
                borderRadius: 8, padding: '14px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>
                  ✨ Custom Trade Generator
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    value={customTradeInput}
                    onChange={e => { setCustomTradeInput(e.target.value); setCustomTradeError(''); }}
                    placeholder="e.g. Tile Setter, Irrigation, Sign Hanging"
                    style={{
                      ...A.input, flex: 1, fontSize: 13, padding: '9px 12px',
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleGenerateCustomTrade()}
                  />
                  <button
                    onClick={handleGenerateCustomTrade}
                    disabled={customTradeLoading || !customTradeInput.trim()}
                    style={{
                      padding: '9px 16px',
                      background: customTradeLoading ? '#1e2535' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      border: 'none', borderRadius: 7,
                      color: customTradeLoading ? '#64748b' : '#fff',
                      fontWeight: 700, fontSize: 13,
                      cursor: customTradeLoading || !customTradeInput.trim() ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {customTradeLoading ? '⟳ Generating…' : 'Generate'}
                  </button>
                </div>
                {customTradeError && (
                  <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 6 }}>{customTradeError}</div>
                )}
                {customTradeConfig && (
                  <div style={{ fontSize: 11, color: '#22c55e', marginBottom: 6 }}>
                    ✓ Trade "{form.trade}" generated — {customTradeConfig.checklist.length} checklist steps, {customTradeConfig.pipeline.length} pipeline stages
                  </div>
                )}
              </div>
            )}

            <button style={A.btn} onClick={handleNext}>Next →</button>
            <button style={A.btnSecondary} onClick={() => setStep(1)}>← Back</button>
          </>
        )}

        {/* ── Step 3: Pick Plan ── */}
        {step === 3 && (
          <>
            <div style={A.stepTitle}>Choose your plan</div>
            <div style={A.stepSub}>All plans include a 14-day free trial. No card required.</div>

            <div style={A.planGrid}>
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  style={A.planCard(form.plan === plan.id)}
                  onClick={() => set('plan', plan.id)}
                >
                  {plan.popular && <div style={A.popularBadge}>Most Popular</div>}
                  <div style={A.planName}>{plan.name}</div>
                  <div style={A.planPrice}>
                    {plan.price}
                    <span style={A.planPriceSub}>/mo</span>
                  </div>
                  {plan.features.map(f => (
                    <div key={f} style={A.planFeature}>
                      <span style={A.planCheck}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button style={A.btn} onClick={handleComplete}>Start Free Trial →</button>
            <button style={A.btnSecondary} onClick={() => setStep(2)}>← Back</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, sub, btnLabel, onAction }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 28, maxWidth: 320 }}>{sub}</div>
      <button
        style={{
          padding: '10px 24px',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          border: 'none', borderRadius: 8,
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}
        onClick={onAction}
      >
        {btnLabel}
      </button>
    </div>
  );
}

// ─── Demo Page ────────────────────────────────────────────────────────────────
const TRADE_ICONS = {
  'Roofing': '🏠', 'Gutters': '🌧', 'Siding': '🏗', 'Windows': '🪟',
  'Excavation': '🚜', 'General Construction': '🏢', 'HVAC': '❄️', 'Plumbing': '🔧',
  'Welding': '⚙️', 'Electrical': '🔌', 'Masonry': '🧱', 'Painting': '🎨',
  'Flooring': '🪵', 'Insulation': '🛡', 'Drywall': '🔨', 'Landscaping': '🌿',
  'Concrete': '🏛', 'Fencing': '🚧', 'Carpentry': '🪚', 'Waterproofing': '💧',
  'Solar': '☀️', 'Garage Doors': '🚪', 'Demolition': '💥', 'Septic': '⚗️',
  'Tree Service': '🌳', 'Pressure Washing': '💦',
  'Seal Coating': '🛣️', 'Real Estate': '🏡',
};

// compact lead builder
const dl = (id, name, contact, role, status, value, stage, callbackDate, stallReason, notes, industry, dealAge, trade) => ({
  id: `dl_${id}`, name, contact, role, trade, status, value, stage,
  callbackDate, lastContact: '2026-03-20', stallReason, notes,
  industry, dealAge, phone: '', source: 'Referral',
});
// compact job builder
const dj = (id, customer, address, trade, value, status, scheduledDate, completedSteps, notes) => ({
  id: `dj_${id}`, customer, address, trade, value, status, scheduledDate, completedSteps, notes,
});

const TRADE_DEMO_DATA = {
  'Roofing': {
    leads: [
      dl(1,'Hargrove Residence','Frank Hargrove','Homeowner','active',18400,'estimate','2026-03-25',null,'GAF Timberline HDZ preferred. Wants 50yr warranty. Demo well received.','Residential',12,'Roofing'),
      dl(2,'Westside Church of God','Pastor James Willis','Facilities Coord','stalled',34700,'approved','2026-03-23','budget_freeze','Commercial flat roof, 11,000 sq ft. Full board approval needed.','Institutional',41,'Roofing'),
      dl(3,'Sunridge HOA Phase II','Linda Marsh','HOA President','active',52000,'inspection','2026-03-27',null,'28 townhome units. Insurance claim approved. Scheduling crew now.','HOA',8,'Roofing'),
      dl(4,'Kowalski Residence','Brian Kowalski','Homeowner','stalled',11200,'estimate','2026-03-19','no_response','3 calls, 2 emails. Visible hail damage. Try door knock.','Residential',29,'Roofing'),
      dl(5,'Clearbrook Office Plaza','Diane Okafor','Property Manager','active',41500,'approved','2026-03-26',null,'TPO membrane, 14,000 sq ft. Contract review underway.','Commercial',19,'Roofing'),
      dl(6,'Torres Residence','Miguel Torres','Homeowner','stalled',9800,'estimate','2026-03-22','price_objection','Got a bid $2k lower. Need to justify value difference.','Residential',33,'Roofing'),
      dl(7,'Lakewood Elementary','Tom Hensley','Facilities Director','cold',78000,'lead','2026-04-15','timing','Large job. School board vote in April. Stay warm.','Institutional',53,'Roofing'),
      dl(8,'Patel Residence','Raj Patel','Homeowner','won',14600,'completed',null,null,'Closed! CertainTeed Landmark Pro. Crew starts 3/26.','Residential',24,'Roofing'),
      dl(9,'Morrison Auto Group','Steve Morrison','Owner','stalled',27300,'approved','2026-03-24','competitor','Getting 3 bids. Push warranty + crew experience.','Commercial',37,'Roofing'),
      dl(10,'Riverside Church','Pastor Rick Adams','Admin Director','lost',23400,'lost',null,'competitor','Lost to church-network contractor.','Institutional',61,'Roofing'),
    ],
    jobs: [
      dj(1,'Frank & Linda Hargrove','2847 Maplewood Dr, Austin TX 78745','Roofing',18400,'In Progress','2026-03-20',[1,2,3,4,5],'GAF Timberline HDZ. Tear-off done. New roof going on today.'),
      dj(2,'Raj & Priya Patel','1108 Cedar Ridge Ln, Austin TX 78731','Roofing',14600,'Scheduled','2026-03-26',[1,2],'CertainTeed Landmark Pro. Materials on site.'),
      dj(3,'Sunridge HOA Block A','3300 Sunridge Pkwy, San Antonio TX 78230','Roofing',24500,'Complete','2026-03-12',[1,2,3,4,5,6,7,8,9],'12 units Phase I. Signed off and paid.'),
      dj(4,'Clearbrook Office Plaza','501 Commerce Dr, Dallas TX 75201','Roofing',41500,'In Progress','2026-03-18',[1,2,3],'TPO membrane, 14,000 sq ft. Underlayment next.'),
      dj(5,'Morrison Auto Group','7700 Auto Row Blvd, Plano TX 75093','Roofing',27300,'Scheduled','2026-04-02',[1],'3-bay commercial metal roof. Crew set for post-Easter.'),
    ],
  },
  'Gutters': {
    leads: [
      dl(1,'Whitfield Residence','Carol Whitfield','Homeowner','active',3200,'estimate','2026-03-25',null,'K-style aluminum, 180 linear ft. Wants leaf guards too.','Residential',7,'Gutters'),
      dl(2,'Maple Creek HOA','Dan Sorenson','HOA Manager','active',8400,'inspection','2026-03-27',null,'14 units, all need gutter replacement. New construction.','HOA',11,'Gutters'),
      dl(3,'Brennan Residence','Pat Brennan','Homeowner','stalled',2600,'estimate','2026-03-20','price_objection','Competitor quoted $400 less. Explain quality difference.','Residential',22,'Gutters'),
      dl(4,'Valley Office Park','Greg Nguyen','Property Manager','active',5800,'approved','2026-03-26',null,'48-unit commercial building. Half-round copper on historic facade.','Commercial',16,'Gutters'),
      dl(5,'Kim Residence','Susan Kim','Homeowner','stalled',1900,'lead','2026-03-19','no_response','Called twice. Storm damage visible in photos she sent.','Residential',18,'Gutters'),
      dl(6,'Riverside Apartments','Josh Tanner','Maintenance Dir','cold',12000,'lead','2026-04-10','timing','HOA budget not approved until April meeting.','Commercial',34,'Gutters'),
      dl(7,'Okafor Residence','Emeka Okafor','Homeowner','won',3800,'completed',null,null,'Closed! Seamless aluminum + guards. Job next week.','Residential',14,'Gutters'),
      dl(8,'Lakeview Church','Deacon Willis','Facilities','stalled',4400,'estimate','2026-03-22','budget_freeze','Waiting on spring maintenance budget release.','Institutional',28,'Gutters'),
      dl(9,'Parks Residence','Tom Parks','Homeowner','lost',2200,'lost',null,'competitor','DIY job. Bought gutters at hardware store.','Residential',31,'Gutters'),
    ],
    jobs: [
      dj(1,'Carol & Mike Whitfield','412 Pinecrest Dr, Frisco TX 75034','Gutters',3200,'In Progress','2026-03-21',[1,2,3,4],'K-style aluminum. Old gutters off, new going up today.'),
      dj(2,'Emeka Okafor','2204 Birchwood Ct, Plano TX 75025','Gutters',3800,'Scheduled','2026-03-28',[1,2],'Seamless aluminum + leaf guards. Materials ordered.'),
      dj(3,'Maple Creek HOA — Phase 1','800 Maple Creek Blvd, McKinney TX 75070','Gutters',8400,'In Progress','2026-03-17',[1,2,3,4,5,6],'7 of 14 units complete. Second half starting Thursday.'),
      dj(4,'Valley Office Park','3300 Commerce Pkwy, Irving TX 75038','Gutters',5800,'Complete','2026-03-10',[1,2,3,4,5,6,7,8,9],'Half-round copper. Fully installed, sealed, and paid.'),
    ],
  },
  'Siding': {
    leads: [
      dl(1,'Henderson Residence','Bill Henderson','Homeowner','active',22400,'estimate','2026-03-25',null,'Hardie plank, full exterior. Storm damage on south wall.','Residential',14,'Siding'),
      dl(2,'Northgate Condo Assoc','Rhonda Bass','HOA Director','stalled',68000,'approved','2026-03-23','budget_freeze','32-unit complex. Board vote needed. Big job.','HOA',45,'Siding'),
      dl(3,'Garcia Residence','Maria Garcia','Homeowner','active',16800,'inspection','2026-03-27',null,'Vinyl siding replacement. Interested in insulated option.','Residential',9,'Siding'),
      dl(4,'Crossroads Medical Bldg','Don Frazier','Facilities Dir','stalled',41200,'estimate','2026-03-20','no_response','Submitted quote 3 weeks ago. Follow up with FM.','Commercial',36,'Siding'),
      dl(5,'Yamamoto Residence','Ken Yamamoto','Homeowner','stalled',19500,'estimate','2026-03-22','price_objection','Competitor at $3k less. Emphasize warranty & install quality.','Residential',28,'Siding'),
      dl(6,'Westbrook Townhomes','Chad Miller','Property Manager','cold',54000,'lead','2026-04-08','timing','20 units, exterior update deferred to Q3.','Commercial',41,'Siding'),
      dl(7,'Pham Residence','Linda Pham','Homeowner','won',14900,'completed',null,null,'Closed! Hardie plank, Arctic White. Crew 3/30.','Residential',18,'Siding'),
      dl(8,'Sunrise Retail Strip','Art Delgado','Owner','stalled',31000,'approved','2026-03-24','competitor','3rd bid in. Our price is highest — push warranty story.','Commercial',39,'Siding'),
      dl(9,'Cooper Residence','James Cooper','Homeowner','lost',18200,'lost',null,'competitor','Lost on price. Went with lower bid.','Residential',52,'Siding'),
    ],
    jobs: [
      dj(1,'Bill & Cheryl Henderson','4418 Ridgeway Dr, Garland TX 75040','Siding',22400,'In Progress','2026-03-19',[1,2,3,4],'Hardie plank, south wall complete. Wrapping remaining 3 sides.'),
      dj(2,'Linda Pham','918 Elmwood Ave, Dallas TX 75208','Siding',14900,'Scheduled','2026-03-30',[1,2],'Materials ordered. Arctic White Hardie plank on site.'),
      dj(3,'Northgate Condo — Bldg A','200 Northgate Blvd, Lewisville TX 75067','Siding',68000,'In Progress','2026-03-14',[1,2,3,4,5],'8 of 32 units done. On schedule for 3-week completion.'),
      dj(4,'Garcia Residence','3310 Sunflower Ln, Mesquite TX 75150','Siding',16800,'Scheduled','2026-04-05',[1,2,3],'Insulated vinyl. Old siding removal scheduled 4/5.'),
    ],
  },
  'Windows': {
    leads: [
      dl(1,'Martinez Residence','Rosa Martinez','Homeowner','active',18700,'inspection','2026-03-25',null,'12 windows, Anderson 400 series. Energy upgrade.','Residential',9,'Windows'),
      dl(2,'Lakeview Office Tower','Diana Chu','Property Manager','stalled',94000,'approved','2026-03-23','budget_freeze','Floor 4-6 full replacement. Q2 budget approval needed.','Commercial',52,'Windows'),
      dl(3,'Nelson Residence','Greg Nelson','Homeowner','active',11400,'estimate','2026-03-27',null,'8 double-hungs + 2 picture windows. Storm damage claim.','Residential',13,'Windows'),
      dl(4,'Westside School District','Carl Jennings','Facilities Dir','stalled',128000,'estimate','2026-03-20','timing','3 school buildings. Bond measure vote in May.','Institutional',61,'Windows'),
      dl(5,'Osei Residence','Kwame Osei','Homeowner','stalled',14200,'estimate','2026-03-22','price_objection','Wants Pella but balking at price. Show lifetime value.','Residential',24,'Windows'),
      dl(6,'Ridgecrest Apartments','Tony Daves','Property Manager','cold',42000,'lead','2026-04-12','timing','28 units, window upgrade. Wait for lease renewals.','Commercial',38,'Windows'),
      dl(7,'Flynn Residence','Kate Flynn','Homeowner','won',9800,'completed',null,null,'Closed! 6 casements. Crew scheduled 4/1.','Residential',17,'Windows'),
      dl(8,'Horizon Hotel','Mark Steele','GM','stalled',76000,'approved','2026-03-24','competitor','3 bids in. Push the thermal performance data.','Commercial',44,'Windows'),
      dl(9,'Thomas Residence','Ben Thomas','Homeowner','lost',13500,'lost',null,'competitor','Went with big box store installer.','Residential',40,'Windows'),
    ],
    jobs: [
      dj(1,'Rosa & Carlos Martinez','91 Birchwood Ct, Dallas TX 75208','Windows',18700,'Complete','2026-03-14',[1,2,3,4,5,6,7,8,9],'Anderson 400, 12 windows. All sealed and inspected.'),
      dj(2,'Kate & Brian Flynn','5522 Willow Ridge Rd, Coppell TX 75019','Windows',9800,'Scheduled','2026-04-01',[1,2],'6 casements. Frames prepped. Install 4/1.'),
      dj(3,'Greg Nelson','2108 Creekside Dr, Rockwall TX 75087','Windows',11400,'In Progress','2026-03-22',[1,2,3,4],'8 double-hungs done. 2 picture windows going in today.'),
      dj(4,'Lakeview Office Tower — Fl 4','4400 Lake Tower Dr, Irving TX 75038','Windows',94000,'In Progress','2026-03-10',[1,2,3,4,5],'Floor 4 complete, Floor 5 in progress.'),
    ],
  },
  'Excavation': {
    leads: [
      dl(1,'Riverside Development Site','Greg Patterson','Project Manager','active',78000,'inspection','2026-03-25',null,'Site clearing and grading for 14-lot subdivision.','Commercial',18,'Excavation'),
      dl(2,'Summit Commercial Park','Lena Vasquez','Developer','stalled',142000,'approved','2026-03-23','budget_freeze','40-acre site prep. Bank financing pending.','Commercial',54,'Excavation'),
      dl(3,'Clearwater Estates','Bob Fry','Developer','active',55000,'estimate','2026-03-27',null,'22-lot residential cut and fill. Drainage plan approved.','Commercial',12,'Excavation'),
      dl(4,'Highway 183 Retail','Diane Moss','Site PM','stalled',89000,'estimate','2026-03-20','no_response','Sent bid 2 weeks ago. GC is unresponsive.','Commercial',41,'Excavation'),
      dl(5,'Lakeland Church Campus','Rev. Tim Carroll','Admin','stalled',38000,'estimate','2026-03-22','price_objection','Our bid $12k over. Scope creep in their mind.','Institutional',33,'Excavation'),
      dl(6,'Northview Business Park','Carl Stein','Developer','cold',210000,'lead','2026-05-01','timing','Large project. Permits not approved until Q3.','Commercial',62,'Excavation'),
      dl(7,'Mesa Verde HOA','Sandra Hill','Board President','won',31000,'completed',null,null,'Closed! Retention pond excavation starts 4/7.','HOA',22,'Excavation'),
      dl(8,'Toro Industrial Site','Ray Toro','Plant Manager','stalled',67000,'approved','2026-03-24','competitor','Two other bids in. Lowest by $8k.','Industrial',38,'Excavation'),
      dl(9,'Sunrise School Dist','Phil Long','Facilities Dir','lost',44000,'lost',null,'competitor','Lost to in-county contractor on public bid.','Institutional',71,'Excavation'),
    ],
    jobs: [
      dj(1,'Clearwater Estates — Phase 1','FM 423 & Eldorado Pkwy, Frisco TX 75033','Excavation',55000,'In Progress','2026-03-15',[1,2,3,4],'22-lot cut and fill. Grade work 60% complete.'),
      dj(2,'Mesa Verde HOA Retention Pond','900 Mesa Verde Dr, Keller TX 76248','Excavation',31000,'Scheduled','2026-04-07',[1,2],'Permits pulled. Equipment mobilizes 4/7.'),
      dj(3,'Riverside Development — Lots 1-14','Riverside Pkwy & CR 380, Denton TX 76208','Excavation',78000,'In Progress','2026-03-08',[1,2,3,4,5],'Site cleared. Grading in progress on north half.'),
      dj(4,'Summit Commercial Park Pad A','Industrial Blvd, Grand Prairie TX 75050','Excavation',142000,'Scheduled','2026-04-14',[1,2,3],'Permits approved. Equipment staged.'),
    ],
  },
  'General Construction': {
    leads: [
      dl(1,'Westview HOA Clubhouse','Susan Park','HOA President','active',94000,'inspection','2026-03-27',null,'2,400 sq ft community center addition. Board vote 3/28.','HOA',18,'General Construction'),
      dl(2,'Bay City Urgent Care','Dr. Amir Fahad','Owner','stalled',178000,'approved','2026-03-23','budget_freeze','3,200 sq ft medical build-out. SBA loan in process.','Commercial',55,'General Construction'),
      dl(3,'Sunrise Senior Living Wing B','Andrew Mills','Exec Dir','active',262000,'estimate','2026-03-26',null,'40-room wing renovation. Full scope approved.','Institutional',22,'General Construction'),
      dl(4,'Cornerstone Church Addition','Pastor Dale Ruiz','Admin','stalled',145000,'estimate','2026-03-20','timing','Sanctuary expansion. Congregation vote in April.','Institutional',48,'General Construction'),
      dl(5,'Riverdale Shopping Center','Pam Novak','Asset Manager','stalled',88000,'estimate','2026-03-22','no_response','4-suite interior rework. Haven\'t heard back in 3 weeks.','Commercial',36,'General Construction'),
      dl(6,'Hilltop Brewery Expansion','Chris Roth','Owner','active',52000,'approved','2026-03-25',null,'Taproom expansion + patio. Permits in hand. Near close.','Commercial',14,'General Construction'),
      dl(7,'Lakeside Fire Station','Chief Pat Moore','City Admin','cold',310000,'lead','2026-05-15','timing','City budget item. RFP not out until May.','Institutional',71,'General Construction'),
      dl(8,'Verde Office Conversion','Tom Lewin','Owner','won',67000,'completed',null,null,'Closed! Warehouse-to-office conversion starts 4/3.','Commercial',27,'General Construction'),
      dl(9,'Atlas Fitness Center','Gina Cruz','Owner','lost',114000,'lost',null,'competitor','Lost on bid. GC with existing relationship won.','Commercial',62,'General Construction'),
    ],
    jobs: [
      dj(1,'Verde Office Conversion','4400 Industrial Blvd, Dallas TX 75207','General Construction',67000,'In Progress','2026-03-18',[1,2,3,4],'Framing complete. Mechanicals rough-in underway.'),
      dj(2,'Hilltop Brewery Taproom','2210 Commerce St, Fort Worth TX 76102','General Construction',52000,'In Progress','2026-03-11',[1,2,3,4,5],'Steel frame up. Drywall crew starting Monday.'),
      dj(3,'Westview HOA Clubhouse','5500 Westview Commons, Irving TX 75038','General Construction',94000,'Scheduled','2026-04-07',[1,2,3],'Permits pulled. Site prep begins 4/7.'),
      dj(4,'Sunrise Senior Living Wing B','1100 Sunrise Blvd, Garland TX 75040','General Construction',262000,'In Progress','2026-02-25',[1,2,3,4,5,6],'40 rooms. Drywall finishing underway. On schedule.'),
      dj(5,'Bay City Urgent Care','8800 Bay City Dr, Plano TX 75024','General Construction',178000,'Scheduled','2026-04-21',[1,2],'SBA loan approved. Permits in process.'),
    ],
  },
  'HVAC': {
    leads: [
      dl(1,'Greenfield Office Park','Dana Nguyen','Property Manager','stalled',23500,'approved','2026-03-24','budget_freeze','Carrier 5-ton rooftop. Q1 budget locked. Revisit April.','Commercial',38,'HVAC'),
      dl(2,'Ridgecrest Elementary','Carl Beck','Facilities Dir','active',44000,'inspection','2026-03-27',null,'8 classroom units + 1 main office. Full replacement.','Institutional',14,'HVAC'),
      dl(3,'Johnson Residence','Tim Johnson','Homeowner','active',8900,'estimate','2026-03-25',null,'4-ton Lennox split system. Existing unit is 18 years old.','Residential',10,'HVAC'),
      dl(4,'Sunrise Fitness Club','Marco Lane','Owner','stalled',31200,'estimate','2026-03-20','price_objection','Commercial package unit. $4k over their budget. Trim scope.','Commercial',29,'HVAC'),
      dl(5,'Northview Apartments','Chad Ross','Property Manager','stalled',18400,'estimate','2026-03-22','no_response','16 units need replacement. Sent proposal, no reply.','Commercial',33,'HVAC'),
      dl(6,'Lakeside Church','Deacon Paul Smith','Admin','cold',27000,'lead','2026-04-20','timing','Sanctuary + 6 classrooms. HVAC budget next fiscal year.','Institutional',51,'HVAC'),
      dl(7,'Porter Residence','Amy Porter','Homeowner','won',7600,'completed',null,null,'Closed! Trane 3.5-ton install. Crew 3/27.','Residential',16,'HVAC'),
      dl(8,'Metro Data Center','IT Director Brad Lee','Facilities','stalled',86000,'approved','2026-03-24','competitor','Precision cooling for server room. 2 other bids in.','Commercial',47,'HVAC'),
      dl(9,'Clearwater Hotel','GM Lisa Cole','Operations','lost',38000,'lost',null,'competitor','Lost — existing HVAC contractor locked in long-term.','Commercial',58,'HVAC'),
    ],
    jobs: [
      dj(1,'Greenfield Office Park — Suite A','510 Oak Creek Blvd, Houston TX 77084','HVAC',23500,'Scheduled','2026-03-28',[1,2],'Carrier 5-ton rooftop. Unit on order. Install 3/28.'),
      dj(2,'Amy & Kevin Porter','6610 Meadowlark Dr, Sugar Land TX 77479','HVAC',7600,'Complete','2026-03-19',[1,2,3,4,5,6,7,8,9,10],'Trane 3.5-ton. Installed, charged, tested. Paid.'),
      dj(3,'Ridgecrest Elementary','4400 Ridgecrest Blvd, Katy TX 77450','HVAC',44000,'In Progress','2026-03-12',[1,2,3,4,5],'5 of 9 units installed. Ductwork for main office next.'),
      dj(4,'Tim & Sarah Johnson','2812 Woodridge Ln, The Woodlands TX 77380','HVAC',8900,'Scheduled','2026-04-03',[1,2],'Lennox 4-ton. Old unit scheduled for removal 4/3.'),
    ],
  },
  'Plumbing': {
    leads: [
      dl(1,'Sunridge Apartments','Todd Whitfield','Building Manager','stalled',11400,'estimate','2026-03-19','no_response','24-unit re-pipe. 3 follow-ups. No reply.','Commercial',41,'Plumbing'),
      dl(2,'Fischer Residence','Jack Fischer','Homeowner','active',4800,'estimate','2026-03-25',null,'Full re-pipe, galvanized to PEX. Insurance approved.','Residential',12,'Plumbing'),
      dl(3,'Clearview Restaurant','Owner Mike Holt','Owner','stalled',8700,'approved','2026-03-23','price_objection','Grease trap + kitchen rough-in. $1,800 over budget.','Commercial',27,'Plumbing'),
      dl(4,'Meadowbrook HOA Clubhouse','Tina Marsh','HOA Mgr','active',6200,'inspection','2026-03-27',null,'Fixture replacement + water heater upgrade.','HOA',9,'Plumbing'),
      dl(5,'Hillcrest Medical Office','Office Mgr Pat Ray','Admin','active',14300,'approved','2026-03-26',null,'New exam room rough-in + 2 bathrooms. Near close.','Commercial',16,'Plumbing'),
      dl(6,'Chen Residence','Linda Chen','Homeowner','stalled',3200,'estimate','2026-03-22','budget_freeze','Water heater replacement delayed until tax return.','Residential',22,'Plumbing'),
      dl(7,'Riverside School Dist','Facilities Dir Ben Cruz','Facilities','cold',28000,'lead','2026-04-15','timing','4 school buildings, fixture refresh. Budget Q4.','Institutional',44,'Plumbing'),
      dl(8,'Park Ave Condos','Sara Owens','Property Mgr','won',9100,'completed',null,null,'Closed! Units 101-120 re-pipe. Starts 4/1.','Commercial',18,'Plumbing'),
      dl(9,'Downtown Diner','Owner Roy Burns','Owner','lost',5400,'lost',null,'competitor','Lost on price. Licensed plumber did it for less.','Commercial',35,'Plumbing'),
    ],
    jobs: [
      dj(1,'Jack & Paula Fischer','1814 Magnolia St, Pasadena TX 77502','Plumbing',4800,'In Progress','2026-03-21',[1,2,3],'Galvanized-to-PEX. Rough-in 40% done.'),
      dj(2,'Park Ave Condos Units 101-120','2200 Park Ave, Houston TX 77004','Plumbing',9100,'Scheduled','2026-04-01',[1,2],'Re-pipe, 20 units. Materials ordered. Crew starts 4/1.'),
      dj(3,'Hillcrest Medical Office','3300 Hillcrest Dr, Pearland TX 77581','Plumbing',14300,'In Progress','2026-03-14',[1,2,3,4],'Rough-in done. Fixtures going in this week.'),
      dj(4,'Sunridge Apts — Bldg B','3300 Sunridge Pkwy, Webster TX 77598','Plumbing',11400,'In Progress','2026-03-18',[1,2,3,4],'Units 12-24 re-pipe. Pressure test scheduled Friday.'),
    ],
  },
  'Welding': {
    leads: [
      dl(1,'Iron Works Industrial','Carlos Reyes','Plant Manager','active',19800,'inspection','2026-03-27',null,'Steel platform fabrication + install. 1,200 sq ft mezzanine.','Industrial',17,'Welding'),
      dl(2,'Harbor Shipyard LLC','Frank Delaney','Operations Mgr','stalled',44000,'approved','2026-03-23','budget_freeze','Dock gate framework. Capital budget not approved.','Industrial',48,'Welding'),
      dl(3,'Lone Star Fabricators','Hector Ruiz','Owner','active',28500,'estimate','2026-03-25',null,'Custom machine guards, 6 units. RFQ submitted.','Industrial',13,'Welding'),
      dl(4,'Metro Transit Authority','Stan Wells','Facilities Dir','stalled',67000,'estimate','2026-03-20','no_response','Bus depot rail and gate work. No reply in 3 weeks.','Institutional',39,'Welding'),
      dl(5,'Clearwater Brewery','Sam Green','Owner','active',14200,'approved','2026-03-26',null,'Custom stainless brew rack system. Near close.','Commercial',19,'Welding'),
      dl(6,'Atlas Steel Supply','Ray Burk','GM','stalled',38000,'estimate','2026-03-22','price_objection','Storage racking system. $6k over their target.','Industrial',31,'Welding'),
      dl(7,'Northgate Fitness','Mike Castro','Owner','cold',22000,'lead','2026-04-10','timing','Rig equipment frames. Construction not started.','Commercial',44,'Welding'),
      dl(8,'Gulf Coast Refineries','Safety Dir Tomas Rios','HSE Mgr','won',51000,'completed',null,null,'Closed! Staircase and handrail fab. Starts 4/5.','Industrial',26,'Welding'),
      dl(9,'Ridgecrest Auto Dealer','Owner Al Nash','Owner','lost',16000,'lost',null,'competitor','Went with in-house maintenance team.','Commercial',52,'Welding'),
    ],
    jobs: [
      dj(1,'Iron Works Industrial Mezzanine','2244 Industrial Blvd, Houston TX 77015','Welding',19800,'In Progress','2026-03-17',[1,2,3,4],'Steel mezzanine fab complete. On-site install underway.'),
      dj(2,'Clearwater Brewery Rack System','1800 Warehouse Row, San Antonio TX 78207','Welding',14200,'Scheduled','2026-04-02',[1,2],'Stainless brew rack. Fab in shop, install 4/2.'),
      dj(3,'Gulf Coast Refineries Staircase','Off-shore Rd 12, Corpus Christi TX 78401','Welding',51000,'Scheduled','2026-04-05',[1,2,3],'Staircase and handrail fab. Drawings approved.'),
      dj(4,'Lone Star Fabricators Machine Guards','6600 Lone Star Pkwy, Beaumont TX 77701','Welding',28500,'In Progress','2026-03-12',[1,2,3,4,5],'6 guards. 4 complete, 2 in grinding/finishing.'),
    ],
  },
  'Electrical': {
    leads: [
      dl(1,'Pinnacle Retail Center','Jeff Bloom','Facilities Dir','active',31200,'approved','2026-03-26',null,'400A panel upgrade + 6 EV charger circuits. Near close.','Commercial',27,'Electrical'),
      dl(2,'Warehouse 14 LLC','Ron Davis','Property Owner','stalled',48000,'estimate','2026-03-20','no_response','Service upgrade + LED retrofit. No reply in 2 weeks.','Commercial',36,'Electrical'),
      dl(3,'Hillcrest Elementary','Carl Beck','Facilities Dir','active',22000,'inspection','2026-03-27',null,'Full fire alarm replacement + panel upgrade.','Institutional',15,'Electrical'),
      dl(4,'Morrison Office Park','Brian Morrison','Owner','stalled',39000,'approved','2026-03-23','price_objection','Generator install + transfer switch. $5k over budget.','Commercial',29,'Electrical'),
      dl(5,'Park Ridge Apartments','Donna Kwan','Property Mgr','active',17400,'estimate','2026-03-25',null,'GFCI + panel upgrade for 32 units. Insurance requirement.','Commercial',18,'Electrical'),
      dl(6,'Valley Church of Christ','Elder Tom Ames','Admin','stalled',28000,'estimate','2026-03-22','budget_freeze','Sanctuary lighting overhaul. Annual budget too tight.','Institutional',44,'Electrical'),
      dl(7,'Clearview Gym','Marcus Brown','Owner','cold',14000,'lead','2026-04-15','timing','LED full retrofit. Waiting on new lease signing.','Commercial',38,'Electrical'),
      dl(8,'Sterling Industries','Plant Mgr Ann Webb','Operations','won',54000,'completed',null,null,'Closed! 800A service upgrade. Starts 4/8.','Industrial',21,'Electrical'),
      dl(9,'Sunset Diner','Owner Roy Burns','Owner','lost',8400,'lost',null,'competitor','Handyman did basic work. Below code — our problem later.','Commercial',47,'Electrical'),
    ],
    jobs: [
      dj(1,'Pinnacle Retail Center','668 Elmwood Ave, Plano TX 75023','Electrical',31200,'Scheduled','2026-04-01',[1,2],'400A panel + 6 EV circuits. Permits pulled. Install 4/1.'),
      dj(2,'Park Ridge Apartments','2200 Park Ridge Blvd, Garland TX 75040','Electrical',17400,'In Progress','2026-03-19',[1,2,3,4],'GFCI and panel work. 20 of 32 units done.'),
      dj(3,'Sterling Industries','8800 Sterling Industrial Dr, Mesquite TX 75149','Electrical',54000,'Scheduled','2026-04-08',[1,2,3],'800A service upgrade. Utility coordination complete.'),
      dj(4,'Hillcrest Elementary','4400 Hillcrest Blvd, Richardson TX 75080','Electrical',22000,'In Progress','2026-03-10',[1,2,3,4,5,6],'Fire alarm system in. Panel upgrade last step.'),
    ],
  },
  'Masonry': {
    leads: [
      dl(1,'Downtown Brick Restoration','Tom Hendricks','Building Owner','active',45000,'estimate','2026-03-25',null,'Full brick repoint, 4-story historic building downtown.','Commercial',19,'Masonry'),
      dl(2,'Riverside Retaining Wall','Bob Crane','Homeowner','stalled',28000,'approved','2026-03-23','price_objection','250 LF retaining wall. $4k over expectation.','Residential',33,'Masonry'),
      dl(3,'Heritage Inn Patio','Patricia Lawson','GM','active',26400,'estimate','2026-03-26',null,'Limestone patio resurfacing + retaining wall.','Commercial',20,'Masonry'),
      dl(4,'Northridge Church Entrance','Pastor Ed Cole','Facilities','stalled',38000,'estimate','2026-03-20','budget_freeze','New stone entrance and columns. Capital budget needed.','Institutional',47,'Masonry'),
      dl(5,'Greenview HOA Wall','Linda Shaw','HOA President','active',18700,'inspection','2026-03-27',null,'Community entry wall + stone columns. HOA approved.','HOA',11,'Masonry'),
      dl(6,'Atlas Industrial Complex','Ray Torres','Plant Mgr','cold',62000,'lead','2026-04-15','timing','Brick facade restoration. Budget in Q3.','Industrial',58,'Masonry'),
      dl(7,'Lakewood Medical Center','Dr. Sam Park','Admin Dir','won',33500,'completed',null,null,'Closed! Entry steps + facade repair. Starts 4/4.','Commercial',24,'Masonry'),
      dl(8,'Morrison Distillery','Mike Morrison','Owner','stalled',22000,'approved','2026-03-24','competitor','Stone bar feature + fireplace. 2 other bids in.','Commercial',31,'Masonry'),
      dl(9,'Sunset Baptist Church','Deacon Will Jones','Admin','lost',29000,'lost',null,'competitor','Member of congregation did the work for cost.','Institutional',64,'Masonry'),
    ],
    jobs: [
      dj(1,'Downtown Brick Restoration','400 Main St, Fort Worth TX 76102','Masonry',45000,'In Progress','2026-03-10',[1,2,3,4,5],'South and west face repointing done. North face this week.'),
      dj(2,'Heritage Inn Patio','312 Heritage Blvd, San Antonio TX 78205','Masonry',26400,'Scheduled','2026-04-03',[1,2,3],'Limestone on site. Forms set. Pour and lay 4/3.'),
      dj(3,'Greenview HOA Entry Wall','800 Greenview Commons, Allen TX 75013','Masonry',18700,'In Progress','2026-03-19',[1,2,3,4],'Footings poured. Block work 50% complete.'),
      dj(4,'Lakewood Medical Center','5500 Lakewood Dr, Plano TX 75093','Masonry',33500,'Scheduled','2026-04-04',[1,2],'Steps design approved. Materials ordered.'),
    ],
  },
  'Painting': {
    leads: [
      dl(1,'Riverside Church Exterior','Pastor James Willis','Facilities','won',9400,'completed',null,null,'Closed! Full exterior repaint. Sherwin-Williams Duration. Starts 4/1.','Institutional',55,'Painting'),
      dl(2,'Clearbrook Office Suite','Donna Pierce','Office Mgr','active',6800,'estimate','2026-03-25',null,'2,400 sq ft office interior. Neutral repaint.','Commercial',11,'Painting'),
      dl(3,'Morrison Residence','Carl Morrison','Homeowner','stalled',8200,'approved','2026-03-23','price_objection','Full exterior + trim. $900 over competing bid.','Residential',28,'Painting'),
      dl(4,'Hilltop Hotel Lobby','GM Ray Lutz','Operations','stalled',22000,'estimate','2026-03-20','budget_freeze','Lobby + corridors floors 1-3. Capital budget request.','Commercial',41,'Painting'),
      dl(5,'Greenway Apartments','Property Mgr Sara Li','Mgr','active',14500,'inspection','2026-03-27',null,'24 unit interiors, turnover repaint. Staging now.','Commercial',13,'Painting'),
      dl(6,'Sunrise Senior Center','Activities Dir Jo Wells','Admin','stalled',11000,'estimate','2026-03-22','no_response','Community room + 40 resident rooms. No reply 2 weeks.','Institutional',37,'Painting'),
      dl(7,'Park Ave Dentistry','Dr. Ann Park','Owner','active',5400,'approved','2026-03-26',null,'Waiting room + 6 exam rooms repaint. Near close.','Commercial',16,'Painting'),
      dl(8,'Thornton Residence','Nick Thornton','Homeowner','cold',7100,'lead','2026-04-08','timing','Interior 4 bedrooms. Waiting on new flooring first.','Residential',31,'Painting'),
      dl(9,'Crossroads Gym','Owner Greg Nash','Owner','lost',9800,'lost',null,'competitor','Used a friend-of-a-friend painter.','Commercial',44,'Painting'),
    ],
    jobs: [
      dj(1,'Riverside Church','200 Riverside Ave, Fort Worth TX 76107','Painting',9400,'Scheduled','2026-04-01',[1,2,3],'Sherwin-Williams Duration. Prep + prime complete.'),
      dj(2,'Clearbrook Office Suite','501 Commerce Dr, Dallas TX 75201','Painting',6800,'In Progress','2026-03-22',[1,2,3,4,5],'2,400 sq ft interior. Second coat today.'),
      dj(3,'Greenway Apartments','2200 Greenway Blvd, Arlington TX 76010','Painting',14500,'In Progress','2026-03-15',[1,2,3,4],'12 of 24 units complete. On pace.'),
      dj(4,'Park Ave Dentistry','3300 Park Ave, Plano TX 75074','Painting',5400,'Scheduled','2026-04-05',[1,2],'Materials ordered. Prep scheduled 4/5.'),
    ],
  },
  'Flooring': {
    leads: [
      dl(1,'Clearwater Gym','Marcus Brown','Owner','cold',17200,'lead','2026-04-05','timing','Full rubber floor replacement. Remodel deferred to summer.','Commercial',64,'Flooring'),
      dl(2,'Morrison Residence Kitchen','Amy Morrison','Homeowner','active',8600,'estimate','2026-03-25',null,'LVP throughout kitchen + dining. Shaw Floorté preferred.','Residential',14,'Flooring'),
      dl(3,'Lakewood Medical Center','Office Mgr Dr. Park','Admin','stalled',28000,'approved','2026-03-23','budget_freeze','VCT to LVT conversion, 8,000 sq ft. Budget not released.','Commercial',38,'Flooring'),
      dl(4,'Sunrise Senior Living','Activities Dir','Admin','active',22400,'inspection','2026-03-27',null,'80 resident rooms LVP replacement. Insurance funded.','Institutional',12,'Flooring'),
      dl(5,'Thornton Residence','Nick Thornton','Homeowner','stalled',11800,'estimate','2026-03-22','no_response','Hardwood refinish + 3 bedroom LVP. No response 2 weeks.','Residential',28,'Flooring'),
      dl(6,'Metro Dance Studio','Owner Sofia Vega','Owner','active',14200,'approved','2026-03-26',null,'Sprung hardwood dance floor, 1,800 sq ft. Near close.','Commercial',18,'Flooring'),
      dl(7,'Park Ridge Apts Turnover','Property Mgr Don Kwan','Mgr','stalled',9600,'estimate','2026-03-20','price_objection','12 unit LVP turnover. $1,200 over budget.','Commercial',31,'Flooring'),
      dl(8,'Chen Residence','Linda Chen','Homeowner','won',7400,'completed',null,null,'Closed! Hardwood refinish + LVP hallways. Starts 4/4.','Residential',21,'Flooring'),
      dl(9,'Ridgecrest Elementary','Carl Beck','Facilities Dir','lost',34000,'lost',null,'competitor','State contract went to lowest bidder.','Institutional',55,'Flooring'),
    ],
    jobs: [
      dj(1,'Amy & Carl Morrison','4418 Ridgeway Dr, Garland TX 75040','Flooring',8600,'In Progress','2026-03-21',[1,2,3,4],'LVP kitchen + dining. Subfloor prepped, laying today.'),
      dj(2,'Linda & James Chen','2204 Birchwood Ct, Richardson TX 75082','Flooring',7400,'Scheduled','2026-04-04',[1,2],'Hardwood refinish + LVP. Materials on site.'),
      dj(3,'Metro Dance Studio','1200 Arts District Blvd, Dallas TX 75201','Flooring',14200,'In Progress','2026-03-16',[1,2,3,4,5],'Sprung hardwood. Subfloor level, laying 1st strips.'),
      dj(4,'Sunrise Senior Living','1100 Sunrise Blvd, Garland TX 75040','Flooring',22400,'In Progress','2026-03-10',[1,2,3,4,5,6],'50 of 80 rooms complete. On schedule.'),
    ],
  },
  'Insulation': {
    leads: [
      dl(1,'Northgate Mall','Janet Farley','Facilities Mgr','stalled',31500,'estimate','2026-03-21','no_response','Attic blow-in + roof deck spray foam. No feedback 2 wks.','Commercial',58,'Insulation'),
      dl(2,'Weber Residence','Bill Weber','Homeowner','active',6200,'estimate','2026-03-25',null,'Attic blow-in + air sealing. Energy audit done.','Residential',11,'Insulation'),
      dl(3,'Clearbrook Office Bldg','Property Mgr Donna Pierce','Mgr','stalled',18400,'approved','2026-03-23','budget_freeze','Roof deck + perimeter wall spray foam. Q2 budget.','Commercial',34,'Insulation'),
      dl(4,'Sunrise Elementary','Carl Beck','Facilities Dir','active',28000,'inspection','2026-03-27',null,'Full attic insulation upgrade. Energy grant funding.','Institutional',14,'Insulation'),
      dl(5,'Morrison Residence Addition','Carl Morrison','Homeowner','stalled',4800,'estimate','2026-03-22','price_objection','Room addition insulation. $600 over quote expectation.','Residential',22,'Insulation'),
      dl(6,'Ridgecrest Warehouse','Ray Torres','Owner','cold',42000,'lead','2026-04-20','timing','Spray foam whole envelope. Starting build-out Q3.','Industrial',47,'Insulation'),
      dl(7,'Chen Residence','Linda Chen','Homeowner','won',5600,'completed',null,null,'Closed! Attic blow-in + knee walls. Crew 3/28.','Residential',17,'Insulation'),
      dl(8,'Park Ave Medical Bldg','Dr. Sam Park','Admin Dir','active',22000,'approved','2026-03-26',null,'Spray foam retrofit, 4,000 sq ft. Near close.','Commercial',20,'Insulation'),
      dl(9,'Atlas Warehouse','Plant Mgr Ann Webb','Operations','lost',36000,'lost',null,'competitor','Owner-supplied spray foam contractor won it.','Industrial',61,'Insulation'),
    ],
    jobs: [
      dj(1,'Bill & Carol Weber','4810 Meadowbrook Ln, Flower Mound TX 75028','Insulation',6200,'Scheduled','2026-03-28',[1,2],'Blow-in + air sealing. Materials ready.'),
      dj(2,'Linda & James Chen','2204 Birchwood Ct, Richardson TX 75082','Insulation',5600,'Complete','2026-03-21',[1,2,3,4,5,6,7,8],'Attic blow-in done. Energy audit follow-up sent.'),
      dj(3,'Sunrise Elementary Attic','4400 Sunrise Blvd, Mesquite TX 75150','Insulation',28000,'In Progress','2026-03-14',[1,2,3,4],'R-38 blow-in 60% complete. Air sealing Friday.'),
      dj(4,'Park Ave Medical Bldg','3300 Park Ave, Plano TX 75074','Insulation',22000,'Scheduled','2026-04-08',[1,2,3],'Spray foam retrofit. Drawings approved.'),
    ],
  },
  'Drywall': {
    leads: [
      dl(1,'Sunrise Senior Living Wing B','Andrew Mills','Maintenance Dir','active',13200,'estimate','2026-03-26',null,'40-room renovation drywall. Full hang + finish.','Institutional',22,'Drywall'),
      dl(2,'Morrison Office Addition','Carl Morrison','Owner','stalled',18600,'approved','2026-03-23','budget_freeze','3,200 sq ft office addition. GC has budget hold.','Commercial',36,'Drywall'),
      dl(3,'Park Ridge Apts Unit Reno','Property Mgr Don Kwan','Mgr','active',9400,'inspection','2026-03-27',null,'16 unit reno drywall. Consistent crew work.','Commercial',13,'Drywall'),
      dl(4,'Clearbrook Medical Suite','Dr. Ana Rivera','Owner','stalled',22000,'estimate','2026-03-20','no_response','Exam room build-out, 8 rooms. No reply after bid.','Commercial',31,'Drywall'),
      dl(5,'Torres New Home','Miguel Torres','Homeowner','stalled',7800,'estimate','2026-03-22','price_objection','Basement finish drywall. $900 over other bid.','Residential',24,'Drywall'),
      dl(6,'Ridgecrest Brewery','Sam Green','Owner','cold',14000,'lead','2026-04-10','timing','Taproom build-out drywall. Framing not done yet.','Commercial',38,'Drywall'),
      dl(7,'Weber Residence Addition','Bill Weber','Homeowner','won',6200,'completed',null,null,'Closed! 2 room addition drywall. Crew starts 4/2.','Residential',16,'Drywall'),
      dl(8,'Lakewood Hotel Reno','GM Ray Lutz','Operations','active',38000,'approved','2026-03-25',null,'24 room reno drywall. Near close, scope confirmed.','Commercial',20,'Drywall'),
      dl(9,'Sunrise School Reno','Carl Beck','Facilities Dir','lost',28000,'lost',null,'competitor','GC used their in-house drywall crew.','Institutional',52,'Drywall'),
    ],
    jobs: [
      dj(1,'Sunrise Senior Living Wing B','1100 Sunrise Blvd, Garland TX 75040','Drywall',13200,'In Progress','2026-03-14',[1,2,3,4],'40 rooms. Hang done. Tape + mud underway.'),
      dj(2,'Park Ridge Apts 8 Units','2200 Park Ridge Blvd, Garland TX 75040','Drywall',9400,'In Progress','2026-03-18',[1,2,3,4,5],'5 units sanded + primed. 3 units in tape/mud.'),
      dj(3,'Bill & Carol Weber Addition','4810 Meadowbrook Ln, Flower Mound TX 75028','Drywall',6200,'Scheduled','2026-04-02',[1,2,3],'Frame inspection passed. Hang crew starts 4/2.'),
      dj(4,'Lakewood Hotel Reno','8200 Lakewood Dr, Plano TX 75093','Drywall',38000,'Scheduled','2026-04-10',[1,2],'24 rooms. Contract signed. Hang crew booked.'),
    ],
  },
  'Landscaping': {
    leads: [
      dl(1,'Brookhaven Commons HOA','Tina Rosario','HOA Director','active',34800,'estimate','2026-03-24',null,'Common area redesign + irrigation. Board approved.','HOA',14,'Landscaping'),
      dl(2,'Clearwater Country Club','GM Mark Peters','Operations','stalled',82000,'approved','2026-03-23','budget_freeze','Course perimeter and entrance landscaping. BOD vote.','Commercial',48,'Landscaping'),
      dl(3,'Morrison Residence','Amy Morrison','Homeowner','active',14200,'inspection','2026-03-27',null,'Backyard hardscape + planting plan. Irrigation included.','Residential',10,'Landscaping'),
      dl(4,'Sunrise Medical Campus','Facilities Dir Beth Lee','Admin','stalled',44000,'estimate','2026-03-20','no_response','Full campus landscape refresh. No response 3 weeks.','Commercial',36,'Landscaping'),
      dl(5,'Torres Residence','Miguel Torres','Homeowner','stalled',8800,'estimate','2026-03-22','price_objection','Front yard redesign + sod. $1,400 over expectation.','Residential',27,'Landscaping'),
      dl(6,'Northgate Office Park','Property Mgr Greg Lee','Mgr','cold',28000,'lead','2026-04-10','timing','Parking lot islands + perimeter. Spring budget.','Commercial',41,'Landscaping'),
      dl(7,'Chen Residence','Linda Chen','Homeowner','won',11400,'completed',null,null,'Closed! Backyard hardscape + planting. Starts 4/3.','Residential',18,'Landscaping'),
      dl(8,'Westfield HOA Entrance','Sandra Hill','HOA President','active',18600,'approved','2026-03-26',null,'Entrance monument + plantings. Near close.','HOA',15,'Landscaping'),
      dl(9,'Atlas Corporate Campus','Facilities VP Ted Ross','Admin','lost',56000,'lost',null,'competitor','National landscape firm won on relationships.','Commercial',67,'Landscaping'),
    ],
    jobs: [
      dj(1,'Brookhaven Commons HOA','1190 Brookhaven Blvd, Frisco TX 75034','Landscaping',34800,'In Progress','2026-03-16',[1,2,3,4,5],'Hardscape done. Planting crew starts Monday.'),
      dj(2,'Linda & James Chen','2204 Birchwood Ct, Richardson TX 75082','Landscaping',11400,'Scheduled','2026-04-03',[1,2,3],'Plants on order. Hardscape layout ready.'),
      dj(3,'Westfield HOA Entrance','500 Westfield Commons, Allen TX 75013','Landscaping',18600,'In Progress','2026-03-20',[1,2,3,4],'Monument base complete. Plantings + irrigation next.'),
      dj(4,'Morrison Backyard','4418 Ridgeway Dr, Garland TX 75040','Landscaping',14200,'Scheduled','2026-04-08',[1,2],'Design approved. Materials ordering now.'),
    ],
  },
  'Concrete': {
    leads: [
      dl(1,'Morrison Trucking Depot','Bill Morrison','Owner','stalled',19600,'estimate','2026-03-22','price_objection','6,000 sq ft reinforced slab. $2,800 over expectation.','Commercial',33,'Concrete'),
      dl(2,'Sunridge Subdivision','Developer Greg Fry','Developer','active',64000,'inspection','2026-03-27',null,'22-lot driveway and walkway package. Approved.','Commercial',14,'Concrete'),
      dl(3,'Northgate Warehouse','Plant Mgr Ray Torres','Operations','stalled',38000,'approved','2026-03-23','budget_freeze','Forklift aisle resurfacing + new dock apron. Q2.','Industrial',44,'Concrete'),
      dl(4,'Weber Residence','Bill Weber','Homeowner','active',9800,'estimate','2026-03-25',null,'Driveway replacement + back patio. Stamped option.','Residential',12,'Concrete'),
      dl(5,'Clearview Church Parking','Elder Tom Ames','Admin','stalled',42000,'estimate','2026-03-20','no_response','Parking lot reseal + expansion. No reply.','Institutional',38,'Concrete'),
      dl(6,'Metro Fire Station','Chief Pat Moore','City Admin','cold',88000,'lead','2026-05-01','timing','Apparatus bay floor + driveway. City budget Q4.','Institutional',55,'Concrete'),
      dl(7,'Torres Backyard','Miguel Torres','Homeowner','won',7200,'completed',null,null,'Closed! Stamped patio 400 sq ft. Crew 3/30.','Residential',19,'Concrete'),
      dl(8,'Atlas Industrial Complex','Ann Webb','Plant Mgr','active',54000,'approved','2026-03-26',null,'Loading dock expansion + apron. Near close.','Industrial',22,'Concrete'),
      dl(9,'Ridgecrest School Walkways','Carl Beck','Facilities Dir','lost',31000,'lost',null,'competitor','Local contractor underbid by $4k.','Institutional',62,'Concrete'),
    ],
    jobs: [
      dj(1,'Miguel & Carmen Torres','4421 Sunset Ridge Rd, Austin TX 78731','Concrete',7200,'In Progress','2026-03-24',[1,2,3,4,5,6],'400 sq ft stamped patio. Poured yesterday. Finishing today.'),
      dj(2,'Morrison Trucking Depot','2244 Industrial Blvd, Dallas TX 75207','Concrete',19600,'Scheduled','2026-04-07',[1,2],'Reinforced slab. Forms set next week.'),
      dj(3,'Sunridge Subdivision Lots 1-11','FM 423 & Eldorado Pkwy, Frisco TX 75033','Concrete',64000,'In Progress','2026-03-12',[1,2,3,4,5,6],'11 of 22 driveways poured. On schedule.'),
      dj(4,'Atlas Industrial Loading Dock','8800 Industrial Dr, Mesquite TX 75149','Concrete',54000,'Scheduled','2026-04-10',[1,2,3],'Permits in. Form crew scheduled 4/10.'),
    ],
  },
  'Fencing': {
    leads: [
      dl(1,'Sagebrush Ranch','Dale Cooper','Ranch Owner','stalled',28500,'approved','2026-03-23','wrong_contact','1,200 LF cedar privacy. Need to reach spouse for sign-off.','Residential',46,'Fencing'),
      dl(2,'Northview Business Park','Greg Lee','Property Mgr','active',42000,'inspection','2026-03-27',null,'Perimeter chain-link + 3 access gates. Security upgrade.','Commercial',13,'Fencing'),
      dl(3,'Morrison Residence','Carl Morrison','Homeowner','active',8400,'estimate','2026-03-25',null,'Backyard privacy fence, 300 LF cedar. HOA approved.','Residential',11,'Fencing'),
      dl(4,'Clearview School District','Carl Beck','Facilities Dir','stalled',62000,'estimate','2026-03-20','budget_freeze','3 campuses, playground fencing. Capital budget delayed.','Institutional',44,'Fencing'),
      dl(5,'Torres Residence','Miguel Torres','Homeowner','stalled',6800,'estimate','2026-03-22','price_objection','150 LF board-on-board. Competing bid $800 less.','Residential',28,'Fencing'),
      dl(6,'Mesa Verde HOA','Sandra Hill','HOA President','cold',24000,'lead','2026-04-12','timing','Community fencing refresh. Board vote next month.','HOA',38,'Fencing'),
      dl(7,'Weber Residence','Bill Weber','Homeowner','won',9200,'completed',null,null,'Closed! 400 LF cedar, 2 gates. Crew 3/31.','Residential',20,'Fencing'),
      dl(8,'Atlas Yard Storage','Ray Torres','Plant Mgr','active',18000,'approved','2026-03-26',null,'Heavy-gauge chain link, 600 LF. Near close.','Industrial',16,'Fencing'),
      dl(9,'Ridgecrest Apartments','Don Kwan','Property Mgr','lost',14000,'lost',null,'competitor','Handyman crew did it cheaper.','Commercial',51,'Fencing'),
    ],
    jobs: [
      dj(1,'Bill & Carol Weber','4810 Meadowbrook Ln, Flower Mound TX 75028','Fencing',9200,'Scheduled','2026-03-31',[1,2],'400 LF cedar privacy. Posts ordered. Install 3/31.'),
      dj(2,'Sagebrush Ranch','8801 County Rd 312, Waco TX 76708','Fencing',28500,'Complete','2026-03-11',[1,2,3,4,5,6,7,8,9,10],'1,200 ft cedar fence. All gates hung and tested.'),
      dj(3,'Northview Business Park','3300 Northview Commerce Dr, Irving TX 75038','Fencing',42000,'In Progress','2026-03-17',[1,2,3,4,5],'Perimeter chain-link 80% done. Gates being hung.'),
      dj(4,'Atlas Yard Storage','8800 Industrial Dr, Mesquite TX 75149','Fencing',18000,'Scheduled','2026-04-06',[1,2,3],'Heavy chain-link layout staked. Post holes next week.'),
    ],
  },
  'Carpentry': {
    leads: [
      dl(1,'The Craftsman Kitchen','Sandra Yee','Owner','stalled',24100,'approved','2026-03-23','technical_fit','Custom cabinet specs rework needed. Awaiting revisions.','Commercial',40,'Carpentry'),
      dl(2,'Morrison Residence Addition','Carl Morrison','Homeowner','active',18600,'estimate','2026-03-25',null,'Trim package + built-in shelving for new addition.','Residential',14,'Carpentry'),
      dl(3,'Lakewood Hotel Lobby','GM Ray Lutz','Operations','stalled',44000,'estimate','2026-03-20','budget_freeze','Custom millwork + wainscoting. Capital budget Q2.','Commercial',47,'Carpentry'),
      dl(4,'Clearbrook Office Fit-Out','Donna Pierce','Office Mgr','active',28000,'inspection','2026-03-27',null,'Reception desk + custom shelving, 2,400 sq ft office.','Commercial',12,'Carpentry'),
      dl(5,'Torres New Deck','Miguel Torres','Homeowner','stalled',14800,'estimate','2026-03-22','price_objection','Composite deck with pergola. $2,200 over expectation.','Residential',26,'Carpentry'),
      dl(6,'Sunrise Senior Living','Andrew Mills','Maintenance Dir','cold',22000,'lead','2026-04-15','timing','Custom millwork for dining room renovation.','Institutional',39,'Carpentry'),
      dl(7,'Weber Residence Built-Ins','Bill Weber','Homeowner','won',8400,'completed',null,null,'Closed! Home office built-ins. Starts 4/3.','Residential',17,'Carpentry'),
      dl(8,'Park Ave Restaurant','Chef Dan Lee','Owner','active',31000,'approved','2026-03-26',null,'Custom bar + booth seating, hardwood. Near close.','Commercial',20,'Carpentry'),
      dl(9,'Ridgecrest Church','Pastor Ed Cole','Admin','lost',19000,'lost',null,'competitor','Member of congregation is a finish carpenter.','Institutional',58,'Carpentry'),
    ],
    jobs: [
      dj(1,'Bill & Carol Weber Home Office','4810 Meadowbrook Ln, Flower Mound TX 75028','Carpentry',8400,'Scheduled','2026-04-03',[1,2],'Custom built-ins. Shop fab underway.'),
      dj(2,'Carl & Amy Morrison Addition','4418 Ridgeway Dr, Garland TX 75040','Carpentry',18600,'In Progress','2026-03-19',[1,2,3,4],'Trim complete. Built-in shelving 50% done.'),
      dj(3,'Clearbrook Office Fit-Out','501 Commerce Dr, Dallas TX 75201','Carpentry',28000,'In Progress','2026-03-13',[1,2,3,4,5],'Reception desk installed. Shelving units in progress.'),
      dj(4,'Park Ave Restaurant','3300 Park Ave, Plano TX 75074','Carpentry',31000,'Scheduled','2026-04-09',[1,2,3],'Bar design approved. Material order placed.'),
    ],
  },
  'Waterproofing': {
    leads: [
      dl(1,'Harbor View Condos','Robert Chang','Board Treasurer','stalled',47500,'estimate','2026-03-24','wrong_contact','Foundation waterproofing, 32 units. Need full board.','HOA',62,'Waterproofing'),
      dl(2,'Morrison Basement','Carl Morrison','Homeowner','active',12400,'estimate','2026-03-25',null,'Interior drainage + sump system. Active water intrusion.','Residential',13,'Waterproofing'),
      dl(3,'Clearbrook Commercial Bldg','Donna Pierce','Property Mgr','stalled',38000,'approved','2026-03-23','budget_freeze','Below-grade parking deck membrane. Q2 capital.','Commercial',44,'Waterproofing'),
      dl(4,'Northgate Warehouse','Ray Torres','Plant Mgr','active',22000,'inspection','2026-03-27',null,'Exterior foundation coating + drainage tile.','Industrial',11,'Waterproofing'),
      dl(5,'Weber Residence','Bill Weber','Homeowner','stalled',9800,'estimate','2026-03-22','price_objection','Crawl space encapsulation. $1,400 over expectation.','Residential',28,'Waterproofing'),
      dl(6,'Lakewood Medical Center','Dr. Sam Park','Admin Dir','cold',54000,'lead','2026-04-20','timing','Underground utility corridor waterproofing. Q3.','Commercial',51,'Waterproofing'),
      dl(7,'Torres Residence','Miguel Torres','Homeowner','won',7600,'completed',null,null,'Closed! Basement interior drain + sump. Starts 4/4.','Residential',19,'Waterproofing'),
      dl(8,'Atlas Tilt-Wall Building','Ann Webb','Plant Mgr','active',31000,'approved','2026-03-26',null,'Exterior EIFS coating + caulk overhaul. Near close.','Industrial',21,'Waterproofing'),
      dl(9,'Ridgecrest Church Hall','Deacon Will Jones','Admin','lost',18000,'lost',null,'competitor','Chose a cheaper partial fix instead.','Institutional',63,'Waterproofing'),
    ],
    jobs: [
      dj(1,'Carl & Amy Morrison Basement','4418 Ridgeway Dr, Garland TX 75040','Waterproofing',12400,'In Progress','2026-03-20',[1,2,3,4],'Interior drainage channel cut. Sump install today.'),
      dj(2,'Miguel & Carmen Torres Basement','4421 Sunset Ridge Rd, Austin TX 78731','Waterproofing',7600,'Scheduled','2026-04-04',[1,2],'Interior drain system. Crew scheduled 4/4.'),
      dj(3,'Northgate Warehouse','3300 Industrial Pkwy, Grand Prairie TX 75051','Waterproofing',22000,'In Progress','2026-03-15',[1,2,3,4,5],'Exterior coating done. Drainage tile going in now.'),
      dj(4,'Atlas Tilt-Wall Bldg','8800 Atlas Dr, Mesquite TX 75149','Waterproofing',31000,'Scheduled','2026-04-10',[1,2,3],'EIFS inspection done. Coating crew scheduled.'),
    ],
  },
  'Solar': {
    leads: [
      dl(1,'Torres Residence','Miguel Torres','Homeowner','stalled',42000,'approved','2026-03-23','budget_freeze','18-panel system. Waiting on utility rebate approval.','Residential',74,'Solar'),
      dl(2,'Clearbrook Office Park','Donna Pierce','Property Mgr','active',118000,'inspection','2026-03-27',null,'Commercial array, 240kW. Net metering pre-approved.','Commercial',16,'Solar'),
      dl(3,'Morrison Residence','Carl Morrison','Homeowner','active',28400,'estimate','2026-03-25',null,'12-panel system. Roof in great shape. Permit submitted.','Residential',12,'Solar'),
      dl(4,'Northgate Manufacturing','Ann Webb','Plant Mgr','stalled',186000,'approved','2026-03-23','price_objection','500kW industrial array. $18k over competitor.','Industrial',55,'Solar'),
      dl(5,'Riverside Church','Pastor Rick Adams','Admin Dir','stalled',34000,'estimate','2026-03-20','no_response','30kW rooftop. Submitted bid. No reply 3 weeks.','Institutional',41,'Solar'),
      dl(6,'Lakewood HOA Clubhouse','Linda Marsh','HOA President','cold',22000,'lead','2026-04-15','timing','Clubhouse + pool solar. Waiting on HOA vote.','HOA',38,'Solar'),
      dl(7,'Weber Residence','Bill Weber','Homeowner','won',24600,'completed',null,null,'Closed! 10-panel system. Install 4/5.','Residential',22,'Solar'),
      dl(8,'Atlas Industrial Roof','Ray Torres','Plant Mgr','active',94000,'approved','2026-03-26',null,'200kW flat roof array. PPA option on table.','Industrial',19,'Solar'),
      dl(9,'Sunrise School District','Carl Beck','Facilities Dir','lost',210000,'lost',null,'competitor','State procurement went to lowest bidder.','Institutional',84,'Solar'),
    ],
    jobs: [
      dj(1,'Miguel & Carmen Torres','4421 Sunset Ridge Rd, Austin TX 78731','Solar',42000,'In Progress','2026-03-17',[1,2,3,4],'18-panel system. Mounts installed. Panels going up today.'),
      dj(2,'Bill & Carol Weber','4810 Meadowbrook Ln, Flower Mound TX 75028','Solar',24600,'Scheduled','2026-04-05',[1,2,3],'10-panel system. Permit approved. Install 4/5.'),
      dj(3,'Clearbrook Office Park — Bldg A','501 Commerce Dr, Dallas TX 75201','Solar',118000,'In Progress','2026-03-03',[1,2,3,4,5],'240kW array. All panels mounted. Inverter wiring underway.'),
      dj(4,'Carl & Amy Morrison','4418 Ridgeway Dr, Garland TX 75040','Solar',28400,'Scheduled','2026-04-12',[1,2],'12-panel permit submitted. Utility pre-approved.'),
    ],
  },
  'Garage Doors': {
    leads: [
      dl(1,'Lakewood Auto','Steve Kim','Shop Owner','active',7200,'inspection','2026-03-28',null,'3 commercial overhead doors. Second call scheduled.','Commercial',8,'Garage Doors'),
      dl(2,'Morrison Residence','Carl Morrison','Homeowner','stalled',3800,'estimate','2026-03-22','price_objection','Double door + opener. $400 under our minimum.','Residential',22,'Garage Doors'),
      dl(3,'Clearbrook Storage LLC','Owner Dan Ross','Owner','active',18400,'estimate','2026-03-26',null,'12 roll-up doors, 10x10. Storage unit facility.','Commercial',15,'Garage Doors'),
      dl(4,'Weber Residence','Bill Weber','Homeowner','stalled',2800,'lead','2026-03-19','no_response','Single door replacement. No reply after site visit.','Residential',18,'Garage Doors'),
      dl(5,'Northgate Auto Dealer','GM Rich Nash','Operations','active',11200,'approved','2026-03-25',null,'4 service bay doors, glass panel. Near close.','Commercial',12,'Garage Doors'),
      dl(6,'Ridgecrest HOA','HOA Manager Tom Park','Mgr','cold',22000,'lead','2026-04-10','timing','Community storage building doors, 8 units. Q2 budget.','HOA',34,'Garage Doors'),
      dl(7,'Torres Residence','Miguel Torres','Homeowner','won',4400,'completed',null,null,'Closed! Double door + WiFi opener. Crew 3/29.','Residential',14,'Garage Doors'),
      dl(8,'Atlas Fleet Yard','Ann Webb','Plant Mgr','stalled',28000,'approved','2026-03-24','budget_freeze','8 heavy-duty roll-up doors, 14x14. Budget on hold.','Industrial',38,'Garage Doors'),
      dl(9,'Park Ridge Condos','Don Kwan','Property Mgr','lost',14600,'lost',null,'competitor','Went with cheapest bid. Low quality expected.','Commercial',46,'Garage Doors'),
    ],
    jobs: [
      dj(1,'Miguel & Carmen Torres','4421 Sunset Ridge Rd, Austin TX 78731','Garage Doors',4400,'Scheduled','2026-03-29',[1,2],'Double door + WiFi opener. Delivery confirmed.'),
      dj(2,'Northgate Auto Dealer','8800 Auto Row Blvd, Plano TX 75093','Garage Doors',11200,'In Progress','2026-03-21',[1,2,3,4],'4 service bay doors. 2 complete, 2 in progress.'),
      dj(3,'Clearbrook Storage LLC','6600 Storage Pkwy, Irving TX 75038','Garage Doors',18400,'In Progress','2026-03-14',[1,2,3,4,5],'12 roll-up doors. 8 installed, 4 remaining.'),
      dj(4,'Lakewood Auto Shop','7700 Lakewood Blvd, Garland TX 75040','Garage Doors',7200,'Scheduled','2026-04-04',[1,2],'3 commercial doors. Measured and ordered.'),
    ],
  },
  'Demolition': {
    leads: [
      dl(1,'City Storage LLC','Nick Ferreira','Operations Mgr','stalled',38000,'estimate','2026-03-20','budget_freeze','Old warehouse demo, 8,000 sq ft. Board approval pending.','Commercial',53,'Demolition'),
      dl(2,'Northgate Redevelopment','Greg Patterson','Developer','active',72000,'inspection','2026-03-27',null,'3-building strip mall demo. Environmental clear.','Commercial',18,'Demolition'),
      dl(3,'Morrison Industrial Site','Ann Webb','Plant Mgr','active',44000,'estimate','2026-03-25',null,'Concrete slab + structure demo, 12,000 sq ft.','Industrial',14,'Demolition'),
      dl(4,'Clearview County','Facilities Dir Bill Fox','Admin','stalled',98000,'estimate','2026-03-20','no_response','Old courthouse demo. No response after site walk.','Institutional',41,'Demolition'),
      dl(5,'Torres Commercial Site','Miguel Torres','Owner','stalled',28000,'approved','2026-03-23','price_objection','2-story building demo. $6k over competing bid.','Commercial',33,'Demolition'),
      dl(6,'Lakeview Redevelopment','Dana Clark','Developer','cold',140000,'lead','2026-05-01','timing','12-acre site clearance. Permits 6 months out.','Commercial',62,'Demolition'),
      dl(7,'Park Ave Auto Body','Owner Jim Lee','Owner','won',18000,'completed',null,null,'Closed! Old building shell demo. Starts 4/4.','Commercial',21,'Demolition'),
      dl(8,'Ridgecrest School District','Carl Beck','Facilities Dir','active',56000,'approved','2026-03-26',null,'Old gymnasium demo. Asbestos clear. Near close.','Institutional',19,'Demolition'),
      dl(9,'Clearbrook HOA','Linda Shaw','HOA President','lost',14000,'lost',null,'competitor','Hired a landscaper who also does minor demo.','HOA',55,'Demolition'),
    ],
    jobs: [
      dj(1,'Northgate Strip Mall Demo','3300 Northgate Blvd, Irving TX 75038','Demolition',72000,'In Progress','2026-03-10',[1,2,3,4,5],'Bldg 1 and 2 down. Debris removal underway.'),
      dj(2,'Park Ave Auto Body Shell','3300 Park Ave, Plano TX 75074','Demolition',18000,'Scheduled','2026-04-04',[1,2,3],'Utility disconnect done. Hazmat clear. Crew 4/4.'),
      dj(3,'Morrison Industrial Slab','8800 Industrial Dr, Mesquite TX 75149','Demolition',44000,'In Progress','2026-03-18',[1,2,3,4],'Structure down. Slab breaking in progress.'),
      dj(4,'Ridgecrest Gymnasium','4400 Ridgecrest Blvd, Richardson TX 75080','Demolition',56000,'Scheduled','2026-04-14',[1,2],'Contract signed. Utility disconnect scheduled.'),
    ],
  },
  'Septic': {
    leads: [
      dl(1,'Oakwood Estates','Carol Jensen','Homeowner','active',15800,'inspection','2026-03-25',null,'Failing system. Urgent. Permits in process.','Residential',12,'Septic'),
      dl(2,'Morrison Ranch','Dale Morrison','Ranch Owner','stalled',28000,'approved','2026-03-23','budget_freeze','New 1,500-gal system + leach field. Financing needed.','Residential',38,'Septic'),
      dl(3,'Clearwater Estates — 4 Lots','Developer Greg Fry','Developer','active',52000,'inspection','2026-03-27',null,'4 new residential septic systems. Permits approved.','Commercial',15,'Septic'),
      dl(4,'Northview Church Camp','Admin Dir Phil Carr','Admin','stalled',44000,'estimate','2026-03-20','no_response','Camp facility new system + pump station. No reply.','Institutional',36,'Septic'),
      dl(5,'Weber Vacation Property','Bill Weber','Homeowner','stalled',18400,'estimate','2026-03-22','price_objection','Lake cabin new install. Remote site adds cost.','Residential',24,'Septic'),
      dl(6,'Ridgecrest RV Park','Owner Sam Nash','Owner','cold',38000,'lead','2026-04-12','timing','RV park system upgrade. Waiting on county permits.','Commercial',44,'Septic'),
      dl(7,'Torres Rural Property','Miguel Torres','Homeowner','won',14200,'completed',null,null,'Closed! New 1,000-gal system. Excavation 3/30.','Residential',18,'Septic'),
      dl(8,'Park Ridge Animal Clinic','Dr. Gina Park','Owner','active',22000,'approved','2026-03-26',null,'Commercial-rated system for new vet clinic. Near close.','Commercial',16,'Septic'),
      dl(9,'County Road Properties LLC','Owner Roy Burns','Owner','lost',34000,'lost',null,'competitor','County health dept contractor won it directly.','Commercial',61,'Septic'),
    ],
    jobs: [
      dj(1,'Miguel & Carmen Torres','Rural Rt 4 Box 212, Bastrop TX 78602','Septic',14200,'In Progress','2026-03-25',[1,2,3],'Excavation done. Tank being set today.'),
      dj(2,'Carol Jensen — Oakwood Est','4200 Oakwood Ln, Bastrop TX 78602','Septic',15800,'Scheduled','2026-03-30',[1,2],'Permit issued. Crew scheduled 3/30.'),
      dj(3,'Clearwater Estates Lot 3','FM 969 & CR 155, Bastrop TX 78602','Septic',13000,'Complete','2026-03-14',[1,2,3,4,5,6,7,8,9,10],'1,000-gal system installed and inspected.'),
      dj(4,'Park Ridge Animal Clinic','3300 Park Ridge Rd, Denton TX 76210','Septic',22000,'Scheduled','2026-04-10',[1,2,3],'Commercial-grade design approved. Permits in.'),
    ],
  },
  'Tree Service': {
    leads: [
      dl(1,'Highland Park HOA','David Moore','Board President','cold',8600,'lead','2026-04-10','timing','15 trees to remove. Spring budget approval pending.','HOA',71,'Tree Service'),
      dl(2,'Morrison Residence','Carl Morrison','Homeowner','active',4800,'estimate','2026-03-25',null,'3 oaks over roof line. Storm risk. Emergency.','Residential',9,'Tree Service'),
      dl(3,'Clearbrook Office Park','Donna Pierce','Property Mgr','stalled',12000,'estimate','2026-03-20','no_response','10 trees removed + stump grinding. No reply.','Commercial',28,'Tree Service'),
      dl(4,'Weber Residence','Bill Weber','Homeowner','active',3400,'inspection','2026-03-27',null,'2 dead elms + 3 stumps. HOA requirement.','Residential',11,'Tree Service'),
      dl(5,'Northview Church','Elder Tom Ames','Admin','stalled',7200,'estimate','2026-03-22','price_objection','6 pine removals. $800 over expectation.','Institutional',24,'Tree Service'),
      dl(6,'Atlas Industrial Site','Ray Torres','Plant Mgr','cold',22000,'lead','2026-04-20','timing','Site clearing, 40+ trees. Permits not ready.','Industrial',38,'Tree Service'),
      dl(7,'Torres Residence','Miguel Torres','Homeowner','won',2800,'completed',null,null,'Closed! 2 trees + 3 stumps. Crew 3/27.','Residential',14,'Tree Service'),
      dl(8,'Lakewood School District','Carl Beck','Facilities Dir','active',9800,'approved','2026-03-26',null,'Annual tree maintenance + hazard removal. Near close.','Institutional',16,'Tree Service'),
      dl(9,'Ridgecrest HOA','HOA Mgr Tom Park','Mgr','lost',6400,'lost',null,'competitor','Went with the cheapest bid. No insurance.','HOA',44,'Tree Service'),
    ],
    jobs: [
      dj(1,'Miguel & Carmen Torres','4421 Sunset Ridge Rd, Austin TX 78731','Tree Service',2800,'Complete','2026-03-26',[1,2,3,4,5,6,7,8,9],'2 trees removed, 3 stumps ground. Site clean.'),
      dj(2,'Carl & Amy Morrison','4418 Ridgeway Dr, Garland TX 75040','Tree Service',4800,'Scheduled','2026-03-28',[1,2],'3 oaks. Equipment arriving tomorrow.'),
      dj(3,'Clearbrook Office Park','501 Commerce Dr, Dallas TX 75201','Tree Service',12000,'In Progress','2026-03-22',[1,2,3,4],'7 of 10 trees removed. Chipping done. 3 stumps to go.'),
      dj(4,'Bill & Carol Weber','4810 Meadowbrook Ln, Flower Mound TX 75028','Tree Service',3400,'Scheduled','2026-04-02',[1,2],'2 elms + 3 stumps. Crew booked 4/2.'),
    ],
  },
  'Seal Coating': {
    leads: [
      dl(1,'Westbrook Apartment Complex','Tony Vasquez','Property Mgr','active',8400,'estimate','2026-03-25',null,'Full parking lot, 60-space. Two coats required. Demo well received.','Commercial',10,'Seal Coating'),
      dl(2,'Meadowfield HOA','Linda Barnes','HOA President','stalled',14200,'approved','2026-03-21','budget_freeze','8,000 sq ft access roads + parking. Annual board vote needed.','HOA',37,'Seal Coating'),
      dl(3,'Morrison Residence','Carl Morrison','Homeowner','active',2800,'inspection','2026-03-27',null,'Driveway + apron, 1,200 sq ft. Ready to schedule.','Residential',7,'Seal Coating'),
      dl(4,'Atlas Industrial Park','Ray Torres','Plant Mgr','stalled',22000,'estimate','2026-03-20','no_response','Loading dock + 3 parking areas. No reply after 2 quotes.','Industrial',31,'Seal Coating'),
      dl(5,'Northview Church','Pastor Ellison','Admin','stalled',6400,'lead','2026-03-22','price_objection','Main lot + overflow, 4,500 sq ft. $400 over expectation.','Institutional',22,'Seal Coating'),
      dl(6,'Weber Residence','Bill Weber','Homeowner','cold',1900,'lead','2026-04-15','timing','1-car driveway. Wants spring. No urgency.','Residential',44,'Seal Coating'),
      dl(7,'Clearbrook Office Park','Donna Pierce','Property Mgr','won',11600,'completed',null,null,'Closed! 3 lots fully coated. Crew out 3/27.','Commercial',18,'Seal Coating'),
      dl(8,'Lakewood School District','Carl Beck','Facilities Dir','active',17800,'approved','2026-03-26',null,'4 entrance drives + bus loop. Near contract.','Institutional',14,'Seal Coating'),
      dl(9,'Torres Condo HOA','Miguel Torres','HOA Mgr','lost',9200,'lost',null,'competitor','Went with the lower bid — no two-coat guarantee.','HOA',42,'Seal Coating'),
    ],
    jobs: [
      dj(1,'Westbrook Apt Complex','1200 Westbrook Blvd, Dallas TX 75205','Seal Coating',8400,'In Progress','2026-03-22',[1,2,3,4],'First coat done. Second coat tomorrow AM.'),
      dj(2,'Carl & Amy Morrison','4418 Ridgeway Dr, Garland TX 75040','Seal Coating',2800,'Scheduled','2026-03-28',[1,2],'Driveway + apron. Surface clean. Ready to coat.'),
      dj(3,'Clearbrook Office Park','501 Commerce Dr, Dallas TX 75201','Seal Coating',11600,'Complete','2026-03-20',[1,2,3,4,5,6,7,8],'3 lots fully sealed. Curing complete. Client signed off.'),
      dj(4,'Lakewood School District','800 Lake Rd, Lakewood TX 75087','Seal Coating',17800,'Scheduled','2026-04-01',[1,2],'Contracts signed. Crew booked 4/1.'),
    ],
  },
  'Real Estate': {
    leads: [
      dl(1,'The Hargrove Family','Frank Hargrove','Seller','active',14400,'Listed','2026-03-25',null,'4/3 colonial, $485k. Open house scheduled 3/29. Strong interest.','Residential',10,'Real Estate'),
      dl(2,'Westbrook Investment LLC','Tony Vasquez','Investor','stalled',28000,'Consultation','2026-03-21','budget_freeze','Mixed-use duplex, $940k. Financing fell through on buyer side.','Commercial',33,'Real Estate'),
      dl(3,'Morrison Residence','Carl Morrison','Seller','active',9200,'Under Contract','2026-03-27',null,'3/2 ranch, $310k. Inspection cleared. Closing 4/15.','Residential',7,'Real Estate'),
      dl(4,'Clearbrook Retail Strip','Donna Pierce','Owner','stalled',44000,'Consultation','2026-03-20','no_response','6-unit retail strip, $1.47M. Three calls unanswered.','Commercial',26,'Real Estate'),
      dl(5,'Weber Estate Sale','Bill Weber','Heir','stalled',18000,'Listed','2026-03-22','price_objection','Estate property, $595k. Family disputes current asking price.','Residential',20,'Real Estate'),
      dl(6,'Torres Family','Miguel Torres','Buyer','cold',6800,'Lead','2026-04-10','timing','First-time buyer. Pre-approval pending. Not ready until May.','Residential',52,'Real Estate'),
      dl(7,'Kowalski Property','Brian Kowalski','Seller','won',22000,'Closed',null,null,'Closed! $735k. Commission earned 3/22.','Residential',30,'Real Estate'),
      dl(8,'Ridgecrest Partners','Tom Park','Investor','active',52000,'Closing','2026-03-26',null,'12-unit apartment building, $1.74M. Final walkthrough done.','Commercial',12,'Real Estate'),
      dl(9,'Highland Park Condo','Sarah Chen','Seller','lost',11000,'Consultation',null,null,'Signed with another agent. Pricing disagreement.','Residential',41,'Real Estate'),
    ],
    jobs: [
      dj(1,'The Hargrove Family','312 Maple Lane, Austin TX 78731','Real Estate',14400,'In Progress','2026-03-29',[1,2,3,4,5],'Open house scheduled. Photos and staging complete.'),
      dj(2,'Carl & Amy Morrison','4418 Ridgeway Dr, Garland TX 75040','Real Estate',9200,'In Progress','2026-04-15',[1,2,3,4,5,6,7,8],'Under contract. Inspection cleared. Closing 4/15.'),
      dj(3,'Brian & Nancy Kowalski','18 Westover Ct, Plano TX 75093','Real Estate',22000,'Complete','2026-03-22',[1,2,3,4,5,6,7,8,9,10],'Closed at $735k. Commission received.'),
      dj(4,'Ridgecrest Partners','4200 Commerce Blvd, Dallas TX 75201','Real Estate',52000,'In Progress','2026-03-28',[1,2,3,4,5,6,7,8],'Final walkthrough done. Closing docs prepared.'),
    ],
  },
  'Pressure Washing': {
    leads: [
      dl(1,'Bay Area Car Wash','Lena Torres','Owner','won',4200,'completed',null,null,'Closed! Full lot + canopy wash. 3/27.','Commercial',29,'Pressure Washing'),
      dl(2,'Morrison Residence','Carl Morrison','Homeowner','active',1800,'estimate','2026-03-25',null,'House exterior + driveway + fence. Annual contract.','Residential',8,'Pressure Washing'),
      dl(3,'Clearbrook Office Complex','Donna Pierce','Property Mgr','active',6400,'inspection','2026-03-27',null,'Parking deck + building exterior, 3 buildings.','Commercial',13,'Pressure Washing'),
      dl(4,'Northgate Restaurant Row','Strip Mgr Greg Lee','Mgr','stalled',8800,'estimate','2026-03-20','no_response','10-unit strip center, pre-season wash. No reply.','Commercial',28,'Pressure Washing'),
      dl(5,'Weber Residence','Bill Weber','Homeowner','stalled',2200,'lead','2026-03-22','price_objection','Driveway + deck. DIY pressure washer is tempting them.','Residential',18,'Pressure Washing'),
      dl(6,'Ridgecrest HOA','Tom Park','HOA Mgr','cold',12000,'lead','2026-04-05','timing','Common area annual wash. Budget Q2.','HOA',33,'Pressure Washing'),
      dl(7,'Torres Commercial Building','Miguel Torres','Owner','active',3600,'approved','2026-03-26',null,'4,000 sq ft brick exterior + awnings. Near close.','Commercial',12,'Pressure Washing'),
      dl(8,'Atlas Fleet Yard','Ann Webb','Plant Mgr','stalled',5400,'estimate','2026-03-21','budget_freeze','Warehouse floor + dock areas. Maintenance budget frozen.','Industrial',24,'Pressure Washing'),
      dl(9,'Lakewood School Campus','Carl Beck','Facilities Dir','lost',9000,'lost',null,'competitor','Custodial staff did it with district equipment.','Institutional',41,'Pressure Washing'),
    ],
    jobs: [
      dj(1,'Bay Area Car Wash','6600 Bay Area Blvd, Pasadena TX 77507','Pressure Washing',4200,'Scheduled','2026-03-27',[1,2],'Full lot + canopy. Equipment loaded.'),
      dj(2,'Clearbrook Office Complex','501 Commerce Dr, Dallas TX 75201','Pressure Washing',6400,'In Progress','2026-03-22',[1,2,3,4],'Bldg 1 & 2 done. Bldg 3 + parking deck today.'),
      dj(3,'Carl & Amy Morrison','4418 Ridgeway Dr, Garland TX 75040','Pressure Washing',1800,'Complete','2026-03-20',[1,2,3,4,5,6,7,8,9],'Full house wash, driveway, fence. Sealed and done.'),
      dj(4,'Torres Commercial Bldg','3300 Commercial Dr, Austin TX 78701','Pressure Washing',3600,'Scheduled','2026-03-29',[1,2],'Brick exterior + awnings. Crew booked 3/29.'),
    ],
  },
};

// ─── Trade Select Screen ───────────────────────────────────────────────────────
const CUSTOM_TRADE_DEMO = {
  checklist: [
    'Site assessment and water source check',
    'Design layout and zone mapping',
    'Trenching and pipe installation',
    'Head and emitter placement',
    'Controller and valve installation',
    'System pressure test and flush',
    'Zone programming and timer setup',
    'Final walkthrough with client',
  ],
  pipeline: ['Lead', 'Site Visit', 'Design', 'Installation', 'Testing', 'Complete'],
};

function TradeSelectScreen({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customResult, setCustomResult] = useState(null); // {name, checklist, pipeline}
  const [customError, setCustomError] = useState('');
  const goToSignup = () => { window.location.href = '/'; };

  const handleTryIt = () => {
    setCustomResult({ name: 'Irrigation', ...CUSTOM_TRADE_DEMO });
    setCustomError('');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1117',
      color: '#e2e8f0', fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '40px 24px 80px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f97316', letterSpacing: '-1px', marginBottom: 16 }}>
            RidgeOS
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>
            See RidgeOS built for your trade
          </div>
          <div style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
            Pick your trade to see a live demo tailored to your industry
          </div>
        </div>

        {/* Trade grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: 10,
          marginBottom: 16,
        }}>
          {TRADE_LIST.map(trade => {
            const color = TRADE_COLORS[trade];
            const isHovered = hovered === trade;
            return (
              <div
                key={trade}
                style={{
                  background: isHovered ? color + '18' : '#161b27',
                  border: `1px solid ${isHovered ? color : '#1e2535'}`,
                  borderRadius: 10, padding: '16px 10px',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.15s',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                  boxShadow: isHovered ? `0 6px 20px ${color}22` : 'none',
                }}
                onMouseEnter={() => setHovered(trade)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(trade)}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>
                  {TRADE_ICONS[trade]}
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: isHovered ? color : '#94a3b8',
                  lineHeight: 1.3,
                }}>
                  {trade}
                </div>
              </div>
            );
          })}

          {/* Custom trade tile */}
          <div
            style={{
              background: showCustom ? 'rgba(99,102,241,0.1)' : '#161b27',
              border: `1px dashed ${showCustom ? '#6366f1' : '#2d3748'}`,
              borderRadius: 10, padding: '16px 10px',
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.15s',
            }}
            onClick={() => { setShowCustom(true); setCustomResult(null); setCustomError(''); }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>✨</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: showCustom ? '#818cf8' : '#64748b', lineHeight: 1.3 }}>
              + Add your<br/>trade
            </div>
          </div>
        </div>

        {/* Custom trade panel */}
        {showCustom && (
          <div style={{
            background: '#161b27', border: '1px solid #1e2535',
            borderRadius: 12, padding: '20px 20px',
            marginBottom: 32,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
              ✨ Custom Trade Generator
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              AI builds your job checklist and pipeline stages automatically.
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input
                value={customInput}
                onChange={e => { setCustomInput(e.target.value); setCustomError(''); setCustomResult(null); }}
                placeholder="e.g. Irrigation, Tile Setter, Sign Hanging"
                style={{
                  flex: 1, minWidth: 200, padding: '9px 12px',
                  background: '#0f1117', border: '1px solid #2d3748',
                  borderRadius: 7, color: '#e2e8f0', fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleTryIt}
                style={{
                  padding: '9px 16px', background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.35)',
                  borderRadius: 7, color: '#818cf8',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Try it (Irrigation)
              </button>
              <DisabledTooltip active label="Sign up to generate your own trade">
                <button
                  style={{
                    padding: '9px 16px',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    border: 'none', borderRadius: 7,
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    cursor: 'not-allowed', opacity: 0.5, whiteSpace: 'nowrap',
                  }}
                  disabled
                >
                  Generate
                </button>
              </DisabledTooltip>
            </div>

            {customError && (
              <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 10 }}>
                {customError}
              </div>
            )}

            {customResult && (
              <div style={{
                background: '#0f1117', border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 8, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                      ✨ {customResult.name}
                    </span>
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                      AI Generated
                    </span>
                  </div>
                  <button
                    onClick={() => onSelect(customResult.name, customResult)}
                    style={{
                      padding: '7px 18px',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      border: 'none', borderRadius: 7,
                      color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    View {customResult.name} Demo →
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                      Job Checklist ({customResult.checklist.length} steps)
                    </div>
                    {customResult.checklist.map((step, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#94a3b8', padding: '3px 0', borderBottom: '1px solid #1e2535', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, color: '#475569', minWidth: 16 }}>{i + 1}.</span>
                        {step}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                      Pipeline Stages
                    </div>
                    {customResult.pipeline.map((stage, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#94a3b8', padding: '3px 0', borderBottom: '1px solid #1e2535', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, background: '#6366f120', color: '#818cf8', borderRadius: 4, padding: '1px 5px', minWidth: 18, textAlign: 'center' }}>{i + 1}</span>
                        {stage}
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
                      🔒 Sign up to generate your own trade with real data
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
            Already have an account?
          </div>
          <button
            onClick={goToSignup}
            style={{
              padding: '10px 28px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 8,
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Sign In / Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Photo Log Tab ────────────────────────────────────────────────────────────
const DEMO_PHOTOS = [
  { id: '1', phase: 'before',  caption: 'NE corner damage',              takenBy: 'Dave M.', time: '8:14 AM',  clientFacing: true  },
  { id: '2', phase: 'before',  caption: 'Flashing separation',           takenBy: 'Dave M.', time: '8:21 AM',  clientFacing: false },
  { id: '3', phase: 'during',  caption: 'Old shingles removed',          takenBy: 'Dave M.', time: '10:02 AM', clientFacing: false },
  { id: '4', phase: 'during',  caption: 'Ice & water barrier installed', takenBy: 'Dave M.', time: '11:30 AM', clientFacing: true  },
  { id: '5', phase: 'damage',  caption: 'Deck rot — 4×8 section',        takenBy: 'Dave M.', time: '9:02 AM',  clientFacing: true  },
  { id: '6', phase: 'after',   caption: 'Completed — south face',        takenBy: 'Dave M.', time: '3:45 PM',  clientFacing: true  },
];

const PHASE_META = {
  before: { label: 'Before', color: '#3b82f6' },
  during: { label: 'During', color: '#f59e0b' },
  after:  { label: 'After',  color: '#22c55e' },
  damage: { label: 'Damage', color: '#ef4444' },
};

function PhotoLogTab({ tier }) {
  const isMobile = useMobile();
  const [phaseFilter, setPhaseFilter] = useState('all');

  const filtered = phaseFilter === 'all'
    ? DEMO_PHOTOS
    : DEMO_PHOTOS.filter(p => p.phase === phaseFilter);

  const clientCount = DEMO_PHOTOS.filter(p => p.clientFacing).length;

  // Locked for Starter — section is visible but blurred with an overlay
  const isLocked = tier === 'starter';

  const gridCols = isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))';

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Photo Log</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Job site documentation &amp; client report photos
          </div>
        </div>
        <DisabledTooltip active label="Available on Starter and above">
          <button
            style={{
              padding: '7px 14px', borderRadius: 7,
              background: '#1a1f2e', border: '1px solid #2d3748',
              color: '#475569', fontSize: 12, fontWeight: 600,
              cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6,
            }}
            disabled
          >
            <span style={{ fontSize: 14 }}>📷</span>
            + Add Photo
          </button>
        </DisabledTooltip>
      </div>

      {/* Tier callout */}
      <div style={{
        background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)',
        borderRadius: 8, padding: '10px 14px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>📸</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f97316', marginBottom: 4 }}>
            Photo Log — tier features
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 6 : 16 }}>
            {[
              { tier: 'Starter', color: '#64748b', desc: 'Photo upload + captions' },
              { tier: 'Pro',     color: '#f97316', desc: 'Client-facing toggle + PDF export' },
              { tier: 'Business',color: '#6366f1', desc: 'Crew attribution + bulk download' },
            ].map(({ tier: t, color, desc }) => (
              <span key={t} style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10, background: color + '22', color, border: `1px solid ${color}33` }}>{t}</span>
                {desc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Locked overlay wrapper */}
      <div style={{ position: 'relative' }}>
        {isLocked && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(15,17,23,0.72)',
            backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
            borderRadius: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 32 }}>🔒</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Photo Log — Pro feature</div>
            <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', maxWidth: 260 }}>
              Upgrade to Pro or Business to access the photo log.
            </div>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                marginTop: 4, padding: '7px 20px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none', borderRadius: 7,
                color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Phase filter pills */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 16,
          overflowX: 'auto', flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        }}>
          <button
            style={S.filterBtn(phaseFilter === 'all')}
            onClick={() => setPhaseFilter('all')}
          >
            All ({DEMO_PHOTOS.length})
          </button>
          {Object.entries(PHASE_META).map(([key, meta]) => {
            const count = DEMO_PHOTOS.filter(p => p.phase === key).length;
            return (
              <button
                key={key}
                style={{
                  ...S.filterBtn(phaseFilter === key),
                  ...(phaseFilter === key ? { background: meta.color, borderColor: meta.color } : {}),
                }}
                onClick={() => setPhaseFilter(key)}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Photo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 14 }}>
          {filtered.map(photo => {
            const phase = PHASE_META[photo.phase];
            return (
              <div
                key={photo.id}
                style={{
                  background: '#161b27', border: '1px solid #1e2535',
                  borderRadius: 10, overflow: 'hidden',
                }}
              >
                {/* Thumbnail placeholder */}
                <div style={{
                  height: 130, background: '#0d1117',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 8, position: 'relative',
                  borderBottom: '1px solid #1e2535',
                }}>
                  {/* Phase badge on thumbnail */}
                  <span style={{
                    position: 'absolute', top: 8, left: 8,
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                    background: phase.color + '33', color: phase.color,
                    border: `1px solid ${phase.color}44`, letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                  }}>
                    {phase.label}
                  </span>
                  {/* PDF badge */}
                  {photo.clientFacing && (
                    <span style={{
                      position: 'absolute', top: 8, right: 8,
                      fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                      background: 'rgba(99,102,241,0.2)', color: '#818cf8',
                      border: '1px solid rgba(99,102,241,0.3)', letterSpacing: '0.4px',
                    }}>
                      PDF
                    </span>
                  )}
                  {/* Camera icon SVG */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span style={{ fontSize: 11, color: '#374151' }}>{photo.time}</span>
                </div>

                {/* Card body */}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    {photo.caption}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    📷 {photo.takenBy}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 16, padding: '9px 14px',
          background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 7, fontSize: 12, color: '#94a3b8',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>{clientCount}</span>
          {' '}photo{clientCount !== 1 ? 's' : ''} marked for client PDF report
        </div>
      </div>
    </div>
  );
}

// ─── Demo Dashboard ────────────────────────────────────────────────────────────
const TIER_META = {
  starter: { label: 'Starter', color: '#64748b', desc: 'Basic pipeline management' },
  pro:     { label: 'Pro',     color: '#f97316', desc: 'AI coaching + full analytics' },
  business:{ label: 'Business',color: '#6366f1', desc: 'Team management + export' },
};

function DemoDashboard({ trade, onChangeTrade, customTradeConfig }) {
  const [tier, setTier] = useState('pro');
  const [tab, setTab] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState(null);
  const isMobile = useMobile();
  const goToSignup = () => { window.location.href = '/'; };
  const tradeColor = TRADE_COLORS[trade] || '#6366f1';
  // For custom trades, remap Roofing sample data to the custom trade name
  const data = TRADE_DEMO_DATA[trade] || (() => {
    const base = TRADE_DEMO_DATA['Roofing'];
    return {
      leads: base.leads.map(l => ({ ...l, trade })),
      jobs: base.jobs.map(j => ({ ...j, trade })),
    };
  })();

  // Build available tabs based on tier
  const allTabs = [
    { key: 'pipeline',  label: 'Pipeline',  locked: false },
    { key: 'callbacks', label: 'Callbacks', locked: false },
    { key: 'analytics', label: 'Analytics', locked: tier === 'starter' },
    { key: 'jobs',      label: 'Jobs',      locked: tier === 'starter' },
    { key: 'photos',    label: 'Photos',    locked: false },
    { key: 'team',      label: 'Team',      locked: tier !== 'business' },
  ].filter(t => tier === 'business' || t.key !== 'team');

  // Reset to pipeline when switching to starter if on a locked tab
  const handleTierChange = (newTier) => {
    setTier(newTier);
    if (newTier === 'starter' && (tab === 'analytics' || tab === 'jobs' || tab === 'team')) {
      setTab('pipeline');
    }
    if (newTier !== 'business' && tab === 'team') {
      setTab('pipeline');
    }
  };

  const tierColor = TIER_META[tier].color;

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1117',
      color: '#e2e8f0', fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Top demo banner */}
      <div style={{
        background: 'rgba(249,115,22,0.08)',
        borderBottom: '1px solid rgba(249,115,22,0.15)',
        padding: '9px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        fontSize: 13, color: '#f97316',
        position: 'sticky', top: 0, zIndex: 200,
        flexWrap: 'wrap',
      }}>
        <span>
          👋 You're viewing the <strong>{trade}</strong> demo — your data stays private when you sign up
        </span>
        <button
          onClick={goToSignup}
          style={{
            padding: '4px 14px', background: '#f97316',
            border: 'none', borderRadius: 6, color: '#fff',
            fontWeight: 700, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          Start Free Trial
        </button>
      </div>

      {/* Tier selector bar */}
      <div style={{
        background: '#0d1117', borderBottom: '1px solid #1e2535',
        padding: isMobile ? '8px 12px' : '10px 24px',
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap',
        overflowX: isMobile ? 'auto' : 'visible',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, marginRight: 2, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Tier:
        </span>
        {Object.entries(TIER_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => handleTierChange(key)}
            style={{
              padding: isMobile ? '7px 14px' : '5px 16px', borderRadius: 20, border: 'none',
              fontWeight: 600, fontSize: isMobile ? 13 : 12, cursor: 'pointer',
              background: tier === key ? meta.color : '#1a1f2e',
              color: tier === key ? '#fff' : '#64748b',
              transition: 'all 0.15s', flexShrink: 0,
              outline: tier === key ? `2px solid ${meta.color}44` : 'none', outlineOffset: 1,
              minHeight: isMobile ? 36 : 'auto',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {meta.label}
          </button>
        ))}
        {!isMobile && (
          <span style={{ marginLeft: 8, fontSize: 12, color: '#475569' }}>
            — {TIER_META[tier].desc}
          </span>
        )}
      </div>

      {/* Starter: lead limit warning */}
      {tier === 'starter' && (
        <div style={{
          background: 'rgba(234,179,8,0.08)', borderBottom: '1px solid rgba(234,179,8,0.2)',
          padding: isMobile ? '8px 12px' : '9px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: isMobile ? 12 : 13, color: '#eab308', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚠</span>
            <span>
              {isMobile
                ? <><strong>8 of 10 leads</strong> used (80%) — upgrade for unlimited</>
                : <>You've used <strong>8 of 10 leads</strong> on the Starter plan (80%). Upgrade to unlock unlimited leads.</>
              }
            </span>
          </span>
          <button
            onClick={goToSignup}
            style={{
              padding: isMobile ? '8px 14px' : '4px 14px', background: '#eab308', border: 'none',
              borderRadius: 6, color: '#0f1117', fontWeight: 700,
              fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
              minHeight: isMobile ? 36 : 'auto',
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: '#161b27', borderBottom: '1px solid #1e2535',
        padding: isMobile ? '0 12px' : '0 24px',
        display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12,
        height: isMobile ? 52 : 54,
      }}>
        <button
          onClick={onChangeTrade}
          style={{
            background: 'transparent', border: '1px solid #1e2535',
            borderRadius: 6, color: '#64748b', fontSize: isMobile ? 13 : 12,
            cursor: 'pointer', padding: isMobile ? '8px 10px' : '5px 12px',
            whiteSpace: 'nowrap', minHeight: isMobile ? 38 : 'auto',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← {isMobile ? 'Back' : 'Change trade'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: tradeColor, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            {TRADE_ICONS[trade] || '✨'} {isMobile ? trade : `${trade} Demo`}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
            background: tierColor + '20', color: tierColor,
            border: `1px solid ${tierColor}33`, letterSpacing: '0.5px', whiteSpace: 'nowrap',
          }}>
            {TIER_META[tier].label.toUpperCase()}
          </span>
        </div>

        {/* Desktop: tab buttons in header */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
            {allTabs.map(({ key, label, locked }) => (
              <DisabledTooltip key={key} active={locked} label={`${label} — upgrade to access`}>
                <button
                  style={{
                    padding: '6px 14px', borderRadius: 6, border: 'none',
                    cursor: locked ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500,
                    background: tab === key ? tierColor : 'transparent',
                    color: locked ? '#2d3748' : tab === key ? '#fff' : '#94a3b8',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
                  }}
                  onClick={() => !locked && setTab(key)}
                >
                  {locked && <span style={{ fontSize: 10 }}>🔒</span>}
                  {label}
                </button>
              </DisabledTooltip>
            ))}
          </div>
        )}

        <button
          onClick={goToSignup}
          style={{
            marginLeft: isMobile ? 'auto' : 8,
            padding: isMobile ? '8px 12px' : '6px 16px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 7,
            color: '#fff', fontWeight: 700, fontSize: isMobile ? 12 : 12,
            cursor: 'pointer', whiteSpace: 'nowrap',
            minHeight: isMobile ? 38 : 'auto',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {isMobile ? 'Sign Up' : 'Start Free Trial →'}
        </button>
      </header>

      {/* Content */}
      <main style={{
        padding: isMobile ? '16px 12px' : 24,
        maxWidth: 1400, margin: '0 auto',
        paddingBottom: isMobile ? 80 : 88,
      }}>
        {tab === 'pipeline' && (
          <PipelineTab
            leads={data.leads}
            onSelectLead={setSelectedLead}
            onAddLead={null}
            onEditLead={null}
            onDeleteLead={null}
            demoMode={true}
          />
        )}
        {tab === 'callbacks' && (
          <CallbacksTab leads={data.leads} onSelectLead={setSelectedLead} />
        )}
        {tab === 'analytics' && (
          <AnalyticsTab leads={data.leads} tier={tier} />
        )}
        {tab === 'jobs' && (
          <JobsTab jobs={data.jobs} customChecklist={customTradeConfig?.checklist} />
        )}
        {tab === 'photos' && (
          <PhotoLogTab tier={tier} />
        )}
        {tab === 'team' && (
          <TeamTab />
        )}
      </main>

      {/* Mobile: BottomNav replaces sticky CTA */}
      {isMobile ? (
        <BottomNav
          tab={tab}
          setTab={setTab}
          color={tierColor}
          tabs={allTabs.map(t => ({
            ...t,
            icon: NAV_TABS.find(n => n.key === t.key)?.icon || '•',
          }))}
        />
      ) : (
        /* Desktop: sticky CTA bar */
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#161b27', borderTop: '1px solid #1e2535',
          padding: '13px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 20, zIndex: 100,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: 14, color: '#cbd5e1' }}>
            Like what you see?{' '}
            <span style={{ color: '#f97316', fontWeight: 600 }}>Start your 14-day free trial</span>
            {' '}— no credit card required
          </span>
          <button
            onClick={goToSignup}
            style={{
              padding: '8px 22px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 8,
              color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Get Started Free
          </button>
        </div>
      )}

      {selectedLead && (
        <CoachPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          demoMode={true}
          tier={tier}
          onStageChange={(newStage) => setSelectedLead(prev => ({ ...prev, stage: newStage }))}
        />
      )}
    </div>
  );
}

// ─── Demo Page (router) ────────────────────────────────────────────────────────
// ─── Demo Page ────────────────────────────────────────────────────────────────
function DemoPage() {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [customTradeConfig, setCustomTradeConfig] = useState(null);

  const handleSelect = (trade, config) => {
    setSelectedTrade(trade);
    setCustomTradeConfig(config || null);
  };

  if (!selectedTrade) {
    return <TradeSelectScreen onSelect={handleSelect} />;
  }
  return (
    <DemoDashboard
      trade={selectedTrade}
      onChangeTrade={() => { setSelectedTrade(null); setCustomTradeConfig(null); }}
      customTradeConfig={customTradeConfig}
    />
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export { DemoPage };

export default function App() {
  const [screen, setScreen] = useState('login'); // 'login' | 'onboarding' | 'app'
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadModal, setLeadModal] = useState(null); // null | 'add' | lead-object (edit)

  // Persistent leads for real (non-demo) users
  const [userLeads, setUserLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('cl_leads');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist to localStorage whenever userLeads changes (non-demo only)
  useEffect(() => {
    if (session && !session.isDemo) {
      localStorage.setItem('cl_leads', JSON.stringify(userLeads));
    }
  }, [userLeads, session]);

  const handleLogin = (sess) => {
    setSession(sess);
    setScreen('app');
    setTab('pipeline');
  };

  const handleOnboardingComplete = (sess) => {
    setSession(sess);
    setScreen('app');
    setTab('pipeline');
  };

  const handleAddLead = (leadData) => {
    setUserLeads(prev => [leadData, ...prev]);
    setLeadModal(null);
  };

  const handleEditLead = (leadData) => {
    setUserLeads(prev => prev.map(l => l.id === leadData.id ? leadData : l));
    setLeadModal(null);
  };

  const handleDeleteLead = (id) => {
    setUserLeads(prev => prev.filter(l => l.id !== id));
  };

  const isMobile = useMobile();

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onStartSignup={() => setScreen('onboarding')}
      />
    );
  }

  if (screen === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onBackToLogin={() => setScreen('login')}
      />
    );
  }

  const isDemo = session?.isDemo;
  const leads = isDemo ? DEMO_LEADS : userLeads;
  const jobs = isDemo ? DEMO_JOBS : [];
  const userTrade = session?.trade || 'Roofing';
  const companyName = session?.companyName || 'RidgeOS';
  const userCustomChecklist = session?.customTradeConfig?.checklist || null;

  // Only expose mutators for non-demo accounts
  const addLeadHandler = isDemo ? null : () => setLeadModal('add');
  const editLeadHandler = isDemo ? null : (lead) => setLeadModal(lead);
  const deleteLeadHandler = isDemo ? null : handleDeleteLead;

  return (
    <div style={S.app}>
      <header style={{
        ...S.header,
        ...(isMobile ? { padding: '0 16px', height: 52 } : {}),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={S.logo}>RidgeOS</span>
          {isDemo && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(249,115,22,0.12)', color: '#f97316',
              border: '1px solid rgba(249,115,22,0.2)', letterSpacing: '0.5px',
            }}>
              DEMO
            </span>
          )}
          {!isMobile && companyName !== 'RidgeOS' && (
            <span style={S.logoSub}>{companyName}</span>
          )}
        </div>

        {/* Desktop tabs */}
        {!isMobile && (
          <div style={S.tabs}>
            {NAV_TABS.map(({ key, label }) => (
              <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => { setScreen('login'); setSession(null); }}
          style={{
            marginLeft: 'auto', background: 'transparent', border: 'none',
            color: '#475569', cursor: 'pointer', fontSize: isMobile ? 13 : 12,
            padding: isMobile ? '8px 4px' : '4px 8px', borderRadius: 6,
            minHeight: isMobile ? 44 : 'auto',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Sign out
        </button>
      </header>

      <main style={{
        ...S.body,
        ...(isMobile ? { padding: '16px 12px', paddingBottom: 80 } : {}),
      }}>
        {tab === 'pipeline' && (
          leads.length === 0
            ? <EmptyState
                icon="📋"
                title="No leads yet"
                sub="Start building your pipeline by adding your first lead."
                btnLabel="Add your first lead"
                onAction={addLeadHandler}
              />
            : <PipelineTab
                leads={leads}
                onSelectLead={setSelectedLead}
                onAddLead={addLeadHandler}
                onEditLead={editLeadHandler}
                onDeleteLead={deleteLeadHandler}
              />
        )}
        {tab === 'callbacks' && (
          <CallbacksTab leads={leads} onSelectLead={setSelectedLead} />
        )}
        {tab === 'analytics' && (
          <AnalyticsTab leads={leads} />
        )}
        {tab === 'jobs' && (
          jobs.length === 0
            ? <EmptyState
                icon="🔨"
                title="No jobs yet"
                sub={`Add your first ${userTrade} job to start tracking progress.`}
                btnLabel="Add your first job"
              />
            : <JobsTab jobs={jobs} customChecklist={userCustomChecklist} />
        )}
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && <BottomNav tab={tab} setTab={setTab} />}

      {selectedLead && (
        <CoachPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStageChange={(newStage) => {
            setUserLeads(prev => prev.map(l =>
              l.id === selectedLead.id ? { ...l, stage: newStage } : l
            ));
            setSelectedLead(prev => ({ ...prev, stage: newStage }));
          }}
        />
      )}

      {leadModal && (
        <AddLeadModal
          lead={leadModal === 'add' ? null : leadModal}
          defaultTrade={userTrade}
          customTrade={!TRADE_LIST.includes(userTrade) ? userTrade : null}
          onSave={leadModal === 'add' ? handleAddLead : handleEditLead}
          onClose={() => setLeadModal(null)}
        />
      )}
    </div>
  );
}
