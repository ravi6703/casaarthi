import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtamJhcndsenhhbG56am9lb3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDc1ODYsImV4cCI6MjA4OTA4MzU4Nn0.q2XTpXNnt4BczypW-OxSv7ppSkLVkuQ1dqYxF-wHbfk'
);

const testEmail = 'testuser_' + Date.now() + '@gmail.com';

// 1. Test signup
console.log('=== Test 1: Signup with password ===');
const { data: signupData, error: signupErr } = await supabase.auth.signUp({
  email: testEmail,
  password: 'TestPass123!',
  options: { data: { full_name: 'Test User' } },
});
console.log('Session:', signupData?.session ? 'YES' : 'NO');
console.log('User:', signupData?.user ? 'YES' : 'NO');
console.log('Error:', signupErr?.message || 'none');
console.log('Email confirmed:', signupData?.user?.email_confirmed_at ? 'yes' : 'no');

// 2. Test login
console.log('\n=== Test 2: Login with password ===');
const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
  email: testEmail,
  password: 'TestPass123!',
});
console.log('Session:', loginData?.session ? 'YES' : 'NO');
console.log('Error:', loginErr?.message || 'none');

// 3. Test OTP
console.log('\n=== Test 3: Send OTP to existing user ===');
const { error: otpErr } = await supabase.auth.signInWithOtp({
  email: testEmail,
  options: { shouldCreateUser: false },
});
console.log('OTP Error:', otpErr?.message || 'none (sent successfully)');

// 4. Test Google OAuth URL
console.log('\n=== Test 4: Google OAuth URL ===');
const { data: oauthData, error: oauthErr } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: 'http://localhost:3000/api/auth/callback' },
});
console.log('OAuth URL generated:', oauthData?.url ? 'YES' : 'NO');
console.log('OAuth Error:', oauthErr?.message || 'none');

console.log('\n✅ Auth tests complete');
