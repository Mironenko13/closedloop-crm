// ============================================================================
// Quote Libraries — seeded defaults for line items, section templates, and
// quote templates. Plus helpers to merge seeded defaults with user-saved
// customisations from localStorage. User-saved items win on id collisions so
// editing a seeded item creates a user-namespaced copy without touching the
// seed.
// ============================================================================

// ─── Line Item Catalog ──────────────────────────────────────────────────────
// Each entry is a reusable "menu item" the user can pick from when adding a
// line to a quote section. Picking inserts a fresh LineItem onto the quote
// with quantity defaulting to 1 (or whatever the user types).
export const LINE_ITEM_CATALOG = [
  // ── Residential — Shingles ──
  { id: 'cat-shg-hdz', category: 'Shingles', description: 'GAF Timberline HDZ Architectural', unit: 'SQ', unitPrice: 130, notes: null, mode: 'residential' },
  { id: 'cat-shg-ultra-hdz', category: 'Shingles', description: 'GAF Timberline Ultra HDZ', unit: 'SQ', unitPrice: 165, notes: null, mode: 'residential' },
  { id: 'cat-shg-as2', category: 'Shingles', description: 'GAF Timberline AS II', unit: 'SQ', unitPrice: 185, notes: 'Impact-resistant', mode: 'residential' },
  { id: 'cat-shg-glenwood', category: 'Shingles', description: 'GAF Glenwood Designer', unit: 'SQ', unitPrice: 310, notes: null, mode: 'residential' },
  { id: 'cat-shg-camelot', category: 'Shingles', description: 'GAF Camelot II Designer', unit: 'SQ', unitPrice: 295, notes: null, mode: 'residential' },
  { id: 'cat-shg-sequoia', category: 'Shingles', description: 'GAF Grand Sequoia', unit: 'SQ', unitPrice: 275, notes: null, mode: 'residential' },
  { id: 'cat-shg-landmark', category: 'Shingles', description: 'CertainTeed Landmark', unit: 'SQ', unitPrice: 135, notes: null, mode: 'residential' },
  { id: 'cat-shg-landmark-pro', category: 'Shingles', description: 'CertainTeed Landmark Pro', unit: 'SQ', unitPrice: 160, notes: null, mode: 'residential' },
  { id: 'cat-shg-presidential', category: 'Shingles', description: 'CertainTeed Presidential Shake', unit: 'SQ', unitPrice: 295, notes: null, mode: 'residential' },
  { id: 'cat-shg-duration', category: 'Shingles', description: 'Owens Corning Duration', unit: 'SQ', unitPrice: 135, notes: null, mode: 'residential' },
  { id: 'cat-shg-trudefinition', category: 'Shingles', description: 'Owens Corning TruDefinition', unit: 'SQ', unitPrice: 145, notes: null, mode: 'residential' },

  // ── Residential — Underlayment ──
  { id: 'cat-und-synthetic', category: 'Underlayment', description: 'Synthetic Underlayment', unit: 'SQ', unitPrice: 25, notes: null, mode: 'residential' },
  { id: 'cat-und-felt30', category: 'Underlayment', description: 'Felt 30#', unit: 'SQ', unitPrice: 18, notes: null, mode: 'residential' },
  { id: 'cat-und-premium', category: 'Underlayment', description: 'Premium Breathable Underlayment', unit: 'SQ', unitPrice: 40, notes: null, mode: 'residential' },

  // ── Residential — Ice & Water ──
  { id: 'cat-iw-eaves3', category: 'Ice & Water', description: 'Ice & Water Shield (eaves, 3\')', unit: 'SQ', unitPrice: 90, notes: null, mode: 'residential' },
  { id: 'cat-iw-eaves-valleys', category: 'Ice & Water', description: 'Ice & Water Shield (eaves + valleys, 6\')', unit: 'SQ', unitPrice: 90, notes: null, mode: 'residential' },
  { id: 'cat-iw-full', category: 'Ice & Water', description: 'Ice & Water Shield (full perimeter coverage)', unit: 'SQ', unitPrice: 90, notes: null, mode: 'residential' },

  // ── Residential — Flashing & Vents ──
  { id: 'cat-fl-step', category: 'Flashing', description: 'Step Flashing', unit: 'EA', unitPrice: 18, notes: null, mode: 'residential' },
  { id: 'cat-fl-pipe-lead', category: 'Flashing', description: 'Pipe Boot (lead)', unit: 'EA', unitPrice: 35, notes: null, mode: 'residential' },
  { id: 'cat-fl-pipe-rubber', category: 'Flashing', description: 'Pipe Boot (rubber, standard)', unit: 'EA', unitPrice: 22, notes: null, mode: 'residential' },
  { id: 'cat-fl-chimney', category: 'Flashing', description: 'Chimney Flashing Replacement', unit: 'LS', unitPrice: 850, notes: null, mode: 'residential' },
  { id: 'cat-fl-skylight', category: 'Flashing', description: 'Skylight Flashing Replacement', unit: 'EA', unitPrice: 350, notes: null, mode: 'residential' },
  { id: 'cat-fl-roof-wall', category: 'Flashing', description: 'Roof-to-Wall Flashing', unit: 'LF', unitPrice: 14, notes: null, mode: 'residential' },

  // ── Residential — Edge Metal & Trim ──
  { id: 'cat-em-drip-std', category: 'Edge Metal', description: 'Drip Edge (standard)', unit: 'LF', unitPrice: 3.5, notes: null, mode: 'residential' },
  { id: 'cat-em-drip-color', category: 'Edge Metal', description: 'Drip Edge (color-matched)', unit: 'LF', unitPrice: 4.75, notes: null, mode: 'residential' },
  { id: 'cat-em-gutter-apron', category: 'Edge Metal', description: 'Gutter Apron', unit: 'LF', unitPrice: 4, notes: null, mode: 'residential' },
  { id: 'cat-em-starter', category: 'Edge Metal', description: 'Starter Strip', unit: 'LF', unitPrice: 2.25, notes: null, mode: 'residential' },
  { id: 'cat-em-ridge-cap', category: 'Ridge / Vent', description: 'Ridge Cap (matched)', unit: 'LF', unitPrice: 9, notes: null, mode: 'residential' },
  { id: 'cat-em-hip-ridge-premium', category: 'Ridge / Vent', description: 'Hip & Ridge Premium Accessory', unit: 'LF', unitPrice: 12, notes: null, mode: 'residential' },

  // ── Residential — Vents ──
  { id: 'cat-vt-ridge', category: 'Ridge / Vent', description: 'Ridge Vent (rolled, w/ shingle cover)', unit: 'LF', unitPrice: 14, notes: null, mode: 'residential' },
  { id: 'cat-vt-box', category: 'Ridge / Vent', description: 'Box Vent (static)', unit: 'EA', unitPrice: 85, notes: null, mode: 'residential' },
  { id: 'cat-vt-power', category: 'Ridge / Vent', description: 'Power Vent', unit: 'EA', unitPrice: 385, notes: null, mode: 'residential' },
  { id: 'cat-vt-off-ridge', category: 'Ridge / Vent', description: 'Off-Ridge Vent', unit: 'EA', unitPrice: 95, notes: null, mode: 'residential' },

  // ── Residential — Labor (Tear-off) ──
  { id: 'cat-lab-to-1', category: 'Labor — Tear-off', description: 'Tear-off, 1 layer asphalt', unit: 'SQ', unitPrice: 50, notes: null, mode: 'residential' },
  { id: 'cat-lab-to-2', category: 'Labor — Tear-off', description: 'Tear-off, 2 layers asphalt', unit: 'SQ', unitPrice: 85, notes: null, mode: 'residential' },
  { id: 'cat-lab-to-3', category: 'Labor — Tear-off', description: 'Tear-off, 3 layers asphalt', unit: 'SQ', unitPrice: 125, notes: null, mode: 'residential' },
  { id: 'cat-lab-to-shake', category: 'Labor — Tear-off', description: 'Cedar Shake Tear-off', unit: 'SQ', unitPrice: 135, notes: null, mode: 'residential' },
  { id: 'cat-lab-to-slate', category: 'Labor — Tear-off', description: 'Slate Tear-off', unit: 'SQ', unitPrice: 220, notes: null, mode: 'residential' },

  // ── Residential — Labor (Install) ──
  { id: 'cat-lab-inst-arch', category: 'Labor — Install', description: 'Architectural Shingle Install', unit: 'SQ', unitPrice: 185, notes: null, mode: 'residential' },
  { id: 'cat-lab-inst-designer', category: 'Labor — Install', description: 'Designer Shingle Install', unit: 'SQ', unitPrice: 245, notes: null, mode: 'residential' },
  { id: 'cat-lab-pitch-9', category: 'Labor — Install', description: 'Steep Pitch Surcharge (9/12)', unit: 'SQ', unitPrice: 35, notes: null, mode: 'residential' },
  { id: 'cat-lab-pitch-10', category: 'Labor — Install', description: 'Steep Pitch Surcharge (10/12)', unit: 'SQ', unitPrice: 55, notes: null, mode: 'residential' },
  { id: 'cat-lab-pitch-11', category: 'Labor — Install', description: 'Steep Pitch Surcharge (11/12+)', unit: 'SQ', unitPrice: 85, notes: null, mode: 'residential' },
  { id: 'cat-lab-2nd-story', category: 'Labor — Install', description: '2nd Story Access', unit: 'LS', unitPrice: 450, notes: null, mode: 'residential' },
  { id: 'cat-lab-3rd-story', category: 'Labor — Install', description: '3+ Story Access', unit: 'LS', unitPrice: 1200, notes: null, mode: 'residential' },

  // ── Residential — Wood / Decking ──
  { id: 'cat-wd-plywood-12', category: 'Adders', description: 'Plywood Decking Replacement (1/2")', unit: 'SF', unitPrice: 4.75, notes: 'Billed per SF used', mode: 'residential' },
  { id: 'cat-wd-osb-716', category: 'Adders', description: 'OSB Decking Replacement (7/16")', unit: 'SF', unitPrice: 4.25, notes: 'Billed per SF used', mode: 'residential' },
  { id: 'cat-wd-plank', category: 'Adders', description: 'Plank Replacement', unit: 'SF', unitPrice: 6, notes: null, mode: 'residential' },
  { id: 'cat-wd-allowance', category: 'Adders', description: 'Allowance: 4 sheets included', unit: 'LS', unitPrice: 0, notes: 'Up to 4 sheets included; additional billed per SF', mode: 'residential' },

  // ── Residential — Adders ──
  { id: 'cat-add-dump-15', category: 'Dumpster / Permit', description: 'Dumpster (15 yd)', unit: 'LS', unitPrice: 450, notes: null, mode: 'residential' },
  { id: 'cat-add-dump-20', category: 'Dumpster / Permit', description: 'Dumpster (20 yd)', unit: 'LS', unitPrice: 550, notes: null, mode: 'residential' },
  { id: 'cat-add-dump-30', category: 'Dumpster / Permit', description: 'Dumpster (30 yd)', unit: 'LS', unitPrice: 750, notes: null, mode: 'residential' },
  { id: 'cat-add-permit-res', category: 'Dumpster / Permit', description: 'Permit (typical residential)', unit: 'LS', unitPrice: 200, notes: null, mode: 'residential' },
  { id: 'cat-add-cleanup', category: 'Adders', description: 'Magnetic Sweep / Final Cleanup', unit: 'LS', unitPrice: 125, notes: null, mode: 'residential' },
  { id: 'cat-add-solar-rr', category: 'Adders', description: 'Solar Panel R&R (per panel)', unit: 'EA', unitPrice: 185, notes: 'Remove and reinstall', mode: 'residential' },
  { id: 'cat-add-gutter-5', category: 'Adders', description: 'Gutter Run (5")', unit: 'LF', unitPrice: 11, notes: null, mode: 'residential' },
  { id: 'cat-add-gutter-6', category: 'Adders', description: 'Gutter Run (6")', unit: 'LF', unitPrice: 13, notes: null, mode: 'residential' },
  { id: 'cat-add-gutter-guards', category: 'Adders', description: 'Gutter Guards', unit: 'LF', unitPrice: 9, notes: null, mode: 'residential' },
  { id: 'cat-add-soffit-fascia', category: 'Adders', description: 'Soffit/Fascia Wrap', unit: 'LF', unitPrice: 22, notes: null, mode: 'residential' },
  { id: 'cat-add-snow-guards-res', category: 'Adders', description: 'Snow Guards (residential)', unit: 'EA', unitPrice: 35, notes: null, mode: 'residential' },
  { id: 'cat-add-ice-cable', category: 'Adders', description: 'Ice Cable Install', unit: 'LF', unitPrice: 14, notes: null, mode: 'residential' },

  // ── Commercial — Membrane ──
  { id: 'cat-mem-tpo-60', category: 'Commercial — Membrane', description: 'TPO 60mil Field', unit: 'SF', unitPrice: 4.25, notes: null, mode: 'commercial' },
  { id: 'cat-mem-tpo-80', category: 'Commercial — Membrane', description: 'TPO 80mil Field', unit: 'SF', unitPrice: 5.10, notes: null, mode: 'commercial' },
  { id: 'cat-mem-tpo-45', category: 'Commercial — Membrane', description: 'TPO 45mil Field', unit: 'SF', unitPrice: 3.75, notes: null, mode: 'commercial' },
  { id: 'cat-mem-epdm-60', category: 'Commercial — Membrane', description: 'EPDM 60mil Field', unit: 'SF', unitPrice: 4.40, notes: null, mode: 'commercial' },
  { id: 'cat-mem-epdm-90', category: 'Commercial — Membrane', description: 'EPDM 90mil Field', unit: 'SF', unitPrice: 5.75, notes: null, mode: 'commercial' },
  { id: 'cat-mem-pvc-60', category: 'Commercial — Membrane', description: 'PVC 60mil Field', unit: 'SF', unitPrice: 5.25, notes: null, mode: 'commercial' },
  { id: 'cat-mem-modbit-sbs', category: 'Commercial — Membrane', description: 'Mod Bit SBS (3-ply)', unit: 'SF', unitPrice: 7.50, notes: null, mode: 'commercial' },
  { id: 'cat-mem-modbit-app', category: 'Commercial — Membrane', description: 'Mod Bit APP (2-ply)', unit: 'SF', unitPrice: 6.85, notes: null, mode: 'commercial' },
  { id: 'cat-mem-bur', category: 'Commercial — Membrane', description: 'BUR (4-ply gravel)', unit: 'SF', unitPrice: 8.25, notes: null, mode: 'commercial' },

  // ── Commercial — Insulation ──
  { id: 'cat-ins-poly-26', category: 'Commercial — Insulation', description: 'Polyiso 2.6" (R-15)', unit: 'SF', unitPrice: 1.85, notes: null, mode: 'commercial' },
  { id: 'cat-ins-poly-35', category: 'Commercial — Insulation', description: 'Polyiso 3.5" (R-20)', unit: 'SF', unitPrice: 2.30, notes: null, mode: 'commercial' },
  { id: 'cat-ins-poly-45', category: 'Commercial — Insulation', description: 'Polyiso 4.5" (R-25)', unit: 'SF', unitPrice: 2.85, notes: null, mode: 'commercial' },
  { id: 'cat-ins-tapered', category: 'Commercial — Insulation', description: 'Tapered Polyiso (avg)', unit: 'SF', unitPrice: 3.40, notes: null, mode: 'commercial' },
  { id: 'cat-ins-eps-4', category: 'Commercial — Insulation', description: 'EPS 4"', unit: 'SF', unitPrice: 1.50, notes: null, mode: 'commercial' },
  { id: 'cat-ins-cover-quarter', category: 'Commercial — Insulation', description: 'Cover Board (DensDeck 1/4")', unit: 'SF', unitPrice: 1.40, notes: null, mode: 'commercial' },
  { id: 'cat-ins-cover-half', category: 'Commercial — Insulation', description: 'Cover Board (DensDeck 1/2")', unit: 'SF', unitPrice: 1.85, notes: null, mode: 'commercial' },

  // ── Commercial — Attachment ──
  { id: 'cat-att-mech', category: 'Commercial — Membrane', description: 'Mechanically Attached (fasteners + plates)', unit: 'SF', unitPrice: 0.85, notes: null, mode: 'commercial' },
  { id: 'cat-att-adhered', category: 'Commercial — Membrane', description: 'Fully Adhered (bonding adhesive)', unit: 'SF', unitPrice: 1.60, notes: null, mode: 'commercial' },
  { id: 'cat-att-ballast', category: 'Commercial — Membrane', description: 'Ballasted', unit: 'SF', unitPrice: 1.20, notes: null, mode: 'commercial' },

  // ── Commercial — Flashing ──
  { id: 'cat-cfl-tpo-membrane', category: 'Commercial — Flashing', description: 'TPO Membrane Flashing (walls/curbs)', unit: 'SF', unitPrice: 6.50, notes: null, mode: 'commercial' },
  { id: 'cat-cfl-pitch-pan', category: 'Commercial — Flashing', description: 'Pitch Pan', unit: 'EA', unitPrice: 185, notes: null, mode: 'commercial' },
  { id: 'cat-cfl-pipe', category: 'Commercial — Flashing', description: 'Pipe Boot (commercial)', unit: 'EA', unitPrice: 95, notes: null, mode: 'commercial' },
  { id: 'cat-cfl-curb-sm', category: 'Commercial — Flashing', description: 'Curb Flashing (small, <4×4)', unit: 'EA', unitPrice: 325, notes: null, mode: 'commercial' },
  { id: 'cat-cfl-curb-lg', category: 'Commercial — Flashing', description: 'Curb Flashing (large, >4×4)', unit: 'EA', unitPrice: 750, notes: null, mode: 'commercial' },
  { id: 'cat-cfl-expansion', category: 'Commercial — Flashing', description: 'Expansion Joint Cover', unit: 'LF', unitPrice: 42, notes: null, mode: 'commercial' },
  { id: 'cat-cfl-termination', category: 'Commercial — Flashing', description: 'Termination Bar', unit: 'LF', unitPrice: 8.50, notes: null, mode: 'commercial' },

  // ── Commercial — Edge Metal & Coping ──
  { id: 'cat-cem-coping-std', category: 'Commercial — Edge / Coping', description: 'Coping Metal (24ga, std color)', unit: 'LF', unitPrice: 28, notes: null, mode: 'commercial' },
  { id: 'cat-cem-coping-custom', category: 'Commercial — Edge / Coping', description: 'Coping Metal (custom color/profile)', unit: 'LF', unitPrice: 42, notes: null, mode: 'commercial' },
  { id: 'cat-cem-edge-detail', category: 'Commercial — Edge / Coping', description: 'Edge Metal Detail', unit: 'LF', unitPrice: 14, notes: null, mode: 'commercial' },
  { id: 'cat-cem-drip', category: 'Commercial — Edge / Coping', description: 'Drip Edge (commercial)', unit: 'LF', unitPrice: 6, notes: null, mode: 'commercial' },

  // ── Commercial — Drainage ──
  { id: 'cat-drn-3', category: 'Commercial — Drainage', description: 'Roof Drain (3")', unit: 'EA', unitPrice: 385, notes: null, mode: 'commercial' },
  { id: 'cat-drn-4', category: 'Commercial — Drainage', description: 'Roof Drain (4")', unit: 'EA', unitPrice: 485, notes: null, mode: 'commercial' },
  { id: 'cat-drn-overflow', category: 'Commercial — Drainage', description: 'Overflow Drain', unit: 'EA', unitPrice: 325, notes: null, mode: 'commercial' },
  { id: 'cat-drn-scupper', category: 'Commercial — Drainage', description: 'Scupper (through-wall)', unit: 'EA', unitPrice: 295, notes: null, mode: 'commercial' },
  { id: 'cat-drn-sump', category: 'Commercial — Drainage', description: 'Drain Lead/Sump Pan', unit: 'EA', unitPrice: 185, notes: null, mode: 'commercial' },

  // ── Commercial — Accessories ──
  { id: 'cat-cac-walk-concrete', category: 'Commercial — Access / Equipment', description: 'Walk Pad (concrete)', unit: 'SF', unitPrice: 9, notes: null, mode: 'commercial' },
  { id: 'cat-cac-walk-tpo', category: 'Commercial — Access / Equipment', description: 'Walk Pad (TPO-printed)', unit: 'SF', unitPrice: 7.50, notes: null, mode: 'commercial' },
  { id: 'cat-cac-snow', category: 'Commercial — Access / Equipment', description: 'Snow Guards (commercial)', unit: 'LF', unitPrice: 24, notes: null, mode: 'commercial' },
  { id: 'cat-cac-lightning', category: 'Commercial — Access / Equipment', description: 'Lightning Protection R&R', unit: 'LS', unitPrice: 1200, notes: null, mode: 'commercial' },
  { id: 'cat-cac-curb-sm', category: 'Commercial — Access / Equipment', description: 'Mechanical Curb Construction (small)', unit: 'EA', unitPrice: 850, notes: null, mode: 'commercial' },
  { id: 'cat-cac-curb-lg', category: 'Commercial — Access / Equipment', description: 'Mechanical Curb Construction (large)', unit: 'EA', unitPrice: 2400, notes: null, mode: 'commercial' },
  { id: 'cat-cac-rails', category: 'Commercial — Access / Equipment', description: 'Equipment Rails', unit: 'LF', unitPrice: 48, notes: null, mode: 'commercial' },

  // ── Commercial — Demolition ──
  { id: 'cat-cdm-mem-single', category: 'Commercial — Flashing', description: 'Tear-off Membrane (single ply)', unit: 'SF', unitPrice: 1.10, notes: null, mode: 'commercial' },
  { id: 'cat-cdm-mem-bur', category: 'Commercial — Flashing', description: 'Tear-off Membrane (built-up)', unit: 'SF', unitPrice: 1.95, notes: null, mode: 'commercial' },
  { id: 'cat-cdm-insulation', category: 'Commercial — Insulation', description: 'Tear-off Insulation', unit: 'SF', unitPrice: 0.75, notes: null, mode: 'commercial' },
  { id: 'cat-cdm-blocking', category: 'Commercial — Edge / Coping', description: 'Wood Blocking Removal', unit: 'LF', unitPrice: 4.50, notes: null, mode: 'commercial' },

  // ── Commercial — Wood / Substrate ──
  { id: 'cat-cwd-2x6', category: 'Commercial — Edge / Coping', description: 'Wood Blocking (2x6 PT, new)', unit: 'LF', unitPrice: 9, notes: null, mode: 'commercial' },
  { id: 'cat-cwd-2x8', category: 'Commercial — Edge / Coping', description: 'Wood Blocking (2x8 PT, new)', unit: 'LF', unitPrice: 11, notes: null, mode: 'commercial' },
  { id: 'cat-cwd-nailer', category: 'Commercial — Edge / Coping', description: 'Wood Nailer (parapet)', unit: 'LF', unitPrice: 12, notes: null, mode: 'commercial' },
  { id: 'cat-cwd-plywood-58', category: 'Commercial — Edge / Coping', description: 'Plywood Decking (5/8" T&G)', unit: 'SF', unitPrice: 5.25, notes: null, mode: 'commercial' },

  // ── Commercial — Access & Equipment ──
  { id: 'cat-cae-crane', category: 'Commercial — Access / Equipment', description: 'Crane Day Rate', unit: 'DAY', unitPrice: 2100, notes: null, mode: 'commercial' },
  { id: 'cat-cae-manlift', category: 'Commercial — Access / Equipment', description: 'Manlift Rental (1 week)', unit: 'LS', unitPrice: 850, notes: null, mode: 'commercial' },
  { id: 'cat-cae-scissor', category: 'Commercial — Access / Equipment', description: 'Scissor Lift (1 week)', unit: 'LS', unitPrice: 650, notes: null, mode: 'commercial' },
  { id: 'cat-cae-conveyor', category: 'Commercial — Access / Equipment', description: 'Conveyor Rental (1 week)', unit: 'LS', unitPrice: 475, notes: null, mode: 'commercial' },
  { id: 'cat-cae-loader', category: 'Commercial — Access / Equipment', description: 'Roof Loader (1 week)', unit: 'LS', unitPrice: 725, notes: null, mode: 'commercial' },
  { id: 'cat-cae-night', category: 'Commercial — Access / Equipment', description: 'Night Work Premium', unit: 'HR', unitPrice: 35, notes: null, mode: 'commercial' },
  { id: 'cat-cae-weekend', category: 'Commercial — Access / Equipment', description: 'Weekend Work Premium', unit: 'HR', unitPrice: 25, notes: null, mode: 'commercial' },
  { id: 'cat-cae-occupied', category: 'Commercial — Access / Equipment', description: 'Occupied Building Protection', unit: 'LS', unitPrice: 1500, notes: null, mode: 'commercial' },
  { id: 'cat-cae-temp-roof', category: 'Commercial — Access / Equipment', description: 'Temporary Roof Protection', unit: 'LS', unitPrice: 850, notes: null, mode: 'commercial' },

  // ── Commercial — Conditional / Compliance ──
  { id: 'cat-cc-perf-bond', category: 'Commercial — Access / Equipment', description: 'Performance Bond (2%)', unit: 'LS', unitPrice: 0, notes: 'Calculated from quote total', mode: 'commercial' },
  { id: 'cat-cc-pay-bond', category: 'Commercial — Access / Equipment', description: 'Payment Bond (1%)', unit: 'LS', unitPrice: 0, notes: 'Calculated from quote total', mode: 'commercial' },
  { id: 'cat-cc-builders-risk', category: 'Commercial — Access / Equipment', description: 'Builder\'s Risk Insurance', unit: 'LS', unitPrice: 1200, notes: null, mode: 'commercial' },
  { id: 'cat-cc-davis-bacon', category: 'Commercial — Access / Equipment', description: 'Davis-Bacon Certified Payroll Admin', unit: 'LS', unitPrice: 1500, notes: null, mode: 'commercial' },
  { id: 'cat-cc-permit', category: 'Commercial — Access / Equipment', description: 'Permitting / Plan Review', unit: 'LS', unitPrice: 850, notes: null, mode: 'commercial' },
  { id: 'cat-cc-preconst', category: 'Commercial — Access / Equipment', description: 'Pre-Construction Meeting', unit: 'LS', unitPrice: 350, notes: null, mode: 'commercial' },
  { id: 'cat-cc-asbuilt', category: 'Commercial — Access / Equipment', description: 'As-Built Drawings', unit: 'LS', unitPrice: 1200, notes: null, mode: 'commercial' },
];

// ─── Section Templates ──────────────────────────────────────────────────────
// Helper to build a section-template line item — uses category + unit + price
// from catalog entries by description match so seeding stays in sync if the
// catalog price drifts.
function liFromCatalog(description, qty = 0, notesOverride) {
  const entry = LINE_ITEM_CATALOG.find(c => c.description === description);
  if (!entry) {
    return { description, category: 'Material', quantity: qty, unit: 'EA', unitPrice: 0, notes: notesOverride || null };
  }
  return {
    description: entry.description,
    category: entry.category,
    quantity: qty,
    unit: entry.unit,
    unitPrice: entry.unitPrice,
    notes: notesOverride !== undefined ? notesOverride : entry.notes,
  };
}

export const SECTION_TEMPLATES = [
  {
    id: 'st-res-full-replacement',
    name: 'Full Tear-Off + Architectural Shingle',
    mode: 'residential',
    scopeType: 'full_replacement',
    defaultLineItems: [
      liFromCatalog('Tear-off, 1 layer asphalt'),
      liFromCatalog('Synthetic Underlayment'),
      liFromCatalog('Ice & Water Shield (eaves + valleys, 6\')'),
      liFromCatalog('GAF Timberline HDZ Architectural'),
      liFromCatalog('Drip Edge (standard)'),
      liFromCatalog('Starter Strip'),
      liFromCatalog('Ridge Cap (matched)'),
      liFromCatalog('Ridge Vent (rolled, w/ shingle cover)'),
      liFromCatalog('Pipe Boot (lead)', 4),
      liFromCatalog('Architectural Shingle Install'),
      liFromCatalog('2nd Story Access', 1),
      liFromCatalog('Dumpster (20 yd)', 1),
      liFromCatalog('Permit (typical residential)', 1),
      liFromCatalog('Magnetic Sweep / Final Cleanup', 1),
    ],
    defaultNotes: 'Full tear-off and re-roof. Decking inspected; up to 4 sheets included in price.',
  },
  {
    id: 'st-res-repair',
    name: 'Roof Repair — Targeted',
    mode: 'residential',
    scopeType: 'repair',
    defaultLineItems: [
      liFromCatalog('Tear-off, 1 layer asphalt'),
      liFromCatalog('Synthetic Underlayment'),
      liFromCatalog('Ice & Water Shield (eaves + valleys, 6\')'),
      liFromCatalog('GAF Timberline HDZ Architectural'),
      liFromCatalog('Roof-to-Wall Flashing'),
      liFromCatalog('Architectural Shingle Install'),
      liFromCatalog('Magnetic Sweep / Final Cleanup', 1),
    ],
    defaultNotes: 'Targeted repair area only. Surrounding shingles tied in to existing field.',
  },
  {
    id: 'st-res-gutter',
    name: 'Gutter Installation',
    mode: 'residential',
    scopeType: 'gutter_installation',
    defaultLineItems: [
      liFromCatalog('Gutter Run (5")'),
      liFromCatalog('Gutter Apron'),
      liFromCatalog('Gutter Guards'),
    ],
    defaultNotes: 'Seamless K-style gutter, hangers spaced per manufacturer spec.',
  },
  {
    id: 'st-res-soffit',
    name: 'Soffit/Fascia Wrap',
    mode: 'residential',
    scopeType: 'soffit_fascia',
    defaultLineItems: [
      liFromCatalog('Soffit/Fascia Wrap'),
    ],
    defaultNotes: 'Aluminum wrap over existing soffit/fascia. Vented soffit where applicable.',
  },
  {
    id: 'st-res-chimney',
    name: 'Chimney Flashing Replacement',
    mode: 'residential',
    scopeType: 'chimney_flashing',
    defaultLineItems: [
      liFromCatalog('Step Flashing', 0),
      liFromCatalog('Chimney Flashing Replacement', 1),
      liFromCatalog('Ice & Water Shield (eaves + valleys, 6\')', 1),
    ],
    defaultNotes: 'Remove old flashing, install new step + counter flashing, tie in with existing field.',
  },
  {
    id: 'st-com-tpo-mech',
    name: 'Commercial TPO 60mil Mechanically Attached',
    mode: 'commercial',
    scopeType: 'commercial_tpo',
    defaultLineItems: [
      liFromCatalog('Tear-off Membrane (single ply)'),
      liFromCatalog('Tear-off Insulation'),
      liFromCatalog('Polyiso 3.5" (R-20)'),
      liFromCatalog('Cover Board (DensDeck 1/4")'),
      liFromCatalog('TPO 60mil Field'),
      liFromCatalog('Mechanically Attached (fasteners + plates)'),
      liFromCatalog('TPO Membrane Flashing (walls/curbs)'),
      liFromCatalog('Pitch Pan', 0),
      liFromCatalog('Pipe Boot (commercial)', 0),
      liFromCatalog('Edge Metal Detail'),
      liFromCatalog('Coping Metal (24ga, std color)'),
      liFromCatalog('Roof Drain (4")', 0),
      liFromCatalog('Walk Pad (TPO-printed)'),
      liFromCatalog('Crane Day Rate', 1),
    ],
    defaultNotes: 'TPO 60mil mechanically attached over polyiso + cover board. All penetrations re-flashed.',
  },
  {
    id: 'st-com-epdm-adh',
    name: 'Commercial EPDM 60mil Fully Adhered',
    mode: 'commercial',
    scopeType: 'commercial_epdm',
    defaultLineItems: [
      liFromCatalog('Tear-off Membrane (single ply)'),
      liFromCatalog('Tear-off Insulation'),
      liFromCatalog('Polyiso 3.5" (R-20)'),
      liFromCatalog('Cover Board (DensDeck 1/4")'),
      liFromCatalog('EPDM 60mil Field'),
      liFromCatalog('Fully Adhered (bonding adhesive)'),
      liFromCatalog('TPO Membrane Flashing (walls/curbs)'),
      liFromCatalog('Termination Bar'),
      liFromCatalog('Edge Metal Detail'),
      liFromCatalog('Coping Metal (24ga, std color)'),
      liFromCatalog('Roof Drain (4")', 0),
    ],
    defaultNotes: 'EPDM 60mil fully adhered over polyiso + cover board.',
  },
  {
    id: 'st-com-flashing-repair',
    name: 'Commercial Flashing Repair',
    mode: 'commercial',
    scopeType: 'commercial_flashing_repair',
    defaultLineItems: [
      liFromCatalog('TPO Membrane Flashing (walls/curbs)'),
      liFromCatalog('Pitch Pan', 0),
      liFromCatalog('Termination Bar'),
    ],
    defaultNotes: 'Targeted flashing repair at specified penetrations and transitions.',
  },
];

// ─── Default Terms / Exclusions Templates ───────────────────────────────────
export const DEFAULT_TERMS_RESIDENTIAL = `Payment Schedule:
• 30% deposit due upon signing
• 40% due upon material delivery to jobsite
• 30% balance due upon completion

Warranty:
• 10-year workmanship warranty
• Manufacturer warranty per material (registered upon final payment)

General:
• Weather delays do not constitute breach
• Customer responsible for clearing immediate work area, vehicles, and outdoor items
• Change orders require written approval prior to execution
• This quote is valid for 30 days from the date issued`;

export const DEFAULT_TERMS_COMMERCIAL = `Payment Schedule (per AIA G702/G703 progress billing):
• 10% mobilization
• 30% material delivery
• 30% at 50% complete
• 25% substantial completion
• 5% retainage released at final acceptance

General:
• Payment terms net 30 from each milestone
• Mutual lien waiver upon final payment
• Owner provides safe access during normal work hours
• Change orders processed per AIA A201 General Conditions
• This quote is valid for 60 days from the date issued`;

export const DEFAULT_EXCLUSIONS_RESIDENTIAL = [
  'Asbestos remediation',
  'Lead paint abatement',
  'Interior repairs',
  'Structural deck repair beyond 4-sheet allowance',
  'Electrical work',
  'Painting',
];

export const DEFAULT_EXCLUSIONS_COMMERCIAL = [
  'Asbestos abatement',
  'Hazardous material remediation',
  'Structural deck repair beyond allowance',
  'Interior repairs / finishes',
  'Painting / coatings beyond roof system',
  'HVAC unit replacement or relocation',
  'Electrical / data work beyond R&R for roofing access',
  'Permits beyond roofing',
  'Performance / payment bonds unless explicitly included',
];

export const DEFAULT_INCLUDED_RESIDENTIAL = `Complete tear-off and disposal of existing roof system. New synthetic underlayment, ice & water shield at eaves and valleys, drip edge, starter strip, and ridge cap. All pipe boots and step flashing replaced. Up to 4 sheets of decking replacement included. Permit and dumpster included. Magnetic nail sweep and full jobsite cleanup before crew leaves. Manufacturer warranty registered upon final payment.`;

export const DEFAULT_INCLUDED_COMMERCIAL = `Tear-off and disposal of existing roof system to deck. New insulation, cover board, and membrane installed per manufacturer specifications. All penetrations, curbs, and edges re-flashed. New edge metal and coping. Existing roof drains re-set or replaced as needed. Walk pads installed at all access points and around mechanical equipment. Crane mobilization and offload included. Manufacturer-certified installation with NDL warranty available upon owner request.`;

// ─── Quote Templates ────────────────────────────────────────────────────────
export const QUOTE_TEMPLATES = [
  {
    id: 'qt-res-standard',
    name: 'Standard Residential Replacement',
    mode: 'residential',
    defaultSections: [
      { scopeType: 'full_replacement', sectionTemplateId: 'st-res-full-replacement' },
    ],
    defaultTerms: DEFAULT_TERMS_RESIDENTIAL,
    defaultExclusions: DEFAULT_EXCLUSIONS_RESIDENTIAL,
    defaultIncluded: DEFAULT_INCLUDED_RESIDENTIAL,
  },
  {
    id: 'qt-res-replacement-gutters',
    name: 'Residential Replacement + Gutters',
    mode: 'residential',
    defaultSections: [
      { scopeType: 'full_replacement', sectionTemplateId: 'st-res-full-replacement' },
      { scopeType: 'gutter_installation', sectionTemplateId: 'st-res-gutter' },
    ],
    defaultTerms: DEFAULT_TERMS_RESIDENTIAL,
    defaultExclusions: DEFAULT_EXCLUSIONS_RESIDENTIAL,
    defaultIncluded: DEFAULT_INCLUDED_RESIDENTIAL + ' Gutters installed concurrently with roof to share scaffolding.',
  },
  {
    id: 'qt-res-insurance',
    name: 'Insurance Claim Replacement',
    mode: 'residential',
    defaultSections: [
      { scopeType: 'full_replacement', sectionTemplateId: 'st-res-full-replacement' },
    ],
    defaultTerms: `Insurance Claim Terms:
• Payment per insurance carrier disbursement schedule
• Customer responsible for deductible at job start
• Supplements processed for code upgrades or hidden damage
• Final invoice matches insurance scope unless change order signed
• Workmanship warranty: 10 years
• Manufacturer warranty per material

This quote is valid for 30 days from the date issued. Insurance scope and depreciation are subject to carrier approval.`,
    defaultExclusions: [
      ...DEFAULT_EXCLUSIONS_RESIDENTIAL,
      'Items not covered by insurance scope unless approved as supplement',
      'Deductible (paid directly by homeowner at job start)',
    ],
    defaultIncluded: DEFAULT_INCLUDED_RESIDENTIAL + ' Insurance supplement processing and adjuster coordination included.',
  },
  {
    id: 'qt-res-repair',
    name: 'Roof Repair',
    mode: 'residential',
    defaultSections: [
      { scopeType: 'repair', sectionTemplateId: 'st-res-repair' },
    ],
    defaultTerms: `Payment Schedule:
• 50% deposit due upon signing
• 50% balance due upon completion

Warranty:
• 2-year workmanship warranty on repair area
• No warranty on existing surrounding shingles

General:
• Repair tied into existing field — color and granulation match not guaranteed on aged roofs
• Quote valid for 30 days`,
    defaultExclusions: [
      'Structural deck repair',
      'Interior repairs',
      'Painting',
      'Warranty on shingles outside the repair area',
    ],
    defaultIncluded: 'Targeted repair of the specified area. New underlayment, ice & water, and shingles to match existing field as closely as possible. Surrounding shingles re-secured as needed.',
  },
  {
    id: 'qt-com-tpo',
    name: 'Commercial TPO Reroof',
    mode: 'commercial',
    defaultSections: [
      { scopeType: 'commercial_tpo', sectionTemplateId: 'st-com-tpo-mech' },
    ],
    defaultTerms: DEFAULT_TERMS_COMMERCIAL,
    defaultExclusions: DEFAULT_EXCLUSIONS_COMMERCIAL,
    defaultIncluded: DEFAULT_INCLUDED_COMMERCIAL + ' TPO 60mil mechanically attached system with 20-year manufacturer warranty (NDL available with upgrade).',
  },
  {
    id: 'qt-com-epdm',
    name: 'Commercial EPDM Reroof',
    mode: 'commercial',
    defaultSections: [
      { scopeType: 'commercial_epdm', sectionTemplateId: 'st-com-epdm-adh' },
    ],
    defaultTerms: DEFAULT_TERMS_COMMERCIAL,
    defaultExclusions: DEFAULT_EXCLUSIONS_COMMERCIAL,
    defaultIncluded: DEFAULT_INCLUDED_COMMERCIAL + ' EPDM 60mil fully adhered system with 20-year manufacturer warranty (NDL available with upgrade).',
  },
];

// ─── localStorage persistence for user customizations ───────────────────────
const LS_USER_LINE_ITEMS = 'cl_user_line_items';
const LS_USER_SECTION_TEMPLATES = 'cl_user_section_templates';
const LS_USER_QUOTE_TEMPLATES = 'cl_user_quote_templates';

function readLS(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) { return []; }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_e) { /* ignore */ }
}

export function loadUserLineItems() { return readLS(LS_USER_LINE_ITEMS); }
export function saveUserLineItems(items) { writeLS(LS_USER_LINE_ITEMS, items); }
export function loadUserSectionTemplates() { return readLS(LS_USER_SECTION_TEMPLATES); }
export function saveUserSectionTemplates(items) { writeLS(LS_USER_SECTION_TEMPLATES, items); }
export function loadUserQuoteTemplates() { return readLS(LS_USER_QUOTE_TEMPLATES); }
export function saveUserQuoteTemplates(items) { writeLS(LS_USER_QUOTE_TEMPLATES, items); }

// Merge seeded defaults with user-saved customisations; user-saved wins on
// id collisions so editing a seeded item creates a user-namespaced override.
function mergeById(seeded, user) {
  const byId = new Map();
  seeded.forEach(s => byId.set(s.id, s));
  user.forEach(u => byId.set(u.id, u));
  return Array.from(byId.values());
}

export function getAllLineItems() { return mergeById(LINE_ITEM_CATALOG, loadUserLineItems()); }
export function getAllSectionTemplates() { return mergeById(SECTION_TEMPLATES, loadUserSectionTemplates()); }
export function getAllQuoteTemplates() { return mergeById(QUOTE_TEMPLATES, loadUserQuoteTemplates()); }

// ─── Quote-building helpers ─────────────────────────────────────────────────
// Materialise a quote from a template — produces the sections array ready to
// drop into a Quote entity. Each section's lineItems are deep-cloned from the
// section template so the user can edit without mutating the seed.
let _liCounter = 0;
function freshLineItemId() {
  _liCounter += 1;
  return `li-${Date.now()}-${_liCounter}-${Math.random().toString(36).slice(2, 6)}`;
}
let _secCounter = 0;
function freshSectionId() {
  _secCounter += 1;
  return `qs-${Date.now()}-${_secCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

export function instantiateSectionFromTemplate(sectionTemplate) {
  if (!sectionTemplate) return null;
  const lineItems = (sectionTemplate.defaultLineItems || []).map(li => {
    const qty = Number(li.quantity) || 0;
    const price = Number(li.unitPrice) || 0;
    return {
      id: freshLineItemId(),
      description: li.description,
      category: li.category || 'Material',
      quantity: qty,
      unit: li.unit || 'EA',
      unitPrice: price,
      extension: Math.round(qty * price * 100) / 100,
      notes: li.notes || null,
    };
  });
  const subtotal = lineItems.reduce((s, li) => s + (li.extension || 0), 0);
  return {
    id: freshSectionId(),
    scopeId: null,
    scopeType: sectionTemplate.scopeType,
    sectionName: sectionTemplate.name,
    narrative: sectionTemplate.defaultNotes || '',
    lineItems,
    subtotal: Math.round(subtotal * 100) / 100,
  };
}

export function instantiateQuoteFromTemplate(quoteTemplate, allSectionTemplates) {
  if (!quoteTemplate) {
    return {
      mode: 'residential',
      sections: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      terms: DEFAULT_TERMS_RESIDENTIAL,
      exclusions: DEFAULT_EXCLUSIONS_RESIDENTIAL,
      included: DEFAULT_INCLUDED_RESIDENTIAL,
      alternates: [],
      paymentSchedule: [],
    };
  }
  const sections = (quoteTemplate.defaultSections || [])
    .map(refSec => {
      const t = allSectionTemplates.find(s => s.id === refSec.sectionTemplateId);
      return instantiateSectionFromTemplate(t);
    })
    .filter(Boolean);
  const subtotal = sections.reduce((sum, s) => sum + (s.subtotal || 0), 0);
  return {
    mode: quoteTemplate.mode,
    sections,
    subtotal,
    tax: 0,
    total: subtotal,
    terms: quoteTemplate.defaultTerms || (quoteTemplate.mode === 'commercial' ? DEFAULT_TERMS_COMMERCIAL : DEFAULT_TERMS_RESIDENTIAL),
    exclusions: quoteTemplate.defaultExclusions || (quoteTemplate.mode === 'commercial' ? DEFAULT_EXCLUSIONS_COMMERCIAL : DEFAULT_EXCLUSIONS_RESIDENTIAL),
    included: quoteTemplate.defaultIncluded || (quoteTemplate.mode === 'commercial' ? DEFAULT_INCLUDED_COMMERCIAL : DEFAULT_INCLUDED_RESIDENTIAL),
    alternates: [],
    paymentSchedule: [],
  };
}

// Instantiate a fresh LineItem from a catalog entry.
export function instantiateLineItemFromCatalog(catalogEntry, quantity = 1) {
  if (!catalogEntry) return null;
  const qty = Number(quantity) || 0;
  const price = Number(catalogEntry.unitPrice) || 0;
  return {
    id: freshLineItemId(),
    description: catalogEntry.description,
    category: catalogEntry.category,
    quantity: qty,
    unit: catalogEntry.unit,
    unitPrice: price,
    extension: Math.round(qty * price * 100) / 100,
    notes: catalogEntry.notes || null,
  };
}

// Distinct categories across the catalog (for filter dropdowns).
export const LINE_ITEM_CATEGORIES = Array.from(new Set(LINE_ITEM_CATALOG.map(c => c.category))).sort();
