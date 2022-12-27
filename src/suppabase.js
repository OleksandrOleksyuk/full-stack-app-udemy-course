import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://wqsfcattlnfuvbpippfh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc2ZjYXR0bG5mdXZicGlwcGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE1MjY4MjMsImV4cCI6MTk4NzEwMjgyM30.FTPcP6uquKxWLdeRGFixv3JRJO3v0VhezWDeH0Jnnjg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
