import { createClient } from "@supabase/supabase-js";

export const superBase = createClient(
    'https://omrdhpdeljxaawmnnych.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcmRocGRlbGp4YWF3bW5ueWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjIyMDQsImV4cCI6MjA1MjY5ODIwNH0.uchrayXX6clXp8ACO4P-eF2HhCujU6vGtTDf05e5r1Q'
);