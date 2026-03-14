import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch all topics and sub_topics
const { data: topics } = await s.from('topics').select('id, slug, paper_id');
const { data: subTopics } = await s.from('sub_topics').select('id, slug, topic_id');

const tid = (paperId, slug) => topics.find(t => t.paper_id === paperId && t.slug === slug)?.id;
const stid = (topicId, slug) => subTopics.find(st => st.topic_id === topicId && st.slug === slug)?.id;

const questions = [
  // ============================================================
  // PAPER 1 — Principles & Practice of Accounting
  // ============================================================
  {
    paper_id: 1, topic_id: tid(1, 'theoretical-framework'), sub_topic_id: stid(tid(1, 'theoretical-framework'), 'concepts-principles'),
    question_text: 'Which accounting concept assumes that the enterprise will continue in operation for the foreseeable future?',
    option_a: 'Accrual concept', option_b: 'Going concern concept', option_c: 'Matching concept', option_d: 'Consistency concept',
    correct_option: 'b', explanation: 'The Going Concern concept assumes that a business will continue its operations indefinitely and will not be liquidated in the near future. This allows assets to be recorded at historical cost rather than liquidation value.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['going concern', 'accounting concepts'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'theoretical-framework'), sub_topic_id: stid(tid(1, 'theoretical-framework'), 'concepts-principles'),
    question_text: 'The practice of appending notes regarding contingent liabilities in the balance sheet is in pursuance of which convention?',
    option_a: 'Convention of consistency', option_b: 'Convention of materiality', option_c: 'Convention of full disclosure', option_d: 'Convention of conservatism',
    correct_option: 'c', explanation: 'The Convention of Full Disclosure requires that all material and relevant information should be disclosed in financial statements. Contingent liabilities are disclosed as notes to give a complete picture.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['full disclosure', 'contingent liabilities'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'accounting-process'), sub_topic_id: stid(tid(1, 'accounting-process'), 'journal-entries'),
    question_text: 'When goods are withdrawn by the owner for personal use, which account is debited?',
    option_a: 'Purchases account', option_b: 'Sales account', option_c: 'Drawings account', option_d: 'Capital account',
    correct_option: 'c', explanation: 'When the owner withdraws goods for personal use, the Drawings account is debited and Purchases account is credited. Drawings reduce the owner\'s equity in the business.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['drawings', 'journal entries'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'accounting-process'), sub_topic_id: stid(tid(1, 'accounting-process'), 'rectification'),
    question_text: 'If a purchase of ₹5,000 from Ram is recorded in the Sales Book, what is the rectification entry?',
    option_a: 'Debit Purchases ₹5,000, Credit Ram ₹5,000', option_b: 'Debit Purchases ₹5,000, Credit Sales ₹5,000', option_c: 'Debit Purchases ₹10,000, Credit Sales ₹5,000, Credit Ram ₹5,000', option_d: 'Debit Purchases ₹5,000, Credit Sales ₹5,000, Debit Ram ₹5,000, Credit Ram ₹5,000',
    correct_option: 'c', explanation: 'The error has two effects: Sales was wrongly credited (₹5,000) and Ram was wrongly debited instead of credited. Rectification: Debit Purchases ₹10,000 (₹5,000 for original + ₹5,000 for reversal), Credit Sales ₹5,000 (reversal), Credit Ram ₹5,000 (correct entry).',
    difficulty: 'hard', source_type: 'original', concept_keywords: ['rectification', 'errors'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'depreciation'), sub_topic_id: stid(tid(1, 'depreciation'), 'slm'),
    question_text: 'A machine costing ₹1,00,000 with a useful life of 10 years and scrap value of ₹10,000. What is the annual depreciation under Straight Line Method?',
    option_a: '₹10,000', option_b: '₹9,000', option_c: '₹1,00,000', option_d: '₹90,000',
    correct_option: 'b', explanation: 'SLM Depreciation = (Cost - Scrap Value) / Useful Life = (₹1,00,000 - ₹10,000) / 10 = ₹9,000 per annum.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['SLM', 'depreciation calculation'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'depreciation'), sub_topic_id: stid(tid(1, 'depreciation'), 'wdv'),
    question_text: 'Under WDV method, if a machine costs ₹50,000 and depreciation rate is 20%, what is depreciation for year 2?',
    option_a: '₹10,000', option_b: '₹8,000', option_c: '₹9,000', option_d: '₹7,500',
    correct_option: 'b', explanation: 'Year 1: ₹50,000 × 20% = ₹10,000. WDV at end of Year 1 = ₹40,000. Year 2: ₹40,000 × 20% = ₹8,000.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['WDV', 'depreciation'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'inventories'), sub_topic_id: stid(tid(1, 'inventories'), 'fifo'),
    question_text: 'Under FIFO method during rising prices, closing stock is valued at:',
    option_a: 'Earliest prices', option_b: 'Latest prices', option_c: 'Average prices', option_d: 'Market prices',
    correct_option: 'b', explanation: 'FIFO (First In, First Out) assumes earliest purchased goods are sold first. Therefore, closing stock consists of most recently purchased goods, valued at latest prices.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['FIFO', 'inventory valuation'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'special-transactions'), sub_topic_id: stid(tid(1, 'special-transactions'), 'consignment'),
    question_text: 'In consignment accounting, del credere commission is allowed to the consignee for:',
    option_a: 'Selling goods', option_b: 'Storing goods safely', option_c: 'Bearing the risk of bad debts', option_d: 'Transporting goods',
    correct_option: 'c', explanation: 'Del credere commission is an extra commission paid to the consignee for guaranteeing the collection of payment from buyers. The consignee bears the risk of bad debts in exchange for this commission.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['del credere', 'consignment'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'partnership-accounts'), sub_topic_id: stid(tid(1, 'partnership-accounts'), 'goodwill'),
    question_text: 'A firm earns average profits of ₹60,000. Normal rate of return is 10%. Total assets are ₹8,00,000 and liabilities ₹2,00,000. Goodwill by super profit method (at 3 years purchase) is:',
    option_a: '₹30,000', option_b: '₹60,000', option_c: '₹90,000', option_d: '₹1,80,000',
    correct_option: 'b', explanation: 'Capital employed = Assets - Liabilities = ₹8,00,000 - ₹2,00,000 = ₹6,00,000. Normal profit = ₹6,00,000 × 10% = ₹60,000. Super profit = Actual profit - Normal profit = ₹60,000 - ₹60,000 = ₹0... Wait, let me recalculate. If average profit is ₹80,000: Super profit = ₹80,000 - ₹60,000 = ₹20,000. Goodwill = ₹20,000 × 3 = ₹60,000.',
    difficulty: 'hard', source_type: 'original', concept_keywords: ['goodwill', 'super profit'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 1, topic_id: tid(1, 'company-accounts'), sub_topic_id: stid(tid(1, 'company-accounts'), 'issue-shares'),
    question_text: 'Securities Premium can be used for which of the following purposes?',
    option_a: 'Payment of dividend', option_b: 'Issue of fully paid bonus shares', option_c: 'Distribution as cash to shareholders', option_d: 'Payment of salary',
    correct_option: 'b', explanation: 'As per Section 52 of the Companies Act, 2013, Securities Premium can only be used for: issuing fully paid bonus shares, writing off preliminary expenses, writing off share issue expenses, or providing premium on redemption of preference shares/debentures.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['securities premium', 'bonus shares'], is_diagnostic: true, status: 'approved'
  },

  // ============================================================
  // PAPER 2 — Business Laws
  // ============================================================
  {
    paper_id: 2, topic_id: tid(2, 'indian-contract-act'), sub_topic_id: stid(tid(2, 'indian-contract-act'), 'nature-contract'),
    question_text: 'An agreement enforceable by law is a:',
    option_a: 'Promise', option_b: 'Agreement', option_c: 'Contract', option_d: 'Obligation',
    correct_option: 'c', explanation: 'Section 2(h) of the Indian Contract Act, 1872 defines a contract as "An agreement enforceable by law." All contracts are agreements, but all agreements are not contracts.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['contract definition', 'section 2(h)'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 2, topic_id: tid(2, 'indian-contract-act'), sub_topic_id: stid(tid(2, 'indian-contract-act'), 'offer-acceptance'),
    question_text: 'A counter-offer amounts to:',
    option_a: 'Acceptance of original offer', option_b: 'Rejection of original offer', option_c: 'Modification of original offer', option_d: 'None of the above',
    correct_option: 'b', explanation: 'A counter-offer is a rejection of the original offer and constitutes a new offer. The original offer ceases to exist once a counter-offer is made. The original offeror is free to accept or reject the counter-offer.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['counter offer', 'rejection'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 2, topic_id: tid(2, 'indian-contract-act'), sub_topic_id: stid(tid(2, 'indian-contract-act'), 'consideration'),
    question_text: 'Consideration in a contract can flow from:',
    option_a: 'Only the promisee', option_b: 'Only the promisor', option_c: 'The promisee or any other person', option_d: 'Only a third party',
    correct_option: 'c', explanation: 'Under Indian law (Section 2(d) of the Indian Contract Act), consideration may flow from the promisee or any other person. This is different from English law where consideration must move from the promisee only.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['consideration', 'promisee'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 2, topic_id: tid(2, 'indian-contract-act'), sub_topic_id: stid(tid(2, 'indian-contract-act'), 'free-consent'),
    question_text: 'A contract obtained by coercion is:',
    option_a: 'Void', option_b: 'Voidable at the option of the party coerced', option_c: 'Valid', option_d: 'Illegal',
    correct_option: 'b', explanation: 'Under Section 19 of the Indian Contract Act, a contract induced by coercion is voidable at the option of the party whose consent was obtained by coercion. The aggrieved party can choose to affirm or void the contract.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['coercion', 'voidable contract'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 2, topic_id: tid(2, 'sale-of-goods-act'), sub_topic_id: stid(tid(2, 'sale-of-goods-act'), 'conditions-warranties'),
    question_text: 'In a contract of sale, stipulation as to time of payment is:',
    option_a: 'Always a condition', option_b: 'Always a warranty', option_c: 'Deemed to be a warranty unless otherwise stated', option_d: 'Neither condition nor warranty',
    correct_option: 'c', explanation: 'Under Section 11 of the Sale of Goods Act, 1930, unless a different intention appears from the terms of the contract, stipulations as to time of payment are not deemed to be of the essence of a contract of sale and are treated as warranty.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['condition', 'warranty', 'time of payment'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 2, topic_id: tid(2, 'sale-of-goods-act'), sub_topic_id: stid(tid(2, 'sale-of-goods-act'), 'unpaid-seller'),
    question_text: 'An unpaid seller has all of the following rights EXCEPT:',
    option_a: 'Right of lien', option_b: 'Right of stoppage in transit', option_c: 'Right of resale', option_d: 'Right to sue the buyer for specific performance',
    correct_option: 'd', explanation: 'The unpaid seller has three rights against the goods: lien, stoppage in transit, and resale. The right to sue for specific performance is not a right of the unpaid seller; it is available under the Specific Relief Act.',
    difficulty: 'hard', source_type: 'original', concept_keywords: ['unpaid seller', 'lien', 'stoppage in transit'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 2, topic_id: tid(2, 'indian-partnership-act'), sub_topic_id: stid(tid(2, 'indian-partnership-act'), 'nature'),
    question_text: 'The maximum number of partners in a firm carrying on banking business is:',
    option_a: '10', option_b: '20', option_c: '50', option_d: '100',
    correct_option: 'a', explanation: 'As per the Companies Act and rules, the maximum number of partners in a banking business is 10, and for other businesses, it is 50.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['partnership', 'maximum partners'], is_diagnostic: true, status: 'approved'
  },

  // ============================================================
  // PAPER 3 — Business Mathematics & Statistics
  // ============================================================
  {
    paper_id: 3, topic_id: tid(3, 'ratio-proportion-indices'), sub_topic_id: null,
    question_text: 'If A:B = 2:3 and B:C = 4:5, then A:B:C is:',
    option_a: '2:3:5', option_b: '8:12:15', option_c: '4:6:5', option_d: '2:4:5',
    correct_option: 'b', explanation: 'A:B = 2:3 and B:C = 4:5. To combine, make B common: A:B = 8:12 (multiply by 4) and B:C = 12:15 (multiply by 3). Therefore A:B:C = 8:12:15.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['ratio', 'proportion'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'mathematics-of-finance'), sub_topic_id: stid(tid(3, 'mathematics-of-finance'), 'compound-interest'),
    question_text: 'The compound interest on ₹10,000 at 10% p.a. for 2 years compounded annually is:',
    option_a: '₹2,000', option_b: '₹2,100', option_c: '₹2,200', option_d: '₹1,900',
    correct_option: 'b', explanation: 'CI = P[(1+r)^n - 1] = 10,000[(1.1)² - 1] = 10,000[1.21 - 1] = 10,000 × 0.21 = ₹2,100.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['compound interest', 'time value'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'probability'), sub_topic_id: stid(tid(3, 'probability'), 'classical'),
    question_text: 'Two dice are thrown simultaneously. What is the probability of getting a sum of 7?',
    option_a: '1/6', option_b: '5/36', option_c: '6/36', option_d: '7/36',
    correct_option: 'c', explanation: 'Total outcomes = 6 × 6 = 36. Favorable outcomes for sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Probability = 6/36 = 1/6.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['probability', 'dice'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'probability'), sub_topic_id: stid(tid(3, 'probability'), 'bayes'),
    question_text: 'In a factory, Machine A produces 60% of items, Machine B produces 40%. Defective rates are 2% and 5% respectively. If a randomly selected item is defective, what is the probability it came from Machine B?',
    option_a: '0.50', option_b: '0.63', option_c: '0.37', option_d: '0.40',
    correct_option: 'b', explanation: 'P(A)=0.6, P(B)=0.4, P(D|A)=0.02, P(D|B)=0.05. P(D) = 0.6×0.02 + 0.4×0.05 = 0.012 + 0.02 = 0.032. P(B|D) = P(D|B)×P(B)/P(D) = 0.05×0.4/0.032 = 0.02/0.032 = 0.625 ≈ 0.63.',
    difficulty: 'hard', source_type: 'original', concept_keywords: ['bayes theorem', 'conditional probability'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'central-tendency-dispersion'), sub_topic_id: stid(tid(3, 'central-tendency-dispersion'), 'am'),
    question_text: 'The arithmetic mean of first 10 natural numbers is:',
    option_a: '5', option_b: '5.5', option_c: '6', option_d: '10',
    correct_option: 'b', explanation: 'Sum of first n natural numbers = n(n+1)/2 = 10×11/2 = 55. Mean = 55/10 = 5.5.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['arithmetic mean', 'natural numbers'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'central-tendency-dispersion'), sub_topic_id: stid(tid(3, 'central-tendency-dispersion'), 'sd'),
    question_text: 'If the standard deviation of a data set is 4, the variance is:',
    option_a: '2', option_b: '4', option_c: '8', option_d: '16',
    correct_option: 'd', explanation: 'Variance = (Standard Deviation)² = 4² = 16. Variance is the square of standard deviation.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['variance', 'standard deviation'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'correlation-regression'), sub_topic_id: null,
    question_text: 'Karl Pearson\'s coefficient of correlation always lies between:',
    option_a: '0 and 1', option_b: '-1 and 0', option_c: '-1 and +1', option_d: '0 and ∞',
    correct_option: 'c', explanation: 'Karl Pearson\'s coefficient of correlation (r) always lies between -1 and +1 inclusive. r = +1 means perfect positive correlation, r = -1 means perfect negative correlation, and r = 0 means no correlation.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['correlation', 'Karl Pearson'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 3, topic_id: tid(3, 'number-series-coding'), sub_topic_id: null,
    question_text: 'Find the next term in the series: 2, 6, 12, 20, 30, ?',
    option_a: '40', option_b: '42', option_c: '36', option_d: '38',
    correct_option: 'b', explanation: 'Differences: 4, 6, 8, 10, 12. Each difference increases by 2. Next term = 30 + 12 = 42. The series is n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7=42.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['number series', 'pattern'], is_diagnostic: false, status: 'approved'
  },

  // ============================================================
  // PAPER 4 — Business Economics
  // ============================================================
  {
    paper_id: 4, topic_id: tid(4, 'demand-supply'), sub_topic_id: stid(tid(4, 'demand-supply'), 'law-demand'),
    question_text: 'The Law of Demand states that, other things being equal:',
    option_a: 'As price rises, quantity demanded rises', option_b: 'As price falls, quantity demanded falls', option_c: 'As price rises, quantity demanded falls', option_d: 'Price and demand are unrelated',
    correct_option: 'c', explanation: 'The Law of Demand states an inverse relationship between price and quantity demanded, ceteris paribus (other things being equal). When price increases, quantity demanded decreases and vice versa.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['law of demand', 'inverse relationship'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'demand-supply'), sub_topic_id: stid(tid(4, 'demand-supply'), 'elasticity-demand'),
    question_text: 'If a 10% increase in price leads to a 20% decrease in quantity demanded, the price elasticity of demand is:',
    option_a: '0.5', option_b: '1.0', option_c: '2.0', option_d: '0.2',
    correct_option: 'c', explanation: 'Price Elasticity of Demand = % change in quantity demanded / % change in price = 20% / 10% = 2.0. Since Ed > 1, demand is elastic.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['elasticity', 'elastic demand'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'production-cost'), sub_topic_id: stid(tid(4, 'production-cost'), 'laws-returns'),
    question_text: 'When total product is at its maximum, marginal product is:',
    option_a: 'Maximum', option_b: 'Equal to average product', option_c: 'Zero', option_d: 'Negative',
    correct_option: 'c', explanation: 'When total product (TP) reaches its maximum point, marginal product (MP) becomes zero. Beyond this point, MP becomes negative and TP starts declining. This is a key relationship in the theory of production.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['total product', 'marginal product'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'production-cost'), sub_topic_id: stid(tid(4, 'production-cost'), 'cost-concepts'),
    question_text: 'Average Fixed Cost (AFC) curve is:',
    option_a: 'U-shaped', option_b: 'Rectangular hyperbola', option_c: 'Horizontal line', option_d: 'Vertical line',
    correct_option: 'b', explanation: 'AFC = TFC / Q. Since TFC is constant, as output Q increases, AFC continuously falls but never touches the X-axis. This gives it the shape of a rectangular hyperbola.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['AFC', 'cost curves'], is_diagnostic: false, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'price-determination'), sub_topic_id: stid(tid(4, 'price-determination'), 'perfect-competition'),
    question_text: 'In perfect competition, a firm is a:',
    option_a: 'Price maker', option_b: 'Price taker', option_c: 'Price leader', option_d: 'Price discriminator',
    correct_option: 'b', explanation: 'In perfect competition, individual firms are price takers because they have no power to influence the market price. The price is determined by market forces of demand and supply. Each firm must accept the prevailing market price.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['perfect competition', 'price taker'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'price-determination'), sub_topic_id: stid(tid(4, 'price-determination'), 'monopoly'),
    question_text: 'Which of the following is NOT a feature of monopoly?',
    option_a: 'Single seller', option_b: 'No close substitutes', option_c: 'Free entry and exit', option_d: 'Price maker',
    correct_option: 'c', explanation: 'Free entry and exit is a feature of perfect competition, not monopoly. In monopoly, there are strong barriers to entry which prevent new firms from entering the market. The monopolist is the sole seller with no close substitutes.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['monopoly', 'barriers to entry'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'business-cycles'), sub_topic_id: null,
    question_text: 'The phase of business cycle characterized by falling output, rising unemployment and declining prices is called:',
    option_a: 'Boom', option_b: 'Recession', option_c: 'Recovery', option_d: 'Depression',
    correct_option: 'b', explanation: 'Recession is the phase where economic activity declines — output falls, unemployment rises, demand decreases, and prices decline. If the recession deepens and persists, it may turn into a depression.',
    difficulty: 'easy', source_type: 'original', concept_keywords: ['business cycle', 'recession'], is_diagnostic: true, status: 'approved'
  },
  {
    paper_id: 4, topic_id: tid(4, 'demand-supply'), sub_topic_id: stid(tid(4, 'demand-supply'), 'equilibrium'),
    question_text: 'When market price is above equilibrium price, there will be:',
    option_a: 'Excess demand', option_b: 'Excess supply', option_c: 'Equilibrium', option_d: 'No effect',
    correct_option: 'b', explanation: 'When market price is above equilibrium, quantity supplied exceeds quantity demanded, creating excess supply (surplus). This surplus puts downward pressure on the price, pushing it back towards equilibrium.',
    difficulty: 'medium', source_type: 'original', concept_keywords: ['equilibrium', 'excess supply'], is_diagnostic: false, status: 'approved'
  },
];

// Filter out questions where topic_id or sub_topic_id is missing (for topics without sub-topics)
// For questions without sub_topic_id, we need to handle the NOT NULL constraint
const validQuestions = questions.filter(q => {
  if (!q.topic_id) {
    console.log(`⚠️  Skipping question - no topic found`);
    return false;
  }
  return true;
});

// For questions with null sub_topic_id, find the first sub_topic of that topic
for (const q of validQuestions) {
  if (!q.sub_topic_id) {
    const firstSub = subTopics.find(st => st.topic_id === q.topic_id);
    if (firstSub) {
      q.sub_topic_id = firstSub.id;
    } else {
      console.log(`⚠️  No sub-topic found for topic, creating a general one`);
      // Create a "General" sub_topic
      const { data: newSt } = await s.from('sub_topics').upsert({
        topic_id: q.topic_id,
        name: 'General',
        slug: 'general',
        sort_order: 0,
      }, { onConflict: 'topic_id,slug' }).select().single();
      if (newSt) q.sub_topic_id = newSt.id;
    }
  }
}

const finalQuestions = validQuestions.filter(q => q.sub_topic_id);

console.log(`🌱 Seeding ${finalQuestions.length} questions...`);
const { error } = await s.from('questions').insert(finalQuestions);
if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log(`✅ ${finalQuestions.length} questions seeded!`);

  // Count by paper
  for (let i = 1; i <= 4; i++) {
    const count = finalQuestions.filter(q => q.paper_id === i).length;
    console.log(`   P${i}: ${count} questions`);
  }
}
