export const SCAN_TABS = [
  { id: 'fake-news', label: 'Fake News', icon: '📰' },
  { id: 'scam-message', label: 'Scam Message', icon: '💬' },
  { id: 'phishing-link', label: 'Phishing Link', icon: '🔗' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'screenshot', label: 'Screenshot', icon: '🖼️' },
] as const;

export const SAMPLE_CONTENT: Record<string, string> = {
  'fake-news': 'Breaking: The government is secretly issuing free crypto credits to every citizen this week. Officials deny the claim, but the headline has already gone viral across private groups and urgent repost chains.',
  'scam-message': 'Urgent! Your account will be suspended in 5 minutes unless you verify your banking credentials immediately. Click the secure link below to avoid permanent restrictions.',
  'phishing-link': 'https://secure-login-verify.example.com/account/confirm?token=ab12cd34',
  'email': 'Subject: Immediate Action Required\n\nHello, this is your bank. We detected unusual activity and need you to confirm your password via the attached secure portal. Please ignore any previous messages and trust this one.',
  'screenshot': 'Screenshot shows a browser popup urging immediate account action and threatening access loss. The popup uses urgency, brand mimicry, and a fake verification button.',
};

export const FEATURES = [
  'Real-time risk scoring with explainable evidence',
  'Multi-format analysis for text, links, email, and screenshots',
  'Local history and trend tracking for every scan',
  'Premium dark-first experience optimized for focus',
];

export const STATS = [
  { label: 'Detections', value: '98.7%', icon: '🛡️' },
  { label: 'Faster Review', value: '4.2x', icon: '⚡' },
  { label: 'Saved Cases', value: '12K+', icon: '📁' },
];

export const FAQ_ITEMS = [
  {
    question: 'Is this a real backend service?',
    answer: 'This demo is a polished frontend experience with working interactions, persistence, and rich animations. It is designed to feel like a live SaaS product today.',
  },
  {
    question: 'What data is stored?',
    answer: 'Only your scan history and theme preference are saved locally in the browser using LocalStorage.',
  },
  {
    question: 'Can I analyze screenshots?',
    answer: 'Yes. Upload a screenshot or drag one into the scanner, and the interface will preview it while keeping the workflow immersive.',
  },
];
