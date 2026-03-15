import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Helper: find topic by name substring ───
function findTopic(topics, paperId, nameSubstr, aliases) {
  let t = topics.find(
    (t) => t.paper_id === paperId && t.name.toLowerCase().includes(nameSubstr.toLowerCase())
  );
  // Try alias if direct match fails
  if (!t && aliases && aliases[nameSubstr.toLowerCase()]) {
    const alias = aliases[nameSubstr.toLowerCase()];
    t = topics.find(
      (t) => t.paper_id === paperId && t.name.toLowerCase().includes(alias.toLowerCase())
    );
  }
  if (!t) console.warn(`⚠ Topic not found: paper=${paperId}, substr="${nameSubstr}"`);
  return t;
}

// ─── Helper: find or create sub_topic ───
async function getSubTopicId(subTopics, topicId, topicName) {
  const existing = subTopics.find((st) => st.topic_id === topicId);
  if (existing) return existing.id;

  // Create a "General" sub_topic
  const { data, error } = await supabase
    .from('sub_topics')
    .insert({ topic_id: topicId, name: 'General', slug: 'general' })
    .select('id')
    .single();
  if (error) {
    console.error(`Error creating sub_topic for topic "${topicName}":`, error.message);
    return null;
  }
  console.log(`Created "General" sub_topic for "${topicName}"`);
  subTopics.push({ id: data.id, topic_id: topicId });
  return data.id;
}

// ─── MAIN ───
async function main() {
  console.log('🚀 Starting CA Foundation question seeding (v2)...\n');

  // 1) Delete existing questions
  console.log('🗑  Deleting existing questions...');
  const { error: delErr } = await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.error('Delete error:', delErr.message);
    return;
  }
  console.log('✅ Existing questions deleted.\n');

  // 2) Fetch papers, topics, sub_topics
  const { data: papers, error: pErr } = await supabase.from('papers').select('id, name, code');
  if (pErr) { console.error('Papers fetch error:', pErr.message); return; }
  console.log(`Fetched ${papers.length} papers`);

  const { data: topics, error: tErr } = await supabase.from('topics').select('id, name, paper_id');
  if (tErr) { console.error('Topics fetch error:', tErr.message); return; }
  console.log(`Fetched ${topics.length} topics`);

  const { data: subTopics, error: stErr } = await supabase.from('sub_topics').select('id, name, topic_id');
  if (stErr) { console.error('SubTopics fetch error:', stErr.message); return; }
  console.log(`Fetched ${subTopics.length} sub_topics\n`);

  // Map papers by slug/name patterns
  const p1 = papers.find((p) => /accounting|p.*1/i.test(p.name) || p.code?.includes('p1') || p.code?.includes('accounting'));
  const p2 = papers.find((p) => /business.*law|p.*2/i.test(p.name) || p.code?.includes('p2') || p.code?.includes('law'));
  const p3 = papers.find((p) => /math|stat|logical|p.*3/i.test(p.name) || p.code?.includes('p3') || p.code?.includes('math'));
  const p4 = papers.find((p) => /econom|commercial|p.*4/i.test(p.name) || p.code?.includes('p4') || p.code?.includes('econ'));

  if (!p1 || !p2 || !p3 || !p4) {
    console.error('Could not identify all 4 papers. Found:', papers.map((p) => `${p.code}: ${p.name}`));
    return;
  }

  console.log(`P1: ${p1.name} (${p1.id})`);
  console.log(`P2: ${p2.name} (${p2.id})`);
  console.log(`P3: ${p3.name} (${p3.id})`);
  console.log(`P4: ${p4.name} (${p4.id})\n`);

  // ────────────────────────────────────────────────────────────────────
  // QUESTION DATA — 200+ CA Foundation level MCQs
  // Format: [paperRef, topicSubstring, questionText, optA, optB, optC, optD, correct, explanation, difficulty, isDiagnostic]
  // ────────────────────────────────────────────────────────────────────

  // Topic alias mapping: script substring → actual DB topic name substring
  const topicAliases = {
    'journal': 'accounting process',
    'ledger': 'accounting process',
    'trial': 'accounting process',
    'rectification': 'accounting process',
    'consignment': 'special transaction',
    'joint venture': 'special transaction',
    'approval': 'special transaction',
    'accounting standard': 'theoretical',
    'offer': 'indian contract',
    'acceptance': 'indian contract',
    'consideration': 'indian contract',
    'capacity': 'indian contract',
    'free consent': 'indian contract',
    'void': 'indian contract',
    'discharge': 'indian contract',
    'breach': 'indian contract',
    'quasi': 'indian contract',
    'indemnity': 'indian contract',
    'guarantee': 'indian contract',
    'bailment': 'indian contract',
    'pledge': 'indian contract',
    'agency': 'indian contract',
    'llp': 'limited liability',
    'limit': 'calculus',
    'national income': 'introduction to business economics',
    'money': 'introduction to business economics',
    'business organization': 'business organisation',
    'indian economy': 'indian economic',
    'international trade': 'indian economic',
  };

  const rawQuestions = [
    // ================================================================
    // PAPER 1 — Principles & Practice of Accounting (~60 questions)
    // Diagnostic: 5 easy, 7 medium, 3 hard = 15
    // ================================================================

    // --- Theoretical Framework ---
    [p1, 'theoretical', 'The Going Concern concept assumes that:', 'The business will be liquidated soon', 'The business will continue operations indefinitely', 'Profits will always increase', 'All assets are valued at market price', 'b', 'Going Concern assumes the entity will continue in operational existence for the foreseeable future, allowing assets to be recorded at historical cost.', 'easy', true],
    [p1, 'theoretical', 'The convention of conservatism requires that:', 'Revenue is recognized early', 'Anticipated profits are recorded', 'All possible losses are provided for', 'Assets are overvalued', 'c', 'Conservatism (Prudence) dictates that anticipated losses should be provided for, but anticipated profits should not be recognized until realized.', 'medium', true],
    [p1, 'theoretical', 'Which accounting standard deals with Disclosure of Accounting Policies?', 'AS 2', 'AS 1', 'AS 6', 'AS 10', 'b', 'AS 1 (Disclosure of Accounting Policies) deals with the disclosure of significant accounting policies followed in preparing financial statements.', 'easy', true],
    [p1, 'theoretical', 'Under accrual basis of accounting, revenue is recognized when it is:', 'Received in cash', 'Earned regardless of receipt', 'Deposited in bank', 'Approved by management', 'b', 'Under accrual basis, revenues are recognized when earned (not when cash is received) and expenses when incurred (not when paid).', 'easy', false],

    // --- Accounting Process / Journal ---
    [p1, 'journal', 'When goods worth ₹10,000 are distributed as free samples, the entry is:', 'Debit Sales A/c, Credit Purchases A/c', 'Debit Advertisement A/c, Credit Purchases A/c', 'Debit Drawings A/c, Credit Purchases A/c', 'Debit Charity A/c, Credit Sales A/c', 'b', 'Free samples are a form of advertisement expense. Debit Advertisement A/c and Credit Purchases A/c.', 'easy', false],
    [p1, 'journal', 'Goods worth ₹5,000 taken by the proprietor for personal use requires:', 'Debit Purchases, Credit Capital', 'Debit Drawings, Credit Purchases', 'Debit Capital, Credit Sales', 'Debit Purchases, Credit Cash', 'b', 'When the owner withdraws goods, Drawings A/c is debited (reducing equity) and Purchases A/c is credited.', 'easy', false],
    [p1, 'journal', 'Credit purchase of furniture should be recorded in:', 'Purchases Book', 'Journal Proper', 'Cash Book', 'Sales Book', 'b', 'Credit purchase of furniture (a fixed asset, not goods) is recorded in Journal Proper, not in the Purchases Book which is only for goods.', 'medium', false],
    [p1, 'journal', 'Outstanding salary of ₹8,000 at year-end requires the adjusting entry:', 'Debit Salary A/c ₹8,000, Credit Outstanding Salary A/c ₹8,000', 'Debit Cash A/c ₹8,000, Credit Salary A/c ₹8,000', 'Debit Outstanding Salary A/c ₹8,000, Credit Salary A/c ₹8,000', 'Debit Salary A/c ₹8,000, Credit Cash A/c ₹8,000', 'a', 'Outstanding expenses are recognized by debiting the expense account and crediting the outstanding liability account.', 'medium', false],

    // --- Ledger ---
    [p1, 'ledger', 'In a ledger, the balance of a personal account showing a debit balance indicates:', 'Amount owed by the business', 'Amount owed to the business', 'Profit earned', 'Loss incurred', 'b', 'A debit balance on a personal account means that person owes money to the business (a debtor/receivable).', 'easy', false],
    [p1, 'ledger', 'Which of the following accounts normally shows a credit balance?', 'Machinery Account', 'Creditors Account', 'Cash Account', 'Debtors Account', 'b', 'Creditors (liabilities) have a credit balance as they represent obligations owed by the business.', 'easy', false],

    // --- Trial Balance ---
    [p1, 'trial', 'A Trial Balance is prepared to check:', 'Profitability of the business', 'Arithmetical accuracy of books', 'Financial position', 'Cash position', 'b', 'The primary purpose of a Trial Balance is to verify the arithmetical accuracy of the double-entry bookkeeping system.', 'easy', true],
    [p1, 'trial', 'Which of the following errors is NOT revealed by a Trial Balance?', 'Wrong totaling of subsidiary books', 'Posting to wrong account but correct side', 'Omission of posting to ledger', 'Wrong balancing of an account', 'b', 'Errors of commission (posting to wrong account but correct side and correct amount) are not revealed by Trial Balance as both sides still agree.', 'medium', true],

    // --- Rectification of Errors ---
    [p1, 'rectification', 'Purchase of machinery ₹50,000 debited to Purchases Account is an error of:', 'Principle', 'Omission', 'Commission', 'Compensating', 'a', 'Recording a capital expenditure as revenue expenditure violates accounting principles, hence it is an error of principle.', 'medium', true],
    [p1, 'rectification', 'A Suspense Account is opened when:', 'Trial Balance does not agree', 'There is a profit', 'Bank reconciliation is done', 'Depreciation is charged', 'a', 'Suspense Account is a temporary account opened with the difference in Trial Balance until errors are located and rectified.', 'medium', false],

    // --- Bank Reconciliation ---
    [p1, 'bank', 'A cheque of ₹15,000 deposited but not yet credited by bank will:', 'Increase bank balance per bank statement', 'Decrease cash book balance', 'Be added to bank statement balance', 'Be deducted from cash book balance', 'c', 'Cheques deposited but not yet credited appear in cash book but not bank statement. Starting from bank balance, add this amount to arrive at cash book balance.', 'medium', true],
    [p1, 'bank', 'If the bank column of Cash Book shows ₹50,000 (Dr) and cheques issued but not presented amount to ₹8,000, the bank statement should show:', '₹42,000', '₹58,000', '₹50,000', '₹8,000', 'b', 'Cheques issued but not presented have been deducted in the Cash Book but not yet by the bank. Therefore, the bank statement balance will be higher: Bank balance = Cash Book balance + Cheques issued not presented = ₹50,000 + ₹8,000 = ₹58,000.', 'hard', false],

    // --- Depreciation ---
    [p1, 'depreciation', 'Under Straight Line Method, annual depreciation on an asset costing ₹2,00,000 with residual value ₹20,000 and useful life 10 years is:', '₹20,000', '₹18,000', '₹2,00,000', '₹22,000', 'b', 'SLM Depreciation = (Cost - Residual Value) / Useful Life = (₹2,00,000 - ₹20,000) / 10 = ₹18,000 per annum.', 'easy', true],
    [p1, 'depreciation', 'Under Written Down Value method, if cost is ₹1,00,000 and rate is 10%, depreciation in 3rd year is:', '₹8,100', '₹10,000', '₹9,000', '₹7,290', 'a', 'Year 1: ₹1,00,000 × 10% = ₹10,000 (WDV = ₹90,000). Year 2: ₹90,000 × 10% = ₹9,000 (WDV = ₹81,000). Year 3: ₹81,000 × 10% = ₹8,100.', 'medium', false],
    [p1, 'depreciation', 'Depreciation is charged to comply with which accounting concept?', 'Going Concern', 'Matching', 'Conservatism', 'Dual Aspect', 'b', 'Depreciation allocates cost over useful life to match expenses with revenues earned in each period, following the Matching concept.', 'medium', false],

    // --- Inventories ---
    [p1, 'inventor', 'Under FIFO method, closing stock is valued at:', 'Oldest prices', 'Latest prices', 'Average prices', 'Standard prices', 'b', 'FIFO assumes earliest purchased items are sold first, so closing stock reflects the most recent (latest) purchase prices.', 'easy', false],
    [p1, 'inventor', 'As per AS 2, inventories should be valued at:', 'Cost price', 'Market price', 'Lower of cost and net realisable value', 'Higher of cost and market value', 'c', 'AS 2 (Valuation of Inventories) requires inventories to be valued at the lower of cost and net realisable value (NRV).', 'medium', false],
    [p1, 'inventor', 'In weighted average method, the cost of goods available for sale is divided by:', 'Number of transactions', 'Total units available for sale', 'Number of units sold', 'Opening stock units', 'b', 'Weighted average cost per unit = Total cost of goods available for sale / Total units available for sale.', 'medium', false],

    // --- Bills of Exchange ---
    [p1, 'bill', 'When a bill is dishonoured, the drawer records the entry as:', 'Debit Bills Receivable, Credit Drawee', 'Debit Drawee, Credit Bills Receivable', 'Debit Cash, Credit Bills Receivable', 'Debit Bills Receivable, Credit Cash', 'b', 'On dishonour, Bills Receivable A/c is credited (bill cancelled) and the Drawee\'s personal A/c is debited (debt revived).', 'medium', false],
    [p1, 'bill', 'Noting charges on dishonour of a bill are borne by:', 'Drawer', 'Drawee', 'Endorsee', 'Bank', 'b', 'Noting charges are borne by the drawee (acceptor) as they are at fault for dishonour, though initially paid by the holder.', 'medium', true],

    // --- Consignment ---
    [p1, 'consignment', 'Del credere commission is given to the consignee for:', 'Storing goods safely', 'Bearing bad debt risk', 'Transporting goods', 'Insuring goods', 'b', 'Del credere commission compensates the consignee for guaranteeing payment from third parties, bearing the risk of bad debts.', 'medium', false],
    [p1, 'consignment', 'Goods sent on consignment are valued by the consignor at:', 'Cost price only', 'Selling price', 'Cost plus proportionate expenses', 'Market price', 'c', 'Unsold stock with consignee is valued at cost price plus a proportionate share of expenses incurred by the consignor.', 'hard', false],

    // --- Joint Ventures ---
    [p1, 'joint venture', 'In joint venture, when separate books are maintained, the Memorandum Joint Venture Account is a:', 'Personal account', 'Real account', 'Nominal account', 'It is not a ledger account', 'd', 'Memorandum Joint Venture Account is not part of the double-entry system — it is prepared separately to calculate profit/loss.', 'hard', true],

    // --- Partnership Accounts ---
    [p1, 'partnership', 'In absence of a partnership deed, partners share profits:', 'In capital ratio', 'Equally', 'In ratio of loans', 'As per seniority', 'b', 'As per the Indian Partnership Act 1932, in the absence of any agreement, partners share profits and losses equally.', 'easy', false],
    [p1, 'partnership', 'Interest on drawings is:', 'Credited to Profit & Loss Appropriation A/c', 'Debited to Profit & Loss A/c', 'Credited to Partners\' Capital A/c', 'Debited to Profit & Loss Appropriation A/c', 'a', 'Interest on drawings is charged from partners and credited to Profit & Loss Appropriation A/c, reducing the amount available for distribution.', 'medium', false],
    [p1, 'partnership', 'Goodwill at the time of admission of a new partner is valued using:', 'Only super profit method', 'Only capitalisation method', 'Any agreed method among partners', 'Only average profit method', 'c', 'Goodwill can be valued using any method agreed upon by the partners — super profit, capitalisation, average profit, or any other method.', 'medium', false],
    [p1, 'partnership', 'When a partner retires, the gaining ratio is calculated as:', 'New ratio – Old ratio', 'Old ratio – New ratio', 'Sacrificing ratio – Old ratio', 'New ratio ÷ Old ratio', 'a', 'Gaining ratio = New profit-sharing ratio – Old profit-sharing ratio for each continuing partner.', 'hard', false],
    [p1, 'partnership', 'On dissolution of a firm, Realisation Account is a:', 'Personal account', 'Real account', 'Nominal account', 'None of the above', 'c', 'Realisation Account is a nominal account prepared to calculate the profit or loss on dissolution of the firm.', 'medium', false],

    // --- Company Accounts ---
    [p1, 'company', 'Share premium received on issue of shares is shown under:', 'Current liabilities', 'Reserves and Surplus', 'Share Capital', 'Other income', 'b', 'Securities Premium (Share Premium) is shown under "Reserves and Surplus" in the balance sheet as per Schedule III of Companies Act.', 'medium', true],
    [p1, 'company', 'Calls in arrears represents:', 'Amount not yet called by company', 'Amount called but not paid by shareholders', 'Premium on shares', 'Discount on shares', 'b', 'Calls in Arrears is the amount that has been called by the company but not yet paid by the shareholders.', 'easy', false],
    [p1, 'company', 'Minimum subscription as per SEBI guidelines is:', '75% of issued capital', '90% of issued capital', '50% of issued capital', '100% of issued capital', 'b', 'As per SEBI (ICDR) Regulations, the minimum subscription required is 90% of the issue size for public issues.', 'hard', false],
    [p1, 'company', 'Forfeiture of shares results in:', 'Increase in paid-up capital', 'Decrease in paid-up capital', 'Increase in authorised capital', 'No change in capital', 'b', 'Forfeiture of shares reduces the paid-up share capital of the company by the amount already paid by the defaulting shareholder.', 'medium', false],
    [p1, 'company', 'When forfeited shares are reissued at a discount, the maximum discount allowed is:', 'Face value of shares', 'Amount forfeited on such shares', 'Share premium amount', 'No limit', 'b', 'Forfeited shares can be reissued at a discount not exceeding the amount forfeited on such shares (i.e., the balance in Forfeited Shares A/c).', 'hard', true],

    // --- Not-for-Profit ---
    [p1, 'not-for-profit', 'In a Not-for-Profit organization, the excess of income over expenditure is termed as:', 'Profit', 'Surplus', 'Net Income', 'Retained Earnings', 'b', 'NPOs do not earn "profit" — the excess of income over expenditure is termed as "Surplus" and excess of expenditure over income as "Deficit".', 'easy', false],
    [p1, 'not-for-profit', 'Subscription received in advance is treated as:', 'Income', 'Asset', 'Liability', 'Capital Fund', 'c', 'Subscription received in advance is shown as a current liability in the Balance Sheet as it pertains to a future period.', 'medium', false],
    [p1, 'not-for-profit', 'Entrance fees of recurring nature in a Not-for-Profit organization are:', 'Capitalized', 'Treated as revenue income', 'Shown as liability', 'Ignored', 'b', 'If entrance fees are small and recurring, they are treated as revenue income in the Income & Expenditure Account.', 'medium', false],
    [p1, 'not-for-profit', 'Capital Fund in a Not-for-Profit organization is equivalent to:', 'Share Capital', 'Retained Profits', 'Owner\'s Capital/Equity', 'Reserves', 'c', 'Capital Fund represents the net assets of the organization, equivalent to owner\'s equity in commercial entities.', 'easy', false],

    // --- Sale on Approval ---
    [p1, 'approval', 'Goods sent on sale or return basis, if not returned within the specified period, are treated as:', 'Consignment goods', 'Regular sales', 'Goods in transit', 'Contingent assets', 'b', 'If goods are not returned within the stipulated time or the buyer expresses approval, they are treated as regular sales.', 'medium', false],

    // --- Accounting Standards ---
    [p1, 'accounting standard', 'AS 6 deals with:', 'Depreciation accounting', 'Revenue recognition', 'Inventory valuation', 'Cash flow statements', 'a', 'AS 6 (Depreciation Accounting) prescribes the method and disclosure requirements for depreciation of depreciable assets.', 'medium', false],
    [p1, 'accounting standard', 'AS 9 relates to:', 'Revenue Recognition', 'Depreciation', 'Inventories', 'Contingencies', 'a', 'AS 9 (Revenue Recognition) deals with the recognition of revenue from sale of goods, rendering of services, and use of enterprise resources.', 'medium', false],

    // Additional P1 fillers
    [p1, 'theoretical', 'The dual aspect concept means:', 'Every debit has a corresponding credit', 'Two books are maintained', 'Assets are always more than liabilities', 'Income is always equal to expenses', 'a', 'Dual Aspect (Duality) concept states that every transaction has two aspects — a debit and a credit of equal amount.', 'easy', false],
    [p1, 'theoretical', 'Business entity concept distinguishes between:', 'Revenue and capital expenditure', 'Owner and business as separate entities', 'Cash and credit transactions', 'Current and non-current assets', 'b', 'Business Entity concept treats the business and its owner as two separate entities for accounting purposes.', 'easy', false],
    [p1, 'depreciation', 'If an asset is purchased mid-year on 1st October and depreciation rate is 10% on cost of ₹60,000, depreciation for the financial year ending 31st March is:', '₹6,000', '₹3,000', '₹4,500', '₹1,500', 'b', 'Asset used for 6 months (Oct to March). Depreciation = ₹60,000 × 10% × 6/12 = ₹3,000.', 'medium', false],
    [p1, 'partnership', 'Salary to a partner is debited to:', 'Profit & Loss Account', 'Profit & Loss Appropriation Account', 'Partner\'s Capital Account', 'Trading Account', 'b', 'Partners\' salary, interest on capital, and commission are appropriations of profit, debited to P&L Appropriation A/c.', 'medium', false],
    [p1, 'company', 'Pro rata allotment means:', 'Full allotment to all applicants', 'Proportionate allotment due to over-subscription', 'No allotment', 'Allotment only to promoters', 'b', 'Pro rata allotment occurs when shares are over-subscribed and shares are allotted proportionately to applicants.', 'medium', false],
    [p1, 'not-for-profit', 'Legacy received by a Not-for-Profit organization is:', 'Shown in Income & Expenditure A/c', 'Capitalized and added to Capital Fund', 'Shown as liability', 'Ignored in accounts', 'b', 'Legacy is a non-recurring, capital receipt and is capitalized (added to Capital Fund in the Balance Sheet), not shown as income.', 'hard', false],

    // --- Additional P1 to reach 60+ and fix diagnostics ---
    [p1, 'ledger', 'The balance of a nominal account at the end of the period is transferred to:', 'Balance Sheet', 'Trading or Profit & Loss Account', 'Trial Balance', 'Cash Book', 'b', 'Nominal accounts (expenses and incomes) are closed at year-end by transferring their balances to the Trading or Profit & Loss Account.', 'easy', true],
    [p1, 'consignment', 'Proforma invoice is sent by:', 'Consignee to consignor', 'Consignor to consignee', 'Buyer to seller', 'Bank to consignor', 'b', 'A proforma invoice is sent by the consignor to the consignee along with goods, indicating the description, quantity, and price.', 'medium', true],
    [p1, 'bank', 'Direct debit by bank recorded only in the bank statement requires adjustment in:', 'Bank statement', 'Cash Book (bank column)', 'Journal Proper', 'Petty Cash Book', 'b', 'Direct debits by the bank (bank charges, standing orders) appear only in the bank statement. The Cash Book must be adjusted to record these.', 'hard', true],
    [p1, 'partnership', 'When a new partner is admitted, old partners make a sacrifice. The ratio of sacrifice is:', 'New ratio – Old ratio', 'Old ratio – New ratio', 'Old ratio ÷ New ratio', 'Old ratio × New ratio', 'b', 'Sacrificing ratio = Old ratio – New ratio for each existing partner. The total sacrifice equals the new partner\'s share.', 'hard', false],
    [p1, 'company', 'Debentures issued as collateral security are:', 'Recorded in books as a liability', 'Not recorded but disclosed as a note', 'Shown in Profit & Loss Account', 'Recorded as an asset', 'b', 'Debentures issued as collateral security are not recorded in the books of accounts but are disclosed by way of a note to the Balance Sheet.', 'medium', false],
    [p1, 'inventor', 'Net Realisable Value (NRV) is:', 'Cost price minus selling expenses', 'Estimated selling price less estimated costs of completion and selling', 'Market price plus profit margin', 'Replacement cost', 'b', 'NRV = Estimated selling price in ordinary course of business - Estimated costs of completion - Estimated selling expenses (as per AS 2).', 'medium', false],
    [p1, 'journal', 'Bad debts recovered account is a:', 'Personal account', 'Real account', 'Nominal account (income)', 'Contra account', 'c', 'Bad debts recovered is a nominal account representing income, credited when previously written-off debts are received.', 'easy', false],
    [p1, 'theoretical', 'Revenue recognition as per AS 9 requires that:', 'Cash must be received', 'Significant risks and rewards of ownership are transferred', 'Invoice must be raised', 'Goods must be delivered physically', 'b', 'AS 9 states revenue from sale of goods is recognized when significant risks and rewards of ownership are transferred to the buyer.', 'medium', false],
    [p1, 'approval', 'Goods sent on approval or return basis, remaining unsold at year-end, are:', 'Treated as sales', 'Included in closing stock of the sender at cost', 'Written off', 'Shown as debtors', 'b', 'Unsold goods on approval/return basis must be reversed from sales and included in the sender\'s closing stock at cost or NRV.', 'hard', false],

    // ================================================================
    // PAPER 2 — Business Laws (~50 questions)
    // Diagnostic: 5 easy, 7 medium, 3 hard = 15
    // ================================================================

    // --- Indian Contract Act: Offer & Acceptance ---
    [p2, 'offer', 'An offer made to the world at large is called:', 'Special offer', 'General offer', 'Cross offer', 'Counter offer', 'b', 'A general offer (like Carlill v Carbolic Smoke Ball Co.) is made to the public at large and can be accepted by anyone fulfilling its conditions.', 'easy', true],
    [p2, 'offer', 'A counter offer:', 'Accepts the original offer conditionally', 'Terminates the original offer', 'Modifies the original offer but keeps it alive', 'Has no legal effect', 'b', 'A counter offer amounts to rejection of the original offer and constitutes a new offer. The original offer ceases to exist.', 'medium', true],
    [p2, 'acceptance', 'Communication of acceptance is complete against the proposer when:', 'It is posted', 'It reaches the proposer', 'It is read by the proposer', 'It is acknowledged', 'a', 'Under Section 4 of the Indian Contract Act, acceptance is complete against the proposer when the letter is posted (postal rule).', 'medium', true],
    [p2, 'acceptance', 'Acceptance must be:', 'Conditional', 'Absolute and unqualified', 'Partial', 'In writing only', 'b', 'Section 7 of the Indian Contract Act requires acceptance to be absolute and unqualified to convert a proposal into a promise.', 'easy', false],

    // --- Consideration ---
    [p2, 'consideration', 'Consideration under Indian law can be:', 'Only from the promisee', 'From promisee or any other person', 'Only in cash', 'Only future consideration', 'b', 'Under Indian Contract Act (Sec 2(d)), consideration may proceed from the promisee or any other person (stranger to consideration can sue).', 'medium', true],
    [p2, 'consideration', 'An agreement without consideration is generally:', 'Valid', 'Void', 'Voidable', 'Illegal', 'b', 'Under Section 25, an agreement without consideration is void, subject to exceptions like natural love and affection, past voluntary services, etc.', 'easy', true],
    [p2, 'consideration', 'Which is NOT an exception to the rule "No consideration, no contract"?', 'Natural love and affection (Sec 25(1))', 'Past voluntary service (Sec 25(2))', 'Promise to pay time-barred debt (Sec 25(3))', 'Promise made to a minor', 'd', 'Promise made to a minor is void ab initio, not an exception. Exceptions are: natural love & affection, past voluntary service, and time-barred debt.', 'hard', true],

    // --- Capacity ---
    [p2, 'capacity', 'An agreement with a minor is:', 'Valid', 'Voidable at minor\'s option', 'Void ab initio', 'Valid if guardian consents', 'c', 'As held in Mohiri Bibi v Dharmodas Ghose, a minor\'s agreement is void ab initio — it cannot be enforced.', 'easy', true],
    [p2, 'capacity', 'A person of unsound mind can enter into a contract:', 'At any time', 'During lucid intervals', 'Never', 'Only with court permission', 'b', 'Section 12 allows a person of unsound mind to contract during lucid intervals when they are capable of understanding the terms.', 'medium', false],

    // --- Free Consent ---
    [p2, 'free consent', 'Consent is said to be free when it is not obtained by:', 'Negotiation', 'Coercion, undue influence, fraud, misrepresentation, or mistake', 'Mutual agreement', 'Written communication', 'b', 'Section 14 defines free consent as consent not caused by coercion (Sec 15), undue influence (Sec 16), fraud (Sec 17), misrepresentation (Sec 18), or mistake (Sec 20-22).', 'easy', false],
    [p2, 'free consent', 'A contract obtained by coercion is:', 'Void', 'Voidable at the option of the aggrieved party', 'Valid', 'Illegal', 'b', 'Under Section 19, a contract induced by coercion is voidable at the option of the party whose consent was obtained by coercion.', 'medium', true],
    [p2, 'free consent', 'Undue influence exists when one party is in a position to:', 'Negotiate better terms', 'Dominate the will of the other', 'Offer higher consideration', 'Provide written guarantees', 'b', 'Section 16 defines undue influence as one party being in a position to dominate the will of the other and using that position to obtain unfair advantage.', 'medium', false],

    // --- Void Agreements ---
    [p2, 'void', 'An agreement in restraint of trade is:', 'Valid', 'Voidable', 'Void under Section 27', 'Illegal', 'c', 'Section 27 of the Indian Contract Act declares that every agreement in restraint of trade is void, except sale of goodwill.', 'medium', false],
    [p2, 'void', 'A wagering agreement is:', 'Valid and enforceable', 'Void under Section 30', 'Voidable', 'Illegal in all states', 'b', 'Section 30 makes wagering agreements void. However, they are not illegal (except in Gujarat and Maharashtra) — collateral transactions remain valid.', 'medium', true],

    // --- Discharge of Contract ---
    [p2, 'discharge', 'Novation means:', 'Cancellation of contract', 'Substitution of a new contract for the existing one', 'Partial performance', 'Breach of contract', 'b', 'Novation under Section 62 means substitution of a new contract in place of the old one, with mutual consent. The old contract is discharged.', 'medium', false],
    [p2, 'discharge', 'Doctrine of frustration applies when:', 'One party breaches', 'Performance becomes impossible due to supervening events', 'Parties mutually agree to end contract', 'Consideration fails', 'b', 'Section 56 covers frustration — when an act becomes impossible or unlawful after the contract is made due to events beyond parties\' control.', 'hard', false],

    // --- Breach ---
    [p2, 'breach', 'Anticipatory breach of contract occurs when:', 'A party fails to perform on due date', 'A party communicates intention not to perform before due date', 'Both parties agree not to perform', 'Contract is frustrated', 'b', 'Anticipatory breach occurs when a party indicates before the due date of performance that they will not fulfill their obligations.', 'medium', false],
    [p2, 'breach', 'Liquidated damages are:', 'Damages fixed by court', 'Pre-determined reasonable estimate of damages in the contract', 'Unlimited damages', 'Punitive damages', 'b', 'Liquidated damages are a pre-agreed sum fixed at the time of contract as a genuine estimate of loss in case of breach.', 'medium', false],

    // --- Quasi-Contracts ---
    [p2, 'quasi', 'Quasi-contracts are based on the principle of:', 'Freedom of contract', 'Unjust enrichment', 'Consensus ad idem', 'Privity of contract', 'b', 'Quasi-contracts (Sections 68-72) are not real contracts but obligations imposed by law to prevent unjust enrichment.', 'medium', true],

    // --- Indemnity & Guarantee ---
    [p2, 'indemnity', 'In a contract of indemnity, the number of parties is:', 'Three', 'Two', 'Four', 'One', 'b', 'Contract of indemnity (Section 124) involves two parties — indemnifier and indemnity-holder (indemnified).', 'easy', false],
    [p2, 'guarantee', 'In a contract of guarantee, the person who gives the guarantee is called:', 'Creditor', 'Principal debtor', 'Surety', 'Indemnifier', 'c', 'Section 126 identifies three parties: Surety (guarantor), Principal Debtor (borrower), and Creditor (lender).', 'easy', true],
    [p2, 'guarantee', 'A continuing guarantee can be revoked:', 'Only by the creditor', 'By the surety for future transactions by giving notice', 'Only by court order', 'It cannot be revoked', 'b', 'Section 130: A continuing guarantee may be revoked by the surety by giving notice to the creditor for future transactions.', 'hard', false],

    // --- Bailment & Pledge ---
    [p2, 'bailment', 'Bailment involves:', 'Transfer of ownership', 'Transfer of possession for a specific purpose', 'Transfer of title', 'Sale of goods', 'b', 'Section 148 defines bailment as delivery of goods by one person to another for some purpose, upon a contract that goods shall be returned when purpose is accomplished.', 'easy', false],
    [p2, 'bailment', 'A gratuitous bailee is liable for:', 'Ordinary negligence only', 'Gross negligence only', 'No negligence', 'All types of loss', 'b', 'A gratuitous bailee (who receives no consideration) must take reasonable care and is liable only for gross negligence.', 'hard', true],
    [p2, 'pledge', 'In pledge, the pawnee can sell goods in case of default:', 'Immediately without notice', 'After giving reasonable notice of sale', 'Only through court auction', 'Only if pledger consents', 'b', 'Section 176: If the pawnor defaults, the pawnee may sell the goods after giving reasonable notice of sale.', 'medium', false],

    // --- Agency ---
    [p2, 'agency', 'An agent\'s authority can be:', 'Express only', 'Implied only', 'Express, implied, or apparent', 'None of the above', 'c', 'An agent\'s authority can be express (written/oral), implied (from circumstances), or apparent (ostensible authority perceived by third parties).', 'medium', false],
    [p2, 'agency', 'Ratification of an unauthorized act relates back to:', 'The date of ratification', 'The date of the unauthorized act', 'The date of knowledge', 'No specific date', 'b', 'Ratification (Section 196) relates back to the date when the act was originally done, making it binding from that date.', 'hard', true],
    [p2, 'agency', 'An agency is irrevocable when:', 'The agent has performed part of the work', 'The agent has an interest in the subject matter', 'The principal wants to revoke', 'The contract period has expired', 'b', 'An agency coupled with interest (where the agent has personal interest in the subject matter) is irrevocable.', 'hard', false],

    // --- Sale of Goods Act ---
    [p2, 'sale of goods', 'Under the Sale of Goods Act, a "sale" differs from "agreement to sell" in that:', 'Sale transfers ownership immediately', 'Sale involves only movable goods', 'Agreement to sell is always conditional', 'There is no difference', 'a', 'In a sale, property (ownership) in goods is transferred immediately. In agreement to sell, transfer is to take place at a future time or subject to conditions.', 'medium', false],
    [p2, 'sale of goods', 'The doctrine of "Caveat Emptor" means:', 'Seller beware', 'Let the buyer beware', 'Quality guaranteed', 'Fair trade practices', 'b', 'Caveat Emptor (let the buyer beware) means the buyer must examine goods before purchase — the seller is not bound to disclose defects.', 'easy', false],
    [p2, 'sale of goods', 'Implied condition as to merchantable quality applies when:', 'Goods are sold by sample', 'Goods are sold by description from a dealer', 'Buyer inspects and finds defects', 'All private sales', 'b', 'Section 16(2): Implied condition of merchantable quality applies when goods are bought by description from a seller who deals in such goods.', 'medium', false],
    [p2, 'sale of goods', 'An unpaid seller has the right of:', 'Lien, stoppage in transit, and resale', 'Only lien', 'Only resale', 'No rights', 'a', 'An unpaid seller has three rights against goods: lien (Sec 47), stoppage in transit (Sec 50), and right of resale (Sec 54).', 'medium', true],

    // --- Partnership Act ---
    [p2, 'partnership act', 'As per the Indian Partnership Act, the relationship of partners is based on:', 'Formal agreement only', 'Mutual agency', 'Master-servant relationship', 'Principal-creditor relationship', 'b', 'Section 18 of the Partnership Act states that every partner is both an agent and a principal of the other partners (mutual agency).', 'medium', false],
    [p2, 'partnership act', 'A minor can be:', 'A partner with full liability', 'Admitted to the benefits of the firm only', 'Never associated with a firm', 'A managing partner', 'b', 'Section 30 allows a minor to be admitted to the benefits of an existing partnership with the consent of all partners, but with no personal liability.', 'easy', false],

    // --- LLP Act ---
    [p2, 'llp', 'In an LLP, the liability of each partner is:', 'Unlimited and joint', 'Limited to their agreed contribution', 'Limited to profits only', 'Determined by court', 'b', 'In a Limited Liability Partnership, every partner\'s liability is limited to their agreed contribution to the LLP.', 'easy', false],

    // --- Companies Act ---
    [p2, 'companies act', 'The minimum number of members to form a public company is:', 'Two', 'Seven', 'Fifteen', 'Twenty-one', 'b', 'Under the Companies Act 2013, the minimum number of members required to form a public company is 7 (and 2 for a private company).', 'easy', false],
    [p2, 'companies act', 'Memorandum of Association contains:', 'Internal rules of the company', 'Fundamental conditions of the company', 'Minutes of meetings', 'Financial statements', 'b', 'The Memorandum of Association defines the scope and fundamental conditions under which the company is established — its charter.', 'medium', false],

    // Additional P2 fillers
    [p2, 'free consent', 'Fraud under Section 17 includes:', 'Innocent misrepresentation', 'Suggestion of a fact not true by one who does not believe it to be true', 'Mistake of law', 'Breach of contract', 'b', 'Fraud requires intent to deceive — a suggestion as a fact of that which is not true by one who does not believe it to be true.', 'hard', false],
    [p2, 'sale of goods', 'Risk follows:', 'Possession', 'Ownership', 'Delivery', 'Payment', 'b', 'Under Section 26 of the Sale of Goods Act, unless otherwise agreed, risk prima facie passes with property (ownership), not possession.', 'medium', false],

    // --- Additional P2 to reach 50+ and fix diagnostics ---
    [p2, 'offer', 'An invitation to offer is NOT an offer. Which is an invitation to offer?', 'A quotation sent to a specific person', 'Display of goods with price tags in a shop', 'A promise to sell goods', 'Acceptance of a bid at auction', 'b', 'Display of goods in a shop window with price tags is an invitation to offer (Fisher v Bell), not an offer itself. The customer makes the offer at the counter.', 'easy', true],
    [p2, 'discharge', 'Accord and satisfaction means:', 'Breach of contract', 'Performance of original promise', 'Acceptance of lesser performance in lieu of original obligation', 'Novation of contract', 'c', 'Accord is a new agreement and satisfaction is its execution. Parties may agree to accept lesser performance, discharging the original contract.', 'medium', false],
    [p2, 'void', 'An agreement in restraint of legal proceedings is:', 'Valid', 'Voidable', 'Void under Section 28', 'Illegal', 'c', 'Section 28 declares agreements in restraint of legal proceedings void, subject to exceptions like arbitration agreements.', 'medium', false],
    [p2, 'sale of goods', 'Nemo dat quod non habet means:', 'Let the buyer beware', 'No one can give what they do not have', 'Buyer has full rights', 'Sale is final', 'b', 'This Latin maxim means no one can transfer a better title than they themselves possess. Only the owner can pass good title.', 'medium', false],
    [p2, 'pledge', 'The essential difference between bailment and pledge is:', 'Number of parties involved', 'Pledge is made as security for a debt', 'Bailment requires consideration', 'There is no difference', 'b', 'Pledge is a specific type of bailment where goods are delivered as security for payment of a debt or performance of a promise.', 'medium', false],
    [p2, 'capacity', 'A person disqualified from contracting by law includes:', 'An alien enemy', 'A major', 'A person of sound mind', 'A citizen of India', 'a', 'Alien enemies (during war), insolvents, and convicts are persons disqualified from contracting by various laws.', 'medium', false],
    [p2, 'partnership act', 'Registration of a partnership firm is:', 'Compulsory', 'Optional but advisable', 'Not required under any law', 'Required only for firms with more than 10 partners', 'b', 'Registration of a partnership firm is optional under the Indian Partnership Act 1932 but unregistered firms face disabilities under Section 69.', 'easy', false],
    [p2, 'companies act', 'Ultra vires acts of a company are:', 'Voidable', 'Valid if ratified by shareholders', 'Void ab initio and cannot be ratified', 'Valid', 'c', 'Acts beyond the scope of the Memorandum of Association are ultra vires the company — void ab initio and cannot be ratified even by all shareholders.', 'hard', false],
    [p2, 'llp', 'An LLP must have at least:', 'One designated partner', 'Two designated partners', 'Three designated partners', 'No requirement', 'b', 'Every LLP must have at least two designated partners, at least one of whom must be a resident of India.', 'easy', false],
    [p2, 'guarantee', 'Co-surety who pays more than their share can claim contribution from:', 'The creditor', 'The principal debtor only', 'Other co-sureties', 'No one', 'c', 'Section 146: Co-sureties are liable to contribute equally. A co-surety who pays more than their share can recover from the others.', 'medium', false],
    [p2, 'breach', 'Specific performance as a remedy is granted when:', 'Damages are adequate', 'Monetary compensation cannot be adequate relief', 'The contract is void', 'Both parties breach', 'b', 'Specific performance is an equitable remedy ordered when monetary damages are inadequate to compensate the injured party (e.g., sale of unique property).', 'hard', false],

    // ================================================================
    // PAPER 3 — Business Maths, Logical Reasoning & Statistics (~50 Qs)
    // Diagnostic: 5 easy, 7 medium, 3 hard = 15
    // ================================================================

    // --- Ratio & Proportion ---
    [p3, 'ratio', 'If A:B = 2:3 and B:C = 4:5, then A:B:C is:', '8:12:15', '2:3:5', '8:12:10', '4:6:5', 'a', 'Make B common: A:B = 2:3 = 8:12, B:C = 4:5 = 12:15. So A:B:C = 8:12:15.', 'easy', true],
    [p3, 'ratio', 'Two numbers are in ratio 3:5. If 9 is added to each, the ratio becomes 3:4. The numbers are:', '9 and 15', '27 and 45', '18 and 30', '12 and 20', 'a', 'Let numbers be 3x and 5x. 4(3x+9) = 3(5x+9) → 12x+36 = 15x+27 → 3x = 9 → x = 3. Numbers: 9 and 15. Check: (9+9)/(15+9) = 18/24 = 3/4.', 'medium', false],

    // --- Indices & Logarithms ---
    [p3, 'indices', 'If log₁₀ 2 = 0.3010, then log₁₀ 8 is:', '0.6020', '0.9030', '2.4080', '0.3010', 'b', 'log₁₀ 8 = log₁₀ 2³ = 3 × log₁₀ 2 = 3 × 0.3010 = 0.9030.', 'easy', true],
    [p3, 'indices', 'The value of 2⁵ × 2³ ÷ 2⁴ is:', '16', '32', '8', '64', 'a', '2⁵ × 2³ ÷ 2⁴ = 2^(5+3-4) = 2⁴ = 16.', 'easy', false],

    // --- Equations ---
    [p3, 'equation', 'If 3x + 7 = 22, the value of x is:', '3', '5', '7', '15', 'b', '3x + 7 = 22 → 3x = 15 → x = 5.', 'easy', false],
    [p3, 'equation', 'The roots of the equation x² - 5x + 6 = 0 are:', '2 and 3', '1 and 6', '-2 and -3', '5 and 1', 'a', 'x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3.', 'easy', true],
    [p3, 'equation', 'For the quadratic equation ax² + bx + c = 0, the sum of roots is:', '-b/a', 'b/a', 'c/a', '-c/a', 'a', 'By Vieta\'s formulas, sum of roots = -b/a and product of roots = c/a.', 'medium', true],

    // --- Inequalities ---
    [p3, 'inequalit', 'If -3x > 12, then:', 'x > -4', 'x < -4', 'x > 4', 'x < 4', 'b', 'Dividing both sides by -3 reverses the inequality: x < -4.', 'easy', false],

    // --- Permutations & Combinations ---
    [p3, 'permutation', 'The value of 5P3 is:', '60', '10', '120', '20', 'a', '5P3 = 5!/(5-3)! = 5!/2! = 120/2 = 60.', 'easy', false],
    [p3, 'permutation', 'The number of ways to arrange the letters of MATHEMATICS taking all at a time is:', '11!/(2!2!2!)', '11!/3!', '11!/(2!×2!×2!×2!)', '11!', 'a', 'MATHEMATICS has 11 letters with M(2), A(2), T(2) repeating. Arrangements = 11!/(2!×2!×2!).', 'medium', true],
    [p3, 'combination', 'The value of 10C3 is:', '120', '720', '210', '30', 'a', '10C3 = 10!/(3!×7!) = (10×9×8)/(3×2×1) = 720/6 = 120.', 'medium', false],
    [p3, 'combination', 'A committee of 5 is to be formed from 6 men and 4 women such that at least 3 women are included. The number of ways is:', '60', '66', '36', '26', 'b', 'Cases: (3W,2M) + (4W,1M) = 4C3 × 6C2 + 4C4 × 6C1 = 4 × 15 + 1 × 6 = 60 + 6 = 66.', 'hard', false],

    // --- Sequences & Series (AP/GP) ---
    [p3, 'sequence', 'The sum of first 20 terms of the AP 3, 7, 11, 15,... is:', '820', '800', '780', '840', 'a', 'a = 3, d = 4, n = 20. S = n/2 × [2a + (n-1)d] = 10 × [6 + 76] = 10 × 82 = 820.', 'medium', false],
    [p3, 'sequence', 'The 10th term of the GP 2, 6, 18, 54,... is:', '2 × 3⁹', '2 × 3¹⁰', '3 × 2⁹', '2¹⁰', 'a', 'a = 2, r = 3. T₁₀ = ar⁹ = 2 × 3⁹ = 2 × 19683 = 39366.', 'medium', true],
    [p3, 'sequence', 'Sum of infinite GP with a = 8, r = 1/2 is:', '16', '8', '4', '12', 'a', 'Sum of infinite GP = a/(1-r) = 8/(1-0.5) = 8/0.5 = 16.', 'medium', false],

    // --- Sets & Functions ---
    [p3, 'sets', 'If A = {1,2,3,4} and B = {3,4,5,6}, then A ∩ B is:', '{1,2,3,4,5,6}', '{3,4}', '{1,2}', '{5,6}', 'b', 'A ∩ B (intersection) contains elements common to both sets = {3, 4}.', 'easy', false],
    [p3, 'sets', 'If n(A) = 40, n(B) = 30, and n(A ∪ B) = 55, then n(A ∩ B) is:', '25', '15', '10', '5', 'b', 'n(A ∪ B) = n(A) + n(B) - n(A ∩ B). 55 = 40 + 30 - n(A ∩ B). n(A ∩ B) = 15.', 'medium', true],

    // --- Limits & Continuity ---
    [p3, 'limit', 'lim(x→0) sin(x)/x equals:', '0', '1', 'Infinity', 'Does not exist', 'b', 'This is a standard limit: lim(x→0) sin(x)/x = 1 (using L\'Hopital\'s rule or the squeeze theorem).', 'medium', false],

    // --- Differential Calculus ---
    [p3, 'differential', 'The derivative of x³ + 3x² - 5x + 7 is:', '3x² + 6x - 5', 'x³ + 6x - 5', '3x² + 3x - 5', '3x² + 6x + 7', 'a', 'd/dx(x³ + 3x² - 5x + 7) = 3x² + 6x - 5.', 'easy', false],
    [p3, 'differential', 'If y = eˣ · sin(x), then dy/dx is:', 'eˣ(sin(x) + cos(x))', 'eˣ · cos(x)', 'eˣ · sin(x)', 'eˣ(sin(x) - cos(x))', 'a', 'Using product rule: dy/dx = eˣ·sin(x) + eˣ·cos(x) = eˣ(sin(x) + cos(x)).', 'hard', true],

    // --- Integral Calculus ---
    [p3, 'integral', '∫(3x² + 2x)dx equals:', 'x³ + x² + C', '6x + 2 + C', '3x³ + 2x² + C', 'x³ + x² + 2x + C', 'a', '∫(3x² + 2x)dx = 3·(x³/3) + 2·(x²/2) + C = x³ + x² + C.', 'easy', false],
    [p3, 'integral', '∫₀¹ (2x + 1)dx equals:', '2', '3', '1', '4', 'a', '∫₀¹ (2x+1)dx = [x² + x]₀¹ = (1 + 1) - (0) = 2.', 'medium', false],

    // --- Probability ---
    [p3, 'probability', 'A die is thrown. The probability of getting a number greater than 4 is:', '1/6', '1/3', '1/2', '2/3', 'b', 'Numbers greater than 4: {5, 6} = 2 outcomes. P = 2/6 = 1/3.', 'easy', true],
    [p3, 'probability', 'Two cards are drawn at random from a pack of 52 cards. The probability that both are aces is:', '1/221', '1/169', '4/52', '1/13', 'a', 'P = (4C2)/(52C2) = 6/1326 = 1/221.', 'hard', true],
    [p3, 'probability', 'If P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.2, then P(A ∪ B) is:', '0.7', '0.9', '0.6', '0.8', 'a', 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.5 - 0.2 = 0.7.', 'medium', false],
    [p3, 'probability', 'Bayes\' theorem is used for:', 'Finding prior probability', 'Updating prior probability with new evidence', 'Finding joint probability only', 'Finding marginal probability', 'b', 'Bayes\' theorem allows us to update the probability of a hypothesis (posterior) given new evidence, using prior probability and likelihood.', 'medium', false],

    // --- Theoretical Distributions ---
    [p3, 'distribution', 'In a binomial distribution with n = 10 and p = 0.5, the mean is:', '5', '10', '2.5', '0.5', 'a', 'Mean of binomial distribution = np = 10 × 0.5 = 5.', 'easy', false],
    [p3, 'distribution', 'In a Poisson distribution, mean is equal to:', 'Variance', 'Standard deviation', 'Median', 'Mode', 'a', 'In Poisson distribution, mean = variance = λ (lambda). This is a key property.', 'medium', true],
    [p3, 'distribution', 'The normal distribution is:', 'Positively skewed', 'Negatively skewed', 'Symmetrical', 'Bimodal', 'c', 'The normal (Gaussian) distribution is perfectly symmetrical about its mean, with mean = median = mode.', 'easy', false],

    // --- Correlation & Regression ---
    [p3, 'correlation', 'The value of correlation coefficient lies between:', '0 and 1', '-1 and 0', '-1 and +1', '0 and infinity', 'c', 'Karl Pearson\'s correlation coefficient (r) always lies between -1 and +1, where -1 is perfect negative and +1 is perfect positive correlation.', 'easy', false],
    [p3, 'correlation', 'If r = -0.95, the relationship between variables is:', 'Strong positive', 'Weak negative', 'Strong negative', 'No correlation', 'c', 'r = -0.95 indicates a strong negative linear relationship — as one variable increases, the other decreases significantly.', 'medium', false],
    [p3, 'regression', 'Two regression lines intersect at the point:', '(0, 0)', '(Mean of X, Mean of Y)', '(Median of X, Median of Y)', '(Mode of X, Mode of Y)', 'b', 'Both regression lines (Y on X and X on Y) always pass through (X̄, Ȳ) — the point of means.', 'medium', true],

    // --- Measures of Central Tendency ---
    [p3, 'central tendency', 'The arithmetic mean of 5, 10, 15, 20, 25 is:', '15', '12.5', '20', '17.5', 'a', 'Mean = (5+10+15+20+25)/5 = 75/5 = 15.', 'easy', false],
    [p3, 'central tendency', 'In a positively skewed distribution:', 'Mean > Median > Mode', 'Mean < Median < Mode', 'Mean = Median = Mode', 'Mode > Mean > Median', 'a', 'In positive skew, the right tail is longer: Mode < Median < Mean.', 'medium', false],
    [p3, 'central tendency', 'Geometric mean of 4, 8, and 16 is:', '8', '9.33', '10', '6', 'a', 'GM = (4 × 8 × 16)^(1/3) = (512)^(1/3) = 8.', 'medium', false],

    // --- Measures of Dispersion ---
    [p3, 'dispersion', 'Standard deviation is the square root of:', 'Mean', 'Variance', 'Range', 'Mean deviation', 'b', 'Standard deviation = √Variance. It measures the dispersion of data around the mean.', 'easy', false],
    [p3, 'dispersion', 'Coefficient of variation is calculated as:', '(Mean/SD) × 100', '(SD/Mean) × 100', 'SD × Mean', 'SD - Mean', 'b', 'CV = (Standard Deviation / Mean) × 100. It is a relative measure of dispersion.', 'medium', false],

    // --- Index Numbers ---
    [p3, 'index', 'Laspeyre\'s index uses weights of:', 'Current year', 'Base year', 'Average of both years', 'Neither year', 'b', 'Laspeyre\'s Price Index uses base year quantities as weights: ΣP₁Q₀/ΣP₀Q₀ × 100.', 'medium', false],
    [p3, 'index', 'Fisher\'s index number is the geometric mean of:', 'Laspeyre\'s and Paasche\'s indices', 'Two Laspeyre\'s indices', 'Two Paasche\'s indices', 'Current and base year prices', 'a', 'Fisher\'s Ideal Index = √(Laspeyre\'s × Paasche\'s). It is called ideal because it satisfies both time reversal and factor reversal tests.', 'hard', false],

    // --- Time Series ---
    [p3, 'time series', 'The components of a time series are:', 'Trend, Seasonal, Cyclical, Irregular', 'Mean, Median, Mode, Range', 'Correlation, Regression, Probability', 'Addition, Subtraction, Multiplication', 'a', 'Time series has four components: Trend (T), Seasonal (S), Cyclical (C), and Irregular/Random (I).', 'medium', false],

    // Additional P3 fillers
    [p3, 'ratio', 'If x : y = 3 : 4 and y : z = 2 : 3, then x : z is:', '1:2', '3:6', '2:3', '1:3', 'a', 'x/y = 3/4, y/z = 2/3. x/z = (x/y)×(y/z) = (3/4)×(2/3) = 6/12 = 1/2. So x:z = 1:2.', 'medium', false],
    [p3, 'sequence', 'If the nth term of an AP is 3n + 5, the common difference is:', '3', '5', '8', '2', 'a', 'Tₙ = 3n + 5. T₁ = 8, T₂ = 11. d = T₂ - T₁ = 11 - 8 = 3.', 'medium', false],
    [p3, 'probability', 'If A and B are independent events with P(A) = 0.3 and P(B) = 0.4, then P(A ∩ B) is:', '0.12', '0.70', '0.58', '0.30', 'a', 'For independent events, P(A ∩ B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.', 'medium', false],
    [p3, 'dispersion', 'The range of the data set {3, 7, 2, 9, 5, 11, 1} is:', '10', '8', '9', '11', 'a', 'Range = Maximum - Minimum = 11 - 1 = 10.', 'easy', false],
    [p3, 'differential', 'The second derivative of f(x) = x⁴ is:', '4x³', '12x²', '4x²', 'x³', 'b', 'f\'(x) = 4x³, f\'\'(x) = 12x².', 'medium', false],

    // --- Additional P3 to reach 50+ and fix diagnostics ---
    [p3, 'indices', 'If aᵐ = b, aⁿ = c, then bⁿ/cᵐ equals:', 'a', '1', 'aᵐⁿ⁻ⁿᵐ', '0', 'b', 'bⁿ = (aᵐ)ⁿ = aᵐⁿ. cᵐ = (aⁿ)ᵐ = aⁿᵐ. bⁿ/cᵐ = aᵐⁿ/aⁿᵐ = aᵐⁿ⁻ⁿᵐ = a⁰ = 1.', 'hard', true],
    [p3, 'combination', 'In how many ways can 4 books be arranged on a shelf?', '4', '16', '24', '12', 'c', '4 books can be arranged in 4! = 4 × 3 × 2 × 1 = 24 ways.', 'easy', true],
    [p3, 'limit', 'lim(x→2) (x² - 4)/(x - 2) equals:', '0', '4', '2', 'Does not exist', 'b', '(x² - 4)/(x - 2) = (x+2)(x-2)/(x-2) = x+2. As x→2, this equals 4.', 'medium', true],
    [p3, 'integral', '∫eˣ dx equals:', 'eˣ + C', 'xeˣ + C', 'eˣ/x + C', 'ln(eˣ) + C', 'a', 'The integral of eˣ with respect to x is eˣ + C (the exponential function is its own antiderivative).', 'easy', false],
    [p3, 'central tendency', 'Harmonic mean of 2, 4, and 8 is:', '3.43', '4.67', '5.00', '2.67', 'a', 'HM = n / (Σ1/xᵢ) = 3 / (1/2 + 1/4 + 1/8) = 3 / (0.5 + 0.25 + 0.125) = 3/0.875 = 3.43 (approx).', 'hard', false],
    [p3, 'index', 'Consumer Price Index is used to measure:', 'Industrial production', 'Changes in cost of living', 'GDP growth', 'Trade balance', 'b', 'CPI measures the average change over time in prices paid by consumers for a basket of goods and services (cost of living).', 'easy', false],
    [p3, 'time series', 'Moving average method is used to measure:', 'Seasonal variation', 'Trend', 'Cyclical variation', 'Irregular variation', 'b', 'Moving average method smooths out short-term fluctuations and is used to identify the underlying trend in time series data.', 'medium', false],

    // ================================================================
    // PAPER 4 — Business Economics & Commercial Knowledge (~40+ Qs)
    // Diagnostic: 5 easy, 7 medium, 3 hard = 15
    // ================================================================

    // --- Demand & Supply ---
    [p4, 'demand', 'The law of demand states that, ceteris paribus:', 'Price and quantity demanded are directly related', 'Price and quantity demanded are inversely related', 'Income and demand are inversely related', 'Supply and demand move together', 'b', 'Law of demand: other things remaining constant, as price rises, quantity demanded falls (inverse relationship).', 'easy', true],
    [p4, 'demand', 'A Giffen good has:', 'Negative income effect stronger than substitution effect', 'Positive price elasticity (upward sloping demand)', 'Negative price elasticity', 'Unit elastic demand', 'b', 'Giffen goods violate the law of demand — quantity demanded increases with price. The negative income effect outweighs the substitution effect.', 'hard', true],
    [p4, 'demand', 'Cross elasticity of demand between substitute goods is:', 'Negative', 'Positive', 'Zero', 'Infinite', 'b', 'For substitutes (tea & coffee), rise in price of one increases demand for the other — cross elasticity is positive.', 'medium', true],
    [p4, 'demand', 'Price elasticity of demand for a perfectly inelastic good is:', 'Zero', 'One', 'Infinity', 'Greater than one', 'a', 'Perfectly inelastic demand (Ed = 0) means quantity demanded does not change regardless of price change (vertical demand curve).', 'easy', false],
    [p4, 'supply', 'An increase in input costs will cause the supply curve to:', 'Shift rightward', 'Shift leftward', 'Remain unchanged', 'Become vertical', 'b', 'Higher input costs reduce profitability at each price level, causing suppliers to offer less — supply curve shifts left (decreases).', 'medium', false],

    // --- Production & Cost ---
    [p4, 'production', 'The law of diminishing marginal returns states that:', 'Total output eventually decreases', 'Marginal product of a variable input eventually declines', 'Average cost always increases', 'Fixed costs keep rising', 'b', 'Holding other inputs constant, the marginal product of a variable input eventually diminishes as more units are employed.', 'medium', true],
    [p4, 'production', 'An isoquant curve shows:', 'Different combinations of inputs producing the same output', 'Different output levels', 'Consumer equilibrium', 'Cost minimization only', 'a', 'An isoquant represents all combinations of two inputs that yield the same level of output.', 'medium', false],
    [p4, 'cost', 'Average Fixed Cost (AFC) curve is:', 'U-shaped', 'Rectangular hyperbola', 'Horizontal line', 'Upward sloping', 'b', 'AFC = TFC/Q. Since TFC is constant, AFC continuously declines as output increases, forming a rectangular hyperbola.', 'medium', true],
    [p4, 'cost', 'Marginal Cost intersects Average Cost at:', 'Maximum point of AC', 'Minimum point of AC', 'Origin', 'Any point', 'b', 'MC intersects ATC at its minimum point. When MC < ATC, ATC falls. When MC > ATC, ATC rises. They are equal at the minimum.', 'medium', false],
    [p4, 'cost', 'In the long run, all costs are:', 'Fixed', 'Variable', 'Sunk', 'Implicit', 'b', 'In the long run, all factors of production can be varied — there are no fixed costs. All costs are variable.', 'easy', true],

    // --- Market Structures ---
    [p4, 'market', 'In perfect competition, the demand curve faced by a firm is:', 'Downward sloping', 'Perfectly elastic (horizontal)', 'Upward sloping', 'U-shaped', 'b', 'In perfect competition, the firm is a price taker. It can sell any quantity at the market price — its demand curve is a horizontal line.', 'easy', true],
    [p4, 'market', 'A monopolist\'s marginal revenue is:', 'Equal to price', 'Greater than price', 'Less than price', 'Always zero', 'c', 'For a monopolist (downward sloping demand), MR < AR (Price) because to sell more, the price must be lowered for all units.', 'medium', true],
    [p4, 'market', 'Price discrimination is possible when:', 'Markets can be separated and elasticities differ', 'There is perfect competition', 'Goods are homogeneous', 'Information is perfect', 'a', 'Price discrimination requires market separation (no resale) and different price elasticities in different markets.', 'hard', false],
    [p4, 'market', 'In monopolistic competition:', 'Products are differentiated', 'There is only one seller', 'Entry barriers are high', 'Firms are price takers', 'a', 'Monopolistic competition features many firms selling differentiated products with free entry and exit.', 'easy', false],
    [p4, 'market', 'In oligopoly, the kinked demand curve model explains:', 'Profit maximization', 'Price rigidity', 'Perfect competition behavior', 'Monopoly pricing', 'b', 'The kinked demand curve model explains why oligopolistic firms tend to maintain stable prices — price rigidity.', 'hard', true],

    // --- Price Determination ---
    [p4, 'price', 'Equilibrium price is determined where:', 'Demand is maximum', 'Supply is maximum', 'Demand equals supply', 'MC equals AC', 'c', 'Market equilibrium occurs at the price where quantity demanded equals quantity supplied.', 'easy', false],
    [p4, 'price', 'A price floor set above equilibrium price leads to:', 'Shortage', 'Surplus', 'Equilibrium', 'No effect', 'b', 'A price floor above equilibrium (like minimum wage) causes quantity supplied to exceed quantity demanded, creating a surplus.', 'medium', false],

    // --- National Income ---
    [p4, 'national income', 'GDP at market price minus indirect taxes plus subsidies equals:', 'GDP at factor cost', 'NDP at market price', 'NNP at factor cost', 'Personal income', 'a', 'GDP(fc) = GDP(mp) - Indirect Taxes + Subsidies. Factor cost removes the effect of government intervention on prices.', 'medium', true],
    [p4, 'national income', 'The difference between GDP and NDP is:', 'Net factor income from abroad', 'Depreciation', 'Indirect taxes', 'Subsidies', 'b', 'NDP = GDP - Depreciation (Consumption of Fixed Capital). Depreciation accounts for wear and tear of capital goods.', 'medium', false],
    [p4, 'national income', 'Transfer payments are:', 'Included in GDP', 'Excluded from GDP', 'Part of factor income', 'Counted as investment', 'b', 'Transfer payments (pensions, scholarships, unemployment benefits) are not included in GDP as they do not represent payment for current production.', 'medium', false],

    // --- Money & Banking ---
    [p4, 'money', 'The central bank controls money supply through:', 'Fiscal policy', 'Monetary policy', 'Trade policy', 'Industrial policy', 'b', 'The central bank (RBI in India) uses monetary policy tools — repo rate, CRR, SLR, open market operations — to control money supply.', 'easy', false],
    [p4, 'money', 'An increase in Cash Reserve Ratio (CRR) will:', 'Increase money supply', 'Decrease money supply', 'Not affect money supply', 'Increase government spending', 'b', 'Higher CRR means banks must keep more reserves with RBI, reducing their lending capacity and thus decreasing money supply.', 'medium', true],
    [p4, 'money', 'Repo rate is the rate at which:', 'Banks lend to customers', 'RBI lends to commercial banks', 'Government borrows', 'Banks lend to each other', 'b', 'Repo rate is the rate at which RBI lends short-term funds to commercial banks against government securities.', 'easy', true],

    // --- Business Environment ---
    [p4, 'business environment', 'PESTLE analysis covers:', 'Political, Economic, Social, Technological, Legal, Environmental', 'Price, Efficiency, Sales, Technology, Logistics, Economy', 'Production, Economics, Strategy, Training, Leadership, Evaluation', 'Planning, Execution, Staffing, Testing, Learning, Exiting', 'a', 'PESTLE framework analyzes macro-environmental factors: Political, Economic, Social, Technological, Legal, and Environmental.', 'easy', false],
    [p4, 'business environment', 'Disinvestment means:', 'New investment in public sector', 'Sale of government equity in public enterprises', 'Foreign direct investment', 'Private sector expansion', 'b', 'Disinvestment refers to the sale or liquidation of government\'s stake (equity) in public sector enterprises.', 'medium', false],

    // --- Business Organizations ---
    [p4, 'business organization', 'A sole proprietorship has:', 'Unlimited liability', 'Limited liability', 'No liability', 'Shared liability', 'a', 'In sole proprietorship, the owner has unlimited personal liability — personal assets can be used to settle business debts.', 'easy', false],
    [p4, 'business organization', 'A cooperative society is based on the principle of:', 'Profit maximization', 'Mutual help and voluntary membership', 'Single ownership', 'Government control', 'b', 'Cooperative societies are based on principles of voluntary membership, democratic management, and mutual help among members.', 'medium', false],

    // --- Government Policies ---
    [p4, 'government', 'Fiscal deficit is:', 'Total expenditure minus total revenue', 'Total expenditure minus total receipts excluding borrowings', 'Revenue expenditure minus revenue receipts', 'Capital expenditure minus capital receipts', 'b', 'Fiscal Deficit = Total Expenditure - Total Receipts (excluding borrowings). It indicates total borrowing requirements of the government.', 'hard', false],
    [p4, 'government', 'Primary deficit is:', 'Fiscal deficit minus interest payments', 'Revenue deficit minus capital deficit', 'Total deficit minus grants', 'Budget deficit', 'a', 'Primary Deficit = Fiscal Deficit - Interest Payments. It shows the borrowing requirement excluding interest obligations on past debt.', 'hard', true],

    // --- Indian Economy ---
    [p4, 'indian economy', 'The largest contributing sector to India\'s GDP currently is:', 'Agriculture', 'Industry', 'Services', 'Mining', 'c', 'The services sector contributes the largest share (approximately 54%) to India\'s GDP, followed by industry and agriculture.', 'easy', false],
    [p4, 'indian economy', 'Make in India initiative primarily aims to:', 'Promote agriculture', 'Boost manufacturing sector and attract FDI', 'Develop IT sector', 'Promote exports only', 'b', 'Make in India (launched 2014) aims to transform India into a global manufacturing hub and attract foreign direct investment.', 'medium', false],

    // --- International Trade ---
    [p4, 'international trade', 'Comparative advantage theory was propounded by:', 'Adam Smith', 'David Ricardo', 'J.M. Keynes', 'Alfred Marshall', 'b', 'David Ricardo\'s theory of comparative advantage states that countries should specialize in producing goods where they have lower opportunity cost.', 'medium', false],
    [p4, 'international trade', 'Balance of Payments includes:', 'Only visible trade', 'Current account, capital account, and financial account', 'Only invisible trade', 'Only foreign exchange reserves', 'b', 'Balance of Payments is a comprehensive record comprising Current Account (trade in goods/services), Capital Account, and Financial Account.', 'medium', false],

    // --- Business Cycles ---
    [p4, 'business cycle', 'The phases of a business cycle are:', 'Expansion, Peak, Contraction, Trough', 'Growth, Stagnation, Decline', 'Inflation, Deflation, Stagflation', 'Boom, Recession only', 'a', 'A complete business cycle consists of four phases: Expansion (recovery), Peak (boom), Contraction (recession), and Trough (depression).', 'medium', true],

    // Additional P4 fillers
    [p4, 'demand', 'Consumer surplus is the difference between:', 'Market price and cost price', 'What consumer is willing to pay and what they actually pay', 'Total utility and marginal utility', 'Income and expenditure', 'b', 'Consumer surplus = Maximum price willing to pay (from demand curve) - Actual market price paid.', 'medium', false],
    [p4, 'production', 'Economies of scale result in:', 'Increasing long-run average cost', 'Decreasing long-run average cost', 'Constant average cost', 'Increasing marginal cost', 'b', 'Economies of scale occur when increasing production leads to lower long-run average costs due to specialization, bulk buying, etc.', 'medium', false],
    [p4, 'money', 'Quantitative theory of money (MV = PQ) was given by:', 'Irving Fisher', 'Adam Smith', 'David Ricardo', 'J.M. Keynes', 'a', 'Irving Fisher\'s equation of exchange: MV = PT (or PQ), where M = money supply, V = velocity, P = price level, T = transactions.', 'hard', false],

    // --- Additional P4 to reach 50+ and fix diagnostics ---
    [p4, 'supply', 'The law of supply states that, ceteris paribus:', 'Price and supply are inversely related', 'Price and supply are directly related', 'Supply is constant', 'Supply depends only on demand', 'b', 'Law of supply: other things constant, as price increases, quantity supplied increases (direct/positive relationship).', 'easy', false],
    [p4, 'market', 'Monopoly means:', 'Many sellers, one buyer', 'Single seller, many buyers', 'Many sellers, many buyers', 'Two sellers', 'b', 'A monopoly is a market structure with a single seller and many buyers, with no close substitutes for the product.', 'easy', false],
    [p4, 'cost', 'Opportunity cost is:', 'The monetary cost of production', 'The value of the next best alternative foregone', 'Total cost minus variable cost', 'Fixed cost per unit', 'b', 'Opportunity cost is the value of the best alternative sacrificed when making a choice — a fundamental concept in economics.', 'easy', true],
    [p4, 'national income', 'GDP measured by summing all final goods and services produced is the:', 'Income method', 'Product/Output method', 'Expenditure method', 'Value added method', 'b', 'The Product (Output) method calculates GDP by summing the value of all final goods and services produced in the economy.', 'medium', false],
    [p4, 'demand', 'If the income elasticity of demand for a good is negative, the good is:', 'Normal good', 'Inferior good', 'Luxury good', 'Giffen good', 'b', 'Negative income elasticity means demand decreases as income increases — this is the characteristic of an inferior good.', 'medium', false],
    [p4, 'price', 'Minimum Support Price (MSP) is an example of:', 'Price ceiling', 'Price floor', 'Equilibrium price', 'Market price', 'b', 'MSP is a price floor set by the government above the equilibrium price to protect farmers, guaranteeing a minimum price for agricultural produce.', 'medium', false],
    [p4, 'business environment', 'SWOT analysis stands for:', 'Strengths, Weaknesses, Opportunities, Threats', 'Strategy, Work, Operations, Technology', 'Sales, Wholesale, Operations, Trade', 'Supply, Warehousing, Output, Transport', 'a', 'SWOT is a strategic planning framework analyzing internal Strengths and Weaknesses and external Opportunities and Threats.', 'easy', false],
    [p4, 'production', 'The total product curve increases at a decreasing rate when:', 'Marginal product is increasing', 'Marginal product is positive but declining', 'Marginal product is zero', 'Marginal product is negative', 'b', 'When marginal product (MP) is positive but declining, total product (TP) still increases but at a decreasing rate.', 'hard', false],
    [p4, 'market', 'Collusive oligopoly is also known as:', 'Perfect competition', 'Cartel', 'Monopolistic competition', 'Duopoly', 'b', 'A cartel is a formal agreement among oligopolistic firms to fix prices, output, or market shares — a form of collusive oligopoly.', 'medium', false],
    [p4, 'indian economy', 'The Goods and Services Tax (GST) in India is a:', 'Direct tax', 'Indirect tax', 'Progressive tax', 'Regressive income tax', 'b', 'GST is an indirect tax levied on supply of goods and services, replacing multiple indirect taxes under a unified structure.', 'easy', false],
    [p4, 'money', 'Open market operations refer to:', 'Government borrowing from public', 'RBI buying/selling government securities in the open market', 'Banks lending to customers', 'Foreign exchange transactions', 'b', 'Open market operations involve the RBI buying or selling government securities to regulate money supply and liquidity in the economy.', 'medium', false],
    [p4, 'international trade', 'A country\'s terms of trade improve when:', 'Export prices rise relative to import prices', 'Import prices rise relative to export prices', 'Both increase equally', 'Both decrease', 'a', 'Terms of trade = (Export price index / Import price index) × 100. They improve when export prices rise relative to import prices.', 'hard', false],
    [p4, 'business cycle', 'During the trough phase of a business cycle:', 'Output and employment are at their lowest', 'Inflation is at its peak', 'GDP growth is highest', 'Interest rates are at maximum', 'a', 'The trough is the lowest point of the business cycle with minimum output, employment, and economic activity before recovery begins.', 'medium', false],
  ];

  // ─── Build question objects ───
  console.log(`Preparing ${rawQuestions.length} questions...\n`);

  const questionsToInsert = [];
  let skipped = 0;

  for (const q of rawQuestions) {
    const [paper, topicSubstr, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, is_diagnostic] = q;

    const topic = findTopic(topics, paper.id, topicSubstr, topicAliases);
    if (!topic) {
      console.warn(`Skipping question (no topic match): "${topicSubstr}" in paper ${paper.name}`);
      skipped++;
      continue;
    }

    const sub_topic_id = await getSubTopicId(subTopics, topic.id, topic.name);
    if (!sub_topic_id) {
      console.warn(`Skipping question (no sub_topic): topic="${topic.name}"`);
      skipped++;
      continue;
    }

    // Determine correct_answer_text
    const optionMap = { a: option_a, b: option_b, c: option_c, d: option_d };

    questionsToInsert.push({
      paper_id: paper.id,
      topic_id: topic.id,
      sub_topic_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      correct_answer_text: optionMap[correct_option],
      explanation,
      difficulty,
      question_type: 'mcq',
      status: 'approved',
      is_diagnostic,
    });
  }

  console.log(`\nReady to insert ${questionsToInsert.length} questions (${skipped} skipped).\n`);

  // ─── Diagnostic count validation ───
  for (const paper of [p1, p2, p3, p4]) {
    const diag = questionsToInsert.filter((q) => q.paper_id === paper.id && q.is_diagnostic);
    const easyD = diag.filter((q) => q.difficulty === 'easy').length;
    const medD = diag.filter((q) => q.difficulty === 'medium').length;
    const hardD = diag.filter((q) => q.difficulty === 'hard').length;
    console.log(`${paper.name}: ${questionsToInsert.filter((q) => q.paper_id === paper.id).length} total, ${diag.length} diagnostic (E:${easyD} M:${medD} H:${hardD})`);
  }

  // ─── Insert in batches ───
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < questionsToInsert.length; i += BATCH_SIZE) {
    const batch = questionsToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('questions').insert(batch);
    if (error) {
      console.error(`Batch insert error at ${i}:`, error.message);
      console.error('First failing question:', JSON.stringify(batch[0], null, 2));
      return;
    }
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${questionsToInsert.length}`);
  }

  console.log(`\n✅ Successfully seeded ${inserted} questions!`);

  // Final verification
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
  console.log(`📊 Total questions in database: ${count}`);
}

main().catch(console.error);
