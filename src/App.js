import { useState, useMemo, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';

// ─── Trades ──────────────────────────────────────────────────────────────────
const TRADE_LIST = [
  'Roofing', 'Gutters', 'Siding', 'Windows', 'Excavation',
  'General Construction', 'HVAC', 'Plumbing', 'Welding', 'Electrical',
  'Masonry', 'Painting', 'Flooring', 'Insulation', 'Drywall',
  'Landscaping', 'Concrete', 'Fencing', 'Carpentry', 'Waterproofing',
  'Solar', 'Garage Doors', 'Demolition', 'Septic', 'Tree Service',
  'Pressure Washing',
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
};

// ─── Demo Data ───────────────────────────────────────────────────────────────
const DEMO_LEADS = [
  {
    id: 1, name: 'Hargrove Residence', contact: 'Frank Hargrove', role: 'Homeowner',
    trade: 'Roofing', status: 'stalled', value: 14800, stage: 'proposal',
    callbackDate: '2026-03-25', lastContact: '2026-03-10',
    stallReason: 'price_objection', notes: 'Wants 15% off. Comparing 2 other bids.',
    industry: 'Residential', dealAge: 22,
  },
  {
    id: 2, name: 'Greenfield Office Park', contact: 'Dana Nguyen', role: 'Property Manager',
    trade: 'HVAC', status: 'stalled', value: 23500, stage: 'negotiation',
    callbackDate: '2026-03-24', lastContact: '2026-03-08',
    stallReason: 'budget_freeze', notes: 'Q1 budget locked. Revisit April per board decision.',
    industry: 'Commercial', dealAge: 38,
  },
  {
    id: 3, name: 'Martinez Family', contact: 'Rosa Martinez', role: 'Homeowner',
    trade: 'Windows', status: 'active', value: 18700, stage: 'qualified',
    callbackDate: '2026-03-23', lastContact: '2026-03-20',
    stallReason: null, notes: 'Replacing 12 windows. Anderson 400 series preferred.',
    industry: 'Residential', dealAge: 9,
  },
  {
    id: 4, name: 'Sunridge Apartments', contact: 'Todd Whitfield', role: 'Building Manager',
    trade: 'Plumbing', status: 'stalled', value: 11400, stage: 'proposal',
    callbackDate: '2026-03-19', lastContact: '2026-03-05',
    stallReason: 'no_response', notes: '3 follow-ups, no reply. 24-unit re-pipe job.',
    industry: 'Commercial', dealAge: 41,
  },
  {
    id: 5, name: 'Pinnacle Retail Center', contact: 'Jeff Bloom', role: 'Facilities Director',
    trade: 'Electrical', status: 'active', value: 31200, stage: 'negotiation',
    callbackDate: '2026-03-26', lastContact: '2026-03-21',
    stallReason: null, notes: '400A panel upgrade + 6 EV charger circuits. Near close.',
    industry: 'Commercial', dealAge: 27,
  },
  {
    id: 6, name: 'Keller Residence', contact: 'Amy Keller', role: 'Homeowner',
    trade: 'Siding', status: 'stalled', value: 22600, stage: 'proposal',
    callbackDate: '2026-03-22', lastContact: '2026-03-12',
    stallReason: 'competitor', notes: 'Got lower bid from another company. Need to show value.',
    industry: 'Residential', dealAge: 35,
  },
  {
    id: 7, name: 'Westview HOA', contact: 'Susan Park', role: 'HOA President',
    trade: 'General Construction', status: 'active', value: 94000, stage: 'qualified',
    callbackDate: '2026-03-27', lastContact: '2026-03-18',
    stallReason: null, notes: 'Community center addition. Board vote scheduled for 3/28.',
    industry: 'HOA', dealAge: 18,
  },
  {
    id: 8, name: 'Magnolia Square', contact: 'Ryan Chen', role: 'Property Manager',
    trade: 'Gutters', status: 'stalled', value: 5800, stage: 'proposal',
    callbackDate: '2026-03-15', lastContact: '2026-03-03',
    stallReason: 'technical_fit', notes: 'Concerned about K-style vs half-round fit on older building.',
    industry: 'Commercial', dealAge: 49,
  },
  {
    id: 9, name: 'Clearwater Gym', contact: 'Marcus Brown', role: 'Owner',
    trade: 'Flooring', status: 'cold', value: 17200, stage: 'contacted',
    callbackDate: '2026-04-05', lastContact: '2026-02-20',
    stallReason: 'timing', notes: 'Remodel on hold until summer. Follow up Q2.',
    industry: 'Commercial', dealAge: 64,
  },
  {
    id: 10, name: 'Riverside Church', contact: 'Pastor James Willis', role: 'Facilities Coord',
    trade: 'Painting', status: 'won', value: 9400, stage: 'won',
    callbackDate: null, lastContact: '2026-03-17',
    stallReason: null, notes: 'Closed! Exterior repaint starting April 1.',
    industry: 'Institutional', dealAge: 55,
  },
  {
    id: 11, name: 'Sagebrush Ranch', contact: 'Dale Cooper', role: 'Ranch Owner',
    trade: 'Fencing', status: 'stalled', value: 28500, stage: 'negotiation',
    callbackDate: '2026-03-23', lastContact: '2026-03-13',
    stallReason: 'wrong_contact', notes: 'Need to reach spouse who holds the purse strings.',
    industry: 'Residential', dealAge: 46,
  },
  {
    id: 12, name: 'Brookhaven Commons', contact: 'Tina Rosario', role: 'HOA Director',
    trade: 'Landscaping', status: 'active', value: 34800, stage: 'proposal',
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
    trade: 'Solar', status: 'stalled', value: 42000, stage: 'negotiation',
    callbackDate: '2026-03-23', lastContact: '2026-03-15',
    stallReason: 'budget_freeze', notes: 'Waiting on utility rebate approval. Big deal.',
    industry: 'Residential', dealAge: 74,
  },
  {
    id: 15, name: 'Lakewood Auto', contact: 'Steve Kim', role: 'Shop Owner',
    trade: 'Garage Doors', status: 'active', value: 7200, stage: 'qualified',
    callbackDate: '2026-03-28', lastContact: '2026-03-23',
    stallReason: null, notes: '3 commercial overhead doors. Second call scheduled.',
    industry: 'Commercial', dealAge: 8,
  },
  {
    id: 16, name: 'Heritage Inn', contact: 'Patricia Lawson', role: 'General Manager',
    trade: 'Masonry', status: 'active', value: 26400, stage: 'proposal',
    callbackDate: '2026-03-26', lastContact: '2026-03-19',
    stallReason: null, notes: 'Retaining wall + patio resurfacing. Historic property.',
    industry: 'Commercial', dealAge: 20,
  },
  {
    id: 17, name: 'City Storage LLC', contact: 'Nick Ferreira', role: 'Operations Mgr',
    trade: 'Demolition', status: 'stalled', value: 38000, stage: 'proposal',
    callbackDate: '2026-03-20', lastContact: '2026-03-04',
    stallReason: 'budget_freeze', notes: 'Old warehouse demo. Full board approval pending.',
    industry: 'Commercial', dealAge: 53,
  },
  {
    id: 18, name: 'Oakwood Estates', contact: 'Carol Jensen', role: 'Homeowner',
    trade: 'Septic', status: 'active', value: 15800, stage: 'qualified',
    callbackDate: '2026-03-25', lastContact: '2026-03-20',
    stallReason: null, notes: 'Failing system. Urgent job. Permits in process.',
    industry: 'Residential', dealAge: 12,
  },
  {
    id: 19, name: 'Highland Park HOA', contact: 'David Moore', role: 'Board President',
    trade: 'Tree Service', status: 'cold', value: 8600, stage: 'contacted',
    callbackDate: '2026-04-10', lastContact: '2026-02-28',
    stallReason: 'timing', notes: '15 trees to remove. Waiting on spring budget approval.',
    industry: 'HOA', dealAge: 71,
  },
  {
    id: 20, name: 'Bay Area Car Wash', contact: 'Lena Torres', role: 'Owner',
    trade: 'Pressure Washing', status: 'won', value: 4200, stage: 'won',
    callbackDate: null, lastContact: '2026-03-18',
    stallReason: null, notes: 'Closed! Full lot + canopy wash scheduled 3/27.',
    industry: 'Commercial', dealAge: 29,
  },
  {
    id: 21, name: 'Summit Developers', contact: 'Greg Patterson', role: 'Project Manager',
    trade: 'Excavation', status: 'stalled', value: 67000, stage: 'negotiation',
    callbackDate: '2026-03-22', lastContact: '2026-03-11',
    stallReason: 'price_objection', notes: 'Large site clearing. Need to value-engineer scope.',
    industry: 'Commercial', dealAge: 45,
  },
  {
    id: 22, name: 'Iron Works Industrial', contact: 'Carlos Reyes', role: 'Plant Manager',
    trade: 'Welding', status: 'active', value: 19800, stage: 'qualified',
    callbackDate: '2026-03-27', lastContact: '2026-03-21',
    stallReason: null, notes: 'Steel platform fabrication + install. Strong fit.',
    industry: 'Industrial', dealAge: 17,
  },
  {
    id: 23, name: 'Northgate Mall', contact: 'Janet Farley', role: 'Facilities Mgr',
    trade: 'Insulation', status: 'stalled', value: 31500, stage: 'proposal',
    callbackDate: '2026-03-21', lastContact: '2026-03-07',
    stallReason: 'no_response', notes: 'Submitted proposal 2 weeks ago. Zero feedback.',
    industry: 'Commercial', dealAge: 58,
  },
  {
    id: 24, name: 'Sunrise Senior Living', contact: 'Andrew Mills', role: 'Maintenance Dir',
    trade: 'Drywall', status: 'active', value: 13200, stage: 'proposal',
    callbackDate: '2026-03-26', lastContact: '2026-03-20',
    stallReason: null, notes: 'Wing renovation. 40 rooms. On track.',
    industry: 'Institutional', dealAge: 22,
  },
  {
    id: 25, name: 'The Craftsman Kitchen', contact: 'Sandra Yee', role: 'Owner',
    trade: 'Carpentry', status: 'stalled', value: 24100, stage: 'negotiation',
    callbackDate: '2026-03-23', lastContact: '2026-03-14',
    stallReason: 'technical_fit', notes: 'Custom cabinet specs need rework. Awaiting revisions.',
    industry: 'Commercial', dealAge: 40,
  },
  {
    id: 26, name: 'Harbor View Condos', contact: 'Robert Chang', role: 'Board Treasurer',
    trade: 'Waterproofing', status: 'stalled', value: 47500, stage: 'proposal',
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

const STAGE_ORDER = ['contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
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
    padding: '5px 14px',
    borderRadius: 20,
    border: `1px solid ${active ? '#f97316' : '#1e2535'}`,
    background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
    color: active ? '#f97316' : '#94a3b8',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
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
    position: 'absolute', top: 16, right: 16,
    background: 'transparent', border: 'none',
    color: '#64748b', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4,
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + n.toLocaleString();

const diffDays = (dateStr) => {
  if (!dateStr) return null;
  return Math.round((new Date(dateStr) - new Date(TODAY)) / 86400000);
};

const PLAYBOOKS = {
  price_objection: [
    'Lead with value, not price — restate the ROI impact for their specific use case',
    'Offer a phased rollout to reduce initial commitment and perceived risk',
    'Prepare a competitor TCO comparison highlighting long-term cost advantages',
    'Escalate to decision-maker level with a written business case before any concessions',
  ],
  budget_freeze: [
    'Lock in a specific re-engage calendar date before the call ends',
    'Explore creative structuring — split the invoice across fiscal quarters',
    'Identify an emergency exception budget path directly with the decision-maker',
    'Keep warm with monthly value-add content; never go fully dark',
  ],
  no_response: [
    'Switch channels immediately — try a direct call instead of email',
    'Send a "permission to close" message to create urgency and get a response',
    'Reach out to a different contact in the org to re-establish the relationship',
    'Reference a recent event or season to make your outreach timely and relevant',
  ],
  competitor: [
    'Request a head-to-head comparison using their actual project specs',
    'Identify 3 differentiators they have not yet seen or evaluated',
    'Pull in a reference from a similar project in their area',
    'Offer a warranty or service guarantee the competitor cannot match',
  ],
  timing: [
    'Set a hard go/no-go date and get it on their calendar now',
    'Propose a site assessment or pre-work that starts immediately despite the timing',
    'Ask what specific milestones would make the timing right — get concrete answers',
    'Maintain value touches every 3 weeks with completed project photos and case studies',
  ],
  wrong_contact: [
    'Ask your current contact to make a warm intro to the real decision-maker',
    'Research the org or household decision chain before your next call',
    'Send value content directly to the target decision-maker',
    'Use the framing: "I want to make sure the right people are aligned before we move forward"',
  ],
  technical_fit: [
    'Schedule a dedicated technical walkthrough to address their specific concerns',
    'Prepare a custom scope document tailored to their exact requirements',
    'Offer a time-boxed site visit or mock-up to prove fit',
    'Bring in references from customers who had similar technical challenges',
  ],
};

// ─── Add / Edit Lead Modal ────────────────────────────────────────────────────
const LEAD_SOURCES = ['Referral', 'Door knock', 'Online', 'Phone call', 'Repeat customer', 'Other'];
const LEAD_STAGES = ['contacted', 'qualified', 'proposal', 'negotiation'];

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

function AddLeadModal({ lead, defaultTrade, onSave, onClose }) {
  const isEdit = !!lead;
  const [form, setForm] = useState({
    name: lead?.name || '',
    contact: lead?.contact || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    address: lead?.address || '',
    value: lead?.value ? String(lead.value) : '',
    trade: lead?.trade || defaultTrade || 'Roofing',
    stage: lead?.stage || 'contacted',
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

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modal, maxWidth: 560 }}>
        <button style={S.closeBtn} onClick={onClose}>×</button>
        <div style={S.modalTitle}>{isEdit ? 'Edit Lead' : 'Add New Lead'}</div>
        <div style={{ ...S.modalSub, marginBottom: 4 }}>
          {isEdit ? `Editing: ${lead.name}` : 'Required fields are marked with *'}
        </div>

        <div style={FRow}>
          <div>
            <label style={FLbl}>Customer / Company *</label>
            <input style={fi('name')} value={form.name} placeholder="Apex Roofing LLC"
              onChange={e => set('name', e.target.value)}
              onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
          </div>
          <div>
            <label style={FLbl}>Contact Name</label>
            <input style={fi('contact')} value={form.contact} placeholder="Jane Smith"
              onChange={e => set('contact', e.target.value)}
              onFocus={() => setFocused('contact')} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <div style={FRow}>
          <div>
            <label style={FLbl}>Phone *</label>
            <input style={fi('phone')} value={form.phone} placeholder="(512) 555-0100"
              onChange={e => set('phone', e.target.value)}
              onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
          </div>
          <div>
            <label style={FLbl}>Email</label>
            <input style={fi('email')} type="email" value={form.email} placeholder="jane@company.com"
              onChange={e => set('email', e.target.value)}
              onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <label style={FLbl}>Job Address</label>
        <input style={fi('address')} value={form.address} placeholder="1234 Oak St, Austin TX 78701"
          onChange={e => set('address', e.target.value)}
          onFocus={() => setFocused('address')} onBlur={() => setFocused(null)} />

        <div style={FRow}>
          <div>
            <label style={FLbl}>Estimated Value ($) *</label>
            <input style={fi('value')} value={form.value} placeholder="15000" type="number" min="0"
              onChange={e => set('value', e.target.value)}
              onFocus={() => setFocused('value')} onBlur={() => setFocused(null)} />
          </div>
          <div>
            <label style={FLbl}>Callback Date</label>
            <input style={fi('callbackDate')} type="date" value={form.callbackDate}
              onChange={e => set('callbackDate', e.target.value)}
              onFocus={() => setFocused('callbackDate')} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <div style={FRow}>
          <div>
            <label style={FLbl}>Trade *</label>
            <select style={fi('trade')} value={form.trade}
              onChange={e => set('trade', e.target.value)}
              onFocus={() => setFocused('trade')} onBlur={() => setFocused(null)}>
              {TRADE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={FLbl}>Lead Stage</label>
            <select style={fi('stage')} value={form.stage}
              onChange={e => set('stage', e.target.value)}
              onFocus={() => setFocused('stage')} onBlur={() => setFocused(null)}>
              {LEAD_STAGES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <label style={FLbl}>Lead Source</label>
        <select style={fi('source')} value={form.source}
          onChange={e => set('source', e.target.value)}
          onFocus={() => setFocused('source')} onBlur={() => setFocused(null)}>
          {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label style={FLbl}>Notes</label>
        <textarea
          style={{ ...FI, minHeight: 72, resize: 'vertical', lineHeight: 1.5 }}
          value={form.notes} placeholder="Any relevant details about this lead..."
          onChange={e => set('notes', e.target.value)}
          onFocus={() => setFocused('notes')} onBlur={() => setFocused(null)}
        />

        {Object.keys(errors).length > 0 && (
          <div style={{ fontSize: 12, color: '#ef4444', marginTop: 10 }}>
            Please fill in all required fields marked with *.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            style={{
              flex: 1, padding: '10px 16px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
            onClick={handleSave}
          >
            {isEdit ? 'Save Changes' : 'Add Lead'}
          </button>
          <button
            style={{
              padding: '10px 20px', background: 'transparent',
              border: '1px solid #1e2535', borderRadius: 8,
              color: '#64748b', cursor: 'pointer', fontSize: 14,
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
function CoachPanel({ lead, onClose }) {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tips = PLAYBOOKS[lead.stallReason] || PLAYBOOKS.no_response;

  const getAiAdvice = async () => {
    setLoading(true);
    setError('');
    setAiText('');
    try {
      const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
      if (!apiKey) {
        setError('Set REACT_APP_ANTHROPIC_API_KEY in your .env file to enable AI coaching.');
        setLoading(false);
        return;
      }
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const stream = await client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 600,
        thinking: { type: 'adaptive' },
        system: `You are an elite contractor sales coach specializing in deal recovery.
Give hyper-specific, tactical advice. Be direct and concise. 3-4 short paragraphs max. No bullet points — write in flowing paragraphs.`,
        messages: [{
          role: 'user',
          content: `Give me deal recovery coaching for this stalled contractor lead:

Company/Customer: ${lead.name} (${lead.industry})
Contact: ${lead.contact}, ${lead.role}
Trade: ${lead.trade}
Deal Value: ${fmt(lead.value)}
Stage: ${lead.stage}
Days in pipeline: ${lead.dealAge}
Stall reason: ${STALL_LABELS[lead.stallReason] || 'Unknown'}
Rep notes: ${lead.notes}

Give me 3-4 specific actions I should take THIS WEEK to unblock this deal. Be tactical and specific to their situation — no generic advice.`,
        }],
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          setAiText(prev => prev + event.delta.text);
        }
      }
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) {
        setError('Invalid API key. Check your REACT_APP_ANTHROPIC_API_KEY.');
      } else if (e instanceof Anthropic.RateLimitError) {
        setError('Rate limited. Please wait a moment and try again.');
      } else {
        setError('Error: ' + (e.message || 'Unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <button style={S.closeBtn} onClick={onClose}>×</button>
        <div style={S.modalTitle}>{lead.name}</div>
        <div style={S.modalSub}>
          {lead.contact} · {lead.role} · {fmt(lead.value)} · {lead.stage}
          {lead.stallReason && ` · ${STALL_LABELS[lead.stallReason]}`}
        </div>
        <div style={{ marginBottom: 20 }}>
          <span style={S.tradeBadge(lead.trade)}>{lead.trade}</span>
        </div>

        <div style={S.sectionLabel}>Deal Notes</div>
        <div style={{
          fontSize: 13, color: '#94a3b8', marginBottom: 20,
          padding: '10px 12px', background: '#0f1117', borderRadius: 6,
        }}>
          {lead.notes}
        </div>

        <div style={S.sectionLabel}>Recovery Playbook</div>
        <ul style={S.playbookList}>
          {tips.map((tip, i) => (
            <li key={i} style={S.playbookItem}>
              <span style={S.playbookNum}>{i + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div style={S.sectionLabel}>AI Coach — Deal-Specific Advice</div>
        <button style={S.aiBtn(loading)} onClick={getAiAdvice} disabled={loading}>
          {loading ? '⟳  Generating coaching advice...' : '✦  Get AI Coaching Advice'}
        </button>

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

        <div style={S.apiKeyNote}>Powered by Claude Opus 4.6 · Add REACT_APP_ANTHROPIC_API_KEY to .env</div>
      </div>
    </div>
  );
}

// ─── Lead Card ───────────────────────────────────────────────────────────────
function LeadCard({ lead, onClick, onEdit, onDelete }) {
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
        <div style={S.metaItem}>Stage: <span style={S.metaValue}>{lead.stage}</span></div>
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

      {(onEdit || onDelete) && hovered && (
        <div
          style={{
            display: 'flex', gap: 6, marginTop: 12, paddingTop: 10,
            borderTop: '1px solid #1e2535',
          }}
          onClick={e => e.stopPropagation()}
        >
          {onEdit && (
            <button
              style={{
                flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 500,
                background: 'transparent', border: '1px solid #1e2535',
                borderRadius: 6, color: '#94a3b8', cursor: 'pointer',
              }}
              onClick={() => onEdit(lead)}
            >
              ✏ Edit
            </button>
          )}
          {onDelete && !confirmDelete && (
            <button
              style={{
                flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 500,
                background: 'transparent', border: '1px solid #1e2535',
                borderRadius: 6, color: '#64748b', cursor: 'pointer',
              }}
              onClick={() => setConfirmDelete(true)}
            >
              🗑 Delete
            </button>
          )}
          {onDelete && confirmDelete && (
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
function PipelineTab({ leads, onSelectLead, onAddLead, onEditLead, onDeleteLead }) {
  const [filter, setFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');
  const filters = ['all', 'active', 'stalled', 'cold', 'won', 'lost'];

  const filtered = useMemo(() => {
    let result = filter === 'all' ? leads : leads.filter(l => l.status === filter);
    if (tradeFilter !== 'all') result = result.filter(l => l.trade === tradeFilter);
    return result;
  }, [leads, filter, tradeFilter]);

  const total = filtered.reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <div style={S.filterRow}>
        {filters.map(f => (
          <button key={f} style={S.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f === 'all'
              ? `All (${leads.length})`
              : `${f.charAt(0).toUpperCase() + f.slice(1)} (${leads.filter(l => l.status === f).length})`}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            Total: <span style={{ color: '#f97316', fontWeight: 700, marginLeft: 4 }}>{fmt(total)}</span>
          </div>
          {onAddLead && (
            <button
              style={{
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none', borderRadius: 7,
                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
              onClick={onAddLead}
            >
              + Add Lead
            </button>
          )}
        </div>
      </div>

      <div style={S.tradeFilterRow}>
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

      <div style={S.grid}>
        {filtered.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={onSelectLead}
            onEdit={onEditLead}
            onDelete={onDeleteLead}
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
                  {lead.contact} · {lead.stage}
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
function AnalyticsTab({ leads }) {
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
      <div style={S.statsRow}>
        {[
          { val: fmt(totalPipeline), label: 'Active Pipeline' },
          { val: fmt(stalledValue), label: 'Value at Risk' },
          { val: fmt(wonValue), label: 'Won This Period' },
          { val: `${winRate}%`, label: 'Win Rate' },
          { val: `${avgDealAge}d`, label: 'Avg Deal Age' },
          { val: stalled.length, label: 'Stalled Deals' },
        ].map(({ val, label }) => (
          <div key={label} style={S.statCard}>
            <div style={S.statVal}>{val}</div>
            <div style={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={S.chartSection}>
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Pipeline by Stage</div>
          {stageFunnel.map(({ stage, count, value }, i) => (
            <div key={stage} style={S.barRow}>
              <div style={S.barLabel}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</div>
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
    </div>
  );
}

// ─── Job Modal ────────────────────────────────────────────────────────────────
function JobModal({ job, onClose }) {
  const steps = TRADE_CHECKLISTS[job.trade] || TRADE_CHECKLISTS['Roofing'];
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
function JobsTab({ jobs }) {
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
          const steps = TRADE_CHECKLISTS[job.trade] || TRADE_CHECKLISTS['Roofing'];
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
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
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
    if (email === 'demo@closedloop.com' && password === 'demo123') {
      onLogin({ isDemo: true, companyName: 'ClosedLoop', userName: 'Demo User', trade: 'Roofing', plan: 'pro' });
    } else if (email && password) {
      setError('Incorrect email or password. Try demo@closedloop.com / demo123');
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
        <div style={A.logo}>ClosedLoop</div>
        <div style={A.tagline}>Sign in to your account</div>

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

  const handleComplete = () => {
    onComplete({
      isDemo: false,
      companyName: form.companyName,
      userName: form.userName,
      email: form.email,
      trade: form.trade,
      plan: form.plan,
    });
  };

  return (
    <div style={A.page}>
      <div style={{ ...A.card, maxWidth: step === 2 ? 560 : step === 3 ? 720 : 440 }}>
        <div style={A.logo}>ClosedLoop</div>

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
                  onClick={() => { set('trade', trade); setErrors({}); }}
                >
                  {trade}
                </div>
              ))}
            </div>

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

// ─── App Root ─────────────────────────────────────────────────────────────────
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
  const companyName = session?.companyName || 'ClosedLoop';

  // Only expose mutators for non-demo accounts
  const addLeadHandler = isDemo ? null : () => setLeadModal('add');
  const editLeadHandler = isDemo ? null : (lead) => setLeadModal(lead);
  const deleteLeadHandler = isDemo ? null : handleDeleteLead;

  return (
    <div style={S.app}>
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={S.logo}>{companyName}</span>
          {isDemo && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(249,115,22,0.12)', color: '#f97316',
              border: '1px solid rgba(249,115,22,0.2)', letterSpacing: '0.5px',
            }}>
              DEMO
            </span>
          )}
        </div>
        <div style={S.tabs}>
          {[
            { key: 'pipeline', label: 'Pipeline' },
            { key: 'callbacks', label: 'Callbacks' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'jobs', label: 'Jobs' },
          ].map(({ key, label }) => (
            <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setScreen('login'); setSession(null); }}
          style={{
            marginLeft: 16, background: 'transparent', border: 'none',
            color: '#475569', cursor: 'pointer', fontSize: 12,
            padding: '4px 8px', borderRadius: 6,
          }}
        >
          Sign out
        </button>
      </header>

      <main style={S.body}>
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
            : <JobsTab jobs={jobs} />
        )}
      </main>

      {selectedLead && (
        <CoachPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {leadModal && (
        <AddLeadModal
          lead={leadModal === 'add' ? null : leadModal}
          defaultTrade={userTrade}
          onSave={leadModal === 'add' ? handleAddLead : handleEditLead}
          onClose={() => setLeadModal(null)}
        />
      )}
    </div>
  );
}
