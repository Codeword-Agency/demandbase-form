-- Make email field optional since the form doesn't collect email addresses
ALTER TABLE form_submissions 
ALTER COLUMN email DROP NOT NULL;
