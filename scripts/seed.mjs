import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  // service_role key — bypasses RLS
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('🌱 Seeding papers...');

  // Papers
  const { error: papersErr } = await supabase.from('papers').upsert([
    { id: 1, code: 'P1', name: 'Principles & Practice of Accounting', format: 'descriptive', total_marks: 100, duration_minutes: 180, negative_marking: 0, sort_order: 1 },
    { id: 2, code: 'P2', name: 'Business Laws', format: 'objective', total_marks: 100, duration_minutes: 120, negative_marking: 0.25, sort_order: 2 },
    { id: 3, code: 'P3', name: 'Business Mathematics, Logical Reasoning and Statistics', format: 'objective', total_marks: 100, duration_minutes: 120, negative_marking: 0.25, sort_order: 3 },
    { id: 4, code: 'P4', name: 'Business Economics and Business & Commercial Knowledge', format: 'objective', total_marks: 100, duration_minutes: 120, negative_marking: 0.25, sort_order: 4 },
  ], { onConflict: 'code' });

  if (papersErr) { console.error('Papers error:', papersErr); return; }
  console.log('✅ Papers done');

  // ---- Topics ----
  const topicsData = [
    // P1 Topics
    { paper_id: 1, name: 'Theoretical Framework', slug: 'theoretical-framework', exam_weightage: 5, sort_order: 1 },
    { paper_id: 1, name: 'Accounting Process', slug: 'accounting-process', exam_weightage: 15, sort_order: 2 },
    { paper_id: 1, name: 'Bank Reconciliation Statement', slug: 'bank-reconciliation-statement', exam_weightage: 10, sort_order: 3 },
    { paper_id: 1, name: 'Inventories', slug: 'inventories', exam_weightage: 10, sort_order: 4 },
    { paper_id: 1, name: 'Concept and Accounting of Depreciation', slug: 'depreciation', exam_weightage: 10, sort_order: 5 },
    { paper_id: 1, name: 'Accounting for Special Transactions', slug: 'special-transactions', exam_weightage: 10, sort_order: 6 },
    { paper_id: 1, name: 'Final Accounts of Sole Proprietors', slug: 'final-accounts-sole', exam_weightage: 15, sort_order: 7 },
    { paper_id: 1, name: 'Partnership Accounts', slug: 'partnership-accounts', exam_weightage: 15, sort_order: 8 },
    { paper_id: 1, name: 'Company Accounts', slug: 'company-accounts', exam_weightage: 10, sort_order: 9 },
    { paper_id: 1, name: 'Financial Statements of Not-for-Profit Organisations', slug: 'not-for-profit-accounts', exam_weightage: 10, sort_order: 10 },
    { paper_id: 1, name: 'Basic Accounting Ratios', slug: 'accounting-ratios', exam_weightage: 5, sort_order: 11 },
    // P2 Topics
    { paper_id: 2, name: 'The Indian Contract Act, 1872', slug: 'indian-contract-act', exam_weightage: 30, sort_order: 1 },
    { paper_id: 2, name: 'The Sale of Goods Act, 1930', slug: 'sale-of-goods-act', exam_weightage: 20, sort_order: 2 },
    { paper_id: 2, name: 'The Indian Partnership Act, 1932', slug: 'indian-partnership-act', exam_weightage: 20, sort_order: 3 },
    { paper_id: 2, name: 'The Limited Liability Partnership Act', slug: 'llp-act', exam_weightage: 15, sort_order: 4 },
    { paper_id: 2, name: 'The Companies Act, 2013', slug: 'companies-act', exam_weightage: 15, sort_order: 5 },
    // P3 Topics
    { paper_id: 3, name: 'Ratio, Proportion, Indices & Logarithms', slug: 'ratio-proportion-indices', exam_weightage: 10, sort_order: 1 },
    { paper_id: 3, name: 'Equations and Matrices', slug: 'equations-matrices', exam_weightage: 10, sort_order: 2 },
    { paper_id: 3, name: 'Linear Inequalities', slug: 'linear-inequalities', exam_weightage: 5, sort_order: 3 },
    { paper_id: 3, name: 'Mathematics of Finance', slug: 'mathematics-of-finance', exam_weightage: 10, sort_order: 4 },
    { paper_id: 3, name: 'Permutations and Combinations', slug: 'permutations-combinations', exam_weightage: 5, sort_order: 5 },
    { paper_id: 3, name: 'Sequence and Series', slug: 'sequence-series', exam_weightage: 5, sort_order: 6 },
    { paper_id: 3, name: 'Sets, Relations and Functions', slug: 'sets-relations-functions', exam_weightage: 5, sort_order: 7 },
    { paper_id: 3, name: 'Differential and Integral Calculus', slug: 'calculus', exam_weightage: 5, sort_order: 8 },
    { paper_id: 3, name: 'Number Series, Coding and Decoding', slug: 'number-series-coding', exam_weightage: 5, sort_order: 9 },
    { paper_id: 3, name: 'Direction Tests', slug: 'direction-tests', exam_weightage: 5, sort_order: 10 },
    { paper_id: 3, name: 'Seating Arrangements', slug: 'seating-arrangements', exam_weightage: 5, sort_order: 11 },
    { paper_id: 3, name: 'Blood Relations and Syllogism', slug: 'blood-relations-syllogism', exam_weightage: 5, sort_order: 12 },
    { paper_id: 3, name: 'Statistical Description of Data', slug: 'statistical-description', exam_weightage: 5, sort_order: 13 },
    { paper_id: 3, name: 'Measures of Central Tendency and Dispersion', slug: 'central-tendency-dispersion', exam_weightage: 10, sort_order: 14 },
    { paper_id: 3, name: 'Probability', slug: 'probability', exam_weightage: 10, sort_order: 15 },
    { paper_id: 3, name: 'Theoretical Distributions', slug: 'theoretical-distributions', exam_weightage: 5, sort_order: 16 },
    { paper_id: 3, name: 'Correlation and Regression', slug: 'correlation-regression', exam_weightage: 10, sort_order: 17 },
    { paper_id: 3, name: 'Index Numbers and Time Series', slug: 'index-numbers-time-series', exam_weightage: 5, sort_order: 18 },
    // P4 Topics
    { paper_id: 4, name: 'Introduction to Business Economics', slug: 'intro-business-economics', exam_weightage: 10, sort_order: 1 },
    { paper_id: 4, name: 'Theory of Demand and Supply', slug: 'demand-supply', exam_weightage: 20, sort_order: 2 },
    { paper_id: 4, name: 'Theory of Production and Cost', slug: 'production-cost', exam_weightage: 20, sort_order: 3 },
    { paper_id: 4, name: 'Price Determination in Different Markets', slug: 'price-determination', exam_weightage: 20, sort_order: 4 },
    { paper_id: 4, name: 'Business Cycles', slug: 'business-cycles', exam_weightage: 10, sort_order: 5 },
    { paper_id: 4, name: 'Business and Commercial Knowledge', slug: 'commercial-knowledge', exam_weightage: 10, sort_order: 6 },
    { paper_id: 4, name: 'Business Environment', slug: 'business-environment', exam_weightage: 5, sort_order: 7 },
    { paper_id: 4, name: 'Business Organisations', slug: 'business-organisations', exam_weightage: 5, sort_order: 8 },
    { paper_id: 4, name: 'Government Policies for Business Growth', slug: 'govt-policies', exam_weightage: 5, sort_order: 9 },
    { paper_id: 4, name: 'Organisations Facilitating Business', slug: 'facilitating-orgs', exam_weightage: 5, sort_order: 10 },
  ];

  console.log('🌱 Seeding topics...');
  const { error: topicsErr } = await supabase.from('topics').upsert(topicsData, { onConflict: 'paper_id,slug' });
  if (topicsErr) { console.error('Topics error:', topicsErr); return; }
  console.log('✅ Topics done');

  // Fetch topic IDs for sub-topic inserts
  const { data: topics } = await supabase.from('topics').select('id, slug, paper_id');
  const topicMap = {};
  topics.forEach(t => { topicMap[`${t.paper_id}:${t.slug}`] = t.id; });

  const tid = (paperId, slug) => topicMap[`${paperId}:${slug}`];

  // ---- Sub-topics ----
  const subTopicsData = [
    // P1: Theoretical Framework
    { topic_id: tid(1, 'theoretical-framework'), name: 'Meaning and Scope of Accounting', slug: 'meaning-scope', sort_order: 1 },
    { topic_id: tid(1, 'theoretical-framework'), name: 'Accounting Concepts and Principles', slug: 'concepts-principles', sort_order: 2 },
    { topic_id: tid(1, 'theoretical-framework'), name: 'Accounting Standards', slug: 'accounting-standards', sort_order: 3 },
    { topic_id: tid(1, 'theoretical-framework'), name: 'Ind AS Overview', slug: 'ind-as-overview', sort_order: 4 },
    // P1: Accounting Process
    { topic_id: tid(1, 'accounting-process'), name: 'Journal Entries', slug: 'journal-entries', sort_order: 1 },
    { topic_id: tid(1, 'accounting-process'), name: 'Ledger Posting', slug: 'ledger-posting', sort_order: 2 },
    { topic_id: tid(1, 'accounting-process'), name: 'Trial Balance', slug: 'trial-balance', sort_order: 3 },
    { topic_id: tid(1, 'accounting-process'), name: 'Subsidiary Books', slug: 'subsidiary-books', sort_order: 4 },
    { topic_id: tid(1, 'accounting-process'), name: 'Cash Book', slug: 'cash-book', sort_order: 5 },
    { topic_id: tid(1, 'accounting-process'), name: 'Rectification of Errors', slug: 'rectification', sort_order: 6 },
    // P1: Inventories
    { topic_id: tid(1, 'inventories'), name: 'FIFO Method', slug: 'fifo', sort_order: 1 },
    { topic_id: tid(1, 'inventories'), name: 'LIFO Method', slug: 'lifo', sort_order: 2 },
    { topic_id: tid(1, 'inventories'), name: 'Weighted Average Method', slug: 'weighted-avg', sort_order: 3 },
    { topic_id: tid(1, 'inventories'), name: 'NRV and Cost Comparison', slug: 'nrv-cost', sort_order: 4 },
    // P1: Depreciation
    { topic_id: tid(1, 'depreciation'), name: 'Straight Line Method', slug: 'slm', sort_order: 1 },
    { topic_id: tid(1, 'depreciation'), name: 'Written Down Value Method', slug: 'wdv', sort_order: 2 },
    { topic_id: tid(1, 'depreciation'), name: 'Change in Method', slug: 'change-method', sort_order: 3 },
    { topic_id: tid(1, 'depreciation'), name: 'Disposal of Assets', slug: 'disposal', sort_order: 4 },
    // P1: Special Transactions
    { topic_id: tid(1, 'special-transactions'), name: 'Bills of Exchange', slug: 'bills-of-exchange', sort_order: 1 },
    { topic_id: tid(1, 'special-transactions'), name: 'Consignment Accounts', slug: 'consignment', sort_order: 2 },
    { topic_id: tid(1, 'special-transactions'), name: 'Joint Ventures', slug: 'joint-ventures', sort_order: 3 },
    { topic_id: tid(1, 'special-transactions'), name: 'Sale or Return Basis', slug: 'sale-or-return', sort_order: 4 },
    { topic_id: tid(1, 'special-transactions'), name: 'Average Due Date', slug: 'average-due-date', sort_order: 5 },
    { topic_id: tid(1, 'special-transactions'), name: 'Account Current', slug: 'account-current', sort_order: 6 },
    // P1: Partnership Accounts
    { topic_id: tid(1, 'partnership-accounts'), name: 'Fundamentals of Partnership', slug: 'fundamentals', sort_order: 1 },
    { topic_id: tid(1, 'partnership-accounts'), name: 'Goodwill Valuation', slug: 'goodwill', sort_order: 2 },
    { topic_id: tid(1, 'partnership-accounts'), name: 'Admission of Partner', slug: 'admission', sort_order: 3 },
    { topic_id: tid(1, 'partnership-accounts'), name: 'Retirement of Partner', slug: 'retirement', sort_order: 4 },
    { topic_id: tid(1, 'partnership-accounts'), name: 'Death of Partner', slug: 'death', sort_order: 5 },
    { topic_id: tid(1, 'partnership-accounts'), name: 'Dissolution of Firm', slug: 'dissolution', sort_order: 6 },
    // P1: Company Accounts
    { topic_id: tid(1, 'company-accounts'), name: 'Issue of Shares', slug: 'issue-shares', sort_order: 1 },
    { topic_id: tid(1, 'company-accounts'), name: 'Forfeiture and Reissue', slug: 'forfeiture-reissue', sort_order: 2 },
    { topic_id: tid(1, 'company-accounts'), name: 'Issue of Debentures', slug: 'issue-debentures', sort_order: 3 },
    { topic_id: tid(1, 'company-accounts'), name: 'Redemption of Debentures', slug: 'redemption', sort_order: 4 },
    // P2: Indian Contract Act
    { topic_id: tid(2, 'indian-contract-act'), name: 'Nature of Contract', slug: 'nature-contract', sort_order: 1 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Offer and Acceptance', slug: 'offer-acceptance', sort_order: 2 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Consideration', slug: 'consideration', sort_order: 3 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Capacity of Parties', slug: 'capacity', sort_order: 4 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Free Consent', slug: 'free-consent', sort_order: 5 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Legality of Object', slug: 'legality', sort_order: 6 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Performance of Contract', slug: 'performance', sort_order: 7 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Discharge of Contract', slug: 'discharge', sort_order: 8 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Breach and Remedies', slug: 'breach-remedies', sort_order: 9 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Contingent Contracts', slug: 'contingent', sort_order: 10 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Quasi Contracts', slug: 'quasi-contracts', sort_order: 11 },
    { topic_id: tid(2, 'indian-contract-act'), name: 'Special Contracts', slug: 'special-contracts', sort_order: 12 },
    // P2: Sale of Goods Act
    { topic_id: tid(2, 'sale-of-goods-act'), name: 'Formation of Contract of Sale', slug: 'formation', sort_order: 1 },
    { topic_id: tid(2, 'sale-of-goods-act'), name: 'Conditions and Warranties', slug: 'conditions-warranties', sort_order: 2 },
    { topic_id: tid(2, 'sale-of-goods-act'), name: 'Transfer of Property', slug: 'transfer-property', sort_order: 3 },
    { topic_id: tid(2, 'sale-of-goods-act'), name: 'Performance of Contract', slug: 'performance', sort_order: 4 },
    { topic_id: tid(2, 'sale-of-goods-act'), name: 'Unpaid Seller Rights', slug: 'unpaid-seller', sort_order: 5 },
    { topic_id: tid(2, 'sale-of-goods-act'), name: 'Auction Sale', slug: 'auction', sort_order: 6 },
    // P2: Indian Partnership Act
    { topic_id: tid(2, 'indian-partnership-act'), name: 'Nature of Partnership', slug: 'nature', sort_order: 1 },
    { topic_id: tid(2, 'indian-partnership-act'), name: 'Rights and Duties of Partners', slug: 'rights-duties', sort_order: 2 },
    { topic_id: tid(2, 'indian-partnership-act'), name: 'Reconstitution of Firm', slug: 'reconstitution', sort_order: 3 },
    { topic_id: tid(2, 'indian-partnership-act'), name: 'Registration of Firm', slug: 'registration', sort_order: 4 },
    { topic_id: tid(2, 'indian-partnership-act'), name: 'Dissolution of Firm', slug: 'dissolution', sort_order: 5 },
    // P3: Mathematics of Finance
    { topic_id: tid(3, 'mathematics-of-finance'), name: 'Simple Interest', slug: 'simple-interest', sort_order: 1 },
    { topic_id: tid(3, 'mathematics-of-finance'), name: 'Compound Interest', slug: 'compound-interest', sort_order: 2 },
    { topic_id: tid(3, 'mathematics-of-finance'), name: 'Effective Rate', slug: 'effective-rate', sort_order: 3 },
    { topic_id: tid(3, 'mathematics-of-finance'), name: 'Annuity', slug: 'annuity', sort_order: 4 },
    { topic_id: tid(3, 'mathematics-of-finance'), name: 'Present Value', slug: 'present-value', sort_order: 5 },
    { topic_id: tid(3, 'mathematics-of-finance'), name: 'Sinking Fund', slug: 'sinking-fund', sort_order: 6 },
    // P3: Probability
    { topic_id: tid(3, 'probability'), name: 'Classical Probability', slug: 'classical', sort_order: 1 },
    { topic_id: tid(3, 'probability'), name: 'Addition Theorem', slug: 'addition', sort_order: 2 },
    { topic_id: tid(3, 'probability'), name: 'Multiplication Theorem', slug: 'multiplication', sort_order: 3 },
    { topic_id: tid(3, 'probability'), name: 'Conditional Probability', slug: 'conditional', sort_order: 4 },
    { topic_id: tid(3, 'probability'), name: 'Bayes Theorem', slug: 'bayes', sort_order: 5 },
    // P3: Central Tendency
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Arithmetic Mean', slug: 'am', sort_order: 1 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Median and Mode', slug: 'median-mode', sort_order: 2 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Geometric Mean', slug: 'gm', sort_order: 3 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Harmonic Mean', slug: 'hm', sort_order: 4 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Range and Quartile Deviation', slug: 'range-qd', sort_order: 5 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Mean Deviation', slug: 'mean-deviation', sort_order: 6 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Standard Deviation', slug: 'sd', sort_order: 7 },
    { topic_id: tid(3, 'central-tendency-dispersion'), name: 'Coefficient of Variation', slug: 'cv', sort_order: 8 },
    // P4: Demand and Supply
    { topic_id: tid(4, 'demand-supply'), name: 'Law of Demand', slug: 'law-demand', sort_order: 1 },
    { topic_id: tid(4, 'demand-supply'), name: 'Elasticity of Demand', slug: 'elasticity-demand', sort_order: 2 },
    { topic_id: tid(4, 'demand-supply'), name: 'Law of Supply', slug: 'law-supply', sort_order: 3 },
    { topic_id: tid(4, 'demand-supply'), name: 'Elasticity of Supply', slug: 'elasticity-supply', sort_order: 4 },
    { topic_id: tid(4, 'demand-supply'), name: 'Market Equilibrium', slug: 'equilibrium', sort_order: 5 },
    { topic_id: tid(4, 'demand-supply'), name: 'Consumer Surplus', slug: 'consumer-surplus', sort_order: 6 },
    // P4: Production and Cost
    { topic_id: tid(4, 'production-cost'), name: 'Production Function', slug: 'production-function', sort_order: 1 },
    { topic_id: tid(4, 'production-cost'), name: 'Laws of Returns', slug: 'laws-returns', sort_order: 2 },
    { topic_id: tid(4, 'production-cost'), name: 'Returns to Scale', slug: 'returns-scale', sort_order: 3 },
    { topic_id: tid(4, 'production-cost'), name: 'Cost Concepts', slug: 'cost-concepts', sort_order: 4 },
    { topic_id: tid(4, 'production-cost'), name: 'Short Run Cost Curves', slug: 'short-run-cost', sort_order: 5 },
    { topic_id: tid(4, 'production-cost'), name: 'Long Run Cost Curves', slug: 'long-run-cost', sort_order: 6 },
    // P4: Price Determination
    { topic_id: tid(4, 'price-determination'), name: 'Perfect Competition', slug: 'perfect-competition', sort_order: 1 },
    { topic_id: tid(4, 'price-determination'), name: 'Monopoly', slug: 'monopoly', sort_order: 2 },
    { topic_id: tid(4, 'price-determination'), name: 'Monopolistic Competition', slug: 'monopolistic', sort_order: 3 },
    { topic_id: tid(4, 'price-determination'), name: 'Oligopoly', slug: 'oligopoly', sort_order: 4 },
  ];

  console.log('🌱 Seeding sub-topics...');
  const { error: subErr } = await supabase.from('sub_topics').upsert(subTopicsData, { onConflict: 'topic_id,slug' });
  if (subErr) { console.error('Sub-topics error:', subErr); return; }
  console.log('✅ Sub-topics done');

  // Verify
  const { data: pCount } = await supabase.from('papers').select('id', { count: 'exact', head: true });
  const { data: tCount } = await supabase.from('topics').select('id', { count: 'exact', head: true });
  const { data: sCount } = await supabase.from('sub_topics').select('id', { count: 'exact', head: true });
  console.log(`\n📊 Counts: papers=4, topics=${tCount?.length ?? '?'}, sub_topics=${sCount?.length ?? '?'}`);
  console.log('🎉 Seed complete!');
}

seed().catch(console.error);
