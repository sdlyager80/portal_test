/**
 * BeneficiaryChangeForm
 *
 * 4-step work item dialog for the Beneficiary Change service definition.
 * Matches the Back-office Advanced Flow BPM:
 *   Step 1 – Policy Lookup (DocIntel/IDP extraction, policy API data)
 *   Step 2 – Digital Synopsis (auto-generated policy flags + request summary)
 *   Step 3 – Beneficiary Data (extracted form fields + signature validation)
 *   Step 4 – Disposition (STP eligibility checklist → IGO/NIGO + queue routing)
 */
import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Cancel,
  CheckCircle,
  ExpandMore,
  Search,
  Warning,
} from '@mui/icons-material';

// ── Constants ──────────────────────────────────────────────────────
const STEPS = ['Policy Lookup', 'Digital Synopsis', 'Beneficiary Data', 'Disposition'];

const RELATIONSHIPS = [
  'Spouse', 'Child', 'Parent', 'Sibling',
  'Other Individual', 'Trust', 'Estate',
  'Corporation', 'Funeral Home', 'Other',
];

const NON_NATURAL = ['Trust', 'Estate', 'Corporation', 'Funeral Home'];

const NIGO_REASONS = [
  'Owner signature missing or dated more than 6 months',
  'Joint owner signature missing or dated more than 6 months',
  'Irrevocable beneficiary signature missing or stale',
  'Assignee signature missing or stale',
  'Witness signature missing (owner resides in MA)',
  'Spouse signature missing (Community Property State)',
  'Primary Beneficiary 1 section is blank',
  'Beneficiary name is missing',
  'Relationship to insured is missing',
  'Primary beneficiary percentages do not equal 100%',
  'Contingent beneficiary percentages do not equal 100%',
  'Fraction or dollar amount entered as percentage allocation',
  'Same individual named as primary and contingent beneficiary',
  'Insured name does not match admin system',
  'Non-natural owner in policy',
  'Non-natural beneficiary — manual review required',
  'Pending owner change on policy',
  'Policy is restricted or suspended',
  'Complaint / DOI / VIP / Legal indicator on policy',
  'Copy of form used for additional beneficiaries',
  'Hand-written beneficiary change request',
  'Notary section filled — manual review required',
  'Corrections, erasures, or white-out identified on form',
  'Request submitted by POA / Guardian / Conservator',
];

const BAU_QUEUES = ['Question', 'SYSHOLD', 'Client', 'FILEREQ'];

const REQUEST_SOURCES = ['Fax', 'Mail', 'Email', 'Hand-written'];

const EMPTY_BENE = {
  name: '', pct: '', dob: '', ssn: '',
  phone: '', address: '', city: '', state: '', zip: '',
  relationship: '', irrevocable: false,
};

// ── Helpers ────────────────────────────────────────────────────────
const pctSum = (b1, b2) => {
  const a = parseFloat(b1.pct) || 0;
  const b = parseFloat(b2.pct) || 0;
  return b2.name.trim() ? a + b : a;
};

const isDuplicate = (p, c) =>
  p.name.trim() && c.name.trim() &&
  p.name.trim().toLowerCase() === c.name.trim().toLowerCase();

const isNonNatural = (b) => NON_NATURAL.includes(b.relationship);

// ── Sub-components ─────────────────────────────────────────────────
function FlagChip({ label, active, severity = 'warning' }) {
  if (!active) return null;
  const colors = { warning: 'warning', error: 'error', info: 'info' };
  return <Chip icon={<Warning fontSize="small" />} label={label} size="small" color={colors[severity]} />;
}

function SigRow({ label, present, onPresent, date, onDate, showStale, stale, onStale }) {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={<Checkbox checked={present} onChange={(e) => onPresent(e.target.checked)} size="small" />}
          label={<Typography variant="body2">{label}</Typography>}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth size="small"
          label="Date Signed"
          value={date}
          onChange={(e) => onDate(e.target.value)}
          placeholder="MM/DD/YYYY"
          disabled={!present}
        />
      </Grid>
      {showStale && (
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={<Checkbox checked={stale} onChange={(e) => onStale(e.target.checked)} size="small" />}
            label={<Typography variant="body2" color="error">Dated &gt; 6 months</Typography>}
            disabled={!present}
          />
        </Grid>
      )}
    </Grid>
  );
}

function BenePanel({ label, chipLabel, chipColor = 'primary', bene, onChange }) {
  const set = (field) => (e) => onChange({ ...bene, [field]: e.target.value });
  const setCheck = (field) => (e) => onChange({ ...bene, [field]: e.target.checked });

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: 'grey.50' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography fontWeight={600}>{label}</Typography>
          <Chip label={chipLabel} size="small" color={chipColor} variant="outlined" />
          {bene.name && <Chip label={bene.name} size="small" />}
          {bene.irrevocable && <Chip label="Irrevocable" size="small" color="error" />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <TextField fullWidth size="small" label="Full Name" value={bene.name} onChange={set('name')} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField fullWidth size="small" label="% Share" value={bene.pct} onChange={set('pct')} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth size="small" label="Date of Birth" value={bene.dob} onChange={set('dob')} placeholder="MM/DD/YYYY" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="SSN / Tax ID" value={bene.ssn} onChange={set('ssn')} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Telephone" value={bene.phone} onChange={set('phone')} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Relationship to Insured</InputLabel>
              <Select value={bene.relationship} onChange={set('relationship')} label="Relationship to Insured">
                {RELATIONSHIPS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth size="small" label="Mailing Address" value={bene.address} onChange={set('address')} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth size="small" label="City" value={bene.city} onChange={set('city')} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth size="small" label="State" value={bene.state} onChange={set('state')} />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth size="small" label="Zip" value={bene.zip} onChange={set('zip')} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={bene.irrevocable} onChange={setCheck('irrevocable')} />}
              label="Irrevocable designation"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

function StpCheck({ label, pass }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" py={0.3}>
      {pass
        ? <CheckCircle fontSize="small" color="success" />
        : <Cancel fontSize="small" color="error" />}
      <Typography variant="body2" color={pass ? 'text.primary' : 'error.main'}>{label}</Typography>
    </Stack>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function BeneficiaryChangeForm({ open, onClose, onSuccess, service }) {
  const [step, setStep]               = useState(0);
  const [policyInput, setPolicyInput] = useState('');
  const [policyData, setPolicyData]   = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [requestSource, setRequestSource] = useState('Fax');

  // Beneficiary state (pre-filled from DocIntel extraction in demo)
  const [primary1, setPrimary1]       = useState({ ...EMPTY_BENE });
  const [primary2, setPrimary2]       = useState({ ...EMPTY_BENE });
  const [contingent1, setContingent1] = useState({ ...EMPTY_BENE });
  const [contingent2, setContingent2] = useState({ ...EMPTY_BENE });

  // Signature validation state
  const [sigs, setSigs] = useState({
    ownerPresent: false,    ownerDate: '',     ownerStale: false,
    jointPresent: false,    jointDate: '',     jointStale: false,
    assigneePresent: false, assigneeDate: '',  assigneeStale: false,
    irrevPresent: false,    irrevDate: '',     irrevStale: false,
    witnessPresent: false,  witnessDate: '',
    spousePresent: false,   spouseDate: '',    spouseStale: false,
    notaryFilled: false,
    corrections: false,
    poa: false,
  });
  const setSig = (field) => (val) => setSigs((prev) => ({ ...prev, [field]: val }));

  // Disposition state
  const [disposition, setDisposition] = useState('');
  const [nigoReasons, setNigoReasons] = useState([]);
  const [routeQueue, setRouteQueue]   = useState('');
  const [notes, setNotes]             = useState('');
  const [submitting, setSubmitting]   = useState(false);

  // ── Policy lookup ────────────────────────────────────────────────
  const handleLookup = async () => {
    setLookupLoading(true);
    try {
      const res = await service.getBeneChangePolicyData(policyInput);
      setPolicyData(res.result);
      // Pre-fill bene data from DocIntel extraction
      if (res.result.extractedBeneficiaries) {
        const { primary, contingent } = res.result.extractedBeneficiaries;
        if (primary[0]) setPrimary1({ ...EMPTY_BENE, ...primary[0] });
        if (primary[1]) setPrimary2({ ...EMPTY_BENE, ...primary[1] });
        if (contingent[0]) setContingent1({ ...EMPTY_BENE, ...contingent[0] });
        if (contingent[1]) setContingent2({ ...EMPTY_BENE, ...contingent[1] });
      }
    } finally {
      setLookupLoading(false);
    }
  };

  // ── STP eligibility checks (computed) ───────────────────────────
  const p = policyData ?? {};
  const primaryPctOk = primary2.name.trim()
    ? Math.round(pctSum(primary1, primary2)) === 100
    : (primary1.name.trim() ? true : false);
  const contingentPctOk = contingent2.name.trim()
    ? Math.round(pctSum(contingent1, contingent2)) === 100
    : true;
  const hasDupBene = [primary1, primary2].some((pb) =>
    pb.name.trim() && [contingent1, contingent2].some((cb) => isDuplicate(pb, cb))
  );
  const hasNonNaturalBene = [primary1, primary2, contingent1, contingent2].some(
    (b) => b.name.trim() && isNonNatural(b)
  );
  const hasIrrevocableBene = [primary1, primary2, contingent1, contingent2].some(
    (b) => b.irrevocable
  );
  const formInfoComplete = primary1.name.trim().length > 0;
  const requiredSigsOk = (() => {
    if (!sigs.ownerPresent || sigs.ownerStale) return false;
    if (p.irrevocableBeneficiary && (!sigs.irrevPresent || sigs.irrevStale)) return false;
    if (p.assignee && (!sigs.assigneePresent || sigs.assigneeStale)) return false;
    if (p.ownerState === 'MA' && !sigs.witnessPresent) return false;
    if (p.communityPropertyState && p.married && (!sigs.spousePresent || sigs.spouseStale)) return false;
    return true;
  })();

  const stpChecks = [
    { label: 'No non-natural owner in policy',                pass: !p.nonNaturalOwner },
    { label: 'No non-natural beneficiary named',              pass: !hasNonNaturalBene },
    { label: 'No pending owner change',                       pass: !p.pendingOwnerChange },
    { label: 'Policy is not restricted or suspended',         pass: !p.suspended && !p.restricted },
    { label: 'No Complaint / DOI / VIP / Legal indicator',    pass: !p.complaintDOI && !p.vipLegal },
    { label: 'Required form information is present',          pass: formInfoComplete },
    { label: 'Standard form used (not a copy / hand-written)',pass: !sigs.corrections },
    { label: 'Primary beneficiary percentages equal 100%',    pass: primaryPctOk },
    { label: 'Contingent beneficiary percentages equal 100%', pass: contingentPctOk },
    { label: 'No duplicate primary / contingent beneficiary', pass: !hasDupBene },
    { label: 'Owner signature present and within 6 months',   pass: sigs.ownerPresent && !sigs.ownerStale },
    { label: 'All required signatures present and current',   pass: requiredSigsOk },
    { label: 'Notary section is not filled',                  pass: !sigs.notaryFilled },
    { label: 'No corrections / erasures / white-out on form', pass: !sigs.corrections },
    { label: 'Not submitted by POA / Guardian / Conservator', pass: !sigs.poa },
  ];

  const allPass = stpChecks.every((c) => c.pass);
  const touchLevel = allPass ? 'Moderate Touch (Partial STP)' : 'High Touch';
  const touchColor = allPass ? 'success' : 'warning';

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await service.createPolicyTask({
        task_type: 'Beneficiary Change',
        short_description: `Beneficiary Change — ${policyData?.insuredName ?? policyInput}`,
        description: notes,
        consumer: policyData?.ownerName ?? '',
        priority: '3',
        service_definition: 'sd1',
        policy_number: policyData?.policyNumber ?? policyInput,
        touch_level: touchLevel,
        disposition,
        nigo_reasons: nigoReasons.join('; '),
        route_queue: routeQueue,
      });
      onSuccess?.();
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(0); setPolicyInput(''); setPolicyData(null);
    setPrimary1({ ...EMPTY_BENE }); setPrimary2({ ...EMPTY_BENE });
    setContingent1({ ...EMPTY_BENE }); setContingent2({ ...EMPTY_BENE });
    setSigs({ ownerPresent: false, ownerDate: '', ownerStale: false, jointPresent: false, jointDate: '', jointStale: false, assigneePresent: false, assigneeDate: '', assigneeStale: false, irrevPresent: false, irrevDate: '', irrevStale: false, witnessPresent: false, witnessDate: '', spousePresent: false, spouseDate: '', spouseStale: false, notaryFilled: false, corrections: false, poa: false });
    setDisposition(''); setNigoReasons([]); setRouteQueue(''); setNotes('');
    onClose();
  };

  // ── Step renderers ───────────────────────────────────────────────
  const renderStep0 = () => (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Enter the policy number to fetch policy metadata via the admin/imaging system API.
        DocIntel/IDP extracted data will auto-populate the beneficiary fields.
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <TextField
          label="Policy Number"
          value={policyInput}
          onChange={(e) => setPolicyInput(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          onKeyDown={(e) => e.key === 'Enter' && policyInput && handleLookup()}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Request Source</InputLabel>
          <Select value={requestSource} onChange={(e) => setRequestSource(e.target.value)} label="Request Source">
            {REQUEST_SOURCES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={lookupLoading ? <CircularProgress size={16} color="inherit" /> : <Search />}
          onClick={handleLookup}
          disabled={!policyInput.trim() || lookupLoading}
        >
          Lookup
        </Button>
      </Stack>

      {policyData && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={policyData.status}
                color={policyData.status === 'Active' ? 'success' : 'error'}
                size="small"
              />
              <Chip label={`Source: ${requestSource}`} size="small" variant="outlined" />
              <Chip label="DocIntel: Extracted" size="small" color="info" />
              <Chip label={`Confidence: ${policyData.idpConfidence ?? 96}%`} size="small" variant="outlined" />
            </Stack>
            <Grid container spacing={1.5}>
              {[
                ['Policy Number',  policyData.policyNumber],
                ['Insured',        policyData.insuredName],
                ['Owner',          policyData.ownerName],
                ['Owner Tax ID',   policyData.ownerTaxId],
                ['Owner Phone',    policyData.ownerPhone],
                ['Resident State', policyData.ownerState],
              ].map(([label, val]) => (
                <Grid item xs={6} sm={4} key={label}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" fontWeight={500}>{val || '\u2014'}</Typography>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      )}
    </Stack>
  );

  const renderStep1 = () => (
    <Stack spacing={2.5}>
      <Alert severity="info" sx={{ py: 0.5 }}>
        Auto-generated digital synopsis based on policy API and imaging system data.
        Back-office processor must review and confirm before proceeding.
      </Alert>

      {/* Policy Summary */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Policy Summary</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
          <Chip label={`Status: ${p.status}`} size="small" color={p.status === 'Active' ? 'success' : 'error'} />
          <Chip label={`State: ${p.ownerState}`} size="small" variant="outlined" />
          {p.married && <Chip label="Owner: Married" size="small" variant="outlined" />}
          {p.communityPropertyState && <Chip label="Community Property State" size="small" color="warning" />}
        </Stack>
        <Stack spacing={0.5}>
          <FlagChip label="Policy is suspended" active={p.suspended} severity="error" />
          <FlagChip label="Policy is restricted" active={p.restricted} severity="error" />
          <FlagChip label="Irrevocable beneficiary on file — confirm additional irrevocable bene info on policy file" active={p.irrevocableBeneficiary} />
          <FlagChip label="Collateral assignment on file — confirm additional assignment info on policy file" active={p.assignee} />
          <FlagChip label="Pending owner change on policy" active={p.pendingOwnerChange} severity="error" />
          <FlagChip label="Complaint / DOI complaint on file" active={p.complaintDOI} severity="error" />
          <FlagChip label="VIP / Legal indicator on policy" active={p.vipLegal} severity="error" />
          <FlagChip label="POA / Guardian / Conservator noted on file" active={p.poa} />
          <FlagChip label="Policy in death pending status" active={p.deathPending} severity="error" />
          {!p.suspended && !p.restricted && !p.pendingOwnerChange && !p.complaintDOI && !p.vipLegal && !p.irrevocableBeneficiary && !p.assignee && !p.poa && !p.deathPending && (
            <Chip icon={<CheckCircle />} label="No policy-level flags identified" size="small" color="success" />
          )}
        </Stack>
      </Paper>

      {/* Request Summary */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Request Summary</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          The following conditions have been identified by DocIntel analysis. Processor must verify before disposition.
        </Typography>
        <Stack spacing={0.5}>
          <FlagChip label="Primary Beneficiary 1 section is blank" active={!primary1.name.trim()} severity="error" />
          <FlagChip label="Per Stirpes designation included on request" active={p.perStirpes} />
          <FlagChip label="Irrevocable beneficiary designation requested" active={hasIrrevocableBene} />
          {p.ownerState === 'MA' && (
            <Chip icon={<Warning fontSize="small" />} label="Owner resides in Massachusetts — disinterested witness signature required" size="small" color="warning" />
          )}
          {p.communityPropertyState && p.married && (
            <Chip icon={<Warning fontSize="small" />} label="Owner resides in Community Property State and is married — spouse signature required" size="small" color="warning" />
          )}
          {hasNonNaturalBene && (
            <Chip icon={<Warning fontSize="small" />} label="Non-natural beneficiary named — manual review required" size="small" color="warning" />
          )}
        </Stack>
      </Paper>
    </Stack>
  );

  const renderStep2 = () => (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Review fields auto-extracted by DocIntel/IDP. Edit any values that require correction before disposition.
      </Typography>

      <BenePanel label="Primary Beneficiary 1" chipLabel="Primary" chipColor="primary"
        bene={primary1} onChange={setPrimary1} />
      <BenePanel label="Primary Beneficiary 2" chipLabel="Primary" chipColor="primary"
        bene={primary2} onChange={setPrimary2} />
      <BenePanel label="Contingent Beneficiary 1" chipLabel="Contingent" chipColor="default"
        bene={contingent1} onChange={setContingent1} />
      <BenePanel label="Contingent Beneficiary 2" chipLabel="Contingent" chipColor="default"
        bene={contingent2} onChange={setContingent2} />

      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" fontWeight={700}>Signature Validation</Typography>
      <Typography variant="body2" color="text.secondary">
        Verify signatures on the submitted form against the requirements for this policy.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={1.5} divider={<Divider flexItem />}>
          <SigRow label="Owner Signature"
            present={sigs.ownerPresent} onPresent={setSig('ownerPresent')}
            date={sigs.ownerDate} onDate={setSig('ownerDate')}
            showStale stale={sigs.ownerStale} onStale={setSig('ownerStale')} />
          <SigRow label="Joint Owner Signature"
            present={sigs.jointPresent} onPresent={setSig('jointPresent')}
            date={sigs.jointDate} onDate={setSig('jointDate')}
            showStale stale={sigs.jointStale} onStale={setSig('jointStale')} />
          {(p.assignee || sigs.assigneePresent) && (
            <SigRow label="Assignee Signature"
              present={sigs.assigneePresent} onPresent={setSig('assigneePresent')}
              date={sigs.assigneeDate} onDate={setSig('assigneeDate')}
              showStale stale={sigs.assigneeStale} onStale={setSig('assigneeStale')} />
          )}
          {(p.irrevocableBeneficiary || sigs.irrevPresent) && (
            <SigRow label="Irrevocable Beneficiary Signature"
              present={sigs.irrevPresent} onPresent={setSig('irrevPresent')}
              date={sigs.irrevDate} onDate={setSig('irrevDate')}
              showStale stale={sigs.irrevStale} onStale={setSig('irrevStale')} />
          )}
          {(p.ownerState === 'MA' || sigs.witnessPresent) && (
            <SigRow label="Disinterested Witness (MA)"
              present={sigs.witnessPresent} onPresent={setSig('witnessPresent')}
              date={sigs.witnessDate} onDate={setSig('witnessDate')}
              showStale={false} />
          )}
          {((p.communityPropertyState && p.married) || sigs.spousePresent) && (
            <SigRow label="Spouse Signature (Community Property State)"
              present={sigs.spousePresent} onPresent={setSig('spousePresent')}
              date={sigs.spouseDate} onDate={setSig('spouseDate')}
              showStale stale={sigs.spouseStale} onStale={setSig('spouseStale')} />
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Additional Form Checks</Typography>
        <Stack>
          <FormControlLabel control={<Checkbox checked={sigs.notaryFilled} onChange={(e) => setSig('notaryFilled')(e.target.checked)} />}
            label="Notary section is filled on the submitted form" />
          <FormControlLabel control={<Checkbox checked={sigs.corrections} onChange={(e) => setSig('corrections')(e.target.checked)} />}
            label="Corrections, erasures, or white-out identified on form" />
          <FormControlLabel control={<Checkbox checked={sigs.poa} onChange={(e) => setSig('poa')(e.target.checked)} />}
            label="Request submitted by POA / Guardian / Conservator" />
        </Stack>
      </Paper>
    </Stack>
  );

  const renderStep3 = () => (
    <Stack spacing={2.5}>
      {/* STP eligibility */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>STP Eligibility Check</Typography>
          <Chip label={touchLevel} size="small" color={touchColor} />
        </Stack>
        <Grid container spacing={0} columns={2}>
          {stpChecks.map((c) => (
            <Grid item xs={2} sm={1} key={c.label}>
              <StpCheck label={c.label} pass={c.pass} />
            </Grid>
          ))}
        </Grid>
        {allPass ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            All STP conditions met. Request qualifies for Moderate Touch (Partial STP) processing.
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            One or more STP conditions failed. Request must be routed for High Touch or NIGO processing.
          </Alert>
        )}
      </Paper>

      {/* Disposition */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Disposition</Typography>
        <FormControl fullWidth size="small" required>
          <InputLabel>Disposition</InputLabel>
          <Select value={disposition} onChange={(e) => setDisposition(e.target.value)} label="Disposition">
            <MenuItem value="IGO">IGO — Process (Good Order)</MenuItem>
            <MenuItem value="NIGO">NIGO — Not in Good Order (Incomplete)</MenuItem>
          </Select>
        </FormControl>

        {disposition === 'NIGO' && (
          <Stack spacing={2} mt={2}>
            <Divider />
            <Typography variant="subtitle2">NIGO Reason(s)</Typography>
            <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 220, overflowY: 'auto', borderRadius: 1.5 }}>
              <FormGroup>
                {NIGO_REASONS.map((r) => (
                  <FormControlLabel
                    key={r}
                    control={
                      <Checkbox
                        size="small"
                        checked={nigoReasons.includes(r)}
                        onChange={(e) => setNigoReasons((prev) =>
                          e.target.checked ? [...prev, r] : prev.filter((x) => x !== r)
                        )}
                      />
                    }
                    label={<Typography variant="body2">{r}</Typography>}
                  />
                ))}
              </FormGroup>
            </Paper>
            <FormControl fullWidth size="small">
              <InputLabel>Route to Queue</InputLabel>
              <Select value={routeQueue} onChange={(e) => setRouteQueue(e.target.value)} label="Route to Queue">
                {BAU_QUEUES.map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        )}
      </Paper>

      {/* Notes */}
      <TextField
        fullWidth multiline rows={3}
        label="Processor Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Auto-generated comment will be appended to workitem on submission…"
      />
    </Stack>
  );

  const stepContent = [renderStep0, renderStep1, renderStep2, renderStep3];
  const canAdvance = [
    !!policyData,
    true,
    true,
    !!disposition && (disposition === 'IGO' || nigoReasons.length > 0),
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" fontWeight={700}>Beneficiary Change</Typography>
          <Chip label="Service Definition" size="small" variant="outlined" />
        </Stack>
      </DialogTitle>

      <Box sx={{ px: 3, pb: 1 }}>
        <Stepper activeStep={step} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        {stepContent[step]()}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
        <Box flex={1} />
        {step > 0 && (
          <Button onClick={() => setStep((s) => s - 1)} disabled={submitting}>Back</Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance[step]}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color={disposition === 'NIGO' ? 'error' : 'success'}
            onClick={handleSubmit}
            disabled={!canAdvance[step] || submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Submitting…' : disposition === 'IGO' ? 'Disposition as IGO' : 'Disposition as NIGO'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
