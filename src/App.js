import { useState, useMemo } from 'react';
import Anthropic from '@anthropic-ai/sdk';

// ─── Demo Data ───────────────────────────────────────────────────────────────
const DEMO_LEADS = [
  {
    id: 1, name: 'Nexus Software', contact: 'Sarah Chen', role: 'VP Engineering',
    status: 'stalled', value: 84000, stage: 'proposal',
    callbackDate: '2026-03-18', lastContact: '2026-03-01',
    stallReason: 'price_objection', notes: 'Wants 25% discount. Legal review pending.',
    industry: 'SaaS', dealAge: 67,
  },
  {
    id: 2, name: 'Meridian Health', contact: 'Dr. James Okafor', role: 'CTO',
    status: 'stalled', value: 210000, stage: 'negotiation',
    callbackDate: '2026-03-20', lastContact: '2026-03-05',
    stallReason: 'budget_freeze', notes: 'Q1 budget freeze. Revisit April.',
    industry: 'Healthcare', dealAge: 94,
  },
  {
    id: 3, name: 'Atlas Logistics', contact: 'Mike Torres', role: 'COO',
    status: 'active', value: 57000, stage: 'qualified',
    callbackDate: '2026-03-23', lastContact: '2026-03-19',
    stallReason: null, notes: 'Strong interest. Needs ROI deck.',
    industry: 'Logistics', dealAge: 21,
  },
  {
    id: 4, name: 'Pinnacle Retail', contact: 'Amanda Zhao', role: 'Head of Ops',
    status: 'stalled', value: 38500, stage: 'proposal',
    callbackDate: '2026-03-15', lastContact: '2026-02-28',
    stallReason: 'no_response', notes: '3 follow-ups, no reply. Try LinkedIn.',
    industry: 'Retail', dealAge: 52,
  },
  {
    id: 5, name: 'Forge Capital', contact: 'David Whitmore', role: 'Managing Director',
    status: 'active', value: 145000, stage: 'negotiation',
    callbackDate: '2026-03-25', lastContact: '2026-03-20',
    stallReason: null, notes: 'Near close. MSA being reviewed.',
    industry: 'Finance', dealAge: 38,
  },
  {
    id: 6, name: 'Stellar Edu', contact: 'Priya Nair', role: 'Dir. of Technology',
    status: 'stalled', value: 29000, stage: 'proposal',
    callbackDate: '2026-03-22', lastContact: '2026-03-10',
    stallReason: 'competitor', notes: 'Evaluating Competitor X. Price match requested.',
    industry: 'EdTech', dealAge: 44,
  },
  {
    id: 7, name: 'CoreBuild Inc', contact: 'Tony Martins', role: 'CEO',
    status: 'active', value: 92000, stage: 'qualified',
    callbackDate: '2026-03-26', lastContact: '2026-03-18',
    stallReason: null, notes: 'Pilot results positive. Upsell opportunity.',
    industry: 'Construction', dealAge: 29,
  },
  {
    id: 8, name: 'Vantage Analytics', contact: 'Lauren Kim', role: 'Data Director',
    status: 'stalled', value: 67500, stage: 'proposal',
    callbackDate: '2026-03-10', lastContact: '2026-03-02',
    stallReason: 'technical_fit', notes: 'API integration concern. Need eng call.',
    industry: 'Analytics', dealAge: 61,
  },
  {
    id: 9, name: 'Brightside Media', contact: 'Carlos Rivera', role: 'CMO',
    status: 'cold', value: 41000, stage: 'contacted',
    callbackDate: '2026-04-02', lastContact: '2026-02-14',
    stallReason: 'timing', notes: 'Reorg in progress. Follow up Q2.',
    industry: 'Media', dealAge: 87,
  },
  {
    id: 10, name: 'Quantum Dynamics', contact: 'Rachel Foster', role: 'Procurement Lead',
    status: 'won', value: 178000, stage: 'won',
    callbackDate: null, lastContact: '2026-03-15',
    stallReason: null, notes: 'Closed! Onboarding April 1.',
    industry: 'Manufacturing', dealAge: 112,
  },
  {
    id: 11, name: 'Crestline Tech', contact: 'Ethan Brooks', role: 'IT Director',
    status: 'stalled', value: 54000, stage: 'negotiation',
    callbackDate: '2026-03-23', lastContact: '2026-03-12',
    stallReason: 'wrong_contact', notes: 'Need to reach CFO not IT. Get intro.',
    industry: 'Technology', dealAge: 49,
  },
  {
    id: 12, name: 'Harborview Hotels', contact: 'Stephanie Wu', role: 'VP Ops',
    status: 'active', value: 73000, stage: 'proposal',
    callbackDate: '2026-03-24', lastContact: '2026-03-21',
    stallReason: null, notes: 'Demo went well. Proposal sent.',
    industry: 'Hospitality', dealAge: 16,
  },
  {
    id: 13, name: 'Ironclad Security', contact: 'Marcus Bell', role: 'CISO',
    status: 'lost', value: 96000, stage: 'lost',
    callbackDate: null, lastContact: '2026-03-08',
    stallReason: 'competitor', notes: 'Lost to incumbent vendor on price.',
    industry: 'Cybersecurity', dealAge: 78,
  },
  {
    id: 14, name: 'Orion Pharma', contact: 'Dr. Nina Shah', role: 'Head of IT',
    status: 'stalled', value: 320000, stage: 'negotiation',
    callbackDate: '2026-03-23', lastContact: '2026-03-14',
    stallReason: 'budget_freeze', notes: 'Big deal. CFO needs board approval.',
    industry: 'Pharma', dealAge: 103,
  },
  {
    id: 15, name: 'Clearpath Freight', contact: 'Jake Morrison', role: 'Operations VP',
    status: 'active', value: 48500, stage: 'qualified',
    callbackDate: '2026-03-27', lastContact: '2026-03-22',
    stallReason: null, notes: 'Second call scheduled. Good champion.',
    industry: 'Logistics', dealAge: 11,
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
const ROOFING_STEPS = [
  { id: 1, label: 'Site inspection / measurements' },
  { id: 2, label: 'Material order & delivery' },
  { id: 3, label: 'Install in progress' },
  { id: 4, label: 'Final inspection' },
  { id: 5, label: 'Invoice sent' },
  { id: 6, label: 'Payment received' },
];

const DEMO_JOBS = [
  {
    id: 101, customer: 'Frank & Linda Hargrove', address: '2847 Maplewood Dr, Austin TX 78745',
    trade: 'Roofing', value: 18400, status: 'In Progress',
    scheduledDate: '2026-03-20', completedSteps: [1, 2, 3],
    notes: 'GAF Timberline HDZ shingles. Crew of 4. Day 2 of 3.',
  },
  {
    id: 102, customer: 'Riverside Church of God', address: '510 Oak Creek Blvd, Houston TX 77084',
    trade: 'Roofing', value: 24750, status: 'Scheduled',
    scheduledDate: '2026-03-28', completedSteps: [1, 2],
    notes: 'Commercial flat roof. TPO membrane. 8,200 sq ft.',
  },
  {
    id: 103, customer: 'Dmitri & Aisha Volkov', address: '91 Birchwood Ct, Dallas TX 75208',
    trade: 'Roofing', value: 11200, status: 'Complete',
    scheduledDate: '2026-03-14', completedSteps: [1, 2, 3, 4, 5, 6],
    notes: 'Full tear-off and replace. CertainTeed Landmark Pro.',
  },
  {
    id: 104, customer: 'Sunridge HOA — Block C', address: '3300 Sunridge Pkwy, San Antonio TX 78230',
    trade: 'Roofing', value: 21900, status: 'In Progress',
    scheduledDate: '2026-03-18', completedSteps: [1, 2, 3, 4],
    notes: '14 townhome units. Owens Corning Duration. Final inspection tomorrow.',
  },
  {
    id: 105, customer: 'Marco & Beth Santini', address: '668 Elmwood Ave, Plano TX 75023',
    trade: 'Roofing', value: 9600, status: 'Scheduled',
    scheduledDate: '2026-04-04', completedSteps: [1],
    notes: 'Storm damage repair + partial replacement. Insurance claim approved.',
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
  logo: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f97316',
    letterSpacing: '-0.5px',
  },
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

  // Pipeline
  filterRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
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
    fontSize: 13,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  cbBadge: (color) => ({
    background: color + '22',
    color,
    padding: '1px 8px',
    borderRadius: 10,
    fontSize: 11,
  }),
  cbRow: (hovered) => ({
    background: hovered ? '#1a2035' : '#161b27',
    border: '1px solid #1e2535',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: 'pointer',
    transition: 'background 0.15s',
  }),
  cbDate: (overdue) => ({
    fontSize: 13,
    fontWeight: 600,
    color: overdue ? '#ef4444' : '#f97316',
    minWidth: 90,
  }),
  cbName: { fontSize: 14, fontWeight: 600, color: '#f1f5f9', flex: 1 },
  cbContact: { fontSize: 12, color: '#64748b' },
  cbValue: { fontSize: 13, fontWeight: 600, color: '#22c55e' },

  // Analytics
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: '#161b27',
    border: '1px solid #1e2535',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
  },
  statVal: { fontSize: 28, fontWeight: 700, color: '#f97316' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  chartSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  chartCard: {
    background: '#161b27',
    border: '1px solid #1e2535',
    borderRadius: 10,
    padding: 20,
  },
  chartTitle: { fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 16 },
  barRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  barLabel: { fontSize: 12, color: '#94a3b8', width: 120, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: '#1e2535', borderRadius: 4, overflow: 'hidden' },
  barFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    background: color,
    borderRadius: 4,
    transition: 'width 0.5s ease',
  }),
  barCount: { fontSize: 12, color: '#64748b', width: 28, textAlign: 'right' },

  // Jobs
  jobStatusColors: {
    Scheduled: '#6366f1',
    'In Progress': '#f97316',
    Complete: '#22c55e',
  },
  progressTrack: {
    height: 6, background: '#1e2535', borderRadius: 3,
    overflow: 'hidden', marginTop: 10,
  },
  progressFill: (pct, color) => ({
    height: '100%', width: `${pct}%`,
    background: color, borderRadius: 3,
    transition: 'width 0.4s ease',
  }),

  // Checklist modal
  checklistItem: (done) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid #1e2535',
    cursor: 'pointer',
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
    background: '#161b27',
    border: '1px solid #1e2535',
    borderRadius: 14,
    width: '100%',
    maxWidth: 560,
    maxHeight: '85vh',
    overflow: 'auto',
    padding: 28,
    position: 'relative',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'transparent', border: 'none',
    color: '#64748b', cursor: 'pointer', fontSize: 22, lineHeight: 1,
    padding: 4,
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
    width: '100%',
    padding: '10px 16px',
    background: loading ? '#1e2535' : 'linear-gradient(135deg, #f97316, #ea580c)',
    border: 'none',
    borderRadius: 8,
    color: loading ? '#64748b' : '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginBottom: 16,
    transition: 'opacity 0.15s',
  }),
  aiResponse: {
    background: '#0f1117',
    border: '1px solid rgba(249,115,22,0.2)',
    borderRadius: 8,
    padding: 16,
    fontSize: 13,
    lineHeight: 1.75,
    color: '#cbd5e1',
    whiteSpace: 'pre-wrap',
  },
  apiKeyNote: {
    fontSize: 11, color: '#374151',
    marginTop: 10, textAlign: 'center',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + n.toLocaleString();

const diffDays = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date(TODAY);
  return Math.round(diff / 86400000);
};

const PLAYBOOKS = {
  price_objection: [
    'Lead with value, not price — restate the ROI impact for their specific use case',
    'Offer a phased rollout to reduce initial commitment and perceived risk',
    'Prepare a competitor TCO comparison highlighting long-term cost advantages',
    'Escalate to VP level with a written business case before any concessions',
  ],
  budget_freeze: [
    'Lock in a specific re-engage calendar date before the call ends',
    'Explore creative structuring — split the invoice across fiscal years',
    'Identify an emergency exception budget path directly with their CFO',
    'Keep warm with monthly value-add content; never go fully dark',
  ],
  no_response: [
    'Switch channels immediately — try LinkedIn DM instead of email',
    'Send a "permission to close" email to create urgency and get a response',
    'Reach out to a different stakeholder in the org to re-establish contact',
    'Reference a recent company news event to make your outreach timely',
  ],
  competitor: [
    'Request a head-to-head bake-off POC on their real data and use case',
    'Identify 3 differentiators they have not yet seen or evaluated',
    'Pull in a customer reference from their specific industry vertical',
    'Offer a pilot extension to reduce the switching risk they perceive',
  ],
  timing: [
    'Set a hard go/no-go date for Q2 and get it on their calendar now',
    'Propose a low-effort pilot that starts immediately despite the timing',
    'Ask what specific milestones would make the timing right — get concrete',
    'Maintain value touches every 3 weeks with case studies and benchmarks',
  ],
  wrong_contact: [
    'Ask your current contact to make a warm intro to the decision maker',
    'Research the org chart via LinkedIn Sales Navigator before your next call',
    'Send value content directly to the target executive via LinkedIn',
    'Use the framing: "I want to make sure the right people are aligned"',
  ],
  technical_fit: [
    'Schedule a dedicated technical deep-dive with your solutions engineer',
    'Prepare a custom integration architecture document for their stack',
    'Offer a time-boxed proof-of-concept with their actual tech environment',
    'Bring in customer references who had similar integration challenges',
  ],
};

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
        system: `You are an elite B2B sales coach specializing in deal recovery.
Give hyper-specific, tactical advice. Be direct and concise. 3-4 short paragraphs max. No bullet points — write in flowing paragraphs.`,
        messages: [{
          role: 'user',
          content: `Give me deal recovery coaching for this stalled deal:

Company: ${lead.name} (${lead.industry})
Contact: ${lead.contact}, ${lead.role}
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

        {aiText && (
          <div style={S.aiResponse}>{aiText}</div>
        )}

        <div style={S.apiKeyNote}>Powered by Claude Opus 4.6 · Add REACT_APP_ANTHROPIC_API_KEY to .env</div>
      </div>
    </div>
  );
}

// ─── Lead Card ───────────────────────────────────────────────────────────────
function LeadCard({ lead, onClick }) {
  const [hovered, setHovered] = useState(false);
  const days = diffDays(lead.callbackDate);
  const isOverdue = days !== null && days < 0;

  return (
    <div
      style={S.card(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(lead)}
    >
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardName}>{lead.name}</div>
          <div style={S.cardContact}>{lead.contact} · {lead.role}</div>
        </div>
        <span style={S.statusBadge(lead.status)}>{lead.status}</span>
      </div>

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
    </div>
  );
}

// ─── Pipeline Tab ─────────────────────────────────────────────────────────────
function PipelineTab({ leads, onSelectLead }) {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'active', 'stalled', 'cold', 'won', 'lost'];

  const filtered = useMemo(() =>
    filter === 'all' ? leads : leads.filter(l => l.status === filter),
    [leads, filter]
  );

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
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8' }}>
          Total: <span style={{ color: '#f97316', fontWeight: 700, marginLeft: 4 }}>{fmt(total)}</span>
        </div>
      </div>
      <div style={S.grid}>
        {filtered.map(lead => (
          <LeadCard key={lead.id} lead={lead} onClick={onSelectLead} />
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
                <div style={S.cbContact}>{lead.contact} · {lead.stage}</div>
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
  const winRate = closedDeals.length
    ? Math.round(won.length / closedDeals.length * 100) : 0;

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
  const [checks, setChecks] = useState(() => {
    const init = {};
    ROOFING_STEPS.forEach(s => {
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
  const total = ROOFING_STEPS.length;
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
          {job.address} · {job.trade} · {fmt(job.value)}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{doneCount}/{total} steps — {pct}%</span>
          </div>
          <div style={S.progressTrack}>
            <div style={S.progressFill(pct, statusColor)} />
          </div>
        </div>

        {/* Notes */}
        <div style={S.sectionLabel}>Job Notes</div>
        <div style={{
          fontSize: 13, color: '#94a3b8', marginBottom: 20,
          padding: '10px 12px', background: '#0f1117', borderRadius: 6,
        }}>
          {job.notes}
        </div>

        {/* Checklist */}
        <div style={S.sectionLabel}>Roofing Checklist</div>
        <div>
          {ROOFING_STEPS.map((step) => {
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
                <span style={{ ...S.checkLabel(c.done) }}>
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

  const statuses = ['all', 'Scheduled', 'In Progress', 'Complete'];
  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

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

      <div style={S.grid}>
        {filtered.map(job => {
          const doneCount = job.completedSteps.length;
          const total = ROOFING_STEPS.length;
          const pct = Math.round(doneCount / total * 100);
          const color = statusColor(job.status);

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

              <div style={S.cardMeta}>
                <div style={S.metaItem}>Trade: <span style={S.metaValue}>{job.trade}</span></div>
                <div style={S.metaItem}>Value: <span style={{ ...S.metaValue, color: '#22c55e' }}>{fmt(job.value)}</span></div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    {ROOFING_STEPS[doneCount < total ? doneCount : total - 1]?.label || 'Complete'}
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

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <div style={S.app}>
      <header style={S.header}>
        <div>
          <span style={S.logo}>ClosedLoop</span>
          <span style={S.logoSub}>Sales Recovery CRM</span>
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
      </header>

      <main style={S.body}>
        {tab === 'pipeline' && (
          <PipelineTab leads={DEMO_LEADS} onSelectLead={setSelectedLead} />
        )}
        {tab === 'callbacks' && (
          <CallbacksTab leads={DEMO_LEADS} onSelectLead={setSelectedLead} />
        )}
        {tab === 'analytics' && (
          <AnalyticsTab leads={DEMO_LEADS} />
        )}
        {tab === 'jobs' && (
          <JobsTab jobs={DEMO_JOBS} />
        )}
      </main>

      {selectedLead && (
        <CoachPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
