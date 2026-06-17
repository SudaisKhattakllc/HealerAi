import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xrqpszhccwafmscantvk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
