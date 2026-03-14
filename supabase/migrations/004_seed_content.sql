-- ============================================================
-- Seed: CA Foundation Papers, Topics, Sub-topics
-- Run once to populate the content taxonomy
-- ============================================================

-- ============================================================
-- PAPERS
-- ============================================================
INSERT INTO papers (id, code, name, format, total_marks, duration_minutes, negative_marking, sort_order)
VALUES
  (1, 'P1', 'Principles & Practice of Accounting',                        'descriptive', 100, 180, 0.00, 1),
  (2, 'P2', 'Business Laws',                                               'objective',   100, 120, 0.25, 2),
  (3, 'P3', 'Business Mathematics, Logical Reasoning and Statistics',      'objective',   100, 120, 0.25, 3),
  (4, 'P4', 'Business Economics and Business & Commercial Knowledge',      'objective',   100, 120, 0.25, 4)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- PAPER 1 — Principles & Practice of Accounting
-- ============================================================
WITH p AS (SELECT id FROM papers WHERE code = 'P1')
INSERT INTO topics (paper_id, name, slug, exam_weightage, sort_order)
SELECT p.id, v.name, v.slug, v.weightage, v.sort_order
FROM p, (VALUES
  ('Theoretical Framework',                              'theoretical-framework',          5,  1),
  ('Accounting Process',                                 'accounting-process',             15, 2),
  ('Bank Reconciliation Statement',                      'bank-reconciliation-statement',  10, 3),
  ('Inventories',                                        'inventories',                    10, 4),
  ('Concept and Accounting of Depreciation',             'depreciation',                   10, 5),
  ('Accounting for Special Transactions',                'special-transactions',           10, 6),
  ('Final Accounts of Sole Proprietors',                 'final-accounts-sole',            15, 7),
  ('Partnership Accounts',                               'partnership-accounts',           15, 8),
  ('Company Accounts',                                   'company-accounts',               10, 9),
  ('Financial Statements of Not-for-Profit Organisations','not-for-profit-accounts',       10, 10),
  ('Basic Accounting Ratios',                            'accounting-ratios',               5, 11)
) AS v(name, slug, weightage, sort_order)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- Sub-topics for Theoretical Framework
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Meaning and Scope of Accounting',       'meaning-scope',            1),
  ('Accounting Concepts and Principles',    'concepts-principles',      2),
  ('Accounting Standards',                  'accounting-standards',     3),
  ('Ind AS Overview',                       'ind-as-overview',          4)
) AS v(name, slug, sort_order)
WHERE t.slug = 'theoretical-framework' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Accounting Process
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Journal Entries',             'journal-entries',    1),
  ('Ledger Posting',              'ledger-posting',     2),
  ('Trial Balance',               'trial-balance',      3),
  ('Subsidiary Books',            'subsidiary-books',   4),
  ('Cash Book',                   'cash-book',          5),
  ('Rectification of Errors',     'rectification',      6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'accounting-process' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Inventories
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('FIFO Method',             'fifo',         1),
  ('LIFO Method',             'lifo',         2),
  ('Weighted Average Method', 'weighted-avg', 3),
  ('NRV and Cost Comparison', 'nrv-cost',     4)
) AS v(name, slug, sort_order)
WHERE t.slug = 'inventories' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Depreciation
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Straight Line Method',          'slm',              1),
  ('Written Down Value Method',     'wdv',              2),
  ('Change in Method',              'change-method',    3),
  ('Disposal of Assets',            'disposal',         4)
) AS v(name, slug, sort_order)
WHERE t.slug = 'depreciation' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Special Transactions
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Bills of Exchange',               'bills-of-exchange',  1),
  ('Consignment Accounts',            'consignment',        2),
  ('Joint Ventures',                  'joint-ventures',     3),
  ('Sale or Return Basis',            'sale-or-return',     4),
  ('Average Due Date',                'average-due-date',   5),
  ('Account Current',                 'account-current',    6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'special-transactions' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Partnership Accounts
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Fundamentals of Partnership',   'fundamentals',       1),
  ('Goodwill Valuation',            'goodwill',           2),
  ('Admission of Partner',          'admission',          3),
  ('Retirement of Partner',         'retirement',         4),
  ('Death of Partner',              'death',              5),
  ('Dissolution of Firm',           'dissolution',        6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'partnership-accounts' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Company Accounts
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Issue of Shares',               'issue-shares',       1),
  ('Forfeiture and Reissue',        'forfeiture-reissue', 2),
  ('Issue of Debentures',           'issue-debentures',   3),
  ('Redemption of Debentures',      'redemption',         4)
) AS v(name, slug, sort_order)
WHERE t.slug = 'company-accounts' AND p.code = 'P1'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 2 — Business Laws
-- ============================================================
WITH p AS (SELECT id FROM papers WHERE code = 'P2')
INSERT INTO topics (paper_id, name, slug, exam_weightage, sort_order)
SELECT p.id, v.name, v.slug, v.weightage, v.sort_order
FROM p, (VALUES
  ('The Indian Contract Act, 1872',           'indian-contract-act',      30, 1),
  ('The Sale of Goods Act, 1930',             'sale-of-goods-act',        20, 2),
  ('The Indian Partnership Act, 1932',        'indian-partnership-act',   20, 3),
  ('The Limited Liability Partnership Act',   'llp-act',                  15, 4),
  ('The Companies Act, 2013',                 'companies-act',            15, 5)
) AS v(name, slug, weightage, sort_order)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- Sub-topics for Indian Contract Act
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Nature of Contract',            'nature-contract',      1),
  ('Offer and Acceptance',          'offer-acceptance',     2),
  ('Consideration',                 'consideration',        3),
  ('Capacity of Parties',           'capacity',             4),
  ('Free Consent',                  'free-consent',         5),
  ('Legality of Object',            'legality',             6),
  ('Performance of Contract',       'performance',          7),
  ('Discharge of Contract',         'discharge',            8),
  ('Breach and Remedies',           'breach-remedies',      9),
  ('Contingent Contracts',          'contingent',           10),
  ('Quasi Contracts',               'quasi-contracts',      11),
  ('Special Contracts',             'special-contracts',    12)
) AS v(name, slug, sort_order)
WHERE t.slug = 'indian-contract-act' AND p.code = 'P2'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Sale of Goods Act
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Formation of Contract of Sale',     'formation',            1),
  ('Conditions and Warranties',         'conditions-warranties', 2),
  ('Transfer of Property',              'transfer-property',    3),
  ('Performance of Contract',           'performance',          4),
  ('Unpaid Seller Rights',              'unpaid-seller',        5),
  ('Auction Sale',                      'auction',              6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'sale-of-goods-act' AND p.code = 'P2'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Indian Partnership Act
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Nature of Partnership',         'nature',           1),
  ('Rights and Duties of Partners', 'rights-duties',    2),
  ('Reconstitution of Firm',        'reconstitution',   3),
  ('Registration of Firm',          'registration',     4),
  ('Dissolution of Firm',           'dissolution',      5)
) AS v(name, slug, sort_order)
WHERE t.slug = 'indian-partnership-act' AND p.code = 'P2'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 3 — Business Mathematics, Logical Reasoning & Statistics
-- ============================================================
WITH p AS (SELECT id FROM papers WHERE code = 'P3')
INSERT INTO topics (paper_id, name, slug, exam_weightage, sort_order)
SELECT p.id, v.name, v.slug, v.weightage, v.sort_order
FROM p, (VALUES
  ('Ratio, Proportion, Indices & Logarithms',   'ratio-proportion-indices',    10, 1),
  ('Equations and Matrices',                     'equations-matrices',          10, 2),
  ('Linear Inequalities',                        'linear-inequalities',          5, 3),
  ('Mathematics of Finance',                     'mathematics-of-finance',      10, 4),
  ('Permutations and Combinations',              'permutations-combinations',    5, 5),
  ('Sequence and Series',                        'sequence-series',              5, 6),
  ('Sets, Relations and Functions',              'sets-relations-functions',     5, 7),
  ('Differential and Integral Calculus',         'calculus',                     5, 8),
  ('Number Series, Coding and Decoding',         'number-series-coding',         5, 9),
  ('Direction Tests',                            'direction-tests',              5, 10),
  ('Seating Arrangements',                       'seating-arrangements',         5, 11),
  ('Blood Relations and Syllogism',              'blood-relations-syllogism',    5, 12),
  ('Statistical Description of Data',            'statistical-description',      5, 13),
  ('Measures of Central Tendency and Dispersion','central-tendency-dispersion',  10, 14),
  ('Probability',                                'probability',                  10, 15),
  ('Theoretical Distributions',                  'theoretical-distributions',    5, 16),
  ('Correlation and Regression',                 'correlation-regression',       10, 17),
  ('Index Numbers and Time Series',              'index-numbers-time-series',    5, 18)
) AS v(name, slug, weightage, sort_order)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- Sub-topics for Mathematics of Finance
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Simple Interest',         'simple-interest',      1),
  ('Compound Interest',       'compound-interest',    2),
  ('Effective Rate',          'effective-rate',       3),
  ('Annuity',                 'annuity',              4),
  ('Present Value',           'present-value',        5),
  ('Sinking Fund',            'sinking-fund',         6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'mathematics-of-finance' AND p.code = 'P3'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Probability
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Classical Probability',         'classical',        1),
  ('Addition Theorem',              'addition',         2),
  ('Multiplication Theorem',        'multiplication',   3),
  ('Conditional Probability',       'conditional',      4),
  ('Bayes Theorem',                 'bayes',            5)
) AS v(name, slug, sort_order)
WHERE t.slug = 'probability' AND p.code = 'P3'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Central Tendency
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Arithmetic Mean',           'am',               1),
  ('Median and Mode',           'median-mode',      2),
  ('Geometric Mean',            'gm',               3),
  ('Harmonic Mean',             'hm',               4),
  ('Range and Quartile Dev.',   'range-qd',         5),
  ('Mean Deviation',            'mean-deviation',   6),
  ('Standard Deviation',        'sd',               7),
  ('Coefficient of Variation',  'cv',               8)
) AS v(name, slug, sort_order)
WHERE t.slug = 'central-tendency-dispersion' AND p.code = 'P3'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 4 — Business Economics & Business Commercial Knowledge
-- ============================================================
WITH p AS (SELECT id FROM papers WHERE code = 'P4')
INSERT INTO topics (paper_id, name, slug, exam_weightage, sort_order)
SELECT p.id, v.name, v.slug, v.weightage, v.sort_order
FROM p, (VALUES
  ('Introduction to Business Economics',        'intro-business-economics',   10, 1),
  ('Theory of Demand and Supply',               'demand-supply',              20, 2),
  ('Theory of Production and Cost',             'production-cost',            20, 3),
  ('Price Determination in Different Markets',  'price-determination',        20, 4),
  ('Business Cycles',                           'business-cycles',            10, 5),
  ('Business and Commercial Knowledge',         'commercial-knowledge',       10, 6),
  ('Business Environment',                      'business-environment',        5, 7),
  ('Business Organisations',                    'business-organisations',      5, 8),
  ('Government Policies for Business Growth',   'govt-policies',               5, 9),
  ('Organisations Facilitating Business',       'facilitating-orgs',           5, 10)
) AS v(name, slug, weightage, sort_order)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- Sub-topics for Demand and Supply
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Law of Demand',                   'law-demand',           1),
  ('Elasticity of Demand',            'elasticity-demand',    2),
  ('Law of Supply',                   'law-supply',           3),
  ('Elasticity of Supply',            'elasticity-supply',    4),
  ('Market Equilibrium',              'equilibrium',          5),
  ('Consumer Surplus',                'consumer-surplus',     6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'demand-supply' AND p.code = 'P4'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Production and Cost
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Production Function',           'production-function',  1),
  ('Laws of Returns',               'laws-returns',         2),
  ('Returns to Scale',              'returns-scale',        3),
  ('Cost Concepts',                 'cost-concepts',        4),
  ('Short Run Cost Curves',         'short-run-cost',       5),
  ('Long Run Cost Curves',          'long-run-cost',        6)
) AS v(name, slug, sort_order)
WHERE t.slug = 'production-cost' AND p.code = 'P4'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sub-topics for Price Determination
INSERT INTO sub_topics (topic_id, name, slug, sort_order)
SELECT t.id, v.name, v.slug, v.sort_order
FROM topics t
JOIN papers p ON p.id = t.paper_id
, (VALUES
  ('Perfect Competition',       'perfect-competition',  1),
  ('Monopoly',                  'monopoly',             2),
  ('Monopolistic Competition',  'monopolistic',         3),
  ('Oligopoly',                 'oligopoly',            4)
) AS v(name, slug, sort_order)
WHERE t.slug = 'price-determination' AND p.code = 'P4'
ON CONFLICT (topic_id, slug) DO NOTHING;
