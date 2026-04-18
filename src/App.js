import { useState, useMemo, useEffect, useRef, useCallback, useContext, createContext } from 'react';

// ─── Toast System ─────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
function useToast() { return useContext(ToastCtx) || (() => {}); }
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'error' ? '#450a0a' : '#052e16',
            border: `1px solid ${t.type === 'error' ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)'}`,
            borderRadius: 8, padding: '10px 16px',
            color: '#f1f5f9', fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            maxWidth: 300,
          }}>
            {t.type === 'error' ? '✕ ' : '✓ '}{t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ─── Job Types (Roofing-Only) ────────────────────────────────────────────────
const TRADE_LIST = [
  'Full Replacement', 'Repair', 'Inspection', 'Storm Damage',
  'Gutter Install', 'Skylight', 'Flashing Repair', 'Ventilation',
  'Emergency Tarp',
];

const TRADE_COLORS = {
  'Full Replacement': '#f97316',
  'Repair':           '#3b82f6',
  'Inspection':       '#8b5cf6',
  'Storm Damage':     '#ef4444',
  'Gutter Install':   '#06b6d4',
  'Skylight':         '#f59e0b',
  'Flashing Repair':  '#ec4899',
  'Ventilation':      '#10b981',
  'Emergency Tarp':   '#dc2626',
};

const TRADE_CHECKLISTS = {
  'Full Replacement': [
    { id: 1, label: 'Site inspection & measurements' },
    { id: 2, label: 'Material order & delivery' },
    { id: 3, label: 'Tear off old roof' },
    { id: 4, label: 'Inspect & repair decking' },
    { id: 5, label: 'Install drip edge' },
    { id: 6, label: 'Install ice & water shield' },
    { id: 7, label: 'Install underlayment' },
    { id: 8, label: 'Install shingles' },
    { id: 9, label: 'Install ridge vent & cap' },
    { id: 10, label: 'Flashing & sealing' },
    { id: 11, label: 'Magnetic nail sweep' },
    { id: 12, label: 'Final inspection' },
    { id: 13, label: 'Invoice sent' },
    { id: 14, label: 'Payment received' },
  ],
  'Repair': [
    { id: 1, label: 'Identify damage area' },
    { id: 2, label: 'Material pickup' },
    { id: 3, label: 'Remove damaged shingles' },
    { id: 4, label: 'Inspect decking underneath' },
    { id: 5, label: 'Patch or replace decking' },
    { id: 6, label: 'Install new shingles' },
    { id: 7, label: 'Seal & test' },
    { id: 8, label: 'Final inspection' },
    { id: 9, label: 'Invoice sent' },
    { id: 10, label: 'Payment received' },
  ],
  'Inspection': [
    { id: 1, label: 'Ground-level photos (4 sides)' },
    { id: 2, label: 'Ladder / drone roof access' },
    { id: 3, label: 'Document shingle condition' },
    { id: 4, label: 'Check flashing & penetrations' },
    { id: 5, label: 'Inspect ridge, valleys & eaves' },
    { id: 6, label: 'Check gutters & downspouts' },
    { id: 7, label: 'Attic inspection (if accessible)' },
    { id: 8, label: 'Write inspection report' },
    { id: 9, label: 'Deliver report to customer' },
  ],
  'Storm Damage': [
    { id: 1, label: 'Emergency site assessment' },
    { id: 2, label: 'Document all damage (photos & notes)' },
    { id: 3, label: 'Tarp exposed areas if needed' },
    { id: 4, label: 'File insurance claim with homeowner' },
    { id: 5, label: 'Meet adjuster on site' },
    { id: 6, label: 'Scope agreement & supplement' },
    { id: 7, label: 'Material order & delivery' },
    { id: 8, label: 'Tear off damaged sections' },
    { id: 9, label: 'Install new roofing system' },
    { id: 10, label: 'Final inspection' },
    { id: 11, label: 'Invoice & insurance payment' },
  ],
  'Gutter Install': [
    { id: 1, label: 'Measure & quote' },
    { id: 2, label: 'Material order' },
    { id: 3, label: 'Remove old gutters' },
    { id: 4, label: 'Install fascia board (if needed)' },
    { id: 5, label: 'Install new gutters' },
    { id: 6, label: 'Install downspouts & extensions' },
    { id: 7, label: 'Install gutter guards (if ordered)' },
    { id: 8, label: 'Test water flow' },
    { id: 9, label: 'Final inspection' },
    { id: 10, label: 'Invoice sent' },
    { id: 11, label: 'Payment received' },
  ],
  'Skylight': [
    { id: 1, label: 'Measure opening & select unit' },
    { id: 2, label: 'Order skylight & flashing kit' },
    { id: 3, label: 'Cut roof opening' },
    { id: 4, label: 'Frame curb' },
    { id: 5, label: 'Install skylight unit' },
    { id: 6, label: 'Install step & counter flashing' },
    { id: 7, label: 'Seal & waterproof' },
    { id: 8, label: 'Interior trim (if applicable)' },
    { id: 9, label: 'Final inspection' },
    { id: 10, label: 'Invoice sent' },
    { id: 11, label: 'Payment received' },
  ],
  'Flashing Repair': [
    { id: 1, label: 'Identify leak source' },
    { id: 2, label: 'Remove old flashing & sealant' },
    { id: 3, label: 'Inspect substrate condition' },
    { id: 4, label: 'Install new flashing' },
    { id: 5, label: 'Apply sealant & counterflashing' },
    { id: 6, label: 'Water test' },
    { id: 7, label: 'Final inspection' },
    { id: 8, label: 'Invoice sent' },
    { id: 9, label: 'Payment received' },
  ],
  'Ventilation': [
    { id: 1, label: 'Attic airflow assessment' },
    { id: 2, label: 'Calculate intake/exhaust requirements' },
    { id: 3, label: 'Order vents & materials' },
    { id: 4, label: 'Cut openings' },
    { id: 5, label: 'Install ridge vent / box vents' },
    { id: 6, label: 'Install soffit vents' },
    { id: 7, label: 'Seal & flash around new vents' },
    { id: 8, label: 'Verify balanced airflow' },
    { id: 9, label: 'Final inspection' },
    { id: 10, label: 'Invoice sent' },
    { id: 11, label: 'Payment received' },
  ],
  'Emergency Tarp': [
    { id: 1, label: 'Emergency dispatch' },
    { id: 2, label: 'Assess damage on arrival' },
    { id: 3, label: 'Secure tarp over exposed area' },
    { id: 4, label: 'Anchor with boards & fasteners' },
    { id: 5, label: 'Document damage for insurance' },
    { id: 6, label: 'Schedule follow-up repair' },
    { id: 7, label: 'Invoice sent' },
    { id: 8, label: 'Payment received' },
  ],
};

// ─── Demo Data ───────────────────────────────────────────────────────────────
const DEMO_LEADS = [
  {
    id: 1, name: 'Shumaker Residence', contact: 'Dave Shumaker', role: 'Homeowner',
    trade: 'Full Replacement', status: 'stalled', value: 14800, stage: 'estimate_sent',
    callbackDate: '2026-03-25', lastContact: '2026-03-10',
    stallReason: 'price_objection', notes: '28 sq, 7/12 pitch. GAF Timberline HDZ Charcoal. 1 layer tear-off over plywood deck. Wants 15% off — comparing 2 other bids from Lewisburg area roofers.',
    industry: 'Residential', dealAge: 22, address: '142 Chestnut St, Mifflinburg PA 17844',
  },
  {
    id: 2, name: 'Susquehanna Valley Mall', contact: 'Denise Rhoads', role: 'Property Manager',
    trade: 'Full Replacement', status: 'stalled', value: 23500, stage: 'contract_signed',
    callbackDate: '2026-03-24', lastContact: '2026-03-08',
    stallReason: 'budget_freeze', notes: 'TPO membrane, 140 sq flat roof on anchor store wing. Q1 budget locked — revisit April per ownership group. 2 HVAC curbs need reflashing.',
    industry: 'Commercial', dealAge: 38, address: '1 Susquehanna Valley Mall Dr, Selinsgrove PA 17870',
  },
  {
    id: 3, name: 'Bowman Family', contact: 'Tina Bowman', role: 'Homeowner',
    trade: 'Storm Damage', status: 'active', value: 18700, stage: 'inspection_scheduled',
    callbackDate: '2026-03-23', lastContact: '2026-03-20',
    stallReason: null, notes: 'Wind damage from 3/15 storm. Insurance claim filed with Erie Insurance. Adjuster visit pending. Architectural shingles, 24 sq, 6/12 pitch.',
    industry: 'Residential', dealAge: 9, address: '227 Market St, Lewisburg PA 17837',
  },
  {
    id: 4, name: 'Northumberland Apartments', contact: 'Rick Hess', role: 'Building Manager',
    trade: 'Repair', status: 'stalled', value: 4200, stage: 'estimate_sent',
    callbackDate: '2026-03-19', lastContact: '2026-03-05',
    stallReason: 'no_response', notes: '3 follow-ups, no reply. Active leak in Bldg C — valley flashing failed. 3-tab, 6/12 pitch. Decking shows some staining.',
    industry: 'Commercial', dealAge: 41, address: '350 Front St, Northumberland PA 17857',
  },
  {
    id: 5, name: 'Monroe Township Offices', contact: 'Jeff Weaver', role: 'Facilities Director',
    trade: 'Full Replacement', status: 'active', value: 31200, stage: 'contract_signed',
    callbackDate: '2026-03-26', lastContact: '2026-03-21',
    stallReason: null, notes: '42 sq, low-slope modified bitumen on municipal bldg. 2 layers to tear off. Decking likely needs 10-15 sheets. Snyder County permit in hand.',
    industry: 'Commercial', dealAge: 27, address: '88 W Main St, Selinsgrove PA 17870',
  },
  {
    id: 6, name: 'Keller Residence', contact: 'Amy Keller', role: 'Homeowner',
    trade: 'Full Replacement', status: 'stalled', value: 22600, stage: 'estimate_sent',
    callbackDate: '2026-03-22', lastContact: '2026-03-12',
    stallReason: 'competitor', notes: '32 sq, 8/12 steep pitch. CertainTeed Landmark Pro Moire Black. 1 layer over OSB deck. Competitor bid $2k less — need to show SureStart warranty value.',
    industry: 'Residential', dealAge: 35, address: '415 Chestnut St, Milton PA 17847',
  },
  {
    id: 7, name: 'Riverwoods HOA', contact: 'Susan Yoder', role: 'HOA President',
    trade: 'Full Replacement', status: 'active', value: 94000, stage: 'inspection_scheduled',
    callbackDate: '2026-03-27', lastContact: '2026-03-18',
    stallReason: null, notes: '12-building townhome complex, ~280 sq total. Phased replacement. Board vote 3/28. Architectural shingles, color TBD by HOA. Ice & water shield required at eaves.',
    industry: 'HOA', dealAge: 18, address: '200 Riverwoods Dr, Lewisburg PA 17837',
  },
  {
    id: 8, name: 'Market Street Commons', contact: 'Tom Brubaker', role: 'Property Manager',
    trade: 'Gutter Install', status: 'stalled', value: 5800, stage: 'estimate_sent',
    callbackDate: '2026-03-15', lastContact: '2026-03-03',
    stallReason: 'technical_fit', notes: '220 LF seamless aluminum 5". K-style vs half-round debate on 1890s building facade. Include leaf guards. Historic district review may apply.',
    industry: 'Commercial', dealAge: 49, address: '118 Market St, Sunbury PA 17801',
  },
  {
    id: 9, name: 'Valley Fitness', contact: 'Marcus Stover', role: 'Owner',
    trade: 'Repair', status: 'cold', value: 3400, stage: 'lead',
    callbackDate: '2026-04-05', lastContact: '2026-02-20',
    stallReason: 'timing', notes: 'Ponding water on flat section. TPO seam separation near HVAC curb. Wants to wait until summer. Follow up Q2.',
    industry: 'Commercial', dealAge: 64, address: '1420 N Susquehanna Trail, Selinsgrove PA 17870',
  },
  {
    id: 10, name: 'Christ Lutheran Mifflinburg', contact: 'Pastor Ed Zimmerman', role: 'Facilities Coord',
    trade: 'Storm Damage', status: 'won', value: 9400, stage: 'paid',
    callbackDate: null, lastContact: '2026-03-17',
    stallReason: null, notes: 'Closed! Wind damage to ridge cap + 3 sq of shingles on sanctuary. Nationwide Insurance covered. CertainTeed Landmark, Weathered Wood.',
    industry: 'Institutional', dealAge: 55, address: '130 S 5th St, Mifflinburg PA 17844',
  },
  {
    id: 11, name: 'Hartman Residence', contact: 'Joe Hartman', role: 'Homeowner',
    trade: 'Skylight', status: 'stalled', value: 4800, stage: 'contract_signed',
    callbackDate: '2026-03-23', lastContact: '2026-03-13',
    stallReason: 'wrong_contact', notes: '2 Velux skylights, curb-mount, bathroom + kitchen. Need to confirm size with wife who picked them out.',
    industry: 'Residential', dealAge: 46, address: '78 Pine Creek Rd, Watsontown PA 17777',
  },
  {
    id: 12, name: 'Buffalo Valley Townhomes', contact: 'Karen Bender', role: 'HOA Director',
    trade: 'Full Replacement', status: 'active', value: 34800, stage: 'estimate_sent',
    callbackDate: '2026-03-24', lastContact: '2026-03-22',
    stallReason: null, notes: '6 townhome units, 180 sq total. GAF Timberline architectural, Hickory. Ice & water at all valleys. Proposal well received by board.',
    industry: 'HOA', dealAge: 14, address: '450 Buffalo Rd, Lewisburg PA 17837',
  },
  {
    id: 13, name: 'Klinger Trucking', contact: 'Jim Klinger', role: 'Owner',
    trade: 'Full Replacement', status: 'lost', value: 19600, stage: 'lost',
    callbackDate: null, lastContact: '2026-03-09',
    stallReason: 'competitor', notes: 'Lost on price. 26 sq standing seam metal on shop. Competitor bid $3k less — no manufacturer warranty.',
    industry: 'Commercial', dealAge: 61, address: '1100 Industrial Park Rd, Milton PA 17847',
  },
  {
    id: 14, name: 'Deimler Residence', contact: 'Scott Deimler', role: 'Homeowner',
    trade: 'Full Replacement', status: 'stalled', value: 42000, stage: 'materials_ordered',
    callbackDate: '2026-03-23', lastContact: '2026-03-15',
    stallReason: 'budget_freeze', notes: '48 sq, standing seam metal Burnished Slate. 10/12 pitch, harness required. Materials on order at Boise Cascade Sunbury but homeowner paused — waiting on HELOC.',
    industry: 'Residential', dealAge: 74, address: '22 Mountain Rd, New Berlin PA 17855',
  },
  {
    id: 15, name: 'Blasius Chevrolet', contact: 'Steve Blasius', role: 'Shop Owner',
    trade: 'Flashing Repair', status: 'active', value: 2800, stage: 'inspection_complete',
    callbackDate: '2026-03-28', lastContact: '2026-03-23',
    stallReason: null, notes: 'Chimney flashing failed on service bay. Active leak into office below. Counter-flashing pulling away from limestone mortar.',
    industry: 'Commercial', dealAge: 8, address: '400 S Market St, Selinsgrove PA 17870',
  },
  {
    id: 16, name: 'Packwood House Museum', contact: 'Patricia Landis', role: 'Facilities Manager',
    trade: 'Repair', status: 'active', value: 6400, stage: 'estimate_sent',
    callbackDate: '2026-03-26', lastContact: '2026-03-19',
    stallReason: null, notes: 'Slate roof — 8 cracked tiles + ridge mortar repointing. Historic property, must match existing PA slate. 12/12 pitch.',
    industry: 'Commercial', dealAge: 20, address: '15 N Water St, Lewisburg PA 17837',
  },
  {
    id: 17, name: 'Susquehanna Industrial Park', contact: 'Nick Etter', role: 'Operations Mgr',
    trade: 'Full Replacement', status: 'stalled', value: 38000, stage: 'estimate_sent',
    callbackDate: '2026-03-20', lastContact: '2026-03-04',
    stallReason: 'budget_freeze', notes: '52 sq TPO, flat warehouse roof. 2 layers existing. Full board approval pending. Northumberland County permit needed.',
    industry: 'Commercial', dealAge: 53, address: '825 Point Township Dr, Northumberland PA 17857',
  },
  {
    id: 18, name: 'Flickinger Residence', contact: 'Carol Flickinger', role: 'Homeowner',
    trade: 'Emergency Tarp', status: 'active', value: 1200, stage: 'inspection_scheduled',
    callbackDate: '2026-03-25', lastContact: '2026-03-20',
    stallReason: null, notes: 'Oak tree fell on roof during wind storm. Active water intrusion into upstairs bedroom. Tarp ASAP, then scope full replacement.',
    industry: 'Residential', dealAge: 12, address: '56 Maple Ave, Middleburg PA 17842',
  },
  {
    id: 19, name: 'Danville Heritage Villas', contact: 'Dave Moyer', role: 'Board President',
    trade: 'Inspection', status: 'cold', value: 1800, stage: 'lead',
    callbackDate: '2026-04-10', lastContact: '2026-02-28',
    stallReason: 'timing', notes: '15-building annual roof inspection. Waiting on spring maintenance budget approval. Could lead to multi-phase replacement — most roofs are 18+ years.',
    industry: 'HOA', dealAge: 71, address: '300 Montour Blvd, Danville PA 17821',
  },
  {
    id: 20, name: 'Sheetz #412', contact: 'Brian Lehr', role: 'Facilities Coord',
    trade: 'Repair', status: 'won', value: 4200, stage: 'invoiced',
    callbackDate: null, lastContact: '2026-03-18',
    stallReason: null, notes: 'Closed! Patched 4 sq of wind-damaged 3-tab on flat canopy section. Resealed all pipe boots and HVAC curbs.',
    industry: 'Commercial', dealAge: 29, address: '1250 N Susquehanna Trail, Selinsgrove PA 17870',
  },
  {
    id: 21, name: 'Evangelical Community Hospital', contact: 'Greg Stauffer', role: 'Facilities Manager',
    trade: 'Full Replacement', status: 'stalled', value: 67000, stage: 'contract_signed',
    callbackDate: '2026-03-22', lastContact: '2026-03-11',
    stallReason: 'price_objection', notes: 'Outpatient wing, 320 sq TPO. Hospital procurement wants to value-engineer. Union County permit in hand.',
    industry: 'Institutional', dealAge: 45, address: '1 Hospital Dr, Lewisburg PA 17837',
  },
  {
    id: 22, name: 'Rohrer Residence', contact: 'Mike Rohrer', role: 'Homeowner',
    trade: 'Ventilation', status: 'active', value: 3200, stage: 'inspection_complete',
    callbackDate: '2026-03-27', lastContact: '2026-03-21',
    stallReason: null, notes: 'Attic hitting 145°F in summer. No ridge vent, only 2 box vents on 1960s ranch. OSB decking — need full intake/exhaust rebalance + check for moisture damage.',
    industry: 'Residential', dealAge: 17, address: '340 Fairground Rd, Bloomsburg PA 17815',
  },
  {
    id: 23, name: 'Susquehanna Valley Mall — JCPenney Wing', contact: 'Janet Groff', role: 'Facilities Mgr',
    trade: 'Flashing Repair', status: 'stalled', value: 8500, stage: 'estimate_sent',
    callbackDate: '2026-03-21', lastContact: '2026-03-07',
    stallReason: 'no_response', notes: 'Parapet wall flashing failing on 3 sections. Submitted proposal 2 weeks ago. Zero feedback from corporate ownership.',
    industry: 'Commercial', dealAge: 58, address: '1 Susquehanna Valley Mall Dr, Selinsgrove PA 17870',
  },
  {
    id: 24, name: 'RiverWoods Senior Living', contact: 'Andrew Musser', role: 'Maintenance Dir',
    trade: 'Gutter Install', status: 'active', value: 13200, stage: 'estimate_sent',
    callbackDate: '2026-03-26', lastContact: '2026-03-20',
    stallReason: null, notes: '480 LF 6" commercial gutters + 12 downspouts on main building. Include splash guards at all walkways. On track.',
    industry: 'Institutional', dealAge: 22, address: '150 RiverWoods Dr, Lewisburg PA 17837',
  },
  {
    id: 25, name: 'Brenner Residence', contact: 'Sandra Brenner', role: 'Homeowner',
    trade: 'Skylight', status: 'stalled', value: 6100, stage: 'scheduled_for_install',
    callbackDate: '2026-03-23', lastContact: '2026-03-14',
    stallReason: 'technical_fit', notes: '3 Velux deck-mount skylights in cathedral ceiling. Flashing kit on backorder at Boise Cascade — ETA pushed 2 weeks. Homeowner frustrated.',
    industry: 'Residential', dealAge: 40, address: '19 Covered Bridge Rd, Hughesville PA 17737',
  },
  {
    id: 26, name: 'Shamokin Creek Condos', contact: 'Bob Reider', role: 'Board Treasurer',
    trade: 'Storm Damage', status: 'stalled', value: 47500, stage: 'estimate_sent',
    callbackDate: '2026-03-24', lastContact: '2026-03-10',
    stallReason: 'wrong_contact', notes: '6 buildings, wind + ice dam damage. Nationwide Insurance adjusting. Need to engage full board, not just treasurer. Mix of 3-tab and architectural.',
    industry: 'HOA', dealAge: 62, address: '500 Shamokin Creek Dr, Shamokin PA 17872',
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

const STAGE_ORDER = [
  'lead', 'inspection_scheduled', 'inspection_complete', 'estimate_sent',
  'contract_signed', 'materials_ordered', 'scheduled_for_install',
  'in_progress', 'punch_list', 'completed', 'invoiced', 'paid',
];

const STAGE_LABELS = {
  lead:                  'Lead',
  inspection_scheduled:  'Inspection Scheduled',
  inspection_complete:   'Inspection Complete',
  estimate_sent:         'Estimate Sent',
  contract_signed:       'Contract Signed',
  materials_ordered:     'Materials Ordered',
  scheduled_for_install: 'Scheduled for Install',
  in_progress:           'In Progress',
  punch_list:            'Punch List',
  completed:             'Completed',
  invoiced:              'Invoiced',
  paid:                  'Paid',
  lost:                  'Lost',
};

const STAGE_COLORS = {
  lead:                  '#64748b',
  inspection_scheduled:  '#3b82f6',
  inspection_complete:   '#60a5fa',
  estimate_sent:         '#f59e0b',
  contract_signed:       '#10b981',
  materials_ordered:     '#8b5cf6',
  scheduled_for_install: '#06b6d4',
  in_progress:           '#f97316',
  punch_list:            '#ec4899',
  completed:             '#22c55e',
  invoiced:              '#a855f7',
  paid:                  '#14b8a6',
  lost:                  '#ef4444',
};

const ISSUE_PRESETS = [
  'Wrong Contact', 'Bad Timing', 'No Response', 'Budget Freeze',
  'Price Objection', 'Competitor', 'Weather Delay', 'Material Shortage',
  'Permit Issue', 'HOA Approval Needed',
];

// Operational next-step tips shown inside the job detail modal, keyed by pipeline stage
const STAGE_TIPS = {
  lead: [
    'Call or visit the property to confirm scope and identify any visible damage — many older homes in the valley have multiple layers',
    'Check Google Maps satellite view before the site visit — estimate roof pitch, identify dormers, and spot access issues on rural properties',
    'Ask about insurance claim status before quoting — Erie, State Farm, and Nationwide all handle storm claims differently in PA',
    'Log contact details, job address, and initial scope notes — note if the property is in a township that requires permits (varies by county)',
  ],
  inspection_scheduled: [
    'Confirm the inspection date and time the day before — cell service can be spotty in rural parts of Union and Snyder counties',
    'Prep your inspection kit: drone, ladder, measuring wheel, moisture meter, and camera — PA attics often show ice dam damage from winter',
    'Check the 10-day forecast — central PA spring weather is unpredictable, reschedule early if rain or 20+ mph winds are expected',
    'Review the property on Google Maps satellite view — many valley homes have steep pitches (8/12+) and older slate or metal roofs',
  ],
  inspection_complete: [
    'Upload all photos within 24 hours — four sides, close-ups of damage, ridge, valleys, and all penetrations. Use Drone Shots category for aerials.',
    'Measure total square footage and note roof pitch — steep PA homes (8/12 to 12/12) significantly affect labor and safety costs',
    'Document flashing condition at chimney, skylights, and valleys — limestone chimneys common in the valley are the #1 callback source',
    'Walk the attic if accessible — check for ice dam staining, moisture damage, and inadequate ventilation common in older PA homes',
  ],
  estimate_sent: [
    'Include a line item for each material: shingles, underlayment, ice & water shield (required at eaves in PA), drip edge, flashing, ridge cap',
    'Add a conditional deck repair line — many valley homes have original 1x6 board decking that needs overlay or replacement during tear-off',
    'Send the estimate within 24 hours of inspection — close rate drops significantly after 48 hours, especially during spring roofing season',
    'Follow up by phone 48 hours after sending — in Mennonite communities, a face-to-face visit often works better than phone or email',
  ],
  contract_signed: [
    'Collect the deposit and confirm payment method before scheduling — some rural customers prefer check or cash; confirm before crew day',
    'Check permit requirements — varies by township in Union, Snyder, and Northumberland counties. Some townships don\'t require permits for re-roofs',
    'Confirm material selections: shingle color, brand, and warranty tier. Order from Boise Cascade Sunbury or ABC Supply for fastest delivery.',
    'Send a written confirmation with the start date, scope, and payment schedule — weather delays are common April through November in central PA',
  ],
  materials_ordered: [
    'Order from Boise Cascade Sunbury or ABC Supply — lock pricing now, material costs shift seasonally and specific colors can be backordered',
    'Schedule delivery for the day before or morning of install — confirm the driveway can handle a delivery truck on rural properties',
    'Verify the order includes ice & water shield for eaves, valleys, and around penetrations — PA code requires it in most jurisdictions',
    'Confirm dumpster delivery — check if the township requires a road permit for dumpster placement on rural roads',
  ],
  scheduled_for_install: [
    'Assign the crew lead and confirm start date — spring is peak season in the valley, so lock crew availability early',
    'Send the homeowner a reminder with start date, crew arrival time (usually 7 AM), and what to expect — noise, debris, driveway access',
    'Verify the permit is in hand if required — do not start without it. Check township requirements for Union, Snyder, or Northumberland counties.',
    'Check the 5-day forecast one more time — PA spring storms can push a job mid-week. Have a backup date ready.',
  ],
  in_progress: [
    'Check in with the crew lead at noon — confirm daily progress, flag material shortages, and check weather for afternoon thunderstorms',
    'Take photos at each phase using the photo categories: Before, During Tear-off, Decking, Underlayment, and Final — they protect you on warranty claims',
    'Get written customer approval before adding any scope found during tear-off — rotted board decking and ice dam damage are common surprises in valley homes',
    'Run a magnetic nail sweep at end of each day — especially critical on rural properties where customers mow their own fields nearby',
  ],
  punch_list: [
    'Walk the roof and property with the crew lead — check ridge cap alignment, all flashing seals, and drip edge continuity',
    'Inspect all flashing points carefully — limestone chimneys and older skylights are the most common callback issues in central PA',
    'Verify gutter reattachment, downspout alignment, and soffit/fascia condition — PA freeze-thaw cycles punish any loose connections',
    'Run a full magnetic nail sweep — driveway, lawn, sidewalk, and gravel areas. One nail in a tire costs more in goodwill than the sweep costs in time.',
  ],
  completed: [
    'Walk the completed job with the customer before requesting final payment — let them see the quality up close from the ground',
    'Take final photos from all four sides for your portfolio — drone shots of valley homes with mountain backdrops make great marketing content',
    'File the permit close-out if required by the township — some PA jurisdictions issue lien notices if not closed within 30 days',
    'Ask for a Google review and one referral — word of mouth is everything in the Susquehanna Valley. This is your highest-converting window.',
  ],
  invoiced: [
    'Send the final invoice within 24 hours of the walkthrough — delays signal disorganization and give time for second thoughts',
    'Include before/after photos and a warranty summary — visual proof of the transformation reinforces value, especially for insurance-paid work',
    'Set a 5-business-day follow-up reminder — if payment hasn\'t arrived, call directly. Don\'t rely on email for rural PA customers.',
    'For insurance jobs, confirm the supplement has been filed and the adjuster (Erie, State Farm, Nationwide) has the final documentation',
  ],
  paid: [
    'Record the payment and close the job immediately — open jobs distort your pipeline and make your board look cluttered',
    'Mail or email the warranty certificate and manufacturer registration — this trust-building step costs nothing and protects you on future claims',
    'Schedule a 6-month follow-up call to check on the roof and ask for referrals — valley communities are tight-knit, one good job leads to the next',
    'Archive the job folder with all photos, permits, signed contracts, and payment records — clean documentation protects you for years',
  ],
};
const TODAY = new Date().toISOString().slice(0, 10);

// ─── Jobs Data ────────────────────────────────────────────────────────────────
const DEMO_JOBS = [
  // ── Completed (March) ──
  {
    id: 103, customer: 'Tina & Mark Bowman', address: '227 Market St, Lewisburg PA 17837',
    trade: 'Storm Damage', value: 18700, status: 'Complete',
    scheduledDate: '2026-03-14', completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    notes: 'Erie Insurance claim — wind damage. 24 sq architectural. Adjuster approved full replacement. Closed out.',
  },
  {
    id: 108, customer: 'Joe & Barb Hartman', address: '78 Pine Creek Rd, Watsontown PA 17777',
    trade: 'Skylight', value: 4800, status: 'Complete',
    scheduledDate: '2026-03-11', completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    notes: '2 Velux curb-mount skylights installed. Flashing sealed, interior trim complete.',
  },
  // ── Active April schedule ──
  {
    id: 201, customer: 'Christ Lutheran Church', address: '130 S 5th St, Mifflinburg PA 17844',
    trade: 'Storm Damage', value: 9400, status: 'In Progress', hours: 9,
    scheduledDate: '2026-04-14', completedSteps: [1, 2, 3, 4, 5, 6],
    notes: 'Wind damage — ridge cap + 3 sq on sanctuary. CertainTeed Landmark, Weathered Wood. Nationwide claim.',
  },
  {
    id: 202, customer: 'Amos Stoltzfus', address: '1240 Strickler Rd, Mifflinburg PA 17844',
    trade: 'Full Replacement', value: 16200, status: 'Scheduled', hours: 8,
    scheduledDate: '2026-04-17', completedSteps: [1, 2],
    notes: '30 sq, 6/12 pitch. GAF Timberline HDZ Charcoal. 1 layer tear-off. Farmhouse — no Sunday work.',
  },
  {
    id: 203, customer: 'Betty Shumaker', address: '142 Chestnut St, Mifflinburg PA 17844',
    trade: 'Repair', value: 3800, status: 'Scheduled', hours: 6,
    scheduledDate: '2026-04-17', completedSteps: [1],
    notes: 'Chimney flashing repair + 4 missing shingles on north slope. 7/12 pitch. Follow-up from full replacement.',
  },
  {
    id: 204, customer: 'Dan Sensenig', address: '85 Penns Creek Rd, Selinsgrove PA 17870',
    trade: 'Flashing Repair', value: 2200, status: 'Scheduled', hours: 4,
    scheduledDate: '2026-04-18', completedSteps: [],
    notes: 'Skylight flashing leak in master bedroom. Counter-flashing pulling away. Quick fix.',
  },
  {
    id: 205, customer: 'Hotel Hershey Annex', address: '100 Hotel Rd, Hershey PA 17033',
    trade: 'Repair', value: 12400, status: 'Scheduled', hours: 10,
    scheduledDate: '2026-04-21', completedSteps: [1, 2],
    notes: 'Slate roof — 12 cracked tiles + ridge mortar repointing. Must match Peach Bottom slate. Historic property.',
    duration: 2,
  },
  {
    id: 206, customer: 'Earl Yoder', address: '320 Buffalo Rd, Lewisburg PA 17837',
    trade: 'Ventilation', value: 1800, status: 'Scheduled', hours: 3,
    scheduledDate: '2026-04-22', completedSteps: [],
    notes: 'Ridge vent install (28 LF) + 4 soffit vents. Attic running hot. Quick half-day job.',
  },
  {
    id: 207, customer: 'Market Street Commons', address: '118 Market St, Sunbury PA 17801',
    trade: 'Gutter Install', value: 5800, status: 'Scheduled', hours: 8,
    scheduledDate: '2026-04-23', completedSteps: [1, 2],
    notes: '220 LF seamless aluminum 5" K-style + leaf guards. Fascia board needs replacing on south side.',
  },
  {
    id: 208, customer: 'Ray Brubaker', address: '410 N Front St, Milton PA 17847',
    trade: 'Full Replacement', value: 22600, status: 'Scheduled', hours: 7,
    scheduledDate: '2026-04-28', completedSteps: [1, 2],
    notes: '32 sq, 8/12 steep pitch. CertainTeed Landmark Pro Moire Black. 1 layer over OSB. Harness required.',
    duration: 3,
  },
  // ── Unscheduled pipeline jobs ──
  {
    id: 209, customer: 'Monroe Township Offices', address: '88 W Main St, Selinsgrove PA 17870',
    trade: 'Full Replacement', value: 31200, status: 'Scheduled',
    completedSteps: [1, 2],
    notes: '42 sq modified bitumen, low-slope municipal bldg. Awaiting Snyder County permit.',
  },
  {
    id: 210, customer: 'Riverwoods HOA — Phase 2', address: '200 Riverwoods Dr, Lewisburg PA 17837',
    trade: 'Full Replacement', value: 94000, status: 'Scheduled',
    completedSteps: [1],
    notes: 'Phase 2: buildings 5-8. ~96 sq. Waiting on HOA board to approve start date.',
  },
];

const DEMO_CREW = [
  { id: 'dc1', name: 'Jake Stoltzfus', role: 'Foreman', phone: '(570) 555-2341', specialties: ['Full Replacement', 'Storm Damage'] },
  { id: 'dc2', name: 'Tom Bricker', role: 'Install Crew', phone: '(570) 555-3456', specialties: ['Full Replacement', 'Gutter Install', 'Skylight'] },
  { id: 'dc3', name: 'Luis Ortiz', role: 'Tear-off Crew', phone: '(570) 555-4567', specialties: ['Full Replacement', 'Repair'] },
  { id: 'dc4', name: 'Ryan Hess', role: 'Ground Support', phone: '(570) 555-5678', specialties: ['Full Replacement', 'Emergency Tarp'] },
  { id: 'dc5', name: 'Mark Sensenig', role: 'Estimator', phone: '(570) 555-6789', specialties: ['Full Replacement', 'Storm Damage', 'Inspection'] },
  { id: 'dc6', name: 'Tara Zimmerman', role: 'Sales Rep', phone: '(570) 555-7890', specialties: ['Full Replacement', 'Storm Damage', 'Gutter Install'] },
];

const DEMO_MESSAGES = [
  { id: 'dm-1', jobId: '201', senderId: 'system', senderName: 'System', text: 'Jake Stoltzfus assigned to this job', timestamp: 1744600000000, type: 'system' },
  { id: 'dm-2', jobId: '201', senderId: 'dc1', senderName: 'Jake Stoltzfus', text: 'On site at Christ Lutheran. Ridge cap removed, starting tear-off on damaged section.', timestamp: 1744610000000, type: 'user' },
  { id: 'dm-3', jobId: '201', senderId: 'dc2', senderName: 'Tom Bricker', text: 'Shingles matched — CertainTeed Landmark Weathered Wood. Picked up from Boise Cascade.', timestamp: 1744620000000, type: 'user' },
  { id: 'dm-4', jobId: '202', senderId: 'system', senderName: 'System', text: 'Jake Stoltzfus assigned to Stoltzfus job', timestamp: 1744700000000, type: 'system' },
  { id: 'dm-5', jobId: '202', senderId: 'dc1', senderName: 'Jake Stoltzfus', text: 'Farmhouse — confirmed no Sunday work. Materials staged in barn. Starting 7 AM Thursday.', timestamp: 1744710000000, type: 'user' },
  { id: 'dm-6', jobId: '205', senderId: 'system', senderName: 'System', text: 'Job scheduled for 2026-04-21', timestamp: 1744800000000, type: 'system' },
  { id: 'dm-7', jobId: '205', senderId: 'dc2', senderName: 'Tom Bricker', text: 'Hotel Hershey — need to match Peach Bottom slate exactly. Supplier confirmed availability.', timestamp: 1744810000000, type: 'user' },
  { id: 'dm-8', jobId: '207', senderId: 'system', senderName: 'System', text: 'Jake Stoltzfus assigned to Market St Commons', timestamp: 1744900000000, type: 'system' },
  { id: 'dm-9', jobId: '207', senderId: 'dc1', senderName: 'Jake Stoltzfus', text: 'Fascia on south side is rotted worse than expected. Adding 20 LF fascia board to materials.', timestamp: 1744910000000, type: 'user' },
];

const DEMO_JOB_DURATIONS = {
  103: 2, 108: 1,
  201: 1, 202: 2, 203: 1, 204: 1, 205: 2, 206: 1, 207: 1, 208: 3,
  209: 1, 210: 5,
};

// Demo crew assignments (jobId → [crewId, ...])
const DEMO_ASSIGNMENTS = {
  '103': ['dc1', 'dc2'],                  // Bowman Storm Damage (completed)
  '108': ['dc2'],                          // Hartman Skylight (completed)
  '201': ['dc1', 'dc2'],                  // Christ Lutheran Church
  '202': ['dc1'],                          // Amos Stoltzfus
  '203': ['dc4'],                          // Betty Shumaker
  '204': ['dc2'],                          // Dan Sensenig
  '205': ['dc1', 'dc2', 'dc3'],          // Hotel Hershey
  '206': ['dc4'],                          // Earl Yoder
  '207': ['dc1'],                          // Market Street Commons
  '208': ['dc2'],                          // Ray Brubaker
};

// Demo time-tracking data for Day Detail view (keyed by date → jobId → crewId)
const DEMO_DAY_DETAIL = {
  '2026-04-14': {
    201: [
      { crewId: 'dc1', clockIn: '6:50 AM', status: 'Clocked Out', hoursLogged: 9.0, payRate: 38 },
      { crewId: 'dc2', clockIn: '6:55 AM', status: 'Clocked Out', hoursLogged: 9.0, payRate: 32 },
    ],
  },
  '2026-04-17': {
    202: [
      { crewId: 'dc1', clockIn: '6:45 AM', status: 'On Site', hoursLogged: 8.0, payRate: 38 },
    ],
    203: [
      { crewId: 'dc4', clockIn: '7:00 AM', status: 'On Site', hoursLogged: 6.0, payRate: 22 },
    ],
  },
  '2026-04-18': {
    204: [
      { crewId: 'dc2', clockIn: '7:30 AM', status: 'On Site', hoursLogged: 4.0, payRate: 32 },
    ],
  },
  '2026-04-21': {
    205: [
      { crewId: 'dc1', clockIn: '6:30 AM', status: 'On Site', hoursLogged: 10.0, payRate: 38 },
      { crewId: 'dc2', clockIn: '6:35 AM', status: 'On Site', hoursLogged: 10.0, payRate: 32 },
      { crewId: 'dc3', clockIn: '6:45 AM', status: 'On Site', hoursLogged: 9.5, payRate: 26 },
    ],
  },
  '2026-04-22': {
    206: [
      { crewId: 'dc4', clockIn: '8:00 AM', status: 'On Site', hoursLogged: 3.0, payRate: 22 },
    ],
  },
  '2026-04-23': {
    207: [
      { crewId: 'dc1', clockIn: '7:00 AM', status: 'On Site', hoursLogged: 8.0, payRate: 38 },
    ],
  },
  '2026-04-28': {
    208: [
      { crewId: 'dc2', clockIn: '7:00 AM', status: 'On Site', hoursLogged: 7.0, payRate: 32 },
    ],
  },
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: '100vh',
    background: '#0f1117',
    color: '#e2e8f0',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: 14,
    overflowX: 'hidden',
  },
  header: {
    background: '#161b27',
    borderBottom: '1px solid #253048',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    height: 56,
  },
  logo: { fontSize: 18, fontWeight: 700, color: '#f97316', letterSpacing: '-0.5px' },
  logoSub: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  tabs: { display: 'flex', gap: 4, marginLeft: 'auto', background: '#161b27', padding: '4px 6px', borderRadius: 8, border: '1px solid #253048' },
  tab: (active, accent) => {
    const c = accent || '#f97316';
    return {
      padding: '7px 16px',
      borderRadius: 6,
      border: active ? 'none' : '1px solid transparent',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 700 : 600,
      background: active ? `linear-gradient(135deg,${c},${c}dd)` : 'transparent',
      color: active ? '#fff' : '#d1d5db',
      transition: 'all 0.15s',
      boxShadow: active ? `0 2px 10px ${c}59` : 'none',
    };
  },
  body: { padding: 24, maxWidth: 1400, margin: '0 auto' },

  filterRow: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' },
  tradeFilterRow: {
    display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
    paddingBottom: 12, borderBottom: '1px solid #253048',
  },
  filterBtn: (active) => ({
    padding: '8px 14px',
    borderRadius: 20,
    border: `1px solid ${active ? '#f97316' : '#2e3d5c'}`,
    background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
    color: active ? '#f97316' : '#8899b8',
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
    background: hovered ? '#1e2a40' : '#1a2236',
    border: `1px solid ${hovered ? '#3a4d6b' : '#253048'}`,
    borderRadius: 10,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.15s',
    transform: hovered ? 'translateY(-2px)' : 'none',
    boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.55)' : '0 1px 4px rgba(0,0,0,0.3)',
  }),
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardName: { fontSize: 15, fontWeight: 600, color: '#f1f5f9' },
  cardContact: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: (status) => ({
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 10,
    background: STATUS_COLORS[status] + '33',
    color: STATUS_COLORS[status],
    border: `1px solid ${STATUS_COLORS[status]}55`,
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
    background: (TRADE_COLORS[trade] || '#64748b') + '2e',
    color: TRADE_COLORS[trade] || '#64748b',
    border: `1px solid ${(TRADE_COLORS[trade] || '#64748b')}44`,
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    marginTop: 6,
  }),
  stageBadge: (stage) => ({
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 10,
    background: (STAGE_COLORS[stage] || '#64748b') + '28',
    color: STAGE_COLORS[stage] || '#64748b',
    border: `1px solid ${(STAGE_COLORS[stage] || '#64748b')}44`,
    letterSpacing: '0.2px',
    whiteSpace: 'nowrap',
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
    fontSize: 13, fontWeight: 700, color: '#b0c0d8',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
  },
  cbBadge: (color) => ({
    background: color + '22', color, padding: '1px 8px', borderRadius: 10, fontSize: 11,
  }),
  cbRow: (hovered) => ({
    background: hovered ? '#1c2840' : '#1a2236',
    border: `1px solid ${hovered ? '#3a4d6b' : '#253048'}`, borderRadius: 8,
    padding: '12px 16px', marginBottom: 8,
    display: 'flex', alignItems: 'center', gap: 16,
    cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
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
    background: '#1a2236', border: '1px solid #253048',
    borderRadius: 10, padding: 20, textAlign: 'center',
    boxShadow: '0 1px 6px rgba(0,0,0,0.3)',
  },
  statVal: { fontSize: 28, fontWeight: 700, color: '#f97316' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  chartSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  chartCard: {
    background: '#1a2236', border: '1px solid #253048',
    borderRadius: 10, padding: 20,
    boxShadow: '0 1px 6px rgba(0,0,0,0.3)',
  },
  chartTitle: { fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 16 },
  barRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  barLabel: { fontSize: 12, color: '#94a3b8', width: 120, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: '#253048', borderRadius: 4, overflow: 'hidden' },
  barFill: (pct, color) => ({
    height: '100%', width: `${pct}%`, background: color,
    borderRadius: 4, transition: 'width 0.5s ease',
  }),
  barCount: { fontSize: 12, color: '#64748b', width: 28, textAlign: 'right' },

  // Jobs
  progressTrack: { height: 6, background: '#253048', borderRadius: 3, overflow: 'hidden', marginTop: 10 },
  progressFill: (pct, color) => ({
    height: '100%', width: `${pct}%`, background: color,
    borderRadius: 3, transition: 'width 0.4s ease',
  }),

  // Checklist modal
  checklistItem: () => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 4px', borderBottom: '1px solid #1f2d42', cursor: 'pointer',
    borderRadius: 4, transition: 'background 0.1s',
  }),
  checkbox: (done) => ({
    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
    border: `2px solid ${done ? '#f97316' : '#3a4d6b'}`,
    background: done ? '#f97316' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
    boxShadow: done ? '0 0 6px rgba(249,115,22,0.35)' : 'none',
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
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#1a2236', border: '1px solid #2e3d5c',
    borderRadius: 14, width: '100%', maxWidth: 560,
    maxHeight: '85vh', overflow: 'auto', padding: 28, position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  closeBtn: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(255,255,255,0.07)', border: '1px solid #2e3d5c',
    borderRadius: 8,
    color: '#94a3b8', cursor: 'pointer', fontSize: 20, lineHeight: 1,
    width: 40, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
    transition: 'color 0.15s, background 0.15s',
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
  { key: 'calendar',  label: 'Calendar',  icon: '📅' },
  { key: 'crew',      label: 'Crew',      icon: '👷' },
  { key: 'chat',      label: 'Chat',      icon: '💬' },
  { key: 'photos',    label: 'Photos',    icon: '📸' },
];

// ─── Section Color Map ──────────────────────────────────────────────────────
// Central color constants for tab accents — easy to tweak in one place.
const SECTION_COLORS = {
  // Main nav tabs
  pipeline:  '#f97316',  // orange
  callbacks: '#ef4444',  // red
  analytics: '#8b5cf6',  // purple
  jobs:      '#3b82f6',  // blue
  calendar:  '#7c3aed',  // violet
  crew:      '#eab308',  // yellow
  chat:      '#10b981',  // green
  photos:    '#06b6d4',  // cyan
  // Job detail modal tabs
  checklist: '#f97316',  // orange
  crewpay:   '#14b8a6',  // teal (Cost Manager)
};

// Cost Manager sub-tab teal variants
const CM_SUB_COLORS = {
  materials: '#14b8a6',  // teal
  labor:     '#0d9488',  // teal-600
  summary:   '#0f766e',  // teal-700
  signoff:   '#2dd4bf',  // teal-300
};

// ─── Demo Role Definitions ────────────────────────────────────────────────────
const DEMO_ROLES = {
  owner: {
    label: 'Owner/Admin', color: '#22c55e',
    tabs: ['pipeline','callbacks','analytics','jobs','calendar','crew','chat','photos'],
    seeDollars: true, seeRates: true, seeProfitability: true,
    seeCostManager: true, seeCrewPay: true, seeAnalyticsRevenue: true,
  },
  sales: {
    label: 'Sales', color: '#6366f1',
    tabs: ['pipeline','callbacks','jobs','calendar','chat','analytics'],
    seeDollars: true, seeRates: false, seeProfitability: false,
    seeCostManager: false, seeCrewPay: false, seeAnalyticsRevenue: true,
  },
  foreman: {
    label: 'Foreman', color: '#f97316',
    tabs: ['jobs','calendar','crew','chat','photos'],
    seeDollars: false, seeRates: false, seeProfitability: false,
    seeCostManager: true, seeCrewPay: false, seeAnalyticsRevenue: false,
  },
  crew: {
    label: 'Crew', color: '#64748b',
    tabs: ['jobs','chat','photos'],
    seeDollars: false, seeRates: false, seeProfitability: false,
    seeCostManager: false, seeCrewPay: false, seeAnalyticsRevenue: false,
  },
};

function GlobalStyles() {
  return (
    <style>{`
      .ri-btn { transition: filter 0.15s, transform 0.12s, box-shadow 0.15s; cursor: pointer; }
      .ri-btn-primary { background: linear-gradient(135deg,#f97316,#e8640c) !important; color:#fff !important; border:none !important; font-weight:700 !important; box-shadow:0 2px 10px rgba(249,115,22,0.3); }
      .ri-btn-primary:hover:not(:disabled) { filter:brightness(1.12); transform:translateY(-1px); box-shadow:0 4px 18px rgba(249,115,22,0.5) !important; }
      .ri-btn-primary:active:not(:disabled) { transform:translateY(0); filter:brightness(0.96); }
      .ri-btn-secondary { background:transparent !important; border:1px solid #3a4d6b !important; color:#94a3b8 !important; }
      .ri-btn-secondary:hover:not(:disabled) { border-color:#f97316 !important; color:#f1f5f9 !important; background:rgba(249,115,22,0.07) !important; }
      .ri-btn-danger { background:rgba(239,68,68,0.12) !important; border:1px solid rgba(239,68,68,0.4) !important; color:#f87171 !important; }
      .ri-btn-danger:hover:not(:disabled) { background:rgba(239,68,68,0.24) !important; border-color:rgba(239,68,68,0.7) !important; }
      .ri-del { transition:color 0.12s, background 0.12s; cursor:pointer; }
      .ri-del:hover { color:#ef4444 !important; }
      input:focus, select:focus, textarea:focus { border-color:#f97316 !important; box-shadow:0 0 0 3px rgba(249,115,22,0.14) !important; outline:none !important; }
      .ri-nav-tab { transition:color 0.15s, background 0.15s; }
      .ri-nav-tab:hover { color:#f1f5f9 !important; background:rgba(255,255,255,0.06) !important; border-radius:6px; }
      .ri-modal-tab { transition:all 0.15s; }
      .ri-modal-tab:hover { background:rgba(255,255,255,0.06) !important; border-radius:6px 6px 0 0; }
      .ri-bnav-btn { transition:color 0.15s, background 0.15s; }
      .ri-bnav-btn:hover { background:rgba(255,255,255,0.05) !important; }
      .ri-cb-row { transition:background 0.12s, border-color 0.12s; }
      .ri-cb-row:hover { background:#1c2840 !important; border-color:#3a4d6b !important; }
      .ri-sec-hdr { transition:background 0.12s; }
      .ri-sec-hdr:hover { background:#1e2a42 !important; }
      .ri-sub-tab { transition:color 0.15s, border-color 0.15s; cursor:pointer; }
      .ri-sub-tab:hover { color:#f1f5f9 !important; }
      .ri-card-btn:hover { color:#f1f5f9 !important; background:rgba(249,115,22,0.1) !important; }
      .ri-close-btn:hover { color:#f1f5f9 !important; background:rgba(255,255,255,0.12) !important; }
      .ri-add-item:hover { color:#94a3b8 !important; border-color:#3a4d6b !important; }
      ::-webkit-scrollbar { width:5px; height:5px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:#2d3748; border-radius:3px; }
      @media (max-width:768px) {
        .ri-btn { min-height:48px; }
        .ri-btn-primary { font-size:15px !important; }
        .ri-btn-secondary { font-size:15px !important; }
      }
    `}</style>
  );
}

function BottomNav({ tab, setTab, tabs }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#151d30', borderTop: '2px solid #253048',
      display: 'flex', height: 64, zIndex: 200,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.35)',
      overflowX: 'auto', scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {(tabs || NAV_TABS).map(({ key, label, icon, locked }) => {
        const c = SECTION_COLORS[key] || '#f97316';
        const isActive = tab === key && !locked;
        return (
          <button
            key={key}
            className={isActive ? '' : 'ri-bnav-btn'}
            onClick={() => !locked && setTab(key)}
            style={{
              minWidth: 64, flexShrink: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: isActive ? c + '15' : 'transparent', border: 'none',
              color: locked ? '#2d3748' : isActive ? c : '#cbd5e1',
              fontSize: 10, fontWeight: isActive ? 700 : 600,
              cursor: locked ? 'not-allowed' : 'pointer',
              gap: 3, minHeight: 64, padding: 0,
              borderTop: isActive ? `2px solid ${c}` : '2px solid transparent',
              transition: 'color 0.15s, background 0.15s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: isActive ? 22 : 18, lineHeight: 1, transition: 'font-size 0.15s' }}>
              {locked ? '🔒' : icon}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + n.toLocaleString();

// Stages at which a lead also appears as an active job
const JOB_STAGES = [
  'materials_ordered', 'scheduled_for_install', 'in_progress',
  'punch_list', 'completed', 'invoiced', 'paid',
];

function leadToJob(lead) {
  const s = lead.stage;
  let status = 'Scheduled';
  if (s === 'paid' || s === 'invoiced' || s === 'completed') status = 'Complete';
  else if (s === 'in_progress' || s === 'punch_list') status = 'In Progress';

  return {
    id: lead.id,
    customer: lead.name,
    address: lead.address || '',
    trade: lead.trade,
    value: lead.value,
    status,
    scheduledDate: lead.scheduledDate || lead.callbackDate || lead.lastContact || TODAY,
    explicitlyScheduled: !!lead.scheduledDate,
    completedSteps: lead.completedSteps || [],
    notes: lead.notes || '',
    duration: lead.duration || 1,
  };
}

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

  const responses = {
    lead: `1. Call ${contact} today to schedule a site visit for the ${name} job — leads that get a same-day visit convert 3× higher than those that wait a week. Ask about insurance coverage (Erie, State Farm, Nationwide are the big three in the valley) before the call ends.\n\n2. Pull the ${name} property on Google Maps satellite view before visiting — estimate roof pitch, check for dormers or additions, and spot access issues. Many valley homes have steep pitches and tight driveways. Arriving prepared on a ${val} lead signals professionalism.\n\n3. Check the township requirements for the ${name} address — permit rules vary across Union, Snyder, and Northumberland counties. Some townships don't require permits for re-roofs, but verify before quoting.\n\n4. Create the job folder today: address, ${contact}'s contact details, satellite screenshot, and your initial scope notes. Note if this is a referral — word of mouth is everything in the Susquehanna Valley.`,

    inspection_scheduled: `1. Confirm the inspection appointment with ${contact} at ${name} — send a text with the date, time, and what you'll need access to (roof, attic, all sides). Cell service can be spotty in parts of Union and Snyder counties, so confirm by text, not just voicemail.\n\n2. Prep your inspection kit: drone (charged), ladder, measuring wheel, moisture meter, camera. Many valley homes have steep pitches (8/12+) and older slate or metal that require extra caution. Missing one tool on a ${val} job means a return trip.\n\n3. Check the 3-day forecast — central PA spring weather is unpredictable. Rain or 20+ mph winds mean a reschedule. Notify ${contact} early rather than canceling on arrival. Rescheduling proactively signals professionalism.\n\n4. Review the ${name} property on Google Maps satellite view — estimate total roof area, count slopes, and identify penetrations. Older valley homes often have multiple additions with complex tie-ins that aren't obvious from the street.`,

    inspection_complete: `1. Upload all ${name} inspection photos within 24 hours using the Damage Documentation and Drone Shots categories — four sides from ground level, close-ups of each damage area, the ridge, both valleys, and all penetrations. ${contact} will use these to understand exactly what they're approving at the ${val} estimate.\n\n2. Measure the roof in sections: ridge length, each slope's dimensions, and pitch. Many valley homes have 8/12 to 12/12 pitches that significantly increase labor cost. Accurate square footage on a ${val} job prevents under-ordering from Boise Cascade or ABC Supply.\n\n3. Walk the attic if accessible — check for ice dam staining, moisture damage from freeze-thaw cycles, and prior patching with mismatched materials. Damaged decking at ${name} must be priced as a conditional line item, not discovered mid-job.\n\n4. Document flashing condition at every penetration — limestone chimneys common in the Susquehanna Valley are the #1 source of callbacks. Note what needs replacing now so it's in the ${val} estimate, not an afterthought after ${contact} has signed.`,

    estimate_sent: `1. The ${name} estimate should have gone out within 24 hours of inspection — close rate drops sharply after 48 hours, especially during spring storm season when competitors are knocking the same doors. The ${val} estimate should include materials, labor, disposal, and a conditional deck repair line item.\n\n2. Break the estimate into specific line items: shingles (GAF, CertainTeed, or Owens Corning — specify brand and warranty tier), underlayment, ice & water shield at eaves and valleys (PA code), drip edge, flashing, ridge cap, tear-off, and disposal. ${contact} will compare your bid — being itemized makes ${val} impossible to compare against a lump-sum competitor.\n\n3. Include your workmanship warranty terms in the estimate. Most storm chasers passing through the valley carry no written warranty. Putting yours in writing is the differentiator at the ${val} level — and protects you if Erie or State Farm questions workmanship later.\n\n4. Follow up with a call to ${contact} 48 hours after sending. For Mennonite or rural customers, a face-to-face visit often works better than phone or email. Ask: "Did you have a chance to look over the line items? Any questions on the material spec?"`,

    contract_signed: `1. Collect the deposit from ${contact} for ${name} immediately — a signed contract without a deposit is just a letter of intent. Some rural valley customers prefer check or cash; confirm the method and amount before moving to material ordering on this ${val} job.\n\n2. Check township permit requirements for the ${name} address — rules vary across Union, Snyder, Northumberland, and Columbia counties. Some townships don't require permits for re-roofs, but pulling one anyway protects you on insurance work.\n\n3. Confirm material selections with ${contact}: shingle color and brand (GAF Timberline HDZ, CertainTeed Landmark, Owens Corning Duration), warranty tier, and any upgrades. Order from Boise Cascade Sunbury or ABC Supply now — popular colors like Charcoal and Weathered Wood can be 2-3 weeks out in peak season.\n\n4. Send ${contact} a written confirmation: start date, scope summary, payment schedule, and your cancellation/change-order policy. Note any Sunday work restrictions if the customer or neighbors have requested it.`,

    materials_ordered: `1. Order all materials for ${name} from Boise Cascade Sunbury or ABC Supply — shingles, underlayment, ice & water shield, drip edge, flashing, and ridge cap. Lock pricing now. Spring is peak season in the valley and popular colors go fast.\n\n2. Schedule delivery for the day before or morning of the install start date at ${name}. Verify the supplier has the correct address and driveway access — many rural properties in the valley have narrow lanes or gravel drives that limit truck size.\n\n3. Verify the order matches the ${val} estimate exactly: shingle count by color/type, underlayment rolls, ice & water shield for eaves and valleys (PA code), and ridge cap bundles. A shortage on day one costs a half-day of crew time.\n\n4. Confirm dumpster delivery and placement with ${contact}. Check if the township requires a road permit for dumpster placement — this varies across Union, Snyder, and Northumberland counties.`,

    scheduled_for_install: `1. Assign the crew lead for ${name} and confirm their availability for the start date in writing. Spring is peak season in the Susquehanna Valley — every crew is booked. For a ${val} job, get the foreman's name and 7 AM start time committed.\n\n2. Send ${contact} a reminder with the start date, expected crew arrival time, and what to expect: noise starting early, driveway access for the dumpster, and approximate duration. Note any gravel drive or narrow lane access issues common on rural valley properties.\n\n3. Check the 5-day forecast one more time — PA spring storms can push a job mid-week. Shingles can't be installed below 40°F (GAF and CertainTeed both void warranties). Have a backup date ready and communicate it to ${contact} proactively.\n\n4. Verify the permit is in hand (if required by the township) and confirm all materials + dumpster are scheduled for delivery before the crew arrives at ${name}. Run through the Boise Cascade or ABC Supply order one final time.`,

    in_progress: `1. Check in with the crew lead at ${name} at noon — confirm progress, flag any material shortages, and check the afternoon forecast. Summer thunderstorms in the valley can roll in fast. Daily visibility on a ${val} job prevents small delays from compounding.\n\n2. Take progress photos using the During Tear-off, Decking, and Underlayment categories — these protect you on warranty claims with GAF or CertainTeed, and give ${contact} confidence the ${val} job is moving as expected. Erie Insurance and State Farm both require documentation if this is a claim.\n\n3. If the crew finds rotted board decking or ice dam damage at ${name}, stop and call ${contact} before proceeding — show them a photo, explain the issue, and get written approval. Old valley homes often have 1x6 board decking that needs full OSB overlay. Never absorb deck repair on a ${val} job.\n\n4. Run a magnetic nail sweep at end of each day — especially critical on rural properties where ${contact}'s family mows the yard or kids play outside. Nail injuries and neighbor complaints are avoidable with a 10-minute sweep.`,

    punch_list: `1. Walk the ${name} property with the crew lead — check ridge cap alignment, all flashing seals at limestone chimneys, drip edge continuity, and any visible nail pops. Every item gets a line item and a deadline. Callbacks cost 3x more than catching it now.\n\n2. Verify gutter reattachment and downspout alignment — these are the items ${contact} will notice first from the ground. A loose gutter on a ${val} job undermines the entire quality impression, especially if neighbors are watching (word travels fast in the valley).\n\n3. Run a full magnetic nail sweep — driveway, lawn, sidewalk, gravel areas, and flower beds. One nail in a tire generates a callback that costs more in goodwill than the sweep takes in time.\n\n4. Clear all debris, leftover shingle bundles, and protective tarps from the ${name} property. The site should look better than when you arrived. Take Final category photos before leaving — ${contact} is evaluating the whole experience.`,

    completed: `1. Schedule the final walkthrough with ${contact} at ${name} — walk the perimeter together, check the ridge line, and inspect all flashing points. A face-to-face walkthrough closes the ${val} job cleanly and sets up the referral ask. Valley communities are tight-knit — this moment matters.\n\n2. File the permit close-out if required by the township. Some PA jurisdictions issue lien notices if the final isn't filed within 30 days — don't leave this open on a ${val} job, especially if it's insurance-funded.\n\n3. Take Final category photos and Drone Shots from all four sides. Valley homes with mountain backdrops make great portfolio content. These photos drive future sales more than any ad spend — Susquehanna Valley homeowners check local roofers' work online before calling.\n\n4. Ask ${contact} for a Google review and one referral within 48 hours. Say it directly: "If you're happy with the work, a Google review and one name are the best ways to help us." Word of mouth is everything in communities like Mifflinburg, Lewisburg, and Selinsgrove.`,

    invoiced: `1. The final invoice for ${name} should have gone out within 24 hours of the walkthrough — delays signal disorganization and give ${contact} time to find objections to the ${val} balance.\n\n2. Include before/after photos and a warranty summary (GAF, CertainTeed, or Owens Corning registration details) with the invoice. Visual proof of the transformation reinforces value and reduces pushback.\n\n3. Set a 5-business-day follow-up reminder — if ${contact} hasn't paid, call directly. Don't rely on email for payment in rural PA. Some valley customers prefer to drop off a check or pay in person — accommodate that.\n\n4. If this is an insurance job, confirm the supplement has been filed and the adjuster (Erie, State Farm, Nationwide, or Allstate) has the final documentation including the permit close-out. Insurance delays are the #1 reason roofing invoices go past 30 days in the valley.`,

    paid: `1. Record the payment from ${contact} for ${name} and close the job immediately — open jobs distort your pipeline and make your dispatch board look cluttered heading into the next season push.\n\n2. Mail or email the warranty certificate and manufacturer registration to ${contact}. For GAF Golden Pledge or CertainTeed SureStart Plus, the registration must be filed within 60 days. This protects you and the homeowner.\n\n3. Schedule a 6-month follow-up call with ${contact} to check on the ${name} roof after the first winter freeze-thaw cycle. Ask about ice dams, attic moisture, and any concerns. Then ask for referrals — a proactive check-in after a ${val} job converts past customers into your best lead source in the valley.\n\n4. Archive the ${name} job folder with all photos (Before through Final + Drone Shots), permits, signed contracts, and payment records. Clean documentation protects you on warranty claims for decades — and builds your portfolio for future bids across Union, Snyder, and Northumberland counties.`,
  };

  return responses[stage] || responses.lead;
}

// ─── Add / Edit Lead Modal ────────────────────────────────────────────────────
const LEAD_SOURCES = ['Referral', 'Door knock', 'Online', 'Phone call', 'Repeat customer', 'Other'];
const LEAD_STAGES = [
  'lead', 'inspection_scheduled', 'inspection_complete', 'estimate_sent',
  'contract_signed', 'materials_ordered', 'scheduled_for_install',
  'in_progress', 'punch_list', 'completed', 'invoiced', 'paid',
];

const FI = { // form input base
  width: '100%', padding: '9px 12px', background: '#111823',
  border: '1px solid #2e3d5c', borderRadius: 7, color: '#e2e8f0',
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Inter', -apple-system, sans-serif",
  transition: 'border-color 0.15s',
};
const FLbl = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#7a8faa',
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
    trade: lead?.trade || defaultTrade || 'Full Replacement',
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
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
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
        <input style={isMobile ? mobileInput : fi('address')} value={form.address} placeholder="1234 Oak St, Mifflinburg PA 17844"
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
            <label style={FLbl}>Job Type *</label>
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
            className="ri-btn ri-btn-primary"
            style={{
              flex: 1, padding: isMobile ? '14px 16px' : '10px 16px',
              background: 'linear-gradient(135deg, #f97316, #e8640c)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              minHeight: 48, WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 2px 12px rgba(249,115,22,0.35)',
            }}
            onClick={handleSave}
          >
            {isEdit ? 'Save Changes' : 'Add Lead'}
          </button>
          <button
            className="ri-btn ri-btn-secondary"
            style={{
              padding: isMobile ? '14px 20px' : '10px 20px',
              background: 'transparent',
              border: '1px solid #3a4d6b', borderRadius: 8,
              color: '#94a3b8', cursor: 'pointer', fontSize: 14,
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

// ─── IndexedDB Photo Storage ──────────────────────────────────────────────────
const photoDB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('ridgeos-photos', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('photos')) {
          const store = db.createObjectStore('photos', { keyPath: 'id' });
          store.createIndex('jobId', 'jobId', { unique: false });
        }
      };
      req.onsuccess = (e) => { this._db = e.target.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  },
  getAll() {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('photos', 'readonly').objectStore('photos').getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  getByJob(jobId) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('photos', 'readonly').objectStore('photos').index('jobId').getAll(jobId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  add(photo) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('photos', 'readwrite').objectStore('photos').add(photo);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  remove(id) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('photos', 'readwrite').objectStore('photos').delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    }));
  },
};

// ─── IndexedDB Time Tracking ─────────────────────────────────────────────────
const timeDB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('ridgeos-time', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('entries')) {
          const store = db.createObjectStore('entries', { keyPath: 'id' });
          store.createIndex('jobId', 'jobId', { unique: false });
          store.createIndex('crewMemberId', 'crewMemberId', { unique: false });
        }
      };
      req.onsuccess = (e) => { this._db = e.target.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  },
  getAll() {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('entries', 'readonly').objectStore('entries').getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  add(entry) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('entries', 'readwrite').objectStore('entries').add(entry);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  put(entry) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('entries', 'readwrite').objectStore('entries').put(entry);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
};

function fmtDuration(ms) {
  if (!ms || ms < 0) return '0m';
  const totalMins = Math.floor(ms / 60000);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function weekStartMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

function computeTotalMs(entries) {
  const now = Date.now();
  return entries.reduce((sum, e) => sum + Math.max(0, (e.clockOut || now) - e.clockIn), 0);
}

// ─── Calendar Helpers ─────────────────────────────────────────────────────────
function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function dateAdd(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

function jobDuration(job) {
  return job.duration || DEMO_JOB_DURATIONS[job.id] || 1;
}

function jobEndDate(job) {
  if (!job.scheduledDate) return null;
  return dateAdd(job.scheduledDate, jobDuration(job) - 1);
}

function jobOccupiesDate(job, dateStr) {
  if (!job.scheduledDate) return false;
  return dateStr >= job.scheduledDate && dateStr <= jobEndDate(job);
}

function buildMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(start.getDate() - start.getDay());
  const days = [];
  const d = new Date(start);
  for (let i = 0; i < 42; i++) {
    days.push(toDateStr(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function buildWeekDays(refDateStr) {
  const start = new Date(refDateStr + 'T12:00:00');
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return toDateStr(d);
  });
}

// ─── IndexedDB Chat Storage ───────────────────────────────────────────────────
const chatDB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('ridgeos-chat', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('messages')) {
          const store = db.createObjectStore('messages', { keyPath: 'id' });
          store.createIndex('jobId', 'jobId', { unique: false });
        }
      };
      req.onsuccess = (e) => { this._db = e.target.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  },
  getAll() {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('messages', 'readonly').objectStore('messages').getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  getByJob(jobId) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('messages', 'readonly').objectStore('messages').index('jobId').getAll(jobId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  add(msg) {
    return this.open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction('messages', 'readwrite').objectStore('messages').add(msg);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
};

async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = url;
  });
}

// ─── Photo Categories ────────────────────────────────────────────────────────
const PHOTO_CATEGORIES = [
  'Before', 'During Tear-off', 'Decking', 'Underlayment',
  'Final', 'Damage Documentation', 'Drone Shots',
];

// ─── Job Photos Panel ─────────────────────────────────────────────────────────
function JobPhotosPanel({ lead, onCountChange }) {
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Before');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const isMobile = useMobile();
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const refresh = useCallback(() => {
    photoDB.getByJob(String(lead.id)).then(ps => {
      const sorted = ps.sort((a, b) => b.timestamp - a.timestamp);
      setPhotos(sorted);
      if (onCountChange) onCountChange(sorted.length);
    }).catch(() => {});
  }, [lead.id, onCountChange]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleFiles = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const imageData = await compressImage(file);
        await photoDB.add({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          jobId: String(lead.id),
          jobName: lead.name,
          imageData,
          timestamp: Date.now(),
          caption: caption.trim(),
          category: photoCategory,
          stage: lead.stage || 'lead',
          trade: lead.trade || '',
        });
      }
      setCaption('');
    } finally {
      setUploading(false);
      refresh();
    }
  };

  const handleDelete = async (id) => {
    await photoDB.remove(id);
    if (lightbox && lightbox.id === id) setLightbox(null);
    refresh();
  };

  const formatTs = (ts) => new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const gridCols = isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))';

  return (
    <div>
      {/* Upload controls */}
      <div style={{ marginBottom: 14 }}>
        <input
          style={{
            width: '100%', padding: '8px 12px', background: '#111823',
            border: '1px solid #2e3d5c', borderRadius: 7, color: '#e2e8f0',
            fontSize: 13, outline: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit', marginBottom: 8,
          }}
          placeholder="Caption / note (optional)"
          value={caption}
          onChange={e => setCaption(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <select
            style={{
              flex: 1, padding: '8px 12px', background: '#111823',
              border: '1px solid #164e63', borderRadius: 7, color: '#22d3ee',
              fontSize: 13, outline: 'none', fontFamily: 'inherit', fontWeight: 600,
            }}
            value={photoCategory}
            onChange={e => setPhotoCategory(e.target.value)}
          >
            {PHOTO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
          />
          <input
            ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
            onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
          />
          <button
            onClick={() => cameraRef.current && cameraRef.current.click()}
            disabled={uploading}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 8,
              background: '#06b6d4', border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 700,
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: uploading ? 0.6 : 1,
            }}
          >
            📷 {isMobile ? 'Camera' : 'Take Photo'}
          </button>
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            disabled={uploading}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 8,
              background: '#1a1f2e', border: '1px solid #2d3748',
              color: uploading ? '#475569' : '#94a3b8',
              fontSize: 13, fontWeight: 600,
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            🖼 {uploading ? 'Saving…' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Category filter */}
      {photos.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <button
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '3px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: categoryFilter === 'all' ? '1px solid #06b6d4' : '1px solid #1e2535',
              background: categoryFilter === 'all' ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: categoryFilter === 'all' ? '#06b6d4' : '#94a3b8',
            }}
          >All</button>
          {PHOTO_CATEGORIES.filter(c => photos.some(p => p.category === c)).map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(categoryFilter === c ? 'all' : c)}
              style={{
                padding: '3px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: categoryFilter === c ? '1px solid #06b6d4' : '1px solid #1e2535',
                background: categoryFilter === c ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: categoryFilter === c ? '#06b6d4' : '#94a3b8',
              }}
            >{c}</button>
          ))}
        </div>
      )}

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          border: '1px dashed #1e2535', borderRadius: 10,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>No photos yet</div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            {isMobile
              ? 'Tap Camera to shoot or Upload to pick from library.'
              : 'Use Take Photo or Upload to start documenting this job.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8 }}>
          {photos.filter(p => categoryFilter === 'all' || p.category === categoryFilter).map(photo => (
            <div
              key={photo.id}
              onClick={() => setLightbox(photo)}
              style={{
                position: 'relative', borderRadius: 8, overflow: 'hidden',
                cursor: 'pointer', border: '1px solid #253048',
                aspectRatio: '4/3', background: '#0d1117',
              }}
            >
              <img
                src={photo.imageData}
                alt={photo.caption || 'Job photo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.65)', padding: '4px 7px',
                fontSize: 10, color: '#e2e8f0',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {photo.category && <span style={{ background: 'rgba(6,182,212,0.3)', color: '#22d3ee', padding: '1px 5px', borderRadius: 4, fontSize: 9, fontWeight: 600, marginRight: 4 }}>{photo.category}</span>}
                {photo.caption || ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.93)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <img
            src={lightbox.imageData}
            alt={lightbox.caption || ''}
            style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: 8 }}
          />
          <div style={{
            marginTop: 12, display: 'flex', gap: 10, alignItems: 'center',
            flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480,
          }}>
            {lightbox.category && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8,
                background: 'rgba(6,182,212,0.15)', color: '#06b6d4',
                border: '1px solid rgba(6,182,212,0.3)',
              }}>
                {lightbox.category}
              </span>
            )}
            {lightbox.caption && (
              <span style={{ fontSize: 13, color: '#e2e8f0' }}>{lightbox.caption}</span>
            )}
            <span style={{ fontSize: 11, color: '#64748b' }}>{formatTs(lightbox.timestamp)}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 8,
              background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
              border: '1px solid rgba(59,130,246,0.3)',
            }}>
              {STAGE_LABELS[lightbox.stage] || lightbox.stage}
            </span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button
              onClick={() => setLightbox(null)}
              style={{
                padding: '8px 20px', borderRadius: 7,
                background: '#1a1f2e', border: '1px solid #2d3748',
                color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Close
            </button>
            <button
              onClick={() => handleDelete(lightbox.id)}
              style={{
                padding: '8px 20px', borderRadius: 7,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CoachPanel ──────────────────────────────────────────────────────────────
function CoachPanel({ lead, onClose, demoMode, tier, onStageChange }) {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localStage, setLocalStage] = useState(lead.stage || 'lead');
  const [activeTab, setActiveTab] = useState('info');
  const [photoCount, setPhotoCount] = useState(0);
  const isMobile = useMobile();
  const goToSignup = () => { window.location.href = '/'; };

  const stageTips = STAGE_TIPS[localStage] || STAGE_TIPS.lead;
  const isStarterLocked = demoMode && tier === 'starter';

  useEffect(() => {
    photoDB.getByJob(String(lead.id)).then(ps => setPhotoCount(ps.length)).catch(() => {});
  }, [lead.id]);

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
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ ...S.modalTitle, paddingRight: 52 }}>{lead.name}</div>
        <div style={S.modalSub}>
          {lead.contact} · {lead.role} · {fmt(lead.value)} · {STAGE_LABELS[lead.stage] || lead.stage}
          {lead.stallReason && ` · ${STALL_LABELS[lead.stallReason]}`}
        </div>
        <div style={{ marginBottom: 16 }}>
          <span style={S.tradeBadge(lead.trade)}>{lead.trade}</span>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1e2535', marginBottom: 20 }}>
          {[
            { key: 'info', label: 'Details' },
            { key: 'photos', label: photoCount > 0 ? `Photos (${photoCount})` : 'Photos' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '8px 16px', background: 'transparent', border: 'none',
                borderBottom: activeTab === key ? '2px solid #f97316' : '2px solid transparent',
                color: activeTab === key ? '#f97316' : '#64748b',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                marginBottom: -1, transition: 'color 0.15s', fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Details tab */}
        {activeTab === 'info' && (
          <>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
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
          </>
        )}

        {/* Photos tab */}
        {activeTab === 'photos' && (
          <JobPhotosPanel lead={lead} onCountChange={setPhotoCount} />
        )}
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

// ─── Pipeline Tab ─────────────────────────────────────────────────────────────
// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({ lead, urgencyBorder, staleDays, onQuickEdit, onEdit, onDelete, demoMode, rolePerms }) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', String(lead.id));
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  };
  const handleDragEnd = () => setDragging(false);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false); }}
      onClick={() => !dragging && onQuickEdit && onQuickEdit(lead)}
      style={{
        background: hovered ? '#1e2a40' : '#1a2236',
        border: urgencyBorder,
        borderRadius: 8, padding: '10px 12px',
        cursor: 'pointer', position: 'relative',
        transition: 'all 0.15s',
        userSelect: 'none',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.contact}{lead.role ? ` · ${lead.role}` : ''}</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', marginLeft: 8, flexShrink: 0 }}>{rolePerms?.seeDollars !== false ? fmt(lead.value) : '—'}</span>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{ ...S.tradeBadge(lead.trade), marginTop: 0, fontSize: 9, padding: '1px 6px' }}>{lead.trade}</span>
        <span style={{ ...S.statusBadge(lead.status), fontSize: 9 }}>{lead.status}</span>
      </div>

      {staleDays > 7 && (
        <div style={{ fontSize: 10, color: staleDays > 14 ? '#ef4444' : '#eab308', marginTop: 3 }}>
          {staleDays > 14 ? '🔴' : '🟡'} {staleDays}d no contact
        </div>
      )}

      {lead.stallReason && (
        <div style={{ fontSize: 10, color: '#f97316', marginTop: 2 }}>⚠ {STALL_LABELS[lead.stallReason]}</div>
      )}

      {/* Issues badges */}
      {lead.issues && lead.issues.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
          {lead.issues.slice(0, 2).map(issue => (
            <span key={issue} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>{issue}</span>
          ))}
          {lead.issues.length > 2 && <span style={{ fontSize: 9, color: '#64748b' }}>+{lead.issues.length - 2}</span>}
        </div>
      )}

      {/* Last update preview */}
      {lead.lastUpdate && (
        <div style={{ fontSize: 10, color: '#475569', marginTop: 5, paddingTop: 5, borderTop: '1px solid #1a2035', lineHeight: 1.4 }}>
          <span style={{ color: '#374151' }}>↳ </span>
          {lead.lastUpdate.length > 60 ? lead.lastUpdate.slice(0, 60) + '…' : lead.lastUpdate}
        </div>
      )}

      {/* Hover hint */}
      {hovered && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#2d3748' }}>Click to edit</span>
          {!demoMode && (
            <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
              {!confirmDelete ? (
                <button
                  style={{ padding: '2px 8px', fontSize: 10, background: 'transparent', border: '1px solid #2e3d5c', borderRadius: 4, color: '#64748b', cursor: 'pointer' }}
                  onClick={() => setConfirmDelete(true)}
                >
                  🗑
                </button>
              ) : (
                <>
                  <button style={{ padding: '2px 6px', fontSize: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, color: '#ef4444', cursor: 'pointer' }} onClick={() => onDelete && onDelete(lead.id)}>Del</button>
                  <button style={{ padding: '2px 6px', fontSize: 10, background: 'transparent', border: '1px solid #2e3d5c', borderRadius: 4, color: '#64748b', cursor: 'pointer' }} onClick={() => setConfirmDelete(false)}>No</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Card Quick Edit Modal ─────────────────────────────────────────────────────
function CardQuickEdit({ lead, onClose, onUpdate, onOpenDetail, currentUser, rolePerms }) {
  const [stage, setStage] = useState(lead.stage);
  const [status, setStatus] = useState(lead.status || 'active');
  const [updateText, setUpdateText] = useState('');
  const [issues, setIssues] = useState(lead.issues || []);
  const [showIssueMenu, setShowIssueMenu] = useState(false);
  const [customIssue, setCustomIssue] = useState('');
  const showToast = useToast();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const user = currentUser || 'You';
  const now = () => new Date().toISOString();

  const addEntry = (log, type, message) => [...(log || []), { timestamp: now(), type, message, user }];

  const postUpdate = () => {
    if (!updateText.trim()) return;
    const newLog = addEntry(lead.activityLog, 'update', updateText.trim());
    onUpdate({ ...lead, issues, activityLog: newLog, lastUpdate: updateText.trim() });
    setUpdateText('');
    showToast('Update posted');
  };

  const logContact = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newLog = addEntry(lead.activityLog, 'contact', `Contact logged on ${today}`);
    onUpdate({ ...lead, issues, lastContact: today, activityLog: newLog });
    showToast('Contact logged');
  };

  const addIssue = (issue) => {
    const trimmed = issue.trim();
    if (!trimmed || issues.includes(trimmed)) { setShowIssueMenu(false); setCustomIssue(''); return; }
    const newIssues = [...issues, trimmed];
    setIssues(newIssues);
    const newLog = addEntry(lead.activityLog, 'issue', `Issue added: ${trimmed}`);
    onUpdate({ ...lead, issues: newIssues, activityLog: newLog });
    setShowIssueMenu(false);
    setCustomIssue('');
  };

  const removeIssue = (issue) => {
    const newIssues = issues.filter(i => i !== issue);
    setIssues(newIssues);
    const newLog = addEntry(lead.activityLog, 'issue', `Issue removed: ${issue}`);
    onUpdate({ ...lead, issues: newIssues, activityLog: newLog });
  };

  const save = () => {
    let log = [...(lead.activityLog || [])];
    if (stage !== lead.stage) log = addEntry(log, 'stage', `Stage changed from ${STAGE_LABELS[lead.stage] || lead.stage} to ${STAGE_LABELS[stage] || stage}`);
    if (status !== lead.status) log = addEntry(log, 'status', `Status changed to ${status}`);
    onUpdate({ ...lead, stage, status, issues, activityLog: log });
    onClose();
    showToast('Saved');
  };

  const recentActivity = [...(lead.activityLog || [])].reverse().slice(0, 4);

  const ACTIVITY_ICONS = { stage: '→', status: '◉', update: '✎', contact: '📞', issue: '⚑' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#0d1117', border: '1px solid #253048', borderRadius: 14, width: '100%', maxWidth: 500, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2535', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {lead.contact}{lead.trade ? ` · ${lead.trade}` : ''} · <span style={{ color: '#22c55e', fontWeight: 600 }}>{rolePerms?.seeDollars !== false ? fmt(lead.value) : '—'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {onOpenDetail && (
              <button
                onClick={onOpenDetail}
                className="ri-btn ri-btn-secondary"
                style={{ background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 6, color: '#94a3b8', fontSize: 11, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                AI Coach ↗
              </button>
            )}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ── Post Update (most prominent) ── */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>✎ Post Update</div>
            <textarea
              ref={textareaRef}
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) postUpdate(); }}
              placeholder="e.g. Spoke with owner, waiting on HOA approval…&#10;Materials ordered from ABC Supply…&#10;Client wants to wait until spring."
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#060a12', border: '1px solid #2d3748', borderRadius: 8,
                color: '#f1f5f9', fontSize: 13, padding: '10px 12px',
                resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6,
              }}
            />
            <button
              onClick={postUpdate}
              disabled={!updateText.trim()}
              style={{
                marginTop: 8, width: '100%', padding: '10px 0',
                background: updateText.trim() ? 'linear-gradient(135deg, #f97316, #e8640c)' : '#111823',
                border: updateText.trim() ? 'none' : '1px solid #2e3d5c',
                borderRadius: 8, color: updateText.trim() ? '#fff' : '#3d4f63',
                fontWeight: 700, fontSize: 14, cursor: updateText.trim() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
                boxShadow: updateText.trim() ? '0 2px 10px rgba(249,115,22,0.3)' : 'none',
              }}
            >
              Post Update {updateText.trim() ? '(Ctrl+Enter)' : ''}
            </button>
          </div>

          {/* ── Stage + Status ── */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stage</div>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                style={{ width: '100%', ...FI, padding: '8px 10px', fontSize: 13 }}
              >
                {Object.entries(STAGE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', ...FI, padding: '8px 10px', fontSize: 13 }}
              >
                <option value="active">Active</option>
                <option value="stalled">Stalled</option>
                <option value="cold">Cold</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {/* ── Log Contact ── */}
          <button
            onClick={logContact}
            style={{
              width: '100%', padding: '10px 0',
              background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 8, color: '#22c55e', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            📞 Log Contact — resets "no contact" timer
          </button>

          {/* ── Issues ── */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issues</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {issues.map(issue => (
                <span key={issue} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '4px 10px', fontSize: 11, color: '#fca5a5' }}>
                  {issue}
                  <button onClick={() => removeIssue(issue)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: 13, lineHeight: 1, marginLeft: 1 }}>✕</button>
                </span>
              ))}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowIssueMenu(v => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: '1px dashed #2d3748', borderRadius: 12, padding: '4px 10px', fontSize: 11, color: '#475569', cursor: 'pointer' }}
                >
                  + Add Issue
                </button>
                {showIssueMenu && (
                  <div
                    style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200, background: '#0d1117', border: '1px solid #2d3748', borderRadius: 10, padding: '6px 0', minWidth: 210, boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {ISSUE_PRESETS.filter(p => !issues.includes(p)).map(p => (
                      <div
                        key={p}
                        onClick={() => addIssue(p)}
                        style={{ padding: '7px 14px', fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1a2035'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {p}
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #1e2535', margin: '4px 0', padding: '4px 8px' }}>
                      <input
                        value={customIssue}
                        onChange={e => setCustomIssue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && customIssue.trim()) addIssue(customIssue); }}
                        placeholder="Custom issue... (Enter)"
                        autoFocus
                        style={{ width: '100%', background: 'transparent', border: 'none', color: '#f1f5f9', fontSize: 12, padding: '4px 6px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          {recentActivity.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {recentActivity.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                    <span style={{ color: '#374151', flexShrink: 0 }}>{ACTIVITY_ICONS[entry.type] || '·'}</span>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ color: '#64748b' }}>{new Date(entry.timestamp).toLocaleDateString()} </span>
                      <span style={{ color: '#475569' }}>{entry.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Save & Close ── */}
          <button
            onClick={save}
            style={{
              width: '100%', padding: '12px 0',
              background: 'linear-gradient(135deg, #1d3461, #1a2d4a)',
              border: '1px solid rgba(59,130,246,0.25)', borderRadius: 9,
              color: '#93c5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline Tab (Kanban) ─────────────────────────────────────────────────────
function PipelineTab({ leads, onSelectLead, onAddLead, onEditLead, onDeleteLead, demoMode, onStageChange, onUpdateLead, currentUser, rolePerms }) {
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [dragOver, setDragOver] = useState(null);
  const [quickEditLead, setQuickEditLead] = useState(null);
  const showToast = useToast();
  const isMobile = useMobile();

  const KANBAN_STAGES = [
    { key: 'lead', label: 'Lead' },
    { key: 'inspection_scheduled', label: 'Insp Scheduled' },
    { key: 'inspection_complete', label: 'Insp Complete' },
    { key: 'estimate_sent', label: 'Estimate Sent' },
    { key: 'contract_signed', label: 'Contract Signed' },
    { key: 'materials_ordered', label: 'Materials Ordered' },
    { key: 'scheduled_for_install', label: 'Sched for Install' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'punch_list', label: 'Punch List' },
    { key: 'completed', label: 'Completed' },
    { key: 'invoiced', label: 'Invoiced' },
    { key: 'paid', label: 'Paid' },
  ];

  const today = new Date(TODAY);
  const staleDays = (lead) => {
    if (!lead.lastContact) return 0;
    return Math.round((today - new Date(lead.lastContact)) / 86400000);
  };

  const urgencyBorder = (lead) => {
    const d = staleDays(lead);
    if (d > 14) return '2px solid #ef4444';
    if (d > 7) return '2px solid #eab308';
    return '1px solid #253048';
  };

  const filteredLeads = useMemo(() => {
    let r = leads.filter(l => l.stage !== 'lost');
    if (tradeFilter !== 'all') r = r.filter(l => l.trade === tradeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(l =>
        l.name.toLowerCase().includes(q) ||
        (l.contact && l.contact.toLowerCase().includes(q)) ||
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.trade && l.trade.toLowerCase().includes(q))
      );
    }
    return r;
  }, [leads, tradeFilter, search]);

  const byStage = useMemo(() => {
    const map = {};
    KANBAN_STAGES.forEach(s => { map[s.key] = filteredLeads.filter(l => l.stage === s.key); });
    return map;
  }, [filteredLeads]); // eslint-disable-line react-hooks/exhaustive-deps

  const stageStats = KANBAN_STAGES.map(s => ({
    ...s,
    count: (byStage[s.key] || []).length,
    value: (byStage[s.key] || []).reduce((sum, l) => sum + l.value, 0),
  }));

  const totalPipeline = filteredLeads.reduce((s, l) => s + l.value, 0);

  const handleDrop = (e, stage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId || !onStageChange) { setDragOver(null); return; }
    const lead = leads.find(l => String(l.id) === leadId);
    if (lead && lead.stage !== stage) {
      onStageChange(leadId, stage);
      // Also add activity log entry via onUpdateLead if available
      if (onUpdateLead) {
        const entry = { timestamp: new Date().toISOString(), type: 'stage', message: `Stage changed from ${STAGE_LABELS[lead.stage] || lead.stage} to ${STAGE_LABELS[stage] || stage}`, user: currentUser || 'You' };
        onUpdateLead({ ...lead, stage, activityLog: [...(lead.activityLog || []), entry] });
      }
      showToast(`"${lead.name}" → ${STAGE_LABELS[stage]}`);
    }
    setDragOver(null);
  };

  return (
    <div>
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 14, background: '#161b27', border: '1px solid #253048', borderRadius: 10, overflow: 'hidden', overflowX: 'auto' }}>
        {stageStats.map((s, i) => (
          <div key={s.key} style={{ flex: '1 1 0', minWidth: 90, padding: '10px 8px', borderRight: i < stageStats.length - 1 ? '1px solid #1e2535' : 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: STAGE_COLORS[s.key] || '#f97316' }}>{s.count}</div>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
            {s.value > 0 && rolePerms?.seeDollars !== false && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{fmt(s.value)}</div>}
          </div>
        ))}
        <div style={{ flex: '1 1 0', minWidth: 90, padding: '10px 8px', textAlign: 'center', background: 'rgba(249,115,22,0.04)' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f97316' }}>{rolePerms?.seeDollars !== false ? fmt(totalPipeline) : '—'}</div>
          <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Pipeline</div>
        </div>
      </div>

      {/* Search + trade filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <input
          placeholder="Search client, address, job type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...FI, flex: '1 1 200px', padding: '8px 12px', fontSize: 13 }}
        />
        <select
          value={tradeFilter}
          onChange={e => setTradeFilter(e.target.value)}
          style={{ ...FI, flex: '0 0 auto', padding: '8px 12px', fontSize: 13 }}
        >
          <option value="all">All Job Types</option>
          {TRADE_LIST.filter(t => leads.some(l => l.trade === t)).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {(onAddLead || demoMode) && (
          <DisabledTooltip active={demoMode} label="Sign up to add leads">
            <button
              style={{
                padding: '8px 16px',
                background: demoMode ? 'transparent' : 'linear-gradient(135deg, #f97316, #e8640c)',
                border: demoMode ? '1px solid #2e3d5c' : 'none', borderRadius: 7,
                color: demoMode ? '#3d4f63' : '#fff', fontWeight: 700, fontSize: 13,
                cursor: demoMode ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                boxShadow: demoMode ? 'none' : '0 2px 10px rgba(249,115,22,0.3)',
              }}
              onClick={demoMode ? undefined : onAddLead}
            >
              + Add Lead
            </button>
          </DisabledTooltip>
        )}
      </div>

      {/* Kanban board */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, WebkitOverflowScrolling: 'touch', alignItems: 'flex-start' }}>
        {KANBAN_STAGES.map(stg => {
          const cards = byStage[stg.key] || [];
          const colValue = cards.reduce((s, l) => s + l.value, 0);
          const isOver = dragOver === stg.key;

          return (
            <div
              key={stg.key}
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(stg.key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, stg.key)}
              style={{
                minWidth: isMobile ? 230 : 220,
                flex: isMobile ? '0 0 230px' : '1 1 0',
                background: isOver ? 'rgba(249,115,22,0.06)' : '#131a28',
                border: `1px solid ${isOver ? '#f97316' : '#253048'}`,
                borderRadius: 10,
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {/* Column header */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e2535', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: STAGE_COLORS[stg.key] || '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stg.label}</span>
                  <span style={{ fontSize: 11, color: '#475569', marginLeft: 6 }}>{cards.length}</span>
                  {colValue > 0 && rolePerms?.seeDollars !== false && <div style={{ fontSize: 10, color: '#374151' }}>{fmt(colValue)}</div>}
                </div>
                {stg.key === 'lead' && (onAddLead || demoMode) && (
                  <DisabledTooltip active={demoMode} label="Sign up to add leads">
                    <button
                      style={{
                        padding: '3px 8px',
                        background: demoMode ? 'transparent' : 'linear-gradient(135deg, #f97316, #e8640c)',
                        border: demoMode ? '1px solid #2e3d5c' : 'none', borderRadius: 5,
                        color: demoMode ? '#3d4f63' : '#fff', fontWeight: 700, fontSize: 10,
                        cursor: demoMode ? 'not-allowed' : 'pointer', flexShrink: 0,
                      }}
                      onClick={demoMode ? undefined : onAddLead}
                    >
                      + New
                    </button>
                  </DisabledTooltip>
                )}
              </div>

              {/* Cards */}
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                {cards.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 8px', color: '#2d3748', fontSize: 11 }}>
                    Drop here
                  </div>
                ) : cards.map(lead => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    urgencyBorder={urgencyBorder(lead)}
                    staleDays={staleDays(lead)}
                    onQuickEdit={setQuickEditLead}
                    onEdit={onEditLead}
                    onDelete={onDeleteLead}
                    demoMode={demoMode}
                    rolePerms={rolePerms}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Edit Modal */}
      {quickEditLead && (
        <CardQuickEdit
          lead={quickEditLead}
          onClose={() => setQuickEditLead(null)}
          onUpdate={(updated) => {
            if (onUpdateLead) onUpdateLead(updated);
            // keep quickEditLead in sync so the panel reflects immediate changes
            setQuickEditLead(updated);
          }}
          onOpenDetail={onSelectLead ? () => { setQuickEditLead(null); onSelectLead(quickEditLead); } : null}
          currentUser={currentUser}
          rolePerms={rolePerms}
        />
      )}
    </div>
  );
}

// ─── Callbacks Tab ────────────────────────────────────────────────────────────
function CallbacksTab({ leads, onSelectLead, onUpdateLead, rolePerms }) {
  const [hovered, setHovered] = useState(null);
  const [snoozeModal, setSnoozeModal] = useState(null);
  const [snoozeDate, setSnoozeDate] = useState('');
  const showToast = useToast();

  const withCallbacks = leads
    .filter(l => l.callbackDate && l.status !== 'won' && l.status !== 'lost')
    .sort((a, b) => new Date(a.callbackDate) - new Date(b.callbackDate));

  const overdue = withCallbacks.filter(l => diffDays(l.callbackDate) < 0);
  const today = withCallbacks.filter(l => diffDays(l.callbackDate) === 0);
  const upcoming = withCallbacks.filter(l => diffDays(l.callbackDate) > 0);

  const handleMarkCalled = (lead, e) => {
    e.stopPropagation();
    if (!onUpdateLead) return;
    onUpdateLead({ ...lead, lastContact: TODAY, callbackDate: null });
    showToast(`Marked "${lead.name}" as called`);
  };

  const handleSnooze = (lead, e) => {
    e.stopPropagation();
    if (!onUpdateLead) return;
    const tomorrow = new Date(TODAY);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    setSnoozeDate(tomorrowStr);
    setSnoozeModal(lead);
  };

  const confirmSnooze = () => {
    if (!snoozeModal || !snoozeDate) return;
    onUpdateLead({ ...snoozeModal, callbackDate: snoozeDate });
    showToast(`Snoozed "${snoozeModal.name}" to ${snoozeDate}`);
    setSnoozeModal(null);
  };

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
          const isOverdue = days < 0;
          return (
            <div
              key={lead.id}
              style={{ ...S.cbRow(hovered === lead.id), border: isOverdue ? '1px solid rgba(239,68,68,0.25)' : '1px solid #1e2535' }}
              onMouseEnter={() => setHovered(lead.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectLead(lead)}
            >
              <div style={S.cbDate(isOverdue)}>
                {days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `in ${days}d`}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cbName}>{lead.name}</div>
                <div style={S.cbContact}>
                  {lead.contact} · {STAGE_LABELS[lead.stage] || lead.stage}
                  {lead.phone && <span style={{ marginLeft: 8, color: '#94a3b8' }}>{lead.phone}</span>}
                </div>
                {lead.stallReason && (
                  <div style={{ fontSize: 11, color: '#f97316', marginTop: 3 }}>⚠ {STALL_LABELS[lead.stallReason]}</div>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={S.cbValue}>{rolePerms?.seeDollars !== false ? fmt(lead.value) : '—'}</div>
                <div style={{ fontSize: 11, color: '#374151', marginBottom: 6 }}>{lead.callbackDate}</div>
                {onUpdateLead && (
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button
                      style={{ padding: '5px 10px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 5, color: '#4ade80', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
                      onClick={e => handleMarkCalled(lead, e)}
                    >
                      ✓ Called
                    </button>
                    <button
                      style={{ padding: '5px 10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 5, color: '#a5b4fc', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
                      onClick={e => handleSnooze(lead, e)}
                    >
                      Snooze
                    </button>
                  </div>
                )}
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
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>📞</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>No callbacks scheduled</div>
          <div style={{ fontSize: 13, color: '#475569', maxWidth: 320, margin: '0 auto' }}>Jobs with follow-up reminders will appear here. Set a callback date when editing a lead.</div>
        </div>
      )}

      {/* Snooze modal */}
      {snoozeModal && (
        <div style={S.modalOverlay} onClick={() => setSnoozeModal(null)}>
          <div style={{ ...S.modal, maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <button style={S.closeBtn} onClick={() => setSnoozeModal(null)}>×</button>
            <div style={{ ...S.modalTitle, paddingRight: 48 }}>Snooze Callback</div>
            <div style={{ ...S.modalSub }}>{snoozeModal.name}</div>
            <label style={FLbl}>New Callback Date</label>
            <input type="date" style={{ ...FI, marginBottom: 20 }} value={snoozeDate} onChange={e => setSnoozeDate(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="ri-btn ri-btn-secondary" style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 7, color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSnoozeModal(null)}>Cancel</button>
              <button style={{ flex: 2, padding: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={confirmSnooze}>Set Snooze Date</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ leads, tier, rolePerms }) {
  const isMobile = useMobile();
  const active = leads.filter(l => ['active', 'stalled', 'cold'].includes(l.status));
  const stalled = leads.filter(l => l.status === 'stalled');
  const won = leads.filter(l => l.status === 'won');
  const lost = leads.filter(l => l.status === 'lost');

  const totalPipeline = active.reduce((s, l) => s + l.value, 0);
  const stalledValue = stalled.reduce((s, l) => s + l.value, 0);
  const wonValue = won.reduce((s, l) => s + l.value, 0);

  const closedDeals = leads.filter(l => ['won', 'lost'].includes(l.status));
  const winRate = closedDeals.length ? Math.round(won.length / closedDeals.length * 100) : 0;

  const avgDealAge = active.length
    ? Math.round(active.reduce((s, l) => s + l.dealAge, 0) / active.length) : 0;

  const avgJobValue = closedDeals.length
    ? Math.round(closedDeals.reduce((s, l) => s + l.value, 0) / closedDeals.length) : 0;

  const stallBreakdown = Object.entries(
    stalled.reduce((acc, l) => {
      if (l.stallReason) acc[l.stallReason] = (acc[l.stallReason] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const stageFunnel = STAGE_ORDER.map(stage => ({
    stage,
    count: leads.filter(l => l.stage === stage).length,
    value: leads.filter(l => l.stage === stage).reduce((s, l) => s + l.value, 0),
    avgAge: (() => {
      const stageLeads = active.filter(l => l.stage === stage);
      return stageLeads.length ? Math.round(stageLeads.reduce((s, l) => s + l.dealAge, 0) / stageLeads.length) : 0;
    })(),
  })).filter(s => s.count > 0);

  const maxStageValue = Math.max(...stageFunnel.map(s => s.value), 1);
  const maxStallCount = Math.max(...stallBreakdown.map(s => s[1]), 1);

  const STAGE_CHART_COLORS = { lead: '#64748b', inspection: '#3b82f6', estimate: '#f59e0b', approved: '#10b981', in_progress: '#f97316', completed: '#22c55e' };
  const STALL_COLORS = {
    price_objection: '#f97316', budget_freeze: '#6366f1', no_response: '#ef4444',
    competitor: '#f59e0b', timing: '#64748b', wrong_contact: '#8b5cf6', technical_fit: '#06b6d4',
  };

  const D = rolePerms?.seeDollars !== false;
  const kpis = [
    { val: D ? fmt(totalPipeline) : '—', label: 'Active Pipeline', color: '#f97316' },
    { val: D ? fmt(stalledValue) : '—', label: 'Value at Risk', color: '#ef4444' },
    { val: D ? fmt(wonValue) : '—', label: 'Won This Period', color: '#22c55e' },
    { val: `${winRate}%`, label: 'Win / Close Rate', color: winRate >= 60 ? '#22c55e' : winRate >= 40 ? '#f97316' : '#ef4444' },
    { val: `${avgDealAge}d`, label: 'Avg Deal Age', color: '#94a3b8' },
    { val: D ? fmt(avgJobValue) : '—', label: 'Avg Job Value', color: '#6366f1' },
    { val: stalled.length, label: 'Stalled Deals', color: '#f59e0b' },
    { val: `${lost.length}`, label: 'Lost Deals', color: '#475569' },
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 10 : 14,
        marginBottom: 24,
      }}>
        {kpis.map(({ val, label, color }) => (
          <div key={label} style={{ ...S.statCard, ...(isMobile ? { padding: 12 } : {}) }}>
            <div style={{ ...S.statVal, ...(isMobile ? { fontSize: 20 } : {}), color }}>{val}</div>
            <div style={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.chartSection, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
        {/* Revenue pipeline by stage */}
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Revenue by Stage</div>
          {stageFunnel.length === 0 ? (
            <div style={{ color: '#475569', fontSize: 13 }}>No active leads</div>
          ) : stageFunnel.map(({ stage, count, value, avgAge }) => (
            <div key={stage} style={S.barRow}>
              <div style={{ ...S.barLabel, width: 110 }}>{STAGE_LABELS[stage] || stage}</div>
              <div style={S.barTrack}>
                <div style={S.barFill(value / maxStageValue * 100, STAGE_CHART_COLORS[stage] || '#f97316')} />
              </div>
              <div style={{ fontSize: 11, color: '#64748b', width: 24, textAlign: 'right' }}>{count}</div>
              <div style={{ fontSize: 11, color: '#475569', width: 72, textAlign: 'right' }}>{D ? fmt(value) : '—'}</div>
              {avgAge > 0 && <div style={{ fontSize: 10, color: '#374151', width: 36, textAlign: 'right' }}>{avgAge}d</div>}
            </div>
          ))}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1e2535' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Total pipeline value</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f97316', marginTop: 4 }}>{D ? fmt(totalPipeline) : '—'}</div>
          </div>
        </div>

        {/* Stall reason breakdown */}
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

        {/* Win/Loss funnel */}
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Win / Loss Analysis</div>
          {[
            { label: 'Total Leads', count: leads.length, color: '#64748b' },
            { label: 'Active', count: active.length, color: '#3b82f6' },
            { label: 'Won', count: won.length, color: '#22c55e' },
            { label: 'Lost', count: lost.length, color: '#ef4444' },
            { label: 'Stalled', count: stalled.length, color: '#f59e0b' },
          ].map(({ label, count, color }) => (
            <div key={label} style={S.barRow}>
              <div style={{ ...S.barLabel, width: 80 }}>{label}</div>
              <div style={S.barTrack}>
                <div style={S.barFill(leads.length > 0 ? count / leads.length * 100 : 0, color)} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color, width: 28, textAlign: 'right' }}>{count}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1e2535' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Win Rate</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: winRate >= 60 ? '#22c55e' : '#f97316' }}>{winRate}%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Avg Job Value</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>{fmt(avgJobValue)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trade distribution */}
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Pipeline by Job Type</div>
          {(() => {
            const tradeCounts = leads.reduce((acc, l) => {
              if (!['won', 'lost'].includes(l.status)) {
                if (!acc[l.trade]) acc[l.trade] = { count: 0, value: 0 };
                acc[l.trade].count++;
                acc[l.trade].value += l.value;
              }
              return acc;
            }, {});
            const sorted = Object.entries(tradeCounts).sort((a, b) => b[1].value - a[1].value).slice(0, 7);
            const maxVal = Math.max(...sorted.map(s => s[1].value), 1);
            return sorted.map(([trade, data]) => (
              <div key={trade} style={S.barRow}>
                <div style={{ ...S.barLabel, width: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade}</div>
                <div style={S.barTrack}>
                  <div style={S.barFill(data.value / maxVal * 100, TRADE_COLORS[trade] || '#f97316')} />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', width: 24, textAlign: 'right' }}>{data.count}</div>
                <div style={{ fontSize: 11, color: '#475569', width: 72, textAlign: 'right' }}>{fmt(data.value)}</div>
              </div>
            ));
          })()}
        </div>
      </div>

      {tier !== undefined && (
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <DisabledTooltip active={tier !== 'business'} label={tier === 'business' ? '' : 'Export — Business feature.'}>
            <button
              onClick={() => tier === 'business' && void 0}
              style={{
                padding: '8px 20px',
                background: tier === 'business' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#1a1f2e',
                border: tier === 'business' ? 'none' : '1px solid #2d3748',
                borderRadius: 7, color: tier === 'business' ? '#fff' : '#475569',
                fontWeight: 600, fontSize: 13, cursor: tier === 'business' ? 'pointer' : 'not-allowed',
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

// ─── Cost Manager ─────────────────────────────────────────────────────────────
const CP_UNITS = ['EA', 'SQ', 'BDL', 'LF', 'SF', 'FT', 'PC', 'GAL', 'BOX', 'ROLL', 'HR', 'CY', 'TON', 'LB', 'SY', 'PK', 'FLAT', 'LOAD'];
const CP_TPL_KEY = 'cl_costmgr_tpls';

const CP_DEF_MATS = [
  { id: 'ms1', title: 'Shingles & Roofing', items: [
    { id: 'ma1', item: '3-Tab Shingles', description: '', unit: 'BDL' },
    { id: 'ma2', item: 'Architectural Shingles', description: '', unit: 'BDL' },
    { id: 'ma3', item: 'Premium/Designer Shingles', description: '', unit: 'BDL' },
    { id: 'ma4', item: 'Ridge Cap Shingles', description: '', unit: 'BDL' },
    { id: 'ma5', item: 'Starter Strip', description: '', unit: 'LF' },
    { id: 'ma6', item: 'Hip & Ridge', description: '', unit: 'LF' },
  ]},
  { id: 'ms2', title: 'Underlayment & Barriers', items: [
    { id: 'mb1', item: 'Synthetic Underlayment', description: '', unit: 'ROLL' },
    { id: 'mb2', item: 'Felt Paper 15#', description: '', unit: 'ROLL' },
    { id: 'mb3', item: 'Felt Paper 30#', description: '', unit: 'ROLL' },
    { id: 'mb4', item: 'Ice & Water Shield', description: '', unit: 'ROLL' },
  ]},
  { id: 'ms3', title: 'Flashing & Metal', items: [
    { id: 'mc1', item: 'Drip Edge', description: '', unit: 'LF' },
    { id: 'mc2', item: 'Step Flashing', description: '', unit: 'EA' },
    { id: 'mc3', item: 'Valley Metal', description: '', unit: 'LF' },
    { id: 'mc4', item: 'Counter Flashing', description: '', unit: 'LF' },
    { id: 'mc5', item: 'Pipe Boot/Jack', description: '', unit: 'EA' },
    { id: 'mc6', item: 'Small Chimney Flashing', description: '', unit: 'EA' },
    { id: 'mc7', item: 'Large Chimney Flashing', description: '', unit: 'EA' },
    { id: 'mc8', item: 'Skylight Flashing', description: '', unit: 'EA' },
    { id: 'mc9', item: 'Wall Flashing', description: '', unit: 'LF' },
  ]},
  { id: 'ms4', title: 'Decking & Structural', items: [
    { id: 'md1', item: 'Plywood 4x8 Sheet', description: '', unit: 'PC' },
    { id: 'md2', item: 'OSB 4x8 Sheet', description: '', unit: 'PC' },
    { id: 'md3', item: 'Boards/Lumber', description: '', unit: 'FT' },
    { id: 'md4', item: '2x4 Lumber', description: '', unit: 'FT' },
    { id: 'md5', item: '2x6 Lumber', description: '', unit: 'FT' },
  ]},
  { id: 'ms5', title: 'Ventilation', items: [
    { id: 'me1', item: 'Ridge Vent', description: '', unit: 'LF' },
    { id: 'me2', item: 'Box Vent', description: '', unit: 'EA' },
    { id: 'me3', item: 'Soffit Vent', description: '', unit: 'EA' },
    { id: 'me4', item: 'Power Vent', description: '', unit: 'EA' },
    { id: 'me5', item: 'Turbine Vent', description: '', unit: 'EA' },
  ]},
  { id: 'ms6', title: 'Gutters & Drainage', items: [
    { id: 'mf1', item: 'Gutter 5"', description: '', unit: 'LF' },
    { id: 'mf2', item: 'Gutter 6"', description: '', unit: 'LF' },
    { id: 'mf3', item: 'Downspout', description: '', unit: 'LF' },
    { id: 'mf4', item: 'Gutter Guard', description: '', unit: 'LF' },
    { id: 'mf5', item: 'End Cap', description: '', unit: 'EA' },
    { id: 'mf6', item: 'Elbow', description: '', unit: 'EA' },
  ]},
  { id: 'ms7', title: 'Sealants & Fasteners', items: [
    { id: 'mg1', item: 'Roofing Nails', description: '', unit: 'BOX' },
    { id: 'mg2', item: 'Coil Nails', description: '', unit: 'BOX' },
    { id: 'mg3', item: 'Roofing Cement/Tar', description: '', unit: 'GAL' },
    { id: 'mg4', item: 'Caulk/Sealant', description: '', unit: 'EA' },
  ]},
  { id: 'ms8', title: 'Miscellaneous', items: [
    { id: 'mh1', item: 'Dumpster/Disposal', description: '', unit: 'EA' },
    { id: 'mh2', item: 'Tarps/Protection', description: '', unit: 'EA' },
  ]},
];

const CP_DEF_LABOR = [
  { id: 'ls1', title: 'Shingle Installation by Slope', isWaste: false, items: [
    { id: 'la1', label: 'Standard Slope (4/12\u20137/12)', unit: 'SQ' },
    { id: 'la2', label: 'Steep Slope (8/12\u20139/12)', unit: 'SQ' },
    { id: 'la3', label: 'Very Steep (10/12\u201311/12)', unit: 'SQ' },
    { id: 'la4', label: 'Extreme (12/12)', unit: 'SQ' },
    { id: 'la5', label: 'Extreme+ (13/12+)', unit: 'SQ' },
    { id: 'la6', label: 'Second Layer Add-on', unit: 'SQ' },
    { id: 'la7', label: 'Harness Required Add-on', unit: 'SQ' },
  ]},
  { id: 'ls2', title: 'Tear-Off', isWaste: false, items: [
    { id: 'lb1', label: 'Tear-off Single Layer', unit: 'SQ' },
    { id: 'lb2', label: 'Tear-off Double Layer', unit: 'SQ' },
    { id: 'lb3', label: 'Tear-off Flat/Built-up', unit: 'SQ' },
  ]},
  { id: 'ls3', title: 'Additional Labor', isWaste: false, items: [
    { id: 'lc1', label: 'Flashing Work', unit: 'HR' },
    { id: 'lc2', label: 'Chimney Flashing', unit: 'EA' },
    { id: 'lc3', label: 'Skylight Install', unit: 'EA' },
    { id: 'lc4', label: 'Skylight Reflashing', unit: 'EA' },
    { id: 'lc5', label: 'Gutter Install', unit: 'LF' },
    { id: 'lc6', label: 'Gutter Repair', unit: 'LF' },
    { id: 'lc7', label: 'Fascia Repair/Replace', unit: 'LF' },
    { id: 'lc8', label: 'Soffit Repair/Replace', unit: 'SF' },
    { id: 'lc9', label: 'Decking Repair', unit: 'PC' },
    { id: 'lc10', label: 'EPDM/Flat Roof', unit: 'SF' },
  ]},
  { id: 'ls4', title: 'Waste Tracking', isWaste: true, items: [
    { id: 'lw1', label: 'Shingles Ordered', unit: 'BDL', note: '' },
    { id: 'lw2', label: 'Additional Shingles Purchased', unit: 'BDL', note: 'Extra bundles bought to finish' },
    { id: 'lw3', label: 'Leftover Shingles', unit: 'BDL', note: 'Unused bundles' },
  ]},
];

const CP_TRADE_TEMPLATES = {
  'Full Replacement': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Repair': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Inspection': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Storm Damage': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Gutter Install': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Skylight': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Flashing Repair': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Ventilation': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
  'Emergency Tarp': { materials: CP_DEF_MATS, labor: CP_DEF_LABOR },
};

function cpNewMakeInit(job, crewNames) {
  const tradeName = (job.trade && CP_TRADE_TEMPLATES[job.trade]) ? job.trade : 'Full Replacement';
  const tpl = CP_TRADE_TEMPLATES[tradeName];
  return {
    jobInfo: {
      contractPrice: job.value ? String(job.value) : '',
      overhead: '15',
      tax: '0',
      subContractorName: crewNames,
      notes: '',
      templateName: tradeName,
    },
    materials: {
      sections: tpl.materials.map(sec => ({
        ...sec,
        collapsed: false,
        items: sec.items.map(item => ({ ...item, qty: '', costPerUnit: '' })),
      })),
    },
    labor: {
      sections: tpl.labor.map(sec => ({
        ...sec,
        collapsed: false,
        items: sec.items.map(item => ({ ...item, qty: '', rate: '' })),
      })),
    },
    signOff: {
      inspectionPass: '',
      subName: crewNames,
      supervisor: '',
      dateCompleted: '',
      notes: '',
      submitted: false,
    },
  };
}

function CostManagerPanel({ job, crew, assignments, rolePerms }) {
  const cpKey = `cl_crewpay_${job.id}`;
  const assignedIds = assignments[String(job.id)] || [];
  const assignedCrew = (crew || []).filter(m => assignedIds.includes(m.id));

  const [subTab, setSubTab] = useState('materials');
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(cpKey);
      if (s) {
        const parsed = JSON.parse(s);
        if (
          parsed &&
          parsed.materials && Array.isArray(parsed.materials.sections) &&
          parsed.labor && Array.isArray(parsed.labor.sections) &&
          parsed.jobInfo && parsed.signOff
        ) return parsed;
      }
    } catch (e) { /* ignore */ }
    return cpNewMakeInit(job, assignedCrew.map(m => m.name).join(', '));
  });
  const [jobTpls, setJobTpls] = useState(() => {
    try { const s = localStorage.getItem(CP_TPL_KEY); return s ? JSON.parse(s) : []; } catch (e) { return []; }
  });
  const [showTplSave, setShowTplSave] = useState(false);
  const [tplName, setTplName] = useState('');
  const [pendingTpl, setPendingTpl] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(cpKey, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }, [data, cpKey]);

  useEffect(() => {
    try { localStorage.setItem(CP_TPL_KEY, JSON.stringify(jobTpls)); } catch (e) { /* ignore */ }
  }, [jobTpls]);

  // ── material handlers ───────────────────────────────────────────────────────
  const updMat = (secId, itemId, field, val) => setData(d => ({
    ...d,
    materials: {
      ...d.materials,
      sections: d.materials.sections.map(sec =>
        sec.id !== secId ? sec : {
          ...sec,
          items: sec.items.map(item => item.id !== itemId ? item : { ...item, [field]: val }),
        }
      ),
    },
  }));

  const addMatItem = (secId) => setData(d => ({
    ...d,
    materials: {
      ...d.materials,
      sections: d.materials.sections.map(sec =>
        sec.id !== secId ? sec : {
          ...sec,
          items: [...sec.items, { id: `mi${Date.now()}`, item: '', description: '', unit: 'EA', qty: '', costPerUnit: '' }],
        }
      ),
    },
  }));

  const removeMatItem = (secId, itemId) => setData(d => ({
    ...d,
    materials: {
      ...d.materials,
      sections: d.materials.sections.map(sec =>
        sec.id !== secId ? sec : { ...sec, items: sec.items.filter(item => item.id !== itemId) }
      ),
    },
  }));

  const toggleMatSec = (secId) => setData(d => ({
    ...d,
    materials: {
      ...d.materials,
      sections: d.materials.sections.map(sec =>
        sec.id !== secId ? sec : { ...sec, collapsed: !sec.collapsed }
      ),
    },
  }));

  const updMatSecTitle = (secId, val) => setData(d => ({
    ...d,
    materials: {
      ...d.materials,
      sections: d.materials.sections.map(sec =>
        sec.id !== secId ? sec : { ...sec, title: val }
      ),
    },
  }));

  const addMatSec = () => setData(d => ({
    ...d,
    materials: {
      ...d.materials,
      sections: [...d.materials.sections, {
        id: `msc${Date.now()}`,
        title: 'New Section',
        collapsed: false,
        items: [],
      }],
    },
  }));

  // ── labor handlers ──────────────────────────────────────────────────────────
  const updLabor = (secId, itemId, field, val) => setData(d => ({
    ...d,
    labor: {
      ...d.labor,
      sections: d.labor.sections.map(sec =>
        sec.id !== secId ? sec : {
          ...sec,
          items: sec.items.map(item => item.id !== itemId ? item : { ...item, [field]: val }),
        }
      ),
    },
  }));

  const addLaborItem = (secId) => setData(d => ({
    ...d,
    labor: {
      ...d.labor,
      sections: d.labor.sections.map(sec =>
        sec.id !== secId ? sec : {
          ...sec,
          items: [...sec.items, { id: `li${Date.now()}`, label: '', unit: 'EA', qty: '', rate: '' }],
        }
      ),
    },
  }));

  const removeLaborItem = (secId, itemId) => setData(d => ({
    ...d,
    labor: {
      ...d.labor,
      sections: d.labor.sections.map(sec =>
        sec.id !== secId ? sec : { ...sec, items: sec.items.filter(item => item.id !== itemId) }
      ),
    },
  }));

  const toggleLaborSec = (secId) => setData(d => ({
    ...d,
    labor: {
      ...d.labor,
      sections: d.labor.sections.map(sec =>
        sec.id !== secId ? sec : { ...sec, collapsed: !sec.collapsed }
      ),
    },
  }));

  const updLaborSecTitle = (secId, val) => setData(d => ({
    ...d,
    labor: {
      ...d.labor,
      sections: d.labor.sections.map(sec =>
        sec.id !== secId ? sec : { ...sec, title: val }
      ),
    },
  }));

  const addLaborSec = () => setData(d => ({
    ...d,
    labor: {
      ...d.labor,
      sections: [...d.labor.sections, {
        id: `lsc${Date.now()}`,
        title: 'New Section',
        isWaste: false,
        collapsed: false,
        items: [],
      }],
    },
  }));

  const updInfo = (field, val) => setData(d => ({ ...d, jobInfo: { ...d.jobInfo, [field]: val } }));
  const updSignOff = (field, val) => setData(d => ({ ...d, signOff: { ...d.signOff, [field]: val } }));

  // ── template handlers ───────────────────────────────────────────────────────
  const saveJobTpl = () => {
    if (!tplName.trim()) return;
    const materials = data.materials.sections.map(sec => ({
      ...sec, items: sec.items.map(item => { const c = { ...item }; delete c.qty; delete c.costPerUnit; return c; }),
    }));
    const labor = data.labor.sections.map(sec => ({
      ...sec, items: sec.items.map(item => { const c = { ...item }; delete c.qty; delete c.rate; return c; }),
    }));
    setJobTpls(prev => [...prev.filter(t => t.name !== tplName.trim()), { name: tplName.trim(), materials, labor }]);
    setTplName('');
    setShowTplSave(false);
  };

  const applyTpl = (name) => {
    const builtIn = CP_TRADE_TEMPLATES[name];
    const custom = jobTpls.find(t => t.name === name);
    if (!builtIn && !custom) return;
    const matSecs = builtIn ? builtIn.materials : custom.materials;
    const labSecs = builtIn ? builtIn.labor : custom.labor;
    setData(d => ({
      ...d,
      jobInfo: { ...d.jobInfo, templateName: name },
      materials: { sections: matSecs.map(sec => ({ ...sec, collapsed: false, items: sec.items.map(item => ({ ...item, qty: '', costPerUnit: '' })) })) },
      labor: { sections: labSecs.map(sec => ({ ...sec, collapsed: false, items: sec.items.map(item => ({ ...item, qty: '', rate: '' })) })) },
    }));
    setPendingTpl(null);
  };

  // ── calculations ────────────────────────────────────────────────────────────
  const matItemTot = (item) => (parseFloat(item.qty) || 0) * (parseFloat(item.costPerUnit) || 0);
  const matSecTot = (sec) => sec.items.reduce((s, item) => s + matItemTot(item), 0);
  const matTotal = data.materials.sections.reduce((s, sec) => s + matSecTot(sec), 0);

  const laborItemTot = (item) => (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
  const laborSecTot = (sec) => sec.isWaste ? 0 : sec.items.reduce((s, item) => s + laborItemTot(item), 0);
  const laborTotal = data.labor.sections.reduce((s, sec) => s + laborSecTot(sec), 0);

  const subtotal = matTotal + laborTotal;
  const overheadPct = parseFloat(data.jobInfo.overhead) || 0;
  const taxPct = parseFloat(data.jobInfo.tax) || 0;
  const overheadAmt = subtotal * overheadPct / 100;
  const taxAmt = (subtotal + overheadAmt) * taxPct / 100;
  const totalJobCost = subtotal + overheadAmt + taxAmt;

  const contractPrice = parseFloat(data.jobInfo.contractPrice) || 0;
  const grossProfit = contractPrice - totalJobCost;
  const profitMargin = contractPrice > 0 ? (grossProfit / contractPrice * 100) : 0;

  const wasteSection = data.labor.sections.find(s => s.isWaste);
  const wasteOrdered = parseFloat((wasteSection && wasteSection.items[0] && wasteSection.items[0].qty) || 0);
  const wasteExtra = parseFloat((wasteSection && wasteSection.items[1] && wasteSection.items[1].qty) || 0);
  const wasteLeftover = parseFloat((wasteSection && wasteSection.items[2] && wasteSection.items[2].qty) || 0);
  const netWaste = wasteOrdered + wasteExtra - wasteLeftover;

  const installSec = data.labor.sections.find(s => s.title === 'Shingle Installation by Slope');
  const totalSq = installSec ? installSec.items.reduce((s, item) => s + (parseFloat(item.qty) || 0), 0) : 0;
  const costPerSq = totalSq > 0 ? totalJobCost / totalSq : 0;
  const revenuePerSq = totalSq > 0 ? contractPrice / totalSq : 0;
  const profitPerSq = totalSq > 0 ? grossProfit / totalSq : 0;

  const fmtC = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const profitColor = profitMargin >= 20 ? '#22c55e' : profitMargin >= 10 ? '#f59e0b' : '#ef4444';

  const isMobile = useMobile();

  // ── shared cell styles ───────────────────────────────────────────────────────
  const NINP = { background: '#111823', border: '1px solid #2e3d5c', borderRadius: 4, color: '#e2e8f0', fontSize: 13, fontFamily: "'Courier New', monospace", textAlign: 'right', outline: 'none', padding: '4px 6px', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const UINP = { background: '#111823', border: '1px solid #2e3d5c', borderRadius: 4, color: '#94a3b8', fontSize: 11, outline: 'none', textAlign: 'center', padding: '4px 2px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' };
  const CHEAD = { fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const seeRates = rolePerms?.seeRates !== false;
  const MAT_COLS = seeRates ? '1fr 44px 58px 72px 72px 20px' : '1fr 44px 58px 20px';
  const LAB_COLS = seeRates ? '1fr 44px 58px 72px 72px 20px' : '1fr 44px 58px 20px';
  const WASTE_COLS = '1fr 44px 64px 20px';

  // ── sub-tab nav ──────────────────────────────────────────────────────────────
  const SUB_TABS = [
    { key: 'materials', label: 'Materials' },
    { key: 'labor', label: 'Labor' },
    ...(seeRates ? [{ key: 'summary', label: 'Summary' }] : []),
    { key: 'signoff', label: 'Sign Off' },
  ];

  // ── materials grid ───────────────────────────────────────────────────────────
  const renderMatSection = (sec) => {
    const secTot = matSecTot(sec);
    const secHdr = (
      <div
        className="ri-sec-hdr"
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1c2640', borderLeft: '3px solid #14b8a6', borderRadius: sec.collapsed ? 6 : '6px 6px 0 0', padding: '9px 10px', cursor: 'pointer', minHeight: 44 }}
        onClick={() => toggleMatSec(sec.id)}
      >
        <span style={{ color: '#14b8a6', fontSize: 10, flexShrink: 0 }}>{sec.collapsed ? '▶' : '▼'}</span>
        <input
          value={sec.title}
          onChange={e => { e.stopPropagation(); updMatSecTitle(sec.id, e.target.value); }}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: 11, fontWeight: 700, outline: 'none', fontFamily: "'Inter', -apple-system, sans-serif", textTransform: 'uppercase', letterSpacing: '0.6px', cursor: 'text' }}
        />
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, color: secTot > 0 ? '#14b8a6' : '#334155', flexShrink: 0 }}>
          {secTot > 0 ? fmtC(secTot) : '—'}
        </span>
      </div>
    );
    if (isMobile) {
      return (
        <div key={sec.id} style={{ marginBottom: 4 }}>
          {secHdr}
          {!sec.collapsed && (
            <div style={{ background: '#0c1020', border: '1px solid #1a2035', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
              {sec.items.map(item => {
                const tot = matItemTot(item);
                const filled = tot > 0;
                return (
                  <div key={item.id} style={{ padding: '8px 10px', borderBottom: '1px solid #0a0e18', background: filled ? 'rgba(249,115,22,0.04)' : 'transparent', borderLeft: filled ? '3px solid rgba(249,115,22,0.4)' : '3px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                      <input value={item.item} onChange={e => updMat(sec.id, item.id, 'item', e.target.value)} placeholder="Item name" style={{ flex: 1, background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: 14, fontWeight: 600, outline: 'none', fontFamily: "'Inter', -apple-system, sans-serif", minHeight: 44, padding: '0 4px' }} />
                      <button onClick={() => removeMatItem(sec.id, item.id)} className="ri-del" style={{ background: 'transparent', border: 'none', color: '#4a5e7a', cursor: 'pointer', fontSize: 20, padding: '0 4px', minHeight: 44, minWidth: 36, flexShrink: 0 }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: seeRates ? '52px 1fr 1fr 1fr' : '52px 1fr', gap: 8, alignItems: 'end' }}>
                      <div>
                        <div style={{ ...CHEAD, marginBottom: 4 }}>Unit</div>
                        <input list="cp_unit_dl" value={item.unit} onChange={e => updMat(sec.id, item.id, 'unit', e.target.value)} style={{ ...UINP, minHeight: 44 }} />
                      </div>
                      <div>
                        <div style={{ ...CHEAD, marginBottom: 4 }}>Qty</div>
                        <input type="text" inputMode="decimal" value={item.qty} onChange={e => updMat(sec.id, item.id, 'qty', e.target.value)} placeholder="0" style={{ ...NINP, minHeight: 44, fontSize: 15 }} />
                      </div>
                      {seeRates && <div>
                        <div style={{ ...CHEAD, marginBottom: 4 }}>$/Unit</div>
                        <input type="text" inputMode="decimal" value={item.costPerUnit} onChange={e => updMat(sec.id, item.id, 'costPerUnit', e.target.value)} placeholder="0.00" style={{ ...NINP, minHeight: 44, fontSize: 15 }} />
                      </div>}
                      {seeRates && <div>
                        <div style={{ ...CHEAD, marginBottom: 4 }}>Total</div>
                        <div style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, color: filled ? '#f97316' : '#334155' }}>{filled ? fmtC(tot) : '—'}</div>
                      </div>}
                    </div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px dashed #1e2535' }}>
                <button onClick={() => addMatItem(sec.id)} style={{ flex: 1, padding: '10px 10px', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 13, textAlign: 'left', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>+ Add Item</button>
                {secTot > 0 && <div style={{ padding: '6px 10px', fontSize: 12, color: '#64748b', fontFamily: "'Courier New', monospace", whiteSpace: 'nowrap' }}>Sub: <strong style={{ color: '#f97316' }}>{fmtC(secTot)}</strong></div>}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div key={sec.id} style={{ marginBottom: 4 }}>
        {secHdr}
        {!sec.collapsed && (
          <div style={{ background: '#0c1020', border: '1px solid #1a2035', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: MAT_COLS, gap: 4, padding: '4px 8px', background: '#111827', borderBottom: '1px solid #1e2535' }}>
              <div style={{ ...CHEAD }}>Item</div>
              <div style={{ ...CHEAD, textAlign: 'center' }}>Unit</div>
              <div style={{ ...CHEAD, textAlign: 'right' }}>Qty</div>
              {seeRates && <div style={{ ...CHEAD, textAlign: 'right' }}>$/Unit</div>}
              {seeRates && <div style={{ ...CHEAD, textAlign: 'right' }}>Total</div>}
              <div />
            </div>
            {sec.items.map(item => {
              const tot = matItemTot(item);
              const filled = tot > 0;
              return (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: MAT_COLS, gap: 4, alignItems: 'center', padding: '3px 8px', borderBottom: '1px solid #0a0e18', background: filled ? 'rgba(249,115,22,0.03)' : 'transparent', borderLeft: filled ? '2px solid rgba(249,115,22,0.35)' : '2px solid transparent' }}>
                  <input value={item.item} onChange={e => updMat(sec.id, item.id, 'item', e.target.value)} placeholder="Item name" style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: 13, fontWeight: 500, outline: 'none', width: '100%', fontFamily: "'Inter', -apple-system, sans-serif", padding: '4px 0' }} />
                  <input list="cp_unit_dl" value={item.unit} onChange={e => updMat(sec.id, item.id, 'unit', e.target.value)} style={{ ...UINP }} />
                  <input type="text" inputMode="decimal" value={item.qty} onChange={e => updMat(sec.id, item.id, 'qty', e.target.value)} placeholder="0" style={{ ...NINP }} />
                  {seeRates && <input type="text" inputMode="decimal" value={item.costPerUnit} onChange={e => updMat(sec.id, item.id, 'costPerUnit', e.target.value)} placeholder="0.00" style={{ ...NINP }} />}
                  {seeRates && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, textAlign: 'right', color: filled ? '#f1f5f9' : '#334155' }}>{filled ? fmtC(tot) : '—'}</div>}
                  <button onClick={() => removeMatItem(sec.id, item.id)} className="ri-del" style={{ background: 'transparent', border: 'none', color: '#4a5e7a', cursor: 'pointer', fontSize: 15, padding: 0, lineHeight: 1 }}>×</button>
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px dashed #1e2535' }}>
              <button onClick={() => addMatItem(sec.id)} style={{ flex: 1, padding: '6px 8px', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 12, textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}>+ Add Item</button>
              {seeRates && secTot > 0 && <div style={{ padding: '6px 10px', fontSize: 12, color: '#64748b', fontFamily: "'Courier New', monospace", whiteSpace: 'nowrap' }}>Subtotal: <strong style={{ color: '#f97316' }}>{fmtC(secTot)}</strong></div>}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── labor grid ───────────────────────────────────────────────────────────────
  const renderLaborSection = (sec) => {
    const secTot = laborSecTot(sec);
    const cols = sec.isWaste ? WASTE_COLS : LAB_COLS;
    const labHdr = (
      <div
        className="ri-sec-hdr"
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a2038', borderLeft: '3px solid #0d9488', borderRadius: sec.collapsed ? 6 : '6px 6px 0 0', padding: '9px 10px', cursor: 'pointer', minHeight: 44 }}
        onClick={() => toggleLaborSec(sec.id)}
      >
        <span style={{ color: '#0d9488', fontSize: 10, flexShrink: 0 }}>{sec.collapsed ? '▶' : '▼'}</span>
        <input
          value={sec.title}
          onChange={e => { e.stopPropagation(); updLaborSecTitle(sec.id, e.target.value); }}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: 11, fontWeight: 700, outline: 'none', fontFamily: "'Inter', -apple-system, sans-serif", textTransform: 'uppercase', letterSpacing: '0.6px', cursor: 'text' }}
        />
        {!sec.isWaste && seeRates && (
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, color: secTot > 0 ? '#0d9488' : '#334155', flexShrink: 0 }}>
            {secTot > 0 ? fmtC(secTot) : '—'}
          </span>
        )}
      </div>
    );
    if (isMobile) {
      return (
        <div key={sec.id} style={{ marginBottom: 4 }}>
          {labHdr}
          {!sec.collapsed && (
            <div style={{ background: '#0c1020', border: '1px solid #1a2035', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
              {sec.items.map(item => {
                const tot = sec.isWaste ? 0 : laborItemTot(item);
                const filled = !sec.isWaste && tot > 0;
                return (
                  <div key={item.id} style={{ padding: '8px 10px', borderBottom: '1px solid #0a0e18', background: filled ? 'rgba(99,102,241,0.04)' : 'transparent', borderLeft: filled ? '3px solid rgba(99,102,241,0.4)' : '3px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: sec.isWaste ? 7 : 7 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '4px 0' }}>{item.label || '—'}</div>
                        {item.note && <div style={{ fontSize: 10, color: '#475569', fontStyle: 'italic' }}>{item.note}</div>}
                      </div>
                      <button onClick={() => removeLaborItem(sec.id, item.id)} className="ri-del" style={{ background: 'transparent', border: 'none', color: '#4a5e7a', cursor: 'pointer', fontSize: 20, padding: '0 4px', minHeight: 44, minWidth: 36, flexShrink: 0 }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: sec.isWaste ? '52px 1fr' : (seeRates ? '52px 1fr 1fr 1fr' : '52px 1fr'), gap: 8, alignItems: 'end' }}>
                      <div>
                        <div style={{ ...CHEAD, marginBottom: 4 }}>Unit</div>
                        <input list="cp_unit_dl" value={item.unit} onChange={e => updLabor(sec.id, item.id, 'unit', e.target.value)} style={{ ...UINP, minHeight: 44 }} />
                      </div>
                      <div>
                        <div style={{ ...CHEAD, marginBottom: 4 }}>Qty</div>
                        <input type="text" inputMode="decimal" value={item.qty} onChange={e => updLabor(sec.id, item.id, 'qty', e.target.value)} placeholder="0" style={{ ...NINP, minHeight: 44, fontSize: 15 }} />
                      </div>
                      {!sec.isWaste && seeRates && (
                        <>
                          <div>
                            <div style={{ ...CHEAD, marginBottom: 4 }}>Rate</div>
                            <input type="text" inputMode="decimal" value={item.rate} onChange={e => updLabor(sec.id, item.id, 'rate', e.target.value)} placeholder="0.00" style={{ ...NINP, minHeight: 44, fontSize: 15 }} />
                          </div>
                          <div>
                            <div style={{ ...CHEAD, marginBottom: 4 }}>Total</div>
                            <div style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, color: filled ? '#6366f1' : '#334155' }}>{filled ? fmtC(tot) : '—'}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {!sec.isWaste && (
                <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px dashed #1e2535' }}>
                  <button onClick={() => addLaborItem(sec.id)} style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 13, textAlign: 'left', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>+ Add Item</button>
                  {seeRates && secTot > 0 && <div style={{ padding: '6px 10px', fontSize: 12, color: '#64748b', fontFamily: "'Courier New', monospace", whiteSpace: 'nowrap' }}>Sub: <strong style={{ color: '#6366f1' }}>{fmtC(secTot)}</strong></div>}
                </div>
              )}
              {sec.isWaste && (
                <div style={{ padding: '8px 10px', borderTop: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Net Waste</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, color: netWaste > 0 ? '#f59e0b' : '#64748b' }}>{netWaste.toFixed(1)} BDL</span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return (
      <div key={sec.id} style={{ marginBottom: 4 }}>
        {labHdr}
        {!sec.collapsed && (
          <div style={{ background: '#0c1020', border: '1px solid #1a2035', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 4, padding: '4px 8px', background: '#111827', borderBottom: '1px solid #1e2535' }}>
              <div style={{ ...CHEAD }}>Item</div>
              <div style={{ ...CHEAD, textAlign: 'center' }}>Unit</div>
              <div style={{ ...CHEAD, textAlign: 'right' }}>Qty</div>
              {!sec.isWaste && seeRates && <div style={{ ...CHEAD, textAlign: 'right' }}>Rate</div>}
              {!sec.isWaste && seeRates && <div style={{ ...CHEAD, textAlign: 'right' }}>Total</div>}
              <div />
            </div>
            {sec.items.map(item => {
              const tot = sec.isWaste ? 0 : laborItemTot(item);
              const filled = !sec.isWaste && tot > 0;
              return (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: cols, gap: 4, alignItems: 'center', padding: '3px 8px', borderBottom: '1px solid #0a0e18', background: filled ? 'rgba(99,102,241,0.04)' : 'transparent', borderLeft: filled ? '2px solid rgba(99,102,241,0.35)' : '2px solid transparent' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500, fontFamily: "'Inter', -apple-system, sans-serif", padding: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label || <span style={{ color: '#334155' }}>—</span>}</div>
                    {item.note && <div style={{ fontSize: 10, color: '#334155', fontStyle: 'italic' }}>{item.note}</div>}
                  </div>
                  <input list="cp_unit_dl" value={item.unit} onChange={e => updLabor(sec.id, item.id, 'unit', e.target.value)} style={{ ...UINP }} />
                  <input type="text" inputMode="decimal" value={item.qty} onChange={e => updLabor(sec.id, item.id, 'qty', e.target.value)} placeholder="0" style={{ ...NINP }} />
                  {!sec.isWaste && seeRates && (
                    <>
                      <input type="text" inputMode="decimal" value={item.rate} onChange={e => updLabor(sec.id, item.id, 'rate', e.target.value)} placeholder="0.00" style={{ ...NINP }} />
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, textAlign: 'right', color: filled ? '#f1f5f9' : '#334155' }}>{filled ? fmtC(tot) : '—'}</div>
                    </>
                  )}
                  <button onClick={() => removeLaborItem(sec.id, item.id)} className="ri-del" style={{ background: 'transparent', border: 'none', color: '#4a5e7a', cursor: 'pointer', fontSize: 15, padding: 0, lineHeight: 1 }}>×</button>
                </div>
              );
            })}
            {!sec.isWaste && (
              <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px dashed #1e2535' }}>
                <button onClick={() => addLaborItem(sec.id)} style={{ flex: 1, padding: '6px 8px', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 12, textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}>+ Add Item</button>
                {seeRates && secTot > 0 && <div style={{ padding: '6px 10px', fontSize: 12, color: '#64748b', fontFamily: "'Courier New', monospace", whiteSpace: 'nowrap' }}>Subtotal: <strong style={{ color: '#6366f1' }}>{fmtC(secTot)}</strong></div>}
              </div>
            )}
            {sec.isWaste && (
              <div style={{ padding: '6px 8px 8px', borderTop: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Net Waste</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, color: netWaste > 0 ? '#f59e0b' : '#64748b' }}>{netWaste.toFixed(1)} BDL</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <datalist id="cp_unit_dl">
        {CP_UNITS.map(u => <option key={u} value={u} />)}
      </datalist>

      {/* ── Template bar ── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Template:</span>
        <select
          value={data.jobInfo.templateName || ''}
          onChange={e => {
            const name = e.target.value;
            if (!name) return;
            const hasData = data.materials.sections.some(sec => sec.items.some(item => item.qty || item.costPerUnit));
            if (hasData) { setPendingTpl(name); } else { applyTpl(name); }
          }}
          style={{ flex: 1, minWidth: 140, padding: '6px 8px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', transition: 'border-color 0.15s' }}
        >
          <option value="">Select template…</option>
          <optgroup label="Built-in">
            {Object.keys(CP_TRADE_TEMPLATES).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </optgroup>
          {jobTpls.length > 0 && (
            <optgroup label="Custom">
              {jobTpls.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </optgroup>
          )}
        </select>
        <button
          onClick={() => setShowTplSave(s => !s)}
          className="ri-btn ri-btn-secondary"
          style={{ padding: '6px 10px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 6, color: '#94a3b8', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent' }}
        >
          Save as Template
        </button>
      </div>
      {showTplSave && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input value={tplName} onChange={e => setTplName(e.target.value)} placeholder="Template name" style={{ flex: 1, padding: '7px 10px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
          <button onClick={saveJobTpl} style={{ padding: '7px 14px', background: '#f97316', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>Save</button>
        </div>
      )}
      {pendingTpl && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, padding: '9px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#fca5a5', flex: 1 }}>Replace all line items with the <strong>{pendingTpl}</strong> template?</span>
          <button onClick={() => applyTpl(pendingTpl)} style={{ padding: '5px 12px', background: '#ef4444', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, WebkitTapHighlightColor: 'transparent' }}>Yes, Replace</button>
          <button onClick={() => setPendingTpl(null)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #334155', borderRadius: 6, color: '#64748b', cursor: 'pointer', fontSize: 13, WebkitTapHighlightColor: 'transparent' }}>Cancel</button>
        </div>
      )}

      {/* Sub-tab navigation — sticky */}
      <div style={{ position: 'sticky', top: 0, zIndex: 8, display: 'flex', background: '#131a2a', borderBottom: '2px solid #1e2d44', borderRadius: '8px 8px 0 0', marginBottom: 16, overflowX: 'auto', padding: '4px 4px 0' }}>
        {SUB_TABS.map(({ key, label }) => {
          const cmColor = CM_SUB_COLORS[key] || '#14b8a6';
          const isActive = subTab === key;
          return (
          <button
            key={key}
            className={isActive ? '' : 'ri-modal-tab'}
            onClick={() => setSubTab(key)}
            style={{
              padding: '9px 14px', border: 'none',
              borderBottom: `2px solid ${isActive ? cmColor : 'transparent'}`,
              background: isActive ? cmColor + '18' : 'transparent',
              borderRadius: isActive ? '6px 6px 0 0' : 0,
              color: isActive ? cmColor : '#cbd5e1',
              cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 700 : 600,
              marginBottom: -2, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent',
            }}
          >
            {label}
          </button>
          );
        })}
      </div>

      {/* ── Materials Tab ── */}
      {subTab === 'materials' && (
        <div>
          {/* Sections */}
          {data.materials.sections.map(sec => renderMatSection(sec))}
          <button
            onClick={addMatSec}
            className="ri-add-item"
            style={{ width: '100%', padding: '10px', marginTop: 8, background: 'transparent', border: '1px dashed #2e3d5c', borderRadius: 7, color: '#64748b', cursor: 'pointer', fontSize: 12, WebkitTapHighlightColor: 'transparent', transition: 'color 0.15s, border-color 0.15s' }}
          >
            + Add Section
          </button>
          {/* Materials Grand Total — sticky */}
          {seeRates && (
          <div style={{ position: 'sticky', bottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', marginTop: 8, background: '#0f1117', borderTop: '2px solid rgba(249,115,22,0.4)', boxShadow: '0 -6px 20px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Materials Total</span>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 700, color: '#14b8a6' }}>{fmtC(matTotal)}</span>
          </div>
          )}
        </div>
      )}

      {/* ── Labor Tab ── */}
      {subTab === 'labor' && (
        <div>
          {/* Crew info */}
          <div style={{ background: '#0f1117', border: '1px solid #253048', borderRadius: 7, padding: '10px 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Crew Assigned</div>
            <input value={data.jobInfo.subContractorName} onChange={e => updInfo('subContractorName', e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
          </div>
          {/* Sections */}
          {data.labor.sections.map(sec => renderLaborSection(sec))}
          <button
            onClick={addLaborSec}
            className="ri-add-item"
            style={{ width: '100%', padding: '10px', marginTop: 8, background: 'transparent', border: '1px dashed #2e3d5c', borderRadius: 7, color: '#64748b', cursor: 'pointer', fontSize: 12, WebkitTapHighlightColor: 'transparent', transition: 'color 0.15s, border-color 0.15s' }}
          >
            + Add Section
          </button>
          {/* Labor Grand Total — sticky */}
          {seeRates && (
          <div style={{ position: 'sticky', bottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', marginTop: 8, background: '#0f1117', borderTop: '2px solid rgba(99,102,241,0.4)', boxShadow: '0 -6px 20px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Labor Total</span>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 700, color: '#0d9488' }}>{fmtC(laborTotal)}</span>
          </div>
          )}
        </div>
      )}

      {/* ── Summary Tab ── */}
      {subTab === 'summary' && (
        <div>
          {/* Job Cost Breakdown */}
          <div style={{ background: '#0f1117', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Job Cost Breakdown</div>
            {[
              { label: 'Materials', val: matTotal, color: '#14b8a6' },
              { label: 'Labor', val: laborTotal, color: '#0d9488' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color }}>{fmtC(val)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #1e2535', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Subtotal</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{fmtC(subtotal)}</span>
            </div>
            {/* Overhead & Tax */}
            {[
              { label: 'Overhead (%)', field: 'overhead', pct: overheadPct, amt: overheadAmt },
              { label: 'Tax (%)', field: 'tax', pct: taxPct, amt: taxAmt },
            ].map(({ label, field, pct, amt }) => (
              <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8', flex: 1 }}>{label}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.jobInfo[field]}
                  onChange={e => updInfo(field, e.target.value)}
                  placeholder="0"
                  style={{ width: 60, padding: '6px 8px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 13, fontFamily: "'Courier New', monospace", textAlign: 'right', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                />
                <span style={{ fontSize: 11, color: '#475569', width: 14 }}>%</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: '#64748b', width: 80, textAlign: 'right' }}>{fmtC(amt)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginTop: 8, background: '#161b27', borderRadius: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Total Job Cost</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>{fmtC(totalJobCost)}</span>
            </div>
          </div>

          {/* Profitability */}
          <div style={{ background: '#0f1117', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Job Profitability</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Contract / Sale Price</div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 15 }}>$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.jobInfo.contractPrice}
                  onChange={e => updInfo('contractPrice', e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '10px 10px 10px 24px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 7, color: '#e2e8f0', fontSize: 18, fontFamily: "'Courier New', monospace", textAlign: 'right', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                />
              </div>
            </div>
            {[
              { label: 'Total Cost', val: totalJobCost, color: '#e2e8f0' },
              { label: 'Gross Profit', val: grossProfit, color: profitColor },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 15, fontWeight: 700, color }}>{fmtC(val)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: `${profitColor}14`, border: `1px solid ${profitColor}44`, borderRadius: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: profitColor }}>Profit Margin</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 700, color: profitColor }}>{profitMargin.toFixed(1)}%</span>
            </div>
          </div>

          {/* Per-Square Metrics */}
          {totalSq > 0 && (
            <div style={{ background: '#0f1117', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Per-Square Metrics</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>Total Squares</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: '#e2e8f0', fontWeight: 700 }}>{totalSq.toFixed(1)} SQ</span>
              </div>
              {[
                { label: 'Cost / SQ', val: costPerSq },
                { label: 'Revenue / SQ', val: revenuePerSq },
                { label: 'Profit / SQ', val: profitPerSq },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: '#e2e8f0' }}>{fmtC(val)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Crew Pay */}
          <div style={{ background: '#0f1117', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Crew Pay</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Crew Assigned</div>
              <input value={data.jobInfo.subContractorName} onChange={e => updInfo('subContractorName', e.target.value)} style={{ width: '100%', padding: '9px 10px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>Total Labor Pay</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 18, fontWeight: 700, color: '#0d9488' }}>{fmtC(laborTotal)}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>Notes / Pay Adjustments</div>
              <textarea value={data.jobInfo.notes} onChange={e => updInfo('notes', e.target.value)} rows={3} placeholder="Any adjustments or notes…" style={{ width: '100%', padding: '9px 10px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Sign Off Tab ── */}
      {subTab === 'signoff' && (
        <div>
          {data.signOff.submitted ? (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '24px 18px', textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Submitted & Locked</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>This form has been submitted and locked.</div>
            </div>
          ) : (
            <div style={{ background: '#0f1117', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Inspection Pass?</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['yes', 'no'].map(v => (
                    <button
                      key={v}
                      onClick={() => updSignOff('inspectionPass', v)}
                      style={{ flex: 1, padding: '13px', background: data.signOff.inspectionPass === v ? (v === 'yes' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)') : 'transparent', border: `1px solid ${data.signOff.inspectionPass === v ? (v === 'yes' ? '#22c55e' : '#ef4444') : '#1e2535'}`, borderRadius: 8, color: data.signOff.inspectionPass === v ? (v === 'yes' ? '#22c55e' : '#ef4444') : '#64748b', fontWeight: 700, fontSize: 16, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                    >
                      {v === 'yes' ? 'Yes ✓' : 'No ✗'}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { field: 'subName', label: 'Crew Name', type: 'text' },
                { field: 'supervisor', label: 'Site Supervisor Name', type: 'text' },
                { field: 'dateCompleted', label: 'Date Completed', type: 'date' },
              ].map(({ field, label, type }) => (
                <div key={field} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>{label}</div>
                  <input type={type} value={data.signOff[field]} onChange={e => updSignOff(field, e.target.value)} style={{ width: '100%', padding: '11px 12px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 7, color: '#e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Notes / Comments</div>
                <textarea value={data.signOff.notes} onChange={e => updSignOff('notes', e.target.value)} rows={4} placeholder="Any notes or comments…" style={{ width: '100%', padding: '11px 12px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            {!data.signOff.submitted && (
              <button
                onClick={() => updSignOff('submitted', true)}
                style={{ flex: 3, padding: '14px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
              >
                Submit & Lock
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="ri-btn ri-btn-secondary"
              style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 10, color: '#94a3b8', fontWeight: 600, fontSize: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Job Modal ────────────────────────────────────────────────────────────────
function JobModal({ job, onClose, customChecklist, crew, assignments, onAssign, onUnassign, onAddCrew, currentUser, demoMessages, onComplete, onUpdateSteps, onUpdateSchedule, rolePerms }) {
  const steps = (job.taskList && job.taskList.length ? job.taskList.map((label, i) => ({ id: i + 1, label })) : null)
    || TRADE_CHECKLISTS[job.trade]
    || (customChecklist ? customChecklist.map((label, i) => ({ id: i + 1, label })) : null)
    || TRADE_CHECKLISTS['Full Replacement'];
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

  const [modalTab, setModalTab] = useState('checklist');
  const [msgCount, setMsgCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [hasCostMgr, setHasCostMgr] = useState(() => {
    try { return !!localStorage.getItem(`cl_crewpay_${job.id}`); } catch (e) { return false; }
  });

  useEffect(() => {
    if (modalTab !== 'crewpay') {
      try { setHasCostMgr(!!localStorage.getItem(`cl_crewpay_${job.id}`)); } catch (e) { /* ignore */ }
    }
  }, [modalTab, job.id]);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [schedDate, setSchedDate] = useState(job.scheduledDate || '');
  const [schedDur, setSchedDur] = useState(jobDuration(job));

  useEffect(() => {
    if (demoMessages) {
      setMsgCount(demoMessages.filter(m => m.type === 'user').length);
      return;
    }
    chatDB.getByJob(String(job.id)).then(msgs => setMsgCount(msgs.length)).catch(() => {});
  }, [job.id, demoMessages]);

  const toggle = (id) => {
    setChecks(prev => {
      const wasDone = prev[id].done;
      const next = {
        ...prev,
        [id]: {
          done: !wasDone,
          ts: wasDone ? null : new Date().toISOString().slice(0, 16).replace('T', ' '),
        },
      };
      if (onUpdateSteps) {
        const doneIds = Object.entries(next).filter(([, v]) => v.done).map(([k]) => Number(k));
        onUpdateSteps(job.id, doneIds);
      }
      return next;
    });
  };

  const isMobile = useMobile();
  const doneCount = Object.values(checks).filter(c => c.done).length;
  const total = steps.length;
  const pct = Math.round(doneCount / total * 100);
  const statusColor = pct === 100 ? '#22c55e' : pct > 0 ? '#f97316' : '#6366f1';

  // Full-screen overlay + flex-column modal: header is pinned, only content scrolls
  const jobOverlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
    zIndex: 1000, padding: isMobile ? 0 : 20,
  };
  const jobModal = {
    background: '#1a2236', border: isMobile ? 'none' : '1px solid #2e3d5c',
    borderRadius: isMobile ? '16px 16px 0 0' : 14,
    width: '100%', maxWidth: isMobile ? '100vw' : 600,
    height: isMobile ? '96dvh' : '90vh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
  };

  return (
    <div style={jobOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={jobModal} onClick={e => e.stopPropagation()}>

        {/* ── Pinned header: never scrolls ── */}
        <div style={{ flexShrink: 0, padding: isMobile ? '16px 14px 0' : '24px 28px 0', position: 'relative' }}>
          <button className="ri-close-btn" style={{ ...S.closeBtn, zIndex: 12 }} onClick={onClose}>×</button>
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
            {job.address}{rolePerms?.seeDollars !== false ? ` · ${fmt(job.value)}` : ''}
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 10,
              background: tradeColor + '22', color: tradeColor,
              letterSpacing: '0.3px',
            }}>
              {job.trade}
            </span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Progress</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{doneCount}/{total} steps — {pct}%</span>
            </div>
            <div style={S.progressTrack}>
              <div style={S.progressFill(pct, statusColor)} />
            </div>
          </div>

          {/* Modal tab bar */}
          <div style={{ display: 'flex', background: '#161b27', borderBottom: '2px solid #253048', borderRadius: '8px 8px 0 0', marginBottom: 0, overflowX: 'auto', padding: '4px 4px 0' }}>
          {[
            { key: 'checklist', label: 'Checklist' },
            { key: 'crew', label: 'Crew' },
            { key: 'photos', label: photoCount > 0 ? `Photos (${photoCount})` : 'Photos' },
            { key: 'chat', label: msgCount > 0 ? `Chat (${msgCount})` : 'Chat' },
            ...(rolePerms?.seeCostManager !== false ? [{ key: 'crewpay', label: hasCostMgr ? 'Cost Manager ●' : 'Cost Manager' }] : []),
          ].map(({ key, label }) => {
            const accent = SECTION_COLORS[key] || '#f97316';
            const isActive = modalTab === key;
            return (
            <button
              key={key}
              className={isActive ? '' : 'ri-modal-tab'}
              onClick={() => setModalTab(key)}
              style={{
                padding: '9px 14px', border: 'none',
                borderBottom: `2px solid ${isActive ? accent : 'transparent'}`,
                background: isActive ? accent + '18' : 'transparent',
                borderRadius: isActive ? '6px 6px 0 0' : 0,
                color: isActive ? accent : '#cbd5e1',
                cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 700 : 600,
                marginBottom: -2, whiteSpace: 'nowrap', flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {label}
            </button>
            );
          })}
          </div>
        </div>
        {/* ── End pinned header ── */}

        {/* ── Scrollable content area ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 14px 24px' : '20px 28px 28px' }}>

        {modalTab === 'checklist' && (
          <>
            <div style={S.sectionLabel}>Job Notes</div>
            <div style={{
              fontSize: 13, color: '#94a3b8', marginBottom: 20,
              padding: '10px 12px', background: '#0f1117', borderRadius: 6,
            }}>
              {job.notes}
            </div>

            <div style={S.sectionLabel}>{job.trade} Job Checklist</div>
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

            {/* Schedule / reschedule row */}
            <div style={{ marginTop: 16, background: '#0f1117', borderRadius: 7, padding: '10px 12px' }}>
              {editingSchedule ? (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Schedule</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="date"
                      value={schedDate}
                      onChange={e => setSchedDate(e.target.value)}
                      style={{ ...FI, fontSize: 13, padding: '7px 10px', flex: 1, minWidth: 130 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Duration</span>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={schedDur}
                        onChange={e => setSchedDur(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ ...FI, fontSize: 13, padding: '7px 8px', width: 56 }}
                      />
                      <span style={{ fontSize: 12, color: '#64748b' }}>days</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button
                      className="ri-btn ri-btn-secondary"
                      style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 6, color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}
                      onClick={() => setEditingSchedule(false)}
                    >
                      Cancel
                    </button>
                    <button
                      style={{ flex: 2, padding: '8px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                      onClick={() => {
                        if (onUpdateSchedule) onUpdateSchedule(job.id, schedDate, schedDur);
                        setEditingSchedule(false);
                      }}
                    >
                      Save Schedule
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>📅</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>
                      {job.scheduledDate || 'Not scheduled'}
                    </span>
                    {job.scheduledDate && (
                      <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>
                        → {jobEndDate(job)} · {jobDuration(job)}d
                      </span>
                    )}
                  </div>
                  {onUpdateSchedule && (
                    <button
                      className="ri-btn ri-btn-secondary"
                      style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 6, color: '#94a3b8', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}
                      onClick={() => setEditingSchedule(true)}
                    >
                      {job.scheduledDate ? 'Reschedule' : 'Schedule'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mark Job Complete */}
            {onComplete && job.status !== 'Complete' && (
              <div style={{ marginTop: 20 }}>
                {pct === 100 ? (
                  <button
                    style={{ width: '100%', padding: '12px 16px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => onComplete(job.id)}
                  >
                    ✓ Mark Job Complete
                  </button>
                ) : confirmComplete ? (
                  <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 13, color: '#f97316', marginBottom: 10 }}>Not all checklist items are done. Complete anyway?</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="ri-btn ri-btn-secondary" style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 7, color: '#94a3b8', cursor: 'pointer', fontSize: 13 }} onClick={() => setConfirmComplete(false)}>Cancel</button>
                      <button style={{ flex: 2, padding: '8px', background: '#22c55e', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }} onClick={() => onComplete(job.id)}>Complete Anyway</button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="ri-btn ri-btn-secondary"
                    style={{ width: '100%', padding: '10px 16px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 8, color: '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => setConfirmComplete(true)}
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {modalTab === 'photos' && (
          <JobPhotosPanel
            lead={{ id: job.id, name: job.customer, stage: 'in_progress', trade: job.trade }}
            onCountChange={setPhotoCount}
          />
        )}

        {modalTab === 'crew' && (
          <JobCrewSection
            job={job}
            crew={crew || []}
            assignments={assignments || {}}
            onAssign={onAssign}
            onUnassign={onUnassign}
            onAddCrew={onAddCrew}
          />
        )}

        {modalTab === 'chat' && (
          <JobChatPanel jobId={job.id} currentUser={currentUser} demoMessages={demoMessages} onCountChange={setMsgCount} />
        )}

        {modalTab === 'crewpay' && (
          <CostManagerPanel job={job} crew={crew || []} assignments={assignments || {}} rolePerms={rolePerms} />
        )}
        </div>{/* end scrollable content */}
      </div>
    </div>
  );
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────
function JobsTab({ jobs, customChecklist, crew, assignments, onAssign, onUnassign, onAddCrew, currentUser, demoMessages, onComplete, onUpdateSteps, onUpdateSchedule, rolePerms }) {
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
            {rolePerms?.seeDollars !== false ? fmt(filtered.reduce((s, j) => s + j.value, 0)) : '—'}
          </span>
        </div>
      </div>

      <div style={S.tradeFilterRow}>
        <button
          style={S.tradeFilterBtn(tradeFilter === 'all', '#f97316')}
          onClick={() => setTradeFilter('all')}
        >
          All Job Types
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
            || TRADE_CHECKLISTS['Full Replacement'];
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
                <div style={S.metaItem}>Value: <span style={{ ...S.metaValue, color: '#22c55e' }}>{rolePerms?.seeDollars !== false ? fmt(job.value) : '—'}</span></div>
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
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          customChecklist={customChecklist}
          crew={crew}
          assignments={assignments}
          onAssign={onAssign}
          onUnassign={onUnassign}
          onAddCrew={onAddCrew}
          currentUser={currentUser}
          demoMessages={demoMessages ? demoMessages.filter(m => String(m.jobId) === String(selectedJob.id)) : null}
          onComplete={onComplete ? (id) => { onComplete(id); setSelectedJob(null); } : null}
          onUpdateSteps={onUpdateSteps}
          onUpdateSchedule={onUpdateSchedule}
          rolePerms={rolePerms}
        />
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
            background: '#161b27', border: '1px solid #253048', borderRadius: 10,
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
    border: '1px solid #253048',
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
    background: '#111823',
    border: '1px solid #2e3d5c',
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
    border: '1px solid #3a4d6b',
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
    features: ['Up to 25 active leads', 'Job checklists', 'Job progress tracking', 'Basic analytics', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    popular: true,
    features: ['Unlimited leads', 'All 9 job types', 'AI coaching (Claude)', 'Advanced analytics', 'Callbacks & reminders', 'Priority support'],
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
      onLogin({ isDemo: true, companyName: 'RidgeOS', userName: 'Demo User', trade: 'Full Replacement', plan: 'pro' });
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
        setCustomTradeError(data.error || "Couldn't generate that job type — try being more specific.");
      } else {
        setCustomTradeConfig(data);
        set('trade', tradeName);
        setErrors({});
      }
    } catch {
      setCustomTradeError("Couldn't generate that job type — try being more specific.");
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
            <div style={A.stepTitle}>What type of roofing work do you do?</div>
            <div style={A.stepSub}>
              {errors.trade
                ? <span style={{ color: '#ef4444' }}>Please select a job type to continue.</span>
                : 'Select the job type you do most often.'}
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
                ✨ My job type isn't listed — generate it with AI
              </button>
            ) : (
              <div style={{
                background: '#0f1117', border: '1px solid #253048',
                borderRadius: 8, padding: '14px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>
                  ✨ Custom Job Type Generator
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    value={customTradeInput}
                    onChange={e => { setCustomTradeInput(e.target.value); setCustomTradeError(''); }}
                    placeholder="e.g. Metal Roofing, Slate Restoration, TPO Systems"
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
                    ✓ Job type "{form.trade}" generated — {customTradeConfig.checklist.length} checklist steps, {customTradeConfig.pipeline.length} pipeline stages
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
  'Full Replacement': '🏠', 'Repair': '🔧', 'Inspection': '🔍',
  'Storm Damage': '⛈️', 'Gutter Install': '🌧', 'Skylight': '☀️',
  'Flashing Repair': '🛡', 'Ventilation': '💨', 'Emergency Tarp': '🚨',
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
  'Full Replacement': {
    leads: [
      dl(1,'Shumaker Residence','Dave Shumaker','Homeowner','active',14800,'estimate_sent','2026-03-25',null,'28 sq, 7/12 pitch. GAF Timberline HDZ Charcoal. 1 layer tear-off over plywood. Wants 50yr warranty.','Residential',12,'Full Replacement'),
      dl(2,'Bethany Village Retirement','Carol Snyder','Facilities Dir','stalled',34700,'contract_signed','2026-03-23','budget_freeze','Flat roof, 110 sq TPO on main building. Full board approval needed. 2 HVAC curbs to reflash.','Institutional',41,'Full Replacement'),
      dl(3,'Riverwoods HOA Phase II','Susan Yoder','HOA President','active',52000,'inspection_scheduled','2026-03-27',null,'28 townhome units, 240 sq total. Phased replacement. Architectural shingles. Ice & water at eaves.','HOA',8,'Full Replacement'),
      dl(4,'Kowalski Residence','Brian Kowalski','Homeowner','stalled',11200,'estimate_sent','2026-03-19','no_response','22 sq, 6/12 pitch. Visible wind damage on north slope. 3 calls, 2 emails. Try door knock.','Residential',29,'Full Replacement'),
      dl(5,'Monroe Twp Municipal Bldg','Diane Okafor','Facilities Mgr','active',41500,'contract_signed','2026-03-26',null,'TPO membrane, 140 sq. Contract under review with township solicitor.','Commercial',19,'Full Replacement'),
      dl(6,'Deimler Residence','Scott Deimler','Homeowner','stalled',42000,'estimate_sent','2026-03-22','price_objection','48 sq standing seam metal, 10/12 pitch. Got bid $4k lower from Lancaster crew.','Residential',33,'Full Replacement'),
      dl(7,'Milton Area School Dist','Tom Hensley','Facilities Dir','cold',78000,'lead','2026-04-15','timing','Large job — 320 sq across gym + cafeteria. School board vote in April.','Institutional',53,'Full Replacement'),
      dl(8,'Metzger Residence','Raj Metzger','Homeowner','won',14600,'paid',null,null,'Closed! CertainTeed Landmark Pro, 26 sq. 8/12 pitch. 1 layer over OSB.','Residential',24,'Full Replacement'),
      dl(9,'Klinger Trucking','Jim Klinger','Owner','stalled',27300,'contract_signed','2026-03-24','competitor','Standing seam metal on 3-bay shop, 34 sq. Getting 3 bids from valley roofers.','Commercial',37,'Full Replacement'),
      dl(10,'First Baptist Sunbury','Pastor Rick Adams','Admin Dir','lost',23400,'lost',null,'competitor','Lost to roofer from Williamsport area.','Institutional',61,'Full Replacement'),
    ],
    jobs: [
      dj(1,'Dave & Lisa Shumaker','142 Chestnut St, Mifflinburg PA 17844','Full Replacement',14800,'In Progress','2026-03-20',[1,2,3,4,5,6,7,8],'GAF Timberline HDZ Charcoal. Tear-off done, shingles going on.'),
      dj(2,'Raj & Nina Metzger','1108 Buffalo Rd, Lewisburg PA 17837','Full Replacement',14600,'Scheduled','2026-03-26',[1,2],'CertainTeed Landmark Pro. Materials at Boise Cascade Sunbury.'),
      dj(3,'Riverwoods HOA Block A','200 Riverwoods Dr, Lewisburg PA 17837','Full Replacement',24500,'Complete','2026-03-12',[1,2,3,4,5,6,7,8,9,10,11,12,13,14],'12 units Phase I. Signed off and paid.'),
      dj(4,'Monroe Twp Municipal','88 W Main St, Selinsgrove PA 17870','Full Replacement',41500,'In Progress','2026-03-18',[1,2,3],'TPO membrane, 140 sq. Underlayment next.'),
      dj(5,'Klinger Trucking Shop','1100 Industrial Park Rd, Milton PA 17847','Full Replacement',27300,'Scheduled','2026-04-02',[1],'Standing seam metal, 3-bay shop. Crew set for 4/2.'),
    ],
  },
  'Repair': {
    leads: [
      dl(1,'Northumberland Apts Bldg C','Rick Hess','Building Mgr','stalled',4200,'estimate_sent','2026-03-25',null,'Valley flashing failed. Active leak. 3-tab match, 6/12 pitch. Decking stained.','Commercial',41,'Repair'),
      dl(2,'Packwood House Museum','Patricia Landis','Facilities Mgr','active',6400,'estimate_sent','2026-03-27',null,'Slate roof — 8 cracked tiles + ridge mortar. Must match PA slate. 12/12 pitch.','Commercial',20,'Repair'),
      dl(3,'Sheetz #412','Brian Lehr','Facilities Coord','active',3800,'inspection_scheduled','2026-03-26',null,'Wind-damaged 3-tab on flat canopy + 2 pipe boots need reseal. Selinsgrove.','Commercial',12,'Repair'),
      dl(4,'Fischer Residence','Jack Fischer','Homeowner','stalled',2400,'estimate_sent','2026-03-20','price_objection','5 missing shingles from wind on north slope. Homeowner thinks $1,800 is fair. Danville.','Residential',22,'Repair'),
      dl(5,'Valley Fitness','Marcus Stover','Owner','active',5200,'contract_signed','2026-03-26',null,'Ponding water on flat section. TPO seam repair + drain install near HVAC curb.','Commercial',16,'Repair'),
      dl(6,'Chen Residence','Linda Chen','Homeowner','stalled',1800,'estimate_sent','2026-03-22','budget_freeze','Ridge cap blown off in March wind. Waiting on tax return. Watsontown.','Residential',28,'Repair'),
      dl(7,'Buffalo Valley Clubhouse','Dan Marsh','HOA Mgr','cold',3400,'lead','2026-04-10','timing','Soffit damage + fascia rot at 2 corners. Spring maintenance budget.','HOA',34,'Repair'),
      dl(8,'Porter Residence','Amy Porter','Homeowner','won',2800,'paid',null,null,'Closed! Patched 3 sq wind damage + resealed all boots. Milton.','Residential',14,'Repair'),
      dl(9,'Country Diner','Roy Burns','Owner','lost',4100,'lost',null,'competitor','Lost — handyman patched it for half price. Middleburg.','Commercial',35,'Repair'),
    ],
    jobs: [
      dj(1,'Packwood House Museum','15 N Water St, Lewisburg PA 17837','Repair',6400,'In Progress','2026-03-21',[1,2,3,4],'Slate tile replacement. 5 of 8 tiles done. Matching PA slate.'),
      dj(2,'Amy Porter','610 Front St, Milton PA 17847','Repair',2800,'Complete','2026-03-19',[1,2,3,4,5,6,7,8,9,10],'3 sq wind patch + boot reseal. Done and paid.'),
      dj(3,'Valley Fitness','1420 N Susquehanna Trail, Selinsgrove PA 17870','Repair',5200,'Scheduled','2026-04-02',[1,2],'TPO seam repair + new drain. Materials ordered.'),
      dj(4,'Northumberland Apts Bldg C','350 Front St, Northumberland PA 17857','Repair',4200,'In Progress','2026-03-18',[1,2,3,4,5],'Valley flashing replaced. Shingle match in progress.'),
    ],
  },
  'Inspection': {
    leads: [
      dl(1,'Danville Heritage Villas','Dave Moyer','Board President','cold',1800,'lead','2026-04-10',null,'15-building annual roof inspection. Roofs are 18+ years. Could lead to phased replacement.','HOA',71,'Inspection'),
      dl(2,'Milton Area School Dist','Carl Beck','Facilities Dir','active',2200,'inspection_scheduled','2026-03-27',null,'Annual condition report for 4 campus buildings. Insurance requirement.','Institutional',14,'Inspection'),
      dl(3,'Sunbury Apartments','Donna Kwan','Property Mgr','active',3400,'estimate_sent','2026-03-25',null,'32-unit complex pre-purchase inspection for new buyer.','Commercial',9,'Inspection'),
      dl(4,'Rossmoyne Business Park','Carl Stein','Developer','stalled',4800,'estimate_sent','2026-03-20','no_response','5-building portfolio inspection in Shamokin Dam. Due diligence for refinance.','Commercial',28,'Inspection'),
      dl(5,'Dreisbach Church','Deacon Paul Smith','Admin','stalled',1400,'estimate_sent','2026-03-22','budget_freeze','Annual roof check on sanctuary + fellowship hall. Budget frozen.','Institutional',33,'Inspection'),
      dl(6,'Evangelical Community Hospital','Greg Stauffer','Facilities Mgr','active',6200,'contract_signed','2026-03-26',null,'Outpatient wing warranty inspection — 1-year mark. Lewisburg.','Institutional',12,'Inspection'),
      dl(7,'Susquehanna Industrial Park','Nick Etter','GM','won',1600,'paid',null,null,'Closed! 3-building annual inspection. Report delivered. Northumberland.','Commercial',18,'Inspection'),
      dl(8,'Bloomsburg School Dist','Stan Wells','Facilities Dir','cold',5400,'lead','2026-04-15','timing','4 campus buildings. Budget not released until May.','Institutional',44,'Inspection'),
      dl(9,'Comfort Inn Selinsgrove','Lisa Cole','GM','lost',2800,'lost',null,'competitor','Lost to existing maintenance company from Williamsport.','Commercial',52,'Inspection'),
    ],
    jobs: [
      dj(1,'Susquehanna Industrial Park','825 Point Township Dr, Northumberland PA 17857','Inspection',1600,'Complete','2026-03-15',[1,2,3,4,5,6,7,8,9],'3-building inspection complete. Report delivered.'),
      dj(2,'Milton Area School Dist','700 Mahoning St, Milton PA 17847','Inspection',2200,'Scheduled','2026-03-27',[1],'4 campus buildings. Drone + ladder access confirmed.'),
      dj(3,'Evangelical Hospital — Warranty','1 Hospital Dr, Lewisburg PA 17837','Inspection',6200,'In Progress','2026-03-22',[1,2,3,4,5],'Outpatient wing. 60% inspected.'),
    ],
  },
  'Storm Damage': {
    leads: [
      dl(1,'Bowman Family','Tina Bowman','Homeowner','active',18700,'inspection_scheduled','2026-03-23',null,'Wind damage from 3/15 storm. Erie Insurance claim filed. 24 sq, 6/12 pitch. Lewisburg.','Residential',9,'Storm Damage'),
      dl(2,'Shamokin Creek Condos','Bob Reider','Board Treasurer','stalled',47500,'estimate_sent','2026-03-24','wrong_contact','6 buildings, wind + ice dam damage. Nationwide adjusting. Need full board.','HOA',62,'Storm Damage'),
      dl(3,'Christ Lutheran Mifflinburg','Pastor Ed Zimmerman','Facilities Coord','won',9400,'paid',null,null,'Closed! Wind damage — ridge cap + 3 sq on sanctuary. Nationwide covered.','Institutional',55,'Storm Damage'),
      dl(4,'Nelson Residence','Greg Nelson','Homeowner','active',11400,'estimate_sent','2026-03-27',null,'Wind lifted 6 sq architectural on south slope. Decking exposed. State Farm filed. Bloomsburg.','Residential',13,'Storm Damage'),
      dl(5,'Sunbury Housing Authority','Chad Miller','Property Mgr','stalled',54000,'contract_signed','2026-03-23','budget_freeze','20 units, wind damage. Insurance approved but deductible dispute.','Institutional',41,'Storm Damage'),
      dl(6,'Osei Residence','Kwame Osei','Homeowner','active',14200,'inspection_scheduled','2026-03-26',null,'Tree limb punched through roof during ice storm. Tarped. Adjuster scheduled. Williamsport.','Residential',8,'Storm Damage'),
      dl(7,'Danville Fire Station','Chief Pat Moore','Borough Admin','cold',31000,'lead','2026-05-01','timing','Wind damage to 2 apparatus bays. Borough insurance process is slow.','Institutional',71,'Storm Damage'),
      dl(8,'Pham Residence','Linda Pham','Homeowner','won',14900,'paid',null,null,'Closed! Full replacement after March wind. Erie Insurance paid in full. Milton.','Residential',18,'Storm Damage'),
      dl(9,'Planet Fitness Selinsgrove','Gina Cruz','Owner','lost',22000,'lost',null,'competitor','Lost — went with storm chaser outfit from out of state.','Commercial',62,'Storm Damage'),
    ],
    jobs: [
      dj(1,'Tina & Mark Bowman','227 Market St, Lewisburg PA 17837','Storm Damage',18700,'Complete','2026-03-14',[1,2,3,4,5,6,7,8,9,10,11],'Erie claim. 24 sq architectural replaced. Union County permit closed.'),
      dj(2,'Christ Lutheran','130 S 5th St, Mifflinburg PA 17844','Storm Damage',9400,'Complete','2026-03-10',[1,2,3,4,5,6,7,8,9,10,11],'Wind damage repair. Ridge cap + 3 sq. Nationwide paid.'),
      dj(3,'Linda Pham','918 Front St, Milton PA 17847','Storm Damage',14900,'Complete','2026-03-08',[1,2,3,4,5,6,7,8,9,10,11],'Full replacement after wind. CertainTeed Landmark.'),
      dj(4,'Sunbury Housing Phase 1','400 Chestnut St, Sunbury PA 17801','Storm Damage',54000,'Scheduled','2026-04-05',[1,2,3,4,5,6],'20 units wind damage. Adjuster approved. Materials ordered.'),
    ],
  },
  'Gutter Install': {
    leads: [
      dl(1,'Market Street Commons','Tom Brubaker','Property Mgr','stalled',5800,'estimate_sent','2026-03-15',null,'220 LF seamless aluminum 5" K-style + leaf guards. 1890s building facade. Sunbury.','Commercial',49,'Gutter Install'),
      dl(2,'RiverWoods Senior Living','Andrew Musser','Maintenance Dir','active',13200,'estimate_sent','2026-03-26',null,'480 LF 6" commercial + 12 downspouts on main building. Splash guards at walkways.','Institutional',22,'Gutter Install'),
      dl(3,'Brennan Residence','Pat Brennan','Homeowner','stalled',2600,'estimate_sent','2026-03-20','price_objection','140 LF seamless + guards on rancher. Competitor quoted $400 less. Watsontown.','Residential',22,'Gutter Install'),
      dl(4,'Buffalo Valley Townhomes','Karen Bender','HOA Director','active',8400,'contract_signed','2026-03-26',null,'Half-round copper on historic-style facade. 14 townhome units. Lewisburg.','HOA',16,'Gutter Install'),
      dl(5,'Kim Residence','Susan Kim','Homeowner','active',1900,'inspection_scheduled','2026-03-27',null,'March storm tore off 60 LF of gutter. Fascia damage visible. Danville.','Residential',8,'Gutter Install'),
      dl(6,'Northumberland Apartments','Rick Hess','Building Mgr','cold',12000,'lead','2026-04-10','timing','Full gutter replacement, 6 buildings. Budget not approved until April.','Commercial',34,'Gutter Install'),
      dl(7,'Okafor Residence','Emeka Okafor','Homeowner','won',3800,'paid',null,null,'Closed! Seamless aluminum + leaf guards. 180 LF. Selinsgrove.','Residential',14,'Gutter Install'),
      dl(8,'Dreisbach Church','Deacon Willis','Facilities','stalled',4400,'estimate_sent','2026-03-22','budget_freeze','Spring maintenance budget not released yet. Mifflinburg.','Institutional',28,'Gutter Install'),
      dl(9,'Parks Residence','Tom Parks','Homeowner','lost',2200,'lost',null,'competitor','DIY. Bought sectional gutters at Lowe\'s in Selinsgrove.','Residential',31,'Gutter Install'),
    ],
    jobs: [
      dj(1,'Market Street Commons','118 Market St, Sunbury PA 17801','Gutter Install',5800,'In Progress','2026-03-16',[1,2,3,4,5],'220 LF K-style aluminum. Old gutters off, new going up.'),
      dj(2,'Emeka Okafor','224 Pine St, Selinsgrove PA 17870','Gutter Install',3800,'Complete','2026-03-12',[1,2,3,4,5,6,7,8,9,10,11],'Seamless aluminum + guards. Fully installed and tested.'),
      dj(3,'Buffalo Valley Townhomes','450 Buffalo Rd, Lewisburg PA 17837','Gutter Install',8400,'Scheduled','2026-04-01',[1,2],'Half-round copper. Materials on order.'),
      dj(4,'RiverWoods Senior Living','150 RiverWoods Dr, Lewisburg PA 17837','Gutter Install',13200,'Scheduled','2026-04-07',[1,2],'480 LF 6" commercial. Materials ordered from Boise Cascade.'),
    ],
  },
  'Skylight': {
    leads: [
      dl(1,'Hartman Residence','Joe Hartman','Homeowner','stalled',4800,'contract_signed','2026-03-23','wrong_contact','2 Velux curb-mount for bathroom + kitchen. Need wife to confirm sizes. Watsontown.','Residential',46,'Skylight'),
      dl(2,'Brenner Residence','Sandra Brenner','Homeowner','stalled',6100,'scheduled_for_install','2026-03-23',null,'3 Velux deck-mount in cathedral ceiling. Flashing kit backordered. Hughesville.','Residential',40,'Skylight'),
      dl(3,'Rusty Rail Brewing','Chris Roth','Owner','active',3200,'estimate_sent','2026-03-25',null,'1 large commercial skylight over taproom. Want natural light. Mifflinburg.','Commercial',14,'Skylight'),
      dl(4,'Comfort Inn Selinsgrove','Mark Steele','GM','stalled',18000,'estimate_sent','2026-03-22','budget_freeze','4 large skylights in lobby atrium. Capital project pending corporate.','Commercial',44,'Skylight'),
      dl(5,'Buffalo Valley Clubhouse','Dan Marsh','HOA Mgr','active',5400,'inspection_scheduled','2026-03-27',null,'2 tubular skylights for interior hallway. Minimal roof penetration.','HOA',9,'Skylight'),
      dl(6,'Garcia Residence','Maria Garcia','Homeowner','cold',2800,'lead','2026-04-08','timing','1 Velux deck-mount in master bath. Wants to wait for spring. Bloomsburg.','Residential',24,'Skylight'),
      dl(7,'Campus Theatre','Tom Lewin','Owner','won',7600,'paid',null,null,'Closed! 2 commercial skylights + flashing. Installed and sealed. Lewisburg.','Commercial',27,'Skylight'),
      dl(8,'SV Mall — JCPenney Wing','Janet Groff','Facilities Mgr','stalled',24000,'estimate_sent','2026-03-21','no_response','6 skylight replacements in food court. Submitted 2 weeks ago.','Commercial',58,'Skylight'),
      dl(9,'Thomas Residence','Ben Thomas','Homeowner','lost',3500,'lost',null,'competitor','Lost — went with handyman for cheaper install. Shamokin.','Residential',40,'Skylight'),
    ],
    jobs: [
      dj(1,'Joe & Barb Hartman','78 Pine Creek Rd, Watsontown PA 17777','Skylight',4800,'Complete','2026-03-11',[1,2,3,4,5,6,7,8,9,10,11],'2 Velux curb-mount installed. Sealed and trimmed.'),
      dj(2,'Campus Theatre','413 Market St, Lewisburg PA 17837','Skylight',7600,'Complete','2026-03-14',[1,2,3,4,5,6,7,8,9,10,11],'2 commercial skylights. Installed, flashed, sealed.'),
      dj(3,'Sandra Brenner','19 Covered Bridge Rd, Hughesville PA 17737','Skylight',6100,'Scheduled','2026-04-05',[1,2],'3 Velux deck-mount. Waiting on flashing kit delivery.'),
    ],
  },
  'Flashing Repair': {
    leads: [
      dl(1,'Blasius Chevrolet','Steve Blasius','Shop Owner','active',2800,'inspection_complete','2026-03-28',null,'Chimney flashing failed on service bay. Active leak into office. Selinsgrove.','Commercial',8,'Flashing Repair'),
      dl(2,'SV Mall — JCPenney Wing','Janet Groff','Facilities Mgr','stalled',8500,'estimate_sent','2026-03-21','no_response','Parapet wall flashing failing on 3 sections. No reply from corporate.','Commercial',58,'Flashing Repair'),
      dl(3,'Yamamoto Residence','Ken Yamamoto','Homeowner','active',1800,'estimate_sent','2026-03-25',null,'Skylight flashing leaking in master bedroom. Counter-flashing pulling away. Bloomsburg.','Residential',15,'Flashing Repair'),
      dl(4,'Dreisbach Church','Pastor Dale Ruiz','Admin','stalled',4200,'estimate_sent','2026-03-20','budget_freeze','Chimney + 2 pipe boot failures. Waiting on maintenance budget.','Institutional',33,'Flashing Repair'),
      dl(5,'Sunbury Apartments','Sara Owens','Property Mgr','active',6800,'contract_signed','2026-03-26',null,'Valley flashing on 4 units needs replacement. Insurance approved.','Commercial',18,'Flashing Repair'),
      dl(6,'Susquehanna Industrial Park','Nick Etter','GM','stalled',3200,'estimate_sent','2026-03-22','price_objection','Roof-to-wall flashing at loading dock. Thinks $3k is too much.','Commercial',31,'Flashing Repair'),
      dl(7,'Flynn Residence','Kate Flynn','Homeowner','won',2200,'paid',null,null,'Closed! Chimney reflashing + 2 pipe boots. No more leaks. New Berlin.','Residential',17,'Flashing Repair'),
      dl(8,'Bloomsburg School Dist','Stan Wells','Facilities Dir','cold',9200,'lead','2026-04-15','timing','Gym building flashing at 6 penetrations. Budget pending.','Institutional',44,'Flashing Repair'),
      dl(9,'Country Diner','Roy Burns','Owner','lost',1600,'lost',null,'competitor','Lost — roofer sealed it with tar for $200. Middleburg.','Commercial',35,'Flashing Repair'),
    ],
    jobs: [
      dj(1,'Kate Flynn','45 Penns Creek Rd, New Berlin PA 17855','Flashing Repair',2200,'Complete','2026-03-15',[1,2,3,4,5,6,7,8,9],'Chimney reflashing + 2 pipe boots. Sealed and tested.'),
      dj(2,'Sunbury Apartments','200 Market St, Sunbury PA 17801','Flashing Repair',6800,'In Progress','2026-03-19',[1,2,3,4],'Valley flashing. 2 of 4 units complete.'),
      dj(3,'Blasius Chevrolet','400 S Market St, Selinsgrove PA 17870','Flashing Repair',2800,'Scheduled','2026-03-28',[1,2,3],'Chimney flashing on service bay. Materials staged.'),
    ],
  },
  'Ventilation': {
    leads: [
      dl(1,'Rohrer Residence','Mike Rohrer','Homeowner','active',3200,'inspection_complete','2026-03-27',null,'Attic 145°F in summer. No ridge vent, 2 box vents on 1960s ranch. OSB deck — check moisture. Bloomsburg.','Residential',17,'Ventilation'),
      dl(2,'Northumberland Apartments','Rick Hess','Building Mgr','stalled',9400,'estimate_sent','2026-03-22','no_response','16 units — inadequate attic ventilation causing ice dams in winter.','Commercial',33,'Ventilation'),
      dl(3,'Johnson Residence','Tim Johnson','Homeowner','active',2400,'estimate_sent','2026-03-25',null,'Convert 4 box vents to continuous ridge vent. Add 6 soffit vents. Danville.','Residential',10,'Ventilation'),
      dl(4,'Milton Area School Annex','Carl Beck','Facilities Dir','stalled',5600,'contract_signed','2026-03-23','budget_freeze','Gym building needs 8 turbine vents replaced with powered units.','Institutional',28,'Ventilation'),
      dl(5,'Klinger Trucking Warehouse','Jim Klinger','Owner','active',4800,'contract_signed','2026-03-26',null,'Commercial exhaust fans + ridge vent on 8,000 sq ft warehouse. Milton.','Commercial',16,'Ventilation'),
      dl(6,'Central Machine Inc','Ray Toro','Plant Manager','cold',7200,'lead','2026-04-10','timing','Factory ventilation upgrade. Capital budget Q3. Northumberland.','Industrial',44,'Ventilation'),
      dl(7,'Crane Residence','Bob Crane','Homeowner','won',1800,'paid',null,null,'Closed! Ridge vent + 6 soffit vents. Attic dropped 30°F. Selinsgrove.','Residential',12,'Ventilation'),
      dl(8,'Valley Fitness','Marcus Stover','Owner','stalled',4200,'estimate_sent','2026-03-20','price_objection','4 powered attic fans. Owner wants cheaper passive option.','Commercial',22,'Ventilation'),
      dl(9,'Hendricks Residence','Tom Hendricks','Homeowner','lost',2600,'lost',null,'competitor','Lost — went with solar-powered vent from Home Depot. Shamokin.','Residential',38,'Ventilation'),
    ],
    jobs: [
      dj(1,'Mike & Jen Rohrer','340 Fairground Rd, Bloomsburg PA 17815','Ventilation',3200,'Scheduled','2026-04-03',[1,2,3],'Ridge vent (42 LF) + 8 soffit vents. Materials from Boise Cascade.'),
      dj(2,'Bob Crane','2108 N Market St, Selinsgrove PA 17870','Ventilation',1800,'Complete','2026-03-17',[1,2,3,4,5,6,7,8,9,10,11],'Ridge vent + soffits installed. Airflow verified.'),
      dj(3,'Klinger Trucking Warehouse','1100 Industrial Park Rd, Milton PA 17847','Ventilation',4800,'Scheduled','2026-04-07',[1,2],'Exhaust fans + ridge vent. Northumberland County permit pulled.'),
    ],
  },
  'Emergency Tarp': {
    leads: [
      dl(1,'Flickinger Residence','Carol Flickinger','Homeowner','active',1200,'inspection_scheduled','2026-03-25',null,'Oak tree fell on roof — active water into upstairs bedroom. Tarp ASAP. Middleburg.','Residential',12,'Emergency Tarp'),
      dl(2,'Sunbury Urgent Care','Dr. Amir Fahad','Owner','active',800,'lead','2026-03-23',null,'Wind ripped off ridge cap. Rain coming tonight. Emergency call.','Commercial',1,'Emergency Tarp'),
      dl(3,'Comfort Inn Selinsgrove','Mark Steele','GM','active',2400,'contract_signed','2026-03-24',null,'Large section of flat roof membrane peeled back. 3 rooms flooding.','Commercial',3,'Emergency Tarp'),
      dl(4,'Osei Residence','Kwame Osei','Homeowner','active',900,'inspection_scheduled','2026-03-26',null,'Tree limb punched through roof during ice storm. 4x6 ft hole. Williamsport.','Residential',2,'Emergency Tarp'),
      dl(5,'Dreisbach Church','Rev. Tim Carroll','Admin','stalled',1400,'estimate_sent','2026-03-22','budget_freeze','Wind peeled shingles off north slope. Tarped but needs permanent fix.','Institutional',15,'Emergency Tarp'),
      dl(6,'Susquehanna Industrial Bldg 3','Nick Etter','Operations Mgr','active',1800,'contract_signed','2026-03-26',null,'Roof puncture from fallen HVAC unit in storm. Tarped same day.','Commercial',5,'Emergency Tarp'),
      dl(7,'Davis Residence','Ron Davis','Homeowner','won',650,'paid',null,null,'Closed! Emergency tarp after March storm. Full replacement sold. Watsontown.','Residential',8,'Emergency Tarp'),
      dl(8,'Danville Heritage Villas','Dave Moyer','Board President','cold',3200,'lead','2026-04-05','timing','3 units need emergency tarps. HOA management approval slow.','HOA',18,'Emergency Tarp'),
      dl(9,'Bloomsburg Elementary','Phil Long','Facilities Dir','lost',1100,'lost',null,'competitor','Lost — school used in-house maintenance crew for tarp.','Institutional',22,'Emergency Tarp'),
    ],
    jobs: [
      dj(1,'Carol Flickinger','56 Maple Ave, Middleburg PA 17842','Emergency Tarp',1200,'Scheduled','2026-03-25',[1,2],'Tree damage. Tarp dispatch. Full replacement to follow.'),
      dj(2,'Ron Davis','610 Main St, Watsontown PA 17777','Emergency Tarp',650,'Complete','2026-03-18',[1,2,3,4,5,6,7,8],'Tarped same day. Sold full replacement.'),
      dj(3,'Comfort Inn Selinsgrove','1 Comfort Ln, Selinsgrove PA 17870','Emergency Tarp',2400,'In Progress','2026-03-24',[1,2,3,4],'Flat roof membrane tarped. Permanent fix scheduled.'),
    ],
  },
};

// ─── Trade Select Screen ───────────────────────────────────────────────────────
const CUSTOM_TRADE_DEMO = {
  checklist: [
    'Site inspection & measurements',
    'Panel layout and trim plan',
    'Material order (panels, trim, fasteners)',
    'Tear off existing roof',
    'Install underlayment & ice shield',
    'Install metal panels',
    'Install ridge cap & trim',
    'Seal & flash all penetrations',
    'Final inspection & nail sweep',
  ],
  pipeline: ['Lead', 'Inspection', 'Estimate', 'Contract', 'Install', 'Complete'],
};

function TradeSelectScreen({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customResult, setCustomResult] = useState(null); // {name, checklist, pipeline}
  const [customError, setCustomError] = useState('');
  const goToSignup = () => { window.location.href = '/'; };

  const handleTryIt = () => {
    setCustomResult({ name: 'Metal Roofing', ...CUSTOM_TRADE_DEMO });
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
            See RidgeOS in action
          </div>
          <div style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
            Pick a job type to see a live demo tailored to your roofing business
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
              + Add your<br/>job type
            </div>
          </div>
        </div>

        {/* Custom trade panel */}
        {showCustom && (
          <div style={{
            background: '#161b27', border: '1px solid #253048',
            borderRadius: 12, padding: '20px 20px',
            marginBottom: 32,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
              ✨ Custom Job Type Generator
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              AI builds your job checklist and pipeline stages automatically.
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input
                value={customInput}
                onChange={e => { setCustomInput(e.target.value); setCustomError(''); setCustomResult(null); }}
                placeholder="e.g. Metal Roofing, Slate Restoration, TPO Systems"
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
                Try it (Metal Roofing)
              </button>
              <DisabledTooltip active label="Sign up to generate your own job type">
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
                      🔒 Sign up to generate your own job type with real data
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
                  background: '#161b27', border: '1px solid #253048',
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

// ─── Global Photo Log (real users) ───────────────────────────────────────────
function GlobalPhotoLog() {
  const [photos, setPhotos] = useState([]);
  const [jobFilter, setJobFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobile();

  const loadPhotos = useCallback(() => {
    photoDB.getAll().then(all => {
      setPhotos(all.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const handleDelete = async (id) => {
    await photoDB.remove(id);
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (lightbox && lightbox.id === id) setLightbox(null);
  };

  const jobIds = [...new Set(photos.map(p => p.jobId))];
  const filtered = jobFilter === 'all' ? photos : photos.filter(p => p.jobId === jobFilter);

  const formatTs = (ts) => new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const gridCols = isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))';

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>Loading photos…</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Photo Log</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {photos.length > 0
              ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} · open a job card to add more`
              : 'Job site documentation — open any job card to upload photos'}
          </div>
        </div>
      </div>

      {/* Job filter pills — only when multiple jobs have photos */}
      {jobIds.length > 1 && (
        <div style={{
          display: 'flex', gap: 6, marginBottom: 16,
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', paddingBottom: 4,
        }}>
          <button style={S.filterBtn(jobFilter === 'all')} onClick={() => setJobFilter('all')}>
            All ({photos.length})
          </button>
          {jobIds.map(jid => {
            const name = photos.find(p => p.jobId === jid)?.jobName || jid;
            const count = photos.filter(p => p.jobId === jid).length;
            return (
              <button key={jid} style={S.filterBtn(jobFilter === jid)} onClick={() => setJobFilter(jid)}>
                {name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {photos.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          border: '1px dashed #1e2535', borderRadius: 12,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>No photos yet</div>
          <div style={{ fontSize: 13, color: '#475569', maxWidth: 300, margin: '0 auto' }}>
            Open any job from the Pipeline tab, then tap the Photos tab inside the job card.
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 10 }}>
            {filtered.map(photo => (
              <div
                key={photo.id}
                onClick={() => setLightbox(photo)}
                style={{
                  position: 'relative', borderRadius: 8, overflow: 'hidden',
                  cursor: 'pointer', border: '1px solid #253048',
                  aspectRatio: '4/3', background: '#0d1117',
                }}
              >
                <img
                  src={photo.imageData}
                  alt={photo.caption || 'Job photo'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(0,0,0,0.7)', padding: '6px 8px',
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: '#e2e8f0', marginBottom: 1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {photo.jobName || 'Unknown job'}
                  </div>
                  {photo.caption && (
                    <div style={{
                      fontSize: 10, color: '#94a3b8',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {photo.caption}
                    </div>
                  )}
                </div>
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                  background: 'rgba(249,115,22,0.85)', color: '#fff',
                }}>
                  {STAGE_LABELS[photo.stage] || photo.stage}
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {lightbox && (
            <div
              style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                background: 'rgba(0,0,0,0.93)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: 16,
              }}
              onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
            >
              <img
                src={lightbox.imageData}
                alt={lightbox.caption || ''}
                style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{
                marginTop: 12, display: 'flex', gap: 10, alignItems: 'center',
                flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480, textAlign: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{lightbox.jobName}</span>
                {lightbox.caption && (
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{lightbox.caption}</span>
                )}
                <span style={{ fontSize: 11, color: '#64748b' }}>{formatTs(lightbox.timestamp)}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 8,
                  background: 'rgba(249,115,22,0.15)', color: '#f97316',
                  border: '1px solid rgba(249,115,22,0.3)',
                }}>
                  {STAGE_LABELS[lightbox.stage] || lightbox.stage}
                </span>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setLightbox(null)}
                  style={{
                    padding: '8px 20px', borderRadius: 7,
                    background: '#1a1f2e', border: '1px solid #2d3748',
                    color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(lightbox.id)}
                  style={{
                    padding: '8px 20px', borderRadius: 7,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Add Job Modal ────────────────────────────────────────────────────────────
function AddJobModal({ onSave, onClose }) {
  const isMobile = useMobile();
  const [form, setForm] = useState({
    customer: '', address: '', trade: 'Full Replacement', value: '', scheduledDate: '', notes: '',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.customer.trim()) e.customer = true;
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) e.value = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: Date.now(),
      customer: form.customer.trim(),
      address: form.address.trim(),
      trade: form.trade,
      value: Math.round(Number(form.value)),
      status: 'Scheduled',
      scheduledDate: form.scheduledDate || new Date().toISOString().slice(0, 10),
      completedSteps: [],
      notes: form.notes.trim(),
    });
  };

  const mobOverlay = isMobile ? { ...S.overlay, padding: 0, alignItems: 'flex-end' } : S.overlay;
  const mobModal = isMobile
    ? { ...S.modal, maxWidth: '100vw', width: '100vw', maxHeight: '90dvh', borderRadius: '16px 16px 0 0', margin: 0 }
    : { ...S.modal, maxWidth: 520 };
  const fi = (field) => ({
    ...FI, fontSize: isMobile ? 16 : 13, padding: isMobile ? '13px 14px' : '9px 12px',
    border: `1px solid ${errors[field] ? '#ef4444' : '#1e2535'}`,
  });

  return (
    <div style={mobOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={mobModal}>
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ ...S.modalTitle, paddingRight: 48 }}>Add New Job</div>
        <div style={S.modalSub}>Required fields marked with *</div>

        <label style={FLbl}>Customer Name *</label>
        <input style={fi('customer')} value={form.customer} onChange={e => set('customer', e.target.value)} placeholder="Customer or company name" />

        <label style={FLbl}>Job Address</label>
        <input style={fi('address')} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, Mechanicsburg PA 17055" />

        <div style={isMobile ? {} : FRow}>
          <div>
            <label style={FLbl}>Job Type</label>
            <select style={fi('trade')} value={form.trade} onChange={e => set('trade', e.target.value)}>
              {TRADE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={FLbl}>Job Value *</label>
            <input style={fi('value')} value={form.value} onChange={e => set('value', e.target.value)} placeholder="15000" type="number" min="0" />
          </div>
        </div>

        <label style={FLbl}>Scheduled Date</label>
        <input style={fi('scheduledDate')} value={form.scheduledDate} onChange={e => set('scheduledDate', e.target.value)} type="date" />

        <label style={FLbl}>Notes</label>
        <textarea style={{ ...fi('notes'), minHeight: 72, resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Job details, materials, crew notes..." />

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="ri-btn ri-btn-secondary" style={{ flex: 1, padding: '10px 16px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 500 }} onClick={onClose}>Cancel</button>
          <button className="ri-btn ri-btn-primary" style={{ flex: 2, padding: '10px 16px', background: 'linear-gradient(135deg, #f97316, #e8640c)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 10px rgba(249,115,22,0.3)' }} onClick={handleSave}>Add Job</button>
        </div>
      </div>
    </div>
  );
}

// ─── Job Crew Section ──────────────────────────────────────────────────────────
function JobCrewSection({ job, crew, assignments, onAssign, onUnassign, onAddCrew }) {
  const [entries, setEntries] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [showAssign, setShowAssign] = useState(false);
  const [newName, setNewName] = useState('');
  // Local state for demo/read-only mode so UI still feels functional
  const [localAssignedIds, setLocalAssignedIds] = useState([]);
  const [localCrew, setLocalCrew] = useState([]);
  const newNameRef = useRef(null);
  const isMobile = useMobile();

  // Merge persisted + local assignments/crew so both modes work
  const persistedIds = assignments[String(job.id)] || [];
  const assignedIds = [...new Set([...persistedIds, ...localAssignedIds])];
  const allCrew = [...crew, ...localCrew];
  const assignedCrew = allCrew.filter(m => assignedIds.includes(m.id));
  const unassignedCrew = allCrew.filter(m => !assignedIds.includes(m.id));

  const refresh = useCallback(() => {
    timeDB.getAll().then(all => {
      setEntries(all.filter(e => String(e.jobId) === String(job.id)));
    }).catch(() => {});
  }, [job.id]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const hasOpen = entries.some(e => !e.clockOut);
    if (!hasOpen) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [entries]);

  useEffect(() => {
    if (showAssign && newNameRef.current) newNameRef.current.focus();
  }, [showAssign]);

  const clockedInEntry = (memberId) => entries.find(e => e.crewMemberId === memberId && !e.clockOut);
  const memberTotalMs = (memberId) => computeTotalMs(entries.filter(e => e.crewMemberId === memberId));

  const handleClockIn = async (member) => {
    await timeDB.add({ id: `te-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, jobId: String(job.id), crewMemberId: member.id, clockIn: Date.now(), clockOut: null });
    refresh();
  };
  const handleClockOut = async (member) => {
    const open = clockedInEntry(member.id);
    if (!open) return;
    await timeDB.put({ ...open, clockOut: Date.now() });
    refresh();
  };

  const doAssign = (memberId) => {
    if (onAssign) onAssign(job.id, memberId);
    else setLocalAssignedIds(prev => [...prev, memberId]);
  };
  const doUnassign = (memberId) => {
    if (onUnassign) onUnassign(job.id, memberId);
    else setLocalAssignedIds(prev => prev.filter(id => id !== memberId));
  };

  const handleCreateAndAssign = () => {
    const name = newName.trim();
    if (!name) return;
    const id = `crew-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const member = { id, name, role: '', phone: '', specialties: [] };
    if (onAddCrew) onAddCrew(member);
    else setLocalCrew(prev => [...prev, member]);
    doAssign(id);
    setNewName('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={S.sectionLabel}>Crew</div>
        <button
          style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, background: showAssign ? '#1e2535' : 'rgba(249,115,22,0.12)', border: `1px solid ${showAssign ? '#2d3748' : 'rgba(249,115,22,0.3)'}`, color: showAssign ? '#94a3b8' : '#f97316', cursor: 'pointer' }}
          onClick={() => { setShowAssign(s => !s); setNewName(''); }}
        >
          {showAssign ? 'Done' : '+ Assign Crew'}
        </button>
      </div>

      {showAssign && (
        <div style={{ background: '#0f1117', border: '1px solid #253048', borderRadius: 8, padding: '12px', marginBottom: 12 }}>
          {/* Text input — always visible, fastest path */}
          <div style={{ display: 'flex', gap: 8, marginBottom: unassignedCrew.length > 0 ? 10 : 4 }}>
            <input
              ref={newNameRef}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreateAndAssign(); } }}
              placeholder="Type crew member name…"
              style={{ flex: 1, background: '#161b27', border: '1px solid #2d3748', borderRadius: 7, color: '#f1f5f9', fontSize: 13, padding: '8px 10px', fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={handleCreateAndAssign}
              disabled={!newName.trim()}
              style={{ padding: '8px 14px', background: newName.trim() ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#1e2535', border: 'none', borderRadius: 7, color: newName.trim() ? '#fff' : '#475569', fontWeight: 700, fontSize: 12, cursor: newName.trim() ? 'pointer' : 'not-allowed' }}
            >
              Add
            </button>
          </div>
          {/* Existing unassigned crew */}
          {unassignedCrew.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>Or pick from your crew:</div>
              {unassignedCrew.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 7, marginBottom: 4, background: '#161b27', border: '1px solid #253048' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#64748b' }}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{member.name}</div>
                    {member.role && <div style={{ fontSize: 11, color: '#475569' }}>{member.role}</div>}
                  </div>
                  <button
                    onClick={() => doAssign(member.id)}
                    style={{ padding: '5px 12px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 6, color: '#f97316', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
          {unassignedCrew.length === 0 && !newName && (
            <div style={{ fontSize: 11, color: '#475569', fontStyle: 'italic' }}>All crew members are assigned.</div>
          )}
        </div>
      )}

      {/* Assigned crew */}
      {assignedCrew.length === 0 && !showAssign && (
        <div style={{ fontSize: 12, color: '#475569', padding: '4px 0 8px' }}>
          No crew assigned yet. Click <span style={{ color: '#f97316' }}>+ Assign Crew</span> above.
        </div>
      )}
      {assignedCrew.map(member => {
        const open = clockedInEntry(member.id);
        const totalMs = memberTotalMs(member.id);
        const elapsed = open ? (now - open.clockIn) : 0;
        return (
          <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isMobile ? '14px 12px' : '10px 12px', borderRadius: 8, marginBottom: 6, background: open ? 'rgba(34,197,94,0.06)' : '#0f1117', border: `1px solid ${open ? 'rgba(34,197,94,0.25)' : '#1e2535'}` }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: open ? '#22c55e' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: open ? '#fff' : '#64748b' }}>
              {member.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{member.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {open
                  ? <span style={{ color: '#22c55e' }}>● Clocked in · {fmtDuration(elapsed)}</span>
                  : `Total: ${fmtDuration(totalMs)}`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                style={{ padding: isMobile ? '8px 10px' : '5px 9px', borderRadius: 6, border: '1px solid #2d3748', background: 'transparent', color: '#475569', fontSize: 11, fontWeight: 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => doUnassign(member.id)}
              >
                Remove
              </button>
              <button
                style={{ padding: isMobile ? '10px 14px' : '7px 12px', minWidth: isMobile ? 90 : 80, borderRadius: 7, border: 'none', background: open ? '#ef4444' : '#22c55e', color: '#fff', fontWeight: 700, fontSize: isMobile ? 13 : 12, cursor: 'pointer', flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}
                onClick={() => open ? handleClockOut(member) : handleClockIn(member)}
              >
                {open ? 'Clock Out' : 'Clock In'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Crew Member Modal ──────────────────────────────────────────────────────────
function CrewMemberModal({ member, onSave, onClose }) {
  const isMobile = useMobile();
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [specialties, setSpecialties] = useState(member?.specialties || []);
  const [nameErr, setNameErr] = useState(false);

  const toggleSpecialty = (trade) => {
    setSpecialties(prev => prev.includes(trade) ? prev.filter(t => t !== trade) : [...prev, trade]);
  };

  const handleSave = () => {
    if (!name.trim()) { setNameErr(true); return; }
    onSave({
      id: member?.id || `crew-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(), role: role.trim(), phone: phone.trim(), specialties,
    });
  };

  const mobOverlay = isMobile ? { ...S.overlay, padding: 0, alignItems: 'flex-end' } : S.overlay;
  const mobModal = isMobile
    ? { ...S.modal, maxWidth: '100vw', width: '100vw', maxHeight: '90dvh', borderRadius: '16px 16px 0 0', margin: 0 }
    : { ...S.modal, maxWidth: 520 };
  const inp = (err) => ({ ...FI, fontSize: isMobile ? 16 : 13, padding: isMobile ? '13px 14px' : '9px 12px', border: `1px solid ${err ? '#ef4444' : '#1e2535'}` });

  return (
    <div style={mobOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={mobModal}>
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ ...S.modalTitle, paddingRight: 48 }}>{member ? 'Edit Crew Member' : 'Add Crew Member'}</div>
        <div style={S.modalSub}>Profile and job type specialties</div>

        <label style={FLbl}>Name *</label>
        <input style={inp(nameErr)} value={name} onChange={e => { setName(e.target.value); setNameErr(false); }} placeholder="Full name" />
        {nameErr && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 6 }}>Name is required</div>}

        <label style={FLbl}>Role / Title</label>
        <input style={inp(false)} value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Foreman, Tear-off Crew, Install Crew, Estimator" />

        <label style={FLbl}>Phone</label>
        <input style={inp(false)} value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" type="tel" />

        <label style={FLbl}>Job Type Specialties</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {TRADE_LIST.map(trade => {
            const sel = specialties.includes(trade);
            const color = TRADE_COLORS[trade] || '#64748b';
            return (
              <button key={trade} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, border: `1px solid ${sel ? color : '#1e2535'}`, background: sel ? color + '22' : 'transparent', color: sel ? color : '#64748b', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }} onClick={() => toggleSpecialty(trade)}>
                {trade}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="ri-btn ri-btn-secondary" style={{ flex: 1, padding: '10px 16px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 500 }} onClick={onClose}>Cancel</button>
          <button className="ri-btn ri-btn-primary" style={{ flex: 2, padding: '10px 16px', background: 'linear-gradient(135deg, #f97316, #e8640c)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 10px rgba(249,115,22,0.3)' }} onClick={handleSave}>{member ? 'Save Changes' : 'Add Member'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Crew Tab ──────────────────────────────────────────────────────────────────
function CrewTab({ crew, jobs, assignments, onAddMember, onEditMember, onDeleteMember }) {
  const [allEntries, setAllEntries] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [crewModal, setCrewModal] = useState(null);
  const isMobile = useMobile();

  useEffect(() => {
    const load = () => timeDB.getAll().then(setAllEntries).catch(() => {});
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const hasOpen = allEntries.some(e => !e.clockOut);
    if (!hasOpen) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [allEntries]);

  const weekMs = weekStartMs();

  const memberStatus = (member) => {
    const open = allEntries.find(e => e.crewMemberId === member.id && !e.clockOut);
    if (!open) return { clockedIn: false, jobName: null, openEntry: null };
    const job = jobs.find(j => String(j.id) === String(open.jobId));
    return { clockedIn: true, jobName: job ? job.customer : 'Unknown Job', openEntry: open };
  };

  const memberWeekMs = (member) => {
    const we = allEntries.filter(e => e.crewMemberId === member.id && e.clockIn >= weekMs);
    return computeTotalMs(we);
  };

  const memberTotalMs = (member) => computeTotalMs(allEntries.filter(e => e.crewMemberId === member.id));

  const handleSaveMember = (data) => {
    if (crewModal === 'add') onAddMember(data);
    else onEditMember(data);
    setCrewModal(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Crew</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {crew.length} member{crew.length !== 1 ? 's' : ''} · Weekly hours overview
          </div>
        </div>
        <button
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
          onClick={() => setCrewModal('add')}
        >
          + Add Member
        </button>
      </div>

      {crew.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👷</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>No crew members yet</div>
          <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Add your first team member to start tracking time on jobs.</div>
          <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }} onClick={() => setCrewModal('add')}>
            Add First Member
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {crew.map(member => {
            const status = memberStatus(member);
            const wMs = memberWeekMs(member);
            const tMs = memberTotalMs(member);
            const elapsed = status.clockedIn ? (now - status.openEntry.clockIn) : 0;
            const sessionMs = status.clockedIn ? elapsed : 0;

            return (
              <div key={member.id} style={{ background: '#161b27', border: `1px solid ${status.clockedIn ? 'rgba(34,197,94,0.3)' : '#1e2535'}`, borderRadius: 10, padding: 16, boxShadow: status.clockedIn ? '0 0 12px rgba(34,197,94,0.08)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: status.clockedIn ? '#22c55e' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: status.clockedIn ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{member.name}</div>
                    {member.role && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{member.role}</div>}
                    {member.phone && <div style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>{member.phone}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button className="ri-btn ri-btn-secondary" style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #3a4d6b', borderRadius: 6, color: '#94a3b8', cursor: 'pointer', fontSize: 11, WebkitTapHighlightColor: 'transparent' }} onClick={() => setCrewModal(member)}>Edit</button>
                    <button style={{ padding: '5px 8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', fontSize: 13, lineHeight: 1, WebkitTapHighlightColor: 'transparent' }} onClick={() => onDeleteMember(member.id)}>×</button>
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, marginBottom: 12, background: status.clockedIn ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)', border: `1px solid ${status.clockedIn ? 'rgba(34,197,94,0.25)' : '#1e2535'}` }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.clockedIn ? '#22c55e' : '#475569', display: 'inline-block' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: status.clockedIn ? '#22c55e' : '#64748b' }}>
                    {status.clockedIn ? `On job · ${status.jobName}` : 'Off duty'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div style={{ background: '#0f1117', borderRadius: 7, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>This Week</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f97316' }}>{fmtDuration(wMs + sessionMs)}</div>
                  </div>
                  <div style={{ background: '#0f1117', borderRadius: 7, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>All Time</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{fmtDuration(tMs + sessionMs)}</div>
                  </div>
                </div>

                {member.specialties && member.specialties.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {member.specialties.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: (TRADE_COLORS[t] || '#64748b') + '22', color: TRADE_COLORS[t] || '#64748b' }}>{t}</span>
                    ))}
                    {member.specialties.length > 3 && (
                      <span style={{ fontSize: 10, color: '#475569', padding: '2px 7px' }}>+{member.specialties.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {crewModal && (
        <CrewMemberModal
          member={crewModal === 'add' ? null : crewModal}
          onSave={handleSaveMember}
          onClose={() => setCrewModal(null)}
        />
      )}
    </div>
  );
}

// ─── Job Chat Panel ──────────────────────────────────────────────────────────
function JobChatPanel({ jobId, currentUser, demoMessages, onCountChange }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const isMobile = useMobile();

  const load = useCallback(() => {
    if (demoMessages) {
      const sorted = [...demoMessages].sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sorted);
      if (onCountChange) onCountChange(sorted.filter(m => m.type === 'user').length);
      return;
    }
    chatDB.getByJob(String(jobId)).then(msgs => {
      const sorted = msgs.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sorted);
      if (onCountChange) onCountChange(sorted.length);
    }).catch(() => {});
  }, [jobId, demoMessages, onCountChange]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const t = text.trim();
    if (!t || demoMessages) return;
    const msg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      jobId: String(jobId),
      senderId: 'user',
      senderName: currentUser || 'You',
      text: t,
      timestamp: Date.now(),
      type: 'user',
    };
    await chatDB.add(msg).catch(() => {});
    setText('');
    load();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const formatTs = (ts) => new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 320 }}>
      <div style={{ flex: 1, overflow: 'auto', maxHeight: 380, paddingBottom: 8 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>No messages yet</div>
            <div style={{ fontSize: 12, marginTop: 4, color: '#374151' }}>Start the conversation below</div>
          </div>
        ) : messages.map(msg => (
          msg.type === 'system' ? (
            <div key={msg.id} style={{ textAlign: 'center', padding: '5px 0', margin: '4px 0' }}>
              <span style={{ fontSize: 11, color: '#475569', background: '#0f1117', padding: '3px 12px', borderRadius: 20, border: '1px solid #253048' }}>
                {msg.text}
              </span>
            </div>
          ) : (
            <div key={msg.id} style={{ marginBottom: 14, padding: '0 2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>
                  {msg.senderName.slice(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{msg.senderName}</span>
                <span style={{ fontSize: 11, color: '#374151' }}>{formatTs(msg.timestamp)}</span>
              </div>
              <div style={{ marginLeft: 34, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</div>
            </div>
          )
        ))}
        <div ref={endRef} />
      </div>

      {!demoMessages && (
        <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #1e2535', marginTop: 4 }}>
          <textarea
            style={{
              flex: 1, padding: isMobile ? '11px 12px' : '8px 12px',
              background: '#111823', border: '1px solid #2e3d5c', borderRadius: 7,
              color: '#e2e8f0', fontSize: isMobile ? 16 : 13, fontFamily: "'Inter', -apple-system, sans-serif",
              resize: 'none', minHeight: isMobile ? 44 : 38, maxHeight: 100,
              lineHeight: 1.4, outline: 'none', boxSizing: 'border-box',
            }}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message... (Enter to send)"
            rows={1}
          />
          <button
            style={{
              padding: '8px 14px', border: 'none', borderRadius: 7,
              background: text.trim() ? 'linear-gradient(135deg, #f97316, #e8640c)' : '#1a2236',
              color: text.trim() ? '#fff' : '#475569',
              cursor: text.trim() ? 'pointer' : 'default',
              fontWeight: 600, fontSize: 13, flexShrink: 0,
              minWidth: 60, WebkitTapHighlightColor: 'transparent',
            }}
            onClick={send}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Chat Tab (global) ────────────────────────────────────────────────────────
function ChatTab({ jobs }) {
  const [allMessages, setAllMessages] = useState([]);
  const [jobFilter, setJobFilter] = useState('all');

  useEffect(() => {
    chatDB.getAll().then(msgs => {
      setAllMessages(msgs.sort((a, b) => b.timestamp - a.timestamp));
    }).catch(() => {});
  }, []);

  const jobsWithMsgs = useMemo(() => {
    const ids = [...new Set(allMessages.map(m => m.jobId))];
    return ids.map(id => jobs.find(j => String(j.id) === id)).filter(Boolean);
  }, [allMessages, jobs]);

  const filtered = useMemo(() => {
    if (jobFilter === 'all') return allMessages;
    return allMessages.filter(m => m.jobId === jobFilter);
  }, [allMessages, jobFilter]);

  const jobName = (jobId) => {
    const j = jobs.find(jb => String(jb.id) === jobId);
    return j ? j.customer : 'Unknown Job';
  };

  const formatTs = (ts) => new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Job Chat</div>
        <div style={{ fontSize: 13, color: '#64748b' }}>Recent messages across all jobs</div>
      </div>

      <div style={S.filterRow}>
        <button style={S.filterBtn(jobFilter === 'all')} onClick={() => setJobFilter('all')}>
          All Jobs ({allMessages.filter(m => m.type === 'user').length})
        </button>
        {jobsWithMsgs.map(j => (
          <button key={j.id} style={S.filterBtn(jobFilter === String(j.id))} onClick={() => setJobFilter(String(j.id))}>
            {j.customer}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>No messages yet</div>
          <div style={{ fontSize: 13 }}>Open a job and start chatting with your crew.</div>
        </div>
      ) : (
        <div>
          {filtered.map(msg => (
            msg.type === 'system' ? (
              <div key={msg.id} style={{ textAlign: 'center', padding: '4px 0', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#475569' }}>
                  {jobName(msg.jobId)} · {msg.text}
                </span>
              </div>
            ) : (
              <div key={msg.id} style={{
                background: '#161b27', border: '1px solid #253048', borderRadius: 8,
                padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>
                  {msg.senderName.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{msg.senderName}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#f97316', background: 'rgba(249,115,22,0.1)', padding: '1px 8px', borderRadius: 10 }}>{jobName(msg.jobId)}</span>
                    <span style={{ fontSize: 11, color: '#374151', marginLeft: 'auto' }}>{formatTs(msg.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.text}</div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Schedule Job Modal (reschedule existing) ──────────────────────────────────
function ScheduleJobModal({ defaultDate, jobs, onSave, onClose, targetJob }) {
  const activeJobs = jobs.filter(j => j.status !== 'Complete');
  const isReschedule = targetJob && targetJob.scheduledDate;
  const [jobId, setJobId] = useState(targetJob ? String(targetJob.id) : (activeJobs[0] ? String(activeJobs[0].id) : ''));
  const [date, setDate] = useState(targetJob ? (targetJob.scheduledDate || defaultDate || TODAY) : (defaultDate || TODAY));
  const [duration, setDuration] = useState(targetJob ? jobDuration(targetJob) : 1);

  const handleSave = () => {
    if (!jobId || !date) return;
    onSave(jobId, date, duration);
    onClose();
  };

  const btnBase = { padding: '9px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' };
  const title = targetJob ? (isReschedule ? `Reschedule — ${targetJob.customer}` : `Schedule — ${targetJob.customer}`) : 'Schedule Existing Job';

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 18, paddingRight: 40 }}>{title}</div>
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        {!targetJob && (
          <>
            <label style={FLbl}>Job</label>
            <select style={{ ...FI, marginBottom: 4 }} value={jobId} onChange={e => setJobId(e.target.value)}>
              <option value="">Select a job…</option>
              {activeJobs.map(j => <option key={j.id} value={String(j.id)}>{j.customer} — {j.trade} ({j.status})</option>)}
            </select>
          </>
        )}
        <label style={FLbl}>Start Date</label>
        <input type="date" style={{ ...FI, marginBottom: 4 }} value={date} onChange={e => setDate(e.target.value)} />
        <label style={FLbl}>Duration (days)</label>
        <input type="number" min={1} max={365} style={{ ...FI, marginBottom: 20 }} value={duration} onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button style={{ ...btnBase, background: '#1e2535', color: '#94a3b8' }} onClick={onClose}>Cancel</button>
          <button style={{ ...btnBase, background: jobId && date ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#1e2535', color: jobId && date ? '#fff' : '#475569' }} onClick={handleSave} disabled={!jobId || !date}>
            {isReschedule ? 'Reschedule' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Roofing workflow phases for checklist smart insertion ─────────────────────
const ROOFING_WORKFLOW_PHASES = [
  { score: 1,  keys: ['site inspect', 'initial inspect', 'site visit', 'measur', 'survey', 'assess', 'estimate'] },
  { score: 2,  keys: ['permit', 'hoa', 'approv'] },
  { score: 3,  keys: ['material', 'order', 'deliv', 'suppli', 'purchas'] },
  { score: 4,  keys: ['safety', 'scaffold', 'staging', 'equipment staging', 'set up equip'] },
  { score: 5,  keys: ['tear off', 'tear-off', 'strip roof', 'remove old roof', 'demo old'] },
  { score: 6,  keys: ['deck', 'board', 'rotted', 'rot', 'plywood', 'sheathing', 'damaged wood', 'wood repair'] },
  { score: 7,  keys: ['drip edge', 'drip'] },
  { score: 8,  keys: ['ice and water', 'ice & water', 'water shield', 'ice shield'] },
  { score: 9,  keys: ['underlayment', 'roofing felt', 'synthetic felt', 'peel and stick'] },
  { score: 10, keys: ['install shingle', 'lay shingle', 'new roof', 'roof system', 'membrane', 'flat roof', 'asphalt'] },
  { score: 11, keys: ['ridge vent', 'ridge cap', 'ventilation', 'soffit vent', 'attic vent'] },
  { score: 12, keys: ['flash', 'seal', 'caulk', 'chimney', 'skylight', 'valley'] },
  { score: 13, keys: ['gutter', 'downspout', 'fascia'] },
  { score: 14, keys: ['cleanup', 'clean up', 'debris', 'haul away', 'sweep', 'disposal'] },
  { score: 15, keys: ['final inspect', 'final check', 'walkthrough', 'punch list', 'completion'] },
  { score: 16, keys: ['invoice', 'billing', 'send bill', 'statement'] },
  { score: 17, keys: ['payment', 'paid', 'receiv', 'collect payment'] },
];
function getWorkflowScore(text) {
  const lower = text.toLowerCase();
  for (const phase of ROOFING_WORKFLOW_PHASES) {
    if (phase.keys.some(k => lower.includes(k))) return phase.score;
  }
  return 14.5; // default: before final inspection
}

// ─── Quick Schedule Bar (inline panel) ─────────────────────────────────────────
function QuickScheduleBar({ date, job, userTrade, onSave, onClose }) {
  const [description, setDescription] = useState(job?.description || '');
  const [customer, setCustomer] = useState(job?.customer || '');
  const [duration, setDuration] = useState(job?.duration || 1);
  const [showChecklist, setShowChecklist] = useState(!!(job?.taskList?.length));
  const [taskList, setTaskList] = useState(job?.taskList || []);
  const [taskHistory, setTaskHistory] = useState([]); // undo stack, max 5
  const [taskInput, setTaskInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => { if (textareaRef.current) textareaRef.current.focus(); }, []);

  const isEdit = !!job;
  const displayDate = date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
  const canSave = description.trim() || customer.trim();

  const pushHistory = (list) => setTaskHistory(h => [...h.slice(-4), list]);

  const addTask = () => {
    const raw = taskInput.trim();
    if (!raw) return;
    // Detect "3. Step text" or "3) Step text" → insert at that position
    const numbered = raw.match(/^(\d+)[.)]\s*(.+)/);
    let label, insertIdx;
    if (numbered) {
      label = numbered[2].trim();
      insertIdx = Math.min(parseInt(numbered[1]) - 1, taskList.length); // clamp to end
    } else {
      label = raw;
      const newScore = getWorkflowScore(label);
      const firstHigher = taskList.map(s => getWorkflowScore(s)).findIndex(s => s > newScore);
      insertIdx = firstHigher === -1 ? taskList.length : firstHigher;
    }
    const next = [...taskList];
    next.splice(insertIdx, 0, label);
    pushHistory(taskList);
    setTaskList(next);
    setTaskInput('');
  };

  const removeTask = (i) => {
    pushHistory(taskList);
    setTaskList(prev => prev.filter((_, idx) => idx !== i));
  };

  const undo = () => {
    if (taskHistory.length === 0) return;
    setTaskList(taskHistory[taskHistory.length - 1]);
    setTaskHistory(h => h.slice(0, -1));
  };

  const useTemplate = () => {
    const tmpl = TRADE_CHECKLISTS[userTrade] || TRADE_CHECKLISTS['Full Replacement'];
    pushHistory(taskList);
    setTaskList(tmpl.map(s => s.label));
    setShowChecklist(true);
  };

  const handleSave = () => {
    if (!canSave) return;
    const desc = description.trim();
    const cust = customer.trim() || (desc ? desc.slice(0, 40) : 'Untitled');
    onSave({
      ...(isEdit ? { id: job.id } : {}),
      description: desc,
      customer: cust,
      trade: userTrade,
      scheduledDate: date,
      duration,
      taskList,
      value: job?.value || 0,
    });
    onClose();
  };

  return (
    <div style={{ background: '#161b27', border: '1px solid #2d3748', borderRadius: 10, padding: '16px 18px', marginBottom: 16, position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{isEdit ? 'Edit Entry' : '+ Schedule'}</span>
          {displayDate && <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{displayDate}</span>}
          <span style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}>{userTrade}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>×</button>
      </div>

      {/* Main textarea */}
      <textarea
        ref={textareaRef}
        value={description}
        onChange={e => setDescription(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSave(); }}
        placeholder={`What's happening this day? (e.g. Roof replacement, final inspection, material delivery…)`}
        rows={3}
        style={{ width: '100%', boxSizing: 'border-box', background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 14, padding: '10px 12px', resize: 'vertical', fontFamily: 'inherit', outline: 'none', marginBottom: 10 }}
      />

      {/* Secondary fields */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          value={customer}
          onChange={e => setCustomer(e.target.value)}
          placeholder="Client name (optional)"
          style={{ flex: '2 1 160px', background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 13, padding: '8px 10px', fontFamily: 'inherit', outline: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '1 1 120px' }}>
          <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>Duration:</span>
          <input
            type="number" min={1} max={365} value={duration}
            onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: 54, background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 13, padding: '7px 8px', textAlign: 'center', fontFamily: 'inherit', outline: 'none' }}
          />
          <span style={{ fontSize: 12, color: '#475569' }}>day{duration !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Checklist toggle */}
      <div style={{ marginBottom: showChecklist ? 10 : 0 }}>
        <button
          onClick={() => setShowChecklist(v => !v)}
          style={{ background: 'none', border: 'none', color: showChecklist ? '#f97316' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: showChecklist ? 8 : 0 }}
        >
          {showChecklist ? '▾ Checklist' : '▸ Add Checklist'}
        </button>
        {!showChecklist && taskList.length > 0 && <span style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}>{taskList.length} items</span>}

        {showChecklist && (
          <div style={{ background: '#0f1117', border: '1px solid #253048', borderRadius: 8, padding: '10px 12px' }}>
            {/* Input row */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask(); } }}
                placeholder='Step name, or "3. Step" to insert at position 3…'
                style={{ flex: 1, background: '#161b27', border: '1px solid #2d3748', borderRadius: 6, color: '#f1f5f9', fontSize: 12, padding: '6px 10px', fontFamily: 'inherit', outline: 'none' }}
              />
              <button onClick={useTemplate} style={{ padding: '6px 10px', background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6, color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Use {userTrade} template
              </button>
            </div>
            {/* Undo row */}
            {taskHistory.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <button onClick={undo} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                  ↩ Undo{taskHistory.length > 1 ? ` (${taskHistory.length} steps)` : ''}
                </button>
              </div>
            )}
            {/* Steps list */}
            {taskList.length === 0 && <div style={{ fontSize: 11, color: '#475569', fontStyle: 'italic' }}>No steps yet — type above or use the template</div>}
            {taskList.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < taskList.length - 1 ? '1px solid #1e2535' : 'none' }}>
                <span style={{ fontSize: 11, color: '#475569', minWidth: 18, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ flex: 1, fontSize: 12, color: '#94a3b8' }}>{t}</span>
                <button onClick={() => removeTask(i)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: '#334155', marginRight: 'auto' }}>Ctrl+Enter to save</span>
        <button onClick={onClose} style={{ padding: '7px 16px', background: '#1e2535', border: '1px solid #2d3748', borderRadius: 8, color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{ padding: '7px 20px', background: canSave ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#1e2535', border: 'none', borderRadius: 8, color: canSave ? '#fff' : '#475569', fontSize: 13, fontWeight: 700, cursor: canSave ? 'pointer' : 'not-allowed' }}
        >
          {isEdit ? 'Update' : 'Schedule'}
        </button>
      </div>
    </div>
  );
}

// ─── Stage Change Modal ─────────────────────────────────────────────────────────
function StageChangeModal({ job, onSave, onClose }) {
  const stages = [
    { key: 'materials_ordered', label: 'Materials Ordered', color: '#8b5cf6' },
    { key: 'scheduled_for_install', label: 'Scheduled for Install', color: '#06b6d4' },
    { key: 'in_progress', label: 'In Progress', color: '#f97316' },
    { key: 'punch_list', label: 'Punch List', color: '#ec4899' },
    { key: 'completed', label: 'Completed', color: '#22c55e' },
    { key: 'invoiced', label: 'Invoiced', color: '#a855f7' },
    { key: 'paid', label: 'Paid', color: '#14b8a6' },
  ];
  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 300 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, paddingRight: 40 }}>Change Stage</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 18 }}>{job.customer} · {job.trade}</div>
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stages.map(s => (
            <button key={s.key} onClick={() => { onSave(s.key); onClose(); }} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${s.color}44`, background: `${s.color}18`, color: s.color, fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Assign Crew Panel ─────────────────────────────────────────────────────
function QuickAssignCrewPanel({ job, crew, assignments, onAssign, onUnassign, onClose }) {
  const assignedIds = assignments[String(job.id)] || [];
  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 340 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, paddingRight: 40 }}>Assign Crew</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{job.customer} · {job.trade}</div>
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        {crew.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#475569', fontSize: 13, padding: '16px 0' }}>No crew members added yet. Go to the Crew tab to add your team.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {crew.map(m => {
              const assigned = assignedIds.includes(m.id);
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#0f1117', border: `1px solid ${assigned ? 'rgba(249,115,22,0.3)' : '#1e2535'}`, borderRadius: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: assigned ? '#f97316' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: assigned ? '#fff' : '#64748b', flexShrink: 0 }}>
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{m.role}</div>
                  </div>
                  <button onClick={() => assigned ? onUnassign(job.id, m.id) : onAssign(job.id, m.id)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer', background: assigned ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)', color: assigned ? '#ef4444' : '#f97316' }}>
                    {assigned ? 'Remove' : '+ Add'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <button style={{ marginTop: 16, width: '100%', padding: '10px', background: '#1e2535', border: 'none', borderRadius: 8, color: '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer' }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

// ─── Today's Summary Panel ───────────────────────────────────────────────────────
function TodaySummaryPanel({ jobs, crew, assignments, conflicts, onJobClick }) {
  const todayJobs = useMemo(() => jobs.filter(j => jobOccupiesDate(j, TODAY)), [jobs]);
  const unassignedToday = useMemo(() => todayJobs.filter(j => !(assignments[String(j.id)] || []).length), [todayJobs, assignments]);
  return (
    <div style={{ marginTop: 24, background: '#161b27', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>Today's Dispatch</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(TODAY + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right' }}>
          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{todayJobs.length}</span> jobs ·{' '}
          <span style={{ color: unassignedToday.length ? '#f97316' : '#22c55e', fontWeight: 700 }}>{unassignedToday.length}</span> unassigned
        </div>
      </div>
      {todayJobs.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#475569', fontSize: 13, padding: '12px 0' }}>No jobs scheduled today</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: crew.length > 0 ? 16 : 0 }}>
          {todayJobs.map(job => {
            const tc = TRADE_COLORS[job.trade] || '#64748b';
            const assignedCrew = (assignments[String(job.id)] || []).map(id => crew.find(m => m.id === id)).filter(Boolean);
            const hasConflict = assignedCrew.some(m => conflicts.has(`${m.id}-${String(job.id)}`));
            return (
              <div key={job.id} onClick={() => onJobClick(job)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#0f1117', border: `1px solid ${hasConflict ? 'rgba(239,68,68,0.3)' : '#1e2535'}`, borderLeft: `3px solid ${tc}`, borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.customer}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{job.trade} · {jobDuration(job)}d</div>
                </div>
                {assignedCrew.length > 0 ? (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {assignedCrew.slice(0, 3).map(m => (
                      <div key={m.id} title={m.name} style={{ width: 22, height: 22, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: '#f97316', fontWeight: 600 }}>Unassigned</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {crew.length > 0 && (
        <>
          <div style={S.sectionLabel}>Crew Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 6 }}>
            {crew.map(member => {
              const memberJobs = todayJobs.filter(j => (assignments[String(j.id)] || []).includes(member.id));
              const busy = memberJobs.length > 0;
              const hasConflict = memberJobs.some(j => conflicts.has(`${member.id}-${String(j.id)}`));
              return (
                <div key={member.id} style={{ padding: '8px 10px', borderRadius: 8, background: '#0f1117', border: `1px solid ${hasConflict ? 'rgba(239,68,68,0.3)' : busy ? 'rgba(249,115,22,0.2)' : '#1e2535'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: busy ? '#f97316' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: busy ? '#fff' : '#64748b' }}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
                    <div style={{ fontSize: 10, color: hasConflict ? '#ef4444' : busy ? '#f97316' : '#22c55e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hasConflict ? '⚠ Conflict' : busy ? memberJobs[0].customer : 'Available'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Calendar: Context Menu ─────────────────────────────────────────────────────
function CalendarContextMenu({ job, x, y, onView, onReschedule, onAssignCrew, onChangeStage, onRemove, onComplete, onDelete }) {
  const tc = TRADE_COLORS[job.trade] || '#64748b';
  const items = [
    { label: 'View Details', action: onView, icon: '📋' },
    { label: 'Reschedule', action: onReschedule, icon: '📅' },
    { label: 'Assign Crew', action: onAssignCrew, icon: '👷' },
    { label: 'Change Stage', action: onChangeStage, icon: '🔄' },
    job.status !== 'Complete' ? { label: 'Mark Complete', action: onComplete, icon: '✓', color: '#22c55e' } : null,
    { label: 'Remove from Calendar', action: onRemove, icon: '✕', color: '#ef4444' },
    { label: 'Delete Job', action: onDelete, icon: '🗑', color: '#ef4444' },
  ].filter(Boolean);
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 2000, background: '#1e293b', border: `1px solid ${tc}44`, borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', minWidth: 200, overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px 6px', fontSize: 11, fontWeight: 700, color: '#64748b', borderBottom: '1px solid #334155', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{job.customer}</div>
      {items.map(item => (
        <button key={item.label} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: 'none', border: 'none', color: item.color || '#e2e8f0', fontSize: 13, cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
          <span style={{ width: 16, textAlign: 'center' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── Calendar: Day Dispatch ─────────────────────────────────────────────────────
function DayDispatch({ dateStr, jobs, crew, assignments, conflicts, onClose, onJobClick, onCreateForDate }) {
  const d = new Date(dateStr + 'T12:00:00');
  const dayJobs = jobs.filter(j => jobOccupiesDate(j, dateStr));

  return (
    <div style={{ background: '#161b27', border: '1px solid #253048', borderRadius: 10, padding: 16, marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14, gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
            {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{dayJobs.length} job{dayJobs.length !== 1 ? 's' : ''} scheduled</div>
        </div>
        {onCreateForDate && (
          <button onClick={onCreateForDate} style={{ padding: '6px 14px', background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
            + New Job
          </button>
        )}
        {onClose && <button style={{ ...S.closeBtn, position: 'relative', top: 'auto', right: 'auto', flexShrink: 0 }} onClick={onClose}>×</button>}
      </div>

      {dayJobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#475569', fontSize: 13 }}>No jobs scheduled this day</div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {dayJobs.map(job => {
            const tc = TRADE_COLORS[job.trade] || '#64748b';
            const assignedCrew = (assignments[String(job.id)] || []).map(id => crew.find(m => m.id === id)).filter(Boolean);
            const hasConflict = assignedCrew.some(m => conflicts.has(`${m.id}-${String(job.id)}`));
            return (
              <div
                key={job.id}
                onClick={() => onJobClick && onJobClick(job)}
                style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 6, background: '#0f1117', border: `1px solid ${hasConflict ? 'rgba(239,68,68,0.4)' : '#1e2535'}`, borderLeft: `3px solid ${tc}`, cursor: onJobClick ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{job.customer}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: tc + '22', color: tc }}>{job.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: assignedCrew.length ? 6 : 0 }}>
                  {job.trade} · {job.scheduledDate} → {jobEndDate(job)} · {jobDuration(job)}d
                </div>
                {assignedCrew.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {assignedCrew.map(m => (
                      <span key={m.id} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: '#1e2535', color: conflicts.has(`${m.id}-${String(job.id)}`) ? '#ef4444' : '#94a3b8' }}>
                        {m.name}{conflicts.has(`${m.id}-${String(job.id)}`) ? ' ⚠' : ''}
                      </span>
                    ))}
                  </div>
                )}
                {hasConflict && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>⚠ Crew conflict on this date</div>}
              </div>
            );
          })}
        </div>
      )}

      {crew.length > 0 && (
        <div>
          <div style={S.sectionLabel}>Crew Availability</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {crew.map(member => {
              const memberJobs = dayJobs.filter(j => (assignments[String(j.id)] || []).includes(member.id));
              const busy = memberJobs.length > 0;
              return (
                <div key={member.id} style={{ padding: '8px 10px', borderRadius: 7, background: '#0f1117', border: `1px solid ${busy ? 'rgba(249,115,22,0.3)' : '#1e2535'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: busy ? '#f97316' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: busy ? '#fff' : '#64748b' }}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
                    <div style={{ fontSize: 10, color: busy ? '#f97316' : '#22c55e' }}>{busy ? memberJobs[0].customer : 'Available'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar: Month View ─────────────────────────────────────────────────────
function MonthView({ days, currentMonth, today, dayJobsFn, onDayClick, selectedDate, onJobClick, onJobContextMenu, dragJobId, dragOverDate, onDragStart, onDragOver, onDrop, onDragEnd, dayNotes }) {
  const isMobile = useMobile();
  const DAY_NAMES = isMobile ? ['S','M','T','W','T','F','S'] : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAY_NAMES.map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '4px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {days.map(dateStr => {
          const dayJobs = dayJobsFn(dateStr);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const isDragOver = dragOverDate === dateStr && dragJobId;
          const inMonth = dateStr.slice(0, 7) === currentMonth;
          const maxVis = isMobile ? 1 : 3;
          const overflow = dayJobs.length - maxVis;
          return (
            <div
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              onDragOver={e => { e.preventDefault(); if (onDragOver) onDragOver(dateStr); }}
              onDrop={e => { e.preventDefault(); const jid = e.dataTransfer.getData('jobId'); if (jid && onDrop) onDrop(jid, dateStr); }}
              onDragLeave={() => { if (onDragOver) onDragOver(null); }}
              style={{ minHeight: isMobile ? 52 : 80, background: isDragOver ? 'rgba(249,115,22,0.15)' : isSelected ? 'rgba(249,115,22,0.1)' : '#161b27', border: `1px solid ${isDragOver ? '#f97316' : isSelected ? '#f97316' : isToday ? 'rgba(249,115,22,0.5)' : '#1e2535'}`, borderRadius: 6, padding: isMobile ? '3px 4px' : '5px 6px', cursor: 'pointer', overflow: 'hidden', opacity: inMonth ? 1 : 0.35 }}
            >
              <div style={{ marginBottom: 2 }}>
                {isToday
                  ? <span style={{ background: '#f97316', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{parseInt(dateStr.slice(8))}</span>
                  : <span style={{ fontSize: isMobile ? 10 : 12, color: '#94a3b8' }}>{parseInt(dateStr.slice(8))}</span>
                }
              </div>
              {dayJobs.slice(0, maxVis).map(job => {
                const tc = TRADE_COLORS[job.trade] || '#64748b';
                const isDragging = dragJobId === String(job.id);
                return (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={e => { e.stopPropagation(); e.dataTransfer.setData('jobId', String(job.id)); e.dataTransfer.effectAllowed = 'move'; if (onDragStart) onDragStart(String(job.id)); }}
                    onDragEnd={() => { if (onDragEnd) onDragEnd(); }}
                    onClick={e => { e.stopPropagation(); onJobClick && onJobClick(job); }}
                    onContextMenu={e => { e.preventDefault(); e.stopPropagation(); onJobContextMenu && onJobContextMenu(job, e); }}
                    style={{ fontSize: isMobile ? 9 : 10, fontWeight: 600, background: tc + '22', color: tc, borderLeft: `2px solid ${tc}`, padding: isMobile ? '1px 3px' : '2px 5px', borderRadius: '0 3px 3px 0', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'grab', opacity: isDragging ? 0.4 : 1 }}
                  >
                    {isMobile ? (job.description || job.customer).slice(0, 6) : (job.description || job.customer).split(' ').slice(0, 3).join(' ')}
                  </div>
                );
              })}
              {overflow > 0 && <div style={{ fontSize: 9, color: '#475569', padding: '1px 2px' }}>+{overflow}</div>}
              {dayNotes && dayNotes[dateStr] && <div style={{ fontSize: 8, color: '#818cf8', lineHeight: 1, paddingTop: 1 }}>&#128221;</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calendar: Week View ──────────────────────────────────────────────────────
function WeekView({ days, today, dayJobsFn, onDayClick, selectedDate, onJobClick, onJobContextMenu, dragJobId, dragOverDate, onDragStart, onDragOver, onDrop, onDragEnd, dayNotes }) {
  const isMobile = useMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? 2 : 6 }}>
      {days.map(dateStr => {
        const dayJobs = dayJobsFn(dateStr);
        const isToday = dateStr === today;
        const isSelected = dateStr === selectedDate;
        const isDragOver = dragOverDate === dateStr && dragJobId;
        const d = new Date(dateStr + 'T12:00:00');
        return (
          <div
            key={dateStr}
            onClick={() => onDayClick(dateStr)}
            onDragOver={e => { e.preventDefault(); if (onDragOver) onDragOver(dateStr); }}
            onDrop={e => { e.preventDefault(); const jid = e.dataTransfer.getData('jobId'); if (jid && onDrop) onDrop(jid, dateStr); }}
            onDragLeave={() => { if (onDragOver) onDragOver(null); }}
            style={{ background: isDragOver ? 'rgba(249,115,22,0.12)' : isSelected ? 'rgba(249,115,22,0.08)' : '#161b27', border: `1px solid ${isDragOver ? '#f97316' : isSelected ? '#f97316' : isToday ? 'rgba(249,115,22,0.5)' : '#1e2535'}`, borderRadius: 8, padding: isMobile ? '6px 4px' : '10px 8px', cursor: 'pointer', minHeight: 100 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div style={{ fontSize: isMobile ? 13 : 18, fontWeight: 700, color: isToday ? '#fff' : '#f1f5f9', background: isToday ? '#f97316' : 'transparent', borderRadius: '50%', width: isMobile ? 22 : 28, height: isMobile ? 22 : 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px auto 0' }}>
                {d.getDate()}
              </div>
            </div>
            {dayJobs.map(job => {
              const tc = TRADE_COLORS[job.trade] || '#64748b';
              const isDragging = dragJobId === String(job.id);
              return (
                <div
                  key={job.id}
                  draggable
                  onDragStart={e => { e.stopPropagation(); e.dataTransfer.setData('jobId', String(job.id)); e.dataTransfer.effectAllowed = 'move'; if (onDragStart) onDragStart(String(job.id)); }}
                  onDragEnd={() => { if (onDragEnd) onDragEnd(); }}
                  onClick={e => { e.stopPropagation(); onJobClick && onJobClick(job); }}
                  onContextMenu={e => { e.preventDefault(); e.stopPropagation(); onJobContextMenu && onJobContextMenu(job, e); }}
                  style={{ fontSize: isMobile ? 9 : 10, fontWeight: 600, padding: isMobile ? '2px 4px' : '3px 6px', borderRadius: 4, background: tc + '22', color: tc, borderLeft: `2px solid ${tc}`, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'grab', opacity: isDragging ? 0.4 : 1 }}
                >
                  {isMobile ? (job.description || job.customer).slice(0, 6) : (job.description || job.customer)}
                </div>
              );
            })}
            {dayNotes && dayNotes[dateStr] && (
              <div style={{ fontSize: 9, color: '#818cf8', marginTop: 4, padding: '2px 4px', background: 'rgba(99,102,241,0.1)', borderRadius: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                &#128221; {dayNotes[dateStr].slice(0, 18)}{dayNotes[dateStr].length > 18 ? '…' : ''}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Day Action Modal ──────────────────────────────────────────────────────────
function DayActionModal({ date, allJobs, assignments, crew, existingNote, onScheduleExisting, onCreateNew, onAddNote, onClose }) {
  const [mode, setMode] = useState('menu'); // 'menu' | 'schedule' | 'create' | 'note' | 'dayDetail'
  const [note, setNote] = useState(existingNote || '');
  const [description, setDescription] = useState('');
  const [customer, setCustomer] = useState('');
  const [duration, setDuration] = useState(1);
  const [search, setSearch] = useState('');
  const [justScheduled, setJustScheduled] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedJobId, setSchedJobId] = useState('');
  const [schedCrew, setSchedCrew] = useState([]);
  const [schedTime, setSchedTime] = useState('7:00 AM');
  const [schedHours, setSchedHours] = useState(8);
  const [schedNotes, setSchedNotes] = useState('');
  const noteRef = useRef(null);
  const descRef = useRef(null);
  const searchRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => { if (mode === 'note' && noteRef.current) noteRef.current.focus(); }, [mode]);
  useEffect(() => { if (mode === 'create' && descRef.current) descRef.current.focus(); }, [mode]);
  useEffect(() => { if (mode === 'schedule' && searchRef.current) searchRef.current.focus(); }, [mode]);
  useEffect(() => {
    if (!justScheduled) return;
    const t = setTimeout(() => closeRef.current(), 1300);
    return () => clearTimeout(t);
  }, [justScheduled]);

  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const subTitle = mode === 'menu' ? 'What would you like to do?'
    : mode === 'schedule' ? 'Tap a job to schedule or reschedule it'
    : mode === 'create' ? 'Quick-create a new job'
    : mode === 'dayDetail' ? 'Jobs, crew, and hours at a glance'
    : 'Add a note for this day';

  const backBtn = (
    <button
      onClick={() => setMode('menu')}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '2px 0', marginBottom: 14 }}
    >
      &#8592; Back
    </button>
  );

  const actionBtn = (icon, label, sub, onClick) => (
    <button
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '13px 16px', background: '#161b27', border: '1px solid #253048', borderRadius: 9, cursor: 'pointer', textAlign: 'left', marginBottom: 8, WebkitTapHighlightColor: 'transparent' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#253048'; e.currentTarget.style.background = '#161b27'; }}
    >
      <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );

  const jobs = allJobs || [];
  const q = search.toLowerCase();
  const filtered = q ? jobs.filter(j => (j.description || '').toLowerCase().includes(q) || (j.customer || '').toLowerCase().includes(q)) : jobs;
  const unscheduledSection = filtered.filter(j => !j.scheduledDate || j.explicitlyScheduled === false);
  const scheduledSection = filtered.filter(j => j.scheduledDate && j.explicitlyScheduled !== false);

  const crewLabel = (jobId) => {
    const ids = (assignments || {})[String(jobId)] || [];
    const names = ids.map(id => (crew || []).find(m => m.id === id)).filter(Boolean).map(m => m.name);
    return names.length ? names.join(', ') : null;
  };

  const JobRow = ({ job }) => {
    const alreadyHere = job.scheduledDate === date;
    const crewNames = crewLabel(job.id);
    const fmtDate = job.scheduledDate ? new Date(job.scheduledDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unscheduled';
    return (
      <button
        onClick={alreadyHere ? undefined : () => { onScheduleExisting(date, job.id); setJustScheduled(job); }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: alreadyHere ? '#0f1117' : '#161b27', border: '1px solid #253048', borderRadius: 8, cursor: alreadyHere ? 'default' : 'pointer', textAlign: 'left', width: '100%', boxSizing: 'border-box', opacity: alreadyHere ? 0.5 : 1 }}
        onMouseEnter={alreadyHere ? undefined : (e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; })}
        onMouseLeave={alreadyHere ? undefined : (e => { e.currentTarget.style.borderColor = '#253048'; e.currentTarget.style.background = '#161b27'; })}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: alreadyHere ? '#64748b' : '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.description || job.customer}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>
            {job.customer && job.description ? `${job.customer} · ` : ''}{job.status || ''}{fmtDate ? ` · ${fmtDate}` : ''}
          </div>
          {crewNames && <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>&#128100; {crewNames}</div>}
        </div>
        {alreadyHere
          ? <span style={{ fontSize: 10, color: '#475569', flexShrink: 0, whiteSpace: 'nowrap' }}>Already here</span>
          : <span style={{ fontSize: 11, color: '#f97316', fontWeight: 700, flexShrink: 0 }}>&#8594;</span>
        }
      </button>
    );
  };

  const SuccessView = ({ icon, title, sub }) => (
    <div style={{ textAlign: 'center', padding: '28px 0' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#4ade80', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>
    </div>
  );

  const dayIsMobile = useMobile();
  const dayOverlay = dayIsMobile ? { ...S.overlay, padding: 0, alignItems: 'flex-end' } : S.modalOverlay;
  const dayModalStyle = dayIsMobile
    ? { ...S.modal, maxWidth: '100vw', width: '100vw', maxHeight: '90dvh', borderRadius: '16px 16px 0 0', margin: 0, padding: '20px 16px 24px' }
    : { ...S.modal, maxWidth: mode === 'dayDetail' ? 560 : 400 };

  return (
    <div style={dayOverlay} onClick={onClose}>
      <div style={dayModalStyle} onClick={e => e.stopPropagation()}>
        <button className="ri-close-btn" style={S.closeBtn} onClick={onClose}>×</button>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>Dispatch Board</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{displayDate}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>{subTitle}</div>

        {mode === 'menu' && (
          <div>
            {(() => {
              const dayJobs = (allJobs || []).filter(j => jobOccupiesDate(j, date));
              const dayCrewCount = new Set(dayJobs.flatMap(j => (assignments || {})[String(j.id)] || [])).size;
              return actionBtn('📊', 'Day Detail',
                dayJobs.length > 0 ? `${dayJobs.length} job${dayJobs.length !== 1 ? 's' : ''} · ${dayCrewCount} crew` : 'No jobs scheduled',
                () => setMode('dayDetail')
              );
            })()}
            {actionBtn('📋', 'Schedule / Reschedule Job',
              jobs.length > 0 ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} in pipeline` : 'Pick from pipeline jobs',
              () => setMode('schedule')
            )}
            {actionBtn('✏️', 'Create New Job', 'Quick-create and schedule for this date',
              () => setMode('create')
            )}
            {actionBtn('📝', existingNote ? 'Edit Note' : 'Add Note',
              existingNote ? `"${existingNote.slice(0, 40)}${existingNote.length > 40 ? '…' : ''}"` : 'Office closed, rain day, site visit…',
              () => setMode('note')
            )}
          </div>
        )}

        {mode === 'schedule' && !justScheduled && (
          <div>
            {backBtn}
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job or client name&#8230;"
              style={{ width: '100%', boxSizing: 'border-box', background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 13, padding: '8px 12px', fontFamily: 'inherit', outline: 'none', marginBottom: 12 }}
            />
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#475569', fontSize: 13, padding: '20px 0' }}>No jobs match your search.</div>
            ) : (
              <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {unscheduledSection.length > 0 && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Unscheduled</div>
                    {unscheduledSection.map(job => <JobRow key={job.id} job={job} />)}
                  </>
                )}
                {scheduledSection.length > 0 && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: unscheduledSection.length > 0 ? 10 : 0, marginBottom: 3 }}>Reschedule</div>
                    {scheduledSection.map(job => <JobRow key={job.id} job={job} />)}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'schedule' && justScheduled && (
          <SuccessView icon="✅" title="Scheduled!" sub={`${justScheduled.description || justScheduled.customer} → ${displayDate}`} />
        )}

        {mode === 'create' && !justScheduled && (
          <div>
            {backBtn}
            <input
              ref={descRef}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Job description (required)"
              style={{ width: '100%', boxSizing: 'border-box', background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 14, padding: '10px 12px', fontFamily: 'inherit', outline: 'none', marginBottom: 8 }}
            />
            <input
              value={customer}
              onChange={e => setCustomer(e.target.value)}
              placeholder="Client name (optional)"
              style={{ width: '100%', boxSizing: 'border-box', background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 14, padding: '10px 12px', fontFamily: 'inherit', outline: 'none', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>Duration (days):</label>
              <input
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={e => setDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                style={{ width: 60, background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 14, padding: '8px 10px', fontFamily: 'inherit', outline: 'none', textAlign: 'center' }}
              />
            </div>
            <button
              onClick={() => {
                if (description.trim()) {
                  onCreateNew(date, { description: description.trim(), customer: customer.trim(), duration });
                  setJustScheduled({ description: description.trim() });
                }
              }}
              disabled={!description.trim()}
              style={{ width: '100%', padding: '10px', background: description.trim() ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#1e2535', border: 'none', borderRadius: 7, color: description.trim() ? '#fff' : '#475569', fontWeight: 700, fontSize: 13, cursor: description.trim() ? 'pointer' : 'not-allowed' }}
            >
              Create &amp; Schedule
            </button>
          </div>
        )}

        {mode === 'create' && justScheduled && (
          <SuccessView icon="✅" title="Job Created!" sub={`${justScheduled.description} scheduled for ${displayDate}`} />
        )}

        {mode === 'note' && !justScheduled && (
          <div>
            {backBtn}
            <textarea
              ref={noteRef}
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) { if (note.trim()) { onAddNote(date, note.trim()); setJustScheduled({ description: note.trim() }); } } }}
              placeholder="e.g. Office closed, rain day, equipment delivery&#8230;"
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box', background: '#0f1117', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 14, padding: '10px 12px', resize: 'none', fontFamily: 'inherit', outline: 'none', marginBottom: 10 }}
            />
            <div style={{ fontSize: 11, color: '#334155', marginBottom: 10 }}>Ctrl+Enter to save</div>
            <button
              onClick={() => { if (note.trim()) { onAddNote(date, note.trim()); setJustScheduled({ description: note.trim() }); } }}
              disabled={!note.trim()}
              style={{ width: '100%', padding: '9px', background: note.trim() ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#1e2535', border: 'none', borderRadius: 7, color: note.trim() ? '#fff' : '#475569', fontWeight: 700, fontSize: 13, cursor: note.trim() ? 'pointer' : 'not-allowed' }}
            >
              Save Note
            </button>
          </div>
        )}

        {mode === 'note' && justScheduled && (
          <SuccessView icon="&#128221;" title="Note Saved!" sub={`Visible on ${displayDate}`} />
        )}

        {mode === 'dayDetail' && (() => {
          const dayJobs = jobs.filter(j => jobOccupiesDate(j, date));
          const demoDay = DEMO_DAY_DETAIL[date] || {};
          const allCrewIds = new Set();
          const jobDetails = dayJobs.map(job => {
            const jid = typeof job.id === 'number' ? job.id : String(job.id);
            const assignedIds = (assignments || {})[String(job.id)] || [];
            const demoEntries = demoDay[jid] || [];
            const steps = TRADE_CHECKLISTS[job.trade] || TRADE_CHECKLISTS['Full Replacement'] || [];
            const completedCount = (job.completedSteps || []).length;
            const nextStep = steps[completedCount] || steps[steps.length - 1] || { label: 'Complete' };
            const crewDetails = assignedIds.map(cid => {
              allCrewIds.add(cid);
              const member = (crew || []).find(m => m.id === cid);
              const demoEntry = demoEntries.find(e => e.crewId === cid) || {};
              return {
                id: cid,
                name: member?.name || cid,
                role: member?.role || '',
                clockIn: demoEntry.clockIn || '—',
                status: demoEntry.status || 'Scheduled',
                hoursLogged: demoEntry.hoursLogged || 0,
                payRate: demoEntry.payRate || 0,
              };
            });
            // Also include demo entries for crew not in assignments (e.g. if demo has extra data)
            demoEntries.forEach(e => {
              if (!assignedIds.includes(e.crewId)) {
                allCrewIds.add(e.crewId);
                const member = (crew || []).find(m => m.id === e.crewId);
                crewDetails.push({
                  id: e.crewId, name: member?.name || e.crewId, role: member?.role || '',
                  clockIn: e.clockIn || '—', status: e.status || 'Scheduled',
                  hoursLogged: e.hoursLogged || 0, payRate: e.payRate || 0,
                });
              }
            });
            const crewHours = crewDetails.reduce((s, c) => s + c.hoursLogged, 0);
            const totalHours = crewHours > 0 ? crewHours : (job.hours || 0);
            const totalLabor = crewHours > 0 ? crewDetails.reduce((s, c) => s + c.hoursLogged * c.payRate, 0) : totalHours * 30;
            return { job, crewDetails, totalHours, totalLabor, completedCount, totalSteps: steps.length, nextStep };
          });
          const grandHours = jobDetails.reduce((s, d) => s + d.totalHours, 0);
          const grandLabor = jobDetails.reduce((s, d) => s + d.totalLabor, 0);
          const grandValue = dayJobs.reduce((s, j) => s + (j.value || 0), 0);
          const statusColor = (s) => ({ 'On Site': '#22c55e', 'Traveling': '#3b82f6', 'Break': '#f59e0b', 'Clocked Out': '#64748b', 'Scheduled': '#475569' }[s] || '#475569');
          const pill = (text, bg, fg) => ({ display: 'inline-block', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 8, background: bg, color: fg, marginLeft: 4 });
          const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 16, marginBottom: 8 };
          const card = { background: '#161b27', border: '1px solid #253048', borderRadius: 8, padding: '12px 14px', marginBottom: 8 };

          return (
            <div>
              {backBtn}
              {/* Day Totals */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 4 }}>
                <div style={{ background: '#161b27', border: '1px solid #253048', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#f97316' }}>{grandHours.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Total Hours</div>
                </div>
                <div style={{ background: '#161b27', border: '1px solid #253048', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>{allCrewIds.size}</div>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Crews Deployed</div>
                </div>
                <div style={{ background: '#161b27', border: '1px solid #253048', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>${grandValue.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Active Job Value</div>
                </div>
              </div>

              {dayJobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '28px 0', color: '#475569', fontSize: 13 }}>No jobs scheduled for this date.</div>
              )}

              {/* Jobs Scheduled */}
              {jobDetails.length > 0 && (
                <>
                  <div style={sectionLabel}>Jobs Scheduled ({jobDetails.length})</div>
                  {jobDetails.map(({ job, crewDetails: jcrew, totalHours: jHours, totalLabor: jLabor, completedCount, totalSteps, nextStep }) => {
                    const tc = TRADE_COLORS[job.trade] || '#f97316';
                    const estMargin = job.value > 0 ? Math.round((1 - jLabor / job.value) * 100) : null;
                    return (
                      <div key={job.id} style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.customer}</div>
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{job.address || ''}</div>
                          </div>
                          <span style={{ ...pill('', tc + '22', tc), marginLeft: 8 }}>{job.trade}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', marginBottom: 8, flexWrap: 'wrap' }}>
                          <span>${(job.value || 0).toLocaleString()}</span>
                          <span>{jHours.toFixed(1)} hrs today</span>
                          <span>${jLabor.toFixed(0)} labor</span>
                          {estMargin !== null && <span style={{ color: estMargin > 40 ? '#22c55e' : estMargin > 20 ? '#f59e0b' : '#ef4444' }}>{estMargin}% est. margin</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 4, background: '#1e2535', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${(completedCount / totalSteps) * 100}%`, height: '100%', background: tc, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0 }}>{completedCount}/{totalSteps}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Current: <span style={{ color: '#94a3b8' }}>{nextStep.label}</span></div>

                        {/* Crew on this job */}
                        {jcrew.length > 0 && (
                          <div style={{ marginTop: 8, borderTop: '1px solid #1e2535', paddingTop: 8 }}>
                            {jcrew.map(c => (
                              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12 }}>
                                <span style={{ color: '#e2e8f0', fontWeight: 600, minWidth: 100 }}>{c.name}</span>
                                <span style={{ color: '#475569', fontSize: 10, minWidth: 60 }}>{c.role}</span>
                                <span style={pill(c.status, statusColor(c.status) + '22', statusColor(c.status))}>{c.status}</span>
                                <span style={{ color: '#64748b', fontSize: 10, marginLeft: 'auto' }}>{c.clockIn} · {c.hoursLogged.toFixed(1)}h</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {jcrew.length === 0 && (
                          <div style={{ fontSize: 11, color: '#475569', fontStyle: 'italic', marginTop: 6 }}>No crew assigned</div>
                        )}
                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, borderTop: '1px solid #1e2535', paddingTop: 8 }}>
                          <button onClick={() => { onClose(); setTimeout(() => { const sel = (allJobs || []).find(j => String(j.id) === String(job.id)); if (sel) onScheduleExisting(date, null); }, 100); }} style={{ flex: 1, padding: '6px', background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6, color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>View Job</button>
                          <button style={{ flex: 1, padding: '6px', background: '#10b98118', border: '1px solid #10b98144', borderRadius: 6, color: '#10b981', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Message Crew</button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Crew On Duty summary */}
              {allCrewIds.size > 0 && (
                <>
                  <div style={sectionLabel}>Crew On Duty ({allCrewIds.size})</div>
                  <div style={card}>
                    {Array.from(allCrewIds).map(cid => {
                      const member = (crew || []).find(m => m.id === cid);
                      const memberJobs = jobDetails.filter(d => d.crewDetails.some(c => c.id === cid));
                      const memberEntries = memberJobs.flatMap(d => d.crewDetails.filter(c => c.id === cid));
                      const totalH = memberEntries.reduce((s, e) => s + e.hoursLogged, 0);
                      const status = memberEntries[0]?.status || 'Scheduled';
                      const clockIn = memberEntries[0]?.clockIn || '—';
                      return (
                        <div key={cid} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #1e2535', fontSize: 12 }}>
                          <div style={{ minWidth: 110 }}>
                            <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{member?.name || cid}</div>
                            <div style={{ fontSize: 10, color: '#475569' }}>{member?.role || ''}</div>
                          </div>
                          <div style={{ flex: 1, fontSize: 11, color: '#64748b' }}>
                            {memberJobs.map(d => d.job.customer).join(', ')}
                          </div>
                          <span style={pill(status, statusColor(status) + '22', statusColor(status))}>{status}</span>
                          <div style={{ textAlign: 'right', minWidth: 60 }}>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{totalH.toFixed(1)}h</div>
                            <div style={{ fontSize: 9, color: '#475569' }}>in {clockIn}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* + Schedule Job */}
              {!showScheduleForm ? (
                <button
                  onClick={() => setShowScheduleForm(true)}
                  style={{ width: '100%', padding: '11px', marginTop: 12, marginBottom: 4, background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  + Schedule Job
                </button>
              ) : (
                <div style={{ ...card, marginTop: 12, border: '1px solid #7c3aed44' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 10 }}>Schedule a Job for {displayDate}</div>
                  <select value={schedJobId} onChange={e => setSchedJobId(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 13, marginBottom: 8, outline: 'none', fontFamily: 'inherit' }}>
                    <option value="">— Select a job —</option>
                    {jobs.filter(j => !j.scheduledDate || j.status === 'Scheduled').map(j => (
                      <option key={j.id} value={String(j.id)}>{j.customer} — {j.trade} (${(j.value || 0).toLocaleString()})</option>
                    ))}
                  </select>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Assign Crew</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {(crew || []).map(m => {
                      const sel = schedCrew.includes(m.id);
                      return (
                        <button key={m.id} onClick={() => setSchedCrew(prev => sel ? prev.filter(x => x !== m.id) : [...prev, m.id])} style={{ padding: '4px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600, border: sel ? '1px solid #7c3aed' : '1px solid #1e2535', background: sel ? 'rgba(124,58,237,0.15)' : 'transparent', color: sel ? '#a78bfa' : '#94a3b8', cursor: 'pointer' }}>
                          {m.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Start Time</div>
                      <select value={schedTime} onChange={e => setSchedTime(e.target.value)} style={{ width: '100%', padding: '7px 8px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}>
                        {['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Est. Hours</div>
                      <input type="number" min={1} max={12} value={schedHours} onChange={e => setSchedHours(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))} style={{ width: '100%', padding: '7px 8px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <input value={schedNotes} onChange={e => setSchedNotes(e.target.value)} placeholder="Notes (optional)" style={{ width: '100%', padding: '7px 10px', background: '#111823', border: '1px solid #2e3d5c', borderRadius: 6, color: '#e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        if (schedJobId) {
                          onScheduleExisting(date, schedJobId);
                          setShowScheduleForm(false);
                          setSchedJobId(''); setSchedCrew([]); setSchedNotes('');
                        }
                      }}
                      disabled={!schedJobId}
                      style={{ flex: 1, padding: '9px', background: schedJobId ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#1e2535', border: 'none', borderRadius: 6, color: schedJobId ? '#fff' : '#475569', fontWeight: 700, fontSize: 12, cursor: schedJobId ? 'pointer' : 'not-allowed' }}
                    >
                      Add to Schedule
                    </button>
                    <button onClick={() => setShowScheduleForm(false)} style={{ padding: '9px 14px', background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6, color: '#94a3b8', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Hours Summary */}
              {jobDetails.length > 0 && (
                <>
                  <div style={sectionLabel}>Hours Summary</div>
                  <div style={card}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '4px 12px', fontSize: 11, color: '#64748b' }}>
                      <div style={{ fontWeight: 700, color: '#94a3b8' }}>Job</div>
                      <div style={{ fontWeight: 700, color: '#94a3b8', textAlign: 'right' }}>Hours</div>
                      <div style={{ fontWeight: 700, color: '#94a3b8', textAlign: 'right' }}>Labor $</div>
                      <div style={{ fontWeight: 700, color: '#94a3b8', textAlign: 'right' }}>Margin</div>
                      {jobDetails.map(d => {
                        const em = d.job.value > 0 ? Math.round((1 - d.totalLabor / d.job.value) * 100) : null;
                        return (
                          <div key={d.job.id} style={{ display: 'contents' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: 4 }}>{d.job.customer}</div>
                            <div style={{ textAlign: 'right', paddingTop: 4 }}>{d.totalHours.toFixed(1)}</div>
                            <div style={{ textAlign: 'right', paddingTop: 4 }}>${d.totalLabor.toFixed(0)}</div>
                            <div style={{ textAlign: 'right', paddingTop: 4, color: em !== null ? (em > 40 ? '#22c55e' : em > 20 ? '#f59e0b' : '#ef4444') : '#475569' }}>{em !== null ? `${em}%` : '—'}</div>
                          </div>
                        );
                      })}
                      <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #253048', marginTop: 4 }} />
                      <div style={{ fontWeight: 700, color: '#f1f5f9', paddingTop: 4 }}>Totals</div>
                      <div style={{ textAlign: 'right', fontWeight: 700, color: '#f1f5f9', paddingTop: 4 }}>{grandHours.toFixed(1)}</div>
                      <div style={{ textAlign: 'right', fontWeight: 700, color: '#f1f5f9', paddingTop: 4 }}>${grandLabor.toFixed(0)}</div>
                      <div style={{ textAlign: 'right', fontWeight: 700, color: grandValue > 0 ? '#22c55e' : '#475569', paddingTop: 4 }}>{grandValue > 0 ? `${Math.round((1 - grandLabor / grandValue) * 100)}%` : '—'}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Calendar Tab ─────────────────────────────────────────────────────────────
function CalendarTab({ jobs, crew, assignments, onSchedule, onComplete, onUpdateSteps, onAssign, onUnassign, onAddCrew, currentUser, demoMessages, customChecklist, isDemo, onCreate, onUpdate, onChangeStage, onDeleteJob, userTrade }) {
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(new Date(TODAY + 'T12:00:00'));
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayActionModal, setDayActionModal] = useState(null); // null | { date }
  const [dayNotes, setDayNotes] = useState({});               // { [dateStr]: string }
  const [quickBar, setQuickBar] = useState(null);             // null | { date, job }
  const [scheduleModal, setScheduleModal] = useState(null);   // null | { defaultDate, targetJob }
  const [selectedJob, setSelectedJob] = useState(null);
  const [stageChangeJob, setStageChangeJob] = useState(null);
  const [quickCrewJob, setQuickCrewJob] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);       // null | { job, x, y }
  const [dragJobId, setDragJobId] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const isMobile = useMobile();
  const effectiveTrade = userTrade || 'Full Replacement';

  const scheduledJobs = useMemo(() => jobs.filter(j => j.scheduledDate), [jobs]);
  const unscheduledJobs = useMemo(() => jobs.filter(j => (j.explicitlyScheduled === false || !j.scheduledDate) && j.status !== 'Complete'), [jobs]);

  const conflicts = useMemo(() => {
    const set = new Set();
    crew.forEach(member => {
      const memberJobs = scheduledJobs.filter(j => (assignments[String(j.id)] || []).includes(member.id));
      for (let i = 0; i < memberJobs.length; i++) {
        for (let k = i + 1; k < memberJobs.length; k++) {
          const a = memberJobs[i]; const b = memberJobs[k];
          if (a.scheduledDate && b.scheduledDate) {
            const aEnd = jobEndDate(a); const bEnd = jobEndDate(b);
            if (a.scheduledDate <= bEnd && b.scheduledDate <= aEnd) {
              set.add(`${member.id}-${String(a.id)}`); set.add(`${member.id}-${String(b.id)}`);
            }
          }
        }
      }
    });
    return set;
  }, [crew, assignments, scheduledJobs]);

  const navBtn = { padding: '6px 14px', background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6, color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1, WebkitTapHighlightColor: 'transparent' };
  const currentStr = toDateStr(current);

  const prev = () => { const d = new Date(current); if (view === 'month') d.setMonth(d.getMonth() - 1); else if (view === 'week') d.setDate(d.getDate() - 7); else d.setDate(d.getDate() - 1); setCurrent(d); setSelectedDate(null); };
  const next = () => { const d = new Date(current); if (view === 'month') d.setMonth(d.getMonth() + 1); else if (view === 'week') d.setDate(d.getDate() + 7); else d.setDate(d.getDate() + 1); setCurrent(d); setSelectedDate(null); };

  const dayJobsFn = useCallback((dateStr) => scheduledJobs.filter(j => jobOccupiesDate(j, dateStr)), [scheduledJobs]);

  const headerLabel = useMemo(() => {
    if (view === 'month') return current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (view === 'week') {
      const wd = buildWeekDays(currentStr);
      const s = new Date(wd[0] + 'T12:00:00'); const e = new Date(wd[6] + 'T12:00:00');
      return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [view, current, currentStr]);

  const monthDays = useMemo(() => view === 'month' ? buildMonthDays(current.getFullYear(), current.getMonth()) : [], [view, current]);
  const weekDays = useMemo(() => (view === 'week' || view === 'day') ? buildWeekDays(currentStr) : [], [view, currentStr]);
  const dispatchDate = view === 'day' ? currentStr : selectedDate;
  const currentMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;

  const closeAll = useCallback(() => { setContextMenu(null); setDragJobId(null); setDragOverDate(null); }, []);

  const handleDayClick = useCallback((dateStr) => {
    setSelectedDate(dateStr);
    setDayActionModal({ date: dateStr });
  }, []);

  const handleJobClick = useCallback((job) => {
    closeAll();
    setSelectedJob(job);
  }, [closeAll]);

  const handleJobContextMenu = useCallback((job, e) => {
    setContextMenu({ job, x: e.clientX, y: e.clientY });
  }, []);

  const handleSaveSchedule = useCallback((jobId, date, duration) => { if (onSchedule) onSchedule(jobId, date, duration); }, [onSchedule]);

  const handleDragStart = useCallback((jobId) => { setDragJobId(jobId); }, []);
  const handleDragOver = useCallback((dateStr) => { setDragOverDate(dateStr); }, []);
  const handleDrop = useCallback((jobId, dateStr) => {
    if (onSchedule) {
      const job = jobs.find(j => String(j.id) === jobId);
      onSchedule(jobId, dateStr, job ? jobDuration(job) : 1);
    }
    setDragJobId(null); setDragOverDate(null);
  }, [onSchedule, jobs]);
  const handleDragEnd = useCallback(() => { setDragJobId(null); setDragOverDate(null); }, []);

  const handleCompleteJob = useCallback((id) => { if (onComplete) onComplete(id); setSelectedJob(null); }, [onComplete]);

  const sharedGridProps = { dayJobsFn, onDayClick: handleDayClick, selectedDate, onJobClick: handleJobClick, onJobContextMenu: !isDemo ? handleJobContextMenu : null, dragJobId, dragOverDate, onDragStart: !isDemo ? handleDragStart : null, onDragOver: !isDemo ? handleDragOver : null, onDrop: !isDemo ? handleDrop : null, onDragEnd: !isDemo ? handleDragEnd : null, dayNotes };

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Dispatch Board</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>{scheduledJobs.length} scheduled · {unscheduledJobs.length} unscheduled</div>
        </div>
        {!isDemo && onCreate && (
          <button onClick={() => setQuickBar({ date: TODAY, job: null })} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
            + New Job
          </button>
        )}
        {!isDemo && onSchedule && (
          <button onClick={() => setScheduleModal({ defaultDate: TODAY, targetJob: null })} style={{ padding: '8px 14px', background: '#1e2535', border: '1px solid #2d3748', borderRadius: 8, color: '#94a3b8', fontWeight: 600, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
            Schedule Existing
          </button>
        )}
        <div style={{ display: 'flex', gap: 4 }}>
          {['month', 'week', 'day'].map(v => (
            <button key={v} style={{ ...S.filterBtn(view === v), padding: '6px 12px', minHeight: 32, fontSize: 12 }} onClick={() => { setView(v); setSelectedDate(null); }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Nav row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button style={navBtn} onClick={prev}>‹</button>
        <button style={{ ...navBtn, fontSize: 12, padding: '6px 12px' }} onClick={() => { setCurrent(new Date(TODAY + 'T12:00:00')); setSelectedDate(null); }}>Today</button>
        <button style={navBtn} onClick={next}>›</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: isMobile ? 13 : 15, fontWeight: 700, color: '#f1f5f9' }}>{headerLabel}</div>
        {dragJobId && <span style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}>Drop to reschedule</span>}
      </div>

      {/* ── Quick Schedule Bar ── */}
      {quickBar && (
        <QuickScheduleBar
          date={quickBar.date}
          job={quickBar.job}
          userTrade={effectiveTrade}
          onSave={jobData => {
            if (jobData.id) { if (onUpdate) onUpdate(jobData); }
            else { if (onCreate) onCreate(jobData); }
          }}
          onClose={() => setQuickBar(null)}
        />
      )}

      {/* ── Unscheduled banner ── */}
      {unscheduledJobs.length > 0 && (
        <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#f97316', fontWeight: 600, flexShrink: 0 }}>⚠ {unscheduledJobs.length} need scheduling:</span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flex: 1 }}>
            {unscheduledJobs.slice(0, 5).map(j => (
              <button key={j.id} onClick={() => setScheduleModal({ defaultDate: TODAY, targetJob: j })} style={{ fontSize: 11, color: '#94a3b8', background: '#1e2535', padding: '2px 8px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                {j.customer}
              </button>
            ))}
            {unscheduledJobs.length > 5 && <span style={{ fontSize: 11, color: '#475569' }}>+{unscheduledJobs.length - 5} more</span>}
          </div>
        </div>
      )}

      {/* ── Calendar grid ── */}
      {view === 'month' && <MonthView days={monthDays} currentMonth={currentMonth} today={TODAY} {...sharedGridProps} />}
      {view === 'week' && <WeekView days={weekDays} today={TODAY} {...sharedGridProps} />}

      {/* ── Day dispatch panel ── */}
      {dispatchDate && (
        <DayDispatch
          dateStr={dispatchDate}
          jobs={jobs}
          crew={crew}
          assignments={assignments}
          conflicts={conflicts}
          onClose={view !== 'day' ? () => setSelectedDate(null) : null}
          onJobClick={handleJobClick}
          onCreateForDate={!isDemo && onCreate ? () => setQuickBar({ date: dispatchDate, job: null }) : null}
        />
      )}

      {/* ── Unscheduled jobs list ── */}
      {unscheduledJobs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={S.sectionLabel}>Unscheduled Jobs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {unscheduledJobs.map(job => {
              const tc = TRADE_COLORS[job.trade] || '#64748b';
              return (
                <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#161b27', border: '1px solid #253048', borderLeft: `3px solid ${tc}`, borderRadius: 8, cursor: 'pointer' }} onClick={() => handleJobClick(job)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.customer}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{job.trade} · {job.status}</div>
                  </div>
                  {!isDemo && onSchedule && (
                    <button onClick={e => { e.stopPropagation(); setScheduleModal({ defaultDate: TODAY, targetJob: job }); }} style={{ padding: '5px 12px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 6, color: '#f97316', fontWeight: 600, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
                      Schedule
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Day note ── */}
      {dispatchDate && dayNotes[dispatchDate] && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', marginTop: 8 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📝</span>
          <div style={{ flex: 1, fontSize: 13, color: '#c7d2fe' }}>{dayNotes[dispatchDate]}</div>
          <button onClick={() => setDayNotes(p => { const n = { ...p }; delete n[dispatchDate]; return n; })} style={{ background: 'none', border: 'none', color: '#475569', fontSize: 16, cursor: 'pointer', lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* ── Today's summary panel ── */}
      <TodaySummaryPanel jobs={jobs} crew={crew} assignments={assignments} conflicts={conflicts} onJobClick={handleJobClick} />

      {/* ── Modals ── */}
      {dayActionModal && (
        <DayActionModal
          date={dayActionModal.date}
          allJobs={jobs}
          assignments={assignments}
          crew={crew}
          existingNote={dayNotes[dayActionModal.date] || ''}
          onScheduleExisting={(d, jobId) => {
            if (jobId) {
              if (onSchedule) onSchedule(jobId, d);
            } else {
              setScheduleModal({ defaultDate: d, targetJob: null });
              setDayActionModal(null);
            }
          }}
          onCreateNew={(d, formData) => {
            if (formData) {
              if (onCreate) onCreate({ description: formData.description, customer: formData.customer || formData.description, duration: formData.duration, scheduledDate: d, explicitlyScheduled: true, taskList: [], status: 'In Progress', trade: effectiveTrade });
            } else {
              setQuickBar({ date: d, job: null });
              setDayActionModal(null);
            }
          }}
          onAddNote={(d, text) => setDayNotes(prev => ({ ...prev, [d]: text }))}
          onClose={() => setDayActionModal(null)}
        />
      )}
      {scheduleModal && (
        <ScheduleJobModal
          defaultDate={scheduleModal.defaultDate}
          targetJob={scheduleModal.targetJob}
          jobs={jobs}
          onSave={handleSaveSchedule}
          onClose={() => setScheduleModal(null)}
        />
      )}
      {stageChangeJob && (
        <StageChangeModal
          job={stageChangeJob}
          onSave={stage => { if (onChangeStage) onChangeStage(String(stageChangeJob.id), stage); }}
          onClose={() => setStageChangeJob(null)}
        />
      )}
      {quickCrewJob && (
        <QuickAssignCrewPanel
          job={quickCrewJob}
          crew={crew}
          assignments={assignments}
          onAssign={onAssign || (() => {})}
          onUnassign={onUnassign || (() => {})}
          onClose={() => setQuickCrewJob(null)}
        />
      )}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          customChecklist={customChecklist}
          crew={crew}
          assignments={assignments}
          onAssign={isDemo ? null : onAssign}
          onUnassign={isDemo ? null : onUnassign}
          onAddCrew={isDemo ? null : onAddCrew}
          currentUser={currentUser}
          demoMessages={demoMessages ? demoMessages.filter(m => String(m.jobId) === String(selectedJob.id)) : null}
          onComplete={isDemo ? null : id => handleCompleteJob(id)}
          onUpdateSteps={isDemo ? null : onUpdateSteps}
          onUpdateSchedule={isDemo ? null : (jobId, date, dur) => { handleSaveSchedule(jobId, date, dur); setSelectedJob(null); }}
        />
      )}

      {/* ── Context menu ── */}
      {contextMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1999 }} onClick={closeAll} />
          <CalendarContextMenu
            job={contextMenu.job}
            x={contextMenu.x}
            y={contextMenu.y}
            onView={() => { setSelectedJob(contextMenu.job); closeAll(); }}
            onReschedule={() => { setScheduleModal({ defaultDate: contextMenu.job.scheduledDate || TODAY, targetJob: contextMenu.job }); closeAll(); }}
            onAssignCrew={() => { if (!isDemo) setQuickCrewJob(contextMenu.job); closeAll(); }}
            onChangeStage={() => { if (!isDemo) setStageChangeJob(contextMenu.job); closeAll(); }}
            onRemove={() => { if (onSchedule) onSchedule(String(contextMenu.job.id), null, null); closeAll(); }}
            onComplete={() => { handleCompleteJob(String(contextMenu.job.id)); closeAll(); }}
            onDelete={() => { if (onDeleteJob) onDeleteJob(String(contextMenu.job.id)); closeAll(); }}
          />
        </>
      )}
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
    const base = TRADE_DEMO_DATA['Full Replacement'];
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
            background: 'transparent', border: '1px solid #3a4d6b',
            borderRadius: 6, color: '#94a3b8', fontSize: isMobile ? 13 : 12,
            cursor: 'pointer', padding: isMobile ? '8px 10px' : '5px 12px',
            whiteSpace: 'nowrap', minHeight: isMobile ? 38 : 'auto',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← {isMobile ? 'Back' : 'Change job type'}
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
          <JobsTab jobs={DEMO_JOBS} customChecklist={customTradeConfig?.checklist} demoMessages={DEMO_MESSAGES} />
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
  const [demoRole, setDemoRole] = useState('owner');
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadModal, setLeadModal] = useState(null); // null | 'add' | lead-object (edit)

  // Persistent leads for real (non-demo) users
  const [userLeads, setUserLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('cl_leads');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [demoLeadOverrides, setDemoLeadOverrides] = useState({});

  // Persist to localStorage whenever userLeads changes (non-demo only)
  useEffect(() => {
    if (session && !session.isDemo) {
      localStorage.setItem('cl_leads', JSON.stringify(userLeads));
    }
  }, [userLeads, session]);

  const [userCrew, setUserCrew] = useState(() => {
    try { const s = localStorage.getItem('cl_crew'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [userJobs, setUserJobs] = useState(() => {
    try { const s = localStorage.getItem('cl_jobs'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [assignments, setAssignments] = useState(() => {
    try { const s = localStorage.getItem('cl_assignments'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [jobModal, setJobModal] = useState(false);

  useEffect(() => {
    if (session && !session.isDemo) localStorage.setItem('cl_crew', JSON.stringify(userCrew));
  }, [userCrew, session]);
  useEffect(() => {
    if (session && !session.isDemo) localStorage.setItem('cl_jobs', JSON.stringify(userJobs));
  }, [userJobs, session]);
  useEffect(() => {
    if (session && !session.isDemo) localStorage.setItem('cl_assignments', JSON.stringify(assignments));
  }, [assignments, session]);

  const handleAddCrew = (member) => setUserCrew(prev => [member, ...prev]);
  const handleEditCrew = (member) => setUserCrew(prev => prev.map(m => m.id === member.id ? member : m));
  const handleDeleteCrew = (id) => setUserCrew(prev => prev.filter(m => m.id !== id));
  const handleAddJob = (job) => { setUserJobs(prev => [job, ...prev]); setJobModal(false); };
  const handleCreateAndScheduleJob = (jobData) => {
    const id = `j-${Date.now()}`;
    const newJob = {
      id,
      customer: jobData.customer,
      description: jobData.description || '',
      taskList: jobData.taskList || [],
      address: jobData.address || '',
      trade: jobData.trade,
      value: jobData.value || 0,
      status: 'Scheduled',
      scheduledDate: jobData.scheduledDate,
      duration: jobData.duration || 1,
      notes: jobData.notes || '',
      completedSteps: [],
      explicitlyScheduled: true,
    };
    setUserJobs(prev => [newJob, ...prev]);
    if (jobData.crewIds && jobData.crewIds.length) {
      setAssignments(prev => ({ ...prev, [id]: jobData.crewIds }));
    }
  };
  const handleUpdateJob = (jobData) => {
    setUserJobs(prev => prev.map(j => String(j.id) === String(jobData.id) ? { ...j, customer: jobData.customer, description: jobData.description || '', taskList: jobData.taskList || [], scheduledDate: jobData.scheduledDate, duration: jobData.duration || 1, trade: jobData.trade } : j));
    setUserLeads(prev => prev.map(l => String(l.id) === String(jobData.id) ? { ...l, name: jobData.customer, scheduledDate: jobData.scheduledDate, duration: jobData.duration || 1 } : l));
  };
  const handleChangeJobStage = (jobId, stage) => {
    const statusMap = { materials_ordered: 'Scheduled', scheduled_for_install: 'Scheduled', in_progress: 'In Progress', punch_list: 'In Progress', completed: 'Complete', invoiced: 'Complete', paid: 'Complete', lost: 'Lost' };
    setUserLeads(prev => prev.map(l => String(l.id) === String(jobId) ? { ...l, stage } : l));
    setUserJobs(prev => prev.map(j => String(j.id) === String(jobId) ? { ...j, status: statusMap[stage] || stage } : j));
  };
  const handleDeleteJob = (jobId) => {
    setUserJobs(prev => prev.filter(j => String(j.id) !== String(jobId)));
    setUserLeads(prev => prev.map(l => String(l.id) === String(jobId) ? { ...l, stage: 'lost' } : l));
    setAssignments(prev => { const n = { ...prev }; delete n[String(jobId)]; return n; });
  };
  const handleCompleteJob = (id) => {
    setUserLeads(prev => prev.map(l => l.id === id ? { ...l, stage: 'completed' } : l));
    setUserJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Complete' } : j));
  };
  const handleUpdateJobSteps = (jobId, completedSteps) => {
    setUserLeads(prev => prev.map(l => l.id === jobId ? { ...l, completedSteps } : l));
    setUserJobs(prev => prev.map(j => j.id === jobId ? { ...j, completedSteps } : j));
  };
  const handleScheduleJob = (jobId, scheduledDate, duration) => {
    setUserLeads(prev => prev.map(l => String(l.id) === String(jobId) ? { ...l, scheduledDate, duration } : l));
    setUserJobs(prev => prev.map(j => String(j.id) === String(jobId) ? { ...j, scheduledDate, duration } : j));
  };
  const handleAssign = (jobId, crewId) => {
    setAssignments(prev => ({ ...prev, [String(jobId)]: [...(prev[String(jobId)] || []), crewId] }));
    const member = userCrew.find(m => m.id === crewId);
    if (member) {
      chatDB.add({ id: `sys-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, jobId: String(jobId), senderId: 'system', senderName: 'System', text: `${member.name} assigned to this job`, timestamp: Date.now(), type: 'system' }).catch(() => {});
    }
  };
  const handleUnassign = (jobId, crewId) => {
    setAssignments(prev => ({ ...prev, [String(jobId)]: (prev[String(jobId)] || []).filter(id => id !== crewId) }));
    const member = userCrew.find(m => m.id === crewId);
    if (member) {
      chatDB.add({ id: `sys-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, jobId: String(jobId), senderId: 'system', senderName: 'System', text: `${member.name} removed from this job`, timestamp: Date.now(), type: 'system' }).catch(() => {});
    }
  };

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

  const handleLeadStageChange = (leadId, stage) => {
    if (session?.isDemo) {
      setDemoLeadOverrides(prev => {
        const cur = prev[String(leadId)] || {};
        return { ...prev, [String(leadId)]: { ...cur, stage } };
      });
    } else {
      setUserLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, stage } : l));
    }
  };

  const handleUpdateLead = (leadData) => {
    if (session?.isDemo) {
      setDemoLeadOverrides(prev => ({ ...prev, [String(leadData.id)]: leadData }));
    } else {
      setUserLeads(prev => prev.map(l => l.id === leadData.id ? { ...leadData } : l));
    }
  };

  const isMobile = useMobile();

  // Reset tab when demo role changes and current tab is not accessible
  useEffect(() => {
    if (session?.isDemo && !DEMO_ROLES[demoRole].tabs.includes(tab)) {
      setTab(DEMO_ROLES[demoRole].tabs[0] || 'pipeline');
    }
  }, [demoRole, session, tab]);

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
  const rolePerms = DEMO_ROLES[isDemo ? demoRole : 'owner'];
  const visibleTabs = isDemo ? NAV_TABS.filter(t => DEMO_ROLES[demoRole].tabs.includes(t.key)) : NAV_TABS;

  const leads = isDemo
    ? DEMO_LEADS.map(l => demoLeadOverrides[String(l.id)] ? { ...l, ...demoLeadOverrides[String(l.id)] } : l)
    : userLeads;
  const crew = isDemo ? DEMO_CREW : userCrew;

  // Derive jobs from pipeline leads that have reached a job-execution stage,
  // then append any standalone jobs added via "Add Job" (deduplicated by id).
  const derivedJobs = userLeads
    .filter(l => JOB_STAGES.includes(l.stage))
    .map(leadToJob);
  const derivedIds = new Set(derivedJobs.map(j => String(j.id)));
  const standaloneJobs = userJobs.filter(j => !derivedIds.has(String(j.id)));
  const jobs = isDemo ? DEMO_JOBS : [...derivedJobs, ...standaloneJobs];
  const effectiveAssignments = isDemo ? DEMO_ASSIGNMENTS : assignments;
  const userTrade = session?.trade || 'Full Replacement';
  const companyName = session?.companyName || 'RidgeOS';
  const userCustomChecklist = session?.customTradeConfig?.checklist || null;
  const currentUser = session?.name || session?.companyName || 'You';

  // Only expose mutators for non-demo accounts
  const addLeadHandler = isDemo ? null : () => setLeadModal('add');
  const editLeadHandler = isDemo ? null : (lead) => setLeadModal(lead);
  const deleteLeadHandler = isDemo ? null : handleDeleteLead;

  return (
    <ToastProvider>
    <GlobalStyles />
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
          {isDemo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: DEMO_ROLES[demoRole].color, flexShrink: 0 }} />
              <select
                value={demoRole}
                onChange={e => setDemoRole(e.target.value)}
                style={{
                  background: '#1a2236', border: '1px solid #3a4d6b', borderRadius: 6,
                  color: DEMO_ROLES[demoRole].color, fontSize: 11, fontWeight: 700,
                  padding: '4px 8px', cursor: 'pointer', outline: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                {Object.entries(DEMO_ROLES).map(([key, r]) => (
                  <option key={key} value={key}>{r.label}</option>
                ))}
              </select>
            </div>
          )}
          {!isMobile && companyName !== 'RidgeOS' && (
            <span style={S.logoSub}>{companyName}</span>
          )}
        </div>

        {/* Desktop tabs */}
        {!isMobile && (
          <div style={S.tabs}>
            {visibleTabs.map(({ key, label }) => (
              <button key={key} className={tab === key ? '' : 'ri-nav-tab'} style={S.tab(tab === key, SECTION_COLORS[key])} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => { setScreen('login'); setSession(null); }}
          className="ri-btn ri-btn-secondary"
          style={{
            marginLeft: 'auto', background: 'transparent', border: '1px solid #2e3d5c',
            color: '#6b7f9a', cursor: 'pointer', fontSize: isMobile ? 13 : 12,
            padding: isMobile ? '8px 10px' : '5px 12px', borderRadius: 6,
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
                demoMode={isDemo}
                onStageChange={handleLeadStageChange}
                onUpdateLead={handleUpdateLead}
                currentUser={currentUser}
                rolePerms={rolePerms}
              />
        )}
        {tab === 'callbacks' && (
          <CallbacksTab leads={leads} onSelectLead={setSelectedLead} onUpdateLead={isDemo ? null : handleUpdateLead} rolePerms={rolePerms} />
        )}
        {tab === 'analytics' && (
          <AnalyticsTab leads={leads} rolePerms={rolePerms} />
        )}
        {tab === 'jobs' && (
          jobs.length === 0
            ? <EmptyState
                icon="🔨"
                title="No jobs yet"
                sub={`Add your first ${userTrade} job to start tracking progress.`}
                btnLabel="Add your first job"
                onAction={isDemo ? null : () => setJobModal(true)}
              />
            : <JobsTab
                jobs={jobs}
                customChecklist={userCustomChecklist}
                crew={crew}
                assignments={effectiveAssignments}
                onAssign={isDemo ? null : handleAssign}
                onUnassign={isDemo ? null : handleUnassign}
                onAddCrew={isDemo ? null : handleAddCrew}
                currentUser={currentUser}
                demoMessages={isDemo ? DEMO_MESSAGES : null}
                onComplete={isDemo ? null : handleCompleteJob}
                onUpdateSteps={isDemo ? null : handleUpdateJobSteps}
                onUpdateSchedule={isDemo ? null : handleScheduleJob}
                rolePerms={rolePerms}
              />
        )}
        {tab === 'calendar' && (
          <CalendarTab
            jobs={jobs}
            crew={crew}
            assignments={effectiveAssignments}
            onSchedule={isDemo ? null : handleScheduleJob}
            onComplete={isDemo ? null : handleCompleteJob}
            onUpdateSteps={isDemo ? null : handleUpdateJobSteps}
            onAssign={isDemo ? null : handleAssign}
            onUnassign={isDemo ? null : handleUnassign}
            onAddCrew={isDemo ? null : handleAddCrew}
            currentUser={currentUser}
            demoMessages={isDemo ? DEMO_MESSAGES : null}
            customChecklist={userCustomChecklist}
            isDemo={isDemo}
            onCreate={isDemo ? null : handleCreateAndScheduleJob}
            onUpdate={isDemo ? null : handleUpdateJob}
            onChangeStage={isDemo ? null : handleChangeJobStage}
            onDeleteJob={isDemo ? null : handleDeleteJob}
            userTrade={userTrade}
          />
        )}
        {tab === 'crew' && (
          <CrewTab
            crew={crew}
            jobs={jobs}
            assignments={effectiveAssignments}
            onAddMember={isDemo ? null : handleAddCrew}
            onEditMember={isDemo ? null : handleEditCrew}
            onDeleteMember={isDemo ? null : handleDeleteCrew}
          />
        )}
        {tab === 'chat' && (
          <ChatTab jobs={jobs} />
        )}
        {tab === 'photos' && (
          <GlobalPhotoLog />
        )}
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && <BottomNav tab={tab} setTab={setTab} tabs={visibleTabs} />}

      {selectedLead && (
        <CoachPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStageChange={(newStage) => {
            handleLeadStageChange(selectedLead.id, newStage);
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

      {jobModal && (
        <AddJobModal onSave={handleAddJob} onClose={() => setJobModal(false)} />
      )}
    </div>
    </ToastProvider>
  );
}
